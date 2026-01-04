// ==UserScript==
// @name         文字链接可点击
// @version      1.5
// @description  双击将URL文本转a标签，代码全部来自DeepSeek，可能存在bug
// @author       cangming99
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/826934
// @downloadURL https://update.greasyfork.org/scripts/525393/%E6%96%87%E5%AD%97%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/525393/%E6%96%87%E5%AD%97%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 精准配置
    const CONFIG = {
        // 增强URL识别（包含中文边界处理）
        URL_REGEX: /(https?:\/\/[^\s<>{}[\]"'\u4e00-\u9fa5]+(?<![.。,，！!~])|www\.[^\s<>{}[\]"'\u4e00-\u9fa5]+(?<![.。,，！!~]))/gi,
        // 最大处理范围
        SCAN_RADIUS: 200, // 光标前后扫描范围
        // 样式配置
        LINK_STYLE: {
            color: '#00a1d6 !important',
            'text-decoration': 'underline !important',
            'cursor': 'pointer'
        }
    };

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .uc-real-link {
            ${Object.entries(CONFIG.LINK_STYLE).map(([k,v])=>`${k}:${v}`).join(';')}
        }
    `;
    document.head.appendChild(style);

    // 核心处理函数
    function processTextNode(textNode, clickOffset) {
        const fullText = textNode.nodeValue;

        // 确定扫描范围
        const start = Math.max(0, clickOffset - CONFIG.SCAN_RADIUS);
        const end = Math.min(fullText.length, clickOffset + CONFIG.SCAN_RADIUS);
        const context = fullText.slice(start, end);

        // 查找所有匹配项
        const matches = [];
        let match;
        while ((match = CONFIG.URL_REGEX.exec(context)) !== null) {
            const globalStart = start + match.index;
            const globalEnd = globalStart + match[0].length;

            matches.push({
                url: match[0],
                start: globalStart,
                end: globalEnd
            });
        }

        // 寻找最近的包含点击位置的URL
        const target = matches.find(m =>
            clickOffset >= m.start && clickOffset <= m.end
        );

        if (!target) return false;

        // 执行替换
        const parent = textNode.parentNode;
        const frag = document.createDocumentFragment();

        // 前半部分文本
        if (target.start > 0) {
            frag.appendChild(document.createTextNode(fullText.slice(0, target.start)));
        }

        // 创建链接
        const a = document.createElement('a');
        a.className = 'uc-real-link';
        a.href = target.url.startsWith('www.') ? `http://${target.url}` : target.url;
        a.textContent = fullText.slice(target.start, target.end);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        frag.appendChild(a);

        // 后半部分文本
        if (target.end < fullText.length) {
            frag.appendChild(document.createTextNode(fullText.slice(target.end)));
        }

        // 替换原始节点
        parent.replaceChild(frag, textNode);
        return true;
    }

    // 双击事件处理
    document.addEventListener('dblclick', function(event) {

        // 排除已有链接
        if (event.target.closest('a')) return;

        // 获取点击位置的文本节点
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return;

        // 立即处理
        if (processTextNode(range.startContainer, range.startOffset)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true); // 使用捕获阶段确保优先处理
})();

