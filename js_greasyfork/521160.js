// ==UserScript==
// @name         kolvo-zablokirovannuh
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  232
// @author       ChatGPT , aff
// @match        *https://zelenka.guru/account/ignored*
// @match        *https://lolz.live/account/ignored*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521160/kolvo-zablokirovannuh.user.js
// @updateURL https://update.greasyfork.org/scripts/521160/kolvo-zablokirovannuh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
    if (currentUrl !== 'https://zelenka.guru/account/ignored' && currentUrl !== 'https://lolz.live/account/ignored') {
        return;
    }

    const countIgnoredMembers = () => {

        const ignoredMembers = document.querySelectorAll('.member-list_ignored');
        const ignoredCount = ignoredMembers.length;

        const submitUnitElement = document.querySelector('.ctrlUnit.submitUnit');
        if (!submitUnitElement) {
            console.warn('Элемент с классом "ctrlUnit submitUnit" не найден.');
            return;
        }


        let countDisplay = submitUnitElement.querySelector('#ignored-count');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.id = 'ignored-count';

            countDisplay.style.fontSize = '13px';
            countDisplay.style.color = 'rgb(214, 214, 214)';
            countDisplay.style.textDecoration = 'none';
            countDisplay.style.backgroundColor = 'rgb(34, 142, 93)';
            countDisplay.style.padding = '0px 15px';
            countDisplay.style.borderStyle = 'none';
            countDisplay.style.borderRadius = '6px';
            countDisplay.style.userSelect = 'none';
            countDisplay.style.fontStyle = 'normal';
            countDisplay.style.textAlign = 'center';
            countDisplay.style.lineHeight = '34px';
            countDisplay.style.display = 'inline-block';
            countDisplay.style.cursor = 'default';
            countDisplay.style.boxSizing = 'border-box';
            countDisplay.style.fontWeight = '600';
            countDisplay.style.transition = 'background 0.8s';
            countDisplay.style.height = '34px';
            countDisplay.style.marginTop = '4px';

            submitUnitElement.appendChild(countDisplay);
        }

        countDisplay.textContent = `Заблокированные: ${ignoredCount}`;
    };

    let timeout;
    const debounce = (fn, delay) => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };


    countIgnoredMembers();


    const observer = new MutationObserver(() => {
        debounce(countIgnoredMembers, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
