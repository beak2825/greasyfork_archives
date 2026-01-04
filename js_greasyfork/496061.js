/** @format */

// ==UserScript==
// @name         草飞pixiv浏览记录会员限制
// @namespace    http://github.com/serverbread
// @version      2024-05-25.2
// @description  狠狠破解pixiv让你可以使用一些会员的功能
// @author       serverbread
// @license      GPL v3.0 or later
// @match        https://www.pixiv.net/history.php
// @icon         https://img2.imgtp.com/2024/05/25/SFaA6pMv.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496061/%E8%8D%89%E9%A3%9Epixiv%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95%E4%BC%9A%E5%91%98%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/496061/%E8%8D%89%E9%A3%9Epixiv%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95%E4%BC%9A%E5%91%98%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

function runReplace() {
    const illustsBox = document.getElementsByClassName("illust")[0];
    illustsBox.childNodes[0].childNodes.forEach(el => {
        console.log(el.tagName);
        if (el.tagName != "SPAN") return;
        console.log(el);
        const picUrlCSS = el.style.backgroundImage;
        const picUrl = picUrlCSS.substring(5, picUrlCSS.length - 2);

        const pid = picUrl.split("/")[13].split("_")[0];
        // 新建a标签
        const aTag = document.createElement("a");
        aTag.className = "_history-item show-detail list-item";
        aTag.href = `/artworks/${pid}`;
        aTag.target = "_blank";
        aTag.style.backgroundImage = el.style.backgroundImage;
        aTag.rel = "noreferrer";
        // 新建a标签内部的一个div子标签
        const divTag = document.createElement("div");
        divTag.className = "status";
        // 绑定div到a
        aTag.appendChild(divTag);
        // 替换node

        illustsBox.childNodes[0].replaceChild(aTag, el);
    });
}

(function () {
    "use strict";
    console.log("脚本已注入😋");
    // 生成激活按钮
    const buttonEl = document.createElement("button");
    buttonEl.innerText = "点此激活并狠狠草飞会员限制😋";
    buttonEl.id = "caofei-button";
    buttonEl.onclick = () => {
        runReplace();
        console.log("已成功将所有图片解锁！😋");
        console.log("🤚请节制，冲多了对身体不好");
        console.log("冲死了不怪我😡");
        buttonEl.innerText = "已激活并草飞！";
        buttonEl.disabled = true;
        // 草飞提示栏
        document.getElementsByTagName("section")[1].parentElement.remove();
    };
    // 挂载
    const titleEl = document.getElementsByTagName("h1")[0];
    titleEl.appendChild(buttonEl);

    // 生成CSS
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
#caofei-button {
    color: white;
    background-color: rgb(31, 153, 251);
    border-style: initial;
    border-radius: 50px;
    margin-left: 20px;
    padding: 10px;
}

#caofei-button[disabled] {
    background-color: rgba(0, 0, 0, 0.2256) !important;
}
`;
    // 挂载css
    document.head.appendChild(styleEl);
})();
