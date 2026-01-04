// ==UserScript==
// @name         Felix Test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369984/Felix%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/369984/Felix%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tool = document.createElement('div');
    tool.style.width = '1rem';
    tool.style.height = '1rem';
    tool.style.lineHeight = '1rem';
    tool.style.backgroundColor = '#E2E2E2';
    tool.style.position = 'fixed';
    tool.style.right = '1rem';
    tool.style.bottom = '1rem';
    tool.style.cursor = 'pointer';
    tool.innerText = 'T';
    tool.style.zIndex = 9999;
    document.body.appendChild(tool);

    tool.onclick = () => {
        let title = document.title;
        let link = location.href;
        const a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.innerText = title;
        //a.style.display = 'none';
        document.body.appendChild(a);

        // Copy to clipboard
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNode(a);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');

        selection.removeAllRanges();
    }
})();