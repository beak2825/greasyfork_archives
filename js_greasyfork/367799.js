// ==UserScript==
// @name         61B Slides Downloader
// @namespace    jimbo1qaz
// @version      0.1
// @description  Replace 61B Google Slides URLs with fast-rendering PDF links.
// @author       You
// @match        *://datastructur.es/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/367799/61B%20Slides%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/367799/61B%20Slides%20Downloader.meta.js
// ==/UserScript==

(()=>{
    'use strict';

    console.log('foo');

    // before: https://docs.google.com/presentation/d/1ySYTxnvoHJc7_2U0L90WH3kx0toWA4vpNiIR2r1vqKU
    for (let el of document.getElementsByTagName("a")) {
        if (el.href.includes('docs.google.com/presentation')) {
            let tag = el.href.split('/')[5];
            el.href = `https://docs.google.com/presentation/d/${tag}/export/pdf`;
        } else {
            console.log(el.href);
        }
    }
})();