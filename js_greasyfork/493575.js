// ==UserScript==
// @name         Google Scholar BibTeX Integration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add BibTeX results directly to each Google Scholar search result entry with a copy button
// @author       You
// @match        *://scholar.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/493575/Google%20Scholar%20BibTeX%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/493575/Google%20Scholar%20BibTeX%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有搜索结果项
    const results = document.querySelectorAll('.gs_r.gs_or.gs_scl');

    results.forEach(result => {
        const dataAid = result.dataset.aid;
        if (dataAid) {
            const citationUrl = `https://scholar.google.com/scholar?q=info:${dataAid}:scholar.google.com/&output=cite&scirp=0&hl=zh-TW`;

            // 发起获取引用信息的请求
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
                                // 创建一个显示BibTeX的新元素
                                const bibtexDiv = document.createElement('div');
                                const copyButton = document.createElement('button');
                                copyButton.textContent = 'Copy BibTeX';
                                copyButton.style.marginLeft = '10px';

                                bibtexDiv.style.marginTop = '10px';
                                bibtexDiv.style.padding = '10px';
                                bibtexDiv.style.backgroundColor = '#f9f9f9';
                                bibtexDiv.style.border = '1px solid #ccc';
                                bibtexDiv.textContent = bibtexResponse.responseText;

                                // 将按钮添加到div中
                                bibtexDiv.appendChild(copyButton);

                                // 添加点击事件监听器到按钮
                                copyButton.onclick = function() {
                                    GM_setClipboard(bibtexResponse.responseText, "text");
                                    // alert('Copied BibTeX to clipboard!');
                                };

                                // 添加到当前搜索结果项
                                result.appendChild(bibtexDiv);
                            }
                        });
                    }
                }
            });
        }
    });
})();
