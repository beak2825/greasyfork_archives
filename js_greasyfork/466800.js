// ==UserScript==
// @name         Unsub_All_by_el9in
// @namespace    Unsub_All_by_el9in
// @version      0.1
// @description  Unsub All
// @author       el9in
// @match        https://zelenka.guru/account/following
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466800/Unsub_All_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466800/Unsub_All_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const unsubButton = document.createElement('a');
    unsubButton.classList.add('button', 'red');
    unsubButton.style.padding = 'inherit';
    unsubButton.style.marginTop = '5px';
    unsubButton.textContent = 'Отписаться от всех';
    unsubButton.addEventListener('click', async function() {
        const unsubs = Array.from(document.querySelectorAll('div.extra a.UnfollowLink'));
        for(let button of unsubs) {
            button.click();
            await sleep(1000);
        }
    });
    const parentElement = document.querySelector('.mn-15-0-0');
    parentElement.appendChild(unsubButton);
})();