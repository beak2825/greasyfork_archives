// ==UserScript==
// @name         chatgpt-alive
// @name:zh-CN   chatgpt-alive
// @namespace    https://github.com/scout9ll/chatgpt-alive-extension
// @version      0.1.2
// @description  Lightweight and effective solution for the ChatGPT disconnection issue requiring page refresh.
// @description:zh-cn  轻量有效的解决chatgpt断连需要刷新页面的问题
// @author       scout9ll
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464864/chatgpt-alive.user.js
// @updateURL https://update.greasyfork.org/scripts/464864/chatgpt-alive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const heartbeatUrl = "/api/auth/session";
    const gapRange = [50000, 200000];
    function hiChatgpt() {
        setTimeout(() => {
            fetch(heartbeatUrl)
              .then((res) => {
                if (!res.ok) iframe.src = "/404";
              })
              .finally(() => {
                hiChatgpt();
              });
        }, Math.random() * (gapRange[1] - gapRange[0]) + gapRange[0]);
    }
    hiChatgpt();
})();