// ==UserScript==
// @name         Script Auto-Close Whatsapp reminders
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Script to send whatsapp messages
// @author       You
// @license MIT
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425708/Script%20Auto-Close%20Whatsapp%20reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/425708/Script%20Auto-Close%20Whatsapp%20reminders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var textbox;

    let intervalFrame = setInterval(() => {
        textbox = document.querySelector('div[data-tab="6"]');

        if(textbox) {
            clearInterval(intervalFrame);

            let includes = textbox.textContent.includes('!!');

            if(includes) {
                console.log("closing");
                document.querySelector('span[data-icon="send"]').parentElement.click()

                setTimeout(() => {
                    window.close();
                }, 10000);

               
            }

        }

        console.log(textbox);
    }, 2000);

})();