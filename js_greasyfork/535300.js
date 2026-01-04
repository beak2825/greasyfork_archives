// ==UserScript==
// @name         NSnapshot
// @namespace    http://www.nodeseek.com/
// @version      0.1-beta
// @description  适用于NodeSeek的网页快照，保存当前网页状态
// @author       dabao
// @match        *://*.nodeseek.com/*
// @connect      cfn.pp.ua
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACz0lEQVR4Ae3B32tVdQAA8M85u7aVHObmzJVD0+ssiphstLEM62CBlCBEIAYhUoGGD/kiRUo+9CIEElFZgZJFSApBVhCUX2WFrVQKf5Qy26SgdK4pN7eZu+cbtyfJ/gLx83HD9SAhlEyXupiPhUSTeonRfNw1ws2aRJeN5jHcolFhJJ9M8Zj99piDTnv12SjzfzIb9dmrC7Pttt8ykjDVLsu8ZZ1GH1oqeDofJLtJh4fMEw3Y72jlCuEO2+W+sNJFr3vOZ1YIi8NIGA29hDWhGgZDJ2Rt2ZvZSBazmMUsZsPZ1qwVQmcYDNWwhtAbRsNIWJx6WLPDfgxNVkm9nR8hm+XduLba7F9RtcXztmUzyY/YJrUqNPvBYc0eSS3CwXxMl4WG7CarsyEuvU2HOkRNujSw3PosxR6DFurKxx3E/akFohPo0aDfEO61os5LdrtLVWG1TzxokifdiSH9GnTjuGhBqsWE39GOo3kVi8wsmeVW00SJ200zA9r0kFcdQzv+MKElVW/S+L5EE86pmUth3BV/SzCOCUjMVXMWzfsSYybVl1SlSlESkagpuOI1nzshFX1gyAF1UKhJEKOkJFVNXVBv+pJoBK1qBkh86z1/SaR+9o5zEgoDaloxsiSart6F1Bkl83ESHWEKvvEbqZJETaokgSH9hCk6cBLtSs6kDqEb/cZ0K+MnO0X/VdhRGUBZjzH9uA+HUl+a0BvmO+J7bVZSKWz1kehqhfe9oWalNoccDmW9JnyV+toxsy3PK3aY9Gx4gMp567ziV4WawpCXra+MEhZ5xqTtecVycxzXlxA22OK4ZYbt9LjvrM5PkNUp6zVPdNpBv1QKwt126Paxp8zwqXu8kG8pYZdHlT2Rvxo2aVG2ObyYn65UnXLKVULZZrP02ZRfCms1OmAXCSHRYqrLzuZFaDFV6s/8omuERs0Kl/LzITVTvTHDeXTD9eAftAsSYhXYOWUAAAAASUVORK5CYII=
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @noframes
// @run-at       document-end
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/535300/NSnapshot.user.js
// @updateURL https://update.greasyfork.org/scripts/535300/NSnapshot.meta.js
// ==/UserScript==

/**
 * 更新日志:
 * v0.1-beta (2025-05-08)
 * - 实现基本的网页快照功能
 * - 添加DOM处理功能，优化快照内容
 * - 添加"查看当前页快照"菜单项
 * - 优化URL格式和配置结构
 */

