// ==UserScript==
// @name         ASUS 自動加入購物車(1)
// @namespace    http://store.asus.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://store.asus.com/tw/item/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34795/ASUS%20%E8%87%AA%E5%8B%95%E5%8A%A0%E5%85%A5%E8%B3%BC%E7%89%A9%E8%BB%8A%281%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34795/ASUS%20%E8%87%AA%E5%8B%95%E5%8A%A0%E5%85%A5%E8%B3%BC%E7%89%A9%E8%BB%8A%281%29.meta.js
// ==/UserScript==

(function() {
    $('#item_add_cart').get(0).click();
    var newwin = window.open();   // 此行一定要如此書寫, 否則失效
    newwin.location= "https://shop-tw1.uitox.com/AW000013/lists";   // url 是 cgi 程式或者超連結 html
    //document.location.href="https://shop-tw1.uitox.com/AW000013/lists";
})();