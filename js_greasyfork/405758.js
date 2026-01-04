// ==UserScript==
// @name        muahahaha whatsapp api
// @namespace   muahahaha
// @version     1.0.1
// @include     https://api.whatsapp.com/send?*
// @run-at      document-end
// @grant       unsafeWindow
// @description auto click to send msg
// @license      © 2022
// @downloadURL https://update.greasyfork.org/scripts/405758/muahahaha%20whatsapp%20api.user.js
// @updateURL https://update.greasyfork.org/scripts/405758/muahahaha%20whatsapp%20api.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function run_iir(func){
        if(document.readyState==='complete'){
            func();
        }
        else{
            window.addEventListener('load',func);
        }
    }

    run_iir(function() {
        console.log(15789)
        document.querySelector('#action-button').click()
    });
})();