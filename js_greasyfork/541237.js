// ==UserScript==
// @name         X.com Chain Blocker
// @name:zh-CN   X.com 九族拉黑
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Block author, retweeters, repliers, and auto-block users based on rules (length, content, keywords). Manage block log, whitelist, and settings in a panel.
// @description:zh-CN 当拉黑作者时，自动拉黑所有转推者和回复者。支持根据长度、内容、关键词等规则自动拉黑，并提供黑/白名单管理面板。
// @author       Gemini 2.5 Pro
// @license      MIT
// @match        *://x.com/*
// @match        *://twitter.com/*
// @exclude      *://x.com/settings*
// @exclude      *://twitter.com/settings*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.x.com
// @connect      x.com
// @downloadURL https://update.greasyfork.org/scripts/541237/Xcom%20%E4%B9%9D%E6%97%8F%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/541237/Xcom%20%E4%B9%9D%E6%97%8F%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==
(function () {
'use strict';
// --- CONFIG & CONSTANTS ---
const MENU_ITEM_TEXT = "九族拉黑";
const STORAGE_KEY = 'CHAIN_BLOCKER_DATA';
const CONFIG_STORAGE_KEY = 'CHAIN_BLOCKER_CONFIG';
const BLOCK_INTERVAL_MS = 10 * 1000;
const PROCESS_CHECK_INTERVAL_MS = 5 * 1000;
const USERNAME_LENGTH_THRESHOLD = 25;
const AUTO_SCAN_INTERVAL_MS = 2000;
const API_RETRY_DELAY_MS = 5 * 60 * 1000;
let currentUserId = null, currentUserScreenName = null, activeTweetArticle = null;
let isProcessingQueue = false, processIntervalId = null, apiLimitCountdownInterval = null;
let scriptConfig = {}, isConfigPanelBusy = false;

// --- STYLES ---
GM_addStyle(`.nuke-toast{position:fixed;top:20px;right:20px;z-index:100000;background-color:#15202b;color:white;padding:10px 15px;border-radius:12px;border:1px solid #38444d;box-shadow:0 4px 12px rgba(0,0,0,0.4);width:auto;max-width:350px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;transition:all .5s ease-out;opacity:1;transform:translateX(0)}.nuke-toast.fading-out{opacity:0;transform:translateX(20px)}.nuke-toast-title{font-weight:bold;margin-bottom:8px;font-size:16px}.nuke-toast-status{font-size:14px;margin-bottom:0;line-height:1.5}#nuke-status-toast{background-color:#253341}#nuke-api-limit-toast{background-color:#d9a100;color:#15202b;border-color:#ffc107}.nuke-config-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100001;background-color:#15202b;color:white;border-radius:16px;border:1px solid #38444d;box-shadow:0 8px 24px rgba(0,0,0,0.5);width:550px;max-width:90vw;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}.nuke-panel-header{display:flex;align-items:center;justify-content:space-between;height:53px;padding:0 16px;border-bottom:1px solid #38444d}.nuke-header-item{flex-basis:56px;display:flex;align-items:center}.nuke-header-item.left{justify-content:flex-start}.nuke-header-item.right{justify-content:flex-end}.nuke-config-title{font-weight:bold;font-size:20px;flex-grow:1;text-align:center}.nuke-close-button{background:0 0;border:0;padding:0;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:9999px;transition:background-color .2s ease-in-out}.nuke-close-button:hover{background-color:rgba(239,243,244,0.1)}.nuke-close-button svg{fill:white;width:20px;height:20px}.nuke-panel-content{padding:16px}.nuke-config-textarea{width:100%;background-color:#253341;border:1px solid #38444d;border-radius:8px;color:white;padding:10px;font-size:14px;resize:vertical;box-sizing:border-box;margin-bottom:15px}.nuke-url-textarea{height:80px}.nuke-keywords-textarea{height:60px}.nuke-config-button-container{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}.nuke-config-button.save{background-color:#eff3f4;color:#0f1419;padding:8px 16px;border-radius:20px;border:none;font-weight:bold;cursor:pointer;transition:background-color .2s}.nuke-config-button.save:hover{background-color:#d7dbdc}.nuke-config-tabs{display:flex;border-bottom:1px solid #38444d;margin-bottom:15px}.nuke-config-tab{background:0 0;border:none;color:#8899a6;padding:10px 15px;cursor:pointer;font-size:15px;font-weight:700;flex-grow:1;transition:background-color .2s}.nuke-config-tab:hover{background-color:rgba(239,243,244,0.1)}.nuke-config-tab.active{color:#1d9bf0;border-bottom:2px solid #1d9bf0;margin-bottom:-1px}.nuke-config-tab-content{animation:fadeIn .3s ease-in-out;padding-top:10px}.nuke-config-tab-content.hidden{display:none}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.nuke-list{max-height:280px;overflow-y:auto;padding-right:10px}.nuke-list-search{width:100%;background-color:#253341;border:1px solid #38444d;border-radius:8px;color:white;padding:8px 12px;font-size:14px;box-sizing:border-box;margin-bottom:10px}.nuke-list-entry{display:flex;justify-content:space-between;align-items:center;padding:8px 5px;border-bottom:1px solid #253341}.nuke-list-user-info{display:flex;flex-direction:column;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:10px}.nuke-list-user-name{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nuke-list-user-handle{color:#8899a6;font-size:14px;cursor:pointer}.nuke-list-user-handle:hover{text-decoration:underline}.nuke-list-actions{font-size:12px;color:#8899a6;white-space:nowrap;cursor:pointer}.nuke-list-actions:hover{color:#1d9bf0}.nuke-list-user-info a{color:inherit;text-decoration:none}.nuke-list-user-info a:hover .nuke-list-user-name{text-decoration:underline}.nuke-setting-item{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}.nuke-setting-item label{font-size:14px;margin-right:10px}.nuke-setting-item input[type=number]{width:80px;background-color:#253341;border:1px solid #38444d;border-radius:8px;color:white;padding:5px 8px;font-size:14px}.nuke-setting-item input[type=checkbox]{height:20px;width:20px;accent-color:#1d9bf0}.nuke-settings-label{display:block;font-size:14px;color:#8899a6;margin-top:10px;margin-bottom:10px}`);

// --- CONFIGURATION MANAGEMENT ---
async function loadConfig() {
    const defaultConfig = {
        autoBlockEnabled: true,
        autoBlockUrls: ['https://x.com/*/status/*', 'https://x.com/search*'],
        blockLogLimit: 500,
        blockKeywords: [], // For long names
        blockKeywordsStandard: [] // For any name
    };
    const savedConfig = await GM_getValue(CONFIG_STORAGE_KEY, {});
    scriptConfig = { ...defaultConfig, ...savedConfig };
    return scriptConfig;
}
async function saveConfig(config) { await GM_setValue(CONFIG_STORAGE_KEY, config); scriptConfig = config; }
function updateMenuCommands() { GM_registerMenuCommand('配置与记录', showConfigPanel); }
async function showConfigPanel() {
    if (isConfigPanelBusy) return;
    isConfigPanelBusy = true;
    try {
        if (document.getElementById('nuke-url-config-panel')?.remove()) return;
        let config = await loadConfig();
        const panel = document.createElement('div');
        panel.id = 'nuke-url-config-panel';
        panel.className = 'nuke-config-panel';
        panel.innerHTML = `
            <div class="nuke-panel-header">
                <div class="nuke-header-item left">
                    <button class="nuke-close-button" aria-label="关闭"><svg viewBox="0 0 24 24"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg></button>
                </div>
                <h2 class="nuke-config-title">配置与记录</h2>
                <div class="nuke-header-item right"></div>
            </div>
            <div class="nuke-panel-content">
                <div class="nuke-config-tabs">
                    <button class="nuke-config-tab active" data-tab="settings">⚙️ 设置</button>
                    <button class="nuke-config-tab" data-tab="log">📓 拉黑记录</button>
                    <button class="nuke-config-tab" data-tab="whitelist">🛡️ 白名单</button>
                </div>
                <div id="nuke-settings-content" class="nuke-config-tab-content">
                    <div class="nuke-setting-item">
                        <label for="nuke-auto-block-toggle">自动拉黑可疑用户名</label>
                        <input type="checkbox" id="nuke-auto-block-toggle">
                    </div>
                    <div class="nuke-setting-item">
                        <label for="nuke-log-limit-input">拉黑记录最大条数 (0为不限制)</label>
                        <input type="number" id="nuke-log-limit-input" min="0" step="100">
                    </div>
                    <label class="nuke-settings-label" for="nuke-keywords-standard-textarea">用户名无差别关键词 (无视长度, 每行一条正则表达式)</label>
                    <textarea id="nuke-keywords-standard-textarea" class="nuke-config-textarea nuke-keywords-textarea" placeholder="例如: 💚(少妇|姐姐|妈妈|母狗|老师)💚"></textarea>
                    <label class="nuke-settings-label" for="nuke-keywords-long-textarea">长用户名关键词 (结合长度>25生效, 每行一个)</label>
                    <textarea id="nuke-keywords-long-textarea" class="nuke-config-textarea nuke-keywords-textarea" placeholder="例如: 骚|嫩|币|粉"></textarea>
                    <label class="nuke-settings-label" for="nuke-urls-textarea">自动拉黑生效的页面 URL (每行一条, 支持*通配符):</label>
                    <textarea id="nuke-urls-textarea" class="nuke-config-textarea nuke-url-textarea"></textarea>
                    <div class="nuke-config-button-container">
                        <button class="nuke-config-button save">保存设置</button>
                    </div>
                </div>
                <div id="nuke-log-content" class="nuke-config-tab-content hidden">
                    <input type="search" class="nuke-list-search" id="nuke-log-search" placeholder="搜索记录 (用户名, @handle, ID)...">
                    <div class="nuke-list"></div>
                </div>
                <div id="nuke-whitelist-content" class="nuke-config-tab-content hidden">
                    <input type="search" class="nuke-list-search" id="nuke-whitelist-search" placeholder="搜索白名单 (用户名, @handle, ID)...">
                    <div class="nuke-list"></div>
                </div>
            </div>`;
        document.body.appendChild(panel);
        panel.querySelector('#nuke-auto-block-toggle').checked = config.autoBlockEnabled;
        panel.querySelector('#nuke-log-limit-input').value = config.blockLogLimit;
        panel.querySelector('#nuke-urls-textarea').value = (config.autoBlockUrls || []).join('\n');
        panel.querySelector('#nuke-keywords-long-textarea').value = (config.blockKeywords || []).join('\n');
        panel.querySelector('#nuke-keywords-standard-textarea').value = (config.blockKeywordsStandard || []).join('\n');

        const setActiveTab = (tabName) => {
            panel.querySelectorAll('.nuke-config-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
            panel.querySelectorAll('.nuke-config-tab-content').forEach(c => c.classList.toggle('hidden', c.id !== `nuke-${tabName}-content`));
        };
        panel.querySelectorAll('.nuke-config-tab').forEach(tab => tab.addEventListener('click', () => setActiveTab(tab.dataset.tab)));
        panel.querySelector('.nuke-close-button').addEventListener('click', () => panel.remove());
        panel.querySelector('.nuke-config-button.save').addEventListener('click', async () => {
            config.autoBlockEnabled = panel.querySelector('#nuke-auto-block-toggle').checked;
            config.blockLogLimit = parseInt(panel.querySelector('#nuke-log-limit-input').value, 10) || 500;
            config.autoBlockUrls = panel.querySelector('#nuke-urls-textarea').value.split('\n').map(url => url.trim()).filter(Boolean);
            config.blockKeywords = panel.querySelector('#nuke-keywords-long-textarea').value.split('\n').map(kw => kw.trim()).filter(Boolean);
            config.blockKeywordsStandard = panel.querySelector('#nuke-keywords-standard-textarea').value.split('\n').map(kw => kw.trim()).filter(Boolean);
            await saveConfig(config);
            showToast('nuke-config-toast', '设置已更新', '配置已成功保存', 3000);
        });
        panel.querySelector('#nuke-log-search').addEventListener('input', renderListsInPanel);
        panel.querySelector('#nuke-whitelist-search').addEventListener('input', renderListsInPanel);
        await renderListsInPanel();
    } finally { setTimeout(() => { isConfigPanelBusy = false; }, 200); }
}
async function renderListsInPanel() {
    const userData = await loadUserData();
    if (!userData) return;
    const logSearchTerm = document.getElementById('nuke-log-search')?.value.toLowerCase() || '';
    const whitelistSearchTerm = document.getElementById('nuke-whitelist-search')?.value.toLowerCase() || '';
    const filterUsers = (user, term) => {
        if (!term) return true;
        const userId = String(user.userId || '');
        const screenName = user.screenName?.toLowerCase() || '';
        const userNameText = user.userNameText?.toLowerCase() || '';
        return userId.includes(term) || screenName.includes(term) || userNameText.includes(term);
    };
    const renderList = (containerSelector, list, type) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const searchTerm = type === 'log' ? logSearchTerm : whitelistSearchTerm;
        const filteredList = list.filter(user => filterUsers(user, searchTerm));
        container.innerHTML = '';
        if (filteredList.length === 0) {
            const message = searchTerm ? '没有找到匹配的用户' : (type === 'log' ? '暂无拉黑记录' : '白名单为空');
            container.innerHTML = `<p style="color:#8899a6;text-align:center;padding:20px 0;">${message}</p>`;
            return;
        }
        filteredList.slice().reverse().forEach(entry => {
            const el = document.createElement('div');
            el.className = 'nuke-list-entry';
            const userName = entry.userNameText || entry.screenName || String(entry.userId);
            const screenNameHandle = entry.screenName ? `@${entry.screenName}` : '';
            const userLinkHTML = entry.screenName ? `<a href="https://x.com/${entry.screenName}" target="_blank" rel="noopener noreferrer" title="在新标签页中打开"><span class="nuke-list-user-name">${userName}</span></a>` : `<span class="nuke-list-user-name">${userName}</span>`;
            if (type === 'log') {
                const timestamp = entry.blockTimestamp ? new Date(entry.blockTimestamp).toLocaleString() : '未知时间';
                el.innerHTML = `<div class="nuke-list-user-info">${userLinkHTML}<span class="nuke-list-user-handle" title="移至白名单并取消拉黑">${screenNameHandle}</span></div><span class="nuke-list-actions" title="从记录中移除">${timestamp}</span>`;
                if (entry.screenName) {
                    el.querySelector('.nuke-list-user-handle')?.addEventListener('click', () => moveUser(entry, 'logToWhitelist'));
                } else {
                    const userNameEl = el.querySelector('.nuke-list-user-name');
                    if (userNameEl) {
                        userNameEl.style.cursor = 'pointer';
                        userNameEl.title = '移至白名单并取消拉黑';
                        userNameEl.addEventListener('click', () => moveUser(entry, 'logToWhitelist'));
                    }
                }
                el.querySelector('.nuke-list-actions')?.addEventListener('click', () => moveUser(entry, 'removeFromLog'));
            } else {
                el.innerHTML = `<div class="nuke-list-user-info">${userLinkHTML}<span class="nuke-list-user-handle">${screenNameHandle}</span></div><span class="nuke-list-actions" title="从白名单中移除">移除</span>`;
                el.querySelector('.nuke-list-actions')?.addEventListener('click', () => moveUser(entry, 'removeFromWhitelist'));
            }
            container.appendChild(el);
        });
    };
    renderList('#nuke-log-content .nuke-list', userData.blockedLog, 'log');
    renderList('#nuke-whitelist-content .nuke-list', userData.whitelist, 'whitelist');
}
async function moveUser(user, action) {
    const userData = await loadUserData();
    if (!userData) return;
    const logIndex = userData.blockedLog.findIndex(u => u.userId === user.userId);
    const whitelistIndex = userData.whitelist.findIndex(u => u.userId === user.userId);
    let success = false;
    try {
        if (action === 'logToWhitelist') {
            if (logIndex > -1) {
                await unblockUserById(user.userId);
                const [movedUser] = userData.blockedLog.splice(logIndex, 1);
                if (whitelistIndex === -1) userData.whitelist.push(movedUser);
                success = true;
            }
        } else if (action === 'removeFromLog') {
            if (logIndex > -1) { userData.blockedLog.splice(logIndex, 1); success = true; }
        } else if (action === 'removeFromWhitelist') {
            if (whitelistIndex > -1) { userData.whitelist.splice(whitelistIndex, 1); success = true; }
        }
        if(success) {
            await saveUserData(userData);
            await renderListsInPanel();
        }
    } catch(err) {
        console.error(`[CB] ${action} failed for ${user.screenName || user.userId}:`, err);
        showToast('nuke-feedback-toast', '❌ 操作失败', `无法为 @${user.screenName || user.userId} 执行操作`, 4000);
    }
}

// --- API & HELPERS ---
const API_ENDPOINTS = {
    UserByScreenName: { hash: 'jUKA--0QkqGIFhmfRZdWrQ', features: {"responsive_web_grok_bio_auto_translation_is_enabled":false,"hidden_profile_subscriptions_enabled":true,"payments_enabled":false,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"verified_phone_label_enabled":false,"subscriptions_verification_info_is_identity_verified_enabled":true,"subscriptions_verification_info_verified_since_enabled":true,"highlights_tweets_tab_ui_enabled":true,"responsive_web_twitter_article_notes_tab_enabled":true,"subscriptions_feature_can_gift_premium":true,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true} },
    UserByRestId: { hash: 'tD4_0f_p354q1Yin156s2Q', features: {"responsive_web_grok_bio_auto_translation_is_enabled":false,"hidden_profile_subscriptions_enabled":true,"payments_enabled":false,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"verified_phone_label_enabled":false,"subscriptions_verification_info_is_identity_verified_enabled":true,"subscriptions_verification_info_verified_since_enabled":true,"highlights_tweets_tab_ui_enabled":true,"responsive_web_twitter_article_notes_tab_enabled":true,"subscriptions_feature_can_gift_premium":true,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true} },
    Retweeters: { hash: 'DmC_H6eV_XMiL0g4ltJvpg', features: {"rweb_video_screen_enabled":false,"payments_enabled":false,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"premium_content_api_read_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"responsive_web_grok_analyze_button_fetch_trends_enabled":false,"responsive_web_grok_analyze_post_followups_enabled":true,"responsive_web_jetfuel_frame":false,"responsive_web_grok_share_attachment_enabled":true,"articles_preview_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"responsive_web_grok_show_grok_translated_post":false,"responsive_web_grok_analysis_button_from_backend":false,"creator_subscriptions_quote_tweet_preview_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_grok_image_annotation_enabled":true,"responsive_web_enhance_cards_enabled":false} },
    TweetDetail: { hash: '-0WTL1e9Pij-JWAF5ztCCA', features: {"rweb_video_screen_enabled":false,"payments_enabled":false,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"premium_content_api_read_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"responsive_web_grok_analyze_button_fetch_trends_enabled":false,"responsive_web_grok_analyze_post_followups_enabled":true,"responsive_web_jetfuel_frame":false,"responsive_web_grok_share_attachment_enabled":true,"articles_preview_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"responsive_web_grok_show_grok_translated_post":false,"responsive_web_grok_analysis_button_from_backend":false,"creator_subscriptions_quote_tweet_preview_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_grok_image_annotation_enabled":true,"responsive_web_enhance_cards_enabled":false} }
};
function makeApiRequest(url, method = "GET", data = null) { return new Promise((resolve, reject) => GM_xmlhttpRequest({ method, url, data, headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-Type": "application/x-www-form-urlencoded", "x-csrf-token": getCsrfToken() }, onload: r => r.status >= 200 && r.status < 300 ? resolve(r.responseText ? JSON.parse(r.responseText) : null) : reject({ message: `API请求失败: ${r.status}`, status: r.status }), onerror: e => reject({ message: "Network or script error", error: e }) })); }
function getCsrfToken() { const e = document.cookie.split("; ").find(e => e.startsWith("ct0=")); return e ? e.split("=")[1] : null; }
function getAuthToken() { return "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"; }
async function getUserDataByScreenName(screenName) {
    const endpoint = API_ENDPOINTS.UserByScreenName;
    const url = `https://x.com/i/api/graphql/${endpoint.hash}/UserByScreenName?variables=${encodeURIComponent(JSON.stringify({screen_name:screenName,withSafetyModeUserFields:true}))}&features=${encodeURIComponent(JSON.stringify(endpoint.features))}`;
    const data = await makeApiRequest(url);
    if (data?.data?.user?.result) return data.data.user.result;
    throw new Error(`无法找到用户 @${screenName} 的数据`);
}
async function getUserDataById(userId) {
    const endpoint = API_ENDPOINTS.UserByRestId;
    const url = `https://x.com/i/api/graphql/${endpoint.hash}/UserByRestId?variables=${encodeURIComponent(JSON.stringify({userId,withSafetyModeUserFields:true}))}&features=${encodeURIComponent(JSON.stringify(endpoint.features))}`;
    const data = await makeApiRequest(url);
    if (data?.data?.user?.result) return data.data.user.result;
    throw new Error(`无法找到用户 ID: ${userId} 的数据`);
}
async function getRetweetersData(tweetId, onProgress) {
    let users = new Map(), cursor = null, endpoint = API_ENDPOINTS.Retweeters;
    do {
        onProgress(`正在获取转推列表...(已找到: ${users.size})`);
        const url = `https://x.com/i/api/graphql/${endpoint.hash}/Retweeters?variables=${encodeURIComponent(JSON.stringify({tweetId,count:100,cursor,includePromotedContent:true}))}&features=${encodeURIComponent(JSON.stringify(endpoint.features))}`;
        const data = await makeApiRequest(url);
        const entries = data?.data?.retweeters_timeline?.timeline?.instructions?.find(i=>i.type==='TimelineAddEntries')?.entries;
        if (!entries) break;
        let foundNewUsers = false;
        for (const entry of entries) {
            if (entry.entryId.startsWith('user-')) {
                const userResult = entry.content?.itemContent?.user_results?.result;
                if (userResult?.rest_id && !users.has(userResult.rest_id)) { users.set(userResult.rest_id, userResult); foundNewUsers = true; }
            } else if (entry.entryId.startsWith('cursor-bottom-')) { cursor = entry.content.value; }
        }
        if (!foundNewUsers || !cursor) break;
    } while (cursor);
    return Array.from(users.values());
}
async function getRepliersData(tweetId, onProgress) {
    let users = new Map(), cursor = null, endpoint = API_ENDPOINTS.TweetDetail;
    const baseVariables = {"with_rux_injections":false,"includePromotedContent":true,"withCommunity":true,"withQuickPromoteEligibilityTweetFields":true,"withBirdwatchNotes":true,"withVoice":true,"withV2Timeline":true};
    do {
        onProgress(`正在获取回复列表...(已找到: ${users.size})`);
        const variables = {...baseVariables, focalTweetId: tweetId, cursor, count: 40, rankingMode:"Relevance"};
        const url = `https://x.com/i/api/graphql/${endpoint.hash}/TweetDetail?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(endpoint.features))}`;
        const data = await makeApiRequest(url);
        const instructions = data?.data?.threaded_conversation_with_injections_v2?.instructions || [];
        const entriesInstruction = instructions.find(i => i.type === 'TimelineAddEntries');
        const entries = entriesInstruction?.entries;
        if (!entries) break;
        let nextCursor = null;
        let foundNewUsersInPage = false;
        for (const entry of entries) {
            if (entry.entryId.startsWith('conversationthread-')) {
                const threadItems = entry.content?.items;
                if(threadItems && Array.isArray(threadItems)){
                    for(const item of threadItems){
                        const userResult = item.item?.itemContent?.tweet_results?.result?.core?.user_results?.result;
                        if (userResult?.rest_id && !users.has(userResult.rest_id)) {
                            users.set(userResult.rest_id, userResult);
                            foundNewUsersInPage = true;
                        }
                    }
                }
            } else if (entry.entryId.startsWith('tweet-')) {
                const userResult = entry.content?.itemContent?.tweet_results?.result?.core?.user_results?.result;
                if (userResult?.rest_id && !users.has(userResult.rest_id)) {
                   users.set(userResult.rest_id, userResult);
                   foundNewUsersInPage = true;
                }
            } else if (entry.entryId.startsWith('cursor-bottom-')) {
                nextCursor = entry.content.value;
            }
        }
        if (cursor === nextCursor || !foundNewUsersInPage) break;
        cursor = nextCursor;
    } while (cursor);
    return Array.from(users.values());
}
async function blockUserById(userId) { return makeApiRequest("https://x.com/i/api/1.1/blocks/create.json", "POST", `user_id=${userId}`); }
async function unblockUserById(userId) { return makeApiRequest("https://x.com/i/api/1.1/blocks/destroy.json", "POST", `user_id=${userId}`); }

// --- DATA & QUEUE MANAGEMENT ---
async function loadUserData() {
    if (!currentUserId) return null;
    const allData = await GM_getValue(STORAGE_KEY, {});
    let userData = allData[currentUserId];
    if (!userData || typeof userData !== 'object') userData = { queue: [], blockedLog: [], whitelist: [] };
    if (!Array.isArray(userData.queue)) userData.queue = [];
    if (!Array.isArray(userData.blockedLog)) userData.blockedLog = [];
    if (!Array.isArray(userData.whitelist)) userData.whitelist = [];
    return { ...userData, lastBlockTimestamp: 0 };
}
async function saveUserData(data) {
    if (!currentUserId) return;
    const allData = await GM_getValue(STORAGE_KEY, {});
    allData[currentUserId] = data;
    await GM_setValue(STORAGE_KEY, allData);
}

// --- UI & FEEDBACK ---
function showToast(id, title, status, duration = null) {
    let toast = document.getElementById(id);
    if (!toast) {
        toast = document.createElement('div');
        toast.id = id;
        toast.className = 'nuke-toast';
        document.body.appendChild(toast);
    }
    const existingToasts = document.querySelectorAll('.nuke-toast:not([style*="display: none"])');
    toast.style.top = `${20 + (existingToasts.length - 1) * 70}px`;
    toast.classList.remove('fading-out');
    toast.innerHTML = `<div class="nuke-toast-title">${title}</div><div class="nuke-toast-status">${status}</div>`;
    const reorderToasts = () => {
        const remainingToasts = Array.from(document.querySelectorAll('.nuke-toast')).filter(t => t.id !== id);
        remainingToasts.forEach((t, index) => {
            t.style.top = `${20 + index * 70}px`;
        });
    };
    if (duration) {
        setTimeout(() => {
            toast.classList.add('fading-out');
            setTimeout(() => {
                toast.remove();
                reorderToasts();
            }, 500);
        }, duration);
    }
}
async function updateStatusToast() {
    const userData = await loadUserData();
    if (!userData || userData.queue.length === 0) {
        let toast = document.getElementById('nuke-status-toast');
        if (toast) { toast.classList.add('fading-out'); setTimeout(() => toast.remove(), 500); }
        return;
    }
    showToast('nuke-status-toast', `🚀 九族拉黑队列(@${currentUserScreenName||'...'})`, `<b>待处理:</b> ${userData.queue.length}<br><b>已拉黑:</b> ${userData.blockedLog.length || 0}`);
}
function hideElement(element) {
    if (!element) return;
    element.style.cssText += 'transition:all .4s ease-out;max-height:0;opacity:0;padding:0;margin:0;border-width:0;';
    setTimeout(() => element.remove(), 400);
}

// --- CORE LOGIC ---
async function processQueue() {
    if (isProcessingQueue || !currentUserId) return;
    const userData = await loadUserData();
    if (!userData || userData.queue.length === 0 || (Date.now() - userData.lastBlockTimestamp < BLOCK_INTERVAL_MS)) return;
    isProcessingQueue = true;
    let userToBlock = userData.queue[0];
    try {
        if (!userToBlock.screenName || !userToBlock.userNameText) {
            try {
                const fullUserData = await getUserDataById(userToBlock.userId);
                userToBlock.screenName = fullUserData.core?.screen_name || fullUserData.legacy?.screen_name;
                userToBlock.userNameText = fullUserData.core?.name || fullUserData.legacy?.name;
            } catch (fetchError) {
                console.warn(`[CB] 获取用户 ${userToBlock.userId} 的详细信息失败，将使用现有数据继续。`, fetchError);
            }
        }
        await blockUserById(userToBlock.userId);
        userData.queue.shift();
        userData.blockedLog.push({ ...userToBlock, blockTimestamp: Date.now() });
        const limit = scriptConfig.blockLogLimit || 500;
        if (limit > 0) { while (userData.blockedLog.length > limit) userData.blockedLog.shift(); }
        userData.lastBlockTimestamp = Date.now();
    } catch (error) {
        console.error(`[Chain Blocker] 拉黑 @${userToBlock.screenName || userToBlock.userId} 失败，移除.`, error);
        userData.queue.shift();
    } finally {
        await saveUserData(userData);
        await updateStatusToast();
        isProcessingQueue = false;
    }
}
function getExemptHandles() {
    const exemptHandles = [];
    const pathParts = window.location.pathname.split('/');
    if (pathParts[2] === 'status') {
        exemptHandles.push(pathParts[1]);
    }
    return exemptHandles;
}
async function initiateNukeProcess(targetArticle) {
    const exemptHandles = getExemptHandles();
    showToast('nuke-fetch-toast', '🚀 九族拉黑已启动', '正在处理...', null);
    hideElement(targetArticle);
    try {
        const userLink = targetArticle.querySelector('div[data-testid="User-Name"] a[role="link"]');
        const authorHandle = userLink?.href.split('/').pop();
        const authorUserNameText = targetArticle.querySelector('div[data-testid="User-Name"] a[role="link"] span')?.textContent?.trim() || authorHandle;
        if (!authorHandle) throw new Error("无法确定作者 handle");
        const userData = await loadUserData();
        if (!userData) throw new Error("无法加载用户数据");
        const whitelistIds = new Set(userData.whitelist.map(u => u.userId));
        let authorId = null;
        try {
            const authorData = await getUserDataByScreenName(authorHandle);
            authorId = authorData?.rest_id;
            if (!authorId) throw new Error(`无法获取 @${authorHandle} 的用户ID`);
            if (whitelistIds.has(authorId) || exemptHandles.includes(authorHandle)) {
                showToast('nuke-fetch-toast', '🛡️ 用户在白名单或豁免列表', `已跳过拉黑 @${authorHandle}`, 4000);
            } else {
                await blockUserById(authorId);
                userData.blockedLog.push({ userId: authorId, screenName: authorHandle, userNameText: authorUserNameText, blockTimestamp: Date.now() });
                const limit = scriptConfig.blockLogLimit || 500;
                if (limit > 0) { while (userData.blockedLog.length > limit) userData.blockedLog.shift(); }
                await saveUserData(userData);
                showToast('nuke-fetch-toast', '✅ 作者已拉黑并记录', `已立刻拉黑 @${authorHandle}`, 2000);
            }
        } catch (authorError) { console.error(`[CB] 拉黑作者 @${authorHandle} 失败:`, authorError); }
        const tweetId = Array.from(targetArticle.querySelectorAll('a')).find(a=>a.href.includes('/status/'))?.href.match(/\/status\/(\d+)/)?.[1];
        if (!tweetId) return;
        const [retweeters, repliers] = await Promise.all([
            getRetweetersData(tweetId, status => showToast('nuke-fetch-toast', '收集中...', status, null)),
            getRepliersData(tweetId, status => showToast('nuke-fetch-toast', '收集中...', status, null))
        ]);
        const combinedUsers = new Map();
        [...retweeters, ...repliers].forEach(u => u.rest_id && combinedUsers.set(u.rest_id, u));
        if (authorId) combinedUsers.delete(authorId);
        const existingUserIds = new Set([...userData.queue.map(u=>u.userId), ...userData.blockedLog.map(u=>u.userId), ...whitelistIds]);
        const newUsersToQueue = Array.from(combinedUsers.values()).map(u => ({
            userId: u.rest_id,
            screenName: u.core?.screen_name || u.legacy?.screen_name,
            userNameText: u.core?.name || u.legacy?.name
        })).filter(u => u.userId && u.userId !== currentUserId && !existingUserIds.has(u.userId) && !exemptHandles.includes(u.screenName));
        if (newUsersToQueue.length > 0) {
            userData.queue.push(...newUsersToQueue);
            await saveUserData(userData);
            showToast('nuke-fetch-toast', '✅ 操作成功', `已将 ${newUsersToQueue.length} 个相关用户加入拉黑队列。`, 4000);
        } else {
            showToast('nuke-fetch-toast', 'ℹ️ 操作完成', `没有找到新的可拉黑用户。`, 4000);
        }
        await updateStatusToast();
        setTimeout(processQueue, 1000);
    } catch (error) { console.error("[CB] 收集过程中发生错误:", error); showToast(`nuke-fetch-toast`, '❌ 发生错误', error.message, 5000); }
}

// --- UI SCANNING & AUTOMATION ---
function isUrlMatch(url, patterns) { return patterns.some(p => new RegExp('^' + p.replace(/\*/g, '.*') + '$').test(url)); }
function getUsernameFromElement(element) {
    if (!element) return null;
    const clone = element.cloneNode(true);
    clone.querySelectorAll('img[alt]').forEach(img => {
        img.replaceWith(document.createTextNode(img.alt));
    });
    return clone.textContent.trim();
}
function scanAndProcessContent() {
    document.querySelectorAll('div[data-testid="cellInnerDiv"]:not([style*="display: none"]) button[data-testid$="-unblock"]').forEach(btn => btn.closest('div[data-testid="cellInnerDiv"]').style.display = 'none');
    if (!currentUserId || !scriptConfig.autoBlockEnabled || !isUrlMatch(window.location.href, scriptConfig.autoBlockUrls)) return;
    const checkUserName = (userNameText) => {
        if (!userNameText) return false;
        // Rule 1: Standard Keywords (no length check, regex)
        const standardKeywords = scriptConfig.blockKeywordsStandard || [];
        if (standardKeywords.length > 0) {
            const matchesStandard = standardKeywords.some(pattern => {
                if (!pattern) return false;
                try {
                    return new RegExp(pattern).test(userNameText);
                } catch (e) {
                    console.warn(`[CB] Invalid regex in standard keywords: "${pattern}"`, e);
                    return false;
                }
            });
            if (matchesStandard) return true;
        }
        // Abort if not a long username
        if (userNameText.length <= USERNAME_LENGTH_THRESHOLD) {
            return false;
        }
        // Rule 2: Long Username Checks
        // 2a. Structure check (Chinese chars + slashes)
        const hasChinese = /[\u4e00-\u9fa5]/.test(userNameText);
        const slashCount = (userNameText.match(/\//g) || []).length;
        if (hasChinese && slashCount >= 2) {
            return true;
        }
        // 2b. Long-name keywords check
        const longNameKeywords = scriptConfig.blockKeywords || [];
        if (longNameKeywords.length > 0) {
            const matchesLong = longNameKeywords.some(pattern => {
                if (!pattern) return false;
                try {
                    return new RegExp(pattern).test(userNameText);
                } catch (e) {
                    console.warn(`[CB] Invalid regex in long-name keywords: "${pattern}"`, e);
                    return false;
                }
            });
            if (matchesLong) return true;
        }
        return false;
    };
    document.querySelectorAll('article[data-testid="tweet"]:not([data-autoblock-checked])').forEach(article => {
        article.dataset.autoblockChecked = 'true';
        const nameElement = article.querySelector('div[data-testid="User-Name"] a[role="link"] > div > div:first-child');
        const userNameText = getUsernameFromElement(nameElement);
        if (checkUserName(userNameText)) {
            initiateNukeProcess(article);
        }
    });
    document.querySelectorAll('div[data-testid="UserCell"]:not([data-autoblock-checked])').forEach(cell => {
        cell.dataset.autoblockChecked = 'true';
        const nameElement = cell.querySelector('a[role="link"] div[dir="ltr"]');
        const userNameText = getUsernameFromElement(nameElement);
        if (checkUserName(userNameText)) {
            const screenName = cell.querySelector('a[role="link"] span')?.textContent.trim() || '';
            if (screenName) {
                showToast(`nuke-auto-trigger-toast-${Date.now()}`, '🤖 自动执行拉黑', `检测到可疑用户名: ${screenName}`, 4000);
                initiateNukeProcess(cell.closest('div[data-testid="cellInnerDiv"]'));
            }
        }
    });
}
function addNukeButton(menuNode) {
    if (menuNode.querySelector('.nuke-button')) return;
    const blockMenuItem = Array.from(menuNode.querySelectorAll('div[role="menuitem"]')).find(el => el.textContent.includes('@'));
    if (!blockMenuItem) return;
    const nukeButton = blockMenuItem.cloneNode(true);
    nukeButton.classList.add('nuke-button');
    const span = nukeButton.querySelector('span');
    if (span) {
        span.textContent = MENU_ITEM_TEXT;
        span.style.color = 'rgb(244, 33, 46)';
    }
    const biohazardIconPath = "M19.5,12c0,2.9-1.6,5.5-4,6.8V21h-7v-2.2c-2.4-1.3-4-3.9-4-6.8c0-4.1,3.4-7.5,7.5-7.5S19.5,7.9,19.5,12z M12,6c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,6,12,6z M12,14c-1.1,0-2-0.9-2-2c0-0.4,0.1-0.7,0.3-1H10v-2h1.3c-0.2-0.3-0.3-0.6-0.3-1c0-1.1,0.9-2,2-2s2,0.9,2,2c0,0.4-0.1,0.7-0.3,1H14v2h-1.3c0.2,0.3,0.3,0.6,0.3,1C14,13.1,13.1,14,12,14z";
    const svgIcon = nukeButton.querySelector('svg');
    if (svgIcon) {
        svgIcon.innerHTML = `<g><path d="${biohazardIconPath}" fill="currentColor"></path></g>`;
        svgIcon.style.color = 'rgb(244, 33, 46)';
    }
    nukeButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('div[data-testid="Dropdown"]')?.parentElement.remove();
        if (activeTweetArticle) initiateNukeProcess(activeTweetArticle);
    });
    const separator = document.createElement('div');
    separator.setAttribute('role', 'separator');
    separator.style.cssText = 'border-bottom:1px solid rgb(56,68,77);margin:4px 0;';
    blockMenuItem.after(separator, nukeButton);
}
function addVerificationButton(menuNode) {
    if (menuNode.querySelector('.nuke-verify-button')) return;
    const nukeButton = menuNode.querySelector('.nuke-button');
    if (!nukeButton) return;
    const verifyButton = nukeButton.cloneNode(true);
    verifyButton.classList.remove('nuke-button');
    verifyButton.classList.add('nuke-verify-button');
    const span = verifyButton.querySelector('span');
    if (span) {
        span.textContent = "🔍 验证用户名";
        span.style.color = 'rgb(29, 155, 240)';
    }
    const svgIcon = verifyButton.querySelector('svg');
    if (svgIcon) {
        const searchIconPath = "M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.62 0 3.1-.59 4.25-1.57l3.44 3.44c.29.29.77.29 1.06 0s.29-.77 0-1.06l-3.44-3.44c.98-1.15 1.57-2.63 1.57-4.25 0-3.59-2.91-6.5-6.5-6.5zm-6.5 1.5c2.69 0 4.9 2.21 4.9 4.9s-2.21 4.9-4.9 4.9-4.9-2.21-4.9-4.9 2.21-4.9 4.9-4.9z";
        svgIcon.innerHTML = `<g><path d="${searchIconPath}" fill="currentColor"></path></g>`;
        svgIcon.style.color = 'rgb(29, 155, 240)';
    }
    verifyButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('div[data-testid="Dropdown"]')?.parentElement.remove();
        if (activeTweetArticle) {
            const nameElement = activeTweetArticle.querySelector('div[data-testid="User-Name"] a[role="link"] > div > div:first-child');
            const userNameText = getUsernameFromElement(nameElement);
            if (userNameText) {
                prompt(" scraper 获取到的用户名 (可复制此内容用于关键词设置):", userNameText);
            } else {
                alert("无法从此推文获取用户名。");
            }
        }
    });
    nukeButton.before(verifyButton);
}


// --- INITIALIZATION & EXECUTION ---
async function initialize() {
    console.log("[Chain Blocker] Initializing...");
    await loadConfig();
    updateMenuCommands();
    const profileLink = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
    if (!profileLink) { setTimeout(initialize, 500); return; }
    try {
        const screenName = profileLink.href.split('/').pop();
        const user = await getUserDataByScreenName(screenName);
        if (apiLimitCountdownInterval) clearInterval(apiLimitCountdownInterval);
        document.getElementById('nuke-api-limit-toast')?.remove();
        currentUserId = user.rest_id;
        currentUserScreenName = user.legacy.screen_name;
        console.log(`[Chain Blocker] Initialized for @${currentUserScreenName}(ID: ${currentUserId}).`);
        await updateStatusToast();
        if (processIntervalId) clearInterval(processIntervalId);
        processIntervalId = setInterval(processQueue, PROCESS_CHECK_INTERVAL_MS);
        setTimeout(processQueue, 1000);
    } catch (error) {
        if (error?.status === 429) {
            console.warn(`[CB] API rate limit hit. Retrying in ${API_RETRY_DELAY_MS / 60000} minutes.`);
            showToast('nuke-api-limit-toast', 'API 已达上限', '正在计算时间...', null);
            const retryTimestamp = Date.now() + API_RETRY_DELAY_MS;
            apiLimitCountdownInterval = setInterval(() => {
                const toastStatusEl = document.querySelector('#nuke-api-limit-toast .nuke-toast-status');
                if (!toastStatusEl) { clearInterval(apiLimitCountdownInterval); return; }
                const secondsLeft = Math.round((retryTimestamp - Date.now()) / 1000);
                if (secondsLeft <= 0) { toastStatusEl.innerHTML = '正在重试...'; clearInterval(apiLimitCountdownInterval); return; }
                toastStatusEl.innerHTML = `将在 <b>${String(Math.floor(secondsLeft/60)).padStart(2,'0')}:${String(secondsLeft%60).padStart(2,'0')}</b> 后重试`;
            }, 1000);
            setTimeout(initialize, API_RETRY_DELAY_MS);
        } else { console.error("[CB] Initialization failed.", error); }
    }
}
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const menu = node.matches('div[role="menu"]') ? node : node.querySelector('div[role="menu"]');
                    if (menu) {
                        addNukeButton(menu);
                        addVerificationButton(menu);
                    }
                }
            });
        }
    }
});
document.addEventListener('click', e => {
    const optionsButton = e.target.closest('button[data-testid="caret"]');
    if (optionsButton) activeTweetArticle = optionsButton.closest('article[data-testid="tweet"]');
}, true);
observer.observe(document.body, { childList: true, subtree: true });
setInterval(scanAndProcessContent, AUTO_SCAN_INTERVAL_MS);
initialize();
})();
