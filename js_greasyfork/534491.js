// ==UserScript==
// @name         星际奥德赛资源提取器
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动提取星际奥德赛游戏中所有资源数量，并在满足条件时每日上传一次到GitHub
// @author       Nagisa
// @match        https://game.stellarodyssey.app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.github.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534491/%E6%98%9F%E9%99%85%E5%A5%A5%E5%BE%B7%E8%B5%9B%E8%B5%84%E6%BA%90%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534491/%E6%98%9F%E9%99%85%E5%A5%A5%E5%BE%B7%E8%B5%9B%E8%B5%84%E6%BA%90%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---

    const EXPECTED_RESOURCES = {
        "岩石型": ["铜", "金", "银", "铂", "暗物质"],
        "冰型": ["水", "氮", "硫", "碳", "硅"],
        "气态型": ["氨", "氢", "氦", "甲烷", "氩"],
        "晶体型": ["钻石", "红宝石", "绿宝石", "蓝宝石", "钴"]
    };
    const TOTAL_EXPECTED_RESOURCES = Object.values(EXPECTED_RESOURCES).flat().length; // 计算预期资源总数

    const GITHUB_CONFIG = {
        username: 'swonxxmi',
        repo: 'stellarodysseyey',
        token: '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',
        basePath: 'players/'
    };

    const AUTO_UPDATE_INTERVAL_MINUTES = 60; // 检查和提取数据的间隔时间（分钟），改为1小时
    const INITIAL_DELAY_SECONDS = 15;       // 页面加载后首次执行的延迟时间（秒）
    const UPLOAD_CHECK_DELAY_SECONDS = 5;   // 提取数据后等待上传检查的延迟时间（秒）

    const ID_FETCH_RETRIES = 3; // ID获取重试次数减少
    const ID_FETCH_RETRY_DELAY_MS = 1000; // ID获取重试间隔增加

    const LAST_UPLOAD_TIMESTAMP_KEY = 'stellar_last_upload_timestamp'; // 用于存储上次上传时间的键

    // --- 核心功能 ---

    /**
     * 记录日志到控制台
     * @param {string} message - 要记录的消息
     */
    function logStatus(message) {
        console.log(`[资源提取器] ${message}`);
    }

    /**
     * 尝试从页面或存储中获取玩家ID (移除prompt)
     * @returns {Promise<string|null>} 玩家ID或 null
     */
    async function getPlayerId() {
        logStatus("尝试获取玩家ID...");
        let playerId = null;

        // Method 1: Precise Selector with Retry
        const selector = "span[socn-id='1-excludeHeaderPlayerName']";
        for (let i = 0; i < ID_FETCH_RETRIES; i++) {
            const element = document.querySelector(selector);
            if (element) {
                playerId = element.textContent?.trim();
                if (playerId) {
                    logStatus(`通过精确选择器找到ID: ${playerId}`);
                    GM_setValue('playerId', playerId); // 缓存找到的ID
                    return playerId;
                }
            }
            if (i < ID_FETCH_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, ID_FETCH_RETRY_DELAY_MS));
            }
        }
        logStatus("精确选择器未能找到ID。");

        // Method 2: Button Dropdown Span (Fallback)
        const profileContainerDiv = document.querySelector("button.profile_dropdown div.flex.row.items-center");
        if (profileContainerDiv) {
            const nameSpan = profileContainerDiv.querySelector("span:last-child");
            if (nameSpan) {
                playerId = nameSpan.textContent?.trim();
                if (playerId && !playerId.match(/arrow_drop_down/i)) {
                    logStatus(`通过按钮下拉菜单找到ID: ${playerId}`);
                    GM_setValue('playerId', playerId);
                    return playerId;
                }
            }
        }
        logStatus("按钮下拉菜单未能找到ID。");

        // 尝试从缓存获取
        playerId = GM_getValue('playerId');
        if (playerId) {
            logStatus(`从缓存中获取ID: ${playerId}`);
            return playerId;
        }

        logStatus("所有自动方法均未能获取有效玩家ID。");
        return null; // 明确返回null表示失败
    }

    /**
     * 提取所有资源数据，仅当所有资源都找到时返回数据
     * @returns {Promise<object|null>} 包含提取数据（带playerId和时间戳）的对象，或null
     */
    async function extractAllResources() {
        logStatus("开始提取资源...");
        const allElements = document.querySelectorAll('*');
        const categorizedResources = {};
        let foundResourceCount = 0;

        Object.keys(EXPECTED_RESOURCES).forEach(category => {
            categorizedResources[category] = {};
        });

        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            const text = element.textContent.trim();

            if (Object.keys(EXPECTED_RESOURCES).includes(text)) {
                const categoryName = text;
                let nextElement = element.nextElementSibling;
                const foundInCategory = new Set();

                while (nextElement && !Object.keys(EXPECTED_RESOURCES).includes(nextElement.textContent.trim()) && !nextElement.classList.contains('full-width') && foundInCategory.size < EXPECTED_RESOURCES[categoryName].length) {
                    const resourceElements = nextElement.querySelectorAll('.text-weight-light.text-capitalize, .text_rare');
                    const valueElements = nextElement.querySelectorAll('.text-blue-grey-2.text-weight-light');

                    if (resourceElements.length > 0 && valueElements.length > 0) {
                        const resourceNameElement = Array.from(resourceElements).find(el => EXPECTED_RESOURCES[categoryName].includes(el.textContent.trim()));
                        const valueElement = Array.from(valueElements).find(el => el.textContent.trim().match(/^[0-9.]+[KMB]?$/) || el.textContent.trim() === "0");

                        if (resourceNameElement && valueElement) {
                            const resourceName = resourceNameElement.textContent.trim();
                            const resourceValue = valueElement.textContent.trim();
                            if (!foundInCategory.has(resourceName)) {
                                // logStatus(`  找到: ${categoryName} -> ${resourceName} = ${resourceValue}`); // 减少日志量
                                categorizedResources[categoryName][resourceName] = resourceValue;
                                foundInCategory.add(resourceName);
                                foundResourceCount++;
                            }
                        }
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
        }

        logStatus(`提取结束，共找到 ${foundResourceCount} / ${TOTAL_EXPECTED_RESOURCES} 种预期资源`);

        if (foundResourceCount !== TOTAL_EXPECTED_RESOURCES) {
            logStatus("提取失败：未能找到所有预期资源。");
            return null;
        }

        const playerId = await getPlayerId();
        if (!playerId) {
            logStatus("提取失败：未能获取玩家ID。");
            return null;
        }

        const timestamp = new Date().toISOString();
        const dataToSave = {
            playerId: playerId,
            timestamp: timestamp,
            resources: categorizedResources
        };

        GM_setValue('resourceData', JSON.stringify(dataToSave)); // 仍然保存最新数据供可能的后续使用
        logStatus(`提取成功 (${foundResourceCount}种) for ${playerId}`);
        return dataToSave;
    }

    /**
     * 上传文件内容到GitHub
     * @param {string} content - 要上传的文件内容 (JSON string)
     * @param {string|null} sha - 如果是更新文件，提供文件的SHA值
     * @param {string} playerId - 玩家ID
     */
    function uploadFileToGithub(content, sha, playerId) {
        if (!playerId || playerId === 'unknown_player') {
            logStatus("上传错误：无效的Player ID。");
            return;
        }

        const playerFilePath = `${GITHUB_CONFIG.basePath}${playerId}.json`;
        const commitMessage = `Update resource data for ${playerId} at ${new Date().toISOString()}`;

        const requestData = {
            message: commitMessage,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: "main"
        };
        if (sha) requestData.sha = sha;

        logStatus(`正在上传 ${playerId}.json 到GitHub...`);

        GM_xmlhttpRequest({
            method: "PUT",
            url: `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${playerFilePath}`,
            headers: {
                "Authorization": `token ${GITHUB_CONFIG.token}`,
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3+json"
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                if (response.status === 200 || response.status === 201) {
                    logStatus(`数据成功上传 (${playerId}.json)`);
                    // 更新上传时间戳
                    GM_setValue(LAST_UPLOAD_TIMESTAMP_KEY, new Date().toISOString());
                    logStatus(`已更新最后上传时间戳 for ${playerId}`);
                } else {
                    console.error("上传失败:", response.status, response.responseText);
                    logStatus(`上传失败 (${playerId}.json): ${response.status}`);
                }
            },
            onerror: function(error) {
                console.error("上传请求失败:", error);
                logStatus(`上传请求失败 (${playerId}.json)`);
            }
        });
    }

    /**
     * 准备上传数据，直接用新数据覆盖旧文件（如果存在）
     * @param {string} jsonDataString - 包含本次提取数据的JSON字符串
     * @param {string|null} sha - 当前文件的SHA (如果是更新，则需要提供)
     */
    function createOrUpdateFile(jsonDataString, sha) {
        const currentData = JSON.parse(jsonDataString);
        const playerId = currentData.playerId;

        if (!playerId || playerId === 'unknown_player') {
            logStatus("上传错误：无效的Player ID。");
            return;
        }

        // 直接准备要上传的单条数据（不再需要合并）
        // 格式化JSON以便在GitHub上查看
        const contentToUpload = JSON.stringify(currentData, null, 2);

        if (sha) {
            logStatus(`文件 ${playerId}.json 已存在，准备覆盖...`);
            uploadFileToGithub(contentToUpload, sha, playerId);
        } else {
            logStatus(`文件 ${playerId}.json 不存在，创建新文件...`);
            uploadFileToGithub(contentToUpload, null, playerId); // 首次上传sha为null
        }
    }

    /**
     * 检查是否在目标页面，如果是，则设置自动提取和上传检查任务
     */
    function setupAutoRun() {
        if (window.location.href.includes('https://game.stellarodyssey.app/#/gathering')) {
            logStatus("检测到采集页面，设置自动任务...");

            let isRunning = false;

            const runCheckUploadAndExtract = async () => {
                if (isRunning) {
                    logStatus("自动任务：上一次任务仍在运行，跳过。");
                    return;
                }
                isRunning = true;
                logStatus("开始自动检查上传权限...");
                try {
                    // 1. 首先检查今天是否允许上传
                    const lastUploadTimestampStr = GM_getValue(LAST_UPLOAD_TIMESTAMP_KEY);
                    const now = new Date();
                    const oneDayInMillis = 24 * 60 * 60 * 1000;
                    let canUploadToday = true;

                    if (lastUploadTimestampStr) {
                        const lastUploadTimestamp = new Date(lastUploadTimestampStr);
                        if (now.getTime() - lastUploadTimestamp.getTime() < oneDayInMillis) {
                            canUploadToday = false;
                            logStatus(`今天已经上传过数据 (${lastUploadTimestamp.toLocaleString()})，跳过本次提取和上传检查。`);
                        }
                    }

                    // 2. 如果允许上传，才进行提取
                    if (canUploadToday) {
                        logStatus("允许上传，开始提取资源...");
                        const extractedData = await extractAllResources();

                        // 3. 检查提取是否成功，并且playerId是否有效
                        if (extractedData && extractedData.playerId && extractedData.playerId !== 'unknown_player') {
                            // 等待一小段时间再触发上传
                            await new Promise(resolve => setTimeout(resolve, UPLOAD_CHECK_DELAY_SECONDS * 1000));
                            // 直接触发上传流程（checkAndTriggerUpload内部包含了再次检查，但此处已确认可以上传）
                            // 为确保逻辑清晰，可以直接调用包含GitHub检查的triggerUpload
                            await triggerUpload(extractedData); // 传递已提取的数据
                        } else {
                            logStatus("提取未成功或PlayerID无效，本次不上传。");
                        }
                    }
                } catch (error) {
                    console.error("自动任务出错:", error);
                    logStatus("自动任务出错，详见控制台。");
                } finally {
                    isRunning = false;
                }
            };

            // 首次执行检查
            setTimeout(runCheckUploadAndExtract, INITIAL_DELAY_SECONDS * 1000);

            // 定时执行检查
            setInterval(runCheckUploadAndExtract, AUTO_UPDATE_INTERVAL_MINUTES * 60 * 1000);

        } else {
            logStatus("当前不在采集页面，不设置自动任务。");
        }
    }

    // --- 修改 triggerUpload 以接受可选参数 ---
    /**
     * 触发上传流程：获取本地数据(如果未提供)，检查GitHub文件状态，然后调用createOrUpdateFile
     * @param {object|null} [extractedData=null] - 可选，如果已提取则直接使用此数据
     */
    async function triggerUpload(extractedData = null) {
        let dataString;
        let parsedData;

        if (extractedData) {
             logStatus("使用先前提取的数据进行上传。");
            parsedData = extractedData;
            dataString = JSON.stringify(parsedData);
        } else {
             logStatus("未提供提取数据，从GM存储获取。");
            dataString = GM_getValue('resourceData');
            if (!dataString) {
                logStatus("没有本地数据可上传。");
                return;
            }
            parsedData = JSON.parse(dataString);
        }


        let playerId = parsedData.playerId;
        if (!playerId || playerId === 'unknown_player') {
             logStatus("尝试再次获取Player ID...");
            playerId = await getPlayerId();
        }

        if (!playerId || playerId === 'unknown_player') {
            logStatus("上传错误：无法确定Player ID。");
            return;
        }
        // 确保传递的数据对象中有最新的Player ID
        parsedData.playerId = playerId;
        dataString = JSON.stringify(parsedData);


        const playerFilePath = `${GITHUB_CONFIG.basePath}${playerId}.json`;
         logStatus(`检查GitHub文件状态 (${playerId}.json)...`);

        // 检查文件是否存在并获取 SHA
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${playerFilePath}`,
            headers: { "Authorization": `token ${GITHUB_CONFIG.token}`, "Accept": "application/vnd.github.v3+json" },
            onload: function(response) {
                let sha = null;
                if (response.status === 200) {
                    sha = JSON.parse(response.responseText).sha;
                     logStatus(`文件 ${playerId}.json 已存在，SHA: ${sha}`);
                } else if (response.status !== 404) {
                     console.error(`检查文件状态(${playerId}.json)失败:`, response.status);
                }
                createOrUpdateFile(dataString, sha); // 尝试创建或更新
            },
            onerror: function(error) {
                console.error(`检查文件状态(${playerId}.json)请求失败:`, error);
                createOrUpdateFile(dataString, null); // 尝试创建
            }
        });
    }

    /**
     * 监听URL变化，重新设置自动任务
     */
    function listenForUrlChanges() {
        let lastUrl = location.href;
        setupAutoRun(); // 初始检查

        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                logStatus(`URL发生变化: ${location.href}`);
                lastUrl = location.href;
                // 移除旧的状态UI（如果存在），以便在进入目标页面时重新添加
                const oldUI = document.getElementById('auto-extraction-status-container');
                if (oldUI) oldUI.remove();
                setupAutoRun(); // URL变化后重新检查并设置任务
            }
        });

        observer.observe(document.body, { subtree: true, childList: true });
    }

    // --- 启动脚本 ---
    window.addEventListener('load', listenForUrlChanges);

})(); // IIFE结束