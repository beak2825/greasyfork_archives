// ==UserScript==
// @name         WritingTeam Achievement Plan Generator
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Writing Plan generator compatible with new grouped achievements.
// @author       PS2Hagrid / Player1041
// @match        https://retroachievements.org/game2/*
// @match        https://retroachievements.org/game/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        GM_xmlhttpRequest
// @connect      script.googleusercontent.com
// @connect      script.google.com
// @downloadURL https://update.greasyfork.org/scripts/543404/WritingTeam%20Achievement%20Plan%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/543404/WritingTeam%20Achievement%20Plan%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hasGeneratedSheet = false;
    let extractedData = null;
    let sheetURL = null;

    // changing this allows you to edit how the sheet title is formatted
    // by default, it is 1, so (Game System) Game Title [Game ID]
    // you can change it to:
    // 1 - Spyro the Dragon (PlayStation) [11279]
    // 2 - (PlayStation) Spyro the Dragon [11279]
    // 3 - Spyro the Dragon [11279] (PlayStation)
    // 4 - [11279] Spyro the Dragon (PlayStation)
    // 5 - [11279] (PlayStation) Spyro the Dragon
    // 6 - (PlayStation) [11279] Spyro the Dragon
    let titleOrder = parseInt(localStorage.getItem("titleOrder") || "1", 10);
    const bannerTarget = document.querySelector(
            "#app > div > main > div > div > div.absolute.inset-x-0.bottom-0.z-20.mx-auto.max-w-screen-xl.px-4.pb-\\[46px\\].transition-\\[padding\\].sm\\:px-5.md\\:px-6.xl\\:px-0 > div > div > div"
    );

    const noBannerTarget = document.querySelector(
            "#app > div > main > article > div > div.flex.flex-col.gap-3 > div.flex.gap-4.sm\\:gap-6 > div > div.hidden.flex-wrap.gap-x-2.gap-y-1.text-neutral-300.light\\:text-neutral-700.sm\\:flex > div"
    );

    let gameTitle = ""
    let gameSystem = ""

    if (bannerTarget) {
        const titleAndSystem = document.querySelector("#app > div > main > div > div > div.absolute.inset-x-0.bottom-0.z-20.mx-auto.max-w-screen-xl.px-4.pb-\\[46px\\].transition-\\[padding\\].sm\\:px-5.md\\:px-6.xl\\:px-0 > div > div")
        gameTitle = titleAndSystem?.querySelector('h1 > span').textContent.trim();
        gameSystem = titleAndSystem?.querySelector('div > a > span').textContent.trim();
    } else {
        const titleAndSystem = document.querySelector("#app > div > main > article > div > div.flex.flex-col.gap-3 > div.flex.gap-4.sm\\:gap-6 > div > div.flex.flex-col.gap-1.sm\\:gap-0\\.5");
        gameTitle = titleAndSystem?.querySelector('h1 > span')?.textContent.trim();
        gameSystem = titleAndSystem?.querySelector('span.flex.items-center > span')?.textContent.trim();
    };

    const gameId = window.location.pathname.split('/').pop();
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbwzQCW8p467nvosPhe9f7WvRpExy3LmmXEaj-yorqc80sUhFmOYcbmjR-OOlVGdUB9AaQ/exec';

    function extractData() {
        const achievements = [];
        let totalCheevos = 0;
        let headerCount = 0

        const cheevoContainer = document.querySelector(
            "#game-achievement-sets-container > div > div.relative"
        );

        const groups = cheevoContainer.querySelectorAll("ul");
        console.log(groups.length);

        if (groups.length > 1) {
            // group list
            const groupLis = document.querySelectorAll(
                "#game-achievement-sets-container > div > div.relative > ul > li"
            );

            groupLis.forEach(groupLi => {
                //  group title
                const groupSpan = groupLi.querySelector("button > span");
                let groupTitle = '';
                if (groupSpan) {
                    const text = groupSpan.textContent.trim();
                    const match = text.match(/^(.*?)(\s*\(\d+\s+achievements?\))$/);
                    groupTitle = match ? match[1].trim() : text;
                }

                // add group title
                achievements.push({
                    title: groupTitle,
                    description: '',
                    link: '',
                    id: ''
                });

                // achievements
                const achLis = groupLi.querySelectorAll("li.game-set-item");
                achLis.forEach(li => {
                    const linkEl = li.querySelector(
                        "div.grid div.md\\:col-span-4 span.mr-2 > a[href*='/achievement/']"
                    );
                    const descEl = li.querySelector(
                        "div.grid div.md\\:col-span-4 > p"
                    );
                    if (!linkEl || !descEl) return;

                    const id = linkEl.href.split("/").pop();

                    achievements.push({
                        title: linkEl.textContent.trim(),
                        description: descEl.textContent.trim(),
                        link: linkEl.href,
                        id
                    });
                });

                // spacer row
                achievements.push({
                    title: '---',
                    description: '---',
                    link: '---',
                    id: '---'
                });
            });

        } else {
            // no groups
            const titleAndID = document.querySelector("#app > div > main > article > div > div.flex.flex-col.gap-3 > div.flex.gap-4.sm\\:gap-6 > div > div.flex.flex-col.gap-1.sm\\:gap-0\\.5");
            const gameTitle = titleAndID?.querySelector('h1 > span')?.textContent.trim();
            const gameSystem = titleAndID?.querySelector('span.flex.items-center > span')?.textContent.trim();
            const gameId = window.location.pathname.split('/').pop();

            const listItems = document.querySelectorAll("#game-achievement-sets-container > div > div.relative > ul > li");

            listItems.forEach(li => {
                const linkElement = li.querySelector("div.grid.w-full.gap-x-5.gap-y-1\\.5.leading-4.md\\:grid-cols-6 > div.md\\:col-span-4 > div.mb-0\\.5.flex.justify-between.gap-x-2 > div.-mt-1.mb-0\\.5.md\\:mt-0 > span.mr-2 > a");
                const descElement = li.querySelector("div.grid.w-full.gap-x-5.gap-y-1\\.5.leading-4.md\\:grid-cols-6 > div.md\\:col-span-4 > p");

                if (linkElement && descElement) {
                    const title = linkElement.textContent.trim();
                    const link = linkElement.href;
                    const description = descElement.textContent.trim();
                    const id = link.split('/').pop();
                    totalCheevos++;

                    achievements.push({ title, description, link, id });
                }
            });
        }

        console.log({
            gameTitle,
            gameId,
            gameSystem,
            achievements,
            titleOrder,
        });

        return {
            gameTitle,
            gameId,
            gameSystem,
            achievements,
            titleOrder,
        };
    }
    function insertButton() {


        const targetDiv = bannerTarget ?? noBannerTarget;

        // Create button
        const button = document.createElement("button");
        button.id = "writing-generator";
        button.className = "btn-base btn-base--default btn-base--size-sm flex items-center gap-1.5 rounded-full !py-0 !text-xs";
        button.type = "button";
        button.setAttribute("aria-haspopup", "dialog");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "radix-r3");
        button.setAttribute("data-state", "closed");

        // SVG icon
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");

        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("lucide", "lucide-pen-line-icon", "lucide-pen-line");

        const path1 = document.createElementNS(svgNS, "path");
        path1.setAttribute("d", "M13 21h8");

        const path2 = document.createElementNS(svgNS, "path");
        path2.setAttribute("d", "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z");

        svg.appendChild(path1);
        svg.appendChild(path2);

        // Text span
        const label = document.createElement("span");
        label.className = "button-label";
        label.textContent = "Generate Writing Sheet";

        // Assemble
        button.appendChild(svg);
        button.appendChild(label);

        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.style.position = "relative";
        dropdownWrapper.style.display = "inline-block";

        // Create dropdown button
        const dropdownButton = document.createElement("button");
        dropdownButton.className = "btn-base btn-base--default btn-base--size-sm gap-1 transition-none lg:active:translate-y-0 lg:active:scale-100 w-full sm:w-auto";
        dropdownButton.type = "button";
        const savedTitleOrder = parseInt(localStorage.getItem("titleOrder") || "1", 10);
        dropdownButton.innerHTML = `
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
        stroke-linecap="round" stroke-linejoin="round"
        class="size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="m5 12 7-7 7 7"></path>
        <path d="M12 19V5"></path>
    </svg>
    Format: ${savedTitleOrder}
`;

        // Create dropdown menu
        const dropdownMenu = document.createElement("ul");
        dropdownMenu.style.position = "absolute";
        dropdownMenu.style.top = "100%";
        dropdownMenu.style.left = "0";
        dropdownMenu.style.zIndex = "1000";
        dropdownMenu.style.backgroundColor = "#0a0a0a";
        dropdownMenu.style.border = "1px solid #ccc";
        dropdownMenu.style.padding = "5px";
        dropdownMenu.style.display = "none";
        dropdownMenu.style.listStyle = "none";
        dropdownMenu.style.borderRadius = "6px";
        dropdownMenu.style.minWidth = "200px";
        dropdownMenu.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.2)";
        dropdownMenu.style.fontSize = "0.875rem";

        // Define title options
        const titleOptions = [
            `${gameTitle} (${gameSystem}) [${gameId}]`,
            `(${gameSystem}) ${gameTitle} [${gameId}]`,
            `${gameTitle} [${gameId}] (${gameSystem})`,
            `[${gameId}] ${gameTitle} (${gameSystem})`,
            `[${gameId}] (${gameSystem}) ${gameTitle}`,
            `(${gameSystem}) [${gameId}] ${gameTitle}`
        ];

        // Add menu items
        titleOptions.forEach((text, index) => {
            const li = document.createElement("li");
            li.textContent = text;
            li.style.padding = "5px 10px";
            li.style.cursor = "pointer";

            li.addEventListener("click", () => {
                localStorage.setItem("titleOrder", index + 1);
                dropdownButton.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                    stroke-linecap="round" stroke-linejoin="round"
                    class="size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="m5 12 7-7 7 7"></path>
                    <path d="M12 19V5"></path>
                </svg>Format: ${index + 1}`;
                dropdownMenu.style.display = "none";
            });
            li.addEventListener("mouseover", function () {
                this.style.backgroundColor = "#1a1a1a";
            });
            li.addEventListener("mouseout", function () {
                this.style.backgroundColor = "#0a0a0a";
            });

            dropdownMenu.appendChild(li);
        });

        // Show/hide menu on button click
        dropdownButton.addEventListener("click", () => {
            dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        });

        // Append dropdown
        dropdownWrapper.appendChild(dropdownButton);
        dropdownWrapper.appendChild(dropdownMenu);

        targetDiv.appendChild(button);
        targetDiv.appendChild(dropdownWrapper);


        // Click handler
        button.addEventListener("click", () => {
            if (!hasGeneratedSheet) {
                label.textContent = "Gathering Data...";
                const data = extractData();

                label.textContent = "Uploading Data...";
                GM_xmlhttpRequest({
                    method: "POST",
                    url: appsScriptUrl,
                    data: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function (response) {
                        sheetURL = response.responseText.trim();
                        console.log("✅ Sheet Created:", sheetURL);
                        label.textContent = "Open Writing Plan";
                        hasGeneratedSheet = true;
                    },
                    onerror: function (error) {
                        console.error("❌ Error sending data:", error);
                        label.textContent = "Error: check console and send to PS2Hagrid";
                    }
                });
            } else if (sheetURL) {
                window.open(sheetURL, "_blank");
            }
        });
    }

    // Wait for load to allow elements to render
    window.addEventListener('load', () => {
        setTimeout(() => {
            insertButton();
        }, 1000);
    });

    console.log("✅ Userscript is running");
})();