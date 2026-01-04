// ==UserScript==
// @name         Readwise 阅读优化
// @namespace    readwise.reader
// @version      3.1.0
// @description  优化Readwise阅读体验：保持原始格式和符号位置，实现智能分句，处理特殊光标符号，并通过<br>标签转换实现段落自动缩进
// @match        https://read.readwise.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520122/Readwise%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520122/Readwise%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------------
    // 1. 添加自定义字体与段落样式
    // -----------------------------
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @font-face {
            font-family: "仓耳华新体";
            src: url("https://ziti-beta.vercel.app/fonts/仓耳华新体.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
        }

        .document-content, .document-content * {
            font-family: "仓耳华新体", sans-serif !important;
        }

        /* 为段落添加 2em 首行缩进 */
        .document-content p {
            text-indent: 2em !important;
            margin-bottom: 1em !important;
            line-height: 1.8 !important;
            display: block !important;
        }

        /* 针对 blockquote、列表等的特殊处理，避免重复缩进 */
        .document-content p blockquote {
            text-indent: 0 !important;
        }
        .document-content li p {
            text-indent: 0 !important;
        }

        /* 如果不想 em 标签清除缩进，可以注释掉以下规则
        .document-content p em {
            display: block !important;
            margin: 0.5em 0 !important;
            text-indent: 0 !important;
        } */

        /* 若段落以 <br> 开头，则隐藏这个首行换行 */
        .document-content p[data-formatted="true"] br:first-child {
            display: none !important;
        }

        [class*='_contentRow_'] {
            max-height: 80px !important;
            overflow: hidden !important;
            position: relative !important;
        }

        [class*='_contentRow_']:hover {
            max-height: 80px !important;
            overflow: hidden !important;
        }

        [class*='_description_'] {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // -----------------------------
    // 2. 分割文本中 <br> 并生成多段 p
    // -----------------------------
    function splitParagraphsOnBr(p) {
        const html = p.innerHTML;
        if (html.includes('<br')) {
            const parts = html.split(/<br\s*\/?>/i).map(s => s.trim()).filter(s => s);
            if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                let buffer = '';

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const hasOpenQuote = (buffer + part).match(/[「『《]/g)?.length || 0;
                    const hasCloseQuote = (buffer + part).match(/[」』》]/g)?.length || 0;

                    // 如果出现不对称引号，则继续拼接
                    if (hasOpenQuote > hasCloseQuote && i < parts.length - 1) {
                        buffer += part + ' ';
                        continue;
                    }

                    const newP = document.createElement('p');
                    newP.innerHTML = buffer + part;
                    newP.dataset.formatted = 'true';
                    fragment.appendChild(newP);
                    buffer = '';
                }

                if (buffer) {
                    const newP = document.createElement('p');
                    newP.innerHTML = buffer.trim();
                    newP.dataset.formatted = 'true';
                    fragment.appendChild(newP);
                }

                p.parentNode.replaceChild(fragment, p);
            }
        }
    }

    // -----------------------------
    // 3. 处理微信链接，把它变成单独段落
    // -----------------------------
    function processWechatLink(para) {
        const fragment = document.createDocumentFragment();
        const links = Array.from(para.getElementsByTagName('a'));

        let replacedAny = false;
        links.forEach(link => {
            if (link.href && link.href.includes('__biz=')) {
                const text = link.textContent;
                // 有些链接含有 '>' 字符，不一定是 Markdown 形式
                // 可以直接将 link.textContent 当作标题，不依赖正则
                const newLink = link.cloneNode(true);
                newLink.textContent = text.trim();

                // 创建新段落
                const newP = document.createElement('p');
                newP.dataset.formatted = 'true';
                newP.appendChild(newLink);
                fragment.appendChild(newP);
                replacedAny = true;
            }
        });

        if (replacedAny) {
            // 若本段还有其他纯文本，需要再插回去（看你是否想保留原段落）
            // 这里演示：如果链接覆盖了整个段落，就直接用链接段落替换原段落
            // 若想保留原文本 + 链接，可以把剩余文本另行处理
            para.parentNode.replaceChild(fragment, para);
            return true;
        }

        return false;
    }

    // -----------------------------
    // 4. 统一分段、分句：核心函数
    // -----------------------------
    function formatAllParagraphs() {
        const paras = document.querySelectorAll('.document-content p:not([data-formatted])');
        let formattedCount = 0;

        paras.forEach(para => {
            let html = para.innerHTML.trim();
            if (!html) {
                para.dataset.formatted = 'true';
                return;
            }

            // 先检查是否有 <br>，如果有则拆分段落
            splitParagraphsOnBr(para);
            if (para.dataset.formatted === 'true') {
                // splitParagraphsOnBr 已替换掉原 p
                return;
            }

            // 再检查是否包含微信文章链接
            if (html.includes('__biz=')) {
                if (processWechatLink(para)) {
                    // 已被替换
                    return;
                }
            }

            // 如果段落包含 Markdown 类似 [链接] http://xxx
            // 你可自行保留或注释这段逻辑
            if (html.includes('[') && html.includes(']') && html.includes('http')) {
                const links = html.match(/\[.*?\].*?(?=\[|$)/g);
                if (links) {
                    const fragment = document.createDocumentFragment();
                    links.forEach(link => {
                        const newP = document.createElement('p');
                        newP.innerHTML = link.trim();
                        newP.dataset.formatted = 'true';
                        fragment.appendChild(newP);
                    });
                    para.parentNode.replaceChild(fragment, para);
                    return;
                }
            }

            // 对没有 <br> 的段落进行中文标点分句
            // 用 <split> 标记断句后，再拆分成多个 <p>
            html = html.replace(/([。！？!?])([^"'」』》])/g, '$1<split>$2');
            let segments = html.split(/<split>/).map(s => s.trim()).filter(s => s);
            if (segments.length <= 1) {
                // 无需再拆分
                para.dataset.formatted = 'true';
                return;
            }

            // 生成新的段落
            const fragment = document.createDocumentFragment();
            segments.forEach(segment => {
                const newP = document.createElement('p');
                newP.innerHTML = segment;
                newP.dataset.formatted = 'true';
                fragment.appendChild(newP);
            });

            para.parentNode.replaceChild(fragment, para);
            formattedCount += segments.length;
        });

        if (formattedCount > 0) {
            console.log(`分句成功：${formattedCount} 个段落已重新分段`);
        }
        return formattedCount;
    }

    // -----------------------------
    // 5. 使用 MutationObserver + 定时器
    // -----------------------------
    const observer = new MutationObserver(() => {
        formatAllParagraphs();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('DOMContentLoaded', () => {
        formatAllParagraphs();
        setTimeout(formatAllParagraphs, 500);
        setTimeout(formatAllParagraphs, 1000);
        setTimeout(formatAllParagraphs, 2000);
    });

    let attempts = 0;
    const maxAttempts = 20;
    const intervalId = setInterval(() => {
        const count = formatAllParagraphs();
        attempts++;
        if (count > 0 || attempts >= maxAttempts) {
            clearInterval(intervalId);
        }
    }, 500);

    window.addEventListener('load', () => {
        formatAllParagraphs();
    });

})();
