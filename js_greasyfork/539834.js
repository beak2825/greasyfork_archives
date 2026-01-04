// ==UserScript==
// @name         Input Character Counter (Bpomart)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Tracks total characters typed minus deleted ones, excluding spaces, across entire session per input field change.
// @author       John Inbaraj
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539834/Input%20Character%20Counter%20%28Bpomart%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539834/Input%20Character%20Counter%20%28Bpomart%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const counterBox = document.createElement('div');
    counterBox.style.position = 'fixed';
    counterBox.style.top = '10px';
    counterBox.style.right = '10px';
    counterBox.style.padding = '8px 12px';
    counterBox.style.background = '#222';
    counterBox.style.color = '#0f0';
    counterBox.style.fontFamily = 'monospace';
    counterBox.style.zIndex = '9999';
    counterBox.style.borderRadius = '5px';
    counterBox.style.fontSize = '14px';
    counterBox.textContent = 'Session chars (no spaces): 0';
    document.body.appendChild(counterBox);

    let totalCount = 0;
    const previousValues = new WeakMap();

    const updateCounter = (field) => {
        const prev = previousValues.get(field) || '';
        const curr = field.value || '';

        const prevCount = prev.replace(/\s/g, '').length;
        const currCount = curr.replace(/\s/g, '').length;

        const diff = currCount - prevCount;
        totalCount += diff;
        if (totalCount < 0) totalCount = 0;

        counterBox.textContent = `Session chars (no spaces): ${totalCount}`;
        previousValues.set(field, curr);
    };

    document.addEventListener('input', (e) => {
        if (e.target.matches('input[type="text"], textarea')) {
            updateCounter(e.target);
        }
    });

    document.addEventListener('focusin', (e) => {
        if (e.target.matches('input[type="text"], textarea')) {
            previousValues.set(e.target, e.target.value || '');
        }
    });
})();
