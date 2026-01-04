// ==UserScript==
// @name         KMail
// @namespace    https://github.com/korykim
// @version      0.1
// @description  인증서 코드 취득 기능 제공.
// @author       Kory Kim
// @match        *://kotrakbc.or.kr/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMTYuMDAwMDAwcHQiIGhlaWdodD0iMTYuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCAxNi4wMDAwMDAgMTYuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwxNi4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik0xNyAxMzIgYy0yNCAtMjYgLTIyIC04NSAzIC0xMDcgMjAgLTE4IDI5IC04IDkgMTIgLTYgNiAtOSAyNSAtNyA0MwpsMyAzMiAyOCAtMjIgMjcgLTIxIDI4IDIxIDI3IDIyIDMgLTI3IGM1IC00MyAtNCAtNTUgLTQzIC01NSAtMTkgMCAtMzUgLTQKLTM1IC0xMCAwIC0xOCA2NiAtMTEgODMgOCAyMyAyNSAyMiA4NSAtMSAxMDUgLTI2IDI0IC0xMDQgMjMgLTEyNSAtMXogbTk4Ci0yMiBjLTEwIC0xMSAtMjYgLTIwIC0zNSAtMjAgLTkgMCAtMjUgOSAtMzUgMjAgLTE4IDIwIC0xNyAyMCAzNSAyMCA1MiAwIDUzCjAgMzUgLTIweiIvPgo8L2c+Cjwvc3ZnPgo=
// @license      GPL-2.0-only

// @downloadURL https://update.greasyfork.org/scripts/484884/KMail.user.js
// @updateURL https://update.greasyfork.org/scripts/484884/KMail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Save the original `open` function
    const originalOpen = XMLHttpRequest.prototype.open;

    // Define a new `open` function
    XMLHttpRequest.prototype.open = function() {
        // If this is a POST request
        if (arguments[0].toLowerCase() === 'post') {
            // Add an event listener for the `load` event
            this.addEventListener('load', function() {
                // If the data starts with "aResult="
                if (this._data && this._data.startsWith('aResult=')) {
                    // Copy the data to the clipboard
                    GM_setClipboard(this._data);

                    // Show an alert
                    alert('인증서 코드 복사 성공!');
                }
            });
        }

        // Call the original `open` function
        return originalOpen.apply(this, arguments);
    };

    // Save the original `send` function
    const originalSend = XMLHttpRequest.prototype.send;

    // Define a new `send` function
    XMLHttpRequest.prototype.send = function() {
        // Save the data
        this._data = arguments[0];

        // Call the original `send` function
        return originalSend.apply(this, arguments);
    };
})();
