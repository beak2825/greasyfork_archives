// ==UserScript==
// @name         DeTrend – Hide "CHECK THE SOUND" bait in YT Shorts
// @namespace    https://winverse.detrend
// @version      2.0.4
// @description  This is for people who hate these stupid trends
// @author       Winverse
// @match        *://*.youtube.com/shorts/*
// @match        *://*.youtube.com/*
// @match        *://youtube.com/shorts/*
// @match        *://youtube.com/*
// @run-at       document-idle
// @icon         https://i.ibb.co/VYG22nmP/Projekt-bez-nazwy.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545733/DeTrend%20%E2%80%93%20Hide%20%22CHECK%20THE%20SOUND%22%20bait%20in%20YT%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/545733/DeTrend%20%E2%80%93%20Hide%20%22CHECK%20THE%20SOUND%22%20bait%20in%20YT%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedWords = [
        "sound",
        "this sound",
        "the sound",
        "that sound",
        "music",
        "check the sound",
        "freak",
        "trend",
        "freaky",
        "freaking",
        "click the sound",
        "sound sound",
        "🥀💔",
        "🥀",
        "🥀😭",
        "reverse",
        "there sound",
        "#actingchallenge",
        "#marriageproposals",
        "#fyxoedits",
        "#flyxoedits",
        "#crazilyfunny",
        "in 2026",
        "Watch this",
        "Watch",
        "money",
        "GIVES ME MONEY",
        "See you",
        "#giveaway",
        "#montagem",
        "before 2026",
        "#driftphonk",
        "#cosplayer",
        "#trend",
        "#tweening",
        "#aesthetic",
        "#lipsync",
        "#makeuptransition",
        "#jumpstyle",
        "#bulun",
        "67",
        "small content creator",
        "content",
        "#itsmeissie"
    ];

    function containsBlockedWord(text) {
        return blockedWords.some(word => text.toLowerCase().includes(word));
    }

    function cleanTitles() {
        document.querySelectorAll(
            ".yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap.yt-core-attributed-string--link-inherit-color"
        ).forEach(el => {
            const text = el.innerText || el.textContent;
            if (containsBlockedWord(text)) {
                // Remove text first
                el.textContent = "";

                // Hide the parent wrappers
                let host = el.closest(".ytShortsVideoTitleViewModelHost");
                let title = el.closest(".ytShortsVideoTitleViewModelShortsVideoTitle");
                if (host) host.style.display = "none";
                if (title) title.style.display = "none";
                el.style.display = "none";
            }
        });
    }

    // Run initially and then watch for new nodes
    const observer = new MutationObserver(() => cleanTitles());
    observer.observe(document.body, { childList: true, subtree: true });

    cleanTitles();
})();
