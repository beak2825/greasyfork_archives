// ==UserScript==
// @name         Bonk Host
// @version      4.0
// @author       Salama
// @description  Makes hosting rooms in bonk.io better
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/435169/Bonk%20Host.user.js
// @updateURL https://update.greasyfork.org/scripts/435169/Bonk%20Host.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

let injector = (str) => {
	let newStr = str;
window.bonkHost = {};
window.bonkHost.playerManagement = {};
window.bonkHost.freejoin = false;
window.bonkHost.bans = [];
window.bonkHost.inGame = false;
window.bonkHost.playerManagement.canBeVisible = false;
window.bonkHost.bonkCallbacks = {};
window.bonkHost.playerHistory = {};
window.bonkHost.playerSus = [];
window.bonkHost.fig = 0;
window.bonkHost.cheatDetection = false;
let mapHistory = [];
let mapHistoryIndex = 0;

window.bonkCommands = window.bonkCommands.concat(["/kick", "/mute", "/unmute", "/lock", "/unlock", "/balance", "/fav", "/unfav", "/curate", "/curateyes", "/curateno", "/roomname", "/roompass", "/clearroompass", "/hhelp", "/balanceall", "/start", "/freejoin", "/host", "/ban", "/bans", "/unban", "/scoreboard", "/resetpos"]);

if(!localStorage.getItem("bonkHost")) {
	localStorage.setItem("bonkHost", "{}");
}

let hostPlayerMenuCSS = document.createElement('style');
hostPlayerMenuCSS.innerHTML = `
#hostPlayerMenu {
    background-color: #cfd8cd;
    width: calc(35.2vw - 400px);
    min-width: 154px;
    max-width: 200px;
    height: 576px;
    position: absolute;
    left: 10px;
    top: 60px;
    bottom: unset;
    border-radius: 7px;
    display: none;
    transition: ease-in-out 100ms;
    z-index: 100;
    overflow: visible;
}

#hostPlayerMenuBox {
    top: 32px;
    height: calc(47px * 8);
}

#hostPlayerMenuCollapse {
    position: absolute;
    left: 3px;
    top: 3px;
    width: 26px;
    height: 26px;
    border-radius: 2px;
    visibility: visible;
}

#hostPlayerMenuGrab {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 26px;
    height: 26px;
    border-radius: 2px;
    visibility: visible;
    cursor: grab;
}

#hostPlayerMenuControls {
    position: absolute;
    bottom: 0;
    width: 100%;
}

#hostPlayerCheatDetection {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-color: #cfd8cd;
    width: inherit;
    min-width: inherit;
    max-width: inherit;
    height: inherit;
    border-radius: 7px;
    transition: ease-in-out 100ms;
    opacity: 70%;
    visibility: hidden;
}

#hostPlayerCheatDetection canvas {
    background-color: rgb(58, 58, 58);
    margin-left: 5%;
    height: 45px;
    width: 95%;
    margin-top: 1px;
    margin-bottom: 1px;
}
#selectionWheel {
    width: 150px;
    height: 150px;
    position: absolute;
    left: 588px;
    top: 181px;
    pointer-events: none;
    display: none;
    z-index: 150;
}
#selectionWheelTeams {
    width: 150px;
    height: 150px;
    position: absolute;
    left: 1061px;
    top: 169px;
    pointer-events: none;
    display: none;
    z-index: 150;
}

#hostPlayerMenuRestartButton {
    width: 100%;
    border-width: 0 !important;
}

#newbonklobby_hostprevmap {
    width: 27px;
    height: 27px;
    position: absolute;
    top: 106px;
    left: 15px;
}

#newbonklobby_hostnextmap {
    width: 27px;
    height: 27px;
    position: absolute;
    top: 106px;
    left: 48px;
}

#newbonklobby_roundsinput {
    height: 50px !important;
    text-align: center !important;
}
`;
document.getElementsByTagName('head')[0].appendChild(hostPlayerMenuCSS);

let hostPlayerMenu = document.createElement('div');
document.getElementById('pagecontainer').appendChild(hostPlayerMenu);
hostPlayerMenu.outerHTML = `
<div class="windowShadow newbonklobby_elementcontainer" id="hostPlayerMenu">
	<div class="newbonklobby_boxtop newbonklobby_boxtop_classic" style="background-color: #009688;">
		<div onclick="window.bonkHost.playerManagement.collapse();" id="hostPlayerMenuCollapse" class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow">-</div>
		<span>Player List</span>
		<div id="hostPlayerMenuGrab" class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow">:::</div>
	</div>
	<div id="hostPlayerMenuBox" class="newbonklobby_elementcontainer"></div>
	<div id="hostPlayerMenuControls">
		<table>
			<tbody>
				<tr style="background-color: rgba(58, 58, 58, 0.07);">
					<td style="padding-left: 10px;" class="mapeditor_rightbox_table">
						Teamlock
					</td>
					<td>
						<input type="checkbox" id="hostPlayerMenuTeamlock">
					</td>
				</tr>
				<tr style="background-color: rgba(58, 58, 58, 0.07);">
					<td style="padding-left: 10px;" class="mapeditor_rightbox_table">
						Freejoin
					</td>
					<td>
						<input type="checkbox" id="hostPlayerMenuFreejoin">
					</td>
				</tr>
				<tr style="background-color: rgba(58, 58, 58, 0.07);">
					<td style="padding-left: 10px;" class="mapeditor_rightbox_table">
						Keep scores
					</td>
					<td>
						<input type="checkbox" id="hostPlayerMenuKeepScores">
					</td>
				</tr>
				<tr style="background-color: rgba(58, 58, 58, 0.07);">
					<td style="padding-left: 10px;" class="mapeditor_rightbox_table">
						Cheat detection
					</td>
					<td>
						<input type="checkbox" id="hostPlayerMenuCheatDetectionCheckbox">
					</td>
				</tr>
				<tr style="background-color: rgba(58, 58, 58, 0.07);">
					<td>
						<div style="padding-left: 10px;" class="mapeditor_rightbox_table">
							Keep positions
						</div>
						<div style="padding-left: 10px; font-size: 10px; display:none" class="mapeditor_rightbox_table" id="hostPlayerMenuRespawningRequiredWarning">
							Respawning required
						</div>
					</td>
					<td>
						<input type="checkbox" id="hostPlayerMenuKeepPositions">
					</td>
				</tr>
			</tbody>
		</table>
		<div class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow" id="hostPlayerMenuRestartButton">
			RESTART GAME
		</div>
	</div>
	<div class="windowShadow" id="hostPlayerCheatDetection">
	<div class="newbonklobby_boxtop newbonklobby_boxtop_classic" style="background-color: #009688;"></div>
		<div id="hostPlayerMenuCheatBox" class="newbonklobby_elementcontainer">
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
			 <canvas width="1" height="45" class="mapeditor_rightbox_table"></canvas>
		</div>
		<div class="mapeditor_rightbox_table" style="position:absolute;bottom:0;width:95%;margin-left:5%;text-align:justify;font-size:15;height:170px;overflow-y:scroll;">
INSTRUCTIONS: The graph shows how laggy someone is compared to how laggy they actually should be. This can be used to detect lag cheats. Being over the first red line is OK. Consistently being under it can happen but it's suspicious. Anything consistent under that is usually just cheats. Random lag spikes can happen. ⚠️ indicates that the player is using a mod that is known to have related cheats.
		</div>
	</div>
</div>
<div id="selectionWheel">
	<svg width="150" height="150" viewBox="0 0 26.458 26.458"><g><path d="M22.009-13.227a8.78 8.78 0 0 1-13.17 7.605 8.78 8.78 0 0 1-4.39-7.605" transform="rotate(90)" stroke="#fff" style="stroke-linejoin: round; stroke-width: 9; fill: none; opacity: 0.5; stroke: rgb(121, 85, 72);"></path><text class="brownButton_classic" style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		transform: scale(1, 1);
		fill: #fff;
	"><tspan x="4.5" y="14.4">FFA</tspan></text>
	</g><g style="transform: translateX(50%);transform-origin: 100% 0px;"><path d="M22.009-13.227a8.78 8.78 0 0 1-13.17 7.605 8.78 8.78 0 0 1-4.39-7.605" transform="rotate(90)" stroke="#fff" style="stroke-linejoin: round; stroke-width: 9; fill: none; opacity: 0.5; transform: rotate(-90deg); transform-origin: 75% 25%; stroke: rgb(121, 85, 72);"></path><text style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		transform: scale(1, 1);
		fill: #fff;
	"><tspan x="8.8" y="14.4">SPEC</tspan></text></g></svg>
</div>

<div id="selectionWheelTeams">
	<svg width="150" height="150" viewBox="0 0 26.458 26.458" style="
"><g stroke-linejoin="round" stroke-width="9" stroke="#fff" style="transform: rotate(180deg);transform-origin: 50% 0%;"><path d="M6.126-8.066c-2.236-3.078-2.236-7.246 0-10.323" style="opacity: 0.5; stroke: rgb(121, 85, 72);"></path><path d="M6.126-18.39a8.78 8.78 0 0 1 9.816-3.19" style="stroke: rgb(255, 235, 59); opacity: 1;"></path><path d="M15.942-21.58a8.78 8.78 0 0 1 6.067 8.352" style="stroke: rgb(76, 175, 80); opacity: 0.5;"></path><path d="M22.009-13.228a8.78 8.78 0 0 1-6.067 8.352" style="stroke: rgb(33, 150, 243); opacity: 0.5;"></path><path d="M15.942-4.876a8.78 8.78 0 0 1-9.816-3.19" style="stroke: rgb(244, 67, 54); opacity: 0.5;"></path></g><text font-size="6" fill="#000" style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		fill: #fff;
	"><tspan x="22" y="14.4">SPEC</tspan></text><text font-size="6" fill="#000" style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		fill: #fff;
	"><tspan x="16.75" y="22.5">YELLOW</tspan></text><text font-size="6" fill="#000" style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		fill: #fff;
	"><tspan x="16.5" y="6">RED</tspan></text><text font-size="6" fill="#000" style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		fill: #fff;
	"><tspan x="6" y="9.5">BLUE</tspan></text><text font-size="6" fill="#000" style="
		text-anchor: middle;
		font-family: 'futurept_b1';
		font-size: 3.17496;
		fill: #fff;
	"><tspan x="6" y="19.5">GREEN</tspan></text></svg>
</div>
<div class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow" id="newbonklobby_hostprevmap">&lt;</div>
<div class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow" id="newbonklobby_hostnextmap">&gt;</div>
<!--
<div id="teamshufflebutton" class="brownButton brownButton_classic buttonShadow" style="
    width: 16px;
    height: 35px;
    border-radius: 2px;
    position: absolute;
    top: calc(17% - 40px);
    right: calc(33.5% - 8px);
    font-family: monospace;
	">
	<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="height: 100%;transform:scaleX(-0.9);">
		<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"></path>
		<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"></path>
	</svg>
</div>
<div id="teamshufflebox" class="newbonklobby_elementcontainer" style="
    position: absolute;
    top: calc(17% - 42px);
    right: calc(33.5% - 10px);
    width: auto;
    height: auto;
    bottom: unset;
    outline: 3000px solid rgba(0,0,0,0.30);
	visibility: hidden;
">
	<div class="newbonklobby_boxtop newbonklobby_boxtop_classic" style="
	    height: 39px;
	    line-height: 39px;
	">
		Shuffle Teams
		<div onclick=window.bonkHost.shuffleTeams class="newbonklobby_votewindow_votebutton brownButton brownButton_classic buttonShadow" id="newbonklobby_votewindow_votebutton_up" style="
    		margin: 0;
    		height: 35px;
    		width: 25px;
    		position: absolute;
    		left: calc(100% - 27px);
    		top: 2px;
		"></div>
		<div onclick="()=>{document.getElementById('teamshufflebox').style.visibility='hidden';}" class="newbonklobby_votewindow_votebutton brownButton brownButton_classic buttonShadow" id="newbonklobby_votewindow_votebutton_down" style="
    		margin: 0;
    		height: 35px;
    		width: 25px;
    		position: absolute;
    		top: 2px;
    		left: calc(100% - 55px);
		"></div>
	</div>
	<table id="mapeditor_rightbox_table_simple" class="mapeditor_rightbox_table">
		<tbody>
		<tr>
			<td class="mapeditor_rightbox_table_leftcell">Players per team</td>
			<td class="mapeditor_rightbox_table_rightcell">
					<div class="mapeditor_field_button fieldShadow" style="width:auto;margin:0 3;" onclick="() => {
						document.getElementById('teamshufflebox').value = 'AUTO';
					}">AUTO</div>
				<div class="mapeditor_field_button fieldShadow" style="margin:0 1;">-</div>
				<input id="teamshuffleppt" class="mapeditor_field fieldShadow" value="1" autocomplete="off" style="width:44px;">
					<div class="mapeditor_field_button fieldShadow" style="margin 0 1;" onclick="() => {
						document.getElementById('teamshuffleppt').value = parseInt(document.getElementById('teamshuffleppt').value) + 1;
					}">+</div>
			</td>
		</tr>
		<tr>
			<td class="mapeditor_rightbox_table_leftcell">Teams</td>
			<td class="mapeditor_rightbox_table_rightcell" style="
				display: grid;
				align-content: center;
				justify-content: center;
				align-items: center;
				grid-template-columns: 20px 25px 20px 35px;
			">
				<input type="checkbox" id="team_shuffle_blue"><label>Blue</label>
				<input type="checkbox" id="team_shuffle_green"><label>Green</label>
				<input type="checkbox" id="team_shuffle_red"><label>Red</label>
				<input type="checkbox" id="team_shuffle_yellow"><label>Yellow</label>
			</td>
		</tr>
			<tr>
				<td class="mapeditor_rightbox_table_leftcell">Autoshuffle</td>
				<td class="mapeditor_rightbox_table_rightcell">
					<input type="checkbox" id="mapeditor_rightbox_table_bullet">
				</td>
			</tr>
		</tbody>
	</table>
</div>
`;
document.getElementById("hostPlayerMenuBox").addEventListener("click", (e) => {
	if(e.target === document.getElementById("hostPlayerMenuBox")) {
		document.getElementById('newbonklobby').click();
	}
});

document.getElementById("hostPlayerMenuRestartButton").addEventListener("click", () => {
	window.bonkHost.startGame();
});

/*document.getElementById('newbonklobby').appendChild(document.getElementById('teamshufflebutton'));
document.getElementById('newbonklobby').appendChild(document.getElementById('teamshufflebox'));
document.getElementById('teamshufflebutton').addEventListener('click', () => {
	document.getElementById('teamshufflebox').style.visibility = document.getElementById('teamshufflebox').style.visibility == "hidden" ? "visible" : "hidden";
});
*/
document.getElementById("newbonklobby_specbutton").addEventListener("dblclick", () => {moveEveryone(0)});
document.getElementById("newbonklobby_ffabutton").addEventListener("dblclick", () => {moveEveryone(1)});
document.getElementById("newbonklobby_bluebutton").addEventListener("dblclick", () => {moveEveryone(3)});
document.getElementById("newbonklobby_redbutton").addEventListener("dblclick", () => {moveEveryone(2)});
document.getElementById("newbonklobby_greenbutton").addEventListener("dblclick", () => {moveEveryone(4)});
document.getElementById("newbonklobby_yellowbutton").addEventListener("dblclick", () => {moveEveryone(5)});

document.getElementById("newbonklobby_settingsbox").appendChild(document.getElementById("newbonklobby_hostprevmap"));
document.getElementById("newbonklobby_settingsbox").appendChild(document.getElementById("newbonklobby_hostnextmap"));

const updateMapHistoryButtons = () => {
	if(window.bonkHost.toolFunctions.getGameSettings().ga === "b") {
		document.getElementById("newbonklobby_hostprevmap").style.display = "";
		document.getElementById("newbonklobby_hostnextmap").style.display = "";
		if(isHost()) {
			document.getElementById("newbonklobby_hostprevmap").classList.toggle("brownButtonDisabled", mapHistoryIndex >= mapHistory.length - 1);
			document.getElementById("newbonklobby_hostnextmap").classList.toggle("brownButtonDisabled", mapHistoryIndex === 0);

			// Make sure they are the topmost elements
			document.getElementById("newbonklobby_settingsbox").appendChild(document.getElementById("newbonklobby_hostprevmap"));
			document.getElementById("newbonklobby_settingsbox").appendChild(document.getElementById("newbonklobby_hostnextmap"));
		}
		else {
			document.getElementById("newbonklobby_hostprevmap").classList.add("brownButtonDisabled");
			document.getElementById("newbonklobby_hostnextmap").classList.add("brownButtonDisabled");
		}
	}
	else {
		document.getElementById("newbonklobby_hostprevmap").style.display = "none";
		document.getElementById("newbonklobby_hostnextmap").style.display = "none";
	}
}

document.getElementById("newbonklobby_hostprevmap").addEventListener("click", () => {
	if(!isHost() || mapHistoryIndex >= mapHistory.length - 1) return;
	mapHistoryIndex++;
	let gs = window.bonkHost.toolFunctions.getGameSettings();
	gs.map = mapHistory[mapHistoryIndex];
	window.bonkHost.menuFunctions.setGameSettings(gs);
	window.bonkHost.menuFunctions.updateGameSettings();
	window.bonkHost.toolFunctions.networkEngine.sendMapAdd(gs.map);
	updateMapHistoryButtons();
});

document.getElementById("newbonklobby_hostnextmap").addEventListener("click", () => {
	if(!isHost() || mapHistoryIndex == 0) return;
	mapHistoryIndex--;
	let gs = window.bonkHost.toolFunctions.getGameSettings();
	gs.map = mapHistory[mapHistoryIndex];
	window.bonkHost.menuFunctions.setGameSettings(gs);
	window.bonkHost.menuFunctions.updateGameSettings();
	window.bonkHost.toolFunctions.networkEngine.sendMapAdd(gs.map);
	updateMapHistoryButtons();
});

document.getElementById("newbonklobby_roundsinput").addEventListener("focus", e => {
	e.target.value = "";
});
document.getElementById("newbonklobby_roundsinput").addEventListener("blur", e => {
	if(e.target.value == "") {
		e.target.value = window.bonkHost.toolFunctions.getGameSettings().wl;
	}
});

const moveEveryone = (team) => {
	if(!isHost()) return;
	for(let id of window.bonkHost.toolFunctions.networkEngine.getConnectedPlayers()) {
		window.bonkHost.toolFunctions.networkEngine.changeOtherTeam(id, team);
	}
}

const BIGVAR = newStr.match(/[A-Za-z0-9$_]+\[[0-9]{6}\]/)[0].split('[')[0];

const isHost = () => {
	return window.bonkHost.toolFunctions.networkEngine.getLSID() === window.bonkHost.toolFunctions.networkEngine.hostID && !window.bonkHost.toolFunctions.getGameSettings().q;
}

window.bonkHost.wrap = () => {
	// Event for when game finishes loading. Using a setInterval isn't optimal and we might miss some, but it's good enough for now
	const gameLoadedWaiter = setInterval(() => {
		// I hope a better way of doing this exists
		if(window.bonkHost.menuFunctions !== undefined && Object.keys(window.bonkHost.menuFunctions).length >= 27) {
			clearInterval(gameLoadedWaiter);
		}
		else return;

		// Wrap menuFunctions
		for(const i of Object.keys(window.bonkHost.menuFunctions)) {
			if(typeof window.bonkHost.menuFunctions[i] !== "function") continue;
			const ogFunc = window.bonkHost.menuFunctions[i];
			window.bonkHost.menuFunctions[i] = function() {
				let response = ogFunc.apply(window.bonkHost.menuFunctions, arguments);
				switch(i) {
					case "returnFromTesting":
					case "show":
						window.bonkHost.playerManagement.canBeVisible = false;
						window.bonkHost.playerManagement.hide();
						if(window[BIGVAR].bonkHost.state) {
							if(Math.max(...window[BIGVAR].bonkHost.state.scores) >= window.bonkHost.toolFunctions.getGameSettings().wl) {
								for(let i = 0; i < window[BIGVAR].bonkHost.state.scores.length; i++) {
									if(window[BIGVAR].bonkHost.state.scores === null) continue;
									window[BIGVAR].bonkHost.state.scores[i] = 0;
								}
							}
						}
						break;
					case "hide":
						window.bonkHost.menuFunctions.visible = true;
						window.bonkHost.playerManagement.canBeVisible = true;
						window.bonkHost.playerManagement.show();
						//Intentional fallthrough to update host status

					case "updateGameSettings":
						window.bonkHost.handleHostChange(window.bonkHost.toolFunctions.networkEngine.hostID === window.bonkHost.toolFunctions.networkEngine.getLSID());
						break;
					case "handleHostChange":
						if(isHost()) {
							window.bonkHost.stateFunctions.chatStatus("* You are now the host of this game")
						}
						//Intentional fallthrough to update host status
					case "handleHostLeft":
						window.bonkHost.handleHostChange(arguments[1] === window.bonkHost.toolFunctions.networkEngine.getLSID());
						break;
					case "handlePlayerJoin":
						window.bonkHost.handlePlayerJoin(arguments[1]);
						break;
					case "updatePlayers":
						while(document.getElementById("hostPlayerMenuBox").firstChild) {
							document.getElementById("hostPlayerMenuBox").removeChild(document.getElementById("hostPlayerMenuBox").firstChild);
						}
						[...document.getElementsByClassName("newbonklobby_playerentry")].sort((a, b) => {
							return window.bonkHost.players.filter(p=>p).findIndex(p => a.childNodes[1].textContent === p.userName) - window.bonkHost.players.filter(p=>p).findIndex(p => b.childNodes[1].textContent == p.userName);
						}).filter(p => {
							// Idk if this is needed but it doesn't hurt to have it
							return window.bonkHost.players.filter(pp=>pp).findIndex(pp => p.childNodes[1].textContent === pp.userName) !== -1;
						}).forEach(p => {
							if(p.classList.contains("bonkhost_playerentry")) return;
							window.bonkHost.playerManagement.addPlayer(p);
						})
						window.bonkHost.updatePlayers();
						break;
					case "updatePings":
						let pings = window.bonkHost.players.filter(e=>e).map(e=>e.ping);
						for(let i = 0; i < [...document.getElementById("hostPlayerMenuBox").children].length; i++) {
							document.getElementById("hostPlayerMenuBox").children[i].getElementsByClassName("newbonklobby_playerentry_pingtext")[0].textContent = pings[i] + "ms";
						}
						break;
				}
				return response;
			}
		}

		for(const i of Object.keys(window.bonkHost.toolFunctions.networkEngine)) {
			if(typeof window.bonkHost.toolFunctions.networkEngine[i] !== "function") continue;
			const ogFunc = window.bonkHost.toolFunctions.networkEngine[i];
			window.bonkHost.toolFunctions.networkEngine[i] = function() {
				let response = ogFunc.apply(window.bonkHost.toolFunctions.networkEngine, arguments);
				switch(i) {
					case "changeOtherTeam":
						window.bonkHost.playerManagement.movePlayer(arguments[1], arguments[0]);
						break;
					case "changeOwnTeam":
						window.bonkHost.playerManagement.movePlayer(arguments[0]);
						break;
					case "sendMapAdd":
						if(arguments[0].m.dbid !== mapHistory[mapHistoryIndex]?.m.dbid || arguments[0].m.dbv !== mapHistory[mapHistoryIndex]?.m.dbv) {
							mapHistory.splice(0, mapHistoryIndex);
							mapHistoryIndex = 0;
							mapHistory.unshift(arguments[0]);
						}
						updateMapHistoryButtons();
						break;
					case "destroy":
						window.bonkHost.playerManagement.hide();
						window.bonkHost.playerSus = [];
						break;
				}
				return response;
			}
		}

		window.bonkHost.toolFunctions.networkEngine.on("teamLockChange", lock => {
			document.getElementById("hostPlayerMenuTeamlock").checked = lock;
		});

		let mapUpdateTimeout;
		window.bonkHost.toolFunctions.networkEngine.on("status", code => {
			if(code === "rate_limit_sma") {
				// A second of delay is hopefully enough. This is needed because map history can easily get ratelimited, so we want to update players with the current map before the game begins.
				clearTimeout(mapUpdateTimeout);
				mapUpdateTimeout = setTimeout(() => {
					if(!isHost()) return;
					window.bonkHost.toolFunctions.networkEngine.sendMapAdd(window.bonkHost.toolFunctions.getGameSettings().map);
				}, 1000);
			}
		});

		for(const i of Object.keys(window.bonkHost.toolFunctions)) {
			if(typeof window.bonkHost.toolFunctions[i] !== "function") continue;
			const ogFunc = window.bonkHost.toolFunctions[i];
			window.bonkHost.toolFunctions[i] = function() {
				let response = ogFunc.apply(window.bonkHost.toolFunctions, arguments);
				switch(i) {
					case "recvInputs":
						if(arguments[2] !== "node") break;
						let playerId = arguments[0];
						let packet = arguments[1];

						if(!window.bonkHost.playerSus[playerId]) {
							window.bonkHost.playerSus[playerId] = {
								lagHistory: [],
								lagginessHistory: [],
								cheatWarning: false
							}
						}

						if(packet.type === "commands") {
							window.bonkHost.playerSus[playerId].cheatWarning = true;
						}

						if(window.bonkHost.cheatDetection) {
							let ping = (window.bonkHost.players[playerId].ping + window.bonkHost.players[window.bonkHost.toolFunctions.networkEngine.getLSID()].ping) / 2;

							if(isNaN(packet.f - window.bonkHost.fig)) {
								return;
							}

							window.bonkHost.playerSus[playerId].lagHistory.push(Math.floor(1000*(1/30)*(packet.f - window.bonkHost.fig)) + ping);
							if(window.bonkHost.playerSus[playerId].lagHistory.length > 20) {
								window.bonkHost.playerSus[playerId].lagHistory.shift();
							}

							let avgPingDiff = (window.bonkHost.playerSus[playerId].lagHistory.length > 2) ?
								((
									window.bonkHost.playerSus[playerId].lagHistory.reduce((a, b) => a+b) -
									Math.max.apply(Math, window.bonkHost.playerSus[playerId].lagHistory) -
									Math.min.apply(Math, window.bonkHost.playerSus[playerId].lagHistory)
								) / window.bonkHost.playerSus[playerId].lagHistory.length - 2) : 0

							if(isNaN(avgPingDiff)) return;
							window.bonkHost.playerSus[playerId].lagginessHistory.push(avgPingDiff);

							window.bonkHost.drawLagginess(playerId);
						}
						break;
				}
				return response;
			}
		}

		for(const i of Object.keys(window.bonkHost.stateFunctions)) {
			if(typeof window.bonkHost.stateFunctions[i] !== "function") continue;
			const ogFunc = window.bonkHost.stateFunctions[i];
			window.bonkHost.stateFunctions[i] = function() {
				let response = ogFunc.apply(window.bonkHost.stateFunctions, arguments);
				switch(i) {
					case "go":
					case "goInProgress":
						window.bonkHost.handleHostChange(false);
						window.bonkHost.playerManagement.canBeVisible = true;
						window.bonkHost.menuFunctions.visible = true;
						window.bonkHost.menuFunctions.updatePlayers();
						window.bonkHost.playerManagement.show();
						document.getElementById("hostPlayerMenuTeamlock").checked = window.bonkHost.toolFunctions.getGameSettings().tl;
						break;
				}
				return response;
			}
		}
	}, 50);
}


const chatHandler = e => {
	if(e.keyCode === 13) {
		if(e.target.value.length > 0) {
			if(e.target.value[0] === "/") {
				let command = e.target.value.split(" ")[0].substring(1);
				let args = e.target.value.split(" ").slice(1);
				newArgs = [];
				for(let i = 0; i < args.length; i++) {
					if(args[i][0] === '"' && args[i][args[i].length - 1] !== '"') {
						let str = args[i];
						for(let j = i + 1; j < args.length; j++) {
							str += " " + args[j];
							if(args[j][args[j].length - 1] === '"') {
								i = j;
								break;
							}
						}
						newArgs.push(str.substring(1, str.length - 1));
					}
					else if(args[i][0] === '"' && args[i][args[i].length - 1] === '"') {
						newArgs.push(args[i].substring(1, args[i].length - 1));
					}
					else {
						newArgs.push(args[i]);
					}
				}
				args = newArgs;
				// Save without reference
				let oldMsg = e.target.value + "";
				e.target.value = "";
				if(command == "hhelp") {
					window.bonkHost.menuFunctions.showStatusMessage("/balance * -100 to 100 -- Balances everyone","#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage("/balanceall -100 to 100 -- Balances everyone","#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage("/scoreboard -- Shows the scoreboard from the last game","#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage("/start -- Starts the game","#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage("/freejoin on/off -- Lets people join during the game","#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage('/host "user name" -- Gives host to the player',"#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage('/ban "user name" -- Kicks the player and prevents them from joining with the same account',"#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage('/unban "user name" -- Unbans the player but doesn\'t remove kicked status',"#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage('/bans -- Lists banned players',"#b53030",false);
					window.bonkHost.menuFunctions.showStatusMessage('/resetpos -- Resets host menu position',"#b53030",false);
				}
				else if(command == "start") {
					if(!isHost()) {
						window.bonkHost.menuFunctions.showStatusMessage("* Must be room host to use this command", "#b53030", false);
						return;
					}
					window.bonkHost.startGame();
				}
				else if(command == "freejoin") {
					if(args.length == 0) {
						window.bonkHost.freejoin = !window.bonkHost.freejoin;
					}
					else if(["true", "on", "yes", "enable"].includes(args[0])) {
						window.bonkHost.freejoin = true;
					}
					else if(["false", "off", "no", "disable"].includes(args[0])) {
						window.bonkHost.freejoin = false;
					}
					window.bonkHost.menuFunctions.showStatusMessage("* Freejoin " + (window.bonkHost.freejoin ? "on" : "off"), "#b53030", false);
					document.getElementById('hostPlayerMenuFreejoin').checked = window.bonkHost.freejoin;
				}
				else if(command == "host") {
					if(args.length === 0) {
						window.bonkHost.menuFunctions.showStatusMessage(`* Usage: /${command} "user name"`, "#b53030", false);
						return;
					}
					if(!isHost()) {
						window.bonkHost.menuFunctions.showStatusMessage("* Must be room host to use this command", "#b53030", false);
						return;
					}
					let id = window.bonkHost.players.findIndex(e => {return e && e.userName === args[0]});
					if(id !== -1) {
						window.bonkHost.toolFunctions.networkEngine.sendHostChange(id);
					}
					else {
						window.bonkHost.menuFunctions.showStatusMessage("* Giving host failed, username " + args[0] + " not found in this room", "#b53030", false);
					}
				}
				else if(command == "ban") {
					if(args.length === 0) {
						window.bonkHost.menuFunctions.showStatusMessage(`* Usage: /${command} "user name"`, "#b53030", false);
						return;
					}
					window.bonkHost.ban(args[0]);
				}
				else if(command == "unban") {
					if(args.length === 0) {
						window.bonkHost.menuFunctions.showStatusMessage(`* Usage: /${command} "user name"`, "#b53030", false);
						return;
					}
					if(!window.bonkHost.bans.includes(args[0])) {
						window.bonkHost.menuFunctions.showStatusMessage(`* Username ${args[0]} not found in ban list`, "#b53030", false);
						return;
					}
					window.bonkHost.menuFunctions.showStatusMessage(`* Removing ${args[0]} from ban list`, "#b53030", false);
					window.bonkHost.bans.splice(window.bonkHost.bans.indexOf(args[0]), 1);
				}
				else if(command == "bans") {
					window.bonkHost.menuFunctions.showStatusMessage("* List of banned players:\n" + window.bonkHost.bans.join("\n"), "#b53030", false);
				}
				else if((command == "balance" && args[0] === "*") || command == "balanceall") {
					if(args.length === 0) {
						window.bonkHost.menuFunctions.showStatusMessage(`* Usage: /${command} "user name"`, "#b53030", false);
						return;
					}
					if(!isHost()) {
						window.bonkHost.menuFunctions.showStatusMessage("* Must be room host to use this command", "#b53030", false);
						return;
					}
					let amount = parseInt(args[args.length - 1]);
					if(amount < -100 || amount > 100 || isNaN(amount)) {
						window.bonkHost.menuFunctions.showStatusMessage("* Balance must be between -100 and 100", "#b53030", false);
						return;
					}
					for(let i = 0; i < window.bonkHost.players.length; i++) {
						window.bonkHost.gameInfo[2].bal[i] = amount;
						window.bonkHost.toolFunctions.networkEngine.sendBalance(e, amount);
					};
					if(amount != 0) {
						window.bonkHost.menuFunctions.showStatusMessage("* Buff/nerf changed for all players", "#b53030", false);
					}
					else {
						window.bonkHost.menuFunctions.showStatusMessage("* Buff/nerf reset for all players", "#b53030", false);
					}
					if (window.bonkHost.menuFunctions) {
						window.bonkHost.menuFunctions.updateGameSettings();
						window.bonkHost.menuFunctions.updatePlayers();
					}
				}
				else if(command == "scoreboard") {
					if(window.bonkHost.toolFunctions.getGameSettings().ga === "b") {
						const players = document.getElementById("ingamewinner_scores_left").textContent.slice(0, -1).split(":\r\n");
						const scores = document.getElementById("ingamewinner_scores_right").textContent.split("\r\n");
						const longestScore = scores.reduce((a, b) => {return a.length > b.length ? a : b}).length;
						window.bonkHost.menuFunctions.showStatusMessage("* Scoreboard from the last game:", "#b53030", true);

						for(let i = 0; i < players.length; i++) {
							// \u2007 is a figure space (witdh of one digit)
							window.bonkHost.menuFunctions.showStatusMessage(`${scores[i].padStart((longestScore), "\u2007")}\t${players[i]}`, "#b53030", false);
						}
					}
					else if(window.bonkHost.toolFunctions.getGameSettings().ga === "f" && window[BIGVAR].bonkHost.footballState) {
						const scores = window[BIGVAR].bonkHost.footballState.scores.map(s => s.toString());
						const longestScore = (scores[2].length > scores[3].length ? scores[2] : scores[3]).length;
						window.bonkHost.menuFunctions.showStatusMessage(`${scores[3].padStart((longestScore), "\u2007")}\tBLUE TEAM`, "#b53030", false);
						window.bonkHost.menuFunctions.showStatusMessage(`${scores[2].padStart((longestScore), "\u2007")}\tRED TEAM`, "#b53030", false);
					}
				}
				else if(command == "resetpos") {
					document.getElementById("hostPlayerMenu").style.removeProperty("top");
					document.getElementById("hostPlayerMenu").style.removeProperty("bottom");
					document.getElementById("hostPlayerMenu").style.removeProperty("left");
					document.getElementById("hostPlayerMenu").style.removeProperty("right");
					let ls = JSON.parse(localStorage.getItem("bonkHost"));
					ls.position = undefined;
					localStorage.setItem("bonkHost", JSON.stringify(ls));
				}
				else {
					e.target.value = oldMsg;
				}
			}
		}
	}
}

document.getElementById("newbonklobby_chat_input").addEventListener("keydown", chatHandler, true);
document.getElementById("ingamechatinputtext").addEventListener("keydown", chatHandler, true);

const chatObserver = new MutationObserver(e => {
	for(let mutation of e) {
		if(mutation.type == "childList") {
			for(let node of mutation.addedNodes) {
				if(node.textContent === "* Accepted commands are listed above ") {
					window.bonkHost.menuFunctions.showStatusMessage(`/hhelp - commands from host mod`, "#b53030", false);
				}
				else if(node.textContent[0] === "*" && node.textContent.endsWith((" has left the game "))) {
					let userName = node.textContent.slice(2).slice(0, -19);
					if(window.bonkHost.playerHistory[userName].guest) return;
					let banButton = document.createElement("span");
					banButton.className = "newbonklobby_mapsuggest_high newbonklobby_chat_link";
					banButton.textContent = "[Click to ban]";
					banButton.style = "color: #b53030 !important;";
					banButton.onclick = () => {
						if(banButton.textContent === "[Click to ban]") {
							window.bonkHost.ban(userName);
							banButton.textContent = "[Click to unban]";
						}
						else {
							window.bonkHost.bans.splice(window.bonkHost.bans.indexOf(userName), 1);
							window.bonkHost.menuFunctions.showStatusMessage(`* Removing ${userName} from ban list`, "#b53030", false);
							banButton.textContent = "[Click to ban]";
						}
					}
					node.appendChild(banButton);
				}
			}
		}
	}
});

chatObserver.observe(document.getElementById("newbonklobby_chat_content"), {attributes: false, childList: true, subtree: false});

const mapSuggestionModeRegex = newStr.match(/([A-Za-z0-9\$_]{3}\[[0-9]{1,4}\]\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,4}\]){2}\]\([A-Za-z0-9\$_]{3}\[[0-9]{1,4}\]\);){7}if\([A-Za-z0-9\$_]{3}\[[0-9]{1,4}\]\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,4}\]){2}\] > 250/)[0];

