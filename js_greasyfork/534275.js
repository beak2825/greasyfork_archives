// ==UserScript==
// @name          三三制全自动答题
// @namespace     http://tampermonkey.net/
// @version       5.1
// @description   全自动完成所有题目并交卷，根据答题卡动态确定题目数量并弹窗提示，增加AI重试、在线题库导入、可拖动窗口等功能。支持DeepSeek和豆包(Doubao)AI。
// @author        Automation Expert (Optimized by AI & User, Doubao Integration by Assistant, Dynamic Question Count & Notification by Assistant)
// @match         https://33.bxwxm.com.cn/index/exam/show/id/*
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/534275/%E4%B8%89%E4%B8%89%E5%88%B6%E5%85%A8%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/534275/%E4%B8%89%E4%B8%89%E5%88%B6%E5%85%A8%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const CONFIG = {
        isPaused: false,        // 暂停状态标志
        answerDelay: 1500,      // 每题答题后延迟(ms)
        nextDelay: 1000,        // 点击下一题后延迟(ms)
        submitDelay: 5000,      // 答题完毕后，交卷前延迟(ms)
        maxRetries: 3,          // API调用最大重试次数
        temperature: 0.3,       // 控制AI回答随机性(0-1) (主要用于DeepSeek)
        answerMode: 'ai',       // 答题模式: 'ai' 或 'local'
        aiProvider: 'deepseek', // AI提供商: 'deepseek' 或 'doubao' (当 answerMode === 'ai')

        deepseek: {
            apiKey: '',
            model: 'deepseek-chat',
            baseUrl: 'https://api.deepseek.com/v1/chat/completions'
        },
        doubao: {
            apiKey: '',
            model: 'doubao-1.5-ui-tars-250328',
            baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
        },

        localQuestionBank: [],
        autoSubmitAfterCompletion: true,
    };

    // --- 元素选择器 ---
    const SELECTORS = {
        questionContainer: 'ul.list-unstyled.question',
        activeQuestion: 'ul.list-unstyled.question[style*="display: block"]',
        questionTitle: '.question_title',
        questionContent: '.question_content',
        questionOptionsList: 'li',
        optionInput: 'input[type="radio"], input[type="checkbox"]',
        nextBtn: '#nextQuestion',
        submitBtn: '#submitQuestions',
        questionIdDisplay: '.questionId',
        answerCardQuestionItem: '#answerCard .panel-body ul li.questionId',
    };

    // --- 辅助函数 ---
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function triggerClick(element) {
        if (!element) return;
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }

    function log(message, type = 'info') {
        const prefix = '[AutoAnswerScript]';
        switch (type) {
            case 'error': console.error(`${prefix} ${message}`); break;
            case 'warn': console.warn(`${prefix} ${message}`); break;
            default: console.log(`${prefix} ${message}`);
        }
    }

    function pauseScript(message) {
        CONFIG.isPaused = true;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) pauseBtn.textContent = '▶ 继续';
        const autoAnswerBtn = document.getElementById('autoAnswerBtn');
        if (autoAnswerBtn) autoAnswerBtn.disabled = false;
        log(message || '脚本已暂停。', 'warn');
        if (message) alert(message);
    }

    function getTotalQuestionCount() {
        const questionItems = document.querySelectorAll(SELECTORS.answerCardQuestionItem);
        if (questionItems && questionItems.length > 0) {
            log(`从答题卡检测到 ${questionItems.length} 个题目。`);
            return questionItems.length;
        }
        log('警告：未能从答题卡确定总题目数量。将尝试连续答题直到无下一题。', 'warn');
        return null;
    }

    // --- 核心逻辑 ---
    function parseLocalQuestionBank(bankText) {
        CONFIG.localQuestionBank = [];
        if (!bankText || !bankText.trim()) {
            log('本地题库内容为空。', 'warn'); return;
        }
        const questions = bankText.trim().split(/\n\s*\n/);
        questions.forEach(qBlock => {
            const lines = qBlock.trim().split('\n');
            if (lines.length >= 2) {
                const qLine = lines.find(l => l.startsWith('题目：'));
                const aLine = lines.find(l => l.startsWith('答案：'));
                if (qLine && aLine) {
                    CONFIG.localQuestionBank.push({ question: qLine.replace('题目：', '').trim(), answer: aLine.replace('答案：', '').trim() });
                }
            }
        });
        log(`本地题库解析完成: ${CONFIG.localQuestionBank.length} 条题目`);
        if (CONFIG.localQuestionBank.length === 0 && bankText.trim() !== "") {
            log('题库内容不为空，但未能解析出任何题目。请检查格式。', 'warn');
        }
    }

    function getQuestionType(questionElement) {
        const titleText = questionElement.querySelector(SELECTORS.questionTitle)?.textContent.trim() || '';
        if (titleText.includes('判断') || titleText.includes('对错')) return 'judge';
        if (titleText.includes('多选')) return 'multi';
        return 'single';
    }

    function selectRandomAnswer(options, questionType) {
        if (!options || options.length === 0) { log('无选项可随机选择。', 'warn'); return; }
        log(`执行随机选择策略 (类型: ${questionType})`);
        if (questionType === 'multi') {
            const shuffled = [...options].sort(() => 0.5 - Math.random());
            const count = Math.floor(Math.random() * Math.min(options.length, 3)) + 1;
            shuffled.slice(0, count).forEach(opt => triggerClick(opt));
        } else {
            triggerClick(options[Math.floor(Math.random() * options.length)]);
        }
    }

    async function answerWithLocalBank(questionElement) {
        let currentQuestionText = (questionElement.querySelector(SELECTORS.questionTitle)?.textContent?.trim() || '');
        const contentText = questionElement.querySelector(SELECTORS.questionContent)?.textContent?.trim() || '';
        if (contentText && contentText !== currentQuestionText) currentQuestionText = (currentQuestionText + " " + contentText).trim();
        currentQuestionText = currentQuestionText.replace(/^题目：/, '').trim();

        log(`当前题目 (本地库): ${currentQuestionText}`);
        if (CONFIG.localQuestionBank.length === 0) {
            pauseScript('本地题库为空或加载失败。请手动作答或更换AI模式。');
            await delay(CONFIG.answerDelay); return;
        }

        let foundEntry = CONFIG.localQuestionBank.find(entry => {
            const bankQ = entry.question.replace(/^题目：/, '').trim();
            return currentQuestionText.substring(0,10) === bankQ.substring(0,10) || currentQuestionText.includes(bankQ) || bankQ.includes(currentQuestionText);
        });

        if (foundEntry) {
            log(`题库命中: "${foundEntry.question}" -> 答案: "${foundEntry.answer}"`);
            const answers = foundEntry.answer.split(/,|，/).map(a => a.trim().toUpperCase());
            const optionInputs = Array.from(questionElement.querySelectorAll(SELECTORS.optionInput));
            let answered = false;
            answers.forEach(ans => {
                const option = optionInputs.find(opt => opt.value.toUpperCase() === ans);
                if (option) { triggerClick(option); log(`本地选择: ${ans}`); answered = true; }
                else { log(`本地答案 "${ans}" 对应选项未找到。`, 'warn'); }
            });
            if (!answered && answers.length > 0) pauseScript('本地题库答案的选项均未找到。请手动作答。');
        } else {
            pauseScript('本地题库未找到该题答案。请手动作答或更换AI。');
        }
        await delay(CONFIG.answerDelay);
    }

    async function answerWithAI(questionElement) {
        const qInfo = {
            title: questionElement.querySelector(SELECTORS.questionTitle)?.textContent?.trim() || '',
            content: questionElement.querySelector(SELECTORS.questionContent)?.textContent?.trim() || '',
            type: getQuestionType(questionElement),
            options: Array.from(questionElement.querySelectorAll(SELECTORS.questionOptionsList)).map(li => {
                const input = li.querySelector(SELECTORS.optionInput);
                if (!input) return null;
                let optText = li.textContent.trim().replace(new RegExp(`^${input.value}\\s*[\\.。．]?\\s*`), "").trim();
                return { value: input.value, text: optText || "(选项文本解析失败)" };
            }).filter(opt => opt !== null)
        };

        const providerCfg = CONFIG[CONFIG.aiProvider];
        if (!providerCfg || !providerCfg.apiKey?.trim()) {
            pauseScript(`${CONFIG.aiProvider.toUpperCase()} API密钥未设置。`); return;
        }

        log(`向 ${CONFIG.aiProvider.toUpperCase()} 请求: ${qInfo.title}`);
        const prompt = `这是一道${qInfo.type === 'judge' ? '判断' : (qInfo.type === 'multi' ? '多选' : '单选')}题：\n题目：${qInfo.title}\n${qInfo.content && qInfo.content !== qInfo.title ? `内容：${qInfo.content}\n` : ''}选项：\n${qInfo.options.map(opt => `${opt.value}. ${opt.text}`).join('\n')}\n\n请只回答选项字母。如果是多选题，请用英文逗号分隔多个选项 (例如: A,B,C)。不要包含任何解释或多余的文字。`;
        const messages = [
            { role: "system", content: "你是一个专业的考试助手，请严格按照要求，准确回答考试题目。只返回选项字母，不要解释或任何其他多余内容。" },
            { role: "user", content: prompt }
        ];
        let body = { model: providerCfg.model, messages };
        if (CONFIG.aiProvider === 'deepseek') { body.temperature = CONFIG.temperature; body.max_tokens = 100; }

        for (let attempts = 0; attempts < CONFIG.maxRetries; attempts++) {
            try {
                const resp = await fetch(providerCfg.baseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${providerCfg.apiKey}` },
                    body: JSON.stringify(body)
                });
                if (!resp.ok) {
                    const errData = await resp.text();
                    throw new Error(`API请求失败 (${CONFIG.aiProvider.toUpperCase()}), ${resp.status} ${resp.statusText}. ${errData}`);
                }
                const data = await resp.json();
                const aiAnswer = data.choices?.[0]?.message?.content?.trim();
                if (aiAnswer) {
                    log(`AI (${CONFIG.aiProvider.toUpperCase()}) 返回: "${aiAnswer}"`);
                    const answers = aiAnswer.split(/,|，/).map(a => a.trim().toUpperCase());
                    const optionInputs = Array.from(questionElement.querySelectorAll(SELECTORS.optionInput));
                    let selectedCount = 0;
                    answers.forEach(ans => {
                        const option = optionInputs.find(opt => opt.value.toUpperCase() === ans);
                        if (option) { triggerClick(option); log(`AI选择: ${ans}`); selectedCount++; }
                        else { log(`AI答案选项 "${ans}" 未在页面找到。`, 'warn'); }
                    });
                    if (selectedCount === 0 && answers.length > 0) {
                        pauseScript(`AI (${CONFIG.aiProvider.toUpperCase()}) 返回的答案 ("${aiAnswer}") 均未匹配到选项。请手动作答。`);
                    }
                    await delay(CONFIG.answerDelay); return;
                } else { throw new Error(`AI (${CONFIG.aiProvider.toUpperCase()}) 未返回有效答案。`); }
            } catch (error) {
                log(`AI (${CONFIG.aiProvider.toUpperCase()}) 答题失败 (尝试 ${attempts + 1}/${CONFIG.maxRetries}): ${error.message}`, 'error');
                if (attempts + 1 >= CONFIG.maxRetries) {
                    pauseScript(`AI (${CONFIG.aiProvider.toUpperCase()}) 答题连续失败 ${CONFIG.maxRetries} 次。错误: ${error.message}`); return;
                }
                await delay(2000 * (attempts + 1));
            }
        }
    }

    async function answerQuestion(questionElement) {
        if (CONFIG.answerMode === 'local') await answerWithLocalBank(questionElement);
        else if (CONFIG.answerMode === 'ai') await answerWithAI(questionElement);
    }

    async function goToNextQuestion() {
        const nextBtn = document.querySelector(SELECTORS.nextBtn);
        if (nextBtn && nextBtn.offsetParent !== null && !nextBtn.disabled) {
            log('点击下一题...'); triggerClick(nextBtn); await delay(CONFIG.nextDelay); return true;
        }
        log('未找到"下一题"或已是最后一题。'); return false;
    }

    async function submitExam() {
        const submitBtn = document.querySelector(SELECTORS.submitBtn);
        if (submitBtn && !submitBtn.disabled) {
            log(`等待 ${CONFIG.submitDelay / 1000} 秒后自动交卷...`); await delay(CONFIG.submitDelay);
            log('正在自动交卷...'); triggerClick(submitBtn);
            alert('试卷已尝试自动提交！请检查提交状态。');
        } else {
            alert('答题完毕，但未找到交卷按钮或按钮不可用，请手动交卷！');
        }
    }

    async function autoAnswerAll() {
        log('开始全自动答题流程...');
        const autoAnswerBtn = document.getElementById('autoAnswerBtn');
        if (autoAnswerBtn) autoAnswerBtn.disabled = true;
        const pauseBtn = document.getElementById('pauseBtn');

        const totalQuestionsOnPage = getTotalQuestionCount();
        if (totalQuestionsOnPage) {
            alert(`[自动答题脚本] 检测到 ${totalQuestionsOnPage} 道题目。将开始自动作答。`);
        } else {
            alert('[自动答题脚本] 未能从答题卡确定总题目数。脚本将尝试连续答题，直到无法找到“下一题”。请注意监控。');
        }

        let answerCount = 0;
        while (true) {
            if (CONFIG.isPaused) {
                log('脚本在循环开始处检测到暂停。'); return;
            }

            const currentQuestion = document.querySelector(SELECTORS.activeQuestion);
            if (!currentQuestion) {
                log('未找到当前题目，可能答题已结束或页面结构变化。');
                if (totalQuestionsOnPage && answerCount < totalQuestionsOnPage) {
                    log(`警告：(未找到当前题) 预期 ${totalQuestionsOnPage} 题，已答 ${answerCount} 题。`, 'warn');
                }
                break;
            }

            let progressMsg = `正在处理第 ${answerCount + 1} 题`;
            if (totalQuestionsOnPage) progressMsg += ` (共 ${totalQuestionsOnPage} 题)`;
            log(progressMsg + '...');

            await answerQuestion(currentQuestion);
            if (CONFIG.isPaused) { log('脚本在答题过程中被暂停。'); return; }

            answerCount++;

            if (totalQuestionsOnPage && answerCount >= totalQuestionsOnPage) {
                log(`已回答完答题卡上检测到的全部 ${totalQuestionsOnPage} 题。`);
                break;
            }

            const canGoNext = await goToNextQuestion();
            if (!canGoNext) {
                log('无法进入下一题 (已是最后一题或按钮问题)。');
                if (totalQuestionsOnPage && answerCount < totalQuestionsOnPage) {
                    log(`警告: (无法进入下一题) 预期 ${totalQuestionsOnPage} 题，处理 ${answerCount} 题后无法找到下一题。`, 'warn');
                }
                break;
            }
            await delay(500);
        }

        if (!CONFIG.isPaused) {
            log(`答题循环结束 (共处理了 ${answerCount} 题)。`);
            if (totalQuestionsOnPage) {
                log(`最终核对：答题卡显示 ${totalQuestionsOnPage} 题，实际处理了 ${answerCount} 题。`, 'info');
            }
            if (CONFIG.autoSubmitAfterCompletion) await submitExam();
            else alert(`所有题目处理完毕 (共 ${answerCount} 题)，请检查后手动提交试卷。`);
        }

        if (!CONFIG.isPaused) {
            if (autoAnswerBtn) autoAnswerBtn.disabled = false;
            if (pauseBtn) pauseBtn.textContent = '⏸ 暂停';
        }
    }

    function makeDraggable(element, handle) {
        let isDragging = false, offsetX, offsetY;
        const dragHandle = handle || element;
        const onStart = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            isDragging = true;
            const rect = element.getBoundingClientRect();
            const evt = e.type.startsWith('touch') ? e.touches[0] : e;
            offsetX = evt.clientX - rect.left; offsetY = evt.clientY - rect.top;
            element.style.userSelect = 'none'; element.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false }); document.addEventListener('touchend', onEnd);
        };
        const onMove = (e) => {
            if (!isDragging) return;
            if (e.type.startsWith('touch')) e.preventDefault();
            const evt = e.type.startsWith('touch') ? e.touches[0] : e;
            let newX = evt.clientX - offsetX, newY = evt.clientY - offsetY;
            const vpW = window.innerWidth, vpH = window.innerHeight;
            const elW = element.offsetWidth, elH = element.offsetHeight;
            newX = Math.max(0, Math.min(newX, vpW - elW)); newY = Math.max(0, Math.min(newY, vpH - elH));
            element.style.left = newX + 'px'; element.style.top = newY + 'px';
            element.style.bottom = 'auto'; element.style.right = 'auto';
        };
        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            element.style.userSelect = ''; element.style.cursor = 'move';
            document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd);
        };
        dragHandle.addEventListener('mousedown', onStart);
        dragHandle.addEventListener('touchstart', onStart, { passive: true });
    }

    function addControlButtons() {
        const infoPanel = document.createElement('div');
        infoPanel.id = 'autoAnswerInfoPanel';
        infoPanel.style.cssText = `position:fixed;top:10px;right:10px;z-index:10000;background-color:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;padding:15px;box-shadow:0 2px 10px rgba(0,0,0,0.1);font-family:Arial,sans-serif;max-width:300px;color:#495057;`;
        const infoHeader = document.createElement('h4');
        infoHeader.textContent = '使用说明';
        infoHeader.style.cssText = 'margin-top:0;margin-bottom:10px;color:#343a40;cursor:move;';
        infoPanel.appendChild(infoHeader);
        const infoList = document.createElement('ul');
        infoList.style.cssText = 'margin:0;padding-left:20px;font-size:13px;';
        const instructions = [
            "点击\"开始自动答题\"按钮开始答题流程，答题过程中可随时暂停。",
            "AI模式支持DeepSeek和豆包 (Doubao) API。",
            "本次豆包请求使用模型是doubao-1.5-ui-tars-250328",
            "脚本将尝试回答所有检测到的题目。如遇AI错误、题库未命中或需要手动干预的情况，将会暂停。",
            "请确保网络连接正常，特别是使用AI答题时。",
            "本地题库目前主要针对“形势与政策”，其他科目建议优先使用AI答题。",
            "无论是AI还是本地题库，都不能保证100%正确率，请自行核对关键题目。"
        ];
        instructions.forEach(text => { const li = document.createElement('li'); li.textContent = text; li.style.marginBottom = '5px'; infoList.appendChild(li); });
        infoPanel.appendChild(infoList); document.body.appendChild(infoPanel); makeDraggable(infoPanel, infoHeader);

        if (document.getElementById('autoAnswerPanel')) return;
        const panel = document.createElement('div');
        panel.id = 'autoAnswerPanel';
        panel.style.cssText = `position:fixed;bottom:10px;right:10px;z-index:10000;background-color:#f0f0f0;border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px rgba(0,0,0,0.2);font-family:Arial,sans-serif;min-width:180px;`;
        const title = document.createElement('div');
        title.textContent = '三三制答题助手';
        title.style.cssText = 'font-weight:bold;margin-bottom:10px;text-align:center;cursor:move;';
        panel.appendChild(title); makeDraggable(panel, title);

        const startBtn = document.createElement('button');
        startBtn.id = 'autoAnswerBtn'; startBtn.textContent = '🚀 开始自动答题';
        startBtn.style.cssText = `display:block;width:100%;padding:10px;margin-bottom:5px;background-color:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;transition:background-color 0.3s;`;
        startBtn.onmouseover = () => { if (!startBtn.disabled) startBtn.style.backgroundColor = '#45a049'; };
        startBtn.onmouseout = () => { if (!startBtn.disabled) startBtn.style.backgroundColor = '#4CAF50'; };
        startBtn.onclick = () => {
            CONFIG.isPaused = false;
            const currentPauseBtn = document.getElementById('pauseBtn');
            if (currentPauseBtn) currentPauseBtn.textContent = '⏸ 暂停';
            log('脚本已由“开始/继续”按钮启动或继续。');
            startBtn.disabled = true; autoAnswerAll();
        };
        panel.appendChild(startBtn);

        const pauseBtn = document.createElement('button');
        pauseBtn.id = 'pauseBtn'; pauseBtn.textContent = '⏸ 暂停';
        pauseBtn.style.cssText = `display:block;width:100%;padding:10px;background-color:#f44336;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;transition:background-color 0.3s;`;
        pauseBtn.onmouseover = () => pauseBtn.style.backgroundColor = '#da190b';
        pauseBtn.onmouseout = () => pauseBtn.style.backgroundColor = '#f44336';
        pauseBtn.onclick = () => {
            CONFIG.isPaused = !CONFIG.isPaused;
            pauseBtn.textContent = CONFIG.isPaused ? '▶ 继续' : '⏸ 暂停';
            const currentStartBtn = document.getElementById('autoAnswerBtn');
            if (currentStartBtn) currentStartBtn.disabled = CONFIG.isPaused; // If paused, start button is enabled. If unpaused by this button, start button gets disabled again by autoAnswerAll.
            if (CONFIG.isPaused) log('脚本已暂停。');
            else { log('脚本已继续。'); autoAnswerAll(); }
        };
        panel.appendChild(pauseBtn); document.body.appendChild(panel);
        log('控制按钮已添加。');
    }

    async function fetchQuestionBankFromUrl(url) {
        try {
            const resp = await fetch(url, { cache: "no-store" });
            if (!resp.ok) throw new Error(`网络响应错误: ${resp.status} ${resp.statusText}`);
            const textData = await resp.text();
            log(`从URL成功加载题库: ${textData.length}字符`); return textData;
        } catch (error) {
            log(`从URL加载题库失败: ${error}`, 'error');
            alert(`无法从在线URL加载题库: ${url}\n错误: ${error.message}\n\n将尝试使用内嵌备用题库。`);
            return null;
        }
    }

    async function initialize() {
        const useLocalBank = confirm("请选择答题模式：\n\n✅ [确定] = 本地题库模式 (在线加载)\n\n❌ [取消] = AI 答题模式");
        if (useLocalBank) {
            CONFIG.answerMode = 'local';
            const bankUrl = 'https://raw.githubusercontent.com/481306354/-/main/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96/%E9%A2%98%E5%BA%93.txt';
            log(`正在加载在线题库: ${bankUrl}`);
            let bankContent = await fetchQuestionBankFromUrl(bankUrl);
            if (!bankContent) {
                log('在线题库加载失败，使用备用题库。', 'warn');
                bankContent = `题目：人口高质量发展的核心要素不包括以下哪一项？（）。\n答案：A\n\n题目：以下哪种措施对提升人口素质最直接最有效？（）。\n答案：B`;
                if (!bankContent?.trim()) { alert('在线及备用题库均无效。'); log('备用题库无效。', 'error'); return; }
                else log('已加载备用题库。');
            }
            parseLocalQuestionBank(bankContent); addControlButtons();
            log('本地题库模式配置完成。');
        } else { // AI Mode
            CONFIG.answerMode = 'ai';
            const aiChoice = prompt("选择AI提供商：\n1. DeepSeek (默认)\n2. 豆包 (Doubao)\n输入数字:", "1")?.trim();
            let providerKey = (aiChoice === "2") ? 'doubao' : 'deepseek';
            CONFIG.aiProvider = providerKey;
            let storedApiKey = '';
            try { storedApiKey = localStorage.getItem(`${providerKey}ApiKey_33`) || ''; }
            catch (e) { log(`localStorage (${providerKey}) 访问失败: ${e.message}`, 'warn'); }
            const apiKeyInput = prompt(`请输入 ${providerKey.toUpperCase()} API密钥:`, storedApiKey);
            if (apiKeyInput?.trim()) {
                CONFIG[providerKey].apiKey = apiKeyInput.trim();
                try { localStorage.setItem(`${providerKey}ApiKey_33`, CONFIG[providerKey].apiKey); }
                catch (e) { log(`保存 ${providerKey} API密钥失败: ${e.message}`, 'warn'); }
                addControlButtons();
                log(`${providerKey.toUpperCase()} AI模式已加载。`);
            } else {
                alert(`${providerKey.toUpperCase()} AI模式需要API密钥。脚本未激活。`);
                log(`未提供${providerKey.toUpperCase()} API密钥。`, 'error'); return;
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }
})();