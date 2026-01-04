// ==UserScript==
// @name        Restore animated thumbnail previews - youtube.com
// @namespace   Violentmonkey Scripts seekhare
// @match       *://www.youtube.com/*
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     5.9
// @license     MIT
// @author      seekhare
// @description To restore animated thumbnail previews. Requires inline video previews to be disabled in your YouTube user settings (Go to https://www.youtube.com/account_playback and set "video previews" to disabled). Not Greasemonkey compatible. v5 Add new method for getting an_webp GIF-style thumbs when not available in YT's new homepage UI or subscription page UI.
// @downloadURL https://update.greasyfork.org/scripts/482233/Restore%20animated%20thumbnail%20previews%20-%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/482233/Restore%20animated%20thumbnail%20previews%20-%20youtubecom.meta.js
// ==/UserScript==
const logHeader = 'UserScript Restore YT Animated Thumbs:';
console.log(logHeader, "enabled.")

// For pages where YT still provides an_webp URLs (watch; search results; old UI subscriptions and home pages) these below properties are required to force enable existing YT code to show an_webp on tile mouseover.
Object.defineProperties(Object.prototype,{isPreviewDisabled:{get:function(){return false}, set:function(){}}}); // original method
Object.defineProperties(Object.prototype,{animatedThumbnailEnabled:{get:function(){return true}, set:function(){}}});
Object.defineProperties(Object.prototype,{inlinePreviewEnabled:{get:function(){return false}, set:function(){}}});

