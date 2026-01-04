// ==UserScript==
// @name         leetcode题目转markdown
// @namespace    https://github.com/faithererer/leetcode2md
// @version      2024-02-07
// @description  leetcode转md
// @author       faithererer
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @resource css https://unpkg.com/layui@2.9.6/dist/css/layui.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486822/leetcode%E9%A2%98%E7%9B%AE%E8%BD%ACmarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/486822/leetcode%E9%A2%98%E7%9B%AE%E8%BD%ACmarkdown.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // get title

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://unpkg.com/layui@2.9.6/dist/layui.js";
    document.body.appendChild(script);

    // let link = document.createElement("link");
    // link.rel = "stylesheet";
    // link.href = "https://unpkg.com/layui@2.9.6/dist/css/layui.css";
    // document.head.appendChild(link);
    var markdownText = ''


    window.onload = function () {
        // 创建一个按钮元素
        const btn = document.createElement("button");
        btn.innerText = "复制为Markdown";
        btn.style.fontSize = "16px";
        // 找到类名为"text-title-large"的元素
        const targetElement = document.querySelector(".text-title-large");

        targetElement.parentNode.insertBefore(btn, targetElement.nextSibling);

        btn.onclick = function () {
            // 获取题目的标题
            var title = document.querySelector(".text-title-large > a").innerText;
            title = '# ' + title + '\n'
            markdownText = markdownText + title
            // 获取题目的内容
            var content = document.querySelector("div[data-track-load='description_content']").innerHTML;
            markdownText = markdownText + htmlToMarkdown(content)
            // 复制到剪贴板
            navigator.clipboard.writeText(markdownText);
            // 提示用户复制成功
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        }


    }



    function htmlToMarkdown(html) {
        // 处理<pre>标签
        html = html.replace(/<pre>([\s\S]*?)<\/pre>/g, (match, codeBlock) => {
            return '```\n' + codeBlock.trim() + '\n```';
        });
        // 处理列表
        html = html.replace(/<ul>/g, '');
        html = html.replace(/<\/ul>/g, '');
        html = html.replace(/\s*<li>/g, '- ');
        html = html.replace(/<\/li>/g, '\n'); // 保持列表项结束后的换行
        // 转换<p>、<strong>和<code>
        html = html.replace(/<p>([\s\S]*?)<\/p>/g, '$1\n');
        html = html.replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**');
        html = html.replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
        // 移除HTML实体&nbsp;
        html = html.replace(/&nbsp;/g, ' ');
        // 匹配<img>标签，包括那些具有style属性的标签
        html = html.replace(/<img\s*(?:alt="([^"]*)"\s*)?src="([^"]+)"\s*(?:style="[^"]*"\s*)?\/?>/g, (match, alt = '', src) => {
            // 如果alt属性不存在，使用空字符串作为替代文本
            alt = alt || '';
            return `![${alt}](${src})`;
        });
        // 移除剩余的HTML标签（保守处理，可能会移除一些未处理的标签）
        html = html.replace(/<[^>]*>/g, '');
        // 移除连续的空行
        html = html.replace(/\n{2,}/g, '\n\n');
        return html.trim();
    }



})();