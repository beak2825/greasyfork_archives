// ==UserScript==
// @name         Bonk Better Spawns
// @namespace    https://greasyfork.org/en/users/1272759
// @version      1.41
// @description  Helps to change the initial position of the player without using teams and without opening editor.
// @author       Apx
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518494/Bonk%20Better%20Spawns.user.js
// @updateURL https://update.greasyfork.org/scripts/518494/Bonk%20Better%20Spawns.meta.js
// ==/UserScript==

const scriptName = 'Bonk Better Spawns';

function injector (src) {
    let newSrc = src;
    window.BBSpawns = {
        avatarData: [],
        spawnId: -1,
        playersSelected: [],
        spawnSelected: -1,
        spawnPointData: [],
        lastMap: null,
        keepPositions: [],
        spawnIdFJ: -1,
        blankMap: {v: 1, s: { re: false, nc: false, pq: 1, gd: 25, fl: false }, physics: { shapes: [], fixtures: [], bodies: [], bro: [], joints: [], ppm: 12 }, spawns: [], capZones: [], m: { a: "noauthor", n: "noname", dbv: 2, dbid: -1, authid: -1, date: "", rxid: 0, rxn: "", rxa: "", rxdb: 1, cr: [], pub: false, mo: "" } },
        map: () => {return window.BBSpawns.blankMap},
        savedSpawnPointData: {},
        mapSelected: null,
    }

    const PIXI = window.PIXI;
    const spawnRenderer = PIXI.autoDetectRenderer({width: 36, height: 36, antialias: true, transparent: true});
    const indicatorRenderer = PIXI.autoDetectRenderer({width: 24, height: 24, antialias: true, transparent: true});

    let BBSpawnsCSS = document.createElement('style');
    BBSpawnsCSS.innerHTML = `
	#bbspawns {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	#bbs_container {
		width: fit-content;
		height: fit-content;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
	#bbs {
		width: 750px;
		height: 500px;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: space-between;
    }
	#bbs_shadow {
		outline: 3000px solid rgba(0, 0, 0, 0.50);
	}
		#bbs_leftbox {
		width: 200px;
		position: relative;
		background-color: #cfd8dc;
		border-radius: 7px;
		height: 100%;
	}
	#bbs_midbox {
		width: 200px;
		position: relative;
		background-color: #cfd8dc;
		border-radius: 7px;
		height: 100%;
	}
	#bbs_rightbox {
		width: calc(100% - 435px);
		position: relative;
		background-color: #cfd8dc;
		border-radius: 7px;
		height: 100%;
	}/*
	.newbonklobby_playerentry_selected {
		width: 100%;
		height: 47px;
		font-family: "futurept_b1";
		position: relative;
		font-size: 15px;
		cursor: pointer;
		box-sizing: border-box;
		border-left: 4px solid #cfd8dc;
		border-right: 4px solid #cfd8dc;
		border-top: 4px solid #cfd8dc;
		background-color: #55bad430 !important;
		vertical-align: top;
	}*/
	.newbonklobby_playerentry_indicator {
		width: 12px;
		height: 12px;
		position: absolute;
		right: 2px;
		top: 2px;
	}
	.bbs_entry {
		width: 100%;
		height: 47px;
		font-family: "futurept_b1";
		position: relative;
		font-size: 15px;
		cursor: pointer;
		box-sizing: border-box;
		border-left: 4px solid #cfd8dc;
		border-right: 4px solid #cfd8dc;
		border-top: 4px solid #cfd8dc;
		vertical-align: top;
		overflow-x: hidden;
		background-color: rgba(0, 0, 0, 0.02);
	}
	.bbs_entry_highlighted {
		width: 100%;
		height: 47px;
		font-family: "futurept_b1";
		position: relative;
		font-size: 15px;
		cursor: pointer;
		box-sizing: border-box;
		border-left: 4px solid #cfd8dc;
		border-right: 4px solid #cfd8dc;
		border-top: 4px solid #cfd8dc;
		background-color: #55bad430 !important;
		vertical-align: top;
		overflow-x: hidden;
		background-color: rgba(0, 0, 0, 0.02);
	}
	#bbs_rightbox_buttoncontainer {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 95%;
		margin: auto;
		position: absolute;
		bottom: 12px;
		left: 0;
		right: 0;
	}
	.bbs_rightbox_bottombutton {
		display: inline-block;
		height: 35px;
		line-height: 35px;
		flex-basis: 65px;
		flex-grow: 0.2;
	}
	.bbs_entry:hover {
		background-color: rgba(100,100,100,0.10);
	}
	.bbs_spawnentry_name {
		color: #000000;
		position: absolute;
		left: 42px;
		top: 2px;
		pointer-events: none;
	    white-space: pre;
	}
	.bbs_spawnentry_id_forjoiningplayers {
		color: #ab00ab;
		font-weight: bold;
		position: absolute;
		left: 42px;
		bottom: 2px;
		pointer-events: none;
	}
	.bbs_elementcontainer {
		width: 100%;
		position: absolute;
		overflow-y: auto;
		top: 34px;
	}
	.bbs_scroll {
		overflow-y: auto;
	}
	.bbbs_scroll::-webkit-scrollbar-track {
		background-color: #cfd8dc;
	}
	.bbs_scroll::-webkit-scrollbar-thumb {
		background-color: #757575;
	}
	.bbs_scroll::-webkit-scrollbar {
		height: 12px;
		width: 0.6em;
		background-color: #cfd8dc;
	}
	#bbs_playerentry_elementcontainer {
		height: calc(100% - 119px);
	}
	#bbs_spawnentry_elementcontainer {
		height: calc(100% - 140px);
	}
	#bbs_spawncount {
		color: #efefef;
		width: 70%;
		position: absolute;
		top: 42px;
		text-align: center;
		height: 20px;
		background-color: rgba(58, 84, 98, 0.4);
		border-radius: 4px;
		left: 0;
		right: 0;
		margin: auto;
		font-family: 'futurept_b1';
		white-space: pre;
		overflow-x: clip;
	}
	.bbs_mapimage {
		width: calc(100% - 20px);
		margin: 10px;
		margin-top: 44px;
		position: relative;
	}
	.bbs_bottomButtoncontainer {
		width: 90%;
		position: absolute;
		bottom: 0;
		height: fit-content;
		padding: 10px 5% 0 5%;
	}
	.bbs_bottomButton {
		margin-bottom: 4px;
	}
	#bbs_maplist {
		position: relative;
		height: calc(100% - 317px);
		margin: 10px;
		margin-top: 0;
		background-color: rgba(58, 58, 58, 0.14);
		border: 1px solid #989898;
		overflow-y: auto;
	}
	#bbs_maplist_statustext {
		text-align: center;
		font-family: futurept_medium;
		color: #4e4e4e;
		width: 100%;
		top: calc(50% - 10.5px);
		position: absolute;
	}
	.bbs_maplist_mapdiv {
		position: relative;
		width: calc(100% - 10px);
		height: 80px;
		margin: 5px;
		left: 0;
		right: 0;
		background-color: #cfd8dc;
	}
	.bbs_maplist_mapdiv:hover {
		background-color: rgba(100,100,100,0.10);
	}
	.bbs_maplist_mapdiv_highlighted {
		background-color: #afcfdd !important;
	}
	.bbs_maplist_mapdiv_name {
		position: absolute;
		font-family: futurept_medium;
		font-style: italic;
		color: #3a4b4e;
		font-size: 17px;
		left: 10px;
		top: 5px;
	}
	.bbs_maplist_mapdiv_author {
		position: absolute;
		font-family: futurept_medium;
		color: #4d4e4ea2;
		font-size: 15px;
		left: 15px;
		top: 28px;
	}
	.bbs_maplist_mapdiv_mode {
		position: absolute;
		font-family: futurept_medium;
		color: #4d4e4ea2;
		font-size: 13px;
		left: 15px;
		top: 55px;
	}
	.bbs_maplist_mapdiv_map {
		position: absolute;
		background-color: #4d4e4e12;
		font-size: 13px;
		right: 5px;
		top: 5px;
		aspect-ratio: 73 / 50;
		height: calc(100% - 10px);
	}
	`;

    document.getElementsByTagName('head')[0].appendChild(BBSpawnsCSS);
    let BBSpawnsMenu = document.createElement('div');
    document.getElementById('newbonkgamecontainer').appendChild(BBSpawnsMenu);
    BBSpawnsMenu.outerHTML = `
	<div id="bbspawns" style="visibility: hidden; opacity: 0; z-index: 2;">
		<div id="bbs_shadow"></div>
		<div id="bbs_container">
			<div id="bbs">
				<div id="bbs_leftbox">
					<div class="windowTopBar windowTopBar_classic">Players</div>
					<div id="bbs_playerentry_elementcontainer" class="bbs_elementcontainer bbs_scroll"></div>
					<div class="bbs_bottomButtoncontainer">
						<div id="bbs_applybutton" class="brownButton brownButton_classic buttonShadow bbs_bottomButton">Apply</div>
						<div id="bbs_clearplayerpointbutton" class="brownButton brownButton_classic buttonShadow bbs_bottomButton">Clear Spawn Point</div>
						<div id="bbs_clearplayerselectionbutton" class="brownButton brownButton_classic buttonShadow bbs_bottomButton">Clear Selection</div>
					</div>
				</div>
				<div id="bbs_midbox">
					<div class="windowTopBar windowTopBar_classic">Spawns</div>
					<div id="bbs_spawnentry_elementcontainer" class="bbs_elementcontainer bbs_scroll"></div>
                    <div id="bbs_spawncount" style"display: none;"></div>
					<div class="bbs_bottomButtoncontainer">
						<div id="bbs_forjoiningbutton" class="brownButton brownButton_classic buttonShadow">For Joining Players</div>
						<div id="bbs_clearspawnidbutton" class="brownButton brownButton_classic buttonShadow bbs_bottomButton">Clear</div>
						<div id="bbs_foreveryonebutton" class="brownButton brownButton_classic buttonShadow bbs_bottomButton">For Everyone In The Room</div>
						<div id="bbs_clearspawnselectionbutton" class="brownButton brownButton_classic buttonShadow bbs_bottomButton">Clear Selection</div>
					</div>
				</div>
				<div id="bbs_rightbox">
					<div class="windowTopBar windowTopBar_classic">Map Previev</div>
					<div id="bbs_maplist" class="bbs_scroll">
						<div id="bbs_maplist_statustext">No maps yet</div>
					</div>
					<div id="bbs_rightbox_buttoncontainer">
						<div id="bbs_loadbutton" class="bbs_rightbox_bottombutton brownButton brownButton_classic buttonShadow bbs_bottomButton">Load</div>
						<div id="bbs_deletebutton" class="bbs_rightbox_bottombutton brownButton brownButton_classic buttonShadow bbs_bottomButton">Delete</div>
						<div id="bbs_deleteallbutton" class="bbs_rightbox_bottombutton brownButton brownButton_classic buttonShadow bbs_bottomButton">Delete All</div>
					</div>
		    	</div>
			</div>
			<div id="bbs_closebutton" class="windowCloseButton brownButton brownButton_classic buttonShadow"></div>
		</div>
	</div>
	`;

    // draw spawn (as avatar)
    const drawSpawn = spawnData => {
        let teams = [spawnData.f,spawnData.r,spawnData.b,spawnData.gr,spawnData.ye, (spawnData.f + spawnData.r + spawnData.b + spawnData.gr + spawnData.ye)];
        let spawn = new PIXI.Graphics();
        let mask = new PIXI.Graphics();
        spawn.beginFill(0x91ada7);
        spawn.drawCircle(0,0,15,1);
        spawn.x = 18;
        spawn.y = 18;
        spawn.endFill();
        for(let i = 0; i < teams[5]; i++){
            let color;
            if(teams[0]){
                teams[0] = false;
                color = 0x1abc9c;
            }
            else if(teams[1]){
                teams[1] = false;
                color = 0xd32f2f;
            }
            else if(teams[2]){
                teams[2] = false;
                color = 0x448aff;
            }
            else if(teams[3]){
                teams[3] = false;
                color = 0x177819;
            }
            else if(teams[4]){
                teams[4] = false;
                color = 0xffd90e;
            }
            spawn.beginFill(color);
            spawn.drawRect(((1/teams[5])*i - 0.5)*30,-15,30,30);
            spawn.endFill();
            spawn.rotation = 45 * (Math.PI/180);
        }
        mask.beginFill(0);
        mask.drawCircle(18,18,15,1);
        spawn.mask = mask;
        let renderer = spawnRenderer;
        renderer.render(spawn);
        return renderer.extract.image();
    }

    // draw indicator
    window.BBSpawns.drawIndicator = (element, id) => {
        if(!element || window.BBSpawns.spawnPointData[id] == undefined || !window.BBSpawns.map().spawns[window.BBSpawns.spawnPointData[id]] || window.BBSpawns.tools.networkEngine.hostID != window.BBSpawns.tools.networkEngine.getLSID()) return;
        const teamColor = spawn => {
            if(spawn.r) return 0xd32f2f;
            if(spawn.b) return 0x448aff;
            if(spawn.gr) return 0x177819;
            if(spawn.ye) return 0xffd90e;
            return 0x1abc9c;
        }
        let renderer = indicatorRenderer;
        let container = new PIXI.Container();
        let circle = new PIXI.Graphics();
        circle.beginFill(teamColor(window.BBSpawns.map().spawns[window.BBSpawns.spawnPointData[id]]));
        circle.drawCircle(12,12,12);
        circle.endFill();
        container.addChild(circle);
        let text = new PIXI.Text(window.BBSpawns.spawnPointData[id] + 1, {
            fontFamily: "futurept_medium",
            fontSize: 20,
            fill: 0xffffff,
        });
        text.transform.position.x = -text.width / 2 + 12;
        text.transform.position.y = -text.height / 2 + 12;
        container.addChild(text);
        renderer.render(container);
        let extracted = renderer.extract.image();
        extracted.className = "newbonklobby_playerentry_indicator";
        element.appendChild(extracted);
    }

    //*only maps in which you have saved any\n spawn point data will appear here.*
    document.getElementById("bbs_maplist_statustext").onmouseover = () => {
        document.getElementById("bbs_maplist_statustext").textContent = `*only maps in which you have saved any\n spawn point data will appear here.*`;
    }

    document.getElementById("bbs_maplist_statustext").onmouseout = () => {
        document.getElementById("bbs_maplist_statustext").textContent = `No maps yet`;
    }

    window.BBSpawns.exitMenu = () => {
        if(window.BBSpawns.lobby) window.BBSpawns.lobby.updatePlayers();
        window.anime({
            targets: document.getElementById("bbspawns"),
            opacity: "0",
            autoplay: true,
            duration: 130,
            easing: "easeOutCubic",
            complete: () => {
                document.getElementById("bbspawns").style.visibility = "hidden";
            }
        });
        clearChildren(document.getElementById("bbs_playerentry_elementcontainer"));
        clearChildren(document.getElementById("bbs_spawnentry_elementcontainer"));
    }

    // Exit Button
    document.getElementById("bbs_closebutton").onclick = window.BBSpawns.exitMenu;

    // Apply
    document.getElementById("bbs_applybutton").onclick = () => {
        if(window.BBSpawns.spawnSelected == -1) return;
        for(let i = 0; i < window.BBSpawns.playersSelected.length; i++) {
            window.BBSpawns.spawnPointData[window.BBSpawns.playersSelected[i]] = window.BBSpawns.spawnSelected;
            window.BBSpawns.keepPositions[window.BBSpawns.playersSelected[i]] = window.BBSpawns.spawnSelected;
        }
        window.BBSpawns.spawnSelected = -1;
        window.BBSpawns.playersSelected = [];
        window.BBSpawns.updateEntries();
    }
    // Clear Spawn Point
    document.getElementById("bbs_clearplayerpointbutton").onclick = () => {
        for(let i = 0; i < window.BBSpawns.playersSelected.length; i++){
            window.BBSpawns.spawnPointData[window.BBSpawns.playersSelected[i]] = null;
            window.BBSpawns.keepPositions[window.BBSpawns.playersSelected[i]] = null;
        }
        let players = document.getElementById("bbs_playerentry_elementcontainer").children;
        window.BBSpawns.playersSelected = [];
        window.BBSpawns.updateEntries();
    }

    // Clear Player Selection
    document.getElementById("bbs_clearplayerselectionbutton").onclick = () => {
        window.BBSpawns.playersSelected = [];
        window.BBSpawns.updateEntries();
    }

    // Spawn Point For Everyone Joining Room
    document.getElementById("bbs_forjoiningbutton").onclick = () => {
        window.BBSpawns.spawnIdFJ = window.BBSpawns.spawnSelected;
        window.BBSpawns.spawnSelected = -1;
        window.BBSpawns.updateEntries();
    }

    // Clear Spawn Point For Everyone Joining Room
    document.getElementById("bbs_clearspawnidbutton").onclick = () => {
        window.BBSpawns.spawnIdFJ = -1;
        window.BBSpawns.spawnSelected = -1;
        window.BBSpawns.updateEntries();
    }

    // Spawn Point For Everyone
    document.getElementById("bbs_foreveryonebutton").onclick = () => {
        if(window.BBSpawns.spawnSelected == -1) return;
        for(let i = 0; i < window.BBSpawns.players.length; i++){
            if(window.BBSpawns.players[i]){
                window.BBSpawns.spawnPointData[i] = window.BBSpawns.spawnSelected;
                window.BBSpawns.keepPositions[i] = window.BBSpawns.spawnSelected;
            }
        }
        window.BBSpawns.spawnSelected = -1;
        window.BBSpawns.playersSelected = [];
        window.BBSpawns.updateEntries();
    }

    document.getElementById("bbs_clearspawnselectionbutton").onclick = () => {
        window.BBSpawns.spawnSelected = -1;
        window.BBSpawns.updateEntries();
    }

    // Load map from map list
    document.getElementById("bbs_loadbutton").onclick = () => {
        if(!window.BBSpawns.savedSpawnPointData[window.BBSpawns.mapSelected]) return;
        let map = window.BBSpawns.savedSpawnPointData[window.BBSpawns.mapSelected].map;
        window.BBSpawns.lastMap = map;
        window.BBSpawns.mapAdd(map);
        window.BBSpawns.exitMenu();
    }

    // Delete map from map list
    document.getElementById("bbs_deletebutton").onclick = () => {
        if(!window.BBSpawns.savedSpawnPointData[window.BBSpawns.mapSelected]) return;
        delete window.BBSpawns.savedSpawnPointData[window.BBSpawns.mapSelected];
        updateMapList();
    }

    // Delete all maps from map list
    document.getElementById("bbs_deleteallbutton").onclick = () => {
        window.BBSpawns.savedSpawnPointData = {};
        updateMapList();
    }

    // create image
    const mapImage = spawnId => {
        window.BBSpawns.spawnId = spawnId;
        let mapImg = window.BBSpawns.createMapImage(window.BBSpawns.map(),(document.getElementById("bbs_rightbox").clientWidth-20)/730);
        window.BBSpawns.spawnId = null;
        mapImg.classList.add("bbs_mapimage");
        [...document.getElementById("bbs_rightbox").children].forEach((element) => {if(element.className == "bbs_mapimage") element.parentNode.removeChild(element)});
        document.getElementById("bbs_rightbox").insertBefore(mapImg, document.getElementById("bbs_maplist"));
    }
    const clearChildren = element => {
        while(element.children.length > 0) element.removeChild(element.firstChild);
    }

    const updateMapList = () => {
        window.BBSpawns.mapSelected = null;
        [...document.getElementById("bbs_maplist").children].forEach((element) => {if(element.classList.contains("bbs_maplist_mapdiv")) element.parentNode.removeChild(element)});
        let maps = Object.values(window.BBSpawns.savedSpawnPointData);
        if(maps.length == 0){
            document.getElementById("bbs_maplist_statustext").style.visibility = "inherit";
            document.getElementById("bbs_loadbutton").classList.add("brownButtonDisabled");
            document.getElementById("bbs_deletebutton").classList.add("brownButtonDisabled");
            document.getElementById("bbs_deleteallbutton").classList.add("brownButtonDisabled");
            return;
        } else {
            document.getElementById("bbs_maplist_statustext").style.visibility = "hidden";
            document.getElementById("bbs_loadbutton").classList.remove("brownButtonDisabled");
            document.getElementById("bbs_deletebutton").classList.remove("brownButtonDisabled");
            document.getElementById("bbs_deleteallbutton").classList.remove("brownButtonDisabled");
        }
        for(let mapID = maps.length-1; mapID >= 0; mapID--){
            let id = Object.keys(window.BBSpawns.savedSpawnPointData)[mapID];
            let div = document.createElement("div");
            div.className = "bbs_maplist_mapdiv";
            let name = document.createElement("div");
            name.className = "bbs_maplist_mapdiv_name";
            name.textContent = maps[mapID].map.m.n;
            let author = document.createElement("div");
            author.className = "bbs_maplist_mapdiv_author";
            author.textContent = "by " + maps[mapID].map.m.a;
            let mode = document.createElement("div");
            mode.className = "bbs_maplist_mapdiv_mode";
            let modeText = "Any Mode";
            if(window.BBSpawns.modes[maps[mapID].map.m.mo]) modeText = window.BBSpawns.modes[maps[mapID].map.m.mo].lobbyName;
            mode.textContent = modeText;
            let mapElement = document.createElement("div");
            mapElement.className = "bbs_maplist_mapdiv_map";
            div.ondblclick = () => {
                window.BBSpawns.mapSelected = id;
                if(!window.BBSpawns.savedSpawnPointData[window.BBSpawns.mapSelected]) return;
                let map = window.BBSpawns.savedSpawnPointData[window.BBSpawns.mapSelected].map;
                window.BBSpawns.lastMap = map;
                window.BBSpawns.mapAdd(map);
                window.BBSpawns.exitMenu();
            }
            div.onclick = () => {
                if(div.classList.contains("bbs_maplist_mapdiv_highlighted")) {
                    div.classList.remove("bbs_maplist_mapdiv_highlighted");
                    window.BBSpawns.mapSelected = null;
                }
                else {
                    div.classList.add("bbs_maplist_mapdiv_highlighted");
                    window.BBSpawns.mapSelected = id;
                }
            }
            div.appendChild(name);
            div.appendChild(author);
            div.appendChild(mode);
            div.appendChild(mapElement);
            if(window.BBSpawns.savedSpawnPointData[Object.keys(window.BBSpawns.savedSpawnPointData)[mapID]].mapImage == null){
                mapElement.appendChild(window.BBSpawns.createMapImage(maps[mapID].map,70/500));
                window.BBSpawns.savedSpawnPointData[id].mapImage = mapElement.lastChild;
            } else mapElement.appendChild(window.BBSpawns.savedSpawnPointData[Object.keys(window.BBSpawns.savedSpawnPointData)[mapID]].mapImage);
            document.getElementById("bbs_maplist").appendChild(div);
        }
    }


    window.BBSpawns.updateEntries = () => {
        if(document.getElementById("bbspawns").style.visibility != "inherit") return;
        clearChildren(document.getElementById("bbs_playerentry_elementcontainer"));
        clearChildren(document.getElementById("bbs_spawnentry_elementcontainer"));
        // players
        for(let id = 0; id < window.BBSpawns.players.length; id++){
            let player = window.BBSpawns.players[id];
            if(player){
                let playerentry = document.createElement("div");
                playerentry.classList.add(window.BBSpawns.playersSelected.find((x) => x == id) != undefined? "bbs_entry_highlighted" : "bbs_entry");
                playerentry.ondblclick = () => {
                    if(window.BBSpawns.spawnSelected != -1){
                        window.BBSpawns.spawnPointData[id] = window.BBSpawns.spawnSelected;
                        window.BBSpawns.keepPositions[id] = window.BBSpawns.spawnSelected;
                    } else {
                        window.BBSpawns.spawnPointData[id] = null;
                        window.BBSpawns.keepPositions[id] = null;
                    }
                    window.BBSpawns.playersSelected.splice(window.BBSpawns.playersSelected.indexOf(id));
                    if(window.BBSpawns.playersSelected.length == 0) window.BBSpawns.spawnSelected = -1;
                    window.BBSpawns.updateEntries();
                }
                playerentry.onclick = () => {
                    if(playerentry.classList.contains("bbs_entry")){
                        playerentry.classList.remove("bbs_entry");
                        playerentry.classList.add("bbs_entry_highlighted");
                        window.BBSpawns.playersSelected.push(id);
                    } else {
                        playerentry.classList.remove("bbs_entry_highlighted");
                        playerentry.classList.add("bbs_entry");
                        window.BBSpawns.playersSelected.splice(window.BBSpawns.playersSelected.indexOf(id));
                    }
                }
                playerentry.onmouseenter = window.BBSpawns.sounds.rlh;
                playerentry.onmousedown = window.BBSpawns.sounds.rlc;
                let playerskin = document.createElement("div");
                playerskin.classList.add("newbonklobby_playerentry_avatar");
                if(window.BBSpawns.avatarData[id] && window.BBSpawns.avatarData[id][1]){
                    playerskin.appendChild(window.BBSpawns.avatarData[id][1].cloneNode(true));
                } else {
                    try {
                        window.BBSpawns.createImage(player.avatar, 0, playerskin, "", 36, 36, window.BBSpawns.avatarData, id, 0, 2, 0.08, 0.3);
                    } catch (e) {}
                }
                window.BBSpawns.drawIndicator(playerskin,id);
                let playername = document.createElement("div");
                playername.classList.add("newbonklobby_playerentry_name");
                playername.textContent = player.userName;
                let playerlevel = document.createElement("div");
                playerlevel.classList.add("newbonklobby_playerentry_level");
                playerlevel.textContent = player.guest?"Guest":"Level "+player.level;
                let playerspawnid = document.createElement("div");
                playerspawnid.classList.add("newbonklobby_playerentry_balance");
                playerspawnid.textContent = window.BBSpawns.spawnPointData[id] == null? "N/A" : window.BBSpawns.spawnPointData[id] + 1;
                playerentry.appendChild(playerskin);
                playerentry.appendChild(playername);
                playerentry.appendChild(playerlevel);
                playerentry.appendChild(playerspawnid);
                document.getElementById("bbs_playerentry_elementcontainer").appendChild(playerentry);
            }
        }
        // spawns
        let spawns = window.BBSpawns.map().spawns;
        for(let id = 0; id < spawns.length; id++){
            if(spawns[id]){
                let spawnentry = document.createElement("div");
                spawnentry.classList.add(window.BBSpawns.spawnSelected == id? "bbs_entry_highlighted" : "bbs_entry");
                spawnentry.ondblclick = () => {
                    spawnentry.classList.remove("bbs_entry_highlighted");
                    spawnentry.classList.add("bbs_entry");
                    window.BBSpawns.spawnSelected = -1;
                    for(let i = 0; i < window.BBSpawns.playersSelected.length; i++) window.BBSpawns.spawnPointData[window.BBSpawns.playersSelected[i]] = id;
                    window.BBSpawns.playersSelected = [];
                    window.BBSpawns.updateEntries();
                }
                spawnentry.onclick = () => {
                    if(spawnentry.classList.contains("bbs_entry_highlighted")){
                        spawnentry.classList.remove("bbs_entry_highlighted");
                        spawnentry.classList.add("bbs_entry");
                        window.BBSpawns.spawnSelected = -1;
                    } else {
                        for(let element = 0; element < document.getElementById("bbs_spawnentry_elementcontainer").children.length; element++){
                            let elem = document.getElementById("bbs_spawnentry_elementcontainer").children[element];
                            elem.classList.remove("bbs_entry_highlighted");
                            elem.classList.add("bbs_entry");
                        }
                        spawnentry.classList.remove("bbs_entry");
                        spawnentry.classList.add("bbs_entry_highlighted");
                        window.BBSpawns.spawnSelected = id;
                    }
                }
                spawnentry.onmouseenter = window.BBSpawns.sounds.rlh;
                spawnentry.onmousedown = window.BBSpawns.sounds.rlc;
                let spawnteams = document.createElement("div");
                spawnteams.classList.add("newbonklobby_playerentry_avatar");
                spawnteams.appendChild(drawSpawn(spawns[id]));
                let spawnname = document.createElement("div");
                spawnname.classList.add("bbs_spawnentry_name");
                spawnname.textContent = spawns[id].n;
                let spawnid = document.createElement("div");
                if(window.BBSpawns.spawnIdFJ == id) spawnid.classList.add("bbs_spawnentry_id_forjoiningplayers");
                else spawnid.classList.add("newbonklobby_playerentry_level");
                spawnid.textContent = `Spawn ID: ${id + 1}`;
                spawnentry.addEventListener("mouseover", () => mapImage(id));
                spawnentry.addEventListener("mouseout", () => mapImage());
                spawnentry.appendChild(spawnteams);
                spawnentry.appendChild(spawnname);
                spawnentry.appendChild(spawnid);
                document.getElementById("bbs_spawnentry_elementcontainer").appendChild(spawnentry);
            }
        }
        let spawnentrycontainer = document.getElementById("bbs_spawnentry_elementcontainer");
        let spawncount = document.getElementById("bbs_spawncount");
        if(spawnentrycontainer.scrollHeight > spawnentrycontainer.clientHeight){
            spawncount.textContent = "Spawn count - " + spawns.length;
            spawncount.style.display = "block";

        } else spawncount.style.display = "none";
    }

    window.BBSpawns.updateSPData = () => {
        let map = window.BBSpawns.map();
        let lastMap = window.BBSpawns.lastMap;
        let clear = () => {
            window.BBSpawns.spawnPointData = [];
            window.BBSpawns.keepPositions = [];
            window.BBSpawns.spawnIdFJ = -1;
        }
        let mapsEqual = () => {
            let m = [Object.create(map),Object.create(lastMap)];
            m[0].m = m[1].m = null;
            if(JSON.stringify(m[0]) == JSON.stringify(m[1])) return true;
        }
        if(lastMap != null && map.spawns.length == lastMap.spawns.length){
            if(
                map.m.rxid == lastMap.m.dbid ||
                map.m.dbid == lastMap.m.rxid ||
                map.m.dbid == lastMap.m.dbid ||
                (lastMap.m.dbid == -1 && map.m.dbid != 0 && mapsEqual())
            ){} else {
                clear();
            }
        } else {
            clear();
        }
        window.BBSpawns.lastMap = map;

    }

    window.BBSpawns.roomLeave = () => {
        window.BBSpawns.avatarData = [];
        window.BBSpawns.lobby = null;
        window.BBSpawns.spawnPointData = [];
        window.BBSpawns.keepPositions = [];
        window.BBSpawns.lastMap = null;
        window.BBSpawns.playersSelected = [];
        window.BBSpawns.spawnIdFJ = -1;
        window.BBSpawns.map = () => {return window.BBSpawns.blankMap};
        window.BBSpawns.savedSpawnPointData = {};
    }

    window.BBSpawns.displayWindow = () => {
        clearChildren(document.getElementById("bbs_playerentry_elementcontainer"));
        clearChildren(document.getElementById("bbs_spawnentry_elementcontainer"));
        if(document.getElementById("bbspawns").style.visibility != "inherit"){
            document.getElementById("bbspawns").style.visibility = "inherit";
            document.getElementById("bbspawns").style.opacity = "0";
            window.anime({
                targets: document.getElementById("bbspawns"),
                opacity: "1",
                autoplay: true,
                duration: 250,
                easing: "easeOutCubic",
            });
        }
        window.BBSpawns.updateSPData();
        window.BBSpawns.updateEntries();
        mapImage();
        updateMapList();
    }

    window.BBSpawns.onMapChange = (newMap) => {
        let map = window.BBSpawns.map();
        if(window.BBSpawns.spawnPointData.length != 0 && map.m.dbid > -1){
            let data = {
                spawns: map.spawns.length,
                spdata: window.BBSpawns.spawnPointData,
                map: map,
                mapImage: null,
            };
            window.BBSpawns.savedSpawnPointData["b" + map.m.rxdb + "-" + map.m.dbid] = data;
            window.BBSpawns.spawnPointData = [];
        }
        let id = "b" + newMap.m.rxdb + "-" + newMap.m.dbid;
        if(window.BBSpawns.savedSpawnPointData[id] && window.BBSpawns.savedSpawnPointData[id].spawns == newMap.spawns.length){
            window.BBSpawns.spawnPointData = window.BBSpawns.savedSpawnPointData[id].spdata;
            window.BBSpawns.newestMap = newMap;
        }
        window.BBSpawns.lobby.updatePlayers();
    }


    const bigvar = newSrc.match(/[A-Za-z0-9$_]+\[[0-9]{6}\]/)[0].split('[')[0];
    const closePlayerentryMenu = newSrc.match(/this\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,5}]]\);[A-Za-z0-9\$_]{3}\(\);}/)[0].split(";")[1];
    const lobbyPlayerIDRegex = newSrc.match(/\[];[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=\[];[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=function\([A-Za-z0-9\$_]{3}/)[0].split('(')[1];
    const createImageRegex = newSrc.match(/]]]\);}else {try{.../)[0].split("try{")[1].split("[")[0];
    const updatePlayersRegex = newSrc.match(/=\[];[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=\[];[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=function\([A-Za-z0-9\$_]{3}\){/);
    const imageRender = newSrc.match(/(?<=\);function )[A-Za-z0-9\$_]{1,3}(?=\([A-Za-z0-9\$_,]{7}\){\"use strict\")/)[0];
    const mapAddRegex = newSrc.match(/;}}\);};function [A-Za-z0-9\$_]{1,3}/)[0].split(" ")[1];

    //get players
    const playerList = newSrc.match(/=\[];[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=\[];[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=function\([A-Za-z0-9\$_]{3}\){.*?\){/)[0].split("if(")[1].match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,3}]/)[0];
    const avatarData = newSrc.match(/(?<=36,36,)[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]/)[0];
    newSrc = newSrc.replace(updatePlayersRegex, updatePlayersRegex[0] + `window.BBSpawns.players = ${playerList};window.BBSpawns.avatarData = ${avatarData};`);

    // create button
    const moveToButtonRegex = newSrc.match(/\(\);}\);}if/);
    const soundsRegex = newSrc.match(/0x424242\);[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]/)[0].split(';')[1];
    let setSpawnPointButton = `
    let button = document.createElement("div");
    button.classList.add("newbonklobby_playerentry_menu_button");
    button.classList.add("brownButton");
    button.classList.add("brownButton_classic");
    button.classList.add("buttonShadow");
    document.getElementsByClassName("newbonklobby_playerentry_menu")[0].appendChild(button);
    window.BBSpawns.sounds = ${soundsRegex};
    window.BBSpawns.sounds.setButtonSounds([...document.getElementById("bbspawns").getElementsByClassName("buttonShadow")]);
    button.textContent = "Set spawn point";
    button.onclick = function () {
        window.BBSpawns.playersSelected = [${lobbyPlayerIDRegex}];
        window.BBSpawns.displayWindow();
        ${closePlayerentryMenu};
    }
    `;
    newSrc = newSrc.replace(moveToButtonRegex, moveToButtonRegex[0].split('}if')[0] + setSpawnPointButton + '}if');

    // test
    const gameRegex = newSrc.match(/30000\){.*?}.*?(?==)/)[0].split("}")[1];

    // thamks salama
    const lobbyThings = newSrc.match(/== 13\){...\(\);}}/)[0];
    newSrc = newSrc.replace(lobbyThings, lobbyThings + `window.BBSpawns.lobby = this;window.BBSpawns.mapAdd = ${mapAddRegex};`);
    const toolRegex = newSrc.match(/=new [A-Za-z0-9\$_]{1,3}\(this,[A-Za-z0-9\$_]{1,3}\[0\]\[0\],[A-Za-z0-9\$_]{1,3}\[0\]\[1\]\);/);
    newSrc = newSrc.replace(toolRegex, toolRegex + "window.BBSpawns.tools = this;");
    const modeRegex = newSrc.match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]=class [A-Za-z0-9\$_]{3}\{constructor.{1,400}this\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,3}\]){2}\]=2;/)[0].split("=")[0];

    const setMapRegex = newSrc.match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=this\[[A-Za-z0-9\$_\[\]]*?;[A-Za-z0-9\$_]{3}\[0]\[2].*?=/)[0].split(";")[1];
    let thing = newSrc.match(RegExp(setMapRegex.split("2][")[0].replaceAll("[", "\\[")+"2]\\[[A-Za-z0-9\$_]{3}\\[[0-9]{1,3}]\\["+setMapRegex.split("][")[3]+".*?;","g"));
    for(let i = 0; i < thing.length;i++) newSrc = newSrc.replace(thing[i], `window.BBSpawns.onMapChange(${thing[i].split("=")[1].replace(";","")});${thing[i]};`);

    // spawn selection & spawn color fix
    const spawnColorRegex = newSrc.match(/(?<=5\){[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=0xffd90e;}).*?]]\(.*?\);(?=[A-Za-z0-9\$_]{3}.[A-Za-z0-9\$_]{3}\([0-9]{1,3}\))/);
    const spawnTeamsRegex = newSrc.match(/[A-Za-z0-9\$_]{1,3}\[[0-9]{1,3}]=3;}else if\(.{0,300}== false\){continue;}[^;]*?\({x:/);
    let spawn = spawnTeamsRegex[0].split("==")[0].split("if(")[1].match(/.*?(?=\[...\[[0-9]{1,3}]\[[0-9]{1,3}]] )/)[0];
    let spawnTeams = `
    else if(${spawn}.gr == true){
        ${spawnTeamsRegex[0].split("=3")[0]} = 4;
    }
    else if(${spawn}.ye == true){
        ${spawnTeamsRegex[0].split("=3")[0]} = 5;
    }
    else
    `;
    newSrc = newSrc.replace(spawnColorRegex, spawnColorRegex[0].split("(")[0] + `(window.BBSpawns.spawnId==${newSrc.match(/(?<==false;}for\()[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]/)[0]}?0xffffff:` + spawnColorRegex[0].split("(")[1]);
    newSrc = newSrc.replace(spawnTeamsRegex, spawnTeamsRegex[0].split("else")[0] + spawnTeams + spawnTeamsRegex[0].split("else")[1].replace("continue;", ""));

    let f8h = newSrc.match(/(?<=\)\){)while.*?}/)[0].split("(")[1].split("][")[0] + `]`;
    newSrc = newSrc.replace(newSrc.match(/(?<=\)\){)while.*?}/), newSrc.match(/(?<=\)\){)while.*?}/) + `if(${f8h.substring(0,3)}[0][2].className == "newbonklobby_playerentry_avatar"){window.BBSpawns.drawIndicator(${f8h.substring(0,3)}[0][2],${f8h.substring(0,3)}[0][7])}`);

    const playerentryRegex = newSrc.match(/(?<=;).{0,30}=[A-Za-z0-9\$_]{3}\[[0-9]{1,3}];[A-Za-z0-9\$_]{1,3}\[[0-9]{1,3}]\[[A-Za-z0-9\$_]{1,3}\[0]\[0]]=[A-Za-z0-9\$_]{3}\[[0-9]{1,3}];/);
    newSrc = newSrc.replace(playerentryRegex,`;window.BBSpawns.drawIndicator(${playerentryRegex[0].split(";")[1].split("=")[1]}.children[0],arguments[0]);` + playerentryRegex[0]);

    // get some things i need (map && create map image)
    const createRoomRegex = newSrc.match(/\(0,[A-Za-z0-9\$_]{1,3}\.[A-Za-z0-9\$_]{1,3}\(.[0-9]{1,4}\)\);.{0,50}=3;}else/g);
    newSrc = newSrc.replace(createRoomRegex, createRoomRegex[0].split(';')[0] + `;${createRoomRegex[0].split(";")[1]};
    window.BBSpawns.modes = ${modeRegex}.modes;
    window.BBSpawns.map = () => {
        if(window.BBSpawns.newestMap == ${createRoomRegex[0].match(/(?<=;).*?\[.*?(?=\[)/)}.map) delete window.BBSpawns.newestMap;
        if(window.BBSpawns.newestMap) return window.BBSpawns.newestMap;
        return ${createRoomRegex[0].match(/(?<=;).*?\[.*?(?=\[)/)}.map;
    };
    window.BBSpawns.createImage = ${createImageRegex}.createImage;
    window.BBSpawns.tools.networkEngine.on("newPlayerJoined", player => {
        if(window.BBSpawns.spawnIdFJ != -1){
            window.BBSpawns.spawnPointData[player] = window.BBSpawns.spawnIdFJ;
            window.BBSpawns.keepPositions[player] = window.BBSpawns.spawnIdFJ;
        }
        window.BBSpawns.updateEntries();
    });
    window.BBSpawns.tools.networkEngine.on("nameChange", window.BBSpawns.updateEntries);
    window.BBSpawns.tools.networkEngine.on("playerLevelledUp", window.BBSpawns.updateEntries);
    window.BBSpawns.tools.networkEngine.on("playerLeft", window.BBSpawns.updateEntries);
    window.BBSpawns.createMapImage = ${newSrc.match(/(?<=\);}this\[.{0,8}\[[0-9]{1,5}]]\(\);.{0,8}=)[A-Za-z0-9\$_]{1,3}/)}.createImage;
    }else`);

    // put players on their initial positions
    let newStateRegex = newSrc.match(/B;}[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=.*?\(.*?,true\);/)[0];
    newSrc = newSrc.replace(newStateRegex, newStateRegex + `
    let discs = ${newStateRegex.split("}")[1].split("=")[0]}.discs;
    let map = window.BBSpawns.map();
    let keepPos = document.getElementById("hostPlayerMenuKeepPositions") && document.getElementById("hostPlayerMenuKeepPositions").checked;
    if(!keepPos) window.BBSpawns.keepPositions = Object.create(window.BBSpawns.spawnPointData);
    window.BBSpawns.updateSPData();
    if(
        !!${gameRegex} &&
        window.bonkHost &&
        ${bigvar}.bonkHost.state &&
        keepPos &&
	    window.bonkHost.toolFunctions.getGameSettings().map.s.re &&
	    window.bonkHost.toolFunctions.getGameSettings().ga === "b" &&
	    ${bigvar}.bonkHost.state.mm.dbid == window.bonkHost.toolFunctions.getGameSettings().map.m.dbid &&
	    ${bigvar}.bonkHost.state.mm.dbv == window.bonkHost.toolFunctions.getGameSettings().map.m.dbv
        ){
        for(let disc = 0; disc < discs.length; disc++){
            if(discs[disc] != null && window.BBSpawns.keepPositions[disc] != null){
                discs[disc].x = (map.spawns[window.BBSpawns.keepPositions[disc]].x + 365) / map.physics.ppm;
                discs[disc].y = (map.spawns[window.BBSpawns.keepPositions[disc]].y + 250) / map.physics.ppm;
                discs[disc].xv = map.spawns[window.BBSpawns.keepPositions[disc]].xv / map.physics.ppm;
                discs[disc].yv = map.spawns[window.BBSpawns.keepPositions[disc]].yv / map.physics.ppm;
                discs[disc].sx = discs[disc].x;
                discs[disc].sy = discs[disc].y;
                discs[disc].sxv = discs[disc].xv;
                discs[disc].syv = discs[disc].yv;
                window.BBSpawns.keepPositions[disc] = undefined;
                ${bigvar}.bonkHost.state.discs[disc] = undefined;
            }
        }
    }else{
        for(let disc = 0; disc < discs.length; disc++){
            if(discs[disc] != null && window.BBSpawns.spawnPointData[disc] != null){
                discs[disc].x = (map.spawns[window.BBSpawns.spawnPointData[disc]].x + 365) / map.physics.ppm;
                discs[disc].y = (map.spawns[window.BBSpawns.spawnPointData[disc]].y + 250) / map.physics.ppm;
                discs[disc].xv = map.spawns[window.BBSpawns.spawnPointData[disc]].xv / map.physics.ppm;
                discs[disc].yv = map.spawns[window.BBSpawns.spawnPointData[disc]].yv / map.physics.ppm;
                discs[disc].sx = discs[disc].x;
                discs[disc].sy = discs[disc].y;
                discs[disc].sxv = discs[disc].xv;
                discs[disc].syv = discs[disc].yv;
            }
        }
    }
    window.BBSpawns.exitMenu();
    `);
    let roomLeaveRegex = newSrc.match(/\(\);[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]=null;}[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}]\[[0-9]{1,3}]]=null;/g);
    newSrc = newSrc.replace(roomLeaveRegex, roomLeaveRegex + `window.BBSpawns.roomLeave();window.BBSpawns.exitMenu();`);
    console.log(`${scriptName} injector run`);
    return newSrc;
}

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];

window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(`Whoops! ${scriptName} was unable to load.`);
        throw error;
    }
});

console.log(`${scriptName} injector loaded`);