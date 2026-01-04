// ==UserScript==
// @name        GeeksForGeeks - Disable Login Popup
// @namespace   https://github.com/DenverCoder1
// @match       https://www.geeksforgeeks.org/*
// @grant       none
// @version     1.0
// @author      Jonah Lawrence
// @description Disable Login Modal on GeeksForGeeks.org
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441253/GeeksForGeeks%20-%20Disable%20Login%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/441253/GeeksForGeeks%20-%20Disable%20Login%20Popup.meta.js
// ==/UserScript==

(function () {
    var VERSION = "1.0";

    window.addEventListener(
        "load",
        function () {
            console.info("'GeeksForGeeks - Disable Login Popup' Version " + VERSION + " started");

            // disable smartLogin function
            window.smartLogin = function () {
                console.info("'GeeksForGeeks - Disable Login Popup' Blocked 'smartLogin' function");
            };

            // make GeeksForGeeks not know how many times the user has visited the site
            localStorage.removeItem("gfgViewCount");

            // Hide login modal div with CSS in case it still appears
            document.head.insertAdjacentHTML(
                "beforeend",
                "<style>.login-modal-div, .spinner-loading-overlay { display: none !important; }</style>"
            );

            // When attempting to scroll, stop the scroll from being locked if gfg has locked the scroll
            window.addEventListener(
                "scroll",
                function () {
                    if (window.onscroll) {
                        window.onscroll = null;
                        document.body.style.position = "relative";
                        document.body.style.overflow = "unset";
                        console.info("'GeeksForGeeks - Disable Login Popup' Unlocked scroll");
                    }
                },
                { passive: true }
            );
        },
        false
    );
})();
