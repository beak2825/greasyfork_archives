// ==UserScript==
// @name         猫站自动隐藏置顶免费
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  保护猫粮，从我做起
// @author       Adonis142857
// @license      MIT
// @match        https://pterclub.com/details.php?id=*
// @match        https://pterclub.com/detailsgame.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487500/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E7%BD%AE%E9%A1%B6%E5%85%8D%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/487500/%E7%8C%AB%E7%AB%99%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E7%BD%AE%E9%A1%B6%E5%85%8D%E8%B4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements based on text
    function hideElementsByText(text) {
        let elements = document.querySelectorAll('a'); // 假设文本位于锚点标记内
        for(let i = 0; i < elements.length; i++) {
            if(elements[i].textContent.includes(text)) {
                elements[i].style.display = 'none';
            }
        }
    }

    // Hide elements
    hideElementsByText("帖子置顶1天 (将扣除 20,000 克猫粮)");
    hideElementsByText("帖子置顶和免费1天 (将扣除 25,000 克猫粮)");
})();