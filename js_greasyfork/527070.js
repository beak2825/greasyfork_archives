// ==UserScript==
// @name         EZBConnect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Connect Part of EZBlurb
// @author       You
// @match        https://itservices-connect.my.connect.aws/ccp-v2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=a2z.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527070/EZBConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/527070/EZBConnect.meta.js
// ==/UserScript==

(function() {
    console.log("EZConnext started---")
    window.addEventListener('message', (event) => {
        data = event.data
        if (event.origin === 'https://omnia.it.a2z.com' && typeof(data) == "string" ) {
            console.log('Message received from parent:', data);
            var textArea = document.querySelector("textarea")
            textArea.value = data.substring(3)
            textArea.focus()
            ["keydown", "keyup"].forEach(eventType => {
                const event = new KeyboardEvent(eventType, {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                });
                textArea.dispatchEvent(event);
            });

        }
    });
})();