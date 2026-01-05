// ==UserScript==
// @name	TopScroll
// @description	Быстрая прокрутка страницы вверх/вниз.
// @namespace	https://forum.mozilla-russia.org/viewtopic.php?pid=719386#p719386
// @include 	*
// @version	1.0
// @downloadURL https://update.greasyfork.org/scripts/28159/TopScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/28159/TopScroll.meta.js
// ==/UserScript==

topScroll = {

    injectDiv: function() {
        var body = document.getElementsByTagName("body")[0];
        var div = document.createElement("div");
        div.id = "topscroll-chrome-extension-bar";
        div.setAttribute("style", "position: fixed !important; top: 0 !important; left: 0 !important; bottom: 0 !important; margin: 0 !important; padding: 0 !important; width: 5px !important; height: 100% !important; border-style: none !important; box-shadow: none !important; opacity: 0 !important; z-index: 2147483647 !important;");
        div.onclick = topScroll.scrollUp;
        div.oncontextmenu = topScroll.scrollDown;
        body.appendChild(div);
    },

    scrollUp: function() {
        if (window.pageYOffset === 0) {
            topScroll.scrollTo(topScroll.lastScrollPosition);
            topScroll.lastScrollPosition = 0;
        } else {
            topScroll.lastScrollPosition = window.pageYOffset;
            topScroll.scrollTo(0);
        }
    },

    scrollDown: function() {
        var bottomOffset = document.documentElement.scrollHeight - window.innerHeight;
        if (window.pageYOffset === bottomOffset) {
            topScroll.scrollTo(topScroll.lastScrollPosition);
            topScroll.lastScrollPosition = bottomOffset;
        } else {
            topScroll.lastScrollPosition = window.pageYOffset;
            topScroll.scrollTo(bottomOffset);
        }
        return false; // Prevent context menu appearing
    },

    scrollTo: function(endY) {
        var duration = 150;
        var startY = window.scrollY;
        var distance = Math.max(endY,0) - startY;
        var startTime = new Date().getTime();
        (function loopScroll() {
            setTimeout(function () {
                var p = Math.min((new Date().getTime() - startTime) / duration, 1); // Progress 0&#8594;1
                var y = Math.max(Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)), 0);
                window.scrollTo(window.pageXOffset, y);
                if (p < 1) {
                    loopScroll();
                }
            }, 1)
        })();
    }
};

topScroll.injectDiv();