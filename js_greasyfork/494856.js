// ==UserScript==
// @name         Ruangguru / Roboguru Unlocker
// @name:id      Ruangguru / Roboguru Unlocker
// @namespace    http://github.com/bramar2
// @version      1.1
// @description  Unlock Ruangguru,Roboguru answers
// @description:id Dapatkan jawaban Roboguru . ruangguru com
// @author       bramar2
// @match        *://*.ruangguru.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GNU GPL v3
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/494856/Ruangguru%20%20Roboguru%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/494856/Ruangguru%20%20Roboguru%20Unlocker.meta.js
// ==/UserScript==
for(let i = 1; i <= 6; i++) {
    setTimeout(function() {
        for(let answerChakraStackRoot of document.querySelectorAll('.chakra-stack:has(> .paywall-lock)')) {
            answerChakraStackRoot.querySelectorAll('& > .chakra-stack:not(.lock-discussions):not(.paywall-lock)').forEach((z) => z.style.display = 'none');
            answerChakraStackRoot.querySelectorAll('& > .chakra-stack.lock-discussions').forEach((z) => {
                if(z.getAttribute('data-cleared-by-rg-unlocker')) return;
                z.setAttribute('data-cleared-by-rg-unlocker', '');
                let style = z.style;
                style.maxHeight = "initial";
                style.overflow = "initial";
                style.pointerEvents = "initial";
                style.maskImage = "initial";
                style.webkitMaskImage = "initial";
            });
        }
        for(let b of document.querySelectorAll('.adswall-lock')) {
            b.style.display = 'none';
        }
        for(let a of document.querySelectorAll('.qns_short_answer')) {
            a.style.display = 'flex';
        }
        for(let a of document.querySelectorAll('.qns_explanation_answer')) {
        //max-height: inherit, overflow: inherit, mask-image: inherit, -webkit-mask-image: inherit
            a.style.maxHeight = "inherit";
            a.style.overflow = "inherit";
            a.style.maskImage = "inherit";
            a.style.setAttribute('-webkit-mask-image', 'inherit');
        }
    }, i * 1000);
}