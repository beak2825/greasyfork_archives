// ==UserScript==
// @name         SteamGifts: Show Country Flags
// @namespace    https://www.steamgifts.com/
// @version      1.01
// @description  Show country flags on SteamGifts using your Steam API key (cached, persistent)
// @match        https://www.steamgifts.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      api.steampowered.com
// @connect      www.steamgifts.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542523/SteamGifts%3A%20Show%20Country%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/542523/SteamGifts%3A%20Show%20Country%20Flags.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const CACHE_KEY = 'sg_flags_cache_v1';
    const RATE_LIMIT_DELAY = 1000;
    const CACHE_EXPIRY_TIME = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months

    const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
    let cache = {};

    try {
        cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch (e) {
        cache = {};
    }

    function saveCache() {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }

    async function getAPIKey() {
        let key = await GM.getValue('steam_api_key');
        if (!isValidAPIKey(key)) {
            while (true) {
                key = prompt("Enter your Steam Web API key (32-character hex):");
                if (key === null) {
                    alert("No API key provided. Script will not function.");
                    return null;
                }
                if (isValidAPIKey(key)) break;
                alert("Invalid key. Must be 32-character hexadecimal.");
            }
            await GM.setValue('steam_api_key', key);
            alert("Steam API key saved successfully!");
        }
        return key;
    }

    function isValidAPIKey(key) {
        return typeof key === 'string' && /^[a-f0-9]{32}$/i.test(key);
    }

    function insertFlagIcon(element, countryCode) {
        if (!countryCode) return;

        const img = document.createElement('img');
        img.src = `https://flagcdn.com/24x18/${countryCode}.png`;
        img.alt = countryCode;
        img.title = countryNames.of(countryCode.toUpperCase()) || countryCode.toUpperCase();
        img.style.marginLeft = '5px';
        img.style.verticalAlign = 'middle';
        img.width = 18;
        img.height = 12;

        const links = element.querySelectorAll('a[href^="/user/"]');
        let usernameEl = null;

        for (const link of links) {
            if (link.textContent.trim()) {
                usernameEl = link;
                break;
            }
        }

        if (usernameEl && !usernameEl.querySelector(`img[alt="${countryCode}"]`)) {
            usernameEl.appendChild(img);
        }
    }

    function insertInlineFlag(nameElement, countryCode) {
        if (!countryCode) return;

        const img = document.createElement("img");
        img.src = `https://flagcdn.com/24x18/${countryCode}.png`;
        img.alt = countryCode;
        img.title = countryNames.of(countryCode.toUpperCase()) || countryCode.toUpperCase();
        img.style.marginLeft = "8px";
        img.style.verticalAlign = "middle";
        img.width = 18;
        img.height = 12;

        nameElement.appendChild(img);
    }

    function fetchSGUserProfile(sgProfileUrl, callback) {
        GM.xmlHttpRequest({
            method: "GET",
            url: sgProfileUrl,
            onload: function (response) {
                const steamLinkMatch = response.responseText.match(/https:\/\/steamcommunity\.com\/(?:id|profiles)\/[a-zA-Z0-9_-]+/);
                if (steamLinkMatch) callback(steamLinkMatch[0]);
            }
        });
    }

    function resolveSteamID(steamUrl, callback) {
        const match = steamUrl.match(/steamcommunity\.com\/(id|profiles)\/([^\/?#]+)/);
        if (!match) return;

        if (match[1] === 'profiles') {
            callback(match[2]);
        } else {
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${match[2]}`,
                onload: (response) => {
                    const data = JSON.parse(response.responseText);
                    if (data?.response?.success === 1) callback(data.response.steamid);
                }
            });
        }
    }

    function fetchCountryCode(steamID, callback) {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamID}`,
            onload: function (response) {
                const json = JSON.parse(response.responseText);
                const user = json.response.players[0];
                if (user?.loccountrycode) {
                    callback(user.loccountrycode.toLowerCase());
                } else {
                    callback(null);
                }
            }
        });
    }

    let lastRequestTime = 0;
    function delayRequest(callback) {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        const delay = timeSinceLastRequest < RATE_LIMIT_DELAY ? RATE_LIMIT_DELAY - timeSinceLastRequest : 0;
        lastRequestTime = now;
        setTimeout(callback, delay);
    }

    async function processUsers() {
        const elements = [
            ...document.querySelectorAll('.comment'),
            ...document.querySelectorAll('.table__row-inner-wrap'),
            ...document.querySelectorAll('.featured__column'),
            ...document.querySelectorAll('.giveaway__row-outer-wrap'),
        ];

        for (const el of elements) {
            if (el.dataset.flagChecked) continue;
            el.dataset.flagChecked = 'true';

            const profileLink = el.querySelector('a[href^="/user/"]');
            if (!profileLink) continue;

            const username = profileLink.getAttribute('href').split('/').pop();
            if (cache[username]) {
                const entry = cache[username];
                if (entry && (Date.now() - entry.time < CACHE_EXPIRY_TIME)) {
                    insertFlagIcon(el, entry.country);
                    continue;
                }
            }

            const fullSGUrl = `https://www.steamgifts.com${profileLink.getAttribute("href")}`;
            delayRequest(() => {
                fetchSGUserProfile(fullSGUrl, (steamUrl) => {
                    resolveSteamID(steamUrl, (steamID64) => {
                        if (steamID64) {
                            fetchCountryCode(steamID64, (cc) => {
                                cache[username] = { country: cc, time: Date.now() };
                                saveCache();
                                insertFlagIcon(el, cc);
                            });
                        }
                    });
                });
            });
        }

        // Add support for user profile top heading
        if (window.location.pathname.startsWith("/user/")) {
            const profileNameEl = document.querySelector(".featured__heading__medium");
            if (profileNameEl && !profileNameEl.dataset.flagInjected) {
                const username = window.location.pathname.split("/")[2];
                const cached = cache[username];
                profileNameEl.dataset.flagInjected = "true";

                if (cached && Date.now() - cached.time < CACHE_EXPIRY_TIME) {
                    insertInlineFlag(profileNameEl, cached.country);
                } else {
                    const fullSGUrl = `https://www.steamgifts.com/user/${username}`;
                    delayRequest(() => {
                        fetchSGUserProfile(fullSGUrl, (steamUrl) => {
                            resolveSteamID(steamUrl, (steamID64) => {
                                if (steamID64) {
                                    fetchCountryCode(steamID64, (cc) => {
                                        cache[username] = { country: cc, time: Date.now() };
                                        saveCache();
                                        insertInlineFlag(profileNameEl, cc);
                                    });
                                }
                            });
                        });
                    });
                }
            }
        }
    }

    const apiKey = await getAPIKey();
    if (!apiKey) return;

    const observer = new MutationObserver(() => processUsers());
    observer.observe(document.body, { childList: true, subtree: true });

    processUsers();
})();
