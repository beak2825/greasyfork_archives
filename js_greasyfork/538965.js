// ==UserScript==
// @name         网页字幕自动搜索器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动扫描网页中.archive-title或.film-info-title区域内的番号类字符串(如 ABC-123)，并从迅雷接口搜索可用字幕，提供备用的Subtitlecat搜索，将结果添加到脚本菜单以便一键操作。
// @author       xxjxt
// @match        https://sextb.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_openInTab
// @connect      api-shoulei-ssl.xunlei.com
// @downloadURL https://update.greasyfork.org/scripts/538965/%E7%BD%91%E9%A1%B5%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538965/%E7%BD%91%E9%A1%B5%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=';
    const SEARCH_URL = 'https://subtitlecat.com/index.php?search=';
    const REGEX = /[a-zA-Z0-9]+-[a-zA-Z0-9]+/g;
    const MAX_LENGTH = 15;

    function addSubtitlecatMenu(name) {
        const menuText = `在 Subtitlecat 搜索: ${name}`;
        GM_registerMenuCommand(menuText, () => {
            GM_openInTab(SEARCH_URL + name, { active: true });
        });
    }

    function processSubtitleList(subtitles) {
        subtitles.forEach(sub => {
            if (sub.name && sub.url) {
                const menuText = `[${sub.ext}] ${sub.name}`;
                GM_registerMenuCommand(menuText, () => {
                    GM_setClipboard(sub.url);
                    GM_notification({
                        text: `已复制: ${sub.url}`,
                        title: '复制成功',
                        timeout: 3000
                    });
                });
            }
        });
    }

    function searchSubtitles(name) {
        console.log(name);
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL + name,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        if (jsonResponse.code === 0 && jsonResponse.data && jsonResponse.data.length > 0) {
                            processSubtitleList(jsonResponse.data);
                        }
                    } catch (e) {}
                }
                addSubtitlecatMenu(name);
            },
            onerror: function(error) {
                addSubtitlecatMenu(name);
            }
        });
    }

    function main() {
        const titleElements = document.querySelectorAll('.film-info-title, .archive-title');

        for (const element of titleElements) {
            const textContent = element.innerText;
            const matches = textContent.match(REGEX);

            if (matches && matches.length > 0) {
                const firstMatch = matches[0];
                if (firstMatch.length <= MAX_LENGTH) {
                    const name = firstMatch.toUpperCase();
                    searchSubtitles(name);
                    return;
                }
            }
        }
    }

    main();
})();