// ==UserScript==
// @name         YouTube Recommendation Remover
// @namespace    vincheng.me
// @version      1.1.2
// @description  Removes any home page feed entries that have a subtitle that includes the word "recommended"
// @author       ducktrshessami & VinC
// @match        *://www.youtube.com/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382618/YouTube%20Recommendation%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/382618/YouTube%20Recommendation%20Remover.meta.js
// ==/UserScript==

// keywords for removing feed
const filters = [
    "recommended video",
    "recommended channel",
    "为您推荐的频道",
    "推荐的视频",
    "推荐的游戏直播",
    "推荐视频",
    "直播推荐"
];

document.body.addEventListener("DOMNodeInserted", function() {
    const feed = $("div#contents.style-scope.ytd-section-list-renderer")[0]; // Assumed there's only one feed

    function helper(element) { // Helps find the feed entry's element
        if (element == document.body) { // Went too far
            return;
        }
        return element.parentNode == feed ? element : helper(element.parentNode); // Recurse
    }

    function dothething() { // Event response


        var target, annotations = $("yt-formatted-string#title-annotation.style-scope.ytd-shelf-renderer, span#title.style-scope.ytd-shelf-renderer");
        for (var i = 0; i < annotations.length; ++i) {
            var annotation = annotations[i].innerHTML.toLowerCase();
            if (filters.some(v => annotation.includes(v))){ // Target located
                if (target = helper(annotations[i])) {
                    target.remove();
                    console.info("Target destroyed [" + annotation + "]");
                }
            }
        }
    }

    if (feed) {
        if (!feed.getAttribute("ytfrr")) {
            feed.setAttribute("ytfrr", true);
            feed.addEventListener("DOMNodeInserted", dothething); // Here we go
        }
    }
});