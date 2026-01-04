// ==UserScript==
// @name         AI Fuck CC - Simplify Module
// @version      1.3
// @license MIT
// @match *
// @description 简化脚本
// @namespace https://greasyfork.org/users/1462884
// @downloadURL https://update.greasyfork.org/scripts/534238/AI%20Fuck%20CC%20-%20Simplify%20Module.user.js
// @updateURL https://update.greasyfork.org/scripts/534238/AI%20Fuck%20CC%20-%20Simplify%20Module.meta.js
// ==/UserScript==

var SimplifyModule = (function() { // 使用 var 或 const/let 取决于你的环境和偏好
    'use strict';

    // --- 配置 (可以设为默认值，允许外部覆盖) ---
    const DEFAULT_CONFIG = {
        tokenKey: 'console_token',
        convMapKey: 'conversationIdInfo',
        aiReplySelector: 'div#ai-chat-answer',
        contentContainerSelector: '.undefined.markdown-body',
        selectorsToRemoveLatest: 'details.thinking, details.statusbar',
        selectorsToRemoveSecondLatest: 'details.optionsarea, details.memoryarea, details.thinking, details.statusbar',
        apiBaseUrl: 'https://aifuck.cc/console/api/installed-apps/',
        tryVisualUpdate: false // 新增配置：是否尝试直接更新页面DOM
    };

    // --- 内部辅助函数 ---
    function logDebug(...args) { console.log('[SimplifyMod DEBUG]', ...args); }
    function logInfo(...args) { console.log('[SimplifyMod INFO]', ...args); }
    function logError(...args) { console.error('[SimplifyMod ERROR]', ...args); }

    // ... (getAuthToken, getAppId, getConversationId - 可能需要接收 config) ...
    // ... (fetchMessages - 可能需要接收 config) ...
    // ... (updateMessageApi - 可能需要接收 config) ...
    // ... (extractSimplifiedContent - 不变) ...
    // ... (updatePageElementVisuals - 如果保留，基本不变) ...

    // --- 核心处理函数 (修改自 processLastTwoReplies) ---
    async function simplifyReplies(userConfig = {}) {
        const config = { ...DEFAULT_CONFIG, ...userConfig }; // 合并配置
        logInfo('Starting simplification process with config:', config);

        let processedCount = 0;
        let failedCount = 0;
        let simplifiedResults = []; // 存储简化结果

        // --- 1. 获取必要信息 ---
        const authToken = getAuthToken(config.tokenKey); // 修改 getAuthToken 以接受 key
        const appId = getAppId();
        const conversationId = getConversationId(appId, config.convMapKey); // 修改 getConversationId

        if (!authToken || !appId || !conversationId) {
             const errorMsg = 'Missing essential info (Token, App ID, or Conv ID).';
             logError(errorMsg);
             // 返回一个 rejected Promise
             return Promise.reject({ success: false, message: errorMsg });
        }

        try {
            // --- 2. 获取消息和页面元素 ---
            logInfo('Fetching message list...');
            const apiMessages = await fetchMessages(appId, conversationId, authToken, config.apiBaseUrl); // 修改 fetchMessages
            const pageReplies = document.querySelectorAll(config.aiReplySelector);
            logInfo(`Found ${pageReplies.length} AI reply elements on page.`);
            // ... (处理消息数量不匹配的警告日志) ...

            if (pageReplies.length === 0) {
                logInfo('No AI replies found on page. Nothing to do.');
                return Promise.resolve({ success: true, message: 'No AI replies found on page.', processedCount: 0, failedCount: 0 });
            }

            // --- 3. 确定处理目标 ---
            const repliesToProcess = [];
            // ... (基本同原 processLastTwoReplies 确定 latest 和 second latest 逻辑) ...
            // 确保使用 config 中的选择器

            // --- 4. 依次处理 ---
            for (const target of repliesToProcess) {
                logInfo(`--- Processing ${target.label} Reply (Page Index: ${target.index}) ---`);
                const contentContainer = target.element.querySelector(config.contentContainerSelector);
                if (!contentContainer) {
                    logError(`  - Could not find content container for ${target.label} reply. Skipping.`);
                    failedCount++;
                    continue;
                }

                // 4.1 提取简化内容
                const originalHtml = contentContainer.innerHTML; // 保存原始HTML供返回
                const simplifiedHtml = extractSimplifiedContent(contentContainer, target.selectorsToRemove);

                if (simplifiedHtml !== null && simplifiedHtml !== "") {
                    try {
                        // 4.2 API 更新
                        await updateMessageApi(appId, target.apiMessage.id, simplifiedHtml, authToken, config.apiBaseUrl); // 修改 updateMessageApi

                        // 4.3 (可选) 尝试视觉更新
                        if (config.tryVisualUpdate) {
                            updatePageElementVisuals(target.element.querySelector(config.contentContainerSelector), simplifiedHtml); // 调用修改后的视觉更新函数
                        }

                        // 4.4 记录成功
                        processedCount++;
                        simplifiedResults.push({
                            messageId: target.apiMessage.id,
                            index: target.index,
                            originalHtml: originalHtml,
                            simplifiedHtml: simplifiedHtml
                        });
                        logInfo(`  - Successfully processed ${target.label} reply.`);

                    } catch (updateError) {
                        logError(`  - Failed to update ${target.label} reply (API or Visual):`, updateError);
                        failedCount++;
                    }
                } else {
                    logError(`  - Failed to extract valid content for ${target.label} reply. Skipping update.`);
                    failedCount++;
                }
                 await new Promise(resolve => setTimeout(resolve, 150)); // 保留延迟
            }

            // --- 5. 返回最终结果 ---
            const finalMessage = `Simplification finished. Success: ${processedCount}, Failed: ${failedCount}.`;
            logInfo(`--- Processing Finished --- ${finalMessage}`);
            return Promise.resolve({
                success: processedCount > 0 || failedCount === 0, // 至少处理成功一个算成功，或者没有失败也算成功
                message: finalMessage,
                processedCount: processedCount,
                failedCount: failedCount,
                simplifiedData: simplifiedResults,
                visualUpdateAttempted: config.tryVisualUpdate
            });

        } catch (error) {
            logError('An overall error occurred during simplification:', error);
            return Promise.reject({
                success: false,
                message: `An unexpected error occurred: ${error.message || error}`,
                error: error
            });
        }
    }

    // --- 返回模块的公共接口 ---
    return {
        // 提供简化函数
        simplify: simplifyReplies,

        // （可选）如果主脚本需要，可以暴露一些配置或内部函数，但不推荐
        // getConfigDefaults: () => ({ ...DEFAULT_CONFIG }),
    };

})(); // 立即执行

// 注意：在 Tampermonkey 中，如果主脚本使用 @require 引入这个文件，
// 主脚本可以直接使用 SimplifyModule 这个变量。