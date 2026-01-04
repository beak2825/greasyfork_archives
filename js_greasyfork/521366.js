// ==UserScript==
// @license MIT
// @name         划选链接检测
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  检测选中文本中的链接并提供快捷打开功能
// @author       PaulW47
// @match        *://*/*
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521366/%E5%88%92%E9%80%89%E9%93%BE%E6%8E%A5%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521366/%E5%88%92%E9%80%89%E9%93%BE%E6%8E%A5%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText('swalStyle'));

    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '打开',
        cancelButtonText: '关闭',
        customClass: {
            container: 'link-detector-panel',
            popup: 'link-detector-popup'
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        .link-detector-panel {
            z-index: 99999 !important;
        }
        .link-detector-popup {
            font-size: 14px !important;
        }
    `;
    document.head.appendChild(style);

    let lastText = '';

    function detectLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) || [];
    }

    function showPanel(link) {
        toast.fire({
            title: '发现链接',
            text: link
        }).then((result) => {
            if (result.isConfirmed) {
                GM_openInTab(link, { active: true });
                window.getSelection().removeAllRanges();
            }
            lastText = '';
        });
    }

    document.addEventListener('mouseup', (e) => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText && selectedText !== lastText) {
            lastText = selectedText;
            const links = detectLinks(selectedText);
            if (links.length > 0) {
                showPanel(links[0]);
            }
        }
    });
})();