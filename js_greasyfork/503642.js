// ==UserScript==
// @name         网页转为Markdown
// @namespace    https://ez118.github.io/
// @version      0.2
// @description  将当前页面的HTML转换为Markdown。
// @author       ZZY_WISU
// @match        *://*/*
// @connect      *
// @license      GNU GPLv3
// @icon         https://markdown.com.cn/hero.png
// @run-at       context-menu
// @grant        GM_setClipboard
// @require      https://unpkg.com/turndown@7.2.0/dist/turndown.js
// @downloadURL https://update.greasyfork.org/scripts/503642/%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%B8%BAMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/503642/%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%B8%BAMarkdown.meta.js
// ==/UserScript==

/* =====[ 用户配置 ]===== */

const isConvertToAbsoluteUrls = true; // 是否自动将相对链接转为绝对链接（true：是 / false：否）

/* ====================== */



function copy2clipboard(txt) {
    GM_setClipboard(txt);
}

function convertRelativeUrlsToAbsolute(markdown, baseUrl) {
    // 创建一个a元素用来解析URL
    const parser = document.createElement('a');
    parser.href = baseUrl;

    // 提取baseUrl的协议和主机部分
    const baseOrigin = `${parser.protocol}//${parser.host}`;

    // 提取baseUrl的路径部分
    const basePath = parser.pathname.substring(0, parser.pathname.lastIndexOf('/'));

    // 正则表达式匹配Markdown中的链接和图片
    const regex = /(!?\[.*?\]\()([^)]+)(\))/g;

    // 回调函数处理匹配的链接或图片路径
    return markdown.replace(regex, (match, prefix, url, suffix) => {
        // 忽略已是绝对链接的URL
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
            return match;
        }

        // 拼接相对路径为绝对路径
        let absoluteUrl;
        if (url.startsWith('/')) {
            absoluteUrl = baseOrigin + url;
        } else {
            absoluteUrl = baseOrigin + basePath + '/' + url;
        }

        return `${prefix}${absoluteUrl}${suffix}`;
    });
}

function getWebContents(txt) {
    /* 去掉影响转换的标签 */
    var markdown = txt.replace(/<script.*?>.*?<\/script>/gis, "")
        .replace(/<style.*?>.*?<\/style>/gis, "")
        .replace(/<nav.*?>.*?<\/nav>/gis, "");


    /* html转markdown */
    const turndownService = new TurndownService();
    markdown = turndownService.turndown(markdown);

    return markdown;
}


(function () {
    'use strict';

    var md = getWebContents(document.body.innerHTML);

    if(isConvertToAbsoluteUrls){
        md = convertRelativeUrlsToAbsolute(md, window.location.href);
    }

    copy2clipboard(md);

    alert("已复制");
})();