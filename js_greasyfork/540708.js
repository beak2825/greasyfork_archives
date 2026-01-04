// ==UserScript==
// @name        miuirom: 加速小米rom下载链接 (全场景适配版)
// @description 自动替换小米官方下载链接为阿里云节点镜像，适配xiaomirom.com等场景
// @namespace   xuebaiyo
// @include     http*://xiaomirom.com/*
// @include     http*://bigota.d.miui.com/*
// @include     http*://bn.d.miui.com/*
// @include     http*://cdnorg.d.miui.com/*
// @include     http*://hugeota.d.miui.com/*
// @version     3.2
// @grant       none
// @license     GPL-3.0
// @author      xuebaiyo
// @downloadURL https://update.greasyfork.org/scripts/540708/miuirom%3A%20%E5%8A%A0%E9%80%9F%E5%B0%8F%E7%B1%B3rom%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%20%28%E5%85%A8%E5%9C%BA%E6%99%AF%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540708/miuirom%3A%20%E5%8A%A0%E9%80%9F%E5%B0%8F%E7%B1%B3rom%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%20%28%E5%85%A8%E5%9C%BA%E6%99%AF%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

// 目标替换域名（阿里云新加坡节点）
const targetDomain = "bkt-sgp-miui-ota-update-alisgp.oss-ap-southeast-1.aliyuncs.com";

// 需要替换的小米官方域名列表
const officialDomains = [
    "bigota.d.miui.com",
    "bn.d.miui.com",
    "cdnorg.d.miui.com",
    "hugeota.d.miui.com"
];

// 生成匹配所有官方域名的正则表达式
const domainRegex = new RegExp(
    `^https?:\\/\\/(?<domain>${officialDomains.join("|")})(?<path>\\/.*)$`,
    "gi"
);

// 1. 重写 window.open 拦截所有通过脚本打开的链接
const originalOpen = window.open;
window.open = function(url, name, features) {
    // 检测并替换URL中的小米官方域名
    if (typeof url === 'string') {
        const newUrl = url.replace(domainRegex, `https://${targetDomain}$2`);
        if (newUrl !== url) {
            console.log(`[MIUIROM] 拦截window.open链接: ${url} -> 替换为 ${newUrl}`);
            return originalOpen.call(window, newUrl, name, features);
        }
    }
    return originalOpen.call(window, url, name, features);
};

// 2. 处理页面已加载的a标签链接（兼容传统href跳转）
const processLinks = () => {
    const links = document.querySelectorAll(`a[href*="${officialDomains.join('"], a[href*="')}"]`);
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href) {
            const newHref = href.replace(domainRegex, `https://${targetDomain}$2`);
            if (newHref !== href) {
                link.setAttribute('href', newHref);
                console.log(`[MIUIROM] 替换a标签链接: ${href} -> ${newHref}`);
            }
        }
    });
};

// 3. 处理页面onclick事件中的字符串链接（针对xiaomirom.com的特殊格式）
const processOnClickLinks = () => {
    // 匹配onclick中包含window.open('https://bigota...')的元素
    const elements = document.querySelectorAll('[onclick*="window.open(\'https://bigota")');
    elements.forEach(el => {
        let onclick = el.getAttribute('onclick');
        if (onclick) {
            // 提取URL部分并替换域名
            const match = onclick.match(/window.open\('(https?:\/\/[^']+)'\)/);
            if (match && match[1]) {
                const originalUrl = match[1];
                const newUrl = originalUrl.replace(domainRegex, `https://${targetDomain}$2`);
                if (newUrl !== originalUrl) {
                    // 替换onclick中的URL
                    const newOnclick = onclick.replace(originalUrl, newUrl);
                    el.setAttribute('onclick', newOnclick);
                    console.log(`[MIUIROM] 替换onclick链接: ${originalUrl} -> ${newUrl}`);
                }
            }
        }
    });
};

// 4. 动态监听DOM变化（处理异步加载的内容）
const observeDOM = (function() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (!MutationObserver) return;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                // 处理新添加的a标签链接
                const newLinks = Array.from(mutation.addedNodes)
                    .filter(node => node.nodeType === 1)
                    .flatMap(node => Array.from(node.querySelectorAll(`a[href*="${officialDomains.join('"], a[href*="')}"]`)));
                newLinks.forEach(link => processLinks(link));

                // 处理新添加的onclick链接
                const newElements = Array.from(mutation.addedNodes)
                    .filter(node => node.nodeType === 1)
                    .flatMap(node => Array.from(node.querySelectorAll('[onclick*="window.open(\'https://bigota")')));
                newElements.forEach(el => processOnClickLinks(el));
            }
        });
    });

    return {
        start: (element) => observer.observe(element, { childList: true, subtree: true })
    };
})();

// 初始化执行：处理当前页面所有链接
(function() {
    processLinks();
    processOnClickLinks();

    // 检测当前URL是否需要跳转（如直接访问官方链接）
    if (domainRegex.test(window.location.href)) {
        const newUrl = window.location.href.replace(domainRegex, `https://${targetDomain}$2`);
        console.log(`[MIUIROM] 跳转当前页面: ${window.location.href} -> ${newUrl}`);
        window.location.replace(newUrl);
    }

    // 启动DOM监听
    if (observeDOM) {
        observeDOM.start(document.body);
        console.log('[MIUIROM] 已启动DOM变化监听');
    }
})();