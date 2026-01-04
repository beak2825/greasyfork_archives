// ==UserScript==
// @name         HighPorn 视频链接提取（另存为mp4格式）
// @namespace    https://greasyfork.org/
// @version      1.3
// @description  在 highporn.net 视频页中插入“另存为...”按钮
// @author       You
// @match        https://highporn.net/video/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541527/HighPorn%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%EF%BC%88%E5%8F%A6%E5%AD%98%E4%B8%BAmp4%E6%A0%BC%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541527/HighPorn%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%EF%BC%88%E5%8F%A6%E5%AD%98%E4%B8%BAmp4%E6%A0%BC%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.__injectedVideoLinkUI) return;
    window.__injectedVideoLinkUI = false;

    function createSaveAsUI(videoUrl) {
        if (window.__injectedVideoLinkUI) return;
        window.__injectedVideoLinkUI = true;

        const container = document.createElement('div');
        container.style.cssText = `
            background: #111;
            color: white;
            padding: 6px 8px;
            border: 2px solid #007bff;
            margin: 10px auto;
            font-size: 13px;
            width: 90%;
            border-radius: 8px;
            line-height: 1.3;
            text-align: left;
        `;

        container.innerHTML = `
            <h3 style="color:#00ccff; margin: 0 0 6px 0; font-weight: normal; font-size: 16px;">🎬 视频链接已检测，可手动下载，复制或者直接点击链接无效</h3>
            <div style="margin: 0;">
                <a href="${videoUrl}" target="_blank" style="color: skyblue; word-break: break-all; font-size: 13px;">${videoUrl}</a>
                <button class="saveas-btn">请右键单击链接另存为...</button>
            </div>
            <style>
                .saveas-btn {
                    padding: 3px 8px;
                    font-size: 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                    background-color: #007bff;
                    margin-left: 10px;
                    vertical-align: middle;
                }
                .saveas-btn:hover {
                    background-color: #0056b3;
                }
            </style>
        `;

        const button = container.querySelector('.saveas-btn');
        button.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = videoUrl;
            a.target = '_blank';
            a.rel = 'noopener';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

        const userBlock = document.querySelector('.pull-left.user-container');
        if (userBlock && userBlock.parentNode) {
            userBlock.parentNode.insertBefore(container, userBlock.nextSibling);
        } else {
            document.body.appendChild(container);
        }
    }

    function waitForVideoSrc() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video.jw-video');
            if (video && video.src && !window.__injectedVideoLinkUI) {
                console.log('[Tampermonkey] 视频地址:', video.src);
                createSaveAsUI(video.src);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            const video = document.querySelector('video.jw-video');
            if (video && video.src && !window.__injectedVideoLinkUI) {
                createSaveAsUI(video.src);
                observer.disconnect();
            }
        }, 5000);
    }

    waitForVideoSrc();
})();
