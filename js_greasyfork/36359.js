// ==UserScript==
// @name         Fk Cnbeta
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cnbeta红色广告栏自动点击关闭
// @author       inmyfree
// @match        *.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36359/Fk%20Cnbeta.user.js
// @updateURL https://update.greasyfork.org/scripts/36359/Fk%20Cnbeta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function FkCnbeta() {
        $("div").each(function(){
            if($(this).text() == "X"){
                //console.log($(this).text());
                $(this).click();
            }
        });
    }
    window.setInterval(FkCnbeta, 500);
    FkCnbeta();
})();