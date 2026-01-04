// ==UserScript==
// @name         Codelab Anti-Spellcheck
// @namespace    ncg
// @version      0.1
// @description  Disables Spellcheck on Codelab textboxes
// @author       Noah Green
// @match        https://codelab3.turingscraft.com/codelab/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34611/Codelab%20Anti-Spellcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/34611/Codelab%20Anti-Spellcheck.meta.js
// ==/UserScript==

const page = document.getElementById('corecontent');

const mutationObserver = new MutationObserver(_ => {
    const textArea = document.querySelector('.CodeMirror textarea');
    textArea.setAttribute('spellcheck', 'false');
});

mutationObserver.observe(page, { childList: true, subtree: true });
