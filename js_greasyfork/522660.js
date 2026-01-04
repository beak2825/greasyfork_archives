// ==UserScript==
// @name         AD block(Weiren)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  拋棄雜七雜八的廣吿攔截器，試試這款輕量級 屏蔽廣告、彈窗、追蹤器
// @author       Weiren
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522660/AD%20block%28Weiren%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522660/AD%20block%28Weiren%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Google Ads 域名列表（包括子網）
    const googleAdsDomains = [
        '*://*.googleads.g.doubleclick.net/*',
        '*://*.pagead2.googlesyndication.com/*',
        '*://*.adservice.google.com/*',
        '*://*.gstatic.com/ads/*',
        '*://*.googletagservices.com/*',
        '*://*.googlesyndication.com/*'
    ];

    // cat.sg1 廣告域名
    const catSg1AdsDomains = [
        '*://cat.sg1/*', // 假設這是 cat.sg1 的廣告域名，根據實際情況調整
        '*://*.cat.sg1/*' // 子網也加入
    ];

    // 通用廣告及追蹤器域名
    const adAndTrackerDomains = [
        '*://*.doubleclick.net/*',
        '*://*.adnxs.com/*',
        '*://*.adsafeprotected.com/*',
        '*://*.adform.net/*',
        '*://*.taboola.com/*',
        '*://*.outbrain.com/*',
        '*://*.criteo.com/*'
    ];

    // Google Forms 廣告元素識別
    const formsAdSelectors = [
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="googlesyndication.com"]',
        '.adsbygoogle', // 常見的 Google Ads 類
        '.google-ads-frame' // 另一種常見的 Google Forms 廣告標識
    ];

    // cat.sg1 廣告元素識別（假設的元素名稱，根據實際情況調整）
    const catSg1AdSelectors = [
        'iframe[src*="cat.sg1"]', // 針對 cat.sg1 網站中的 iframe 廣告
        '.cat-ad', // 假設的廣告 class 名稱，根據實際情況調整
        '[id*="cat-ad"]', // 假設的廣告 ID 名稱
        '.cat-popup', // 假設的彈窗 class 名稱
        '[data-ad*="cat.sg1"]' // 假設的屬性選擇器
    ];

    const allBlockedDomains = [...googleAdsDomains, ...catSg1AdsDomains, ...adAndTrackerDomains];
    const domainRegex = new RegExp(allBlockedDomains.map(domain => domain.replace(/\*/g, '.*')).join('|'), 'i');

    let adRegexList = [];
    let trackerRegexList = [];

    // 載入規則文件
    function loadRules(url, targetList) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                const rules = response.responseText.split('\n');
                const regexList = rules
                    .filter(rule => rule.startsWith('||') && rule.includes('^'))
                    .map(rule => new RegExp(rule.replace('||', '').replace('^', '').trim()));
                targetList.push(...regexList);
                console.log(`規則已載入：${url}，共解析到 ${regexList.length} 條規則`);
            },
            onerror: function () {
                console.error(`無法載入規則：${url}`);
            },
        });
    }

    // 攔截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (domainRegex.test(url) || adRegexList.some(regex => regex.test(url)) || trackerRegexList.some(regex => regex.test(url))) {
            console.log(`攔截請求: ${url}`);
            return; // 阻止請求
        }
        return originalOpen.apply(this, arguments);
    };

    // 攔截 Fetch API
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (domainRegex.test(url.toString()) || adRegexList.some(regex => regex.test(url.toString())) || trackerRegexList.some(regex => regex.test(url.toString()))) {
            console.log(`攔截 Fetch API 請求: ${url}`);
            return Promise.reject('攔截的廣告或追蹤請求');
        }
        return originalFetch.apply(this, arguments);
    };

    // 隱藏廣告、追蹤器和彈窗元素
    GM_addStyle(`
        iframe, .ad, .ads, .sponsored, .advertisement,
        [id*="ad"], [class*="ad"], [data-ad], [aria-label*="advertisement"],
        [id*="popup"], [class*="popup"], [data-popup], .modal, .overlay,
        ${formsAdSelectors.join(', ')},
        ${catSg1AdSelectors.join(', ')} {
            display: none !important;
        }
    `);

    // 使用 MutationObserver 隱藏動態生成的彈窗和廣告元素
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // 元素節點
                    const nodeHtml = node.outerHTML || '';
                    if (
                        node.matches('[id*="popup"], [class*="popup"], .modal, .overlay') ||
                        domainRegex.test(nodeHtml) ||
                        formsAdSelectors.some(selector => node.matches(selector)) ||
                        catSg1AdSelectors.some(selector => node.matches(selector))
                    ) {
                        console.log('動態攔截並移除元素:', node);
                        node.remove();
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 阻止常見的彈窗事件
    window.addEventListener('load', () => {
        document.querySelectorAll('[onclick*="popup"], [onmouseover*="popup"]').forEach(el => el.removeAttribute('onclick'));
    });
    window.addEventListener('beforeunload', e => e.preventDefault());
    window.addEventListener('popstate', e => e.preventDefault());

    // 加載廣告過濾規則
    loadRules('https://easylist.to/easylist/easylist.txt', adRegexList); // EasyList 廣告規則
    loadRules('https://easylist.to/easylist/easyprivacy.txt', trackerRegexList); // EasyPrivacy 追蹤器規則
    loadRules('https://filters.adtidy.org/extension/chromium/filters/2.txt', adRegexList); // AdGuard Base filter
    loadRules('https://filters.adtidy.org/extension/chromium/filters/3.txt', trackerRegexList); // AdGuard Tracking Protection

    console.log('最強廣告攔截腳本已啟動');
})();