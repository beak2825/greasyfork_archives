// ==UserScript==
// @name         Steam Key Helper
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  try to take over the world!
// @icon         http://store.steampowered.com/favicon.ico
// @author       Bisumaruko
// @include      http*://*
// @exclude      http*://*dailyindiegame.com/account_createtrade.html
// @exclude      http*://steam.depar.me/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.0.6/sweetalert2.min.js
// @resource     SweetAlert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.0.6/sweetalert2.min.css
// @connect      store.steampowered.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/32818/Steam%20Key%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/32818/Steam%20Key%20Helper.meta.js
// ==/UserScript==

/* global swal, g_AccountID, g_sessionID, g_oSuggestParams */

// setup jQuery
const $ = jQuery.noConflict(true);

// inject CSS
GM_addStyle(`
    ${GM_getResourceText('SweetAlert2CSS')}

    .hide { display: none; }
    .SKH_processed { color: #57bae8; cursor: pointer; }
    .SKH_processed:hover { text-decoration: underline; }
    .SKH_activated { text-decoration: line-through; }
    .SKH_panel {
        width: 60px;
        height: 60px;
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background-color: rgb(87, 186, 232);
        opacity: 0.5;
        text-align: center;
    }
    .SKH_panel:hover { opacity: 1; }
    .SKH_panel .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 24px;
        margin-top: 5px;
    }
    .SKH_panel .switch input { display: none; }
    .SKH_panel .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
    }
    .SKH_panel .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
    }
    .SKH_panel input:checked + .slider { background-color: #2196F3; }
    .SKH_panel input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
    .SKH_panel input:checked + .slider:before { transform: translateX(16px); }
    .SKH_panel > span { display: inline-block; cursor: pointer; color: white; }
    .SKH_panel > button {
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: 0;
        padding: 2px;
        background-color: transparent;
        background-size: 18px;
        background-repeat: no-repeat;
        background-origin: padding-box;
        background-position: 50% 50%;
        border: none;
        outline: none;
        box-sizing: border-box;
        cursor: pointer;
    }
    .SKH_panel > .hidePanel {
        left: 0;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9InN2ZzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgaWQ9ImJhY2tncm91bmQiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMzIiIHdpZHRoPSIzMiIvPjwvZz48ZyBpZD0iY2FuY2VsIj48cG9seWdvbiBwb2ludHM9IjIsMjYgNiwzMCAxNiwyMCAyNiwzMCAzMCwyNiAyMCwxNiAzMCw2IDI2LDIgMTYsMTIgNiwyIDIsNiAxMiwxNiAgIi8+PC9nPjwvc3ZnPg==);
        filter: opacity(60%);
    }
    .SKH_panel > .disable {
        left: 20px;
        background-size: contain;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGc+PHBhdGggZD0iTTEyLDRjNC40LDAsOCwzLjYsOCw4cy0zLjYsOC04LDhzLTgtMy42LTgtOFM3LjYsNCwxMiw0IE0xMiwyQzYuNSwyLDIsNi41LDIsMTJjMCw1LjUsNC41LDEwLDEwLDEwczEwLTQuNSwxMC0xMCAgIEMyMiw2LjUsMTcuNSwyLDEyLDJMMTIsMnoiLz48L2c+PGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIgeDE9IjE4LjIiIHgyPSI1LjgiIHkxPSIxOC4yIiB5Mj0iNS44Ii8+PC9zdmc+);
        filter: opacity(60%);
    }
    .SKH_panel > .settings {
        left: 40px;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9ImNvZyI+PHBhdGggZD0iTTMyLDE3Ljk2OXYtNGwtNC43ODEtMS45OTJjLTAuMTMzLTAuMzc1LTAuMjczLTAuNzM4LTAuNDQ1LTEuMDk0bDEuOTMtNC44MDVMMjUuODc1LDMuMjUgICBsLTQuNzYyLDEuOTYxYy0wLjM2My0wLjE3Ni0wLjczNC0wLjMyNC0xLjExNy0wLjQ2MUwxNy45NjksMGgtNGwtMS45NzcsNC43MzRjLTAuMzk4LDAuMTQxLTAuNzgxLDAuMjg5LTEuMTYsMC40NjlsLTQuNzU0LTEuOTEgICBMMy4yNSw2LjEyMWwxLjkzOCw0LjcxMUM1LDExLjIxOSw0Ljg0OCwxMS42MTMsNC43MDMsMTIuMDJMMCwxNC4wMzF2NGw0LjcwNywxLjk2MWMwLjE0NSwwLjQwNiwwLjMwMSwwLjgwMSwwLjQ4OCwxLjE4OCAgIGwtMS45MDIsNC43NDJsMi44MjgsMi44MjhsNC43MjMtMS45NDVjMC4zNzksMC4xOCwwLjc2NiwwLjMyNCwxLjE2NCwwLjQ2MUwxNC4wMzEsMzJoNGwxLjk4LTQuNzU4ICAgYzAuMzc5LTAuMTQxLDAuNzU0LTAuMjg5LDEuMTEzLTAuNDYxbDQuNzk3LDEuOTIybDIuODI4LTIuODI4bC0xLjk2OS00Ljc3M2MwLjE2OC0wLjM1OSwwLjMwNS0wLjcyMywwLjQzOC0xLjA5NEwzMiwxNy45Njl6ICAgIE0xNS45NjksMjJjLTMuMzEyLDAtNi0yLjY4OC02LTZzMi42ODgtNiw2LTZzNiwyLjY4OCw2LDZTMTkuMjgxLDIyLDE1Ljk2OSwyMnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PC9nPjwvc3ZnPg==);
    }

    .SKH_settings .name { text-align: right; vertical-align: top; white-space: nowrap; }
    .SKH_settings .value { text-align: left; }
    .SKH_settings .value > * { height: 30px; margin: 0 20px 10px; }
    .SKH_settings .switch { position: relative; display: inline-block; width: 60px; }
    .SKH_settings .switch input { display: none; }
    .SKH_settings .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
    }
    .SKH_settings .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
    }
    .SKH_settings input:checked + .slider { background-color: #2196F3; }
    .SKH_settings input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
    .SKH_settings input:checked + .slider:before { transform: translateX(30px); }
    .SKH_settings input[type=text] { width: 200px; }
    .SKH_settings input[type=number] { width: 60px; height: 30px; box-sizing: border-box; }
    .SKH_settings textarea { width: 200px; min-width: 200px; height: 60px; min-height: 60px; }
    .SKH_settings label + p { display: none; transition: display 1s; }
    .SKH_settings label ~ *:last-child { display: block; transition: display 1s; }
    .SKH_settings .toggleOn label + p { display: block; }
    .SKH_settings .toggleOn label ~ *:last-child { display: none; }
`);

