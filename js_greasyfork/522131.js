// ==UserScript==
// @name         PybGen download Pybgame
// @namespace    http://tampermonkey.net/
// @version      2024-12-28
// @description  Download PybGame from PybGen!
// @author       You
// @match        https://romw314.com/priv0/pybgen0/*
// @icon         https://romw314.com/priv0/pybgen0/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/522131/PybGen%20download%20Pybgame.user.js
// @updateURL https://update.greasyfork.org/scripts/522131/PybGen%20download%20Pybgame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const controls = document.getElementById('controls');
    const codeContainer = document.getElementById('generatedCode');
    const downloadPybgameButton = document.createElement('button');
    downloadPybgameButton.textContent = 'Download Pybgame';
    downloadPybgameButton.addEventListener('click', () => {
        if (!window.confirm('-- WARNING --\nThis will erase all your blocks from the workspace.\nDo you want to continue?\n\n  (Use an empty project if you don\'t want to clear this project)')) return;
        __PYBGEN__.workspace.clear();
        __PYBGEN__.workspace.newBlock('pybgame_new');
        const finishDownload = () => {
            if (!codeContainer.value.startsWith('class Pybgame:\n') || !codeContainer.value.endsWith('\n\n\nPybgame()\n'))
                return setTimeout(finishDownload, 100);
            const pybgameCode = codeContainer.value.split('\n\n\n').slice(0, -1).join('\n\n\n');
            __PYBGEN__.workspace.clear();
            const objectURL = URL.createObjectURL(new Blob([pybgameCode]));
            const a = document.createElement('a');
            a.href = objectURL;
            a.download = 'pybgame.py';
            document.body.appendChild(a);
            a.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
            document.body.removeChild(a);
        };
        finishDownload();
    });
    controls.appendChild(downloadPybgameButton);
})();