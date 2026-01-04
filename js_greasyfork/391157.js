// ==UserScript==
// @name         YouTube Focus Mode
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Put YouTube in focus mode! Hides all unasked for content (recommendations, subscriptions, related, etc.) on the home, watch, and search results pages.
// @author       EmeraldSlash
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391157/YouTube%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/391157/YouTube%20Focus%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Controls which features are enabled, and which elements should be deleted
    const DELETE = {
        HOME_PAGE_FEED: true, // Video recommendations that show up on the home page
        WATCH_PAGE_RELATED: true, // Related videos displayed in a vertical list on the bottom right
        WATCH_PAGE_UP_NEXT: false, // Up next video
        VIDEO_VIDEOWALL: true, // Video recommendations that show up in a grid in the video display when a video finishes
        SEARCH_RESULTS_SHELVES: true, // Removes intrusive shelves in search results: "Shorts", "For you", "Previously watched", "People recently watched", etc.
    }
    const FOCUS_HOME_PAGE_SEARCH_BAR = true // Focus the home page search bar when visiting the page

    // Selectors for each of the features and elements to be deleted
    const SELECTORS = {
        HOME_PAGE_FEED: ["[page-subtype='home']"],
        WATCH_PAGE_RELATED: ["#items > yt-related-chip-cloud-renderer", "#items > ytd-item-section-renderer", "#related > ytd-watch-next-secondary-results-renderer"],
        WATCH_PAGE_UP_NEXT: ["#items > ytd-compact-autoplay-renderer"],
        VIDEO_VIDEOWALL: [".ytp-endscreen-content"],
        SEARCH_RESULTS_SHELVES: ["ytd-reel-shelf-renderer", "ytd-shelf-renderer"],
    }
    const HOME_PAGE_SEARCH_BAR_SELECTOR = "input#search"

    // import library for detecting added elements
    // insertion-query v1.0.3 (2016-01-20)
    // license:MIT
    // Zbyszek Tenerowicz <naugtur@gmail.com> (http://naugtur.pl/)
    var insertionQ=function(){"use strict";function a(a,b){var d,e="insQ_"+g++,f=function(a){(a.animationName===e||a[i]===e)&&(c(a.target)||b(a.target))};d=document.createElement("style"),d.innerHTML="@"+j+"keyframes "+e+" {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }\n"+a+" { animation-duration: 0.001s; animation-name: "+e+"; "+j+"animation-duration: 0.001s; "+j+"animation-name: "+e+";  } ",document.head.appendChild(d);var h=setTimeout(function(){document.addEventListener("animationstart",f,!1),document.addEventListener("MSAnimationStart",f,!1),document.addEventListener("webkitAnimationStart",f,!1)},n.timeout);return{destroy:function(){clearTimeout(h),d&&(document.head.removeChild(d),d=null),document.removeEventListener("animationstart",f),document.removeEventListener("MSAnimationStart",f),document.removeEventListener("webkitAnimationStart",f)}}}function b(a){a.QinsQ=!0}function c(a){return n.strictlyNew&&a.QinsQ===!0}function d(a){return c(a.parentNode)?a:d(a.parentNode)}function e(a){for(b(a),a=a.firstChild;a;a=a.nextSibling)void 0!==a&&1===a.nodeType&&e(a)}function f(f,g){var h=[],i=function(){var a;return function(){clearTimeout(a),a=setTimeout(function(){h.forEach(e),g(h),h=[]},10)}}();return a(f,function(a){if(!c(a)){b(a);var e=d(a);h.indexOf(e)<0&&h.push(e),i()}})}var g=100,h=!1,i="animationName",j="",k="Webkit Moz O ms Khtml".split(" "),l="",m=document.createElement("div"),n={strictlyNew:!0,timeout:20};if(m.style.animationName&&(h=!0),h===!1)for(var o=0;o<k.length;o++)if(void 0!==m.style[k[o]+"AnimationName"]){l=k[o],i=l+"AnimationName",j="-"+l.toLowerCase()+"-",h=!0;break}var p=function(b){return h&&b.match(/[^{}]/)?(n.strictlyNew&&e(document.body),{every:function(c){return a(b,c)},summary:function(a){return f(b,a)}}):!1};return p.config=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b])},p}();

    function update() {
        for (var key in DELETE) {
            if (DELETE[key]) {
                var sel = SELECTORS[key]
                var found = false
                sel.forEach(function(selector) {
                    let result = document.querySelectorAll(selector);
                    if (result.length > 0) {
                        found = true;
                        result.forEach(function(element) {
                            element.remove();
                        })
                    }
                })
                if (FOCUS_HOME_PAGE_SEARCH_BAR && found && key == "HOME_PAGE_FEED") {
                    let search = document.querySelector(HOME_PAGE_SEARCH_BAR_SELECTOR);
                    if (search) {
                        search.focus();
                    }
                }
            }
        }
    }

    // update when user navigates
    document.addEventListener('yt-navigate-finish', update);

    // remove elements when they get added
    for (var key in DELETE) {
        if (DELETE[key]) {
            var sel = SELECTORS[key]
            sel.forEach(function(selector) {
                insertionQ(selector).every(function(element) {
                    element.remove()
                })
            })
        }
    }

     // call initial update
    update()
})();