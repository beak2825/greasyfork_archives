// ==UserScript==
// @name         鸿科经纬 题目爬虫 (v8.0 - 增加格式选择)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  直接在当前页面循环抓取题目，支持选择JSON或表格(CSV)格式保存，可随时停止并保存已获取的数据。
// @author       Gemini
// @match        http://yun.hotmatrix.cn/*
// @match        http://eshopcourse.hotmatrix.cn/*
// @grant        GM_addStyle
// @grant        GM_download
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotmatrix.cn
// @downloadURL https://update.greasyfork.org/scripts/538880/%E9%B8%BF%E7%A7%91%E7%BB%8F%E7%BA%AC%20%E9%A2%98%E7%9B%AE%E7%88%AC%E8%99%AB%20%28v80%20-%20%E5%A2%9E%E5%8A%A0%E6%A0%BC%E5%BC%8F%E9%80%89%E6%8B%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538880/%E9%B8%BF%E7%A7%91%E7%BB%8F%E7%BA%AC%20%E9%A2%98%E7%9B%AE%E7%88%AC%E8%99%AB%20%28v80%20-%20%E5%A2%9E%E5%8A%A0%E6%A0%BC%E5%BC%8F%E9%80%89%E6%8B%A9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局控制变量 ---
    let isCrawling = false;
    const allQuestions = new Map();

    // --- 工具函数 ---
    const log = (message, ...args) => console.log(`[题目爬虫 v8.0] ${message}`, ...args);
    const err = (message, ...args) => console.error(`[题目爬虫 v8.0] ${message}`, ...args);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // --- UI ---
    function updateButtonState(crawling) {
        const startButton = document.getElementById('crawlStartButton');
        const stopButton = document.getElementById('crawlStopButton');
        const formatSelector = document.getElementById('formatSelector');
        if (startButton && stopButton && formatSelector) {
            startButton.disabled = crawling;
            stopButton.disabled = !crawling;
            formatSelector.disabled = crawling; // 爬取时禁止切换格式
            stopButton.style.display = crawling ? 'inline-block' : 'none';
            startButton.textContent = '开始爬取题目';
        }
    }

    // --- 数据转换 ---

    /**
     * 将题目数据转换为 CSV 格式的字符串
     * @param {Array<Object>} data - 题目对象数组
     * @returns {string} CSV 格式的字符串
     */
    function convertToCSV(data) {
        if (!data || data.length === 0) return '';

        // Helper function to escape CSV fields
        const escapeCSV = (field) => {
            if (field === null || field === undefined) return '';
            const str = String(field);
            // If the field contains a comma, a quote, or a newline, wrap it in double quotes.
            // Also, double up any existing double quotes.
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const headers = ['题号', '类型', '题目', '所有选项', '正确答案'];
        const headerRow = headers.map(escapeCSV).join(',') + '\n';

        const bodyRows = data.map(q => {
            const optionsText = Object.entries(q.options)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n'); // 用换行符分隔每个选项

            const row = [
                q.number,
                q.type,
                q.title,
                optionsText,
                q.foundAnswer
            ];
            return row.map(escapeCSV).join(',');
        }).join('\n');

        return headerRow + bodyRows;
    }


    // --- 数据处理 ---
    function saveData(data, baseFilename) {
        if (!data || data.length === 0) {
            log('没有可保存的数据。');
            return; // 不再弹窗打扰
        }

        const format = document.getElementById('formatSelector')?.value || 'json';
        log(`用户选择的保存格式: ${format}`);

        let blob, filename, filetype;

        if (format === 'csv') {
            const csvData = convertToCSV(data);
            filetype = 'text/csv;charset=utf-8;';
            blob = new Blob([`\uFEFF${csvData}`], { type: filetype }); // Add BOM for Excel
            filename = `${baseFilename}.csv`;
        } else { // 默认为 json
            const jsonData = JSON.stringify(data, null, 2);
            filetype = 'application/json';
            blob = new Blob([jsonData], { type: filetype });
            filename = `${baseFilename}.json`;
        }


        log(`准备下载 ${data.length} 道题目... 文件名: ${filename}`);
        try {
            GM_download({
                url: URL.createObjectURL(blob),
                name: filename,
                saveAs: true,
                onload: () => log('文件已开始下载。'),
                onerror: (error) => err(`GM_download 下载失败: ${error.error}`)
            });
        } catch (e) {
            err('GM_download 不可用，使用备用下载方法。');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }
        alert(`操作完成！即将下载包含 ${data.length} 道题目的 ${format.toUpperCase()} 文件。`);
    }

    // --- 核心爬取逻辑 ---

    async function waitForQuestionChange(doc, oldQuestionNumber) {
        log(`等待题目从 ${oldQuestionNumber} 更新...`);
        let attempts = 0;
        while (attempts < 10) {
            if (!isCrawling) return false; // 如果在等待时用户点击了停止
            const numEl = doc.querySelector('#num');
            const currentNum = numEl ? numEl.innerText.trim() : '';
            if (currentNum && currentNum !== oldQuestionNumber) {
                log(`新题目 ${currentNum} 已加载。`);
                await delay(300);
                return true;
            }
            await delay(1000);
            attempts++;
        }
        err("等待新题目加载超时。");
        return false;
    }

    function stopCrawling() {
        log("用户请求停止，将在当前题目处理完毕后终止...");
        isCrawling = false;
        const stopButton = document.getElementById('crawlStopButton');
        if (stopButton) stopButton.disabled = true; // 防止重复点击
    }

    async function startCrawling() {
        if (isCrawling) return;
        isCrawling = true;
        allQuestions.clear();
        updateButtonState(true);

        try {
            const docContext = document;

            while (isCrawling) {
                await delay(200);

                const rightCon = docContext.querySelector('.rightCon');
                if (!rightCon) {
                    log('找不到题目主容器 .rightCon，爬取结束。');
                    break;
                }

                const numEl = rightCon.querySelector('#num');
                const currentQuestionNumber = numEl ? numEl.innerText.trim() : null;

                if (!currentQuestionNumber) { err('页面结构不完整，找不到题目编号。'); break; }
                if (allQuestions.has(currentQuestionNumber)) { log(`检测到重复题目编号 ${currentQuestionNumber}，爬取结束。`); break; }

                const startButton = document.getElementById('crawlStartButton');
                if (startButton) startButton.textContent = `正在爬取第 ${currentQuestionNumber} 题...`;

                const typeEl = rightCon.querySelector('#type');
                const titleEl = rightCon.querySelector('.titleDetail p');
                const optionsUl = rightCon.querySelector('.titleDetail ul');

                let cleanTitle = titleEl.innerText;
                let answer = '未找到';

                const answerSpan = titleEl.querySelector('span[style*="color:red"]');
                if (answerSpan) {
                    const answerMatch = answerSpan.innerText.match(/正确答案：\s*([A-Z]+)/);
                    if (answerMatch) {
                        answer = answerMatch[1];
                        cleanTitle = cleanTitle.replace(answerSpan.innerText, '').trim();
                    }
                }
                if (answer === '未找到') {
                    const selectedLi = optionsUl.querySelector('li.selected');
                    if (selectedLi) answer = selectedLi.querySelector('button')?.innerText.trim() || '未找到';
                }

                const options = {};
                optionsUl.querySelectorAll('li').forEach(li => {
                    const key = li.querySelector('button')?.innerText.trim();
                    const value = li.querySelector('i')?.innerText.trim();
                    if (key && value) options[key] = value;
                });

                const questionData = {
                    number: currentQuestionNumber,
                    type: typeEl.innerText.trim(),
                    title: cleanTitle,
                    options,
                    foundAnswer: answer
                };

                allQuestions.set(currentQuestionNumber, questionData);
                console.groupCollapsed(`[题目 ${questionData.number}] ${questionData.title.substring(0, 40)}...`);
                console.log("题目详情:", questionData);
                console.groupEnd();

                const nextButton = docContext.querySelector('#next');
                if (nextButton && !nextButton.disabled) {
                    log("点击 '下一题'。");
                    nextButton.click();
                    if (!await waitForQuestionChange(docContext, currentQuestionNumber)) {
                        log("点击下一题后题目未更新或被用户中断，爬取结束。");
                        break;
                    }
                } else {
                    log('找不到可点击的“下一题”按钮，爬取结束。');
                    break;
                }
            }
        } catch (error) {
            err(`爬取过程中发生严重错误: ${error.message}`);
            alert(`爬取过程中发生严重错误，请按F12打开控制台查看详情。\n错误: ${error.message}`);
        } finally {
            isCrawling = false; // 确保循环标志被重置
            saveData(Array.from(allQuestions.values()), '鸿科经纬-题目');
            updateButtonState(false);
        }
    }

    function setupUI() {
        if (document.getElementById('crawlContainer')) return;

        const container = document.createElement('div');
        container.id = 'crawlContainer';

        const startButton = document.createElement('button');
        startButton.id = 'crawlStartButton';
        startButton.textContent = '开始爬取题目';
        startButton.addEventListener('click', startCrawling);

        const stopButton = document.createElement('button');
        stopButton.id = 'crawlStopButton';
        stopButton.textContent = '停止并保存';
        stopButton.addEventListener('click', stopCrawling);
        stopButton.style.display = 'none';

        const formatSelector = document.createElement('select');
        formatSelector.id = 'formatSelector';
        formatSelector.innerHTML = `
            <option value="json">JSON 格式</option>
            <option value="csv">表格 (CSV) 格式</option>
        `;

        GM_addStyle(`
            #crawlContainer {
                position: fixed; top: 100px; right: 20px; z-index: 10000;
                display: flex; flex-direction: column; gap: 8px;
            }
            #crawlStartButton, #crawlStopButton, #formatSelector {
                padding: 10px 15px; color: white; border: none;
                border-radius: 5px; cursor: pointer; font-size: 16px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: background-color 0.3s, color 0.3s;
                text-align: center;
            }
            #crawlStartButton { background-color: #4CAF50; }
            #crawlStartButton:hover { background-color: #45a049; }
            #crawlStartButton:disabled { background-color: #A5A5A5; color: #E0E0E0; cursor: not-allowed; }

            #crawlStopButton { background-color: #f44336; }
            #crawlStopButton:hover { background-color: #d32f2f; }
            #crawlStopButton:disabled { background-color: #A5A5A5; color: #E0E0E0; cursor: not-allowed; }

            #formatSelector { background-color: #008CBA; color: white; }
            #formatSelector:disabled { background-color: #A5A5A5; color: #E0E0E0; cursor: not-allowed; }
        `);

        container.appendChild(startButton);
        container.appendChild(stopButton);
        container.appendChild(formatSelector);
        document.body.appendChild(container);
        log("UI已加载，等待用户操作。");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUI);
    } else {
        setupUI();
    }

})();