// load config
const eol = "\n";
const has = Object.prototype.hasOwnProperty;

const regKey = /(?:(?:([A-Z0-9])(?!\1{4})){5}-){2,5}[A-Z0-9]{5}/g;
let activating = false;

const activated = JSON.parse(GM_getValue('SKH_activated') || '[]');
const currentActivated = [];
const config = {
    data: JSON.parse(GM_getValue('SKH_config') || '{}'),
    save() {
        GM_setValue('SKH_config', JSON.stringify(this.data));
    },
    set(key, value, callback = null) {
        this.data[key] = value;
        this.save();

        if (typeof callback === 'function') callback();
    },
    get(key) {
        return has.call(this.data, key) ? this.data[key] : null;
    },
    push(key, value) {
        if (Array.isArray(this.data[key])) {
            this.data[key].push(value);
            this.save();
        }
    },
    splice(key, start, count) {
        if (Array.isArray(this.data[key])) {
            this.data[key].splice(start, count);
            this.save();
        }
    },
    init() {
        if (!has.call(this.data, 'autoUpdateSessionID')) this.data.autoUpdateSessionID = true;
        if (!has.call(this.data, 'autoClosePopup')) this.data.autoClosePopup = false;
        if (!has.call(this.data, 'autoClosePopupTimer')) this.data.autoClosePopupTimer = 3;
        if (!has.call(this.data, 'autoReplyActivated')) this.data.autoReplyActivated = false;
        if (!has.call(this.data, 'enabledForever')) this.data.enabledForever = true;
        if (!has.call(this.data, 'enabled')) this.data.enabled = [];
        if (!has.call(this.data, 'disabled')) this.data.disabled = [];
        if (!has.call(this.data, 'hideForever')) this.data.hideForever = false;
        if (!has.call(this.data, 'hide')) this.data.hide = [];
        if (!has.call(this.data, 'off')) this.data.off = [];
    }
};

