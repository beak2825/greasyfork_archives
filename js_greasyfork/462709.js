// ==UserScript==
// @name        ChatGPT快捷键
// @namespace   Violentmonkey Scripts
// @match       https://chat.openai.com/*
// @grant       none
// @version 1.0
// @author leii
// @description 本脚本由ChatGPT协助开发，按下alt+q后可以快捷开启新对话（替代鼠标点击new chat按钮开启新对话）
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462709/ChatGPT%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/462709/ChatGPT%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
const newChatButtonSelector = 'a.flex.py-3.px-3.items-center.gap-3.rounded-md.hover\\:bg-gray-500\\/10.transition-colors.duration-200.text-white.cursor-pointer.text-sm.mb-2.flex-shrink-0.border.border-white\\/20';
(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'q' || e.key === 'Q') {
            const newChatButton = document.querySelector(newChatButtonSelector);


            if (newChatButton) {
                newChatButton.click();
            }
        }
    });
})();