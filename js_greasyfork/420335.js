// ==UserScript==
// @name         Neocortex+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Neocortex additions
// @author       Johannes
// @match        https://xero.gg/neocortex/*
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/420335/Neocortex%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/420335/Neocortex%2B.meta.js
// ==/UserScript==


//// Global Properties
// Definitions
let NP = {

    URL: "https://xero.gg/neocortex",
    mcHWIDExceptions: [
        // Exception: Internet Café
        "1300b0f93efd30c63d33bdfc7009eb77142cb7e2eb1344f3c21717d39d0275ed",
        "bc2522fcf0c1909700e3e7c4e22c5bbfdc74322fb4af6c1110d8dccdd7272e26",
        "c5e915cac82a151c05c53c54cda4e0f1f97ef3e47ea36f7d78cf8fc4ea17622a",
        "88aa26cf3530e1e6e1472b2b5bfc26a0557e31623b2e020df3473ee5179529f0",
        "e789c5c7e5526c73ca1a299c5c3615d35bf1cb0700ad8f2dd02918a01c8baf53",
        // Exception: ?
        "4f34194e80545b572be095c2a56d3acad6ed7c0717248551863eb3b6f47f7066"
    ],

    //// Methods
    // Auxiliary
    fetchAndParse: async (path) => {
        return fetch(`${NP.URL}${path}`).then(response => {
            return response.text();
        }).then(text => {
            return $(text);
        });
    },
    // Implementation: Multi-Clienting
    checkLiveRoomsForTooling: async (channelID) => {

        // Get rooms
        const rooms = await NP.getLiveRooms(channelID);

        // Go through rooms
        for (const room of rooms){

            // INFO
            console.log(`%cChecking room: (${room.ID}) ${room.number}...`, "font-weight: 900; font-size: 16px");
            
            // Get players
            const players = await NP.getPlayersFromLiveRoom(room.ID);

            // Go through player
            for (const player of players){

                // Breaker
                if (!(player.HP && player.SP)) continue;

                // INFO
                console.log(`Checking player (${player.ID}) ${player.name} ${player.skill} HP: ${player.HP.max} SP: ${player.SP.max}`);

                // Determine limits
                let limitHP = 100;
                let limitSP = channelID == XERO_CHANNELS.SWORD ? 120 : 110;
                switch (player.skill){
                    case "HP Mastery":
                        limitHP += 30;
                        limitSP += 1;
                        break;
                    case "Skill Mastery":
                        limitSP += 40;
                        break;
                    case "Dual Mastery":
                        limitHP += 20;
                        limitSP += 20;
                        break;
                    default:
                        
                        // INFO
                        console.log(`%cPlayer wears unhandled skill: ${player.skill}`, "color:darkOrange");
                        continue;
                }

                // Check limits
                if (player.HP.max > limitHP)
                    console.log(`%cPlayer wears ${player.skill} but has ${player.HP.max} HP!`, "color:red");
                if (player.SP.max > limitSP)
                    console.log(`%cPlayer wears ${player.skill} but has ${player.SP.max} SP!`, "color:red");
                
            }
        }
    },
    checkLiveRoomsForMC: async (channelID) => {

        // Get rooms
        const rooms = await NP.getLiveRooms(channelID);

        // Go through rooms
        let result = [];
        for (const room of rooms){

            // INFO
            console.log(`%cChecking room: (${room.ID}) ${room.number}`, "font-weight: 900; font-size: 16px");
            
            // Get players
            const players = await NP.getPlayersFromLiveRoom(room.ID);

            // Check players for Multi-Clienting
            const criminals = await NP.checkOnlinePlayersForMC(players);
            if (criminals.length){
                result.push(criminals);
            }

        }

        // Exit
        return result;
    },
    checkOnlinePlayersForMC: async (targets) => {

        // Go through targets
        const result = [];
        for (const target of targets){

            // INFO
            console.log(`Checking target: (${target.ID}) ${target.name}`);

            // Check target's login
            const targetLLL = await NP.getPlayerLastLauncherLogin(target.ID);

            // Target's HWID must not be an exception
            if (NP.mcHWIDExceptions.includes(targetLLL.HWID)) continue;

            // Go through players
            const criminals = [];
            const players = await NP.getPlayersOnHWID(targetLLL.HWID);
            for (const player of players){

                // Target must not be compared against itself
                if (player.ID == target.ID) continue;

                // Check player state
                const playerState = await NP.getPlayerState(player.ID);

                // Player must be online
                if (/Offline/.test(playerState)) continue;

                // Check player location
                const playerLLL = await NP.getPlayerLastLauncherLogin(player.ID);

                // Player must have the same location as the target
                // Player's HWID must match the target's HWID
                if (playerLLL.location == targetLLL.location
                    && playerLLL.HWID == targetLLL.HWID){
                    
                    // Multi-clienting detected
                    console.log(`%cCaught multi-clienting: ${target.name} - ${player.name}`, "color:red");

                    // Pack information
                    criminals.push(player);
                    
                } 
                
            }

            // Check if any criminals were found
            if (criminals.length){
                criminals.unshift(target);
                result.push(criminals);
            }
        
        }

        // Exit
        return result;
    },
    checkOfflinePlayersForMC: async (targets) => {

        // Go through targets
        let result = [];
        for (const target of targets){

        }
    },
    // Implementation: Fetching information
    getPlayersFromLiveRoom: async (roomID) => {
        return await NP.fetchAndParse(`/game/room/${roomID}/live`).then(parsed => {

            // Live pages have three tables, we only need the first two
            const tables = [...parsed.find("table")];
            tables.pop();

            // Get players from tables
            const players = [];
            for (const table of tables){
                const rows = table.children[1].children;

                for (const row of rows){

                    // Rows can be empty
                    if (row.children.length < 3){
                        continue;
                    } else {

                        // Extract player ID from href
                        const nameContainer = row.children[2];
                        const href = nameContainer.firstElementChild.getAttribute("href");
                        const split = href.split("/");
                        const ID = split[split.length - 1];

                        let player = {
                            ID: ID,
                            name: nameContainer.firstElementChild.innerText.trim(),
                            skill: null,
                            HP: null,
                            SP: null,
                        };

                        // Extract skill
                        const skillContainer = row.children[4];
                        if (skillContainer.children.length){

                            // Get title from image
                            const img = skillContainer.firstElementChild;
                            if (img.hasAttribute("title")){
                                player.skill = img.getAttribute("title");
                            } else if (img.hasAttribute("data-original-title")){
                                player.skill = img.getAttribute("data-original-title");
                            }
                        }

                        // Extract HP/SP
                        const pBars = [...$(nameContainer).find(".progress")];
                        if (pBars.length == 2){

                            const matchHP = pBars[0].getAttribute("title").match(REGEX.HPSP);
                            player.HP = {
                                current: matchHP[2],
                                max: matchHP[3],
                            };
                            const matchSP = pBars[1].getAttribute("title").match(REGEX.HPSP);
                            player.SP = {
                                current: matchSP[2],
                                max: matchSP[3]
                            };
                        }

                        // Pack information
                        players.push(player);
                    }
                }
            }

            // Exit
            return players;
        });
    },
    getLiveRooms: async (channelID) => {
        let rooms = [];
        
        // Go through each page of rooms on the channel
        for (let page = 1; page < 10; page++){

            // Get rooms for current page
            const roomsOnPage = await NP.fetchAndParse(`/game/rooms?type=live&channelId=${channelID}&page=${page}`).then(parsed => {

                // Get related information
                const information = [...parsed.find("tr")];
                information.shift();

                // Pack information
                const result = [];
                for (const entry of information){
                    const children = entry.children;
    
                    result.push({
                        number: children[0].innerText.trim(),
                        ID: children[1].innerText.trim()
                    });
                }

                // Return
                return result;
            });

            // Breaker
            if (roomsOnPage.length){

                // Append result
                rooms = rooms.concat(roomsOnPage);

                // Next page
                continue;

            } else {
                
                // Break
                return rooms;
            }
        }

        // Exit
        return rooms;
    },
    getDailyRankingPlayers: async () => {
        return await NP.fetchAndParse(`/players?type=game_ranking`).then(parsed => {

            // Get related information
            const information = [...parsed.find("tr")];
            information.shift();

            // Pack information
            const result = [];
            for (const entry of information){
                const children = entry.children;

                result.push({
                    ID: children[1].innerText.trim(),
                    name: children[2].innerText.trim()
                });
            }

            // Exit
            return result;
        });
    },
    getPlayerState: async (playerID) => {
        return await NP.fetchAndParse(`/player/${playerID}`).then(parsed => {

            // Get related information
            const information = parsed.find("td");

            // Exit
            return information[9].innerText.trim();
        });
    },
    getPlayerLastLauncherLogin: async (playerID) => {
        return await NP.fetchAndParse(`/player/${playerID}/trace/launcher_success/historical`).then(parsed => {

            // Exit
            const information = [...parsed.find("td")];
            return {
                HWID: information[0].innerText.trim(),
                location: information[1].innerText.trim()
            };
        });
    },
    getPlayersOnHWID: async (HWID) => {
        return await NP.fetchAndParse(`/lookup/hwid/${HWID}`).then(parsed => {

            // Get related information
            const information = [...parsed.find("tr")];
            information.shift();

            // Pack information
            const result = [];
            for (const entry of information){
                const children = entry.children;

                result.push({
                    ID: children[1].innerText.trim(),
                    name: children[2].innerText.trim()
                });
            }

            // Exit
            return result;
        });
    }
}
// Intervals
const intervals = {
    attach: 0
};
// Constants
const REGEX = {
    HPSP: /(HP|SP): ([0-9]+\.[0-9]+|[0-9]+) \/ ([0-9]+\.[0-9]+|[0-9]+)/
};
const AREA_CNAME = "form-inline";
const CONTROL_CNAME = "form-control";

