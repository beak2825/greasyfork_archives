// ==UserScript==
// @name         Google Scholar标题翻译（有道 & Google & DeepL & CNKI选择）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  将Google Scholar搜索结果标题翻译为中文，并在英文标题上一行显示（可选择使用有道、Google、DeepL或CNKI翻译）
// @author       Pencilheart
// @match        https://scholar.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      dict.youdao.com
// @connect      translate.googleapis.com
// @connect      deepl.com
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/528747/Google%20Scholar%E6%A0%87%E9%A2%98%E7%BF%BB%E8%AF%91%EF%BC%88%E6%9C%89%E9%81%93%20%20Google%20%20DeepL%20%20CNKI%E9%80%89%E6%8B%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528747/Google%20Scholar%E6%A0%87%E9%A2%98%E7%BF%BB%E8%AF%91%EF%BC%88%E6%9C%89%E9%81%93%20%20Google%20%20DeepL%20%20CNKI%E9%80%89%E6%8B%A9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let translationService = GM_getValue('translationService', 'youdao');

    GM_registerMenuCommand("使用有道翻译", () => {
        GM_setValue('translationService', 'youdao');
        location.reload();
    });

    GM_registerMenuCommand("使用Google翻译", () => {
        GM_setValue('translationService', 'google');
        location.reload();
    });

    GM_registerMenuCommand("使用DeepL翻译", () => {
        GM_setValue('translationService', 'deepl');
        location.reload();
    });

    GM_registerMenuCommand("使用CNKI翻译", () => {
        GM_setValue('translationService', 'cnki');
        location.reload();
    });

    const titleSelector = '.gs_rt';

    document.querySelectorAll(titleSelector).forEach(titleElement => {
        const titleLink = titleElement.querySelector('a');
        if (titleLink) {
            const originalTitle = titleLink.textContent;
            const titleUrl = titleLink.href;

            // **让英文标题变小**
            titleLink.style.fontSize = 'small';

            // **在新标签页打开链接**
            titleLink.setAttribute('target', '_blank');

            setTimeout(() => {
                translateText(originalTitle, GM_getValue('translationService', 'youdao'), (translatedText) => {
                    // **创建翻译后的超链接**
                    const translatedLink = document.createElement('a');
                    translatedLink.href = titleUrl;
                    translatedLink.textContent = translatedText;
                    translatedLink.style.textDecoration = 'none';
                    translatedLink.style.display = 'block';
                    translatedLink.style.fontFamily = getComputedStyle(titleLink).fontFamily;
                    translatedLink.style.fontSize = 'large';
                    translatedLink.style.fontWeight = getComputedStyle(titleLink).fontWeight;
                    translatedLink.style.margin = '0';
                    translatedLink.style.lineHeight = '1.1';
                    translatedLink.style.color = ''; // 让浏览器控制颜色

                    // 添加 CSS 规则，确保 :visited 颜色
                    const styleSheet = document.createElement('style');
                    styleSheet.textContent = 'a:visited { color: purple !important; }';
                    document.head.appendChild(styleSheet);

                    // **在新标签页打开翻译后的链接**
                    translatedLink.setAttribute('target', '_blank');

                    // **鼠标悬停时显示下划线**
                    translatedLink.addEventListener('mouseenter', () => {
                        translatedLink.style.textDecoration = 'underline';
                    });
                    translatedLink.addEventListener('mouseleave', () => {
                        translatedLink.style.textDecoration = 'none';
                    });

                    titleElement.insertBefore(translatedLink, titleElement.firstChild);
                });
            }, 1000);
        }
    });

    function translateText(text, service, callback) {
        if (service === 'google') {
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        const translatedText = result[0][0][0];
                        callback(translatedText);
                    } catch (e) {
                        console.error('Google 翻译失败:', e);
                        callback('翻译失败');
                    }
                },
                onerror: function() {
                    console.error('Google 翻译API请求失败');
                    callback('翻译失败');
                }
            });
        } else if (service === 'deepl') {
            const url = `https://www.deepl.com/translator#en/zh/${encodeURIComponent(text)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const translationElement = doc.querySelector('.lmt__translations_as_text__text_btn');
                        const translatedText = translationElement ? translationElement.textContent.trim() : '翻译失败';
                        callback(translatedText);
                    } catch (e) {
                        console.error('DeepL翻译解析失败:', e);
                        callback('翻译失败');
                    }
                },
                onerror: function() {
                    console.error('DeepL翻译请求失败');
                    callback('翻译失败');
                }
            });
        } else if (service === 'youdao') {
            const url = `https://dict.youdao.com/search?q=${encodeURIComponent(text)}&keyfrom=fanyi.smartResult`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const translationElement = doc.querySelector('#fanyiToggle > div > p:nth-child(2)');
                        const translatedText = translationElement ? translationElement.textContent.trim() : '翻译失败';
                        callback(translatedText);
                    } catch (e) {
                        console.error('有道翻译解析失败:', e);
                        callback('翻译失败');
                    }
                },
                onerror: function() {
                    console.error('有道翻译请求失败');
                    callback('翻译失败');
                }
            });
        } else if (service === 'cnki') {
            const url = `https://kns.cnki.net/kns/brief/Default_Result.aspx?dbprefix=CDFD&q=${encodeURIComponent(text)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const translationElement = doc.querySelector('.fanyi_result_class'); // 需要根据实际页面结构修改
                        const translatedText = translationElement ? translationElement.textContent.trim() : '翻译失败';
                        callback(translatedText);
                    } catch (e) {
                        console.error('CNKI翻译解析失败:', e);
                        callback('翻译失败');
                    }
                },
                onerror: function() {
                    console.error('CNKI翻译请求失败');
                    callback('翻译失败');
                }
            });
        }
    }
})();
