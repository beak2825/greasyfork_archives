// ==UserScript==
// @name         70games自动评论
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动评论以获取账号密码
// @author       Cary
// @match        *://*.70games.net/*
// @grant        none
// @license MIT
// @icon         https://70games.net/view/img/logo3.png
// @downloadURL https://update.greasyfork.org/scripts/482365/70games%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/482365/70games%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 评论内容
    var commentText = '感谢分享！'; // 可以将“感谢分享！”替换为任何你想要自动评论的内容~

    // 检查页面是否包含指定的文字
    function hasRequiredText() {
        return document.body.innerText.includes('评论后再查看。');
    }

    // 发表评论
    function postComment() {
        console.log('Posting comment...');
        // 获取评论框
        var commentBox = document.getElementById('message'); // 评论框ID

        if (commentBox) {
            // 输入评论内容
            commentBox.value = commentText;

            // 提交评论表单
            var submitButton = document.getElementById('submit'); // 提交按钮ID
            if (submitButton) {
                submitButton.click();
            }
        }
    }

    // 页面加载完成时执行
    window.onload = function() {
        console.log('Page loaded.');
        // 如果页面包含指定的文字，则按顺序执行滚动到顶部、发表评论、刷新页面等操作
        if (hasRequiredText()) {
            setTimeout(postComment, 100); // 0.1秒后发表评论，如果你的网速太差~电脑太旧~你可以把它调高！

            // 刷新页面一次
            setTimeout(function() {
                console.log('Reloading the page...');
                window.location.reload();
            }, 200); // 0.2秒后刷新页面，可以根据需要调整时间。
        } else {
            console.log('Required text not found. Stopping the script.');
        }
    };
})();