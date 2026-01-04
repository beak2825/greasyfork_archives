// ==UserScript==
// @name         jira复制commit message
// @namespace    http://jira.netease.com/
// @version      0.1
// @description  jira复制commit message，用于git等提交信息，可自由修改
// @author       liuwenzhuang
// @match        *://jira.netease.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        window.close
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392304/jira%E5%A4%8D%E5%88%B6commit%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/392304/jira%E5%A4%8D%E5%88%B6commit%20message.meta.js
// ==/UserScript==
(function(oldPushState) {
    'use strict';
    var $ = $ || window.$;
    var doc = document;
    window.history.pushState = function () {
        oldPushState.apply(window.history, arguments);
        setTimeout(insertCopyCommitMessage, 1000);
    }
    var insertCopyCommitMessage = function() {
        var copyLinkButton = $('#copyLinkButton');
        var copyCommitMessage = $('<a href="javascript: void(0);" style="margin-left:20px;cursor: pointer;" id="copyCommitMessageLinkButton">复制提交信息</a>');
        copyCommitMessage.appendTo(copyLinkButton.parent());
        copyCommitMessage.on('click', function(event){
            var jiraCode = $('#key-val').text();
            var jiraTitle = $('#summary-val').text();
            var jiraType = $('#type-val').text().trim();
            var commitType = 'feat';
            var tailMessage = '';
            switch(jiraType) {
                case '缺陷':
                    commitType = 'fix';
                    tailMessage = '\n\n' + '原因：' + '\n' + '方案：' + '\n' + '自测：'
                    break;
                case '子任务':
                case '故事':
                    commitType = 'feat';
                    break;
            }
            var result = '#' + jiraCode + ' ' + commitType + ':' + ' ' + jiraTitle + tailMessage;
            GM_setClipboard(result);
            GM_notification({
                text: '复制成功'
            });
        });
    }
    setTimeout(insertCopyCommitMessage, 1000);
})(window.history.pushState);