// ==UserScript==
// @name         [0]Pornhub下载
// @namespace    https://github.com/ekoooo/tampermonkey_pornhub_video_download
// @version      1.0
// @description  优化代码结构，使用 async/await 替代同步请求，提高脚本健壮性和兼容性，增加备用视频地址解析方案和错误通知。
// @author       Gemini
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.pornhubpremium.com/view_video.php?viewkey=*
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545166/%5B0%5DPornhub%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/545166/%5B0%5DPornhub%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入CSS样式
    GM_addStyle(`
    .download-urls {
        background-color: #1f1f1f;
        padding: 15px;
        margin-top: 10px;
        border-radius: 5px;
        color: #fff;
    }
    .download-urls h3 {
        margin-bottom: 10px;
        font-size: 16px;
        border-bottom: 1px solid #444;
        padding-bottom: 5px;
    }
    .download-urls ul {
      margin: 0;
      padding: 0;
      list-style: none;
      font-weight: bold;
      line-height: 1.8;
    }
    .download-urls ul li {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    .download-url-label {
      text-align: right;
      min-width: 80px;
      margin-right: 10px;
      color: #ff9900;
    }
    .download-url-input {
      flex-grow: 1;
      font-size: 12px;
      padding: 3px 8px;
      border: 1px solid #555;
      background-color: #333;
      color: #fff;
      margin: 0 10px;
      border-radius: 3px;
    }
    .download-url-open {
      color: #4f8edc;
      text-decoration: none;
    }
    .download-url-open:hover {
      text-decoration: underline;
    }
    `);

    class VideoDownloader {
        /**
         * 异步获取视频信息
         */
        static async getUrlInfo() {
            const flashvarsKey = Object.keys(unsafeWindow).find(key => key.startsWith('flashvars_'));
            if (!flashvarsKey) {
                const message = '错误：未找到 flashvars！脚本可能已失效。';
                console.error(message);
                GM_notification({ text: message, title: 'Pornhub 下载脚本' });
                return [];
            }

            const mediaDefinitions = unsafeWindow[flashvarsKey]?.mediaDefinitions;
            if (!mediaDefinitions || !Array.isArray(mediaDefinitions)) {
                const message = '错误：未找到 mediaDefinitions！';
                console.error(message, unsafeWindow[flashvarsKey]);
                GM_notification({ text: message, title: 'Pornhub 下载脚本' });
                return [];
            }

            // 方案一：通过远程地址获取（通常是最高质量的源）
            const remoteDefinition = mediaDefinitions.find(video => video.remote);
            if (remoteDefinition?.videoUrl) {
                try {
                    const data = await $.getJSON(remoteDefinition.videoUrl);
                    if (data && Array.isArray(data) && data.length > 0) {
                        return data.map(item => ({
                                quality: `${item.quality}p`,
                                url: item.videoUrl
                            }))
                            .sort((a, b) => parseInt(b.quality, 10) - parseInt(a.quality, 10));
                    }
                } catch (error) {
                    const message = `获取远程视频信息失败，将尝试备用方案。错误: ${error.statusText}`;
                    console.error(message, error);
                    GM_notification({ text: message, title: 'Pornhub 下载脚本', timeout: 5000 });
                }
            }
            
            // 方案二：如果远程地址获取失败或不存在，直接从页面变量中解析
            console.log('未找到远程视频地址或获取失败，尝试从页面直接解析...');
            const directVideos = mediaDefinitions
                .filter(def => def.videoUrl && String(def.quality).match(/^\d+$/))
                .map(def => ({
                    quality: `${def.quality}p`,
                    url: def.videoUrl
                }))
                .sort((a, b) => parseInt(b.quality, 10) - parseInt(a.quality, 10));

            if (directVideos.length > 0) {
                console.log('备用方案解析成功！');
                return directVideos;
            }

            const finalMessage = '致命错误：所有方案都未能获取到视频地址！';
            console.error(finalMessage);
            GM_notification({ text: finalMessage, title: 'Pornhub 下载脚本' });
            return [];
        }

        /**
         * 将视频链接注入到DOM中
         * @param {Array<{quality: string, url: string}>} urlInfo - 视频信息数组
         */
        static injectUrls2Dom(urlInfo) {
            const li = urlInfo.map(item => `
            <li>
              <span class="download-url-label">[ ${item.quality} ]</span>
              <input class="download-url-input" value="${item.url}" readonly onfocus="this.select();" />
              <a target="_blank" class="download-url-open" href="${item.url}">在新标签页中打开</a>
            </li>
          `).join('');

            $('#player').after(`<div class="download-urls"><h3>视频下载地址 (清晰度从高到低):</h3><ul>${li}</ul></div>`);
        }
        
        /**
         * 脚本初始化
         */
        static async init() {
            const urlInfo = await this.getUrlInfo();
            if (urlInfo && urlInfo.length > 0) {
                this.injectUrls2Dom(urlInfo);
            } else {
                console.warn('Pornhub 下载脚本：未能获取到任何视频链接。');
            }
        }
    }

    // --- 脚本启动逻辑 ---
    const playerDiv = document.querySelector('#player');
    if (playerDiv) {
        const observer = new MutationObserver((mutations, obs) => {
            obs.disconnect(); // 观察到变化后立即停止，防止重复执行
            setTimeout(() => {
                VideoDownloader.init();
            }, 500); // 延迟执行，确保播放器及相关JS完全加载
        });

        observer.observe(playerDiv, {
            childList: true,
            subtree: true,
        });
    } else {
        console.warn('Pornhub 下载脚本：未找到 #player 播放器容器，脚本已停止。');
    }
})();