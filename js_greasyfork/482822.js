// ==UserScript==
// @name         AutoHide LZT
// @namespace    AutoHide LZT
// @version      1.12
// @description  AutoHide zelenka.guru
// @author       naithy
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      naithy
// @downloadURL https://update.greasyfork.org/scripts/482822/AutoHide%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/482822/AutoHide%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userId = [3812139, 6266214, 4899613];
    window.setTimeout(() => {
        const sendButton = document.querySelector('button.lzt-fe-se-sendMessageButton');
        const hideButton = document.getElementById('lztHide-1');
        const div = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible');
        if (sendButton && div) {
            sendButton.addEventListener('click', () => {
                const elements = [];
                const childElements = div.children;
                if (childElements.length > 1) {
                    for (let i = 0; i < childElements.length; i++) elements.push(childElements[i].outerHTML);
                } else if (childElements[0].children.length == 0) {
                    elements.push(childElements[0].outerText)
                } else {
                    elements.push(childElements[0].outerHTML)
                }

                if (!div.innerHTML.includes('data-option') && elements.length > 1 && !div.innerHTML.includes('[/exceptids]')) div.innerHTML = `[exceptids=${userId.join(",")}]` + elements.join("") + "[/exceptids]"
                if (!div.innerHTML.includes('data-option') && elements.length == 1 && !div.innerHTML.includes('[/exceptids]')) div.innerHTML = `<p>[exceptids=${userId.join(",")}]` + elements.join("") + "[/exceptids]</p>"
            });
            hideButton.addEventListener('click', () => {
                if (div.innerHTML.includes('data-option')) div.innerHTML = ''
            })
        }
    }, 500);
})();