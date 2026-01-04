// ==UserScript==
// @name         Taringa V6
// @namespace    https://classic.taringa.net/lavolavo
// @version      1.2
// @description  Olvidate de la v7
// @author       @lavolavo
// @match       *://*.taringa.net/*
// @match       *://*.taringa.com/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376520/Taringa%20V6.user.js
// @updateURL https://update.greasyfork.org/scripts/376520/Taringa%20V6.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function(){
        var url = window.location.href;
        if (url.indexOf('www') > -1){
            url = location.protocol + '//classic.taringa.net' + location.pathname + location.hash;
            window.location.replace(url);
        }
});