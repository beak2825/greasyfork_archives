// ==UserScript==
// @name         Typeracer Quick Leave/Start Race
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Allows you to quickly leave or start a race by pressing tab once
// @author       Seraph
// @match        https://play.typeracer.com/
// @icon         https://www.google.com/s2/favicons?domain=typeracer.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437674/Typeracer%20Quick%20LeaveStart%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/437674/Typeracer%20Quick%20LeaveStart%20Race.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', (e) => {
    if (e.code == 'Tab') {
        let leaveBtn = document.querySelector('[title="Keyboard shortcut: Ctrl+Alt+J (except while racing)"]');
        let startBtn = document.querySelector('[title="Keyboard shortcut: Ctrl+Alt+I"]');
        if (leaveBtn == null) {
            startBtn.click();
        } else {
            leaveBtn.click();
        }
    };
});


})();