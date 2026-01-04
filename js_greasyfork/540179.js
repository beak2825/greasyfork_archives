// ==UserScript==
// @name         Bilibili標題旁邊增加封面浮動按鈕
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  B站增加封面浮動按鈕
// @author       shanlan(grok-4-fast-reasoning)
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540179/Bilibili%E6%A8%99%E9%A1%8C%E6%97%81%E9%82%8A%E5%A2%9E%E5%8A%A0%E5%B0%81%E9%9D%A2%E6%B5%AE%E5%8B%95%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/540179/Bilibili%E6%A8%99%E9%A1%8C%E6%97%81%E9%82%8A%E5%A2%9E%E5%8A%A0%E5%B0%81%E9%9D%A2%E6%B5%AE%E5%8B%95%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const m = document.querySelector('meta[itemprop="image"]');
    if (!m) return;
    const imgUrl = m.getAttribute("content").split("@")[0].replace(/^\/\//, "https://");
    if (!imgUrl) return;

    const createBtn = () => {
        const btn = document.createElement("button");
        btn.id = "coverBtn";
        btn.innerText = "封面";
        btn.style.cssText = "flex-shrink:0;margin-left:8px;cursor:pointer;padding:2px 12px;font-size:14px;line-height:22px;height:28px;color:#fff;background:linear-gradient(90deg, #ff8a00 0%, #e52e71 100%);border:none;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);transition:background 0.2s,box-shadow 0.2s,transform 0.1s;outline:none;max-width:64px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;user-select:none;";
        let tip = null;

        btn.onmouseenter = () => {
            btn.style.background = "linear-gradient(90deg, #e52e71 0%, #ff8a00 100%)";
            btn.style.boxShadow = "0 2px 8px rgba(229,46,113,0.15)";
            btn.style.transform = "translateY(-1px) scale(1.04)";
            tip = document.createElement("div");
            tip.style.cssText = "position:absolute;border:1px solid #ccc;background:#fff;padding:5px;box-shadow:2px 2px 10px rgba(0,0,0,0.18);z-index:9999;border-radius:8px";
            const img = document.createElement("img");
            img.src = imgUrl;
            const mw = Math.floor(window.innerWidth / 2), mh = Math.floor(window.innerHeight / 2);
            img.style.cssText = `max-width:${mw}px;max-height:${mh}px;display:block;border-radius:4px`;
            tip.appendChild(img);
            document.body.appendChild(tip);
            const r = btn.getBoundingClientRect();
            let left = r.right + 10, top = r.top + window.scrollY;
            if (left + mw > window.innerWidth) left = window.innerWidth - mw - 10;
            if (top + mh > window.innerHeight + window.scrollY) top = window.innerHeight + window.scrollY - mh - 10;
            if (top < window.scrollY) top = window.scrollY + 10;
            tip.style.left = left + "px";
            tip.style.top = top + "px";
        };

        btn.onmouseleave = () => {
            btn.style.background = "linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)";
            btn.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
            btn.style.transform = "none";
            if (tip) tip.remove();
        };

        btn.onclick = () => window.open(imgUrl, "_blank");
        return btn;
    };

    const addBtn = () => {
        let container = document.querySelector(".video-info-title-inner");
        if (!container) container = document.querySelector("h1.video-title, .video-title, .tit") || document.body;
        if (container && !container.querySelector("#coverBtn")) {
            container.style.cssText = "display:flex;align-items:center;";
            const titleLink = container.querySelector("a, h1");
            if (titleLink) {
                titleLink.insertAdjacentElement("afterend", createBtn());
            } else {
                container.appendChild(createBtn());
            }
        }
    };

    setTimeout(() => {
        addBtn();
        const parent = document.querySelector(".video-info-title-inner, h1.video-title, .video-title, .tit")?.parentElement;
        if (parent) {
            new MutationObserver(addBtn).observe(parent, { childList: true, subtree: true });
        }
    }, 3000);
})();