let SUGGESTION_MODE_BUTTON = `
let args = arguments;
if(!!window.bonkHost.bonkModesObject[args[0].m.mo]) {
	let space = document.createElement("span");
	space.classList.add("newbonklobby_mapsuggest_high");
	space.appendChild(document.createTextNode(" "));


	let smb = document.createElement("span");
	smb.classList.add("newbonklobby_mapsuggest_high");
	smb.classList.add("newbonklobby_chat_link");
	smb.style.color="#ff0000";
	smb.onclick = e => {
		smb.parentNode.getElementsByClassName("newbonklobby_mapsuggest_high newbonklobby_chat_link")[0].click();
		window.bonkHost.bonkSetMode(args[0].m.mo);
	};
	${mapSuggestionModeRegex.split("]")[0] + "]"}.appendChild(space);
	smb.appendChild(document.createTextNode("[" + window.bonkHost.bonkModesObject[args[0].m.mo].lobbyName + "]"));
	${mapSuggestionModeRegex.split("]")[0] + "]"}.appendChild(smb);
}
`;

let APPEND_SUGGESTION_MODE_BUTTON = `
	A7b[31].appendChild(space);
	smb.appendChild(document.createTextNode("[" + r6t[47].modes[A7b[4][I$2[12].suggestID].m.mo].lobbyName + "]"));
	A7b[31].appendChild(smb);
}
`;

