// ==UserScript==
// @name         Moodle AutoLeave
// @namespace    https://t.me/johannmosin
// @version      0.4.0
// @description  Закрывает конфу в мудле как только в чате появится текст "до свидания"
// @author       Johann Mosin
// @license      MIT
// @match        https://*.edu.vsu.ru/html5client/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492662/Moodle%20AutoLeave.user.js
// @updateURL https://update.greasyfork.org/scripts/492662/Moodle%20AutoLeave.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to disable beforeunload popups
    function disablePopups() {
        // Remove onbeforeunload from all elements
        var all = document.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i].getAttribute("onbeforeunload")) {
                all[i].setAttribute("onbeforeunload", null);
            }
        }
        // Clear window-level beforeunload
        window.onbeforeunload = null;

        // Override addEventListener to prevent new beforeunload listeners
        if (!window._originalAddEventListener) {
            window._originalAddEventListener = window.addEventListener;
        }
        window.addEventListener = function(type, listener, useCapture) {
            if (type !== "beforeunload") {
                window._originalAddEventListener(type, listener, useCapture);
            }
        };
    }

    // Original checkText function with preserved functionality
    function checkText() {
        var text = document.body.innerText.toLowerCase();
        if (text.includes('до свидания') || text.includes('досвидания')) {
            // Ensure popups are disabled before redirect
            disablePopups();
            window.close();
        }
    }

    // Initial popup disable
    disablePopups();

    // Run popup disable periodically
    setInterval(disablePopups, 500);

    // Original interval check for text
    setInterval(checkText, 10000);
})();