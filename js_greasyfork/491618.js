// ==UserScript==
// @name         Linux Do Summary
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Add button to summarize and toggle content of the main post.
// @author       Reno
// @match        https://linux.do/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491618/Linux%20Do%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/491618/Linux%20Do%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let state = {
        originalContent: '',
        toggled: false,
        apiTested: false
    };

    function init() {
        observeDOMChanges();
    }

    function addButtonAndEventListener() {
        const post = document.querySelector('#post_1');
        if (post && !document.getElementById('summaryToggleButton')) {
            const controlsContainer = document.querySelector('nav.post-controls');
            if (controlsContainer) {
                const button = document.createElement('button');
                button.id = 'summaryToggleButton';
                button.textContent = '总结';
                button.style.cssText = 'background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;';
                controlsContainer.appendChild(button);
                button.addEventListener('click', handleButtonClick);
                state = {
                    originalContent: '',
                    toggled: false,
                    apiTested: state.apiTested
                };
            }
        }
    }

    async function handleButtonClick() {
        const summaryToggleButton = document.getElementById('summaryToggleButton');
        if (!state.toggled) {
            summaryToggleButton.disabled = true;
            summaryToggleButton.style.backgroundColor = '#808080';

            let countdown = 10;
            summaryToggleButton.textContent = `${countdown} 秒`;

            const countdownInterval = setInterval(() => {
                countdown--;
                summaryToggleButton.textContent = `${countdown} 秒`;
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    summaryToggleButton.textContent = 'ಠ_ಠ';
                }
            }, 1000);

            const configExists = await checkAndSetConfig();
            if (configExists) {
                try {
                    const content = extractContent();
                    const summary = await fetchSummary(content);
                    if (summary) {
                        displaySummary(formatSummary(summary));
                        summaryToggleButton.textContent = '原文';
                        summaryToggleButton.style.backgroundColor = '#007bff';
                        state.toggled = true;
                        window.scrollTo(0, 0);

                    }
                } catch (error) {
                    console.error('处理内容时出错: ', error);
                    summaryToggleButton.textContent = '重试';
                }
            } else {
                summaryToggleButton.textContent = '重试';
            }

            clearInterval(countdownInterval);
            summaryToggleButton.disabled = false;
        } else {
            restoreOriginalContent();
            summaryToggleButton.textContent = '总结';
            summaryToggleButton.style.backgroundColor = '#4CAF50';
            state.toggled = false;
            window.scrollTo(0, 0);

        }
    }

    async function checkAndSetConfig() {
        const settings = { 'base_url': 'https://api.openai.com/v1/chat/completions', 'apikey': 'sk-k4NKZr82mTRTLCw984Da25536c374f4dB429A1Ee9dDa1087', 'model': 'gpt-4' };
        let configNeeded = false;

        for (let key in settings) {
            let storedValue = localStorage.getItem(key);
            if (!storedValue) {
                storedValue = prompt(`请输入 ${key}，示例：\n${settings[key]}`, '');
                if (storedValue) {
                    localStorage.setItem(key, storedValue);
                } else {
                    alert(`${key} 是必需的。没有 ${key}，插件无法运行。`);
                    return false;
                }
                configNeeded = true;
            }
        }

        if (configNeeded && !state.apiTested) {
            try {
                await testAPIConnection();
                state.apiTested = true;
            } catch (error) {
                localStorage.removeItem('base_url');
                localStorage.removeItem('apikey');
                localStorage.removeItem('model');
                alert('API测试失败，请检查设置');
                return false;
            }
        }
        return true;
    }

    async function testAPIConnection() {
        const response = await fetch(localStorage.getItem('base_url'), {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('apikey')}` }
        });

        if (!response.ok) throw new Error('API连接失败');
    }

    async function processContent() {
        const content = extractContent();
        if (content) {
            try {
                const summary = await fetchSummary(content);
                const formattedSummary = formatSummary(summary);
                displaySummary(formattedSummary);
            } catch (error) {
                console.error('处理内容时出错: ', error);
                alert('处理错误，请重试');
            }
        }
    }

    function extractContent() {
        let postStreamElement = document.querySelector('div.post-stream');
        if (postStreamElement && postStreamElement.querySelector('#post_1')) {
            let articleElement = postStreamElement.querySelector('#post_1');
            if (articleElement) {
                let cookedDiv = articleElement.querySelector('.cooked');
                if (cookedDiv) {
                    let elementsData = [];
                    let index = 0;

                    Array.from(cookedDiv.querySelectorAll('img, p, li')).forEach(node => {
                        let tagName = node.tagName.toLowerCase() === 'li' ? 'p' : node.tagName.toLowerCase();
                        let textContent = node.textContent.trim();
                        let src = tagName === 'img' ? node.getAttribute('src')?.trim() : null;

                        if (tagName === 'p' && textContent.includes('\n')) {
                            let contents = textContent.split(/\n+/).map(line => line.trim()).filter(line => line.length > 0);
                            elementsData.push({ index, tagName, textContent: contents[0], src });
                            index++;
                            for (let i = 1; i < contents.length; i++) {
                                elementsData.push({ index, tagName, textContent: contents[i], src });
                                index++;
                            }
                        } else {
                            elementsData.push({ index, tagName, textContent, src });
                            index++;
                        }
                    });

                    let cleanedElementsData = elementsData.filter(({ tagName, textContent }) => tagName !== 'p' || textContent.length > 1);
                    let uniqueElementsData = [];
                    let uniqueTextContents = new Set();
                    cleanedElementsData.forEach(({ tagName, textContent, src }) => {
                        let contentKey = `${tagName}_${textContent}_${src}`;
                        if (!uniqueTextContents.has(contentKey)) {
                            uniqueElementsData.push({ tagName, textContent, src });
                            uniqueTextContents.add(contentKey);
                        }
                    });

                    let htmlContent = "";
                    uniqueElementsData.forEach(({ tagName, textContent, src }) => {
                        if (tagName === 'p') {
                            htmlContent += `<p>${textContent}</p>`;
                        } else if (tagName === 'img') {
                            htmlContent += `<img src="${src}" alt="${textContent}">`;
                        }
                    });

                    return htmlContent;
                }
            }
        }
        return '';
    }

    async function fetchSummary(textContent) {
        const BASE_URL = window.localStorage.getItem('base_url');
        const API_KEY = window.localStorage.getItem('apikey');
        const MODEL = window.localStorage.getItem('model');
        const PROMPT = "以下是linux.do论坛的一个主题，帮我用中文简明扼要地梳理总结：";
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        };
        const body = JSON.stringify({ model: MODEL, messages: [{ role: "user", content: PROMPT + textContent }] });

        try {
            const response = await fetch(BASE_URL, { method: "POST", headers, body });
            if (!response.ok) throw new Error(`API请求失败，状态码: ${response.status}`);
            const jsonResponse = await response.json();
            if (jsonResponse && jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message) {
                return jsonResponse.choices[0].message.content;
            } else {
                throw new Error('API响应无效或格式不正确');
            }
        } catch (error) {
            console.error(error.message);
            alert("无法加载摘要，请稍后再试。错误详情: " + error.message);
            return null;
        }
    }

    function formatSummary(text) {
        if (!text) return '无法加载摘要。';
        text = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return text.replace(/^(#{1,6})\s(.*?)<br>/gm, (match, p1, p2) => `<h${p1.length}>${p2}</h${p1.length}><br>`)
            .replace(/- (.*?)<br>/g, '<li>$1</li><br>').replace(/<li>(.*?)<\/li><br><br>/g, '<ul><li>$1</li></ul><br>');
    }

    function displaySummary(formattedSummary) {
        const contentElement = document.querySelector('#post_1 .cooked');
        if (contentElement) {
            state.originalContent = contentElement.innerHTML;
            contentElement.innerHTML = formattedSummary;
            document.getElementById('summaryToggleButton').textContent = '原文';
            state.toggled = true;
        }
    }

    function restoreOriginalContent() {
        const contentElement = document.querySelector('#post_1 .cooked');
        if (contentElement && state.originalContent) {
            contentElement.innerHTML = state.originalContent;
            document.getElementById('summaryToggleButton').textContent = '总结';
            state.toggled = false;
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    addButtonAndEventListener();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();