// ==UserScript==
// @name         Link To Markdown
// @namespace    https://www.yuelili.com/
// @version      0.0.3
// @description  网站链接转 Markdown 格式
// @author       Yueli
// @match        *://*/*
// @icon         https://raiseyang.github.io/static/markdown_copy.png
// @require      https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465810/Link%20To%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/465810/Link%20To%20Markdown.meta.js
// ==/UserScript==

// @fork https://greasyfork.org/zh-CN/scripts/438841
//

(function () {
    "use strict";
    const { $ } = window;
    const hostMap = {
        "www.bilibili.com": () =>
            document.title.replace("_哔哩哔哩_bilibili", "_B站") + "_" + document.querySelector('meta[name="author"]').getAttribute("content"),
        "space.bilibili.com": () => document.title.replace("_哔哩哔哩_bilibili", "_B站"),
        "blog.csdn.net": () => $("#articleContentId").text(),
        "juejin.cn": () => $(".article-title").text().trim(),
        "github.com": () => document.title.split(":")[0],
        "jianshu.com": () => document.title.split(" - 简书")[0],
        "cloud.tencent.com": () => document.title.split(" - 云+社区 - 腾讯云")[0],
        "medium.com": () => getMeta("og:title"),
        "www.zhihu.com": () => document.title.split(" - 知乎")[0].replace(/\(.*私信.*\)/g, ""),
    };

    const getMeta = (prop) => $('meta[property="' + prop + '"]').attr("content");

    // 创建按钮
    const button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "markdown_copy";
    button.textContent = "拷贝链接";
    button.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 10px;
            background:#282C34;
            width: 92px;
            height: 30px;
            color:white;
            z-index:999;
            font-weight:bold;
            font-size:15px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            border-radius:50px;
            `;
    const hover_style = `button#markdown_copy:hover{opacity:1!important}`;
    GM_addStyle(hover_style);

    //绑定按键点击功能
    button.onclick = function () {
        const link = window.location.href;
        const { host } = window.location;
        const title = hostMap[host] ? hostMap[host]() : document.title;
        const markdownLink = `[${title}](${link})`;
        GM_setClipboard(markdownLink, "text");
    };

    $(function () {
        $("body").append(button); // 添加button按钮
    });
})();
