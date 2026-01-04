// ==UserScript==
// @name         万能复制插件（预览 + 历史 + 美观提示）
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Ctrl+点击或长按复制网页内容，附带来源 + 高亮 + 音效 + 弹窗预览 + 历史记录
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/471513/%E4%B8%87%E8%83%BD%E5%A4%8D%E5%88%B6%E6%8F%92%E4%BB%B6%EF%BC%88%E9%A2%84%E8%A7%88%20%2B%20%E5%8E%86%E5%8F%B2%20%2B%20%E7%BE%8E%E8%A7%82%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471513/%E4%B8%87%E8%83%BD%E5%A4%8D%E5%88%B6%E6%8F%92%E4%BB%B6%EF%BC%88%E9%A2%84%E8%A7%88%20%2B%20%E5%8E%86%E5%8F%B2%20%2B%20%E7%BE%8E%E8%A7%82%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const allowTags = ['div', 'span', 'p', 'pre', 'code', 'td', 'input', 'textarea', 'li'];
    const ignoreTags = ['button', 'a', 'script', 'style', 'footer', 'nav'];
    const copyHistory = [];
    let lastRightClickedEl = null;

    function playSound() {
        const audio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YYAAAAA=");
        audio.play().catch(() => {});
    }

    function highlight(el) {
        const prev = el.style.backgroundColor;
        el.style.transition = 'background-color 0.3s';
        el.style.backgroundColor = '#ffe08a';
        setTimeout(() => el.style.backgroundColor = prev, 1500);
    }

    function showTip(text) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1800,
            background: '#28a745',
            color: 'white',
            icon: 'success',
            title: text
        });
    }

    function preview(text) {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            color: black;
            padding: 10px;
            max-width: 400px;
            max-height: 200px;
            overflow: auto;
            border: 1px solid #aaa;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            border-radius: 6px;
            z-index: 100000;
            font-family: monospace;
            white-space: pre-wrap;
        `;
        panel.textContent = text;
        document.body.appendChild(panel);
        setTimeout(() => panel.remove(), 5000);
    }

    function getText(el) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return el.value.trim();
        return el.innerText?.trim() || el.textContent?.trim() || '';
    }

    function isCopyable(el) {
        const tag = el.tagName.toLowerCase();
        if (ignoreTags.includes(tag)) return false;
        return allowTags.includes(tag);
    }

    function appendSource(text) {
        const url = window.location.href;
        const title = document.title;
        return `${text}\n\n【来源】${title}\n${url}`;
    }

    function copyWithSource(text) {
        if (!text || !text.trim()) return;
        const finalText = appendSource(text.trim());

        if (navigator.clipboard) {
            navigator.clipboard.writeText(finalText).then(() => {
                playSound();
                preview(finalText);
                showTip('✅ 已复制（附带来源）');
            }).catch(() => {
                GM_setClipboard(finalText);
                showTip('✅ 兼容复制成功');
            });
        } else {
            GM_setClipboard(finalText);
            showTip('✅ 复制成功');
        }

        copyHistory.unshift(finalText);
        if (copyHistory.length > 10) copyHistory.pop();
    }

    document.addEventListener('click', (e) => {
        if (!e.ctrlKey) return;
        let el = e.target;
        while (el && el !== document.body) {
            if (isCopyable(el)) {
                const text = getText(el);
                if (text) {
                    copyWithSource(text);
                    highlight(el);
                    break;
                }
            }
            el = el.parentElement;
        }
    });

    let timer = null;
    document.addEventListener('mousedown', (e) => {
        let el = e.target;
        while (el && el !== document.body) {
            if (isCopyable(el)) {
                timer = setTimeout(() => {
                    const text = getText(el);
                    if (text) {
                        copyWithSource(text);
                        highlight(el);
                    }
                }, 600);
                break;
            }
            el = el.parentElement;
        }
    });
    document.addEventListener('mouseup', () => clearTimeout(timer));
    document.addEventListener('mouseleave', () => clearTimeout(timer));

    document.addEventListener('contextmenu', (e) => {
        lastRightClickedEl = e.target;
    });

    GM_registerMenuCommand('📋 复制右键目标内容', () => {
        if (!lastRightClickedEl) return showTip('无记录');
        let el = lastRightClickedEl;
        while (el && el !== document.body) {
            if (isCopyable(el)) {
                const text = getText(el);
                if (text) {
                    copyWithSource(text);
                    highlight(el);
                    return;
                }
            }
            el = el.parentElement;
        }
        showTip('无可复制内容');
    });

    GM_registerMenuCommand('📑 查看复制历史', () => {
        const html = copyHistory.slice(0, 5).map((item, idx) => {
            return `<div style="text-align:left;"><b>${idx + 1}.</b><br><pre style="white-space:pre-wrap;font-size:13px;background:#f8f9fa;padding:6px;border:1px solid #ccc;border-radius:4px;">${item}</pre></div>`;
        }).join('<hr>');
        Swal.fire({
            title: '📋 最近复制记录',
            html: html || '暂无记录',
            width: 600,
            confirmButtonText: '关闭',
            customClass: {
                popup: 'swal2-noanimation',
            }
        });
    });
})();
