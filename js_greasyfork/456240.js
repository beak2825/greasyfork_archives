// ==UserScript==
// @name         ChatGPT Continue Button
// @version      0.3.1
// @description  Makes the send button type continue and submit it if there is nothing in the textarea
// @author       ChatGPT with a little help
// @match        https://chat.openai.com/chat
// @grant        none
// @license      MIT License (https://opensource.org/licenses/MIT)
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/456240/ChatGPT%20Continue%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/456240/ChatGPT%20Continue%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // find the textarea where the user types messages
    const textarea = document.querySelector("textarea");
    const btn = textarea.nextElementSibling;

    btn.addEventListener('click', function() {
    // when the button is clicked, if there is nothing in the textarea,
    // type "continue" into the textarea and submit it
    if (textarea.value === '') {
        textarea.value = 'continue';
        textarea.form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    });
})();
