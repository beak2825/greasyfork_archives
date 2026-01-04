// ==UserScript==
// @name         视频流地址获取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检测并获取网页中的m3u8视频流地址，配合tvbox或影视仓或DLAN使用
// @author       御清弦
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531908/%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531908/%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .m3u8-detector {
            position: fixed;
            top: 10vh;
            right: 10px;
            background: rgba(28, 28, 28, 0.95);
            color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            z-index: 999999;
            max-width: 350px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .m3u8-detector h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #4CAF50;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 8px;
        }
        .m3u8-detector ul {
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 70vh;
            overflow-y: auto;
        }
        .m3u8-detector li {
            margin: 8px 0;
            word-break: break-all;
            background: rgba(255, 255, 255, 0.05);
            padding: 10px;
            border-radius: 4px;
            font-size: 13px;
        }
        .m3u8-detector button {
            background: #4CAF50;
            border: none;
            color: white;
            padding: 6px 12px;
            cursor: pointer;
            border-radius: 4px;
            margin: 5px 0;
            transition: all 0.3s ease;
            font-size: 12px;
            width: 100%;
        }
        .m3u8-detector button:hover {
            background: #45a049;
            transform: translateY(-1px);
        }
        .m3u8-detector:hover {
            transform: scale(1.01);
            transition: transform 0.2s ease;
        }
        .m3u8-detector::-webkit-scrollbar {
            width: 6px;
        }
        .m3u8-detector::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }
        .m3u8-detector::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }
    `);

    // 创建检测面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'm3u8-detector';
        panel.innerHTML = '<h3 style="margin: 0 0 10px 0">视频流地址</h3><ul id="m3u8-list"></ul>';
        document.body.appendChild(panel);
        return panel;
    }

    // 检测m3u8地址
    function detectM3U8() {
        const foundUrls = new Set();
        
        // 监听XHR请求
        const originalXHR = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(method, url) {
            if (url && url.includes('.m3u8')) {
                addUrl(url);
            }
            return originalXHR.apply(this, arguments);
        };

        // 监听Fetch请求
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (url && typeof url === 'string' && url.includes('.m3u8')) {
                addUrl(url);
            }
            return originalFetch.apply(this, arguments);
        };

        // 检查video标签的src属性
        function checkVideoTags() {
            const videos = document.getElementsByTagName('video');
            for (const video of videos) {
                if (video.src && video.src.includes('.m3u8')) {
                    addUrl(video.src);
                }
            }
        }

        // 检查source标签
        function checkSourceTags() {
            const sources = document.getElementsByTagName('source');
            for (const source of sources) {
                if (source.src && source.src.includes('.m3u8')) {
                    addUrl(source.src);
                }
            }
        }

        // 添加URL到面板
        function addUrl(url) {
            if (!foundUrls.has(url)) {
                foundUrls.add(url);
                const list = document.getElementById('m3u8-list');
                const li = document.createElement('li');
                const copyButton = document.createElement('button');
                copyButton.textContent = '复制地址';
                copyButton.addEventListener('click', () => {
                    GM_setClipboard(url);
                    copyButton.textContent = '已复制!';
                    setTimeout(() => {
                        copyButton.textContent = '复制地址';
                    }, 1000);
                });
                
                li.textContent = url;
                li.appendChild(document.createElement('br'));
                li.appendChild(copyButton);
                list.appendChild(li);
            }
        }

        // 定期检查视频标签
        setInterval(() => {
            checkVideoTags();
            checkSourceTags();
        }, 2000);
    }

    // 初始化
    createPanel();
    detectM3U8();
})(); 