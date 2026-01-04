// ==UserScript==
// @name         评分选项激活工具
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动激活包含"优秀"的评分选项
// @author       shxuai
// @match        http://10.90.15.102:8072/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533570/%E8%AF%84%E5%88%86%E9%80%89%E9%A1%B9%E6%BF%80%E6%B4%BB%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/533570/%E8%AF%84%E5%88%86%E9%80%89%E9%A1%B9%E6%BF%80%E6%B4%BB%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let active = false;
    let currentSeed = ''; // 存储当前使用的种子

    function updateSpan($span, targetText) {
        if ($span.text().trim() === targetText) {
            $span.css({
                'color': '#fff',
                'background-color': '#409eff',
                'border-color': '#409eff'
            });
        } else {
            $span.css({
                'color': '#606266',
                'background-color': '#fff',
                'border-color': '#dcdfe6',
                'box-shadow': 'none'
            });
        }
    }

    function simpleHash(randomseed, percent) {
        if (!randomseed || randomseed.trim() === "") {
            return false;
        }
        let hash = 0;
        for (let i = 0; i < randomseed.length; i++) {
            const char = randomseed.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        console.log('当前随机数为' + Math.abs(hash) % 100)
        return Math.abs(hash) % 100 <= percent;
    }

    function getQuarterInfo() {
        return $('.el-tag.el-tag--warning.el-tag--medium.el-tag--light span[style="font-size: 20px;"]').text().trim() || '';
    }

    function handleDynamicElements() {
        const quarterInfo = getQuarterInfo(); // 获取当前页面的季度信息

        $('tr.vxe-body--row').each(function() {
            const $td = $(this).find('td').first();
            const nameSpan = $td.find('div > span');
            const $button = $(this).find('button');

            // 解绑之前的鼠标事件
            $button.off('mouseenter');

            if (nameSpan.length) {
                $button.on('mouseenter', function() {
                    active = true;
                    // 使用姓名和季度信息作为唯一种子
                    currentSeed = nameSpan.text().trim() + quarterInfo;
                    console.log("使用种子:", currentSeed);
                    updateRatingButtons();
                });
            } else {
                $button.on('mouseenter', function() {
                    active = false;
                    resetRatingButtons();
                });
            }
        });

        if (active) {
            updateRatingButtons();
        } else {
            resetRatingButtons();
        }
    }

    function updateRatingButtons() {
        if (!currentSeed) return;

        $('label.el-radio-button').each(function(index) {
            const $span = $(this).find('.el-radio-button__inner');
            if (index < 4 && simpleHash(currentSeed, 50)) {
                updateSpan($span, '良好');
            } else if (index < 8 && simpleHash(currentSeed + index, 50)) {
                updateSpan($span, '良好');
            } else {
                updateSpan($span, '优秀');
            }
        });
    }

    function resetRatingButtons() {
        $('label.el-radio-button .el-radio-button__inner').css({
            'color': '',
            'background-color': '',
            'border-color': '',
            'box-shadow': ''
        });
    }

    // 初始化执行
    handleDynamicElements();

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        handleDynamicElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})(jQuery);