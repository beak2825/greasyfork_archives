// ==UserScript==
// @author        Odd
// @description   Removes the viewport element's "pointerdown" event handler in order to restore checking and clicking capabilities for form elements in Google Chrome.
// @include       http://www.neopets.com*
// @name          Neopets Workarounds (PointerDown)
// @namespace     Odd@Clraik
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/381029/Neopets%20Workarounds%20%28PointerDown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381029/Neopets%20Workarounds%20%28PointerDown%29.meta.js
// ==/UserScript==

(function () {

    if (typeof $ == "undefined") $ = unsafeWindow.$;

    var intervalID;
    var timeout = 30000;
    var viewports = $("[class*='viewport']");
    
    intervalID = setInterval
    (

        function () {

            if (intervalID && (viewports.data("events") || (timeout -= 100) < 1)) {

                clearInterval(intervalID);

                intervalID = null;

                viewports.unbind("pointerdown");
            }
        },
        100
    );
})();