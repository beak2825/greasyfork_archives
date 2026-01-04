// ==UserScript==
// @name         妖火回帖快捷键(电脑端)
// @namespace    https://www.yaohuo.me
// @version      1.1
// @description  添加回帖快捷键选择功能，支持Enter和Ctrl+Enter快速回复
// @author       SiXi
// @match        https://www.yaohuo.me/bbs-*.html
// @match        https://www.yaohuo.me/bbs/book_view.aspx?*
// @match        https://www.yaohuo.me/bbs/book_re.aspx?*
// @match        https://yaohuo.me/bbs-*.html
// @match        https://yaohuo.me/bbs/book_view.aspx?*
// @match        https://yaohuo.me/bbs/book_re.aspx?*
// @icon         https://www.yaohuo.me/css/favicon.ico
// @license      Apache 2
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531654/%E5%A6%96%E7%81%AB%E5%9B%9E%E5%B8%96%E5%BF%AB%E6%8D%B7%E9%94%AE%28%E7%94%B5%E8%84%91%E7%AB%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531654/%E5%A6%96%E7%81%AB%E5%9B%9E%E5%B8%96%E5%BF%AB%E6%8D%B7%E9%94%AE%28%E7%94%B5%E8%84%91%E7%AB%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createShortcutSelector() {
        // 定位"文件回帖"链接元素
        const fileReplyLink = document.querySelector('.kuaisuhuifu a');
        if (!fileReplyLink) return;

        // 创建选择器
        const selector = document.createElement('select');
        selector.id = 'replyShortcutSelector';
        selector.style.marginLeft = '10px';
        selector.style.fontSize = '13px';

        // 添加选项
        const options = [
            { value: 'none', text: '回帖快捷键' },
            { value: 'enter', text: 'Enter' },
            { value: 'ctrlenter', text: 'Ctrl+Enter' }
        ];

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            selector.appendChild(option);
        });

        // 设置默认选中项（从存储中读取或默认为'none'）
        const savedOption = GM_getValue('replyShortcutOption', 'none');
        selector.value = savedOption;

        // 添加change事件监听器
        selector.addEventListener('change', function() {
            const selectedValue = this.value;
            GM_setValue('replyShortcutOption', selectedValue);

            // 重新初始化快捷键监听
            setupShortcutListener();
        });

        // 将选择器插入到"文件回帖"链接后面
        fileReplyLink.parentNode.insertBefore(selector, fileReplyLink.nextSibling);
    }

    // 设置快捷键监听
    function setupShortcutListener() {
        // 移除可能存在的之前的事件监听器
        document.removeEventListener('keydown', handleKeyDown);

        const selectedOption = GM_getValue('replyShortcutOption', 'none');
        if (selectedOption !== 'none') {
            document.addEventListener('keydown', handleKeyDown);
        }
    }

    // 处理键盘事件
    function handleKeyDown(event) {
        const selectedOption = GM_getValue('replyShortcutOption', 'none');
        const textarea = document.querySelector('.retextarea');

        // 只在文本区域聚焦时触发（防止误触）
        if (document.activeElement === textarea) {
            if (selectedOption === 'enter' && event.key === 'Enter' && !event.ctrlKey) {
                event.preventDefault();
                submitReply();
            } else if (selectedOption === 'ctrlenter' && event.key === 'Enter' && event.ctrlKey) {
                event.preventDefault();
                submitReply();
            }
        }
    }

    // 提交回复
    function submitReply() {
        const submitButton = document.querySelector('input[type="submit"][value="快速回复"]');
        if (submitButton) {
            submitButton.click();
        }
    }

    // 等待页面加载完成后执行
    function init() {
        createShortcutSelector();
        setupShortcutListener();
    }

    // 页面加载后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();