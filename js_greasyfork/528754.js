// ==UserScript==
// @name         自动打开PDF,否则重定向至XJTU_VPN
// @version      1.2
// @author       Pencilheart
// @description  自动打开PDF，如果没有找到PDF链接则重定向到西安交通大学图书馆。
// @match        https://webvpn.xjtu.edu.cn/https/77726476706e69737468656265737421e7e056d234336155700b8ca891472636a6d29e640e/science/article/pii/*
// @match        https://asmedigitalcollection-asme-org-s.stat.lib.xjtu.edu.cn/*
// @match        http://sage.cnpereading.com/paragraph/article/*
// @match        https://www.sciencedirect.com/science/article/*
// @match        https://asmedigitalcollection.asme.org/*
// @match        https://*.asmedigitalcollection.asme.org/*
// @match        https://onlinelibrary.wiley.com/doi/*
// @match        https://*.onlinelibrary.wiley.com/doi/*
// @match        https://link.springer.com/article*
// @match        https://iopscience.iop.org/article/*
// @match        https://arc.aiaa.org/doi/*
// @match        https://www.semanticscholar.org/paper/*
// @match        https://journals.sagepub.com/doi/*
// @match        http://sage.cnpereading.com/paragraph/article/*
// @match        https://journal.gpps.global/*
// @match        https://webofscience.clarivate.cn/*
// @match        https://www.nature.com/articles*
// @match        https://access.clarivate.com/*
// @match        https://pubs.acs.org/doi/*
// @match        https://webvpn.xjtu.edu.cn/*
// @match        *://*/*.pdf

