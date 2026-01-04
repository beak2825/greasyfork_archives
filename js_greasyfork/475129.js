// ==UserScript==
// @name         AlphaJong
// @namespace    alphajong
// @version      1.3.2_79
// @description  A Mahjong Soul Bot.
// @author       Jimboom7
// @match        https://mahjongsoul.game.yo-star.com/*
// @match        https://majsoul.com/*
// @match        https://game.maj-soul.com/*
// @match        https://game.maj-soul.net/*
// @match        https://majsoul.union-game.com/*
// @match        https://game.mahjongsoul.com/*
// @downloadURL https://update.greasyfork.org/scripts/475129/AlphaJong.user.js
// @updateURL https://update.greasyfork.org/scripts/475129/AlphaJong.meta.js
// ==/UserScript==


//################################
// PARAMETERS
// Contains Parameters to change the playstile of the bot. Usually no need to change anything.
//################################

/* PERFORMANCE MODE
* Range 0 to 4. Decrease calculation time at the cost of efficiency (2 equals the time of ai version 1.2.1 and before).
* 4 = Highest Precision and Calculation Time. 0 = Lowest Precision and Calculation Time.
* Note: The bot will automatically decrease the performance mode when it approaches the time limit.
* Note 2: Firefox is usually able to run the script faster than Chrome.
*/
var PERFORMANCE_MODE = 4;

//HAND EVALUATION CONSTANTS
var EFFICIENCY = 1.0; // Lower: Slower and more expensive hands. Higher: Faster and cheaper hands. Default: 1.0, Minimum: 0
var SAFETY = 1.0; // Lower: The bot will not pay much attention to safety. Higher: The bot will try to play safer. Default: 1.0, Minimum: 0
var SAKIGIRI = 1.0; //Lower: Don't place much importance on Sakigiri. Higher: Try to Sakigiri more often. Default: 1.0, Minimum: 0

//CALL CONSTANTS
var CALL_PON_CHI = 1.0; //Lower: Call Pon/Chi less often. Higher: Call Pon/Chi more often. Default: 1.0, Minimum: 0
var CALL_KAN = 1.0; //Lower: Call Kan less often. Higher: Call Kan more often. Default: 1.0, Minimum: 0

//STRATEGY CONSTANTS
var RIICHI = 1.0; //Lower: Call Riichi less often. Higher: Call Riichi more often. Default: 1.0, Minimum: 0
var CHIITOITSU = 5; //Number of Pairs in Hand to go for chiitoitsu. Default: 5
var THIRTEEN_ORPHANS = 10; //Number of Honor/Terminals in hand to go for 13 orphans. Default: 10
var KEEP_SAFETILE = false; //If set to true the bot will keep 1 safetile

//MISC
var MARK_TSUMOGIRI = true; // Mark the tsumogiri tiles of opponents with grey color
var CHANGE_RECOMMEND_TILE_COLOR = true; // change recommended tile color in help mode
var USE_EMOJI = true; //use EMOJI to show tile
var LOG_AMOUNT = 3; //Amount of Messages to log for Tile Priorities
var DEBUG_BUTTON = false; //Display a Debug Button in the GUI



//### GLOBAL VARIABLES DO NOT CHANGE ###
var run = false; //Is the bot running
var threadIsRunning = false;
const AIMODE = { //ENUM of AI mode
	AUTO: 0,
	HELP: 1,
}
const AIMODE_NAME = [ //Name of AI mode
	"Auto",
	"Help",
]
const STRATEGIES = { //ENUM of strategies
	GENERAL: 'General',
	CHIITOITSU: 'Chiitoitsu',
	FOLD: 'Fold',
	THIRTEEN_ORPHANS: 'Thirteen_Orphans'
}
var strategy = STRATEGIES.GENERAL; //Current strategy
var strategyAllowsCalls = true; //Does the current strategy allow calls?
var isClosed = true; //Is own hand closed?
var dora = []; //Array of Tiles (index, type, dora)
var ownHand = []; //index, type, dora
var discards = []; //Later: Change to array for each player
var calls = []; //Calls/Melds of each player
var availableTiles = []; //Tiles that are available
var seatWind = 1; //1: East,... 4: North
var roundWind = 1; //1: East,... 4: North
var tilesLeft = 0; //tileCounter
var visibleTiles = []; //Tiles that are visible
var errorCounter = 0; //Counter to check if bot is working
var lastTilesLeft = 0; //Counter to check if bot is working
var isConsideringCall = false;
var riichiTiles = [null, null, null, null]; // Track players discarded tiles on riichi
var functionsExtended = false;
var playerDiscardSafetyList = [[], [], [], []];
var totalPossibleWaits = {};
var timeSave = 0;
var showingStrategy = false; //Current in own turn?

// Display
var tileEmojiList = [
	["red🀝", "🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"],
	["red🀋", "🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"],
	["red🀔", "🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"],
	["", "🀀", "🀁", "🀂", "🀃", "🀆", "🀅", "🀄"]];


//LOCAL STORAGE
var AUTORUN = window.localStorage.getItem("alphajongAutorun") == "true";
var ROOM = window.localStorage.getItem("alphajongRoom");

ROOM = ROOM == null ? 2 : ROOM

var MODE = window.localStorage.getItem("alphajongAIMode")
MODE = MODE == null ? AIMODE.AUTO : parseInt(MODE);


//################################
// GUI
// Adds elements like buttons to control the bot
//################################

var guiDiv = document.createElement("div");
var guiSpan = document.createElement("span");
var startButton = document.createElement("button");
var aimodeCombobox = document.createElement("select");
var autorunCheckbox = document.createElement("input");
var roomCombobox = document.createElement("select");
var currentActionOutput = document.createElement("input");
var debugButton = document.createElement("button");
var hideButton = document.createElement("button");

function initGui() {
	if (getRooms() == null) { // Wait for minimal loading to be done
		setTimeout(initGui, 1000);
		return;
	}

	guiDiv.style.position = "absolute";
	guiDiv.style.zIndex = "100001"; //On top of the game
	guiDiv.style.left = "0px";
	guiDiv.style.top = "0px";
	guiDiv.style.width = "100%";
	guiDiv.style.textAlign = "center";
	guiDiv.style.fontSize = "20px";

	guiSpan.style.backgroundColor = "rgba(255,255,255,0.5)";
	guiSpan.style.padding = "5px";

	startButton.innerHTML = "Start Bot";
	if (window.localStorage.getItem("alphajongAutorun") == "true") {
		startButton.innerHTML = "Stop Bot";
	}
	startButton.style.marginRight = "15px";
	startButton.onclick = function () {
		toggleRun();
	};
	guiSpan.appendChild(startButton);

	refreshAIMode();
	aimodeCombobox.style.marginRight = "15px";
	aimodeCombobox.onchange = function() {
		aiModeChange();
	};
	guiSpan.appendChild(aimodeCombobox);

	autorunCheckbox.type = "checkbox";
	autorunCheckbox.id = "autorun";
	autorunCheckbox.onclick = function () {
		autorunCheckboxClick();
	};
	if (window.localStorage.getItem("alphajongAutorun") == "true") {
		autorunCheckbox.checked = true;
	}
	guiSpan.appendChild(autorunCheckbox);
	var checkboxLabel = document.createElement("label");
	checkboxLabel.htmlFor = "autorun";
	checkboxLabel.appendChild(document.createTextNode('Autostart'));
	checkboxLabel.style.marginRight = "15px";
	guiSpan.appendChild(checkboxLabel);

	refreshRoomSelection();

	roomCombobox.style.marginRight = "15px";
	roomCombobox.onchange = function () {
		roomChange();
	};

	if (window.localStorage.getItem("alphajongAutorun") != "true") {
		roomCombobox.disabled = true;
	}
	guiSpan.appendChild(roomCombobox);

	currentActionOutput.readOnly = "true";
	currentActionOutput.size = "20";
	currentActionOutput.style.marginRight = "15px";
	showCrtActionMsg("Bot is not running.");
	if (window.localStorage.getItem("alphajongAutorun") == "true") {
		showCrtActionMsg("Bot started.");
	}
	guiSpan.appendChild(currentActionOutput);

	debugButton.innerHTML = "Debug";
	debugButton.onclick = function () {
		showDebugString();
	};
	if (DEBUG_BUTTON) {
		guiSpan.appendChild(debugButton);
	}

	hideButton.innerHTML = "Hide GUI";
	hideButton.onclick = function () {
		toggleGui();
	};
	guiSpan.appendChild(hideButton);

	guiDiv.appendChild(guiSpan);
	document.body.appendChild(guiDiv);
	toggleGui();
}

function toggleGui() {
	if (guiDiv.style.display == "block") {
		guiDiv.style.display = "none";
	}
	else {
		guiDiv.style.display = "block";
	}
}

function showDebugString() {
	alert("If you notice a bug while playing please go to the correct turn in the replay (before the bad discard), press this button, copy the Debug String from the textbox and include it in your issue on github.");
	if (isInGame()) {
		setData();
		showCrtActionMsg(getDebugString());
	}
}

function aiModeChange() {
	window.localStorage.setItem("alphajongAIMode", aimodeCombobox.value);
	MODE = parseInt(aimodeCombobox.value);

	setAutoCallWin(MODE === AIMODE.AUTO);
}

function roomChange() {
	window.localStorage.setItem("alphajongRoom", roomCombobox.value);
	ROOM = roomCombobox.value;
}

function hideButtonClick() {
	guiDiv.style.display = "none";
}

function autorunCheckboxClick() {
	if (autorunCheckbox.checked) {
		roomCombobox.disabled = false;
		window.localStorage.setItem("alphajongAutorun", "true");
		AUTORUN = true;
	}
	else {
		roomCombobox.disabled = true;
		window.localStorage.setItem("alphajongAutorun", "false");
		AUTORUN = false;
	}
}

// Refresh the AI mode
function refreshAIMode() {
	aimodeCombobox.innerHTML = AIMODE_NAME[MODE];
	for (let i = 0; i < AIMODE_NAME.length; i++) {
		var option = document.createElement("option");
		option.text = AIMODE_NAME[i];
		option.value = i;
		aimodeCombobox.appendChild(option);
	}
	aimodeCombobox.value = MODE;
}

// Refresh the contents of the Room Selection Combobox with values appropiate for the rank
function refreshRoomSelection() {
	roomCombobox.innerHTML = ""; // Clear old entries
	getRooms().forEach(function (room) {
		if (isInRank(room.id) && room.mode != 0) { // Rooms with mode = 0 are 1 Game only, not sure why they are in the code but not selectable in the UI...
			var option = document.createElement("option");
			option.text = getRoomName(room);
			option.value = room.id;
			roomCombobox.appendChild(option);
		}
	});
	roomCombobox.value = ROOM;
}

// Show msg to currentActionOutput
function showCrtActionMsg(msg) {
	if (!showingStrategy) {
		currentActionOutput.value =  msg;
	}
}

// Apend msg to currentActionOutput
function showCrtStrategyMsg(msg) {
	showingStrategy = true;
	currentActionOutput.value = msg;
}

function clearCrtStrategyMsg() {
	showingStrategy = false;
	currentActionOutput.value = "";
}

//################################
// API (MAHJONG SOUL)
// Returns data from Mahjong Souls Javascript
//################################


function preventAFK() {
	if (typeof GameMgr == 'undefined') {
		return;
	}
	GameMgr.Inst._pre_mouse_point.x = Math.floor(Math.random() * 100) + 1;
	GameMgr.Inst._pre_mouse_point.y = Math.floor(Math.random() * 100) + 1;
	GameMgr.Inst.clientHeatBeat(); // Prevent Client-side AFK
	app.NetAgent.sendReq2Lobby('Lobby', 'heatbeat', { no_operation_counter: 0 }); //Prevent Server-side AFK

	if (typeof view == 'undefined' || typeof view.DesktopMgr == 'undefined' ||
		typeof view.DesktopMgr.Inst == 'undefined' || view.DesktopMgr.Inst == null) {
		return;
	}
	view.DesktopMgr.Inst.hangupCount = 0;
	//uiscript.UI_Hangup_Warn.Inst.locking
}

function hasFinishedMainLobbyLoading() {
	if (typeof GameMgr == 'undefined') {
		return false;
	}
	return GameMgr.Inst.login_loading_end || isInGame();
}

function searchForGame() {
	uiscript.UI_PiPeiYuYue.Inst.addMatch(ROOM);

	// Direct way to search for a game, without UI:
	// app.NetAgent.sendReq2Lobby('Lobby', 'startUnifiedMatch', {match_sid: 1 + ":" + ROOM, client_version_string: GameMgr.Inst.getClientVersion()});
}

function getOperationList() {
	return view.DesktopMgr.Inst.oplist;
}

function getOperations() {
	return mjcore.E_PlayOperation;
}

function getDora() {
	return view.DesktopMgr.Inst.dora;
}

function getPlayerHand() {
	return view.DesktopMgr.Inst.players[0].hand;
}

function getDiscardsOfPlayer(player) {
	player = getCorrectPlayerNumber(player);
	return view.DesktopMgr.Inst.players[player].container_qipai;
}

function getCallsOfPlayer(player) {
	player = getCorrectPlayerNumber(player);

	var callArray = [];
	//Mark the tiles with the player who discarded the tile
	for (let ming of view.DesktopMgr.Inst.players[player].container_ming.mings) {
		for (var i = 0; i < ming.pais.length; i++) {
			ming.pais[i].from = ming.from[i];
			if (i == 3) {
				ming.pais[i].kan = true;
			}
			else {
				ming.pais[i].kan = false;
			}
			callArray.push(ming.pais[i]);
		}
	}

	return callArray;
}

function getNumberOfKitaOfPlayer(player) {
	player = getCorrectPlayerNumber(player);

	return view.DesktopMgr.Inst.players[player].container_babei.pais.length;
}

function getTilesLeft() {
	return view.DesktopMgr.Inst.left_tile_count;
}

function localPosition2Seat(player) {
	player = getCorrectPlayerNumber(player);
	return view.DesktopMgr.Inst.localPosition2Seat(player);
}

function seat2LocalPosition(playerSeat) {
	return view.DesktopMgr.Inst.seat2LocalPosition(playerSeat);
}

function getCurrentPlayer() {
	return view.DesktopMgr.Inst.index_player;
}

function getSeatWind(player) {
	if (getNumberOfPlayers() == 3) {
		return ((3 + localPosition2Seat(player) - view.DesktopMgr.Inst.index_ju) % 3) + 1;
	}
	else {
		return ((4 + localPosition2Seat(player) - view.DesktopMgr.Inst.index_ju) % 4) + 1;
	}
}

function getRound() {
	return view.DesktopMgr.Inst.index_ju + 1;
}

function getRoundWind() {
	return view.DesktopMgr.Inst.index_change + 1;
}

function setAutoCallWin(win) {
	if (!isInGame())
		return;

	view.DesktopMgr.Inst.setAutoHule(win);
	//view.DesktopMgr.Inst.setAutoNoFulu(true) //Auto No Chi/Pon/Kan
	try {
		uiscript.UI_DesktopInfo.Inst.refreshFuncBtnShow(uiscript.UI_DesktopInfo.Inst._container_fun.getChildByName("btn_autohu"), view.DesktopMgr.Inst.auto_hule); //Refresh GUI Button
	}
	catch {
		return;
	}
}

function getTileForCall() {
	if (view.DesktopMgr.Inst.lastqipai == null) {
		return { index: 0, type: 0, dora: false, doraValue: 0 };
	}
	var tile = view.DesktopMgr.Inst.lastqipai.val;
	tile.doraValue = getTileDoraValue(tile);
	return tile;
}

function makeCall(type) {
	if (MODE === AIMODE.AUTO) {
		app.NetAgent.sendReq2MJ('FastTest', 'inputChiPengGang', { type: type, index: 0, timeuse: Math.random() * 2 + 1 });
		view.DesktopMgr.Inst.WhenDoOperation();
	} else {
		showCrtStrategyMsg(`Accept: Call ${getCallNameByType(type)};`);
	}
}

function makeCallWithOption(type, option) {
	if (MODE === AIMODE.AUTO) {
		app.NetAgent.sendReq2MJ('FastTest', 'inputChiPengGang', { type: type, index: option, timeuse: Math.random() * 2 + 1 });
		view.DesktopMgr.Inst.WhenDoOperation();
	} else {
		showCrtStrategyMsg(`Accept ${option}: Call ${getCallNameByType(type)};`);
	}
}

function declineCall(operation) {
	if (MODE === AIMODE.AUTO) {
		try {
			if (operation == getOperationList()[getOperationList().length - 1].type) { //Is last operation -> Send decline Command
				app.NetAgent.sendReq2MJ('FastTest', 'inputChiPengGang', { cancel_operation: true, timeuse: 2 });
				view.DesktopMgr.Inst.WhenDoOperation();
			}
		}
		catch {
			log("Failed to decline the Call. Maybe someone else was faster?");
		}
	} else {
		showCrtStrategyMsg(`Decline: Call ${getCallNameByType(operation)};`);
	}
}

function sendRiichiCall(tile, moqie) {
	if (MODE === AIMODE.AUTO) {
		app.NetAgent.sendReq2MJ('FastTest', 'inputOperation', { type: mjcore.E_PlayOperation.liqi, tile: tile, moqie: moqie, timeuse: Math.random() * 2 + 1 }); //Moqie: Throwing last drawn tile (Riichi -> false)
	} else {
		let tileName = getTileEmojiByName(tile);
		showCrtStrategyMsg(`Riichi: ${tileName};`);
	}
}

function sendKitaCall() {
	if (MODE === AIMODE.AUTO) {
		var moqie = view.DesktopMgr.Inst.mainrole.last_tile.val.toString() == "4z";
		app.NetAgent.sendReq2MJ('FastTest', 'inputOperation', { type: mjcore.E_PlayOperation.babei, moqie: moqie, timeuse: Math.random() * 2 + 1 });
		view.DesktopMgr.Inst.WhenDoOperation();
	} else {
		showCrtStrategyMsg(`Accept: Kita;`);
	}
}

function sendAbortiveDrawCall() {
	if (MODE === AIMODE.AUTO) {
		app.NetAgent.sendReq2MJ('FastTest', 'inputOperation', { type: mjcore.E_PlayOperation.jiuzhongjiupai, index: 0, timeuse: Math.random() * 2 + 1 });
		view.DesktopMgr.Inst.WhenDoOperation();
	} else {
		showCrtStrategyMsg(`Accept: Kyuushu Kyuuhai;`);
	}
}

function callDiscard(tileNumber) {
	if (MODE === AIMODE.AUTO) {
		try {
			if (view.DesktopMgr.Inst.players[0].hand[tileNumber].valid) {
				view.DesktopMgr.Inst.players[0]._choose_pai = view.DesktopMgr.Inst.players[0].hand[tileNumber];
				view.DesktopMgr.Inst.players[0].DoDiscardTile();
			}
		}
		catch {
			log("Failed to discard the tile.");
		}
	} else {
		let tileID = ownHand[tileNumber];
		let tileName = getTileName(tileID, false);
		showCrtStrategyMsg(`Discard: ${tileName};`);
		if (CHANGE_RECOMMEND_TILE_COLOR) {
			view.DesktopMgr.Inst.mainrole.hand.forEach(
				tile => tile.val.toString() == tileID ?
					tile._SetColor(new Laya.Vector4(0.5, 0.8, 0.9, 1))
					: tile._SetColor(new Laya.Vector4(1, 1, 1, 1)));
		}
	}
}

