// ==UserScript==
// @name         Medals
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       brandwagen
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525860/Medals.user.js
// @updateURL https://update.greasyfork.org/scripts/525860/Medals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const medalMax = 339;
    let changed = false;

    function main() {
        let medalPercentage;
        try {
            const data = JSON.parse(document.querySelector(".js-react--profile-page").dataset.initialData);
            medalPercentage = data.user.user_achievements.length / data.achievements.length * 100;
        } catch (error) {
            console.error("Medals: Error reading medals data from profile page JSON", error);
            return;
        }

        const nameElement = document.querySelector(".profile-info__name > span");
        if (nameElement == null) {
            console.error("Medals: Couldn't find medal or name element");
            return;
        }

        const titleElement = document.querySelector(".profile-info__title");
        if (titleElement == null) {
            console.error("Title: Couldn't find a title");
        } else {
            if (titleElement.textContent == "Medal Hunter") {
                titleElement.textContent = "🏅 Medal Hunter 🏅";
                titleElement.style.color = getColor(-1);
            }
        }

        if (!nameElement.textContent.includes("%")) {
            const player = nameElement.textContent;
            if (medalPercentage === 100) {
                nameElement.textContent = '';

                const crown = document.createElement('span');
                crown.textContent = '👑 ';
                nameElement.appendChild(crown);

                const styledUsername = createSpecialUsername(`${player} | ${medalPercentage.toFixed(2)}%`);
                nameElement.appendChild(styledUsername);
            } else {
                nameElement.textContent = `${nameElement.textContent} | ${medalPercentage.toFixed(2)}%`;
                nameElement.style.color = getColor(medalPercentage);
            }
        }
    }

    function getColor(p) {
        if (p > 95) { return '#495afa'; }
        if (p > 90) { return '#60edf4'; }
        if (p > 80) { return '#b66aed'; }
        if (p > 60) { return '#dd596f'; }
        if (p > 40) { return '#ff8c68'; }
        if (p == -1) { return '#ffcf40'; }
        return '#9dbece';
    }

    const observer = new MutationObserver((records) => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                if (!(node instanceof HTMLElement)) {
                    continue;
                }

                if (
                  node.classList.contains("profile-info__name") ||
                  node.querySelector(".profile-info__name") != null
                ) {
                  observer.disconnect();
                  main();
                }
            }
        }
    });

    // this is fully ai
    function createSpecialUsername(name) {
        const el = document.createElement('span');
        el.textContent = name;
        el.style.fontWeight = 'bold';
        el.style.background = 'linear-gradient(270deg, #60edf4, #b66aed, #495afa, #ff8c68)';
        el.style.backgroundSize = '800% 800%';
        el.style.webkitBackgroundClip = 'text';
        el.style.webkitTextFillColor = 'transparent';
        el.style.textShadow = '0 0 8px rgba(255,255,255,0.6)';
        el.style.animation = 'gradientMove 5s ease infinite';

        if (!document.getElementById('username-gradient-keyframes')) {
            const style = document.createElement('style');
            style.id = 'username-gradient-keyframes';
            style.textContent = `
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }

        return el;
    }

    function onVisit(event) {
        observer.disconnect();

        if (
            event != null
                ? event.detail.url.includes("//osu.ppy.sh/users/")
                : window.location.pathname.startsWith("/users/")
        ) {
            observer.observe(document, {
                childList: true,
                subtree: true,
            });
        }
    }

    document.addEventListener("turbo:visit", onVisit);
    onVisit();
})();