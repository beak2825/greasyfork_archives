// ==UserScript==
// @name         VK Comments Link
// @namespace    http://alamote.pp.ua/
// @match        https://vk.com/search*
// @grant        none
// @version      1.1
// @description  Add a link to comments on the Vk search
// @icon         http://alamote.pp.ua/staff/alamote-logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454945/VK%20Comments%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/454945/VK%20Comments%20Link.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const setButtons = () => {
    const results = document.querySelectorAll('.groups_row:not(.with-comments)');
    for (let i = 0; i < results.length; i++) {
        const row = results.item(i);
        row.classList.add('with-comments');
        console.log(row.dataset.id);
        const subBtn = row.querySelector('.search_sub_button');
        if (subBtn) {
            subBtn.removeAttribute('onclick');
            subBtn.classList.add('comments-btn');
            subBtn.classList.remove('search_sub_button');
            subBtn.querySelector('span.FlatButton__content').innerHTML = 'Комментарии';
            subBtn.addEventListener('click', () => {
                const handle = window.open(`https://vk.com/wall-${row.dataset.id}?q=type%3Areply`);
                handle.blur();
                window.focus();
            });
        }
        const unsubBtn = row.querySelector('.search_unsub_button');
        if (unsubBtn) {
            unsubBtn.remove();
        }
    }
}


(function() {
    'use strict';

    setButtons();
    setInterval(setButtons, 1000);

})();