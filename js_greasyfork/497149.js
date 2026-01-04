// ==UserScript==
// @name         RJhome自动回贴刷新
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  自动回帖后刷新
// @author       zzx114
// @match        https://rjhome.me/*.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497149/RJhome%E8%87%AA%E5%8A%A8%E5%9B%9E%E8%B4%B4%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/497149/RJhome%E8%87%AA%E5%8A%A8%E5%9B%9E%E8%B4%B4%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在这里编写您的自动回复逻辑
    const replyMessage = "非常好分享，谢谢。";

    // 检测页面上是否已存在回复内容
    const existingReplies = document.querySelectorAll("div.comments-area-content"); // 更新为实际的回复内容选择器
    let isReplyPresent = false;
    existingReplies.forEach((reply) => {
        if (reply.textContent.includes(replyMessage)) {
            isReplyPresent = true;
        }
    });

    // 如果页面上没有预设的回复内容，则填充并提交回复
    if (!isReplyPresent) {
        setTimeout(() => {
         // const replyButton = document.querySelector("#reply-button"); // 替换为实际的回复按钮选择器
         // if (replyButton) {
        //      replyButton.click();
       //   }

            const replyInput = document.querySelector(".com-form-textarea > #textarea"); // 替换为实际的回复输入框选择器
            if (replyInput) {
                replyInput.value = replyMessage;
            }

            const submitButton = document.querySelector(".com-form-button-r > button:nth-child(2)"); // 替换为实际的提交按钮选择器
            if (submitButton) {
                submitButton.click();
            }
        }, 5000); // 等待5秒后再回复
    }

    // 如果页面上没有预设的回复内容，则在15秒后刷新页面
    if (!isReplyPresent) {
        setTimeout(() => {
            window.location.reload();
        }, 8000); // 等待5秒后回复，然后3秒后刷新页面
    }
})();
