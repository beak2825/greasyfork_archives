// ==UserScript==
// @name         屏蔽飞鸽机器人遮挡测试窗部分 by 3chai
// @namespace    https://3chai.com
// @version      1.0
// @description  在飞鸽机器页面上屏蔽遮挡测试窗部分
// @author       3chai 钉钉群:33143348
// @match        *://im.jinritemai.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/477139/%E5%B1%8F%E8%94%BD%E9%A3%9E%E9%B8%BD%E6%9C%BA%E5%99%A8%E4%BA%BA%E9%81%AE%E6%8C%A1%E6%B5%8B%E8%AF%95%E7%AA%97%E9%83%A8%E5%88%86%20by%203chai.user.js
// @updateURL https://update.greasyfork.org/scripts/477139/%E5%B1%8F%E8%94%BD%E9%A3%9E%E9%B8%BD%E6%9C%BA%E5%99%A8%E4%BA%BA%E9%81%AE%E6%8C%A1%E6%B5%8B%E8%AF%95%E7%AA%97%E9%83%A8%E5%88%86%20by%203chai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideTargetElement() {
        var targetElement = document.getElementById('DOUXIAOER_WRAPPER');
        if (targetElement && targetElement.style.display !== 'none') {
            targetElement.style.display = 'none';
            console.log("已经屏蔽");
        }

        var targetElement2 = document.querySelector(".athena-survey-widget.athena-has-banner.ltr.desktop-normal.theme-flgd.athena-survey-rating.light-mode");
        if (targetElement2) {
            targetElement2.style.display = 'none';
        }
    }

    // 创建MutationObserver以监测DOM变化
    var observer = new MutationObserver(function(mutationsList) {
        hideTargetElement();
    });

    // 监测整个文档的变化
    observer.observe(document, { childList: true, subtree: true });

    // 初始隐藏目标元素
    hideTargetElement();
})();