function getPlayerLinkState(player) {
	player = getCorrectPlayerNumber(player);
	return view.DesktopMgr.player_link_state[localPosition2Seat(player)];
}

function getNumberOfTilesInHand(player) {
	player = getCorrectPlayerNumber(player);
	return view.DesktopMgr.Inst.players[player].hand.length;
}

function isEndscreenShown() {
	return this != null && view != null && view.DesktopMgr != null &&
		view.DesktopMgr.Inst != null && view.DesktopMgr.Inst.gameEndResult != null;
}

function isDisconnect() {
	return uiscript.UI_Hanguplogout.Inst != null && uiscript.UI_Hanguplogout.Inst._me.visible;
}

function isPlayerRiichi(player) {
	var player_correct = getCorrectPlayerNumber(player);
	return view.DesktopMgr.Inst.players[player_correct].liqibang._activeInHierarchy || getDiscardsOfPlayer(player).last_is_liqi;
}

function isInGame() {
	try {
		return this != null && view != null && view.DesktopMgr != null &&
			view.DesktopMgr.Inst != null && view.DesktopMgr.player_link_state != null &&
			view.DesktopMgr.Inst.active && !isEndscreenShown()
	}
	catch {
		return false;
	}
}

function doesPlayerExist(player) {
	return typeof view.DesktopMgr.Inst.players[player].hand != 'undefined' && view.DesktopMgr.Inst.players[player].hand != null;
}

function getPlayerScore(player) {
	player = getCorrectPlayerNumber(player);
	return view.DesktopMgr.Inst.players[player].score;
}

//Needs to be called before calls array is updated
function hasPlayerHandChanged(player) {
	var player_correct = getCorrectPlayerNumber(player);
	for (let hand of view.DesktopMgr.Inst.players[player_correct].hand) {
		if (hand.old != true) {
			return true;
		}
	}
	return getCallsOfPlayer(player).length > calls[player].length;
}

//Sets a variable for each pai in a players hand
function rememberPlayerHand(player) {
	var player_correct = getCorrectPlayerNumber(player);
	for (let tile of view.DesktopMgr.Inst.players[player_correct].hand) {
		tile.old = true;
	}
}

function isEastRound() {
	return view.DesktopMgr.Inst.game_config.mode.mode % 10 == 1;
}

// Is the player able to join a given room
function isInRank(room) {
	var roomData = cfg.desktop.matchmode.get(room);
	try {
		var rank = GameMgr.Inst.account_data[roomData.mode < 10 ? "level" : "level3"].id; // 4 player or 3 player rank
		return (roomData.room == 100) || (roomData.level_limit <= rank && roomData.level_limit_ceil >= rank); // room 100 is casual mode
	}
	catch {
		return roomData.room == 100 || roomData.level_limit > 0; // Display the Casual Rooms and all ranked rooms (no special rooms)
	}
}

// Map of all Rooms
function getRooms() {
	try {
		return cfg.desktop.matchmode;
	}
	catch {
		return null;
	}
}

// Returns the room of the current game as a number: Bronze = 1, Silver = 2 etc.
function getCurrentRoom() {
	try {
		var currentRoom = view.DesktopMgr.Inst.game_config.meta.mode_id;
		return getRooms().map_[currentRoom].room;
	}
	catch {
		return 0;
	}
}

// Client language: ["chs", "chs_t", "en", "jp"]
function getLanguage() {
	return GameMgr.client_language;
}

// Name of a room in client language
function getRoomName(room) {
	return room["room_name_" + getLanguage()] + " (" + game.Tools.room_mode_desc(room.mode) + ")";
}

//How much seconds left for a turn (base value, 20 at start)
function getOverallTimeLeft() {
	try {
		return uiscript.UI_DesktopInfo.Inst._timecd._add;
	}
	catch {
		return 20;
	}
}

//How much time was left in the last turn?
function getLastTurnTimeLeft() {
	try {
		return uiscript.UI_DesktopInfo.Inst._timecd._pre_sec;
	}
	catch {
		return 25;
	}
}

// Extend some internal MJSoul functions with additional code
function extendMJSoulFunctions() {
	if (functionsExtended) {
		return;
	}
	trackDiscardTiles();
	functionsExtended = true;
}

// Track which tiles the players discarded (for push/fold judgement and tracking the riichi tile)
function trackDiscardTiles() {
	for (var i = 1; i < getNumberOfPlayers(); i++) {
		var player = getCorrectPlayerNumber(i);
		view.DesktopMgr.Inst.players[player].container_qipai.AddQiPai = (function (_super) { // Extend the MJ-Soul Discard function
			return function () {
				if (arguments[1]) { // Contains true when Riichi
					riichiTiles[seat2LocalPosition(this.player.seat)] = arguments[0]; // Track tile in riichiTiles Variable
				}
				setData(false);
				visibleTiles.push(arguments[0]);
				var danger = getTileDanger(arguments[0], seat2LocalPosition(this.player.seat));
				if (arguments[2] && danger < 0.01) { // Ignore Tsumogiri of a safetile, set it to average danger
					danger = 0.05;
				}
				arguments[0].tsumogiri = arguments[2];
				playerDiscardSafetyList[seat2LocalPosition(this.player.seat)].push(danger);
				return _super.apply(this, arguments); // Call original function
			};
		})(view.DesktopMgr.Inst.players[player].container_qipai.AddQiPai);
	}
}

//################################
// UTILS
// Contains utility functions
//################################

//Return the number of players in the game (3 or 4)
function getNumberOfPlayers() {
	if (!doesPlayerExist(1) || !doesPlayerExist(2) || !doesPlayerExist(3)) {
		return 3;
	}
	return 4;
}

//Correct the player numbers
//Only necessary for 3 player games
function getCorrectPlayerNumber(player) {
	if (getNumberOfPlayers() == 4) {
		return player;
	}
	if (!doesPlayerExist(1)) {
		if (player > 0) {
			return player + 1;
		}
	}
	if (!doesPlayerExist(2)) {
		if (player > 1) {
			return player + 1;
		}
	}
	return player;
}

function isSameTile(tile1, tile2, checkDora = false) {
	if (typeof tile1 == 'undefined' || typeof tile2 == 'undefined') {
		return false;
	}
	if (checkDora) {
		return tile1.index == tile2.index && tile1.type == tile2.type && tile1.dora == tile2.dora;
	}
	return tile1.index == tile2.index && tile1.type == tile2.type;
}

//Return number of doras in tiles
function getNumberOfDoras(tiles) {
	var dr = 0;
	for (let tile of tiles) {
		dr += tile.doraValue;
	}
	return dr;
}

//Pairs in tiles
function getPairs(tiles) {
	var sortedTiles = sortTiles(tiles);

	var pairs = [];
	var oldIndex = 0;
	var oldType = 0;
	sortedTiles.forEach(function (tile) {
		if (oldIndex != tile.index || oldType != tile.type) {
			var ts = getTilesInTileArray(sortedTiles, tile.index, tile.type);
			if ((ts.length >= 2)) {
				pairs.push({ tile1: ts[0], tile2: ts[1] }); //Grabs highest dora tiles first
			}
			oldIndex = tile.index;
			oldType = tile.type;
		}
	});
	return pairs;
}

//Pairs in tiles as array
function getPairsAsArray(tiles) {
	var pairs = getPairs(tiles);
	var pairList = [];
	pairs.forEach(function (pair) {
		pairList.push(pair.tile1);
		pairList.push(pair.tile2);
	});
	return pairList;
}

//Return doubles in tiles
function getDoubles(tiles) {
	tiles = sortTiles(tiles);
	var doubles = [];
	for (let i = 0; i < tiles.length - 1; i++) {
		if (tiles[i].type == tiles[i + 1].type && (
			tiles[i].index == tiles[i + 1].index ||
			(tiles[i].type != 3 &&
				tiles[i].index + 2 >= tiles[i + 1].index))) {
			doubles.push(tiles[i]);
			doubles.push(tiles[i + 1]);
			i++;
		}
	}
	return doubles;
}

//Return all triplets/3-sequences and pairs as a tile array
function getTriplesAndPairs(tiles) {
	var sequences = getSequences(tiles);
	var triplets = getTriplets(tiles);
	var pairs = getPairs(tiles);
	return getBestCombinationOfTiles(tiles, sequences.concat(triplets).concat(pairs), { triples: [], pairs: [], shanten: 8 });
}

//Return all triplets/3-tile-sequences as a tile array
function getTriples(tiles) {
	var sequences = getSequences(tiles);
	var triplets = getTriplets(tiles);
	return getBestCombinationOfTiles(tiles, sequences.concat(triplets), { triples: [], pairs: [], shanten: 8 }).triples;
}

//Return all triplets in tile array
function getTriplets(tiles) {
	var sortedTiles = sortTiles(tiles);

	var triples = [];
	var oldIndex = 0;
	var oldType = 0;
	sortedTiles.forEach(function (tile) {
		if (oldIndex != tile.index || oldType != tile.type) {
			var ts = getTilesInTileArray(sortedTiles, tile.index, tile.type);
			if ((ts.length >= 3)) {
				triples.push({ tile1: ts[0], tile2: ts[1], tile3: ts[2] }); //Grabs highest dora tiles first because of sorting
			}
			oldIndex = tile.index;
			oldType = tile.type;
		}
	});
	return triples;
}

//Triplets in tiles as array
function getTripletsAsArray(tiles) {
	var triplets = getTriplets(tiles);
	var tripletsList = [];
	triplets.forEach(function (triplet) {
		tripletsList.push(triplet.tile1);
		tripletsList.push(triplet.tile2);
		tripletsList.push(triplet.tile3);
	});
	return tripletsList;
}

//Returns the best combination of sequences.
//Small Bug: Can return red dora tiles multiple times, but doesn't matter for the current use cases
function getBestSequenceCombination(inputHand) {
	return getBestCombinationOfTiles(inputHand, getSequences(inputHand), { triples: [], pairs: [], shanten: 8 }).triples;
}

//Check if there is already a red dora tile in the tiles array.
//More or less a workaround for a problem with the getBestCombinationOfTiles function...
function pushTileAndCheckDora(tiles, arrayToPush, tile) {
	if (tile.dora && tiles.some(t => t.type == tile.type && t.dora)) {
		var nonDoraTile = { ...tile };
		nonDoraTile.dora = false;
		nonDoraTile.doraValue = getTileDoraValue(nonDoraTile);
		arrayToPush.push(nonDoraTile);
		return nonDoraTile;
	}
	arrayToPush.push(tile);
	return tile;
}

//Return the best combination of 3-tile Sequences, Triplets and pairs in array of tiles
//Recursive Function, weird code that can probably be optimized
function getBestCombinationOfTiles(inputTiles, possibleCombinations, chosenCombinations) {
	var originalC = { triples: [...chosenCombinations.triples], pairs: [...chosenCombinations.pairs], shanten: chosenCombinations.shanten };
	for (var i = 0; i < possibleCombinations.length; i++) {
		var cs = { triples: [...originalC.triples], pairs: [...originalC.pairs], shanten: originalC.shanten };
		var tiles = possibleCombinations[i];
		var hand = [...inputTiles];
		if (!("tile3" in tiles)) { // Pairs
			if (tiles.tile1.index == tiles.tile2.index && getNumberOfTilesInTileArray(hand, tiles.tile1.index, tiles.tile1.type) < 2) {
				continue;
			}
		}
		else if (getNumberOfTilesInTileArray(hand, tiles.tile1.index, tiles.tile1.type) == 0 ||
			getNumberOfTilesInTileArray(hand, tiles.tile2.index, tiles.tile2.type) == 0 ||
			getNumberOfTilesInTileArray(hand, tiles.tile3.index, tiles.tile3.type) == 0 ||
			(tiles.tile1.index == tiles.tile2.index && getNumberOfTilesInTileArray(hand, tiles.tile1.index, tiles.tile1.type) < 3)) {
			continue;
		}
		if ("tile3" in tiles) {
			var tt = pushTileAndCheckDora(cs.pairs.concat(cs.triples), cs.triples, tiles.tile1);
			hand = removeTilesFromTileArray(hand, [tt]);
			tt = pushTileAndCheckDora(cs.pairs.concat(cs.triples), cs.triples, tiles.tile2);
			hand = removeTilesFromTileArray(hand, [tt]);
			tt = pushTileAndCheckDora(cs.pairs.concat(cs.triples), cs.triples, tiles.tile3);
			hand = removeTilesFromTileArray(hand, [tt]);
		}
		else {
			var tt = pushTileAndCheckDora(cs.pairs.concat(cs.triples), cs.pairs, tiles.tile1);
			hand = removeTilesFromTileArray(hand, [tt]);
			tt = pushTileAndCheckDora(cs.pairs.concat(cs.triples), cs.pairs, tiles.tile2);
			hand = removeTilesFromTileArray(hand, [tt]);
		}

		if (PERFORMANCE_MODE - timeSave <= 3) {
			var anotherChoice = getBestCombinationOfTiles(hand, possibleCombinations.slice(i + 1), cs);
			if (anotherChoice.triples.length > chosenCombinations.triples.length ||
				(anotherChoice.triples.length == chosenCombinations.triples.length &&
					anotherChoice.pairs.length > chosenCombinations.pairs.length) ||
				(anotherChoice.triples.length == chosenCombinations.triples.length &&
					anotherChoice.pairs.length == chosenCombinations.pairs.length &&
					getNumberOfDoras(anotherChoice.triples.concat(anotherChoice.pairs)) > getNumberOfDoras(chosenCombinations.triples.concat(chosenCombinations.pairs)))) {
				chosenCombinations = anotherChoice;
			}
		}
		else {
			if (cs.triples.length >= chosenCombinations.triples.length) {
				var doubles = getDoubles(hand); //This is costly, so only do it when performance mode is at maximum
				cs.shanten = calculateShanten(parseInt(cs.triples.length / 3), parseInt(cs.pairs.length / 2), parseInt(doubles.length / 2));
			}
			else {
				cs.shanten = 8;
			}

			var anotherChoice = getBestCombinationOfTiles(hand, possibleCombinations.slice(i + 1), cs);
			if (anotherChoice.shanten < chosenCombinations.shanten || anotherChoice.shanten == chosenCombinations.shanten && (anotherChoice.triples.length > chosenCombinations.triples.length ||
				(anotherChoice.triples.length == chosenCombinations.triples.length &&
					anotherChoice.pairs.length > chosenCombinations.pairs.length) ||
				(anotherChoice.triples.length == chosenCombinations.triples.length &&
					anotherChoice.pairs.length == chosenCombinations.pairs.length &&
					getNumberOfDoras(anotherChoice.triples.concat(anotherChoice.pairs)) > getNumberOfDoras(chosenCombinations.triples.concat(chosenCombinations.pairs))))) {
				chosenCombinations = anotherChoice;
			}
		}
	}

	return chosenCombinations;
}

//Return all 3-tile Sequences in tile array
function getSequences(tiles) {
	var sortedTiles = sortTiles(tiles);
	var sequences = [];
	for (var index = 0; index <= 7; index++) {
		for (var type = 0; type <= 2; type++) {
			var tiles1 = getTilesInTileArray(sortedTiles, index, type);
			var tiles2 = getTilesInTileArray(sortedTiles, index + 1, type);
			var tiles3 = getTilesInTileArray(sortedTiles, index + 2, type);

			var i = 0;
			while (tiles1.length > i && tiles2.length > i && tiles3.length > i) {
				sequences.push({ tile1: tiles1[i], tile2: tiles2[i], tile3: tiles3[i] });
				i++;
			}
		}
	}
	return sequences;
}

//Return tile array without given tiles
function removeTilesFromTileArray(inputTiles, tiles) {
	var tileArray = [...inputTiles];

	for (let tile of tiles) {
		for (var j = 0; j < tileArray.length; j++) {
			if (isSameTile(tile, tileArray[j])) {
				tileArray.splice(j, 1);
				break;
			}
		}
	}

	return tileArray;
}

//Sort tiles
function sortTiles(inputTiles) {
	var tiles = [...inputTiles];
	tiles = tiles.sort(function (p1, p2) { //Sort dora value descending
		return p2.doraValue - p1.doraValue;
	});
	tiles = tiles.sort(function (p1, p2) { //Sort index ascending
		return p1.index - p2.index;
	});
	tiles = tiles.sort(function (p1, p2) { //Sort type ascending
		return p1.type - p2.type;
	});
	return tiles;
}

//Return number of specific tiles available
function getNumberOfTilesAvailable(index, type) {
	if (index < 1 || index > 9 || type < 0 || type > 3 || (type == 3 && index > 7)) {
		return 0;
	}
	if (getNumberOfPlayers() == 3 && (index > 1 && index < 9 && type == 1)) {
		return 0;
	}

	return 4 - visibleTiles.filter(tile => tile.index == index && tile.type == type).length;
}

//Return if a tile is furiten
function isTileFuriten(index, type) {
	for (var i = 1; i < getNumberOfPlayers(); i++) { //Check if melds from other player contain discarded tiles of player 0
		if (calls[i].some(tile => tile.index == index && tile.type == type && tile.from == localPosition2Seat(0))) {
			return true;
		}
	}
	return discards[0].some(tile => tile.index == index && tile.type == type);
}

//Return number of specific non furiten tiles available
function getNumberOfNonFuritenTilesAvailable(index, type) {
	if (isTileFuriten(index, type)) {
		return 0;
	}
	return getNumberOfTilesAvailable(index, type);
}

//Return number of specific tile in tile array
function getNumberOfTilesInTileArray(tileArray, index, type) {
	return getTilesInTileArray(tileArray, index, type).length;
}

//Return specific tiles in tile array
function getTilesInTileArray(tileArray, index, type) {
	return tileArray.filter(tile => tile.index == index && tile.type == type);
}

//Update the available tile pool
function updateAvailableTiles() {
	visibleTiles = dora.concat(ownHand, discards[0], discards[1], discards[2], discards[3], calls[0], calls[1], calls[2], calls[3]);
	visibleTiles = visibleTiles.filter(tile => typeof tile != 'undefined');
	availableTiles = [];
	for (var i = 0; i <= 3; i++) {
		for (var j = 1; j <= 9; j++) {
			if (i == 3 && j == 8) {
				break;
			}
			for (var k = 1; k <= getNumberOfTilesAvailable(j, i); k++) {
				var isRed = (j == 5 && i != 3 && visibleTiles.concat(availableTiles).filter(tile => tile.type == i && tile.dora).length == 0) ? true : false;
				availableTiles.push({
					index: j,
					type: i,
					dora: isRed,
					doraValue: getTileDoraValue({ index: j, type: i, dora: isRed })
				});
			}
		}
	}
	for (let vis of visibleTiles) {
		vis.doraValue = getTileDoraValue(vis);
	}
}

//Return sum of red dora/dora indicators for tile
function getTileDoraValue(tile) {
	var dr = 0;

	if (getNumberOfPlayers() == 3) {
		if (tile.type == 3 && tile.index == 4) { //North Tiles
			dr = 1;
		}
	}

	for (let d of dora) {
		if (d.type == tile.type && getHigherTileIndex(d) == tile.index) {
			dr++;
		}
	}

	if (tile.dora) {
		return dr + 1;
	}
	return dr;
}

