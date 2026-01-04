// ==UserScript==
// @name         高亮区分店小蜜关键词和排除词 by 3chai
// @namespace    https://3chai.com
// @version      1.2
// @description  为店小蜜关键词和排除词输入区域加入颜色区别,防止误设置
// @author       3chai 钉钉群:33143348
// @match        *://dianxiaomi.taobao.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475781/%E9%AB%98%E4%BA%AE%E5%8C%BA%E5%88%86%E5%BA%97%E5%B0%8F%E8%9C%9C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%92%8C%E6%8E%92%E9%99%A4%E8%AF%8D%20by%203chai.user.js
// @updateURL https://update.greasyfork.org/scripts/475781/%E9%AB%98%E4%BA%AE%E5%8C%BA%E5%88%86%E5%BA%97%E5%B0%8F%E8%9C%9C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%92%8C%E6%8E%92%E9%99%A4%E8%AF%8D%20by%203chai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function colorizeElements() {
        var targetElements = document.getElementsByClassName("ant-modal-content");

        for (var i = 0; i < targetElements.length; i++) {
            var element = targetElements[i];
            var elementsInChildren = element.getElementsByTagName("div");

            for (var j = 0; j < elementsInChildren.length; j++) {
                var childElement = elementsInChildren[j];
                if (childElement.classList.contains("ant-modal-header")) {
                    var headerText = childElement.textContent.trim();
                    if (headerText === "精准关键词") {
                        // 修改背景颜色
                        element.style.backgroundColor = '#D5F5E3';
                        break;
                    } else if (headerText === "命中排除词" || headerText === "精准排除词") {
                        element.style.backgroundColor = '#FADBD8';
                        break;
                    }
                }
            }
        }
    }

    // 创建MutationObserver以监测DOM变化
    var observer = new MutationObserver(function(mutationsList) {
        colorizeElements();
    });

    // 监测整个文档的变化
    observer.observe(document, { childList: true, subtree: true });

    // 初始设置颜色
    colorizeElements();
})();
