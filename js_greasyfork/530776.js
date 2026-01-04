// ==UserScript==
// @name         Elethor - Reminder Buttons
// @namespace    http://tampermonkey.net/
// @version      2025-03-24
// @description  Add buttons daily and weekly
// @author       You
// @match        https://elethor.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elethor.com
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/530776/Elethor%20-%20Reminder%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/530776/Elethor%20-%20Reminder%20Buttons.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const data = await GM.getValue('data', {});

    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const dayOffset = (7 - yearStart.getUTCDay()) % 7;
    const firstSunday = new Date(yearStart.getTime() + dayOffset * 86400000);
    const weekNumber = Math.floor((now - firstSunday) / 604800000) + 1;

    const current = {
        week: weekNumber,
        day: now.getUTCDate()
    };

    function init() {
        if (!data.SPIRE || data.SPIRE !== current.day) create('SPIRE', '/fight/spire', 'day');
        if (!data.PLATINUM || data.PLATINUM !== current.day) create('PLATINUM', '/character/companion/recyclobot', 'day');
        if (!data.SWARM || data.SWARM !== current.day) create('SWARM', 'https://elethor.com/', 'day');

        if (!data.SMUGGLER || data.SMUGGLER !== current.week) create('SMUGGLER', '/shop', 'week');
    }

    function create(label, url, type) {
        const element = document.querySelector('a.navbar-item:nth-child(9)');

        const parent = document.createElement("span");
        parent.className = "navbar-item is-skewed";

        const link = document.createElement("a");
        link.href = url;
        link.className = "icon";

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "svg-inline--fa fa-ring");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("data-prefix", "fas");
        svg.setAttribute("data-icon", "ring");
        svg.setAttribute("role", "img");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 512 512");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "orange");
        path.setAttribute("d", "M64 208c0 7.8 4.4 18.7 17.1 30.3C126.5 214.1 188.9 200 256 200s129.5 14.1 174.9 38.3C443.6 226.7 448 215.8 448 208c0-12.3-10.8-32-47.9-50.6C364.9 139.8 314 128 256 128s-108.9 11.8-144.1 29.4C74.8 176 64 195.7 64 208zm192 40c-47 0-89.3 7.6-122.9 19.7C166.3 280.2 208.8 288 256 288s89.7-7.8 122.9-20.3C345.3 255.6 303 248 256 248zM0 208c0-49.6 39.4-85.8 83.3-107.8C129.1 77.3 190.3 64 256 64s126.9 13.3 172.7 36.2c43.9 22 83.3 58.2 83.3 107.8v96c0 49.6-39.4 85.8-83.3 107.8C382.9 434.7 321.7 448 256 448s-126.9-13.3-172.7-36.2C39.4 389.8 0 353.6 0 304V208z");

        svg.appendChild(path);
        link.appendChild(svg);

        const textSpan = document.createElement("span");
        textSpan.className = "is-hidden-mobile text-xs";
        textSpan.textContent = label;
        textSpan.addEventListener('click', async () => {
            data[label] = type === 'day' ? current.day : current.week;
            await GM.setValue('data', data);
            parent.remove();
        });

        parent.appendChild(link);
        parent.appendChild(textSpan);

        element.parentElement.insertBefore(parent, element.nextSibling);
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.navbar-item.is-skewed')) {
            init();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();