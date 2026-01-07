// ==UserScript==
// @name YouTube™ Multi Downloader (Desktop & Mobile) v10.4 🌐🚀💯 — YT Shorts, Videos & Music | ZERO ADS! 🚫🔥
// @name:pt-BR YouTube™ Multi Downloader (PC & Celular) v10.4 🌐🚀💯 — YT Shorts, Vídeos & Music | ZERO ANÚNCIOS! 🚫🔥
// @description Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:pt-BR Adicione um botão de download flutuante para vídeos, curtas e músicas do YouTube de alta qualidade. Rápido, fácil de usar e melhor de todos!
// @description:ar Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:bg Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:cs Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:da Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:de Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:el Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:eo Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:es Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:fi Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:fr Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:fr-CA Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:he Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:hu Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:id Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:it Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:ja Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:ko Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:nb Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:nl Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:pl Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:ro Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:ru Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:sk Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:sr Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:sv Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:th Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:tr Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:uk Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:ug Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:vi Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:zh-CN Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @description:zh-TW Adds a floating download button for YouTube videos, shorts and music in high quality. Fast, easy to use and the best of all!
// @namespace https://greasyfork.org/users/152924
// @homepageURL https://greasyfork.org/scripts/34613
// @supportURL https://greasyfork.org/scripts/34613/feedback
// @author Punisher
// @version 10.4
// @date 2026-01-07
// @icon https://i.imgur.com/InuDDVK.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @license CC-BY-NC-ND-4.0
// @match https://*.youtube.com/*
// @match https://music.youtube.com/*
// @grant GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/34613/YouTube%E2%84%A2%20Multi%20Downloader%20%28Desktop%20%20Mobile%29%20v104%20%F0%9F%8C%90%F0%9F%9A%80%F0%9F%92%AF%20%E2%80%94%20YT%20Shorts%2C%20Videos%20%20Music%20%7C%20ZERO%20ADS%21%20%F0%9F%9A%AB%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/34613/YouTube%E2%84%A2%20Multi%20Downloader%20%28Desktop%20%20Mobile%29%20v104%20%F0%9F%8C%90%F0%9F%9A%80%F0%9F%92%AF%20%E2%80%94%20YT%20Shorts%2C%20Videos%20%20Music%20%7C%20ZERO%20ADS%21%20%F0%9F%9A%AB%F0%9F%94%A5.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const punisherURL = "//evdfrance.fr/convert/?id=";
    const playerBtnID = "ytDownloadBtn";
    const floatBtnID = "ytPunisherBtn";
    const btnColor = "#575656";
    GM_addStyle(`
        #${playerBtnID} {
            background: ${btnColor};
            color: #fff;
            border: 1px solid rgba(255,255,255,0.2);
            margin-left: 8px;
            padding: 0 16px;
            border-radius: 18px;
            font: 500 14px Roboto,Noto,sans-serif;
            display: inline-flex;
            align-items: center;
            height: 36px;
            text-decoration: none;
        }
        #${floatBtnID} {
            background: ${btnColor} url("https://i.imgur.com/kQ8CO1P.png") no-repeat center;
            background-size: 65%;
            position: fixed;
            top: 70%;
            right: 20px;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            cursor: grab;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
    `);

    const getVideoID = url => {
        const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})|\/shorts\/([0-9A-Za-z_-]{11})/);
        return m ? m[1] || m[2] : null;
    };

    const waitFor = selector =>
        new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const obs = new MutationObserver(() => {
                const e = document.querySelector(selector);
                if (e) {
                    obs.disconnect();
                    resolve(e);
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
        });

    let lastVideoId = null;
    async function addPlayerButton() {
        const vid = getVideoID(location.href);
        if (!vid || vid === lastVideoId) return;
        lastVideoId = vid;

        const container = location.hostname.includes("music.youtube.com")
            ? await waitFor("ytmusic-player-bar")
            : await waitFor("ytd-video-primary-info-renderer #top-level-buttons-computed");
        if (!container) return;

        let btn = document.getElementById(playerBtnID);
        if (!btn) {
            btn = document.createElement("a");
            btn.id = playerBtnID;
            btn.target = "_blank";
            btn.textContent = "Download";
            container.appendChild(btn);
        }
        btn.href = punisherURL + vid;
    }

    function addFloatButton() {
        if (document.getElementById(floatBtnID)) return;
        const btn = document.createElement("button");
        btn.id = floatBtnID;
        btn.textContent = "";
        let dragging = false, ox = 0, oy = 0;
        const limit = (x, y) => ({
            x: Math.max(0, Math.min(x, innerWidth - btn.offsetWidth)),
            y: Math.max(0, Math.min(y, innerHeight - btn.offsetHeight))
        });

        const open = () => {
            const vid = getVideoID(location.href);
            if (vid) window.open(punisherURL + vid, "_blank");
        };

        const start = (x, y) => {
            dragging = true;
            const r = btn.getBoundingClientRect();
            ox = x - r.left;
            oy = y - r.top;
            btn.style.cursor = "grabbing";
        };

        const move = (x, y) => {
            if (!dragging) return;
            const p = limit(x - ox, y - oy);
            btn.style.left = p.x + "px";
            btn.style.top = p.y + "px";
            btn.style.right = btn.style.bottom = "auto";
        };
        const end = () => dragging = false;

        btn.addEventListener("mousedown", e => start(e.clientX, e.clientY));
        document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
        document.addEventListener("mouseup", end);

        btn.addEventListener("touchstart", e => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        document.addEventListener("touchmove", e => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        document.addEventListener("touchend", end);

        btn.addEventListener("click", () => !dragging && open());
        document.body.appendChild(btn);
    }

    const update = () => {
        addPlayerButton();
        addFloatButton();
    };

    let lastURL = location.href;
    setInterval(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            update();
        }
    }, 800);
    update();
})();