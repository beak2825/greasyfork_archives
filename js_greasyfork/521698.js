// ==UserScript==
// @name         B站身份码一键获取
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在页面左上角添加一个可拖动的按钮，点击以获取并复制Bilibili身份码，修复了拖动后误触发复制的问题
// @author       与歌一生
// @match        *://*.bilibili.com/*
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521698/B%E7%AB%99%E8%BA%AB%E4%BB%BD%E7%A0%81%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521698/B%E7%AB%99%E8%BA%AB%E4%BB%BD%E7%A0%81%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮并添加样式及拖动功能
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.top = '120px';
    button.style.left = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '5px 10px';
    button.style.border = 'none';
    button.style.backgroundColor = '#ADD8E6';
    button.style.color = 'white';
    button.style.borderRadius = '5px';
    button.textContent = '获取身份码';
    document.body.appendChild(button);

    let isDragging = false;
    let offsetX, offsetY;

    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - button.offsetLeft;
        offsetY = e.clientY - button.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        button.style.left = `${e.clientX - offsetX}px`;
        button.style.top = `${e.clientY - offsetY}px`;
        button.style.pointerEvents = 'none'; // 禁用点击事件
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        button.style.pointerEvents = ''; // 重新启用点击事件
    }

    button.addEventListener('click', async () => {
        if (isDragging) return; // 如果正在拖动，则不执行点击事件
        try {
            const uri = 'https://api.live.bilibili.com/xlive/open-platform/v1/common/operationOnBroadcastCode';
            const csrf_token = /bili_jct=([a-zA-Z0-9]*)/.exec(document.cookie)[1];
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Sec-Fetch-Mode": "cors"
            };
            const referrer = 'https://link.bilibili.com/p/center/index';

            const res = await fetch(uri, {
                headers,
                referrer,
                body: `action=1&csrf_token=${csrf_token}&csrf=${csrf_token}`,
                method: "POST",
                mode: "cors",
                credentials: "include"
            });

            const result = await res.json();
            if (result.code === 0 && result.data && result.data.code) {
                await GM_setClipboard(result.data.code);
                if (typeof Swal === 'function') {
                    Swal.fire({
                        icon: 'success',
                        title: '成功',
                        text: '身份码已复制到剪贴板！',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    alert('身份码已复制到剪贴板！');
                }
            } else {
                if (typeof Swal === 'function') {
                    Swal.fire({
                        icon: 'error',
                        title: '错误',
                        text: '获取身份码失败，请检查网络或重试！',
                    });
                } else {
                    alert('获取身份码失败，请检查网络或重试！');
                }
            }
        } catch (error) {
            console.error('发生错误:', error);
            if (typeof Swal === 'function') {
                Swal.fire({
                    icon: 'error',
                    title: '错误',
                    text: '发生了未知错误！',
                });
            } else {
                alert('发生了未知错误！');
            }
        }
    });

    // 确保SweetAlert2已加载
    if (typeof Swal === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(script);
    }
})();