// ==UserScript==
// @name         书签地球-免登录链接自动跳转
// @namespace    https://blog.52ipc.top
// @version      0.4
// @description  书签地球免登录链接跳转,点击链接直接跳转无需登录
// @author       blog.52ipc.top
// @match        *://show.bookmarkearth.com/*
// @match        *://www.bookmarkearth.com/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      Mozilla  
// @downloadURL https://update.greasyfork.org/scripts/442066/%E4%B9%A6%E7%AD%BE%E5%9C%B0%E7%90%83-%E5%85%8D%E7%99%BB%E5%BD%95%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/442066/%E4%B9%A6%E7%AD%BE%E5%9C%B0%E7%90%83-%E5%85%8D%E7%99%BB%E5%BD%95%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
        var bookMarkLink = document.getElementsByClassName("link");
        window.open(bookMarkLink[0].innerText);
        window.close();
})();