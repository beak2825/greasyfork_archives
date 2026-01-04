// ==UserScript==
// @name         Ultimate Instance Redirect
// @namespace    violentmonkey.ultimate.redirect
// @version      2.6
// @description  Redirect social media to privacy frontends, remember mirror, switch instances with button and Ctrl+Shift+R hotkey. SponsorBlock removed. Sticky redirects enabled.
// @author       Amil John
// @match        *://*reddit.com/*
// @match        *://*.reddit.com/*
// @match        *://*twitter.com/*
// @match        *://*.twitter.com/*
// @match        *://*x.com/*
// @match        *://*.x.com/*
// @match        *://*/*
// @grant        none
// @license     CC-BY-NC-4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541277/Ultimate%20Instance%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/541277/Ultimate%20Instance%20Redirect.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const STORAGE_KEY_PREFIX = "preferredFrontend:";

    const serviceRedirects = [
        {
            name: "Reddit",
            match: /(?:^|\.)reddit\.com$/,
            storageKey: STORAGE_KEY_PREFIX + "reddit",
            frontends: [
                "https://redlib.catsarch.com",
                "https://redlib.perennialte.ch",
                "https://redlib.r4fo.com",
                "https://redlib.privacyredirect.com",
                "https://libreddit.diffraction.dev",
                "https://redlib.privadency.com",
                "https://redlib.scanash.xyz"
            ]
        },
        {
            name: "YouTube",
            match: /(?:^|\.)youtube\.com$/,
            storageKey: STORAGE_KEY_PREFIX + "youtube",
            frontends: [
                "https://yewtu.be",
                "https://inv.nadeko.net",
            ]
        },
        {
            name: "Twitter",
            match: /(?:^|\.)twitter\.com$|(?:^|\.)x\.com$/,
            storageKey: STORAGE_KEY_PREFIX + "twitter",
            frontends: [
                "https://nitter.net",
                "https://nitter.poast.org",
            ]
        }
    ];

    const currentHost = window.location.hostname;

    function getCurrentService() {
        return serviceRedirects.find(service => service.match.test(currentHost));
    }

    function getFrontendByHost(hostname) {
        return serviceRedirects.find(service =>
            service.frontends.some(url => new URL(url).hostname === hostname)
        );
    }

    function getStoredFrontend(service) {
        const url = localStorage.getItem(service.storageKey);
        return url && service.frontends.includes(url) ? new URL(url) : null;
    }

    function setStoredFrontend(service, frontendURL) {
        localStorage.setItem(service.storageKey, frontendURL.toString());
    }

    function getRandomFrontend(service, excludeHostname = null) {
        const filtered = excludeHostname
            ? service.frontends.filter(u => new URL(u).hostname !== excludeHostname)
            : [...service.frontends];
        return new URL(filtered[Math.floor(Math.random() * filtered.length)]);
    }

    function switchFrontend() {
        const service = getFrontendByHost(currentHost);
        if (!service) return;

        const newFrontend = getRandomFrontend(service, currentHost);
        setStoredFrontend(service, newFrontend.toString());
        const newUrl = newFrontend + window.location.pathname + window.location.search + window.location.hash;
        window.location.href = newUrl;
    }

    function createSwitcherButton() {
        const service = getFrontendByHost(currentHost);
        if (!service) return;

        const btn = document.createElement("button");
        btn.innerText = `🔄 Switch Instance (Ctrl + Shift + R)`;
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "12px",
            right: "12px",
            zIndex: "99999",
            padding: "10px 14px",
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        });
        btn.addEventListener("click", switchFrontend);

        const tryInsert = () => (document.body || document.documentElement).appendChild(btn);

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", tryInsert);
        } else {
            tryInsert();
        }
    }

    function addHotkey() {
        document.addEventListener("keydown", function (e) {
            const service = getFrontendByHost(currentHost);
            if (e.ctrlKey && e.shiftKey && e.code === "KeyR" && service) {
                e.preventDefault();
                switchFrontend();
            }
        });
    }

    function rewriteLinks() {
        document.querySelectorAll("a[href]").forEach(link => {
            try {
                const url = new URL(link.href);
                const service = serviceRedirects.find(svc => svc.match.test(url.hostname));
                if (service) {
                    const saved = getStoredFrontend(service);
                    if (saved) {
                        url.hostname = new URL(saved).hostname;
                        url.protocol = "https:";
                        link.href = url.toString();
                    }
                }
            } catch (_) {}
        });
    }

    function redirectIfOnService() {
        const service = getCurrentService();
        if (!service) return;

        const saved = getStoredFrontend(service);
        const redirectTarget = saved || getRandomFrontend(service);

        if (!saved) {
            setStoredFrontend(service, redirectTarget.toString());
        }

        const fullURL = redirectTarget + window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(fullURL);
    }

    function initSponsorBlock() {
        const categories = ["sponsor", "selfpromo", "interaction", "intro", "outro", "preview", "music_offtopic", "exclusive_access"];
        const skipSegments = new Map();
        const muteSegments = new Map();

        const params = new URLSearchParams(window.location.search);
        const videoID = params.get("v");
        if (!videoID) return;

        function tryInject() {
            const video = document.querySelector("video");
            if (!video) return;

            fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${videoID}&categories=${JSON.stringify(categories)}`)
                .then(res => res.json())
                .then(data => {
                    data.forEach(item => {
                        const [start, end] = item.segment;
                        if (item.actionType === "skip") skipSegments.set(start, end);
                        else if (item.actionType === "mute") muteSegments.set(start, end);
                    });

                    video.addEventListener("timeupdate", () => {
                        const t = video.currentTime;
                        for (const [start, end] of skipSegments) {
                            if (t >= start && t < end) {
                                video.currentTime = end;
                                skipSegments.delete(start);
                            }
                        }
                        for (const [start, end] of muteSegments) {
                            video.muted = (t >= start && t < end);
                        }
                    });
                });
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector("video")) {
                tryInject();
                observer.disconnect();
            }
        });

        observer.observe(document, { childList: true, subtree: true });

        let retryCount = 0;
        const fallback = setInterval(() => {
            if (++retryCount > 30) return clearInterval(fallback);
            if (document.querySelector("video")) {
                tryInject();
                clearInterval(fallback);
            }
        }, 500);
    }

    // === INIT ===
    const matchService = getCurrentService();
    if (matchService) {
        redirectIfOnService();
        return;
    }

    createSwitcherButton();
    addHotkey();
    rewriteLinks();
    new MutationObserver(rewriteLinks).observe(document, { childList: true, subtree: true });
    window.addEventListener("load", initSponsorBlock);
})();
