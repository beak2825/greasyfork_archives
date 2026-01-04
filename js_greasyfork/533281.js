// ==UserScript==
// @name         Voxiom Font Changer(Filter Bypasser)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Fast and smooth Unicode letter replacement unless after slash or already replaced, even with fast typing
// @author       qeqe/bestway
// @match        https://voxiom.io/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/533281/Voxiom%20Font%20Changer%28Filter%20Bypasser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533281/Voxiom%20Font%20Changer%28Filter%20Bypasser%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const original = 'aeiouAEIOU';
    const replace = ['𝗮', '𝗲', '𝗶', '𝗼', '𝘂', '𝗔', '𝗘', '𝗜', '𝗢', '𝗨'];

    let wasLastReplaced = false;

    function appendPeriod(str) {
        return str.endsWith('.') ? str : str + '.';
    }

    function handleInput(e) {
        const el = e.target;

        if (!(el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')))) return;

        const cursorPos = el.selectionStart;
        const val = el.value;

        if (!val || cursorPos < 1) {
            wasLastReplaced = false;
            return;
        }

        const lastChar = val[cursorPos - 1];
        const beforeChar = val[cursorPos - 2] || '';

        // Check if last char is target and should be replaced
        const index = original.indexOf(lastChar);
        if (index === -1 || beforeChar === '/' || wasLastReplaced) {
            wasLastReplaced = false;
            return;
        }

        const newChar = replace[index];
        const newVal = val.slice(0, cursorPos - 1) + newChar + val.slice(cursorPos);
        el.value = newVal;
        el.setSelectionRange(cursorPos, cursorPos);
        wasLastReplaced = true;
    }

    function handleKeydown(e) {
        // Reset flag on enter
        if (e.key === 'Enter') {
            const el = e.target;
            if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) {
                el.value = appendPeriod(el.value);
            }
            wasLastReplaced = false;
        }
    }

    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', handleKeydown);
})();
