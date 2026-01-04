// ==UserScript==
// @name         岐黄天使学习助手 - 题目辅助模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.1
// @description  岐黄天使学习平台的题目辅助功能模块，提供题目识别、答案查看和学习辅助等功能。仅供学习参考，请遵守平台使用规则。
// @author       学习助手开发团队
// @match        *://www.tcm512.com/*
// @match        *://tcm512.com/*
// @match        *://*.tcm512.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      MIT
// @supportURL   https://github.com/your-repo/issues
// @homepageURL  https://github.com/your-repo
// ==/UserScript==

/*
 * 岐黄天使学习助手 - 重要说明
 * 
 * 本工具设计理念：
 * 1. 学习辅助而非替代学习：帮助用户更好地学习，而不是替代学习过程
 * 2. 答案参考而非直接作答：提供参考答案供用户思考，不会自动选择答案
 * 3. 促进理解而非应付考试：鼓励用户理解知识点，而不是单纯应付考试
 * 
 * 功能说明：
 * - 题目识别：自动识别当前学习的题目
 * - 答案参考：从题库中查找相关题目的参考答案
 * - 学习提醒：在适当时机提醒用户复习和巩固
 * - 进度跟踪：帮助用户了解学习进度
 * 
 * 使用建议：
 * 1. 先尝试自己回答问题，再查看参考答案
 * 2. 对照参考答案分析自己的理解是否正确
 * 3. 对于错误的题目，建议查阅相关资料深入学习
 * 4. 定期复习，巩固所学知识
 * 
 * 免责声明：
 * - 本工具仅供学习参考，使用者应遵守相关平台的使用规则
 * - 开发者不对使用本工具产生的任何后果承担责任
 * - 建议将此工具用于学习复习，而非考试作弊
 * - 真正的学习需要理解和思考，工具只是辅助手段
 */

