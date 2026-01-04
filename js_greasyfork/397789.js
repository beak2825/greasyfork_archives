// ==UserScript==
// @name         谷歌搜索结果_包含网页快照的那个黑色三角形_样式自适应
// @description  那个黑色三角形总是会被“翻译此页”或者“加入黑名单”所挡住，稍微做一个修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Xcq
// @match        *://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397789/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C_%E5%8C%85%E5%90%AB%E7%BD%91%E9%A1%B5%E5%BF%AB%E7%85%A7%E7%9A%84%E9%82%A3%E4%B8%AA%E9%BB%91%E8%89%B2%E4%B8%89%E8%A7%92%E5%BD%A2_%E6%A0%B7%E5%BC%8F%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/397789/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C_%E5%8C%85%E5%90%AB%E7%BD%91%E9%A1%B5%E5%BF%AB%E7%85%A7%E7%9A%84%E9%82%A3%E4%B8%AA%E9%BB%91%E8%89%B2%E4%B8%89%E8%A7%92%E5%BD%A2_%E6%A0%B7%E5%BC%8F%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elements = document.getElementsByClassName("action-menu");

    for(let i = 0; i < elements.length; i++){

        elements[i].setAttribute("style","margin-right:18px");
    }

})();