//Helper function for dora indicators
function getHigherTileIndex(tile) {
	if (tile.type == 3) {
		if (tile.index == 4) {
			return 1;
		}
		return tile.index == 7 ? 5 : tile.index + 1;
	}
	if (getNumberOfPlayers() == 3 && tile.index == 1 && tile.type == 1) {
		return 9; // 3 player mode: 1 man indicator means 9 man is dora
	}
	return tile.index == 9 ? 1 : tile.index + 1;
}

//Returns true if DEBUG flag is set
function isDebug() {
	return typeof DEBUG != 'undefined';
}

//Adds calls of player 0 to the hand
function getHandWithCalls(inputHand) {
	return inputHand.concat(calls[0]);
}

//Adds a tile if not in array
function pushTileIfNotExists(tiles, index, type) {
	if (tiles.findIndex(t => t.index == index && t.type == type) === -1) {
		var tile = { index: index, type: type, dora: false };
		tile.doraValue = getTileDoraValue(tile);
		tiles.push(tile);
	}
}

//Returns true if player can call riichi
function canRiichi() {
	if (isDebug()) {
		return false;
	}
	var operations = getOperationList();
	for (let op of operations) {
		if (op.type == getOperations().liqi) {
			return true;
		}
	}
	return false;
}

function getUradoraChance() {
	if (getNumberOfPlayers() == 4) {
		return dora.length * 0.4;
	}
	else {
		return dora.length * 0.5;
	}
}

//Returns tiles that can form a triple in one turn for a given tile array
function getUsefulTilesForTriple(tileArray) {
	var tiles = [];
	for (let tile of tileArray) {
		var amount = getNumberOfTilesInTileArray(tileArray, tile.index, tile.type);
		if (tile.type == 3 && amount >= 2) {
			pushTileIfNotExists(tiles, tile.index, tile.type);
			continue;
		}

		if (amount >= 2) {
			pushTileIfNotExists(tiles, tile.index, tile.type);
		}

		var amountLower = getNumberOfTilesInTileArray(tileArray, tile.index - 1, tile.type);
		var amountLower2 = getNumberOfTilesInTileArray(tileArray, tile.index - 2, tile.type);
		var amountUpper = getNumberOfTilesInTileArray(tileArray, tile.index + 1, tile.type);
		var amountUpper2 = getNumberOfTilesInTileArray(tileArray, tile.index + 2, tile.type);
		if (tile.index > 1 && (amount == amountLower + 1 && (amountUpper > 0 || amountLower2 > 0))) { //No need to check if index in bounds
			pushTileIfNotExists(tiles, tile.index - 1, tile.type);
		}

		if (tile.index < 9 && (amount == amountUpper + 1 && (amountLower > 0 || amountUpper2 > 0))) {
			pushTileIfNotExists(tiles, tile.index + 1, tile.type);
		}
	}
	return tiles;
}

//Returns tiles that can form at least a double in one turn for a given tile array
function getUsefulTilesForDouble(tileArray) {
	var tiles = [];
	for (let tile of tileArray) {
		pushTileIfNotExists(tiles, tile.index, tile.type);
		if (tile.type == 3) {
			continue;
		}

		if (tile.index - 1 >= 1) {
			pushTileIfNotExists(tiles, tile.index - 1, tile.type);
		}
		if (tile.index + 1 <= 9) {
			pushTileIfNotExists(tiles, tile.index + 1, tile.type);
		}

		if (PERFORMANCE_MODE - timeSave <= 2) {
			continue;
		}
		if (tile.index - 2 >= 1) {
			pushTileIfNotExists(tiles, tile.index - 2, tile.type);
		}
		if (tile.index + 2 <= 9) {
			pushTileIfNotExists(tiles, tile.index + 2, tile.type);
		}
	}
	return tiles;
}

// Returns Tile[], where all are terminal/honors.
function getAllTerminalHonorFromHand(hand) {
	return hand.filter(tile => isTerminalOrHonor(tile));
}

//Honor tile or index 1/9
function isTerminalOrHonor(tile) {
	// Honor tiles
	if (tile.type == 3) {
		return true;
	}

	// 1 or 9.
	if (tile.index == 1 || tile.index == 9) {
		return true;
	}

	return false;
}

// Returns a number how "good" the wait is. An average wait is 1, a bad wait (like a middle tile) is lower, a good wait (like an honor tile) is higher.
function getWaitQuality(tile) {
	var quality = 1.3 - (getDealInChanceForTileAndPlayer(0, tile, 1) * 5);
	quality = quality < 0.7 ? 0.7 : quality;
	return quality;
}

//Calculate the shanten number. Based on this: https://www.youtube.com/watch?v=69Xhu-OzwHM
//Fast and accurate, but original hand needs to have 14 or more tiles.
function calculateShanten(triples, pairs, doubles) {
	if (isWinningHand(triples, pairs)) {
		return -1;
	}
	if ((triples * 3) + (pairs * 2) + (doubles * 2) > 14) {
		doubles = parseInt((13 - ((triples * 3) + (pairs * 2))) / 2);
	}
	var shanten = 8 - (2 * triples) - (pairs + doubles);
	if (triples + pairs + doubles >= 5 && pairs == 0) {
		shanten++;
	}
	if (triples + pairs + doubles >= 6) {
		shanten += triples + pairs + doubles - 5;
	}
	if (shanten < 0) {
		return 0;
	}
	return shanten;
}

// Calculate Score for given han and fu. For higher han values the score is "fluid" to better account for situations where the exact han value is unknown
// (like when an opponent has around 5.5 han => 10k)
function calculateScore(player, han, fu = 30) {
	var score = (fu * Math.pow(2, 2 + han) * 4);

	if (han > 4) {
		score = 8000;
	}

	if (han > 5) {
		score = 8000 + ((han - 5) * 4000);
	}
	if (han > 6) {
		score = 12000 + ((han - 6) * 2000);
	}
	if (han > 8) {
		score = 16000 + ((han - 8) * 2666);
	}
	if (han > 11) {
		score = 24000 + ((han - 11) * 4000);
	}
	if (han >= 13) {
		score = 32000;
	}

	if (getSeatWind(player) == 1) { //Is Dealer
		score *= 1.5;
	}

	if (getNumberOfPlayers() == 3) {
		score *= 0.75;
	}

	return score;
}

//Calculate the Fu Value for given parameters. Not 100% accurate, but good enough
function calculateFu(triples, openTiles, pair, waitTiles, winningTile, ron = true) {
	var fu = 20;

	var sequences = getSequences(triples);
	var closedTriplets = getTriplets(triples);
	var openTriplets = getTriplets(openTiles);

	var kans = removeTilesFromTileArray(openTiles, getTriples(openTiles));

	closedTriplets.forEach(function (t) {
		if (isTerminalOrHonor(t.tile1)) {
			if (!isSameTile(t.tile1, winningTile)) {
				fu += 8;
			}
			else { //Ron on that tile: counts as open
				fu += 4;
			}
		}
		else {
			if (!isSameTile(t.tile1, winningTile)) {
				fu += 4;
			}
			else { //Ron on that tile: counts as open
				fu += 2;
			}
		}
	});

	openTriplets.forEach(function (t) {
		if (isTerminalOrHonor(t.tile1)) {
			fu += 4;
		}
		else {
			fu += 2;
		}
	});

	//Kans: Add to existing fu of pon
	kans.forEach(function (tile) {
		if (openTiles.filter(t => isSameTile(t, tile) && t.from != localPosition2Seat(0)).length > 0) { //Is open
			if (isTerminalOrHonor(tile)) {
				fu += 12;
			}
			else {
				fu += 6;
			}
		}
		else { //Closed Kans
			if (isTerminalOrHonor(tile)) {
				fu += 28;
			}
			else {
				fu += 14;
			}
		}
	});


	if (typeof pair[0] != 'undefined' && isValueTile(pair[0])) {
		fu += 2;
		if (pair[0].index == seatWind && seatWind == roundWind) {
			fu += 2;
		}
	}

	if (fu == 20 && (sequences.findIndex(function (t) { //Is there a way to interpret the wait as ryanmen when at 20 fu? -> dont add fu
		return (isSameTile(t.tile1, winningTile) && t.tile3.index < 9) || (isSameTile(t.tile3, winningTile) && t.tile1.index > 1);
	}) >= 0)) {
		fu += 0;
	} //if we are at more than 20 fu: check if the wait can be interpreted in other ways to add more fu
	else if ((waitTiles.length != 2 || waitTiles[0].type != waitTiles[1].type || Math.abs(waitTiles[0].index - waitTiles[1].index) != 1)) {
		if (closedTriplets.findIndex(function (t) { return isSameTile(t.tile1, winningTile); }) < 0) { // 0 fu for shanpon
			fu += 2;
		}
	}

	if (ron && isClosed) {
		fu += 10;
	}

	return Math.ceil(fu / 10) * 10;
}

//Is the tile a dragon or valuable wind?
function isValueTile(tile) {
	return tile.type == 3 && (tile.index > 4 || tile.index == seatWind || tile.index == roundWind);
}

//Return a danger value which is the threshold for folding (danger higher than this value -> fold)
function getFoldThreshold(tilePrio, hand) {
	var handScore = tilePrio.score.open * 1.3; // Raise this value a bit so open hands dont get folded too quickly
	if (isClosed) {
		handScore = tilePrio.score.riichi;
	}

	var waits = tilePrio.waits;
	var shape = tilePrio.shape;

	// Formulas are based on this table: https://docs.google.com/spreadsheets/d/172LFySNLUtboZUiDguf8I3QpmFT-TApUfjOs5iRy3os/edit#gid=212618921
	// TODO: Maybe switch to this: https://riichi-mahjong.com/2020/01/28/mahjong-strategy-push-or-fold-4-maximizing-game-ev/
	if (tilePrio.shanten == 0) {
		var foldValue = (waits + shape) * handScore / 38;
		if (tilesLeft < 8) { //Try to avoid no ten penalty
			foldValue += 200 - (parseInt(tilesLeft / 4) * 100);
		}
	}
	else if (tilePrio.shanten == 1 && strategy == STRATEGIES.GENERAL) {
		shape = shape < 0.4 ? shape = 0.4 : shape;
		shape = shape > 2 ? shape = 2 : shape;
		var foldValue = shape * handScore / 45;
	}
	else {
		if (getCurrentDangerLevel() > 3000 && strategy == STRATEGIES.GENERAL) {
			return 0;
		}
		var foldValue = (((6 - (tilePrio.shanten - tilePrio.efficiency)) * 2000) + handScore) / 500;
	}

	if (isLastGame()) { //Fold earlier when first/later when last in last game
		if (getDistanceToLast() > 0) {
			foldValue *= 1.3; //Last Place -> Later Fold
		}
		else if (getDistanceToFirst() < 0) {
			var dist = (getDistanceToFirst() / 30000) > -0.5 ? getDistanceToFirst() / 30000 : -0.5;
			foldValue *= 1 + dist; //First Place -> Easier Fold
		}
	}

	foldValue *= 1 - (((getWallSize() / 2) - tilesLeft) / (getWallSize() * 2)); // up to 25% more/less fold when early/lategame.

	foldValue *= seatWind == 1 ? 1.2 : 1; //Push more as dealer (it's already in the handScore, but because of Tsumo Malus pushing is even better)

	var safeTiles = 0;
	for (let tile of hand) { // How many safe tiles do we currently have?
		if (getTileDanger(tile) < 20) {
			safeTiles++;
		}
		if (safeTiles == 2) {
			break;
		}
	}
	foldValue *= 1 + (0.5 - (safeTiles / 4)); // 25% less likely to fold when only 1 safetile, or 50% when 0 safetiles

	foldValue *= 2 - (hand.length / 14); // Less likely to fold when fewer tiles in hand (harder to defend)

	foldValue /= SAFETY;

	foldValue = foldValue < 0 ? 0 : foldValue;

	return Number(foldValue).toFixed(2);
}

//Return true if danger is too high in relation to the value of the hand
function shouldFold(tile, highestPrio = false) {
	if (tile.shanten * 4 > tilesLeft) {
		if (highestPrio) {
			log("Hand is too far from tenpai before end of game. Fold!");
			strategy = STRATEGIES.FOLD;
			strategyAllowsCalls = false;
		}
		return true;
	}

	var foldThreshold = getFoldThreshold(tile, ownHand);
	if (highestPrio) {
		log("Would fold this hand above " + foldThreshold + " danger for " + getTileName(tile.tile) + " discard.");
	}

	if (tile.danger > foldThreshold) {
		if (highestPrio) {
			log("Tile Danger " + Number(tile.danger).toFixed(2) + " of " + getTileName(tile.tile, false) + " is too dangerous.");
			strategyAllowsCalls = false; //Don't set the strategy to full fold, but prevent calls
		}
		return true;
	}
	return false;
}

//Decide whether to call Riichi
//Based on: https://mahjong.guide/2018/01/28/mahjong-fundamentals-5-riichi/
function shouldRiichi(tilePrio) {
	var badWait = tilePrio.waits < 5 - RIICHI;
	var lotsOfDoraIndicators = tilePrio.dora.length >= 3;

	//Chiitoitsu
	if (strategy == STRATEGIES.CHIITOITSU) {
		if (tilePrio.shape == 0) {
			log("Decline Riichi because of chiitoitsu wait that can be improved!");
			return false;
		}
		badWait = tilePrio.waits < 3 - RIICHI;
	}

	//Thirteen Orphans
	if (strategy == STRATEGIES.THIRTEEN_ORPHANS) {
		log("Decline Riichi because of Thirteen Orphan strategy.");
		return false;
	}

	//Close to end of game
	if (tilesLeft <= 7 - RIICHI) {
		log("Decline Riichi because close to end of game.");
		return false;
	}

	//No waits
	if (tilePrio.waits < 1) {
		log("Decline Riichi because of no waits.");
		return false;
	}

	// Last Place (in last game) and Riichi is enough to get third
	if (isLastGame() && getDistanceToLast() > 0 && getDistanceToLast() < tilePrio.score.riichi) {
		log("Accept Riichi because of last place in last game.");
		return true;
	}

	// Decline if last game and first place (either with 10000 points advantage or with a closed yaku)
	if (isLastGame() && (getDistanceToFirst() < -10000 || (tilePrio.yaku.closed >= 1 && getDistanceToFirst() < 0))) {
		log("Decline Riichi because of huge lead in last game.");
		return false;
	}

	// Not Dealer & bad Wait & Riichi is only yaku
	if (seatWind != 1 && badWait && tilePrio.score.riichi < 4000 - (RIICHI * 1000) && !lotsOfDoraIndicators && tilePrio.shape > 0.4) {
		log("Decline Riichi because of worthless hand, bad waits and not dealer.");
		return false;
	}

	// High Danger and hand not worth much or bad wait
	if (tilePrio.score.riichi < (getCurrentDangerLevel() - (RIICHI * 1000)) * (1 + badWait)) {
		log("Decline Riichi because of worthless hand and high danger.");
		return false;
	}

	// Hand already has enough yaku and high value (Around 6000+ depending on the wait)
	if (tilePrio.yaku.closed >= 1 && tilePrio.score.closed / (seatWind == 1 ? 1.5 : 1) > 4000 + (RIICHI * 1000) + (tilePrio.waits * 500)) {
		log("Decline Riichi because of high value hand with enough yaku.");
		return false;
	}

	// Hand already has high value and no yaku
	if (tilePrio.yaku.closed < 0.9 && tilePrio.score.riichi > 5000 - (RIICHI * 1000)) {
		log("Accept Riichi because of high value hand without yaku.");
		return true;
	}

	// Number of Kans(Dora Indicators) -> more are higher chance for uradora
	if (lotsOfDoraIndicators) {
		log("Accept Riichi because of multiple dora indicators.");
		return true;
	}

	// Don't Riichi when: Last round with bad waits & would lose place with -1000
	if (isLastGame() && badWait && ((getDistanceToPlayer(1) >= -1000 && getDistanceToPlayer(1) <= 0) ||
		(getDistanceToPlayer(2) >= -1000 && getDistanceToPlayer(2) <= 0) ||
		(getNumberOfPlayers() > 3 && getDistanceToPlayer(3) >= -1000 && getDistanceToPlayer(3) <= 0))) {
		log("Decline Riichi because distance to next player is < 1000 in last game.");
		return false;
	}

	// Default: Just do it.
	log("Accept Riichi by default.");
	return true;
}

//Negative number: Distance to second
//Positive number: Distance to first
function getDistanceToFirst() {
	if (getNumberOfPlayers() == 3) {
		return Math.max(getPlayerScore(1), getPlayerScore(2)) - getPlayerScore(0);
	}
	return Math.max(getPlayerScore(1), getPlayerScore(2), getPlayerScore(3)) - getPlayerScore(0);
}

//Negative number: Distance to last
//Positive number: Distance to third
function getDistanceToLast() {
	if (getNumberOfPlayers() == 3) {
		return Math.min(getPlayerScore(1), getPlayerScore(2)) - getPlayerScore(0);
	}
	return Math.min(getPlayerScore(1), getPlayerScore(2), getPlayerScore(3)) - getPlayerScore(0);
}

//Positive: Other player is in front of you
function getDistanceToPlayer(player) {
	if (getNumberOfPlayers() == 3 && player == 3) {
		return 0;
	}
	return getPlayerScore(player) - getPlayerScore(0);
}

//Check if "All Last"
function isLastGame() {
	if (isEastRound()) {
		return getRound() == getNumberOfPlayers() || getRoundWind() > 1; //East 4(3) or South X
	}
	return (getRound() == getNumberOfPlayers() && getRoundWind() == 2) || getRoundWind() > 2; //South 4(3) or West X
}

//Check if Hand is complete
function isWinningHand(numberOfTriples, numberOfPairs) {
	if (strategy == STRATEGIES.CHIITOITSU) {
		return numberOfPairs == 7;
	}
	return numberOfTriples == 4 && numberOfPairs == 1;
}

//Return the number of tiles in the wall at the start of the round
function getWallSize() {
	if (getNumberOfPlayers() == 3) {
		return 55;
	}
	else {
		return 70;
	}
}

function getCallNameByType(type) {
	switch (type) {
		case 1: return "discard";
		case 2: return "chi";
		case 3: return "pon";
		case 4: return "kan(ankan)";
		case 5: return "kan(daiminkan)";
		case 6: return "kan(shouminkan)";
		case 7: return "riichi";
		case 8: return "tsumo";
		case 9: return "ron";
		case 10: return "kyuushu kyuuhai";
		case 11: return "kita";
		default: return type;
	}
}

function getTileEmoji(tileType, tileIdx, dora) {
	if (dora) {
		tileIdx = 0;
	}
	return tileEmojiList[tileType][tileIdx];
}

//Get Emoji str by tile name
function getTileEmojiByName(name) {
	let tile = getTileFromString(name);
	return getTileEmoji(tile.type, tile.index, tile.dora);
}

//################################
// LOGGING
// Contains logging functions
//################################

//Print string to HTML or console
function log(t) {
	if (isDebug()) {
		document.body.innerHTML += t + "<br>";
	}
	else {
		console.log(t);
	}
}

//Print all tiles in hand
function printHand(hand) {
	var handString = getStringForTiles(hand);
	log("Hand:" + handString);
}

