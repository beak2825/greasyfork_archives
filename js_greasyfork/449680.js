// ==UserScript==
// @name         Diep.io Server Selector + Restore Player Count
// @namespace    http://tampermonkey.net/
// @version      2.7.0
// @description  Select servers from different gamemodes and regions for Diep. Also restores player count for Diep.io.
// @author       Altanis + Bismuth
// @match        *://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449680/Diepio%20Server%20Selector%20%2B%20Restore%20Player%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/449680/Diepio%20Server%20Selector%20%2B%20Restore%20Player%20Count.meta.js
// ==/UserScript==

(async function() {
    // Special credits to Diep7444 for paving the way to an effective region changer.

    const textShadow = 'text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'
    const regions = ["lnd-sfo", "lnd-atl", "lnd-fra", "lnd-syd", "lnd-tok"];
    const modes = ["ffa", "survival", "teams", "4teams", "dom", "tag", "maze", "sandbox"];
    const colors = ["#E8B18A", "#E666EA", "#9566EA", "#6690EA", "#E7D063", "#EA6666", "#92EA66", "#66EAE6"];

    let key = 'KeyT'; // Go to https://keycode.info, press desired key, copy event.code, paste into quotes.
    let special = 'alt'; // alt, shift, ctrl, meta (Windows/Command)

    let includeUncommon = true;

    if (!['alt', 'shift', 'ctrl', 'meta'].includes(special)) special = 'alt'; // Default = Alt.

    var PLAYER_COUNT = 0;
    unsafeWindow.API_STATE = { code: 0, message: 'Connecting...'};

    const modeHTML = document.createElement("div");
    document.body.appendChild(modeHTML);
    modeHTML.innerHTML = `
<div class='parent' id='ServerSelector' style='user-select:none; position:fixed; top:25%; right:0.5%; text-align:center; width:15vw; font-family:Ubuntu; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'><div class='child' style='line-height:2vh; opacity:75%'>
        TAB to toggle server selector
        <br>
        <p style="font-size:12px;">Created by Altanis and Bismuth</p>
        <p style="font-size:12px;" id="status">Status: ${unsafeWindow.API_STATE.message}</p> 
        <hr>
    </div>
    <p style="font-size:10px">Game Mode</p>
    <button class='child' type='button' id='ffa' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[7]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>FFA</button>
    <button class='child' type='button' id='survival' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[6]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>SURV</button>
    <button class='child' type='button' id='teams' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[5]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>2TDM</button>
    <button class='child' type='button' id='4teams' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[4]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>4TDM</button>
    <button class='child' type='button' id='dom' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[3]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>DOM</button>
    <button class='child' type='button' id='tag' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[2]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>TAG</button>
    <button class='child' type='button' id='maze' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[1]}; color:#FFFFFF; font-style:normal; font-size:0.9vw;${textShadow}'>MAZE</button>
    <button class='child' type='button' id='sandbox' value='mode' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[0]}; color:#FFFFFF; font-style:normal; font-size:0.9vw;${textShadow}'>SBX</button>
    <p style="font-size:10px">Region</p>
    <button class='child' type='button' id=${regions[0]} value='region' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[3]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>SFO</button>
    <button class='child' type='button' id=${regions[1]} value='region' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[2]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>ATL</button>
    <button class='child' type='button' id=${regions[2]} value='region' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[6]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>FRA</button>
    <button class='child' type='button' id=${regions[3]} value='region' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[5]}; color:#FFFFFF; font-style:normal; font-size:0.9vw;${textShadow}'>SYD</button>
    <button class='child' type='button' id=${regions[4]} value='region' style='width:3.5vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[1]}; color:#FFFFFF; font-style:normal; font-size:0.9vw;${textShadow}'>TOK</button>
    <div class='parent' id='choice' style='user-select:none; position:relative; top:65%; left:0.5%; text-align:center; width:15vw; font-family:Ubuntu; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'>
    <br>
</div>
</div>
`
    document.getElementById('ServerSelector').style.display = 'block';
    for (let mode of modes) {
        addButtonListener(mode);
    }
    for (let region of regions) {
        addButtonListener(region);
    }

    function refreshStatus() { document.getElementById('status').innerHTML = `Status: ${unsafeWindow.API_STATE.message}`; }
    function refreshHTML() {
        let json = `<div class='parent' id='choice' style='user-select:none; position:relative; top:65%; left:0.5%; text-align:center; width:15vw; font-family:Ubuntu; color:#FFFFFF; font-style:normal; font-size:0.9vw; ${textShadow}'><p style="font-size:12px">   </p><div class='child' style='line-height:2vh; opacity:75%'> Servers for ${choices.mode} ${choices.region}<hr></div>`;
        for (let n = 0; n < serverWithoutCSS[choices.mode][choices.region].lobbies.length; n++) {
            json += `<button class='child' type='button' id='choice${n}'value='${n}'style='width:9vw; height:3vh; border-radius: 0.5vw; font-family:Ubuntu; opacity:60%; background:${colors[n % 8]}; color:#FFFFFF; font-style:normal; font-size:0.9vw; filter: ${currentServer.includes(serverWithoutCSS[choices.mode][choices.region].lobbies[n].slice(0,8))? 'brightness(100%)': 'brightness(50%)'}; ${textShadow}'>${serverWithoutCSS[choices.mode][choices.region].lobbies[n].slice(0,8)} (${serverWithoutCSS[choices.mode][choices.region].info[serverWithoutCSS[choices.mode][choices.region].lobbies[n].slice(0, 36)].total_player_count || '??'}/${serverWithoutCSS[choices.mode][choices.region].info[serverWithoutCSS[choices.mode][choices.region].lobbies[n].slice(0, 36)].max_players_direct || '??'})</button>`;
        }

        document.getElementById('choice').innerHTML = `${json}`;

        for (let n = 0; n < serverWithoutCSS[choices.mode][choices.region].lobbies.length; n++) {
            addButtonListener('choice' + n);
        }
    }

    function buttonAction(id) {
        let button = document.getElementById(id);
        if (button.value === 'mode') {
            choices.mode = id;
            fetchServer(choices.mode, choices.region, 3);
        } else if (button.value === 'region') {
            choices.region = id;
            fetchServer(choices.mode, choices.region, 3);
        } else {
            (connectTo(choices.mode, choices.region, button.value));
        }
        refreshHTML();
    }

    function addButtonListener(id) {
        document.getElementById(id).addEventListener("click", function() {
            buttonAction(id)
        });
        document.getElementById(id).addEventListener("mouseenter", function() {
            lightenColor(id)
        });
        document.getElementById(id).addEventListener("mouseleave", function() {
            resetColor(id)
        });
    }

    function lightenColor(id) {
        document.getElementById(id).style.opacity = '100%'
    }

    function resetColor(id) {
        document.getElementById(id).style.opacity = '60%'
    }

    function getServerLink(server) {
        let link = '';
        for (const char of server) {
            const code = char.charCodeAt(0);
            const value = (`00${code.toString(16)}`).slice(-2);
            link += value.split("").reverse().join("");
        }
        return link;
    }

    async function calcPlayerCount() {
        const body = JSON.parse(localStorage.lists)?.list;

        if (!body.hasOwnProperty('game_modes') && !body.hasOwnProperty('message')) {
            unsafeWindow.API_STATE.code = 2; return;
        };
        if (body.message === 'too many requests') {
            unsafeWindow.API_STATE.code = 3; return;
        };

        PLAYER_COUNT = 0;
        body.game_modes.forEach(function(g) {
            if (['dom', 'sandbox', 'survival', 'tag'].includes(g.game_mode_name) && !includeUncommon) return;
            g.regions.forEach(function(r) {
                r.lobbies.forEach(function(l) {
                    PLAYER_COUNT += l.total_player_count;
                });
            });
        });
    }

    const choices = {
        mode: modes[0],
        region: regions[0],
    }
    const serverWithoutCSS = {};

    modes.forEach(function(gamemode) {
        serverWithoutCSS[gamemode] = {};
        regions.forEach(function(region) {
            serverWithoutCSS[gamemode][region] = { lobbies: [], info: {} };
        });
    });

    unsafeWindow.API_STATE = new Proxy(unsafeWindow.API_STATE, {
        set: function(t, k, v) {
            t[k] = v;

            if ([0, 1, 2, 4].includes(v)) {
                t.message = v === 0 ? 'Connecting...' : (v === 1 ? 'Ready!' : (v === 2 ? 'Endpoint is down.' : 'Lobbies don\'t exist.'))
            } else if (v === 3) {
                const date = new Date(Date.now());

                const curMin = date.getMinutes();
                const intervals = [0, 15, 30, 45];

                intervals.sort((a, b) => {
                    return Math.abs(curMin - a) - Math.abs(curMin - b);
                });

                let retry_at = intervals[0] < curMin ? intervals[1] : intervals[0];
                let time = `${retry_at === 0 ? date.getHours() + 1 : date.getHours()}:${retry_at.length === 1 ? `0${retry_at}` : retry_at}`;
                t.message = `Ratelimited! Retry-At: ${time}.`;

                const interval = setInterval(function() {
                    let [hours, minutes] = time.split(':').map(t => parseInt(t));
                    if (new Date(Date.now()).getHours() >= hours && new Date(Date.now()).getMinutes() >= minutes) {
                        t.code = 1;
                        t.message = 'Ready!';
                        refreshStatus();
                        clearInterval(interval);
                    }
                }, 150);
            }
            refreshStatus();
            return true;
        }
    });

    if (!localStorage.lists) {
        var _resp = await fetch(`https://api-game.rivet.gg/v1/matchmaker/lobbies/list`);
        var lists = await _resp.json();

        unsafeWindow.API_STATE.code = _resp.status === 200 ? 1 : (_resp.status === 429 ? 3 : 2);

        localStorage.lists = JSON.stringify({
            timestamp: Date.now(),
            list: lists,
        });
    }

    setInterval(async function() {
        if (!localStorage.lists) {
            var _resp = await fetch(`https://api-game.rivet.gg/v1/matchmaker/lobbies/list`);
            var lists = await _resp.json();

            unsafeWindow.API_STATE.code = _resp.status === 200 ? 1 : (_resp.status === 429 ? 3 : 2);
            localStorage.lists = JSON.stringify({
                timestamp: Date.now(),
                list: lists,
            });
        }

        if (Date.now() - JSON.parse(localStorage.lists)?.timestamp > 3e5) {
            var _resp = await fetch(`https://api-game.rivet.gg/v1/matchmaker/lobbies/list`);
            var lists = await _resp.json();

            unsafeWindow.API_STATE.code = _resp.status === 200 ? 1 : (_resp.status === 429 ? 3 : 2);

            localStorage.lists = JSON.stringify({
                timestamp: Date.now(),
                list: lists,
            });

            console.log('Refreshed server list.');
        }
        if (unsafeWindow.API_STATE.code === 0) unsafeWindow.API_STATE.code = 1;
    }, 5000);

    const GAMEMODES_MAP = [];
    const REGIONS_MAP = [];

    try {
        JSON.parse(localStorage.lists).list.game_modes.forEach(function(data) {
            GAMEMODES_MAP.push(data.game_mode_name);
            if (REGIONS_MAP.length === 0) {
                data.regions.forEach(function(data2) {
                    REGIONS_MAP.push(data2.region_name);
                });
            }
        });
    } catch (er) {
        alert('API of Rivet is down!');
        unsafeWindow.API_STATE.code = 2;
    }

    var do_connect = false;
    unsafeWindow.currentServer = '';
    var override = false;
    async function fetchServer(mode, region) {
        const body = JSON.parse(localStorage.lists)?.list;

        if (!body.hasOwnProperty('game_modes') && !body.hasOwnProperty('message')) {
            unsafeWindow.API_STATE.code = 2;
            return;
        }
        if (body.message === 'too many requests') {
            unsafeWindow.API_STATE.code = 3;
            return;
        }

        calcPlayerCount();

        const lobbies = body.game_modes[GAMEMODES_MAP.indexOf(mode)]?.regions[REGIONS_MAP.indexOf(region)]?.lobbies;

        if (!lobbies) {
            unsafeWindow.API_STATE.code = 4;
            return;
        };

        lobbies.forEach(function({
            lobby_id, total_player_count, max_players_direct
        }) {
            serverWithoutCSS[mode][region].info[lobby_id] = { total_player_count, max_players_direct };

            if (!serverWithoutCSS[mode][region].lobbies.some(function(host) {
                return host === `${lobby_id}-80.lobby.${region}.hiss.io:443`
            })) {
                serverWithoutCSS[mode][region].lobbies.push(`${lobby_id}-80.lobby.${region}.hiss.io:443`);
            }
        });
        unsafeWindow.API_STATE.code = 1;

        refreshHTML();
    }

    function appendServers(mode, region) {
        fetchServer(mode, region);
    }

    function connectTo(mode, region, number) {
        if (!serverWithoutCSS[mode][region].lobbies[number]) return;
        currentServer = "wss://" + serverWithoutCSS[mode][region].lobbies[number];
        do_connect = true;
        unsafeWindow.input.setGameMode('ffa');
        unsafeWindow.input.setRegion('tok');

        unsafeWindow.input.setGameMode(mode);
        unsafeWindow.input.setRegion(region);
    }
    unsafeWindow.servers = serverWithoutCSS;

    /*

            return socket;
    */

    var _WebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = function(wss) {
        let triggered = do_connect;

        if (do_connect) wss = unsafeWindow.currentServer;
        unsafeWindow.currentServer = wss;

        const socket = new _WebSocket(wss);
        socket.addEventListener('error', function(er) {
            console.log(er);
            if (triggered)
                alert('Connection to lobby failed, redirecting...'); // This is most likely due to the target server closing or reaching player limit.
        });

        do_connect = false;
        return socket;
    };

    (function(realHTMLInputElement) {
        Object.defineProperty(HTMLTextAreaElement.prototype, 'value', {
            set: function(value) {
                if (!value.startsWith('diep.io/#')) return realHTMLInputElement.set.call(this, value);

                let [serverID, party] = value.replace('diep.io/#', '').split('00');
                serverID = getServerLink(currentServer.split("://")[1].split("-80.lobby")[0]).toUpperCase();
                value = `https://diep.io/#${serverID}00${party}`;

                return realHTMLInputElement.set.call(this, value);
            },
        });
    }(Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')));

    document.body.onkeydown = function(e) {
        if (String.fromCharCode(e.keyCode) === '\t') {
            if (document.getElementById('ServerSelector').style.display === "none") {
                document.getElementById('ServerSelector').style.display = "block";
                document.getElementById('choice').style.display = "block";
            } else {
                document.getElementById('ServerSelector').style.display = "none";
                document.getElementById('choice').style.display = "none";
            }
        }

        if (e.code === key && e[`${special}Key`]) {
            includeUncommon = !includeUncommon;
            calcPlayerCount();
        }
    }

    calcPlayerCount();
    setInterval(calcPlayerCount, 60000);

    const crx = CanvasRenderingContext2D.prototype;

    crx.fillText = new Proxy(crx.fillText, {
        apply(f, _this, args) {
            if (args[0].includes('ms lnd'))
                args[0] += ` ‖ ${PLAYER_COUNT} players`;
            return f.apply(_this, args);
        }
    });

    crx.strokeText = new Proxy(crx.strokeText, {
        apply(f, _this, args) {
            if (args[0].includes('ms lnd'))
                args[0] += ` ‖ ${PLAYER_COUNT} players`;
            return f.apply(_this, args);
        }
    });

    crx.measureText = new Proxy(crx.measureText, {
        apply(f, _this, args) {
            if (args[0].includes('ms lnd'))
                args[0] += ` ‖ ${PLAYER_COUNT} players`;
            return f.apply(_this, args);
        }
    });
})();