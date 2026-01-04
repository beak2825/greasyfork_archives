// ==UserScript==
// @name        TravianHelper(Travian Legends++)
// @namespace   https://greasyfork.org/
// @author      bingkx & SkillsBoY
// @version     0.1.0
// @license     GPLv3
// @description Villages, Troops, Resources Overview, Quick links. Based on Travian Legends++.
// @include     *://*.travian.*
// @include     *://*/*.travian.*
// @exclude     *://*.travian*.*/hilfe.php*
// @exclude     *://*.travian*.*/log*.php*
// @exclude     *://*.travian*.*/index.php*
// @exclude     *://*.travian*.*/anleitung.php*
// @exclude     *://*.travian*.*/impressum.php*
// @exclude     *://*.travian*.*/anmelden.php*
// @exclude     *://*.travian*.*/gutscheine.php*
// @exclude     *://*.travian*.*/spielregeln.php*
// @exclude     *://*.travian*.*/links.php*
// @exclude     *://*.travian*.*/geschichte.php*
// @exclude     *://*.travian*.*/tutorial.php*
// @exclude     *://*.travian*.*/manual.php*
// @exclude     *://*.travian*.*/ajax.php*
// @exclude     *://*.travian*.*/ad/*
// @exclude     *://*.travian*.*/chat/*
// @exclude     *://forum.travian*.*
// @exclude     *://board.travian*.*
// @exclude     *://shop.travian*.*
// @exclude     *://*.travian*.*/activate.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @exclude     *://*.answers.travian*.*
// @exclude     *.css
// @exclude     *.js
// @grant       GM_addStyle
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/463332/TravianHelper%28Travian%20Legends%2B%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463332/TravianHelper%28Travian%20Legends%2B%2B%29.meta.js
// ==/UserScript==

const myVersion = GM_info.script.version;


// inject css
{
    GM_addStyle(`
        .us-draggable {
            position: absolute;
            z-index: 9;
            background-color: #f1f1f1;
            border: 1px solid #d3d3d3;
            text-align: center !important;
            white-space: nowrap;
        }

        .us-draggable .us-draggable--header {
            padding: 10px;
            cursor: move;
            z-index: 10;
            background-color: #2196f3;
            color: #fff;
        }

        .us-draggable li {
            text-align: left;
        }

        .us-draggable ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0 5px;
            padding: 0 0 0 16px;
        }

        .us-draggable td > a {
            display: block;
            padding: 14px;
        }

        .us-draggable td {
            padding: unset;
        }

        .us-draggable li.done {
            background-color: green;
        }

        .us-barBox {
            width: 50px;
            height: 7px;
            background-color: #52372a;
            margin: 0 2px;
        }

        .us-resources {
            display: flex;
            flex-direction: row;
            margin: 5px;
        }

        .us-bar {
            background-color: #699e32;
            height: 100%;
        }

        .us-resourceValue {
            font-size: 11px;
            font-weight: 700;
            text-align: end;
            margin-right: 2px;
        }

        .us--text-alert {
            color: #0022af;
        }

        .us-map-open {
            position: fixed !important;
            inset: 0 !important;
            width: unset !important;
            height: unset !important;
        }

        .us-alertFill--yellow {
            fill: yellow;    
        }
    
        .us--display-block {
            display: block !important;
        }

        .us-settingsIconSVG > svg:hover {
            fill: whitesmoke;
        }
    `);
}

