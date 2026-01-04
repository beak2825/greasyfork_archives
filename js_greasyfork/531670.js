// ==UserScript==
// @name         维基百科任何语言自动重定向中文
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  重定向至 zh.wikipedia.org，使用任何语言时自动改为中文维基
// @match        *://*.wikipedia.org/wiki/*
// @grant        GM_xmlhttpRequest
// @connect      *.wikipedia.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531670/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BB%BB%E4%BD%95%E8%AF%AD%E8%A8%80%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/531670/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BB%BB%E4%BD%95%E8%AF%AD%E8%A8%80%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    if (!url.includes("zh.wikipedia.org")) {
        var langMatch = url.match(/\/\/([a-z]{2,3})\.wikipedia\.org/);
        if (!langMatch) {
            console.error("无法识别语言代码，URL:", url);
            return;
        }
        var currentLang = langMatch[1];
        var path = url.split('/wiki/')[1];
        if (!path) {
            console.error("无法提取标题，URL:", url);
            return;
        }
        var title = decodeURIComponent(path);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://${currentLang}.wikipedia.org/w/api.php?action=query&format=json&prop=langlinks&titles=${encodeURIComponent(title)}&lllang=zh`,
            onload: function(response) {
                try {
                    var data = JSON.parse(response.responseText);
                    var pages = data.query.pages;
                    var pageId = Object.keys(pages)[0];
                    if (pageId === "-1" || !pages[pageId].langlinks) {
                        console.log("未找到对应中文页面，标题:", title);
                        window.location.href = "https://zh.wikipedia.org/wiki/" + encodeURIComponent(title);
                        return;
                    }
                    var zhTitle = pages[pageId].langlinks[0]["*"];
                    console.log(`从 ${currentLang} 标题 "${title}" 找到中文标题: "${zhTitle}"`);
                    window.location.href = "https://zh.wikipedia.org/wiki/" + encodeURIComponent(zhTitle);
                } catch (e) {
                    console.error("API 解析失败:", e);
                    window.location.href = "https://zh.wikipedia.org/wiki/" + encodeURIComponent(title);
                }
            },
            onerror: function(error) {
                console.error("API 请求失败:", error);
                window.location.href = "https://zh.wikipedia.org/wiki/" + encodeURIComponent(title);
            }
        });
    }
})();