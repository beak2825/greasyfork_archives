// ==UserScript==
// @name         Prolific Alert
// @namespace    https://github.com/Kadauchi
// @version      1.0
// @description  Alerts and notifies you of any new studies that get posted.
// @author       Cunrom
// @include      https://app.prolific.com/*

// @downloadURL https://update.greasyfork.org/scripts/523530/Prolific%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/523530/Prolific%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Version: 1.0")
    const interval = setInterval(function() {
        setTimeout(() => {
            const h1Element = Array.from(document.querySelectorAll("h1")).find(
            (element) => element.textContent.trim() === "Waiting for studies"
            );
            if (!h1Element) {
                var viewMsg = new SpeechSynthesisUtterance("New task on Prolific");
                window.speechSynthesis.speak(viewMsg);
                clearInterval(interval);
            } else {
                location.reload();
            }
        }, 3000);
    }, 4000);
})();