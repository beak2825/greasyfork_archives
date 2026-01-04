// ==UserScript==
// @name 亚马逊商品评论数量标记
// @version 0.0.1
// @author lrouger
// @match *://*.amazon.co.jp/*
// @description 为50条以上评论的商品增加标记
// @namespace
// @license MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/441886/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E8%AF%84%E8%AE%BA%E6%95%B0%E9%87%8F%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441886/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E8%AF%84%E8%AE%BA%E6%95%B0%E9%87%8F%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
(function() {
    var nodes = document.querySelectorAll('.a-size-small');
    var curResult = [];
    nodes.forEach(function(item) {
        var value = item.textContent.replaceAll(',', '');
        if (!isNaN(value) && value >= 50) {
            curResult.push(item);
        }
    });

    curResult.forEach(function(item) {
        item.closest('#gridItemRoot > div').style.backgroundColor = 'gold'
    });
})()