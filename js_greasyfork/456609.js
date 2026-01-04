// ==UserScript==
// @name         问卷星后台6-管理侧边栏鼠标悬停显示增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  管理侧边栏鼠标悬停显示增强
// @author       罗典
// @match        https://www.wjx.cn/customerservices/admin_main.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456609/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B06-%E7%AE%A1%E7%90%86%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/456609/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B06-%E7%AE%A1%E7%90%86%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    window.onload = function(){
        var z2 = document.getElementsByTagName("frame")[0].contentWindow.document.getElementsByTagName("a");
        var i;
        for (i = 0; i < z2.length; i++) {
            // z2[i].style.font="normal 12px Arial ";
            z2[i].onmouseover = function(){
                // this.style.fontSize = "14px";
                this.style.background= "#dffeaa";
            }
            z2[i].onmouseout = function(){
                // this.style.fontSize = "12px";
                this.style.background= "transparent";
            }
        }
    }
})();