let modeStuff = newStr.match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]=class [A-Za-z0-9\$_]{3}\{constructor.{1,400}this\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,3}\]){2}\]=2;/)[0].split("=")[0];

let modesObject =`${modeStuff}.modes`;

window.bonkHost.drawLagginess = (playerId) => {
	if(!window.bonkHost.playerSus[playerId] || !window.bonkHost.playerSus[playerId].lagginessHistory || !window.bonkHost.players[playerId] || window.bonkHost.toolFunctions.networkEngine.getLSID() === playerId) return false;
	let graph = document.getElementById("hostPlayerMenuCheatBox").children[window.bonkHost.players.filter(p=>p).indexOf(window.bonkHost.players[playerId])];
	if(graph.width !== graph.clientWidth && document.getElementById('hostPlayerMenu').style.visibility != "hidden") {
		graph.width = graph.clientWidth;
	}
	while (window.bonkHost.playerSus[playerId].lagginessHistory.length > Math.max(graph.clientWidth, 300)) {
		window.bonkHost.playerSus[playerId].lagginessHistory.shift();
	}
	let ctx = graph.getContext("2d");
	ctx.scale(1, -1);
	ctx.beginPath();
	ctx.clearRect(0, 0, graph.width, graph.height);
	ctx.strokeStyle = "#0f0";
	let lagginessHistory = window.bonkHost.playerSus[playerId].lagginessHistory.slice(-graph.clientWidth);
	let max = Math.max(0, Math.max.apply(Math, lagginessHistory));
	let min = Math.min(-60, Math.min.apply(Math, lagginessHistory)) - max;
	ctx.moveTo(0, (lagginessHistory[0] - max) / min * graph.height);
	for(let i = 1; i < lagginessHistory.length; i++) {
		ctx.lineTo(i, (lagginessHistory[i] - max) / min * graph.height);
	}
	ctx.stroke();
	for(let i = 1; i < 11; i++) {
		if (min - Math.abs(max) < -5 - i * graph.height) {
			ctx.beginPath();
			ctx.strokeStyle = "#f00";
			ctx.moveTo(0, (-5 - i*graph.height - max) / min * graph.height);
			ctx.lineTo(300, (-5 - i*graph.height - max) / min * graph.height);
			ctx.stroke();
		}
		else {
			break;
		}
	}
	if(window.bonkHost.playerSus[playerId].cheatWarning) {
		ctx.font = "16px monospace";
		ctx.fillText("⚠️", 0, 16);
	}
	if(window.bonkHost.playerSus[playerId].lagginessHistory === undefined || !window.bonkHost.players[playerId] || window.bonkHost.toolFunctions.networkEngine.getLSID() === playerId) {
		ctx.clearRect(0, 0, graph.width, graph.height);
	}
	return true;
}

