// ==UserScript==
// @name         汉阳廷自助抢卷
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解放双手
// @author       毛怪
// @match        https://meishi.meituan.com/i/order/696103191
// @icon         https://th-is.top/QMA/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/429889/%E6%B1%89%E9%98%B3%E5%BB%B7%E8%87%AA%E5%8A%A9%E6%8A%A2%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/429889/%E6%B1%89%E9%98%B3%E5%BB%B7%E8%87%AA%E5%8A%A9%E6%8A%A2%E5%8D%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload= function(){
    var btn=document.querySelector(".btn-larger")
    setInterval(function(){if(btn){btn.click()}else{location.reload()}},500)
    }
})();