// travian utilities
{
    /**
     * Makes the building icons on the right over the villages available.
     * (same functionality as travian plus *and more)
     */
    function makeBuildingIconsAvailable() {
        // marketplace
        {
            const marketIcon = document.querySelector("#sidebarBoxActiveVillage > div.header > div").childNodes[1];
            const marketIconClone = marketIcon.cloneNode(true);
            marketIconClone.classList.remove("gold");
            marketIconClone.classList.add("green");
            marketIconClone.removeAttribute("onClick");
            marketIconClone.title = "Marketplace||";
            marketIconClone.classList.contains("disabled") ? marketIconClone.href = "#" : marketIconClone.href = "/build.php?gid=17";
            marketIcon.replaceWith(marketIconClone);
        }

        // barracks
        {
            const barracksIcon = document.querySelector("#sidebarBoxActiveVillage > div.header > div").childNodes[5];
            const barracksIconClone = barracksIcon.cloneNode(true);
            barracksIconClone.classList.remove("gold");
            barracksIconClone.classList.add("green");
            barracksIconClone.removeAttribute("onClick");
            barracksIconClone.title = "Barracks||";
            barracksIconClone.classList.contains("disabled") ? barracksIconClone.href = "#" : barracksIconClone.href = "/build.php?gid=19";
            barracksIcon.replaceWith(barracksIconClone);
        }

        // stable
        {
            const stableIcon = document.querySelector("#sidebarBoxActiveVillage > div.header > div").childNodes[9];
            const stableIconClone = stableIcon.cloneNode(true);
            stableIconClone.classList.remove("gold");
            stableIconClone.classList.add("green");
            stableIconClone.removeAttribute("onClick");
            stableIconClone.title = "Stable||";
            stableIconClone.classList.contains("disabled") ? stableIconClone.href = "#" : stableIconClone.href = "/build.php?gid=20";
            stableIcon.replaceWith(stableIconClone);
        }

        // workshop
        {
            const workshopIcon = document.querySelector("#sidebarBoxActiveVillage > div.header > div").childNodes[13];
            const workshopIconClone = workshopIcon.cloneNode(true);
            workshopIconClone.classList.remove("gold");
            workshopIconClone.classList.add("green");
            workshopIconClone.removeAttribute("onClick");
            workshopIconClone.title = "Workshop||";
            workshopIconClone.classList.contains("disabled") ? workshopIconClone.href = "#" : workshopIconClone.href = "/build.php?gid=21";
            workshopIcon.replaceWith(workshopIconClone);
        }

        const villageList = document.querySelector("#sidebarBoxVillagelist > div.header > div");
        const villageStatistics = document.querySelector("#sidebarBoxVillagelist > div.header > div").childNodes[1];

        // rally point
        {
            const villageStatisticsClone = villageStatistics.cloneNode(true);
            const villageStatisticsCloneSVG = villageStatisticsClone.querySelector("svg");
            const img = document.createElement("img");
            img.src = "data:image/png;base64,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";
            img.style = "position: absolute; z-index: 3; height: 37px;";
            villageStatisticsCloneSVG.replaceWith(img);
            villageStatisticsClone.classList.remove("gold");
            villageStatisticsClone.classList.add("green");
            villageStatisticsClone.removeAttribute("onClick");
            villageStatisticsClone.removeAttribute("id");
            villageStatisticsClone.title = "Rally Point||";
            villageStatisticsClone.href = "/build.php?id=39&gid=16";
            villageList.insertBefore(villageStatisticsClone, villageStatistics);
        }

        // academy
        {
            const villageStatisticsClone = villageStatistics.cloneNode(true);
            const villageStatisticsCloneSVG = villageStatisticsClone.querySelector("svg");
            const img = document.createElement("img");
            img.src = "data:image/png;base64,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";
            img.style = "position: absolute; z-index: 3; height: 37px;";
            villageStatisticsCloneSVG.replaceWith(img);
            villageStatisticsClone.classList.remove("gold");
            villageStatisticsClone.classList.add("green");
            villageStatisticsClone.removeAttribute("onClick");
            villageStatisticsClone.removeAttribute("id");
            villageStatisticsClone.title = "Academy||";
            villageStatisticsClone.href = "/build.php?gid=22";
            villageList.insertBefore(villageStatisticsClone, villageStatistics);
        }

        // smithy
        {
            const villageStatisticsClone = villageStatistics.cloneNode(true);
            const villageStatisticsCloneSVG = villageStatisticsClone.querySelector("svg");
            const img = document.createElement("img");
            img.src = "data:image/png;base64,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";
            img.style = "position: absolute; z-index: 3; height: 37px;";
            villageStatisticsCloneSVG.replaceWith(img);
            villageStatisticsClone.classList.remove("gold");
            villageStatisticsClone.classList.add("green");
            villageStatisticsClone.removeAttribute("onClick");
            villageStatisticsClone.removeAttribute("id");
            villageStatisticsClone.title = "Smithy||";
            villageStatisticsClone.href = "/build.php?gid=13";
            villageList.insertBefore(villageStatisticsClone, villageStatistics);
        }

        // town hall
        {
            const villageStatisticsClone = villageStatistics.cloneNode(true);
            const villageStatisticsCloneSVG = villageStatisticsClone.querySelector("svg");
            const img = document.createElement("img");
            img.src = "data:image/png;base64,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";
            img.style = "position: absolute; z-index: 3; height: 37px;";
            villageStatisticsCloneSVG.replaceWith(img);
            villageStatisticsClone.classList.remove("gold");
            villageStatisticsClone.classList.add("green");
            villageStatisticsClone.removeAttribute("onClick");
            villageStatisticsClone.removeAttribute("id");
            villageStatisticsClone.title = "Town Hall||";
            villageStatisticsClone.href = "/build.php?gid=24";
            villageList.insertBefore(villageStatisticsClone, villageStatistics);
        }

    }

    /**
     * On coordinates click, this will fill in the village destination fields.
     * (same functionality as travian plus)
     */
    function coordsClickFillVillageDestinationFields() {
        document.querySelector("#sidebarBoxVillagelist > div.content > div.villageList").classList.add("shortcutsEnabled");

        const notActiveVillageList = document.querySelectorAll("#sidebarBoxVillagelist > div.content > div.villageList > div.dropContainer > div.listEntry:not(.active)");

        notActiveVillageList.forEach((village) => {
            village.querySelector(".coordinatesGrid").onclick = function () {
                const villageNameInput = document.querySelector("#enterVillageName");
                const xCoordInput = document.querySelector("#xCoordInput");
                const yCoordInput = document.querySelector("#yCoordInput");

                const name = village.querySelector(".name").textContent;
                let coordinateX = village.querySelector(".coordinateX").textContent;
                let coordinateY = village.querySelector(".coordinateY").textContent;

                coordinateX = parseInt(coordinateX.match(/[−\d]+/g).join("").replace("−", "-"));
                coordinateY = parseInt(coordinateY.match(/[−\d]+/g).join("").replace("−", "-"));

                villageNameInput.value = name;
                xCoordInput.value = coordinateX;
                yCoordInput.value = coordinateY;
            };
        });
    }

    /**
     * Parse active village building list.
     */
    function getBuildingList() {
        const buildingList = document.querySelector("#contentOuterContainer > div div.buildingList");
        if (!buildingList) return [];

        // for each list item parse name, lvl, build duration and timer (.name)(.lvl)(.buildDuration)(.timer)
        const buildingListLI = buildingList.querySelectorAll("li");

        const parsedBuildingList = [...buildingListLI].map(buildingItem => {
            const name = buildingItem.querySelector(".name").childNodes[0].textContent.trim();
            const lvl = buildingItem.querySelector(".lvl").textContent;
            const timestamp = Math.floor(Date.now() / 1000);
            const buildDuration = parseInt(buildingItem.querySelector(".buildDuration > .timer").getAttribute("value"));
            const timestampEnd = timestamp + buildDuration;

            return {
                name,
                lvl,
                buildDuration,
                timestampEnd
            };
        });

        return parsedBuildingList;
    }

    /**
     * Parse active village id and name.
     */
    function getActiveVillage() {
        const activeVillage = document.querySelector("#sidebarBoxVillagelist > div.content > div.villageList .listEntry.active");
        const id = activeVillage.dataset.did;
        const name = activeVillage.querySelector(".name").textContent;

        return {
            id,
            name
        };
    }

    /**
     * Parse active village storage capacity.
     */
    function getStorage() {
        return {
            warehouse: parseInt(document.querySelector("#stockBar > div.warehouse > div > div").textContent.replace(/[^\x00-\x7F]|,/g, "")),
            granary: parseInt(document.querySelector("#stockBar > div.granary > div > div").textContent.replace(/[^\x00-\x7F]|,/g, ""))
        };
    }

    /**
     * Parse active village available resources.
     */
    function getResources() {
        return {
            lumber: resources.storage.l1,
            clay: resources.storage.l2,
            iron: resources.storage.l3,
            crop: resources.storage.l4
        };
    }

    /**
     * Parse active village hourly resource production.
     */
    function getHourlyProduction() {
        // const lumberTitle = document.querySelector("#stockBar > div.warehouse > a:nth-child(2)").title;
        // const clayTitle = document.querySelector("#stockBar > div.warehouse > a:nth-child(3)").title;
        // const ironTitle = document.querySelector("#stockBar > div.warehouse > a:nth-child(4)").title;

        // const cropTitle = document.querySelector("#stockBar > div.granary > a:nth-child(3)").title;
        // const cropTemp = cropTitle.substring(cropTitle.indexOf(":") + 2, cropTitle.indexOf("<"));
        // const spanTemp = document.createElement("span");
        // spanTemp.innerHTML = cropTemp;

        return {
            lumber: resources.production.l1,
            clay: resources.production.l2,
            iron: resources.production.l3,
            crop: resources.production.l4
        };
    }

    /**
     * Parse village list.
     */
    function getVillageList() {
        const villageList = document.querySelectorAll("#sidebarBoxVillagelist > div.content > div.villageList > div.dropContainer");

        return [...villageList].map(village => {
            const index = village.dataset.sortindex; // starts at 1
            const id = village.querySelector(".listEntry").dataset.did;
            const href = village.querySelector(".listEntry a").getAttribute("href");
            const name = village.querySelector(".listEntry .name").textContent;

            return {
                index,
                id,
                href,
                name
            };
        });
    }

    /**
     * Parse barracks training list.
     */
    function getBarracksTrainingList() {
        const training = document.querySelectorAll("#build > table > tbody > tr:not(.next)");
        if (!training) return [];

        return [...training].map(unit => {
            // const unitIcon = unit.querySelector(".desc>.unit").outerHTML;
            const name = unit.querySelector(".desc").childNodes[2].textContent.replace(/\s+/g, " ").trim();
            const fin = unit.querySelector(".fin>span").textContent;
            const timestamp = Math.floor(Date.now() / 1000);
            const dur = parseInt(unit.querySelector(".dur>.timer").getAttribute("value"));
            const timestampEnd = timestamp + dur;

            return {
                // unitIcon,
                name,
                timestampEnd,
                fin
            };
        });
    }

    /**
     * Parse stable training list. 
     */
    function getStableTrainingList() {
        const training = document.querySelectorAll("#build > table > tbody > tr:not(.next)");
        if (!training) return [];

        return [...training].map(unit => {
            // const unitIcon = unit.querySelector(".desc>.unit").outerHTML;
            const name = unit.querySelector(".desc").childNodes[2].textContent.replace(/\s+/g, " ").trim();
            const fin = unit.querySelector(".fin>span").textContent;
            const timestamp = Math.floor(Date.now() / 1000);
            const dur = parseInt(unit.querySelector(".dur>.timer").getAttribute("value"));
            const timestampEnd = timestamp + dur;

            return {
                // unitIcon,
                name,
                timestampEnd,
                fin
            };
        });
    }

    /**
     * // TODO not tested
     * Parse workshop training list. 
     */
    function getWorkshopTrainingList() {
        const training = document.querySelectorAll("#build > table > tbody > tr:not(.next)");
        if (!training) return [];

        return [...training].map(unit => {
            // const unitIcon = unit.querySelector(".desc>.unit").outerHTML;
            const name = unit.querySelector(".desc").childNodes[2].textContent.replace(/\s+/g, " ").trim();
            const fin = unit.querySelector(".fin>span").textContent;
            const timestamp = Math.floor(Date.now() / 1000);
            const dur = parseInt(unit.querySelector(".dur>.timer").getAttribute("value"));
            const timestampEnd = timestamp + dur;

            return {
                // unitIcon,
                name,
                timestampEnd,
                fin
            };
        });
    }

    /**
     * Parse player name
     */
    function getPlayerName() {
        return document.querySelector("#sidebarBoxActiveVillage > div.content > div.playerName").textContent;
    }

    /**
     * Get building list from localStorage.
     */
    function getLocalStorage_buildingList(playerName, villageList) {
        let localStorage_buildingList = localStorage[`us_${playerName}_buildingList`];

        if (localStorage_buildingList === undefined) {
            const temp = {};

            for (const village of villageList) {
                temp[village.id] = [];
            }

            localStorage_buildingList = temp;
            localStorage[`us_${playerName}_buildingList`] = JSON.stringify(temp);
        } else {
            localStorage_buildingList = JSON.parse(localStorage_buildingList);

            villageList.forEach(village => {
                if (localStorage_buildingList[village.id] === undefined) localStorage_buildingList[village.id] = [];
            });

            localStorage[`us_${playerName}_buildingList`] = JSON.stringify(localStorage_buildingList);
        }

        return localStorage_buildingList;
    }

    /**
     * Set building list to localStorage.
     */
    function setLocalStorage_buildingList(playerName, activeVillageID, localStorage_buildingList, buildingList) {
        localStorage_buildingList[activeVillageID] = buildingList;
        localStorage[`us_${playerName}_buildingList`] = JSON.stringify(localStorage_buildingList);
    }

    /**
     * Get barracks training list from localStorage.
     */
    function getLocalStorage_barracksTrainingList(playerName, villageList) {
        let localStorage_barracksTrainingList = localStorage[`us_${playerName}_barracksTrainingList`];

        if (localStorage_barracksTrainingList === undefined) {
            const temp = {};

            for (const village of villageList) {
                temp[village.id] = [];
            }

            localStorage_barracksTrainingList = temp;
            localStorage[`us_${playerName}_barracksTrainingList`] = JSON.stringify(temp);
        } else {
            localStorage_barracksTrainingList = JSON.parse(localStorage_barracksTrainingList);

            villageList.forEach(village => {
                if (localStorage_barracksTrainingList[village.id] === undefined) localStorage_barracksTrainingList[village.id] = [];
            });

            localStorage[`us_${playerName}_barracksTrainingList`] = JSON.stringify(localStorage_barracksTrainingList);
        }

        return localStorage_barracksTrainingList;
    }

    /**
     * Set barracks training list to localStorage.
     */
    function setLocalStorage_barracksTrainingList(playerName, activeVillageID, localStorage_barracksTrainingList, barracksTrainingList) {
        localStorage_barracksTrainingList[activeVillageID] = barracksTrainingList;
        localStorage[`us_${playerName}_barracksTrainingList`] = JSON.stringify(localStorage_barracksTrainingList);
    }

    /**
     * Get stable training list from localStorage.
     */
    function getLocalStorage_stableTrainingList(playerName, villageList) {
        let localStorage_stableTrainingList = localStorage[`us_${playerName}_stableTrainingList`];

        if (localStorage_stableTrainingList === undefined) {
            const temp = {};

            for (const village of villageList) {
                temp[village.id] = [];
            }

            localStorage_stableTrainingList = temp;
            localStorage[`us_${playerName}_stableTrainingList`] = JSON.stringify(temp);
        } else {
            localStorage_stableTrainingList = JSON.parse(localStorage_stableTrainingList);

            villageList.forEach(village => {
                if (localStorage_stableTrainingList[village.id] === undefined) localStorage_stableTrainingList[village.id] = [];
            });

            localStorage[`us_${playerName}_stableTrainingList`] = JSON.stringify(localStorage_stableTrainingList);
        }

        return localStorage_stableTrainingList;
    }

    /**
     * Set stable training list to localStorage.
     */
    function setLocalStorage_stableTrainingList(playerName, activeVillageID, localStorage_stableTrainingList, stableTrainingList) {
        localStorage_stableTrainingList[activeVillageID] = stableTrainingList;
        localStorage[`us_${playerName}_stableTrainingList`] = JSON.stringify(localStorage_stableTrainingList);
    }

    /**
     * // TODO not tested
     * Get workshop training list from localStorage.
     */
    function getLocalStorage_workshopTrainingList(playerName, villageList) {
        let localStorage_workshopTrainingList = localStorage[`us_${playerName}_workshopTrainingList`];

        if (localStorage_workshopTrainingList === undefined) {
            const temp = {};

            for (const village of villageList) {
                temp[village.id] = [];
            }

            localStorage_workshopTrainingList = temp;
            localStorage[`us_${playerName}_workshopTrainingList`] = JSON.stringify(temp);
        } else {
            localStorage_workshopTrainingList = JSON.parse(localStorage_workshopTrainingList);

            villageList.forEach(village => {
                if (localStorage_workshopTrainingList[village.id] === undefined) localStorage_workshopTrainingList[village.id] = [];
            });

            localStorage[`us_${playerName}_workshopTrainingList`] = JSON.stringify(localStorage_workshopTrainingList);
        }

        return localStorage_workshopTrainingList;
    }

    /**
     * // TODO not tested
     * Set workshop training list to localStorage.
     */
    function setLocalStorage_workshopTrainingList(playerName, activeVillageID, localStorage_workshopTrainingList, workshopTrainingList) {
        localStorage_workshopTrainingList[activeVillageID] = workshopTrainingList;
        localStorage[`us_${playerName}_workshopTrainingList`] = JSON.stringify(localStorage_workshopTrainingList);
    }

    /**
     * Get resources from localStorage.
     */
    function getLocalStorage_resources(playerName, villageList) {
        const localstorageProp = `us_${playerName}_resources`;
        let localstorage = localStorage[localstorageProp];

        if (localstorage === undefined) {
            const temp = {};

            for (const village of villageList) {
                temp[village.id] = [];
            }

            localstorage = temp;
            localStorage[localstorageProp] = JSON.stringify(temp);
        } else {
            localstorage = JSON.parse(localstorage);

            villageList.forEach(village => {
                if (localstorage[village.id] === undefined) localstorage[village.id] = [];
            });

            localStorage[localstorageProp] = JSON.stringify(localstorage);
        }

        return localstorage;
    }

    /**
     * Set resources to localStorage.
     */
    function setLocalStorage_resources(playerName, activeVillageID, localstorage, data) {
        const localstorageProp = `us_${playerName}_resources`;
        localstorage[activeVillageID] = data;
        localStorage[localstorageProp] = JSON.stringify(localstorage);
    }

    /**
     * Create a draggable element that contains the Village Overview.
     */
    function createVillageOverviewHTML() {
        const playerName = getPlayerName();
        const villageList = getVillageList();
        const activeVillage = getActiveVillage();

        // get draggable element coordinates
        let localStorage_villageOverview_coords = localStorage[`us_${playerName}_villageOverview_coords`];
        if (localStorage_villageOverview_coords === undefined) {
            localStorage_villageOverview_coords = [0, 0]; // top left
            localStorage[`us_${playerName}_villageOverview_coords`] = JSON.stringify(localStorage_villageOverview_coords);
        } else {
            localStorage_villageOverview_coords = JSON.parse(localStorage_villageOverview_coords);
        }

        const localStorage_buildingList = getLocalStorage_buildingList(playerName, villageList);
        const localStorage_barracksTrainingList = getLocalStorage_barracksTrainingList(playerName, villageList);
        const localStorage_stableTrainingList = getLocalStorage_stableTrainingList(playerName, villageList);
        const localStorage_workshopTrainingList = getLocalStorage_workshopTrainingList(playerName, villageList);

        const barracksPNG = "data:image/png;base64,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";
        const stablePNG = "data:image/png;base64,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";
        const workshopPNG = "data:image/png;base64,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";

        const tableRowsHTML = villageList.map(village => {
            const buildingListHTML = localStorage_buildingList[village.id].map(building => {
                const timestamp = Math.floor(Date.now() / 1000);
                const timerValue = building.timestampEnd - timestamp;
                const isDone = timerValue < 0;

                const timerHTML = isDone ? `<span style="width:50px; display:inline-block;">DONE</span>` : `<span style="width:50px; display:inline-block;" class="timer" counting="down" value="${timerValue}"></span>`;

                return `<li ${isDone ? 'class="done"' : ""}>
                            <span>${building.name}</span>
                            ${timerHTML}
                        </li>`;
            }).join("");

            let barracksImageHTML = "";
            if (localStorage_barracksTrainingList[village.id].length > 0) {
                const img = document.createElement("img");
                img.src = barracksPNG;
                img.width = "45";
                img.title = localStorage_barracksTrainingList[village.id].map(troop => {
                    const timestamp = parseInt(Math.floor(Date.now() / 1000));
                    const timerValue = troop.timestampEnd - timestamp;
                    const isDone = timerValue < 0;

                    if (isDone) return "";
                    return `${troop.name} | ${new Date(timerValue * 1000).toISOString().slice(11, 19)} | ${troop.fin}<br>`;
                }).join("");

                if (img.title !== "") {
                    img.title = img.title + "||";
                    barracksImageHTML = img.outerHTML;
                }
            }

            let stableImageHTML = "";
            if (localStorage_stableTrainingList[village.id].length > 0) {
                const img = document.createElement("img");
                img.src = stablePNG;
                img.width = "45";
                img.title = localStorage_stableTrainingList[village.id].map(troop => {
                    const timestamp = parseInt(Math.floor(Date.now() / 1000));
                    const timerValue = troop.timestampEnd - timestamp;
                    const isDone = timerValue < 0;

                    if (isDone) return "";
                    return `${troop.name} | ${new Date(timerValue * 1000).toISOString().slice(11, 19)} | ${troop.fin}<br>`;
                }).join("");

                if (img.title !== "") {
                    img.title = img.title + "||";
                    stableImageHTML = img.outerHTML;
                }
            }

            let workshopImageHTML = "";
            if (localStorage_workshopTrainingList[village.id].length > 0) {
                const img = document.createElement("img");
                img.src = workshopPNG;
                img.width = "45";
                img.title = localStorage_workshopTrainingList[village.id].map(troop => {
                    const timestamp = parseInt(Math.floor(Date.now() / 1000));
                    const timerValue = troop.timestampEnd - timestamp;
                    const isDone = timerValue < 0;

                    if (isDone) return "";
                    return `${troop.name} | ${new Date(timerValue * 1000).toISOString().slice(11, 19)} | ${troop.fin}<br>`;
                }).join("");

                if (img.title !== "") {
                    img.title = img.title + "||";
                    workshopImageHTML = img.outerHTML;
                }
            }

            const troopsHTML = barracksImageHTML + stableImageHTML + workshopImageHTML;

            return `<tr>
                        <td>
                            <a ${activeVillage.id === village.id ? "style=color:black;" : ""} href=${village.href}>${village.name}</a>
                        </td>
                        <td>
                            <ul>
                                ${buildingListHTML}
                            </ul>
                        </td>
                        <td>
                            ${troopsHTML}
                        </td>
                    </tr>`;
        }).join("");

        const villageOverviewHTML = `<div id="us-overview" class="us-draggable" style="top: ${localStorage_villageOverview_coords[0]}px; left: ${localStorage_villageOverview_coords[1]}px;">
                                        <div class="us-overview__header us-draggable--header" style="display: flex; align-items: center;"><div style="flex-grow: 1;">Click here to move</div><div class="us-settingsIconSVG" style="margin-left: 5px; cursor: pointer;"></div></div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Villages</th>
                                                    <th>Building</th>
                                                    <th>Troops</th>
                                                </tr>
                                            </thead>
                                            <tbody>${tableRowsHTML}</tbody>
                                        </table>
                                    </div>`;

        document.body.insertAdjacentHTML("beforeend", villageOverviewHTML);
        dragElement(document.getElementById("us-overview"), `us_${playerName}_villageOverview_coords`);

        // create settings
        const us_settings = createSettingsHTML();

        const us_settings_icon = document.querySelector("#us-overview .us-settingsIconSVG");
        us_settings_icon.id = "us-settingsIcon";
        us_settings_icon.title = "Userscript Settings ||";
        us_settings_icon.onmousedown = function (e) {
            e.stopPropagation();
        };
        us_settings_icon.onmouseup = function (e) {
            us_settings.classList.toggle("us--display-block");
        };

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "fill", "#000000");
        svg.setAttributeNS(null, "viewBox", "0 0 48 48");
        svg.setAttributeNS(null, "width", "20");
        svg.setAttributeNS(null, "heigth", "20");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(null, "d", `M39.139,26.282C38.426,25.759,38,24.919,38,24.034s0.426-1.725,1.138-2.247l3.294-2.415	c0.525-0.386,0.742-1.065,0.537-1.684c-0.848-2.548-2.189-4.872-3.987-6.909c-0.433-0.488-1.131-0.642-1.728-0.38l-3.709,1.631	c-0.808,0.356-1.749,0.305-2.516-0.138c-0.766-0.442-1.28-1.23-1.377-2.109l-0.446-4.072c-0.071-0.648-0.553-1.176-1.191-1.307	c-2.597-0.531-5.326-0.54-7.969-0.01c-0.642,0.129-1.125,0.657-1.196,1.308l-0.442,4.046c-0.097,0.88-0.611,1.668-1.379,2.11	c-0.766,0.442-1.704,0.495-2.515,0.138l-3.729-1.64c-0.592-0.262-1.292-0.11-1.725,0.377c-1.804,2.029-3.151,4.35-4.008,6.896	c-0.208,0.618,0.008,1.301,0.535,1.688l3.273,2.4C9.574,22.241,10,23.081,10,23.966s-0.426,1.725-1.138,2.247l-3.294,2.415	c-0.525,0.386-0.742,1.065-0.537,1.684c0.848,2.548,2.189,4.872,3.987,6.909c0.433,0.489,1.133,0.644,1.728,0.38l3.709-1.631	c0.808-0.356,1.748-0.305,2.516,0.138c0.766,0.442,1.28,1.23,1.377,2.109l0.446,4.072c0.071,0.648,0.553,1.176,1.191,1.307	C21.299,43.864,22.649,44,24,44c1.318,0,2.648-0.133,3.953-0.395c0.642-0.129,1.125-0.657,1.196-1.308l0.443-4.046	c0.097-0.88,0.611-1.668,1.379-2.11c0.766-0.441,1.705-0.493,2.515-0.138l3.729,1.64c0.594,0.263,1.292,0.111,1.725-0.377	c1.804-2.029,3.151-4.35,4.008-6.896c0.208-0.618-0.008-1.301-0.535-1.688L39.139,26.282z M24,31c-3.866,0-7-3.134-7-7s3.134-7,7-7	s7,3.134,7,7S27.866,31,24,31z`);

        svg.append(path);
        us_settings_icon.append(svg);
        document.body.append(us_settings);
    }

    /**
     * Create a draggable element that contains Village Resources.
     */
    function createResourcesHTML() {
        /**
         * Update resourcesHTML values.
         */
        function updateResources(localStorage_resources, villageList) {
            villageList.forEach(village => {
                const id = village.id;

                const resources = localStorage_resources[id][0];

                if (resources === undefined) {
                    // document.querySelector(`#us-${id}-l1 .us-bar`).style.width = `${lumberPercent}%`;
                    // document.querySelector(`#us-${id}-l2 .us-bar`).style.width = `${clayPercent}%`;
                    // document.querySelector(`#us-${id}-l3 .us-bar`).style.width = `${ironPercent}%`;
                    // document.querySelector(`#us-${id}-l4 .us-bar`).style.width = `${cropPercent}%`;

                    document.querySelector(`#us-${id}-l1 .us-resourceValue`).textContent = "??";
                    document.querySelector(`#us-${id}-l2 .us-resourceValue`).textContent = "??";
                    document.querySelector(`#us-${id}-l3 .us-resourceValue`).textContent = "??";
                    document.querySelector(`#us-${id}-l4 .us-resourceValue`).textContent = "??";

                    return;
                }

                const lumber = resources.resources.lumber;
                const clay = resources.resources.clay;
                const iron = resources.resources.iron;
                const crop = resources.resources.crop;
                const lumberH = resources.hourlyProduction.lumber;
                const clayH = resources.hourlyProduction.clay;
                const ironH = resources.hourlyProduction.iron;
                const cropH = resources.hourlyProduction.crop;
                const warehouse = resources.storage.warehouse;
                const granary = resources.storage.granary;
                const timestamp = resources.timestamp;

                const currentTimestamp = parseInt(Math.floor(Date.now() / 1000));
                const diffTimestamp = currentTimestamp - timestamp;
                const lumberCalc = (lumberH * diffTimestamp) / 3600;
                const clayCalc = (clayH * diffTimestamp) / 3600;
                const ironCalc = (ironH * diffTimestamp) / 3600;
                const cropCalc = (cropH * diffTimestamp) / 3600;

                const lumberValue = lumber + Math.floor(lumberCalc);
                const clayValue = clay + Math.floor(clayCalc);
                const ironValue = iron + Math.floor(ironCalc);
                const cropValue = crop + Math.floor(cropCalc);

                const lumberPercent = Math.floor((lumberValue * 100) / warehouse);
                const clayPercent = Math.floor((clayValue * 100) / warehouse);
                const ironPercent = Math.floor((ironValue * 100) / warehouse);
                const cropPercent = Math.floor((cropValue * 100) / granary);

                document.querySelector(`#us-${id}-l1 .us-bar`).style.width = `${lumberPercent <= 100 ? lumberPercent : 100}%`;
                document.querySelector(`#us-${id}-l2 .us-bar`).style.width = `${clayPercent <= 100 ? clayPercent : 100}%`;
                document.querySelector(`#us-${id}-l3 .us-bar`).style.width = `${ironPercent <= 100 ? ironPercent : 100}%`;
                document.querySelector(`#us-${id}-l4 .us-bar`).style.width = `${cropPercent <= 100 ? cropPercent : 100}%`;

                document.querySelector(`#us-${id}-l1 .us-resourceValue`).textContent = `${lumberValue <= warehouse ? lumberValue : warehouse}`;
                document.querySelector(`#us-${id}-l2 .us-resourceValue`).textContent = `${clayValue <= warehouse ? clayValue : warehouse}`;
                document.querySelector(`#us-${id}-l3 .us-resourceValue`).textContent = `${ironValue <= warehouse ? ironValue : warehouse}`;
                document.querySelector(`#us-${id}-l4 .us-resourceValue`).textContent = `${cropValue <= granary ? cropValue : granary}`;

                if (cropH < 0) {
                    document.querySelector(`#us-${id}-l4 .us-resourceValue`).classList.add("us--text-alert");
                }
            });
        }

        const playerName = getPlayerName();
        const villageList = getVillageList();
        const activeVillage = getActiveVillage();
        const localStorageProp = `us_${playerName}_resources_coords`;

        // get draggable element coordinates
        let localStorage_coords = localStorage[localStorageProp];
        if (localStorage_coords === undefined) {
            localStorage_coords = [250, 0]; // top left
            localStorage[localStorageProp] = JSON.stringify(localStorage_coords);
        } else {
            localStorage_coords = JSON.parse(localStorage_coords);
        }
        const top = localStorage_coords[0];
        const left = localStorage_coords[1];

        const localStorage_buildingList = getLocalStorage_buildingList(playerName, villageList);
        const localStorage_resources = getLocalStorage_resources(playerName, villageList);




        // html
        const tableRowsHTML = villageList.map(village => {
            const resources = localStorage_resources[village.id][0];
            let warehouse;
            let granary;

            if (resources === undefined) {
                warehouse = "??";
                granary = "??";
            } else {
                warehouse = resources.storage.warehouse;
                granary = resources.storage.granary;
            }

            return `<tr>
                        <td>
                            <a ${activeVillage.id === village.id ? "style=color:black;" : ""} href=${village.href}>${village.name}</a>
                        </td>
                        <td>
                            <div class="us-resources">
                                <div id="us-${village.id}-l1" class="us-resource" title="${warehouse}||">
                                    <div class="us-resourceValue"></div>
                                    <div class="us-barBox">
                                        <div class="us-bar"></div>
                                    </div>
                                </div>
                                <div id="us-${village.id}-l2" class="us-resource" title="${warehouse}||">
                                    <div class="us-resourceValue"></div>
                                    <div class="us-barBox">
                                        <div class="us-bar"></div>
                                    </div>
                                </div>
                                <div id="us-${village.id}-l3" class="us-resource" title="${warehouse}||">
                                    <div class="us-resourceValue"></div>
                                    <div class="us-barBox">
                                        <div class="us-bar"></div>
                                    </div>
                                </div>
                                <div id="us-${village.id}-l4" class="us-resource" title="${granary}||">
                                    <div class="us-resourceValue"></div>
                                    <div class="us-barBox">
                                        <div class="us-bar"></div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>`;
        }).join("");

        const html = `<div id="us-resources" class="us-draggable" style="top:${top}px; left:${left}px;">
                            <div class="us-resources__header us-draggable--header">Click here to move</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Villages</th>
                                        <th>Resources (not 100% accurate)</th>
                                    </tr>
                                </thead>
                                <tbody>${tableRowsHTML}</tbody>
                            </table>
                        </div>`;

        document.body.insertAdjacentHTML("beforeend", html);
        dragElement(document.getElementById("us-resources"), localStorageProp);
        updateResources(localStorage_resources, villageList);

        setInterval(() => {
            updateResources(localStorage_resources, villageList);
        }, 1000);
    }

    /**
     * Create a icon on the map toolbar that can create a semi larger map (a bit like the travian plus larger map feature).
     */
    function createSemiLargerMapHTML() {
        const div = document.createElement("div");
        div.classList.add("iconButton", "viewFullGold");
        div.title = "Semi Larger map (no plus needed) ||";
        div.open = false;

        const mapToolbar = document.querySelector("#toolbar > div.ml > div > div > div.contents");
        const iconCropFinder = document.querySelector("#iconCropfinder");


        div.onclick = function () {
            const map1 = document.querySelector("#mapContainer > div:nth-child(1)");
            const map2 = document.querySelector("#mapContainer > div:nth-child(1) > div:nth-child(2)");
            const elements = [
                document.querySelector("#topBar"),
                document.querySelector("#topBarHeroWrapper"),
                document.querySelector("#header"),
                document.querySelector("#servertime"),
                document.querySelector("#sidebarBeforeContent"),
                document.querySelector("#sidebarAfterContent"),
                document.querySelector("#mapContainer > div.ruler.x"),
                document.querySelector("#mapContainer > div.ruler.y"),
                document.querySelector("#us-overview"),
                document.querySelector("#us-resources")

            ];

            if (this.open) {
                elements.forEach(el => {
                    el.style.visibility = "";
                });

                map1.style.overflow = "hidden";
                map2.classList.remove("us-map-open");

                this.open = false;
                return;
            }

            elements.forEach(el => {
                el.style.visibility = "hidden";
            });

            map1.style.overflow = "unset";
            map2.classList.add("us-map-open");

            this.open = true;
        };

        mapToolbar.insertBefore(div, iconCropFinder);
    }

    /**
     * Create settings container.
     */
    function createSettingsHTML() {
        const us_settings = document.createElement("div");
        us_settings.id = "us-settings";
        us_settings.style = "position: absolute; top: 10px; left: 50%; transform: translate(-50%, 0); z-index: 999; background-color: #D2BDA1;";
        us_settings.style.minWidth = "600px";
        us_settings.style.display = "none";

        const html = `<div style="background-color: #FFFFFF; margin: 10px; padding: 10px;">
            <div>
                <div style="background: #E0EBDF; border-radius: 7px; padding: 5px;"><strong>Settings</strong></div>
                <div>
                    <ul>
                        <li style="margin-bottom: 10px;"><strong><a onclick="this.preventDefault;localStorage.clear();location.reload();">Clear Data</a></strong></li>
                    </ul>
                </div>
            </div> 
            <div>
                <div style="background: #E0EBDF; border-radius: 7px; padding: 5px;"><strong>Features</strong></div>
                <div>
                    <ul>
                        <li style="margin-bottom: 10px;">
                            <a href="https://greasyfork.org/zh-CN/scripts/463332-travianhelper-travian-legends" target="_blank">Features</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div style="background: #E0EBDF; border-radius: 7px; padding: 5px;"><strong>Script Info</strong></div>
                <div>
                    <ul>
                        <li style="margin-bottom: 10px;"><strong>Name:</strong> TravianHelper(Travian Legends++)</li>
                        <li style="margin-bottom: 10px;"><strong>Version:</strong> ${myVersion}</li>
                        <li style="margin-bottom: 10px;"><strong>Author:</strong> bingkx & SkillsBoY</li>
                        <li style="margin-bottom: 10px;"><strong>Want new features?</strong> <a href="https://greasyfork.org/zh-CN/scripts/463332-travianhelper-travian-legends/feedback" target="_blank">Feedback</a></li>
                    </ul>
                </div>
            </div>  
            <div style="text-align: center; cursor: pointer;" onclick="document.querySelector('#us-settings').classList.toggle('us--display-block');"><strong>CLOSE</strong></div>         
        </div>`;

        us_settings.insertAdjacentHTML("beforeend", html);

        return us_settings;
    }



}

