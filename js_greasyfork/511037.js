// ==UserScript==
// @name         B站粉丝导出脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在B站粉丝页面添加导出按钮，导出粉丝信息
// @author       hatrd
// @match        https://space.bilibili.com/*/fans/*
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511037/B%E7%AB%99%E7%B2%89%E4%B8%9D%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/511037/B%E7%AB%99%E7%B2%89%E4%B8%9D%E5%AF%BC%E5%87%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个按钮
    const btn = document.createElement('button');
    btn.innerText = '导出粉丝';
    btn.style.position = 'fixed';
    btn.style.top = '10%';
    btn.style.right = '10px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px';
    btn.style.backgroundColor = '#00a1d6';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    // 获取 UID
    const uidMatch = window.location.href.match(/space\.bilibili\.com\/(\d+)\/fans/);
    if (!uidMatch) {
        alert('未找到 UID');
        return;
    }
    const uid = uidMatch[1];

    // 点击按钮时执行导出操作
    btn.addEventListener('click', function() {
        let pageNum = 1;
        const pageSize = 50;
        const maxFans = 1000; // api 限制最多 1000.
        const fansList = [];

        const exportFans = () => {
            // 构建下载的 JSON 文件
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fansList, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `bilibili_fans_${uid}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };

        const fetchFans = () => {
            const url = `https://api.bilibili.com/x/relation/fans?vmid=${uid}&pn=${pageNum}&ps=${pageSize}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0 && result.data && result.data.list.length > 0) {
                        fansList.push(...result.data.list);
                        if (fansList.length < maxFans && result.data.list.length === pageSize) {
                            // 继续获取下一页
                            pageNum++;
                            fetchFans();
                        } else {
                            // 导出粉丝信息
                            exportFans();
                        }
                    } else {
                        alert('导出完成或出错');
                        exportFans();
                    }
                },
                onerror: function() {
                    alert('请求失败，请重试');
                }
            });
        };

        // 开始请求粉丝数据
        fetchFans();
    });
})();
