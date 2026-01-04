// ==UserScript==
// @run-at      document-start
// @version     1.0.0
// @name        YouTube shorts redirector
// @namespace   https://github.com/emmaexe/userscripts
// @author      emmaexe
// @description Redirect all youtube shorts to the regular youtube player.
// @license     GPL-3.0-only
// @homepageURL https://github.com/emmaexe/userscripts
// @supportURL  https://github.com/emmaexe/userscripts/issues
// @include     *://youtube.*/*
// @include     *://*.youtube.*/*
// @icon        https://raw.githubusercontent.com/emmaexe/userscripts/main/youtube-shorts-redirector/assets/youtube-ico-32.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/454054/YouTube%20shorts%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/454054/YouTube%20shorts%20redirector.meta.js
// ==/UserScript==

function shortsCheck(mutation){
    if (location.href.includes('/shorts/')) {
        location.replace(location.href.replace('/shorts/', '/watch?v='))
    }
}

shortsCheck();

const shortsObserver = new MutationObserver(shortsCheck).observe(document, {subtree: true, childList: true});