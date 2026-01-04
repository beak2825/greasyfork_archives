// ==UserScript==
// @name         处理秘境探索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  "我的放置仙途" 探索自动点击
// @author       You
// @match        https://idle-xiuxian.jntm.cool/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jntm.cool
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527919/%E5%A4%84%E7%90%86%E7%A7%98%E5%A2%83%E6%8E%A2%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527919/%E5%A4%84%E7%90%86%E7%A7%98%E5%A2%83%E6%8E%A2%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义优先级顺序
    var priorityOrder = [
        "境界感悟",
        "境界共鸣",
        "生命链接",
        "灵脉",
        "无影",
        "会心",
        "灵气祝福",
        "聚灵",
        "疾风",
        "灵力护盾",
        "小幅强化",
        "灵力恢复",
        "铁壁",
        "生机",
        "灵息",
        "战斗顿悟",
    ];

    // 绑定点击事件处理函数（只需绑定一次）
    $(document).on('click', '.option-card', function() {
        var $clickedCard = $(this);
        var title1 = $clickedCard.find('.option-name').text().trim();
        console.log("点击了: " + title1);
        // 可以在这里添加更多的逻辑，例如发送请求或更新页面内容
    });

    // 设置定时器，每5秒检查一次
    var intervalId = setInterval(function() {
        var title = $('.n-card-header__main:eq(0)').text();
        if (title === '秘境探索') {
            harvest();
        }
    }, 5000);

    function harvest() {
        // 获取进度条值
        var total = parseInt($('.n-progress-graph-line-indicator').text(), 10);
        console.log('当前进度:', total);

        // 如果没有选项卡或进度达到100%，则返回false
        if ($('.option-card').length === 0 || total >= 100) {
            console.log('没有可选的卡片或进度已满');
            return false;
        }

        //console.log('开始选择最高优先级的选项');

        var highestPriorityOption = null;
        var highestPriorityIndex = Infinity;
        var highestPriorityElement = null;

        // 遍历所有的 .option-card 元素
        $('.option-card').each(function(i, domEle) {
            var $currentCard = $(domEle);
            var title1 = $currentCard.find('.option-name').text().trim();
            console.log('选项名称:', title1);

            var index = priorityOrder.indexOf(title1);

            if ((index !== -1 && index < highestPriorityIndex) || (highestPriorityElement == null && i==2)) {
                highestPriorityOption = title1;
                highestPriorityIndex = index;
                highestPriorityElement = $currentCard;
            }
        });

        if (highestPriorityElement !== null) {
            console.log("最终选择的最高优先级选项: " + highestPriorityOption);
            console.log("最终选择的最高优先级索引: " + highestPriorityIndex);
            highestPriorityElement.trigger('click');
            return true;
        } else {
            console.log("未找到任何匹配项");
            return false;
        }
    }
})();