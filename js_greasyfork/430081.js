// ==UserScript==
// @name         QQ打开非官方网页自动跳转
// @description  QQ打开非官方网页自动跳转！无需手动复制打开，释放你的双手
// @version      0.1
// @author       Panda1337
// @match        https://c.pc.qq.com/**
// @namespace https://greasyfork.org/users/730524
// @downloadURL https://update.greasyfork.org/scripts/430081/QQ%E6%89%93%E5%BC%80%E9%9D%9E%E5%AE%98%E6%96%B9%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/430081/QQ%E6%89%93%E5%BC%80%E9%9D%9E%E5%AE%98%E6%96%B9%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

var a =window.location.href;
var u = "https://"+decodeURIComponent(a.split('pfurl=')[1].split('&')[0]).replace("https://","").replace("http://","");
console.log(u);
window.location.href = u;