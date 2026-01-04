// ==UserScript==
// @name         www.5imv.cc命名视频集数标题
// @version      0.1
// @description  www.5imv.cc命名视频集数标题。
// @author       You
// @run-at       document-end
// @match        https://www.5imv.cc/*
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/455240/www5imvcc%E5%91%BD%E5%90%8D%E8%A7%86%E9%A2%91%E9%9B%86%E6%95%B0%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/455240/www5imvcc%E5%91%BD%E5%90%8D%E8%A7%86%E9%A2%91%E9%9B%86%E6%95%B0%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {

if (location.hostname.indexOf("www.5imv.cc") < 0) return;
document.title = document.querySelector('h1.title').textContent + document.querySelector('div.data').textContent;
// 后续代码

})();