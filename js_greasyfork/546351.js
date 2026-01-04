// ==UserScript==
// @name         Aniwatch+ Ultimate (Tampermonkey)
// @namespace    DomopremoScripts
// @version      2.1
// @description  QoL upgrades for aniwatch.me: local time conversion, quick search, list improvements, notifications, autoplay, skip intro, next ep, custom shortcuts, and more.
// @author       Domopremo
// @license      MIT
// @match        *://aniwatch.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546351/Aniwatch%2B%20Ultimate%20%28Tampermonkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546351/Aniwatch%2B%20Ultimate%20%28Tampermonkey%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTRO_SKIP_SECONDS = 85;    // seconds to skip for intros
    const OUTRO_SKIP_SECONDS = 60;    // seconds to skip at the end

    // ✅ 1. Convert timestamps to local time
    function convertTimes() {
        document.querySelectorAll(".time, [data-time]").forEach(el => {
            let t = el.getAttribute("data-time") || el.textContent.trim();
            if (!t) return;
            let date = new Date(t + " UTC");
            if (!isNaN(date)) {
                el.textContent = date.toLocaleString();
            }
        });
    }

    // ✅ 2. Quick search (`/` key)
    function enableQuickSearch() {
        document.addEventListener("keydown", e => {
            if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
                e.preventDefault();
                let search = document.querySelector("input[type='search'], #search, .search-bar input");
                if (search) search.focus();
            }
        });
    }

    // ✅ 3. Better anime list styling
    function improveLists() {
        document.querySelectorAll(".anime-list li").forEach(li => {
            li.style.padding = "6px";
            li.style.borderBottom = "1px solid #333";
        });
    }

    // ✅ 4. Better audio/subtitle info
    function improveAudioSubs() {
        document.querySelectorAll(".audio-sub-info").forEach(info => {
            info.style.fontWeight = "bold";
            info.style.color = "#4fc3f7";
        });
    }

    // ✅ 5. Show notification count in tab title
    function updateTabNotifications() {
        let notif = document.querySelector(".notification-count");
        if (notif) {
            let num = notif.textContent.trim();
            if (num) {
                document.title = `(${num}) ${document.title.replace(/^\(\d+\)\s*/, "")}`;
            }
        }
    }

    // ✅ 6. Autoplay after screenshot
    function enableAutoplayAfterScreenshot() {
        let btn = document.querySelector("#screenshot-btn");
        if (btn) {
            btn.addEventListener("click", () => {
                let video = document.querySelector("video");
                if (video) {
                    setTimeout(() => video.play(), 500);
                }
            });
        }
    }

    // ✅ 7. Auto-play next episode
    function enableAutoplayNextEpisode() {
        let video = document.querySelector("video");
        if (video) {
            video.addEventListener("ended", () => {
                let next = document.querySelector(".next-episode, a[rel='next']");
                if (next) window.location.href = next.href;
            });
        }
    }

    // ✅ 8. Skip intro/outro buttons
    function addSkipButtons() {
        let video = document.querySelector("video");
        if (!video) return;

        let skipIntro = document.createElement("button");
        skipIntro.textContent = "⏭ Skip Intro";
        Object.assign(skipIntro.style, {
            position: "absolute", bottom: "70px", right: "20px", zIndex: "9999",
            padding: "6px 12px", background: "#222", color: "white",
            border: "1px solid #555", cursor: "pointer"
        });
        skipIntro.onclick = () => { video.currentTime += INTRO_SKIP_SECONDS; };

        let skipOutro = document.createElement("button");
        skipOutro.textContent = "⏩ Skip Outro";
        Object.assign(skipOutro.style, {
            position: "absolute", bottom: "40px", right: "20px", zIndex: "9999",
            padding: "6px 12px", background: "#222", color: "white",
            border: "1px solid #555", cursor: "pointer"
        });
        skipOutro.onclick = () => { video.currentTime = Math.max(video.duration - OUTRO_SKIP_SECONDS, video.currentTime); };

        document.body.appendChild(skipIntro);
        document.body.appendChild(skipOutro);
    }

    // ✅ 9. Keyboard shortcuts
    function enableKeyboardShortcuts() {
        document.addEventListener("keydown", e => {
            let video = document.querySelector("video");
            if (!video) return;
            switch (e.key.toLowerCase()) {
                case " ": e.preventDefault(); video.paused ? video.play() : video.pause(); break;
                case "n": {
                    let next = document.querySelector(".next-episode, a[rel='next']");
                    if (next) window.location.href = next.href;
                    break;
                }
                case "p": {
                    let prev = document.querySelector(".prev-episode, a[rel='prev']");
                    if (prev) window.location.href = prev.href;
                    break;
                }
                case "arrowright": video.currentTime += 10; break;
                case "arrowleft": video.currentTime -= 10; break;
            }
        });
    }

    // Run features
    window.addEventListener("load", () => {
        convertTimes();
        enableQuickSearch();
        improveLists();
        improveAudioSubs();
        updateTabNotifications();
        enableAutoplayAfterScreenshot();
        enableAutoplayNextEpisode();
        addSkipButtons();
        enableKeyboardShortcuts();
    });

    // Re-run for dynamic content
    setInterval(() => {
        convertTimes();
        updateTabNotifications();
    }, 5000);

})();
