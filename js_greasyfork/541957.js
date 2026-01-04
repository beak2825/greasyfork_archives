// ==UserScript==
// @name         Google Video Date Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author		 aket0r
// @description  Добавляет фильтр по дате к видео в поиске Google
// @match        https://www.google.com/search*
// @grant        none
// @license      MIT
// @icon         https://raw.githubusercontent.com/aket0r/Google-Video-Date-Filter/main/Google%20Video%20Date%20Filter.png
// @downloadURL https://update.greasyfork.org/scripts/541957/Google%20Video%20Date%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/541957/Google%20Video%20Date%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createFilterElement() {
        const path = document.querySelector('.crJ18e');
        if (!path || document.querySelector('#sorting-by')) return;

        const filterElement = document.createElement('div');
        filterElement.className = 'sorting-by';
        filterElement.innerHTML = `<input style="border: 1px solid #444; padding: 2px 5px; font-size: 15px; outline: none; cursor: text;" title="use '0' to reset filter" type="number" id="sorting-by" placeholder="2012, 2020, 2021... ${new Date().getFullYear()}">`;
        path.append(filterElement);

        document.querySelector("#sorting-by").addEventListener("keyup", function (e) {
            if (this.value.trim() === '') return;
            if (e.code === 'Enter' || e.code === 'Space') {
                console.log(`%crunning with date: ${this.value} y.`, 'color: yellow');
                initFilter(+this.value);
            }
        });
    }

    function initFilter(setDate = new Date().getFullYear()) {
        console.log('event: initFilter');
        document.querySelectorAll(".MjjYud > div").forEach(el => {
            let date = el.querySelector('.YrbPuc');
            try {
                let t = date.innerText.split(' ');
                let currDate = +t[t.length - 1].replace('г.' || 'y.', '').trim();
                if (currDate < setDate) {
                    el.style.display = 'none';
                } else if (setDate === 0) {
                    el.style.display = 'block';
                }
            } catch(e) {
                console.warn('user-script error: ', e);
            }
        });
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.crJ18e') && !document.querySelector('#sorting-by')) {
            createFilterElement();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
