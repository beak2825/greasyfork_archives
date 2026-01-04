// ==UserScript==
// @name         问卷星数题目增强版-矩阵题计数
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在问卷星问卷的右上角显示题目数量以及各题型的数量，增强版
// @author       QY
// @match        https://www.wjx.cn/vm/*
// @match        https://www.wjx.cn/vj/*
// @match        https://ks.wjx.top/*
// @match        https://ww.wjx.top/*
// @match        https://w.wjx.top/*
// @match        https://*.wjx.top/*
// @match        https://*.wjx.cn/vm/*
// @match        https://*.wjx.cn/vj/*
// @match        https://*.wjx.com/vm/*
// @match        https://*.wjx.com/vj/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516415/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%95%B0%E9%A2%98%E7%9B%AE%E5%A2%9E%E5%BC%BA%E7%89%88-%E7%9F%A9%E9%98%B5%E9%A2%98%E8%AE%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/516415/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%95%B0%E9%A2%98%E7%9B%AE%E5%A2%9E%E5%BC%BA%E7%89%88-%E7%9F%A9%E9%98%B5%E9%A2%98%E8%AE%A1%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取题目数量和题型统计
        var stats = getQuestionStats();
        // 在控制台输出题目数量和题型统计
        console.log('问卷题目数量及题型统计:', stats);
        // 在页面右上角显示题目数量和题型统计
        displayQuestionStatsInCorner(stats);
    });

    // 获取题目数量和题型统计的函数
    function getQuestionStats() {
        var totalQuestions = 0;
        var matrixQuestions = 0; // 矩阵题数量
        var matrixSubQuestions = 0; // 矩阵题小题数量
        var stats = {};

        for (let i = 1; i <= 13; i++) {
            stats[i] = 0;
        }

        var allElements = document.querySelectorAll('fieldset, div.field');
        var questionElements = Array.from(allElements).filter(function(element) {
            return element.querySelector('.topicnumber') || element.querySelector('.topichtml');
        });

        totalQuestions = questionElements.length;

        // 题目总数减1
        totalQuestions -= 1;

        questionElements.forEach(function(element) {
            var type = element.getAttribute('type');
            if (type === '6') { // 矩阵题
                matrixQuestions += 1;
                var subQuestions = element.querySelectorAll('tr[tp="d"]').length; // 统计矩阵题小题数量
                matrixSubQuestions += subQuestions;
            } else {
                stats[type]++; // 根据题型编号增加统计
            }
        });

        // 调整题目总数的计算逻辑
        var adjustedTotalQuestions = totalQuestions - matrixQuestions + matrixSubQuestions;

        return {
            total: adjustedTotalQuestions,
            hasMatrix: matrixQuestions > 0,
            matrixQuestions: matrixQuestions,
            matrixSubQuestions: matrixSubQuestions,
            ...stats
        };
    }

    // 在页面右上角显示题目数量和题型统计的函数
    function displayQuestionStatsInCorner(stats) {
        var statsElement = document.createElement('div');
        statsElement.style.position = 'fixed';
        statsElement.style.top = '10px';
        statsElement.style.right = '10px';
        statsElement.style.zIndex = '9999';
        statsElement.style.display = 'flex'; // 使用flex布局
        statsElement.style.flexDirection = 'column'; // 垂直排列
        statsElement.style.gap = '5px'; // 减小元素间距

        if (stats.hasMatrix) {
            var matrixElement = document.createElement('p');
            matrixElement.style.border = '2px solid red'; // 红色边框
            matrixElement.style.backgroundColor = '#FFFFE0'; // 浅黄色背景
            matrixElement.style.color = '#000'; // 黑色文字
            matrixElement.style.padding = '5px'; // 内边距
            matrixElement.style.fontWeight = 'bold'; // 加粗
            matrixElement.style.borderRadius = '8px'; // 圆角
            matrixElement.innerHTML = `问卷含有矩阵题<br>题目总数：${stats.total}<br>矩阵小题有：${stats.matrixSubQuestions}<br>人工核对，并信效度报价`; // 显示矩阵题小题数量
            statsElement.appendChild(matrixElement); // 添加到statsElement
        } else {
            var totalElement = document.createElement('div'); // 默认提示框
            totalElement.style.border = '2.5px solid #0000FF'; // 蓝色边框
            totalElement.style.backgroundColor = '#F9F9F9'; // 白色带一点点灰的背景
            totalElement.style.borderRadius = '8px'; // 圆角
            totalElement.style.padding = '5px'; // 内边距
            totalElement.style.maxWidth = '150px'; // 最大宽度
            totalElement.style.wordBreak = 'break-all'; // 自动换行
            totalElement.style.fontSize = '18px'; // 标题行字体大小
            totalElement.style.lineHeight = '1.2'; // 行间距
            totalElement.innerHTML = '题目数量: ' + stats.total; // 设置题目数量文本
            totalElement.style.fontWeight = 'bold'; // 标题行加粗
            statsElement.appendChild(totalElement); // 将提示框添加到statsElement

            for (let i = 1; i <= 13; i++) {
                if (stats[i] > 0) {
                    var typeElement = document.createElement('p');
                    typeElement.style.margin = '0'; // 移除默认外边距
                    typeElement.style.padding = '2px 0'; // 内边距
                    typeElement.style.wordBreak = 'keep-all'; // 保持单词不换行
                    typeElement.style.fontSize = '16px'; // 正常行字体大小
                    typeElement.style.fontWeight = 'normal'; // 正文字体不加粗
                    switch (i) {
                        case 1: typeElement.innerHTML = `填空题: ${stats[i]}`; break;
                        case 2: typeElement.innerHTML = `简答题: ${stats[i]}`; break;
                        case 3: typeElement.innerHTML = `单选题: ${stats[i]}`; break;
                        case 4: typeElement.innerHTML = `多选题: ${stats[i]}`; break;
                        case 5: typeElement.innerHTML = `量表题: ${stats[i]}`; break;
                        case 7: typeElement.innerHTML = `下拉题: ${stats[i]}`; break;
                        case 8: typeElement.innerHTML = `滑动条题: ${stats[i]}`; break;
                        case 9: typeElement.innerHTML = `多项填空题: ${stats[i]}`; break;
                        case 10: typeElement.innerHTML = `题型10: ${stats[i]}`; break;
                        case 11: typeElement.innerHTML = `排序题: ${stats[i]}`; break;
                        case 12: typeElement.innerHTML = `比重题: ${stats[i]}`; break;
                        case 13: typeElement.innerHTML = `文件上传题: ${stats[i]}`; break;
                    }
                    totalElement.appendChild(typeElement); // 将题型元素添加到提示框
                }
            }
        }
        document.body.appendChild(statsElement); // 将statsElement添加到body
    }
})();