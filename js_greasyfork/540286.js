// ==UserScript==
// @name         UPC(华东)教务系统通用自动评教(最终修复版)
// @version      3.0
// @description  [2025最终版] 解决“请不要选相同一项”和“优秀占比已超过限制”的问题。脚本默认评为“良好”(80-89分)来绕过系统限制。智能识别理论课(单选框)和实验课(文本框)并全自动完成。
// @author       Gemini & Ttowwa
// @match        https://jwxt.upc.edu.cn/jsxsd/xspj/xspj_list.do*
// @match        https://jwxt.upc.edu.cn/jsxsd/xspj/xspj_edit.do*
// @grant        none
// @run-at       document-idle
// @namespace    https://greasyfork.org/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540286/UPC%28%E5%8D%8E%E4%B8%9C%29%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%28%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540286/UPC%28%E5%8D%8E%E4%B8%9C%29%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%28%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const now_url = window.location.href;

    /**
     * 在评教列表页给出提示
     */
    if (now_url.includes("xspj_list.do")) {
        const notice = document.createElement('div');
        notice.innerHTML = `
            ✔️ <b>通用自动评教脚本已加载 (v3.0 最终修复版)</b><br>
            <span style="color:red; font-weight:bold;">注意：为解决“优秀占比超限”问题，脚本将自动评为“良好”(80-89分)。</span><br>
            点击“评价”后将全自动完成。`;
        notice.style.cssText = 'background-color: #dff0d8; color: #3c763d; border: 1px solid #d6e9c6; padding: 15px; margin-bottom: 20px; text-align: center; font-size: 16px; line-height: 1.6;';
        const mainContainer = document.querySelector('.Nsb_layout_r');
        if (mainContainer) {
            mainContainer.prepend(notice);
        }
        return;
    }

    /**
     * 在评教编辑页执行自动填写和提交
     */
    if (now_url.includes("xspj_edit.do")) {
        if (!document.getElementById("tj")) {
            console.log("评教脚本：未找到“提交”按钮，可能已评价。脚本停止。");
            return;
        }

        function generateComments() {
            const suggestions = [ "课堂气氛活跃，引导学生积极参与。", "教学内容丰富，理论与实践相结合。", "对学生的问题耐心解答，鼓励学生提问。", "教学方法新颖，能吸引学生的注意力。", "作业布置得当，有助于巩固课堂知识。", "对学生的表现给予及时反馈，有助于学生的进步。", "教学进度适中，既不快也不慢。", "课堂上能充分调动学生的积极性。", "对学生的学习情况有深入的了解。", "能根据学生的学习情况灵活调整教学计划。", "课堂上的互动环节设计得很好。", "对学生的表扬和批评都很中肯。", "能激发学生的学习兴趣。", "对待学生公正无私，给学生以公平的评价。", "教学态度认真，对待学生友善。", "对教学内容有深入的理解和掌握。", "能用生动的语言讲解复杂的概念。", "对学生的学习困难给予及时的帮助。", "能用实例来解释抽象的理论。", "课堂上的教学活动设计得有趣而富有挑战性。", "对学生的学习成绩给予充分的肯定。", "能激发学生的创新思维。", "教学材料准备充分，有助于学生的理解。", "能引导学生进行自主学习。", "对学生的学习进步给予充分的鼓励。", "能用生动的案例来解释理论知识。", "对学生的学习困难给予耐心的指导。", "能引导学生进行批判性思考。", "注重学生动手能力与团队合作精神的培养。", "实验准备充分，实验报告批改认真。"];
            let randomSuggestions = [];
            let tempSuggestions = [...suggestions];
            const count = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < count; i++) {
                if (tempSuggestions.length > 0) {
                    let randomIndex = Math.floor(Math.random() * tempSuggestions.length);
                    randomSuggestions.push(tempSuggestions[randomIndex]);
                    tempSuggestions.splice(randomIndex, 1);
                }
            }
            let finalComment = randomSuggestions.join(' ');
            while (finalComment.length < 10) {
                finalComment += " " + "老师讲得很好，内容很充实。";
            }
            return finalComment;
        }

        const commentBox = document.querySelector('textarea[name="jynr"]');
        if (commentBox) {
            commentBox.value = generateComments();
            console.log("评教脚本：已自动填写评语。");
        }


        // **类型1：理论课程 (单选框)**
        if (document.querySelector('input[id^="pj0601id_"]')) {
            console.log("评教脚本：检测到理论课程页面（单选框模式）。");

            const questions = document.querySelectorAll('input[name="pj06xh"]');
            const choices = new Array(questions.length).fill(1); // 默认全选1 (A.完全符合)

            // **【修复-1】** 解决“请不要选相同一项!”
            // 随机选出1-2个问题，把它们的答案改成 2 (B.符合)
            if (questions.length > 1) {
                const numToChange = Math.random() < 0.5 ? 1 : 2; // 随机改1个或2个
                for (let i = 0; i < numToChange; i++) {
                    let randomIndex;
                    do {
                        randomIndex = Math.floor(Math.random() * questions.length);
                    } while (choices[randomIndex] === 2); // 确保不重复选到同一个问题
                    choices[randomIndex] = 2;
                }
            }

            questions.forEach((q, index) => {
                const qIndex = q.value;
                const choice = choices[index];
                const radioId = `pj0601id_${qIndex}_${choice}`;
                const radioButton = document.getElementById(radioId);
                if (radioButton) {
                    radioButton.click();
                }
            });
            console.log("评教脚本：已选择所有评价选项（并确保选项不完全相同）。", choices);

            // **【修复-2】** 解决“优秀占比已超过限制”
            const scoreBox = document.getElementById('pjbfb');
            if (scoreBox) {
                // 默认填写“良好”分数段 (85-89)
                const goodScore = Math.floor(Math.random() * 5) + 85;
                scoreBox.value = goodScore;
                console.log(`评教脚本：已填写“良好”分数：${goodScore}，以避免优秀超限。`);
            }

        // **类型2：实验课程 (文本框)**
        } else if (document.querySelector('input[id^="pj06fz"]')) {
            console.log("评教脚本：检测到实验课程页面（文本框打分模式）。");
            const scoreItems = document.querySelectorAll('input[name="pj06xh"]');

            // **【修复-2】** 解决“优秀占比已超过限制”
            scoreItems.forEach(item => {
                const itemIndex = item.value;
                const maxScoreInput = document.getElementById(`pj06fz_${itemIndex}`);
                const scoreInput = document.getElementById(`pj06fz${itemIndex}`);
                if (maxScoreInput && scoreInput) {
                    const maxScore = parseFloat(maxScoreInput.value);
                    // 降低评分比例，确保总分在“良好”范围 (75% - 88% of max)
                    const randomScore = (Math.random() * (maxScore * 0.88 - maxScore * 0.75) + maxScore * 0.75).toFixed(1);
                    scoreInput.value = randomScore;
                }
            });
            console.log("评教脚本：已填写各项“良好”分数，以避免优秀超限。");

        } else {
            console.log("评教脚本：无法识别当前评教页面类型。脚本停止。");
            return;
        }

        // --- 通用提交逻辑 ---
        console.log("评教脚本：填写完成，1秒后将自动提交...");
        setTimeout(() => {
            document.getElementById("issubmit").value = "1";
            document.getElementById("Form1").submit();
        }, 1000);
    }
})();