// ==UserScript==
// @name         Radar-生成摘要(markdown)
// @namespace    http://tampermonkey.net/
// @version      2025-08-04
// @description  Radar-生成摘要并拷贝（可直接粘贴到学城文档）
// @author       Lucas
// @match        https://radar.mws.sankuai.com/*
// @match        https://radar.mws.keetapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544692/Radar-%E7%94%9F%E6%88%90%E6%91%98%E8%A6%81%28markdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544692/Radar-%E7%94%9F%E6%88%90%E6%91%98%E8%A6%81%28markdown%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取数据
    function getDataMap() {
        const trs = document.getElementsByTagName('tr');

        let dataMap = {};

        // 第0行是表头，从第1行开始遍历
        for (var i = 1; i < trs.length; i++) {
            const tds = trs[i].getElementsByTagName('td');
            const link = tds[1].getElementsByTagName('a')[0];
            const td1 = tds[1].innerText.split('\n')[0];
            const td2 = tds[2].innerText;
            const td3 = tds[3].innerText;
            const href = getNewListHref(link?.href, td1, td2);
            const key = `${td3}|${td1}|${td2}|`;

            if (!dataMap[key]) {
                dataMap[key] = {
                    td1: td1,
                    td2: td2,
                    td3: td3,
                    href: href,
                    count: 0
                };
            }
            dataMap[key].count++;
        }

        // console.info(dataMap);
        return dataMap;
    }

    // 生成新的href（指定条件的告警列表）
    function getNewListHref(href, appkey, metric){

        var hrefPre = href.split('&alertId=')[0];
        metric = encodeURIComponent(metric).replace('(', escape('(')).replace(')', escape(')'))
        // console.info(metric);

        return `${hrefPre}&appkey=${appkey}&metric=${metric}`;
    }

    // 生成markdown
    function getMarkdown(dataMap) {

        const ths = document.getElementsByTagName('th');
        const th1 = ths[1].innerText;
        const th2 = ths[2].innerText;
        const th3 = ths[3].innerText;


        let markdown = `| ${th1} | ${th2} | ${th3} | 数量 | 链接 |\n`;
        markdown += `|-------|-------|-------|-------|-------|\n`;

        // 对结果排序
        const sortMap = Object.values(dataMap).sort((a, b) => {

            if (a.td3 !== b.td3) {
                return a.td3.localeCompare(b.td3);
            }

            if (b.count !== a.count) {
                return b.count - a.count;
            }

            if (a.td1 !== b.td1) {
                return a.td1.localeCompare(b.td1);
            }

            if (a.td2 !== b.td2) {
                return a.td2.localeCompare(b.td2);
            }

            return 0;
        });

        for (var i = 0; i < sortMap.length; i++) {
            var data = sortMap[i];
            markdown += `| ${data.td1} | ${data.td2} | ${data.td3} | ${data.count} | [详情](${data.href}) |\n`;
        }

        return markdown;
    }

    // 拷贝数据
    function copyData() {
        var dataMap = getDataMap();
        var markdown = getMarkdown(dataMap);

        // console.info(markdown);
        window.focus();
        navigator.clipboard.writeText(markdown);
    }

    // 添加操作按钮
    function addCopyButton() {
        const parent = document.getElementsByClassName('btn-ranking')[0];
        if (!parent) {
            return false;
        }
        const button = document.getElementsByClassName('ql-copy-button')[0];
        if (button) {
            return true;
        }
        // 文档左移，避免被覆盖
        const search = document.getElementsByClassName('search-faq');
        search[0].style.paddingRight = '100px';

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'btn-ranking_select mtd-btn ql-copy-button';
        copyButton.style.marginRight = '12px';
        copyButton.textContent = '拷贝摘要';
        copyButton.onclick = copyData;
        parent.appendChild(copyButton);
        return true;
    }

    // 执行
    setInterval(addCopyButton, 1000);

})();