const LS_AUTO_REFRESH = "auto_refresh";

const VALID_SIZES = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const XERO_COLORS = [
    {R: 255, G: 255, B: 255}, // White
    {R: 0,   G: 202, B: 255}, // Xero Blue
    {R: 255, G:  40, B:  93}, // Xero Red
    {R: 255, G: 255, B:   0}, // GM Yellow
    {R: 255, G:   0, B: 255}  // Whisper Magenta
];
const XERO_CHANNELS = {
    UNLIMITED: 1,
    SWORD: 2
};


(function() {
    'use strict';

    //// Methods
    // Implementation: Broadcast+
    const broadcast_plus = {
        resize: function(){
            this.style.width = ((this.value.length * 8) + 1) + "px";
        }, 
        attach: function(){
    
            // Hide original input
            const input = $("#gameRoomBroadcastMessage");
            input.css("display", "none");
    
            const group = $(".form-inline:last .form-group:nth-last-child(2)");
            const control = document.createElement("div");
            control.id = "control";
            control.className = CONTROL_CNAME;
            group[0].insertBefore(control, group[0].lastChild);
            $(control)
                .css("display", "inherit")
                .css("text-align", "left")
                .css("padding", "1px")
                .css("height", "28px")
                .css("min-width", "500px");
    
            // Extra space
            const space = $(".form-inline:last").parent();
            const area = document.createElement("div");
            area.className = AREA_CNAME;
            space.append(area);
    
            // Size dropdown
            const dropdown = document.createElement("select");
            dropdown.className = CONTROL_CNAME;
            area.append(dropdown);
            $(dropdown)
                .css("height", "auto")
                .css("padding", "3px");
    
            for (const size of VALID_SIZES){
                dropdown.appendChild(
                    new Option(size, `{F-2002_${size}}`)
                );
            }
    
            // Color boxes
            for (const color of XERO_COLORS){
                const rgb = `rgb(${color.R}, ${color.G}, ${color.B})`;
                const box = document.createElement("div");
                box.className = CONTROL_CNAME;
                area.append(box);
                $(box)
                    .css("background-color", rgb)
                    .css("height", "auto")
                    .on("click", function(){
                        
                        const container = document.createElement("div");
                        container.value = color;
                        const input = document.createElement("input");
                        container.appendChild(input);
                        control.appendChild(container);
                        $(container)
                            .css("display", "flex")
                            .css("background-color", "#52575c")
                        $(input)
                            .css("color", rgb)
                            .css("background-color", "#52575c")
                            .css("border-style", "hidden")
                            .css("border-radius", "2px")
                            // Dynamic width text input
                            .css("width", "120px")
                            .focusout(this.resize);
    
                        // Remove button
                        const button = document.createElement("div");
                        button.innerText = "❌";
                        container.appendChild(button);
                        $(button)
                            .on("click", function(){
                                control.removeChild(container);
                            })
    
                    });
    
            }
    
            // Update hidden input on click
            $(".gameRoomBroadcast").click(function(){
                let result = dropdown.value;
    
                // Go through inputs
                for (const container of control.childNodes){
    
                    // Build message
                    const color = container.value;
                    result += `{CB-${color.R},${color.G},${color.B},255}` + container.firstChild.value;
                }
    
                // Override hidden input value
                input.val(result);
            });

            // DEBUG
            console.log("Broadcast+ attached!");
    
        }
    };
    // Implementation: Minimap+
    const minimap_plus = {
        attach: function(enabled){

            const first_floater = $("#neocortex-content .float-right").first();
            const auto_refresh_button = document.createElement("button");
            auto_refresh_button.className = `btn btn-${enabled ? "success" : "danger"} btn-sm refresh`;
            auto_refresh_button.innerText = "Auto Refresh";
            $(auto_refresh_button).on("click", {enabled: enabled}, function(event){

                // Toggle
                if (event.data.enabled){
                    localStorage.removeItem(LS_AUTO_REFRESH);
                } else {
                    localStorage.setItem(LS_AUTO_REFRESH, true);
                }
            });

            // The 500ms timer
            if (enabled){
                setTimeout(function(enabled){

                    // Find refresh button and jam it
                    if (enabled){
                        $(".refresh").first().click();
                    }

                }, 500, enabled);
            }

            // Attach button
            first_floater.append(auto_refresh_button);

        }
    }
    // Implementation: MutationObserver
    const observe = function(mutations, _){
        for (const mutation of mutations) {
            switch (mutation.type){
                case "childList":

                    // We are interested in added nodes
                    for (const node of mutation.addedNodes){

                        // No bullshit (eg. text), only HTMLElement
                        if (node instanceof HTMLElement){

                            if (node.hasAttribute("id")){
                                switch (node.getAttribute("id")){
                                    case "game-room-stuff":

                                        // Broadcast+
                                        if (node.hasAttribute("data-room-id"))
                                            broadcast_plus.attach();

                                        // Minimap+
                                        minimap_plus.attach(
                                            localStorage.getItem(LS_AUTO_REFRESH)
                                        );

                                        break;
                                }
                            }
                            
                        }
                    } break;

            }
        }
    }
    // Execution
    const attach = function(){
        try {

            // Build MutationObserver
            const content = $("#neocortex-content")[0];
            const config = {
                attributes: true,
                childList: true,
                subtree: true
            };
            const observer = new MutationObserver(observe);

            // Start observing
            observer.observe(content, config);

        } catch (error) {
            console.error(error);
        } finally {

            // Success: no need to attach again
            // Exception: no need to try again
            clearInterval(intervals.attach);
        }
    }
    const main = function(){
        intervals.attach = setInterval(attach, 100);
    };

    // Run
    main();

    // Export
    Object.assign(unsafeWindow, {
        NP: NP
    });

})();