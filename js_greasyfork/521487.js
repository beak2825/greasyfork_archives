// ==UserScript==
// @name         Roblox Server Utils
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds useful features related to roblox servers
// @author       Kugel
// @match        http*://www.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521487/Roblox%20Server%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/521487/Roblox%20Server%20Utils.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const placeId = URL.parse(location.href).pathname.split("/")[2];
    if(!placeId) return;
    const updateMenu = (oldBtn, jobId) => {
        oldBtn.querySelector("a").onclick = (ev) => {
            if (ev.target.id === "copy-jobid") {
                GM_setClipboard(jobId);
            }
        };
    };
    const createMenu = (container, jobId) => {
        const oldBtn = container.querySelector("button#rbx-utils");
        if (oldBtn) return updateMenu(oldBtn, jobId);
        const menuBtn = document.createElement("button");
        menuBtn.className = "btn-generic-more-sm";
        menuBtn.type = "button";
        menuBtn.id = "rbx-utils";
        menuBtn.title = "more";

        const menuSpan = document.createElement("span");
        menuSpan.className = "icon-more";
        menuBtn.appendChild(menuSpan);
        container.appendChild(menuBtn);
        const popup = `<div id="game-instance-dropdown-menu" role="tooltip" class="fade in popover bottom" style="display: none; position: relative;"><div class="arrow" style="left: 50%;"></div><div class="popover-content"><ul class="dropdown-menu" role="menu"><li><a class="rbx-private-server-configure" id="copy-jobid">Copy job ID</a></li></ul></div></div>`;
        menuBtn.innerHTML += popup;

        menuBtn.onclick = () => {
            const popover = menuBtn.querySelector("div");
            popover.style.display = popover.style.display == "none" ? "block" : "none";

        };

        menuBtn.querySelector("a").onclick = (ev) => {
            if (ev.target.id === "copy-jobid") {
                GM_setClipboard(jobId);
            }
        };
    };
    const updateRate = 2000;
    setInterval(() => {
        const joinBtns = document.querySelectorAll("button.game-server-join-btn");
        for (const btn of joinBtns) {
            const jobId = btn.getAttribute("data-btr-instance-id");
            if (!jobId) continue;

            createMenu(btn.parentElement.parentElement, jobId, placeId);
        }
    }, updateRate);
    const joinInstance = unsafeWindow.Roblox.GameLauncher.joinGameInstance;
    if (!joinInstance) return;
    const containerHeader = document.querySelector("div#rbx-public-running-games").querySelector("div.container-header");
    containerHeader.id = "rbx-utils";
    const joinDiv = document.createElement("div");
    joinDiv.style.padding = "6px";
    const jobInput = document.createElement("input");
    jobInput.type = "text";
    jobInput.className = "dialog-input";
    jobInput.placeholder = "Job ID";
    jobInput.style = "overflow: hidden; overflow-wrap: break-word; width: 325px; height: 37px; border: none; outline: none; margin-right: 5px; border-radius: 10px; padding: 5px; text-align: center;";
    jobInput.spellcheck = false;
    jobInput.autocapitalize = "off";
    jobInput.autocomplete = "off";
    const joinBtn = document.createElement("button");
    joinBtn.type = "submit";
    joinBtn.textContent = "Join";
    joinBtn.className = "btn-primary-md";
    joinBtn.onclick = () => {
        const jobId = jobInput.value;
        if(jobId === "") alert("No job ID specified. choosing random server.");
        joinInstance(placeId, jobId);
    };
    joinDiv.appendChild(jobInput);
    joinDiv.appendChild(joinBtn);
    containerHeader.appendChild(joinDiv);

})();