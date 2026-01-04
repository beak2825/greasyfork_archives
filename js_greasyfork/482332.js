// ==UserScript==
// @name         Menu Tweaks
// @namespace    com.anwinity.idlepixel
// @version      1.0.1
// @description  Move menu items around.
// @author       Wynaan
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/482332/Menu%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/482332/Menu%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MenuTweaksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("menu_tweaks", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.topbarSections = [{
                rows: []
            }];
        }

        onConfigsChanged() {

        }

        onLogin() {
            $("head").append(`
            <style id="styles-menu-tweaks">
                #user-info-top-bar {
                    width: 100%;
                    color: silver;
                    > * tr {
                    }
                }
            </style>
            `);

            this.topbarSections = [];

            const topBar = document.getElementById("top-bar");
            const leftMenuTop = document.getElementById("menu-bar-buttons").querySelector("div");

            // Player infos, to the left
            const flag = document.getElementById("country-flag-top-bar");
            const username = topBar.querySelector("item-display");
            const searchHiScores = document.getElementById("search-username-hiscores");
            const player_id = document.getElementById("player_id");

            const playerLevel = topBar.querySelector('a[href="https://idle-pixel.com/hiscores/"]');
            const completionistLabel = document.getElementById("completionist-label");
            const playtime = document.querySelector('item-display[data-key="playtime"]');

            topBar.removeChild(flag);
            topBar.removeChild(username);
            topBar.removeChild(searchHiScores);
            if(player_id)
                topBar.removeChild(player_id);

            topBar.removeChild(playerLevel);
            if(completionistLabel)
                topBar.removeChild(completionistLabel);
            topBar.removeChild(playtime);

            this.topbarSections.push({ rows: [
                `${flag.outerHTML}${username.outerHTML}${searchHiScores.outerHTML}${player_id ? player_id.outerHTML : ""}`,
                `${playerLevel.outerHTML}${completionistLabel.outerHTML}`,
                playtime.outerHTML
            ]});

            // Currencies
            const coins = document.getElementById("item-display-coins").parentElement;
            const oil = document.querySelector('item-display[data-key="oil"]').parentElement;
            const stardust = document.querySelector('item-display[data-key="stardust"]').parentElement;

            leftMenuTop.removeChild(coins);
            leftMenuTop.removeChild(oil);
            leftMenuTop.removeChild(stardust);

            this.topbarSections.push({ rows: [
                coins.outerHTML,
                oil.outerHTML,
                stardust.outerHTML
            ]});

            // Resources
            const energy = document.getElementById('menu-bar-energy');
            const heat = document.getElementById('menu-bar-heat');
            const fightPoints = document.getElementById("menu-bar-fp");

            energy.parentElement.removeChild(energy);

            this.topbarSections.push({ rows: [
                fightPoints ? fightPoints.outerHTML : "",
                energy.outerHTML,
                heat ? heat.outerHTML : ""
            ]});

            if(IdlePixelPlus.plugins['ui-tweaks'] !== undefined) {
                heat.parentElement.removeChild(heat);
                fightPoints.parentElement.removeChild(fightPoints);
                // Rocket info
                const rocketImg = document.getElementById("rocket-type-img-reg");
                const rocketImgMega = document.getElementById("rocket-type-img-mega");
                const rocketTime = document.getElementById("current-rocket-travel-times");

                const distanceImgMoon = document.getElementById("rocket-current-travel-location-moon");
                const distanceImgSun = document.getElementById("rocket-current-travel-location-sun");
                const rocketDistance = document.getElementById("current-rocket-travel-distances");

                const rocketPot = document.getElementById("current-rocket-pot-info");

                rocketImg.parentElement.removeChild(rocketImg);
                rocketImgMega.parentElement.removeChild(rocketImgMega);
                rocketTime.parentElement.removeChild(rocketTime);

                distanceImgMoon.parentElement.removeChild(distanceImgMoon);
                distanceImgSun.parentElement.removeChild(distanceImgSun);
                rocketDistance.parentElement.removeChild(rocketDistance);

                rocketPot.parentElement.removeChild(rocketPot);

                this.topbarSections.push({ rows: [
                    `${rocketImg.outerHTML}${rocketImgMega.outerHTML}${rocketTime.outerHTML}`,
                    `${distanceImgMoon.outerHTML}${distanceImgSun.outerHTML}${rocketDistance.outerHTML}`,
                    rocketPot.outerHTML
                ]});

                // Moon & sun distance
                const moonDistance = document.getElementById("menu-bar-rocket_moon");
                const sunDistance = document.getElementById("menu-bar-rocket_sun");

                this.topbarSections.push({ rows: [
                    moonDistance.outerHTML,
                    sunDistance.outerHTML
                ]});

                moonDistance.parentElement.removeChild(moonDistance);
                sunDistance.parentElement.removeChild(sunDistance);
            }

            // Options + players online, to the right
            const options = document.querySelector("div.dropdown");
            const playersOnline = document.querySelector('div[onclick*="show_players"]');
            const activityLog = document.querySelector('a[title="Activity Log"]');
            const varViewer = document.querySelector('a[title="Open VarViewer"]');

            topBar.removeChild(options);
            topBar.removeChild(playersOnline);
            if(activityLog)
                topBar.removeChild(activityLog);
            if(varViewer)
                topBar.removeChild(varViewer);

            this.topbarSections.push({ rows: [
                options.outerHTML,
                playersOnline.outerHTML,
                `<div id="plugin-buttons"></div>`
            ]});

            // Hide original left menu
            leftMenuTop.style.display = "none";
            const topSeparator = leftMenuTop.nextElementSibling;
            if(topSeparator.nodeName === "HR")
                topSeparator.style.display = "none";

            // Remove text nodes
            topBar.textContent = "";

            const tableBody = Array.from({length: Math.max(...this.topbarSections.map(s => s.rows.length))}, (_, i) => i)
                .map(i => "<tr>" + this.topbarSections.map(s => `<td style='width: auto; max-width: ${100 / this.topbarSections.length}vw;'>` + (s.rows[i] || "") + "</td>").join("") + "</tr>").join("");

            topBar.insertAdjacentHTML("afterbegin", `
            <table id="user-info-top-bar" class="">
                <tbody>${tableBody}</tbody>
            </table>
            `);

            document.getElementById("plugin-buttons").appendChild(varViewer);
            document.getElementById("plugin-buttons").appendChild(activityLog);
         }
    }

    const plugin = new MenuTweaksPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();