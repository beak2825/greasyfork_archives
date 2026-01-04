// ==UserScript==
// @name         Indie App Sale Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a floating filter-by-device option to indieappsales website
// @author       You
// @match        https://app.indieappsales.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=indieappsales.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480698/Indie%20App%20Sale%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/480698/Indie%20App%20Sale%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const createStickyRadioButtons = () => {
            let containerDiv = document.createElement('div');
            containerDiv.id = 'stickyContainer';
            ['For', 'iOS', 'iPadOS', 'macOS', 'Windows', 'Android'].forEach((x, i) => {
                let radioBtn = document.createElement('input');
                radioBtn.type = 'radio';
                radioBtn.name = 'radioGroup';
                radioBtn.value = x;
                radioBtn.id = 'filter' + i;
                radioBtn.addEventListener('click', () => filter(x));
                containerDiv.appendChild(radioBtn);
                containerDiv.appendChild(document.createTextNode(x === 'For' ? 'All' : x));
            })

            document.body.appendChild(containerDiv);
        }

        createStickyRadioButtons();

        let style = document.createElement('style');
        style.innerHTML = `
  #stickyContainer {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #f1f1f1;
    padding: 10px;
    text-align: center;
    justify-content: space-between;
  }
`;
        document.head.appendChild(style);

        const allItems = document.querySelectorAll('tr');

        const restoreAll = () => allItems.forEach(x => x.style.display = 'block');

        const filter = (device) => {
            restoreAll();
            allItems.forEach(x => {
                if (!x.querySelectorAll('p')[1]?.innerText.includes(device)) {
                    x.style.display = 'none';
                }
            });
        }
    }, 2000)
})();