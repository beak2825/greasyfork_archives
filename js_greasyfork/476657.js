// ==UserScript==
// @name         解除国区steam创意工坊物品展示图的模糊处理
// @description  此脚本只作用于网页steam创意工坊；对于steam客户端的创意工坊中被模糊处理过的图片，可以将图片长按并且外拖一下，就能看到通透的原图。
// @namespace    none
// @version      2.0
// @author       none
// @match        *://steamcommunity.com/*
// @icon         none
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/476657/%E8%A7%A3%E9%99%A4%E5%9B%BD%E5%8C%BAsteam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E7%89%A9%E5%93%81%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%9A%84%E6%A8%A1%E7%B3%8A%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/476657/%E8%A7%A3%E9%99%A4%E5%9B%BD%E5%8C%BAsteam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E7%89%A9%E5%93%81%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%9A%84%E6%A8%A1%E7%B3%8A%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(
    function(){
        var target = document.querySelectorAll('[class="ugc has_adult_content"]')
        target.forEach(function(element){element.setAttribute('class', 'ugc');})
              }
)
();
