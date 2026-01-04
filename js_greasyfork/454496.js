// ==UserScript==
// @name  解决淘宝商品无法读出尺码和颜色的问题
// @namespace  https://accjs.org/
// @version  0.1
// @description  解决淘宝商品无法读出尺码和颜色等问题
// @author  杨永全
// @updated  2022-11-09
// @match  https://item.taobao.com/item.htm*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/454496/%E8%A7%A3%E5%86%B3%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E6%97%A0%E6%B3%95%E8%AF%BB%E5%87%BA%E5%B0%BA%E7%A0%81%E5%92%8C%E9%A2%9C%E8%89%B2%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/454496/%E8%A7%A3%E5%86%B3%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E6%97%A0%E6%B3%95%E8%AF%BB%E5%87%BA%E5%B0%BA%E7%A0%81%E5%92%8C%E9%A2%9C%E8%89%B2%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
setTimeout(() => document.querySelectorAll('a').forEach(a => a.setAttribute('aria-label', a.textContent)), 1500);
})();