const fadeInCSS = `img.animatedThumbTarget { animation: fadeIn 0.5s; object-fit: cover;}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;
GM_addStyle(fadeInCSS);

const homeUrl = 'https://www.youtube.com/';
const searchUrl = 'https://www.youtube.com/results?search_query='; // use like "https://www.youtube.com/results?search_query=IDabc123", for anonymous requests is rate limited
const ytImageRootUrl = 'https://i.ytimg.com/';
const ytImageNames = ['hq1.jpg', 'hq2.jpg', 'hq3.jpg']; // e.g. https://i.ytimg.com/vi/IDabc123/hq1.jpg
const carouselDelay = 500; //milliseconds, how long to display each image. 
var an_webpUrlDictionary = {}; //store prefetched an_webp urls for videoIDs in homepage/subscription page of new YT lockup style UI.
var an_webpUrlDictionaryFailedCount = {}; //store failed fetch attempt count to give up after certain number.
const updateDictionaryBatchSize = 10; //number of videos per single an_webp search request
const updateDictionaryFailedCountLimit = 6; //number of times to include a video in a search request before giving up.
const an_webpDictionaryWorkerInterval = 3500; //milliseconds
const an_webpUrlExpiryAge = 10800000; // 3 hours in ms, testing shows most urls valid for ~6 hours but seen some less than 4 hours validity so back to cache for 3 hours.

if (storageAvailable("localStorage")) {
  var storedDictionary = localStorage.getItem("an_webpUrlDictionary");
  if (storedDictionary != null) {
    an_webpUrlDictionary = JSON.parse(storedDictionary);
    cleanUpOldAnwebpUrls(an_webpUrlDictionary);
  }
}
document.addEventListener("DOMContentLoaded", function(){
    setupMutationObserver()
    const an_webpDictionaryWorker = setInterval(updateDictionary, an_webpDictionaryWorkerInterval);
});

function elTargetIsExcludedCheck(target) {
    // Below are some exceptions where we don't want to apply the an_webp search/carousel fallback and can't except these in the mutation observer as child elements are not present then.
    // Don't remove the event listeners as if navigate to a watch page then back a new video could get the existing element and need the event listener kept applied.
    if (target.querySelector('yt-lockup-view-model') == null ) { // only apply to new grid tiles UI
        return true
    }
    if (target.querySelector('badge-shape.badge-shape-wiz--thumbnail-live, badge-shape.yt-badge-shape--thumbnail-live') != null) { // don't apply to video tiles that are live.
        return true
    } else if (target.querySelector('button[title="You\'ll be notified at the scheduled start time."]') != null) { // don't apply to video tiles that upcoming notifications.
        return true
    }
    return false
}
async function animatedThumbsEventEnter(event) {
    //console.debug(logHeader, 'enter', event);
    var target = event.target;
    if (elTargetIsExcludedCheck(target)) { // check exceptions
        return false
    }
    //Overlay target to attach created image node should be present
    var overlaytag = target.querySelector('div.yt-thumbnail-view-model__image, div.ytThumbnailViewModelImage');
    if (overlaytag == null) {
        return false
    }

    var atag = target.querySelector('a');
    elGetVideoIdFromHref(atag);
    if (atag.animatedThumbType === undefined || atag.animatedThumbType == 'carousel') {
        //check if an_webp URL available and if so use it or else use carousel fallback.
        var thumbUrl = getAnimatedThumbURLDictionary(atag.videoId);
        if (thumbUrl != null) {
            atag.animatedThumbType = 'an_webp';
            atag.srcAnimated = thumbUrl;
        } else {
            atag.animatedThumbType = 'carousel';
        }
    }
    var animatedImgNode = document.createElement("img");
    animatedImgNode.videoId = atag.videoId;
    animatedImgNode.setAttribute("id", "thumbnail");
    //animatedImgNode.setAttribute("onload", "if (this.naturalHeight == 90) {clearInterval(this.timer); this.remove()};"); //when img 404s it still has an image in content so doesn't trigger onerror but triggers onload, therefore check the naturalHeight is ==90 as desired images are bigger, only 404 is 90.
    animatedImgNode.setAttribute("class", "style-scope ytd-moving-thumbnail-renderer fade-in animatedThumbTarget cbCustomThumbnailCanvas"); //animatedThumbTarget is custom class, cbCustomThumbnailCanvas is for DeArrow extension compatibility, others are Youtube
    if (atag.animatedThumbType == 'an_webp') {
        animatedImgNode.setAttribute("src", atag.srcAnimated);
    } else if (atag.animatedThumbType == 'carousel') {
        animatedImgNode.carouselIndex = 0;
        updateCarousel(animatedImgNode);
        animatedImgNode.timer = setInterval(updateCarousel, carouselDelay, animatedImgNode);
    }
    overlaytag.appendChild(animatedImgNode);
    return true
}
async function animatedThumbsEventLeave(event) {
    //console.debug(logHeader, 'leave', event);
    try {
        var animatedImgNodeList = event.target.querySelectorAll('img.animatedThumbTarget');
        for (let animatedImgNode of animatedImgNodeList) {
            clearInterval(animatedImgNode.timer);
            animatedImgNode.remove();
        }
    } catch {
        return false
    }
    return true
}
function updateCarousel(carouselImgNode) {
    var index = carouselImgNode.carouselIndex;
    //console.debug(logHeader, 'index', index);
    var imgURL = ytImageRootUrl + 'vi/' + carouselImgNode.videoId + '/' + ytImageNames[index];
    carouselImgNode.setAttribute("src", imgURL);
    var nextIndex = (index+1) % ytImageNames.length;
    carouselImgNode.carouselIndex = nextIndex;
}
function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            anonymous: true, // make request anonymous, without cookies so doesn't affect user's search history.
            onload: response => resolve(response),
            onerror: error => reject(error)
        });
    });
}
function getAnimatedThumbURLDictionary(videoId) {
    if (an_webpUrlDictionary[videoId] != undefined) {
        return an_webpUrlDictionary[videoId]['url']
    } else {
        return null
    }
    
}
function elGetVideoIdFromHref(atag) {
    if (atag.videoId === undefined) {
        //extract videoId from href and store on an attribute
        var videoId = atag.getAttribute('href').match(/watch\?v=([^&]*)/)[1]; //the href is like "/watch?v=IDabc123&t=123" so regex.
        atag.videoId = videoId;
    }
    return atag.videoId
}
function runPageCheckForExistingElements() {
    //Can run this just incase some elements were already created before observer set up.
    var list = document.getElementsByTagName("ytd-rich-item-renderer");
    for (let element of list) {
        element.addEventListener('mouseenter', animatedThumbsEventEnter);
        element.addEventListener('mouseleave', animatedThumbsEventLeave);
    }
}
function setupMutationObserver() {
    console.log(logHeader, "Enabling carousel fallback where an_webp not available.")
    const targetNode = document;
    const config = {attributes: false, childList: true, subtree: true};
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const element of mutation.addedNodes) {
                if (element.nodeName === 'YTD-RICH-ITEM-RENDERER') {
                    //console.debug(logHeader, "Adding event listeners to element", element);
                    element.addEventListener('mouseenter', animatedThumbsEventEnter);
                    element.addEventListener('mouseleave', animatedThumbsEventLeave);
                }
            }
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    runPageCheckForExistingElements();
}
async function updateDictionary() {
    cleanUpOldAnwebpUrls(an_webpUrlDictionary);
    if (window.location.pathname  === '/' || window.location.pathname  === '/feed/subscriptions' ) {
        var list = document.getElementsByTagName("ytd-rich-item-renderer");
        var listToProcess = [];
        var dictVideoIdsToReplaceWithTitle = {};
        for (let target of list) {
            if (elTargetIsExcludedCheck(target)) { // check exceptions
                continue
            }
            var atag = target.querySelector('a');
            //console.debug(logHeader, 'atag', atag);
            var videoId = elGetVideoIdFromHref(atag);
            if (an_webpUrlDictionary[videoId] != undefined || an_webpUrlDictionaryFailedCount[videoId] >= updateDictionaryFailedCountLimit) {//if already processed then skip
                continue
            } 
            listToProcess.push(videoId);

            if (videoId.includes('--') || videoId.includes('-_') || videoId.includes('_-') || videoId.includes('__')) {
                try {
                    var h3tagWithTitle = target.querySelector('h3');
                    var title = h3tagWithTitle.getAttribute('title');
                    dictVideoIdsToReplaceWithTitle[videoId] = title;
                } catch {}
            }

            if (listToProcess.length == updateDictionaryBatchSize) {
                break
            }
        }
        //console.debug(logHeader, 'listToProcess', listToProcess);
        //console.debug(logHeader, 'dictVideoIdsToReplaceWithTitle', dictVideoIdsToReplaceWithTitle);
        if (listToProcess.length == 0) {
            return
        }
        var searchQueryString = '"' + listToProcess.join('"|"') +'"'; // %7C = | pipe char, %22 = quote "
        for (let key_videoId in dictVideoIdsToReplaceWithTitle) {
            searchQueryString = searchQueryString.replaceAll(key_videoId, dictVideoIdsToReplaceWithTitle[key_videoId])
        }
        //console.debug(logHeader, 'searchQueryString', searchQueryString);
        var response = await makeGetRequest(searchUrl+encodeURIComponent(searchQueryString));
        //console.debug(logHeader, 'response', response);
        if (response.status == 200) {
            for (let videoId of listToProcess) {
                var trimmedResponseIndex = response.responseText.indexOf('an_webp/'+videoId);
                if (trimmedResponseIndex == -1) {
                    console.log(logHeader, 'No an_webp url in response for '+videoId);
                    incrementFailedCount(videoId);
                    continue
                }
                var trimmedResponse = response.responseText.substring(trimmedResponseIndex, trimmedResponseIndex+106) //106 char is length of an_webp URL path always.
                //console.debug(logHeader, 'trimmedResponseIndex',trimmedResponseIndex);
                //console.debug(logHeader, 'trimmedResponse',trimmedResponse);
                try {
                    var url = ytImageRootUrl+trimmedResponse.replaceAll('\\u0026', '&');
                    an_webpUrlDictionary[videoId] = {'url': url, 'datetime': Date.now()};
                    continue
                } catch {
                    incrementFailedCount(videoId);
                    continue
                }
            }
            if (storageAvailable("localStorage")) {
                localStorage.setItem("an_webpUrlDictionary", JSON.stringify(an_webpUrlDictionary));
            }
        }
    }
    //console.debug(logHeader, 'an_webpUrlDictionary', an_webpUrlDictionary);
    //console.debug(logHeader, 'an_webpUrlDictionaryFailedCount', an_webpUrlDictionaryFailedCount);
}
function incrementFailedCount(videoId) {
    if (an_webpUrlDictionaryFailedCount[videoId] === undefined) {
        an_webpUrlDictionaryFailedCount[videoId] = 1;
    } else {
        an_webpUrlDictionaryFailedCount[videoId] += 1;
    }
}
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
function cleanUpOldAnwebpUrls(an_webpUrlDictionary) {
    var datetimeOfExpiry = Date.now() - an_webpUrlExpiryAge;
    // to remove all expired an_webp urls past the cached time limit set.
    for (let key_videoId in an_webpUrlDictionary) {
        try {
            if (an_webpUrlDictionary[key_videoId]['datetime'] < datetimeOfExpiry) {
            delete an_webpUrlDictionary[key_videoId];
            } 
        } catch {
            delete an_webpUrlDictionary[key_videoId]; // if issue with datetime check then just delete.
        }
        
    }
}