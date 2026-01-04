// ==UserScript==
// @name         Besked box
// @namespace    https://www.netstationen.dk/visi/client.asp
// @version      1.0.1
// @description  Ja godav
// @author       Din mor
// @match        https://www.netstationen.dk/visi/client.asp*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/483037/Besked%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/483037/Besked%20box.meta.js
// ==/UserScript==

function init() {
	const msgBox = document.getElementById('md-msg-form');
	const inputBox = msgBox.querySelector('#md-msg');
    inputBox.style.width = "52%";
	const footer = document.getElementById('footer');
	footer.after(msgBox);
}

function checkForInit() {
    const duration = 100
    let remainingAttempts = 50

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (window.socket) {
          resolve()
          clearInterval(interval)
        } else if (remainingAttempts <= 1) {
          clearInterval(interval)
        }

        remainingAttempts--
      }, duration)
    })
}

(function() {
    'use strict';
    checkForInit().then(() => {
       init();
    });
})();