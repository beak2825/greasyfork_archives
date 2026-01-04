// ==UserScript==
// @name         Hostloc自动添加特定后缀
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  发帖或回复时在尾部添加特定后缀
// @author       cla
// @match        https://hostloc.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515153/Hostloc%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%89%B9%E5%AE%9A%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/515153/Hostloc%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%89%B9%E5%AE%9A%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const suffix = "[color=#FF4500][b][size=3][font=华文新魏]✦✧✦-HOH与狗禁止入内-✦✧✦[/font][/size][/b][/color]";

    window.addEventListener('load', function() {
        let postTextArea = document.querySelector('#fastpostmessage');
        let newThreadTextArea = document.querySelector('textarea[name="message"]');
        let editPostTextArea = document.querySelector('textarea[name="message"]');
        let editReplyTextArea = document.querySelector('textarea[name="message"]');

        function addSuffix(textArea) {
            if (!textArea.value.endsWith(suffix)) {
                textArea.value = `${textArea.value.trim()}
${suffix}`;
            }
        }

        if (postTextArea) {
            let postForm = document.querySelector('#fastpostsubmit').closest('form');
            postForm.addEventListener('submit', function(e) {
                addSuffix(postTextArea);
            });
        }

        if (newThreadTextArea) {
            let newThreadForm = document.querySelector('button[name="topicsubmit"]').closest('form');
            newThreadForm.addEventListener('submit', function(e) {
                addSuffix(newThreadTextArea);
            });
        }

        if (editPostTextArea) {
            let editPostForm = document.querySelector('button[name="editsubmit"]').closest('form');
            editPostForm.addEventListener('submit', function(e) {
                addSuffix(editPostTextArea);
            });
        }

        if (editReplyTextArea) {
            let editReplyForm = document.querySelector('button[name="replysubmit"]').closest('form');
            editReplyForm.addEventListener('submit', function(e) {
                addSuffix(editReplyTextArea);
            });
        }

        // 处理新增的按钮类型
        let additionalReplyButton = document.querySelector('button[name="replysubmit"]');
        if (additionalReplyButton) {
            let additionalReplyForm = additionalReplyButton.closest('form');
            additionalReplyForm.addEventListener('submit', function(e) {
                let additionalReplyTextArea = additionalReplyForm.querySelector('textarea[name="message"]');
                if (additionalReplyTextArea) {
                    addSuffix(additionalReplyTextArea);
                }
            });
        }
    });
})();