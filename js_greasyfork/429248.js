// ==UserScript==
// @name         web扫雷
// @namespace    https://greasyfork.org/zh-CN/scripts/429248-web%E6%89%AB%E9%9B%B7
// @version      0.12
// @description  自己用
// @author       soddiao
// @grant        none
// @include      *://mu.xyhero.com/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429248/web%E6%89%AB%E9%9B%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/429248/web%E6%89%AB%E9%9B%B7.meta.js
// ==/UserScript==
(function() {
var a = $("iframe[name='iframe_1']");
 		//a.height(700);
var b = $('input[name*="data"]');
    b.attr('type','text');
    b.css('width',20);
    b.each(function(){
        if($(this).val() == 100){
        $(this).css('color','red');
    }
    });

})();