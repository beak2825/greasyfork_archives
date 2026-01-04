// ==UserScript==
// @name         禁止图片加载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  clear image
// @author       Zszen
// @match        https://*/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381413/%E7%A6%81%E6%AD%A2%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/381413/%E7%A6%81%E6%AD%A2%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        $('div img').remove();//移除所有在div中的图片
        $('canvas').remove();
    })
    // Your code here...
})();