// ==UserScript==
// @name         arXiv论文一键翻译
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  arXiv论文一键翻译，很方便，祝你学术步步高升！
// @author       xx025,trotsky1997
// @license MIT
// @homepage     https://github.com/xx025/strawberry
// @match        https://arxiv.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_setValue
// @grant           GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/472714/arXiv%E8%AE%BA%E6%96%87%E4%B8%80%E9%94%AE%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/472714/arXiv%E8%AE%BA%E6%96%87%E4%B8%80%E9%94%AE%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
if(location.href.startsWith("https://arxiv.org/abs/")){

    // 获取要在其后添加新元素的元素
    const list = document.querySelector(".full-text ul");


    // 点击下载按钮，在新标签中打开
    list.querySelector('.abs-button.download-pdf').target = '_blank'


    // 创建新的 li 元素
    const newLi = document.createElement("li");
    newLi.style.color = "black";

    // 创建 a 元素，并设置其 href 和 class 属性
    const newLink = document.createElement("a");
    newLink.href = `https://fanyi.youdao.com/trans/#/home?keyfrom=fanyiweb&url=${location.href}&type=undefined`
    newLink.className = "abs-button download-format";
    newLink.target = "_blank";// 在新标签中打开链接
    newLink.style.color = "#8cbd18";

    // 设置 a 元素的文本内容
    const linkText = document.createTextNode("🐉一键翻译");
    newLink.appendChild(linkText);

    // 将 a 元素添加到新的 li 元素中
    newLi.appendChild(newLink);

    // 将新的 li 元素添加到列表中
    list.appendChild(newLi);
}

            GM_registerMenuCommand("立即翻译",()=>{
                let targetUrl=`https://fanyi.youdao.com/trans/#/home?keyfrom=fanyiweb&url=${location.href}&type=undefined`;
                GM_openInTab(targetUrl, {active:true});
            });

})();