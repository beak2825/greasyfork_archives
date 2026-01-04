// ==UserScript==
// @name         粉笔自动答题助手
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动监听粉笔题目请求并查找答案，用法：F12进入DevTools，在控制台输出中查看答案
// @author       BlingCc
// @match        *://*.fenbi.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @icon         https://www.fenbi.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/546702/%E7%B2%89%E7%AC%94%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546702/%E7%B2%89%E7%AC%94%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const SNIPPET_LENGTH = 30;
    const REQUEST_DELAY = 200;
    const QUESTIONS_API_PATTERN = /\/api\/xingce\/universal\/auth\/questions\?|combine\/static\/exercise/;

    console.log('%c🚀 粉笔自动答题助手已启动...', 'color: blue; font-size: 16px;');

    // --- 辅助函数 ---
    const stripHtml = (html) => {
        if (!html) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return (tempDiv.textContent || tempDiv.innerText || '').trim();
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const formatChoiceIndex = (choiceIndex) => {
        const index = parseInt(choiceIndex, 10);
        if (!isNaN(index) && index >= 0) {
            return String.fromCharCode(65 + index);
        }
        return choiceIndex;
    };

    const formatFinalAnswer = (question, solution) => {
        const questionText = stripHtml(question.content);
        const correctAnswer = solution.correctAnswer;
        let answerText = '未找到答案';

        if (correctAnswer) {
            if (correctAnswer.type === 201 && correctAnswer.choice) {
                const choiceIndex = parseInt(correctAnswer.choice, 10);
                const optionsAccessory = question.accessories && question.accessories.find(acc => acc.type === 101);
                if (optionsAccessory && optionsAccessory.options && optionsAccessory.options[choiceIndex]) {
                    const letter = formatChoiceIndex(correctAnswer.choice);
                    answerText = `${letter}. ${optionsAccessory.options[choiceIndex]}`;
                } else {
                    answerText = `选项 ${formatChoiceIndex(correctAnswer.choice)}`;
                }
            } else {
                answerText = JSON.stringify(correctAnswer);
            }
        }

        return `✅ ${questionText}\n   ➡️ 答案: ${answerText}`;
    };

    const fetchData = async (url) => {
        try {
            const response = await fetch(url, {
                credentials: 'include'
            });
            if (!response.ok) {
                console.error(`请求失败，状态码: ${response.status}`, url);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('网络请求异常:', error, url);
            return null;
        }
    };

    // --- 主处理逻辑 ---
    const processQuestions = async (questionsData) => {
        console.log('%c🔍 检测到题目数据，开始处理...', 'color: green; font-size: 14px;');

        const { materials, questions } = questionsData;
        if (!questions || !Array.isArray(questions)) {
            console.warn('❌ 无效的题目数据格式');
            return;
        }

        const finalResults = [];
        const solutionsMap = new Map();

        // 处理材料（如果有的话）
        if (materials && materials.length > 0) {
            console.log(`📚 检测到 ${materials.length} 份材料，正在处理...`);
            for (const material of materials) {
                const queryText = stripHtml(material.content).substring(0, SNIPPET_LENGTH);
                const encodedQuery = encodeURIComponent(queryText);
                const searchUrl = `https://algo.fenbi.com/api/fenbi-question-search/question?q=${encodedQuery}&coursePrefix=xingce&offset=0&length=15&format=html&sourceType=0&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;

                console.log(`   - 正在搜索材料ID: ${material.id}...`);
                const searchResult = await fetchData(searchUrl);
                await sleep(REQUEST_DELAY);

                if (!searchResult || !searchResult.data || !searchResult.data.items) {
                    console.warn(`   - 材料ID ${material.id} 的搜索请求失败或无结果。`);
                    continue;
                }

                const matchedItem = searchResult.data.items.find(item => item.materialId === material.id);

                if (matchedItem && matchedItem.encodeCheckInfo) {
                    const { encodeCheckInfo } = matchedItem;
                    const solutionUrl = `https://tiku.fenbi.com/api/xingce/universal/auth/solutions?type=8&id=${material.id}&checkId=${encodeCheckInfo}&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;

                    console.log(`   - 已找到材料ID ${material.id} 的checkInfo，正在获取答案...`);
                    const solutionsData = await fetchData(solutionUrl);
                    await sleep(REQUEST_DELAY);

                    if (solutionsData && solutionsData.solutions) {
                        solutionsData.solutions.forEach(sol => {
                            solutionsMap.set(sol.id, sol);
                        });
                        console.log(`   - 成功获取材料ID ${material.id} 关联的 ${solutionsData.solutions.length} 个答案。`);
                    } else {
                        console.warn(`   - 获取材料ID ${material.id} 的答案失败。`);
                    }
                } else {
                    console.warn(`   - 未能在搜索结果中找到与材料ID ${material.id} 匹配的项。`);
                }
            }
        }

        // 处理题目
        console.log(`🧠 开始处理全部 ${questions.length} 道题目...`);
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            console.log(`\n--- [${i + 1}/${questions.length}] 处理题目ID: ${question.id} ---`);

            // 先检查是否已经从材料中获取了答案
            if (solutionsMap.has(question.id)) {
                const solution = solutionsMap.get(question.id);
                finalResults.push(formatFinalAnswer(question, solution));
                console.log(`   - (来自材料) 题目ID ${question.id} 的答案已找到。`);
                continue;
            }

            // 独立搜索题目
            const queryText = stripHtml(question.content).substring(0, SNIPPET_LENGTH);
            const encodedQuery = encodeURIComponent(queryText);
            const searchUrl = `https://algo.fenbi.com/api/fenbi-question-search/question?q=${encodedQuery}&coursePrefix=xingce&offset=0&length=15&format=html&sourceType=0&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;

            console.log(`   - (独立搜索) 正在搜索题目ID: ${question.id}...`);
            const searchResult = await fetchData(searchUrl);
            await sleep(REQUEST_DELAY);

            if (!searchResult || !searchResult.data || !searchResult.data.items) {
                console.warn(`   - 题目ID ${question.id} 的搜索请求失败或无结果。`);
                finalResults.push(`❌ ${stripHtml(question.content)}\n   ➡️ 答案: 未能通过搜索找到答案`);
                continue;
            }

            const matchedItem = searchResult.data.items.find(item => item.questionId === question.id);

            if (matchedItem && matchedItem.encodeCheckInfo) {
                const { encodeCheckInfo } = matchedItem;
                const solutionUrl = `https://tiku.fenbi.com/api/xingce/universal/auth/solutions?type=6&questionIds=${question.id}&checkId=${encodeCheckInfo}&app=web&kav=100&av=100&hav=100&version=3.0.0.0`;

                console.log(`   - 已找到题目ID ${question.id} 的checkInfo，正在获取答案...`);
                const solutionData = await fetchData(solutionUrl);
                await sleep(REQUEST_DELAY);

                if (solutionData && solutionData.solutions && solutionData.solutions.length > 0) {
                    finalResults.push(formatFinalAnswer(question, solutionData.solutions[0]));
                    console.log(`   - 成功获取题目ID ${question.id} 的答案。`);
                } else {
                    console.warn(`   - 获取题目ID ${question.id} 的答案失败。`);
                    finalResults.push(`❌ ${stripHtml(question.content)}\n   ➡️ 答案: 获取答案失败`);
                }
            } else {
                console.warn(`   - 未能在搜索结果中找到与题目ID ${question.id} 匹配的项。`);
                finalResults.push(`❌ ${stripHtml(question.content)}\n   ➡️ 答案: 搜索无匹配项`);
            }
        }

        // 输出最终结果
        console.log('\n\n==================================================');
        console.log('%c🎉 全部题目处理完成！最终答案如下：', 'color: green; font-size: 20px; font-weight: bold;');
        console.log('==================================================\n');

        console.log(finalResults.join('\n\n'));
        console.log('\n==================================================');
    };

    // --- 拦截网络请求 ---

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);

        // 检查是否是题目请求
        if (response.url && QUESTIONS_API_PATTERN.test(response.url)) {
            console.log('%c📡 检测到题目请求:', 'color: orange; font-weight: bold;', response.url);

            // 克隆响应以避免影响原始请求
            const clonedResponse = response.clone();
            try {
                const data = await clonedResponse.json();
                // 延迟处理，确保页面已加载
                setTimeout(() => {
                    processQuestions(data);
                }, 500);
            } catch (error) {
                console.error('解析题目数据失败:', error);
            }
        }

        return response;
    };

    // 拦截 XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._interceptedURL = url;
        this._interceptedMethod = method;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(data) {
        if (this._interceptedURL && QUESTIONS_API_PATTERN.test(this._interceptedURL)) {
            console.log('%c📡 检测到XHR题目请求:', 'color: orange; font-weight: bold;', this._interceptedURL);

            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const responseData = JSON.parse(this.responseText);
                        // 延迟处理，确保页面已加载
                        setTimeout(() => {
                            processQuestions(responseData);
                        }, 500);
                    } catch (error) {
                        console.error('解析XHR题目数据失败:', error);
                    }
                }

                if (originalOnReadyStateChange) {
                    return originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }

        return originalXHRSend.apply(this, arguments);
    };

    console.log('%c✅ 网络请求监听已激活，等待题目数据...', 'color: green; font-weight: bold;');

})();