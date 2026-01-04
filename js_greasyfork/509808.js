// ==UserScript==
// @name         BreakoutEDU answers script
// @namespace    http://tampermonkey.net/
// @version      2024-09-23
// @description  alerts or prints the answers whenever you open a lock.
// @author       PowfuArras
// @match        https://student.breakoutedu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=breakoutedu.com
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/509808/BreakoutEDU%20answers%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/509808/BreakoutEDU%20answers%20script.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const nativeOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        if (url.includes("student.breakoutedu.com/game-with-locks/play/lock-of-the-day")) {
            this.addEventListener('load', function () {
                const response = this.responseText;
                const data = JSON.parse(response);
                if (data.payload.gameLocks.length !== 1) {
                    console.log("Not supported. Printing answers to console.");
                    console.table(data.payload.gameLocks.map(lock => lock.ans));
                }
                alert(`The answer is:\n\n${data.payload.gameLocks[0].ans.replaceAll(",", ", ")}`);
            });
        }
        return nativeOpen.call(this, method, url, ...rest);
    };
})();