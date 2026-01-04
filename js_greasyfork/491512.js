// ==UserScript==
// @name         BlurrpyScript
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Quickly navigate without needing to go back to outpost! (https://greasyfork.org/en/scripts/491512-blurrpyscript)
// @author       Blurrpy
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        *fairview.deadfrontier.com/onlinezombiemmo/
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/491512/BlurrpyScript.user.js
// @updateURL https://update.greasyfork.org/scripts/491512/BlurrpyScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var navButtonData = {
        arcade      : { title: "Arcade", page: 0 },
        bank        : { title: "Bank", page: 15 },
        clanhq      : { title: "Clan HQ", page: 56 },
        crafting    : { title: "Crafting", page: 59 },
        fasttravel  : { title: "Fast Travel", page: 61 },
        gamblingden : { title: "Gambling Den", page: 49 },
        marketplace : { title: "Marketplace", page: 35 },
        records     : { title: "Records", page: 22 },
        storage     : { title: "Storage", page: 50 },
        vendor      : { title: "Vendor", page: 84 },
        yard        : { title: "The Yard", page: 24 },
    };

    function createQuickNavigationButton(container, buttonTitle, url) {
        let button = document.createElement("button");
        button.textContent = buttonTitle;
        button.id = buttonTitle;
        button.style.height = "max-content";
        button.addEventListener("click", function() {
            window.location.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=" + url;
        });

        container.appendChild(button);
    }

    function addQuickNavigation() {
        let menu = document.body;
        let cluster = document.createElement("div");
        cluster.id = "blurrpyQuickNavigation";
        cluster.style.display = "grid";
        cluster.style.rowGap = "5px";
        cluster.style.position = "fixed";
        cluster.style.top = "18px";
        cluster.style.left = "2px";
        cluster.style.zIndex = "20";

        for (const [key, value] of Object.entries(navButtonData)) {
            let container = document.createElement("div");
            container.style.height = "max-content";
            container.style.width = "max-content";
            container.style.minWidth = "41px";
            container.style.padding = "5px";
            container.style.border = "2px solid rgb(100, 0, 0)";
            container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            container.style.backdropFilter = "blur(5px)";

            let button = document.createElement("button");
            button.textContent = value.title;
            button.id = value.title;
            button.style.height = "max-content";

            button.addEventListener("click", function(event) {
                window.location.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=" + value.page;
            });

            button.addEventListener("mousedown", function(event) {
                if (event.button === 1) { // Middle mouse button
                    window.open("https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=" + value.page, "_blank");
                    event.preventDefault(); // Prevent any default behavior
                }
            });

            container.appendChild(button);
            cluster.appendChild(container);
        }

        menu.appendChild(cluster);
    }

     async function startScript(){
        if(window.location.href.includes("page=21")) {
           return;
        }

        addQuickNavigation();
    }

    // Give enough time to the vanilla js to complete initialisation.
    setTimeout(async function(){ await startScript(); }, 500);
})();
