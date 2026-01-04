// ==UserScript==
// @name         DeepSeek Traits
// @name:zh-CN   深度搜索特性
// @namespace    http://tampermonkey.net/
// @version      2025-01-24
// @description  A recreation of OpenAI's ChatGPT Traits feature. By default does nothing. Configure via userscript.
// @description:zh-CN 复制OpenAI的ChatGPT特性功能，默认无操作，需通过用户脚本配置
// @author       https://github.com/xskutsu
// @match        *://*.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524775/DeepSeek%20Traits.user.js
// @updateURL https://update.greasyfork.org/scripts/524775/DeepSeek%20Traits.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const locale = {
        en: {
            set: "Set DeepSeek Traits",
            clear: "Clear DeepSeek Traits",
            prompt: "Enter traits for DeepSeek:",
            updated: "Traits Updated!",
            confirm: "Are you sure you want to clear DeepSeek Traits?",
            cleared: "Traits cleared!",
            instruct: "When you respond to this message by the user, please follow these DeepSeek Traits (instructions, guidelines, desires) provided by the user: "
        },
        zh: {
            set: "设置DeepSeek特性",
            clear: "清除DeepSeek特性",
            prompt: "输入DeepSeek的特性：",
            updated: "特性已更新！",
            confirm: "确定要清除DeepSeek特性吗？",
            cleared: "特性已清除！",
            instruct: "当您回复用户的此消息时，请遵循用户提供的这些DeepSeek特质（指示、指南、需求）："
        }
    };
    const t = locale[navigator.language.startsWith('zh') ? 'zh' : 'en'];

    let DeepSeekTraits = GM_getValue("traits", "");

    GM_registerMenuCommand(t.set, function () {
        const traits = prompt(t.prompt, GM_getValue("traits", "")).trim().replace(/[\n\r\t]/gm, "");
        if (traits.length !== 0) {
            GM_setValue("traits", traits);
            DeepSeekTraits = traits;
            alert(t.updated);
        }
    });

    GM_registerMenuCommand(t.clear, function () {
        if (confirm(t.confirm)) {
            GM_setValue("traits", "");
            DeepSeekTraits = "";
            alert(t.cleared);
        }
    });

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body, ...args) {
        if (isJson(body) && DeepSeekTraits.length !== 0) {
            const data = JSON.parse(body);
            if (data.hasOwnProperty("prompt")) {
                data.prompt = `${t.instruct}"${DeepSeekTraits}"\n\nUser:\n${data.prompt}`;
                body = JSON.stringify(data);
            }
        }
        originalSend.call(this, body, ...args);
    };
})();