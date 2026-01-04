// ==UserScript==
// @name         Cloud Connect New Project Alert Voice
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Scans the page every 4000ms and plays a voice that say "New task on Cloud connect" if the words "New Project" are detected anywhere on the page
// @match        https://connect.cloudresearch.com/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467098/Cloud%20Connect%20New%20Project%20Alert%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/467098/Cloud%20Connect%20New%20Project%20Alert%20Voice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        if (document.body.innerText.includes("New Project")) {
            var msg = new SpeechSynthesisUtterance("New task on Cloud connect");
            window.speechSynthesis.speak(msg);
        }
    }, 4000);
})();