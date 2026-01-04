// ==UserScript==
// @name     Zhihu Page Modification
// @namespace https://www.zhihu.com/
// @version  2
// @description Enter something useful
// @grant    none
// @match    https://www.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/481499/Zhihu%20Page%20Modification.user.js
// @updateURL https://update.greasyfork.org/scripts/481499/Zhihu%20Page%20Modification.meta.js
// ==/UserScript==

window.onload = function() {
    // 选取并删除第二个块
    var block2 = document.querySelector('#root > div > main > div > div.Topstory-container > div.css-1qyytj7');
    if (block2 != null) {
        block2.parentNode.removeChild(block2);
    }

    // 选取并使第一个块居中
    var block1 = document.querySelector('#root > div > main > div > div.Topstory-container > div.Topstory-mainColumn');
    if (block1 != null) {
        block1.style.margin = '0 auto';
    }

    // 选取并删除指定元素
    var elementToDelete = document.querySelector('#root > div > main > div > div.Search-container > div.css-knqde');
    if (elementToDelete) {
        elementToDelete.parentNode.removeChild(elementToDelete);
    }

    // 选取并使特定元素在水平方向上居中
    var elementToCenter = document.querySelector('.SearchMain');
    if (elementToCenter) {
        elementToCenter.style.marginLeft = 'auto';
        elementToCenter.style.marginRight = 'auto';
        elementToCenter.style.display = 'block';
    }
};