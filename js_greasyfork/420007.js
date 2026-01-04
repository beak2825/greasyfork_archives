// ==UserScript==
// @name         hd.kinopoisk.ru кнопка справа
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Кнопка закрытия фильма справа
// @author       ZardoZ
// @match        https://hd.kinopoisk.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420007/hdkinopoiskru%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/420007/hdkinopoiskru%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const config = { attributes: false, childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const btn = document.querySelector('div[class*=Layout__top--]');

                if (btn !== undefined) {
                    btn.style.left = 'unset';
                    btn.style.right = '10px';
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    setTimeout(function() {
        const targetNode = document.querySelector('div[class*=PlayerSkin__root--]');
        observer.observe(targetNode, config);
    }, 2500);
})();