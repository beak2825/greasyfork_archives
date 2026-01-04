// ==UserScript==
// @name         MDN中文文档自动跳转
// @version      1.1
// @license      MIT
// @description  自动将MDN文档跳转到简体中文版本，并在404或请求失败时替换为默认语言
// @match        *://developer.mozilla.org/*/docs/*
// @icon         https://developer.mozilla.org/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/746989
// @downloadURL https://update.greasyfork.org/scripts/533393/MDN%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533393/MDN%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


function getNewUrl(url, pathRegex, languageCode) {
    const path = url.pathname.replace(pathRegex, `/${languageCode}/`);
    return `https://${url.host}${path}${url.search}${url.hash}`;
}

function turn2new_url(currentUrl, newUrl, pathRegex, defaultCodes) {
    if (newUrl === currentUrl.href) {
        console.log(`Skipping redirect to avoid loop: ${newUrl}`);
        return
    }
    if (defaultCodes) {
        newUrl = getNewUrl(newUrl, pathRegex, defaultCodes);
    }
    window.location.replace(newUrl);
}

(function() {
    'use strict';

    // 定义需要跳转的语言代码列表
    const languageCodes = ['en-US', 'zh-HK', 'zh-TW','zh-CN', 'ja-JP','ja', 'fr-FR', 'fr', 'de', 'ko'];
    const defaultCodes = 'en-US'; // 默认语言代码

    // 动态生成正则表达式
    const pathRegex = new RegExp(`\\/(${languageCodes.join('|')})\\/`);

    const currentUrl = new URL(window.location.href);
    // 匹配路径中的语言代码部分
    const matchResult = currentUrl.pathname.match(pathRegex);

    if (matchResult) {
        // 替换语言代码为 zh-CN
        let newUrl = getNewUrl(currentUrl, pathRegex, 'zh-CN');

        // 获取存储的404 URL列表
        const stored404Urls = GM_getValue('404Urls', []);

        // 检查目标URL是否已经在404列表中
        if (stored404Urls.includes(newUrl)) {
            console.log(`URL already in 404 list: ${newUrl}`);
            // 如果已经存在，替换为默认语言并跳转
            turn2new_url(currentUrl, newUrl, pathRegex, defaultCodes);
            return;
        }

        // 检查目标URL是否存在
        GM_xmlhttpRequest({
            method: "GET",
            url: newUrl,
            onload: function(response) {
                if (response.status === 404) {
                    // 如果404，存储URL到Tampermonkey的存储中
                    stored404Urls.push(newUrl);
                    GM_setValue('404Urls', stored404Urls);
                    console.log(`404 URL stored: ${newUrl}`);

                    // 替换为默认语言并跳转
                    turn2new_url(currentUrl, newUrl, pathRegex, defaultCodes);
                } else {
                    turn2new_url(currentUrl, newUrl, pathRegex, null);
                }
            },
            onerror: function(response) {
                // 如果请求失败，存储URL
                stored404Urls.push(newUrl);
                GM_setValue('404Urls', stored404Urls);
                console.log(`Request failed, URL stored: ${newUrl}`);

                // 替换为默认语言并跳转
                turn2new_url(currentUrl, pathRegex, defaultCodes);
            }
        });
    }
})();