(function() {
    'use strict';

    // 配置参数
    const config = {
        // Cloudflare Worker配置
        workerBase: 'https://nsnapshot.cfn.pp.ua', // Worker完整域名（包含https://）
        previewPath: '/preview',                   // 预览路径
        // 按钮样式
        buttonStyle: `
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 9999;
        `
    };

    // 添加快照按钮
    function addSnapshotButton() {
        const button = document.createElement('button');
        button.textContent = '网页快照';
        button.id = 'webpage-snapshot-btn';
        button.className = 'btn';
        button.style.cssText = config.buttonStyle;
        button.addEventListener('click', takeSnapshot);
        document.body.appendChild(button);
    }

    // 生成快照
    async function takeSnapshot() {
        try {
            // 显示加载状态
            const snapshotBtn = document.getElementById('webpage-snapshot-btn');
            const originalText = snapshotBtn.textContent;
            snapshotBtn.textContent = '生成中...';
            snapshotBtn.disabled = true;

            // 创建隐藏的iframe来加载当前页面
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // 等待iframe加载完成
            await new Promise(resolve => {
                iframe.onload = resolve;
                iframe.src = window.location.href;
            });

            // 获取iframe中的HTML内容
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // 处理特定的DOM元素
            try {
                // 查找id="nsk-right-panel-container"的div元素
                const rightPanelContainer = iframeDoc.getElementById('nsk-right-panel-container');

                if (rightPanelContainer) {
                    // 查找class="user-card"的子元素
                    const userCardElement = rightPanelContainer.querySelector('.user-card');

                    if (userCardElement) {
                        // 获取user-card元素后的下一个兄弟元素
                        const nextSibling = userCardElement.nextElementSibling;

                        // 移除user-card元素
                        userCardElement.remove();

                        // 如果存在下一个兄弟元素，也移除它
                        if (nextSibling) {
                            nextSibling.remove();
                        }

                        // 创建新的登录/注册面板
                        const loginPanel = document.createElement('div');
                        loginPanel.className = 'nsk-panel';
                        loginPanel.innerHTML = `
                            <h4>你好啊，陌生人!</h4>
                            <div class="small-margin">我的朋友，看起来你是新来的，如果想参与到讨论中，点击下面的按钮！</div>
                            <div class="small-margin">
                                <a href="/signIn.html" rel="nofollow" class="btn" style="color:white;margin-right:5px;">登录</a>
                                <a href="/register.html" rel="nofollow" class="btn" style="color:white">注册</a>
                            </div>
                        `;

                        // 将新面板插入到right-panel-container的最前面
                        rightPanelContainer.prepend(loginPanel);

                        console.log('已替换登录/注册面板');
                    }
                }

                // 查找并移除id="temp-script"的script元素
                const tempScript = iframeDoc.getElementById('temp-script');
                if (tempScript) {
                    tempScript.remove();
                    console.log('已移除临时脚本元素 (id="temp-script")');
                }
            } catch (error) {
                console.error('处理DOM元素失败:', error);
                // 继续执行，不影响快照生成
            }

            const htmlContent = '<!DOCTYPE html>' + iframeDoc.documentElement.outerHTML;

            // 清理iframe
            document.body.removeChild(iframe);

            // 创建快照数据对象
            const snapshotData = {
                html: htmlContent,
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // 将对象转换为JSON字符串
            const jsonData = JSON.stringify(snapshotData);

            // 创建表单提交到Cloudflare Worker中间页
            try {
                // 创建表单
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `${config.workerBase}${config.previewPath}`;
                form.target = '_blank';
                form.style.display = 'none';

                // 添加数据字段
                const dataField = document.createElement('textarea');
                dataField.name = 'snapshot_data';
                dataField.value = jsonData;
                form.appendChild(dataField);

                // 添加隐藏的提交按钮，确保表单能够正确提交
                const submitButton = document.createElement('input');
                submitButton.type = 'submit';
                submitButton.style.display = 'none';
                form.appendChild(submitButton);

                // 添加表单到文档并提交
                document.body.appendChild(form);
                form.submit();

                // 移除表单
                setTimeout(() => {
                    document.body.removeChild(form);
                }, 100);

                console.log('快照数据已发送到Cloudflare Worker中间页');
            } catch (error) {
                console.error('发送数据到Cloudflare Worker失败:', error);
                alert('发送快照数据失败，请重试。');
            }

            // 恢复按钮状态
            snapshotBtn.textContent = originalText;
            snapshotBtn.disabled = false;
        } catch (error) {
            console.error('生成快照失败:', error);
            alert('生成快照失败，请重试');

            // 恢复按钮状态
            const snapshotBtn = document.getElementById('webpage-snapshot-btn');
            snapshotBtn.textContent = '网页快照';
            snapshotBtn.disabled = false;
        }
    }

    // 查看当前URL的快照
    function viewSnapshots() {
        // 获取当前URL
        const currentUrl = window.location.href;

        // 构建新的查看快照URL格式：/web/完整URL
        const encodedUrl = encodeURIComponent(currentUrl);
        const viewUrl = `${config.workerBase}/web/${encodedUrl}`;
        GM_openInTab(viewUrl, { active: true, insert: true });
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addSnapshotButton);
        } else {
            addSnapshotButton();
        }

        // 注册油猴菜单
        GM_registerMenuCommand('查看当前页快照', viewSnapshots);
    }

    // 启动脚本
    init();
})();
