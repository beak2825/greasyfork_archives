// ==UserScript==
// @name         组卷网-组卷中心一键清理
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  [2024.12.01]删除影响阅读的不必要元素，微调样式以方便观看，增加设置功能,能够设置是否保留试卷标题、大题、大题留白高度
// @author       TheOneAdonis
// @match        https://zujuan.xkw.com/zujuan
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513380/%E7%BB%84%E5%8D%B7%E7%BD%91-%E7%BB%84%E5%8D%B7%E4%B8%AD%E5%BF%83%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/513380/%E7%BB%84%E5%8D%B7%E7%BD%91-%E7%BB%84%E5%8D%B7%E4%B8%AD%E5%BF%83%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let globalSpecialQuestions = {};

    // 默认设置
    const defaultSettings = {
        preservePaperName: false,
        preserveQuestionTitles: false,
        specialQuestionPadding: 120
    };

    // 获取用户设置
    function getSettings() {
        return {
            preservePaperName: GM_getValue('preservePaperName', defaultSettings.preservePaperName),
            preserveQuestionTitles: GM_getValue('preserveQuestionTitles', defaultSettings.preserveQuestionTitles),
            specialQuestionPadding: GM_getValue('specialQuestionPadding', defaultSettings.specialQuestionPadding)
        };
    }

    // 保存用户设置
    function saveSettings(settings) {
        GM_setValue('preservePaperName', settings.preservePaperName);
        GM_setValue('preserveQuestionTitles', settings.preserveQuestionTitles);
        GM_setValue('specialQuestionPadding', settings.specialQuestionPadding);
    }

    // 重置设置
    function resetSettings() {
        saveSettings(defaultSettings);
        return defaultSettings;
    }

    // 记录需要留空的题目
    const recordSpecialQuestions = () => {
        const specialTypes = [
            '简答题', '材料题', '综合题', '解答题',
            '辨析题', '计算题', '情境探究题', '分析说明题'
        ];

        const specialQuestions = {};

        const quesTypeElements = document.querySelectorAll('.ques-type');

        quesTypeElements.forEach(element => {
            const typeName = element.getAttribute('name');

            if (specialTypes.includes(typeName)) {
                if (!specialQuestions[typeName]) {
                    specialQuestions[typeName] = [];
                }

                const questionBody = element.querySelector('.questype-body');
                if (questionBody) {
                    const questions = questionBody.querySelectorAll('.ques-item');

                    questions.forEach((question, index) => {
                        const questionNumberElement = question.querySelector('.quesindex');
                        const questionNumber = questionNumberElement
                            ? questionNumberElement.textContent.trim()
                            : `未知题号 ${index + 1}`;

                        specialQuestions[typeName].push({
                            questionNumber: questionNumber,
                            index: index + 1,
                            element: question,
                            text: question.textContent.trim()
                        });
                    });
                }
            }
        });

        globalSpecialQuestions = specialQuestions;
        console.log('特殊题目记录:', specialQuestions);

        return specialQuestions;
    };

    // 创建设置模态框
        function createSettingsModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 5px gray;
            border: 2px solid blue;
            padding: 20px;
            z-index: 2000;
            display: none;
        `;

        const settings = getSettings();

        modal.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 20px;">页面清理设置</h2>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <label>保留试卷名</label>
                <input type="checkbox" id="preservePaperName"
                    ${settings.preservePaperName ? 'checked' : ''}>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <label>保留题型</label>
                <input type="checkbox" id="preserveQuestionTitles"
                    ${settings.preserveQuestionTitles ? 'checked' : ''}>
            </div>

            <div style="margin-bottom: 15px;">
                <label>大题留白高度：</label>
                <input type="range" id="specialQuestionPadding"
                    min="60" max="240" step="10"
                    value="${settings.specialQuestionPadding}">
                    <span id="paddingValue">${settings.specialQuestionPadding}px</span>
            </div>

            <div style="display: flex; justify-content: space-between;">
                <button id="saveSettings">保存</button>
                <button id="resetSettings">重置默认</button>
                <button id="closeSettings">取消</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 实时更新留白高度显示
        const paddingSlider = modal.querySelector('#specialQuestionPadding');
        const paddingValue = modal.querySelector('#paddingValue');
        paddingSlider.addEventListener('input', (e) => {
            paddingValue.textContent = `${e.target.value}px`;
        });

        return modal;
    }



    // 页面加载完成后立即记录
    window.addEventListener('load', () => {
        recordSpecialQuestions();

        // 清理按钮
        const cleanButton = document.createElement('button');
        cleanButton.textContent = '清理';
        cleanButton.style.cssText = `
            position: fixed; right: 60px; top: 10px; z-index: 1000;
            padding: 10px; background-color: #2877ff;
            color: white; border: none; border-radius: 5px;
            cursor: pointer; margin-right: 10px;
        `;

        // 设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️';
        settingsButton.style.cssText = `
            position: fixed; right: 10px; top: 10px; z-index: 1000;
            padding: 10px; background-color: #f0f0f0;
            border: 1px solid #ccc; border-radius: 5px;
            cursor: pointer;
        `;

        const settingsModal = createSettingsModal();

        // 清理按钮事件
        cleanButton.addEventListener('click', function() {
            const settings = getSettings();

            // 删除元素列表
            const elementsToDelete = [
                'body > header',
                'body > div.bread-nav',
                'body > div.fiexd-nav',
                'body > main > aside',
                'body > main > article > div.seal-line',
                'body > main > article > div.paper-main > div.paper-body > div:nth-child(1) > div.part-head',
                '#part-head-box2',
                'body > main > article > div.paper-main > div.deleted-box',
                'body > div.footer',
                '#pui_studentinput',
                document.querySelector("#pui_studentinput") // 新增的元素选择器
            ];

            // 删除指定的元素
            elementsToDelete.forEach(selector => {
                if (typeof selector === 'string') {
                    const element = document.querySelector(selector);
                    if (element) element.remove();
                }
            });

            // 控制试卷名和标题
            if (!settings.preservePaperName) {
                const paperHead = document.querySelector('body > main > article > div.paper-main > div.paper-head');
                if (paperHead) paperHead.remove();
            }

            if (!settings.preserveQuestionTitles) {
                const questypeHeads = document.querySelectorAll('.questype-head');
                questypeHeads.forEach(element => element.remove());
            }

            // 为部分题型添加底部空白
            Object.values(globalSpecialQuestions).forEach(typeQuestions => {
                typeQuestions.forEach(question => {
                    question.element.style.paddingBottom = `${settings.specialQuestionPadding}px`;
                });
            });

            // 设置字体大小和页面样式
            document.querySelectorAll('*').forEach(el => {
                // 查找试卷标题
                const excludeElement = document.querySelector(
                    'body > main > article > div > div.paper-head > div.paper-title > #pui_maintitle'
                );

                // 跳过试卷标题
                if (el === excludeElement) {
                    return;
                }

                // 设置字体大小为 14px
                el.style.fontSize = '14px';

                // 如果当前元素不是 <body> 下的 <main> 元素，则设置外边距为 0px
                if (el !== document.querySelector('body > main')) {
                    el.style.margin = '0px';
                }
            });



            const paperCnt = document.querySelector('.paper-cnt.clearfix');
            if (paperCnt) paperCnt.style.maxWidth = '100%';

            const quesItems = document.querySelectorAll('.ques-item');
            quesItems.forEach(item => {
                item.style.paddingTop = '0';
                if (!item.style.paddingBottom || item.style.paddingBottom === '') {
                    item.style.paddingBottom = '0';
                }
            });

            // 清理按钮和设置按钮都消失
            cleanButton.remove();
            settingsButton.remove();
        });

        // 设置按钮事件
        settingsButton.addEventListener('click', () => {
            settingsModal.style.display = 'block';
        });

        // 保存设置
        settingsModal.querySelector('#saveSettings').addEventListener('click', () => {
            const newSettings = {
                preservePaperName: document.getElementById('preservePaperName').checked,
                preserveQuestionTitles: document.getElementById('preserveQuestionTitles').checked,
                specialQuestionPadding: parseInt(document.getElementById('specialQuestionPadding').value)
            };
            saveSettings(newSettings);
            settingsModal.style.display = 'none';
        });

        // 重置设置
        settingsModal.querySelector('#resetSettings').addEventListener('click', () => {
            settingsModal.style.display = 'none';
            const resetSettings = resetSettings();
            document.getElementById('preservePaperName').checked = resetSettings.preservePaperName;
            document.getElementById('preserveQuestionTitles').checked = resetSettings.preserveQuestionTitles;
            document.getElementById('specialQuestionPadding').value = resetSettings.specialQuestionPadding;
        });

        // 关闭设置框
        settingsModal.querySelector('#closeSettings').addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });

        document.body.appendChild(cleanButton);
        document.body.appendChild(settingsButton);
    });
})();