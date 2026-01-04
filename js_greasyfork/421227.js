// ==UserScript==
// @name         legendas.tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download direto da página de busca
// @author       Jonathan Trancozo
// @match        http://legendas.tv/busca/*
// @icon         https://www.google.com/s2/favicons?domain=legendas.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421227/legendastv.user.js
// @updateURL https://update.greasyfork.org/scripts/421227/legendastv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        $('#resultado_busca p:first-child a').each(function(){
            var url = this.href.split('/');
            var download = url[4];

            $(this).removeAttr('href');
            $(this).attr('onclick',"window.open('/downloadarquivo/"+download+"', '_self')");
        });
    },1000);
})();