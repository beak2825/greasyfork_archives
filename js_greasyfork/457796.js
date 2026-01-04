// ==UserScript==
// @name         bili - b站 - 记录看过的视频
// @version      3.2.1
// @author       会飞的蛋蛋面
// @description  在视频搜索页，标记已经看过的视频
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM.setValue
// @grant        GM.getValue

// @namespace https://greasyfork.org/users/751952
// @downloadURL https://update.greasyfork.org/scripts/457796/bili%20-%20b%E7%AB%99%20-%20%E8%AE%B0%E5%BD%95%E7%9C%8B%E8%BF%87%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457796/bili%20-%20b%E7%AB%99%20-%20%E8%AE%B0%E5%BD%95%E7%9C%8B%E8%BF%87%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const PROGRESS_KEY = "videoProgressMap";
    const PROGRESS_CLASS = "bili-watch-progress";

    init();

    // 根据页面类型执行入口逻辑
    function init() {
        if (location.host.includes("search.bilibili.com")) {
            initSearchPage();
        } else if (location.pathname.includes("/video/BV")) {
            initPlayerPage();
        }
    }

    function initSearchPage() {
        const cardSelector = ".bili-video-card__wrap";
        waitForElement(cardSelector, () => {
            const rerender = debounce(() => updateSearchBadges(`${cardSelector} a`), 250);
            rerender();

            const container = document.querySelector("#i_cecream") || document.body;
            const observer = new MutationObserver(rerender);
            observer.observe(container, { childList: true, subtree: true });
        });
    }

    function initPlayerPage() {
        const playerSelector = ".bpx-player-video-wrap video";
        waitForElement(playerSelector, () => {
            const video = document.querySelector(playerSelector);
            if (!video) {
                return;
            }
            const save = throttle(() => saveVideoTime(video), 3000);
            video.addEventListener("timeupdate", save);
        });
    }

    // 搜索页渲染观看进度标签
    async function updateSearchBadges(selector = ".bili-video-card__wrap a") {
        const anchors = document.querySelectorAll(selector);
        if (!anchors.length) {
            return;
        }

        const progress = await GM.getValue(PROGRESS_KEY, {});
        anchors.forEach((anchor) => {
            const maskSelector = ".bili-video-card__mask";
            const imageSelector = ".bili-video-card__image";
            const mask = anchor.querySelector(maskSelector) || anchor.querySelector(imageSelector);
            const bv = extractBV(anchor.href);
            if (!mask || !bv) {
                return;
            }
            applyBadge(mask, progress[bv]);
        });
    }

    function applyBadge(mask, info) {
        const MIN_VISIBLE_RATE = 0.1;
        const DONE_RATE = 0.95;
        const button = mask.querySelector(`.${PROGRESS_CLASS}`);
        const valid = info && Number.isFinite(info.totalTime) && info.totalTime > 0;
        if (!valid) {
            if (button) {
                button.remove();
            }
            return;
        }

        const percent = info.currentTime / info.totalTime;
        if (!Number.isFinite(percent) || percent < MIN_VISIBLE_RATE) {
            if (button) {
                button.remove();
            }
            return;
        }

        const el = button || createBadge(mask);
        el.textContent = percent >= DONE_RATE ? "看完" : `${Math.round(percent * 100)}%`;
    }

    function createBadge(mask) {
        const btn = document.createElement("button");
        btn.className = `bili-watch-later ${PROGRESS_CLASS}`;
        Object.assign(btn.style, {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "10px",
            width: "52px",
            height: "28px",
            color: "#fff",
            fontWeight: "600",
            border: "none"
        });
        mask.appendChild(btn);
        return btn;
    }

    // 保存当前视频播放进度
    async function saveVideoTime(video) {
        const bv = extractBV(location.href);
        if (!bv || !Number.isFinite(video.duration) || video.duration === 0) {
            return;
        }

        const progress = await GM.getValue(PROGRESS_KEY, {});
        progress[bv] = {
            currentTime: video.currentTime,
            totalTime: video.duration
        };
        await GM.setValue(PROGRESS_KEY, progress);
    }

    function waitForElement(selector, handler) {
        if (document.querySelector(selector)) {
            handler();
            return;
        }

        // 监听 DOM 直到目标元素出现
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                handler();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function extractBV(text) {
        const BV_REG = /BV[0-9a-zA-Z]+/i;
        const match = text.match(BV_REG);
        return match ? match[0] : "";
    }

    function debounce(fn, ms) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), ms);
        };
    }

    function throttle(fn, ms) {
        let timer = null;
        return (...args) => {
            if (timer) {
                return;
            }
            fn(...args);
            timer = setTimeout(() => {
                timer = null;
            }, ms);
        };
    }
})();