//Get String for array of tiles
function getStringForTiles(tiles) {
	var tilesString = "";
	var oldType = "";
	tiles.forEach(function (tile) {
		if (getNameForType(tile.type) != oldType) {
			tilesString += oldType;
			oldType = getNameForType(tile.type);
		}
		if (tile.dora == 1) {
			tilesString += "0";
		}
		else {
			tilesString += tile.index;
		}
	});
	tilesString += oldType;
	return tilesString;
}

//Print tile name
function printTile(tile) {
	log(getTileName(tile, false));
}

//Print given tile priorities
function printTilePriority(tiles) {
	log("Overall: Value Open: <" + Number(tiles[0].score.open).toFixed(0) +
		"> Closed Value: <" + Number(tiles[0].score.closed).toFixed(0) +
		"> Riichi Value: <" + Number(tiles[0].score.riichi).toFixed(0) +
		"> Shanten: <" + Number(tiles[0].shanten).toFixed(0) + ">");
	for (var i = 0; i < tiles.length && i < LOG_AMOUNT; i++) {
		log(getTileName(tiles[i].tile, false) +
			": Priority: <" + Number(tiles[i].priority).toFixed(3) +
			"> Efficiency: <" + Number(tiles[i].efficiency).toFixed(3) +
			"> Yaku Open: <" + Number(tiles[i].yaku.open).toFixed(3) +
			"> Yaku Closed: <" + Number(tiles[i].yaku.closed).toFixed(3) +
			"> Dora: <" + Number(tiles[i].dora).toFixed(3) +
			"> Waits: <" + Number(tiles[i].waits).toFixed(3) +
			"> Danger: <" + Number(tiles[i].danger).toFixed(2) + ">");
	}
}

//Input string to get an array of tiles (e.g. "123m456p789s1z")
function getTilesFromString(inputString) {
	var numbers = [];
	var tiles = [];
	for (let input of inputString) {
		var type = 4;
		switch (input) {
			case "p":
				type = 0;
				break;
			case "m":
				type = 1;
				break;
			case "s":
				type = 2;
				break;
			case "z":
				type = 3;
				break;
			default:
				numbers.push(input);
				break;
		}
		if (type != "4") {
			for (let number of numbers) {
				if (parseInt(number) == 0) {
					tiles.push({ index: 5, type: type, dora: true, doraValue: 1, valid: true });
				}
				else {
					tiles.push({ index: parseInt(number), type: type, dora: false, doraValue: 0, valid: true });
				}
			}
			numbers = [];
		}
	}
	return tiles;
}

//Input string to get a tiles (e.g. "1m")
function getTileFromString(inputString) {
	var type = 4;
	var dr = false;
	switch (inputString[1]) {
		case "p":
			type = 0;
			break;
		case "m":
			type = 1;
			break;
		case "s":
			type = 2;
			break;
		case "z":
			type = 3;
			break;
	}
	var index = inputString[0];
	if (inputString[0] == "0") {
		index = "5";
		dr = true;
	}
	if (type != "4") {
		var tile = { index: parseInt(index), type: type, dora: dr, valid: true };
		tile.doraValue = getTileDoraValue(tile);
		return tile;
	}
	return null;
}

//Returns the name for a tile
function getTileName(tile, useRaw = true) {
	let name = "";
	if (tile.dora == true) {
		name = "0" + getNameForType(tile.type);
	} else {
		name = tile.index + getNameForType(tile.type);
	}

	if (!useRaw && USE_EMOJI) {
		return `${getTileEmoji(tile.type, tile.index, tile.dora)}: ${name}`;
	} else {
		return name;
	}
}

//Returns the corresponding char for a type
function getNameForType(type) {
	switch (type) {
		case 0:
			return "p";
		case 1:
			return "m";
		case 2:
			return "s";
		case 3:
			return "z";
		default:
			return "?";
	}
}

//returns a string for the current state of the game
function getDebugString() {
	var debugString = "";
	debugString += getStringForTiles(dora) + "|";
	debugString += getStringForTiles(ownHand) + "|";
	debugString += getStringForTiles(calls[0]) + "|";
	debugString += getStringForTiles(calls[1]) + "|";
	debugString += getStringForTiles(calls[2]) + "|";
	if (getNumberOfPlayers() == 4) {
		debugString += getStringForTiles(calls[3]) + "|";
	}
	debugString += getStringForTiles(discards[0]) + "|";
	debugString += getStringForTiles(discards[1]) + "|";
	debugString += getStringForTiles(discards[2]) + "|";
	if (getNumberOfPlayers() == 4) {
		debugString += getStringForTiles(discards[3]) + "|";
	}
	if (getNumberOfPlayers() == 4) {
		debugString += (isPlayerRiichi(0) * 1) + "," + (isPlayerRiichi(1) * 1) + "," + (isPlayerRiichi(2) * 1) + "," + (isPlayerRiichi(3) * 1) + "|";
	}
	else {
		debugString += (isPlayerRiichi(0) * 1) + "," + (isPlayerRiichi(1) * 1) + "," + (isPlayerRiichi(2) * 1) + "|";
	}
	debugString += seatWind + "|";
	debugString += roundWind + "|";
	debugString += tilesLeft;
	return debugString;
}


//################################
// YAKU
// Contains the yaku calculations
//################################

//Returns the closed and open yaku value of the hand
function getYaku(inputHand, inputCalls, triplesAndPairs = null) {

	//Remove 4th tile from Kans, which could lead to false yaku calculation
	inputCalls = inputCalls.filter(tile => !tile.kan);

	var hand = inputHand.concat(inputCalls); //Add calls to hand

	var yakuOpen = 0;
	var yakuClosed = 0;


	// ### 1 Han ###

	if (triplesAndPairs == null) { //Can be set as a parameter to save calculation time if already precomputed
		triplesAndPairs = getTriplesAndPairs(hand);
	}
	else {
		triplesAndPairs.triples = triplesAndPairs.triples.concat(inputCalls);
	}
	var triplets = getTripletsAsArray(hand);
	var sequences = getBestSequenceCombination(removeTilesFromTileArray(inputHand, triplets.concat(triplesAndPairs.pairs))).concat(getBestSequenceCombination(inputCalls));

	//Pinfu is applied in ai_offense when fu is 30, same with Riichi.
	//There's no certain way to check for it here, so ignore it

	//Yakuhai
	//Wind/Dragon Triples
	//Open
	if (strategy != STRATEGIES.CHIITOITSU) {
		var yakuhai = getYakuhai(triplesAndPairs.triples);
		yakuOpen += yakuhai.open;
		yakuClosed += yakuhai.closed;
	}

	//Tanyao
	//Open
	var tanyao = getTanyao(hand, triplesAndPairs, inputCalls);
	yakuOpen += tanyao.open;
	yakuClosed += tanyao.closed;

	//Iipeikou (Identical Sequences in same type)
	//Closed
	if (strategy != STRATEGIES.CHIITOITSU) {
		var iipeikou = getIipeikou(sequences);
		yakuOpen += iipeikou.open;
		yakuClosed += iipeikou.closed;

		// ### 2 Han ###

		//Chiitoitsu
		//7 Pairs
		//Closed
		// -> Not necessary, because own strategy

		//Sanankou
		//3 concealed triplets
		//Open*
		var sanankou = getSanankou(inputHand);
		yakuOpen += sanankou.open;
		yakuClosed += sanankou.closed;

		//Sankantsu
		//3 Kans
		//Open
		//-> TODO: Should not influence score, but Kan calling.

		//Toitoi
		//All Triplets
		//Open
		var toitoi = getToitoi(triplets);
		yakuOpen += toitoi.open;
		yakuClosed += toitoi.closed;

		//Sanshoku Doukou
		//3 same index triplets in all 3 types
		//Open
		var sanshokuDouko = getSanshokuDouko(triplets);
		yakuOpen += sanshokuDouko.open;
		yakuClosed += sanshokuDouko.closed;

		//Sanshoku Doujun
		//3 same index straights in all types
		//Open/-1 Han after call
		var sanshoku = getSanshokuDoujun(sequences);
		yakuOpen += sanshoku.open;
		yakuClosed += sanshoku.closed;

		//Shousangen
		//Little 3 Dragons (2 Triplets + Pair)
		//Open
		var shousangen = getShousangen(hand);
		yakuOpen += shousangen.open;
		yakuClosed += shousangen.closed;
	}

	//Chanta
	//Half outside Hand (including terminals)
	//Open/-1 Han after call
	var chanta = getChanta(triplets, sequences, triplesAndPairs.pairs);
	yakuOpen += chanta.open;
	yakuClosed += chanta.closed;

	//Honrou
	//All Terminals and Honors (means: Also 4 triplets)
	//Open
	var honrou = getHonrou(triplets);
	yakuOpen += honrou.open;
	yakuClosed += honrou.closed;

	//Ittsuu
	//Pure Straight
	//Open/-1 Han after call
	var ittsuu = getIttsuu(sequences);
	yakuOpen += ittsuu.open;
	yakuClosed += ittsuu.closed;

	//3 Han

	//Ryanpeikou
	//2 times identical sequences (2 Iipeikou)
	//Closed

	//Junchan
	//All Terminals
	//Open/-1 Han after call
	var junchan = getJunchan(triplets, sequences, triplesAndPairs.pairs);
	yakuOpen += junchan.open;
	yakuClosed += junchan.closed;

	//Honitsu
	//Half Flush
	//Open/-1 Han after call
	var honitsu = getHonitsu(hand);
	yakuOpen += honitsu.open;
	yakuClosed += honitsu.closed;

	//6 Han

	//Chinitsu
	//Full Flush
	//Open/-1 Han after call
	var chinitsu = getChinitsu(hand);
	yakuOpen += chinitsu.open;
	yakuClosed += chinitsu.closed;

	//Yakuman

	//Daisangen
	//Big Three Dragons
	//Open
	var daisangen = getDaisangen(hand);
	yakuOpen += daisangen.open;
	yakuClosed += daisangen.closed;

	//Suuankou
	//4 Concealed Triplets
	//Closed

	//Tsuuiisou
	//All Honours
	//Open

	//Ryuuiisou
	//All Green
	//Open

	//Chinroutou
	//All Terminals
	//Open

	//Suushiihou
	//Four Little Winds
	//Open

	//Suukantsu
	//4 Kans
	//Open

	//Chuuren poutou
	//9 Gates
	//Closed

	//Kokushi musou
	//Thirteen Orphans
	//Closed

	//Double Yakuman

	//Suuankou tanki
	//4 Concealed Triplets Single Wait
	//Closed

	//Kokushi musou juusan menmachi
	//13 Wait Thirteen Orphans
	//Closed

	//Junsei chuuren poutou
	//True Nine Gates
	//Closed

	//Daisuushii
	//Four Big Winds
	//Open


	return { open: yakuOpen, closed: yakuClosed };
}

//Yakuhai
function getYakuhai(triples) {
	var yakuhai = 0;
	yakuhai = parseInt(triples.filter(tile => tile.type == 3 && (tile.index > 4 || tile.index == seatWind || tile.index == roundWind)).length / 3);
	yakuhai += parseInt(triples.filter(tile => tile.type == 3 && tile.index == seatWind && tile.index == roundWind).length / 3);
	return { open: yakuhai, closed: yakuhai };
}

//Tanyao
function getTanyao(hand, triplesAndPairs, inputCalls) {
	if (hand.filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length <= hand.length - 14 &&
		inputCalls.filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length == 0 &&
		triplesAndPairs.pairs.filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length == 0 &&
		triplesAndPairs.triples.filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length == 0) {
		return { open: 1, closed: 1 };
	}
	return { open: 0, closed: 0 };
}

//Iipeikou
function getIipeikou(triples) {
	for (let triple of triples) {
		var tiles1 = getNumberOfTilesInTileArray(triples, triple.index, triple.type);
		var tiles2 = getNumberOfTilesInTileArray(triples, triple.index + 1, triple.type);
		var tiles3 = getNumberOfTilesInTileArray(triples, triple.index + 2, triple.type);
		if (tiles1 == 2 && tiles2 == 2 && tiles3 == 2) {
			return { open: 0, closed: 1 };
		}
	}
	return { open: 0, closed: 0 };
}

//Sanankou
function getSanankou(hand) {
	if (!isConsideringCall) {
		var concealedTriples = getTripletsAsArray(hand);
		if (parseInt(concealedTriples.length / 3) >= 3) {
			return { open: 2, closed: 2 };
		}
	}

	return { open: 0, closed: 0 };
}

//Toitoi
function getToitoi(triplets) {
	if (parseInt(triplets.length / 3) >= 4) {
		return { open: 2, closed: 2 };
	}

	return { open: 0, closed: 0 };
}

//Sanshoku Douko
function getSanshokuDouko(triplets) {
	for (var i = 1; i <= 9; i++) {
		if (triplets.filter(tile => tile.index == i && tile.type < 3).length >= 9) {
			return { open: 2, closed: 2 };
		}
	}
	return { open: 0, closed: 0 };
}

//Sanshoku Doujun
function getSanshokuDoujun(sequences) {
	for (var i = 1; i <= 7; i++) {
		var seq = sequences.filter(tile => tile.index == i || tile.index == i + 1 || tile.index == i + 2);
		if (seq.length >= 9 && seq.filter(tile => tile.type == 0).length >= 3 &&
			seq.filter(tile => tile.type == 1).length >= 3 && seq.filter(tile => tile.type == 2).length >= 3) {
			return { open: 1, closed: 2 };
		}
	}
	return { open: 0, closed: 0 };
}

//Shousangen
function getShousangen(hand) {
	if (hand.filter(tile => tile.type == 3 && tile.index >= 5).length == 8 &&
		hand.filter(tile => tile.type == 3 && tile.index == 5).length < 4 &&
		hand.filter(tile => tile.type == 3 && tile.index == 6).length < 4 &&
		hand.filter(tile => tile.type == 3 && tile.index == 7).length < 4) {
		return { open: 2, closed: 2 };
	}
	return { open: 0, closed: 0 };
}

//Daisangen
function getDaisangen(hand) {
	if (hand.filter(tile => tile.type == 3 && tile.index == 5).length >= 3 &&
		hand.filter(tile => tile.type == 3 && tile.index == 6).length >= 3 &&
		hand.filter(tile => tile.type == 3 && tile.index == 7).length >= 3) {
		return { open: 10, closed: 10 }; //Yakuman -> 10?
	}
	return { open: 0, closed: 0 };
}

//Chanta
function getChanta(triplets, sequences, pairs) {
	if ((sequences.filter(tile => tile.index == 1 || tile.index == 9).length * 3) == sequences.length &&
		(triplets.concat(pairs)).filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length +
		(sequences.filter(tile => tile.index == 1 || tile.index == 9).length * 3) >= 13) {
		return { open: 1, closed: 2 };
	}
	return { open: 0, closed: 0 };
}

//Honrou
function getHonrou(triplets) {
	if (triplets.filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length >= 13) {
		return { open: 3, closed: 2 }; // - Added to Chanta
	}
	return { open: 0, closed: 0 };
}

//Junchan
function getJunchan(triplets, sequences, pairs) {
	if ((sequences.filter(tile => tile.index == 1 || tile.index == 9).length * 3) == sequences.length &&
		(triplets.concat(pairs)).filter(tile => tile.type != 3 && (tile.index == 1 || tile.index == 9)).length +
		(sequences.filter(tile => tile.index == 1 || tile.index == 9).length * 3) >= 13) {
		return { open: 1, closed: 1 }; // - Added to Chanta
	}
	return { open: 0, closed: 0 };
}

//Ittsuu
function getIttsuu(triples) {
	for (var j = 0; j <= 2; j++) {
		for (var i = 1; i <= 9; i++) {
			if (!triples.some(tile => tile.type == j && tile.index == i)) {
				break;
			}
			if (i == 9) {
				return { open: 1, closed: 2 };
			}
		}
	}
	return { open: 0, closed: 0 };
}

//Honitsu
function getHonitsu(hand) {
	var pinzu = hand.filter(tile => tile.type == 3 || tile.type == 0).length;
	var manzu = hand.filter(tile => tile.type == 3 || tile.type == 1).length;
	var souzu = hand.filter(tile => tile.type == 3 || tile.type == 2).length;
	if (pinzu >= 14 || pinzu >= hand.length ||
		manzu >= 14 || manzu >= hand.length ||
		souzu >= 14 || souzu >= hand.length) {
		return { open: 2, closed: 3 };
	}
	return { open: 0, closed: 0 };
}

//Chinitsu
function getChinitsu(hand) {
	var pinzu = hand.filter(tile => tile.type == 0).length;
	var manzu = hand.filter(tile => tile.type == 1).length;
	var souzu = hand.filter(tile => tile.type == 2).length;
	if (pinzu >= 14 || pinzu >= hand.length ||
		manzu >= 14 || manzu >= hand.length ||
		souzu >= 14 || souzu >= hand.length) {
		return { open: 3, closed: 3 }; //Score gets added to honitsu -> 5/6 han
	}
	return { open: 0, closed: 0 };
}

//################################
// AI OFFENSE
// Offensive part of the AI
//################################

//Look at Hand etc. and decide for a strategy.
function determineStrategy() {

	if (strategy != STRATEGIES.FOLD) {
		var handTriples = parseInt(getTriples(getHandWithCalls(ownHand)).length / 3);
		var pairs = getPairsAsArray(ownHand).length / 2;

		if ((pairs == 6 || (pairs >= CHIITOITSU && handTriples < 2)) && isClosed) {
			strategy = STRATEGIES.CHIITOITSU;
			strategyAllowsCalls = false;
		}
		else if (canDoThirteenOrphans()) {
			strategy = STRATEGIES.THIRTEEN_ORPHANS;
			strategyAllowsCalls = false;
		}
		else {
			if (strategy == STRATEGIES.THIRTEEN_ORPHANS ||
				strategy == STRATEGIES.CHIITOITSU) {
				strategyAllowsCalls = true; //Don't reset this value when bot is playing defensively without a full fold
			}
			strategy = STRATEGIES.GENERAL;
		}
	}
	log("Strategy: " + strategy);
}

