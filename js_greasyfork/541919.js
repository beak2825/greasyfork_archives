// ==UserScript==
// @name         NEUQ 教学质量评价自动填写脚本 (Update)
// @namespace    https://neuq.edu.cn/
// @version      2.0
// @description  适配新版教务系统：自动根据分值填写分数（避免全满分）、自动填写主观评价并提交
// @author       one NEUQer & Copilot
// @match        https://jwxt.neuq.edu.cn/eams/quality/stdEvaluate*
// @grant        none
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/541919/NEUQ%20%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC%20%28Update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541919/NEUQ%20%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC%20%28Update%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置：主观题的默认回答库
    const COMMENTS = {
        suggestion: "课程安排合理，老师讲解细致，暂无其他建议。", // 对应“建议”
        difficulty: "课程难度适中，通过努力可以很好地掌握。",      // 对应“难度”/“挑战”
        liked: "老师理论联系实际，课堂氛围活跃，互动环节很有趣。", // 对应“喜欢”/“环节”
        default: "无"
    };

    // 工具：等待元素加载
    function waitForElement(selector, callback, timeout = 5000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.warn(`未找到元素: ${selector}，尝试直接执行逻辑...`);
                callback(null); // 超时也尝试执行，防止页面结构差异导致死等
            }
        }, 200);
    }

    // 核心逻辑：自动填充
    function autoFill() {
        console.log("🚀 开始执行自动填写...");

        // 获取页面上所有的文本输入框 (包括 input type=text 和 textarea)
        // 排除 type=hidden 等其他类型
        const inputs = document.querySelectorAll("input[type='text'], textarea");
        let scoreInputs = []; // 存储打分题的 input 引用

        inputs.forEach((input) => {
            // 获取该输入框所在的上下文文本（尝试获取父级或所在的行文本）
            // 通常结构是: <li> ... 题目文字 ... <input> ... 分值 10 ... </li>
            let container = input.closest('li') || input.closest('tr') || input.closest('div') || input.parentElement;
            let textContext = container ? container.innerText : "";

            // 移除空格以便正则匹配
            let cleanText = textContext.replace(/\s+/g, "");

            // --- 逻辑 1: 处理打分题 ---
            // 匹配模式：包含 "分值" 后面跟数字
            let scoreMatch = cleanText.match(/分值(\d+)/);

            if (scoreMatch) {
                let maxScore = parseInt(scoreMatch[1], 10);
                // 默认先填满分
                input.value = maxScore;
                scoreInputs.push({ element: input, max: maxScore });
            }

            // --- 逻辑 2: 处理主观文字题 ---
            else {
                // 根据题目关键词填写内容
                if (cleanText.includes("建议")) {
                    input.value = COMMENTS.suggestion;
                } else if (cleanText.includes("难度") || cleanText.includes("挑战")) {
                    input.value = COMMENTS.difficulty;
                } else if (cleanText.includes("喜欢") || cleanText.includes("环节")) {
                    input.value = COMMENTS.liked;
                } else {
                    // 其他未识别的文本框，如果为空则填默认值，防止校验不通过
                    if (!input.value.trim()) {
                        input.value = COMMENTS.default;
                    }
                }
            }
        });

        // --- 逻辑 3: 规避“禁止全部满分”规则 ---
        // 策略：将最后一个打分项扣 1 分
        if (scoreInputs.length > 0) {
            let lastItem = scoreInputs[scoreInputs.length - 1];
            if (lastItem.max > 0) {
                let newScore = lastItem.max - 1;
                lastItem.element.value = newScore;
                console.log(`✨ 为避免全满分校验，已将最后一项 (${lastItem.max}分) 修改为: ${newScore}`);
            }
        }

        console.log("✅ 填写完成！");
    }

    // 点击提交按钮
    function submitForm() {
        let submitBtn = document.querySelector("#sub");
        if (submitBtn) {
            // 可以在这里加一个 confirm 确认，或者直接点击
            // 为了安全起见，这里仅滚动到按钮处并高亮，或者自动点击
            // 如果需要全自动提交，请取消下面注释
            submitBtn.click();
            console.log("✅ 表单已提交（或尝试提交）！");
        } else {
            console.warn("未找到提交按钮 #sub");
        }
    }

    // 主流程
    function main() {
        // 等待任意一个输入框出现，代表页面加载差不多了
        waitForElement("input[type='text']", () => {
            // 稍微多等一点时间确保文字渲染
            setTimeout(() => {
                autoFill();
                // 填完后，寻找提交按钮
                waitForElement("#sub", submitForm);
            }, 500);
        });
    }

    // 启动
    main();
})();