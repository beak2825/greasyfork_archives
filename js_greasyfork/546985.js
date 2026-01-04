// ==UserScript==
// @name         Hide DAZN Fan Zone
// @namespace    https://greasyfork.org/fr/users/1508121-guiiillaume
// @version      2.0.0
// @description  Ajoute une icône dans le menu DAZN pour cacher ou réafficher la Fan Zone
// @author       Guiiillaume
// @match        https://*.dazn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dazn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546985/Hide%20DAZN%20Fan%20Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/546985/Hide%20DAZN%20Fan%20Zone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Hide DAZN Fan Zone] Script démarré");

    const getFanZone = () => document.querySelector("aside[class^='main__player-aside___']");

    const toggleFanZone = (icon) => {
        const fanZone = getFanZone();
        if (!fanZone) return;

        if (fanZone.style.display !== "none") {
            fanZone.style.display = "none";
            icon.title = "Réafficher Fan Zone";
            icon.style.filter = "opacity(0.5)";
            console.log("[Hide DAZN Fan Zone] Fan Zone cachée ✅");
        } else {
            fanZone.style.display = "";
            icon.title = "Cacher Fan Zone";
            icon.style.filter = "opacity(1)";
            console.log("[Hide DAZN Fan Zone] Fan Zone réaffichée ✅");
        }
    };

    const addMenuIcon = () => {
        const header = document.querySelector("div.header__header-wrapper___XgdvV");
        if (!header) {
            setTimeout(addMenuIcon, 500);
            return;
        }

        if (document.querySelector("#hideFanZoneIcon")) return;

        const icon = document.createElement("img");
        icon.id = "hideFanZoneIcon";
        icon.src = "https://img.icons8.com/ios-glyphs/ffffff/fan.png"; // icône ventilateur blanche
        icon.title = "Cacher Fan Zone";

        Object.assign(icon.style, {
            width: "30px",
            height: "30px",
            marginLeft: "12px",
            cursor: "pointer",
            background: "transparent",
            borderRadius: "50%",
            verticalAlign: "middle",
            filter: "opacity(1)",
        });

        icon.addEventListener("click", () => toggleFanZone(icon));

        header.appendChild(icon);
        console.log("[Hide DAZN Fan Zone] Icône ajoutée dans le menu ✅");
    };

    const observer = new MutationObserver(addMenuIcon);
    observer.observe(document.body, { childList: true, subtree: true });

    addMenuIcon();
})();
