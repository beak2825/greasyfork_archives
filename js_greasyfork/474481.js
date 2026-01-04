// ==UserScript==
// @name         myhome.ge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  myhome.ge ux improvements
// @author       futpib
// @license MIT
// @match        https://www.myhome.ge/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myhome.ge
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474481/myhomege.user.js
// @updateURL https://update.greasyfork.org/scripts/474481/myhomege.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handledKey = 'k' + Math.random().toString(16).split('.')[1];

    function handleClick(event) {
        event.stopPropagation();
    }

    function processElement(element) {
        if (element.dataset[handledKey]) {
            return;
        }

        element.dataset[handledKey] = '1';
        const link = document.createElement('a');
        link.innerText = 'link';
        link.target = '_blank';
        link.href = element.dataset.href;
        link.style.color = 'white';
        link.style.background = 'black';
        link.addEventListener('click', handleClick);

        let appendTarget = element;

        appendTarget = appendTarget.querySelector('.description-block') || appendTarget;

        appendTarget.appendChild(link);
    }

    setInterval(() => {
        for (const element of document.querySelectorAll('[data-href]')) {
            processElement(element);
        }
    }, 1000);

    const mapInterval = setInterval(() => {
        const map = document.querySelector('.map-section');
        const header = document.querySelector('.detail-page');

        if (!map || !header) {
            return;
        }

        clearInterval(mapInterval);

        header.parentElement.insertBefore(map, header);

        window.dispatchEvent(new Event('resize'));
    }, 1000);
})();