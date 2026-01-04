// ==UserScript==
// @name         1900-文件按钮增强
// @namespace    https://tampermonkey.net/
// @version      1.6
// @description  对文件按钮进行增强
// @author       陛下
// @match        https://mypikpak.com/drive/*
// @license      MIT
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538324/1900-%E6%96%87%E4%BB%B6%E6%8C%89%E9%92%AE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/538324/1900-%E6%96%87%E4%BB%B6%E6%8C%89%E9%92%AE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 弹出提示
    function toastNotify(msg) {
        const toast = document.createElement('div');
        toast.innerText = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 9999,
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // ✅ 创建图标按钮
    function createIconButton(emoji, title, onClick) {
        const btn = document.createElement('button');
        btn.innerText = emoji;
        btn.title = title;
        Object.assign(btn.style, {
            marginLeft: '6px',
            border: '1px solid #ccc',
            background: '#f1f1f1',
            borderRadius: '4px',
            fontSize: '12px',
            padding: '1px 6px',
            cursor: 'pointer',
            color: '#333',
        });
        btn.addEventListener('mouseover', () => btn.style.background = '#e1ecf4');
        btn.addEventListener('mouseout', () => btn.style.background = '#f1f1f1');
        btn.addEventListener('click', onClick);
        return btn;
    }

    function findNameSpanAndInsertPoint(li) {
        // 依次尝试所有可能的结构（顺序按常见程度）
        const span =
              li.querySelector('div.grid-file-info > div.name > span') ||
              li.querySelector('div.info > div.file-info > div.name > span') || // 更明确版本
              li.querySelector('div.info > div.file-info > div > span');

        return span || null;
    }

    function removeExtension(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    }

    function enhanceFileRow(li) {
        if (li.dataset._enhanced) return;
        li.dataset._enhanced = 'true';

        const id = li.id;
        const nameSpan = findNameSpanAndInsertPoint(li);

        const fullName = nameSpan?.innerText?.trim() || '';
        const name = removeExtension(fullName);

        if (!nameSpan || !id || !name) return;

        const btnId = createIconButton('🆔', '复制 ID', () => {
            GM_setClipboard(id);
            toastNotify(`已复制 ID: ${id}`);
        });

        const btnMissav = createIconButton('🔍', 'MissAV 搜索', () => {
            window.open(`https://missav.ws/${encodeURIComponent(name)}`, '_blank');
        });

        const btnCili = createIconButton('🧲', '磁力搜索', () => {
            window.open(`https://cili.re/search?q=${encodeURIComponent(name)}`, '_blank');
        });

        nameSpan.after(btnId, btnMissav, btnCili);
    }


    // ✅ 扫描所有视频/文件条目
    function scanAllFiles() {
        document.querySelectorAll('li.row').forEach(enhanceFileRow);
    }

    // ✅ 页面延迟加载支持
    function retryScan(times = 10, delay = 500) {
        let count = 0;
        const timer = setInterval(() => {
            scanAllFiles();
            count++;
            if (count >= times) clearInterval(timer);
        }, delay);
    }

    retryScan();
    const observer = new MutationObserver(scanAllFiles);
    observer.observe(document.body, { childList: true, subtree: true });
    scanAllFiles();


        // 监听弹窗出现
    const dialogObserver = new MutationObserver(() => {
        const dialog = document.querySelector('.el-dialog');
        if (!dialog) return;

        // 已经加过就不重复加
        if (dialog.dataset._prefixEnhanced) return;
        dialog.dataset._prefixEnhanced = '1';

        // 找到输入框
        const input = dialog.querySelector('input.el-input__inner');
        if (!input) return;

        // 找到取消按钮
        const cancelBtn = Array.from(dialog.querySelectorAll('footer button')).find(btn =>
            btn.textContent.includes('取消')
        );
        if (!cancelBtn) return;

        // 创建“去前缀”按钮
        const btn = document.createElement('button');
        btn.innerText = '去前缀';
        btn.type = 'button';
        btn.className = 'el-button is-text';
        btn.style.marginRight = '12px';

        btn.onclick = function () {
            let val = input.value.trim();
            const m = val.match(/^(.*?)(\.[^.]*)?$/);
            let filename = m ? m[1] : val;
            let ext = m && m[2] ? m[2] : '';
            const match = filename.match(/([A-Z]{2,}-\d{2,})$/i);
            if (match) {
                input.value = match[1] + ext;
                // 关键：派发 input 事件，让按钮可点
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };

        // 插入到取消按钮前
        cancelBtn.parentNode.insertBefore(btn, cancelBtn);
    });

    // 监听 body 变化
    dialogObserver.observe(document.body, { childList: true, subtree: true });
})();
