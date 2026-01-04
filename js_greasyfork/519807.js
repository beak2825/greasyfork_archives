// ==UserScript==
// @name         JIRA标签着色
// @version      0.5.2
// @namespace    https://izmj.net
// @description  给jira的标签添加自定义配色
// @author       girakoo@163.com
// @match        https://*/issues/*
// @grant        none
// @icon64       https://gitee.com/izmj/web_js/raw/main/img/zmj.png
// @downloadURL https://update.greasyfork.org/scripts/519807/JIRA%E6%A0%87%E7%AD%BE%E7%9D%80%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/519807/JIRA%E6%A0%87%E7%AD%BE%E7%9D%80%E8%89%B2.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function applyStyling() {
        if (document.title.toLowerCase().includes('jira')) {
            // 获取所有class为'jira-issue-status-lozenge'的span元素
            var spans = document.querySelectorAll('span.jira-issue-status-lozenge');
            // 遍历所有的span元素
            document.querySelectorAll('span').forEach(function (span) {
                if (span.className.indexOf('jira-issue-status-lozenge') != -1) {
                    // 检查span的文本内容是否为'done'（忽略首尾空白）
                    if (span.textContent.trim() === 'Done') {
                        // neutral
                        span.style.backgroundColor = '#6D737C';
                        span.style.color = '#E8E9E7';
                    } else if (span.textContent.trim() === 'Open') {
                        // red
                        span.style.backgroundColor = '#FFDCDA';
                        span.style.color = '#DB4E45';
                    } else if (span.textContent.trim() === '开始解析') {
                        // yellow
                        span.style.backgroundColor = '#FFEDC1';
                        span.style.color = '#B08111';
                    } else if (span.textContent.trim() === '解析完成') {
                        // blue
                        span.style.backgroundColor = '#D7E2FD';
                        span.style.color = '#3869DD';
                    } else if (span.textContent.trim() === '修改完成') {
                        // green
                        span.style.backgroundColor = '#DBF4D6';
                        span.style.color = '#287C1A';
                    }
                }
                else if (span.textContent.includes('HMI24W') || span.textContent.includes('HMI25W')) {
                    // 一些自定义的小标签
                    // purple
                    span.style.backgroundColor = '#E7D9FE';
                    span.style.color = '#7C47D8';
                }
                else if (span.textContent.includes('NotBug')) {
                    // cyan
                    span.style.backgroundColor = '#00FFFF';
                    span.style.color = '#0000FF';
                }
            });
        }
    }
    // 初始执行
    applyStyling();
    // 创建一个MutationObserver实例并传入回调函数
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                applyStyling();
            }
        });
    });
    // 配置观察选项:
    var config = { childList: true, subtree: true };

    // 选择需要观察变动的节点
    var targetNode = document.querySelector('body');

    // 开始观察变动
    observer.observe(targetNode, config);
})();