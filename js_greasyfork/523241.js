// ==UserScript==
// @name         Cloud Connect Script
// @author       Cunrom
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Scans the page every 4000ms
// @match        https://connect.cloudresearch.com/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523241/Cloud%20Connect%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523241/Cloud%20Connect%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Version: 15.0")
    const interval = setInterval(function() {
        const viewButton = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent.trim() === 'View'
        );
        if (viewButton) {
            viewButton.click();
            var viewMsg = new SpeechSynthesisUtterance("New task on Cloud connect");
            window.speechSynthesis.speak(viewMsg);
            setTimeout(() => {
                const startButton = Array.from(document.querySelectorAll('button')).find(
                    btn => btn.querySelector('span')?.textContent.trim() === 'Start'
                );
                if (startButton) {
                    startButton.click();
                    var startMsg = new SpeechSynthesisUtterance("Task started");
                    window.speechSynthesis.speak(startMsg);
                    clearInterval(interval);
                }
            }, 500);
        } else {
            location.reload();
        }
    }, 4000);
})();