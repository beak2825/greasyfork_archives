// ==UserScript==
// @name         Flomo 快捷操作面板 (增强版)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  在 Flomo 笔记页面增加一个可拖动、可最小化/关闭的快捷面板，支持一键展开、复制内容(带分隔符)、下载为TXT(优化格式+中文编码)，并显示笔记数量。V2.4: 调整复制和下载的笔记顺序为最新在上。
// @author       Gemini & AI Assistant
// @match        https://v.flomoapp.com/mine*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544902/Flomo%20%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%E9%9D%A2%E6%9D%BF%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544902/Flomo%20%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%E9%9D%A2%E6%9D%BF%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局错误处理
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('Failed to fetch')) {
            console.warn('捕获到网络错误，可能是flomo网站的正常行为:', e.message);
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.message && e.reason.message.includes('Failed to fetch')) {
            console.warn('捕获到Promise拒绝错误，可能是flomo网站的正常行为:', e.reason.message);
            e.preventDefault(); // 阻止错误显示在控制台
        }
    });

    // --- 样式定义 ---
    GM_addStyle(`
        #flomo-helper-panel {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            min-width: 160px;
        }
        #flomo-helper-header {
            padding: 8px 10px;
            cursor: move;
            background-color: #f7f7f7;
            border-bottom: 1px solid #e0e0e0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        #flomo-helper-header span {
            font-weight: bold;
            color: #333;
        }
        #flomo-helper-controls button {
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            padding: 0 4px;
            color: #888;
        }
        #flomo-helper-controls button:hover {
            color: #000;
        }
        #flomo-helper-content {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: all 0.3s ease;
        }
        #flomo-helper-panel.minimized #flomo-helper-content {
            display: none;
        }
        .flomo-helper-button {
            background-color: #4e4e4e;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            text-align: center;
            transition: background-color 0.2s ease, transform 0.2s ease;
            white-space: nowrap;
        }
        .flomo-helper-button:hover {
            background-color: #333333;
            transform: translateY(-1px);
        }
        .flomo-helper-button:active {
            transform: translateY(0);
        }
        .flomo-helper-button.success {
            background-color: #28a745;
        }
        #flomo-note-counter {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px solid #f0f0f0;
        }
    `);

    // --- 创建并添加操作面板 ---
    setTimeout(() => {
        const panel = document.createElement('div');
        panel.id = 'flomo-helper-panel';

        const header = document.createElement('div');
        header.id = 'flomo-helper-header';
        header.innerHTML = `
            <span>Flomo 助手</span>
            <div id="flomo-helper-controls">
                <button id="minimize-btn" title="最小化">-</button>
                <button id="close-btn" title="关闭">×</button>
            </div>
        `;

        const content = document.createElement('div');
        content.id = 'flomo-helper-content';

        const expandButton = createButton('展开所有笔记', expandAllNotes);
        const copyButton = createButton('复制所有内容', copyAllContent);
        const downloadButton = createButton('下载为 .txt', downloadAsTxt);

        const counter = document.createElement('div');
        counter.id = 'flomo-note-counter';
        counter.textContent = '笔记数量: 0';

        content.appendChild(expandButton);
        content.appendChild(copyButton);
        content.appendChild(downloadButton);
        content.appendChild(counter);
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        header.addEventListener('mousedown', dragMouseDown);
        document.getElementById('minimize-btn').addEventListener('click', () => panel.classList.toggle('minimized'));
        document.getElementById('close-btn').addEventListener('click', () => panel.style.display = 'none');

        updateNoteCount();
        const observer = new MutationObserver(updateNoteCount);
        const targetNode = document.querySelector('.list');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }

    }, 2000);

    // --- 功能函数定义 ---

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'flomo-helper-button';
        button.addEventListener('click', onClick);
        return button;
    }

    function updateNoteCount() {
        const count = document.querySelectorAll('.display').length;
        const counterElement = document.getElementById('flomo-note-counter');
        if (counterElement) {
            counterElement.textContent = `笔记数量: ${count}`;
        }
    }

    function expandAllNotes() {
        const expandButtons = document.querySelectorAll('.showBtn');
        if (expandButtons.length === 0) {
            showFeedback(this, '无内容可展开', false);
            return;
        }
        expandButtons.forEach(btn => btn.click());
        showFeedback(this, '已全部展开!', true);
    }

   /**
    * [MODIFIED] 获取所有笔记内容，包含日期和正文
    * 优化: 改进文本格式，添加序号和统计信息
    * 修复: 移除了内容过长截断的限制，并统一了笔记间的分隔符
    * 更新: 调整笔记顺序为最新的在最前
    * @returns {string|null} - 格式化后的所有笔记文本，或在没有内容时返回 null
    */
    function getAllContentText() {
        const memoElements = document.querySelectorAll('.display');
        if (memoElements.length === 0) {
            return null;
        }

        // 获取当前页面的标签信息
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        const currentDate = new Date().toLocaleString('zh-CN');

        // 添加文件头部信息
        let headerInfo = `Flomo 笔记导出\n`;
        headerInfo += `导出时间: ${currentDate}\n`;
        if (tag) {
            headerInfo += `标签筛选: #${tag}\n`;
        }
        headerInfo += `笔记总数: ${memoElements.length} 条\n`;
        headerInfo += `${'='.repeat(50)}\n\n`;

        // [MODIFIED] 直接 map，不反转，保持最新的在前
        const allText = Array.from(memoElements).map((memo, index) => {
            const timeEl = memo.querySelector('.time .text');
            const contentEl = memo.querySelector('.richText');

            // 获取时间戳
            const timeStamp = timeEl ? timeEl.innerText.trim() : '时间未知';

            // 获取内容，保持原有格式
            let content = '内容为空';
            if (contentEl) {
                content = contentEl.innerText.trim();
            }

            // [MODIFIED] 格式化单条笔记，序号从1开始
            const noteNumber = index + 1;
            return `【笔记 ${noteNumber}】\n时间: ${timeStamp}\n内容:\n${content}`;

        }); // [MODIFIED] .reverse() 已移除

        // 添加尾部统计信息
        const footerInfo = `\n${'='.repeat(50)}\n导出完成 - 共 ${memoElements.length} 条笔记`;

        // 笔记之间使用分隔线，复制和下载功能共用此格式
        return headerInfo + allText.join('\n\n' + '-'.repeat(40) + '\n\n') + footerInfo;
    }

    function copyAllContent() {
        const combinedText = getAllContentText();
        if (combinedText === null) {
            showFeedback(this, '未找到内容', false);
            return;
        }
        GM_setClipboard(combinedText, 'text');
        showFeedback(this, '复制成功!', true);
    }

   /**
    * [FIXED] 下载所有笔记为 TXT 文件，并使用智能文件名
    * 修复: 添加BOM字符、错误处理、文件名安全性检查
    */
    function downloadAsTxt() {
        const combinedText = getAllContentText();
        if (combinedText === null) {
            showFeedback(this, '未找到内容', false);
            return;
        }

        try {
            // 添加调试信息
            console.log('开始下载，内容长度:', combinedText.length);
            // 从 URL 获取 tag 用于生成更智能的文件名
            const urlParams = new URLSearchParams(window.location.search);
            const tag = urlParams.get('tag');
            const date = new Date().toISOString().slice(0, 10);
            const time = new Date().toTimeString().slice(0, 8).replace(/:/g, '-');

            // 清理 tag 中的不安全字符，确保文件名合法
            const safeTag = tag ? tag.replace(/[<>:"/\\|?*]/g, '_').substring(0, 50) : '';
            const filename = safeTag ?
                  `flomo笔记_${safeTag}_${date}_${time}.txt` :
                  `flomo笔记_${date}_${time}.txt`;

            // 添加 UTF-8 BOM 字符，确保中文正确显示
            const BOM = '\uFEFF';
            const textWithBOM = BOM + combinedText;

            // 创建带有正确编码的 Blob
            const blob = new Blob([textWithBOM], {
                type: 'text/plain;charset=utf-8'
            });

            // 使用try-catch包装URL创建过程
            let url;
            try {
                url = URL.createObjectURL(blob);
                console.log('创建的Blob URL:', url);
            } catch (urlError) {
                console.error('创建Blob URL失败:', urlError);
                showFeedback(this, '下载失败', false);
                return;
            }

            // 创建一个新的a元素，不使用现有DOM中的元素
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none'; // 隐藏链接元素
            a.target = '_blank'; // 使用新窗口下载，避免URL冲突
            a.rel = 'noopener noreferrer'; // 安全设置

            // 使用更直接的下载方式，避免被网站代码拦截
            try {
                // 方法1：直接点击，不添加到DOM
                a.click();
                console.log('使用直接点击方式下载');
            } catch (clickError) {
                console.warn('直接点击失败，尝试其他方式:', clickError);
                try {
                    // 方法2：使用window.open直接打开blob URL
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                        newWindow.location.href = url;
                        console.log('使用新窗口方式下载');
                    } else {
                        throw new Error('无法打开新窗口');
                    }
                } catch (windowError) {
                    console.warn('新窗口方式失败，尝试最后方式:', windowError);
                    // 方法3：使用location.href直接跳转
                    const originalHref = window.location.href;
                    window.location.href = url;
                    // 立即恢复原URL，避免页面跳转
                    setTimeout(() => {
                        window.location.href = originalHref;
                    }, 100);
                    console.log('使用location.href方式下载');
                }
            }

            // 清理URL对象
            setTimeout(() => {
                try {
                    URL.revokeObjectURL(url);
                    console.log('Blob URL已清理');
                } catch (revokeError) {
                    console.warn('URL清理失败:', revokeError);
                }
            }, 1000); // 延长清理时间，确保下载完成

            showFeedback(this, '下载成功!', true);

        } catch (error) {
            console.error('下载失败:', error);
            showFeedback(this, '下载失败', false);
        }
    }

    function showFeedback(btn, message, isSuccess) {
        if (!btn || typeof btn.textContent === 'undefined') return;
        const originalText = btn.textContent;
        btn.textContent = message;
        if (isSuccess) {
            btn.classList.add('success');
        }
        setTimeout(() => {
            btn.textContent = originalText;
            if (isSuccess) {
                btn.classList.remove('success');
            }
        }, 2000);
    }

    // --- 拖动功能实现 ---
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const panel = () => document.getElementById('flomo-helper-panel');

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        const elmnt = panel();
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

})();
