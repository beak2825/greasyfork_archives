// ==UserScript==
// @name         SteamGifts Profile Link on Steam
// @namespace    https://steamgifts.com
// @version      1.0
// @description  Shows a shortcut to the user's SteamGifts profile on every Steam profile page.
// @author       ikigaiDH
// @match        https://steamcommunity.com/profiles/*
// @match        https://steamcommunity.com/id/*
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/540436/SteamGifts%20Profile%20Link%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/540436/SteamGifts%20Profile%20Link%20on%20Steam.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 1️⃣  Grab SteamID64 directly from /profiles/<id64> URLs
    const path = window.location.pathname.split("/");
    if (path[1] === "profiles" && /^\d{17}$/.test(path[2])) {
        injectLink(path[2]);
        return;
    }

    // 2️⃣  Look for `"steamid":"7656119…"` in the raw HTML
    const html = document.documentElement.innerHTML;
    let m = html.match(/"steamid"\s*:\s*"(\d{17})"/);
    if (m) {
        injectLink(m[1]);
        return;
    }

    // 3️⃣  Fallback for older vanity pages: g_steamID global variable
    m = html.match(/g_steamID\s*=\s*"(\d{17})"/);
    if (m) {
        injectLink(m[1]);
    }

    /* ───────── helper ───────── */
    function injectLink(id64) {
        const parent =
            document.querySelector(".profile_header_actions") || // modern layout button row
            document.querySelector(".profile_header_summary"); // classic layout fallback
        if (!parent || document.getElementById("sg-link")) return; // already added

        const a = document.createElement("a");
        a.id = "sg-link";
        a.href = `https://www.steamgifts.com/go/user/${id64}`;
        a.textContent = "SG-link";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.style.cssText = `
            display:inline-block;
            margin-left:8px;
            padding:4px 8px;
            background:#8a6dff;
            color:#fff;
            border-radius:3px;
            font-weight:600;
            text-decoration:none;
        `;
        parent.appendChild(a);
    }
})();