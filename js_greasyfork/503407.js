// ==UserScript==
// @name         Google, DeepL, Bing, Papago And Yandex Translate Swap Languages And Copy Translation Hotkeys
// @author       NWP
// @description  Enables Alt + Z to copy translated text and Ctrl + Shift + S to swap languages for Google, DeepL, Bing, Papago And Yandex Translate
// @namespace    https://greasyfork.org/users/877912
// @version      0.3
// @license      MIT
// @match        https://translate.google.com/*
// @match        https://www.deepl.com/*/translator*
// @match        https://www.bing.com/translator*
// @match        https://papago.naver.com/*
// @match        https://translate.yandex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503407/Google%2C%20DeepL%2C%20Bing%2C%20Papago%20And%20Yandex%20Translate%20Swap%20Languages%20And%20Copy%20Translation%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/503407/Google%2C%20DeepL%2C%20Bing%2C%20Papago%20And%20Yandex%20Translate%20Swap%20Languages%20And%20Copy%20Translation%20Hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickElement(element) {
        if (element) {
            element.click();
        }
    }

    function handleKeydown(event) {
        // Alt + Z for copying translated text
        if (event.altKey && event.key === 'z') {
            const googleCopyButton = document.querySelector('button[jsname="kImuFf"]');
            clickElement(googleCopyButton);

            const deepLCopyButton = document.querySelector('button[data-testid="translator-target-toolbar-copy"]');
            clickElement(deepLCopyButton);

            const bingCopyButton = document.querySelector('div#tta_copyIcon');
            clickElement(bingCopyButton);

            const papagoCopyButton = document.querySelectorAll('button[id][class="btn_copy___3T223"][title][type="button"]')[1];
            clickElement(papagoCopyButton);

            const yandexCopyButton = document.querySelector('#copyButtonDst');
            clickElement(yandexCopyButton);
        }

        // Ctrl + Shift + S for swapping languages
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            const deepLSwapButton = document.querySelector('button[data-testid="lmt_language_switch"]');
            clickElement(deepLSwapButton);

            const bingSwapButton = document.querySelector('div#tta_revIcon');
            clickElement(bingSwapButton);

            const papagoSwapButton = document.querySelector('button[id][class="btn_switch___x4Tcl"]');
            clickElement(papagoSwapButton);

            const yandexSwapButton = document.querySelector('button[class="gTx50DUfJa1q57Z9sbM6 t3nFXmxYr19rwmJaBoHg yZ0odbAnIl__RMrmbWuA SNvWOiTv0bJTav0uo4Y6 nit1qvNY5o0LAHqo2TZ2 hf9lG6bClwoi5q7Cs1uQ"]');
            clickElement(yandexSwapButton);
        }
    }

    document.addEventListener('keydown', handleKeydown, false);
})();