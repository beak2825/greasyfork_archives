// ==UserScript==
// @name         Tweetdeck gallery
// @namespace    https://github.com/argit2/tweetdeck-gallery
// @version      1.0
// @description  Allows navigating through tweets in tweetdeck by keyboard shorcuts. Also makes ctrl c copy the link of the currently loaded tweet.
// @author       You
// @match        https://tweetdeck.twitter.com/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/419083/Tweetdeck%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/419083/Tweetdeck%20gallery.meta.js
// ==/UserScript==

/*
Usage

Click somewhere in the page, type the number of the column you wanna see, and use letters j and k to navigate between media tweets

Ctrl c when a tweet is open copies the link

*/

var firstTweet = true;
var currentColumn = 1;
var currentTweet = null;
var nextTweet = null; // used as a safeguard in some scenarios where the currentTweet is lost
const preemptiveLoad = 3; // if only this amount of tweets remaining to see, will attempt to load more

function removeAllChildren (elem) {
  while (elem.lastElementChild) {
    elem.removeChild(elem.lastElementChild);
  }
}

function doOnceLoaded(selector, func) {
    let interv = setInterval(function() {
        if (document.querySelector(selector)) {
            func();
            clearInterval(interv);
        }
    }, 500); // check every 100ms
}

function playVideo()
{
    let vid = document.querySelector("video")
    if (vid) {
        vid.play();
    }
}

function setAutoplay() {
    let node = document.querySelector("div#open-modal");
    new MutationObserver(playVideo).observe(node, { childList: true});
}

function gatherTweets() {
    return Array.filter(Array.from(document.querySelectorAll(`.js-column:nth-child(${currentColumn}) .js-column-holder article`)), elemExists);
}

function gatherMediaTweets() {
    let elements = gatherTweets();
    let mediaTweets = Array.filter(elements, elem => {
        let linkElem = mediaLinkElem(elem);
        if (linkElem) {
            let link = linkElem.href;
            if (link.includes("t.co")) {
                return true;
            }
        }
        return false;
    });
    return mediaTweets;
}

function loadNextTweets() {
    let elements = gatherTweets();
    if (elements) {
        // goes up then down
        elements[elements.length - 2].scrollIntoView(false);
        elements[elements.length - 1].scrollIntoView(false);
    }
}

// doesn't really serve for anything lmfao
function loadPrevTweets() {
    let elements = gatherTweets();
    if (elements) {
        // goes down then up
        elements[1].scrollIntoView(false);
        elements[0].scrollIntoView(false);
    }
}

function elemExists(elem)
{
    return elem && elem.style.visibility != "hidden" && elem.style.display !== "none";
}

function getCurrentTweet () {
    if (! currentTweet) {
        resetCurrentTweet();
    }
    return currentTweet;
}

function getRealCurrentTweet() {
    // gathers the one in the page instead of the clone
}

function setCurrentTweet (mediaTweets, tweet) {
    if (!tweet) {
        currentTweet = null;
        nextTweet = null;
        return;
    }
    currentTweet = tweet;
    let index = findIndexMediaTweet(mediaTweets, tweet);
    let next = getMediaTweet(mediaTweets, index + 1)
    if (next) {
        nextTweet = next;
    }
    else {
        nextTweet = null;
    }
}

function getMediaTweet(mediaTweets, index) {
    if (index < 0 || index >= mediaTweets.length)
    {
        return null;
    }
    return mediaTweets[index];
}

function resetCurrentTweet () {
    let mediaTweets = gatherMediaTweets();
    if (mediaTweets) {
        setCurrentTweet(mediaTweets, mediaTweets[0]);
        firstTweet = true;
    }
    else {
        print("Error: no mediaTweets on current column");
    }
}

function mediaLinkElem (tweet) {
    let elem = tweet.querySelector("a.media-item");
    if (!elem) {
            elem = tweet.querySelector("a.media-image");
    }
    return elem;
}

function showCurrentTweet () {
    let current = getCurrentTweet();
    let linkElem = mediaLinkElem(current);
    if (linkElem) {
        //linkElem.scrollIntoView(false);
        linkElem.click();
    }
}

function findIndexMediaTweet(arr, tweet) {
    return arr.findIndex(x => {
        let elem1 = mediaLinkElem(x);
        let elem2 = mediaLinkElem(tweet);
        return elem1 && elem2 && elem1.href == elem2.href;
    });
}

function currentTweetLost(mediaTweets, current){
    console.log("Error: currentTweet lost. This is probably due to it being unloaded as the script scrolls down without being able to find media posts. Resetting value to first visible media post.");
    console.log("Lost tweet:", current);
    console.log("Visible media tweets:", mediaTweets);
    setCurrentTweet(mediaTweets, mediaTweets[0]);
    showCurrentTweet();
}

function showNextTweet () {
    let current = getCurrentTweet();
    let mediaTweets = gatherMediaTweets();
    let index = 0;
    let indexToShow = 0;
    if (! firstTweet) {
        index = findIndexMediaTweet(mediaTweets, current);
        indexToShow = index + 1;
    }

    if (index == -1) {
        if (! nextTweet) {
            currentTweetLost(mediaTweets, current);
            return;
        }
        console.log(currentTweet, nextTweet);
        setCurrentTweet(mediaTweets, nextTweet);
        showCurrentTweet();
    }
    else if (indexToShow < mediaTweets.length) {
       setCurrentTweet(mediaTweets, mediaTweets[indexToShow]);
       showCurrentTweet();
    }
    // atempts to load more even if it's not the last
    if (indexToShow >= mediaTweets.length - preemptiveLoad) {
        loadNextTweets();
    }
    firstTweet = false;
}

function showPreviousTweet () {
    let current = getCurrentTweet();
    let mediaTweets = gatherMediaTweets();
    let index = findIndexMediaTweet(mediaTweets, current);
    if (index == -1) {
        currentTweetLost(mediaTweets, current);
        return;
    }
    if (index >= 1) {
       setCurrentTweet(mediaTweets, mediaTweets[index - 1]);
       showCurrentTweet();
    }
    if (index - 1 <= preemptiveLoad) {
        loadPrevTweets();
    }
    firstTweet = false;
}

function setCurrentColumn (colNumber) {
    currentColumn = colNumber;
    resetCurrentTweet();
}


function doc_keyUp(e) {
    let x = e.keyCode;
    if (x >= 49 && x <= 57){
            // numbers
            setCurrentColumn(x - 48);
    }

    if (x == ctrlKey) {
        ctrlDown = false;
    }

    switch (x) {
        case cKey:
            if (ctrlDown) {
                copyOpenTweetLink();
            }
            break;
        case jKey:
            showNextTweet();
            break;
        case kKey:
            showPreviousTweet();
            break;
        default:
            break;
    }
}

function doc_keyDown (e) {
    if (e.keyCode == ctrlKey) {
        ctrlDown = true;
    }
}

function copyOpenTweetLink() {
    let elem = document.querySelector("div#open-modal .tweet-timestamp a");
    if (elem && elem.href) {
        GM_setClipboard(elem.href);
    }
}

const ctrlKey = 17,
      cKey = 67,
      jKey = 74,
      kKey = 75;
var ctrlDown = false;
doOnceLoaded("div#open-modal", setAutoplay);
document.addEventListener('keyup', doc_keyUp, false);
document.addEventListener('keydown', doc_keyDown, false);