// ==UserScript==
// @name         Avatar Finder (Auto-Refresher)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically refreshes on Neopets pages as needed for unlocking avatars - when the avatar is found, it stops and a pop-up notification is generated to alert you.
// @author       Amanda Bynes and AI-manda Binary
// @match        https://www.neopets.com/help_search.phtml?help_id=16*
// @match        https://www.neopets.com/halloween/gamegraveyard.phtml*
// @match        https://www.neopets.com/island/haiku/haiku.phtml*
// @match        https://www.neopets.com/inventory.phtml*
// @match        https://www.neopets.com/neomessages.phtml*
// @match        https://www.neopets.com/medieval/plot_bfm.phtml?current_day=7*
// @match        https://www.neopets.com/nf.phtml/*
// @match        https://www.neopets.com/aota/*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538686/Avatar%20Finder%20%28Auto-Refresher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538686/Avatar%20Finder%20%28Auto-Refresher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshInterval = 3000;
    const targetText = "Something Has Happened!";
    const storageKey = "autoRefreshActive";

    let refreshTimeout = null;
    let initialized = false;

    function createButton(text, id, bgColor) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.textContent = text;
        btn.style.padding = "6px 10px";
        btn.style.margin = "5px";
        btn.style.backgroundColor = bgColor;
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "12px";
        return btn;
    }

    function isTargetFound() {
        return document.body.innerText.toLowerCase().includes(targetText.toLowerCase());
    }

    function startAutoRefresh(startBtn, stopBtn) {
        localStorage.setItem(storageKey, "true");
        startBtn.textContent = "Refreshing...";
        startBtn.style.backgroundColor = "#444";
        stopBtn.style.display = "inline-block";

        if (isTargetFound()) {
            stopAutoRefresh(startBtn, stopBtn, true);
        } else {
            refreshTimeout = setTimeout(() => {
                location.reload();
            }, refreshInterval);
        }
    }

    function stopAutoRefresh(startBtn, stopBtn, found = false) {
        localStorage.removeItem(storageKey);
        clearTimeout(refreshTimeout);
        refreshTimeout = null;

        if (found) {
            alert(`🎉 You received the avatar!`);
            startBtn.textContent = "Avatar Found!";
            startBtn.style.backgroundColor = "#222";
        } else {
            startBtn.textContent = "Start Auto-Refresh";
            startBtn.style.backgroundColor = "#222";
        }

        stopBtn.style.display = "none";
    }

    function init() {
        if (initialized) return;
        initialized = true;

        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.top = "100px";
        wrapper.style.right = "0";
        wrapper.style.zIndex = "9999";
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "flex-end";
        wrapper.style.padding = "10px";

        const startBtn = createButton("Start Auto-Refresh", "start-refresh-btn", "#222");
        const stopBtn = createButton("Stop Auto-Refresh", "stop-refresh-btn", "#555");
        stopBtn.style.display = "none";

        startBtn.addEventListener("click", () => {
            if (localStorage.getItem(storageKey) !== "true") {
                startAutoRefresh(startBtn, stopBtn);
            }
        });

        stopBtn.addEventListener("click", () => {
            stopAutoRefresh(startBtn, stopBtn);
        });

        wrapper.appendChild(startBtn);
        wrapper.appendChild(stopBtn);
        document.body.appendChild(wrapper);

        if (localStorage.getItem(storageKey) === "true") {
            startAutoRefresh(startBtn, stopBtn);
        }
    }

    const retryInit = () => {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            if (!initialized) init();
        } else {
            setTimeout(retryInit, 500);
        }
    };

    retryInit();
})();