//Call a Chi/Pon
//combination example: Array ["6s|7s", "7s|9s"]
async function callTriple(combinations, operation) {

	log("Consider call on " + getTileName(getTileForCall()));

	var handValue = getHandValues(ownHand);

	if (!strategyAllowsCalls && (tilesLeft > 4 || handValue.shanten > 1)) { //No Calls allowed
		log("Strategy allows no calls! Declined!");
		declineCall(operation);
		return false;
	}

	//Find best Combination
	var comb = -1;
	var bestCombShanten = 9;
	var bestDora = 0;

	for (var i = 0; i < combinations.length; i++) {
		var callTiles = combinations[i].split("|");
		callTiles = callTiles.map(t => getTileFromString(t));

		var newHand = removeTilesFromTileArray(ownHand, callTiles);
		var newHandTriples = getTriplesAndPairs(newHand);
		var doubles = getDoubles(removeTilesFromTileArray(newHand, newHandTriples.triples.concat(newHandTriples.pairs)));
		var shanten = calculateShanten(parseInt(newHandTriples.triples.length / 3), parseInt(newHandTriples.pairs.length / 2), parseInt(doubles.length / 2));

		if (shanten < bestCombShanten || (shanten == bestCombShanten && getNumberOfDoras(callTiles) > bestDora)) {
			comb = i;
			bestDora = getNumberOfDoras(callTiles);
			bestCombShanten = shanten;
		}
	}

	log("Best Combination: " + combinations[comb]);

	var callTiles = combinations[comb].split("|");
	callTiles = callTiles.map(t => getTileFromString(t));

	var wasClosed = isClosed;
	calls[0].push(callTiles[0]); //Simulate "Call" for hand value calculation
	calls[0].push(callTiles[1]);
	calls[0].push(getTileForCall());
	isClosed = false;
	newHand = removeTilesFromTileArray(ownHand, callTiles); //Remove called tiles from hand
	var tilePrios = await getTilePriorities(newHand);
	tilePrios = sortOutUnsafeTiles(tilePrios);
	var nextDiscard = getDiscardTile(tilePrios); //Calculate next discard
	newHand = removeTilesFromTileArray(newHand, [nextDiscard]); //Remove discard from hand
	var newHandValue = getHandValues(newHand, nextDiscard); //Get Value of that hand
	newHandTriples = getTriplesAndPairs(newHand); //Get Triples, to see if discard would make the hand worse
	calls[0].pop();
	calls[0].pop();
	calls[0].pop();
	isClosed = wasClosed;

	var newHonorPairs = newHandTriples.pairs.filter(t => t.type == 3).length / 2;
	var newPairs = newHandTriples.pairs.length / 2;

	if (isSameTile(nextDiscard, getTileForCall()) ||
		(callTiles[0].index == getTileForCall().index - 2 && isSameTile(nextDiscard, { index: callTiles[0].index - 1, type: callTiles[0].type })) ||
		(callTiles[1].index == getTileForCall().index + 2 && isSameTile(nextDiscard, { index: callTiles[1].index + 1, type: callTiles[1].type }))) {
		declineCall(operation);
		log("Next discard would be the same tile. Call declined!");
		return false;
	}

	if (strategy == STRATEGIES.FOLD || tilePrios.filter(t => t.safe).length == 0) {
		log("Would fold next discard! Declined!");
		declineCall(operation);
		return false;
	}

	if (tilesLeft <= 4 && handValue.shanten == 1 && newHandValue.shanten == 0) { //Call to get tenpai at end of game
		log("Accept call to be tenpai at end of game!");
		makeCallWithOption(operation, comb);
		return true;
	}

	if (newHandValue.yaku.open < 0.15 && //Yaku chance is too bad
		newHandTriples.pairs.filter(t => isValueTile(t) && getNumberOfTilesAvailable(t.index, t.type) >= 2).length < 2) { //And no value honor pair
		log("Not enough Yaku! Declined! " + newHandValue.yaku.open + " < 0.15");
		declineCall(operation);
		return false;
	}

	if (handValue.waits > 0 && newHandValue.waits < handValue.waits + 1) { //Call results in worse waits
		log("Call would result in less waits! Declined!");
		declineCall(operation);
		return false;
	}

	if (isClosed && newHandValue.score.open < 1500 - (CALL_PON_CHI * 200) && newHandValue.shanten >= 2 + CALL_PON_CHI && seatWind != 1 &&// Hand is worthless and slow and not dealer. Should prevent cheap yakuhai or tanyao calls
		!(newHonorPairs >= 1 && newPairs >= 2)) {
		log("Hand is cheap and slow! Declined!");
		declineCall(operation);
		return false;
	}

	if (seatWind == 1) { //Remove dealer bonus for the following checks
		handValue.score.closed /= 1.5;
		handValue.score.open /= 1.5;
		newHandValue.score.open /= 1.5;
	}

	if (newHandValue.shanten > handValue.shanten) { //Call would make shanten worse
		log("Call would increase shanten! Declined!");
		declineCall(operation);
		return false;
	}
	else if (newHandValue.shanten == handValue.shanten) { //When it does not improve shanten
		if (!isClosed && newHandValue.priority > handValue.priority * 1.5) { //When the call improves the hand
			log("Call accepted because hand is already open and it improves the hand!");
		}
		else {
			declineCall(operation);
			log("Call declined because it does not benefit the hand!");
			return false;
		}
	}
	else { //When it improves shanten
		var isBadWait = (callTiles[0].index == callTiles[1].index || Math.abs(callTiles[0].index - callTiles[1].index) == 2 || // Pon or Kanchan
			callTiles[0].index >= 8 && callTiles[1].index >= 8 || callTiles[0].index <= 2 && callTiles[1].index <= 2); //Penchan

		if (handValue.shanten >= 5 - CALL_PON_CHI && seatWind == 1) { //Very slow hand & dealer? -> Go for a fast win
			log("Call accepted because of slow hand and dealer position!");
		}
		else if (!isClosed && newHandValue.score.open > handValue.score.open * 0.9) { //Hand is already open and it reduces shanten while not much value is lost
			log("Call accepted because hand is already open!");
		}
		else if (newHandValue.score.open >= 4500 - (CALL_PON_CHI * 500) &&
			newHandValue.score.open > handValue.score.closed * 0.7) { //High value hand? -> Go for a fast win
			log("Call accepted because of high value hand!");
		}
		else if (newHandValue.score.open >= handValue.score.closed * 1.75 && //Call gives additional value to hand
			((newHandValue.score.open >= (2000 - (CALL_PON_CHI * 200) - ((3 - newHandValue.shanten) * 200))) || //And either hand is not extremely cheap...
				newHonorPairs >= 1)) { //Or there are some honor pairs in hand (=can be called easily or act as safe discards)
			log("Call accepted because it boosts the value of the hand!");
		}
		else if (newHandValue.score.open > handValue.score.open * 0.9 && //Call loses not much value
			newHandValue.score.open > handValue.score.closed * 0.7 &&
			((isBadWait && (newHandValue.score.open >= (1000 - (CALL_PON_CHI * 100) - ((3 - newHandValue.shanten) * 100)))) || // And it's a bad wait while the hand is not extremely cheap
				(!isBadWait && (newHandValue.score.open >= (2000 - (CALL_PON_CHI * 200) - ((3 - newHandValue.shanten) * 200)))) || //Or it was a good wait and the hand is at least a bit valuable
				newHonorPairs >= 2) && //Or multiple honor pairs
			((newHandTriples.pairs.filter(t => isValueTile(t) && getNumberOfTilesAvailable(t.index, t.type) >= 1)).length >= 2 && (newPairs >= 2 || newHandValue.shanten > 1))) {//And would open hand anyway with honor call
			log("Call accepted because it reduces shanten!");
		}
		else if (newHandValue.shanten == 0 && newHandValue.score.open > handValue.score.closed * 0.9 &&
			newHandValue.waits > 2 && isBadWait) {// Make hand ready and eliminate a bad wait
			log("Call accepted because it eliminates a bad wait and makes the hand ready!");
		}
		else if ((0.5 - (tilesLeft / getWallSize())) +
			(0.25 - (newHandValue.shanten / 4)) +
			(newHandValue.shanten > 0 ? ((newPairs - newHandValue.shanten - 0.5) / 2) : 0) +
			((newHandValue.score.open / 3000) - 0.5) +
			(((newHandValue.score.open / handValue.score.closed) * 0.75) - 0.75) +
			((isBadWait / 2) - 0.25) >=
			1 - (CALL_PON_CHI / 2)) { //The call is good in multiple aspects
			log("Call accepted because it's good in multiple aspects");
		}
		else { //Decline
			declineCall(operation);
			log("Call declined because it does not benefit the hand!");
			return false;
		}
	}

	makeCallWithOption(operation, comb);
	return true;
}

//Call Tile for Kan
function callDaiminkan() {
	if (!isClosed) {
		callKan(getOperations().ming_gang, getTileForCall());
	}
	else { //Always decline with closed hand
		declineCall(getOperations().ming_gang);
	}
}

//Add from Hand to existing Pon
function callShouminkan() {
	callKan(getOperations().add_gang, getTileForCall());
}

//Closed Kan
function callAnkan(combination) {
	callKan(getOperations().an_gang, getTileFromString(combination[0]));
}

//Needs a semi good hand to call Kans and other players are not dangerous
function callKan(operation, tileForCall) {
	log("Consider Kan.");
	var tiles = getHandValues(getHandWithCalls(ownHand));

	var newTiles = getHandValues(getHandWithCalls(removeTilesFromTileArray(ownHand, [tileForCall]))); //Check if efficiency goes down without additional tile

	if (isPlayerRiichi(0) ||
		(strategyAllowsCalls &&
			tiles.shanten <= (tilesLeft / (getWallSize() / 2)) + CALL_KAN &&
			getCurrentDangerLevel() < 1000 + (CALL_KAN * 500) &&
			tiles.shanten >= newTiles.shanten &&
			tiles.efficiency * 0.9 <= newTiles.efficiency)) {
		makeCall(operation);
		log("Kan accepted!");
	}
	else {
		if (operation == getOperations().ming_gang) { // Decline call for closed/added Kans is not working, just skip it and discard normally
			declineCall(operation);
		}
		log("Kan declined!");
	}
}

function callRon() {
	makeCall(getOperations().rong);
}

function callTsumo() {
	makeCall(getOperations().zimo);
}

function callKita() { // 3 player only
	if (strategy != STRATEGIES.THIRTEEN_ORPHANS && strategy != STRATEGIES.FOLD) {
		if (getNumberOfTilesInTileArray(ownHand, 4, 3) > 1) { //More than one north tile: Check if it's okay to call kita
			var handValue = getHandValues(ownHand);
			var newHandValue = getHandValues(removeTilesFromTileArray(ownHand, [{ index: 4, type: 3, dora: false }]));
			if (handValue.shanten <= 1 && newHandValue.shanten > handValue.shanten) {
				return false;
			}
		}
		sendKitaCall();
		return true;
	}
	return false;
}

function callAbortiveDraw() { // Kyuushu Kyuuhai, 9 Honors or Terminals in starting Hand
	if (canDoThirteenOrphans()) {
		return;
	}
	var handValue = getHandValues(ownHand);
	if (handValue.shanten >= 4) { //Hand is bad -> abort game
		sendAbortiveDrawCall();
	}
}

function callRiichi(tiles) {
	var operations = getOperationList();
	var combination = [];
	for (let op of operations) {
		if (op.type == getOperations().liqi) { //Get possible tiles for discard in riichi
			combination = op.combination;
		}
	}
	log(JSON.stringify(combination));
	for (let tile of tiles) {
		for (let comb of combination) {
			if (comb.charAt(0) == "0") { //Fix for Dora Tiles
				combination.push("5" + comb.charAt(1));
			}
			if (getTileName(tile.tile) == comb) {
				if (shouldRiichi(tile)) {
					var moqie = false;
					if (getTileName(tile.tile) == getTileName(ownHand[ownHand.length - 1])) { //Is last tile?
						moqie = true;
					}
					log("Discard: " + getTileName(tile.tile, false));
					sendRiichiCall(comb, moqie);
					return true;
				}
				else {
					return false;
				}
			}
		}
	}
	log("Riichi declined because Combination not found!");
	return false;
}

//Discard the safest tile, but consider slightly riskier tiles with same shanten
function discardFold(tiles) {
	if (strategy != STRATEGIES.FOLD) { //Not in full Fold mode yet: Discard a relatively safe tile with high priority
		for (let tile of tiles) {
			var foldThreshold = getFoldThreshold(tile, ownHand);
			if (tile.shanten == Math.min(...tiles.map(t => t.shanten)) && //If next tile same shanten as the best tile
				tile.danger < Math.min(...tiles.map(t => t.danger)) * 1.1 && //And the tile is not much more dangerous than the safest tile
				tile.danger <= foldThreshold * 2) {
				log("Tile Priorities: ");
				printTilePriority(tiles);
				discardTile(tile.tile);
				return tile.tile;
			}
		}
		// No safe tile with good shanten found: Full Fold.
		log("Hand is very dangerous, full fold.");
		strategyAllowsCalls = false;
	}

	tiles.sort(function (p1, p2) {
		return p1.danger - p2.danger;
	});
	log("Fold Tile Priorities: ");
	printTilePriority(tiles);

	discardTile(tiles[0].tile);
	return tiles[0].tile;
}

//Remove the given Tile from Hand
function discardTile(tile) {
	if (!tile.valid) {
		return;
	}
	log("Discard: " + getTileName(tile, false));
	for (var i = ownHand.length - 1; i >= 0; i--) {
		if (isSameTile(ownHand[i], tile, true)) {
			discards[0].push(ownHand[i]);
			if (!isDebug()) {
				callDiscard(i);
			}
			else {
				ownHand.splice(i, 1);
			}
			break;
		}
	}
}

//Simulates discarding every tile and calculates hand value.
//Asynchronous to give the browser time to "breath"
async function getTilePriorities(inputHand) {

	if (isDebug()) {
		log("Dora: " + getTileName(dora[0], false));
		printHand(inputHand);
	}

	var tiles = [];
	if (strategy == STRATEGIES.CHIITOITSU) {
		tiles = chiitoitsuPriorities();
	}
	else if (strategy == STRATEGIES.THIRTEEN_ORPHANS) {
		tiles = thirteenOrphansPriorities();
	}
	else {
		for (var i = 0; i < inputHand.length; i++) { //Create 13 Tile hands

			var hand = [...inputHand];
			hand.splice(i, 1);

			if (tiles.filter(t => isSameTile(t.tile, inputHand[i], true)).length > 0) { //Skip same tiles in hand
				continue;
			}

			tiles.push(getHandValues(hand, inputHand[i]));

			await new Promise(r => setTimeout(r, 10)); //Sleep a short amount of time to not completely block the browser
		}
	}

	tiles.sort(function (p1, p2) {
		return p2.priority - p1.priority;
	});
	return Promise.resolve(tiles);
}

