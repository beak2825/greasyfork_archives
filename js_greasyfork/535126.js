// ==UserScript==
// @name         MediaSession Enhancer for 애니라이프
// @namespace    http://tampermonkey.net/
// @version      4.0.2
// @description  모바일 최적화: MediaSession 최적화 설정
// @match        *://anilife.app/*
// @icon         https://anilife.app/favicon.ico
// @grant        none
// @author       Lusyeon
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535126/MediaSession%20Enhancer%20for%20%EC%95%A0%EB%8B%88%EB%9D%BC%EC%9D%B4%ED%94%84.user.js
// @updateURL https://update.greasyfork.org/scripts/535126/MediaSession%20Enhancer%20for%20%EC%95%A0%EB%8B%88%EB%9D%BC%EC%9D%B4%ED%94%84.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const includeSubtitle = false;
    const enableArtwork = true;

    let lastTitle = "", lastAlbum = "", lastArtwork = "";

    const cleanText = text => text.replace(/[|│‖]/g, "").trim();

    function observeThumbnailClicks() {
        if (!enableArtwork) return;

        document.body.addEventListener("click", e => {
            // 클릭한 요소 또는 조상 중 article.i9G-MiV 내 a 태그 찾기
            const article = e.target.closest("article.i9G-MiV");
            const anchor = article?.querySelector("a");
            if (!anchor || !article.contains(e.target)) return;

            // 정확한 썸네일 이미지 찾기
           const img = article.querySelector("img._79sgJbw");
           if (img?.src) {
               sessionStorage.setItem("mediaArtwork", img.src);
                console.log("[Tampermonkey] 🖼️ 썸네일 저장됨:", img.src);
            }
        }, { passive: true });
    }

    function extractTitleAndAlbum() {
        const h1 = document.querySelector("h1.dh-DkEc");
        if (!h1) return null;

        const rawTitle = h1.textContent.trim();
        const h3 = document.querySelector("h3.wed0o5R");
        const subTitle = h3?.textContent.trim() || "";

        let title = rawTitle, album = "";

        const match = rawTitle.match(/^(.*?)(\d+화)$/);
        if (match) {
            title = match[1].trim();
            album = match[2].trim();
            if (includeSubtitle && subTitle) album += " - " + subTitle;
        }

        return {
            title: cleanText(title),
            album: cleanText(album)
        };
    }

    function updateMediaSession(retryCount = 0) {
        if (!location.href.includes("/play")) return;

        const h1 = document.querySelector("h1.dh-DkEc");
        if (!h1) {
            if (retryCount < 10) {
                setTimeout(() => updateMediaSession(retryCount + 1), 500);
            } else {
                console.log("[Tampermonkey] ❌ h1 요소를 5초간 못 찾음");
            }
            return;
        }

        const result = extractTitleAndAlbum();
        if (!result) return;

        const { title, album } = result;
        const savedArtwork = enableArtwork ? (sessionStorage.getItem("mediaArtwork") || "") : "";

        if (title === lastTitle && album === lastAlbum && savedArtwork === lastArtwork) return;

        lastTitle = title;
        lastAlbum = album;
        lastArtwork = savedArtwork;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist: album,
                album: "루션",
                artwork: savedArtwork ? [
                    { src: savedArtwork, sizes: "128x128", type: "image/png" }
                ] : []
            });
            console.log("[Tampermonkey] ✅ MediaSession 갱신됨");
            console.log("▶ 제목:", title);
            console.log("▶ 앨범명:", album);
            console.log("▶ 이미지:", savedArtwork || "없음");
        }
    }

    function hookHistoryEvents() {
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        const replaceState = history.replaceState;
        history.replaceState = function () {
            replaceState.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    }

    function setupUrlObserver() {
        hookHistoryEvents();

        window.addEventListener('locationchange', () => {
            setTimeout(() => updateMediaSession(), 800);
        });
    }

    function run() {
        observeThumbnailClicks();
        updateMediaSession();
        setupUrlObserver();
    }

    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
})();