window.bonkHost.modeDropdownCreated = false;
window.bonkHost.createModeDropdown = () => {
	if (window.bonkHost.modeDropdownCreated) return;
	window.bonkHost.modeDropdownCreated = true;
	const dropdown = document.createElement("div");
	dropdown.classList = "newbonklobby_settings_button brownButton brownButton_classic buttonShadow";
	const mds = dropdown.style;
	mds.color = "#ffffff";
	mds.position = "absolute";
	mds.right = "15px";
	mds.bottom = "55px";
	mds.display = "flex";
	mds.textAlign = "center";
	mds.flexDirection = "column-reverse";

	document.getElementById("newbonklobby_modebutton").remove();
	let title = document.createElement("div");
	title.classList = "dropdown_classic";
	title.innerText = "Mode";
	title.id = "newbonklobby_modebutton";
	title.style.position = "unset";
	dropdown.appendChild(title);

	const options = [];
	let dropdownOpen = false;

	function toggleVisibility(e) {
		dropdownOpen = !dropdownOpen;
		for (const o of options) {
			o.style.visibility = dropdownOpen ? "" : "hidden";
		}
		e.stopImmediatePropagation();
	}

	for (const mode of Object.keys(window.bonkHost.bonkModesObject)) {
		const option = document.createElement("div");
		option.classList = "dropdown-option dropdown_classic";
		option.style.display = "block";
		option.style.visibility = "hidden";
		option.style.fontSize = "15px";
		option.innerText = window.bonkHost.bonkModesObject[mode].lobbyName;
		option.onclick = (e) => {
			window.bonkHost.bonkSetMode(mode);
			toggleVisibility(e);
		};
		options.push(option);
		dropdown.appendChild(option);
	}

	title.addEventListener("click", toggleVisibility);

	document.getElementById("newbonklobby_settingsbox").appendChild(dropdown);
};

