// ==UserScript==
// @name         Profile Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  Hides sections, enables the Attack button, displays Life percentage, and shows monthly personal stats.
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @author       Apollyon [445323]
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514678/Profile%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/514678/Profile%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const api_key = "APIKEYHERE";

    // === Hide "Personal Information" block if it contains fields or says "doesn't wish to share" ===
    const observer = new MutationObserver(() => {
        const infoBlocks = document.querySelectorAll('.personal-information.profile-right-wrapper.right > div');

        infoBlocks.forEach(block => {
            const title = block.querySelector('.title-black.top-round');
            const content = block.querySelector('.cont.bottom-round');

            if (title?.textContent?.includes("Personal Information")) {
                const text = content?.textContent || "";
                const hasFields = /(Real name|Country|City|Age)/.test(text);
                const hasNoShareMessage = text.includes("doesn't wish to share");

                if (hasFields || hasNoShareMessage) {
                    block.style.display = 'none';
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // === Utility Functions ===
    function hideMedalsSection() {
        const medalsSection = document.querySelector('.profile-wrapper.medals-wrapper.m-top10');
        if (medalsSection) medalsSection.style.display = 'none';
    }

    function hideUserInfoTitle() {
        const userInfoTitle = document.querySelector('.title-black.top-round');
        if (userInfoTitle) userInfoTitle.style.display = 'none';
    }

    function enableButton(button) {
        if (button && button.classList.contains('disabled')) {
            button.classList.remove('disabled');
            button.classList.add('active');
            button.removeAttribute('aria-disabled');
            button.removeAttribute('href');
            button.addEventListener('click', handleButtonClick);
            button.querySelector('svg').removeAttribute('fill');
            button.querySelector('svg').setAttribute('fill', 'url(#linear-gradient-dark-mode)');
            button.style.border = '1px solid red';
        }
    }

    // ✅ Fixed: Use event.currentTarget to reliably get the button's ID
    function handleButtonClick(event) {
        event.preventDefault();
        const userID = event.currentTarget.id.replace('button0-profile-', '');
        window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;
    }

    hideMedalsSection();
    hideUserInfoTitle();

    new MutationObserver(() => {
        hideMedalsSection();
        hideUserInfoTitle();
    }).observe(document.body, { childList: true, subtree: true });

    new MutationObserver(() => {
        const buttons = document.querySelectorAll('[id^="button0-profile-"]');
        buttons.forEach(enableButton);
    }).observe(document.body, { childList: true, subtree: true });

    // === Life Percentage ===
    function updateLifePercentage() {
        const lifeListItem = [...document.querySelectorAll(".user-information-section")]
            .find(item => item.textContent.trim() === "Life");

        if (lifeListItem) {
            const lifeElement = lifeListItem.nextElementSibling.querySelector("span");
            if (lifeElement) {
                // ✅ Fixed: remove commas before converting to numbers
                const [currentLife, maxLife] = lifeElement.textContent
                    .trim()
                    .split(" / ")
                    .map(v => Number(v.replace(/,/g, '')));

                if (!isNaN(currentLife) && !isNaN(maxLife)) {
                    const lifePercentage = ((currentLife / maxLife) * 100).toFixed(2);
                    let percentageSpan = lifeElement.querySelector(".life-percentage");
                    if (!percentageSpan) {
                        percentageSpan = document.createElement("span");
                        percentageSpan.className = "life-percentage";
                        percentageSpan.style.fontWeight = "bold";
                        percentageSpan.style.marginLeft = "5px";
                        lifeElement.appendChild(percentageSpan);
                    }
                    percentageSpan.textContent = `(${lifePercentage}%)`;
                    percentageSpan.style.color = lifePercentage === "100.00" ? "darkgreen" :
                        lifePercentage >= 75 ? "lightgreen" :
                            lifePercentage >= 50 ? "orange" :
                                lifePercentage >= 25 ? "red" : "darkred";
                }
            }
        }
    }

    const lifeInterval = setInterval(() => {
        const lifeListItem = document.querySelector(".user-information-section");
        if (lifeListItem) {
            updateLifePercentage();
            const lifeElement = lifeListItem.nextElementSibling.querySelector("span");
            if (lifeElement) {
                new MutationObserver(updateLifePercentage).observe(lifeElement, { childList: true, characterData: true, subtree: true });
            }
            clearInterval(lifeInterval);
        }
    }, 500);

    // === Monthly Stats Viewer ===
    async function fetchPersonalStats(id, time) {
        const stats = [
            "xantaken", "energydrinkused", "useractivity", "refills", "attackswon",
            "respectforfaction", "retals", "statenhancersused", "networth", "overdosed",
            "alcoholused", "nerverefills"
        ].join(",");
        const url = time
            ? `https://api.torn.com/user/${id}?selections=personalstats&stat=${stats}&timestamp=${time}&key=${api_key}`
            : `https://api.torn.com/user/${id}?selections=personalstats&key=${api_key}`;

        try {
            const resp = await fetch(url);
            const data = await resp.json();
            return data.error ? null : data;
        } catch (err) {
            console.error("API connection error:", err);
            return null;
        }
    }

    async function displayStats() {
        const id = window.location.href.split("=")[1];
        const now = ~~(Date.now() / 1000);
        const monthAgo = ~~(new Date(new Date().setMonth(new Date().getMonth() - 1)) / 1000);
        const days = 30;

        const [past, current] = await Promise.all([fetchPersonalStats(id, monthAgo), fetchPersonalStats(id)]);

        if (!past || !current) return;

        const p0 = past.personalstats || {}, p1 = current.personalstats || {};
        const getDiff = (key) => (p1[key] || 0) - (p0[key] || 0);
        const xanax = getDiff("xantaken"), edrinks = getDiff("energydrinkused"),
            activity = ((getDiff("useractivity")) / 86400).toFixed(2),
            refills = getDiff("refills"), attacks = getDiff("attackswon"),
            respect = getDiff("respectforfaction"), retals = getDiff("retals"),
            travel = getDiff("traveltimes"), se = getDiff("statenhancersused"),
            netChange = getDiff("networth"), ods = getDiff("overdosed");

        const formatNet = (val) => {
            const t = Math.floor(val / 1e12), b = Math.floor((val % 1e12) / 1e9), m = Math.floor((val % 1e9) / 1e6);
            return `${t ? t + 't ' : ''}${b ? b + 'b ' : ''}${m ? m + 'm' : ''}`.trim();
        };

        const colorWrap = (val, thresholds, colors) => {
            for (let i = 0; i < thresholds.length; i++)
                if (val <= thresholds[i]) return `<span style="color:${colors[i]}; font-weight:bold;">${val}</span>`;
            return `<span style="color:${colors[thresholds.length]}; font-weight:bold;">${val}</span>`;
        };

        const formatActivity = (hrs) => {
            const mins = (hrs * 60).toFixed(0);
            return `${colorWrap(hrs, [0.5, 1, 3, 6], ["#D84315", "yellow", "green", "hotpink", "#00FFFF"])} hrs/day || ` +
                `${colorWrap(mins, [30, 60, 180, 360], ["#D84315", "yellow", "green", "hotpink", "#00FFFF"])} minutes/day`;
        };

        const formatNetWithChange = (val, chg) => {
            const formatted = formatNet(val), delta = formatNet(Math.abs(chg));
            const color = chg > 0 ? (chg >= 1e9 ? "hotpink" : "green") : "#D84315";
            return `<span style="color:#fff; font-weight:bold;">${formatted}</span> ` +
                `(<span style="color:${color}; font-weight:bold;">${chg > 0 ? '+' : '-'}${delta}</span>)`;
        };

        const stats = [
            { label: "Activity", value: formatActivity(activity) },
            { label: "Xanax", value: `${colorWrap(xanax, [60, 74, 90], ["#D84315", "yellow", "green", "hotpink"])} (${(xanax / days).toFixed(2)}/day)` },
            { label: "Energy Drinks", value: `${colorWrap(edrinks, [1, 150, 299, 359], ["#fff", "yellow", "green", "hotpink", "#00FFFF"])} (${(edrinks / days).toFixed(2)}/day)` },
            { label: "Refills", value: `${colorWrap(refills, [15, 20, 25], ["#D84315", "yellow", "green", "hotpink"])} (${(refills / days).toFixed(2)}/day)` },
            { label: "Attacks", value: `<span style="color:#fff;">${attacks}</span>` },
            { label: "Networth", value: formatNetWithChange(p1.networth || 0, netChange) },
            { label: "SEs", value: colorWrap(se, [1], ["#fff", "hotpink"]) },
            { label: "Overdoses", value: colorWrap(ods, [0.99], ["hotpink", "#D84315"]) },
        ];

        const container = document.createElement("div");
        container.className = "basic-information profile-left-wrapper left";
        container.id = "stats-viewer-box";
        container.style.cssText = `
            margin-top: 0;
            width: 100%;
            max-width: 386px;
            background: #333;
            border-radius: 5px;
            box-shadow: 0 1px 0 rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1);
        `;

        container.innerHTML = `
        <style>
            #stats-viewer-box .user-info-value, #stats-viewer-box .user-information-section {
                color: #fff !important;
            }
        </style>
        <div>
            <div class="title-black top-round" style="background: linear-gradient(180deg,#555,#333); color:#fff; text-shadow:0 0 2px #0008; font-size:12px; font-weight:bold; line-height:30px; height:30px; padding-left:10px; border-bottom:1px solid #444;">
                Player Statistics
            </div>
        </div>
        <div class="cont bottom-round" style="padding: 0; max-height: 290px; overflow-y: auto;">
            <ul class="info-table" style="list-style: none; padding: 0; margin: 0; width: 100%;">
                ${stats.map(({ label, value }) => `
                    <li style="border-bottom: 1px solid #222; padding: 0; height: 24px; display: flex; justify-content: space-between; align-items: center;">
                        <div class="user-information-section" style="width: 35%; font-weight: bold; color: #ddd;">${label}</div>
                        <div class="user-info-value" style="width: 65%; text-align: left;">${value}</div>
                    </li>`).join("")}
            </ul>
        </div>`;

        const target = document.querySelector(".personal-information.profile-right-wrapper.right");
        if (target) target.appendChild(container);
    }

    // Load stats immediately on page load or refresh
    window.addEventListener('load', displayStats);
})();
