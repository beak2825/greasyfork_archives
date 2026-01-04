// ==UserScript==
// @name         ChatGPT Live
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license      GPLv3
// @description  USE AT YOUR OWN RISK!
// @author       hihihe
// @match        https://chat.openai.com
// @match        https://chat.openai.com/
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @icon         https://chat.openai.com/favicon.ico
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @run-at       document-start
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464677/ChatGPT%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/464677/ChatGPT%20Live.meta.js
// ==/UserScript==
//
// Based on and modified from: https://v2ex.com/t/926890
//

(function () {
    function isWindow(obj) {
        return obj instanceof Window;
    }

    const rawAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
        const [eventName] = args;
        if (
            isWindow(this) &&
            ["focus", "focusin", "visibilitychange"].includes(eventName)
        ) {
            return;
        }
        return rawAddEventListener.apply(this, args);
    };

    const cfg = new MonkeyConfig({
        title: "ChatGPT Live Configuration",
        menuCommand: true,
        params: {
            minRefreshInterval: {
                type: "number",
                default: 30,
                label: "Minimum Refresh Interval (seconds)"
            },
            maxRefreshInterval: {
                type: "number",
                default: 100,
                label: "Maximum Refresh Interval (seconds)"
            },
            refreshURL: {
                type: "text",
                default:
                "https://chat.openai.com/_next/static/k9OKjvwgjWES7JT3k-6g9/_ssgManifest.js",
                label: "Refresh URL"
            },
        },
    });

    function getRefreshURL () {
        var refreshURL = cfg.get("refreshURL");
        if (!refreshURL.endsWith("_ssgManifest.js")) {
            return refreshURL;
        }
        const manifestScript = document.querySelector(
            'script[src*="_ssgManifest.js"]'
        );
        if (manifestScript) {
            cfg.set("refreshURL", manifestScript.src);
            return manifestScript.src;
        }
        return refreshURL;
    };

    const heartbeat = document.createElement("iframe");
    heartbeat.style.display = "none";
    document.head.prepend(heartbeat);

    function getRandomInterval() {
        const minInterval = cfg.get("minRefreshInterval");
        const maxInterval = cfg.get("maxRefreshInterval");
        return Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval) * 1000;
    }

    let count = 0;
    function refresh() {
        count = 0;
        heartbeat.src = `${getRefreshURL()}?${Date.now()}`;
        setTimeout(refresh, getRandomInterval());
    }

    setTimeout(refresh, getRandomInterval());
})();
