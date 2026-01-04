// ==UserScript==
// @name         bangumi 敏感词检测 (AI自动更新)
// @description   在发表新话题、日志、吐槽时进行敏感词检测，集成在菜单中，支持自动从API更新及手动管理敏感词列表，可配置API接口和模型。
// @version      0.9.0 // Version bump for new UI feature
// @author       Sedoruee
// @license      Sedoruee
// @include     /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/*
// @grant        GM_xmlHttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.open
// @namespace https://greasyfork.org/users/1383632
// @downloadURL https://update.greasyfork.org/scripts/537613/bangumi%20%E6%95%8F%E6%84%9F%E8%AF%8D%E6%A3%80%E6%B5%8B%20%28AI%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537613/bangumi%20%E6%95%8F%E6%84%9F%E8%AF%8D%E6%A3%80%E6%B5%8B%20%28AI%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%29.meta.js
// ==/UserScript==

(function() {
    let OPENAI_API_KEY;
    let OPENAI_API_ENDPOINT;
    let OPENAI_API_MODEL;
    let API_CALL_FREQUENCY_DAYS_SETTING;
    let ENABLE_SENSITIVE_CHECK;

    // New settings for content change detection
    let ENABLE_CONTENT_CHANGE_DETECTION;
    let CONTENT_CHECK_FREQUENCY_HOURS_SETTING;
    let CONTENT_DIFF_THRESHOLD_CHARS_SETTING;

    const SENSITIVE_WORDS_SOURCE_URL = "https://bgm.tv/group/topic/349681";

    let Sensitive_words = [];
    const scriptLogs = [];
    const MAX_LOG_ENTRIES = 200;
    const MAX_CONTENT_LENGTH_FOR_API = 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999; // 增大最大内容长度，因为现在是发送整个页面的文本。
    const MAX_ITERATIONS = 5; // 设置最大迭代次数，防止无限循环

    const DEFAULT_SENSITIVE_WORDS = [
        "白粉", "香艳", "习近平", "服务中心", "李克强", "支那", "前列腺",
        "办证", "辦證", "毕业证", "畢業證", "冰毒", "安乐死", "腾讯", "隐形眼镜",
        "聊天记录", "枪", "电动车", "医院", "烟草", "早泄", "精神病", "毒枭",
        "春节", "当场死亡", "步枪", "步槍", "春药", "春藥", "大发", "大發",
        "大麻", "代开", "代開", "迷药", "代考", "贷款", "貸款", "发票", "發票",
        "海洛因", "妓女", "可卡因", "批发", "批發", "皮肤病", "皮膚病", "嫖娼",
        "窃听器", "竊听器", "上门服务", "上門服务", "商铺", "商鋪", "手枪", "手槍",
        "铁枪", "鐵枪", "钢枪", "鋼枪", "特殊服务", "特殊服務", "騰訊", "罂粟",
        "牛皮癣", "甲状腺", "假钞", "香烟", "香煙", "学位证", "學位證",
        "摇头丸", "搖頭丸", "援交", "找小姐", "找小妹", "作弊", "v信",
        "医疗政策", "迷魂药", "迷情粉", "迷藥", "麻醉药", "肛门", "麻果", "麻古",
        "假币", "私人侦探", "提现", "借腹生子", "代孕", "客服电话", "刻章",
        "套牌车", "麻将机", "走私"
    ].sort((a, b) => a.localeCompare(b, 'zh-CN'));

    function logScriptMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        scriptLogs.push({ timestamp, message, type });
        if (scriptLogs.length > MAX_LOG_ENTRIES) {
            scriptLogs.shift();
        }
    }

    async function fetchTopicContent(url) {
        logScriptMessage(`尝试获取话题内容: ${url}`, "info");
        return new Promise((resolve) => {
            const xhrMethod = (typeof GM !== 'undefined' && GM.xmlHttpRequest) || (typeof GM_xmlHttpRequest !== 'undefined' && GM_xmlHttpRequest);
            if (!xhrMethod) {
                logScriptMessage("GM_xmlHttpRequest不可用，无法获取话题内容。", "error");
                return resolve("");
            }

            xhrMethod({
                method: "GET",
                url: url,
                onload: function(response) {
                    logScriptMessage(`获取话题内容请求响应状态: ${response.status}`, "debug");
                    logScriptMessage(`获取话题内容原始响应文本（部分）: ${response.responseText.substring(0, 500)}... (总长度: ${response.responseText.length})`, "debug");
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');

                            let allContent = doc.body ? doc.body.textContent : '';

                            // --- 精细化预处理，移除固定非楼层内容 ---
                            // 移除头部导航和用户信息等固定区域
                            const headerPattern = /(Bangumi 番组计划.*?短信\s+\|\s*设置\s+\|\s*登出)/s;
                            allContent = allContent.replace(headerPattern, '');

                            // 移除话题标题上方的分类链接、标题本身及发布者信息等
                            const topicHeaderInfoPattern = /(全部\s+动画\s+书籍\s+游戏\s+音乐\s+三次元\s+人物\s+用户脚本\s+·\s+样式\s+·\s+插件\s+»\s+讨论\[脚本\]敏感词检测)/s;
                            allContent = allContent.replace(topicHeaderInfoPattern, '');
                            allContent = allContent.replace(/(话题:\s*敏感词检测\s*发帖人:\s*.*?时间:\s*\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2})/s, '');


                            // 移除脚本变量定义，如 var totHistory = ...
                            const scriptVarPattern = /var\s+totHistory\s+=\s+'.*?';\s*var\s+COLLAPSE_REPLIES\s+=\s*true;/s;
                            allContent = allContent.replace(scriptVarPattern, '');

                            // 移除底部版权信息、联系方式等
                            const footerPattern = /(Contact|帮助|关于我们|使用条款|隐私政策|©\s*\d{4}\s*Bangumi|粤ICP备.*?$)/s;
                            allContent = allContent.replace(footerPattern, '');

                            // 移除回复之间的固定连接文字（回复、贴贴、绝交、报告疑虑等）以及回复编号、时间、用户名、UID
                            const replyMetaPattern = /#\d+\s*-\s*\d{4}-\d{1,2}-\d{1,2}\s+\d{2}:\d{2}(?:\s+回复)?(?:\s+贴贴\s*\(\d+\))?(?:\s+绝交)?(?:\s+报告疑虑)?(?:\s+.*?\s*\(uid:\s*\d+\))?/g;
                            allContent = allContent.replace(replyMetaPattern, '\n');

                            // 移除其他可能出现在文本中的UI元素或固定文本
                            allContent = allContent.replace(/(收藏话题|新吐槽|写评论|条评论|赞|踩|举报|主题|分类|标签|加载更多回复)/g, '');
                            // 移除分页链接： « 上一页 1 2 3 ... N 下一页 »
                            allContent = allContent.replace(/(«\s*上一页)?(?:\s*\d+)?(?:\s*\d+\s*)*(\s*\.\.\.)?(\s*\d+)?(?:\s*下一页\s*»)?/g, '');

                            // 将所有连续的空白符（包括换行、制表符等）替换为单个空格，并去除首尾空白
                            allContent = allContent.replace(/\s+/g, ' ').trim();

                            const finalContent = allContent;

                            if (finalContent) {
                                logScriptMessage(`成功获取并预处理网页文本内容。内容摘要: ${finalContent.substring(0, Math.min(finalContent.length, 100))}... (总长度: ${finalContent.length})`, "info");
                                resolve(finalContent);
                            } else {
                                logScriptMessage("从网页获取并预处理后的文本内容为空。", "warning");
                                resolve("");
                            }
                        } catch (e) {
                            logScriptMessage(`解析话题HTML内容失败: ${e.message}`, "error");
                            resolve("");
                        }
                    } else {
                        logScriptMessage(`获取话题内容失败: ${response.status} ${response.statusText}`, "error");
                        resolve("");
                    }
                },
                onerror: function(response) {
                    logScriptMessage(`获取话题内容请求失败: ${response.status} ${response.statusText}`, "error");
                    resolve("");
                },
                ontimeout: function() {
                    logScriptMessage("获取话题内容请求超时。", "error");
                    resolve("");
                }
            });
        });
    }

    // 封装迭代获取敏感词的函数
    async function performIterativeSensitiveWordFetch(preFetchedContent) {
        let allNewWordsCollected = []; // 存储所有迭代中发现的新词
        let stopConditionMet = false; // 控制循环停止的条件
        let iteration = 0;

        const fullTopicContent = preFetchedContent; // 使用预先获取的内容

        if (!fullTopicContent) {
            displayPanelMessage("无法获取有效的话题内容，API更新中止。", "error");
            logScriptMessage("无法获取有效的话题内容，API更新中止。", "error");
            return [];
        }

        while (!stopConditionMet && iteration < MAX_ITERATIONS) {
            iteration++;
            logScriptMessage(`开始第 ${iteration} 轮敏感词API检测...`, "info");

            // 在发送给API之前，对内容进行截断，确保不超过API限制
            const contentToSendToAPI = fullTopicContent.substring(0, MAX_CONTENT_LENGTH_FOR_API);

            // 告知AI已知的敏感词，让它返回"新的"
            const knownWordsPrompt = Sensitive_words.length > 0
                ? `Here is the list of sensitive words you are already aware of, please do not include them in your response: ${Sensitive_words.join(', ')}.`
                : 'You are starting with no known sensitive words.';

            const conversationContext = `
Below is the content from a forum topic page '${SENSITIVE_WORDS_SOURCE_URL}'.
The full page content for analysis (trimmed to ${MAX_CONTENT_LENGTH_FOR_API} characters) is:
${contentToSendToAPI}

${knownWordsPrompt}
Your task is to identify and list *all* any *new* words or short phrases that are considered "sensitive"
or could lead to censorship/moderation on a public forum in this context. Provide all new words in a single response if possible.
Format your response strictly as "{ADD:{word1,word2,word3,...}}" if you find any new sensitive words.
If no new sensitive words are found or the list is complete based on the context, respond with "{ADD:{null}}".
Do not include any other text, explanations, or formatting besides the specified format.
`;

            const requestBody = JSON.stringify({
                model: OPENAI_API_MODEL,
                messages: [
                    { role: "system", content: "You are a helpful assistant specialized in identifying sensitive words for online forums based on context." },
                    { role: "user", content: conversationContext }
                ],
                max_tokens: 200, // max_tokens 限制的是AI生成部分的长度，而不是输入prompt的长度
                temperature: 0.1
            });

            logScriptMessage(`发送到API的请求体 (第 ${iteration} 轮): ${requestBody}`, "debug");

            const xhrMethod = (typeof GM !== 'undefined' && GM.xmlHttpRequest) || (typeof GM_xmlHttpRequest !== 'undefined' && GM_xmlHttpRequest);
            if (!xhrMethod) {
                logScriptMessage("GM_xmlHttpRequest不可用，无法进行迭代获取。", "error");
                stopConditionMet = true;
                break;
            }

            const response = await new Promise(resolve => {
                xhrMethod({
                    method: "POST",
                    url: OPENAI_API_ENDPOINT,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${OPENAI_API_KEY}`
                    },
                    data: requestBody,
                    timeout: 30000,
                    onload: function(res) { resolve(res); },
                    onerror: function(res) { resolve(res); },
                    ontimeout: function() { resolve({ status: 0, statusText: "Timeout", responseText: "" }); }
                });
            });

            logScriptMessage(`从API收到的原始响应 (第 ${iteration} 轮): ${response.responseText}`, "debug");

            let currentFetchNewWords = [];
            let currentIterationSuccessfulResponse = false; // 标记当前迭代是否收到了有效API响应 (不一定是找到了新词)

            try {
                const data = JSON.parse(response.responseText);
                if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                    const content = data.choices[0].message.content.trim();
                    const match = content.match(/\{ADD:\{(.*?)\}\}/);
                    if (match && match[1]) {
                        const wordsString = match[1];
                        if (wordsString.toLowerCase() === 'null' || wordsString === '') {
                            logScriptMessage(`API返回{ADD:{null}}或空，第 ${iteration} 轮未识别到新词。`, "info");
                            stopConditionMet = true; // 达到停止条件
                        } else {
                            currentFetchNewWords = wordsString.split(',').map(w => w.trim()).filter(w => w.length > 0);
                            logScriptMessage(`API检测: 第 ${iteration} 轮发现 ${currentFetchNewWords.length} 个新敏感词。`, "success");

                            const addedCount = updateSensitiveWords(currentFetchNewWords); // 更新全局Sensitive_words并获取实际添加数量
                            if (addedCount === 0) { // 如果没有新的词被添加到全局列表，说明AI返回的词都已经存在
                                logScriptMessage(`API返回的词已全部存在于当前敏感词列表中，视为已获取所有新词。`, "info");
                                stopConditionMet = true;
                            } else {
                                allNewWordsCollected = allNewWordsCollected.concat(currentFetchNewWords.filter(word => !allNewWordsCollected.includes(word))); // 将本次发现的独特新词加入总收集列表
                            }
                        }
                        currentIterationSuccessfulResponse = true; // 成功解析了API的预期格式响应
                    } else {
                        displayPanelMessage("API返回格式异常。", "warning");
                        logScriptMessage(`API响应格式异常 (第 ${iteration} 轮)，预期'{ADD:{...}}'，得到: ${content}`, "warning");
                        stopConditionMet = true; // 格式异常也停止
                    }
                } else if (data.error) {
                    displayPanelMessage(`API错误 (第 ${iteration} 轮): ${data.error.message}`, "error");
                    logScriptMessage(`API错误响应 (第 ${iteration} 轮): ${data.error.message}`, "error");
                    stopConditionMet = true; // 遇到错误停止
                } else {
                    displayPanelMessage("API返回数据结构异常。", "warning");
                    logScriptMessage(`API响应结构异常或无choices (第 ${iteration} 轮): ${JSON.stringify(data)}`, "warning");
                    stopConditionMet = true; // 结构异常停止
                }
            } catch (e) {
                displayPanelMessage("API响应解析失败。", "error");
                logScriptMessage(`解析API响应失败或数据异常 (第 ${iteration} 轮): ${e.message}，响应文本: ${response.responseText}`, "error");
                stopConditionMet = true; // 解析错误停止
            }

            // 每次成功接收到API响应后保存名单 (无论是否找到新词)
            // 避免在出现错误（如网络问题、API Key错误）时覆盖已有的词库或更新时间
            if (currentIterationSuccessfulResponse || (response.status === 200 && !data.error)) { // 检查是否为成功的HTTP响应或成功解析了JSON
                await GM.setValue('bangumi_sensitive_words_list', JSON.stringify(Sensitive_words));
                await GM.setValue('bangumi_sensitive_words_last_update', Date.now().toString());
                logScriptMessage(`敏感词列表已通过第 ${iteration} 轮API更新并保存到存储。`, "success");
            }
        }

        if (allNewWordsCollected.length > 0) {
            displayPanelMessage(`迭代API检测完成。共发现并添加 ${allNewWordsCollected.length} 个新敏感词。`, "success");
        } else if (stopConditionMet && iteration <= MAX_ITERATIONS) {
            displayPanelMessage("迭代API检测完成。未发现新的敏感词。", "info");
        } else if (iteration === MAX_ITERATIONS && !stopConditionMet) {
             displayPanelMessage(`迭代API检测达到最大次数 (${MAX_ITERATIONS} 轮)，可能仍有未发现的词。`, "warning");
        } else {
            displayPanelMessage("API检测过程中止或未完成，请检查日志。", "error");
        }
        return allNewWordsCollected; // 返回本次所有发现的新词
    }


    function updateSensitiveWords(newWords) {
        if (!newWords || newWords.length === 0) {
            logScriptMessage("没有新的唯一词汇需要添加到列表。", "info");
            return 0; // 返回0表示没有新词被添加
        }
        const currentSet = new Set(Sensitive_words);
        let addedCount = 0;
        newWords.forEach(word => {
            if (!currentSet.has(word)) {
                Sensitive_words.push(word);
                currentSet.add(word);
                addedCount++;
            }
        });
        if (addedCount > 0) {
            logScriptMessage(`已添加${addedCount}个新的唯一敏感词到列表。`, "info");
            Sensitive_words.sort();
        } else {
            logScriptMessage("所有获取到的词汇已存在于敏感词列表。", "info");
        }
        return addedCount; // 返回实际添加的词数量
    }

    async function initializeSensitiveWords() {
        OPENAI_API_KEY = await GM.getValue('openai_api_key', "YOUR_OPENAI_API_KEY_HERE");
        OPENAI_API_ENDPOINT = await GM.getValue('openai_api_endpoint', "https://api.openai.com/v1/chat/completions");
        OPENAI_API_MODEL = await GM.getValue('openai_api_model', "gpt-3.5-turbo");
        API_CALL_FREQUENCY_DAYS_SETTING = await GM.getValue('api_call_frequency_days', 30);
        ENABLE_SENSITIVE_CHECK = await GM.getValue('enable_sensitive_check', true);

        // NEW: Content change detection settings
        ENABLE_CONTENT_CHANGE_DETECTION = await GM.getValue('enable_content_change_detection', false);
        CONTENT_CHECK_FREQUENCY_HOURS_SETTING = await GM.getValue('content_check_frequency_hours', 6);
        CONTENT_DIFF_THRESHOLD_CHARS_SETTING = await GM.getValue('content_diff_threshold_chars', 100);
        // Ensure numeric values are valid
        if (isNaN(CONTENT_CHECK_FREQUENCY_HOURS_SETTING) || CONTENT_CHECK_FREQUENCY_HOURS_SETTING < 1) {
            CONTENT_CHECK_FREQUENCY_HOURS_SETTING = 6;
            await GM.setValue('content_check_frequency_hours', 6);
        }
        if (isNaN(CONTENT_DIFF_THRESHOLD_CHARS_SETTING) || CONTENT_DIFF_THRESHOLD_CHARS_SETTING < 0) {
            CONTENT_DIFF_THRESHOLD_CHARS_SETTING = 100;
            await GM.setValue('content_diff_threshold_chars', 100);
        }

        const lastUpdateStr = await GM.getValue('bangumi_sensitive_words_last_update', null);
        const storedWordsJson = await GM.getValue('bangumi_sensitive_words_list', null);
        let needsApiUpdateDueToFrequency = true;

        if (storedWordsJson) {
            try {
                const storedWords = JSON.parse(storedWordsJson);
                if (Array.isArray(storedWords) && storedWords.length > 0) {
                    Sensitive_words = storedWords;
                    logScriptMessage("从存储加载敏感词列表。", "info");
                } else {
                    logScriptMessage("存储的敏感词为空或无效，使用默认列表。", "warning");
                    Sensitive_words = [...DEFAULT_SENSITIVE_WORDS];
                }
            } catch (e) {
                logScriptMessage("解析存储的敏感词时出错: " + e.message, "error");
                Sensitive_words = [...DEFAULT_SENSITIVE_WORDS];
            }
        } else {
            Sensitive_words = [...DEFAULT_SENSITIVE_WORDS];
            logScriptMessage("存储中未找到敏感词，使用默认列表。", "info");
        }

        if (lastUpdateStr) {
            const lastUpdateTimestamp = parseInt(lastUpdateStr, 10);
            const now = Date.now();
            const timeDiffDays = (now - lastUpdateTimestamp) / (1000 * 60 * 60 * 24);

            if (timeDiffDays < API_CALL_FREQUENCY_DAYS_SETTING) {
                needsApiUpdateDueToFrequency = false;
                logScriptMessage(`敏感词列表最新（${timeDiffDays.toFixed(1)}天前）。无需自动API调用（基于AI频率设置）。`, "info");
            }
        }

        if (needsApiUpdateDueToFrequency) {
            logScriptMessage("触发敏感词自动API更新检测流程。", "info");

            let shouldCallAI = false;
            let currentFullTopicContent = "";
            const now = Date.now();
            const lastContentCheckStr = await GM.getValue('bangumi_sensitive_words_last_content_check', null);
            const lastStoredContent = await GM.getValue('bangumi_sensitive_words_last_content', '');

            let contentCheckIsDue = true;
            if (lastContentCheckStr) {
                const timeSinceLastContentCheckHours = (now - parseInt(lastContentCheckStr, 10)) / (1000 * 60 * 60);
                if (timeSinceLastContentCheckHours < CONTENT_CHECK_FREQUENCY_HOURS_SETTING) {
                    contentCheckIsDue = false;
                    logScriptMessage(`距离上次内容检查不足 ${CONTENT_CHECK_FREQUENCY_HOURS_SETTING} 小时，跳过内容获取。`, "info");
                }
            }

            if (ENABLE_CONTENT_CHANGE_DETECTION) {
                // 如果开启了内容变化检测
                if (contentCheckIsDue) {
                    currentFullTopicContent = await fetchTopicContent(SENSITIVE_WORDS_SOURCE_URL);
                    await GM.setValue('bangumi_sensitive_words_last_content_check', now.toString()); // 更新内容检查时间戳
                    if (!currentFullTopicContent) {
                        logScriptMessage("获取目标网页内容失败，自动API更新中止。", "error");
                    } else {
                        // 即使内容为空，也保存，避免每次都尝试重新获取
                        await GM.setValue('bangumi_sensitive_words_last_content', currentFullTopicContent);

                        if (currentFullTopicContent === lastStoredContent) {
                            displayPanelMessage("自动更新：目标网页内容无变化，跳过AI更新。", "info");
                            logScriptMessage("自动更新：目标网页内容未变化，跳过AI更新。", "info");
                        } else if (Math.abs(currentFullTopicContent.length - lastStoredContent.length) < CONTENT_DIFF_THRESHOLD_CHARS_SETTING) {
                            displayPanelMessage(`自动更新：目标网页内容变化不足 ${CONTENT_DIFF_THRESHOLD_CHARS_SETTING} 字符，跳过AI更新。`, "info");
                            logScriptMessage(`自动更新：目标网页内容变化不足 ${CONTENT_DIFF_THRESHOLD_CHARS_SETTING} 字符，跳过AI更新。`, "info");
                        } else {
                            displayPanelMessage("自动更新：目标网页内容已变化，将调用AI更新。", "info");
                            logScriptMessage("自动更新：目标网页内容已变化，将调用AI更新敏感词。", "info");
                            shouldCallAI = true;
                        }
                    }
                } else {
                    // 未到内容检测频率，且开启了内容变化检测，则不调用AI
                    logScriptMessage("未到内容检测频率，已跳过AI更新。", "info");
                }
            } else {
                // 如果禁用了内容变化检测，直接根据API更新频率决定是否调用AI
                displayPanelMessage("内容变化检测已禁用，自动更新将直接调用AI更新。", "info");
                logScriptMessage("内容变化检测已禁用，自动更新将直接调用AI更新。", "info");
                currentFullTopicContent = await fetchTopicContent(SENSITIVE_WORDS_SOURCE_URL);
                if (!currentFullTopicContent) {
                    logScriptMessage("获取目标网页内容失败，自动API更新中止。", "error");
                } else {
                    shouldCallAI = true;
                }
                // 即使禁用了内容变化检测，为了将来可能开启，也更新内容和时间戳
                await GM.setValue('bangumi_sensitive_words_last_content_check', now.toString());
                await GM.setValue('bangumi_sensitive_words_last_content', currentFullTopicContent);
            }


            if (shouldCallAI && currentFullTopicContent) {
                await performIterativeSensitiveWordFetch(currentFullTopicContent);
                logScriptMessage("敏感词列表初始化更新流程完成。", "info");
            } else {
                logScriptMessage("本次初始化未进行AI更新。", "info");
            }
        }
        logScriptMessage("当前活跃敏感词列表大小: " + Sensitive_words.length, "info");
    }

    function sensitive_check(obj){
        obj.on('blur keyup input', function() {
            if (!ENABLE_SENSITIVE_CHECK) return;

            // 创建当前敏感词列表的副本，避免在循环中修改原列表导致迭代问题
            const currentSensitiveWords = [...Sensitive_words];
            currentSensitiveWords.forEach( (el) => {
                let patt = new RegExp(el,"g");
                let text = obj.val();
                if(patt.exec(text)){
                    if (confirm("发现敏感词：" + el + ",是否替换？")){
                        let r = prompt("敏感词：" + el + ",替换为：");
                        if (r !== null) { // 用户可能点击取消
                            obj.val(text.replace(el,r));
                            logScriptMessage(`敏感词 "${el}" 已被用户替换。`, "info");
                        }
                    }
                    else {
                        // 用户选择不替换，且通常意味着不希望此词再次触发，从活跃列表中移除
                        const index = Sensitive_words.indexOf(el);
                        if (index > -1) {
                            Sensitive_words.splice(index, 1);
                            logScriptMessage(`敏感词 "${el}" 已被用户暂时从活跃列表中移除。`, "info");
                        }
                    }
                }
            });
        });
    }

    GM_addStyle(`
        #sensitive-words-panel-trigger {
            position: fixed;
            top: 100px;
            right: 0;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-right: none;
            padding: 5px 10px;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            border-radius: 5px 0 0 5px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        #sensitive-words-panel-trigger:hover {
            opacity: 1;
        }
        #sensitive-words-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            max-width: 90%;
            max-height: 80%;
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            flex-direction: column;
            padding: 20px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            font-size: 14px;
            overflow-y: auto;
        }
        #sensitive-words-panel h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
            text-align: center;
        }
        #sensitive-words-panel label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        #sensitive-words-panel input[type="text"],
        #sensitive-words-panel input[type="number"],
        #sensitive-words-panel textarea {
            width: calc(100% - 16px);
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            background-color: #fff;
            color: #333;
        }
        #sensitive-words-panel input[type="checkbox"] {
            margin-right: 5px;
        }
        #sensitive-words-panel .setting-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        #sensitive-words-panel .setting-item label {
            margin-bottom: 0;
            margin-left: 5px;
            font-weight: normal;
        }
        #sensitive-words-panel textarea {
            min-height: 150px;
            resize: vertical;
        }
        #sensitive-words-panel button {
            padding: 10px 15px;
            margin-right: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        #sensitive-words-panel button.secondary-btn {
            background-color: #6c757d;
        }
        #sensitive-words-panel button:hover {
            background-color: #0056b3;
        }
        #sensitive-words-panel button.secondary-btn:hover {
            background-color: #5a6268;
        }
        #sensitive-words-panel button:last-child {
            margin-right: 0;
        }
        #sensitive-words-panel .button-group {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
        }
        #sensitive-words-panel .button-group-left {
            display: flex;
            justify-content: flex-start;
            margin-top: 15px;
        }
        #sensitive-words-panel .panel-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        #sensitive-words-panel .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 20px;
            cursor: pointer;
            color: #888;
        }
        #sensitive-words-panel .close-button:hover {
            color: #333;
        }
        #sensitive-words-panel #panel-message {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
            display: none;
        }
        #sensitive-words-panel #panel-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        #sensitive-words-panel #panel-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        #sensitive-words-panel #panel-message.warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }

        #panel-log-section {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            max-height: 400px;
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 4px;
            margin-top: 15px;
        }
        #panel-log-section h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
        }
        #panel-log-content div {
            padding: 5px 0;
            border-bottom: 1px dashed #eee;
            font-size: 12px;
            word-break: break-word;
        }
        #panel-log-content div:last-child {
            border-bottom: none;
        }
        #panel-log-content .log-info { color: #333; }
        #panel-log-content .log-success { color: #155724; }
        #panel-log-content .log-warning { color: #856404; }
        #panel-log-content .log-error { color: #721c24; }
        #panel-log-content .log-debug { color: #888; }

        .dialog_menu > ul > li > a.sensitive-word-settings-link {
            padding: 5px 10px;
            display: block;
            color: #333;
            text-decoration: none;
            transition: background-color 0.2s;
        }
        .dialog_menu > ul > li > a.sensitive-word-settings-link:hover {
            background-color: #f0f0f0;
        }

        /* NEW: Styles for content change detection settings container */
        #content-change-detection-settings {
            display: none; /* Hidden by default */
            flex-direction: column; /* To make labels/inputs stack */
        }


        /* --- Dark Mode Styles --- */
        html.dark #sensitive-words-panel-trigger {
            background-color: #333;
            border: 1px solid #555;
            color: #bbb;
        }
        html.dark #sensitive-words-panel-trigger:hover {
            background-color: #444;
        }
        html.dark #sensitive-words-panel {
            background-color: #222;
            border: 1px solid #444;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            color: #ccc; /* Default text color in panel */
        }
        html.dark #sensitive-words-panel h3 {
            color: #eee;
        }
        html.dark #sensitive-words-panel label {
            color: #aaa;
        }
        html.dark #sensitive-words-panel input[type="text"],
        html.dark #sensitive-words-panel input[type="number"],
        html.dark #sensitive-words-panel textarea {
            background-color: #333;
            border: 1px solid #555;
            color: #eee;
        }
        html.dark #sensitive-words-panel button {
            background-color: #0056b3;
            color: #eee;
        }
        html.dark #sensitive-words-panel button.secondary-btn {
            background-color: #555;
        }
        html.dark #sensitive-words-panel button:hover {
            background-color: #007bff;
        }
        html.dark #sensitive-words-panel button.secondary-btn:hover {
            background-color: #6c757d;
        }
        html.dark #sensitive-words-panel button:last-child {
            margin-right: 0;
        }
        html.dark #sensitive-words-panel .panel-footer {
            border-top: 1px solid #444;
        }
        html.dark #sensitive-words-panel .close-button {
            color: #aaa;
        }
        html.dark #sensitive-words-panel .close-button:hover {
            color: #eee;
        }
        html.dark #sensitive-words-panel #panel-message.success {
            background-color: #283d2a;
            color: #9cd39d;
            border: 1px solid #3c5a3d;
        }
        html.dark #sensitive-words-panel #panel-message.error {
            background-color: #4d2a2d;
            color: #d19a9a;
            border: 1px solid #6b3e40;
        }
        html.dark #sensitive-words-panel #panel-message.warning {
            background-color: #4f472e;
            color: #e0d0a7;
            border: 1px solid #6c613a;
        }
        html.dark #panel-log-section {
            border: 1px solid #444;
        }
        html.dark #panel-log-section h4 {
            color: #eee;
        }
        html.dark #panel-log-content div {
            border-bottom: 1px dashed #444;
        }
        html.dark #panel-log-content .log-info { color: #ccc; }
        html.dark #panel-log-content .log-success { color: #9cd39d; }
        html.dark #panel-log-content .log-warning { color: #e0d0a7; }
        html.dark #panel-log-content .log-error { color: #d19a9a; }
        html.dark #panel-log-content .log-debug { color: #888; }
        html.dark .dialog_menu > ul > li > a.sensitive-word-settings-link {
            color: #ccc;
        }
        html.dark .dialog_menu > ul > li > a.sensitive-word-settings-link:hover {
            background-color: #333;
        }

        /* NEW: Dark mode styles for content change detection settings container */
        html.dark #content-change-detection-settings label {
            color: #aaa;
        }
        html.dark #content-change-detection-settings input[type="number"] {
            background-color: #333;
            border: 1px solid #555;
            color: #eee;
        }
    `);

    let panelDiv;
    let panelMainContentDiv;
    let panelLogSectionDiv;
    let panelLogContentDiv;
    let panelTextArea;
    let panelLastUpdateSpan;
    let panelApiKeyInput;
    let panelApiEndpointInput;
    let panelApiModelInput;
    let panelApiFrequencyInput;
    let panelEnableCheckInput;
    let panelEnableContentChangeDetectionInput;
    let panelContentCheckFrequencyInput;
    let panelContentDiffThresholdInput;
    let contentChangeSettingsDiv; // Reference to the new container
    let panelMessageDiv;
    let panelShowLogButton;

    function createPanel() {
        panelDiv = document.createElement('div');
        panelDiv.id = 'sensitive-words-panel';
        panelDiv.innerHTML = `
            <span class="close-button" id="panel-close-button">×</span>
            <h3>敏感词设置与管理</h3>
            <div id="panel-message"></div>
            <div id="panel-main-content">
                <label for="panel-api-key">OpenAI API Key:</label>
                <input type="text" id="panel-api-key" placeholder="sk-..." autocomplete="off">
                <label for="panel-api-endpoint">OpenAI API Endpoint:</label>
                <input type="text" id="panel-api-endpoint" placeholder="https://api.openai.com/v1/chat/completions">
                <label for="panel-api-model">OpenAI API Model:</label>
                <input type="text" id="panel-api-model" placeholder="gpt-3.5-turbo">
                <label for="panel-api-frequency">AI更新频率 (天):</label>
                <input type="number" id="panel-api-frequency" min="1">
                <div class="setting-item">
                    <input type="checkbox" id="panel-enable-check">
                    <label for="panel-enable-check">启用敏感词检测功能 (检测、提示、替换)</label>
                </div>
                <div class="setting-item">
                    <input type="checkbox" id="panel-enable-content-change-detection">
                    <label for="panel-enable-content-change-detection">启用内容变化检测 (AI仅在目标网页内容变化时调用)</label>
                </div>
                <!-- NEW: Container for content change detection settings -->
                <div id="content-change-detection-settings">
                    <label for="panel-content-check-frequency">目标网页内容检测频率 (小时):</label>
                    <input type="number" id="panel-content-check-frequency" min="1">
                    <label for="panel-content-diff-threshold">内容差异阈值 (字符数):</label>
                    <input type="number" id="panel-content-diff-threshold" min="0">
                </div>
                <label for="panel-words-textarea">敏感词列表 (每行一个词):</label>
                <textarea id="panel-words-textarea"></textarea>
                <p>最近敏感词更新日期: <span id="panel-last-update">N/A</span></p>
            </div>
            <div id="panel-log-section" style="display: none;">
                <h4>脚本日志</h4>
                <div id="panel-log-content"></div>
            </div>
            <div class="panel-footer">
                <div class="button-group-left">
                    <button id="report-sensitive-words-button" class="secondary-btn">报告敏感词</button>
                    <button id="show-log-button" class="secondary-btn">日志</button>
                </div>
                <div class="button-group">
                    <button id="refresh-api-button">更新提示词</button>
                    <button id="save-manual-button">保存所有设置</button>
                </div>
            </div>
        `;
        document.body.appendChild(panelDiv);

        panelMainContentDiv = document.getElementById('panel-main-content');
        panelLogSectionDiv = document.getElementById('panel-log-section');
        panelLogContentDiv = document.getElementById('panel-log-content');
        panelTextArea = document.getElementById('panel-words-textarea');
        panelLastUpdateSpan = document.getElementById('panel-last-update');
        panelApiKeyInput = document.getElementById('panel-api-key');
        panelApiEndpointInput = document.getElementById('panel-api-endpoint');
        panelApiModelInput = document.getElementById('panel-api-model');
        panelApiFrequencyInput = document.getElementById('panel-api-frequency');
        panelEnableCheckInput = document.getElementById('panel-enable-check');
        panelEnableContentChangeDetectionInput = document.getElementById('panel-enable-content-change-detection');
        panelContentCheckFrequencyInput = document.getElementById('panel-content-check-frequency');
        panelContentDiffThresholdInput = document.getElementById('panel-content-diff-threshold');
        contentChangeSettingsDiv = document.getElementById('content-change-detection-settings'); // Get reference to the new container
        panelMessageDiv = document.getElementById('panel-message');
        panelShowLogButton = document.getElementById('show-log-button');

        document.getElementById('panel-close-button').addEventListener('click', closePanel);
        document.getElementById('refresh-api-button').addEventListener('click', handleApiRefresh);
        document.getElementById('save-manual-button').addEventListener('click', handleManualSave);
        document.getElementById('report-sensitive-words-button').addEventListener('click', () => {
            window.open(SENSITIVE_WORDS_SOURCE_URL, '_blank');
            logScriptMessage("用户点击报告敏感词按钮，打开来源URL。", "info");
        });
        panelApiFrequencyInput.addEventListener('input', () => displayPanelMessage('', ''));
        panelEnableCheckInput.addEventListener('change', () => displayPanelMessage('', ''));
        panelEnableContentChangeDetectionInput.addEventListener('change', toggleContentChangeSettingsVisibility); // Add listener for the new checkbox
        panelContentCheckFrequencyInput.addEventListener('input', () => displayPanelMessage('', ''));
        panelContentDiffThresholdInput.addEventListener('input', () => displayPanelMessage('', ''));

        panelShowLogButton.addEventListener('click', toggleLogView);

        const triggerButton = document.createElement('div');
        triggerButton.id = 'sensitive-words-panel-trigger';
        triggerButton.textContent = '敏感词设置';
        triggerButton.addEventListener('click', openPanel);
        document.body.appendChild(triggerButton);
    }

    // NEW: Function to toggle visibility of content change detection settings
    function toggleContentChangeSettingsVisibility() {
        if (panelEnableContentChangeDetectionInput.checked) {
            contentChangeSettingsDiv.style.display = 'flex';
        } else {
            contentChangeSettingsDiv.style.display = 'none';
        }
        displayPanelMessage('', ''); // Clear any previous messages when toggling
    }

    async function openPanel() {
        panelDiv.style.display = 'flex';
        panelTextArea.value = Sensitive_words.join('\n');
        panelApiKeyInput.value = await GM.getValue('openai_api_key', '');
        panelApiEndpointInput.value = await GM.getValue('openai_api_endpoint', "https://api.openai.com/v1/chat/completions");
        panelApiModelInput.value = await GM.getValue('openai_api_model', "gpt-3.5-turbo");
        panelApiFrequencyInput.value = await GM.getValue('api_call_frequency_days', 30);
        panelEnableCheckInput.checked = await GM.getValue('enable_sensitive_check', true);
        panelEnableContentChangeDetectionInput.checked = await GM.getValue('enable_content_change_detection', false);
        panelContentCheckFrequencyInput.value = await GM.getValue('content_check_frequency_hours', 6);
        panelContentDiffThresholdInput.value = await GM.getValue('content_diff_threshold_chars', 100);

        // Call this to set initial visibility based on loaded value
        toggleContentChangeSettingsVisibility();

        const lastUpdateStr = await GM.getValue('bangumi_sensitive_words_last_update', null);
        if (lastUpdateStr) {
            panelLastUpdateSpan.textContent = new Date(parseInt(lastUpdateStr, 10)).toLocaleString();
        } else {
            panelLastUpdateSpan.textContent = 'N/A';
        }
        displayPanelMessage('', '');
        showMainContent();
    }

    function closePanel() {
        panelDiv.style.display = 'none';
        logScriptMessage("面板已关闭。", "info");
    }

    function displayPanelMessage(message, type) {
        panelMessageDiv.textContent = message;
        panelMessageDiv.className = `panel-message ${type}`;
        panelMessageDiv.style.display = message ? 'block' : 'none';
        // 不再重复记录displayPanelMessage的信息到logScriptMessage，避免重复
        // logScriptMessage(message, type);
    }

    async function handleApiRefresh() {
        displayPanelMessage("正在通过API刷新敏感词...", "warning");
        const key = panelApiKeyInput.value.trim();
        const endpoint = panelApiEndpointInput.value.trim();
        const model = panelApiModelInput.value.trim();
        const frequency = parseInt(panelApiFrequencyInput.value.trim(), 10);
        const enableCheck = panelEnableCheckInput.checked;

        // Content change detection settings from panel
        const enableContentChangeDetection = panelEnableContentChangeDetectionInput.checked;
        const contentCheckFrequency = parseInt(panelContentCheckFrequencyInput.value.trim(), 10);
        const contentDiffThreshold = parseInt(panelContentDiffThresholdInput.value.trim(), 10);

        // Validate inputs
        if (!key) { displayPanelMessage("错误: API Key 不能为空。", "error"); return; }
        if (!endpoint) { displayPanelMessage("错误: API Endpoint 不能为空。", "error"); return; }
        if (!model) { displayPanelMessage("错误: API Model 不能为空。", "error"); return; }
        if (isNaN(frequency) || frequency < 1) { displayPanelMessage("错误: AI更新频率必须是大于等于1的整数。", "error"); return; }
        // Validate content change detection settings only if enabled
        if (enableContentChangeDetection) {
            if (isNaN(contentCheckFrequency) || contentCheckFrequency < 1) { displayPanelMessage("错误: 内容检测频率必须是大于等于1的整数。", "error"); return; }
            if (isNaN(contentDiffThreshold) || contentDiffThreshold < 0) { displayPanelMessage("错误: 内容差异阈值必须是大于等于0的整数。", "error"); return; }
        }


        // Save all current settings
        OPENAI_API_KEY = key;
        OPENAI_API_ENDPOINT = endpoint;
        OPENAI_API_MODEL = model;
        API_CALL_FREQUENCY_DAYS_SETTING = frequency;
        ENABLE_SENSITIVE_CHECK = enableCheck;
        ENABLE_CONTENT_CHANGE_DETECTION = enableContentChangeDetection;
        CONTENT_CHECK_FREQUENCY_HOURS_SETTING = contentCheckFrequency;
        CONTENT_DIFF_THRESHOLD_CHARS_SETTING = contentDiffThreshold;

        await GM.setValue('openai_api_key', OPENAI_API_KEY);
        await GM.setValue('openai_api_endpoint', OPENAI_API_ENDPOINT);
        await GM.setValue('openai_api_model', OPENAI_API_MODEL);
        await GM.setValue('api_call_frequency_days', API_CALL_FREQUENCY_DAYS_SETTING);
        await GM.setValue('enable_sensitive_check', ENABLE_SENSITIVE_CHECK);
        await GM.setValue('enable_content_change_detection', ENABLE_CONTENT_CHANGE_DETECTION);
        await GM.setValue('content_check_frequency_hours', CONTENT_CHECK_FREQUENCY_HOURS_SETTING);
        await GM.setValue('content_diff_threshold_chars', CONTENT_DIFF_THRESHOLD_CHARS_SETTING);

        let shouldCallAI = false;
        let currentFullTopicContent = "";
        const now = Date.now();
        const lastStoredContent = await GM.getValue('bangumi_sensitive_words_last_content', ''); // Get content before this manual fetch

        currentFullTopicContent = await fetchTopicContent(SENSITIVE_WORDS_SOURCE_URL);
        await GM.setValue('bangumi_sensitive_words_last_content_check', now.toString()); // Update timestamp after fetch
        if (!currentFullTopicContent) {
            displayPanelMessage("获取目标网页内容失败，API更新中止。", "error");
            logScriptMessage("获取目标网页内容失败，手动API更新中止。", "error");
            return;
        }
        await GM.setValue('bangumi_sensitive_words_last_content', currentFullTopicContent); // Save current content for next comparison


        if (ENABLE_CONTENT_CHANGE_DETECTION) {
            if (currentFullTopicContent === lastStoredContent) {
                displayPanelMessage("手动刷新：目标网页内容无变化，跳过AI更新。", "info");
                logScriptMessage("手动刷新：目标网页内容未变化，跳过AI更新。", "info");
                shouldCallAI = false;
            } else if (Math.abs(currentFullTopicContent.length - lastStoredContent.length) < CONTENT_DIFF_THRESHOLD_CHARS_SETTING) {
                displayPanelMessage(`手动刷新：目标网页内容变化不足 ${CONTENT_DIFF_THRESHOLD_CHARS_SETTING} 字符，跳过AI更新。`, "info");
                logScriptMessage(`手动刷新：目标网页内容变化不足 ${CONTENT_DIFF_THRESHOLD_CHARS_SETTING} 字符，跳过AI更新。`, "info");
                shouldCallAI = false;
            } else {
                displayPanelMessage("手动刷新：目标网页内容已变化，将调用AI更新。", "info");
                logScriptMessage("手动刷新：目标网页内容已变化，将调用AI更新敏感词。", "info");
                shouldCallAI = true;
            }
        } else {
            displayPanelMessage("内容变化检测已禁用，手动刷新将直接调用AI更新。", "info");
            logScriptMessage("内容变化检测已禁用，手动刷新将直接调用AI更新。", "info");
            shouldCallAI = true;
        }

        if (shouldCallAI) {
            await performIterativeSensitiveWordFetch(currentFullTopicContent);
        } else {
            displayPanelMessage("手动刷新未进行AI更新。", "info");
            logScriptMessage("手动刷新未进行AI更新。", "info");
        }

        // Update panel display
        panelTextArea.value = Sensitive_words.join('\n');
        const lastUpdateStrAfterRefresh = await GM.getValue('bangumi_sensitive_words_last_update', null);
        if (lastUpdateStrAfterRefresh) {
            panelLastUpdateSpan.textContent = new Date(parseInt(lastUpdateStrAfterRefresh, 10)).toLocaleString();
        } else {
            panelLastUpdateSpan.textContent = 'N/A';
        }
    }

    async function handleManualSave() {
        const wordsText = panelTextArea.value.trim();
        let newWords = [];
        if (wordsText) {
            newWords = wordsText.split('\n').map(w => w.trim()).filter(w => w.length > 0);
            newWords = [...new Set(newWords)]; // 去重
            newWords.sort();
        }

        Sensitive_words = newWords;
        await GM.setValue('bangumi_sensitive_words_list', JSON.stringify(Sensitive_words));
        await GM.setValue('bangumi_sensitive_words_last_update', Date.now().toString()); // 手动保存也更新时间戳

        const key = panelApiKeyInput.value.trim();
        const endpoint = panelApiEndpointInput.value.trim();
        const model = panelApiModelInput.value.trim();
        const frequency = parseInt(panelApiFrequencyInput.value.trim(), 10);
        const enableCheck = panelEnableCheckInput.checked;
        const enableContentChangeDetection = panelEnableContentChangeDetectionInput.checked;
        const contentCheckFrequency = parseInt(panelContentCheckFrequencyInput.value.trim(), 10);
        const contentDiffThreshold = parseInt(panelContentDiffThresholdInput.value.trim(), 10);

        // Validate inputs
        if (!key) { displayPanelMessage("错误: API Key 不能为空。", "error"); return; }
        if (!endpoint) { displayPanelMessage("错误: API Endpoint 不能为空。", "error"); return; }
        if (!model) { displayPanelMessage("错误: API Model 不能为空。", "error"); return; }
        if (isNaN(frequency) || frequency < 1) { displayPanelMessage("错误: AI更新频率必须是大于等于1的整数。", "error"); return; }
        // Validate content change detection settings only if enabled
        if (enableContentChangeDetection) {
            if (isNaN(contentCheckFrequency) || contentCheckFrequency < 1) { displayPanelMessage("错误: 内容检测频率必须是大于等于1的整数。", "error"); return; }
            if (isNaN(contentDiffThreshold) || contentDiffThreshold < 0) { displayPanelMessage("错误: 内容差异阈值必须是大于等于0的整数。", "error"); return; }
        }

        // 保存所有面板设置
        OPENAI_API_KEY = key;
        OPENAI_API_ENDPOINT = endpoint;
        OPENAI_API_MODEL = model;
        API_CALL_FREQUENCY_DAYS_SETTING = frequency;
        ENABLE_SENSITIVE_CHECK = enableCheck;
        ENABLE_CONTENT_CHANGE_DETECTION = enableContentChangeDetection;
        CONTENT_CHECK_FREQUENCY_HOURS_SETTING = contentCheckFrequency;
        CONTENT_DIFF_THRESHOLD_CHARS_SETTING = contentDiffThreshold;


        await GM.setValue('openai_api_key', OPENAI_API_KEY);
        await GM.setValue('openai_api_endpoint', OPENAI_API_ENDPOINT);
        await GM.setValue('openai_api_model', OPENAI_API_MODEL);
        await GM.setValue('api_call_frequency_days', API_CALL_FREQUENCY_DAYS_SETTING);
        await GM.setValue('enable_sensitive_check', ENABLE_SENSITIVE_CHECK);
        await GM.setValue('enable_content_change_detection', ENABLE_CONTENT_CHANGE_DETECTION);
        await GM.setValue('content_check_frequency_hours', CONTENT_CHECK_FREQUENCY_HOURS_SETTING);
        await GM.setValue('content_diff_threshold_chars', CONTENT_DIFF_THRESHOLD_CHARS_SETTING);


        panelLastUpdateSpan.textContent = new Date(Date.now()).toLocaleString();
        panelTextArea.value = Sensitive_words.join('\n');
        displayPanelMessage("所有设置和敏感词已保存。", "success");
        logScriptMessage("用户手动保存所有设置和敏感词。", "info");
    }

    function updateLogDisplay() {
        panelLogContentDiv.innerHTML = '';
        scriptLogs.forEach(entry => {
            const logEntryDiv = document.createElement('div');
            logEntryDiv.className = `log-${entry.type}`;
            logEntryDiv.innerHTML = `<strong>[${entry.timestamp}]</strong> ${entry.message}`;
            panelLogContentDiv.appendChild(logEntryDiv);
        });
        panelLogContentDiv.scrollTop = panelLogContentDiv.scrollHeight;
    }

    function showMainContent() {
        panelMainContentDiv.style.display = 'block';
        panelLogSectionDiv.style.display = 'none';
        panelShowLogButton.textContent = '日志';
        logScriptMessage("面板切换到设置视图。", "debug");
    }

    function showLogContent() {
        panelMainContentDiv.style.display = 'none';
        panelLogSectionDiv.style.display = 'flex';
        panelShowLogButton.textContent = '设置';
        updateLogDisplay();
        logScriptMessage("面板切换到日志视图。", "debug");
    }

    function toggleLogView() {
        if (panelLogSectionDiv.style.display === 'none') {
            showLogContent();
        } else {
            showMainContent();
        }
    }

    function injectMenuItem(menuUl) {
        if (!menuUl) return;

        if (menuUl.querySelector('a.sensitive-word-settings-link')) {
            return;
        }

        const newLi = document.createElement('li');
        const newA = document.createElement('a');
        newA.href = "javascript:void(0)";
        newA.className = "sensitive-word-settings-link";
        newA.innerHTML = '◇ 敏感词设置';
        newA.addEventListener('click', (event) => {
            event.preventDefault();
            openPanel();
        });
        newLi.appendChild(newA);
        menuUl.appendChild(newLi);
        logScriptMessage("敏感词设置链接已注入菜单。", "info");
    }

    const observerConfig = { childList: true, subtree: true };

    const menuObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const menuContainer = node.matches('.dialog_menu') ? node : node.querySelector('.dialog_menu');
                        if (menuContainer) {
                            const menuUl = menuContainer.querySelector('ul');
                            if (menuUl) {
                                injectMenuItem(menuUl);
                            }
                        }
                    }
                });
            }
        }
    });

    menuObserver.observe(document.body, observerConfig);

    (async function() {
        createPanel();

        await initializeSensitiveWords();

        // 仅在检测功能开启时，才绑定事件监听器
        if (ENABLE_SENSITIVE_CHECK) {
            // 新话题/编辑话题页
            if(location.href.match(/new_topic|topic\/\d+\/edit/)){
                logScriptMessage("检测到话题编辑页面，绑定敏感词检测。", "info");
                sensitive_check($("#title"));
                sensitive_check($("#content"));
            }
            // 新日志/编辑日志页
            if(location.href.match(/blog\/create|blog\/\d+\/edit/)){
                logScriptMessage("检测到日志编辑页面，绑定敏感词检测。", "info");
                sensitive_check($("#title"));
                sensitive_check($("#tpc_content"));
            }
            // 条目页面（吐槽、评论）
            if(location.href.match(/subject\/\d+/)){
                logScriptMessage("检测到条目页面，绑定敏感词检测。", "info");
                // 仅在存在这些元素时绑定
                if ($("#title").length) sensitive_check($("#title")); // 部分条目页可能没有title输入框
                if ($("#content").length) sensitive_check($("#content")); // 评论框
                if ($("#comment").length) sensitive_check($("#comment")); // 旧版评论框或吐槽
            }
        } else {
            logScriptMessage("敏感词检测功能当前处于关闭状态。", "info");
        }
    })();
})();
(function() {
    'use strict';

    // 正则表达式
    // g: 全局匹配（查找所有出现）
    // i: 忽略大小写
    const TARGET_REGEX = /[Ss]一串/g;
    const REPLACEMENT_STRING = 's君';

    // ---------------------------------------------------------------------
    // 辅助函数：处理输入框（input/textarea）中的替换并尝试保留光标位置
    // ---------------------------------------------------------------------
    function replaceAndPreserveCursor(inputElement) {
        const originalValue = inputElement.value;
        const selectionStart = inputElement.selectionStart;
        const selectionEnd = inputElement.selectionEnd;

        let newValue = "";
        let lastIndex = 0;
        let newSelectionStart = selectionStart;
        let newSelectionEnd = selectionEnd;

        let match;
        const tempRegex = new RegExp(TARGET_REGEX); // 使用临时正则，避免修改全局正则的 lastIndex
        while ((match = tempRegex.exec(originalValue)) !== null) {
            const matchedString = match[0]; // 实际匹配到的字符串
            const startIndex = match.index;
            const endIndex = tempRegex.lastIndex; // next search starts here

            // 拼接匹配项之前的内容
            newValue += originalValue.substring(lastIndex, startIndex);
            // 拼接替换后的字符串
            newValue += REPLACEMENT_STRING;

            // 计算长度差异
            const lengthDifference = REPLACEMENT_STRING.length - matchedString.length;

            // 如果光标在当前匹配项之后，需要调整光标位置
            if (startIndex < selectionStart) {
                newSelectionStart += lengthDifference;
                newSelectionEnd += lengthDifference;
            } else if (startIndex <= selectionStart && selectionStart < endIndex) {
                // 如果光标在匹配项内部，将其移动到替换后的字符串的末尾
                newSelectionStart = startIndex + REPLACEMENT_STRING.length;
                newSelectionEnd = startIndex + REPLACEMENT_STRING.length;
            }

            lastIndex = endIndex;
        }

        // 拼接所有匹配项之后的内容
        newValue += originalValue.substring(lastIndex);

        // 只有在内容发生变化时才更新值，避免不必要的DOM操作和事件触发
        if (originalValue !== newValue) {
            inputElement.value = newValue;
            // 恢复调整后的光标位置
            inputElement.setSelectionRange(newSelectionStart, newSelectionEnd);
        }
    }

    // 辅助函数：处理 contenteditable 元素中的替换（光标保留较复杂，此处可能重置）
    function replaceContentEditable(element) {
        // 对于 contenteditable，直接替换 innerHTML 可能导致光标位置重置
        // 但能保留大部分HTML结构。更高级的光标保留需要使用 Range 和 Selection API。
        const originalHTML = element.innerHTML;
        const newHTML = originalHTML.replace(TARGET_REGEX, REPLACEMENT_STRING);

        if (originalHTML !== newHTML) {
            element.innerHTML = newHTML;
            // 注意：这里光标可能会被重置到元素的开头或结尾。
            // 如果需要精确的光标控制，contenteditable 的处理会复杂得多。
        }
    }

    // 函数：遍历并替换文本节点中的内容
    function replaceTextNodes(rootElement = document.body) {
        // 如果 rootElement 不存在或不是元素节点，则不处理
        if (!rootElement || rootElement.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        const walker = document.createTreeWalker(
            rootElement,
            NodeFilter.SHOW_TEXT,
            null, // No custom filter, accept all text nodes
            false
        );

        let node;
        const textNodesToModify = [];

        while ((node = walker.nextNode())) {
            // 排除 script, style 标签内的文本，以及可编辑元素（这些由输入监听器处理）
            if (node.parentNode && (
                node.parentNode.tagName === 'SCRIPT' ||
                node.parentNode.tagName === 'STYLE' ||
                node.parentNode.isContentEditable ||
                (node.parentNode.tagName === 'INPUT' && (node.parentNode.type === 'text' || node.parentNode.type === 'search' || node.parentNode.type === 'email' || node.parentNode.type === 'url')) || // 排除 input
                node.parentNode.tagName === 'TEXTAREA' // 排除 textarea
            )) {
                continue;
            }

            // 检查文本内容是否包含目标字符串
            if (node.nodeValue && node.nodeValue.match(TARGET_REGEX)) {
                textNodesToModify.push(node);
            }
        }

        // 批量修改文本节点，避免在遍历时修改DOM导致walker失效
        textNodesToModify.forEach(node => {
            node.nodeValue = node.nodeValue.replace(TARGET_REGEX, REPLACEMENT_STRING);
        });
    }

    // 函数：设置输入框和 contenteditable 元素的实时监听
    // 使用 WeakSet 存储已监听的元素，防止重复添加事件监听器
    const monitoredElements = new WeakSet();

    function setupInputMonitoringForElement(element) {
        if (!element || monitoredElements.has(element)) {
            return; // 已经监听过此元素或元素无效
        }
        monitoredElements.add(element);

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            // 对 input 和 textarea 使用 'input' 事件进行实时检测
            element.addEventListener('input', (event) => replaceAndPreserveCursor(event.target));
            // 对已存在的输入框内容进行首次检查
            if (element.value && element.value.match(TARGET_REGEX)) {
                replaceAndPreserveCursor(element);
            }
        } else if (element.isContentEditable) {
            // 对 contenteditable 元素使用 'input' 事件
            element.addEventListener('input', (event) => replaceContentEditable(event.target));
            // 对已存在的 contenteditable 内容进行首次检查
            if (element.textContent && element.textContent.match(TARGET_REGEX)) { // 使用 textContent 进行快速检查
                replaceContentEditable(element); // 实际替换使用 innerHTML
            }
        }
    }

    function setupAllInputMonitoring() {
        // 查找当前页面上所有的 input[type="text"], input[type="search"], input[type="email"], input[type="url"], textarea, 和 contenteditable 元素
        const editableElements = document.querySelectorAll(
            'input[type="text"], input[type="search"], input[type="email"], input[type="url"], textarea, [contenteditable="true"]'
        );
        editableElements.forEach(setupInputMonitoringForElement);
    }

    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            // 检查新添加的文本节点
                            if (node.parentNode && !(node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE' || node.parentNode.isContentEditable)) {
                                if (node.nodeValue && node.nodeValue.match(TARGET_REGEX)) {
                                    node.nodeValue = node.nodeValue.replace(TARGET_REGEX, REPLACEMENT_STRING);
                                }
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素及其子元素中的文本节点
                            replaceTextNodes(node);

                            // 检查新添加的元素中是否有可编辑元素
                            const editableElementsInNewNode = node.querySelectorAll(
                                'input[type="text"], input[type="search"], input[type="email"], input[type="url"], textarea, [contenteditable="true"]'
                            );
                            editableElementsInNewNode.forEach(setupInputMonitoringForElement);

                            // 如果新添加的元素本身就是可编辑元素
                            if (node.matches('input[type="text"], input[type="search"], input[type="email"], input[type="url"], textarea, [contenteditable="true"]')) {
                                setupInputMonitoringForElement(node);
                            }
                        }
                    });
                }
            });
        });

        if (document.body) {
             observer.observe(document.body, { childList: true, subtree: true });
        } else {
            window.addEventListener('load', () => observer.observe(document.body, { childList: true, subtree: true }));
        }
    }

    function initializeScript() {
        // 1. 扫描并替换页面上已有的文本内容
        replaceTextNodes();

        // 2. 设置输入框和 contenteditable 元素的实时监听
        setupAllInputMonitoring();

        // 3. 启动 MutationObserver 监听未来 DOM 变化
        setupMutationObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();