// ==UserScript==
// @name         帖子观点阵营AI分析（开箱即用）
// @namespace    https://github.com/sedoruee
// @version      2.0.6
// @description  null
// @author       Sedoruee
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM.info
// @run-at       document-start
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539499/%E5%B8%96%E5%AD%90%E8%A7%82%E7%82%B9%E9%98%B5%E8%90%A5AI%E5%88%86%E6%9E%90%EF%BC%88%E5%BC%80%E7%AE%B1%E5%8D%B3%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539499/%E5%B8%96%E5%AD%90%E8%A7%82%E7%82%B9%E9%98%B5%E8%90%A5AI%E5%88%86%E6%9E%90%EF%BC%88%E5%BC%80%E7%AE%B1%E5%8D%B3%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    if (!/^\/group\/topic\//.test(window.location.pathname)) {
        return;
    }

    const SELECTORS = {
        title: 'h1',
        mainPost: 'div.topic_content',
        replies: '#comment_list [id^="post_"]',
        replyInner: '.inner',
        userName: 'a.l',
        settingsMenu: '#robot_speech_js > ul',
        copyright: 'div.copyright'
    };
    const CONFIG_KEY = 'BGM_FACTION_ANALYZER_CONFIG_V2';
    const CACHE_PREFIX = 'BGM_FACTION_ANALYZER_CACHE_V2_';
    const STATS_KEY = 'BGM_FACTION_ANALYZER_STATS_V2';
    const MAX_STATS_ENTRIES = 10;
    const MAX_LOG_ENTRIES = 100;
    const logEntries = [];

    const DEFAULT_CONFIG = {
        apiKey: 'sk-qO8OX6SysmGgakFMOO4ZmiqQ0VciFyUTs0KSQyd3xflSfBKJ',
        apiBaseUrl: 'https://miaodi.zeabur.app/v1/chat/completions',
        modelName: 'deepseek-ai/DeepSeek-V3-0324',
        showAnalysisButton: true
    };

    function logEvent(message, details = null) {
        const entry = { timestamp: new Date(), message, details };
        logEntries.push(entry);
        if (logEntries.length > MAX_LOG_ENTRIES) logEntries.shift();
        if (details && (details.error || /失败/.test(message))) {
            console.error(`[BFA Log] ${message}`, details);
        } else {
            console.log(`[BFA Log] ${message}`, details || '');
        }
    }

    GM_addStyle(`
        .bfa-controls-container { display: flex; gap: 10px; align-items: center; margin: 10px 0; }
        .bfa-btn { background-color: #f09199; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 13px; transition: background-color 0.3s; min-width: 120px; text-align: center; }
        .bfa-btn:hover { background-color: #e07179; }
        .bfa-btn:disabled { background-color: #ccc; cursor: not-allowed; }
        .bfa-analysis-settings-btn { background-color: #f09199; color: white; border: none; padding: 0; width: 24px; height: 24px; border-radius: 50%; font-size: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.3s; margin-left: 5px; flex-shrink: 0; min-width: 24px; }
        .bfa-analysis-settings-btn:hover { background-color: #e07179; }
        .bfa-footer-settings-container { text-align: right; margin-right: 20px; margin-bottom: 10px; }
        .bfa-footer-settings-container .bfa-analysis-settings-btn { margin-left: 0; display: inline-flex; }
        .bfa-camp-marker { display: inline-block; vertical-align: middle; padding: 1px 5px; border-radius: 10px; font-size: 10px; color: white; margin-right: 5px; margin-bottom: 4px; border: 1px solid rgba(0,0,0,0.1); max-width: calc(100% - 10px); overflow: hidden; text-overflow: ellipsis; }
        .bfa-viz-container { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0; position: relative; }
        .bfa-viz-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .bfa-viz-btn { font-size: 12px; padding: 4px 8px; cursor: pointer; background: #eee; border: 1px solid #ccc; border-radius: 4px; }
        .bfa-viz-right-controls { display: flex; gap: 8px; }
        .bfa-tug-of-war { display: flex; width: 100%; height: 40px; border-radius: 5px; overflow: hidden; }
        .bfa-tug-of-war > div { display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); transition: all 0.5s ease-in-out; padding: 2px 4px; overflow: hidden; cursor: pointer; text-align: center; line-height: 1.1; word-break: break-word; }
        .bfa-camp-info { text-align: center; margin-top: 10px; font-size: 13px; color: #555; }
        .bfa-bar-chart { display: none; }
        .bfa-bar-item { display: flex; align-items: center; margin-bottom: 8px; cursor: pointer; }
        .bfa-bar-label { width: 150px; text-align: right; padding-right: 10px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
        .bfa-bar-wrapper { flex-grow: 1; background: #f0f0f0; border-radius: 3px; }
        .bfa-bar { height: 20px; border-radius: 3px; transition: width 0.5s ease-in-out; }
        .bfa-bar-count { margin-left: 10px; font-size: 13px; width: 60px; flex-shrink: 0; text-align: left; }
        .bfa-settings-panel, .bfa-log-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); z-index: 10002; display: none; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; color: #333; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; font-size: 14px; }
        .bfa-settings-panel h3, .bfa-log-panel h3 { margin-top: 0; margin-bottom: 20px; color: #444; font-size: 18px; text-align: center; }
        .bfa-settings-panel .form-group { margin-bottom: 15px; }
        .bfa-settings-panel label { display: block; margin-bottom: 5px; font-weight: bold; }
        .bfa-settings-panel input[type="text"], .bfa-settings-panel input[type="password"], .bfa-settings-panel select { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .bfa-settings-panel .actions, .bfa-log-panel .actions { text-align: right; margin-top: 20px; }
        .bfa-settings-panel button, .bfa-log-panel button { margin-left: 10px; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; }
        .bfa-settings-panel .save-btn, .bfa-log-panel .save-btn { background: #2b88ff; color: white; }
        .bfa-settings-panel .close-btn, .bfa-log-panel .close-btn { background: #eee; color: #666; }
        .bfa-log-panel pre { background-color: #f4f4f4; border: 1px solid #ddd; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; max-height: 60vh; overflow-y: auto; font-size: 12px; }
        #bfa-user-tooltip { position: fixed; display: none; background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border-radius: 5px; padding: 10px; z-index: 10003; max-width: 300px; font-size: 12px; pointer-events: none; }
        #bfa-user-tooltip h4 { margin: 0 0 5px 0; font-size: 13px; color: #333; }
        #bfa-user-tooltip p { margin: 0; line-height: 1.5; color: #555; }
    `);

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

    async function loadConfig() {
        const storedConfig = await GM_getValue(CONFIG_KEY, {});
        return { ...DEFAULT_CONFIG, ...storedConfig };
    }

    async function saveConfig(config) {
        await GM_setValue(CONFIG_KEY, config);
    }

    async function getTopicId() {
        const match = window.location.pathname.match(/\/group\/topic\/(\d+)/);
        return match ? `topic_${match[1]}` : null;
    }

    async function getCachedAnalysis(topicId) {
        if (!topicId) return null;
        return await GM_getValue(CACHE_PREFIX + topicId, null);
    }

    async function saveAnalysisToCache(topicId, data) {
        if (!topicId) return;
        await GM_setValue(CACHE_PREFIX + topicId, data);
    }

    function calculateEstimate(stats, currentReplyCount) {
        const MIN_DATA_POINTS_FOR_REGRESSION = 3;
        const MIN_ESTIMATE_MS = 15000;
        const MAX_ESTIMATE_MS = 300000;
        const DEFAULT_MS_PER_REPLY = 600;
        const DEFAULT_OVERHEAD_MS = 5000;

        let rawEstimate;

        if (stats.length < MIN_DATA_POINTS_FOR_REGRESSION) {
            logEvent(`预测模型: 使用默认值 (历史数据不足 ${MIN_DATA_POINTS_FOR_REGRESSION} 条)`);
            rawEstimate = currentReplyCount * DEFAULT_MS_PER_REPLY + DEFAULT_OVERHEAD_MS;
        } else {
            let n = stats.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

            for (const stat of stats) {
                const x = stat.replyCount;
                const y = stat.durationMs;
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumX2 += x * x;
            }

            const denominator = n * sumX2 - sumX * sumX;

            if (denominator === 0) {
                logEvent(`预测模型: 使用简单平均值 (无法进行回归分析)`);
                rawEstimate = (sumY / n) / (sumX / n) * currentReplyCount;
            } else {
                const slope = (n * sumXY - sumX * sumY) / denominator;
                const intercept = (sumY - slope * sumX) / n;

                const finalSlope = Math.max(50, slope);
                const finalIntercept = Math.max(1000, intercept);

                logEvent(`预测模型: 使用线性回归`, { slope: finalSlope.toFixed(2), intercept: finalIntercept.toFixed(2) });
                rawEstimate = finalSlope * currentReplyCount + finalIntercept;
            }
        }

        const finalEstimate = Math.max(MIN_ESTIMATE_MS, Math.min(MAX_ESTIMATE_MS, rawEstimate));
        logEvent(`预测结果`, { rawEstimate: rawEstimate.toFixed(0), finalEstimate: finalEstimate.toFixed(0) });
        return finalEstimate;
    }

    async function analyzeFactions() {
        const analysisBtn = $('#bfa-start-analysis');
        analysisBtn.disabled = true;
        analysisBtn.textContent = '准备分析...';
        logEvent('分析开始');

        let countdownTimerId = null;
        const clearCountdown = () => {
            if (countdownTimerId) {
                clearInterval(countdownTimerId);
                countdownTimerId = null;
            }
        };

        try {
            const topicId = await getTopicId();
            if (!topicId) throw new Error('无法获取当前帖子的ID。');

            const loadedConfig = await loadConfig();
            const runtimeConfig = { ...loadedConfig };
            logEvent('配置加载完毕', { ...runtimeConfig, apiKey: '***' });

            if (!runtimeConfig.apiKey || !runtimeConfig.apiBaseUrl || !runtimeConfig.modelName) {
                alert('AI配置不完整。请点击“⚙️”按钮或右下角菜单中的“AI阵营分析设置”来配置您的API Key, Base URL 和模型名称。');
                throw new Error('AI配置不完整。');
            }

            const title = $(SELECTORS.title)?.innerText.trim() || '无标题';
            const mainPostContent = $(SELECTORS.mainPost)?.innerText.trim() || '楼主没有填写正文。';
            const repliesData = $$(SELECTORS.replies).map(replyEl => ({ id: replyEl.id, text: $(SELECTORS.replyInner, replyEl)?.innerText.trim(), user: $(SELECTORS.userName, replyEl)?.innerText.trim() || '匿名用户' })).filter(r => r.id && r.text);

            if (repliesData.length === 0) throw new Error('此贴没有找到可以分析的回复。');
            logEvent(`已收集 ${repliesData.length} 条回复`);

            const startTime = Date.now();
            const maxRetries = 5;
            let lastError = null;
            let firstCallResult = null;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    if (attempt === 1) {
                        const historyStats = await GM_getValue(STATS_KEY, []);
                        const estimatedMs = calculateEstimate(historyStats, repliesData.length);
                        const endTime = Date.now() + estimatedMs;
                        countdownTimerId = setInterval(() => {
                            const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
                            analysisBtn.textContent = `分析中... (约${remaining}s)`;
                        }, 1000);
                    } else {
                        analysisBtn.textContent = `分析中... (重试 ${attempt}/${maxRetries})`;
                    }

                    logEvent(`第 ${attempt} 次尝试调用 AI...`);
                    const prompt = buildPrompt(title, mainPostContent, repliesData);
                    firstCallResult = await callOpenAI(runtimeConfig.apiKey, runtimeConfig.apiBaseUrl, runtimeConfig.modelName, prompt);
                    clearCountdown();

                    if (!firstCallResult || !firstCallResult.grandCamps || !firstCallResult.replies || !Array.isArray(firstCallResult.grandCamps) || !Array.isArray(firstCallResult.replies)) {
                        throw new Error('AI返回的数据格式不正确。');
                    }
                    lastError = null;
                    break;
                } catch (error) {
                    lastError = error;
                    logEvent(`尝试 ${attempt} 失败`, { error: error.message });
                    clearCountdown();
                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                    }
                }
            }

            if (lastError) throw lastError;

            let finalResult = firstCallResult;
            let analyzedPostIds = new Set(finalResult.replies.map(r => r.postId));
            let missingReplies = repliesData.filter(r => !analyzedPostIds.has(r.id));
            const maxSupplementRetries = 5;

            while (missingReplies.length > 0) {
                logEvent(`补充分析开始，剩余 ${missingReplies.length} 个楼层。`);
                let supplementAttempt = 1;
                let supplementSuccess = false;

                while (supplementAttempt <= maxSupplementRetries) {
                    analysisBtn.textContent = `补充分析...(${missingReplies.length}楼) (尝试 ${supplementAttempt}/${maxSupplementRetries})`;
                    try {
                        const secondPrompt = buildSecondPrompt(finalResult.grandCamps, missingReplies);
                        const supplementResult = await callOpenAI(runtimeConfig.apiKey, runtimeConfig.apiBaseUrl, runtimeConfig.modelName, secondPrompt);

                        if (supplementResult && supplementResult.replies && Array.isArray(supplementResult.replies)) {
                            logEvent(`补充分析成功，获得 ${supplementResult.replies.length} 个新分类。`);
                            const validSupplementReplies = supplementResult.replies.filter(r => r.postId && r.subCampId);
                            finalResult = {
                                grandCamps: finalResult.grandCamps,
                                replies: [...finalResult.replies, ...validSupplementReplies]
                            };
                            analyzedPostIds = new Set(finalResult.replies.map(r => r.postId));
                            missingReplies = repliesData.filter(r => !analyzedPostIds.has(r.id));
                            supplementSuccess = true;
                            break;
                        } else {
                            throw new Error('补充分析返回数据格式不正确');
                        }
                    } catch (error) {
                        logEvent(`补充分析尝试 ${supplementAttempt} 失败`, { error: error.message });
                        supplementAttempt++;
                        if (supplementAttempt <= maxSupplementRetries) {
                           await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                }
                if (!supplementSuccess) {
                    logEvent(`补充分析连续失败 ${maxSupplementRetries} 次，中止补充。`);
                    break;
                }
            }

            const endTime = Date.now();
            const durationMs = endTime - startTime;
            logEvent('分析流程完成', { durationMs, finalReplyCount: finalResult.replies.length });

            displayAnalysisResults(finalResult, repliesData);
            await saveAnalysisToCache(topicId, finalResult);

            const historyStats = await GM_getValue(STATS_KEY, []);
            const newStats = [...historyStats, { replyCount: repliesData.length, durationMs }];
            if (newStats.length > MAX_STATS_ENTRIES) newStats.shift();
            await GM_setValue(STATS_KEY, newStats);

            analysisBtn.textContent = '分析完成！可再次分析';

        } catch (error) {
            clearCountdown();
            logEvent('分析最终失败', { error: error.message });
            if (error.message !== '此贴没有找到可以分析的回复。' && error.message !== 'AI配置不完整.') {
                alert(`分析失败: ${error.message}`);
            }
            analysisBtn.textContent = '分析失败，点击重试';
        } finally {
            analysisBtn.disabled = false;
        }
    }


    function buildPrompt(title, mainPost, replies) {
        const repliesText = replies.map(r => `{"postId": "${r.id}", "content": "${r.text.substring(0, 300).replace(/"/g, "'").replace(/\n/g, " ")}"}`).join('\n');
        return `你是社群观察员，任务是分析论坛帖子，划分回复阵营。请严格按以下要求操作：
1.  识别2-3个主要“大阵营”，再细分出若干“小观点”。大阵营小观点皆应基于核心观点对立，必须是相互排斥的，不可交叉重叠。 阵营规模无需平衡，可存在一方观点占压倒性优势的情况。小观点数量越少越好，能合并的合并。
2.  对每个\`postId\`，**必须且只能**输出一个分类结果。请综合整个\`content\`字段的内容来判断其所属的唯一观点，即使内容包含引述或多段对话。
3.  严格按以下JSON格式输出，不含任何额外文本或标记。
    {
      "grandCamps": [ { "id": "...", "name": "...", "subCamps": [ { "id": "...", "name": "..." } ] } ],
      "replies": [ { "postId": "...", "subCampId": "..." } ]
    }
---
[帖子标题]: ${title}
[主楼内容]: ${mainPost}
[回帖列表]:
${repliesText}`;
    }

    function buildSecondPrompt(grandCamps, missingReplies) {
        const repliesText = missingReplies.map(r => `{"postId": "${r.id}", "content": "${r.text.substring(0, 300).replace(/"/g, "'").replace(/\n/g, " ")}"}`).join('\n');
        const campsStructureText = JSON.stringify(grandCamps, null, 2);
        return `你是一位社群观察员，正在进行补充分析。
你已经完成了第一轮分析，并确定了以下阵营结构：
${campsStructureText}

现在，请将以下剩余的回帖划分到已有的【小观点 (subCamps)】中。
1.  【不要】创建新的大阵营或小观点。
2.  为每一个回帖指定一个最合适的【subCampId】。
3.  严格按照以下JSON格式输出，只包含 "replies" 字段，不含任何额外文本或标记。
    {
      "replies": [ { "postId": "...", "subCampId": "..." } ]
    }
---
[待分类的回帖列表]:
${repliesText}`;
    }

    function callOpenAI(apiKey, apiBaseUrl, modelName, prompt) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiBaseUrl,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                data: JSON.stringify({ model: modelName, messages: [{ role: 'user', content: prompt }], response_format: { type: "json_object" }, temperature: 0.1 }),
                timeout: 300000,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        logEvent('收到API响应', { status: response.status, text: response.responseText.substring(0, 200) });
                        const responseText = response.responseText.trim();

                        let accumulatedContent = '';
                        if (responseText.includes("data:")) {
                            const lines = responseText.split('\n');
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    const jsonStr = line.substring(5).trim();
                                    if (jsonStr === '[DONE]') continue;
                                    try {
                                        const chunk = JSON.parse(jsonStr);
                                        if (chunk.choices && chunk.choices[0]?.delta?.content) {
                                            accumulatedContent += chunk.choices[0].delta.content;
                                        }
                                    } catch (e) {
                                    }
                                }
                            }
                        }

                        if (accumulatedContent) {
                            try {
                                return resolve(JSON.parse(accumulatedContent));
                            } catch (e) {
                                logEvent('累积的流式内容解析失败', { error: e.message });
                            }
                        }

                        try {
                            const data = JSON.parse(responseText);
                            if (data.choices && data.choices[0]?.message?.content) {
                                return resolve(JSON.parse(data.choices[0].message.content));
                            }
                            if (data.replies) {
                                return resolve(data);
                            }
                        } catch (e) {
                        }

                        logEvent('标准解析失败，尝试从文本中提取JSON。');
                        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                        if (jsonMatch && jsonMatch[0]) {
                            try {
                                const extractedJson = JSON.parse(jsonMatch[0]);
                                logEvent('成功从响应文本中提取并解析JSON。');
                                return resolve(extractedJson);
                            } catch (e2) {
                                return reject(new Error('无法解析API响应：提取的JSON内容也无效。'));
                            }
                        }

                        reject(new Error('无法解析API响应：所有解析方法都已失败。'));

                    } else { reject(new Error(`API请求失败，状态码: ${response.status} - ${response.statusText}`)); }
                },
                onerror: (error) => reject(new Error('网络请求错误: ' + JSON.stringify(error))),
                ontimeout: () => reject(new Error('请求超时。'))
            });
        });
    }

    async function displayAnalysisResults(analysisResult, originalRepliesData) {
        $$('.bfa-camp-marker, .bfa-viz-container').forEach(el => el.remove());
        const { grandCamps, replies } = analysisResult;

        const subCampData = new Map();
        const grandCampData = new Map();

        grandCamps.forEach(gc => {
            grandCampData.set(gc.id, { ...gc, postCount: 0, users: new Set() });
            gc.subCamps.forEach(sc => {
                subCampData.set(sc.id, { ...sc, grandCampId: gc.id, grandCampName: gc.name, postCount: 0, users: new Set() });
            });
        });

        const originalRepliesMap = new Map(originalRepliesData.map(r => [r.id, r]));

        replies.forEach(({ postId, subCampId }) => {
            const originalReply = originalRepliesMap.get(postId);
            const subCamp = subCampData.get(subCampId);
            if (!originalReply || !subCamp) return;

            const postEl = $(`#${postId} > .inner`);
            if (postEl) {
                const marker = document.createElement('div');
                marker.className = 'bfa-camp-marker';

                const subCampInfo = subCampData.get(subCampId);
                marker.textContent = `观点: ${subCampInfo.name}`;
                const colors = ['#e57373', '#64b5f6', '#81c784', '#fff176', '#ffb74d', '#ba68c8', '#90a4ae'];
                const subCampIds = Array.from(subCampData.keys());
                marker.style.backgroundColor = colors[subCampIds.indexOf(subCampId) % colors.length];
                postEl.prepend(marker);
            }

            subCamp.postCount++;
            subCamp.users.add(originalReply.user);
            const grandCamp = grandCampData.get(subCamp.grandCampId);
            if (grandCamp) {
                grandCamp.postCount++;
                grandCamp.users.add(originalReply.user);
            }
        });

        createVisualization(grandCampData, subCampData, grandCamps);
    }

    function createVisualization(grandCampData, subCampData, orderedGrandCampsFromAI) {
        let currentDisplayMode = 'people';
        let hideOthers = false;

        const container = document.createElement('div');
        container.className = 'bfa-viz-container';

        const controls = document.createElement('div');
        controls.className = 'bfa-viz-controls';

        const modeSwitch = document.createElement('button');
        modeSwitch.className = 'bfa-viz-btn';

        const rightControls = document.createElement('div');
        rightControls.className = 'bfa-viz-right-controls';

        const hideOthersBtn = document.createElement('button');
        hideOthersBtn.className = 'bfa-viz-btn';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'bfa-viz-btn';

        rightControls.appendChild(hideOthersBtn);
        rightControls.appendChild(toggleBtn);
        controls.appendChild(modeSwitch);
        controls.appendChild(rightControls);
        container.appendChild(controls);

        const tugOfWar = document.createElement('div');
        tugOfWar.className = 'bfa-tug-of-war';
        container.appendChild(tugOfWar);

        const campInfo = document.createElement('div');
        campInfo.className = 'bfa-camp-info';
        container.appendChild(campInfo);

        const barChart = document.createElement('div');
        barChart.className = 'bfa-bar-chart';
        container.appendChild(barChart);

        const userTooltip = $('#bfa-user-tooltip');

        const moveTooltip = (event) => {
            if (userTooltip && userTooltip.style.display === 'block') {
                userTooltip.style.left = `${event.clientX + 15}px`;
                userTooltip.style.top = `${event.clientY + 15}px`;
            }
        };

        const showTooltip = (event) => {
            const target = event.currentTarget;
            if (!target.dataset.users || !userTooltip) return;
            userTooltip.querySelector('h4').textContent = target.dataset.title;
            userTooltip.querySelector('p').textContent = target.dataset.users.split(',').join('、');
            userTooltip.style.display = 'block';
            moveTooltip(event);
        };
        const hideTooltip = () => { if (userTooltip) userTooltip.style.display = 'none'; };


        const adjustTugFontSize = (element) => {
            const minFontSize = 7;
            const maxFontSize = 14;
            const width = element.clientWidth;
            let fontSize = Math.max(minFontSize, Math.min(width / 7, maxFontSize));
            element.style.fontSize = `${fontSize}px`;
        };

        function renderVisualization() {
            modeSwitch.textContent = `当前: ${currentDisplayMode === 'people' ? '按人数' : '按楼层'}`;
            hideOthersBtn.textContent = `当前: ${hideOthers ? '显示其他' : '隐藏其他'}`;
            toggleBtn.textContent = `当前: ${barChart.style.display === 'block' ? '柱状图' : '对立条'}`;

            const countKey = currentDisplayMode === 'people' ? 'peopleCount' : 'postCount';
            const unit = currentDisplayMode === 'people' ? '人' : '楼';

            grandCampData.forEach(gc => { gc.peopleCount = gc.users.size; });
            subCampData.forEach(sc => { sc.peopleCount = sc.users.size; });

            let allGrandCampsSorted = Array.from(grandCampData.values()).filter(gc => gc.postCount > 0).sort((a, b) => b[countKey] - a[countKey]);

            tugOfWar.innerHTML = '';
            campInfo.textContent = '';

            const topCamp1 = allGrandCampsSorted[0] || null;
            const topCamp2 = allGrandCampsSorted[1] || null;
            const otherCamps = allGrandCampsSorted.slice(2);

            const neutralCamp = { name: '其他观点', postCount: 0, peopleCount: 0, users: new Set() };
            if (otherCamps.length > 0) {
                neutralCamp.postCount = otherCamps.reduce((sum, camp) => sum + camp.postCount, 0);
                otherCamps.forEach(camp => camp.users.forEach(user => neutralCamp.users.add(user)));
                neutralCamp.peopleCount = neutralCamp.users.size;
            }

            let visibleCamps = [topCamp1, topCamp2].filter(Boolean);
            if (!hideOthers && neutralCamp.postCount > 0) {
                visibleCamps.push(neutralCamp);
            }

            if (visibleCamps.length === 0) {
                 campInfo.textContent = "未能识别出足够数据进行可视化。";
            } else {
                const totalCount = visibleCamps.reduce((sum, camp) => sum + camp[countKey], 0);
                let infoParts = [];

                const processCamp = (camp, color) => {
                    const percent = totalCount > 0 ? (camp[countKey] / totalCount) * 100 : 0;
                    const usersArray = Array.from(camp.users);
                    const div = document.createElement('div');
                    div.style.width = `${percent}%`;
                    div.style.backgroundColor = color;
                    div.textContent = camp.name;
                    const titleText = `${camp.name} (${camp[countKey]}${unit})`;
                    div.dataset.title = titleText;
                    div.dataset.users = usersArray.join(',');
                    div.addEventListener('mouseover', showTooltip);
                    div.addEventListener('mousemove', moveTooltip);
                    div.addEventListener('mouseout', hideTooltip);
                    tugOfWar.appendChild(div);
                    adjustTugFontSize(div);
                    infoParts.push(`${camp.name} (${camp[countKey]}${unit})`);
                };

                if (topCamp1) processCamp(topCamp1, '#ff6961');
                if (!hideOthers && neutralCamp.postCount > 0) processCamp(neutralCamp, '#cccccc');
                if (topCamp2) processCamp(topCamp2, '#77ddff');
                campInfo.textContent = infoParts.join(' vs ');
            }

            const colors = ['#e57373', '#64b5f6', '#81c784', '#fff176', '#ffb74d', '#ba68c8', '#90a4ae'];
            const subCampIds = Array.from(subCampData.keys());
            barChart.innerHTML = '';

            let barData = orderedGrandCampsFromAI.map(gc_template => grandCampData.get(gc_template.id)).filter(Boolean);
            if (hideOthers) {
                const top2Ids = new Set([topCamp1?.id, topCamp2?.id].filter(Boolean));
                barData = barData.filter(gc => top2Ids.has(gc.id));
            }

            const flatBarData = barData.flatMap(gc => gc.subCamps.map(sc_template => subCampData.get(sc_template.id))).filter(d => d && d.postCount > 0);
            const maxCount = Math.max(1, ...flatBarData.map(d => d[countKey]));

            flatBarData.forEach(d => {
                const item = document.createElement('div');
                item.className = 'bfa-bar-item';
                const barColor = colors[subCampIds.indexOf(d.id) % colors.length];
                item.innerHTML = `<div class="bfa-bar-label">${d.name}</div><div class="bfa-bar-wrapper"><div class="bfa-bar" style="width:${d[countKey]/maxCount*100}%; background-color:${barColor};"></div></div><div class="bfa-bar-count">${d[countKey]}${unit}</div>`;
                const titleText = `观点: ${d.name} (${d[countKey]}${unit})`;
                item.dataset.title = titleText;
                item.dataset.users = Array.from(d.users).join(',');
                item.addEventListener('mouseover', showTooltip);
                item.addEventListener('mousemove', moveTooltip);
                item.addEventListener('mouseout', hideTooltip);
                barChart.appendChild(item);
            });
        }

        modeSwitch.onclick = () => {
            currentDisplayMode = currentDisplayMode === 'people' ? 'posts' : 'people';
            renderVisualization();
        };
        hideOthersBtn.onclick = () => {
            hideOthers = !hideOthers;
            renderVisualization();
        };
        toggleBtn.onclick = () => {
            const isBarVisible = barChart.style.display === 'block';
            barChart.style.display = isBarVisible ? 'none' : 'block';
            tugOfWar.style.display = isBarVisible ? 'flex' : 'none';
            campInfo.style.display = isBarVisible ? 'block' : 'none';
            renderVisualization();
};

        $(SELECTORS.mainPost).insertAdjacentElement('afterend', container);
        renderVisualization();
    }

    function createUserTooltip() {
        if ($('#bfa-user-tooltip')) return;
        const tooltip = document.createElement('div');
        tooltip.id = 'bfa-user-tooltip';
        tooltip.innerHTML = '<h4></h4><p></p>';
        document.body.appendChild(tooltip);
    }

    async function initUI() {
        logEvent('脚本初始化');
        createUserTooltip();
        const config = await loadConfig();
        const titleEl = $(SELECTORS.title);
        if (!titleEl) return;

        if ($('.bfa-controls-container, .bfa-footer-settings-container')) return;

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'bfa-btn bfa-analysis-settings-btn';
        settingsBtn.title = '自定义AI模型设置';
        settingsBtn.textContent = '⚙️';
        settingsBtn.onclick = showSettingsPanel;

        if (config.showAnalysisButton) {
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'bfa-controls-container';

            const startBtn = document.createElement('button');
            startBtn.id = 'bfa-start-analysis';
            startBtn.className = 'bfa-btn';
            startBtn.textContent = '启动AI阵营分析';
            startBtn.onclick = analyzeFactions;

            controlsContainer.appendChild(startBtn);
            controlsContainer.appendChild(settingsBtn);
            titleEl.insertAdjacentElement('afterend', controlsContainer);

            const topicId = await getTopicId();
            const cachedResult = topicId ? await getCachedAnalysis(topicId) : null;
            if (cachedResult && cachedResult.grandCamps && cachedResult.replies) {
                logEvent('从缓存加载结果');
                const repliesData = $$(SELECTORS.replies).map(el => ({id: el.id, text: $(SELECTORS.replyInner, el)?.innerText.trim(), user: $(SELECTORS.userName, el)?.innerText.trim() || '匿名用户'})).filter(r => r.id && r.text);
                displayAnalysisResults(cachedResult, repliesData);
                $('#bfa-start-analysis').textContent = '分析完成！可再次分析';
            }
        } else {
            const copyrightEl = $(SELECTORS.copyright);
            if (copyrightEl) {
                const footerContainer = document.createElement('div');
                footerContainer.className = 'bfa-footer-settings-container';
                footerContainer.appendChild(settingsBtn);
                copyrightEl.parentNode.insertBefore(footerContainer, copyrightEl);
            }
        }

        const targetList = $(SELECTORS.settingsMenu);
        if (targetList && !$('.bfa-settings-button', targetList)) {
            const settingsButton = document.createElement('li');
            settingsButton.className = 'bfa-settings-button';
            settingsButton.innerHTML = '◇ <a href="javascript:void(0);" class="nav">AI阵营分析设置</a>';
            settingsButton.querySelector('a').onclick = showSettingsPanel;
            targetList.appendChild(settingsButton);
        }
    }

    function showSettingsPanel() {
        let panel = $('#bfa-settings-panel');
        if (!panel) panel = document.body.appendChild(createSettingsPanel());
        loadConfig().then(config => {
            $('#bfa-api-key', panel).value = config.apiKey;
            $('#bfa-api-base-url', panel).value = config.apiBaseUrl;
            $('#bfa-model-name', panel).value = config.modelName;
            $('#bfa-show-button', panel).checked = config.showAnalysisButton;
        });
        panel.style.display = 'block';
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'bfa-settings-panel';
        panel.className = 'bfa-settings-panel';
        panel.innerHTML = `
            <h3>AI阵营分析设置</h3>
            <div class="form-group"><label for="bfa-api-key">API Key:</label><input type="password" id="bfa-api-key" placeholder="必填"></div>
            <div class="form-group"><label for="bfa-api-base-url">API Base URL:</label><input type="text" id="bfa-api-base-url" placeholder="必填"></div>
            <div class="form-group"><label for="bfa-model-name">模型名称:</label><input type="text" id="bfa-model-name" placeholder="必填"></div>
            <p style="font-size:0.9em;color:#666;">API Key会存储在浏览器本地。</p>
            <div class="form-group"><label style="display:flex;align-items:center;font-weight:normal;"><input type="checkbox" id="bfa-show-button" style="width:auto;height:auto;margin-right:8px;">在帖子页面显示AI分析按钮</label></div>
            <div class="actions"><button class="view-log-btn close-btn">查看日志</button><button class="save-btn">保存并刷新</button><button class="close-btn">关闭</button></div>
        `;
        panel.querySelector('.save-btn').onclick = () => {
            const config = {
                apiKey: $('#bfa-api-key', panel).value.trim(),
                apiBaseUrl: $('#bfa-api-base-url', panel).value.trim(),
                modelName: $('#bfa-model-name', panel).value.trim(),
                showAnalysisButton: $('#bfa-show-button', panel).checked
            };
            if (!config.apiKey || !config.apiBaseUrl || !config.modelName) return alert('API Key, Base URL 和模型名称均为必填项。');
            saveConfig(config).then(() => {
                alert('设置已保存！页面将刷新以应用更改。');
                panel.style.display = 'none';
                window.location.reload();
            });
        };
        panel.querySelector('.view-log-btn').onclick = () => showLogPanel();
        panel.querySelector('.close-btn:last-child').onclick = () => panel.style.display = 'none';
        return panel;
    }

    function showLogPanel() {
        let panel = $('#bfa-log-panel');
        if (!panel) panel = document.body.appendChild(createLogPanel());
        const logContentEl = panel.querySelector('pre');
        logContentEl.textContent = logEntries.map(entry => {
            const time = entry.timestamp.toLocaleTimeString();
            let detailsStr = entry.details ? `\n  ` + JSON.stringify(entry.details, null, 2).replace(/\n/g, '\n  ') : '';
            return `[${time}] ${entry.message}${detailsStr}`;
        }).join('\n\n');
        logContentEl.scrollTop = logContentEl.scrollHeight;
        panel.style.display = 'block';
    }

    function createLogPanel() {
        const panel = document.createElement('div');
        panel.id = 'bfa-log-panel';
        panel.className = 'bfa-log-panel';
        panel.innerHTML = `<h3>运行日志</h3><pre></pre><div class="actions"><button class="close-btn">关闭</button></div>`;
        panel.querySelector('.close-btn').onclick = () => panel.style.display = 'none';
        return panel;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();