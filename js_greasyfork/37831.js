// ==UserScript==
// @name         浏览器打开图片居中
// @namespace    http://css.thatwind.com/
// @version      1.0
// @description  让在浏览器中打开的图片居中
// @author       遍智
// @match        *://*/*.png
// @match        *://*/*.jp*g
// @match        *://*/*.gif
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37831/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80%E5%9B%BE%E7%89%87%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/37831/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80%E5%9B%BE%E7%89%87%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';



    document.addEventListener("DOMContentLoaded",go);

    go();


    function go(){
        var x="img{position:absolute;left:0;right:0;margin:auto;}";
        var y=document.createElement('style');
        y.innerHTML=x;
        document.getElementsByTagName('head')[0].appendChild(y);
    }

})();