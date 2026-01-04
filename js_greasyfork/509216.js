"use strict";
// ==UserScript==
// @name         去除网站外链跳转安全限制
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/external-link-resolver.js
// @version      1.0.2
// @description  去除简书、知乎、掘金、CSDN、思否、少数派等网站的外链安全限制，将a标签改为直接跳转
// @license      MIT
// @match        https://juejin.cn/*
// @match        https://link.juejin.cn/*
// @match        https://segmentfault.com/*
// @match        https://link.segmentfault.com/*
// @match        https://csdn.net/*
// @match        https://link.csdn.net/*
// @match        https://*.jianshu.com/*
// @match        https://*.zhihu.com/*
// @match        https://link.zhihu.com/*
// @match        https://sspai.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/509216/%E5%8E%BB%E9%99%A4%E7%BD%91%E7%AB%99%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%AE%89%E5%85%A8%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/509216/%E5%8E%BB%E9%99%A4%E7%BD%91%E7%AB%99%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%AE%89%E5%85%A8%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // Generic extractTarget function
    const genericExtractTarget = (url, paramName) => {
        const params = new URLSearchParams(url.search);
        return params.get(paramName);
    };
    const siteConfigs = {
        "juejin": {
            directMatch: ["https://link.juejin.cn"],
            extractTarget: async (url) => {
                const target = genericExtractTarget(url, "target");
                if (target) {
                    if (target.startsWith("https://link.juejin.cn")) {
                        return siteConfigs["juejin"].extractTarget(new URL(target));
                    }
                    return decodeURIComponent(target);
                }
                return null;
            }
        },
        "segmentfault": {
            directMatch: ["https://link.segmentfault.com"],
            extractTarget: async (url) => {
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url.href,
                        headers: {
                            "Referer": "https://segmentfault.com",
                        },
                        onload: function (response) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            const dataUrl = doc.body.getAttribute("data-url");
                            resolve(dataUrl || url.href);
                        },
                        onerror: function () {
                            resolve(url.href);
                        }
                    });
                });
            }
        },
        "csdn": {
            directMatch: ["https://link.csdn.net"],
            targetParam: "target"
        },
        "jianshu": {
            directMatch: ["https://link.jianshu.com", "https://links.jianshu.com"],
            targetParam: "to"
        },
        "zhihu": {
            directMatch: ["https://link.zhihu.com"],
            targetParam: "target"
        },
        "sspai": {
            directMatch: ["https://sspai.com"],
            targetParam: "target"
        }
    };
    async function processRule(config) {
        if (config.directMatch.includes(window.location.origin)) {
            let targetUrl = await getTargetUrl(config, new URL(window.location.href));
            while (targetUrl && new URL(targetUrl).origin === "https://link.juejin.cn") {
                // Keep resolving until we get the final non-Juejin link
                targetUrl = await getTargetUrl(siteConfigs["juejin"], new URL(targetUrl));
            }
            if (targetUrl) {
                window.location.href = targetUrl;
            }
            return;
        }
        await replaceLinks(config);
    }
    async function getTargetUrl(config, url) {
        if (config.targetParam) {
            return genericExtractTarget(url, config.targetParam);
        }
        else if (config.extractTarget) {
            return config.extractTarget(url);
        }
        return null;
    }
    async function replaceLinks(config) {
        const linkSelector = config.directMatch.map(site => `a[href^="${site}"]`).join(", ");
        const links = document.querySelectorAll(linkSelector);
        for (const link of links) {
            const href = link.getAttribute("href");
            if (href) {
                const targetUrl = await getTargetUrl(config, new URL(href));
                if (targetUrl) {
                    link.href = decodeURIComponent(targetUrl);
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                }
            }
        }
    }
    function observeDOMChanges(config) {
        const observer = new MutationObserver(() => replaceLinks(config));
        observer.observe(document.body, { childList: true, subtree: true });
    }
    async function init() {
        const currentSite = Object.keys(siteConfigs).find(site => siteConfigs[site].directMatch.includes(window.location.origin));
        if (currentSite) {
            const config = siteConfigs[currentSite];
            await processRule(config);
            observeDOMChanges(config);
        }
    }
    init();
})();
