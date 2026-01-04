// ==UserScript==
// @name         DuckDuckGo AI Chat Auto-Access
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动设置 cookie，跳过 DuckDuckGo AI 聊天的初始确认步骤，隐藏欢迎提示，避免在无痕模式下每次访问时手动确认。
// @author       Your Name
// @match        https://duckduckgo.com/aichat
// @match        https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1
// @match        https://duck.ai
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509362/DuckDuckGo%20AI%20Chat%20Auto-Access.user.js
// @updateURL https://update.greasyfork.org/scripts/509362/DuckDuckGo%20AI%20Chat%20Auto-Access.meta.js
// ==/UserScript==

/*
使用说明：
1. 安装 Tampermonkey。
2. 创建新脚本并粘贴代码。
3. 修改 `cookieValue` 选择聊天模型：
   - '3': GPT-4o mini 3
   - '1': Claude 3 Haiku 1
   - '5': Llama 3.1 70B 5
   - '6': Mixtral 8x7B 6
4. 保存并启用脚本。
5. 访问 DuckDuckGo AI 聊天页面，直接进入聊天界面，无需手动确认。
*/

(function() {
    'use strict';

    localStorage.setItem('aichatWelcomeCardsDimissed', JSON.stringify(new Date().toISOString().split('T')[0]));

    const cookieName = 'dcm';
    const cookieValue = '3'; // 聊天模型
    const cookieDomain = 'duckduckgo.com';
    const cookiePath = '/';
    const cookieExpires = new Date('2099-01-12T00:00:00Z').toUTCString();

    document.cookie = `${cookieName}=${cookieValue}; Domain=${cookieDomain}; Path=${cookiePath}; Expires=${cookieExpires}; Secure; SameSite=Strict`;
})();