/*
Calculates Values for all tiles in the hand.
As the Core of the AI this function is really complex. The simple explanation:
It simulates the next two turns, calculates all the important stuff (shanten, dora, yaku, waits etc.) and produces a priority for each tile based on the expected value/shanten in two turns.

In reality it would take far too much time to calculate all the possibilites (availableTiles * (availableTiles - 1) * 2 which can be up to 30000 possibilities).
Therefore most of the complexity comes from tricks to reduce the runtime:
At first all the tiles are computed that could improve the hand in the next two turns (which is usually less than 1000).
Duplicates (for example 3m -> 4m and 4m -> 3m) are marked and will only be computed once, but with twice the value.
The rest is some math to produce the same result which would result in actually simulating everything (like adding the original value of the hand for all the useless combinations).
*/
function getHandValues(hand, discardedTile) {
	var shanten = 8; //No check for Chiitoitsu in this function, so this is maximum

	var callTriples = parseInt(getTriples(calls[0]).length / 3);

	var triplesAndPairs = getTriplesAndPairs(hand);

	var triples = triplesAndPairs.triples;
	var pairs = triplesAndPairs.pairs;
	var doubles = getDoubles(removeTilesFromTileArray(hand, triples.concat(pairs)));

	var baseShanten = calculateShanten(parseInt(triples.length / 3) + callTriples, parseInt(pairs.length / 2), parseInt(doubles.length / 2));

	if (typeof discardedTile != 'undefined') { //When deciding whether to call for a tile there is no discarded tile in the evaluation
		hand.push(discardedTile); //Calculate original values
		var originalCombinations = getTriplesAndPairs(hand);
		var originalTriples = originalCombinations.triples;
		var originalPairs = originalCombinations.pairs;
		var originalDoubles = getDoubles(removeTilesFromTileArray(hand, originalTriples.concat(originalPairs)));

		var originalShanten = calculateShanten(parseInt(originalTriples.length / 3) + callTriples, parseInt(originalPairs.length / 2), parseInt(originalDoubles.length / 2));
		hand.pop();
	}
	else {
		var originalShanten = baseShanten;
	}

	var expectedScore = { open: 0, closed: 0, riichi: 0 }; //For the expected score (only looking at hands that improve the current hand)
	var yaku = { open: 0, closed: 0 }; //Expected Yaku
	var doraValue = 0; //Expected Dora
	var waits = 0; //Waits when in Tenpai
	var shape = 0; //When 1 shanten: Contains a value that indicates how good the shape of the hand is
	var fu = 0;

	var kita = 0;
	if (getNumberOfPlayers() == 3) {
		kita = getNumberOfKitaOfPlayer(0) * getTileDoraValue({ index: 4, type: 3 });
	}

	var waitTiles = [];
	var tileCombinations = []; //List of combinations for second step to save calculation time

	// STEP 1: Create List of combinations of tiles that can improve the hand
	var newTiles1 = getUsefulTilesForDouble(hand); //For every tile: Find tiles that make them doubles or triples
	for (let newTile of newTiles1) {

		var numberOfTiles1 = getNumberOfTilesAvailable(newTile.index, newTile.type);
		if (numberOfTiles1 <= 0) { //Skip if tile is dead
			continue;
		}

		hand.push(newTile);
		var newTiles2 = getUsefulTilesForDouble(hand).filter(t => getNumberOfTilesAvailable(t.index, t.type) > 0);
		if (PERFORMANCE_MODE - timeSave <= 1) { //In Low Spec Mode: Ignore some combinations that are unlikely to improve the hand -> Less calculation time
			newTiles2 = getUsefulTilesForTriple(hand).filter(t => getNumberOfTilesAvailable(t.index, t.type) > 0);
			if (PERFORMANCE_MODE - timeSave <= 0) { //Ignore even more tiles for extremenly low spec...
				newTiles2 = newTiles2.filter(t => t.type == newTile.type);
			}
		}

		var newTiles2Objects = [];
		for (let t of newTiles2) {
			var dupl1 = tileCombinations.find(tc => isSameTile(tc.tile1, t)); //Check if combination is already in the array
			var skip = false;
			if (typeof dupl1 != 'undefined') {
				var duplicateCombination = dupl1.tiles2.find(t2 => isSameTile(t2.tile2, newTile));
				if (typeof duplicateCombination != 'undefined') { //If already exists: Set flag to count it twice and set flag to skip the current one
					duplicateCombination.duplicate = true;
					skip = true;
				}
			}
			newTiles2Objects.push({ tile2: t, winning: false, furiten: false, triplesAndPairs: null, duplicate: false, skip: skip });
		}

		tileCombinations.push({ tile1: newTile, tiles2: newTiles2Objects, winning: false, furiten: false, triplesAndPairs: null });
		hand.pop();
	}

	//STEP 2: Check if some of these tiles or combinations are winning or in furiten. We need to know this in advance for Step 3
	for (let tileCombination of tileCombinations) {
		//Simulate only the first tile drawn for now
		var tile1 = tileCombination.tile1;
		hand.push(tile1);

		var triplesAndPairs2 = getTriplesAndPairs(hand);

		var winning = isWinningHand(parseInt((triplesAndPairs2.triples.length / 3)) + callTriples, triplesAndPairs2.pairs.length / 2);
		if (winning) {
			waitTiles.push(tile1);
			//Mark this tile in other combinations as not duplicate and no skip
			for (let tc of tileCombinations) {
				tc.tiles2.forEach(function (t2) {
					if (isSameTile(tile1, t2.tile2)) {
						t2.duplicate = false;
						t2.skip = false;
					}
				});
			}
		}
		var furiten = (winning && (isTileFuriten(tile1.index, tile1.type) || isSameTile(discardedTile, tile1)));
		tileCombination.winning = winning;
		tileCombination.furiten = furiten;
		tileCombination.triplesAndPairs = triplesAndPairs2; //The triplesAndPairs function is really slow, so save this result for later

		hand.pop();
	}

	var tile1Furiten = tileCombinations.filter(t => t.furiten).length > 0;
	for (let tileCombination of tileCombinations) { //Now again go through all the first tiles, but also the second tiles
		hand.push(tileCombination.tile1);
		for (let tile2Data of tileCombination.tiles2) {
			if (tile2Data.skip || (tileCombination.winning && !tile1Furiten)) { //Ignore second tile if marked as skip(is a duplicate) or already winning with tile 1
				continue;
			}
			hand.push(tile2Data.tile2);

			var triplesAndPairs3 = getTriplesAndPairs(hand);

			var winning2 = isWinningHand(parseInt((triplesAndPairs3.triples.length / 3)) + callTriples, triplesAndPairs3.pairs.length / 2);
			var furiten2 = winning2 && (isTileFuriten(tile2Data.tile2.index, tile2Data.tile2.type) || isSameTile(discardedTile, tile2Data.tile2));
			tile2Data.winning = winning2;
			tile2Data.furiten = furiten2;
			tile2Data.triplesAndPairs = triplesAndPairs3;

			hand.pop();
		}
		hand.pop();
	}

	var numberOfTotalCombinations = 0;
	var numberOfTotalWaitCombinations = 0;

	//STEP 3: Check the values when these tiles are drawn.
	for (let tileCombination of tileCombinations) {
		var tile1 = tileCombination.tile1;
		var numberOfTiles1 = getNumberOfTilesAvailable(tile1.index, tile1.type);

		//Simulate only the first tile drawn for now
		hand.push(tile1);

		var triplesAndPairs2 = tileCombination.triplesAndPairs;
		var triples2 = triplesAndPairs2.triples;
		var pairs2 = triplesAndPairs2.pairs;

		if (!isClosed && (!tileCombination.winning) &&
			getNumberOfTilesInTileArray(triples2, tile1.index, tile1.type) == 3) {
			numberOfTiles1 *= 2; //More value to possible triples when hand is open (can call pons from all players)
		}

		var factor;
		var thisShanten = 8;
		if (tileCombination.winning && !tile1Furiten) { //Hand is winning: Add the values of the hand for most possible ways to draw this:
			factor = numberOfTiles1 * (availableTiles.length - 1); //Number of ways to draw this tile first and then any of the other tiles
			//Number of ways to draw a random tile which we don't have in the array and then the winning tile. We only look at the "good tile -> winning tile" combination later.
			factor += (availableTiles.length - tileCombinations.reduce((pv, cv) => pv + getNumberOfTilesAvailable(cv.tile1.index, cv.tile1.type), 0)) * numberOfTiles1;
			thisShanten = (-1 - baseShanten);
		}
		else { // This tile is not winning
			// For all the tiles we don't consider as a second draw (because they're useless): The shanten value for this tile -> useless tile is just the value after the first draw
			var doubles2 = getDoubles(removeTilesFromTileArray(hand, triples2.concat(pairs2)));
			factor = numberOfTiles1 * ((availableTiles.length - 1) - tileCombination.tiles2.reduce(function (pv, cv) { // availableTiles - useful tiles (which we will check later)
				if (isSameTile(tile1, cv.tile2)) {
					return pv + getNumberOfTilesAvailable(cv.tile2.index, cv.tile2.type) - 1;
				}
				return pv + getNumberOfTilesAvailable(cv.tile2.index, cv.tile2.type);
			}, 0));
			if (tile1Furiten) {
				thisShanten = 0 - baseShanten;
			}
			else {
				thisShanten = (calculateShanten(parseInt(triples2.length / 3) + callTriples, parseInt(pairs2.length / 2), parseInt(doubles2.length / 2)) - baseShanten);
			}
		}

		shanten += thisShanten * factor;

		if (tileCombination.winning) { //For winning tiles: Add waits, fu and the Riichi value
			var thisDora = getNumberOfDoras(triples2.concat(pairs2, calls[0]));
			var thisYaku = getYaku(hand, calls[0], triplesAndPairs2);
			var thisWait = numberOfTiles1 * getWaitQuality(tile1);
			var thisFu = calculateFu(triples2, calls[0], pairs2, removeTilesFromTileArray(hand, triples.concat(pairs).concat(tile1)), tile1);
			if (isClosed || thisYaku.open >= 1 || tilesLeft <= 4) {
				if (tile1Furiten && tilesLeft > 4) {
					thisWait = numberOfTiles1 / 6;
				}
				waits += thisWait;
				fu += thisFu * thisWait * factor;
				if (thisFu == 30 && isClosed) {
					thisYaku.closed += 1;
				}
				doraValue += thisDora * factor;
				yaku.open += thisYaku.open * factor;
				yaku.closed += thisYaku.closed * factor;
				expectedScore.open += calculateScore(0, thisYaku.open + thisDora + kita, thisFu) * factor;
				expectedScore.closed += calculateScore(0, thisYaku.closed + thisDora + kita, thisFu) * factor;
				numberOfTotalCombinations += factor;
			}

			expectedScore.riichi += calculateScore(0, thisYaku.closed + thisDora + kita + 1 + 0.2 + getUradoraChance(), thisFu) * thisWait * factor;
			numberOfTotalWaitCombinations += factor * thisWait;
			if (!tile1Furiten) {
				hand.pop();
				continue; //No need to check this tile in combination with any of the other tiles, if this is drawn first and already wins
			}
		}

		var tile2Furiten = tileCombination.tiles2.filter(t => t.furiten).length > 0;

		for (let tile2Data of tileCombination.tiles2) {//Look at second tiles if not already winning
			var tile2 = tile2Data.tile2;
			var numberOfTiles2 = getNumberOfTilesAvailable(tile2.index, tile2.type);
			if (isSameTile(tile1, tile2)) {
				if (numberOfTiles2 == 1) {
					continue;
				}
				numberOfTiles2--;
			}

			if (tile2Data.skip) {
				continue;
			}

			var combFactor = numberOfTiles1 * numberOfTiles2; //Number of ways to draw tile 1 first and then tile 2
			if (tile2Data.duplicate) {
				combFactor *= 2;
			}

			hand.push(tile2); //Simulate second draw

			var triplesAndPairs3 = tile2Data.triplesAndPairs;
			var triples3 = triplesAndPairs3.triples;
			var pairs3 = triplesAndPairs3.pairs;

			var thisShanten = 8;
			var winning = isWinningHand(parseInt((triples3.length / 3)) + callTriples, pairs3.length / 2);

			var thisDora = getNumberOfDoras(triples3.concat(pairs3, calls[0]));
			var thisYaku = getYaku(hand, calls[0], triplesAndPairs3);

			if (!isClosed && (!winning || tile2Furiten) &&
				getNumberOfTilesInTileArray(triples3, tile2.index, tile2.type) == 3) {
				combFactor *= 2; //More value to possible triples when hand is open (can call pons from all players)
			}

			if (winning && !tile2Furiten) { //If this tile combination wins in 2 turns: calculate shape etc.
				thisShanten = -1 - baseShanten;
				if (waitTiles.filter(t => isSameTile(t, tile2)).length == 0) {
					var newShape = numberOfTiles2 * getWaitQuality(tile2) * ((numberOfTiles1) / availableTiles.length);
					if (tile2Data.duplicate) {
						newShape += numberOfTiles1 * getWaitQuality(tile1) * ((numberOfTiles2) / availableTiles.length);
					}
					shape += newShape;
				}

				var secondDiscard = removeTilesFromTileArray(hand, triples3.concat(pairs3))[0];
				if (!tile2Data.duplicate) {
					var newFu = calculateFu(triples3, calls[0], pairs3, removeTilesFromTileArray(hand, triples.concat(pairs).concat(tile2).concat(secondDiscard)), tile2);
					if (newFu == 30 && isClosed) {
						thisYaku.closed += 1;
					}
				}
				else { //Calculate Fu for drawing both tiles in different orders
					var newFu = calculateFu(triples3, calls[0], pairs3, removeTilesFromTileArray(hand, triples.concat(pairs).concat(tile2).concat(secondDiscard)), tile2);
					var newFu2 = calculateFu(triples3, calls[0], pairs3, removeTilesFromTileArray(hand, triples.concat(pairs).concat(tile1).concat(secondDiscard)), tile1);
					if (newFu == 30 && isClosed) {
						thisYaku.closed += 0.5;
					}
					if (newFu2 == 30 && isClosed) {
						thisYaku.closed += 0.5;
					}
				}
			}
			else { //Not winning? Calculate shanten correctly
				if (winning && (tile2Furiten || (!isClosed && thisYaku.open < 1))) { //Furiten/No Yaku: We are 0 shanten
					thisShanten = 0 - baseShanten;
				}
				else {
					var numberOfDoubles = getDoubles(removeTilesFromTileArray(hand, triples3.concat(pairs3))).length;
					var numberOfPairs = pairs3.length;
					thisShanten = calculateShanten(parseInt(triples3.length / 3) + callTriples, parseInt(numberOfPairs / 2), parseInt(numberOfDoubles / 2)) - baseShanten;
					if (thisShanten == -1) {  //Give less prio to tile combinations that only improve the hand by 1 shanten in two turns.
						thisShanten = -0.5;
					}
				}
			}
			shanten += thisShanten * combFactor;

			if (winning || thisShanten < 0) {
				doraValue += thisDora * combFactor;
				yaku.open += thisYaku.open * combFactor;
				yaku.closed += thisYaku.closed * combFactor;
				expectedScore.open += calculateScore(0, thisYaku.open + thisDora + kita) * combFactor;
				expectedScore.closed += calculateScore(0, thisYaku.closed + thisDora + kita) * combFactor;
				numberOfTotalCombinations += combFactor;
			}

			hand.pop();
		}

		hand.pop();
	}

	var allCombinations = availableTiles.length * (availableTiles.length - 1);
	shanten /= allCombinations; //Divide by total amount of possible draw combinations

	if (numberOfTotalCombinations > 0) {
		expectedScore.open /= numberOfTotalCombinations; //Divide by the total combinations we checked, to get the average expected value
		expectedScore.closed /= numberOfTotalCombinations;
		doraValue /= numberOfTotalCombinations;
		yaku.open /= numberOfTotalCombinations;
		yaku.closed /= numberOfTotalCombinations;
	}
	if (numberOfTotalWaitCombinations > 0) {
		expectedScore.riichi /= numberOfTotalWaitCombinations;
		fu /= numberOfTotalWaitCombinations;
	}
	if (waitTiles.length > 0) {
		waits *= (waitTiles.length * 0.15) + 0.75; //Waiting on multiple tiles is better
	}

	fu = fu <= 30 ? 30 : fu;
	fu = fu > 110 ? 30 : fu;

	var efficiency = (shanten + (baseShanten - originalShanten)) * -1; //Percent Number that indicates how big the chance is to improve the hand (in regards to efficiency). Negative for increasing shanten with the discard
	if (originalShanten == 0) { //Already in Tenpai: Look at waits instead
		if (baseShanten == 0) {
			efficiency = (waits + shape) / 10;
		}
		else {
			efficiency = ((shanten / 1.7) * -1);
		}
	}

	if (baseShanten > 0) { //When not tenpai
		expectedScore.riichi = calculateScore(0, yaku.closed + doraValue + kita + 1 + 0.2 + getUradoraChance());
	}

	var danger = 0;
	var sakigiri = 0;
	if (typeof discardedTile != 'undefined') { //When deciding whether to call for a tile there is no discarded tile in the evaluation
		danger = getTileDanger(discardedTile);
		sakigiri = getSakigiriValue(hand, discardedTile);
	}

	var priority = calculateTilePriority(efficiency, expectedScore, danger - sakigiri);

	var riichiPriority = 0;
	if (originalShanten == 0) { //Already in Tenpai: Look at waits instead
		riichiEfficiency = waits / 10;
		riichiPriority = calculateTilePriority(riichiEfficiency, expectedScore, danger - sakigiri);
	}

	return {
		tile: discardedTile, priority: priority, riichiPriority: riichiPriority, shanten: baseShanten, efficiency: efficiency,
		score: expectedScore, dora: doraValue, yaku: yaku, waits: waits, shape: shape, danger: danger, fu: fu
	};
}

//Calculates a relative priority based on how "good" the given values are.
//The resulting priority value is useless as an absolute value, only use it relatively to compare with other values of the same hand.
function calculateTilePriority(efficiency, expectedScore, danger) {
	var score = expectedScore.open;
	if (isClosed) {
		score = expectedScore.closed;
	}

	var placementFactor = 1;

	if (isLastGame() && getDistanceToFirst() < 0) { //First Place in last game:
		placementFactor = 1.5;
	}

	//Basically the formula should be efficiency multiplied by score (=expected value of the hand)
	//But it's generally better to just win even with a small score to prevent others from winning (and no-ten penalty)
	//That's why efficiency is weighted a bit higher with Math.pow.
	var weightedEfficiency = Math.pow(Math.abs(efficiency), 0.3 + EFFICIENCY * placementFactor);
	weightedEfficiency = efficiency < 0 ? -weightedEfficiency : weightedEfficiency;

	score -= (danger * 2 * SAFETY);

	if (weightedEfficiency < 0) { //Hotfix for negative efficiency (increasing shanten)
		score = 50000 - score;
	}

	return weightedEfficiency * score;
}

//Get Chiitoitsu Priorities -> Look for Pairs
function chiitoitsuPriorities() {

	var tiles = [];

	var originalPairs = getPairsAsArray(ownHand);

	var originalShanten = 6 - (originalPairs.length / 2);

	for (var i = 0; i < ownHand.length; i++) { //Create 13 Tile hands, check for pairs
		var newHand = [...ownHand];
		newHand.splice(i, 1);
		var pairs = getPairsAsArray(newHand);
		var pairsValue = pairs.length / 2;
		var handWithoutPairs = removeTilesFromTileArray(newHand, pairs);

		var baseDora = getNumberOfDoras(pairs);
		var doraValue = 0;
		var baseShanten = 6 - pairsValue;

		var waits = 0;
		var shanten = 0;

		var baseYaku = getYaku(newHand, calls[0]);
		var yaku = { open: 0, closed: 0 };

		var shape = 0;

		//Possible Value, Yaku and Dora after Draw
		handWithoutPairs.forEach(function (tile) {
			var currentHand = [...handWithoutPairs];
			currentHand.push(tile);
			var numberOfTiles = getNumberOfNonFuritenTilesAvailable(tile.index, tile.type);
			var chance = (numberOfTiles + (getWaitQuality(tile) / 10)) / availableTiles.length;
			var pairs2 = getPairsAsArray(currentHand);
			if (pairs2.length > 0) { //If the tiles improves the hand: Calculate the expected values
				shanten += ((6 - (pairsValue + (pairs2.length / 2))) - baseShanten) * chance;
				doraValue += getNumberOfDoras(pairs2) * chance;
				var y2 = getYaku(currentHand.concat(pairs), calls[0]);
				yaku.open += (y2.open - baseYaku.open) * chance;
				yaku.closed += (y2.closed - baseYaku.closed) * chance;
				if (pairsValue + (pairs2.length / 2) == 7) { //Winning hand
					waits = numberOfTiles * getWaitQuality(tile);
					doraValue = getNumberOfDoras(pairs2);
					if (tile.index < 3 || tile.index > 7 || tile.doraValue > 0 || getWaitQuality(tile) > 1.1 || //Good Wait
						currentHand.filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length == 0) { //Or Tanyao
						shape = 1;
					}
				}
			}
		});
		doraValue += baseDora;
		yaku.open += baseYaku.open;
		yaku.closed += baseYaku.closed + 2; //Add Chiitoitsu manually
		if (getNumberOfPlayers() == 3) {
			doraValue += getNumberOfKitaOfPlayer(0) * getTileDoraValue({ index: 4, type: 3 });
		}

		var expectedScore = {
			open: 1000, closed: calculateScore(0, yaku.closed + doraValue, 25),
			riichi: calculateScore(0, yaku.closed + doraValue + 1 + 0.2 + getUradoraChance(), 25)
		};

		var efficiency = (shanten + (baseShanten - originalShanten)) * -1;
		if (originalShanten == 0) { //Already in Tenpai: Look at waits instead
			efficiency = waits / 10;
		}
		var danger = getTileDanger(ownHand[i]);

		var sakigiri = getSakigiriValue(newHand, ownHand[i]);

		var priority = calculateTilePriority(efficiency, expectedScore, danger - sakigiri);
		tiles.push({
			tile: ownHand[i], priority: priority, riichiPriority: priority, shanten: baseShanten, efficiency: efficiency,
			score: expectedScore, dora: doraValue, yaku: yaku, waits: waits, shape: shape, danger: danger, fu: 25
		});
	}

	return tiles;
}

//Get Thirteen Orphans Priorities -> Look for Honors/1/9
//Returns Array of tiles with priorities (value, danger etc.)
function thirteenOrphansPriorities() {

	var originalOwnTerminalHonors = getAllTerminalHonorFromHand(ownHand);
	// Filter out all duplicate terminal/honors
	var originalUniqueTerminalHonors = [];
	originalOwnTerminalHonors.forEach(tile => {
		if (!originalUniqueTerminalHonors.some(otherTile => isSameTile(tile, otherTile))) {
			originalUniqueTerminalHonors.push(tile);
		}
	});
	var originalShanten = 13 - originalUniqueTerminalHonors.length;
	if (originalOwnTerminalHonors.length > originalUniqueTerminalHonors.length) { //At least one terminal/honor twice
		originalShanten -= 1;
	}

	var tiles = [];
	for (var i = 0; i < ownHand.length; i++) { //Simulate discard of every tile

		var hand = [...ownHand];
		hand.splice(i, 1);

		var ownTerminalHonors = getAllTerminalHonorFromHand(hand);
		// Filter out all duplicate terminal/honors
		var uniqueTerminalHonors = [];
		ownTerminalHonors.forEach(tile => {
			if (!uniqueTerminalHonors.some(otherTile => isSameTile(tile, otherTile))) {
				uniqueTerminalHonors.push(tile);
			}
		});
		var shanten = 13 - uniqueTerminalHonors.length;
		if (ownTerminalHonors.length > uniqueTerminalHonors.length) { //At least one terminal/honor twice
			shanten -= 1;
		}
		var doraValue = getNumberOfDoras(hand);
		var yaku = { open: 13, closed: 13 };
		var waits = 0;
		if (shanten == 0) {
			var missingTile = getMissingTilesForThirteenOrphans(uniqueTerminalHonors)[0];
			waits = getNumberOfNonFuritenTilesAvailable(missingTile.index, missingTile.type);
		}

		var efficiency = shanten == originalShanten ? 1 : 0;
		var danger = getTileDanger(ownHand[i]);
		var sakigiri = getSakigiriValue(hand, ownHand[i], danger);
		var yakuman = calculateScore(0, 13);
		var expectedScore = { open: 0, closed: yakuman, riichi: yakuman };
		var priority = calculateTilePriority(efficiency, expectedScore, danger - sakigiri);

		tiles.push({
			tile: ownHand[i], priority: priority, riichiPriority: priority, shanten: shanten, efficiency: efficiency,
			score: expectedScore, dora: doraValue, yaku: yaku, waits: waits, shape: 0, danger: danger, fu: 30
		});

	}

	return tiles;
}

