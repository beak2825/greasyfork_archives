// ==UserScript==
// @name         auto-open-sheet
// @namespace    http://tampermonkey.net/
// @description:zh-CN  自动打开当前页的种子!,配合auto-say-hello-plus插件有意想不到的效果!如果未匹配成功请联系我:960487551@qq.com
// @description:en  Automatically open the torrent on the current page! Combined with the auto-say-hello-plus plugin, it delivers unexpected results! If it fails to match successfully, please contact me: 960487551@qq.com
// @license MIT
// @author       wiiii
// @version      1.0.3
// @email        960487551@qq.com
// @copyright (c) 2025-01-01
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        *://pt.m-team.cc/*torrents.php*
// @match        *://kp.m-team.cc/*torrents.php*
// @match        *://xp.m-team.io/*torrents.php*
// @match        *://pt.btschool.club/torrents.php*
// @match        *://www.haidan.video/torrents.php*
// @match        *://www.hddolby.com/torrents.php*
// @match        *://www.hdarea.co/torrents.php*
// @match        *://hdatmos.club/torrents.php*
// @match        *://hdhome.org/torrents.php*
// @match        *://hdsky.me/torrents.php*
// @match        *://hdtime.org/torrents.php*
// @match        *://hhanclub.top/torrents.php*
// @match        *://lemonhd.org/details*
// @match        *://pt.soulvoice.club/torrents.php*
// @match        *://avgv.cc/torrents.php*
// @match        *://ptsbao.club/torrents.php*
// @match        *://www.beitai.pt/torrents.php*
// @match        *://et8.org/torrents.php*
// @match        *://pt.eastgame.org/torrents.php*
// @match        *://pthome.net/torrents.php*
// @match        *://pterclub.com/torrents.php*
// @match        *://ourbits.club/torrents.php*
// @match        *://hdzone.me/torrents.php*
// @match        *://pt.msg.vg/torrents.php*
// @match        *://hdfans.org/torrents.php*
// @match        *://rousi.zip/torrents.php*
// @match        *://carpt.net/torrents.php*
// @match        *://www.tjupt.org/torrents.php*
// @match        *://yingk.com/torrents.php*
// @match        *://www.dragonhd.xyz/torrents.php*
// @match        *://chdbits.co/torrents.php*
// @match        *://www.nicept.net/torrents.php*
// @match        *://tmpt.top/torrents.php*
// @match        *://open.cd/torrents.php*
// @grant        none
// @description 化身西部hello哥亚瑟摩根,对每个种子页面都自动感谢!如果未匹配成功请联系我:960487551@qq.com
// @downloadURL https://update.greasyfork.org/scripts/523072/auto-open-sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/523072/auto-open-sheet.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 配置参数
    const maxLinksToOpen = 50; // 最多同时打开的链接数
    const minIntervalTime = 100; // 每次打开的最小间隔（毫秒）
    const maxIntervalTime = 300; // 每次打开的最大间隔（毫秒）
    const storageKey = 'openedLinks'; // localStorage 键名，用于记录已打开的链接
    const userPromptKey = 'userPrompt'; // localStorage 键名，用于记录用户选择和时间
    const regex = /details\.php\?id=(\d+)/; // 链接匹配规则

    // 辅助函数：获取当前时间的时间戳
    function getCurrentTimestamp() {
        return new Date().getTime(); // 获取时间戳（毫秒）
    }

    // 辅助函数：获取用户提示记录
    function getUserPromptRecord() {
        return JSON.parse(localStorage.getItem(userPromptKey));
    }

    // 辅助函数：保存用户提示记录
    function saveUserPromptRecord(confirmed) {
        const record = {
            confirmed, // 用户选择：true 表示确认开启，false 表示取消
            timestamp: getCurrentTimestamp() // 当前时间
        };
        localStorage.setItem(userPromptKey, JSON.stringify(record));
    }

    // 辅助函数：获取已打开链接记录
    function getOpenedLinks() {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    // 辅助函数：保存已打开链接记录
    function saveOpenedLinks(openedLinks) {
        localStorage.setItem(storageKey, JSON.stringify(openedLinks));
    }

    // 辅助函数：在右上角显示提示信息
    function showNotification(message) {
        // 创建提示框容器
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.backgroundColor = '#007bff';
        notification.style.color = '#fff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '14px';

        // 添加到页面中
        document.body.appendChild(notification);

        // 设置定时器，3秒后自动移除提示
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 主逻辑：后台打开符合条件的链接
    function startOpeningLinks() {
        const openedLinks = getOpenedLinks(); // 获取已打开的链接记录
        const links = document.querySelectorAll('a'); // 获取页面中所有的 <a> 标签

        // 筛选出符合条件的链接
        const matchedLinks = [];
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && regex.test(href)) {
                const match = href.match(regex);
                const id = match[1]; // 提取链接中的 ID
                const domainWithId = `${location.hostname}:${id}`; // 组合为 "域名:ID"

                if (!openedLinks.includes(domainWithId)) {
                    matchedLinks.push({ link, domainWithId }); // 存储符合条件的链接和 ID
                }
            }
        });

        if (matchedLinks.length === 0) {
            // 当前页面所有链接都已访问过，右上角提示用户打开下一页
            showNotification('当前页面的所有链接都已打开，请打开下一页！');
            console.log('%c 当前页面的所有链接都已打开，请打开下一页！', 'color: orange;');
            return;
        }

        console.log(`%c 找到 ${matchedLinks.length} 个符合条件的未访问链接，最多打开 ${maxLinksToOpen} 个。`, 'color: blue;');
        console.table(matchedLinks);

        // 限制最多打开的链接数量
        const linksToOpen = matchedLinks.slice(0, maxLinksToOpen);

        let index = 0;

        // 递归方式逐一打开链接
        function openNextLink() {
            if (index >= linksToOpen.length) {
                console.log('%c 所有链接已按设置打开，任务完成。', 'color: green;');
                return; // 所有链接已打开，退出递归
            }

            const { link, domainWithId } = linksToOpen[index];

            try {
                // 使用 window.open 打开链接，并确保当前页面视角不切换
                window.open(link.href, '_blank', 'noopener,noreferrer');
                console.log(`%c 成功后台打开链接 (${index + 1}/${linksToOpen.length}): ${link.href}`, 'color: green;');

                // 记录已打开链接
                openedLinks.push(domainWithId);
                saveOpenedLinks(openedLinks);
            } catch (error) {
                console.log(`%c 打开链接失败 (${index + 1}/${linksToOpen.length}): ${link.href}`, 'color: red;', error);
            }

            index++; // 处理下一个链接

            // 随机设置下一个打开的时间间隔
            const randomInterval = Math.floor(Math.random() * (maxIntervalTime - minIntervalTime + 1)) + minIntervalTime;
            console.log(`%c 下一个链接将在 ${randomInterval / 1000} 秒后尝试打开。`, 'color: orange;');

            setTimeout(openNextLink, randomInterval); // 递归调用
        }

        // 开始递归调用
        openNextLink();
    }

    // 页面加载时执行主逻辑
    window.onload = function () {
        const record = getUserPromptRecord();

        // 如果用户已开启功能，直接执行打开链接逻辑
        if (record && record.confirmed) {
            console.log('%c 功能已开启，直接执行打开链接逻辑。', 'color: green;');
            startOpeningLinks();
        } else {
            // 如果记录为 null，提示用户是否开启功能
            if (record === null) {
                const userResponse = confirm("是否开启自动打开链接的功能？");
                saveUserPromptRecord(userResponse); // 保存用户选择

                if (userResponse) {
                    console.log('%c 用户选择开启功能，直接执行打开链接逻辑。', 'color: green;');
                    startOpeningLinks();
                } else {
                    console.log('%c 用户选择不开启功能，跳过打开链接逻辑。', 'color: orange;');
                }
            } else {
                console.log('%c 功能未开启，跳过打开链接逻辑。', 'color: orange;');
            }
        }
    };
})();




