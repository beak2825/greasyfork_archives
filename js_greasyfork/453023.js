// ==UserScript==
// @name         Business Insider Paywall Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes the article paywall from businessinsider.com
// @author       tickl
// @match        *://www.businessinsider.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453023/Business%20Insider%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/453023/Business%20Insider%20Paywall%20Remover.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("removing business insider modal and putting content back after 1s");
    window.setInterval(function(){
            try{document.querySelector('.tp-modal').remove();}catch(e){}
            try{document.querySelector('.tp-backdrop').remove();}catch(e){}
            try{document.getElementsByClassName("piano-freemium")[0].replaceWith(document.getElementsByClassName("content-lock-content")[0]);}catch(e){}
    }, 1000);
})();