// Used during the match to see if its still viable to go for thirteen orphans.
function canDoThirteenOrphans() {

	// PARAMETERS
	var max_missing_orphans_count = 2; // If an orphan has been discarded more than this time (and is not in hand), we don't go for thirteen orphan.
	// Ie. 'Red Dragon' is not in hand, but been discarded 3-times on field. We stop going for thirteen orphan.

	if (!isClosed) { //Already called some tiles? Can't do thirteen orphans
		return false;
	}

	var ownTerminalHonors = getAllTerminalHonorFromHand(ownHand);

	// Filter out all duplicate terminal/honors
	var uniqueTerminalHonors = [];
	ownTerminalHonors.forEach(tile => {
		if (!uniqueTerminalHonors.some(otherTile => isSameTile(tile, otherTile))) {
			uniqueTerminalHonors.push(tile);
		}
	});

	// Fails if we do not have enough unique orphans.
	if (uniqueTerminalHonors.length < THIRTEEN_ORPHANS) {
		return false;
	}

	// Get list of missing orphans.
	var missingOrphans = getMissingTilesForThirteenOrphans(uniqueTerminalHonors);

	if (missingOrphans.length == 1) {
		max_missing_orphans_count = 3;
	}

	// Check if there are enough required orphans in the pool.
	for (let uniqueOrphan of missingOrphans) {
		if (4 - getNumberOfNonFuritenTilesAvailable(uniqueOrphan.index, uniqueOrphan.type) > max_missing_orphans_count) {
			return false;
		}
	}

	return true;
}

//Return a list of missing tiles for thirteen orphans
function getMissingTilesForThirteenOrphans(uniqueTerminalHonors) {
	var thirteen_orphans_set = "19m19p19s1234567z";
	var thirteenOrphansTiles = getTilesFromString(thirteen_orphans_set);
	return thirteenOrphansTiles.filter(tile => !uniqueTerminalHonors.some(otherTile => isSameTile(tile, otherTile)));
}


//Discards the "best" tile
async function discard() {

	var tiles = await getTilePriorities(ownHand);
	tiles = sortOutUnsafeTiles(tiles);

	if (KEEP_SAFETILE) {
		tiles = keepSafetile(tiles);
	}

	if (strategy == STRATEGIES.FOLD || tiles.filter(t => t.safe).length == 0) {
		return discardFold(tiles);
	}

	log("Tile Priorities: ");
	printTilePriority(tiles);

	var tile = getDiscardTile(tiles);

	var riichi = false;
	if (canRiichi()) {
		tiles.sort(function (p1, p2) {
			return p2.riichiPriority - p1.riichiPriority;
		});
		riichi = callRiichi(tiles);
	}
	if (!riichi) {
		discardTile(tile);
	}

	return tile;
}

//Check all tiles for enough safety
function sortOutUnsafeTiles(tiles) {
	for (let tile of tiles) {
		if (tile == tiles[0]) {
			var highestPrio = true;
		}
		else {
			var highestPrio = false;
		}
		if (shouldFold(tile, highestPrio)) {
			tile.safe = 0;
		}
		else {
			tile.safe = 1;
		}
	}
	tiles = tiles.sort(function (p1, p2) {
		return p2.safe - p1.safe;
	});
	return tiles;
}

//If there is only 1 safetile in hand, don't discard it.
function keepSafetile(tiles) {
	if (getCurrentDangerLevel() > 2000 || tiles[0].shanten <= 1) { //Don't keep a safetile when it's too dangerous or hand is close to tenpai
		return tiles;
	}
	var safeTiles = 0;
	for (let t of tiles) {
		if (isSafeTile(1, t.tile) && isSafeTile(2, t.tile) && (getNumberOfPlayers() == 3 || isSafeTile(3, t.tile))) {
			safeTiles++;
		}
	}
	if (safeTiles > 1) {
		return tiles;
	}

	if (getNumberOfPlayers() == 3) {
		var tilesSafety = tiles.map(t => getWaitScoreForTileAndPlayer(1, t.tile, false) +
			getWaitScoreForTileAndPlayer(2, t.tile, false));
	}
	else {
		var tilesSafety = tiles.map(t => getWaitScoreForTileAndPlayer(1, t.tile, false) +
			getWaitScoreForTileAndPlayer(2, t.tile, false) +
			getWaitScoreForTileAndPlayer(3, t.tile, false));
	}

	var safetileIndex = tilesSafety.indexOf(Math.min(...tilesSafety));

	tiles.push(tiles.splice(safetileIndex, 1)[0]);

	return tiles;
}

//Input: Tile Priority List
//Output: Best Tile to discard. Usually the first tile in the list, but for open hands a valid yaku is taken into account
function getDiscardTile(tiles) {
	var tile = tiles[0].tile;

	if (tiles[0].valid && (tiles[0].yaku.open >= 1 || isClosed || tileLeft <= 4)) {
		return tile;
	}

	var highestYaku = -1;
	for (let t of tiles) {
		var foldThreshold = getFoldThreshold(t, ownHand);
		if (t.valid && t.yaku.open > highestYaku + 0.01 && t.yaku.open / 3.5 > highestYaku && t.danger <= foldThreshold) {
			tile = t.tile;
			highestYaku = t.yaku.open;
			if (t.yaku.open >= 1) {
				break;
			}
		}
	}
	if (getTileName(tile) != (getTileName(tiles[0].tile))) {
		log("Hand is open, trying to keep at least 1 Yaku.");
	}
	return tile;
}

//################################
// AI DEFENSE
// Defensive part of the AI
//################################

//Returns danger of tile for all players (from a specific players perspective, see second param) as a number from 0-100+
//Takes into account Genbutsu (Furiten for opponents), Suji, Walls and general knowledge about remaining tiles.
//From the perspective of playerPerspective parameter
function getTileDanger(tile, playerPerspective = 0) {
	var dangerPerPlayer = [0, 0, 0, 0];
	for (var player = 0; player < getNumberOfPlayers(); player++) { //Foreach Player
		if (player == playerPerspective) {
			continue;
		}

		dangerPerPlayer[player] = getDealInChanceForTileAndPlayer(player, tile, playerPerspective);

		if (playerPerspective == 0) { //Multiply with expected deal in value
			dangerPerPlayer[player] *= getExpectedDealInValue(player);
		}

	}

	var danger = dangerPerPlayer[0] + dangerPerPlayer[1] + dangerPerPlayer[2] + dangerPerPlayer[3];

	if (getCurrentDangerLevel() < 2500) { //Scale it down for low danger levels
		danger *= 1 - ((2500 - getCurrentDangerLevel()) / 2500);
	}

	return danger;
}

//Return the Danger value for a specific tile and player
function getTileDangerForPlayer(tile, player, playerPerspective = 0) {
	var danger = 0;
	if (getLastTileInDiscard(player, tile) != null) { // Check if tile in discard (Genbutsu)
		return 0;
	}

	danger = getWaitScoreForTileAndPlayer(player, tile, true, playerPerspective == 0); //Suji, Walls and general knowledge about remaining tiles.

	if (danger <= 0) {
		return 0;
	}

	//Honor tiles are often a preferred wait
	if (tile.type == 3) {
		danger *= 1.3;
	}

	//Is Dora? -> 10% more dangerous
	danger *= (1 + (getTileDoraValue(tile) / 10));

	//Is close to Dora? -> 5% more dangerous
	if (isTileCloseToDora(tile)) {
		danger *= 1.05;
	}

	//Is the player doing a flush of that type? -> More dangerous
	var honitsuChance = isDoingHonitsu(player, tile.type);
	var otherHonitsu = Math.max(isDoingHonitsu(player, 0) || isDoingHonitsu(player, 1) || isDoingHonitsu(player, 2));
	if (honitsuChance > 0) {
		danger *= 1 + honitsuChance;
	}
	else if (otherHonitsu > 0) { //Is the player going for any other flush?
		if (tile.type == 3) {
			danger *= 1 + otherHonitsu; //Honor tiles are also dangerous
		}
		else {
			danger *= 1 - otherHonitsu; //Other tiles are less dangerous
		}
	}

	//Is the player doing a tanyao? Inner tiles are more dangerous, outer tiles are less dangerous
	if (tile.type != 3 && tile.index < 9 && tile.index > 1) {
		danger *= 1 + (isDoingTanyao(player) / 10);
	}
	else {
		danger /= 1 + (isDoingTanyao(player) / 10);
	}

	//Does the player have no yaku yet? Yakuhai is likely -> Honor tiles are 10% more dangerous
	if (!hasYaku(player)) {
		if (tile.type == 3 && (tile.index > 4 || tile.index == getSeatWind(player) || tile.index == getRoundWind()) &&
			getNumberOfTilesAvailable(tile.type, tile.index) > 2) {
			danger *= 1.1;
		}
	}

	//Is Tile close to the tile discarded on the riichi turn? -> 10% more dangerous
	if (isPlayerRiichi(player) && riichiTiles[getCorrectPlayerNumber(player)] != null &&
		typeof riichiTiles[getCorrectPlayerNumber(player)] != 'undefined') {
		if (isTileCloseToOtherTile(tile, riichiTiles[getCorrectPlayerNumber(player)])) {
			danger *= 1.1;
		}
	}

	//Is Tile close to an early discard (first row)? -> 10% less dangerous
	discards[player].slice(0, 6).forEach(function (earlyDiscard) {
		if (isTileCloseToOtherTile(tile, earlyDiscard)) {
			danger *= 0.9;
		}
	});

	//Danger is at least 5
	if (danger < 5) {
		danger = 5;
	}

	return danger;
}

//Percentage to deal in with a tile
function getDealInChanceForTileAndPlayer(player, tile, playerPerspective = 0) {
	var total = 0;
	if (playerPerspective == 0) {
		if (typeof totalPossibleWaits.turn == 'undefined' || totalPossibleWaits.turn != tilesLeft) {
			totalPossibleWaits = { turn: tilesLeft, totalWaits: [0, 0, 0, 0] }; // Save it in a global variable to not calculate this expensive step multiple times per turn
			for (let pl = 1; pl < getNumberOfPlayers(); pl++) {
				totalPossibleWaits.totalWaits[pl] = getTotalPossibleWaits(pl);
			}
		}
		total = totalPossibleWaits.totalWaits[player];
	}
	if (playerPerspective != 0) {
		total = getTotalPossibleWaits(player);
	}
	return getTileDangerForPlayer(tile, player, playerPerspective) / total; //Then compare the given tile with it, this is our deal in percentage
}

//Total amount of waits possible
function getTotalPossibleWaits(player) {
	var total = 0;
	for (let i = 1; i <= 9; i++) { // Go through all tiles and check how many combinations there are overall for waits.
		for (let j = 0; j <= 3; j++) {
			if (j == 3 && i >= 8) {
				break;
			}
			total += getTileDangerForPlayer({ index: i, type: j }, player);
		}
	}
	return total;
}

//Returns the expected deal in calue
function getExpectedDealInValue(player) {
	var tenpaiChance = isPlayerTenpai(player);

	var value = getExpectedHandValue(player);

	//DealInValue is probability of player being in tenpai multiplied by the value of the hand
	return tenpaiChance * value;
}

//Calculate the expected Han of the hand
function getExpectedHandValue(player) {
	var doraValue = getNumberOfDoras(calls[player]); //Visible Dora (melds)

	doraValue += getExpectedDoraInHand(player); //Dora in hidden tiles (hand)

	//Kita (3 player mode only)
	if (getNumberOfPlayers() == 3) {
		doraValue += (getNumberOfKitaOfPlayer(player) * getTileDoraValue({ index: 4, type: 3 })) * 1;
	}

	var hanValue = 0;
	if (isPlayerRiichi(player)) {
		hanValue += 1;
	}

	//Yakus (only for open hands)
	hanValue += (Math.max(isDoingHonitsu(player, 0) * 2), (isDoingHonitsu(player, 1) * 2), (isDoingHonitsu(player, 2) * 2)) +
		(isDoingToiToi(player) * 2) + (isDoingTanyao(player) * 1) + (isDoingYakuhai(player) * 1);

	//Expect some hidden Yaku when more tiles are unknown. 1.3 Yaku for a fully concealed hand, less for open hands
	if (calls[player].length == 0) {
		hanValue += 1.3;
	}
	else {
		hanValue += getNumberOfTilesInHand(player) / 15;
	}

	hanValue = hanValue < 1 ? 1 : hanValue;

	return calculateScore(player, hanValue + doraValue);
}

//How many dora does the player have on average in his hidden tiles?
function getExpectedDoraInHand(player) {
	var uradora = 0;
	if (isPlayerRiichi(player)) { //amount of dora indicators multiplied by chance to hit uradora
		uradora = getUradoraChance();
	}
	return (((getNumberOfTilesInHand(player) + (discards[player].length / 2)) / availableTiles.length) * getNumberOfDoras(availableTiles)) + uradora;
}

//Returns the current Danger level of the table
function getCurrentDangerLevel(forPlayer = 0) { //Most Dangerous Player counts extra
	var i = 1;
	var j = 2;
	var k = 3;
	if (forPlayer == 1) {
		i = 0;
	}
	if (forPlayer == 2) {
		j = 0;
	}
	if (forPlayer == 3) {
		k = 0;
	}
	if (getNumberOfPlayers() == 3) {
		return ((getExpectedDealInValue(i) + getExpectedDealInValue(j) + Math.max(getExpectedDealInValue(i), getExpectedDealInValue(j))) / 3);
	}
	return ((getExpectedDealInValue(i) + getExpectedDealInValue(j) + getExpectedDealInValue(k) + Math.max(getExpectedDealInValue(i), getExpectedDealInValue(j), getExpectedDealInValue(k))) / 4);
}

//Returns the number of turns ago when the tile was most recently discarded
function getMostRecentDiscardDanger(tile, player, includeOthers) {
	var danger = 99;
	for (var i = 0; i < getNumberOfPlayers(); i++) {
		var r = getLastTileInDiscard(i, tile);
		if (player == i && r != null) { //Tile is in own discards
			return 0;
		}
		if (!includeOthers || player == 0) {
			continue;
		}
		if (r != null && typeof (r.numberOfPlayerHandChanges) == 'undefined') {
			danger = 0;
		}
		else if (r != null && r.numberOfPlayerHandChanges[player] < danger) {
			danger = r.numberOfPlayerHandChanges[player];
		}
	}

	return danger;
}

//Returns the position of a tile in discards
function getLastTileInDiscard(player, tile) {
	for (var i = discards[player].length - 1; i >= 0; i--) {
		if (isSameTile(discards[player][i], tile)) {
			return discards[player][i];
		}
	}
	return wasTileCalledFromOtherPlayers(player, tile);
}

//Checks if a tile has been called by someone
function wasTileCalledFromOtherPlayers(player, tile) {
	for (var i = 0; i < getNumberOfPlayers(); i++) {
		if (i == player) { //Skip own melds
			continue;
		}
		for (let t of calls[i]) { //Look through all melds and check where the tile came from
			if (t.from == localPosition2Seat(player) && isSameTile(tile, t)) {
				t.numberOfPlayerHandChanges = [10, 10, 10, 10];
				return t;
			}
		}
	}
	return null;
}

//Returns a number from 0 to 1 how likely it is that the player is tenpai
function isPlayerTenpai(player) {
	var numberOfCalls = parseInt(calls[player].length / 3);
	if (isPlayerRiichi(player) || numberOfCalls >= 4) {
		return 1;
	}

	if (getPlayerLinkState(player) == 0) { //disconnect
		return 0;
	}

	//Based on: https://pathofhouou.blogspot.com/2021/04/analysis-tenpai-chance-by-tedashis-and.html
	//This is only accurate for high level games!
	var tenpaiChanceList = [[], [], [], []];
	tenpaiChanceList[0] = [0, 0.1, 0.2, 0.5, 1, 1.8, 2.8, 4.2, 5.8, 7.6, 9.5, 11.5, 13.5, 15.5, 17.5, 19.5, 21.7, 23.9, 25, 27, 29, 31, 33, 35, 37];
	tenpaiChanceList[1] = [0.2, 0.9, 2.3, 4.7, 8.3, 12.7, 17.9, 23.5, 29.2, 34.7, 39.7, 43.9, 47.4, 50.3, 52.9, 55.2, 57.1, 59, 61, 63, 65, 67, 69];
	tenpaiChanceList[2] = [0, 5.1, 10.5, 17.2, 24.7, 32.3, 39.5, 46.1, 52, 57.2, 61.5, 65.1, 67.9, 69.9, 71.4, 72.4, 73.3, 74.2, 75, 76, 77, 78, 79];
	tenpaiChanceList[3] = [0, 0, 41.9, 54.1, 63.7, 70.9, 76, 79.9, 83, 85.1, 86.7, 87.9, 88.7, 89.2, 89.5, 89.4, 89.3, 89.2, 89.2, 89.2, 90, 90, 90];

	var numberOfDiscards = discards[player].length;
	for (var i = 0; i < getNumberOfPlayers(); i++) {
		if (i == player) {
			continue;
		}
		for (let t of calls[i]) { //Look through all melds and check where the tile came from
			if (t.from == localPosition2Seat(player)) {
				numberOfDiscards++;
			}
		}
	}

	if (numberOfDiscards > 20) {
		numberOfDiscards = 20;
	}

	try {
		var tenpaiChance = tenpaiChanceList[numberOfCalls][numberOfDiscards] / 100;
	}
	catch {
		var tenpaiChance = 0.5;
	}

	tenpaiChance *= 1 + (isPlayerPushing(player) / 5);

	//Player who is doing Honitsu starts discarding tiles of his own type => probably tenpai
	if ((isDoingHonitsu(player, 0) && discards[player].slice(10).filter(tile => tile.type == 0).length > 0)) {
		tenpaiChance *= 1 + (isDoingHonitsu(player, 0) / 1.5);
	}
	if ((isDoingHonitsu(player, 1) && discards[player].slice(10).filter(tile => tile.type == 1).length > 0)) {
		tenpaiChance *= 1 + (isDoingHonitsu(player, 1) / 1.5);
	}
	if ((isDoingHonitsu(player, 2) && discards[player].slice(10).filter(tile => tile.type == 2).length > 0)) {
		tenpaiChance *= 1 + (isDoingHonitsu(player, 2) / 1.5);
	}

	var room = getCurrentRoom();
	if (room < 5 && room > 0) { //Below Throne Room: Less likely to be tenpai
		tenpaiChance *= 1 - ((5 - room) * 0.1); //10% less likely for every rank lower than throne room to be tenpai
	}

	if (tenpaiChance > 1) {
		tenpaiChance = 1;
	}
	else if (tenpaiChance < 0) {
		tenpaiChance = 0;
	}

	return tenpaiChance;
}

//Returns a number from -1 (fold) to 1 (push).
function isPlayerPushing(player) {
	var lastDiscardSafety = playerDiscardSafetyList[player].slice(-3).filter(v => v >= 0); //Check safety of last three discards. If dangerous: Not folding.

	if (playerDiscardSafetyList[player].length < 3 || lastDiscardSafety.length == 0) {
		return 0;
	}

	var pushValue = -1 + (lastDiscardSafety.reduce((v1, v2) => v1 + (v2 * 20), 0) / lastDiscardSafety.length);
	if (pushValue > 1) {
		pushValue = 1;
	}
	return pushValue;
}

//Is the player doing any of the most common yaku?
function hasYaku(player) {
	return (isDoingHonitsu(player, 0) > 0 || isDoingHonitsu(player, 1) > 0 || isDoingHonitsu(player, 2) > 0 ||
		isDoingToiToi(player) > 0 || isDoingTanyao(player) > 0 || isDoingYakuhai(player) > 0);
}

