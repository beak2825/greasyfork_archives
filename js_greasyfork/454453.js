// ==UserScript==
// @name         gmail_filter
// @namespace    https://mesak.tw
// @version      0.1
// @description  gmail filter page work break
// @author       Mesak
// @license MIT
// @match        https://mail.google.com/mail/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454453/gmail_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/454453/gmail_filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .wbba {word-break: break-all;}
    `);
    window.addEventListener('popstate', (event) => {
        const url = new URL(document.location);
        if( url.hash == '#settings/filters'){
            const mainBody = document.querySelector('div[role="main"]');
            buildEvent(mainBody)
        }
    });
    function buildEvent( body ){
        for(let span of body.querySelectorAll('tr[role="listitem"] > td:nth-child(2) > span') ){
           span.classList.add("wbba");
        }
    }
})();