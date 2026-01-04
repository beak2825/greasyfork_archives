// ==UserScript==
// @name         Speedrun.com自动切换为中文
// @namespace    https://www.speedrun.com/
// @version      1.1
// @description  自动将Speedrun.com网址重定向到中文页面并处理语言切换问题
// @author       Him778
// @match        https://www.speedrun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519999/Speedruncom%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BA%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/519999/Speedruncom%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BA%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当前URL
    let currentUrl = window.location.href;

    // 定义语言路径
    const languagePaths = [
        "en-US", "ar-EG", "de-DE", "es-ES", "fr-FR", "hi-IN", "id-ID",
        "it-IT", "ja-JP", "ko-KR", "nl-NL", "pl-PL", "pt-BR",
        "ru-RU", "sv-SE", "tr-TR"
    ];

    // 提取主路径部分，例如 /fr-FR 或 /zh-CN
    let pathSegments = new URL(currentUrl).pathname.split('/').filter(Boolean);

    // 如果是语言切换路径，则将语言切换为 zh-CN
    if (pathSegments.length > 0 && languagePaths.includes(pathSegments[0])) {
        // 移除当前语言路径，插入 zh-CN
        pathSegments[0] = "zh-CN";
        let newUrl = "https://www.speedrun.com/" + pathSegments.join('/') + window.location.search;
        window.location.replace(newUrl);
        return;
    }

    // 如果不是 zh-CN 页面，则重定向到 zh-CN
    if (!pathSegments.includes("zh-CN")) {
        let newUrl = currentUrl.replace('https://www.speedrun.com/', 'https://www.speedrun.com/zh-CN/');
        window.location.replace(newUrl);
    }
})();
