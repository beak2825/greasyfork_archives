// ==UserScript==
// @name        Tumblr - Remember scroll position
// @namespace   https://myanimelist.net/profile/kyoyatempest
// @match       https://www.tumblr.com/search/*
// @version     1.1
// @author      kyoyacchi
// @description Remembers the scrolling position you left on the thing you're searching on Tumblr.
// @icon https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tumblr.com&size=64
// @license gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/454159/Tumblr%20-%20Remember%20scroll%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/454159/Tumblr%20-%20Remember%20scroll%20position.meta.js
// ==/UserScript==
window.onbeforeunload = function () {
        var scrollPos;
        if (typeof window.pageYOffset != 'undefined') {
            scrollPos = window.pageYOffset;
        }
        else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        }
        else if (typeof document.body != 'undefined') {
            scrollPos = document.body.scrollTop;
        }
        document.cookie = "scrollTop=" + scrollPos + "URL=" + window.location.href;
    }

window.onload = function () {
    if (document.cookie.includes(window.location.href)) {
        if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
            var arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/);
            document.documentElement.scrollTop = parseInt(arr[1]);
            document.body.scrollTop = parseInt(arr[1]);
        }
    }
//  console.log("hmm?")
}

//https://stackoverflow.com/a/65746118/19276081