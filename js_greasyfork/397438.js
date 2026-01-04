// ==UserScript==
// @name         MathTrainer Premium Bypass
// @namespace    https://www.mathtrainer.org/
// @version      1.2
// @description  Bypass the premium version in MathTrainer.org.
// @author       MinusKube
// @match        https://www.mathtrainer.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397438/MathTrainer%20Premium%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/397438/MathTrainer%20Premium%20Bypass.meta.js
// ==/UserScript==

// Yes, the code is ugly and old, but I don't mind :3

(function() {
    'use strict';

    var style = document.createElement("style");

    // One-line for better compatibility
    style.innerHTML = ".is-blurred { filter: none !important; } .is-inactive, .is-inactive:hover { cursor: default !important; opacity: 1 !important; } .lock-overlay { display: none !important; }";

    document.head.appendChild(style);

    setInterval(function() {
        var inactiveElements = document.getElementsByClassName("is-inactive");

        for (var i = 0; i < inactiveElements.length; i++) {
            var element = inactiveElements[i];
            var className = element.className.replace("is-inactive", "");
            element.className = className;
        }

        document.getElementsByName("warmupMode")[0].disabled = false;
        document.getElementsByName("addition")[0].disabled = false;
        document.getElementsByName("subtraction")[0].disabled = false;
        document.getElementsByName("multiplication")[0].disabled = false;
        document.getElementsByName("division")[0].disabled = false;
        document.getElementsByName("darkTheme")[0].disabled = false;
    }, 2000);
})();