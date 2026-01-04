// ==UserScript==
// @name         Telegram Unicode First Char Fix
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Revives lost first Unicode char + appends full word (without first letter) if Unikey mod char used
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540967/Telegram%20Unicode%20First%20Char%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540967/Telegram%20Unicode%20First%20Char%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isUnicode = (char) => char && char.charCodeAt(0) > 127;
    const isWeirdChar = (char) => char === '·' || char === '`';

    let lastChar = '';
    let watching = false;
    let cachedWord = '';
    let hasUnikeyMod = false;

    window.addEventListener('beforeinput', (e) => {
        const input = document.querySelector('div.input-message-input');
        if (!input) return;

        const content = input.textContent || '';

        // ✅ Store cached word when weird Unikey mark is typed
        if (isWeirdChar(e.data)) {
            const words = content.trim().split(/\s+/).filter(Boolean);
            if (words.length === 1) {
                cachedWord = words[0];
                hasUnikeyMod = true;
                //console.log('💾 Cached word:', JSON.stringify(cachedWord));
            }
            return;
        }

        // 🛠️ Only care about first unicode char AND empty box
        if (!e.data || content.length > 0) return;

        if (isUnicode(e.data)) {
            lastChar = e.data;
            //console.log('🔍 First char is unicode:', lastChar);

            if (watching) return;
            watching = true;

            const check = setInterval(() => {
                if (!input.isConnected) {
                    clearInterval(check);
                    watching = false;
                    return;
                }

                if ((input.textContent || '') === '') {
                    let finalText = lastChar;

                    if (hasUnikeyMod && cachedWord.length > 1) {
                        finalText += cachedWord.slice(1); // drop first char
                        //console.log('🧬 Appended from cache:', JSON.stringify(cachedWord.slice(1)));
                    }

                    input.textContent = finalText;
                    input.dispatchEvent(new InputEvent('input', { bubbles: true }));

                    const sel = window.getSelection();
                    sel.collapse(input.lastChild || input, input.textContent.length);

                    // 🔁 Reset flags
                    cachedWord = '';
                    hasUnikeyMod = false;
                    watching = false;
                    clearInterval(check);
                } else {
                    watching = false;
                    clearInterval(check);
                }
            }, 10);
        }
    });
})();