let stateCreationString = newStr.match(/[A-Za-z]\[...(\[[0-9]{1,4}\]){2}\]\(\[\{/)[0];
let stateCreationStringIndex = stateCreationString.match(/[0-9]{1,4}/g);
stateCreationStringIndex = stateCreationStringIndex[stateCreationStringIndex.length - 1];
let stateCreation = newStr.match(`[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]=[A-Za-z0-9\$_]{3}\\[[0-9]{1,4}\\]\\[[A-Za-z0-9\$_]{3}\\[[0-9]{1,4}\\]\\[${stateCreationStringIndex}\\]\\].+?(?=;);`)[0];
stateCreationString = stateCreation.split(']')[0] + "]";

const SET_STATE = `
if (
	${BIGVAR}.bonkHost.state &&
	window.bonkHost.keepState &&
	window.bonkHost.toolFunctions.getGameSettings().map.s.re &&
	window.bonkHost.toolFunctions.getGameSettings().ga === "b" &&
	${BIGVAR}.bonkHost.state.mm.dbid == window.bonkHost.toolFunctions.getGameSettings().map.m.dbid &&
	${BIGVAR}.bonkHost.state.mm.dbv == window.bonkHost.toolFunctions.getGameSettings().map.m.dbv
	) {
	for(let i = 0; i < ${BIGVAR}.bonkHost.state.discs.length; i++) {
		if(${BIGVAR}.bonkHost.state.discs[i] != undefined) {
			if(${BIGVAR}.bonkHost.state.discs[i].team !== window.bonkHost.players[i].team) {
				let discInfo = JSON.parse(JSON.stringify(${stateCreationString}.discs[i]));
				${stateCreationString}.discs[i] = ${BIGVAR}.bonkHost.state.discs[i];
				${stateCreationString}.discs[i].sx = discInfo.sx;
				${stateCreationString}.discs[i].sy = discInfo.sy;
				${stateCreationString}.discs[i].sxv = discInfo.svx;
				${stateCreationString}.discs[i].syv = discInfo.syv;
				${stateCreationString}.discs[i].spawnTeamInfo = discInfo.spawnTeamInfo;
				${stateCreationString}.discs[i].team = discInfo.team;
			}
			else {
				${stateCreationString}.discs[i] = ${BIGVAR}.bonkHost.state.discs[i];
			}
			if(window.bonkHost.toolFunctions.getGameSettings().mo=='sp') {
				${stateCreationString}.discs[i].a1a -= Math.min(2*30, 2*30 - ${BIGVAR}.bonkHost.state.ftu)*3;
			}
		}
	}
	for(let i = 0; i < ${BIGVAR}.bonkHost.state.discDeaths.length; i++) {
		if(${BIGVAR}.bonkHost.state.discDeaths[i] != undefined) {
			${stateCreationString}.discDeaths[i] = ${BIGVAR}.bonkHost.state.discDeaths[i];
		}
	}
	${stateCreationString}.physics=${BIGVAR}.bonkHost.state.physics;
	${stateCreationString}.seed=${BIGVAR}.bonkHost.state.seed;
	${stateCreationString}.rc=${BIGVAR}.bonkHost.state.rc;
	${stateCreationString}.rl=${BIGVAR}.bonkHost.state.rl - Math.min(60, 60 - ${BIGVAR}.bonkHost.state.ftu);
	${stateCreationString}.ftu=60;
	${stateCreationString}.shk=${BIGVAR}.bonkHost.state.shk;
	${stateCreationString}.projectiles=${BIGVAR}.bonkHost.state.projectiles;
	${stateCreationString}.capZones=${BIGVAR}.bonkHost.state.capZones;
	window.bonkHost.keepState=false;
};
if(${stateCreationString}.scores.length > 0 && document.getElementById('hostPlayerMenuKeepScores').checked) {
	if(window.bonkHost.toolFunctions.getGameSettings().ga === "b" && ${BIGVAR}.bonkHost.state !== undefined) {
		${stateCreationString}.scores = ${BIGVAR}.bonkHost.state.scores;
	}
	else if(window.bonkHost.toolFunctions.getGameSettings().ga === "f" && ${BIGVAR}.bonkHost.footballState !== undefined) {
		${stateCreationString}.scores = ${BIGVAR}.bonkHost.footballState.scores;
	}
}
`;

// Step function beginning
// First 2 score indexes are null if teams are on
const STEP_BEGIN = `
{
	let state = arguments[0];
	let gs = arguments[4];
	let updatePlayers = false;
	if(${BIGVAR}.bonkHost.state !== undefined) {
		if(gs.tea) {
			let teams = state.players.filter(p=>p).map(p=>p.team);
			for(let i = 2; i < 7; i++) {
				if(state.scores[i] && state.scores[i] === 0 && !teams.includes(i)) {
					state.scores[i] = null;
				}
			}
			state.scores = [null, null, ...state.scores.slice(2, 6)];
		}
		if(document.getElementById("gamerenderer").style.visibility === "inherit" && ${BIGVAR}.bonkHost.state.players.map(p => p?.team).join() != state.players.map(p => p?.team).join()) {
			updatePlayers = true;
		}
	}
	else {
		updatePlayers = true;
	}
	${BIGVAR}.bonkHost.state = state;
	if(updatePlayers && window.bonkHost.inGame && !window.bonkHost.toolFunctions.getGameSettings().q) {
		window.bonkHost.menuFunctions.updatePlayers();
	}
}
`;

const FOOTBALL_STEP_BEGIN = `
{
	let state = arguments[0];
	let updatePlayers = false;
	if(${BIGVAR}.bonkHost.footballState !== undefined) {
		if(document.getElementById("gamerenderer").style.visibility === "inherit" && ${BIGVAR}.bonkHost.footballState.players.map(p => p?.team).join() != state.players.map(p => p?.team).join()) {
			updatePlayers = true;
		}
	}
	else {
		updatePlayers = true;
	}
	${BIGVAR}.bonkHost.footballState = state;
	if(updatePlayers) {
		window.bonkHost.menuFunctions.updatePlayers();
	}
}
`;

document.getElementById('hostPlayerMenuFreejoin').addEventListener('change', (e) => {
	window.bonkHost.freejoin = e.target.checked;
});

document.getElementById('hostPlayerMenuTeamlock').addEventListener('change', () => {
	document.getElementById('newbonklobby_teamlockbutton').onclick();
});

document.getElementById('hostPlayerMenuCheatDetectionCheckbox').addEventListener('change', (e) => {
	window.bonkHost.cheatDetection = e.target.checked;
	if(window.bonkHost.cheatDetection) {
		document.getElementById('hostPlayerCheatDetection').style.left = "95%";
		document.getElementById('hostPlayerCheatDetection').style.visibility = "visible";
	}
	else {
		document.getElementById('hostPlayerCheatDetection').style.left = "0";
		document.getElementById('hostPlayerCheatDetection').style.visibility = "hidden";
	}
	window.bonkHost.menuFunctions.updatePlayers();
});

window.bonkHost.handlePlayerJoined = (playerID, playerName, guest) => {
	if(!isHost()) return;
	if(!guest && window.bonkHost.bans.includes(playerName)) {
		window.bonkHost.toolFunctions.networkEngine.banPlayer(playerID);
		return;
	}
	if(window.bonkHost.freejoin) {
		let team = 1;
		if(window.bonkHost.toolFunctions.getGameSettings().tea) {
			let teams = window.bonkHost.players.slice(0, -1).filter(p=>p && p.team > 1).map(p=>p.team);
			if(teams.every(t=>t==teams[0])) {
				team = teams[0];
			}
			else return;
		}
		window.bonkHost.stateFunctions.hostHandlePlayerJoined(playerID, window.bonkHost.players.length, team);
	}
}

window.bonkHost.ban = (playerName) => {
	if(window.bonkHost.bans.includes(playerName)) {
		window.bonkHost.menuFunctions.showStatusMessage("* " + playerName + " is already banned", "#b53030", false);
		return;
	}
	let id = window.bonkHost.players.findIndex(e => {return e && e.userName === playerName});
	if(id !== -1 && isHost()) {
		if(window.bonkHost.players[id].guest) {
			window.bonkHost.menuFunctions.showStatusMessage("* Banning guests doesn't work, so they'll get kicked instead", "#b53030", false);
		}
		else {
			window.bonkHost.bans.push(playerName);
		}
		window.bonkHost.toolFunctions.networkEngine.banPlayer(id);
	}
	else if(id !== -1) {
		window.bonkHost.menuFunctions.showStatusMessage(`* You're not room host, but ${playerName} will be added to ban list`, "#b53030", false);
		window.bonkHost.bans.push(playerName);
	}
	else {
		window.bonkHost.menuFunctions.showStatusMessage(`* Username ${playerName} not found in this room, but they'll be added to ban list`, "#b53030", false);
		window.bonkHost.bans.push(playerName);
	}
}


window.bonkHost.playerManagement.addPlayer = (playerEntry) => {
	for(let player of window.bonkHost.players.filter(p=>p)) {
		window.bonkHost.playerHistory[player.userName] = player;
	}
	while(window.bonkHost.playerManagement.getPlayer(playerEntry)) {
		window.bonkHost.playerManagement.removePlayer(playerEntry);
	}
	let newPlayerEntry = playerEntry.cloneNode(true);
	newPlayerEntry.classList.remove('newbonklobby_playerentry_half');
	newPlayerEntry.getElementsByClassName("newbonklobby_playerentry_ping")[0].remove();
	newPlayerEntry.getElementsByClassName("newbonklobby_playerentry_host")[0].remove();
	if(isHost()) {
		playerEntry.addEventListener('click', (e) => {
			let menu = document.getElementsByClassName("newbonklobby_playerentry_menu")[0];
			banButton = document.createElement("div");
			banButton.classList = "newbonklobby_playerentry_menu_button brownButton brownButton_classic buttonShadow";
			banButton.innerHTML = "BAN";
			banButton.onclick = () => {
				if(banButton.innerHTML == "BAN") {
					banButton.innerHTML = "SURE?";
					return;
				}
				window.bonkHost.ban(playerEntry.children[1].textContent);
				menu.style.display = "none";
			};
			for(let child of menu.childNodes) {
				if(child.textContent == "KICK") {
					menu.insertBefore(banButton, child.nextSibling);
					break;
				}
			}
		});
	}
	newPlayerEntry.onclick = e => {
		playerEntry.click();
		let menu = document.getElementsByClassName("newbonklobby_playerentry_menu")[0];
		document.getElementById("hostPlayerMenuBox").parentNode.appendChild(menu);
		newPlayerEntry.playerElement=playerEntry;
		menu.style.removeProperty("left");
		menu.style.right=0;
		menu.style.top=([...playerEntry.parentNode.children].indexOf(playerEntry))*43+"px";
	}
	newPlayerEntry.onmouseenter = playerEntry.onmouseenter;

	// Make spectators transparent
	let playerId = window.bonkHost.players.findIndex(p => p && (p.userName === newPlayerEntry.childNodes[1].textContent));
	if(
		!(window.bonkHost.toolFunctions.getGameSettings().ga === "b" && window[BIGVAR].bonkHost.state?.players[playerId]) &&
		!(window.bonkHost.toolFunctions.getGameSettings().ga === "f" && window[BIGVAR].bonkHost.footballState?.players[playerId])
	) {
		newPlayerEntry.style.filter = "opacity(0.4)";
	}

	// Listen for skin render
	let observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			// New child
			mutation.addedNodes.forEach((node) => {
				newPlayerEntry.firstChild.appendChild(node.cloneNode(true));
				observer.disconnect();
			});
		});
	});
	observer.observe(playerEntry.children[0], { childList: true });
	hostPlayerMenuBox.appendChild(newPlayerEntry);
	for(let i = 0; i < [...document.getElementById("hostPlayerMenuCheatBox").children].length; i++) {
		let graph = document.getElementById("hostPlayerMenuCheatBox").children[i];
		let playerId = window.bonkHost.players.indexOf(window.bonkHost.players.filter(p=>p)[i]);
		if(!window.bonkHost.drawLagginess(playerId)) {
			let ctx = graph.getContext("2d");
			ctx.scale(1, -1);
			ctx.clearRect(0, 0, graph.width, graph.height);
		}
	}
}

