// ==UserScript==
// @name         小宇宙播客音频下载
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  基于CC-BY-4.0协议的小宇宙音频下载工具，允许修改但需署名
// @author       YourName
// @match        *://*.xiaoyuzhoufm.com/*
// @match        *://*.xyzcdn.net/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @connect      xyzcdn.net
// @license      CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/532204/%E5%B0%8F%E5%AE%87%E5%AE%99%E6%92%AD%E5%AE%A2%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532204/%E5%B0%8F%E5%AE%87%E5%AE%99%E6%92%AD%E5%AE%A2%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * 本脚本遵循 Creative Commons Attribution 4.0 International License (CC-BY-4.0) 协议
 * 您可以自由地：
 * - 共享：在任何媒介以任何形式复制、发行本作品
 * - 修改：修改、转换或以本作品为基础进行创作
 * 
 * 惟须遵守以下条件：
 * - 署名：您必须给出适当的署名，提供指向本许可协议的链接，
 *   同时标明是否（对原始作品）作了修改。您可以用任何合理的方式
 *   来署名，但不得以任何方式暗示许可人为您或您的使用背书。
 * 
 * 完整协议文本：https://creativecommons.org/licenses/by/4.0/legalcode
 */

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 检查是否已存在下载按钮
        if (document.getElementById('xyz-download-btn')) return;

        // 创建下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'xyz-download-btn';
        downloadBtn.innerHTML = '⬇️ 下载音频';
        Object.assign(downloadBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 15px',
            backgroundColor: '#ff2442',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });

        // 添加按钮到页面
        document.body.appendChild(downloadBtn);

        // 点击事件处理
        downloadBtn.addEventListener('click', async function() {
            // 查找音频元素
            const audioElement = document.querySelector('audio');
            if (!audioElement) {
                alert('未找到音频元素！请先播放节目');
                return;
            }

            // 获取音频URL
            const audioUrl = audioElement.src;
            if (!audioUrl) {
                alert('未找到音频链接！');
                return;
            }

            // 获取节目标题作为文件名
            let podcastTitle = '小宇宙播客';
            const titleElement = document.querySelector('header h1');
            if (titleElement) {
                podcastTitle = titleElement.textContent.trim();
                // 清理文件名中的非法字符
                podcastTitle = podcastTitle.replace(/[\\/:*?"<>|]/g, '');
            }

            // 从URL中提取文件扩展名
            let fileExt = '.m4a';
            const extMatch = audioUrl.match(/\.(m4a|mp3|aac|ogg|wav)(?=\?|$)/i);
            if (extMatch) {
                fileExt = extMatch[0];
            }

            // 更新按钮状态
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '⏳ 下载中...';

            try {
                // 使用GM_xmlhttpRequest获取音频数据（避免CORS问题）
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: audioUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        const blob = response.response;
                        // 使用FileSaver保存文件
                        saveAs(blob, `${podcastTitle}${fileExt}`);
                        downloadBtn.innerHTML = '✅ 下载完成';
                        setTimeout(() => {
                            downloadBtn.innerHTML = '⬇️ 下载音频';
                            downloadBtn.disabled = false;
                        }, 2000);
                    },
                    onerror: function(error) {
                        console.error('下载失败:', error);
                        downloadBtn.innerHTML = '❌ 下载失败';
                        setTimeout(() => {
                            downloadBtn.innerHTML = '⬇️ 下载音频';
                            downloadBtn.disabled = false;
                        }, 2000);
                        // 尝试备用方法
                        fallbackDownload(audioUrl, `${podcastTitle}${fileExt}`);
                    }
                });
            } catch (e) {
                console.error('下载出错:', e);
                // 尝试备用方法
                fallbackDownload(audioUrl, `${podcastTitle}${fileExt}`);
            }
        });

        // 备用下载方法
        function fallbackDownload(url, filename) {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                downloadBtn.innerHTML = '✅ 下载完成';
                setTimeout(() => {
                    downloadBtn.innerHTML = '⬇️ 下载音频';
                    downloadBtn.disabled = false;
                }, 2000);
            }, 100);
        }
    });

    // 监听音频元素变化（动态加载内容）
    const observer = new MutationObserver(function(mutations) {
        if (!document.getElementById('xyz-download-btn') && document.querySelector('audio')) {
            // 如果音频元素后加载，重新触发按钮创建
            const event = new Event('load');
            window.dispatchEvent(event);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();