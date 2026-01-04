// ==UserScript==
// @name         URL Manager
// @namespace    https://space.bilibili.com/398910090
// @version      1.1
// @author       Ace
// @description  支持 HTTP 到 HTTPS 和 HTTPS 到 HTTP 重定向,支持关键字替换功能
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/516229/URL%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/516229/URL%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取重定向站点列表
    let httpToHttpsSites = JSON.parse(GM_getValue("httpToHttpsSites", "[]"));
    let httpsToHttpSites = JSON.parse(GM_getValue("httpsToHttpSites", "[]"));
    let keywordReplacements = JSON.parse(GM_getValue("keywordReplacements", "{}"));

    // 添加菜单选项
    GM_registerMenuCommand("将当前网站添加到 HTTP 重定向规则", () => toggleSite(httpToHttpsSites, "httpToHttpsSites"));
    GM_registerMenuCommand("将当前网站添加到 HTTPS 重定向规则", () => toggleSite(httpsToHttpSites, "httpsToHttpSites"));
    GM_registerMenuCommand("添加/删除网址替换规则", manageKeywordReplacements);

    // 站点添加/删除功能
    function toggleSite(siteList, storageKey) {
        const site = window.location.hostname;
        const siteIndex = siteList.indexOf(site);
        const action = siteIndex === -1 ? "添加到" : "从";
        if (confirm(`确定要删除${action} ${site} 的规则吗？`)) {
            siteIndex === -1 ? siteList.push(site) : siteList.splice(siteIndex, 1);
            GM_setValue(storageKey, JSON.stringify(siteList));
            alert(`已${action === "添加到" ? "添加" : "删除"} ${site} 的规则。`);
        }
    }

    // 添加/删除网址替换规则
    function manageKeywordReplacements() {
        const url = window.location.hostname;
        const keyword = prompt("请输入要替换的网址关键字：");
        if (!keyword) return;
        const replacement = prompt(`将 ${keyword} 替换成什么内容：`);
        if (replacement === null) return;

        if (!keywordReplacements[url]) keywordReplacements[url] = [];
        keywordReplacements[url].push({ keyword, replacement });
        GM_setValue("keywordReplacements", JSON.stringify(keywordReplacements));
        alert(`已为 ${url} 设置替换规则：${keyword} -> ${replacement}`);
    }

    // 执行 HTTP 到 HTTPS 或 HTTPS 到 HTTP 重定向
    function performRedirect() {
        const protocol = window.location.protocol;
        const host = window.location.hostname;

        if (protocol === "http:" && httpToHttpsSites.includes(host)) {
            window.location.href = window.location.href.replace("http://", "https://");
        } else if (protocol === "https:" && httpsToHttpSites.includes(host)) {
            window.location.href = window.location.href.replace("https://", "http://");
        }
    }

    // 关键字替换功能
    function applyKeywordReplacements() {
        const url = window.location.href;
        const host = window.location.hostname;

        if (keywordReplacements[host]) {
            let newUrl = url;
            keywordReplacements[host].forEach(replacement => {
                newUrl = newUrl.replace(new RegExp(replacement.keyword, "g"), replacement.replacement);
            });

            if (newUrl !== url) window.location.href = newUrl;
        }
    }

    performRedirect();
    applyKeywordReplacements();
})();
