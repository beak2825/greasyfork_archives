// ==UserScript==
// @name         凯恩之角 拉黑
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  指定用户ID，屏蔽它的帖子
// @author       qin
// @license MIT
// @match        https://bbs.d.163.com/forum-*.html
// @icon         https://mail.163.com/favicon.ico
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/463203/%E5%87%AF%E6%81%A9%E4%B9%8B%E8%A7%92%20%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463203/%E5%87%AF%E6%81%A9%E4%B9%8B%E8%A7%92%20%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function gmc_run() {
        const configCss = '#backlistConfig {background-color: #D5F5E3;}';
        // 初始化
        let gmc = GM_config({
            id: 'backlistConfig',
            title: '黑名单列表设置',
            css: configCss,
            fields: {
                Blacklist: {
                    label: '一行一个ID，不要有多余的空格或是其它字符',
                    type: 'textarea',
                    cols: 48,
                    rows: 24
                }
            },
            events: {
                'init': () => {
                    const blackListConfigValue = gmc.get('Blacklist');
                    const blackIdList = blackListConfigValue.split("\n");
                    const posts = document.querySelectorAll("tbody[id^='normalthread_']");
                    for (const post of Array.from(posts)) {
                        const authorLink = post.querySelector('.by cite a');
                        if (authorLink && blackIdList.includes(authorLink.textContent.trim())) {
                            post.style.display = 'none';
                      }
                    }
                }
            }
        });
        
        // 配置菜单
        GM_registerMenuCommand('设置', () => gmc.open());
    }

    window.addEventListener('load', () => {
        gmc_run();
    });
})();