window.bonkHost.playerManagement.removePlayer = (playerEntry) => {
	let foundPlayerEntry = window.bonkHost.playerManagement.getPlayer(playerEntry);
	if(foundPlayerEntry) {
		hostPlayerMenuBox.removeChild(foundPlayerEntry);
	}
}

window.bonkHost.playerManagement.show = () => {
	if(!window.bonkHost.playerManagement.canBeVisible || document.getElementById("gamerenderer").style.visibility != "inherit") return;
	if(parent.document.getElementById('adboxverticalleftCurse') != null)
		parent.document.getElementById('adboxverticalleftCurse').style.display = "none";
	document.getElementById("hostPlayerMenuKeepPositions").parentNode.parentNode.style.filter = (window.bonkHost.toolFunctions.getGameSettings().map.s.re ? "" : "brightness(0.5)");
	document.getElementById("hostPlayerMenuKeepPositions").style.pointerEvents = (window.bonkHost.toolFunctions.getGameSettings().map.s.re ? "" : "none");
	document.getElementById("hostPlayerMenuRespawningRequiredWarning").style.display = (window.bonkHost.toolFunctions.getGameSettings().map.s.re ? "none" : "");
	document.getElementById('hostPlayerMenu').style.display = "unset";
	window.bonkHost.menuFunctions.updatePlayers();
	window.bonkHost.inGame = true;
	for(let graph of [...document.getElementById("hostPlayerMenuCheatBox").children]) {
		let ctx = graph.getContext("2d");
		ctx.scale(1, -1);
		ctx.clearRect(0, 0, graph.width, graph.height);
	}
}

window.bonkHost.playerManagement.hide = () => {
	window.bonkHost.inGame = false;
	document.getElementById('hostPlayerMenu').style.display = "none";
	if(parent.document.getElementById('adboxverticalleftCurse') != null)
		parent.document.getElementById('adboxverticalleftCurse').style.removeProperty("display");
}

// Can be called in other situations too
window.bonkHost.handleHostChange = (host) => {
	document.getElementById("hostPlayerMenuRestartButton").classList.toggle("brownButtonDisabled", !host);
	document.getElementById("hostPlayerMenuTeamlock").classList.toggle("brownButtonDisabled", !host);
	updateMapHistoryButtons();
	if(!host) {
		mapHistory = [];
		mapHistoryIndex = 0;
	}
}

window.bonkHost.playerManagement.collapse = (saveToLocalStorage = true) => {
	if(document.getElementById('hostPlayerMenu').style.visibility != "hidden") {
		document.getElementById('hostPlayerMenuControls').style.display = "none";
		document.getElementById('hostPlayerMenuControls').visibility = "hidden";
		document.getElementById('hostPlayerMenu').style.minWidth = 0;
		document.getElementById('hostPlayerMenu').style.minHeight = 0;
		document.getElementById('hostPlayerMenu').style.width = 0;
		document.getElementById('hostPlayerMenu').style.height = 0;
		document.getElementById('hostPlayerMenu').style.visibility = "hidden";
		document.getElementById('hostPlayerMenuCollapse').textContent = "+";
	}
	else {
		document.getElementById('hostPlayerMenu').style.visibility = "visible";
		document.getElementById('hostPlayerMenu').style.removeProperty("min-width");
		document.getElementById('hostPlayerMenu').style.removeProperty("min-height");
		document.getElementById('hostPlayerMenu').style.removeProperty("width");
		document.getElementById('hostPlayerMenu').style.removeProperty("height");
		document.getElementById('hostPlayerMenu').style.visibility = "visible";
		document.getElementById('hostPlayerMenuCollapse').textContent = "-";
		setTimeout(() => {document.getElementById('hostPlayerMenuControls').style.removeProperty("display");}, 100);
	}
	if(saveToLocalStorage) {
		let ls = JSON.parse(localStorage.getItem("bonkHost"));
		ls.collapse = (document.getElementById('hostPlayerMenu').style.visibility == "hidden");
		localStorage.setItem("bonkHost", JSON.stringify(ls));
	}
}

if(JSON.parse(localStorage.getItem("bonkHost")).collapse) {
	window.bonkHost.playerManagement.collapse(false);
}

{
	let position = JSON.parse(localStorage.getItem("bonkHost")).position;
	if(position !== undefined) {
		document.getElementById("hostPlayerMenu").style.left = position.left;
		document.getElementById("hostPlayerMenu").style.right = position.right;
		document.getElementById("hostPlayerMenu").style.top = position.top;
		document.getElementById("hostPlayerMenu").style.bottom = position.bottom;
	}
}

// Host menu mover

let startGrabPoint = {x:0,y:0};
let grabbing = false;
const hostMenuMover = e => {
	if(e.x - startGrabPoint.x < document.body.clientWidth / 2) {
		document.getElementById("hostPlayerMenu").style.left = e.x + startGrabPoint.x - document.getElementById("hostPlayerMenu").clientWidth;
		document.getElementById("hostPlayerMenu").style.right = "unset";
	}
	else {
		document.getElementById("hostPlayerMenu").style.right = document.body.clientWidth - e.x - startGrabPoint.x;
		document.getElementById("hostPlayerMenu").style.left = "unset";
	}

	if(e.y - startGrabPoint.y < document.body.clientHeight / 2) {
		document.getElementById("hostPlayerMenu").style.top = e.y - startGrabPoint.y;
		document.getElementById("hostPlayerMenu").style.bottom = "unset";
	}
	else {
		document.getElementById("hostPlayerMenu").style.bottom = document.body.clientHeight - e.y + startGrabPoint.y - document.getElementById("hostPlayerMenu").clientHeight;
		document.getElementById("hostPlayerMenu").style.top = "unset";
	}
}

window.bonkHost.playerManagement.startGrab = e => {
	grabbing = true;
	document.getElementById("hostPlayerMenuGrab").style.cursor = "grabbing"
	document.getElementById("hostPlayerMenu").style.transition = "unset";
	startGrabPoint.x = e.offsetX;
	startGrabPoint.y = e.offsetY;
	document.body.addEventListener("pointermove", hostMenuMover);
}

