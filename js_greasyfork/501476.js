// ==UserScript==
// @name         Enable Scrolling
// @namespace    https://violentmonkey.github.io/
// @version      0.1
// @description  Enable scrolling on any page with a click
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501476/Enable%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/501476/Enable%20Scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = false;

    function toggleScrolling() {
        enabled = !enabled;
        if (enabled) {
            var r = "html,body{overflow:auto !important;}";
            var s = document.createElement("style");
            s.type = "text/css";
            s.appendChild(document.createTextNode(r));
            document.body.appendChild(s);
        } else {
            // Remove the style to disable scrolling
            var styles = document.body.getElementsByTagName("style");
            for (var i = styles.length - 1; i >= 0; i--) {
                if (styles[i].type === "text/css" && styles[i].innerHTML === r) {
                    document.body.removeChild(styles[i]);
                }
            }
        }
    }

    // Add a browser action to the Tempermonkey script
    GM_registerMenuCommand("Toggle Scrolling", toggleScrolling);

})();
