// ==UserScript==
// @name         SubHD 多资源站跳转增强版
// @namespace    superszy
// @version      1.3
// @description  自动识别英文主标题，仅用主标题跳转搜索字幕资源站，支持暗色模式、图标展示
// @match        https://subhd.tv/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544575/SubHD%20%E5%A4%9A%E8%B5%84%E6%BA%90%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544575/SubHD%20%E5%A4%9A%E8%B5%84%E6%BA%90%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(() => {
    // 原始标题
    const rawTitle = document.title.replace(" - SubHD", "").trim();

    // 提取英文标题
    let match = rawTitle.match(/([A-Z][a-zA-Z0-9\s\.\-']{2,})/);
    let mainTitle = match ? match[1].trim() : rawTitle;

    // 去除版本、分辨率、字幕组等
    mainTitle = mainTitle.replace(/\b(S\d+E\d+|\d{3,4}p|WEB|H\.?264|x264|HEVC|HDR|AAC|DD5\.1|BluRay|WEB\-DL|Proper|AMZN|NF|HDTV|YIFY|RARBG|LazyCunts|CHS|ENG|[^a-zA-Z0-9\s]+)/gi, '').trim();
    if (mainTitle.length < 3) mainTitle = rawTitle;

    const encoded = encodeURIComponent(mainTitle);

const sites = [
    { name: "Zimuku", icon: "🎞️", url: `https://www.zimuku.la/search?q=${encoded}` },
    { name: "射手网", icon: "🎯", url: `https://assrt.net/sub/?searchword=${encoded}` },
    { name: "OpenSubtitles", icon: "🌐", url: `https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-${encoded}` },
    { name: "YIFY", icon: "🟣", url: `https://yts-subs.com/search/${encoded}` },
    { name: "Nyaa", icon: "🐱", url: `https://nyaa.si/?f=0&c=0_0&q=${encoded}` },
    { name: "人人影视", icon: "👥", url: `https://yyets.click/search?keyword=${encoded}` },
    { name: "BT搜索", icon: "🎞️", url: `https://bt4g.org/search?keyword=${encoded}` }
];

    const container = document.createElement("div");
    container.style.margin = "10px 0";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.gap = "8px";

    sites.forEach(site => {
        const a = document.createElement("a");
        a.href = site.url;
        a.target = "_blank";
        a.innerText = `${site.icon} ${site.name}`;
        a.className = "subhd-jump-btn";
        container.appendChild(a);
    });

    const refBtn = document.querySelector(".btn.btn-outline-light.btn-sm.f12.me-1");
    if (refBtn) {
        refBtn.parentNode.insertBefore(container, refBtn);
    } else {
        document.body.prepend(container);
    }

    const style = document.createElement("style");
    style.textContent = `
    .subhd-jump-btn {
        display: inline-block;
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 6px;
        text-decoration: none;
        border: 1px solid #888;
        background-color: #f4f4f4;
        color: #333;
        transition: background-color 0.2s, color 0.2s;
    }

    .subhd-jump-btn:hover {
        background-color: #cce7ff;
        color: #000;
        border-color: #66afe9;
    }

    @media (prefers-color-scheme: dark) {
        .subhd-jump-btn {
            background-color: #333;
            color: #eee;
            border: 1px solid #555;
        }
        .subhd-jump-btn:hover {
            background-color: #444;
            color: #fff;
            border-color: #888;
        }
    }
    `;
    document.head.appendChild(style);
})();
