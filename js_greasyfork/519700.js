// ==UserScript==
// @name         宜宾学院评教助手
// @namespace    宜宾学院教务系统评教自动化工具，帮助学生快速完成教学评价===来自计算机科学与技术学院
// @version      2.0
// @description  自动完成宜宾学院教学评价，支持自定义评分（90-95分），自动填写评语，一键完成评教
// @author       计算机科学与技术学院---软工
// @match        https://ehall.yibinu.edu.cn/jwapp/sys/jwwspj/*
// @icon         https://pic.imgdb.cn/item/673c85b1d29ded1a8ce8b97c.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519700/%E5%AE%9C%E5%AE%BE%E5%AD%A6%E9%99%A2%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519700/%E5%AE%9C%E5%AE%BE%E5%AD%A6%E9%99%A2%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .auto-eval-btn {
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .auto-eval-btn:hover {
            background-color: #45a049;
        }
        .score-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            max-height: 80vh;
            overflow-y: auto;
            min-width: 300px;
        }
        .eval-status {
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999;
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            max-width: 300px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .eval-complete-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            text-align: center;
            z-index: 10001;
            min-width: 300px;
        }
        .eval-complete-dialog h2 {
            color: #4CAF50;
            margin: 0 0 20px 0;
        }
        .eval-complete-dialog .icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: #4CAF50;
        }
        .eval-complete-dialog .message {
            color: #666;
            margin-bottom: 20px;
        }
        .eval-complete-dialog button {
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .eval-complete-dialog button:hover {
            background: #45a049;
        }
        .eval-complete-dialog .author-info {
            color: #888;
            font-size: 12px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .eval-complete-dialog .author-info span {
            color: #4CAF50;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // 状态显示函数
    let statusDiv = null;
    function showStatus(message, duration = 3000) {
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'eval-status';
            document.body.appendChild(statusDiv);
        }
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        console.log(message);

        // 添加淡出动画样式
        statusDiv.style.transition = 'opacity 0.5s ease-in-out';

        // 设置定时使提示消失
        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                statusDiv.style.display = 'none';
                statusDiv.style.opacity = '1';
            }, 500);
        }, duration);
    }

    // 等待函数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 创建分数设置对话框
    function createScoreDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'score-dialog';

        // 获取所有教师
        const teachers = [];
        const teacherElements = document.querySelectorAll('.sc-panel-js');
        teacherElements.forEach(el => {
            const name = el.textContent.trim();
            const course = el.closest('.kc-js-array').querySelector('.sc-panel-kc').textContent.trim();
            // 使用教师名+课程名作为唯一标识
            const teacherId = `${name}_${course}`;
            if (!teachers.some(t => t.id === teacherId)) {
                teachers.push({ id: teacherId, name, course });
            }
        });

        // 创建对话框内容
        let html = '<h3>教师评分设置（建议90-95分）</h3>';

        // 批量设置
        html += `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                <div>批量设置：
                    <input type="number" id="batchScore" value="92" min="0" max="95" style="width: 60px; padding: 4px;">
                    <button id="applyBatchBtn" style="padding: 4px 8px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">应用到全部</button>
                </div>
            </div>
        `;

        // 教师列表
        teachers.forEach(teacher => {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${teacher.name}</div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${teacher.course}</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="number"
                            class="teacher-score"
                            data-teacher-id="${teacher.id}"
                            value="${window.teacherScores[teacher.id] || 92}"
                            min="0"
                            max="95"
                            style="width: 80px; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                        <span style="color: #666; font-size: 12px;">分 (建议90-95分)</span>
                    </div>
                </div>
            `;
        });

        // 按钮
        html += `
            <div style="margin-top: 15px; text-align: right;">
                <button id="cancelBtn" style="padding: 6px 12px; margin-right: 10px; background: #f5f5f5; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                <button id="confirmBtn" style="padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">确定</button>
            </div>
        `;

        dialog.innerHTML = html;
        document.body.appendChild(dialog);

        // 绑定事件
        dialog.querySelector('#applyBatchBtn').addEventListener('click', window.applyBatchScore);
        dialog.querySelector('#cancelBtn').addEventListener('click', window.closeScoreDialog);
        dialog.querySelector('#confirmBtn').addEventListener('click', window.saveScores);

        // 添加输入验证
        dialog.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = parseInt(e.target.value) || 0;
                value = Math.min(95, Math.max(0, value));
                e.target.value = value;
            });
        });
    }

    // 在评教函数前添加评语数组
    const teacherComments = [
        '老师授课的方式非常适合我们，他根据本课程知识结构的特点，重点突出，层次分明。和实际相结合，通过例题使知识更条理化。',
        '老师授课有条理，有重点，对同学既热情又严格，是各位老师学习的榜样。',
        '老师上课有时非常幽默，有时非常严格，不过还是非常有教授风度的。课堂氛围非常好！',
        '教师在课堂上通过丰富的教学方法和生动的案例，有效提高了学生的学习兴趣，增强了知识的吸收与理解能力。',
        '这位老师耐心细致，善于引导学生思考，课堂氛围活跃，学生积极参与，真正做到了寓教于乐。',
        '课程内容丰富深刻，老师的讲解条理清晰，能够将复杂的概念简单化，使学生在轻松愉快的环境中掌握知识。',
        '老师非常关心学生的学习进度，针对不同学生的需求，提供个性化的指导，帮助我们克服学习中的困难。',
        '教师善于与学生沟通，倾听我们的意见与建议，鼓励我们提出问题，让课堂成为一个充满互动和创造力的学习场所。',
        '课堂上教师运用多媒体辅助教学，生动形象地展示知识，激发了我们的学习热情，使我们对课程内容产生了浓厚的兴趣。',
        '这位老师不仅学识渊博，而且为人师表，言传身教，让我们不仅仅学到知识，更领悟了学习的态度。',
        '老师重视学术诚信，始终鼓励我们独立思考，抵制抄袭和依赖，使我们懂得诚信的重要性，塑造了良好学风。',
        '教师对学生的问题总是给予积极反馈，鼓励我们提出更多的疑问，这对促进我们的思考能力非常有帮助。',
        '这位老师热情洋溢，上课时能有效调动学生的积极性，使得课堂不再枯燥，激发了我们的学习热情。',
        '老师的教案准备得非常充分，知识点安排合理，有助于我们进行有效的复习，帮助我们提高学习效率。',
        '课堂氛围轻松愉快，教师善于使用幽默的方式讲解知识，减轻了我们的学习压力，让我们能更好地吸收。',
        '这位老师非常注重学生的反馈，经常根据我们的意见进行调整，使得课程的灵活性和适应性越来越强。',
        '教师的教学理念先进，强调批判性思维的培养，让我们在学习中不断提出问题，探索新的知识和解决方案。',
        '老师非常关心学生的全面发展，除了学业追求，还鼓励我们在课外参加丰富的活动，提升综合素质。',
        '教师非常关注学生的心理健康，善于倾听我们的问题，并给予恰当的建议，让我们在学习中更加自信。',
        '这位老师把实际案例与理论教学结合得很好，让我们在理解知识的同时，也能看到其实际应用的价值。'
    ];

    // 评教函数
    async function startEvaluation() {
        try {
            showStatus('开始评教流程...');

            // 等待页面加载
            await wait(2000);

            // 选择分数
            const scoreContainers = document.querySelectorAll('.sc-panel-content.bh-clearfix.bh-mv-8.wjzb-card-jskc');
            if (!scoreContainers || scoreContainers.length === 0) {
                throw new Error('未找到评分项');
            }

            // 按教师分组处理评分项
            const teacherQuestions = {};
            scoreContainers.forEach(container => {
                const teacherElement = container.querySelector('.sc-panel-js');
                if (!teacherElement) return; // 跳过没有教师名的容器

                const teacherName = teacherElement.textContent.trim();
                const courseElement = teacherElement.closest('.kc-js-array').querySelector('.sc-panel-kc');
                if (!courseElement) return;

                const courseName = courseElement.textContent.trim();
                // 使用教师名+课程名作为唯一标识
                const teacherId = `${teacherName}_${courseName}`;

                if (!teacherQuestions[teacherId]) {
                    teacherQuestions[teacherId] = [];
                }
                teacherQuestions[teacherId].push(container);
            });

            // 处理每个教师的评分
            for (let teacherId in teacherQuestions) {
                const targetScore = window.teacherScores[teacherId] || 92;
                const questions = teacherQuestions[teacherId];

                // 计算需要减去的总分数
                const pointsToDeduct = 100 - targetScore;
                let remainingPoints = pointsToDeduct;

                // 将题目按分值分组
                const questionGroups = {
                    high: [], // 10分以上
                    medium: [], // 5-9分
                    low: [] // 2-4分
                };

                questions.forEach(container => {
                    const buttons = container.querySelectorAll('.fzItem.bh-pull-left');
                    if (!buttons || buttons.length <= 2) return;

                    const maxScore = buttons.length;
                    if (maxScore >= 10) {
                        questionGroups.high.push(container);
                    } else if (maxScore >= 5) {
                        questionGroups.medium.push(container);
                    } else {
                        questionGroups.low.push(container);
                    }
                });

                // 随机决定是否在高分题目中扣分
                const shouldDeductFromHigh = Math.random() < 0.3; // 30%概率从高分题扣

                // 处理每个分值组的题目
                for (let container of questions) {
                    const scoreButtons = container.querySelectorAll('.fzItem.bh-pull-left');
                    if (!scoreButtons || scoreButtons.length === 0) continue;

                    const maxScore = scoreButtons.length;
                    let targetIndex = maxScore - 1; // 默认满分

                    if (remainingPoints > 0) {
                        // 根据题目分值和随机性决定是否扣分
                        let shouldDeduct = false;
                        let maxDeduct = 0;

                        if (maxScore >= 10) {
                            // 高分题目 (10分及以上)
                            shouldDeduct = Math.random() < 0.8; // 80%概率扣分
                            maxDeduct = shouldDeduct ? 2 : 0;
                        } else if (maxScore >= 7) {
                            // 较高分题目 (7-9分)
                            shouldDeduct = Math.random() < 0.6; // 60%概率扣分
                            maxDeduct = 2;
                        } else if (maxScore >= 5) {
                            // 中分题目 (5-6分)
                            shouldDeduct = Math.random() < 0.4; // 40%概率扣分
                            maxDeduct = 1;
                        } else if (maxScore > 2) {
                            // 低分题目 (3-4分)
                            shouldDeduct = Math.random() < 0.2; // 20%概率扣分
                            maxDeduct = 1;
                        }

                        if (shouldDeduct) {
                            // 根据剩余需要扣的分数调整实际扣分
                            let actualDeduct = Math.min(maxDeduct, remainingPoints);

                            // 对于高分值题目，确保至少扣1分
                            if (maxScore >= 7 && actualDeduct > 0) {
                                actualDeduct = Math.max(1, actualDeduct);
                            }

                            if (actualDeduct > 0) {
                                targetIndex = maxScore - 1 - actualDeduct;
                                remainingPoints -= actualDeduct;
                            }
                        }
                    }

                    // 确保索引在有效范围内并点击
                    targetIndex = Math.max(0, Math.min(targetIndex, maxScore - 1));
                    if (scoreButtons[targetIndex] && !scoreButtons[targetIndex].classList.contains('active')) {
                        scoreButtons[targetIndex].click();
                        await wait(100);
                    }
                }
            }

            // 创建评语副本用于随机选择
            let availableComments = [...teacherComments];

            // 填写评语
            const textareas = document.querySelectorAll('.bh-txt-input__txtarea');
            for (let textarea of textareas) {
                // 如果评语用完了，重新填充
                if (availableComments.length === 0) {
                    availableComments = [...teacherComments];
                }

                // 随机选择一条评语并从可用列表中移除
                const randomIndex = Math.floor(Math.random() * availableComments.length);
                const comment = availableComments.splice(randomIndex, 1)[0];

                textarea.value = comment;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                await wait(100);
            }

            // 修改提交后的提示
            const submitBtn = document.querySelector('a.bh-btn.bh-btn-success.bh-btn-large[data-action="提交"]');
            if (submitBtn) {
                submitBtn.click();
                showStatus('正在提交评教...', 2000);
                await wait(2000);
                showCompleteDialog();
            }
        } catch (error) {
            console.error('评教过程出错：', error);
            showStatus('评教出错：' + error.message);
            alert('评教出错：' + error.message + '\n请刷新页面后重试');
        }
    }

    // 初始化函数
    async function initialize() {
        try {
            if (document.readyState !== 'complete') {
                await new Promise(resolve => window.addEventListener('load', resolve));
            }
            await wait(3000);
            showStatus('页面加载完成，正在初始化评教脚本...');
            addButton();
        } catch (error) {
            console.error('初始化失败：', error);
            showStatus('初始化失败：' + error.message);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 添加按钮函数
    function addButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '9999';

        // 设置分数按钮
        const scoreButton = document.createElement('button');
        scoreButton.className = 'auto-eval-btn';
        scoreButton.style.marginRight = '10px';
        scoreButton.textContent = '设置分数';
        scoreButton.addEventListener('click', createScoreDialog);

        // 一键评教按钮
        const evalButton = document.createElement('button');
        evalButton.className = 'auto-eval-btn';
        evalButton.textContent = '一键评教';
        evalButton.addEventListener('click', startEvaluation);

        buttonContainer.appendChild(scoreButton);
        buttonContainer.appendChild(evalButton);
        document.body.appendChild(buttonContainer);

        showStatus('评教脚本已加载，请点击"设置分数"设置教师分数，然后点击"一键评教"开始评教', 5000);
    }

    // 添加全局变量
    window.teacherScores = {};

    // 添加全局函数
    window.applyBatchScore = function() {
        const batchScore = parseInt(document.getElementById('batchScore').value) || 92;
        const validScore = Math.min(95, Math.max(0, batchScore));

        document.querySelectorAll('.teacher-score').forEach(input => {
            input.value = validScore;
        });
    };

    window.saveScores = function() {
        document.querySelectorAll('.teacher-score').forEach(input => {
            const teacherId = input.dataset.teacherId;
            const score = parseInt(input.value) || 92;
            window.teacherScores[teacherId] = score;
        });

        window.closeScoreDialog();
        showStatus('教师评分已保存', 2000);
    };

    window.closeScoreDialog = function() {
        const dialog = document.querySelector('.score-dialog');
        if (dialog) {
            dialog.remove();
        }
    };

    // 修改评教完成提示函数
    function showCompleteDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'eval-complete-dialog';
        dialog.innerHTML = `
            <div class="icon">✅</div>
            <h2>评教完成</h2>
            <div class="message">所有教师评分已完成，感谢您的参与！</div>
            <button onclick="this.parentElement.remove()">确定</button>
            <div class="author-info">作者：<span>软工</span>，谢谢支持！</div>
        `;
        document.body.appendChild(dialog);
    }

})();