//Return a confidence between 0 and 1 for how predictable the strategy of another player is (many calls -> very predictable)
function getConfidenceInYakuPrediction(player) {
	var confidence = Math.pow(parseInt(calls[player].length / 3), 2) / 10;
	if (confidence > 1) {
		confidence = 1;
	}
	return confidence;
}

//Returns a value between 0 and 1 for how likely the player could be doing honitsu
function isDoingHonitsu(player, type) {
	if (parseInt(calls[player].length) == 0 || calls[player].some(tile => tile.type != type && tile.type != 3)) { //Calls of different type -> false
		return 0;
	}
	if (parseInt(calls[player].length / 3) == 4) {
		return 1;
	}
	var percentageOfDiscards = discards[player].slice(0, 10).filter(tile => tile.type == type).length / discards[player].slice(0, 10).length;
	if (percentageOfDiscards > 0.2 || discards[player].slice(0, 10).length == 0) {
		return 0;
	}
	var confidence = (Math.pow(parseInt(calls[player].length / 3), 2) / 10) - percentageOfDiscards + 0.1;
	if (confidence > 1) {
		confidence = 1;
	}
	return confidence;
}

//Returns a value between 0 and 1 for how likely the player could be doing toitoi
function isDoingToiToi(player) {
	if (parseInt(calls[player].length) > 0 && getSequences(calls[player]).length == 0) { //Only triplets called
		return getConfidenceInYakuPrediction(player) - 0.1;
	}
	return 0;
}

//Returns a value between 0 and 1 for how likely the player could be doing tanyao
function isDoingTanyao(player) {
	if (parseInt(calls[player].length) > 0 && calls[player].filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length == 0 &&
		(discards[player].slice(0, 5).filter(tile => tile.type == 3 || tile.index == 1 || tile.index == 9).length / discards[player].slice(0, 5).length) >= 0.6) { //only inner tiles called and lots of terminal/honor discards
		return getConfidenceInYakuPrediction(player);
	}
	return 0;
}

//Returns how many Yakuhai the player has
function isDoingYakuhai(player) {
	var yakuhai = parseInt(calls[player].filter(tile => tile.type == 3 && (tile.index > 4 || tile.index == getSeatWind(player) || tile.index == roundWind)).length / 3);
	yakuhai += parseInt(calls[player].filter(tile => tile.type == 3 && tile.index == getSeatWind(player) && tile.index == roundWind).length / 3);
	return yakuhai;
}

//Returns a score how likely this tile can form the last triple/pair for a player
//Suji, Walls and general knowledge about remaining tiles.
//If "includeOthers" parameter is set to true it will also check if other players recently discarded relevant tiles
function getWaitScoreForTileAndPlayer(player, tile, includeOthers, useKnowledgeOfOwnHand = true) {
	var tile0 = getNumberOfTilesAvailable(tile.index, tile.type);
	var tile0Public = tile0 + getNumberOfTilesInTileArray(ownHand, tile.index, tile.type);
	if (!useKnowledgeOfOwnHand) {
		tile0 = tile0Public;
	}
	var furitenFactor = getFuritenValue(player, tile, includeOthers);

	if (furitenFactor == 0) {
		return 0;
	}

	//Less priority on Ryanmen and Bridge Wait when player is doing Toitoi
	var toitoiFactor = 1 - (isDoingToiToi(player) / 3);

	var score = 0;

	//Same tile
	score += tile0 * tile0Public * furitenFactor * 2 * (2 - toitoiFactor);

	if (getNumberOfTilesInHand(player) == 1 || tile.type == 3) {
		return score;
	}

	var tileL3Public = getNumberOfTilesAvailable(tile.index - 3, tile.type) + getNumberOfTilesInTileArray(ownHand, tile.index - 3, tile.type);
	var tileU3Public = getNumberOfTilesAvailable(tile.index + 3, tile.type) + getNumberOfTilesInTileArray(ownHand, tile.index + 3, tile.type);

	var tileL2 = getNumberOfTilesAvailable(tile.index - 2, tile.type);
	var tileL1 = getNumberOfTilesAvailable(tile.index - 1, tile.type);
	var tileU1 = getNumberOfTilesAvailable(tile.index + 1, tile.type);
	var tileU2 = getNumberOfTilesAvailable(tile.index + 2, tile.type);

	if (!useKnowledgeOfOwnHand) {
		tileL2 += getNumberOfTilesInTileArray(ownHand, tile.index - 2, tile.type);
		tileL1 += getNumberOfTilesInTileArray(ownHand, tile.index - 1, tile.type);
		tileU1 += getNumberOfTilesInTileArray(ownHand, tile.index + 1, tile.type);
		tileU2 += getNumberOfTilesInTileArray(ownHand, tile.index + 2, tile.type);
	}

	var furitenFactorL = getFuritenValue(player, { index: tile.index - 3, type: tile.type }, includeOthers);
	var furitenFactorU = getFuritenValue(player, { index: tile.index + 3, type: tile.type }, includeOthers);

	//Ryanmen Waits
	score += (tileL1 * tileL2) * (tile0Public + tileL3Public) * furitenFactorL * toitoiFactor;
	score += (tileU1 * tileU2) * (tile0Public + tileU3Public) * furitenFactorU * toitoiFactor;

	//Bridge Wait
	score += (tileL1 * tileU1 * tile0Public) * furitenFactor * toitoiFactor;

	return score;
}

//Returns 0 if tile is 100% furiten, 1 if not. Value between 0-1 is returned if furiten tile was not called some turns ago.
function getFuritenValue(player, tile, includeOthers) {
	var danger = getMostRecentDiscardDanger(tile, player, includeOthers);
	if (danger == 0) {
		return 0;
	}
	else if (danger == 1) {
		if (calls[player].length > 0) {
			return 0.5;
		}
		return 0.95;
	}
	else if (danger == 2) {
		if (calls[player].length > 0) {
			return 0.8;
		}
	}
	return 1;
}

//Sets tile safeties for discards
function updateDiscardedTilesSafety() {
	for (var k = 1; k < getNumberOfPlayers(); k++) { //For all other players
		for (var i = 0; i < getNumberOfPlayers(); i++) { //For all discard ponds
			for (var j = 0; j < discards[i].length; j++) { //For every tile in it
				if (typeof (discards[i][j].numberOfPlayerHandChanges) == 'undefined') {
					discards[i][j].numberOfPlayerHandChanges = [0, 0, 0, 0];
				}
				if (hasPlayerHandChanged(k)) {
					if (j == discards[i].length - 1 && k < i && (k <= seat2LocalPosition(getCurrentPlayer()) || seat2LocalPosition(getCurrentPlayer()) == 0)) { //Ignore tiles by players after hand change
						continue;
					}
					discards[i][j].numberOfPlayerHandChanges[k]++;
				}
			}
		}
		rememberPlayerHand(k);
	}
}

//Pretty simple (all 0), but should work in case of crash -> count intelligently upwards
function initialDiscardedTilesSafety() {
	for (var k = 1; k < getNumberOfPlayers(); k++) { //For all other players
		for (var i = 0; i < getNumberOfPlayers(); i++) { //For all discard ponds
			for (var j = 0; j < discards[i].length; j++) { //For every tile in it
				if (typeof (discards[i][j].numberOfPlayerHandChanges) == 'undefined') {
					discards[i][j].numberOfPlayerHandChanges = [0, 0, 0, 0];
				}
				var bonus = 0;
				if (k < i && (k <= seat2LocalPosition(getCurrentPlayer()) || seat2LocalPosition(getCurrentPlayer()) == 0)) {
					bonus = 1;
				}
				discards[i][j].numberOfPlayerHandChanges[k] = discards[i].length - j - bonus;
			}
		}
	}
}

//Returns a value which indicates how important it is to sakigiri the tile now
function getSakigiriValue(hand, tile) {
	var sakigiri = 0;
	for (let player = 1; player < getNumberOfPlayers(); player++) {
		if (discards[player].length < 3) { // Not many discards yet (very early) => ignore Sakigiri
			continue;
		}

		if (getExpectedDealInValue(player) > 150) { // Obviously don't sakigiri when the player could already be in tenpai
			continue;
		}

		if (isSafeTile(player, tile)) { // Tile is safe
			continue;
		}

		var safeTiles = 0;
		for (let t of hand) { // How many safe tiles do we currently have?
			if (isSafeTile(player, t)) {
				safeTiles++;
			}
		}

		var saki = (3 - safeTiles) * (SAKIGIRI * 4);
		if (saki <= 0) { // 3 or more safe tiles: Sakigiri not necessary
			continue;
		}

		if (getSeatWind(player) == 1) { // Player is dealer
			saki *= 1.5;
		}
		sakigiri += saki;
	}
	return sakigiri;
}

//Returns true when the given tile is safe for a given player
function isSafeTile(player, tile) {
	return getWaitScoreForTileAndPlayer(player, tile, false) < 20 || (tile.type == 3 && availableTiles.filter(t => isSameTile(t, tile)).length <= 2);
}

//Check if the tile is close to another tile
function isTileCloseToOtherTile(tile, otherTile) {
	if (tile.type != 3 && tile.type == otherTile.type) {
		return tile.index >= otherTile.index - 3 && tile.index <= otherTile.index + 3;
	}
}

//Check if the tile is close to dora
function isTileCloseToDora(tile) {
	for (let d of dora) {
		var doraIndex = getHigherTileIndex(d);
		if (tile.type == 3 && d.type == 3 && tile.index == doraIndex) {
			return true;
		}
		if (tile.type != 3 && tile.type == d.type && tile.index >= doraIndex - 2 && tile.index <= doraIndex + 2) {
			return true;
		}
	}
	return false;
}

//################################
// MAIN
// Main Class, starts the bot and sets up all necessary variables.
//################################

//GUI can be re-opened by pressing + on the Numpad
if (!isDebug()) {
	initGui();
	window.onkeyup = function (e) {
		var key = e.keyCode ? e.keyCode : e.which;

		if (key == 107 || key == 65) { // Numpad + Key
			toggleGui();
		}
	}

	if (AUTORUN) {
		log("Autorun start");
		run = true;
		setInterval(preventAFK, 30000);
	}

	log(`crt mode ${AIMODE_NAME[MODE]}`);

	waitForMainLobbyLoad();
}

function toggleRun() {
	clearCrtStrategyMsg();
	if (run) {
		log("AlphaJong deactivated!");
		run = false;
		startButton.innerHTML = "Start Bot";
	}
	else if (!run) {
		log("AlphaJong activated!");
		run = true;
		startButton.innerHTML = "Stop Bot";
		main();
	}
}

function waitForMainLobbyLoad() {
	if (isInGame()) { // In case game is already ongoing after reload
		refreshRoomSelection();
		main();
		return;
	}

	if (!hasFinishedMainLobbyLoading()) { //Otherwise wait for Main Lobby to load and then search for game
		log("Waiting for Main Lobby to load...");
		showCrtActionMsg("Wait for Loading.");
		setTimeout(waitForMainLobbyLoad, 2000);
		return;
	}
	log("Main Lobby loaded!");
	refreshRoomSelection();
	startGame();
	setTimeout(main, 10000);
	log("Main Loop started.");
}

//Main Loop
function main() {
	if (!run) {
		showCrtActionMsg("Bot is not running.");
		return;
	}
	if (!isInGame()) {
		checkForEnd();
		showCrtActionMsg("Waiting for Game to start.");
		log("Game is not running, sleep 2 seconds.");
		errorCounter++;
		if (errorCounter > 90 && AUTORUN) { //3 minutes no game found -> reload page
			goToLobby();
		}
		setTimeout(main, 2000); //Check every 2 seconds if ingame
		return;
	}

	if (isDisconnect()) {
		goToLobby();
	}

	var operations = getOperationList(); //Get possible Operations

	if (operations == null || operations.length == 0) {
		errorCounter++;
		if (getTilesLeft() == lastTilesLeft) { //1 minute no tile drawn
			if (errorCounter > 120) {
				goToLobby();
			}
		}
		else {
			lastTilesLeft = getTilesLeft();
			errorCounter = 0;
		}
		clearCrtStrategyMsg();
		showCrtActionMsg("Waiting for own turn.");
		setTimeout(main, 500);

		if (MODE === AIMODE.HELP) {
			oldOps = [];
		}
		return;
	}

	showCrtActionMsg("Calculating best move...");

	setTimeout(mainOwnTurn, 200 + (Math.random() * 200));
}

var oldOps = []
function recordPlayerOps() {
	oldOps = []

	let ops = getOperationList();
	for (let op of ops) {
		oldOps.push(op.type)
	}
}

function checkPlayerOpChanged() {
	let ops = getOperationList();
	if (ops.length !== oldOps.length) {
		return true;
	}

	for (let i = 0; i < ops.length; i++) {
		if (ops[i].type !== oldOps[i]) {
			return true;
		}
	}

	return false;
}

async function mainOwnTurn() {
	if (threadIsRunning) {
		return;
	}
	threadIsRunning = true;

	//HELP MODE, if player not operate, just skip
	if (MODE === AIMODE.HELP) {
		if (!checkPlayerOpChanged()) {
			setTimeout(main, 1000);
			threadIsRunning = false;
			return;
		} else {
			recordPlayerOps();
		}
	}

	setData(); //Set current state of the board to local variables

	var operations = getOperationList();

	log("##### OWN TURN #####");
	log("Debug String: " + getDebugString());
	if (getNumberOfPlayers() == 3) {
		log("Right Player Tenpai Chance: " + Number(isPlayerTenpai(1) * 100).toFixed(1) + "%, Expected Hand Value: " + Number(getExpectedHandValue(1).toFixed(0)));
		log("Left Player Tenpai Chance: " + Number(isPlayerTenpai(2) * 100).toFixed(1) + "%, Expected Hand Value: " + Number(getExpectedHandValue(2).toFixed(0)));
	}
	else {
		log("Shimocha Tenpai Chance: " + Number(isPlayerTenpai(1) * 100).toFixed(1) + "%, Expected Hand Value: " + Number(getExpectedHandValue(1).toFixed(0)));
		log("Toimen Tenpai Chance: " + Number(isPlayerTenpai(2) * 100).toFixed(1) + "%, Expected Hand Value: " + Number(getExpectedHandValue(2).toFixed(0)));
		log("Kamicha Tenpai Chance: " + Number(isPlayerTenpai(3) * 100).toFixed(1) + "%, Expected Hand Value: " + Number(getExpectedHandValue(3).toFixed(0)));
	}

	determineStrategy(); //Get the Strategy for the current situation. After calls so it does not reset folds

	isConsideringCall = true;
	for (let operation of operations) { //Priority Operations: Should be done before discard on own turn
		if (getOperationList().length == 0) {
			break;
		}
		switch (operation.type) {
			case getOperations().an_gang: //From Hand
				callAnkan(operation.combination);
				break;
			case getOperations().add_gang: //Add from Hand to Pon
				callShouminkan();
				break;
			case getOperations().zimo:
				callTsumo();
				break;
			case getOperations().rong:
				callRon();
				break;
			case getOperations().babei:
				if (callKita()) {
					threadIsRunning = false;
					setTimeout(main, 1000);
					return;
				}
				break;
			case getOperations().jiuzhongjiupai:
				callAbortiveDraw();
				break;
		}
	}

	for (let operation of operations) {
		if (getOperationList().length == 0) {
			break;
		}
		switch (operation.type) {
			case getOperations().dapai:
				isConsideringCall = false;
				await discard();
				break;
			case getOperations().eat:
				await callTriple(operation.combination, getOperations().eat);
				break;
			case getOperations().peng:
				await callTriple(operation.combination, getOperations().peng);
				break;
			case getOperations().ming_gang: //From others
				callDaiminkan();
				break;
		}
	}

	log(" ");

	if (MODE === AIMODE.AUTO) {
		showCrtActionMsg("Own turn completed.");
	}

	if ((getOverallTimeLeft() < 8 && getLastTurnTimeLeft() - getOverallTimeLeft() <= 0) || //Not much overall time left and last turn took longer than the 5 second increment
		(getOverallTimeLeft() < 4 && getLastTurnTimeLeft() - getOverallTimeLeft() <= 1)) {
		timeSave++;
		log("Low performance! Activating time save mode level: " + timeSave);
	}
	if (getOverallTimeLeft() > 15) { //Much time left (new round)
		timeSave = 0;
	}

	threadIsRunning = false;

	setTimeout(main, 1000);

}

//Set Data from real Game
function setData(mainUpdate = true) {

	dora = getDora();

	ownHand = [];
	for (let tile of getPlayerHand()) { //Get own Hand
		ownHand.push(tile.val);
		ownHand[ownHand.length - 1].valid = tile.valid; //Is valid discard
	}

	if (MARK_TSUMOGIRI) {
		for (var j = 1; j < getNumberOfPlayers(); j++) {
			if (getDiscardsOfPlayer(j).last_pai != null && getDiscardsOfPlayer(j).last_pai.val.tsumogiri) {
				getDiscardsOfPlayer(j).last_pai.GetDefaultColor = function () { return new Laya.Vector4(0.85, 0.85, 0.85, 1); }
				getDiscardsOfPlayer(j).last_pai.ResetShow();
			}
		}
	}

	discards = [];
	for (var j = 0; j < getNumberOfPlayers(); j++) { //Get Discards for all Players
		var temp_discards = [];
		for (var i = 0; i < getDiscardsOfPlayer(j).pais.length; i++) {
			temp_discards.push(getDiscardsOfPlayer(j).pais[i].val);
		}
		if (getDiscardsOfPlayer(j).last_pai != null) {
			temp_discards.push(getDiscardsOfPlayer(j).last_pai.val);
		}
		discards.push(temp_discards);
	}
	if (mainUpdate) {
		updateDiscardedTilesSafety();
	}

	calls = [];
	for (var j = 0; j < getNumberOfPlayers(); j++) { //Get Calls for all Players
		calls.push(getCallsOfPlayer(j));
	}

	isClosed = true;
	for (let tile of calls[0]) { //Is hand closed? Also consider closed Kans
		if (tile.from != localPosition2Seat(0)) {
			isClosed = false;
			break;
		}
	}
	if (tilesLeft < getTilesLeft()) { //Check if new round/reload
		if (MODE === AIMODE.AUTO) {
			setAutoCallWin(true);
		}
		strategy = STRATEGIES.GENERAL;
		strategyAllowsCalls = true;
		initialDiscardedTilesSafety();
		riichiTiles = [null, null, null, null];
		playerDiscardSafetyList = [[], [], [], []];
		extendMJSoulFunctions();
	}

	tilesLeft = getTilesLeft();

	if (!isDebug()) {
		seatWind = getSeatWind(0);
		roundWind = getRoundWind();
	}

	updateAvailableTiles();
}

//Search for Game
function startGame() {
	if (!isInGame() && run && AUTORUN) {
		log("Searching for Game in Room " + ROOM);
		showCrtActionMsg("Searching for Game...");
		searchForGame();
	}
}

//Check if End Screen is shown
function checkForEnd() {
	if (isEndscreenShown() && AUTORUN) {
		run = false;
		setTimeout(goToLobby, 25000);
	}
}

//Reload Page to get back to lobby
function goToLobby() {
	location.reload(1);
}