window.bonkHost.playerManagement.endGrab = e => {
	if(!grabbing) return;
	grabbing = false;
	document.getElementById("hostPlayerMenuGrab").style.cursor = "grab";
	document.getElementById("hostPlayerMenu").style.removeProperty("transition");
	document.body.removeEventListener("pointermove", hostMenuMover);
	let ls = JSON.parse(localStorage.getItem("bonkHost"));
	ls.position = {
		left: document.getElementById("hostPlayerMenu").style.left,
		right: document.getElementById("hostPlayerMenu").style.right,
		top: document.getElementById("hostPlayerMenu").style.top,
		bottom: document.getElementById("hostPlayerMenu").style.bottom
	};
	localStorage.setItem("bonkHost", JSON.stringify(ls));
}

document.getElementById("hostPlayerMenuGrab").addEventListener("pointerdown", window.bonkHost.playerManagement.startGrab);
document.body.addEventListener("pointerup", window.bonkHost.playerManagement.endGrab);

// Helper functions

window.bonkHost.playerManagement.getPlayer = (playerEntry, exact = false) => {
	if (exact) {
		let child = [...hostPlayerMenuBox.children].indexOf(playerEntry);
		if(child) return hostPlayerMenuBox.children[child];
	}
	for(let child of hostPlayerMenuBox.children) {
		if(child.children[1].textContent == playerEntry.children[1].textContent) {
			return child;
		}
	}
	return false;
}

window.bonkHost.playerManagement.movePlayer = (team, playerID = window.bonkHost.toolFunctions.networkEngine.getLSID()) => {
	if(!window.bonkHost.players[playerID] || !window.bonkHost.inGame || !isHost() || window.bonkHost.toolFunctions.getGameSettings().q) return;
	window.bonkHost.menuFunctions.visible = true;
	if(team > 0)
		window.bonkHost.stateFunctions.hostHandlePlayerJoined(playerID, window.bonkHost.players.length, team);
	else
		window.bonkHost.stateFunctions.hostHandlePlayerLeft(playerID);
	window.bonkHost.menuFunctions.updatePlayers();
}

window.bonkHost.startGame = () => {
	window.bonkHost.keepState = document.getElementById("hostPlayerMenuKeepPositions").checked;
	for(let callback of Object.keys(window.bonkHost.bonkCallbacks)) {
    	window.bonkHost.bonkCallbacks[callback]("startGame");
	}
}

// Fisher–Yates shuffle
const shuffle = (array) => {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
	return array;
}

window.bonkHost.shufflePlayers = () => {
	document.getElementById("teamshufflebox").style.visibility = "hidden";

	//Players per team
	let ppt = document.getElementById("teamshuffleppt").value;
	let teams = 0;
	for(let team of ["red", "blue", "yellow", "green"]) {
		if(document.getElementById("team_shuffle_"+team).checked) {
			teams++;
		}
	}
	if(ppt === "AUTO") {
		ppt = Math.ceil(window.bonkHost.players.length / teams);
	}
	let shuffledPlayers = shuffle(window.bonkHost.players);
	for(let team of ["red", "blue", "yellow", "green"]) {
		if(document.getElementById("team_shuffle_"+team).checked) {
			for(let i = 0; i < ppt; i++) {
			window.bonkHost.toolFunctions.networkEngine.changeOtherTeam(window.bonkHost.players.indexOf(shuffledPlayers.pop()), ["red", "blue", "yellow", "green"].indexOf(team)+2);
			}
		}
	}
}

let mapSelectionObserver = new MutationObserver(mutations => {
	for(let mutation of mutations) {
		for(let e of mutation.addedNodes) {
			let mode = e.getElementsByClassName('maploadwindowtextmode')[0];
			if(mode === undefined) mode = e.getElementsByClassName('maploadwindowtextmode_picks')[0];
			if(mode === undefined) return;
			if(mode.textContent !== "Any Mode") {
				mode.classList.add('brownButton');
				mode.classList.add('brownButton_classic');
				mode.classList.add('buttonShadow');
				mode.style.padding = "2px";
				mode.style.width = "90px";
			}
			mode.addEventListener("click", e => {
				if(!document.getElementById('newbonklobby_modebutton').classList.contains("brownButtonDisabled")) {
					window.bonkHost.bonkSetMode(Object.entries(window.bonkHost.bonkModesObject).filter(e => {return e[1].lobbyName === mode.textContent})[0][0]);
				}
			});
		}
	}
});
mapSelectionObserver.observe(document.getElementById('maploadwindowmapscontainer'), {attributes: false, childList: true, subtree: false});

/*Autocomplete*/

const autocomplete = e => {
	if (e.keyCode === 9) {
		e.preventDefault();
		e.stopPropagation();
		let chatText = e.target.value.split(' ');
		let length = 0;
		for (let i = 0; i < chatText.length; i++) {
			length += chatText[i].length + 1;
			if (length <= e.target.selectionStart || chatText[i] === "")
				continue;
			let foundAutocompletes = [];
			let foundAutocompletesOffsets = [];
			for (let j = 0; j < window.bonkCommands.length; j++) {
				if (window.bonkCommands[j].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').match("^" + chatText[i].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
					foundAutocompletes.push(window.bonkCommands[j]);
					foundAutocompletesOffsets.push(0);
				}
			}
			if (foundAutocompletes.length === 0) {
				if(chatText[0] !== "/unban") {
					for (let j = 0; j < window.bonkHost.players.filter(p=>p).length; j++) {
						for (let k = i; k >= 0; k--) {
							if (window.bonkHost.players.filter(p=>p).map(p=>p.userName)[j].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').match("^" + chatText.slice(k, i + 1).join(" ").toLowerCase().replace(/"/g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
								foundAutocompletes.push(window.bonkHost.players.filter(p=>p).map(p=>p.userName)[j]);
								foundAutocompletesOffsets.push(k);
							}
						}
					}
				}
				else {
					for (let j = 0; j < window.bonkHost.bans.length; j++) {
						for (let k = i; k >= 0; k--) {
							if (window.bonkHost.bans[j].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').match("^" + chatText.slice(k, i + 1).join(" ").toLowerCase().replace(/"/g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
								foundAutocompletes.push(window.bonkHost.bans[j]);
								foundAutocompletesOffsets.push(k);
							}
						}
					}
				}
			}
			if (foundAutocompletes.length === 1) {
				let oldlen = chatText.slice(foundAutocompletesOffsets[0], i + 1).join(" ").length;
				for (let j = i; j > foundAutocompletesOffsets[0]; j--) {
					chatText.splice(j, 1);
				}
				if (chatText[0][0] === "/" && i > 0 && foundAutocompletes[0].includes(" ")) {
					chatText[foundAutocompletesOffsets[0]] = `"${foundAutocompletes[0]}" `;
				} else {
					chatText[foundAutocompletesOffsets[0]] = foundAutocompletes[0] + (foundAutocompletesOffsets[0] === (chatText.length - 1) && (chatText[0][0] === "/") && (chatText[foundAutocompletesOffsets[0] + 1] !== "") ? " " : "");
				}
				if(chatText[foundAutocompletesOffsets[0] + 1] === "") {
					chatText.splice(foundAutocompletesOffsets[0] + 1, 1);
				}
				e.target.value = chatText.join(' ');
				e.target.selectionStart = length - oldlen + chatText[foundAutocompletesOffsets[0]].length + ((foundAutocompletesOffsets[0] === chatText.length - 1) && (chatText[0][0] !== "/") ? 0 : 1);
				e.target.selectionEnd = length - oldlen + chatText[foundAutocompletesOffsets[0]].length + ((foundAutocompletesOffsets[0] === (chatText.length - 1)) && (chatText[0][0] !== "/") ? 1 : 0);
				return;
			} else if (foundAutocompletes.length > 1) {
				let maxAutocomplete = "";
				let char = "";
				for (let j = 0; j >= 0; j++) {
					if(char === undefined) break;
					maxAutocomplete += char;
					char = "";
					for (let k = 0; k < foundAutocompletes.length; k++) {
						if (char === "") char = foundAutocompletes[k][j];
						else if (foundAutocompletes[k][j] !== char) {
							j = -Infinity;
							break;
						}
					}
				}
				if(maxAutocomplete === "") return;
				let oldlen = chatText[i].length;
				let quotes = (chatText[0][0] === "/" && foundAutocompletes.some(r => r.includes(" ")));
				if (quotes) {
					chatText[i] = `"${maxAutocomplete}"`;
				} else {
					chatText[i] = maxAutocomplete;
				}
				e.target.value = chatText.join(' ');
				e.target.selectionStart = length - oldlen + chatText[i].length - quotes * 2;
				e.target.selectionEnd = length - oldlen + chatText[i].length - quotes * 2;
				return;
			}
		}
	}
};
document.getElementById("newbonklobby_chat_input").addEventListener("keydown", autocomplete, true);
document.getElementById("ingamechatinputtext").addEventListener("keydown", autocomplete, true);

