// ==UserScript==
// @name       YouTube - Shrink watched YouTube videos
// @version    1.08 beta
// @description Youtube videos will be shrinked so you can easily/visuallyClearly skip them.
// @description Based in the work of Aviem Zur "YouTube - Hide watched YouTube videos" (http://userscripts-mirror.org/scripts/review/149842). Forum: https://greasyfork.org/en/forum/discussion/comment/21182.
// @description I understand it will work best with "Better YouTube Watch History" (https://chrome.google.com/webstore/detail/better-youtube-watch-hist/lleajdkalfbohpinoaekajagdefaeckd?hl=en)
// @match      http://www.youtube.com/*
// @match      http://youtube.com/*
// @match      https://www.youtube.com/*
// @match      https://youtube.com/*
// @license    GPLv3 - http://www.gnu.org/licenses/gpl-3.0.en.html
// @copyright  teken
// @namespace https://greasyfork.org/users/17433
// @downloadURL https://update.greasyfork.org/scripts/16868/YouTube%20-%20Shrink%20watched%20YouTube%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/16868/YouTube%20-%20Shrink%20watched%20YouTube%20videos.meta.js
// ==/UserScript==

var hide = function() {
    var aElementList = [];
    var watchedList;
/*
    watchedList = document.evaluate("//div[contains(text(),'WATCHED')]/../../../..",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    watchedList = document.evaluate("//span[contains(text(),'WATCHED')]/../../../..",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    watchedList = document.evaluate("//span[@class='resume-playback-background']/../../..",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    watchedList = document.evaluate("//span[@class='resume-playback-progress-bar']/../../..",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    watchedList = document.evaluate("//div[@class='style-scope ytd-thumbnail-overlay-resume-playback-renderer']/../../..",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
*/
    watchedList = document.evaluate("//div[@id='progress']/../../../..",document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < watchedList.snapshotLength; i++) {var w1 = watchedList.snapshotItem(i);aElementList.push(w1);}

    var w = null;
    for (var j = 0; j < aElementList.length; j++) {
        w = aElementList[j];
        if(!w)continue;

        //////this double check didnt help... the 1st pic is being wrongly hidden...
        //var check = w.getElementsByClassName("style-scope ytd-thumbnail-overlay-resume-playback-renderer")[0]; // of the id='progress'
        //if(!check)continue;
        if(j==(aElementList.length-1))continue; //there is a bug? checking the last item? that affects the 1st picture!?!? so ignore it...

        var pic = w.getElementsByClassName("ytd-thumbnail")[0];
        if(!pic)continue;

        w.style.backgroundColor = "#401030";
        pic.style.display = 'none';
        //w.style.height = '10px'; //BUG? shrinking seems to be causing problem preventing page scrollbar from working by disabling it somehow...
        //w.style.overflow = 'hidden';
    }
};

document.addEventListener("DOMSubtreeModified", function() { hide(); } , false);
