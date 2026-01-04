// ==UserScript==
// @name         古诗文网去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除古诗文网右侧及其底部广告
// @author       Logicr
// @match        https://so.gushiwen.org
// @match        *://so.gushiwen.org/*
// @match        *://so.gushiwen.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369906/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/369906/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //$(document).ready(function(){
     $('#btn-readmore').click();

     //去除右边的广告
     $(".right").remove();
     $(".title").remove();
     //删除底部标签
     //删除底部标签，这个使用了load，所以上面的remove()，无法生效。
     window.addEventListener ("load", removeIframe, false);
		 function removeIframe () {
		     $('iframe').remove();
		    }
    
})();