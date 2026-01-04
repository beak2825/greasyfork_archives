// ==UserScript==
// @name         Better GitHub Gists Code Area
// @namespace    https://github.com/palemoky
// @version      20250325
// @description  Resizes the editor to fit the viewport height, subtracting 500px. Handles window resizing.
// @author       Palemoky
// @license      Apache
// @match        https://gist.github.com/*
// @icon         https://raw.githubusercontent.com/homarr-labs/dashboard-icons/refs/heads/main/webp/github.webp
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530800/Better%20GitHub%20Gists%20Code%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/530800/Better%20GitHub%20Gists%20Code%20Area.meta.js
// ==/UserScript==

'use strict';

function adjustCodeMirrorHeight() {
    requestAnimationFrame(() => {
        const codeMirrorDiv = document.querySelector('.CodeMirror');

        if (codeMirrorDiv && codeMirrorDiv.CodeMirror) {
            const newHeight = document.documentElement.clientHeight - 457;
            codeMirrorDiv.style.height = Math.max(0, newHeight) + 'px';
            codeMirrorDiv.CodeMirror.refresh();
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const debouncedAdjustCodeMirrorHeight = debounce(adjustCodeMirrorHeight, 200);

setTimeout(debouncedAdjustCodeMirrorHeight, 100);

const observer = new MutationObserver(debouncedAdjustCodeMirrorHeight);
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('resize', debouncedAdjustCodeMirrorHeight);
