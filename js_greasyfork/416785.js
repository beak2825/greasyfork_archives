// ==UserScript==
// @name         Flow 隐藏图标
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://asia.flow.microsoft.com/manage/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416785/Flow%20%E9%9A%90%E8%97%8F%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/416785/Flow%20%E9%9A%90%E8%97%8F%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener('click', (el) => {
        console.log('click body');

        if (
            !el.target.classList.contains('ms-Pivot-link') &&
            !el.target.classList.contains('ms-Pivot-text')
        )
            return;

        // 展开button
        let btn_expand = document.querySelector('.msla-expand-button');
        if (btn_expand) {
            btn_expand.click();
        }

        setTimeout(() => {
            // tab标签
            let $list = document.querySelectorAll(
                '.msla-connectors .ms-List-page .ms-List-cell'
            );
            if (!$list.length) return;

            // 遍历按钮
            $list.forEach((child) => {
                if (!home.includes(child.innerText.trim())) {
                    child.style.display = 'none';
                }
            });
        }, 500);
    });

    let home = [
        '控件',
        'HTTP',
        '变量',
        '计划',
        // '请求',
        'OneDrive',
        '日期时间',
        '数据操作',
        '数字函数',
        '文本函数',
        'Flow button for mobile',
        'Microsoft Teams',
        'Excel Online (OneDrive)',
        '邮件',
        'SMTP',
        'Instagram',
        'Twitter',
        'MSN 天气',
        // 'office 365 Outlook',
        'SharePoint',
        // 'Bing Search',
        // 'Blogger',
        // 'Content Conversion',
        // 'Dropbox',
        // 'FTP',
        'Gmail',
        'Google Drive',
        'Google 表格',
        'Google 任务',
        'Google 日历',
        'Instapaper',
        // 'Microsoft Translator V2',
        // 'Outlook 任务',
        // 'Outlook.com',
        // 'Power BI',
        // 'Trello',
        // 'Yammer',
        // '文件系统',
    ];

    let enterprise = [];

    // Your code here...
})();