// utilities
{
    /**
     * Make an element draggable
     */
    function dragElement(elmnt, localStorageProp) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt.querySelector(`.${elmnt.id}__header`).onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;

            if (elmnt.offsetLeft + elmnt.offsetWidth <= 50) {
                elmnt.style.left = 50 - elmnt.offsetWidth + "px";
            }

            if (elmnt.offsetTop < 0) {
                elmnt.style.top = "0";
            }

            if (localStorageProp !== undefined) {
                localStorage[localStorageProp] = JSON.stringify([elmnt.offsetTop, elmnt.offsetLeft]);
            }
        }
    }
}

// main code
{
    const playerName = getPlayerName();
    const villageList = getVillageList();
    const activeVillage = getActiveVillage();
    const resources = getResources();
    const storage = getStorage();
    const hourlyProduction = getHourlyProduction();
    const timestamp = parseInt(Math.floor(Date.now() / 1000));

    const resourceData = [{
        resources,
        storage,
        hourlyProduction,
        timestamp
    }];

    const localStorage_buildingList = getLocalStorage_buildingList(playerName, villageList);
    const localStorage_barracksTrainingList = getLocalStorage_barracksTrainingList(playerName, villageList);
    const localStorage_stableTrainingList = getLocalStorage_stableTrainingList(playerName, villageList);
    const localStorage_workshopTrainingList = getLocalStorage_workshopTrainingList(playerName, villageList);
    const localStorage_resources = getLocalStorage_resources(playerName, villageList);

    // if current page is dorf1.php or dorf2.php
    if (/dorf1.php|dorf2.php/.test(window.location.pathname)) {
        const buildingList = getBuildingList();
        setLocalStorage_buildingList(playerName, activeVillage.id, localStorage_buildingList, buildingList);
    }

    // if current page is dorf1.php
    if (/dorf1.php/.test(window.location.pathname)) {

    }

    // if current building is gid=17 (marketplace) or gid=16 (rally point)
    if (/gid=17|gid=16/.test(window.location.search)) {
        coordsClickFillVillageDestinationFields();
    }

    // if current building is gid=19 (barracks)
    if (/gid=19/.test(window.location.search)) {
        const barracksTrainingList = getBarracksTrainingList();
        setLocalStorage_barracksTrainingList(playerName, activeVillage.id, localStorage_barracksTrainingList, barracksTrainingList);
    }

    // if current building is gid=20 (stable)
    if (/gid=20/.test(window.location.search)) {
        const stableTrainingList = getStableTrainingList();
        setLocalStorage_stableTrainingList(playerName, activeVillage.id, localStorage_stableTrainingList, stableTrainingList);
    }

    // if current building is gid=21 (workshop)
    if (/gid=21/.test(window.location.search)) {
        const workshopTrainingList = getWorkshopTrainingList();
        setLocalStorage_workshopTrainingList(playerName, activeVillage.id, localStorage_workshopTrainingList, workshopTrainingList);
    }

    // if current page is on the map (/karte.php)
    if (/karte.php/.test(window.location.pathname)) {
        createSemiLargerMapHTML();
    }


    setLocalStorage_resources(getPlayerName(), getActiveVillage().id, localStorage_resources, resourceData);

    makeBuildingIconsAvailable();
    createVillageOverviewHTML();
    createResourcesHTML();
}