// ==UserScript==
// @name         VNDB 跳转、、
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license      MIT
// @description  VNDB跳转其他网站(自用)
// @author       breaker
// @match        https://vndb.org/v*
// @icon         https://www.vndb.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      bangumi.tv
// @connect      2dfan.com
// @connect      e-hentai.org
// @connect      bbs.kfpromax.com
// @downloadURL https://update.greasyfork.org/scripts/529560/VNDB%20%E8%B7%B3%E8%BD%AC%E3%80%81%E3%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/529560/VNDB%20%E8%B7%B3%E8%BD%AC%E3%80%81%E3%80%81.meta.js
// ==/UserScript==

((css) => {
    if (typeof GM_addStyle == "function") {
        GM_addStyle(css);
        return;
    }

    const styleElement = document.createElement("style");
    styleElement.textContent = css;
    document.head.append(styleElement);
})(`
    .rdl-app {
        position: absolute;
        top: 250px; /* 上侧距离 */
        right: 30px; /* 右侧距离 */
        width: 110px; /* 宽度 */
        background-color: #000000; /* 背景色 */
        border-radius: 8px;
        padding: 10px; /* 内边距 */
        z-index: 1000;
    }

    .rdl-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .rdl-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        background-color: #000000; /* 按钮背景色 */
        border: 1px solid #409eff; /* 边框颜色 */
        cursor: pointer;
        text-decoration: none;
        transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    }

    .rdl-button:visited {
        color: #3377AA; /* 访问过的链接颜色 */
    }

    .rdl-button:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
    }

    .rdl-button_green {
        background-color: #67c23a;
        border-color: #67c23a;
    }

    .rdl-button_green:hover {
        background-color: #85ce61;
        border-color: #85ce61;
    }

    .rdl-button_red {
        background-color: #f56c6c;
        border-color: #f56c6c;
    }

    .rdl-button_red:hover {
        background-color: #f89898;
        border-color: #f89898;
    }
`);

(function () {
    'use strict';

    initView();
    unlockTitleCopy();

    function initView() {
        const infoTable = document.querySelector('.vndetails');
        if (!infoTable) return;

        const rdlApp = createElement("div", null, "rdl-app");
        const rdlList = createElement("div", null, "rdl-list");

        const siteItems = [
            { "title": "御爱", "onlyAsmr": false },
            { "title": "鲲鲲", "onlyAsmr": false },
            { "title": "南+", "onlyAsmr": false },
            { "title": "bangumi", "onlyAsmr": false },
            { "title": "2DFan", "onlyAsmr": false },
            { "title": "eHentai", "onlyAsmr": false },
            { "title": "F95", "onlyAsmr": false }
        ];

        siteItems.forEach(item => {
            const element = createElement("a", item.title, "rdl-button");
            element.target = "_blank";
            rdlList.appendChild(element);
        });

        rdlApp.appendChild(rdlList);
        infoTable.parentNode.insertBefore(rdlApp, infoTable.nextSibling);

        checkExits();
    }

    function createElement(tag, text = null, className = null) {
        const element = document.createElement(tag);
        if (text) element.textContent = text;
        if (className) element.className = className;
        return element;
    }

    function findItem(t) {
        const list = document.getElementsByClassName("rdl-list")[0];
        return Array.from(list.children).find(item => item.textContent === t);
    }

    function getSearchParam(paramName) {
        try {
            const url = new URL(window.location.href);
            const param = url.searchParams.get(paramName);
            return param ? decodeURIComponent(param) : null;
        } catch {
            const regex = new RegExp(`[?&]${paramName}=([^&]+)`);
            const match = window.location.href.match(regex);
            return match ? decodeURIComponent(match[1]) : null;
        }
    }

    function normalizeText(text) {
        return text.trim()
                  .replace(/\s+/g, ' ')
                  .replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
                  .toLowerCase();
    }

    function searchAndHighlight(node, keyword) {
        if (!keyword) return;

        const normalizedKeyword = normalizeText(keyword);
        let isFirstMatch = true;

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const normalizedText = normalizeText(text);

                if (normalizedText.includes(normalizedKeyword)) {
                    const span = document.createElement('span');
                    span.textContent = text;
                    span.className = 'keyword-highlight';
                    span.style.backgroundColor = 'yellow';

                    node.replaceWith(span);

                    if (isFirstMatch) {
                        span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        isFirstMatch = false;
                    }

                    return true;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const style = window.getComputedStyle(node);
                if (style.display === 'none' || style.visibility === 'hidden') {
                    return false;
                }

                Array.from(node.childNodes).forEach(child => processNode(child));
            }
            return false;
        }

        processNode(node);
    }

    function init() {
        const keyword = getSearchParam('search');
        console.log('搜索关键词:', keyword);

        if (keyword) {
            if (document.body) {
                searchAndHighlight(document.body, keyword);
            } else {
                document.addEventListener('DOMContentLoaded', () =>
                    searchAndHighlight(document.body, keyword)
                );
            }

            const searchInput = document.querySelector('input[name="keyword"]');
            const searchButton = document.querySelector('input[name="submit"]');

            if (searchInput && searchButton) {
                searchInput.value = keyword;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                searchButton.click();

                console.log(`搜索已触发，关键词: "${keyword}"，等待结果加载...`);

                const observer = new MutationObserver(() => {
                    const searchResults = document.querySelector('.search-results');
                    if (searchResults) {
                        console.log('搜索结果已加载:', searchResults);
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                console.error('未找到搜索框或搜索按钮元素');
            }
        }
    }

    init();

    async function checkExits() {
        const selectors = [
            "body > main > article:nth-child(1) > h2",
            "body > main > article:nth-child(1) > div.vndetails > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > span",
            "body > main > article:nth-child(1) > div.vndetails > table > tbody > tr:nth-child(1) > td > details > summary > table > tbody > tr > td:nth-child(2) > span",
            "body > main > article:nth-child(1) > h1" // 更多备选选择器
        ];

        let Titles = null;
        for (const selector of selectors) {
            Titles = document.querySelector(selector);
            if (Titles) break;
        }

        if (Titles) {
            console.log("Titles found:", Titles.innerText);
        } else {
            console.error("No matching element found!");
        }

        setItemLink("御爱", `https://www.ai2.moe/search/?q=${Titles.innerText}`);
        setItemLink("鲲鲲", `https://www.moyu.moe/search?q=${Titles.innerText}`);
        setItemLink("南+", `https://www.east-plus.net/search.php?q=${Titles.innerText}`);
        setItemLink("bangumi", `https://bangumi.tv/subject_search/${Titles.innerText}?cat=4`);
        setItemLink("2DFan", `https://2dfan.com/subjects/search?keyword=${Titles.innerText}`);
        setItemLink("eHentai", `https://e-hentai.org/?f_search=${Titles.innerText}`);
        setItemLink("F95", `https://f95zone.to/search/040867454/?q=${Titles.innerText}&o=relevance`);
    }

    function setItemLink(Titles, url) {
        const item = findItem(Titles);
        if (item) {
            item.Titles = "rdl-button";
            item.href = url;
        }
    }

    function unlockTitleCopy() {
        if (!window.location.href.includes("vndb.org")) return;

        const titleElement1 = document.querySelector("#top_wrapper > ul > li:last-child");
        const titleElement2 = document.querySelector("body > main > article:nth-child(1) > div.vndetails > table > tbody > tr:nth-child(1) > td > details > summary > table > tbody > tr > td:nth-child(2) > span");

        if (titleElement1) {
            titleElement1.style = "user-select:auto";
        }
        if (titleElement2) {
            titleElement2.style = "user-select:auto";
        }
    }
})();
