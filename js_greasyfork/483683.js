// ==UserScript==
// @name         mypepe LZT
// @namespace    AutoHide LZT
// @version      1.05
// @description  AutoHide LZT
// @author       naithy
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      naithy
// @downloadURL https://update.greasyfork.org/scripts/483683/mypepe%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/483683/mypepe%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';
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
                elements.push(":pepelogout:")
                if (!div.innerHTML.includes('data-option') && elements.length > 1 && !div.innerHTML.includes('[/exceptids]')) div.innerHTML = elements.join("")
                if (!div.innerHTML.includes('data-option') && elements.length == 1 && !div.innerHTML.includes('[/exceptids]')) div.innerHTML = + elements.join("")
            });
            hideButton.addEventListener('click', () => {
                if (div.innerHTML.includes('data-option')) div.innerHTML = ''
            })
        }
    }, 500);
})();