// ==UserScript==
// @name         一维大成湘才培训网自动答题助手 - 四则运算（延迟执行 + 容错版）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用于一维大成湘才培训网自动答题插件
// @author       yqls
// @match        *://hunan.bjewaytech.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538516/%E4%B8%80%E7%BB%B4%E5%A4%A7%E6%88%90%E6%B9%98%E6%89%8D%E5%9F%B9%E8%AE%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%20-%20%E5%9B%9B%E5%88%99%E8%BF%90%E7%AE%97%EF%BC%88%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C%20%2B%20%E5%AE%B9%E9%94%99%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538516/%E4%B8%80%E7%BB%B4%E5%A4%A7%E6%88%90%E6%B9%98%E6%89%8D%E5%9F%B9%E8%AE%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%20-%20%E5%9B%9B%E5%88%99%E8%BF%90%E7%AE%97%EF%BC%88%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C%20%2B%20%E5%AE%B9%E9%94%99%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("【自动答题脚本】已加载");

    // 设置延迟时间为 8000 毫秒（8 秒）
    const delayTime = 8000;

    // 延迟启动自动答题逻辑
    setTimeout(() => {
        console.log("【调试】延迟 8 秒后启动自动答题逻辑");
        monitorAnswerDialog();
    }, delayTime);

    // 持续监测答题框是否出现（含初始化检测）
    function monitorAnswerDialog() {
        // 初始化检测：弹窗是否已存在
        const existingDialog = document.querySelector('.el-dialog__wrapper .el-dialog[aria-label="回答问题卡"]');
        if (existingDialog && isVisible(existingDialog)) {
            console.log("【调试】初始化检测到答题弹窗");
            autoSolveMath(existingDialog);
            return;
        }

        // 持续监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            const dialog = document.querySelector('.el-dialog__wrapper .el-dialog[aria-label="回答问题卡"]');
            if (dialog && isVisible(dialog)) {
                console.log("【调试】MutationObserver 检测到答题弹窗");
                autoSolveMath(dialog);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log("【调试】MutationObserver 已启动");
    }

    // 判断元素是否可见
    function isVisible(element) {
        return window.getComputedStyle(element).display !== 'none';
    }

    // 获取题目文本（增强兼容性）
    function getQuestionText(dialog) {
        const rawQuestion =
            dialog.querySelector('h3 p p')?.innerText ||
            dialog.querySelector('.answer_list_head h3')?.innerText ||
            dialog.querySelector('.answer_list_head')?.innerText ||
            '';
        return rawQuestion.trim();
    }

    // 提取数学表达式
    function extractMathExpression(questionText) {
        const cleanedExpr = questionText.replace(/[^\d+\-*/÷×().]/g, '');
        const exprMatch = cleanedExpr.match(/([0-9+\-*/÷×().]+)/);
        return exprMatch ? exprMatch[1].trim().replace(/×/g, '*').replace(/÷/g, '/') : null;
    }

    // 自动解题函数
    function autoSolveMath(dialog) {
        console.log("【调试】进入 autoSolveMath 函数");

        // 提取题目文本
        const rawQuestion = getQuestionText(dialog);
        console.log("【调试】原始题目文本:", rawQuestion);

        if (!rawQuestion) {
        console.warn("【调试】未能找到题目文本，5秒后重试");
        setTimeout(() => {
            autoSolveMath(dialog); // 5秒后重试当前弹窗
        }, 5000);
            return;
        }

        // 提取数学表达式
        const expr = extractMathExpression(rawQuestion);
        if (!expr) {
            console.warn("【调试】未识别到数学表达式");
            return;
        }
        console.log("【调试】最终表达式:", expr);

        try {
            const result = new Function(`return ${expr}`)();
            console.log("【调试】计算结果:", result);

            // 选择答案
            const options = dialog.querySelectorAll('.el-radio__label p p');
            let found = false;
            for (let option of options) {
                if (option.innerText.trim() === result.toString()) {
                    console.log("【调试】找到正确答案选项");
                    option.closest('.el-radio')?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.warn("【调试】未找到匹配的答案选项");
            }

            // 自动提交
            const submitBtn = dialog.querySelector('.through_box .el-button') || dialog.querySelector('.el-button');
            if (submitBtn) {
                console.log("【调试】找到提交按钮");
                setTimeout(() => {
                    submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                }, 500);
            } else {
                console.warn("【调试】未找到提交按钮");
            }

        } catch (e) {
            console.error("【调试】表达式解析失败:", expr, e);
        }
    }
})();