config.init();

// text
const i18n = {
    tchinese: {
        name: '繁體中文',
        updateSuccessTitle: '更新成功！',
        updateSuccess: '成功更新Steam sessionID',
        errorTitle: '糟糕！',
        errorUnexpected: '發生未知錯誤，請稍後再試',
        errorInvalidKey: '序號錯誤',
        errorUsedKey: '序號已被使用',
        errorRateLimited: '啟動受限',
        errorCountryRestricted: '地區限制',
        errorAlreadyOwned: '產品已擁有',
        errorMissingBaseGame: '未擁有主程式',
        errorPS3Required: '需要PS3 啟動',
        errorGiftWallet: '偵測到禮物卡／錢包序號',
        errorFailedRequest: '處理資料發生錯誤，請稍後再試',
        errorFailedRequestNeedUpdate: '請求發生錯誤，請稍後再試<br>或者嘗試更新SessionID',
        errorActivated: '你已啟動過這序號',
        successTitle: '啟動成功！',
        processingTitle: '喵～',
        processingMsg: '啟動序號中，請稍後',
        notLoggedInTitle: '未登入',
        notLoggedInMsg: '請登入Steam 以讓腳本紀錄SessionID',
        missingTitle: '未發現SessionID',
        missingMsg: '請問要更新SessionID 嗎？',
        titlehidePanel: '在這網站隱藏懸浮框',
        titleDisable: '在這網站禁止腳本',
        titleSettings: '開啟設定',
        settingsTitle: '設定',
        settingsAutoUpdateSessionID: '自動更新SessionID',
        settingsSessionID: '我的sessionID',
        settingsLanguage: '語言',
        settingsAutoClosePopup: '自動關閉彈窗',
        settingsTimerDisabled: '不關閉彈窗',
        settingsTimerSecond: '秒',
        settingsAutoReplyActivated: '自動回覆啟動序號',
        settingsEnabledForever: '全域運行腳本',
        settingsEnabled: '在這些網站運行腳本',
        settingsDisabled: '在這些網站禁止腳本',
        settingsHideForever: '全域隱藏懸浮',
        settingsHide: '在這些網站隱藏懸浮',
        settingsOff: '在這些網站暫停腳本',
        placeholderEnabled: '如不全域運行腳本此欄不得為空',
        activatedReply: '感謝大佬！已拿%KEYS%'
    },
    schinese: {
        name: '简体中文',
        updateSuccessTitle: '更新成功',
        updateSuccess: '成功更新Steam sessionID',
        errorTitle: '糟糕！',
        errorUnexpected: '发生未知错误，请稍后再试',
        errorInvalidKey: '激活码错误',
        errorUsedKey: '激活码已被使用',
        errorRateLimited: '激活受限',
        errorCountryRestricted: '地区限制',
        errorAlreadyOwned: '产品已拥有',
        errorMissingBaseGame: '未拥有游戏本体',
        errorPS3Required: '需要PS3 激活',
        errorGiftWallet: '侦测到礼物卡／钱包激活码',
        errorFailedRequest: '处理资料发生错误，请稍后再试',
        errorFailedRequestNeedUpdate: '请求发生错误，请稍后再试<br>或者尝试更新SessionID',
        errorActivated: '你已激活过这激活码',
        successTitle: '激活成功！',
        processingTitle: '喵～',
        processingMsg: '激活中，请稍后',
        notLoggedInTitle: '未登入',
        notLoggedInMsg: '请登入Steam 以让脚本记录SessionID',
        missingTitle: '未发现SessionID',
        missingMsg: '请问要更新SessionID 吗？',
        titlehidePanel: '在这网站隐藏悬浮',
        titleDisable: '在这网站禁止脚本',
        titleSettings: '打开设置',
        settingsTitle: '设置',
        settingsAutoUpdateSessionID: '自动更新SessionID',
        settingsSessionID: '我的sessionID',
        settingsLanguage: '语言',
        settingsAutoClosePopup: '自动关闭弹窗',
        settingsTimerDisabled: '不关闭弹窗',
        settingsTimerSecond: '秒',
        settingsAutoReplyActivated: '自动回复激活KEY',
        settingsEnabledForever: '全域运行脚本',
        settingsEnabled: '在这些网站运行脚本',
        settingsDisabled: '在这些网站禁止脚本',
        settingsHideForever: '全域隐藏悬浮',
        settingsHide: '在这些网站隐藏悬浮',
        settingsOff: '在这些网站暂停脚本',
        placeholderEnabled: '如不全域运行脚本此栏不得为空',
        activatedReply: '感谢大佬！已激活%KEYS%'
    },
    english: {
        name: 'English',
        updateSuccessTitle: 'Update Successful!',
        updateSuccess: 'Steam sessionID is successfully updated',
        errorTitle: 'Opps!',
        errorUnexpected: 'An unexpected error has occured, please try again later',
        errorInvalidKey: 'Invalid Key',
        errorUsedKey: 'Used Key',
        errorRateLimited: 'Rate Limited',
        errorCountryRestricted: 'Country Restricted',
        errorAlreadyOwned: 'Product Already Owned',
        errorMissingBaseGame: 'Missing Base Game',
        errorPS3Required: 'PS3 Activation Required',
        errorGiftWallet: 'Gift Card/Wallet Code Detected',
        errorFailedRequest: 'Result parse failed, please try again',
        errorFailedRequestNeedUpdate: 'Request failed, please try again<br>or update sessionID',
        errorActivated: 'You have activated this key before',
        successTitle: 'Activation Successful!',
        processingTitle: 'Nyaa~',
        processingMsg: 'Activating key, please wait',
        notLoggedInTitle: 'Not Logged-In',
        notLoggedInMsg: 'Please login to Steam so sessionID can be saved',
        missingTitle: 'Missing SessionID',
        missingMsg: 'Do you want to update your Steam sessionID?',
        titlehidePanel: 'Hide floating panel on this site',
        titleDisable: 'Disable script on this site',
        titleSettings: 'Open settings panel',
        settingsTitle: 'Settings',
        settingsAutoUpdateSessionID: 'Auto Update SessionID',
        settingsSessionID: 'Your sessionID',
        settingsLanguage: 'Language',
        settingsAutoClosePopup: 'Close popup in',
        settingsTimerDisabled: 'Don\'t close popup',
        settingsTimerSecond: 'second',
        settingsAutoReplyActivated: 'Auto Reply Activated Keys',
        settingsEnabledForever: 'Enable scrip all the time',
        settingsEnabled: 'Enable script on',
        settingsDisabled: 'Disable script on',
        settingsHideForever: 'Hide floating panel all the time',
        settingsHide: 'Hide floating panel on',
        settingsOff: 'Turn off script on',
        placeholderEnabled: 'Must not be empty if script not enabled all the time',
        activatedReply: 'Thank you for the keys! Activated %KEYS%'
    }
};
let text = has.call(i18n, config.get('language')) ? i18n[config.get('language')] : i18n.english;

