// ==UserScript==
// @name         115 一键离线下载
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  检测网页中力链接，添加 115 离线下载图标v1.7
// @author       s_____________
// @match        https://fc2ppvdb.com/*
// @match        https://fd2ppv.cc/*
// @match        https://sehuatang.org/*
// @match        https://hjd2048.com/*
// @match        https://nyaa.si/*
// @match        https://sukebei.nyaa.si/*
// @match        https://btdig.com/*
// @match        https://btsow.lol/*
// @match        https://cn.torrentkitty.live/*
// @match        https://wuji.me/*
// @match        https://share.dmhy.org/*
// @match        https://mikanani.me/*
// @match        https://www.yinfans.me/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAATNJREFUOE9j1A+YtP/T1x8ODGQAPm6OA4yKrl3/ydAL10I7A2oznRgs9GRRHPf52y+GiOLlKGJYXaCrJsGwcUosw4HT9xhu3HsN17D14E2Gq3deEjZgYUcog766JINd7EyGT19+4g0iDBeY68kyLO+JAGv6+/cfw+XbLxkWbjzHsHHvNawGYRjAwc7CICspwKCtIsbgaavO4GqpAta4bMtFhppJuzAMIRgLtsYKDDMbAhlABkeUrGA4dekx4TBAt6Y8xZ4hPcyMoW/BEYYpy46TbgBIM8iQ+il7GBZvOk+aASCnb5wSxyAqyM3gkjyX4d3Hb8QZANJobajAUJRgzcDHzcGQ3bKJ4dLN54QDkZmZicFMV4bBUFMKrBiUkA6ffcDw+89f4qKR1IzFSEl25ufhOAAAPih3xRx8STAAAAAASUVORK5CYII=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527948/115%20%E4%B8%80%E9%94%AE%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/527948/115%20%E4%B8%80%E9%94%AE%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 115 API
    const API_URL = 'https://115.com/web/lixian/?ct=lixian&ac=add_task_url';
    const LIST_URL = 'https://115.com/web/lixian/?ct=lixian&ac=task_lists';

    // 图标 Base64
    const ICON_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAATNJREFUOE9j1A+YtP/T1x8ODGQAPm6OA4yKrl3/ydAL10I7A2oznRgs9GRRHPf52y+GiOLlKGJYXaCrJsGwcUosw4HT9xhu3HsN17D14E2Gq3deEjZgYUcog766JINd7EyGT19+4g0iDBeY68kyLO+JAGv6+/cfw+XbLxkWbjzHsHHvNawGYRjAwc7CICspwKCtIsbgaavO4GqpAta4bMtFhppJuzAMIRgLtsYKDDMbAhlABkeUrGA4dekx4TBAt6Y8xZ4hPcyMoW/BEYYpy46TbgBIM8iQ+il7GBZvOk+aASCnb5wSxyAqyM3gkjyX4d3Hb8QZANJobajAUJRgzcDHzcGQ3bKJ4dLN54QDkZmZicFMV4bBUFMKrBiUkA6ffcDw+89f4qKR1IzFSEl25ufhOAAAPih3xRx8STAAAAAASUVORK5CYII=';

    // ---------- 提示气泡容器 ----------
    const toastContainer = document.createElement('div');
    toastContainer.id = 'grok-115-toast';
    toastContainer.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 2147483647;
        display: flex; flex-direction: column; gap: 8px;
        align-items: flex-end;          /* 右对齐，宽度独立 */
        font-family: sans-serif;
    `;
    document.body.appendChild(toastContainer);

    // ---------- 显示提示气泡 ----------
    function showToast(msg, duration = 5000, onClick = null) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: rgba(0,0,0,0.85); color: #fff; padding: 10px 16px;
            border-radius: 6px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: ${onClick ? 'pointer' : 'default'}; transition: opacity 0.4s; opacity: 0;
            user-select: none; backdrop-filter: blur(4px);
            min-width: fit-content;          /* 内容决定宽度 */
            max-width: 300px;                /* 防止超长文字撑满屏幕 */
            word-break: break-all;           /* 长文字自动换行 */
            box-sizing: border-box;
        `;
        toast.textContent = msg;
        toastContainer.appendChild(toast);

        // 淡入
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 50);

        // 自动隐藏
        const hide = () => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        };
        setTimeout(hide, duration);

        // 点击事件
        if (onClick) {
            toast.onclick = () => {
                onClick();
                hide();
            };
        }
    }

    // ---------- 图标创建（最上层） ----------
    function createIcon() {
        const wrapper = document.createElement('span');
        wrapper.style.cssText = `
            display: inline-block; margin-left: 6px; cursor: pointer;
            position: relative; z-index: 9999; user-select: none;
            vertical-align: middle; line-height: 1;
        `;

        const img = document.createElement('img');
        img.src = ICON_URL;
        img.style.cssText = 'width: 16px; height: 16px; vertical-align: middle;';
        img.title = '115 一键离线下载';
        wrapper.appendChild(img);

        wrapper.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
        });

        return wrapper;
    }

    // ---------- <a> 磁力链接 ----------
    function addIconToLink(link) {
        if (link.dataset.offline115 === 'a' || !link.href.startsWith('magnet:')) return;
        link.dataset.offline115 = 'a';

        const icon = createIcon();
        link.parentNode.insertBefore(icon, link.nextSibling);

        icon.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            addOfflineTask(link.href);
        });
    }

    // ---------- 纯文本 magnet / ed2k ----------
    function addIconToTextNode(textNode, url) {
        // 防止与已处理的 <a> 重复
        let sibling = textNode;
        while (sibling) {
            if (sibling.nodeType === 1 && sibling.tagName === 'A' && sibling.href === url && sibling.dataset.offline115 === 'a') {
                return;
            }
            sibling = sibling.previousSibling || sibling.parentNode?.previousSibling;
            if (sibling && sibling.nodeType !== 3) break;
        }

        const parent = textNode.parentNode;
        if (!parent || parent.dataset.offline115 === 'text') return;
        parent.dataset.offline115 = 'text';

        const icon = createIcon();
        parent.parentNode.insertBefore(icon, parent.nextSibling);

        icon.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            addOfflineTask(url);
        });
    }

    // ---------- 处理 <a> ----------
    function processALinks() {
        document.querySelectorAll('a[href^="magnet:?"]:not([data-offline115])')
            .forEach(addIconToLink);
    }

    // ---------- 处理文本 ----------
    function processTextLinks() {
        const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/g;
        const ed2kRegex = /ed2k:\/\/\|file\|[^|]+\|[0-9]+\|[a-zA-Z0-9]{32}\|\//g;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent;

            const magnetMatch = text.match(magnetRegex);
            if (magnetMatch) {
                addIconToTextNode(node, magnetMatch[0]);
                continue;
            }

            const ed2kMatch = text.match(ed2kRegex);
            if (ed2kMatch) {
                addIconToTextNode(node, ed2kMatch[0]);
            }
        }
    }

    // ---------- 初始执行 ----------
    processALinks();
    processTextLinks();

    // ---------- 动态监听 ----------
    const observer = new MutationObserver(muts => {
        let needA = false, needText = false;
        muts.forEach(m => {
            if (!m.addedNodes.length) return;
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches?.('a[href^="magnet:?"]')) needA = true;
                if (node.querySelector?.('a[href^="magnet:?"]')) needA = true;
                if (node.textContent?.match(/magnet:\?xt=urn:btih:|ed2k:\/\/\|file\|/)) needText = true;
            });
        });
        if (needA) processALinks();
        if (needText) processTextLinks();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ---------- 添加离线任务 ----------
    function addOfflineTask(url) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            data: `url=${encodeURIComponent(url)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            onload: res => {
                let data;
                try { data = JSON.parse(res.responseText); } catch { }
                if (!data) return showToast('请求失败', 4000);

                if (data.state || data.errcode === 10008) {
                    const msg = data.state ? '添加成功' : '任务已存在';
                    showToast(`${msg}，查询中...`, 3000);
                    setTimeout(() => checkTaskStatus(url, data.info_hash), 1000);
                } else {
                    showToast(`失败: ${data.error_msg || '未知错误'}`, 5000);
                }
            },
            onerror: () => showToast('网络错误', 4000)
        });
    }

    // ---------- 检查任务状态 ----------
    function checkTaskStatus(url, infoHash) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: LIST_URL,
            data: 'page=1',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            onload: res => {
                let data;
                try { data = JSON.parse(res.responseText); } catch { }
                if (!data?.state || !data.tasks) return showToast('查询失败', 5000);

                const task = data.tasks.find(t => t.info_hash === infoHash || t.url === url);
                if (!task) return showToast('未找到任务', 4000);

                if (task.file_id) {
                    const folderUrl = `https://115.com/?cid=${task.file_id}&offset=0&mode=wangpan`;
                    showToast(`✅已完成：${task.name}，点击跳转`, 7000, () => GM_openInTab(folderUrl, false));
                } else {
                    showToast('下载中，点击查看任务', 5000, () => GM_openInTab('https://115.com/?tab=offline&mode=wangpan', false));
                }
            },
            onerror: () => showToast('查询失败', 4000)
        });
    }
})();