(() => {
	let selectedPlayer = null;
	let start = [], end = [];
	const wheelSize = 150;
	let oldAngle = null;
	const innerWheelRadius = (wheelSize/26.458)/2*8.5;
	window.bonkHost.updatePlayers = () => {
		[...document.getElementsByClassName("newbonklobby_playerentry")].filter(e => {
			return ["newbonklobby_playerbox_leftelementcontainer",
					"newbonklobby_playerbox_rightelementcontainer",
					"newbonklobby_playerbox_elementcontainer",
					"newbonklobby_specbox_elementcontainer",
					"hostPlayerMenuBox"].includes(e.parentNode.id);
		}).forEach(e => {
			e.addEventListener("mousedown", mouse => {
				if(isHost() || (e.children[1].textContent === window.bonkHost.players[window.bonkHost.toolFunctions.networkEngine.getLSID()].userName && !window.bonkHost.inGame)) {
					selectedPlayer = e;
					start = [mouse.clientY, mouse.clientX];
				}
			});
			e.addEventListener("click", mouse => {
				if(!isHost() && e.children[1].textContent === window.bonkHost.players[window.bonkHost.toolFunctions.networkEngine.getLSID()].userName && window.bonkHost.inGame) {
					mouse.stopImmediatePropagation();
				}
			}, true);
		});
	}
	document.addEventListener("mousemove", mouse => {
		if(selectedPlayer) {
			document.body.style.pointerEvents = "none";
			let wheelType = (!window.bonkHost.toolFunctions.getGameSettings().tea) ? "selectionWheel" : "selectionWheelTeams";
			document.getElementById(wheelType).style.display = "block";
			document.getElementById(wheelType).style.top = start[0]-document.getElementById(wheelType).getBoundingClientRect().height/2+"px";
			document.getElementById(wheelType).style.left = start[1]-document.getElementById(wheelType).getBoundingClientRect().width/2+"px";
			end = [mouse.clientY, mouse.clientX];
			if(Math.sqrt((end[0]-start[0])**2 + (end[1]-start[1])**2) >= innerWheelRadius) {
				if(!window.bonkHost.toolFunctions.getGameSettings().tea) {
					let angle = end[1] < start[1];
					if(angle) {
						document.getElementById("selectionWheel").children[0].children[0].children[0].style.opacity = 1;
						document.getElementById("selectionWheel").children[0].children[1].children[0].style.opacity = 0.5;
					}
					else {
						document.getElementById("selectionWheel").children[0].children[0].children[0].style.opacity = 0.5;
						document.getElementById("selectionWheel").children[0].children[1].children[0].style.opacity = 1;
					}
					selectedPlayer.onmouseenter(angle);
					oldAngle = angle;
				}
				else {
					let angle = Math.atan((end[0]-start[0])/(end[1]-start[1]))/Math.PI*180+360/5/2;
					if(end[1] < start[1]) {
						angle += 180;
					}
					else if(end[0] < start[0]) {
						angle += 360;
					}
					angle = Math.floor((angle%360)/(360/5));
					if(oldAngle !== angle) {
						for(let child of [...document.getElementById("selectionWheelTeams").children[0].children[0].children]) {
							child.style.opacity = 0.5;
						}
					}
					document.getElementById("selectionWheelTeams").children[0].children[0].children[angle].style.opacity = 1;
					selectedPlayer.onmouseenter(angle);
					oldAngle = angle;
				}
			}
			else {
				if(oldAngle !== null) {
					for(let child of [...document.getElementById("selectionWheelTeams").children[0].children[0].children]) {
						child.style.opacity = 0.5;
					}
					for(let child of [...document.getElementById("selectionWheel").children[0].children]) {
						child.children[0].style.opacity = 0.5;
					}
				}
				selectedPlayer.onmouseenter(null);
				oldAngle = null;
			}
		}
	});
	const changeTeam = mouse => {
		document.getElementById("selectionWheel").style.display = "none";
		document.getElementById("selectionWheelTeams").style.display = "none";
		if(!selectedPlayer) return;
		document.body.style.removeProperty("pointer-events");
		end = [mouse.clientY, mouse.clientX];
		const sendTeamChange = (i, team) => {
			if(i == window.bonkHost.toolFunctions.networkEngine.getLSID()) {
				window.bonkHost.toolFunctions.networkEngine.changeOwnTeam(team);
			}
			else {
				window.bonkHost.toolFunctions.networkEngine.changeOtherTeam(i, team);
			}
		}
		if(Math.sqrt((end[0]-start[0])**2 + (end[1]-start[1])**2) >= innerWheelRadius) {
			if(!window.bonkHost.toolFunctions.getGameSettings().tea) {
			for(let child of [...document.getElementById("selectionWheel").children[0].children]) {
				child.children[0].style.opacity = 0.5;
			}
			sendTeamChange(window.bonkHost.players.findIndex(i => {return i && i.userName === selectedPlayer.children[1].textContent}), end[1]<start[1] ? 1 : 0);
			}
			else {
				let angle = Math.atan((end[0]-start[0])/(end[1]-start[1]))/Math.PI*180+360/5/2;
				if(end[1] < start[1]) {
					angle += 180;
				}
				else if(end[0] < start[0]) {
					angle += 360;
				}
				angle = Math.floor((angle%360)/(360/5));
				sendTeamChange(window.bonkHost.players.findIndex(i => {return i && i.userName === selectedPlayer.children[1].textContent}), [0, 5, 4, 3, 2][angle]);
			}
		}
		else {
			selectedPlayer.click();
		}
		selectedPlayer = null;
	}
	document.addEventListener("mouseup", changeTeam);
	document.addEventListener("mouseenter", mouse => {
		let selectedPlayer = (mouse.buttons !== 0 ? selectedPlayer : null);
		if(!selectedPlayer) {
			changeTeam(mouse);
		}
	});
})();
let patchCounter = 0;
const patch = (a, b) => {
	let c = newStr;
	newStr = newStr.replace(a, b);
	/*console.log(`Patch ${patchCounter++}: ${c === newStr ? 'fail' : 'success'}`);
	if(c === newStr) {
		console.log(`Failed to patch ${a} with ${b}`);
	}*/
	return c !== newStr;
}

//Remove round limit
document.getElementById('newbonklobby_roundsinput').removeAttribute("maxlength");
patch(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]=Math\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\(Math\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\(1,[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\),9\);/, '');
const roundVal = newStr.match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,4}\]=parseInt\([A-Za-z0-9\$_]{3}(\[0\]){2}\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,4}\]){2}\]\)\;/)[0];
const roundValVar = roundVal.split('=')[0];
patch(roundVal, `${roundValVar}=parseInt(document.getElementById('newbonklobby_roundsinput').value);if(isNaN(${roundValVar}) || ${roundValVar} <= 0){return;}`);

//Mode selection menu. Custom patch
let lastTarget = newStr.match(/editorCanTarget:(true|false)\};/g)
lastTarget = lastTarget[lastTarget.length - 1];
newStr = newStr.split(lastTarget);

newStr[newStr.length - 1] = `
window.bonkHost.bonkModesObject=${modesObject};
window.bonkHost.bonkSetMode = m => {
	if(m === "f") {
		window.bonkHost.gameInfo[2].ga = "f";
		window.bonkHost.gameInfo[2].tea=true;
		window.bonkHost.toolFunctions.networkEngine.sendTeamSettingsChange(window.bonkHost.gameInfo[2].tea);
	}
	else {
		window.bonkHost.gameInfo[2].ga = "b";
	}
	window.bonkHost.gameInfo[2].mo = m;
	window.bonkHost.menuFunctions.updatePlayers();
	window.bonkHost.toolFunctions.networkEngine.sendGAMO(window.bonkHost.gameInfo[2].ga, window.bonkHost.gameInfo[2].mo);
	window.bonkHost.menuFunctions.updateGameSettings();
}
window.bonkHost.createModeDropdown();
` + newStr[newStr.length - 1];

newStr = newStr.join(lastTarget);

//Add mode button to map suggestion message
patch(mapSuggestionModeRegex, mapSuggestionModeRegex.split("if")[0] + SUGGESTION_MODE_BUTTON + "if" + mapSuggestionModeRegex.split("if")[1]);

//Internal var
patch(`function ${BIGVAR}(){}`, `function ${BIGVAR}(){}${BIGVAR}.bonkHost={};`);

/////////////
//Host menu//
/////////////

//Save latest state
const stateRegex = newStr.match(/[A-Za-z]\[[A-Za-z0-9\$_]{3}(\[[0-9]{1,3}\]){2}\]={discs/)[0];
patch(stateRegex, STEP_BEGIN + stateRegex);

//Football state
let footballStateRegex = newStr.match(/=\[\];if\(\![A-Za-z0-9\$_]\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]\[[0-9]{1,3}\]\]\)\{/)[0];
footballStateRegex = footballStateRegex.split(";");
patch(footballStateRegex.join(";"), footballStateRegex[0] + ";" + FOOTBALL_STEP_BEGIN + footballStateRegex[1]);

//Apply latest state
const stateSetRegex = newStr.match(/\* 999\),[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],null,[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],true\);/)[0];
patch(stateSetRegex, stateSetRegex + SET_STATE);

//Handle player joins and rebans
let playerJoinedCustom = newStr.match(/\[\d\],ping:105\};/)[0];
patch(playerJoinedCustom, playerJoinedCustom+`window.bonkHost.handlePlayerJoined(...arguments);`);

//Joined room
let connectionMatch = newStr.match(/reconnection:false\}\);/)[0];
patch(connectionMatch, connectionMatch + `window.bonkHost.bans=[];`);


//Get some useful objects
let menuRegex = newStr.match(/== 13\){...\(\);}}/)[0];
patch(menuRegex, menuRegex + "window.bonkHost.menuFunctions = this; window.bonkHost.wrap();");
let toolRegex = newStr.match(/=new [A-Za-z0-9\$_]{1,3}\(this,[A-Za-z0-9\$_]{1,3}\[0\]\[0\],[A-Za-z0-9\$_]{1,3}\[0\]\[1\]\);/);
patch(toolRegex, toolRegex + "window.bonkHost.toolFunctions = this;");
let infoRegex = newStr.match(/[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]=\{id:-1,element:null\};/)[0];
patch(infoRegex, infoRegex + "window.bonkHost.gameInfo = arguments;");
patch("newbonklobby_votewindow_close", "window.bonkHost.players = arguments[1];" + "newbonklobby_votewindow_close");
// state handling
patch("{a:0.0};", "{a:0.0};" + `window.bonkHost.stateFunctions = this;`);

//Big class
let bigClass = newStr.match(/[A-Z]\[[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[0-9]+\]\]\([A-Za-z0-9\$_]{1,3}\[0\]\[0\]\);[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[0-9]+\]\]\([A-Za-z0-9\$_]{1,3}\[[0-9]+\],{m:/)[0][0];
patch(`function ${bigClass}(){}`, `function ${bigClass}(){};window.bonkHost.bigClass=${bigClass};`);

//Function for all callbacks
let callbacks = [...newStr.match(/[A-Za-z0-9\$_]{3}\(\.\.\./g)];
for(let callback of callbacks) {
	patch(`function ${callback}`, `window.bonkHost.bonkCallbacks["${callback.split("(")[0]}"] = ${callback.split("(")[0]};` + `function ${callback}`);
}

//Frames in game
let fig = newStr.match(/\[[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\] \- 30\]/)[0].split(' ')[0].slice(1);
patch(`${fig}++;`, `${fig}++;window.bonkHost.fig=${fig};`);
	console.log("Bonk Host injector run");
	return newStr;
}

if(!window.bonkCommands) window.bonkCommands = [];

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(
`Whoops! Bonk Host was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
Bonk Host, such as the Bonk Leagues Client. You would have to disable it to use \
Bonk Host.`);
		throw error;
	}
});

console.log("Bonk Host injector loaded");
