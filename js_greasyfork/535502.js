// ==UserScript==
// @name         Embedded diep lobby selector
// @namespace    http://tampermonkey.net/
// @version      4.0 beta
// @description  A lobby selector and lobby API info formatter + other useful overlays
// @author       <Eclipsia discord@cz_eclipsia reddit@Ok-Wing4342>
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        *://*.diep.io/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535502/Embedded%20diep%20lobby%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/535502/Embedded%20diep%20lobby%20selector.meta.js
// ==/UserScript==

/* 
TODO: 
make the inner div contained in a space (done)
stop execution if display is none (done)
add a way to choose a team in teams and 4teams (done)
edit css of buttons (done)
test future events and beta data (done)
game version button switcher mostly done ready to test (done)
add options to enable and disable render latency and net predict (done)

add special to sandboxes
highlighted mode now matches the colour of your team
same with score and background

// https://stackoverflow.com/questions/79614720/how-do-i-add-hover-and-active-events-to-my-tampermonkey-injected-script
*/

(async function() {
    'use strict';
    // region Top
    const TOGGLE_LOBBY_KEYBIND = 'q';
    const TOGGLE_PRESETS_KEYBIND = 'r';
    const UPDATE_DELAY = 1000; // miliseconds
    const BASE_API = "https://lb.diep.io/api/lb/"
    const BETA_API = "https://master-dev.diep.io/api/lb/"
    const storageKey = "diepioLobbyselect_"
    //const re_isBeta = /https?:\/\/(?<beta>beta\.)?diep\.io\/?.*/

    /**
     * Return the number of appearances of sub in orig.
     * @param {string} orig 
     * @param {string} sub 
     */
    const count = (orig, sub) => orig.split(sub).length - 1;

    /** @param {string} timeAlive */
    function deformatTimeAlive(timeAlive) {
        let totalMins = 0;
        for (const part of timeAlive.split(" ")) {
            let [,value, suffix] = part.match(/(\d+)(h|m|s)/);
            value = parseInt(value);
            switch (suffix) {
                case "h": totalMins += value * 3600
                case "m": totalMins += value 
                case "s": totalMins += value / 60
            }
        }
        return totalMins;
    }

    // region default builds
    class Builder {
        constructor() {
            this.build = "";
        }

        get build2s3() {
            return this.add("32323")
        }

        repeat(parts, count) {
            return this.add(parts.repeat(count));
        }

        max(parts) {
            return this.repeat(parts, 7)
        }

        add(parts) {
            this.build += parts;
            return this;
        }

        finish() {
            return this.toString();
        }

        toString() {
            return this.build.slice(0, 33);
        }
    }

    const defaultBuilds = {
        overlord: new Builder().max("4568").build2s3.finish(),
        factory: new Builder().max("4568").max("7").finish(),
        triplet: new Builder().max("5678").max("4").finish(),
        fighter: new Builder().max("5678").build2s3.finish(),
        annihilator: new Builder().repeat("4568", 6).add("48").max("7").finish(),
        sniper: new Builder().repeat("4568", 6).add("56").max("7").finish()
    }

    const tankToIndex = {
        overlord: 12,
        factory: 52,
        fighter: 24,
        triplet: 2,
        annihilator: 49,
        sniper: 6,
    }

    function getTankIconLinkFor(tank) {
        return `https://diep.io/old-assets/assets/diep/tanks/tank_${tankToIndex[tank.toLowerCase()]}.png`;
    }
    
    // region local storage management
    const storage = {
        get(key) {
            return localStorage.getItem(storageKey + key)
        },
        
        async set(key, value) {
            localStorage.setItem(storageKey + key, value);
            //console.log('set', key, 'to', value);
        },

        getBool(key, defaultValue) {
            let value = this.get(key, null);
            return value === null ? defaultValue : JSON.parse(value)
        },
        
        /**
         * @returns {number}
         */
        getNumber(key, defaultValue)  {
            let value = this.get(key, null);
            return value === null ? defaultValue : parseFloat(value);
        },

    }

    // region unfuck diep
    const consoleLog = console.log;
    const PREDICT_MOVEMENT = "net_predict_movement";
    const REN_LATENCY = "ren_latency";
    const REN_FPS = "ren_fps";

    let lobbyid;
    let [
        backgroundSuccess, 
        windowSuccess, 
        scoreSuccess, 
        checkedLobbyLink
    ] = [false, false, false, true];

    let renderLatency = storage.getBool("renLatency") ?? true;
    let predictMovement = storage.getBool("predictMovement") ?? false;
    let renderFPS = storage.getBool("renderFPS") ?? true;
    storage.set("predictMovement", predictMovement);
    storage.set("renLatency", renderLatency);
    storage.set("renFPS", renderFPS);

    const clipboardWrite = navigator.clipboard.writeText;
    navigator.clipboard.writeText = async (text) => {
        lobbyid = text.split("_")[3];
        navigator.clipboard.writeText = clipboardWrite;
    }

    // region async startup()
    async function startup() {
        if (!windowSuccess && window.input) {
            // force predict_movement off, bring back latency statistic 
            window.input.set_convar(REN_LATENCY, renderLatency);
            window.input.set_convar(PREDICT_MOVEMENT, predictMovement);
            window.input.set_convar(REN_FPS, renderFPS);
            windowSuccess = true;
        }

        let backgroundElem;
        if (!backgroundSuccess && (backgroundElem = document.getElementById("game-over-screen"))) {
            // remove blurry deathscreen background
            backgroundElem.style.setProperty("backdrop-filter", "none", "important");
            backgroundSuccess = true;

        }
        let scoreTextElem;
        if (!scoreSuccess && (scoreTextElem = document.getElementById("game-over-stats-player-score"))) {
            const timeAliveElem = document.getElementById("game-over-stats-time-alive");
            // unfuck the score
            let oldValue = scoreTextElem.textContent;
            const callback = () => {
                let newValue = scoreTextElem.textContent;
                if (newValue == oldValue) return;

                scoreTextElem.textContent = scoreTextElem.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                const score = parseInt(newValue.replaceAll(/[,.]/g, ""));
                const timeAliveMins = deformatTimeAlive(timeAliveElem.textContent);
                timeAliveElem.textContent += ` ${(score/timeAliveMins).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/m`
                oldValue = newValue;
            }

            new MutationObserver(callback).observe(scoreTextElem, {
                childList: true,    
                subtree: true,
                characterData: true
            })

            scoreSuccess = true
        }

        //let copyLinkButton;
        //if (!checkedLobbyLink && (copyLinkButton = document.querySelector("#copy-party-link"))) {
        //    copyLinkButton.click();
        //    checkedLobbyLink = true;
        //}

        if (backgroundSuccess && windowSuccess && scoreSuccess && checkedLobbyLink) {
            consoleLog(`Finished unfucking job.`)
            return;
        }

        await Promise.resolve(new Promise(r => setTimeout(r, 500)));
        startup();
    };
    startup();

    const setBuild = build => input.execute(`game_stats_build ${build}`);
    
    // region Colours
    const intToTeam = [
        "blue",
        "red",
        "purple",
        "green",
    ];
    
    const intToColour = [
        "rgba(33, 143, 221, 1)", // blue
        "rgba(232, 27, 27, 1)",  // red
        "rgba(184, 13, 207, 1)", // purple
        "rgba(81, 220, 34, 1)",  // green
    ];

    const GREEN = "rgba(0, 255, 0, 1)"
    const RED = "rgba(255, 0, 0, 1)"

    let colours = {
        fra: "rgba(255, 0, 0, 0.5)",
        atl: "rgba(255, 255, 0, 0.5)",
        sgp: "rgba(50, 50, 200, 0.5)",
        syd: "rgba(0, 255, 0, 0.5)"
    }

    const defaultColour = "rgba(255, 255, 255, 0.5)"

    // region CSS
    const globalCSS = document.createElement("style");
    globalCSS.textContent = `

.lobby-button {
    padding: 5px;
    border: 1px solid black;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-left: 5px;
    margin-bottom: 2px;
    border-radius: 5px;
}

.button-row-div {
    z-index: 999999;
    border: 1px solid black;
    border-radius: 5px;
    display: flex;
    height: 20px;
}

.button-label {
    margin-top: 0px;
    margin-left: 3px;
}

.presets-header-button {
    margin: 10px;
    background-color: rgba(255, 255, 255, 1);
    cursor: pointer;
}

.presets-header-button:hover {
    background-color: rgba(160, 160, 160, 0.5);
}

.presets-header-button:active {
    background-color: rgb(0, 0, 0);
}

`;
    document.head.append(globalCSS);

    // region functions

    function offsetRGBA(rgba = "rgba(0, 0, 0, 0)", offset = 0, alphaOffset = 0.0) {
        const regex = /rgba\((?<r>\d{1,3})\D*,\D*(?<g>\d{1,3})\D*,\D*(?<b>\d{1,3})\D*,\D*(?<a>[0-1](\.\d)?)\)/
        const res = regex.exec(rgba);
        if (!res?.groups) throw Error(`failed regex: '${rgba}'`);

        const grps = res.groups;
        const r = parseInt(grps.r) + offset;
        const g = parseInt(grps.g) + offset;
        const b = parseInt(grps.b) + offset;
        const a = parseFloat(grps.a) + alphaOffset;
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    const commonlySharedButtonCSS = `
        padding: 5px;
        border: 1px solid black;
        background-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin-left: 5px;
        margin-bottom: 2px;
        border-radius: 5px;
    `;

    // TODO: sandboxes
    const thisURL = new URL(document.URL)
    let currentLobby = thisURL.searchParams.get("lobby")

    // region storage get


    /** @type {"verbose" | "concise"} */
    let layoutStyle = storage.get("layoutStyle") ?? "verbose"
    let buttonIndex = storage.getNumber('teamIndex', 0);
    let apiDevice = storage.get('device') || (thisURL.host.startsWith("mobile") ? "mobile" : "pc");
    /** @type {Object.<string, string>} */
    let presetTankBuilds = JSON.parse(storage.get("presetTankBuilds")) || defaultBuilds;
    let showUI = true;

    storage.set("layoutStyle", layoutStyle);
    storage.set("teamIndex", buttonIndex);
    storage.set("device", apiDevice);

    /** @type {"beta" | "main"} */
    let APItarget = thisURL.host.startsWith("beta") ? "beta" : "main"
    if (APItarget == "main") {
        APItarget ??= storage.get('APItarget');
    }

    // region helper funcs

    function getAPIEndpoint(device) {
        return (APItarget == "beta" ? BETA_API : BASE_API) + (device ?? apiDevice)
    }

    function getTextForNumPlayers(numPlayers) {
        // this function was vibe coded
        if (numPlayers < 850) return "Very Low";
        if (numPlayers < 900) return "Low";
        if (numPlayers < 950) return "Below Average";
        if (numPlayers < 1050) return "Average";
        if (numPlayers < 1100) return "Above Average";
        if (numPlayers < 1200) return "High";
        return "Very High";
    }

    function formatSeconds(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor(seconds / 3600 % 24);
        const minutes = Math.floor(seconds / 60 % 60);
        seconds = Math.floor(seconds % 60);

        let output = "";
        if (days) output += `${days}d `
        if (hours) output += `${hours}h `
        if (minutes) output += `${minutes}m `
        if (seconds) output += `${seconds}s`
        return output.trim();
    }

    // region createLobbyButton
    function createLobbyButton(region, lobby) {
        const button = document.createElement('button');
        button.classList.add("lobby-button")
;
        let gamemodeName;
        if (layoutStyle == "verbose") {
            gamemodeName = lobby.gamemodeName || lobby.gamemode;
        } else {
            gamemodeName = lobby.gamemode;
            if (
                lobby.gamemodeName.toLowerCase().includes("maze") 
            ) gamemodeName = lobby.gamemodeName.toLowerCase();
        }
            
        button.textContent = `${gamemodeName} ${lobby.numPlayers}p`;

        let futureEventButton;
        if (lobby.nextGamemodeName) {
            futureEventButton = document.createElement("button")
            futureEventButton.classList.add("lobby-button");
            const secondsUntilText = formatSeconds(lobby.secondsUntilNextGamemode);
            futureEventButton.textContent = 
            `${lobby.gamemodeName ?? lobby.gamemode} => ${lobby.nextGamemodeName} in ${secondsUntilText}`
        }

        const buttonProxyHandler = {
            set(target, p, newValue, receiver) {
                button.style[p] = newValue
                if (futureEventButton) futureEventButton.style[p] = newValue
                return true
            },
        }

        const bothButtonStyle = new Proxy({}, buttonProxyHandler);

        const bgColor = colours[region.region] || defaultColour
        button.style.backgroundColor = bgColor;
        
        if (lobby.ip === currentLobby) {
            bothButtonStyle.border = "5px solid black";

            if (lobby.gamemode.includes("teams") || currentTeamIndex > 0) {
                bothButtonStyle.backgroundColor = intToColour[currentTeamIndex];
                button.textContent += ` (${intToTeam[currentTeamIndex]})`;
            } else {
                bothButtonStyle.backgroundColor = offsetRGBA(bgColor, -40)
            }

        } else {
            bothButtonStyle.border = "1px solid black";
        }

        if (futureEventButton) {
            futureEventButton.style.backgroundColor = offsetRGBA(bgColor, 120)
        }

        return {button, futureEventButton};
    }

    const empty = document.createElement("h2");
    empty.textContent = "< No Lobbies >";
    empty.style.cssText = `
        margin: 20px;
    `;
    // region async update()

    async function update() {
        const response = await fetch(getAPIEndpoint());
        const value = await response.json();
        /** @type {object[]} */
        const data = value.regions;

        const count = data.map(region => region.numPlayers).reduce((prv, cur) => prv + cur, 0);
        numPlayers.textContent = `Players Active: ${count} (${getTextForNumPlayers(count)})`        

        lobbySelectorDiv.textContent = "";
        if (!count) {
            lobbySelectorDiv.appendChild(empty)
            return
        }

        for (const region of data) {
            const countryCode = region.countryCode && layoutStyle == "verbose" ? ` (${region.countryCode})` : ""
            
            const playerCount = document.createElement('p');
            playerCount.textContent = `${region.regionName}${countryCode} ${region.numPlayers} Players`
            playerCount.style.cssText = `
                margin-right: 0px;
                background-color: ${colours[region.region] ?? defaultColour};
            `;
            playerCount.style.color = offsetRGBA(playerCount.style.backgroundColor, 200)
            lobbySelectorDiv.appendChild(playerCount);
            
            const futureEventButtons = [];

            for (let index = 0; index < region.lobbies.length; index++) {
                // put every sixth lobby on a new row
                if (index % 5 == 1 && index > 5) {
                    lobbySelectorDiv.appendChild(document.createElement('br'));
                }

                const lobby = region.lobbies[index];
                const {button, futureEventButton} = createLobbyButton(region, lobby);

                button.addEventListener('click', () => {
                    let teamIndex = buttonIndex;

                    if (lobby.gamemode === "teams" 
                        && teamIndex > 1 
                        || !lobby.gamemode.includes("teams")
                        && lobby.gamemode !== "event"
                    ) {
                        teamIndex = 0;
                    }
                    // https://diep.io/?lobby=fra_teams_fra-43ce658e19c456d0.diep.io:2001_55544_0
                    const searchParams = new URLSearchParams();
                    searchParams.set("lobby", `${region.region}_${lobby.gamemode}_${lobby.ip}_${"x" || "lobbyid"}_${teamIndex}`)

                    window.open(`https://${apiDevice == 'mobile' ? 'mobile.' : ''}diep.io/?${searchParams.toString()}`)
                });

                lobbySelectorDiv.appendChild(button);
                if (futureEventButton) futureEventButtons.push(futureEventButton);
            }
            if (layoutStyle == "verbose") {
                lobbySelectorDiv.appendChild(document.createElement('br'));
                futureEventButtons.forEach(button => lobbySelectorDiv.appendChild(button))
            }
            lobbySelectorDiv.appendChild(document.createElement('br'));
        }
        
    }
    update()
    let IntervalID = setInterval(update, UPDATE_DELAY);
    
    // toggle display visibility
    async function toggleLobby() {
        const display = lobby_container.style.display;
        lobby_container.style.display = display == 'block' ? 'none' : 'block';
        showUI = !showUI;
        if (showUI) {
            update();
            IntervalID = setInterval(update, UPDATE_DELAY);
        } else {
            clearInterval(IntervalID);
        }
    }

    // region HTML








    // region lobby selector






    // seperate each element with 2 empty lines
    // region text

    const lobby_container = document.createElement("div");
    lobby_container.style.cssText = `
        position: absolute;
        left: 0%;
        top: 0%;
        z-index: 999999;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
        display: block;
    `;
    document.body.append(lobby_container);


    const title = document.createElement("p");
    title.textContent = 'Diep lobby selector by Eclipsia';
    title.style.cssText = `
        position: relative;
        z-index: 999999;
        padding: 0px;
        margin: 0px;
        color: black;
    `;
    lobby_container.appendChild(title);


    const numPlayers = document.createElement('p');
    numPlayers.textContent = "Players Active: ?";
    numPlayers.style.cssText = `
        position: relative;
        z-index: 999999;
        padding: 0px;
        margin: 0px;
        margin-bottom: 3px;
        color: black;
    `;
    lobby_container.appendChild(numPlayers);




    // region button row
    const buttonDiv = document.createElement('div');
    buttonDiv.style.cssText = `
        right: 0%;
        display: flex;
    `;
    lobby_container.appendChild(buttonDiv);


    const apiDeviceBtn = document.createElement("button");
    apiDeviceBtn.textContent = "device: " + apiDevice;
    apiDeviceBtn.style.cssText = `
        border: 3px solid black;
        background-color: rgba(255, 255, 255, 0.8);
        margin-right: 3px;
        padding: 2px;
    `;
    apiDeviceBtn.addEventListener("click", () => {
        apiDevice = apiDevice === "mobile" ? "pc" : "mobile";
        apiDeviceBtn.textContent = "device: " + apiDevice;
        storage.set('device', apiDevice);
    });
    buttonDiv.appendChild(apiDeviceBtn);


    const gameReleaseBtn = document.createElement('button');
    gameReleaseBtn.textContent = "API: " + APItarget;
    gameReleaseBtn.style.cssText = `
        border: 3px solid black;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        padding: 2px;
        margin-right: 3px;
    `;
    gameReleaseBtn.addEventListener('click', () => {
        APItarget = APItarget == "beta" ? "main" : "beta";
        gameReleaseBtn.textContent = "API: " + APItarget;
        storage.set('APItarget', APItarget);
    });
    buttonDiv.appendChild(gameReleaseBtn);


    const layoutStyleBtn = document.createElement("button");
    layoutStyleBtn.textContent = "style: " + layoutStyle;
    layoutStyleBtn.style.cssText = `
        border: 3px solid black;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        padding: 2px;
    `;
    layoutStyleBtn.addEventListener("click", () => {
        layoutStyle = layoutStyle == "verbose" ? "concise" : "verbose";
        layoutStyleBtn.textContent = "style: " + layoutStyle;
        storage.set("layoutStyle", layoutStyle);
    })
    buttonDiv.appendChild(layoutStyleBtn)


    // region target team
    const targetTeamDiv = document.createElement('div');
    targetTeamDiv.style.cssText = `
        z-index: 999999;
        background-color: rgba(25, 160, 205, 1);
        border: 1px solid black;
        border-radius: 5px;
        display: flex;
        height: 20px;
    `;
    lobby_container.appendChild(targetTeamDiv);

    const teamTitle = document.createElement('p');
    teamTitle.textContent = "target team: ";
    teamTitle.classList.add("button-label")
    targetTeamDiv.appendChild(teamTitle);

    const teamButton = document.createElement('button');
    teamButton.textContent = intToTeam[buttonIndex];
    teamButton.style.cssText = `
        margin-left: 5px;
        background-color: ${intToColour[buttonIndex]};
    `;
    teamButton.addEventListener('click', () => {
        buttonIndex = (buttonIndex + 1) % intToTeam.length;
        teamButton.textContent = intToTeam[buttonIndex];
        teamButton.style.backgroundColor = intToColour[buttonIndex];
        storage.set('teamIndex', buttonIndex);
    });
    targetTeamDiv.appendChild(teamButton);





    // region net_predict
    const divPredictMovement = document.createElement("div");
    divPredictMovement.classList.add("button-row-div")
    divPredictMovement.style.cssText = "background-color: rgba(222, 52, 248, 0.55);";
    lobby_container.appendChild(divPredictMovement)

    
    const netPredictLabel = document.createElement("p")
    netPredictLabel.textContent = "net_predict_movement: "
    netPredictLabel.classList.add("button-label")
    divPredictMovement.appendChild(netPredictLabel)

    const netPredictBtn = document.createElement("button");
    netPredictBtn.textContent = predictMovement
    netPredictBtn.style.cssText = `
        background-color: ${predictMovement ? GREEN : RED};
        margin-left: 5px;
    `;
    netPredictBtn.addEventListener('click', () => {
        predictMovement = !predictMovement;
        netPredictBtn.textContent = predictMovement;
        netPredictBtn.style.backgroundColor = predictMovement ? GREEN : RED;
        input.set_convar(PREDICT_MOVEMENT, predictMovement);
        storage.set("predictMovement", predictMovement);
    });
    divPredictMovement.appendChild(netPredictBtn);




    // region render latency
    const divRenderLatency = document.createElement("div");
    divRenderLatency.classList.add("button-row-div");
    divRenderLatency.style.cssText = "background-color: rgba(200, 200, 40, 0.55);";
    lobby_container.appendChild(divRenderLatency);

    const renLatencyLabel = document.createElement("p")
    renLatencyLabel.textContent = "render_latency: "
    renLatencyLabel.classList.add("button-label")
    divRenderLatency.appendChild(renLatencyLabel)

    const renderLatencyBtn = document.createElement("button");
    renderLatencyBtn.textContent = renderLatency
    renderLatencyBtn.style.cssText = `
        background-color: ${renderLatency ? GREEN : RED};
        margin-left: 5px;
    `;
    renderLatencyBtn.addEventListener('click', () => {
        renderLatency = !renderLatency;
        renderLatencyBtn.textContent = renderLatency;
        renderLatencyBtn.style.backgroundColor = renderLatency ? GREEN : RED;
        input.set_convar(REN_LATENCY, renderLatency);
        storage.set("renLatency", renderLatency);
    });
    divRenderLatency.appendChild(renderLatencyBtn);




    // region render FPS
    const divRenderFPS = document.createElement("div");
    divRenderFPS.classList.add("button-row-div");
    divRenderFPS.style.cssText = "background-color: rgba(201, 28, 224, 0.55);";
    lobby_container.appendChild(divRenderFPS);

    const renFPSLabel = document.createElement("p")
    renFPSLabel.textContent = "render_FPS: "
    renFPSLabel.classList.add("button-label")
    divRenderFPS.appendChild(renFPSLabel)

    const renFPSBtn = document.createElement("button");
    renFPSBtn.textContent = renderFPS
    renFPSBtn.style.cssText = `
        background-color: ${renderFPS ? GREEN : RED};
        margin-left: 5px;
    `;
    renFPSBtn.addEventListener('click', () => {
        renderFPS = !renderFPS;
        renFPSBtn.textContent = renderFPS;
        renFPSBtn.style.backgroundColor = renderFPS ? GREEN : RED;
        input.set_convar(REN_FPS, renderFPS);
        storage.set("renFPS", renderFPS);
    });
    divRenderFPS.appendChild(renFPSBtn);




    // region selector div


    const lobbySelectorDiv = document.createElement('div');
    lobbySelectorDiv.style.cssText = `
        right: 0%;
        top: 0%;
        z-index: 999999;
        background-color: rgba(141, 24, 187, 1);
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
        display: block;
    `;
    lobby_container.appendChild(lobbySelectorDiv);





    // region saves upgrades

    const presetUpgrades_container = document.createElement("div");
    presetUpgrades_container.style.cssText = `
        position: absolute;
        right: 0%;
        top: 0%;
        z-index: 999999;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
        display: none;
    `;
    document.body.append(presetUpgrades_container);

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "reset"
    resetBtn.classList.add("presets-header-button");
    resetBtn.addEventListener("click", () => setBuild(0))
    presetUpgrades_container.appendChild(resetBtn);

    const newPresetBtn = document.createElement("button");
    newPresetBtn.textContent = "add preset"
    newPresetBtn.classList.add("presets-header-button");

    function addPresetBuild(tankname, build) {
        const upgradeDiv = document.createElement("div");
        upgradeDiv.style.cssText = `
            border: 3px solid black;
            display: flex;
            margin-top: 10px;
            margin-bottom: 10px;
        ;`
        presetUpgrades_container.appendChild(upgradeDiv);

        const tankIconImage = document.createElement("img");
        tankIconImage.style.cssText = `
            width: 50px;
            height: 50px;
        `;
        tankIconImage.src = getTankIconLinkFor(tankname);
        upgradeDiv.appendChild(tankIconImage);

        const tankNameLabel = document.createElement("p");
        tankNameLabel.style.cssText = `
            margin-bottom: 15px;
            margin-top: 15px;
            margin-right: 10px;
            margin-left: 10px;
            color: black;
        `;
        tankNameLabel.textContent = tankname;
        upgradeDiv.appendChild(tankNameLabel);

        const slashBuildArr = [];
        for (let i = 1; i < 9; i++) {
            slashBuildArr[i-1] = count(build, i);
        }

        const buildDisplay = document.createElement("input");
        buildDisplay.value = slashBuildArr.join("/")
        buildDisplay.style.cssText = `
            margin-bottom: 15px;
            margin-top: 15px;
            margin-right: 10px;
            margin-left: 10px;
            width: ${buildDisplay.value.length * 7}px;
        `;
        buildDisplay.disabled = true;
        upgradeDiv.appendChild(buildDisplay);

        const setButton = document.createElement("button");
        setButton.style.cssText = `
            background-color: rgba(255, 255, 255, 1);
            left: 0%;
            cursor: pointer;
        `;
        setButton.textContent = "set";
        setButton.addEventListener("click", () => {
            setBuild(build)
            togglePresets();
        });
        upgradeDiv.appendChild(setButton)
    }

    for (const [tankname, build] of Object.entries(presetTankBuilds)) {
        addPresetBuild(tankname, build);
    }
    
    function togglePresets() {
        presetUpgrades_container.style.display =  
        presetUpgrades_container.style.display == "block" ? "none" : "block";
    }

    document.addEventListener('keydown', (ev) => {
        if (ev.key === TOGGLE_LOBBY_KEYBIND) {
            toggleLobby();
        } else if (ev.key == TOGGLE_PRESETS_KEYBIND) {
            togglePresets();
        }
    })

    // kill yourself
    window.console.log = consoleLog
})();