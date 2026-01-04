// ==UserScript==
// @name         Zhihu MCN & Date Displayer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在知乎回答页面，查询并显示作者的MCN机构信息。
// @author       Kiddo
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538380/Zhihu%20MCN%20%20Date%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/538380/Zhihu%20MCN%20%20Date%20Displayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[MCN & Date Displayer] Script started.');

    const PROCESSED_MARKER = 'data-date-processed-v1'; // 使用新标记以防旧标记冲突
    const MCN_PROCESSED_MARKER = 'data-mcn-processed-v1'; // 使用新标记以防旧标记冲突

    /**
     * 将MCN信息添加到作者头部
     * @param {HTMLElement} authorDiv - AuthorInfo-detail 所在的 div
     * @param {string} mcnCompany - MCN公司名称
     * @param {string} urlToken - 用户urlToken
     */
    function displayMcnInfo(authorDiv, mcnCompany, urlToken) {
        // MCN信息依然添加到 AuthorInfo-head
        const headDiv = authorDiv.closest('.AuthorInfo').querySelector('.AuthorInfo-content .AuthorInfo-head');
        if (headDiv && !headDiv.hasAttribute('data-mcn-added')) { // 检查MCN是否已添加
            const mcnSpan = document.createElement('span');
            mcnSpan.className = 'mcn-info-span';
            mcnSpan.textContent = `MCN: ${mcnCompany}`;
            mcnSpan.style.marginLeft = '8px';
            mcnSpan.style.fontSize = '12px';
            mcnSpan.style.color = '#8590a6';
            mcnSpan.style.backgroundColor = '#f0f2f7';
            mcnSpan.style.padding = '1px 4px';
            mcnSpan.style.borderRadius = '3px';
            mcnSpan.style.whiteSpace = 'nowrap'; // 防止换行

            headDiv.appendChild(mcnSpan);
            headDiv.setAttribute('data-mcn-added', 'true'); // 标记MCN已添加
            console.log(`[MCN & Date Displayer] Added MCN info for ${urlToken}: ${mcnCompany}`);
        }
    }

    /**
     * 将创建和修改日期添加到 AuthorInfo-badgeText
     * @param {HTMLElement} contentItem - 对应的 ContentItem AnswerItem 元素
     */
    function displayDateInfo(contentItem) {
        const dateCreatedMeta = contentItem.querySelector('meta[itemprop="dateCreated"]');
        const dateModifiedMeta = contentItem.querySelector('meta[itemprop="dateModified"]');
        // const badgeTextDiv = contentItem.querySelector('.AuthorInfo-head');
        const badgeTextDiv = contentItem.querySelector('div[itemprop="zhihu:question"]');

        if (badgeTextDiv && !badgeTextDiv.hasAttribute('data-date-added')) { // 检查日期是否已添加
            let dateInfo = '';
            let createdDate = '';
            let modifiedDate = '';

            if (dateCreatedMeta && dateCreatedMeta.getAttribute('content')) {
                // 格式化日期：例如 "2020-04-02"
                createdDate = new Date(dateCreatedMeta.getAttribute('content')).toISOString().split('T')[0];
                dateInfo += `创建: ${createdDate}`;
            }

            if (dateModifiedMeta && dateModifiedMeta.getAttribute('content')) {
                modifiedDate = new Date(dateModifiedMeta.getAttribute('content')).toISOString().split('T')[0];
                if (createdDate !== modifiedDate) { // 只有创建和修改日期不同才显示修改日期
                    if (dateInfo) {
                        dateInfo += ' | ';
                    }
                    dateInfo += `修改: ${modifiedDate}`;
                }
            }

            if (dateInfo) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'date-info-span';
                // 插入到现有文本前或后，这里选择追加，可以调整
                dateSpan.textContent = ` (${dateInfo})`;
                dateSpan.style.fontSize = '12px';
                dateSpan.style.color = '#8590a6';
                dateSpan.style.whiteSpace = 'nowrap'; // 防止换行

                // 为了不影响原有的徽章文本显示，可以考虑加在徽章文本的后面
                badgeTextDiv.appendChild(dateSpan);
                badgeTextDiv.setAttribute('data-date-added', 'true'); // 标记日期已添加
                console.log(`[MCN & Date Displayer] Added date info for answer: ${createdDate} | ${modifiedDate}`);
            }
        }
    }

    /**
     * 处理页面上未处理的 ContentItem AnswerItem
     */
    function processContentItems() {
        console.log('[MCN & Date Displayer] processContentItems() called.');
        // 查找所有未处理Date的 ContentItem AnswerItem
        const contentItems = document.querySelectorAll(`.ContentItem.AnswerItem:not([${PROCESSED_MARKER}])`);

        if (contentItems.length > 0) {
            console.log(`[Date Displayer] Found ${contentItems.length} new ContentItem AnswerItem blocks to process.`);
            contentItems.forEach(contentItem => {
                // 提取日期信息并显示
                displayDateInfo(contentItem);
                contentItem.setAttribute(PROCESSED_MARKER, 'true'); // 标记为已处理
            });
        } else {
            console.log('[Date Displayer] No new ContentItem AnswerItem blocks found.');
        }
        // 查找所有未处理的MCN ContentItem AnswerItem
        const mcnContentItems = document.querySelectorAll(`.ContentItem.AnswerItem:not([${MCN_PROCESSED_MARKER}])`);

        if (mcnContentItems.length > 0) {
            console.log(`[MCN Displayer] Found ${mcnContentItems.length} new ContentItem AnswerItem blocks to process.`);
            mcnContentItems.forEach(contentItem => {
                // 提取MCN信息并显示
                const authorDiv = contentItem.querySelector('.AuthorInfo');
                if (authorDiv) {
                    fetchAndDisplayMcn(authorDiv);
                    contentItem.setAttribute(MCN_PROCESSED_MARKER, 'true'); // 标记为已处理
                } else {
                    console.warn('[MCN Displayer] Could not find .AuthorInfo in:', contentItem);
                }
            });
        } else {
            console.log('[MCN Displayer] No new ContentItem AnswerItem blocks found.');
        }
    }

    /**
     * 抓取并显示MCN信息 (原函数，略有调整以适应新的流程)
     * @param {HTMLElement} authorDiv - AuthorInfo AnswerItem-authorInfo 元素
     */
    function fetchAndDisplayMcn(authorDiv) {
        // MCN信息现在只在 displayMcnInfo 内部检查是否已添加，
        // 这里的 PROCESSED_MARKER 主要用于标记整个 contentItem
        // if (authorDiv.hasAttribute(PROCESSED_MARKER)) { // 这个标记现在移动到 contentItem 上
        //     return;
        // }
        // authorDiv.setAttribute(PROCESSED_MARKER, 'true'); // 这个标记现在移动到 contentItem 上

        const metaUrlElement = authorDiv.querySelector('meta[itemprop="url"]');
        if (!metaUrlElement) {
            console.warn('[MCN & Date Displayer] Could not find meta itemprop="url" in:', authorDiv);
            return;
        }

        let profileUrl = metaUrlElement.getAttribute('content');
        if (!profileUrl) {
            console.warn('[MCN & Date Displayer] Profile URL is empty in:', authorDiv);
            return;
        }

        if (profileUrl.startsWith('//')) {
            profileUrl = 'https:' + profileUrl;
        }

        const urlParts = profileUrl.split('/');
        const urlToken = urlParts[urlParts.length - 1].split('?')[0]; // 移除URL参数

        if (!urlToken) {
            console.warn('[MCN & Date Displayer] Could not extract urlToken from:', profileUrl);
            return;
        }

        console.log(`[MCN & Date Displayer] Processing author: ${urlToken}, URL: ${profileUrl}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: profileUrl,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const scriptElement = doc.querySelector('script#js-initialData[type="text/json"]');

                        if (scriptElement && scriptElement.textContent) {
                            const jsonData = JSON.parse(scriptElement.textContent);
                            const mcnCompany = jsonData?.initialState?.entities?.users?.[urlToken]?.mcnCompany;

                            if (mcnCompany) {
                                displayMcnInfo(authorDiv, mcnCompany, urlToken);
                            } else {
                                console.log(`[MCN & Date Displayer] No MCN info found for ${urlToken}.`);
                                displayMcnInfo(authorDiv, 'NoMCN', urlToken); // 明确显示无MCN
                            }
                        } else {
                            // console.warn(`[MCN & Date Displayer] Could not find js-initialData script for ${urlToken} in profile page.`);
                            // 有些用户可能没有这个script，是正常现象
                        }
                    } catch (e) {
                        console.error(`[MCN & Date Displayer] Error parsing JSON for ${urlToken}:`, e, response.responseText.substring(0, 500));
                    }
                } else {
                    console.error(`[MCN & Date Displayer] Error fetching profile for ${urlToken}. Status: ${response.status} ${response.statusText}`);
                }
            },
            onerror: function(response) {
                console.error(`[MCN & Date Displayer] GM_xmlhttpRequest error for ${urlToken}:`, response);
            }
        });
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 使用防抖包装 processContentItems
    const debouncedProcessContentItems = debounce(processContentItems, 500); // 500毫秒的延迟

    // 初始加载时处理一次
    setTimeout(processContentItems, 1000); // 确保页面元素基本加载完毕

    console.log('[MyScript] Setting up MutationObserver...');

    const observer = new MutationObserver((mutationsList) => {
        // 我们不需要详细分析mutation的内容。
        // 只要DOM有变化，就可能出现了我们需要处理的新内容。
        // processContentItems 函数自身的逻辑足够智能去处理。
        // 我们只检查是否有节点增删，以避免因属性变化等无关操作频繁触发。
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                // DOM结构发生了变化，调用我们的防抖处理函数
                debouncedProcessContentItems();
                // 只要有一个相关的mutation，就可以触发检查，无需遍历所有
                return;
            }
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    console.log('[MCN & Date Displayer] MutationObserver is now observing document.body.');

})();