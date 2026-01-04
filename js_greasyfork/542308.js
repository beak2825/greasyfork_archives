// ==UserScript==
// @name         Bilibili 转录文本复制
// @version      1.0
// @description  用来一键复制 Bilibili 网页版视频的转录文本
// @author       BHznJNs
// @license      MIT
// @namespace    https://bilibili.com/
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542308/Bilibili%20%E8%BD%AC%E5%BD%95%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542308/Bilibili%20%E8%BD%AC%E5%BD%95%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

const copyButton = document.createElement("button");
copyButton.textContent = "复制转录文本";
copyButton.style.marginRight = "10px";
copyButton.addEventListener("click", async function() {
    const aiAssistantButton = document.querySelector("#arc_toolbar_report .video-toolbar-right .video-ai-assistant");
    aiAssistantButton.click();
    const transcriptionBodyQuery = "[data-video-assistant-subject-main]";
    while (!document.querySelector(transcriptionBodyQuery)) {
        console.log("can not find transcriptionBodyQuery");
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // switch to transcription tab
    document.querySelector("[data-video-assistant-subject-tabs]").childNodes[1].click();

    const transcriptionBodyElement = document.querySelector(transcriptionBodyQuery);
    navigator.clipboard.writeText(transcriptionBodyElement.innerText);
});

(async function() {
    'use strict';
    const toolbar = document.querySelector("#arc_toolbar_report .video-toolbar-right");
    while (!toolbar.querySelector(".video-ai-assistant")) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    toolbar.prepend(copyButton);
})();

