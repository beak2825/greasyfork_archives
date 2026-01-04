// ==UserScript==
// @name         LZT Anti Hide
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  this.account.delete();
// @author       @Aisan
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://zelenka.guru/threads/*
// @icon         https://nztcdn.com/avatar/l/1724225284/3498309.webp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515354/LZT%20Anti%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/515354/LZT%20Anti%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBbCodeHide() {
        const bbCodeHideElements = document.querySelectorAll('.bbCodeHide');
        bbCodeHideElements.forEach(element => {
            const parent = element.parentNode;
            if (parent && element.querySelector('.quoteContainer')) {
                const quoteContent = element.querySelector('.quoteContainer').innerHTML;
                if (quoteContent && element.querySelector('.quoteContainer .quote')) {
                    const quote = element.querySelector('.quoteContainer .quote').innerHTML;
                    if (quote.startsWith('Скрытый контент')) return;
                }
                const wrapper = document.createElement('div');
                wrapper.innerHTML = quoteContent;
                parent.replaceChild(wrapper, element);
            } else {
                element.remove();
            }
        });

        const quoteExpandElements = document.querySelectorAll('.quoteExpand');
        quoteExpandElements.forEach(element => element.remove());
    }

    setInterval(() => {
        removeBbCodeHide();
    }, 100)
})();