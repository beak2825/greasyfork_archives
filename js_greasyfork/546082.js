// ==UserScript==
// @name        instagram.com停用重播 解除靜音 可點擊進度條 下載媒體 開啟媒體
// @namespace   Scripts
// @license     MIT
// @author      huang-wei-lun
// @match       https://www.instagram.com/*
// @icon        https://www.google.com/s2/favicons?domain=www.instagram.com&sz=32
// @grant       none
// @description 停用重播 解除靜音 可點擊進度條 下載媒體 開啟媒體
// @version     1.1a
// @downloadURL https://update.greasyfork.org/scripts/546082/instagramcom%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%20%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%20%E5%8F%AF%E9%BB%9E%E6%93%8A%E9%80%B2%E5%BA%A6%E6%A2%9D%20%E4%B8%8B%E8%BC%89%E5%AA%92%E9%AB%94%20%E9%96%8B%E5%95%9F%E5%AA%92%E9%AB%94.user.js
// @updateURL https://update.greasyfork.org/scripts/546082/instagramcom%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%20%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%20%E5%8F%AF%E9%BB%9E%E6%93%8A%E9%80%B2%E5%BA%A6%E6%A2%9D%20%E4%B8%8B%E8%BC%89%E5%AA%92%E9%AB%94%20%E9%96%8B%E5%95%9F%E5%AA%92%E9%AB%94.meta.js
// ==/UserScript==
(function () {
    // 從 localStorage 讀取狀態
    let disableLoop = localStorage.getItem("ig_disableLoop") === "true";
    let unmuteVideo = localStorage.getItem("ig_unmuteVideo") === "true";
    let clickableBar = localStorage.getItem("ig_clickableBar") === "true";

    // 主題配色
    const themes = {
        dark: {
            bg: "#262626",
            bgHover: "#363636",
            border: "#3c3c3c",
            text: "#fff",
            muted: "#aaa"
        },
        light: {
            bg: "#ffffff",
            bgHover: "#f2f2f2",
            border: "#dbdbdb",
            text: "#000",
            muted: "#8e8e8e"
        }
    };

    function getThemeMode() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // 建立模組選單 UI
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.zIndex = 99999;
    panel.style.padding = "10px";
    panel.style.borderRadius = "12px";
    panel.style.fontSize = "14px";
    panel.style.fontFamily = "system-ui, sans-serif";
    panel.style.transition = "opacity 0.3s, background 0.3s, color 0.3s";
    panel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
    panel.innerHTML = `
        <label style="display:block;margin-bottom:6px;">
            <input type="checkbox" id="disableLoop"> 停用重播
        </label>
        <label style="display:block;margin-bottom:6px;">
            <input type="checkbox" id="unmuteVideo"> 解除靜音
        </label>
        <label style="display:block;margin-bottom:6px;">
            <input type="checkbox" id="clickableBar"> 可點擊進度條
        </label>
        <hr id="hr1" style="border:0;margin:8px 0;">
        <button id="btnDownload" class="ig-btn">下載媒體</button>
        <button id="btnOpen" class="ig-btn">開啟媒體</button>
        <hr id="hr2" style="border:0;margin:8px 0;">
        <small id="tipText">按 H 顯示/隱藏選單</small>
    `;
    document.body.appendChild(panel);

    // 按鈕樣式套用
    function styleButtons(theme) {
        document.querySelectorAll(".ig-btn").forEach(btn => {
            btn.style.background = theme.bg;
            btn.style.color = theme.text;
            btn.style.border = `1px solid ${theme.border}`;
            btn.style.borderRadius = "8px";
            btn.style.padding = "4px 10px";
            btn.style.margin = "2px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "13px";
            btn.onmouseenter = () => btn.style.background = theme.bgHover;
            btn.onmouseleave = () => btn.style.background = theme.bg;
        });
    }

    // 更新主題
    function applyTheme() {
        const mode = getThemeMode();
        const theme = themes[mode];
        panel.style.background = theme.bg;
        panel.style.color = theme.text;
        panel.style.border = `1px solid ${theme.border}`;
        document.getElementById("hr1").style.borderTop = `1px solid ${theme.border}`;
        document.getElementById("hr2").style.borderTop = `1px solid ${theme.border}`;
        document.getElementById("tipText").style.color = theme.muted;
        styleButtons(theme);
    }

    // 初始套用主題
    applyTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

    // 初始化 UI 狀態
    panel.querySelector("#disableLoop").checked = disableLoop;
    panel.querySelector("#unmuteVideo").checked = unmuteVideo;
    panel.querySelector("#clickableBar").checked = clickableBar;

    // 儲存開關狀態
    panel.querySelector("#disableLoop").addEventListener("change", e => {
        disableLoop = e.target.checked;
        localStorage.setItem("ig_disableLoop", disableLoop);
    });
    panel.querySelector("#unmuteVideo").addEventListener("change", e => {
        unmuteVideo = e.target.checked;
        localStorage.setItem("ig_unmuteVideo", unmuteVideo);
    });
    panel.querySelector("#clickableBar").addEventListener("change", e => {
        clickableBar = e.target.checked;
        localStorage.setItem("ig_clickableBar", clickableBar);
    });

    // 顯示 / 隱藏快捷鍵
    let panelVisible = true;
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "h") {
            panelVisible = !panelVisible;
            panel.style.opacity = panelVisible ? "1" : "0";
            panel.style.pointerEvents = panelVisible ? "auto" : "none";
        }
    });

    // 取得目前頁面主要媒體（圖片或影片）
    function getCurrentMedia() {
        let video = document.querySelector('video[src]');
        let img = document.querySelector('img[srcset], img[src]');
        if (video && video.src && !video.src.includes("blob:")) return video.src;
        if (img && img.src) return img.src;

        if (video && video.src.startsWith("blob:")) {
            try {
                return video.src;
            } catch { }
        }
        return null;
    }

    // 下載媒體
    panel.querySelector("#btnDownload").addEventListener("click", () => {
        const src = getCurrentMedia();
        if (!src) return alert("找不到媒體資源");
        const a = document.createElement("a");
        a.href = src;
        a.download = "instagram_media";
        document.body.appendChild(a);
        a.click();
        a.remove();
    });

    // 開啟媒體
    panel.querySelector("#btnOpen").addEventListener("click", () => {
        const src = getCurrentMedia();
        if (!src) return alert("找不到媒體資源");
        window.open(src, "_blank");
    });

    // 功能監控
    setInterval(() => {
        const videos = document.querySelectorAll("video");
        videos.forEach(v => {
            if (disableLoop) v.loop = false;
            if (unmuteVideo) {
                v.muted = false;
                v.volume = 1.0;
            }
            if (clickableBar && !v.hasClickableBar) {
                v.hasClickableBar = true;
                const bar = document.createElement("div");
                bar.style.position = "absolute";
                bar.style.bottom = "5px";
                bar.style.left = "0";
                bar.style.width = "100%";
                bar.style.height = "5px";
                bar.style.background = "rgba(255,255,255,0.3)";
                bar.style.cursor = "pointer";
                bar.style.zIndex = 100000;

                const progress = document.createElement("div");
                progress.style.height = "100%";
                progress.style.background = "rgba(255,255,255,0.8)";
                bar.appendChild(progress);

                bar.addEventListener("click", e => {
                    const rect = bar.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    v.currentTime = v.duration * percent;
                });

                setInterval(() => {
                    progress.style.width = (v.currentTime / v.duration) * 100 + "%";
                }, 200);

                if (v.parentElement && v.parentElement.style.position !== "absolute") {
                    v.parentElement.style.position = "relative";
                }
                v.parentElement.appendChild(bar);
            }
        });
    }, 500);
})();
const themes = {
    dark: {
        bg: "#262626",
        bgHover: "#363636",
        border: "#3c3c3c",
        text: "#e4e4e4", // 深灰白字色
        muted: "#aaa"
    },
    light: {
        bg: "#ffffff",
        bgHover: "#f2f2f2",
        border: "#dbdbdb",
        text: "#000",
        muted: "#8e8e8e"
    }
};
function applyTheme() {
    const mode = getThemeMode();
    const theme = themes[mode];
    panel.style.background = theme.bg;
    panel.style.color = theme.text;
    panel.style.border = `1px solid ${theme.border}`;
    document.getElementById("hr1").style.borderTop = `1px solid ${theme.border}`;
    document.getElementById("hr2").style.borderTop = `1px solid ${theme.border}`;
    document.getElementById("tipText").style.color = theme.muted;

    // 套用到所有 checkbox 標籤文字
    panel.querySelectorAll("label").forEach(label => {
        label.style.color = theme.text;
    });

    styleButtons(theme);
}