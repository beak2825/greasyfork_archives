// ==UserScript==
// @name         LetPub Search Link Injector with ID Fetching
// @namespace    http://tampermonkey.net/
// @version      2023-12-22
// @description  Add a link next to each element to search its content on LetPub by fetching its ID.
// @author       Yang Weiguang
// @match        https://webofscience.clarivate.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clarivate.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482922/LetPub%20Search%20Link%20Injector%20with%20ID%20Fetching.user.js
// @updateURL https://update.greasyfork.org/scripts/482922/LetPub%20Search%20Link%20Injector%20with%20ID%20Fetching.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function addLetPubSearchLink(element, journalId) {
        var searchLink = document.createElement('a');
        searchLink.href = `https://www.letpub.com.cn/index.php?journalid=${encodeURIComponent(journalId)}&page=journalapp&view=detail`;
        searchLink.textContent = 'LetPub';
        searchLink.style.marginLeft = '3px';
        searchLink.target = '_blank'; // 打开链接在新标签页

        element.parentNode.insertBefore(searchLink, element.nextSibling);

        // 获取并显示期刊信息
        fetchAndDisplayJournalInfo(searchLink, journalId);
    }

    function fetchAndDisplayJournalInfo(linkElement, journalId) {
        const detailUrl = `https://www.letpub.com.cn/index.php?journalid=${journalId}&page=journalapp&view=detail`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: detailUrl,
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    // 解析响应并提取信息（此处需要根据实际页面结构调整解析逻辑）
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.responseText, 'text/html');
                    var infoElement = doc.getElementsByTagName('table')[7].children[0].children[1].children[0];
                    if (infoElement) {
                        var category = infoElement.childNodes[0].textContent.trim();
                        var visibleSectors = Array.from(infoElement.querySelectorAll('span')).filter(span => span.style.display !== 'none');
                        var sectors = visibleSectors.map(span => span.textContent.trim()).join(', ');

                        // 在链接后显示信息
                        var infoText = document.createElement('span');
                        infoText.textContent = ` (${category}, ${sectors})`;
                        linkElement.parentNode.insertBefore(infoText, linkElement.nextSibling);
                    }
                }
            },
            onerror: function(error) {
                console.error('Error fetching journal details:', error);
            }
        });
    }

    function fetchJournalId(journalName, element, attemptCount = 0) {
        if (element.hasAttribute('data-letpub-link-added')) {
            return;
        }
        const MAX_ATTEMPTS = 5; // 最大尝试次数
        const RETRY_DELAY = 1000; // 重试间隔（毫秒）

        element.setAttribute('data-letpub-link-added', 'true'); // 先标记，再发送请求

        const url = `https://www.letpub.com.cn/journalappAjaxXS.php?querytype=autojournal&term=${encodeURIComponent(journalName)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    const data = JSON.parse(response.responseText)[0];
                    console.log(data.id);
                    if (data && data.id) {
                        addLetPubSearchLink(element, data.id);
                    }else if (attemptCount < MAX_ATTEMPTS) {
                    setTimeout(() => fetchJournalId(journalName, element, attemptCount + 1), RETRY_DELAY);
                }
                }
            },
            onerror: function(error) {
                console.error('Error during request:', error);
                if (attemptCount < MAX_ATTEMPTS) {
                    setTimeout(() => fetchJournalId(journalName, element, attemptCount + 1), RETRY_DELAY);
                }
            }
        });
    }

    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (node.getElementsByClassName) {
                        let targetElements = node.getElementsByClassName('mat-drawer-content mat-sidenav-content jcr-sidenav-content');
                        for (let element of targetElements) {
                            if (element.children.length > 0) {
                                const journalName = element.children[0].textContent.trim();
                                console.log(journalName);
                                fetchJournalId(journalName, element.children[0]);
                            }
                        }
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
//     const observer = new IntersectionObserver((entries, observer) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             const element = entry.target;
//             const journalName = element.textContent.trim();
//             tryFetchJournalInfo(journalName, element, 3); // 尝试3次
//             observer.unobserve(element); // 停止观察该元素
//         }
//     });
// }, { rootMargin: '0px', threshold: 0.1 });

// document.querySelectorAll('.mat-drawer-content .mat-sidenav-content .jcr-sidenav-content').forEach(element => {
//     observer.observe(element);
// });

})();
