// ==UserScript==
// @name            PornHub | Hide Block List Models
// @namespace       http://tampermonkey.net/
// @version         1.0.5
// @description     This script will hide models that you add to block list
// @author          extra.lewd
// @match           https://*.pornhub.com/*
// @exclude         https://*.pornhub.com/model/*
// @exclude         https://*.pornhub.com/channels/*
// @exclude         https://*.pornhub.com/categories
// @icon            https://pornhub.com/favicon.ico
// @run-at          document-end
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @homepage        https://discord.gg/TcWrM6pXWD
// @homepageURL     https://discord.gg/TcWrM6pXWD
// @website         https://discord.gg/TcWrM6pXWD
// @source          https://discord.gg/TcWrM6pXWD
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @grant           GM.getValue
// @grant           GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/519516/PornHub%20%7C%20Hide%20Block%20List%20Models.user.js
// @updateURL https://update.greasyfork.org/scripts/519516/PornHub%20%7C%20Hide%20Block%20List%20Models.meta.js
// ==/UserScript==
(function () {
    'use strict';
    class PCache {
        cache;
        storageKey = "blocked_phub";
        constructor(cache = new Map()) {
            this.cache = cache;
            this.load();
        }
        has(key) {
            return this.cache.has(key);
        }
        get(key) {
            const cache = this.cache.get(key);
            if (!!cache && cache.ttl > Date.now()) {
                return cache.value;
            }
            this.del(key);
        }
        set(key, value, ttl) {
            this.cache.set(key, {
                value,
                ttl: Date.now() + ttl
            });
            this.save();
        }
        del(key) {
            this.cache.delete(key);
            this.save();
        }
        clear() {
            this.cache.clear();
            this.save();
        }
        async wrap(key, callback, ttl) {
            const cache = this.cache.get(key);
            if (cache) {
                return cache.value;
            }
            const value = await callback();
            this.set(key, value, ttl);
            return value;
        }
        save() {
            localStorage.setItem(this.storageKey, JSON.stringify([...this.cache.entries()]));
        }
        load() {
            const cache = localStorage.getItem(this.storageKey);
            if (cache) {
                try {
                    this.cache = new Map(JSON.parse(cache));
                }
                catch (error) {
                }
            }
        }
    }
    GM_addStyle(`
            .phub-blur {
                filter: blur(10px);
            }

            .phub-hide {
                display: none !important;
            }

            .phub-blur:hover,.phub-blur:active,.phub-blur:focus {
            filter: none;
            }
            `);
    const cache = new PCache();
    let busy = false;
    const P_CLEAR = "phub-clear";
    const P_SKIP = "phub-skip";
    const P_BLUR = "phub-blur";
    const P_HIDE = "phub-hide";
    scan();
    // todo: add also hide by .languageType span, but it require phub spoken tag on videos
    // todo: add hide channels feature
    setInterval(scan, 10_000);
    async function scan() {
        if (!checkAuth())
            return; // we don't have block list, cuz we don't logined yet
        if (busy)
            return;
        try {
            busy = true;
            const videos = document.querySelectorAll(`li.videoblock:not(.${P_CLEAR}):not(.${P_HIDE}):not(.${P_BLUR}):not(.${P_SKIP}),li[data-video-id]:not(.${P_CLEAR}):not(.${P_HIDE}):not(.${P_BLUR}):not(.${P_SKIP})`);
            if (videos.length < 1) {
                return;
            }
            const mode = await GM.getValue("phub_mode", 0);
            for (const video of videos) {
                try {
                    // note: some (as germancouple1) has only "span.username" without href / url instead of "a". Devs?
                    const path = video.querySelector(".usernameWrap")?.querySelector("a")?.getAttribute("href") || video.querySelector(".uploaderLink")?.getAttribute("href");
                    if (!path) {
                        console.warn("Skip", video);
                        video.classList.add(P_SKIP);
                        continue;
                    }
                    ;
                    const url = new URL(path, window.location.href);
                    // we cache any value to prevent a lot of queries, purge cache on add block listed
                    const blocked = await cache.wrap(url.href, async () => {
                        return fetch(url, {
                            credentials: "include"
                        })
                            .then(r => r.text())
                            .then(isBlocked);
                    }, 1000 * 60 * 60); // 1 hour
                    video.classList.add(blocked
                        ? mode
                            ? P_HIDE
                            : P_BLUR
                        : P_CLEAR);
                }
                catch (error) {
                    console.error(error, video);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            busy = false;
        }
    }
    // note: phub developers clowns a bit, so...
    function isBlocked(html) {
        const p = new DOMParser();
        const doc = p.parseFromString(html, "text/html");
        // Currently, support only on eng lang
        // new method:
        // .profileBlockIcon -> desktop
        // i.ph-icon-cancel -> mobile
        const pc = doc.querySelector(".profileBlockIcon")?.parentElement?.textContent?.trim().toLowerCase() === "unblock user";
        const mobile = doc.querySelector("i.ph-icon-cancel")?.parentElement?.textContent?.trim().toLowerCase() === "unblock user";
        return pc || mobile;
    }
    function checkAuth() {
        return !!document.querySelector(".js_userName");
    }
    GM_registerMenuCommand("Blur Blocked (Default)", () => {
        GM.setValue("phub_mode", 0);
    });
    GM_registerMenuCommand("Hide Blocked", () => {
        GM.setValue("phub_mode", 1);
    });
    GM_registerMenuCommand("Clear Cache", () => {
        cache.clear();
    });
    // GM_registerMenuCommand("Check Block (Dev only)", () => {
    //     const isBlocked = !document.querySelector(".addFriendButton:not(.disabled)") && !!document.querySelector(".addFriendButton");
    //     GM.notification({
    //         text: `Target on current page ${isBlocked ? "IN" : "NOT in"} block list.`,
    //         title: "Debug",
    //     })
    // })
})();
