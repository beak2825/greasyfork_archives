// ==UserScript==
// @name         Gooboo学习数学计算
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Gooboo游戏辅助脚本，辅助完成学习任务，点击直接复制运算结果
// @author       RouJiANG
// @match        *://gityxs.github.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492820/Gooboo%E5%AD%A6%E4%B9%A0%E6%95%B0%E5%AD%A6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/492820/Gooboo%E5%AD%A6%E4%B9%A0%E6%95%B0%E5%AD%A6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '复制运算结果';
    button.style.position = 'fixed';
    button.style.top = '30%';
    button.style.left = '60%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.zIndex = 1000;
    button.style.display = 'none'; // 初始时隐藏按钮
    document.body.appendChild(button);

//     // 解析并计算数学表达式
//     function calculateExpression(expression) {
//         try {
//             return eval(expression);
//         } catch (e) {
//             console.error('运算错误：', e);
//             return null;  // 如果运算出错，返回null
//         }
//     }

//     // 检查指定元素是否存在并更新按钮显示状态
//     function checkAndUpdateButton() {
//         const element = document.querySelector('div.text-center.question-text');
//         if (element) {
//             button.style.display = 'block'; // 显示按钮
//             button.onclick = function() {
//                 const rawText = element.textContent;
//                 const expression = rawText.replace(/\s/g, ''); // 去除空白字符
//                 const result = calculateExpression(expression); // 计算表达式结果
//                 if (result !== null) {
//                     navigator.clipboard.writeText(result.toString()).then(function() {
//                         console.log('复制成功：', result);
//                     }, function(err) {
//                         console.error('复制失败：', err);
//                     });
//                 }
//             };
//         } else {
//             button.style.display = 'none'; // 隐藏按钮
//         }
//     }

//     // 每隔一段时间检查一次元素是否存在
//     setInterval(checkAndUpdateButton, 1000); // 每秒检查一次
// })();

        // 解析并计算数学表达式（包括根号和指数运算）
    function calculateExpression(expression) {
        try {
            // 替换根号运算
            expression = expression.replace(/√(\d+)/g, function(match, p1) {
                return Math.sqrt(parseInt(p1, 10));
            });

            // 替换指数运算
            expression = expression.replace(/\^/g, '**');

            // 使用 eval 计算表达式
            return eval(expression);
        } catch (e) {
            console.error('运算错误：', e);
            return null; // 如果运算出错，返回 null
        }
    }

    // 检查指定元素是否存在并更新按钮显示状态
    function checkAndUpdateButton() {
        const element = document.querySelector('div.text-center.question-text');
        if (element) {
            button.style.display = 'block'; // 显示按钮
            button.onclick = function() {
                const rawText = element.textContent;
                const expression = rawText.replace(/\s/g, ''); // 去除空白字符
                const result = calculateExpression(expression);
                if (result !== null) {
                    const answerInput = document.getElementById('answer-input-math');
                    answerInput.value = result; // 将结果设置为输入框的值
                    answerInput.focus(); // 让输入框获得焦点
                    answerInput.select(); // 选中输入框中的文本
                    document.execCommand('copy'); // 复制选中的文本
//                     console.log('复制成功并已输入到输入框：', result);
                }
            };
        } else {
            button.style.display = 'none'; // 隐藏按钮
        }
    }

    // 每隔一段时间检查一次元素是否存在
    setInterval(checkAndUpdateButton, 1000); // 每秒检查一次
})();


