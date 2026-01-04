// ==UserScript==
// @name         PoEDB 词缀中英对照
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 PoEDB 页面缓存 `us` 词缀，适用于所有 `非 us` 语言页面，支持高级搜索模式（AND/OR 复合查询），并修复查询功能不影响缓存存储。
// @author       图图
// @match        https://poedb.tw/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528196/PoEDB%20%E8%AF%8D%E7%BC%80%E4%B8%AD%E8%8B%B1%E5%AF%B9%E7%85%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/528196/PoEDB%20%E8%AF%8D%E7%BC%80%E4%B8%AD%E8%8B%B1%E5%AF%B9%E7%85%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🔍 [PoEDB 词缀中英对照] 脚本启动...");

    const lang = document.documentElement.lang;
    const targetLang = "us";
    const supportedLangs = ["cn", "tw", "kr", "jp", "fr", "de", "es", "ru", "th", "pt"];
    const isSupportedLang = supportedLangs.includes(lang);

    if (!isSupportedLang && lang !== "us") {
        return;
    }

    const currentItem = window.location.pathname.split("/").pop();
    const storageKey = `poedb_us_mods_${currentItem}`;

    const highlightColors = ["#ffff99", "#99ff99", "#99ccff", "#ff9999", "#ffcc66"];

    const uiContainer = document.createElement("div");
    uiContainer.style.position = "fixed";
    uiContainer.style.top = "10px";
    uiContainer.style.right = "10px";
    uiContainer.style.zIndex = "9999";
    uiContainer.style.background = "#fff";
    uiContainer.style.color = "#333";
    uiContainer.style.border = "1px solid #ccc";
    uiContainer.style.padding = "8px";
    uiContainer.style.borderRadius = "6px";
    uiContainer.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)";
    uiContainer.style.fontSize = "14px";
    uiContainer.style.textAlign = "center";
    document.body.appendChild(uiContainer);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "🔍 搜索词缀...";
    searchInput.style.width = "100%";
    searchInput.style.marginBottom = "6px";
    searchInput.style.padding = "4px";
    searchInput.style.border = "1px solid #ccc";
    searchInput.style.borderRadius = "4px";
    searchInput.addEventListener("input", () => {
        filterMods(searchInput.value.trim());
    });
    uiContainer.appendChild(searchInput);

    if (lang === "us") {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = `保存 ${currentItem} 词缀`;
        saveBtn.style.display = "block";
        saveBtn.style.marginBottom = "6px";
        saveBtn.addEventListener("click", () => {
            savePageData();
            alert(`✅ "${currentItem}" 词缀数据已保存！请切换到其他语言版本查看对照翻译。`);
        });
        uiContainer.appendChild(saveBtn);
    }

    if (isSupportedLang) {
        const toggleTranslateBtn = document.createElement("button");
        toggleTranslateBtn.textContent = "加载对照翻译";
        toggleTranslateBtn.style.display = "block";
        toggleTranslateBtn.style.marginBottom = "6px";
        toggleTranslateBtn.addEventListener("click", () => {
            if (toggleTranslateBtn.textContent === "加载对照翻译") {
                loadTranslation();
                toggleTranslateBtn.textContent = "移除对照翻译";
            } else {
                removeTranslation();
                toggleTranslateBtn.textContent = "加载对照翻译";
            }
        });
        uiContainer.appendChild(toggleTranslateBtn);
    }

    const clearCacheBtn = document.createElement("button");
    clearCacheBtn.textContent = "清除当前缓存";
    clearCacheBtn.style.display = "block";
    clearCacheBtn.addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        alert(`🗑 "${currentItem}" 词缀缓存已清除！`);
    });
    uiContainer.appendChild(clearCacheBtn);

    function savePageData() {
        let modData = {};
        document.querySelectorAll(".mod-title.explicitMod").forEach(element => {
            const bsTarget = element.getAttribute("data-bs-target");
            if (bsTarget) {
                const modId = bsTarget.replace("#", "");
                let modText = element.cloneNode(true);
                modText.querySelectorAll(".float-end").forEach(span => span.remove());
                modText = modText.innerText.trim();
                modData[modId] = modText;
            }
        });

        localStorage.setItem(storageKey, JSON.stringify(modData));
        console.log(`✅ [PoEDB] "${currentItem}" 词缀数据已缓存：`, modData);
    }

    function filterMods(keyword) {
        if (!keyword) {
            document.querySelectorAll(".mod-title.explicitMod").forEach(element => {
                element.style.display = "";
                element.innerHTML = element.getAttribute("data-original-text") || element.innerHTML;
            });
            return;
        }

        const orGroups = keyword.split("  ").map(group => group.split(" "));
        document.querySelectorAll(".mod-title.explicitMod").forEach(element => {
            if (!element.hasAttribute("data-original-text")) {
                element.setAttribute("data-original-text", element.innerHTML);
            }
            const text = element.innerText;
            const match = orGroups.some(andTerms => andTerms.every(term => text.includes(term)));

            if (match) {
                element.style.display = "";
                element.innerHTML = highlightText(element.getAttribute("data-original-text"), orGroups);
            } else {
                element.style.display = "none";
            }
        });
    }

    function highlightText(text, terms) {
        let highlighted = text;
        terms.forEach((group, index) => {
            const color = highlightColors[index % highlightColors.length];
            group.forEach(term => {
                const regex = new RegExp(`(${term})`, "gi");
                highlighted = highlighted.replace(regex, `<span style="background-color:${color};padding:2px;border-radius:3px;">$1</span>`);
            });
        });
        return highlighted;
    }

    function loadTranslation() {
        const savedData = localStorage.getItem(storageKey);
        if (!savedData) {
            alert(`⚠️ 你还没有保存 "${currentItem}" 的 us 版页面内容，请先切换到 us 页面并点击保存。`);
            return;
        }

        let modData = JSON.parse(savedData);
        let matchedCount = 0;
        document.querySelectorAll(".mod-title.explicitMod").forEach(element => {
            const bsTarget = element.getAttribute("data-bs-target");
            if (bsTarget) {
                const modId = bsTarget.replace("#", "");
                if (modData[modId]) {
                    const cnText = element.cloneNode(true);
                    cnText.querySelectorAll(".float-end").forEach(span => span.remove());
                    const cnTextOnly = cnText.innerText.trim();

                    const usText = modData[modId];

                    const translationSpan = document.createElement("span");
                    translationSpan.style.color = "gray";
                    translationSpan.style.fontSize = "0.9em";
                    translationSpan.classList.add("us-translation");
                    translationSpan.innerHTML = `<br>${usText}`;

                    element.appendChild(translationSpan);
                    matchedCount++;
                }
            }
        });

        alert(`✅ 已成功加载 ${matchedCount} 条 "${currentItem}" 的双语对照词缀！`);
    }

    function removeTranslation() {
        document.querySelectorAll(".us-translation").forEach(el => el.remove());
    }
})();
