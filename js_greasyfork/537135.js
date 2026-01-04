// ==UserScript==
// @name         Save to Eagle (Danbooru+Sankaku)
// @namespace    your-namespace
// @version      0.2.1
// @description  支持Danbooru和Sankaku的图片保存到Eagle
// @author       your-name
// @match        *://danbooru.donmai.us/posts/*
// @match        *://safebooru.donmai.us/posts/*
// @match        https://chan.sankakucomplex.com/*/posts/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/537135/Save%20to%20Eagle%20%28Danbooru%2BSankaku%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537135/Save%20to%20Eagle%20%28Danbooru%2BSankaku%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Eagle配置
    const EAGLE_API = "http://localhost:41595/api/item/addFromURL";

    // 初始化入口
    function init() {
        if (isDanbooru()) {
            setupDanbooru();
        } else if (isSankaku()) {
            setupSankaku();
        }
    }

    // 网站检测
    function isDanbooru() {
        return /danbooru|safebooru/.test(location.hostname);
    }

    function isSankaku() {
        return location.hostname.includes('sankakucomplex');
    }

    // ======================
    // Danbooru功能实现
    // ======================
    function setupDanbooru() {
        const button = createButton('⬇️ 保存到Eagle');
        insertDanbooruButton(button);
        button.addEventListener('click', handleDanbooruDownload);
    }

    function insertDanbooruButton(button) {
        const target = document.querySelector('.tag-list h3:first-child') ||
                      document.querySelector('#sidebar section:first-child');
        target?.parentNode.insertBefore(button, target);
    }

    async function handleDanbooruDownload() {
        try {
            const data = {
                url: getDanbooruImageURL(),
                name: getDanbooruFilename(),
                website: location.href.split('?')[0],
                tags: getDanbooruTags(),
                headers: { referer: location.href }
            };
            await sendToEagle(data);
            showNotification('Danbooru下载成功', data.name);
        } catch (error) {
            showNotification('Danbooru下载失败', error.message);
        }
    }

    function getDanbooruImageURL() {
        const link = document.querySelector('#post-info-size a');
        if (!link) throw new Error('找不到原图链接');
        return link.href;
    }

    function getDanbooruFilename() {
        return new URL(getDanbooruImageURL()).pathname.split('/').pop();
    }

    function getDanbooruTags() {
        // 通过 name 属性定位 textarea，按空格分割标签
        const textarea = document.querySelector('textarea[name="post[tag_string]"]');
        if (!textarea) throw new Error('Danbooru: 未找到标签输入框');
        return textarea.value.split(/\s+/).filter(tag => tag.trim());
    }

    // ======================
    // Sankaku功能实现
    // ======================
    function setupSankaku() {
        const button = createButton('⬇️ 保存到Eagle');
        insertSankakuButton(button);
        button.addEventListener('click', handleSankakuDownload);
    }

    function insertSankakuButton(button) {
        const target = document.querySelector('div.sidebar div[style*="margin-bottom: 1em"]');
        target?.parentNode.insertBefore(button, target);
    }

    async function handleSankakuDownload() {
        try {
            const { url, name } = parseSankakuDownloadLink();
            const data = {
                url: url,
                name: name,
                website: location.href.split('?')[0],
                tags: getSankakuTags(),
                headers: { referer: location.href }
            };
            await sendToEagle(data);
            showNotification('Sankaku下载成功', data.name);
        } catch (error) {
            showNotification('Sankaku下载失败', error.message);
        }
    }

    function parseSankakuDownloadLink() {
         // 精准获取Original链接
                const links = Array.from(document.querySelectorAll('a[onclick*="prepare_download"]'))
                    .filter(link => {
                        const onclickStr = link.onclick.toString();
                        return onclickStr.includes('prepare_download') &&
                               !onclickStr.includes('/sample/');
                    });

                if (links.length === 0) return null;

                // 增强参数解析
                const match = links[0].onclick.toString().match(
                    /prepare_download\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/
                );

                if (!match) return null;

                // 从第二个参数获取完整文件名
                const baseName = match[2];
                const extMatch = match[1].match(/\.\w+(\?|$)/);
                const extension = extMatch ? extMatch[0].split('?')[0] : '';

        return {
            url: `https:${match[1].replace(/&amp;/g, '&')}`,
            name: `${baseName}${extension}`
        };
    }

    function getFileExtension(url) {
        const filename = url.split('/').pop().split('?')[0];
        return filename.includes('.') ?
            filename.slice(filename.lastIndexOf('.')) :
            '.jpg';
    }

    function getSankakuTags() {
        const textarea = document.querySelector('textarea[name="post[tags]"]');
        if (!textarea) throw new Error('Sankaku: 未找到标签输入框');
        return textarea.value.split(/\s+/).filter(tag => tag.trim());
    }

    // ======================
    // 通用功能
    // ======================
    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            margin: 0 0 10px 0;
            background: #4CAF50;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        return button;
    }

    function sendToEagle(data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: EAGLE_API,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: (res) => {
                    if (res.status === 200) resolve(JSON.parse(res.responseText));
                    else reject(new Error(`HTTP ${res.status}: ${res.statusText}`));
                },
                onerror: (err) => reject(new Error("连接Eagle失败"))
            });
        });
    }

    function showNotification(title, message) {
        GM_notification({
            title: title,
            text: message,
            timeout: 3000,
            highlight: !title.includes('失败')
        });
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();