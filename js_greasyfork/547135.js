// ==UserScript==
// @name           豆瓣图书信息增强（全信息+滴答清单）
// @description    提取豆瓣图书全信息，支持普通格式和滴答清单格式复制，优化交互体验
// @author         bai
// @version        2.3
// @icon           https://book.douban.com/favicon.ico
// @grant          GM_addStyle
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include        https://book.douban.com/subject/*
// @run-at         document-end
// @license        Apache-2.0
// @namespace      https://greasyfork.org/users/967749
// @downloadURL https://update.greasyfork.org/scripts/547135/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%85%A8%E4%BF%A1%E6%81%AF%2B%E6%BB%B4%E7%AD%94%E6%B8%85%E5%8D%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547135/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA%EF%BC%88%E5%85%A8%E4%BF%A1%E6%81%AF%2B%E6%BB%B4%E7%AD%94%E6%B8%85%E5%8D%95%EF%BC%89.meta.js
// ==/UserScript==

$(document).ready(function () {
    // 1. 注入样式（更换为莫兰迪灰粉+灰紫配色，优化视觉体验）
    GM_addStyle(`
        .book-copy-container {
            padding: 15px;
            background-color: #f8f5f3; /* 莫兰迪浅暖灰底色，适配粉紫主色 */
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            transition: box-shadow 0.3s ease;
        }
        .book-copy-container:hover {
            box-shadow: 0 3px 8px rgba(0,0,0,0.08); /* 容器hover轻微提亮 */
        }
        
        .book-copy-btn {
            padding: 10px 18px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 0 8px 10px 0;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* 更自然的过渡曲线 */
            color: #6b5f59; /* 莫兰迪暖深灰文字，避免刺眼 */
            box-shadow: 0 2px 3px rgba(174, 158, 150, 0.15); /* 暖调阴影，呼应主色 */
        }
        
        /* 莫兰迪色系按钮1 - 灰粉色（全信息复制） */
        .book-copy-btn.full-info {
            background-color: #e4d2cc; /* 低饱和灰粉，柔和不刺眼 */
        }
        .book-copy-btn.full-info:hover {
            background-color: #d1bcb2; /* hover加深10%，保持莫兰迪质感 */
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(174, 158, 150, 0.2);
        }
        
        /* 莫兰迪色系按钮2 - 灰紫色（复制到滴答） */
        .book-copy-btn.dida {
            background-color: #d9d1e0; /* 低饱和灰紫，与灰粉协调互补 */
        }
        .book-copy-btn.dida:hover {
            background-color: #c5bcd6; /* hover加深10%，保持色调统一 */
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(160, 146, 173, 0.2);
        }
        
        /* 按钮交互细节 */
        .book-copy-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 3px rgba(174, 158, 150, 0.15); /* 点击回归浅阴影 */
        }
        .book-copy-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
            background-color: #e9e5e2; /* 禁用时统一为浅暖灰，避免色彩混乱 */
        }
        
        /* 状态提示样式（与主色呼应） */
        .copy-status {
            margin-left: 10px;
            font-size: 14px;
            padding: 4px 10px;
            border-radius: 4px;
            transition: all 0.3s ease;
            color: #6b5f59;
            background-color: #f3eee9; /* 基础状态浅暖灰 */
        }
        .copy-success {
            background-color: #f0e6e2; /* 成功状态：浅灰粉底 */
            color: #7d6b62; /* 暖灰文字，提升可读性 */
        }
        .copy-error {
            background-color: #f1e9f0; /* 失败状态：浅灰紫底 */
            color: #7a6d7c; /* 紫调文字，与失败提示呼应 */
        }
        .copy-loading {
            background-color: #f3eee9;
            color: #80746d;
        }
    `);

    // 2. 核心：图书信息提取函数（功能不变，保持原逻辑）
    function getBookInfo() {
        // 提取标题
        const title = $('#wrapper h1 span')
            .first()
            .text()
            .replace(/[:\(（].*$/, '')
            .trim() || '未知标题';

        // 提取作者
        let author = '';
        const authorElem = $('#info span.pl:contains("作者")').next();
        if (authorElem.length) {
            author = authorElem.text().replace(/\s+/g, ' ').trim();
        }
        if (!author && authorElem.find('a').length) {
            author = authorElem.find('a').text().replace(/\s+/g, ' ').trim();
        }
        if (!author) {
            const translatorElem = $('#info span.pl:contains("译者")').next();
            if (translatorElem.length) {
                author = translatorElem.text().replace(/\s+/g, ' ').trim();
                author = author ? `译者：${author}` : '';
            }
        }
        author = author || '未知作者';

        // 提取内容简介
        let intro = '';
        const introElem = $('.intro');
        if (introElem.length) {
            intro = introElem.text().replace(/\s+/g, ' ').trim();
        }
        intro = intro || '无内容简介';

        // 通用信息提取函数
        function extractInfo(label) {
            let elem = $(`#info span.pl:contains("${label}")`).next();
            if (elem.length && elem.text().trim()) {
                return elem.text().trim();
            }
            elem = $(`#info span.pl:contains("${label}")`).next('a');
            if (elem.length && elem.text().trim()) {
                return elem.text().trim();
            }
            const text = $('#info').text();
            const match = text.match(new RegExp(`${label}\\s*[:：]\\s*([^\\n]+)`));
            if (match && match[1]) {
                return match[1].trim();
            }
            return `未知${label}`;
        }

        // 提取基础信息
        const publisher = extractInfo('出版社');
        const pubYear = extractInfo('出版年');
        const isbn = extractInfo('ISBN');
        const pages = extractInfo('页数');
        const price = extractInfo('定价');
        const binding = extractInfo('装帧');
        const rating = $('.rating_num').text().trim() || '暂无评分';
        const url = window.location.href || '未知链接';

        return {
            title, author, publisher, pubYear, isbn,
            pages, price, binding, rating, url, intro
        };
    }

    // 3. 复制文本格式化函数（保持原格式，适配不同需求）
    function getCopyText(info, type) {
        switch (type) {
            case 'full':
                return `书名：《${info.title}》
作者：${info.author}
出版社：${info.publisher}
出版年：${info.pubYear}
ISBN：${info.isbn}
页数：${info.pages}
定价：${info.price}
装帧：${info.binding}
豆瓣评分：${info.rating}
链接：${info.url}
内容简介：${info.intro}`;
            
            case 'dida':
                return `[《${info.title}》](${info.url}) 🖊：${info.author} ⭐️：${info.rating} 📅：${info.pubYear} 🏢：${info.publisher}`;
            
            default:
                return '';
        }
    }

    // 4. 剪贴板写入函数（兼容原生API和降级方案）
    function copyToClipboard(text) {
        return navigator.clipboard.writeText(text).catch(() => {
            const textarea = $('<textarea>').val(text).appendTo('body');
            textarea[0].select();
            document.execCommand('copy');
            textarea.remove();
        });
    }

    // 5. 按钮点击处理函数（优化状态反馈细节）
    function handleCopyClick(btn, statusElem, copyType) {
        return async function () {
            const originalText = btn.text();
            // 初始加载状态
            btn.text('复制中...').prop('disabled', true);
            statusElem.removeClass().addClass('copy-status copy-loading').text('处理中');

            try {
                const bookInfo = getBookInfo();
                const copyText = getCopyText(bookInfo, copyType);
                await copyToClipboard(copyText);
                
                // 成功状态：增加图标+文字，视觉更清晰
                statusElem.removeClass().addClass('copy-status copy-success').text('👌');
                btn.text('已复制');
            } catch (err) {
                // 失败状态：明确提示，引导重试
                statusElem.removeClass().addClass('copy-status copy-error').text('✗ 复制失败，请重试');
                btn.text(originalText);
            } finally {
                btn.prop('disabled', false);
                // 5秒后恢复初始状态，避免长期占用视觉空间
                setTimeout(() => {
                    statusElem.removeClass().addClass('copy-status').text('');
                    btn.text(originalText);
                }, 5000);
            }
        };
    }

    // 6. 创建按钮容器（整合两个功能按钮，保持布局整洁）
    const $buttonContainer = $('<div class="book-copy-container">').append(
        $('<button class="book-copy-btn full-info">全信息复制</button>'),
        $('<button class="book-copy-btn dida">复制→滴答</button>'),
        $('<span class="copy-status"> </span>')
    ).prependTo('#content .aside');

    // 7. 绑定按钮点击事件（关联对应处理逻辑）
    const $fullBtn = $buttonContainer.find('.book-copy-btn.full-info');
    const $didaBtn = $buttonContainer.find('.book-copy-btn.dida');
    const $status = $buttonContainer.find('.copy-status');

    $fullBtn.on('click', handleCopyClick($fullBtn, $status, 'full'));
    $didaBtn.on('click', handleCopyClick($didaBtn, $status, 'dida'));
});