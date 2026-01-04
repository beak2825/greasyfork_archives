// ==UserScript==
// @name        Funfunfun
// @namespace   lazi3b0y
// @include     *funfunfun.se*
// @version     1.1
// @grant    	GM_getValue
// @grant    	GM_setValue
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @description Redirection script
// @downloadURL https://update.greasyfork.org/scripts/37111/Funfunfun.user.js
// @updateURL https://update.greasyfork.org/scripts/37111/Funfunfun.meta.js
// ==/UserScript==

if (window.jQuery && typeof window.jQuery !== "undefined") {
    (function () {
        let self = {
            _container: $("body"),
            _initialise: function () {
                self._waitForYt();
            },
            _redirectToSource: function () {
                window.location.replace("https://www.youtube.com/watch?v=" + yt.data.videoId);
            },
            _waitForYt: function () {
                console.log(Object.keys(window));
                console.log(Object.keys(window.parent));
                console.log(Object.keys(window.top));
                if (typeof yt === "undefined" || !yt) {
                    console.log("Waiting for yt...");
                    //setTimeout(self._waitForYt, 500);
                } else {
                    self._redirectToSource();
                }
            }
        };

        self._initialise();

        return self;
    })();
} else {
    console.log("Custom script: jQuery isn't loaded.");
}