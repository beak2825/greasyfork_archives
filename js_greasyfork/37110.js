// ==UserScript==
// @name        Existenz
// @namespace   lazi3b0y
// @include     *existenz.se*
// @version     1.1
// @grant    	GM_getValue
// @grant    	GM_setValue
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @description Existenz script for redirecting stuff instead of using their iframe shit
// @downloadURL https://update.greasyfork.org/scripts/37110/Existenz.user.js
// @updateURL https://update.greasyfork.org/scripts/37110/Existenz.meta.js
// ==/UserScript==

if (window.jQuery && typeof window.jQuery !== "undefined") {
    console.log("jQuery is loaded. Proceeding with the rest of the script.");

    (function () {
        let self = {
            _container: $("body"),
            _initialise: function () {
                window.$ = window.jQuery = jQuery.noConflict(true);
                console.log(window.location.pathname);
                if (window.location.pathname === "/out.php") {
                    self._redirectToSource();
                }
            },
            _redirectToSource: function () {
                let iframe = self._container.find("iframe");
                let source = iframe.attr("src");

                console.log("address: " + source);

                if (source.search("existenz") === -1) {
                    console.log("Existenz script: Redirecting to source...");
                    window.location.replace(source);
                }
            }
        };

        self._initialise();

        return self;
    })();
} else {
    console.log("jQuery isn't loaded.");
    console.log(window.jQuery && typeof window.jQuery === "undefined");
    console.log(window.$ && typeof window.$ === "undefined");
}