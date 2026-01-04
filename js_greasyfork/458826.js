// ==UserScript==
// @name         thetruesize.com map cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes the annoying "How it works" box, and clears the map
// @author       adriansliacky
// @match        https://www.thetruesize.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thetruesize.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458826/thetruesizecom%20map%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/458826/thetruesizecom%20map%20cleaner.meta.js
// ==/UserScript==

(function () {
    "use strict";
    window.addEventListener(
        "load",
        function () {
            let currElement = document.getElementsByClassName(
                "gm-style-iw gm-style-iw-c"
            )[0];

            for (let i = 0; i < 5; i++) {
                currElement = currElement.parentElement;
            }

            currElement.remove();
            document.querySelector('[ng-click="clearCountries()"]').click();
        },
        false
    );
})();