// ==UserScript==
// @name         freshrssFont
// @namespace    http://freshrss.yidooplanet.com/
// @version      1.4
// @description  rssfont
// @author       eric
// @match        *://freshrss.yidooplanet.com/*
// @icon         http://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485305/freshrssFont.user.js
// @updateURL https://update.greasyfork.org/scripts/485305/freshrssFont.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('freshrs-------')
        document.addEventListener ("DOMContentLoaded", setstyle()); // 等DOM加载完毕时执行
    function setstyle(){
var bodyDiv=document.getElementsByTagName('html')
       //bodyDiv[0].style.fontSize= "10px ";
        bodyDiv[0].style.setProperty("font-size", "10px", "important");
}
    

})();