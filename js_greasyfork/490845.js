// ==UserScript==
// @name         Update ProtonMail Addy Email Label
// @namespace    http://tampermonkey.net/
// @version      2024-03-25 v2
// @description  Updates Addy email sender labels to use `@` instead of ` at ` for easier viewing
// @author       You
// @match        https://mail.proton.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proton.me
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490845/Update%20ProtonMail%20Addy%20Email%20Label.user.js
// @updateURL https://update.greasyfork.org/scripts/490845/Update%20ProtonMail%20Addy%20Email%20Label.meta.js
// ==/UserScript==

(function() {

    function updateEmailText(elArr) {
        // update all email labels to use `@` instead of ` at `
        elArr.filter(el => el.innerText.match(/.+ at .+/g)).forEach(el => el.textContent = el.textContent.replace(' at ', '@'));
    }

    // run every 10 seconds
    setInterval(() => {

        // Email List (left side in Column view)
        updateEmailText([...document.querySelectorAll('[data-testid="message-column:sender-address"]')]);

        // Converstation Header (all converstations within email)
        updateEmailText([...document.getElementsByClassName('message-recipient-item-label')]);

        // Sender Details Popup
        updateEmailText(...document.getElementsByClassName('user-select'));
    }, 10 * 1000);
})();