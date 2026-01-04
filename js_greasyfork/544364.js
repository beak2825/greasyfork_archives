// ==UserScript==
// @name         易班优课考试自动答题（开发者vx: xyq050405）
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  易班YOOC答题脚本：支持多选防误点、延迟作答、自动记录、导入导出题库、手动修改题库（番茄b炒蛋开发，盗版没目）
// @match        https://exam.yooc.me/group/*/exam*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/544364/%E6%98%93%E7%8F%AD%E4%BC%98%E8%AF%BE%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%BC%80%E5%8F%91%E8%80%85vx%3A%20xyq050405%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544364/%E6%98%93%E7%8F%AD%E4%BC%98%E8%AF%BE%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%BC%80%E5%8F%91%E8%80%85vx%3A%20xyq050405%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let answerDatabase = JSON.parse(localStorage.getItem("yooc_answer_db") || "{}");
    let autoStart = localStorage.getItem("yooc_auto_start") === "true";
    let lastAnsweredQuestion = null; // ✅ 防止重复答题

    // ======= 菜单 =======
    GM_registerMenuCommand("📥 导入题库（JSON）", () => {
        const jsonInput = prompt("粘贴 JSON 格式题库：");
        if (jsonInput) {
            try {
                const parsed = JSON.parse(jsonInput);
                localStorage.setItem("yooc_answer_db", JSON.stringify(parsed));
                answerDatabase = parsed;
                alert("✅ 导入成功！");
            } catch (e) {
                alert("❌ JSON 格式错误");
            }
        }
    });

    GM_registerMenuCommand("📤 导出当前题库", () => {
        const dbText = JSON.stringify(answerDatabase, null, 2);
        prompt("👇 复制以下题库 JSON：", dbText);
    });

    GM_registerMenuCommand("📝 修改当前题目答案", () => {
        const data = extractQuestionData();
        if (!data) return alert("❌ 无法获取题目");
        const oldAnswer = answerDatabase[data.question];
        const newAnswer = prompt(`当前题目：\n${data.question}\n\n请输入新的答案（单选填A，多选填AB，判断填T/F，填空直接填内容）：`, Array.isArray(oldAnswer) ? oldAnswer.join("") : oldAnswer || "");
        if (newAnswer != null) {
            let formatted = newAnswer;
            if (data.type === "choice" || data.type === "judge") {
                formatted = newAnswer.toUpperCase().split("");
            }
            answerDatabase[data.question] = formatted;
            localStorage.setItem("yooc_answer_db", JSON.stringify(answerDatabase));
            alert("✅ 已修改答案");
        }
    });

    GM_registerMenuCommand("▶️ 开始自动答题", () => {
        alert("✅ 自动答题已开启");
        autoStart = true;
        localStorage.setItem("yooc_auto_start", "true");
    });

    GM_registerMenuCommand("⏹ 停止自动答题", () => {
        alert("🛑 自动答题已停止");
        autoStart = false;
        localStorage.setItem("yooc_auto_start", "false");
    });

    GM_registerMenuCommand("📋 提取当前题目（可复制）", () => {
        const data = extractQuestionData();
        if (!data) return alert("❌ 未识别到题目");

        let text = `题目：\n${data.question}\n\n`;
        if (data.type === "fill") {
            text += `(填空题)\n`;
        } else {
            data.options.forEach(opt => {
                text += `${opt.label}. ${opt.text}\n`;
            });
        }

        prompt("👇 复制当前题目和选项", text);
    });

    // ======= 获取题目结构 =======
    function extractQuestionData() {
        const questionEl = document.querySelector('div[class*="jsx"][class*="3643416060"], div[class*="jsx"][class*="3366010129"]');
        if (!questionEl) return null;

        const question = questionEl.textContent.trim();
        const inputEl = document.querySelector('input.exam-input');

        if (inputEl) {
            return {
                type: "fill",
                question
            };
        }

        const options = [...document.querySelectorAll('div[class*="flex-auto"]')].map(el => {
            const fullText = el.textContent.trim();
            return {
                el,
                label: fullText.charAt(0),
                text: fullText.slice(2).trim()
            };
        });

        return {
            type: options.length > 1 ? "choice" : "judge",
            question,
            options
        };
    }

    // ======= 自动答题逻辑（防重复 + 多选延迟）=======
    async function autoAnswer() {
        if (!autoStart) return;

        const data = extractQuestionData();
        if (!data || !(data.question in answerDatabase)) return;

        // ✅ 防止重复答题
        if (data.question === lastAnsweredQuestion) return;
        lastAnsweredQuestion = data.question;

        const answer = answerDatabase[data.question];

        if (data.type === "fill" && typeof answer === "string") {
            const input = document.querySelector('input.exam-input');
            if (input) {
                input.value = answer;
                input.dispatchEvent(new Event("input"));
            }
        }

        if ((data.type === "choice" || data.type === "judge") && data.options) {
            const answerArray = Array.isArray(answer) ? answer : [answer];

            for (let i = 0; i < data.options.length; i++) {
                const opt = data.options[i];
                if (answerArray.includes(opt.label)) {
                    opt.el.click();
                    await sleep(500);  // 每个选项间隔 0.5 秒点击
                }
            }
        }

        // ✅ 延迟 2 秒后跳转下一题
        const nextBtn = [...document.querySelectorAll('button.__.primary')].find(btn =>
            btn.textContent.includes("下一题") || btn.textContent.includes("下一页")
        );
        if (nextBtn) {
            setTimeout(() => nextBtn.click(), 2000);
        }
    }

    // ======= 延迟函数 =======
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ======= 自动记录答案 =======
    function setupClickListener() {
        document.body.addEventListener("click", function (e) {
            const el = e.target.closest('div[class*="flex-auto"]');
            if (!el) return;

            const data = extractQuestionData();
            if (!data || !data.options) return;

            const selectedLabel = el.textContent.trim().charAt(0);
            const currentAnswer = answerDatabase[data.question];

            if (!currentAnswer) {
                answerDatabase[data.question] = [selectedLabel];
            } else if (Array.isArray(currentAnswer)) {
                if (!currentAnswer.includes(selectedLabel)) {
                    answerDatabase[data.question].push(selectedLabel);
                }
            } else {
                if (currentAnswer !== selectedLabel) {
                    answerDatabase[data.question] = [currentAnswer, selectedLabel];
                }
            }

            answerDatabase[data.question] = Array.from(new Set(answerDatabase[data.question])).sort();
            localStorage.setItem("yooc_answer_db", JSON.stringify(answerDatabase));
            console.log("✅ 记录选项：", data.question, "=>", answerDatabase[data.question]);
        });

        document.body.addEventListener("input", function (e) {
            const input = e.target;
            if (input && input.classList.contains("exam-input")) {
                const data = extractQuestionData();
                if (!data) return;
                answerDatabase[data.question] = input.value;
                localStorage.setItem("yooc_answer_db", JSON.stringify(answerDatabase));
                console.log("✅ 记录填空：", data.question, "=>", input.value);
            }
        });
    }

    // ======= 页面变动触发自动答题 =======
    const observer = new MutationObserver(() => {
        setTimeout(autoAnswer, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ======= 初始化 =======
    setupClickListener();
})();