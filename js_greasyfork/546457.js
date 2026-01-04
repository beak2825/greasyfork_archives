// ==UserScript==
// @name         Allowed Gear types stat
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  works with RLOT
// @author       ChatGPT
// @match        https://www.roblox.com/games/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546457/Allowed%20Gear%20types%20stat.user.js
// @updateURL https://update.greasyfork.org/scripts/546457/Allowed%20Gear%20types%20stat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .stat-gears {
            margin: 3px auto;
        }
        .icon-nogear {
            background-position: 0 -336px;
            background-image: url(https://static.rbxcdn.com/images/NextStyleGuide/games.svg);
            background-repeat: no-repeat;
            background-size: auto auto;
            width: 28px;
            height: 28px;
            display: inline-block;
            vertical-align: middle;
        }
        .text-label {
            color: #B8B8B8;
            font-weight: 400;
        }
        .text-lead {
            font-size: 18px;
            font-weight: 400;
        }
    `);

    function insertOrReplaceAllowedGear() {
        const statsList = document.querySelector("ul.border-top.border-bottom.game-stat-container");
        if (!statsList) return;

        let subLi = [...statsList.querySelectorAll("li.game-stat")].find(li =>
            li.querySelector("p.text-label")?.innerText.includes("Subgenre")
        );

        if (subLi) {

            const nameP = subLi.querySelector("p.text-label");
            nameP.textContent = "Allowed Gear types";

            const valueP = subLi.querySelector("p.text-lead");
            valueP.innerHTML = '<span class="icon-nogear" data-toggle="tooltip" title="No Gear Allowed"></span>';

        } else {

            if (statsList.querySelector(".stat-gears")) return;

            const li = document.createElement("li");
            li.className = "game-stat";
            li.innerHTML = `
                <p class="text-label">Allowed Gear types</p>
                <p class="text-lead stat-gears">
                    <span class="icon-nogear" data-toggle="tooltip" title="No Gear Allowed"></span>
                </p>
            `;
            statsList.appendChild(li);
        }


        if (typeof $ === "function" && typeof $.fn.tooltip === "function") {
            $(statsList).find('[data-toggle="tooltip"]').tooltip({
                container: 'body',
                placement: 'bottom'
            });
        }
    }


    const observer = new MutationObserver(() => insertOrReplaceAllowedGear());
    observer.observe(document.body, { childList: true, subtree: true });


    insertOrReplaceAllowedGear();
})();
