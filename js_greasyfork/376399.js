// ==UserScript==
// @name         Grab Link Toped
// @namespace    http://tampermonkey.net/
// @version      0.20.91
// @description  Go to 10 Ribu Orderan Per Hari!
// @author       Jamielcs
// @match        https://www.tokopedia.com/manage-product-new.pl*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376399/Grab%20Link%20Toped.user.js
// @updateURL https://update.greasyfork.org/scripts/376399/Grab%20Link%20Toped.meta.js
// ==/UserScript==
(function() {
    'use strict';
 $('div.maincontent-admin.maincontent-admin--manageProduct').first().prepend($('\
<textarea id="kws" style="width:99%" rows=15></textarea>\
<button class="getlinktoped" style="display:block;width:100%;background:black;color:white">Get LInk</button>\
'));
    $('.getlinktoped').click(function(){
        var kws = document.getElementById('kws');
        kws.value='';
        var as = document.querySelectorAll('a.break-link.fs-13.fw-600.el');
        for(var i = 0; i < as.length; i++) {
            var anchor = as[i].pathname.split(/[\/\.]/).sort(function(a, b) { return b.length - a.length; }).shift().replace(/[-_\s]+/g,' ');
            var kw = as[i];
            if(kw) kws.value = kws.value+'<a target="_blank" href="'+decodeURIComponent(kw)+'">'+(anchor)+'</a><br/>\n';
        }
    });
})();
