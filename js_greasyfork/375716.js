// ==UserScript==
// @name         巴哈關閉圖片延遲載入
// @namespace    https://home.gamer.com.tw/Mogeko12345
// @version      1.0
// @description  關閉巴哈姆特的圖片延遲載入功能
// @author       mogeko12345
// @match        https://forum.gamer.com.tw/C.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375716/%E5%B7%B4%E5%93%88%E9%97%9C%E9%96%89%E5%9C%96%E7%89%87%E5%BB%B6%E9%81%B2%E8%BC%89%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/375716/%E5%B7%B4%E5%93%88%E9%97%9C%E9%96%89%E5%9C%96%E7%89%87%E5%BB%B6%E9%81%B2%E8%BC%89%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lazyloadImg = document.querySelectorAll("img.lazyload");
    lazyloadImg.forEach((img) => {
        img.classList.remove("lazyload");
        img.src = img.dataset.src;
    });
})();