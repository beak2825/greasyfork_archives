// ==UserScript==
// @name         ChatGPT No Login Prompt
// @name:zh-CN   ChatGPT 禁止登录弹窗
// @version      0.2
// @description  No more popups to ask you to login
// @description:zh-cn 不再弹窗请求你登录
// @author       People11
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/1143233
// @downloadURL https://update.greasyfork.org/scripts/534804/ChatGPT%20No%20Login%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/534804/ChatGPT%20No%20Login%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.setItem('oai/apps/hasSeenNoAuthImagegenNux', 'true');
    sessionStorage.setItem('oai/apps/noAuthHasDismissedSoftRateLimitModal', 'true');
})();