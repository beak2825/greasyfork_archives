// ==UserScript==
// @name         Mr.Porter Currency Convert
// @namespace    http://www.charlesw.cn/
// @version      0.2
// @description  Convert porter GBP to RMB
// @author       Chao WANG
// @match        http://www.mrporter.com/*
// @match        https://www.mrporter.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/384531/MrPorter%20Currency%20Convert.user.js
// @updateURL https://update.greasyfork.org/scripts/384531/MrPorter%20Currency%20Convert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rate = 8.75;
    window.onload=function (){
        setInterval(function () {
            $('.pl-products-item__text--price').each(function( ) {
                if($(this).text().indexOf("£") >= 0){
                    $(this).text("¥" + rate*$(this).text().replace(/[^0-9]/ig,""));
                }
            });
        },1000);
    };
})();