// ==UserScript==
// @name         Edge双击关闭当前页面
// @namespace    http://tampermonkey.net/
// @match        http*://*/*
// @version      0.1
// @description  在当前网页中双击左键关闭当前页面.注意：由于浏览器的权限限制，某些页面(自己手动打开的标签页，浏览器内置页，受浏览器保护的页面等)无法使用双击左键关闭，请鼠标移至标签页上方点击'X'关闭
// @author       小飞机
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420574/Edge%E5%8F%8C%E5%87%BB%E5%85%B3%E9%97%AD%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/420574/Edge%E5%8F%8C%E5%87%BB%E5%85%B3%E9%97%AD%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

    var chuangkouo = window;
    chuangkouo.ondblclick = function(){
        window.location.href="";
        window.close();
    };