// functions
const getSessionID = () => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://store.steampowered.com/',
        onload: res => {
            if (res.status === 200) {
                const accountID = res.response.match(/g_AccountID = (\d+)/).pop();
                const sessionID = res.response.match(/g_sessionID = "(\w+)"/).pop();

                if (accountID > 0) config.set('sessionID', sessionID);else {
                    swal({
                        title: text.notLoggedInTitle,
                        text: text.notLoggedInMsg,
                        type: 'error',
                        showCancelButton: true
                    }).then(() => {
                        window.open('https://store.steampowered.com/');
                    });
                }
            }
        }
    });
};
const settings = () => {
    const panelHTML = `
        <div class="SKH_settings">
            <table>
                <tr>
                    <td class="name">${text.settingsAutoUpdateSessionID}</td>
                    <td class="value">
                        <label class="switch">
                            <input type="checkbox" class="autoUpdateSessionID">
                            <span class="slider"></span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsSessionID}</td>
                    <td class="value">
                        <input type="text" class="sessionID" value="${config.get('sessionID')}" disabled>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsLanguage}</td>
                    <td class="value">
                        <select class="language"></select>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsAutoClosePopup}</td>
                    <td class="value">
                        <label class="switch">
                            <input type="checkbox" class="autoClosePopup">
                            <span class="slider"></span>
                        </label>
                        <p><input type="number" class="autoClosePopupTimer" min="0" value="${config.get('autoClosePopupTimer')}"> ${text.settingsTimerSecond}</p>
                        <p class="timerDisabledText">${text.settingsTimerDisabled}</p>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsAutoReplyActivated}</td>
                    <td class="value">
                        <label class="switch">
                            <input type="checkbox" class="autoReplyActivated">
                            <span class="slider"></span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsEnabled}</td>
                    <td class="value">
                        <label class="switch">
                            <input type="checkbox" class="enabledForever">
                            <span class="slider"></span>
                        </label>
                        <p class="enabledForeverText">${text.settingsEnabledForever}</p>
                        <textarea class="enabledList" placeholder="${text.placeholderEnabled}"></textarea>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsDisabled}</td>
                    <td class="value">
                        <textarea class="disabledList"></textarea>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsHide}</td>
                    <td class="value">
                        <label class="switch">
                            <input type="checkbox" class="hideForever">
                            <span class="slider"></span>
                        </label>
                        <p class="hideForeverText">${text.settingsHideForever}</p>
                        <textarea class="hideList"></textarea>
                    </td>
                </tr>
                <tr>
                    <td class="name">${text.settingsOff}</td>
                    <td class="value">
                        <textarea class="offList"></textarea>
                    </td>
                </tr>
            </table>
        </div>
    `;
    const panelHandler = () => {
        // apply settings
        const $panel = $(swal.getContent());
        const $sessionID = $panel.find('.sessionID');
        const $language = $panel.find('.language');

        // toggles
        $panel.find('input[type="checkbox"]').each((index, input) => {
            const $input = $(input);

            $input.change(e => {
                swal.showLoading();

                const setting = e.delegateTarget.className;
                const state = e.delegateTarget.checked;

                config.set(setting, state);
                $(e.delegateTarget).closest('td').toggleClass('toggleOn', state);

                if (setting === 'autoUpdateSessionID') $sessionID.attr('disabled', state);

                setTimeout(swal.hideLoading, 500);
            });
            $input.prop('checked', !!config.get(input.className)).trigger('change');
        });

        // sessionID input
        $sessionID.prop('disabled', config.get('autoUpdateSessionID'));
        $sessionID.change(() => {
            swal.showLoading();

            config.set('sessionID', $sessionID.val().trim());

            setTimeout(swal.hideLoading, 500);
        });

        // language
        Object.keys(i18n).forEach(language => {
            $language.append(new Option(i18n[language].name, language));
        });
        $panel.find(`option[value=${config.get('language')}]`).prop('selected', true);
        $language.change(() => {
            swal.showLoading();

            const newLanguage = $language.val();
            config.set('language', newLanguage);

            text = has.call(i18n, newLanguage) ? i18n[newLanguage] : i18n.english;

            setTimeout(swal.hideLoading, 500);
        });

        // timer
        $panel.find('.autoClosePopupTimer').change(e => {
            const second = parseInt(e.delegateTarget.value, 10);

            config.set('autoClosePopupTimer', Number.isInteger(second) ? second : 3);
        });

        // websites list
        ['enabled', 'disabled', 'hide', 'off'].forEach(list => {
            const $list = $panel.find(`.${list}List`);

            $list.val(config.get(list).join(eol));
            $list.change(() => {
                swal.showLoading();

                const hostList = $list.val().split(eol).map(x => x.trim()).filter(x => x.length);

                config.set(list, hostList);
                if (list === 'enabled') {
                    const state = !!$panel.find('.enabledForever:checked').length;

                    // script is not enabled all the time and empty enabled website
                    if (!state && hostList.length === 0) config.set('enabledForever', true);
                }

                setTimeout(swal.hideLoading, 500);
            });
        });
    };

    swal({
        title: text.settingsTitle,
        html: panelHTML,
        onBeforeOpen: panelHandler
    });
};
const insertPanel = callback => {
    const $panel = $('<div class="SKH_panel"></div>');

    // add toggle switch
    $panel.append($(`
            <label class="switch">
                <input type="checkbox">
                <span class="slider"></span>
            </label>
        `).change(() => {
        const host = location.hostname;
        const toggle = !!$('.SKH_panel input:checked').length;
        const index = config.get('off').indexOf(host);

        if (toggle && index > -1) config.splice('off', index, 1);else if (!toggle && index === -1) config.push('off', host);
    }));

    // add hide button
    $panel.append($(`<button class="hidePanel" title="${text.titlehidePanel}"> </button>`).click(() => {
        config.push('hide', location.hostname);
        $panel.remove();
    }));

    // add disabled button
    $panel.append($(`<button class="disable" title="${text.titleDisable}"> </button>`).click(() => {
        config.push('disabled', location.hostname);
        $panel.remove();
    }));

    // add settings button
    $panel.append($(`<button class="settings" class="${text.titleSettings}"> </button>`).click(settings));

    $('body').append($panel);

    callback();

    // hide panel after 5 seconds
    setTimeout(() => {
        $panel.hide();
    }, 5000);
};
const getResultMsg = result => {
    const msg = {
        title: text.errorTitle,
        html: text.errorUnexpected,
        type: 'error'
    };
    const errors = {
        14: text.errorInvalidKey,
        15: text.errorUsedKey,
        53: text.errorRateLimited,
        13: text.errorCountryRestricted,
        9: text.errorAlreadyOwned,
        24: text.errorMissingBaseGame,
        36: text.errorPS3Required,
        50: text.errorGiftWallet
    };

    if (result.success === 1) {
        msg.title = text.successTitle;
        msg.html = '';
        msg.type = 'success';
    } else if (result.success === 2) {
        const errorCode = result.purchase_result_details;
        if (has.call(errors, errorCode)) msg.html = errors[errorCode];
    }

    const details = [];
    result.purchase_receipt_info.line_items.forEach(item => {
        const detail = [`<b>${item.line_item_description}</b>`];
        if (item.packageid > 0) detail.push(`sub: <a target="_blank" href="https://steamdb.info/sub/${item.packageid}/">${item.packageid}</a>`);
        if (item.appid > 0) detail.push(`app: <a target="_blank" href="https://steamdb.info/sub/${item.appid}/">${item.appid}</a>`);

        details.push(detail.join(', '));
    });

    if (details.length > 0) msg.html += `<br>${details.join('<br>')}`;

    return msg;
};
const activateKey = key => {
    if ($('.SKH_panel input:checked').length > 0 && !activating) {
        activating = true;

        swal(text.processingTitle, text.processingMsg);
        swal.showLoading();

        const timer = config.get('autoClosePopup') ? config.get('autoClosePopupTimer') * 1000 : null;
        if (activated.includes(key)) {
            swal.close();
            if (timer !== 0) {
                swal({
                    title: text.errorTitle,
                    text: text.errorActivated,
                    type: 'error',
                    timer
                }).catch(swal.noop);
            }

            activating = false;
        } else {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://store.steampowered.com/account/ajaxregisterkey/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Origin: 'https://store.steampowered.com',
                    Referer: 'https://store.steampowered.com/account/registerkey'
                },
                data: `product_key=${key}&sessionid=${config.get('sessionID')}`,
                onload: res => {
                    swal.close();
                    if (res.status === 200) {
                        try {
                            const result = JSON.parse(res.response);
                            const msg = getResultMsg(result);

                            if (timer !== 0) {
                                swal({
                                    title: msg.title,
                                    html: msg.html,
                                    type: msg.type,
                                    timer
                                }).catch(swal.noop);
                            }

                            // update activated
                            if (!activated.includes(key)) {
                                const failCode = result.purchase_result_details;
                                if (result.success === 1 || [14, 15, 9].includes(failCode)) {
                                    activated.push(key);
                                    GM_setValue('SKH_activated', JSON.stringify(activated));
                                    $(`span:contains(${key}), [value=${key}]`).addClass('SKH_activated');
                                }
                            }

                            // insert activated in this session
                            if (result.success === 1) currentActivated.push(key);
                        } catch (e) {
                            swal(text.errorTitle, text.errorFailedRequest, 'error');
                        }
                    } else {
                        const errorMsg = [];

                        errorMsg.push('<pre class="SKH_errorMsg">');
                        errorMsg.push(`sessionID: ${config.get('sessionID') + eol}`);
                        errorMsg.push(`autoUpdate: ${config.get('autoUpdateSessionID') + eol}`);
                        errorMsg.push(`status: ${res.status + eol}`);
                        errorMsg.push(`response: ${res.response + eol}`);
                        errorMsg.push('</pre>');

                        swal({
                            title: text.errorTitle,
                            html: text.errorFailedRequestNeedUpdate + eol + errorMsg.join(''),
                            type: 'error'
                        });
                        getSessionID();
                    }

                    activating = false;
                }
            });
        }
    }
};
const scanInput = (i, input) => {
    if (input.type === 'text' && regKey.test(input.value)) {
        const $input = $(input);
        const key = input.value.trim();

        if (activated.includes(key)) $input.addClass('SKH_activated');

        $input.prop('disabled', false);
        $input.click(() => {
            activateKey(key);
        });
    }
};
const init = () => {
    // save sessionID
    if (location.hostname === 'store.steampowered.com') {
        if (g_AccountID > 0) {
            const currentID = config.get('sessionID');
            const sessionID = g_sessionID || '';
            const language = g_oSuggestParams.l || 'english';

            if (!config.get('language')) config.set('language', language);
            if (sessionID.length > 0) {
                const update = config.get('autoUpdateSessionID') && currentID !== sessionID;

                if (!currentID || update) {
                    config.set('sessionID', sessionID, () => {
                        swal({
                            title: text.updateSuccessTitle,
                            text: text.updateSuccess,
                            type: 'success',
                            timer: 3000
                        });
                    });
                }
            }
        }
        /* else {
            swal(text.notLoggedInTitle, text.notLoggedInMsg, 'error');
        }
        */
    } else {
        // check sessionID
        if (!config.get('sessionID')) getSessionID();

        const host = location.hostname;
        let run = true;

        if (!config.get('enabledForever') && !config.get('enabled').includes(host)) run = false;
        if (config.get('disabled').includes(host)) run = false;

        if (run) {
            const markOptions = {
                element: 'span',
                exclude: ['.SKH_processed'],
                each: marked => {
                    const $marked = $(marked);
                    const key = $marked.text();

                    // checked if activated before
                    if (activated.includes(key)) $marked.addClass('SKH_activated');

                    // bind click event
                    $marked.click(e => {
                        e.preventDefault();
                        activateKey(key);
                    });

                    // append class
                    $marked.addClass('SKH_processed');
                }
            };

            // hide floating panel
            if (config.get('hideForever') || config.get('hide').includes(host)) {
                GM_addStyle('.SKH_panel { display: none; }');
            }

            // insert floating panel
            insertPanel(() => {
                // toggle on / off
                $('.SKH_panel input').prop('checked', !config.get('off').includes(host));
            });

            // start scanning
            $('body').markRegExp(regKey, markOptions);
            $('input[type="text"]').each(scanInput);

            // auto reply activated keys on SteamCN
            if (config.get('autoReplyActivated')) {
                $(window).on('unload', () => {
                    if (currentActivated.length > 0) {
                        $('#vmessage').val(text.activatedReply.replace('%KEYS%', currentActivated.join()));
                        $('#vreplysubmit').click();
                    }
                });
            }

            // monitor
            new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    // monitor added nodes
                    Array.from(mutation.addedNodes).forEach(addedNode => {
                        if (addedNode.nodeType === 1) {
                            $(addedNode).each(scanInput).markRegExp(regKey, markOptions);
                        } else if (addedNode.nodeType === 3) {
                            $(addedNode.parentNode).markRegExp(regKey, markOptions);
                        }
                    });

                    // monitor text change
                    if (mutation.type === 'characterData') {
                        $(mutation.target.parentNode).markRegExp(regKey, markOptions);
                    }
                });
            }).observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }
};

$(window).on('load', init);