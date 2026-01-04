// ==UserScript==
// @name         Steam - YAR Links
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Just doing a thing
// @author       You
// @match        *://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525606/Steam%20-%20YAR%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/525606/Steam%20-%20YAR%20Links.meta.js
// ==/UserScript==

(function() {

    let debug = 0;

    'use strict';
        // Define YAR links
        const searchLinks = [
            { name: "Fit", url: "https://fitgirl-repacks.site/?s=INSERT" },
            { name: "Skid", url: "https://www.skidrowreloaded.com/?s=INSERT" },
            { name: "IGG", url: "https://igg-games.com/?s=INSERT" },
            { name: "CS", url: "https://cs.rin.ru/forum/search.php?keywords=INSERT&terms=all&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search" },
            { name: "OF", url: "https://online-fix.me/index.php?do=search&subaction=search&story=INSERT" },
            { name: "G3rd", url: "https://game3rb.com/?s=INSERT" },
            { name: "F-tp", url: "https://freetp.org/?do=search&subaction=search&story=INSERT" },
        ];


    // Wait for the page to load
    //if (debug === 1) { console.log("%c[YAR]%c Waiting for page to load...", "color: #39ff14; font-weight: bold;", "color: inherit;");}
    //window.addEventListener('load', function() {
        if (debug === 1) { console.log("%c[YAR]%c Script loaded", "color: #39ff14; font-weight: bold;", "color: inherit;");}

        // Get the game title
        let appNameElement = document.getElementById("appHubAppName").textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("’", "'").replace(/[^a-z _0-9`~!@#$%^&*()_=+|\\\]}[{;:',<.>/?]/gi, '');
        if (!appNameElement) {
            if (debug === 1) { console.warn("%c[YAR]%c Could not find #appHubAppName", "color: #39ff14; font-weight: bold;", "color: inherit;");}
            return;
        }

        let appName = appNameElement.trim();
        if (!appName) {
            if (debug === 1) { console.warn("%c[YAR]%c Game title is empty", "color: #39ff14; font-weight: bold;", "color: inherit;");}
            return;
        }

        if (debug === 1) { console.log(`%c[YAR]%c Found game title: ${appName}`, "color: #39ff14; font-weight: bold;", "color: inherit;");}

        // Find the target div
        let targetDiv = document.querySelector(".page_title_area.game_title_area.page_content");
        if (!targetDiv) {
            if (debug === 1) { console.warn("%c[YAR]%c Could not find target div .page_title_area.game_title_area.page_content", "color: #39ff14; font-weight: bold;", "color: inherit;");}
            return;
        }

        if (debug === 1) { console.log("%c[YAR]%c Found target div, injecting links...", "color: #39ff14; font-weight: bold;", "color: inherit;");}

        // Create and insert search links dynamically
        searchLinks.forEach(link => {
            let anchor = document.createElement("a");
            anchor.href = link.url.replace("INSERT", encodeURIComponent(appName));
            anchor.target = "_blank";
            anchor.className = "btnv6_blue_hoverfade btn_small";
            anchor.style.float = "right";
            anchor.style.marginLeft = "5px";
            anchor.innerHTML = `<span>${link.name}</span>`;
            targetDiv.insertBefore(anchor, targetDiv.firstChild);
            if (debug === 1) { console.log(`%c[YAR]%c Inserted link: ${link.name} -> ${anchor.href}`, "color: #39ff14; font-weight: bold;", "color: inherit;");}
        });
    //});
})();
