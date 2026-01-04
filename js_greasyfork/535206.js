// ==UserScript==
// @name         neustudydl试题数据提取，方便复制用
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  拦截包含"enter?testId="的请求，提取并显示试题和选项，增加复制全部按钮，同时弹出框失去焦点自动关闭
// @author       You
// @match        *://neustudydl.neumooc.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/535206/neustudydl%E8%AF%95%E9%A2%98%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%A4%8D%E5%88%B6%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535206/neustudydl%E8%AF%95%E9%A2%98%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%A4%8D%E5%88%B6%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 读取并解析JSON数据
    function extractQuestionsAndChoices(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            const result = [];
            const paperParts = data.data.paper.paperParts || [];

            paperParts.forEach(part => {
                part.paperQuestionList.forEach(question => {
                    const paperQuestion = question.paperQuestion;
                    if (!paperQuestion) return;

                    const stemText = paperQuestion.stemText || '';
                    const choices = (paperQuestion.choices || []).map(choice => ({
                        choiceId: choice.choiceId || '',
                        choiceContent: choice.choiceContent || ''
                    }));

                    result.push({
                        questionNo: paperQuestion.questionNo || '',
                        stemText: stemText,
                        choices: choices
                    });
                });
            });

            return result;
        } catch (error) {
            console.error('解析JSON数据时出错:', error);
            return [];
        }
    }

    // 格式化数据为HTML
    function formatQuestionsToHTML(questions) {
        let html = '<div style="font-family: Arial, sans-serif; padding: 20px;">';
        html += '<h2>试题和选项列表</h2>';

        questions.forEach(item => {
            html += `<div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">`;
            html += `<h3>题目 ${item.questionNo}: ${item.stemText}</h3>`;
            html += `<ul style="list-style-type: none; padding-left: 20px;">`;

            item.choices.forEach((choice, index) => {
                html += `<li style="margin-bottom: 5px;"><strong>${String.fromCharCode(65 + index)}.</strong> ${choice.choiceContent}</li>`;
            });

            html += `</ul></div>`;
        });

        html += '</div>';
        return html;
    }

    // 显示捕获的数据
    function displayCapturedData() {
        const capturedData = GM_getValue('capturedData', '{}');

        try {
            const questionsAndChoices = extractQuestionsAndChoices(capturedData);

            if (questionsAndChoices.length === 0) {
                alert('暂未捕获到有效的试题数据，请先进入试卷页面。');
                return;
            }

            // 创建对话框显示数据
            const dialog = document.createElement('div');
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.width = '80%';
            dialog.style.maxWidth = '800px';
            dialog.style.maxHeight = '80%';
            dialog.style.overflow = 'auto';
            dialog.style.backgroundColor = 'white';
            dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            dialog.style.zIndex = '10001';
            dialog.style.borderRadius = '5px';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            closeBtn.style.position = 'sticky';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.padding = '5px 10px';
            closeBtn.style.float = 'right';
            closeBtn.style.backgroundColor = '#f44336';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '4px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => dialog.remove();

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '复制全部';
            copyBtn.style.position = 'sticky';
            copyBtn.style.top = '10px';
            copyBtn.style.right = '80px';
            copyBtn.style.padding = '5px 10px';
            copyBtn.style.float = 'right';
            copyBtn.style.backgroundColor = '#4CAF50';
            copyBtn.style.color = 'white';
            copyBtn.style.border = 'none';
            copyBtn.style.borderRadius = '4px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.onclick = () => {
                const textContent = questionsAndChoices.map(item => {
                    let text = `题目 ${item.questionNo}: ${item.stemText}\n`;
                    item.choices.forEach((choice, index) => {
                        text += `${String.fromCharCode(65 + index)}. ${choice.choiceContent}\n`;
                    });
                    return text + '\n';
                }).join('\n');
                navigator.clipboard.writeText(textContent)
                    .then(() => alert('已复制到剪贴板'))
                    .catch(err => console.error('复制失败:', err));
            };

            const content = document.createElement('div');
            content.innerHTML = formatQuestionsToHTML(questionsAndChoices);

            dialog.appendChild(closeBtn);
            dialog.appendChild(copyBtn);
            dialog.appendChild(content);
            document.body.appendChild(dialog);

            // 自动关闭弹出框
            dialog.addEventListener('focusout', () => dialog.remove());

        } catch (error) {
            console.error('显示数据时出错:', error);
            alert('处理数据时出错，请查看控制台获取详情。');
        }
    }

    // 拦截XMLHttpRequest请求
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        if (url.includes('enter?testId=')) {
            const originalSend = this.send;
            this.send = function (...sendArgs) {
                this.addEventListener('load', function () {
                    if (this.status === 200) {
                        try {
                            const capturedData = this.responseText;
                            console.log('已捕获试题数据');
                            GM_setValue('capturedData', capturedData);

                            if (typeof GM_notification === 'function') {
                                GM_notification({
                                    title: '试题数据已捕获',
                                    text: '点击油猴图标菜单中的"显示试题数据"查看详情',
                                    timeout: 3000
                                });
                            }
                        } catch (e) {
                            console.error('捕获JSON数据失败', e);
                        }
                    }
                });
                return originalSend.apply(this, sendArgs);
            };
        }
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    // 注册油猴菜单命令
    GM_registerMenuCommand('显示试题数据', displayCapturedData);
})();