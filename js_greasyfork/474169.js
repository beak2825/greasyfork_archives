// ==UserScript==
// @name         Steam前端强制显示所有筛选偏好
// @namespace    http://shenhaisu.cc/
// @version      1.0
// @description  用来调整Steam偏好里的筛选用的
// @author       DaoluoLTS
// @match        https://store.steampowered.com/account/preferences/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474169/Steam%E5%89%8D%E7%AB%AF%E5%BC%BA%E5%88%B6%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E7%AD%9B%E9%80%89%E5%81%8F%E5%A5%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/474169/Steam%E5%89%8D%E7%AB%AF%E5%BC%BA%E5%88%B6%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E7%AD%9B%E9%80%89%E5%81%8F%E5%A5%BD.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll(".account_settings_container > .preference_row").forEach(item => {
        item.className = "preference_row";
    });
})();