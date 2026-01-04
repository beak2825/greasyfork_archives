// ==UserScript==
// @name         豆瓣读书to杏坛
// @version      2025-02-17
// @namespace    114514
// @description  将豆瓣读书简介复制到杏坛发布页
// @author       Kimi&DeepSeek
// @match        *://xingtan.one/upload.php*
// @match        *://book.douban.com/subject*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527142/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6to%E6%9D%8F%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/527142/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6to%E6%9D%8F%E5%9D%9B.meta.js
// ==/UserScript==
/**

注意事项：
1.在豆瓣页面，需要等待豆瓣加载出"描述: 复制"按钮时，网页右上角才会出现"提取信息"按钮
2.文件类型默认为PDF（可自行修改）
3.本代码完全由Kimi和DeepSeek生成

**/
(function() {
    'use strict';

    // 添加按钮容器样式
    GM_addStyle(`
        #customButtonContainer {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #f8f8f8;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        #customButtonContainer button {
            margin: 3px;
            padding: 8px 12px;
            cursor: pointer;
            background: #e0e0e0;
            border: 1px solid #ccc;
            border-radius: 3px;
            transition: all 0.2s;
        }
        #customButtonContainer button:hover {
            background: #d0d0d0;
            transform: translateY(-1px);
        }
    `);

    // 创建按钮容器
    const container = document.createElement('div');
    container.id = 'customButtonContainer';

    // 创建复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 提取信息';
    copyBtn.onclick = handleCopyTitle;

    // 创建填充按钮
    const fillBtn = document.createElement('button');
    fillBtn.textContent = '🚀 智能填充';
    fillBtn.onclick = handleSmartFill;

    // 添加按钮到容器
    container.appendChild(copyBtn);
    container.appendChild(fillBtn);
    document.body.appendChild(container);

    /********************
     * 核心功能函数 *
     ********************/

    // 处理标题复制
    async function handleCopyTitle() {
        try {
            const copyLink = document.getElementById("copy");
            if (copyLink) {
                copyLink.click();
            }
            // 等待1秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 获取页面标题
            const titleElement = document.querySelector('span[property="v:itemreviewed"]');
            if (!titleElement) throw new Error('未找到页面标题');
            const title = titleElement.textContent.trim();

            // 读取当前剪贴板内容
            let clipboardData = '';
            try {
                clipboardData = await navigator.clipboard.readText();
            } catch (err) {
                console.log('剪贴板为空或不可访问，将新建内容');
            }

            // 写入新内容
            const newContent = `${title}\n${clipboardData}`;
            await navigator.clipboard.writeText(newContent);
            showAlert('✅ 复制成功', '标题已添加到剪贴板首行');
        } catch (err) {
            showAlert('❌ 复制失败', err.message);
        }
    }

    // 处理智能填充
    async function handleSmartFill() {
        try {
            // 读取剪贴板内容
            const clipboardText = await navigator.clipboard.readText();

            // 解析数据
            const { title, author, publisher, year, isbn, doubanUrl, original, subtitle } = parseClipboardData(clipboardText);
            const description = clipboardText;

            // 填充表单
            fillForm({
                title,
                author,
                publisher,
                year,
                isbn,
                doubanUrl,
                description
            });

            // 填充 PDF 输入框
            const pdfInput = document.querySelector('input[name="ftype"]');
            if (pdfInput) {
                pdfInput.value = 'PDF';
            }

            showAlert('✨ 填充完成', '表单数据已更新');
        } catch (err) {
            showAlert('⚠️ 填充失败', err.message);
        }
    }

    // 解析剪贴板数据
    function parseClipboardData(text) {
        // 获取首行内容
        const firstLine = text.split('\n')[0]?.trim() || '';

        // 正则表达式模式
        const patterns = {
            original: /◎原作名[:：]\s*([^\n]+)/,
            author: /◎作者[:：]\s*([^\n]+)/,
            translator: /◎译者[:：]\s*([^\n]+)/,
            publisher: /◎出版社[:：]\s*([^\n]+)/,
            year: /◎出版年[:：].*?(\d{4})/,
            isbn: /◎ISBN[:：]\s*([0-9Xx-]+)/i,
            doubanUrl: /◎豆瓣链接[:：]\s*(\S+)/,
            subtitle: /◎副标题[:：]\s*([^\n]+)/
        };

        // 提取数据
        const extract = (pattern) => (text.match(pattern) || [])[1]?.trim() || '';

        return {
            title: buildTitle(firstLine, extract(patterns.original), extract(patterns.subtitle)),
            author: buildAuthor(extract(patterns.author), extract(patterns.translator)),
            publisher: extract(patterns.publisher),
            year: extract(patterns.year) || new Date().getFullYear().toString(),
            isbn: extract(patterns.isbn).replace(/-/g, ''),
            doubanUrl: extract(patterns.doubanUrl),
            original: extract(patterns.original),
            subtitle: extract(patterns.subtitle)
        };
    }

    // 构建标题
    function buildTitle(firstLine, original, subtitle) {
        let title = firstLine;
        if (subtitle) {
            title += `：${subtitle}`;
        }
        if (original) {
            title += `（${original}）`;
        }
        return title;
    }

    // 构建作者信息
    function buildAuthor(author, translator) {
        // 删除括号及其内容，并将斜杠替换为 &
        const cleanText = (text) => text.replace(/[（(【[][^)）\]】]*[)）\]】]/g, '').replace(/\//g, '&');
        author = cleanText(author);
        translator = cleanText(translator);

        return translator ? `${author}&译者：${translator}` : author;
    }

    // 填充表单
    function fillForm(data) {
        const fieldMap = {
            'input[name="name"]': data.title,
            'input[name="author"]': data.author,
            'input[name="publisher"]': data.publisher,
            'input[name="year"]': data.year,
            'input[name="isbn"]': data.isbn,
            'input[name="pt_gen"]': data.doubanUrl,
            'textarea[name="descr"]': data.description
        };

        Object.entries(fieldMap).forEach(([selector, value]) => {
            const el = document.querySelector(selector);
            if (el) {
                el.value = value;
                // 触发事件以适配现代前端框架
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // 显示通知
    function showAlert(title, message) {
        alert(`${title}\n\n${message}`);
    }
})();