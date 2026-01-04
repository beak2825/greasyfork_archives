// ==UserScript==
// @name         9dm搜索隐藏计算
// @namespace    gloryangel
// @version      0.6
// @description  9dm搜索自动隐藏计算
// @author       gloryangel
// @match        *://*.9d*game*.*/search.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454643/9dm%E6%90%9C%E7%B4%A2%E9%9A%90%E8%97%8F%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/454643/9dm%E6%90%9C%E7%B4%A2%E9%9A%90%E8%97%8F%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==
(function() {
    const mask = document.querySelector(".my-mask")
    if(mask){
        mask.style.display = "none";
    }
})();