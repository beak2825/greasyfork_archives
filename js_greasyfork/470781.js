// ==UserScript==
// @name         bookwalker spesial auto fetch
// @icon https://bookwalker.jp/favicon.ico
// @namespace    REG
// @version      1.8
// @match        https://bookwalker.jp/member/bonus-item/*
// @grant        none
// @description bookwalker.jpの得点ページの改善
// @downloadURL https://update.greasyfork.org/scripts/470781/bookwalker%20spesial%20auto%20fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/470781/bookwalker%20spesial%20auto%20fetch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let day;
    let currentPageIndex;

    const selectElement = document.querySelector('select.a-mu-selectbox__select'); // セレクタ修正
    const nowUrl = window.location.href;

    const optionValues = Array.from(selectElement.options).map(option => option.value);

    if (nowUrl.includes('=')) {
        day = nowUrl.split('=')[1];
        currentPageIndex = optionValues.indexOf(day);
        console.log(currentPageIndex);
        if (currentPageIndex === -1) {
            currentPageIndex = 1;
        } else {
            currentPageIndex = currentPageIndex+1;
        }
    } else {
        currentPageIndex = 1;

    }

    window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            loadNextPageElements();
        }
    });

    function loadNextPageElements() {
        if (currentPageIndex >= optionValues.length) {
            return;
        }

        const nextOptionValue = optionValues[currentPageIndex];
        const nextPageUrl = 'https://bookwalker.jp/member/bonus-item/?ym=' + nextOptionValue;

        const xhr = new XMLHttpRequest();
        xhr.open('GET', nextPageUrl, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = xhr.responseText;
                const parser = new DOMParser();
                const nextPageDocument = parser.parseFromString(response, 'text/html');
                const nextPageElements = Array.from(nextPageDocument.querySelectorAll('div.o-mu-bonus-item')); // セレクタ修正

                const targetDiv = document.querySelector('div.p-mu-bonus-item__wrap'); // セレクタ修正
                for (let i = 0; i < nextPageElements.length; i++) {
                    const nextElement = nextPageElements[i].cloneNode(true);
                    targetDiv.appendChild(nextElement);
                }

                currentPageIndex++;
            }
        };
        xhr.send();
    }
})();
