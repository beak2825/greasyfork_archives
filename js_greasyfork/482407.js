// ==UserScript==
// @name         微软文档语言切换
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  微软文档快捷语言切换按钮
// @author       iron2han
// @match        *://learn.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482407/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/482407/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        let lang = getCurrentLang();

        if (lang == null) {
            return;
        }

        let xpathResult = document.evaluate('//*[@id="ms--secondary-nav"]//div[@class="buttons"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)

        if (xpathResult.snapshotLength == 0) {
            return;
        }

        let ele = xpathResult.snapshotItem(0);

        lang = lang.toLowerCase();

        if (lang != 'zh-cn') {
            ele.appendChild(createZHCNElement())
        }

        if (lang != 'en-us') {
            ele.appendChild(createENUSElement())
        }

    }, false);
})();

function createENUSElement() {
    let div = document.createElement('div');

    div.style = "margin-left: 5px";

    let url = replaceUrl('en-us');

    div.innerHTML = `<a data-test-id="navbar-primary-cta" class="button button-sm button-primary button-filled margin-right-none" href="${url}" data-bi-name="secondary-nav-cta-primary-download-dotnet">
切换到英文
</a>`;

    return div;
}


function createZHCNElement() {
    let div = document.createElement('div');

    div.style = "margin-left: 5px";

    let url = replaceUrl('zh-cn');

    div.innerHTML = `<a data-test-id="navbar-primary-cta" class="button button-sm button-primary button-filled margin-right-none" href="${url}" data-bi-name="secondary-nav-cta-primary-download-dotnet">
切换到中文
</a>`;

    return div;
}

function replaceUrl(lang) {
    let currentLang = getCurrentLang();

    if (currentLang == null) {
        return location.href;
    }

    return location.href.replace(currentLang, lang);
}

function getCurrentLang() {
    let match = this.location.href.match('com\/([a-zA-Z]{2,2}\-[a-zA-Z]{2,2})\/');

    if (match == null) {
        return null;
    }

    let lang = match[1];
    return lang;
}