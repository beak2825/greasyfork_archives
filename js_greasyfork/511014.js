// ==UserScript==
// @name         rsshub helper
// @namespace    http://tampermonkey.net/
// @description  Make copy rsshub link easy.
// @author       xiaxuchen
// @match        https://rsshub.netlify.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant GM_xmlhttpRequest
// @grant GM_download
// @license MIT
// @version 2024-10-01-v2
// @connect https://rsshub.rssforever.com/
// @connect https://rsshub.feeded.xyz/
// @connect https://hub.slarker.me/
// @connect https://rsshub.liumingye.cn/
// @connect https://rsshub-instance.zeabur.app/
// @connect https://rss.fatpandac.com/
// @connect https://rsshub.pseudoyu.com/
// @connect https://rsshub.friesport.ac.cn/
// @connect https://rsshub.friesport.ac.cn/us
// @connect https://rsshub.atgw.io/
// @connect https://rsshub.rss.tips/
// @connect https://rsshub.mubibai.com/
// @connect https://rsshub.ktachibana.party/
// @connect https://rsshub.woodland.cafe/
// @connect https://rsshub.aierliz.xyz/
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/511014/rsshub%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/511014/rsshub%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ORIGIN_HOST = 'https://rsshub.app/';
    const INSTANCE_PAGE = 'https://rsshub.netlify.app/zh/instances';
    const KEY_RETURN_URL = 'returnUrl';
    const KEY_INSTANCES = 'instanceList';
    // 尝试从localStorage中获取已经填充的列表
    let list = JSON.parse(localStorage.getItem(KEY_INSTANCES)) || [];
    function checkList() {
        if (location.href.startsWith(INSTANCE_PAGE)) {
            console.log("In instance page, skip check list and prepare to refresh list");
            return;
        }
        // 检查列表是否为空
        if (list.length === 0) {
            console.log("Instance list is empty and go to instance page to acquire.")
            // 保存当前页面的URL
            const currentUrl = window.location.href;

            // 将当前页面的URL存储在localStorage中
            localStorage.setItem(KEY_RETURN_URL, currentUrl);

            // 跳转到获取实例信息的页面
            window.location.href = INSTANCE_PAGE;
        } else {
            // 如果列表不为空，直接使用列表
            console.log('List is already filled:', list);
        }
    }

    function saveInstances() {
        if (!location.href.startsWith(INSTANCE_PAGE)) {
            console.log("Not instance page, skip instance save");
            return;
        }
        list = [];
        // 获取ID为'public'的元素
        const publicElement = document.getElementById('public');
        if (publicElement) {
            // 获取ID为'public'的元素下的所有表格
            const table = publicElement.nextElementSibling;
            // 获取表格中的所有行
            const rows = table.getElementsByTagName('tr');

            // 遍历每行
            for (let row of rows) {
                // 获取行中的第一个单元格
                const firstCell = row.getElementsByTagName('td')[0];
                if (firstCell) {
                    const cellA = firstCell.getElementsByTagName('a')[0];
                    list.push(cellA.href);
                }
            }
            console.log(`${list.length} instances found: ${list.join(",")}`);
            localStorage.setItem(KEY_INSTANCES, JSON.stringify(list));
            const returnUrl = localStorage.getItem(KEY_RETURN_URL);
            if (returnUrl) {
                console.log(`ReturnUrl found and prepare to return`);
                localStorage.removeItem(KEY_RETURN_URL);
                location.href = returnUrl;
            }
        } else {
            console.error("Element with ID 'public' not found.");
        }

    }
    function getInstanceUrl(url, host) {
        return url.replace(ORIGIN_HOST, host);
    }

    function checkReq(url) {
        let p = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: function(response) {
                    // 解析响应数据
                    if (response.status === 200) {
                        console.log(`Request success: ${url}`);
                        resolve(url);
                    } else {
                        console.error(`Request failed: ${url}`);
                        reject(`Request failed: ${url}`);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
        return p;
    }
    async function getUpUrl(url) {
        console.log("Get up url.");
        return Promise.any(list.map(host => getInstanceUrl(url, host)).map(item => checkReq(item)));
    }
    async function writeToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text successfully copied to clipboard:', text);
        } catch (err) {
            console.error('Failed to write to clipboard:', err);
        }
    }
    function init() {
        // 尝试从localStorage中获取已经填充的列表
        list = JSON.parse(localStorage.getItem(KEY_INSTANCES)) || [];
        checkList();
        saveInstances();
    }
    // 等待页面加载完成
    window.addEventListener('load', async () => {
        init();
        // 添加复制事件监听器
        document.addEventListener('copy', async function(event) {
            init();
            if (list.length == 0) {
                return;
            }
            // 获取选中的文本
            const selection = window.getSelection().toString().trim();
            if (!selection.startsWith(ORIGIN_HOST)) {
                return;
            }
            const path = prompt("拦截复制，请确认需要获取镜像的path(可修改):", selection.slice(ORIGIN_HOST.length));
            if (path == null) {
                return;
            }
             // 阻止默认的复制行为
            event.preventDefault();
            try {
                const upUrl = await getUpUrl(ORIGIN_HOST + path);
                // 将修改后的文本设置到剪贴板
                if (event.clipboardData) {
                    await writeToClipboard(upUrl);
                    console.log(`Original text: ${selection}`);
                    console.log(`Modified text: ${upUrl}`);
                    alert(`链接已写入剪切板，${upUrl}`);
                }
            } catch (e) {
                alert("所有镜像都无法访问该地址.");
                return;
            }
        });

    });
})();