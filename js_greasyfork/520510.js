// ==UserScript==
// @name         小黑盒游戏图片修复
// @namespace    https://github.com/zXLi1222
// @version      1.4.3
// @description  修复网页新版小黑盒Steam游戏图片与视频无法直连加载的问题。
// @author       L
// @icon         https://www.xiaoheihe.cn/favicon.ico
// @match        *://xiaoheihe.cn/*
// @match        *://www.xiaoheihe.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520510/%E5%B0%8F%E9%BB%91%E7%9B%92%E6%B8%B8%E6%88%8F%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/520510/%E5%B0%8F%E9%BB%91%E7%9B%92%E6%B8%B8%E6%88%8F%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // GM_registerMenuCommand设置选项
    GM_registerMenuCommand("设置", () => {
        showSettingsModal();
    });

    // 获取用户设置
    let replaceEnabled = GM_getValue("replaceEnabled", true);

    // 图片修复功能
    function replaceMediaDomains() {
        if (replaceEnabled) {
            const images = document.querySelectorAll("img");
            images.forEach(img => {
                if (img.src.includes("shared.akamai.steamstatic.com")) {
                    img.src = img.src.replace("shared.akamai.steamstatic.com", "shared.cdn.steamchina.eccdnx.com");
                }
                if (img.src.includes("cdn.akamai.steamstatic.com")) {
                    img.src = img.src.replace("cdn.akamai.steamstatic.com", "cdn.steamchina.eccdnx.com");
                }
            });

            const videos = document.querySelectorAll("video");
            videos.forEach(video => {
                if (video.src.includes("video.akamai.steamstatic.com")) {
                    video.src = video.src.replace("video.akamai.steamstatic.com", "video.cdn.steamchina.eccdnx.com");
                }
            });
        }
    }

    replaceMediaDomains();

    const observer = new MutationObserver(() => {
        replaceMediaDomains();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.body.addEventListener("load", () => {
        replaceMediaDomains();
    }, true);

    // 弹出设置
    function showSettingsModal() {
        // 创建遮罩层
        const overlay = document.createElement("div");
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9998; opacity: 0; transition: opacity 0.3s;";
        document.body.appendChild(overlay);

        // 创建弹窗
        const modal = document.createElement("div");
        modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8); background: #1e1e1e; color: #c7c7c7; padding: 20px; border-radius: 8px; width: 400px; z-index: 9999; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); opacity: 0; transition: opacity 0.3s, transform 0.3s;";
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 18px;">BetterHeybox 设置</h2>
                <button id="closeModal" style="background: none; border: none; color: #c7c7c7; font-size: 18px; cursor: pointer;">✖</button>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; gap: 10px; position: relative;">
                    <input type="checkbox" id="replaceToggle" ${replaceEnabled ? 'checked' : ''} style="width: 18px; height: 18px;">
                    <span>Steam游戏图片视频修复</span>
                    <span style="width: 18px; height: 18px; background: #555; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;" title="启用后将自动替换 Steam 资源域名为 白山云SteamChina 域名，以修复Steam游戏图片、视频、图标无法正常加载的问题。">?</span>
                </label>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <button id="saveSettings" style="background-color: #007acc; color: #fff; border: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; cursor: pointer;">保存设置</button>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            overlay.style.opacity = "1";
            modal.style.opacity = "1";
            modal.style.transform = "translate(-50%, -50%) scale(1)";
        }, 0);

        document.getElementById("closeModal").addEventListener("click", () => closeModal(overlay, modal));

        // 保存设置
        document.getElementById("saveSettings").addEventListener("click", () => {
            const replaceToggle = document.getElementById("replaceToggle").checked;
            GM_setValue("replaceEnabled", replaceToggle);
            alert("设置已保存！刷新页面以应用更改。");
            closeModal(overlay, modal);
        });

        overlay.addEventListener("click", () => closeModal(overlay, modal));
    }

    function closeModal(overlay, modal) {
        overlay.style.opacity = "0";
        modal.style.opacity = "0";
        modal.style.transform = "translate(-50%, -50%) scale(0.8)";
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        }, 300);
    }
})();