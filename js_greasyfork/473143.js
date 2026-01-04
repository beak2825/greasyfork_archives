// ==UserScript==
// @license MIT
// @name         Statiy okazalos xuiney
// @namespace    https://zelenka.guru/
// @version      0.3
// @description  666
// @author       syshchik
// @include      /^https:\/\/(lolz\.guru|zelenka\.guru)/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473143/Statiy%20okazalos%20xuiney.user.js
// @updateURL https://update.greasyfork.org/scripts/473143/Statiy%20okazalos%20xuiney.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = [
        {
            original: /Этот материал оказался полезным\?/g,
            replacement: 'Эта статья оказалась хуйнёй?'
        },
        {
            original: /Отблагодарить автора/g,
            replacement: ' 👊🏻 Дать пизды автору'
        },
        {
            original: /Вы можете отблагодарить автора темы путем перевода средств на баланс/g,
            replacement: 'Вы можете скинуть на лечение автору темы путем перевода средств на баланс'
        },
        {
            original: /Перевести средства/g,
            replacement: 'Перевести средства на лечение'
        }
    ];

    function replaceText() {
        const textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = textNodes.nextNode()) {
            replacements.forEach(({ original, replacement }) => {
                node.nodeValue = node.nodeValue.replace(original, replacement);
            });
        }
    }

    replaceText();

    var element = document.querySelector('span.icon.leftIcon.thankAuthorButtonIcon');
    if (element) {
        element.remove();
    }
})();