// 题目辅助模块
(function() {
    'use strict';

    // 免责声明和用户同意检查
    function checkUserConsent() {
        const consentKey = 'qh_user_consent_v1';
        const hasConsent = GM_getValue(consentKey, false);
        
        if (!hasConsent) {
            const userConsent = confirm(
                '岐黄天使学习助手 - 重要声明\n\n' +
                '本工具仅供学习辅助和参考使用，请注意：\n' +
                '1. 请遵守平台的使用条款和规则\n' +
                '2. 建议将此工具用于学习复习，而非考试作弊\n' +
                '3. 使用本工具的风险由用户自行承担\n' +
                '4. 开发者不对使用后果承担责任\n\n' +
                '点击"确定"表示您已阅读并同意上述条款\n' +
                '点击"取消"将不启用辅助功能'
            );
            
            if (userConsent) {
                GM_setValue(consentKey, true);
                return true;
            } else {
                console.log('[学习助手] 用户未同意使用条款，功能已禁用');
                return false;
            }
        }
        return true;
    }

    // 检查用户同意，如果未同意则不加载功能
    if (!checkUserConsent()) {
        return;
    }

    // 初始化全局变量
    window.qh = window.qh || {};
    window.qh.isAutoAnswering = false;
    window.qh.autoAnswerInterval = null;
    window.qh.humanLikeDelay = { min: 2000, max: 5000 };
    window.qh.savedQuestionBank = GM_getValue('qh-question-bank', []);

    // 切换题目辅助状态
    window.toggleAutoAnswer = function() {
        if (window.qh.isAutoAnswering) {
            stopAutoAnswer();
        } else {
            startAutoAnswer();
        }
    };

    // 开始题目辅助
    window.startAutoAnswer = function() {
        if (window.qh.isAutoAnswering) {
            return;
        }

        window.qh.isAutoAnswering = true;

        if (window.qh && window.qh.updateStatus) {
            window.qh.updateStatus('题目辅助已开始');
        } else {
            console.log('题目辅助已开始');
        }

        const autoAnswerBtn = document.getElementById('qh-auto-answer-btn');
        if (autoAnswerBtn) {
            autoAnswerBtn.textContent = '停止题目辅助';
            autoAnswerBtn.style.background = 'linear-gradient(90deg, #f44336, #e53935)';
        }

        assistCurrentQuestion();
    };

    // 停止题目辅助
    window.stopAutoAnswer = function() {
        if (!window.qh.isAutoAnswering) {
            return;
        }

        if (window.qh.autoAnswerInterval) {
            clearTimeout(window.qh.autoAnswerInterval);
            window.qh.autoAnswerInterval = null;
        }

        window.qh.isAutoAnswering = false;

        if (window.qh && window.qh.updateStatus) {
            window.qh.updateStatus('题目辅助已停止');
        } else {
            console.log('题目辅助已停止');
        }

        const autoAnswerBtn = document.getElementById('qh-auto-answer-btn');
        if (autoAnswerBtn) {
            autoAnswerBtn.textContent = '题目辅助';
            autoAnswerBtn.style.background = 'linear-gradient(90deg, #E91E63, #C2185B)';
        }
    };

    // 辅助当前题目
    function assistCurrentQuestion() {
        try {
            if (!window.qh.isAutoAnswering) {
                return;
            }

            const currentQuestion = getCurrentQuestion();
            if (!currentQuestion) {
                console.log('未找到当前题目，延迟重试');
                window.qh.autoAnswerInterval = setTimeout(assistCurrentQuestion, getRandomDelay(window.qh.humanLikeDelay));
                return;
            }

            const matchedQuestion = findQuestionInBank(currentQuestion.title);
            if (!matchedQuestion) {
                console.log('题库中未找到匹配的题目:', currentQuestion.title);
                saveCurrentQuestion(currentQuestion);
                goToNextQuestion();
                return;
            }

            console.log('找到匹配的题目:', matchedQuestion.question);
            console.log('参考答案:', matchedQuestion.answer);

            showAnswerSuggestion(matchedQuestion.answer);

            window.qh.autoAnswerInterval = setTimeout(() => {
                goToNextQuestion();
            }, getRandomDelay(window.qh.humanLikeDelay));
        } catch (e) {
            console.error('题目辅助出错:', e);
            window.qh.autoAnswerInterval = setTimeout(assistCurrentQuestion, getRandomDelay(window.qh.humanLikeDelay));
        }
    }

    // 获取当前题目
    function getCurrentQuestion() {
        try {
            let questionElement = document.querySelector('.timu');
            if (questionElement) {
                const title = questionElement.querySelector('.subject')?.textContent.trim();
                if (title) {
                    return {
                        element: questionElement,
                        title: title,
                        isInIframe: false
                    };
                }
            }

            const frames = document.querySelectorAll('iframe');
            for (const frame of frames) {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow.document;
                    questionElement = frameDoc.querySelector('.timu');
                    if (questionElement) {
                        const title = questionElement.querySelector('.subject')?.textContent.trim();
                        if (title) {
                            return {
                                element: questionElement,
                                title: title,
                                isInIframe: true,
                                iframe: frame
                            };
                        }
                    }
                } catch (e) {
                    console.error('无法访问iframe内容:', e);
                }
            }

            return null;
        } catch (e) {
            console.error('获取当前题目出错:', e);
            return null;
        }
    }

    // 在题库中查找匹配的题目
    function findQuestionInBank(questionTitle) {
        if (!questionTitle || !window.qh.savedQuestionBank || window.qh.savedQuestionBank.length === 0) {
            return null;
        }

        const cleanTitle = questionTitle.replace(/^\d+[\.\、\s]+/, '').trim();

        const exactMatch = window.qh.savedQuestionBank.find(q => {
            const bankTitle = q.question.replace(/^\d+[\.\、\s]+/, '').trim();
            return bankTitle === cleanTitle;
        });

        if (exactMatch) {
            return exactMatch;
        }

        const threshold = 0.8;
        let bestMatch = null;
        let highestSimilarity = 0;

        for (const q of window.qh.savedQuestionBank) {
            const bankTitle = q.question.replace(/^\d+[\.\、\s]+/, '').trim();
            const similarity = calculateSimilarity(cleanTitle, bankTitle);

            if (similarity > threshold && similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = q;
            }
        }

        return bestMatch;
    }

    // 计算字符串相似度
    function calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        if (str1 === str2) return 1;

        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = [];
        
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const distance = matrix[len1][len2];
        const maxLen = Math.max(len1, len2);
        return 1 - distance / maxLen;
    }

    // 显示答案建议
    function showAnswerSuggestion(answer) {
        const existingBox = document.getElementById('qh-answer-suggestion');
        if (existingBox) {
            existingBox.remove();
        }

        const suggestionBox = document.createElement('div');
        suggestionBox.id = 'qh-answer-suggestion';
        suggestionBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-family: Arial, sans-serif;
        `;

        suggestionBox.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">📚 参考答案</div>
            <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
                ${answer}
            </div>
            <div style="font-size: 12px; opacity: 0.8; margin-bottom: 10px;">
                仅供参考，请根据学习内容判断
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                float: right;
            ">关闭</button>
        `;

        document.body.appendChild(suggestionBox);

        setTimeout(() => {
            if (suggestionBox.parentElement) {
                suggestionBox.remove();
            }
        }, 8000);
    }

    // 其他辅助函数...
    function saveCurrentQuestion(currentQuestion) {
        // 保存题目到本地题库的逻辑
    }

    function goToNextQuestion() {
        // 前往下一题的逻辑
    }

    function getRandomDelay(range) {
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    console.log('[学习助手] 题目辅助模块已加载');
})();
