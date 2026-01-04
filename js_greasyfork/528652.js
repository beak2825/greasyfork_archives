// ==UserScript==
// @name         Telegram中文群组抓取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  抓取成员数900-1200的中文Telegram群组
// @author       YourName
// @match        https://t.me/*
// @match        https://tgstat.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      tgstat.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528652/Telegram%E4%B8%AD%E6%96%87%E7%BE%A4%E7%BB%84%E6%8A%93%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528652/Telegram%E4%B8%AD%E6%96%87%E7%BE%A4%E7%BB%84%E6%8A%93%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const TARGET_MEMBERS_MIN = 900;
    const TARGET_MEMBERS_MAX = 1200;
    const CHINESE_KEYWORDS = ['中文', '华语', '中国', '台灣', '香港'];

    // 主逻辑
    function startScraping() {
        let groups = [];

        // 在TGStat的搜索页面
        if (window.location.host === 'tgstat.com') {
            scrapeTGStatGroups();
        }

        // 在Telegram网页端
        if (window.location.host === 't.me') {
            scrapeTelegramWeb();
        }
    }

    // 处理TGStat数据
    function scrapeTGStatGroups() {
        $('.group-item').each(function() {
            const title = $(this).find('.title').text();
            const members = parseInt($(this).find('.members').text().replace(/,/g, ''));
            const link = $(this).find('a').attr('href');

            if (isValidGroup(title, members)) {
                groups.push({title, members, link});
            }
        });

        if (groups.length < 100) {
            $('.pagination-next').click();
            setTimeout(scrapeTGStatGroups, 2000);
        } else {
            exportData();
        }
    }

    // 验证群组条件
    function isValidGroup(title, members) {
        const hasChinese = CHINESE_KEYWORDS.some(kw => title.includes(kw));
        return hasChinese && 
               members >= TARGET_MEMBERS_MIN && 
               members <= TARGET_MEMBERS_MAX;
    }

    // 导出数据
    function exportData() {
        const csvContent = "名称,人数,链接\n" +
            groups.map(g => `"${g.title}",${g.members},${g.link}`).join("\n");

        GM_download({
            filename: "telegram_groups.csv",
            data: csvContent,
            mimeType: "text/csv"
        });
    }

    // 初始化
    $(document).ready(function() {
        if (confirm('要开始抓取中文群组吗？')) {
            startScraping();
        }
    });
})();