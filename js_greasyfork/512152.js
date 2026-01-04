// ==UserScript==
// @name         Google Scholar BibTeX Integration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add BibTeX results directly to each Google Scholar search result entry with a copy button
// @author       You
// @match        *://scholar.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512152/Google%20Scholar%20BibTeX%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/512152/Google%20Scholar%20BibTeX%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个用于显示提示信息的函数
    function showTooltip(message) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'fixed';
        tooltip.style.bottom = '20px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = '#4CAF50';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);

        // 3秒后自动移除提示
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // 获取所有搜索结果项
    const results = document.querySelectorAll('.gs_r.gs_or.gs_scl');

    results.forEach(result => {
        const dataAid = result.dataset.aid;
        if (dataAid) {
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy BibTeX';
            copyButton.style.marginLeft = '5px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.border = 'none';
            copyButton.style.background = 'none';
            copyButton.style.color = '#1a0dab';
            copyButton.style.fontSize = 'small';

            // 添加点击事件监听器到按钮
            copyButton.onclick = function() {
                showTooltip('BibTeX Fetching!');
                const citationUrl = `https://scholar.google.com/scholar?q=info:${dataAid}:scholar.google.com/&output=cite&scirp=0&hl=zh-TW`;

                // 在点击按钮时才发起获取引用信息的请求
                GM_xmlhttpRequest({
                    method: "GET",
                    url: citationUrl,
                    onload: function(response) {
                        // 解析HTML以找到BibTeX链接
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const bibtexLink = doc.querySelector('a.gs_citi[href*="scholar.bib"]');

                        if (bibtexLink) {
                            // 发起获取BibTeX数据的请求
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: bibtexLink.href,
                                onload: function(bibtexResponse) {
                                    // 将BibTeX数据复制到剪贴板
                                    GM_setClipboard(bibtexResponse.responseText, "text");
                                    // 显示温和的提示信息
                                    showTooltip('BibTeX copied to clipboard!');
                                }
                            });
                        }
                    }
                });
            };

            // 查找当前搜索结果中的选项栏 (gs_fl)
            const optionBar = result.querySelector('.gs_fl');
            if (optionBar) {
                // 创建一个新的 <li> 元素，并将按钮添加到其中
                const listItem = document.createElement('li');
                listItem.appendChild(copyButton);
                optionBar.appendChild(listItem);
            }
        }
    });
})();
