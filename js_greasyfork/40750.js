/*jshint esversion: 6 */
// ==UserScript==
// @name         xHamster auto-english
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change xHamster default language to english
// @author       Guillegt
// @match        https://*.xhamster.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/40750/xHamster%20auto-english.user.js
// @updateURL https://update.greasyfork.org/scripts/40750/xHamster%20auto-english.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regex = /(https:\/\/)(.*\.)(xhamster.com.*)/;
    if(Cookies.get('lang') !== "en"){
        //document.cookie.lang = "en";
        Cookies.set('lang', 'en',{domain: '.xhamster.com'});
        let url = window.location.href;
        let rx = regex.exec(url);
        console.log(rx);
        if(rx !== null){
            window.location.href = rx[1]+rx[3];
        }else{
            location.reload();
        }
    }
})();