// @match        https://www.science.org/doi/*
// @match        https://pubs.acs.org/doi/*
// @match        https://www.tandfonline.com/doi/*
// @match        https://www.beilstein-journals.org/*
// @match        https://pubs.rsc.org/en/content/*
// @match        https://pubs.aip.org/aip/*/article/*
// @match        https://journals.aps.org/*/abstract/10*
// @match        https://cdnsciencepub.com/doi/*
// @match        https://iopscience.iop.org/article/10*
// @match        https://www.cell.com/*/fulltext/*
// @match        https://journals.lww.com/*
// @match        https://*.biomedcentral.com/articles/*
// @match        https://academic.oup.com/*/article/*
// @match        https://karger.com/*/article/*
// @match        https://www.cambridge.org/core/journals/*/article/*
// @match        https://www.annualreviews.org/doi/*
// @match        https://www.annualreviews.org/content/*
// @match        https://www.jstage.jst.go.jp/article/*
// @match        https://www.hindawi.com/journals/*
// @match        https://*.theclinics.com/article/*
// @match        https://www.liebertpub.com/doi/*
// @match        https://thorax.bmj.com/content/*
// @match        https://journals.physiology.org/doi/*
// @match        https://www.ahajournals.org/doi/*
// @match        https://dl.acm.org/doi/*
// @match        https://journals.asm.org/doi/*
// @match        https://*.apa.org/record/*
// @match        https://*.apa.org/fulltext/*
// @match        https://www.thelancet.com/journals/*/article/*
// @match        https://jamanetwork.com/journals/*
// @match        https://aacrjournals.org/*/article/*
// @match        https://royalsocietypublishing.org/doi/*
// @match        https://journals.plos.org/*/article*
// @match        https://*.psychiatryonline.org/doi/*
// @match        https://opg.optica.org/*/*.cfm*
// @match        https://www.thieme-connect.de/products/ejournals/*
// @match        https://journals.ametsoc.org/view/journals/*
// @match        https://www.frontiersin.org/articles/*
// @match        https://www.worldscientific.com/doi/*
// @match        https://www.nejm.org/doi/*
// @match        https://ascopubs.org/doi/*
// @match        https://www.jto.org/article/*
// @match        https://www.jci.org/articles/*
// @match        https://www.pnas.org/doi/*
// @match        https://*.psychiatryonline.org/doi/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==
// @namespace https://greasyfork.org/users/703434
// @downloadURL https://update.greasyfork.org/scripts/528754/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80PDF%2C%E5%90%A6%E5%88%99%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3XJTU_VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/528754/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80PDF%2C%E5%90%A6%E5%88%99%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3XJTU_VPN.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 获取用户选项
    let autoOpenPDF = GM_getValue("autoOpenPDF", false);
    let enableRedirect = GM_getValue("enableRedirect", false);

    // 注册菜单
    function registerMenu() {
        GM_registerMenuCommand(
            `重定向功能：${enableRedirect ? "✅ 开启" : "❌ 关闭"}`,
            () => {
                enableRedirect = !enableRedirect;
                GM_setValue("enableRedirect", enableRedirect);
                location.reload();
            }
        );
        GM_registerMenuCommand(
            `自动打开PDF功能：${autoOpenPDF ? "✅ 开启" : "❌ 关闭"}`,
            () => {
                autoOpenPDF = !autoOpenPDF;
                GM_setValue("autoOpenPDF", autoOpenPDF);
                location.reload();
            }
        );
    }

    registerMenu();

    // 重定向规则
    const urlMappings = [
        {
            baseUrl: "https://www.sciencedirect.com/",
            transform: (url) => "https://webvpn.xjtu.edu.cn/https/77726476706e69737468656265737421e7e056d234336155700b8ca891472636a6d29e640e/science/article/pii/" +
                url.match(/\/pii\/([A-Za-z0-9]+)/)[1] + "?redirected=true",
        },
        {
            baseUrl: "https://journals.sagepub.com/",
            transform: (url) => url.replace(
                "https://journals.sagepub.com/doi/",
                "http://sage.cnpereading.com/paragraph/article/?doi="
            ),
        },
        {
            baseUrl: "https://asmedigitalcollection.asme.org/",
            transform: (url) => url.replace(
                "asmedigitalcollection.asme.org/",
                "asmedigitalcollection-asme-org-s.stat.lib.xjtu.edu.cn/") + "?redirected=true",
        },
        {
            baseUrl: "https://webofscience.clarivate.cn/",
            transform: (url) => "https://webofscience-clarivate-cn-s.stat.lib.xjtu.edu.cn/wos/alldb/basic-search",
        },
        {
            baseUrl: "https://access.clarivate.com/",
            transform: (url) => "https://webofscience-clarivate-cn-s.stat.lib.xjtu.edu.cn/wos/alldb/basic-search",
        },
        {
            baseUrl: "https://pubs.acs.org/",
            transform: (url) => url.replace(
                "pubs.acs.org/",
                "libproxy.lib.xjtu.edu.cn/https/443/org/acs/pubs/yitlink/") + "?redirected=true",
        },
    ];

    // 直接重定向规则
    const directRedirectRules = [
        {
            urlMatch: ["journals.sagepub.com", "science.org"], // 匹配特定网站
            redirect: true, // 添加一个标记，直接重定向
        },
    ];


    // PDF选择器映射
    const pdfSelectors = ['a[href$=".pdf"]', 'a[href$="/pdf"]', 'a[href^="/doi"]'];

    const specificSiteRules = [
        {
            urlMatch: "http://sage.cnpereading.com/paragraph/article/",
            elementSelector: 'a[href*="/paragraph/download/?doi="]',
        },
        {
            urlMatch: "www.semanticscholar.org",
            elementSelector: 'a[href*="doi"]',
        },
        {
            urlMatch: "ceramics.onlinelibrary.wiley.com",
            elementSelector: 'a[href^="/doi"]',
        },
    ];

    // 当前页面检查逻辑
    function checkAndHandlePDFLinks() {
        // 如果已经打开过 PDF，跳过自动打开
        if (sessionStorage.getItem('pdfOpened') === 'true') {
            return false;
        }

        // 检查是否有特定规则
        for (const rule of specificSiteRules) {
            if (currentURL.includes(rule.urlMatch)) {
                const targetElement = document.querySelector(rule.elementSelector);
                if (targetElement) {
                    const href = targetElement.getAttribute('href');
                    if (autoOpenPDF) {
                        history.pushState(null, null, window.location.href); // 将当前页面的 URL 推入历史记录栈
                        window.location.replace(href);
                        sessionStorage.setItem('pdfOpened', 'true'); // 标记已经打开 PDF
                    }
                    return true;
                }
            }
        }

        // 检查常规的 PDF 选择器
        for (const selector of pdfSelectors) {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                const href = targetElement.getAttribute('href');
                if (autoOpenPDF) {
                    history.pushState(null, null, window.location.href); // 将当前页面的 URL 推入历史记录栈
                    window.location.replace(href);
                    sessionStorage.setItem('pdfOpened', 'true'); // 标记已经打开 PDF
                }
                return true;
            }
        }

        return false;
    }

    // 直接重定向逻辑
    function handleDirectRedirect() {
        for (const rule of directRedirectRules) {
            if (rule.urlMatch.some((domain) => currentURL.includes(domain)) && rule.redirect) {
                for (const mapping of urlMappings) {
                    if (currentURL.startsWith(mapping.baseUrl) && !currentURL.includes("redirected=true")) {
                        window.location.href = mapping.transform(currentURL) + "?redirected=true";
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // 自动重定向逻辑
    function handleRedirect() {
        if (!enableRedirect || handleDirectRedirect()) return;

        for (const mapping of urlMappings) {
            if (currentURL.startsWith(mapping.baseUrl) && !currentURL.includes("redirected=true")) {
                window.location.href = mapping.transform(currentURL) + "?redirected=true";
                break;
            }
        }
    }

    const currentURL = window.location.href;
    console.log("当前URL:", currentURL);

    window.addEventListener("load", () => {
    // 加载完成后直接检测
    if (handleDirectRedirect() || checkAndHandlePDFLinks()) {
        return; // 如果找到符合条件的链接，直接退出逻辑
    }

    // 动态监听逻辑
    const observer = new MutationObserver(() => {
        if (handleDirectRedirect() || checkAndHandlePDFLinks()) {
            observer.disconnect(); // 找到目标后停止监听
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 延迟检测逻辑，加载完成后再检查一次
    setTimeout(() => {
        if (!checkAndHandlePDFLinks()) {
            observer.disconnect(); // 停止观察
            handleRedirect(); // 如果没有检测到 PDF 链接，执行跳转
        }
    }, 2000); // 延迟 2 秒，确保 DOM 变化完成
});

    // 检查 MutationObserver（用于动态加载的页面）
    const observer = new MutationObserver(() => {
        if (checkAndHandlePDFLinks()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
