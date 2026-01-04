// ==UserScript==
// @name            Improved AWBW Music Player (BETA TESTING VERSION)
// @description     An improved version of the comprehensive audio player that attempts to recreate the cart experience with more sound effects, more music, and more customizability.
// @namespace       https://awbw.amarriner.com/
// @author          DeveloperJose, _twiggy
// @match           https://awbw.amarriner.com/*
// @icon            https://developerjose.netlify.app/img/music-player-icon.png
// @require         https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js
// @require         https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js
// @require         https://cdn.jsdelivr.net/npm/can-autoplay@3.0.2/build/can-autoplay.min.js
// @run-at          document-end
// @version         5.21.0
// @supportURL      https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @contributionURL https://ko-fi.com/developerjose
// @license         MIT
// @unwrap
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/523358/Improved%20AWBW%20Music%20Player%20%28BETA%20TESTING%20VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523358/Improved%20AWBW%20Music%20Player%20%28BETA%20TESTING%20VERSION%29.meta.js
// ==/UserScript==
var awbw_music_player = function(exports, canAutoplay2, SparkMD52) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = '/* This file is used to style the music player settings */\n\niframe {\n  border: none;\n}\n\n.cls-settings-menu {\n  display: none;\n  /* display: flex; */\n  left: 50%;\n  top: 40px;\n  flex-direction: column;\n  width: 750px;\n  border: black 1px solid;\n  z-index: 20;\n  text-align: center;\n  align-items: center;\n  font-family: "Nova Square", cursive !important;\n}\n\n.cls-settings-menu label {\n  background-color: white;\n  font-size: 12px;\n}\n\n.cls-settings-menu .cls-group-box > label {\n  width: 100%;\n  font-size: 13px;\n  background-color: #d6e0ed;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n\n.cls-settings-menu .cls-vertical-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n  position: relative;\n}\n\n.cls-settings-menu .cls-horizontal-box {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n  position: relative;\n}\n\n/* Puts the checkbox next to the label */\n.cls-settings-menu .cls-vertical-box[id$="options"] {\n  align-items: center;\n  align-self: center;\n}\n\n.cls-settings-menu .cls-vertical-box[id$="options"] .cls-horizontal-box {\n  width: 100%;\n  justify-content: center;\n}\n\n.cls-settings-menu .cls-vertical-box[id$="options"] .cls-horizontal-box input {\n  vertical-align: middle;\n}\n\n/* .cls-settings-menu .cls-vertical-box[id$="options"] .cls-horizontal-box label {\n  display: block;\n  padding-right: 10px;\n  padding-left: 22px;\n  text-indent: -22px;\n} */\n\n/* .cls-settings-menu .cls-horizontal-box[id$="random-themes"],\n.cls-settings-menu .cls-horizontal-box[id$="soundtrack"] {\n  justify-content: center;\n} */\n\n.cls-settings-menu-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  width: 100%;\n}\n\n.cls-settings-menu image {\n  vertical-align: middle;\n}\n\n.cls-settings-menu label[id$="version"] {\n  width: 100%;\n  font-size: 10px;\n  color: #888888;\n  background-color: #f0f0f0;\n}\n\n.cls-settings-menu a[id$="update"] {\n  font-size: 12px;\n  background-color: #ff0000;\n  color: white;\n  width: 100%;\n}\n.cls-settings-menu .co_caret {\n  position: absolute;\n  top: 28px;\n  left: 25px;\n  border: none;\n  z-index: 30;\n}\n\n.cls-settings-menu .co_portrait {\n  border-color: #009966;\n  z-index: 30;\n  border: 2px solid;\n  vertical-align: middle;\n  align-self: center;\n}\n\n.cls-settings-menu input[type="range"][id$="themes-start-on-day"] {\n  --c: rgb(168, 73, 208); /* active color */\n}\n/* \n * CSS Custom Range Slider\n * https://www.sitepoint.com/css-custom-range-slider/ \n */\n\n.cls-settings-menu input[type="range"] {\n  --c: rgb(53 57 60); /* active color */\n  --l: 15px; /* line thickness*/\n  --h: 30px; /* thumb height */\n  --w: 15px; /* thumb width */\n\n  width: 100%;\n  height: var(--h); /* needed for Firefox*/\n  --_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  background: none;\n  cursor: pointer;\n  overflow: hidden;\n  display: inline-block;\n}\n.cls-settings-menu input:focus-visible,\n.cls-settings-menu input:hover {\n  --p: 25%;\n}\n\n/* chromium */\n.cls-settings-menu input[type="range" i]::-webkit-slider-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n/* Firefox */\n.cls-settings-menu input[type="range"]::-moz-range-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n@supports not (color: color-mix(in srgb, red, red)) {\n  .cls-settings-menu input {\n    --_c: var(--c);\n  }\n}\n/*$vite$:1*/';
  document.head.appendChild(__vite_style__);
  function logInfo(message, ...args) {
    console.log("[AWBW Improved Music Player]", message, ...args);
  }
  function logError(message, ...args) {
    console.error("[AWBW Improved Music Player]", message, ...args);
  }
  function logDebug(message, ...args) {
    console.debug("[AWBW Improved Music Player]", message, ...args);
  }
  function debounce(ms, callback, immediate = false) {
    let timeout;
    return function(...args) {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) {
          callback.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      if (typeof timeout === "number") {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(later, ms);
      if (callNow) {
        callback.apply(context, args);
      }
    };
  }
  const IFRAME_ID = "music-player-iframe";
  const broadcastChannel = new BroadcastChannel("awbw-music-player");
  const initialPage = window.location.href;
  function isIFrameActive() {
    var _a;
    const iframe = document.getElementById(IFRAME_ID);
    if (!iframe) return false;
    const href = ((_a = iframe.contentDocument) == null ? void 0 : _a.location.href) ?? iframe.src;
    return href !== null && href !== "" && href !== "about:blank";
  }
  function getCurrentDocument() {
    if (!isIFrameActive()) return window.document;
    const iframe = document.getElementById(IFRAME_ID);
    return (iframe == null ? void 0 : iframe.contentDocument) ?? window.document;
  }
  function initializeIFrame(init_fn) {
    const hasFrame = document.getElementById(IFRAME_ID);
    if (hasFrame) return;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.id = IFRAME_ID;
    iframe.name = IFRAME_ID;
    document.body.appendChild(iframe);
    iframe.addEventListener("load", (event) => onIFrameLoad(event, init_fn));
    hijackLinks(window.document);
    init_fn();
    window.addEventListener("popstate", (event) => {
      const href = window.location.href;
      const iframe2 = document.getElementById(IFRAME_ID);
      if (!iframe2 || href.includes("game.php") || initialPage.includes("yourturn.php")) {
        window.location.reload();
        return;
      }
      iframe2.src = href;
      const state = event.state;
      if (!state || !state.scrollX || !state.scrollY) return;
      window.scrollTo(state.scrollX, state.scrollY);
    });
  }
  function onIFrameLoad(event, initFn) {
    const iframe = event.target;
    if (!iframe || !iframe.contentDocument) return;
    const href = iframe.contentDocument.location.href ?? iframe.src;
    if (href === null || href === "" || href === "about:blank") return;
    for (const child of Array.from(document.body.children)) {
      if (child === iframe) continue;
      if (child.id === "overDiv") continue;
      child.remove();
    }
    iframe.style.display = "block";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    if (document.body.parentElement) {
      document.body.parentElement.style.width = "100%";
      document.body.parentElement.style.height = "100%";
    }
    const state = { scrollX: window.scrollX, scrollY: window.scrollY };
    window.history.pushState(state, "", href);
    document.title = iframe.contentDocument.title;
    hijackLinks(iframe.contentDocument);
    initFn();
  }
  function hijackLinks(doc) {
    if (initialPage.includes("yourturn.php")) return;
    if (!doc) {
      logError("Could not find the document to hijack links.");
      return;
    }
    const links = doc.querySelectorAll("a");
    if (!links) {
      logError("Could not find any links to hijack.");
      return;
    }
    for (const link of Array.from(links)) {
      const isGamePageLink = link.href.includes("game.php") || link.classList.contains("anchor") && link.name.includes("game_");
      const isJSLink = link.href.startsWith("javascript:");
      const isOutsideLink = !link.href.includes("https://awbw") && !link.href.includes("http://awbw");
      if (link.target === "_blank") continue;
      else if (isJSLink) continue;
      else if (link.href === "") continue;
      else if (isOutsideLink) continue;
      else if (isGamePageLink) link.target = "_top";
      else link.target = IFRAME_ID;
    }
  }
  var PageType = /* @__PURE__ */ ((PageType2) => {
    PageType2["Maintenance"] = "Maintenance";
    PageType2["ActiveGame"] = "ActiveGame";
    PageType2["MapEditor"] = "MapEditor";
    PageType2["MovePlanner"] = "MovePlanner";
    PageType2["LiveQueue"] = "LiveQueue";
    PageType2["MainPage"] = "MainPage";
    PageType2["Default"] = "Default";
    return PageType2;
  })(PageType || {});
  function getCurrentPageType() {
    const doc = getCurrentDocument();
    const isMaintenance = doc.querySelector("#server-maintenance-alert") !== null;
    if (isMaintenance) return "Maintenance";
    if (doc.location.href.indexOf("game.php") > -1) return "ActiveGame";
    if (doc.location.href.indexOf("editmap.php?") > -1) return "MapEditor";
    if (doc.location.href.indexOf("moveplanner.php") > -1) return "MovePlanner";
    if (doc.location.href.indexOf("live_queue.php") > -1) return "LiveQueue";
    if (doc.location.href === "https://awbw.amarriner.com/") return "MainPage";
    return "Default";
  }
  function getCoordsDiv() {
    return getCurrentDocument().querySelector("#coords");
  }
  function getReplayControls() {
    return getCurrentDocument().querySelector(".replay-controls");
  }
  function getReplayOpenBtn() {
    return getCurrentDocument().querySelector(".replay-open");
  }
  function getReplayCloseBtn() {
    return getCurrentDocument().querySelector(".replay-close");
  }
  function getReplayForwardBtn() {
    return getCurrentDocument().querySelector(".replay-forward");
  }
  function getReplayForwardActionBtn() {
    return getCurrentDocument().querySelector(".replay-forward-action");
  }
  function getReplayBackwardBtn() {
    return getCurrentDocument().querySelector(".replay-backward");
  }
  function getReplayBackwardActionBtn() {
    return getCurrentDocument().querySelector(".replay-backward-action");
  }
  function getReplayDaySelectorCheckBox() {
    return getCurrentDocument().querySelector(".replay-day-selector");
  }
  function getConnectionErrorDiv() {
    return getCurrentDocument().querySelector(".connection-error-msg");
  }
  function getLiveQueueSelectPopup() {
    return getCurrentDocument().querySelector("#live-queue-select-popup");
  }
  function getLiveQueueBlockerPopup() {
    return getCurrentDocument().querySelector(".live-queue-blocker-popup");
  }
  function getAllDamageSquares() {
    return Array.from(getCurrentDocument().getElementsByClassName("dmg-square"));
  }
  function addUpdateCursorObserver(onCursorMove2) {
    const coordsDiv = getCoordsDiv();
    if (!coordsDiv) return;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        let coordsText = mutation.target.textContent;
        coordsText = coordsText.substring(1, coordsText.length - 1);
        const splitCoords = coordsText.split(",");
        const cursorX = Number(splitCoords[0]);
        const cursorY = Number(splitCoords[1]);
        onCursorMove2(cursorX, cursorY);
      }
    });
    observer.observe(coordsDiv, { childList: true });
  }
  const ORANGE_STAR_COs = /* @__PURE__ */ new Set(["andy", "max", "sami", "nell", "hachi", "jake", "rachel"]);
  const BLUE_MOON_COs = /* @__PURE__ */ new Set(["olaf", "grit", "colin", "sasha"]);
  const GREEN_EARTH_COs = /* @__PURE__ */ new Set(["eagle", "drake", "jess", "javier"]);
  const YELLOW_COMET_COs = /* @__PURE__ */ new Set(["kanbei", "sonja", "sensei", "grimm"]);
  const BLACK_HOLE_COs = /* @__PURE__ */ new Set(["flak", "lash", "adder", "hawke", "sturm", "jugger", "koal", "kindle", "vonbolt"]);
  const AW_DS_ONLY_COs = /* @__PURE__ */ new Set([
    "jake",
    "rachel",
    "sasha",
    "javier",
    "grimm",
    "kindle",
    "jugger",
    "koal",
    "vonbolt"
  ]);
  function getAllCONames(properCase = false) {
    if (!properCase)
      return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    const allCOs = [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    allCOs[allCOs.indexOf("vonbolt")] = "Von Bolt";
    return allCOs.map((co) => co[0].toUpperCase() + co.slice(1));
  }
  function areAnimationsEnabled() {
    return typeof gameAnims !== "undefined" ? gameAnims : false;
  }
  function isBlackHoleCO(coName) {
    coName = coName.toLowerCase().replaceAll(" ", "");
    return BLACK_HOLE_COs.has(coName);
  }
  function getRandomCO(excludedCOs) {
    const COs = new Set(getAllCONames());
    for (const co of excludedCOs) COs.delete(co);
    if (COs.size === 0) return "map-editor";
    if (COs.size === 1) return [...COs][0];
    return [...COs][Math.floor(Math.random() * COs.size)];
  }
  var SpecialCOs = /* @__PURE__ */ ((SpecialCOs2) => {
    SpecialCOs2["Maintenance"] = "maintenance";
    SpecialCOs2["MapEditor"] = "map-editor";
    SpecialCOs2["MainPage"] = "main-page";
    SpecialCOs2["LiveQueue"] = "live-queue";
    SpecialCOs2["Default"] = "default";
    SpecialCOs2["Victory"] = "victory";
    SpecialCOs2["Defeat"] = "defeat";
    SpecialCOs2["COSelect"] = "co-select";
    SpecialCOs2["ModeSelect"] = "mode-select";
    return SpecialCOs2;
  })(SpecialCOs || {});
  var COPowerEnum = /* @__PURE__ */ ((COPowerEnum2) => {
    COPowerEnum2["NoPower"] = "N";
    COPowerEnum2["COPower"] = "Y";
    COPowerEnum2["SuperCOPower"] = "S";
    return COPowerEnum2;
  })(COPowerEnum || {});
  const siloDelayMS = areAnimationsEnabled() ? 3e3 : 0;
  const attackDelayMS = areAnimationsEnabled() ? 1e3 : 0;
  function getMyUsername() {
    const document2 = getCurrentDocument();
    const profileMenu = document2.querySelector("#profile-menu");
    if (!profileMenu) return null;
    const link = profileMenu.getElementsByClassName("dropdown-menu-link")[0];
    return link.href.split("username=")[1];
  }
  let myID = -1;
  function getMyID() {
    if (getCurrentPageType() !== PageType.ActiveGame) return -1;
    if (myID < 0) {
      getAllPlayersInfo().forEach((entry) => {
        if (entry.users_username === getMyUsername()) {
          myID = entry.players_id;
        }
      });
    }
    return myID;
  }
  function getPlayerInfo(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof playersInfo === "undefined") return null;
    return playersInfo[pid];
  }
  function getAllPlayersInfo() {
    if (getCurrentPageType() !== PageType.ActiveGame) return [];
    if (typeof playersInfo === "undefined") return [];
    return Object.values(playersInfo);
  }
  function isPlayerSpectator(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    if (typeof playerKeys === "undefined") return false;
    return !playerKeys.includes(pid);
  }
  function canPlayerActivateCOPower(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    const info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_power;
  }
  function canPlayerActivateSuperCOPower(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    const info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_spower;
  }
  function isReplayActive() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    const replayControls = getReplayControls();
    if (!replayControls) return false;
    const replayOpen = replayControls.style.display !== "none";
    return replayOpen && Object.keys(replay).length > 0;
  }
  function hasGameEnded() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    if (typeof playersInfo === "undefined") return false;
    const numberOfRemainingPlayers = Object.values(playersInfo).filter((info) => info.players_eliminated === "N").length;
    return numberOfRemainingPlayers === 1;
  }
  function getCOImagePrefix() {
    if (typeof coTheme === "undefined") return "aw2";
    return coTheme;
  }
  function getServerTimeZone() {
    if (getCurrentPageType() !== PageType.ActiveGame) return "-05:00";
    if (typeof serverTimezone === "undefined") return "-05:00";
    if (!serverTimezone) return "-05:00";
    return serverTimezone;
  }
  function didGameEndToday() {
    if (!hasGameEnded()) return false;
    const serverTimezone2 = parseInt(getServerTimeZone());
    const endDate = new Date(gameEndDate);
    endDate.setHours(23, 59, 59);
    const now = /* @__PURE__ */ new Date();
    const timezoneOffset = now.getTimezoneOffset() / 60;
    const difference = +serverTimezone2 + timezoneOffset;
    const nowAdjustedToServer = new Date(now.getTime() + difference * 36e5);
    const endDateAdjustedToServer = new Date(endDate.getTime() + difference * 36e5);
    const oneDayMilliseconds = 24 * 60 * 60 * 1e3;
    return nowAdjustedToServer.getTime() - endDateAdjustedToServer.getTime() < oneDayMilliseconds;
  }
  function getCurrentGameDay() {
    if (getCurrentPageType() !== PageType.ActiveGame) return 1;
    if (typeof gameDay === "undefined") return 1;
    if (!isReplayActive()) return gameDay;
    const replayData = Object.values(replay);
    if (replayData.length === 0) return gameDay;
    const lastData = replayData[replayData.length - 1];
    if (typeof lastData === "undefined") return gameDay;
    if (typeof lastData.day === "undefined") return gameDay;
    return lastData.day;
  }
  class currentPlayer {
    /**
     * Get the internal info object containing the state of the current player.
     */
    static get info() {
      if (getCurrentPageType() !== PageType.ActiveGame) return null;
      if (typeof currentTurn === "undefined") return null;
      return getPlayerInfo(currentTurn);
    }
    /**
     * Determine whether a CO Power or Super CO Power is activated for the current player.
     * @returns - True if a regular CO power or a Super CO Power is activated.
     */
    static get isPowerActivated() {
      if (getCurrentPageType() !== PageType.ActiveGame) return false;
      return (this == null ? void 0 : this.coPowerState) !== "N";
    }
    /**
     * Gets state of the CO Power for the current player represented as a single letter.
     * @returns - The state of the CO Power for the current player.
     */
    static get coPowerState() {
      var _a;
      if (getCurrentPageType() !== PageType.ActiveGame) return "N";
      return (_a = this.info) == null ? void 0 : _a.players_co_power_on;
    }
    /**
     * Determine if the current player has been eliminated from the game.
     * @returns - True if the current player has been eliminated.
     */
    static get isEliminated() {
      var _a;
      if (getCurrentPageType() !== PageType.ActiveGame) return false;
      return ((_a = this.info) == null ? void 0 : _a.players_eliminated) === "Y";
    }
    /**
     * Gets the name of the CO for the current player.
     * If the game has ended, it will return "victory" or "defeat".
     * If we are in the map editor, it will return "map-editor".
     * @returns - The name of the CO for the current player.
     */
    static get coName() {
      var _a;
      if (getCurrentPageType() !== PageType.ActiveGame) return null;
      const myID2 = getMyID();
      const myInfo = getPlayerInfo(myID2);
      const myWin = (myInfo == null ? void 0 : myInfo.players_eliminated) === "N";
      const myLoss = (myInfo == null ? void 0 : myInfo.players_eliminated) === "Y";
      const endedToday = didGameEndToday();
      const isSpectator = isPlayerSpectator(myID2);
      const endGameTheme = isSpectator || myWin ? "victory" : "defeat";
      if (hasGameEnded()) {
        if (endedToday) return endGameTheme;
        if (!isReplayActive()) return "co-select";
        return endGameTheme;
      }
      if (myLoss) return "defeat";
      return (_a = this.info) == null ? void 0 : _a.co_name;
    }
  }
  function getAllPlayingCONames() {
    if (getCurrentPageType() === PageType.MapEditor) return /* @__PURE__ */ new Set(["map-editor"]);
    if (getCurrentPageType() !== PageType.ActiveGame) return /* @__PURE__ */ new Set();
    const allPlayers = new Set(getAllPlayersInfo().map((info) => info.co_name));
    const allTagPlayers = getAllTagCONames();
    return /* @__PURE__ */ new Set([...allPlayers, ...allTagPlayers]);
  }
  function isTagGame() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    return typeof tagsInfo !== "undefined" && tagsInfo;
  }
  function getAllTagCONames() {
    if (getCurrentPageType() !== PageType.ActiveGame || !isTagGame()) return /* @__PURE__ */ new Set();
    if (typeof tagsInfo === "undefined") return /* @__PURE__ */ new Set();
    return new Set(Object.values(tagsInfo).map((tag) => tag.co_name));
  }
  function getUnitInfo(unitId) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof unitsInfo === "undefined") return null;
    return unitsInfo[unitId];
  }
  function getUnitName(unitId) {
    var _a;
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    return (_a = getUnitInfo(unitId)) == null ? void 0 : _a.units_name;
  }
  function getUnitInfoFromCoords(x, y) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof unitsInfo === "undefined") return null;
    return Object.values(unitsInfo).filter((info) => info.units_x == x && info.units_y == y).pop();
  }
  function isValidUnit(unitId) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    if (typeof unitsInfo === "undefined") return false;
    return unitId !== void 0 && unitsInfo[unitId] !== void 0;
  }
  function hasUnitMovedThisTurn(unitId) {
    var _a;
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    return isValidUnit(unitId) && ((_a = getUnitInfo(unitId)) == null ? void 0 : _a.units_moved) === 1;
  }
  function addConnectionErrorObserver(onConnectionError2) {
    const connectionErrorDiv = getConnectionErrorDiv();
    if (!connectionErrorDiv) return;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        const closeMsg = mutation.target.textContent;
        onConnectionError2(closeMsg);
      }
    });
    observer.observe(connectionErrorDiv, { childList: true });
  }
  var GameType = /* @__PURE__ */ ((GameType2) => {
    GameType2["AW1"] = "AW1";
    GameType2["AW2"] = "AW2";
    GameType2["RBC"] = "RBC";
    GameType2["DS"] = "DS";
    return GameType2;
  })(GameType || {});
  var ThemeType = /* @__PURE__ */ ((ThemeType2) => {
    ThemeType2["REGULAR"] = "REGULAR";
    ThemeType2["CO_POWER"] = "CO_POWER";
    ThemeType2["SUPER_CO_POWER"] = "SUPER_CO_POWER";
    return ThemeType2;
  })(ThemeType || {});
  var RandomThemeType = /* @__PURE__ */ ((RandomThemeType2) => {
    RandomThemeType2["NONE"] = "NONE";
    RandomThemeType2["ALL_THEMES"] = "ALL_THEMES";
    RandomThemeType2["CURRENT_SOUNDTRACK"] = "CURRENT_SOUNDTRACK";
    return RandomThemeType2;
  })(RandomThemeType || {});
  function getCurrentThemeType() {
    const currentPowerState = currentPlayer == null ? void 0 : currentPlayer.coPowerState;
    if (currentPowerState === "Y") return "CO_POWER";
    if (currentPowerState === "S") return "SUPER_CO_POWER";
    return "REGULAR";
  }
  function getRandomGameType(excludedGameTypes = /* @__PURE__ */ new Set()) {
    const gameTypes = Object.values(GameType).filter((gameType) => !excludedGameTypes.has(gameType));
    return gameTypes[Math.floor(Math.random() * gameTypes.length)];
  }
  const STORAGE_KEY = "musicPlayerSettings";
  const onSettingsChangeListeners = [];
  function addSettingsChangeListener(fn) {
    onSettingsChangeListeners.push(fn);
  }
  var SettingsKey = /* @__PURE__ */ ((SettingsKey2) => {
    SettingsKey2["IS_PLAYING"] = "isPlaying";
    SettingsKey2["VOLUME"] = "volume";
    SettingsKey2["SFX_VOLUME"] = "sfxVolume";
    SettingsKey2["UI_VOLUME"] = "uiVolume";
    SettingsKey2["GAME_TYPE"] = "gameType";
    SettingsKey2["ALTERNATE_THEMES"] = "alternateThemes";
    SettingsKey2["ALTERNATE_THEME_DAY"] = "alternateThemeDay";
    SettingsKey2["RANDOM_THEMES_TYPE"] = "randomThemesType";
    SettingsKey2["CAPTURE_PROGRESS_SFX"] = "captureProgressSFX";
    SettingsKey2["PIPE_SEAM_SFX"] = "pipeSeamSFX";
    SettingsKey2["OVERRIDE_LIST"] = "overrideList";
    SettingsKey2["RESTART_THEMES"] = "restartThemes";
    SettingsKey2["AUTOPLAY_ON_OTHER_PAGES"] = "autoplayOnOtherPages";
    SettingsKey2["EXCLUDED_RANDOM_THEMES"] = "excludedRandomThemes";
    SettingsKey2["LOOP_RANDOM_SONGS_UNTIL_TURN_CHANGE"] = "loopRandomSongsUntilTurnChange";
    SettingsKey2["SFX_ON_OTHER_PAGES"] = "sfxOnOtherPages";
    SettingsKey2["SEAMLESS_LOOPS_IN_MIRRORS"] = "seamlessLoopsInMirrors";
    SettingsKey2["PLAY_INTRO_EVERY_TURN"] = "playIntroEveryTurn";
    SettingsKey2["THEME_TYPE"] = "themeType";
    SettingsKey2["CURRENT_RANDOM_CO"] = "currentRandomCO";
    SettingsKey2["ALL"] = "all";
    SettingsKey2["ADD_OVERRIDE"] = "addOverride";
    SettingsKey2["REMOVE_OVERRIDE"] = "removeOverride";
    SettingsKey2["ADD_EXCLUDED"] = "addExcluded";
    SettingsKey2["REMOVE_EXCLUDED"] = "removeExcluded";
    return SettingsKey2;
  })(SettingsKey || {});
  class musicSettings {
    static toJSON() {
      return JSON.stringify({
        isPlaying: this.__isPlaying,
        volume: this.__volume,
        sfxVolume: this.__sfxVolume,
        uiVolume: this.__uiVolume,
        gameType: this.__gameType,
        alternateThemes: this.__alternateThemes,
        alternateThemeDay: this.__alternateThemeDay,
        randomThemesType: this.__randomThemesType,
        captureProgressSFX: this.__captureProgressSFX,
        pipeSeamSFX: this.__pipeSeamSFX,
        overrideList: Array.from(this.__overrideList.entries()),
        restartThemes: this.__restartThemes,
        autoplayOnOtherPages: this.__autoplayOnOtherPages,
        excludedRandomThemes: Array.from(this.__excludedRandomThemes),
        loopRandomSongsUntilTurnChange: this.__loopRandomSongsUntilTurnChange,
        sfxOnOtherPages: this.__sfxOnOtherPages,
        seamlessLoopsInMirrors: this.__seamlessLoopsInMirrors,
        playIntroEveryTurn: this.__playIntroEveryTurn
      });
    }
    static runWithoutSavingSettings(fn) {
      this.isLoaded = false;
      this.saveChanges = false;
      fn();
      this.isLoaded = true;
      this.saveChanges = true;
    }
    static fromJSON(json) {
      const savedSettings = JSON.parse(json);
      for (const key in this) {
        if (!key.startsWith("__")) continue;
        if (key.startsWith("___")) continue;
        const key_sub = key.substring(2);
        if (Object.hasOwn(savedSettings, key_sub)) {
          if (key_sub === "overrideList") {
            this.__overrideList = new Map(savedSettings[key_sub]);
            continue;
          }
          if (key_sub === "excludedRandomThemes") {
            this.__excludedRandomThemes = new Set(savedSettings[key_sub]);
            continue;
          }
          this[key_sub] = savedSettings[key_sub];
        } else {
          logDebug("Tried to load an invalid settings key:", key);
        }
      }
      this.isLoaded = true;
      broadcastChannel.addEventListener("message", onStorageBroadcast);
    }
    static set isPlaying(val) {
      if (this.__isPlaying === val) return;
      this.__isPlaying = val;
      this.onSettingChangeEvent("isPlaying", val);
    }
    static get isPlaying() {
      return this.__isPlaying;
    }
    static set volume(val) {
      if (this.__volume === val) return;
      this.__volume = val;
      this.onSettingChangeEvent("volume", val);
    }
    static get volume() {
      return this.__volume;
    }
    static set sfxVolume(val) {
      if (this.__sfxVolume === val) return;
      this.__sfxVolume = val;
      this.onSettingChangeEvent("sfxVolume", val);
    }
    static get sfxVolume() {
      return this.__sfxVolume;
    }
    static set uiVolume(val) {
      if (this.__uiVolume === val) return;
      this.__uiVolume = val;
      this.onSettingChangeEvent("uiVolume", val);
    }
    static get uiVolume() {
      return this.__uiVolume;
    }
    static set gameType(val) {
      if (this.__gameType === val) return;
      this.__gameType = val;
      this.___currentRandomGameType = val;
      this.onSettingChangeEvent("gameType", val);
    }
    static get gameType() {
      return this.__gameType;
    }
    static set alternateThemes(val) {
      if (this.__alternateThemes === val) return;
      this.__alternateThemes = val;
      this.onSettingChangeEvent("alternateThemes", val);
    }
    static get alternateThemes() {
      return this.__alternateThemes;
    }
    static set alternateThemeDay(val) {
      if (this.__alternateThemeDay === val) return;
      this.__alternateThemeDay = val;
      this.onSettingChangeEvent("alternateThemeDay", val);
    }
    static get alternateThemeDay() {
      return this.__alternateThemeDay;
    }
    static set captureProgressSFX(val) {
      this.__captureProgressSFX = val;
      this.onSettingChangeEvent("captureProgressSFX", val);
    }
    static get captureProgressSFX() {
      return this.__captureProgressSFX;
    }
    static set pipeSeamSFX(val) {
      this.__pipeSeamSFX = val;
      this.onSettingChangeEvent("pipeSeamSFX", val);
    }
    static get pipeSeamSFX() {
      return this.__pipeSeamSFX;
    }
    static set overrideList(val) {
      this.__overrideList = new Map([...val.entries()].sort());
      this.onSettingChangeEvent("overrideList", val);
    }
    static get overrideList() {
      return this.__overrideList;
    }
    static addOverride(coName, gameType) {
      this.__overrideList.set(coName, gameType);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent("addOverride", [coName, gameType]);
    }
    static removeOverride(coName) {
      if (!this.__overrideList.has(coName)) return;
      this.__overrideList.delete(coName);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent("removeOverride", coName);
    }
    static getOverride(coName) {
      return this.__overrideList.get(coName);
    }
    static get restartThemes() {
      return this.__restartThemes;
    }
    static set restartThemes(val) {
      if (this.__restartThemes === val) return;
      this.__restartThemes = val;
      this.onSettingChangeEvent("restartThemes", val);
    }
    static get autoplayOnOtherPages() {
      return this.__autoplayOnOtherPages;
    }
    static set autoplayOnOtherPages(val) {
      if (this.__autoplayOnOtherPages === val) return;
      this.__autoplayOnOtherPages = val;
      this.onSettingChangeEvent("autoplayOnOtherPages", val);
    }
    static get excludedRandomThemes() {
      return this.__excludedRandomThemes;
    }
    static set excludedRandomThemes(val) {
      this.__excludedRandomThemes = val;
      this.onSettingChangeEvent("excludedRandomThemes", val);
    }
    static addExcludedRandomTheme(theme) {
      this.__excludedRandomThemes.add(theme);
      this.onSettingChangeEvent("addExcluded", theme);
    }
    static removeExcludedRandomTheme(theme) {
      if (!this.__excludedRandomThemes.has(theme)) return;
      this.__excludedRandomThemes.delete(theme);
      this.onSettingChangeEvent("removeExcluded", theme);
    }
    static get loopRandomSongsUntilTurnChange() {
      return this.__loopRandomSongsUntilTurnChange;
    }
    static set loopRandomSongsUntilTurnChange(val) {
      if (this.__loopRandomSongsUntilTurnChange === val) return;
      this.__loopRandomSongsUntilTurnChange = val;
      this.onSettingChangeEvent("loopRandomSongsUntilTurnChange", val);
    }
    static get sfxOnOtherPages() {
      return this.__sfxOnOtherPages;
    }
    static set sfxOnOtherPages(val) {
      if (this.__sfxOnOtherPages === val) return;
      this.__sfxOnOtherPages = val;
      this.onSettingChangeEvent("sfxOnOtherPages", val);
    }
    static get seamlessLoopsInMirrors() {
      return this.__seamlessLoopsInMirrors;
    }
    static set seamlessLoopsInMirrors(val) {
      if (this.__seamlessLoopsInMirrors === val) return;
      this.__seamlessLoopsInMirrors = val;
      this.onSettingChangeEvent("seamlessLoopsInMirrors", val);
    }
    static get playIntroEveryTurn() {
      return this.__playIntroEveryTurn;
    }
    static set playIntroEveryTurn(val) {
      if (this.__playIntroEveryTurn === val) return;
      this.__playIntroEveryTurn = val;
      this.onSettingChangeEvent("playIntroEveryTurn", val);
    }
    // ************* Non-user configurable settings from here on
    static set themeType(val) {
      if (this.___themeType === val) return;
      this.___themeType = val;
      this.onSettingChangeEvent("themeType", val);
    }
    static get themeType() {
      return this.___themeType;
    }
    static set randomThemesType(val) {
      if (this.__randomThemesType === val) return;
      this.__randomThemesType = val;
      this.onSettingChangeEvent("randomThemesType", val);
    }
    static get randomThemesType() {
      return this.__randomThemesType;
    }
    static get currentRandomCO() {
      if (!this.___currentRandomCO || this.___currentRandomCO == "") this.randomizeCO();
      return this.___currentRandomCO;
    }
    static get currentRandomGameType() {
      return this.___currentRandomGameType;
    }
    static randomizeCO() {
      const excludedCOs = /* @__PURE__ */ new Set([...this.__excludedRandomThemes, this.___currentRandomCO]);
      this.___currentRandomCO = getRandomCO(excludedCOs);
      this.___currentRandomGameType = getRandomGameType();
      this.onSettingChangeEvent("currentRandomCO", null);
    }
    static onSettingChangeEvent(key, value) {
      onSettingsChangeListeners.forEach((fn) => fn(key, value, !this.isLoaded));
    }
  }
  // User configurable settings
  __publicField(musicSettings, "__isPlaying", false);
  __publicField(musicSettings, "__volume", 0.5);
  __publicField(musicSettings, "__sfxVolume", 0.4);
  __publicField(musicSettings, "__uiVolume", 0.4);
  __publicField(musicSettings, "__gameType", "DS");
  __publicField(musicSettings, "__alternateThemes", true);
  __publicField(musicSettings, "__alternateThemeDay", 15);
  __publicField(musicSettings, "__randomThemesType", "NONE");
  __publicField(musicSettings, "__captureProgressSFX", true);
  __publicField(musicSettings, "__pipeSeamSFX", true);
  __publicField(musicSettings, "__overrideList", /* @__PURE__ */ new Map());
  __publicField(musicSettings, "__restartThemes", false);
  __publicField(musicSettings, "__autoplayOnOtherPages", true);
  __publicField(musicSettings, "__excludedRandomThemes", /* @__PURE__ */ new Set());
  __publicField(musicSettings, "__loopRandomSongsUntilTurnChange", false);
  __publicField(musicSettings, "__sfxOnOtherPages", true);
  __publicField(musicSettings, "__seamlessLoopsInMirrors", true);
  __publicField(musicSettings, "__playIntroEveryTurn", false);
  // Non-user configurable settings
  __publicField(musicSettings, "___themeType", "REGULAR");
  __publicField(musicSettings, "___currentRandomCO", "");
  __publicField(musicSettings, "___currentRandomGameType", "DS");
  __publicField(musicSettings, "isLoaded", false);
  __publicField(musicSettings, "saveChanges", false);
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    if (!storageData || storageData === "undefined") {
      logInfo("No saved settings found, storing defaults");
      const jsonSettings = __updateSettingsInLocalStorage();
      storageData = localStorage.getItem(STORAGE_KEY);
      if (!storageData) {
        logError("Possibly failed to store default settings in local storage");
        storageData = jsonSettings;
      }
    }
    musicSettings.fromJSON(storageData);
    onSettingsChangeListeners.forEach((fn) => fn("all", null, true));
    logDebug("Settings loaded from storage:", storageData);
    addSettingsChangeListener(onSettingsChange$2);
  }
  function allowSettingsToBeSaved() {
    musicSettings.saveChanges = true;
  }
  function onSettingsChange$2(key, value, _isFirstLoad) {
    if (key === "themeType" || key === "currentRandomCO") return;
    if (!musicSettings.saveChanges) return;
    updateSettingsInLocalStorage();
    broadcastChannel.postMessage({ type: "settings", key, value });
  }
  const updateSettingsInLocalStorage = debounce(500, __updateSettingsInLocalStorage);
  function __updateSettingsInLocalStorage() {
    const jsonSettings = musicSettings.toJSON();
    localStorage.setItem(STORAGE_KEY, jsonSettings);
    logDebug("Saving settings...", jsonSettings);
    return jsonSettings;
  }
  function onStorageBroadcast(event) {
    if (event.data.type !== "settings") return;
    const key = event.data.key;
    const value = event.data.value;
    logDebug("Received settings change:", key, value);
    musicSettings.runWithoutSavingSettings(() => {
      switch (key) {
        case "volume":
          musicSettings.volume = value;
          break;
        case "sfxVolume":
          musicSettings.sfxVolume = value;
          break;
        case "uiVolume":
          musicSettings.uiVolume = value;
          break;
        case "themeType":
          musicSettings.themeType = value;
          break;
        case "gameType":
          musicSettings.gameType = value;
          break;
        case "alternateThemes":
          musicSettings.alternateThemes = value;
          break;
        case "alternateThemeDay":
          musicSettings.alternateThemeDay = value;
          break;
        case "randomThemesType":
          musicSettings.randomThemesType = value;
          break;
        case "captureProgressSFX":
          musicSettings.captureProgressSFX = value;
          break;
        case "pipeSeamSFX":
          musicSettings.pipeSeamSFX = value;
          break;
        case "restartThemes":
          musicSettings.restartThemes = value;
          break;
        case "autoplayOnOtherPages":
          musicSettings.autoplayOnOtherPages = value;
          break;
        case "addOverride":
          musicSettings.addOverride(value[0], value[1]);
          break;
        case "removeOverride":
          musicSettings.removeOverride(value);
          break;
        case "addExcluded":
          musicSettings.addExcludedRandomTheme(value);
          break;
        case "removeExcluded":
          musicSettings.removeExcludedRandomTheme(value);
          break;
        case "loopRandomSongsUntilTurnChange":
          musicSettings.loopRandomSongsUntilTurnChange = value;
          break;
        case "sfxOnOtherPages":
          musicSettings.sfxOnOtherPages = value;
          break;
        case "seamlessLoopsInMirrors":
          musicSettings.seamlessLoopsInMirrors = value;
          break;
        case "playIntroEveryTurn":
          musicSettings.playIntroEveryTurn = value;
          break;
        case "isPlaying":
        case "overrideList":
        case "excludedRandomThemes":
        case "all":
        case "currentRandomCO":
          break;
        default:
          logError("Forgot to handle a settings key:", key);
      }
    });
  }
  var ScriptName = /* @__PURE__ */ ((ScriptName2) => {
    ScriptName2["None"] = "none";
    ScriptName2["MusicPlayer"] = "music_player";
    ScriptName2["HighlightCursorCoordinates"] = "highlight_cursor_coordinates";
    return ScriptName2;
  })(ScriptName || {});
  const versions = /* @__PURE__ */ new Map([
    ["music_player", "5.21.0"],
    ["highlight_cursor_coordinates", "2.3.0"]
  ]);
  const updateURLs = /* @__PURE__ */ new Map([
    ["music_player", "https://update.greasyfork.org/scripts/518170/Improved%20AWBW%20Music%20Player.meta.js"],
    [
      "highlight_cursor_coordinates",
      "https://update.greasyfork.org/scripts/520884/AWBW%20Highlight%20Cursor%20Coordinates.meta.js"
    ]
  ]);
  const homepageURLs = /* @__PURE__ */ new Map([
    ["music_player", "https://greasyfork.org/en/scripts/518170-improved-awbw-music-player"],
    ["highlight_cursor_coordinates", "https://greasyfork.org/en/scripts/520884-awbw-highlight-cursor-coordinates"]
  ]);
  function checkIfUpdateIsAvailable(scriptName) {
    const isGreater = (a, b) => {
      return a.localeCompare(b, void 0, { numeric: true }) === 1;
    };
    return new Promise((resolve, reject) => {
      const updateURL = updateURLs.get(scriptName);
      if (!updateURL) return reject(`Failed to get the update URL for the script.`);
      return fetch(updateURL).then((response) => response.text()).then((text) => {
        var _a;
        if (!text) return reject(`Failed to get the HTML from the update URL for the script.`);
        const latestVersion = (_a = text.match(/@version\s+([0-9.]+)/)) == null ? void 0 : _a[1];
        if (!latestVersion) return reject(`Failed to get the latest version of the script.`);
        const currentVersion = versions.get(scriptName);
        if (!currentVersion) return reject(`Failed to get the current version of the script.`);
        const currentVersionParts = currentVersion.split(".");
        const latestVersionParts = latestVersion.split(".");
        const hasThreeParts = currentVersionParts.length === 3 && latestVersionParts.length === 3;
        if (!hasThreeParts) return reject(`The version number of the script is not in the correct format.`);
        const isUpdateAvailable = isGreater(latestVersion, currentVersion);
        logDebug(`Current version: ${currentVersion}, latest: ${latestVersion}, update needed: ${isUpdateAvailable}`);
        return resolve(isUpdateAvailable);
      }).catch((reason) => reject(reason));
    });
  }
  var GroupType = /* @__PURE__ */ ((GroupType2) => {
    GroupType2["Vertical"] = "cls-vertical-box";
    GroupType2["Horizontal"] = "cls-horizontal-box";
    return GroupType2;
  })(GroupType || {});
  function sanitize(str) {
    return str.toLowerCase().replaceAll(" ", "-");
  }
  var NodeID = /* @__PURE__ */ ((NodeID2) => {
    NodeID2["Parent"] = "parent";
    NodeID2["Hover"] = "hover";
    NodeID2["Background"] = "background";
    NodeID2["ProgressFill"] = "progress-fill";
    NodeID2["Button_Image"] = "button-image";
    NodeID2["Settings"] = "settings";
    NodeID2["Settings_Left"] = "settings-left";
    NodeID2["Settings_Center"] = "settings-center";
    NodeID2["Settings_Right"] = "settings-right";
    NodeID2["Version"] = "version";
    NodeID2["CO_Selector"] = "co-selector";
    NodeID2["CO_Portrait"] = "co-portrait";
    return NodeID2;
  })(NodeID || {});
  class CustomMenuSettingsUI {
    /**
     * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
     * @param prefix - A string used to prefix the IDs of the elements in the menu.
     * @param buttonImageURL - The URL of the image to be used as the button.
     * @param hoverText - The text to be displayed when hovering over the button.
     */
    constructor(prefix, buttonImageURL, hoverText = "") {
      /**
       * The root element or parent of the custom menu.
       */
      __publicField(this, "parent");
      /**
       * A map that contains the important nodes of the menu.
       * The keys are the names of the children, and the values are the elements themselves.
       * Allows for easy access to any element in the menu.
       */
      __publicField(this, "groups", /* @__PURE__ */ new Map());
      /**
       * A map that contains the group types for each group in the menu.
       * The keys are the names of the groups, and the values are the types of the groups.
       */
      __publicField(this, "groupTypes", /* @__PURE__ */ new Map());
      /**
       * An array of all the input elements in the menu.
       */
      __publicField(this, "inputElements", []);
      /**
       * An array of all the button elements in the menu.
       */
      __publicField(this, "buttonElements", []);
      /**
       * A boolean that represents whether the settings menu is open or not.
       */
      __publicField(this, "isSettingsMenuOpen", false);
      /**
       * A string used to prefix the IDs of the elements in the menu.
       */
      __publicField(this, "prefix");
      /**
       * A boolean that represents whether an update is available for the script.
       */
      __publicField(this, "isUpdateAvailable", false);
      /**
       * Text to be displayed when hovering over the main button.
       */
      __publicField(this, "parentHoverText", "");
      /**
       * A map that contains the tables in the menu.
       * The keys are the names of the tables, and the values are the table elements.
       */
      __publicField(this, "tableMap", /* @__PURE__ */ new Map());
      __publicField(this, "visualProgress", 0);
      __publicField(this, "animationFrame", null);
      this.prefix = prefix;
      this.parentHoverText = hoverText;
      this.parent = document.createElement("div");
      this.parent.classList.add("game-tools-btn");
      this.parent.style.width = "34px";
      this.parent.style.height = "30px";
      this.setNodeID(
        this.parent,
        "parent"
        /* Parent */
      );
      const hoverSpan = document.createElement("span");
      hoverSpan.classList.add("game-tools-btn-text", "small_text");
      hoverSpan.innerText = hoverText;
      this.parent.appendChild(hoverSpan);
      this.setNodeID(
        hoverSpan,
        "hover"
        /* Hover */
      );
      const bgDiv = document.createElement("div");
      bgDiv.classList.add("game-tools-bg");
      bgDiv.style.width = "100%";
      bgDiv.style.height = "20px";
      bgDiv.style.backgroundColor = "#888888";
      bgDiv.style.overflow = "hidden";
      const fillDiv = document.createElement("div");
      fillDiv.style.position = "absolute";
      fillDiv.style.top = "0";
      fillDiv.style.left = "0";
      fillDiv.style.bottom = "0";
      fillDiv.style.width = "0%";
      fillDiv.style.backgroundColor = "#ffffff";
      fillDiv.style.transition = "width 0.3s ease";
      fillDiv.style.zIndex = "0";
      bgDiv.appendChild(fillDiv);
      this.parent.appendChild(bgDiv);
      this.setNodeID(
        bgDiv,
        "background"
        /* Background */
      );
      this.setNodeID(
        fillDiv,
        "progress-fill"
        /* ProgressFill */
      );
      bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
      bgDiv.addEventListener("mouseout", () => this.setHoverText(""));
      const btnLink = document.createElement("a");
      btnLink.classList.add("norm2");
      btnLink.style.zIndex = "20";
      bgDiv.appendChild(btnLink);
      const btnImg = document.createElement("img");
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this.setNodeID(
        btnImg,
        "button-image"
        /* Button_Image */
      );
      const contextMenu = document.createElement("div");
      contextMenu.classList.add("cls-settings-menu");
      contextMenu.style.zIndex = "30";
      this.parent.appendChild(contextMenu);
      this.setNodeID(
        contextMenu,
        "settings"
        /* Settings */
      );
      const contextMenuBoxesContainer = document.createElement("div");
      contextMenuBoxesContainer.classList.add("cls-horizontal-box");
      contextMenu.appendChild(contextMenuBoxesContainer);
      const leftBox = document.createElement("div");
      leftBox.classList.add("cls-settings-menu-box");
      leftBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(leftBox);
      this.setNodeID(
        leftBox,
        "settings-left"
        /* Settings_Left */
      );
      const centerBox = document.createElement("div");
      centerBox.classList.add("cls-settings-menu-box");
      centerBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(centerBox);
      this.setNodeID(
        centerBox,
        "settings-center"
        /* Settings_Center */
      );
      const rightBox = document.createElement("div");
      rightBox.classList.add("cls-settings-menu-box");
      rightBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(rightBox);
      this.setNodeID(
        rightBox,
        "settings-right"
        /* Settings_Right */
      );
      document.addEventListener("contextmenu", (event) => {
        const element = event.target;
        if (!element.id.startsWith(this.prefix)) return;
        event.stopImmediatePropagation();
        event.preventDefault();
        this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
        if (this.isSettingsMenuOpen) {
          this.openContextMenu();
        } else {
          this.closeContextMenu();
        }
      });
      document.addEventListener("click", (event) => {
        let elmnt = event.target;
        if (!elmnt.id) {
          while (!elmnt.id) {
            elmnt = elmnt.parentNode;
            if (!elmnt) break;
          }
        }
        if (!elmnt) return;
        if (elmnt.id.startsWith(this.prefix) || elmnt.id === "overDiv") return;
        this.closeContextMenu();
      });
    }
    setNodeID(node, id) {
      node.id = `${this.prefix}_${id}`;
    }
    getNodeByID(id) {
      const fullID = `${this.prefix}_${id}`;
      const node = getCurrentDocument().getElementById(fullID) ?? this.parent.querySelector(`#${fullID}`);
      if (!node) {
        if (id !== "co-selector") console.log(`[DevJ] Node with ID ${fullID} not found.`);
        return null;
      }
      const isSettingsSubMenu = id === "settings-left" || id === "settings-center" || id === "settings-right";
      const isHidden = node.style.display === "none";
      const hasChildren = node.children.length > 0;
      if (isSettingsSubMenu && isHidden && hasChildren) {
        node.style.display = "flex";
      }
      return node;
    }
    /**
     * Adds the custom menu to the AWBW page.
     */
    addToAWBWPage(div, prepend = false) {
      if (!div) {
        console.error("[DevJ] Parent div is null, cannot add custom menu to the page.");
        return;
      }
      if (!prepend) {
        div.appendChild(this.parent);
        this.parent.style.borderLeft = "none";
        return;
      }
      div.prepend(this.parent);
      this.parent.style.borderRight = "none";
    }
    hasSettings() {
      var _a, _b, _c;
      const hasLeftMenu = ((_a = this.getNodeByID(
        "settings-left"
        /* Settings_Left */
      )) == null ? void 0 : _a.style.display) !== "none";
      const hasCenterMenu = ((_b = this.getNodeByID(
        "settings-center"
        /* Settings_Center */
      )) == null ? void 0 : _b.style.display) !== "none";
      const hasRightMenu = ((_c = this.getNodeByID(
        "settings-right"
        /* Settings_Right */
      )) == null ? void 0 : _c.style.display) !== "none";
      return hasLeftMenu || hasCenterMenu || hasRightMenu;
    }
    getGroup(groupName) {
      return this.groups.get(groupName);
    }
    /**
     * Changes the hover text of the main button.
     * @param text - The text to be displayed when hovering over the button.
     * @param replaceParent - Whether to replace the current hover text for the main button or not.
     */
    setHoverText(text, replaceParent = false) {
      const hoverSpan = this.getNodeByID(
        "hover"
        /* Hover */
      );
      if (!hoverSpan) return;
      if (replaceParent) this.parentHoverText = text;
      if (this.isUpdateAvailable) text += " (New Update Available!)";
      hoverSpan.innerText = text;
      hoverSpan.style.display = text === "" ? "none" : "block";
      hoverSpan.style.textAlign = "center";
    }
    /**
     * Sets the progress of the UI by coloring the background of the main button.
     * @param progress - A number between 0 and 100 representing the percentage of the progress bar to fill.
     */
    setProgress(targetProgress, immediate = false) {
      const fillDiv = this.getNodeByID(
        "progress-fill"
        /* ProgressFill */
      );
      if (!fillDiv) return;
      const clamped = Math.max(0, Math.min(targetProgress, 100));
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      if (clamped === 0) {
        this.visualProgress = 0;
        fillDiv.style.width = "0%";
        return;
      }
      if (immediate) {
        this.visualProgress = targetProgress;
        fillDiv.style.width = `${this.visualProgress}%`;
        return;
      }
      const animStep = () => {
        this.visualProgress += (clamped - this.visualProgress) * 0.1;
        if (Math.abs(clamped - this.visualProgress) < 0.5) {
          this.visualProgress = clamped;
        } else {
          this.animationFrame = requestAnimationFrame(animStep);
        }
        fillDiv.style.width = `${this.visualProgress}%`;
      };
      this.animationFrame = requestAnimationFrame(animStep);
    }
    /**
     * Sets the image of the main button.
     * @param imageURL - The URL of the image to be used on the button.
     */
    setImage(imageURL) {
      const btnImg = this.getNodeByID(
        "button-image"
        /* Button_Image */
      );
      btnImg.src = imageURL;
    }
    /**
     * Adds an event listener to the main button.
     * @param type - The type of event to listen for.
     * @param listener - The function to be called when the event is triggered.
     */
    addEventListener(type, listener, options = false) {
      const div = this.getNodeByID(
        "background"
        /* Background */
      );
      div == null ? void 0 : div.addEventListener(type, listener, options);
    }
    /**
     * Opens the context (right-click) menu.
     */
    openContextMenu() {
      var _a;
      const contextMenu = this.getNodeByID(
        "settings"
        /* Settings */
      );
      if (!contextMenu) return;
      const hasVersion = ((_a = this.getNodeByID(
        "version"
        /* Version */
      )) == null ? void 0 : _a.style.display) !== "none";
      if (!this.hasSettings() && !hasVersion) return;
      contextMenu.style.display = "flex";
      this.isSettingsMenuOpen = true;
    }
    /**
     * Closes the context (right-click) menu.
     */
    closeContextMenu() {
      const contextMenu = this.getNodeByID(
        "settings"
        /* Settings */
      );
      if (!contextMenu) return;
      contextMenu.style.display = "none";
      this.isSettingsMenuOpen = false;
      const overDiv = document.querySelector("#overDiv");
      const hasCOSelector = this.getNodeByID(
        "co-selector"
        /* CO_Selector */
      ) !== null;
      const isGamePageAndActive = getCurrentPageType() === PageType.ActiveGame;
      if (overDiv && hasCOSelector && isGamePageAndActive) {
        overDiv.style.visibility = "hidden";
      }
    }
    /**
     * Adds an input slider to the context menu.
     * @param name - The name of the slider.
     * @param min - The minimum value of the slider.
     * @param max - The maximum value of the slider.
     * @param step - The step value of the slider.
     * @param hoverText - The text to be displayed when hovering over the slider.
     * @param position - The position of the slider in the context menu.
     * @returns - The slider element.
     */
    addSlider(name, min, max, step, hoverText = "", position = "settings-center") {
      const submenu = this.getNodeByID(position);
      if (!submenu) return;
      const sliderBox = document.createElement("div");
      sliderBox.classList.add("cls-vertical-box");
      sliderBox.classList.add("cls-group-box");
      submenu == null ? void 0 : submenu.appendChild(sliderBox);
      const label = document.createElement("label");
      sliderBox == null ? void 0 : sliderBox.appendChild(label);
      const slider = document.createElement("input");
      slider.id = `${this.prefix}-${sanitize(name)}`;
      slider.type = "range";
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      this.inputElements.push(slider);
      slider.addEventListener("input", (_e) => {
        let displayValue = slider.value;
        if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";
        label.innerText = `${name}: ${displayValue}`;
      });
      sliderBox == null ? void 0 : sliderBox.appendChild(slider);
      slider.title = hoverText;
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addGroup(groupName, type = "cls-horizontal-box", position = "settings-center") {
      const submenu = this.getNodeByID(position);
      if (!submenu) return;
      if (this.groups.has(groupName)) return this.groups.get(groupName);
      const groupBox = document.createElement("div");
      groupBox.classList.add("cls-vertical-box");
      groupBox.classList.add("cls-group-box");
      submenu == null ? void 0 : submenu.appendChild(groupBox);
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      groupBox == null ? void 0 : groupBox.appendChild(groupLabel);
      const group = document.createElement("div");
      group.id = `${this.prefix}-${sanitize(groupName)}`;
      group.classList.add(type);
      groupBox == null ? void 0 : groupBox.appendChild(group);
      this.groups.set(groupName, group);
      this.groupTypes.set(groupName, type);
      return group;
    }
    addRadioButton(name, groupName, hoverText = "") {
      return this.addInput(
        name,
        groupName,
        hoverText,
        "radio"
        /* Radio */
      );
    }
    addCheckbox(name, groupName, hoverText = "") {
      return this.addInput(
        name,
        groupName,
        hoverText,
        "checkbox"
        /* Checkbox */
      );
    }
    addButton(name, groupName, hoverText = "") {
      return this.addInput(
        name,
        groupName,
        hoverText,
        "button"
        /* Button */
      );
    }
    /**
     * Adds an input to the context menu in a specific group.
     * @param name - The name of the input.
     * @param groupName - The name of the group the input belongs to.
     * @param hoverText - The text to be displayed when hovering over the input.
     * @param type - The type of input to be added.
     * @returns - The input element.
     */
    addInput(name, groupName, hoverText = "", type) {
      const groupDiv = this.getGroup(groupName);
      const groupType = this.groupTypes.get(groupName);
      if (!groupDiv || !groupType) return;
      const inputBox = document.createElement("div");
      const otherType = groupType === "cls-horizontal-box" ? "cls-vertical-box" : "cls-horizontal-box";
      inputBox.classList.add(otherType);
      groupDiv.appendChild(inputBox);
      inputBox.title = hoverText;
      inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
      inputBox.addEventListener("mouseout", () => this.setHoverText(""));
      let input;
      if (type === "button") {
        input = this.createButton(name, inputBox);
      } else {
        input = this.createInput(name, inputBox);
      }
      input.type = type;
      input.name = groupName;
      return input;
    }
    createButton(name, inputBox) {
      const input = document.createElement("button");
      input.innerText = name;
      inputBox.appendChild(input);
      this.buttonElements.push(input);
      return input;
    }
    createInput(name, inputBox) {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.appendChild(input);
      label.appendChild(document.createTextNode(name));
      inputBox.appendChild(label);
      this.inputElements.push(input);
      return input;
    }
    /**
     * Adds a special version label to the context menu.
     * @param version - The version to be displayed.
     */
    addVersion() {
      const version = versions.get(this.prefix);
      if (!version) return;
      const contextMenu = this.getNodeByID(
        "settings"
        /* Settings */
      );
      const versionDiv = document.createElement("label");
      versionDiv.innerText = `Version: ${version} (DevJ Edition)`;
      contextMenu == null ? void 0 : contextMenu.appendChild(versionDiv);
      this.setNodeID(
        versionDiv,
        "version"
        /* Version */
      );
    }
    checkIfNewVersionAvailable() {
      const currentVersion = versions.get(this.prefix);
      const updateURL = updateURLs.get(this.prefix);
      const homepageURL = homepageURLs.get(this.prefix) || "";
      if (!currentVersion || !updateURL) return;
      checkIfUpdateIsAvailable(this.prefix).then((isUpdateAvailable) => {
        this.isUpdateAvailable = isUpdateAvailable;
        console.log("[DevJ] Checking if a new version is available...", isUpdateAvailable);
        if (!isUpdateAvailable) return;
        const contextMenu = this.getNodeByID(
          "settings"
          /* Settings */
        );
        const versionDiv = document.createElement("a");
        versionDiv.id = this.prefix + "-update";
        versionDiv.href = homepageURL;
        versionDiv.target = "_blank";
        versionDiv.innerText = `(!) Update Available: Please click here to open the update page in a new tab. (!)`;
        contextMenu == null ? void 0 : contextMenu.append(versionDiv.cloneNode(true));
        if (this.hasSettings()) contextMenu == null ? void 0 : contextMenu.prepend(versionDiv);
      }).catch((error) => console.error(error));
    }
    addTable(name, rows, columns, groupName, hoverText = "") {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const table = document.createElement("table");
      table.classList.add("cls-settings-table");
      groupDiv.appendChild(table);
      table.title = hoverText;
      table.addEventListener("mouseover", () => this.setHoverText(hoverText));
      table.addEventListener("mouseout", () => this.setHoverText(""));
      const tableData = {
        table,
        rows,
        columns
      };
      this.tableMap.set(name, tableData);
      return table;
    }
    addItemToTable(name, item) {
      const tableData = this.tableMap.get(name);
      if (!tableData) return;
      const table = tableData.table;
      if (table.rows.length === 0) table.insertRow();
      const maxItemsPerRow = tableData.columns;
      const currentItemsInRow = table.rows[table.rows.length - 1].cells.length;
      if (currentItemsInRow >= maxItemsPerRow) table.insertRow();
      const currentRow = table.rows[table.rows.length - 1];
      const cell = currentRow.insertCell();
      cell.appendChild(item);
    }
    clearTable(name) {
      const tableData = this.tableMap.get(name);
      if (!tableData) return;
      const table = tableData.table;
      table.innerHTML = "";
    }
    /**
     * Calls the input event on all input elements in the menu.
     * Useful for updating the labels of all the inputs.
     */
    updateAllInputLabels() {
      const event = new Event("input");
      this.inputElements.forEach((input) => {
        input.dispatchEvent(event);
      });
    }
    /**
     * Adds a CO selector to the context menu. Only one CO selector can be added to the menu.
     * @param groupName - The name of the group the CO selector should be added to.
     * @param hoverText - The text to be displayed when hovering over the CO selector.
     * @param onClickFn - The function to be called when a CO is selected from the selector.
     * @returns - The CO selector element.
     */
    addCOSelector(groupName, hoverText = "", onClickFn) {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const coSelector = document.createElement("a");
      coSelector.classList.add("game-tools-btn");
      coSelector.href = "javascript:void(0)";
      const imgCaret = this.createCOSelectorCaret();
      const imgCO = this.createCOPortraitImage("andy");
      coSelector.appendChild(imgCaret);
      coSelector.appendChild(imgCO);
      coSelector.title = hoverText;
      coSelector.addEventListener("mouseover", () => this.setHoverText(hoverText));
      coSelector.addEventListener("mouseout", () => this.setHoverText(""));
      this.setNodeID(
        coSelector,
        "co-selector"
        /* CO_Selector */
      );
      this.setNodeID(
        imgCO,
        "co-portrait"
        /* CO_Portrait */
      );
      groupDiv == null ? void 0 : groupDiv.appendChild(coSelector);
      const allCOs = getAllCONames(true).sort();
      let allColumnsHTML = "";
      for (let i = 0; i < 7; i++) {
        const startIDX = i * 4;
        const endIDX = startIDX + 4;
        const templateFn = (coName) => this.createCOSelectorItem(coName);
        const currentColumnHTML = allCOs.slice(startIDX, endIDX).map(templateFn).join("");
        allColumnsHTML += `<td><table>${currentColumnHTML}</table></td>`;
      }
      const selectorInnerHTML = `<table><tr>${allColumnsHTML}</tr></table>`;
      const selectorTitle = `<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO`;
      coSelector.onclick = () => {
        const ret = overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
        const overdiv = document.querySelector("#overDiv");
        if (overdiv) overdiv.style.zIndex = "1000";
        return ret;
      };
      addCOSelectorListener((coName) => this.onCOSelectorClick(coName));
      addCOSelectorListener(onClickFn);
      return coSelector;
    }
    createCOSelectorItem(coName) {
      const location = "javascript:void(0)";
      const internalName = coName.toLowerCase().replaceAll(" ", "");
      const coPrefix = getCOImagePrefix();
      const imgSrc = `terrain/ani/${coPrefix}${internalName}.png?v=1`;
      const onClickFn = `awbw_music_player.notifyCOSelectorListeners('${internalName}');`;
      return `<tr><td class=borderwhite><img class=co_portrait src=${imgSrc}></td><td class=borderwhite align=center valign=center><span class=small_text><a onclick="${onClickFn}" href=${location}>${coName}</a></b></span></td></tr>`;
    }
    createCOSelectorCaret() {
      const imgCaret = document.createElement("img");
      imgCaret.classList.add("co_caret");
      imgCaret.src = "terrain/co_down_caret.gif";
      imgCaret.style.zIndex = "300";
      return imgCaret;
    }
    createCOPortraitImage(coName) {
      const imgCO = document.createElement("img");
      imgCO.classList.add("co_portrait");
      const coPrefix = getCOImagePrefix();
      imgCO.src = `terrain/ani/${coPrefix}${coName}.png?v=1`;
      if (!getAllCONames().includes(coName)) {
        imgCO.src = `terrain/${coName}`;
      }
      return imgCO;
    }
    createCOPortraitImageWithText(coName, text) {
      const div = document.createElement("div");
      div.classList.add("cls-vertical-box");
      const coImg = this.createCOPortraitImage(coName);
      div.appendChild(coImg);
      const coLabel = document.createElement("label");
      coLabel.textContent = text;
      div.appendChild(coLabel);
      return div;
    }
    onCOSelectorClick(coName) {
      const overDiv = document.querySelector("#overDiv");
      overDiv.style.visibility = "hidden";
      const imgCO = this.getNodeByID(
        "co-portrait"
        /* CO_Portrait */
      );
      const coPrefix = getCOImagePrefix();
      imgCO.src = `terrain/ani/${coPrefix}${coName}.png?v=1`;
    }
  }
  const coSelectorListeners = [];
  function addCOSelectorListener(listener) {
    coSelectorListeners.push(listener);
  }
  function notifyCOSelectorListeners(coName) {
    coSelectorListeners.forEach((listener) => listener(coName));
  }
  const CANDIDATE_BASE_URLS = ["https://awbw-devj.duckdns.org", "https://developerjose.netlify.app"];
  let BASE_URL;
  async function getWorkingBaseURL() {
    for (const url of CANDIDATE_BASE_URLS) {
      try {
        const res = await fetch(`${url}/img/music-player-icon.png`, { method: "HEAD" });
        if (res.ok) {
          BASE_URL = url;
          return url;
        }
      } catch {
      }
    }
    return false;
  }
  const getURLForMusicFile = (fname) => `${BASE_URL}/music/${fname}`;
  const getNeutralImgURL = () => `${BASE_URL}/img/music-player-icon.png`;
  const getPlayingImgURL = () => `${BASE_URL}/img/music-player-playing.gif`;
  const getHashesJSONURL = () => `${BASE_URL}/music/hashes.json`;
  var SpecialTheme = /* @__PURE__ */ ((SpecialTheme2) => {
    SpecialTheme2["Victory"] = "t-victory.ogg";
    SpecialTheme2["Defeat"] = "t-defeat.ogg";
    SpecialTheme2["Maintenance"] = "t-maintenance.ogg";
    SpecialTheme2["COSelect"] = "t-co-select.ogg";
    return SpecialTheme2;
  })(SpecialTheme || {});
  var GameSFX = /* @__PURE__ */ ((GameSFX2) => {
    GameSFX2["coGoldRush"] = "co-gold-rush";
    GameSFX2["powerActivateAW1COP"] = "power-activate-aw1-cop";
    GameSFX2["powerSCOPAvailable"] = "power-scop-available";
    GameSFX2["powerCOPAvailable"] = "power-cop-available";
    GameSFX2["tagBreakAlly"] = "tag-break-ally";
    GameSFX2["tagBreakBH"] = "tag-break-bh";
    GameSFX2["tagSwap"] = "tag-swap";
    GameSFX2["unitAttackPipeSeam"] = "unit-attack-pipe-seam";
    GameSFX2["unitCaptureAlly"] = "unit-capture-ally";
    GameSFX2["unitCaptureEnemy"] = "unit-capture-enemy";
    GameSFX2["unitCaptureProgress"] = "unit-capture-progress";
    GameSFX2["unitMissileHit"] = "unit-missile-hit";
    GameSFX2["unitMissileSend"] = "unit-missile-send";
    GameSFX2["unitHide"] = "unit-hide";
    GameSFX2["unitUnhide"] = "unit-unhide";
    GameSFX2["unitSupply"] = "unit-supply";
    GameSFX2["unitTrap"] = "unit-trap";
    GameSFX2["unitLoad"] = "unit-load";
    GameSFX2["unitUnload"] = "unit-unload";
    GameSFX2["unitExplode"] = "unit-explode";
    GameSFX2["uiCursorMove"] = "ui-cursor-move";
    GameSFX2["uiInvalid"] = "ui-invalid";
    GameSFX2["uiMenuOpen"] = "ui-menu-open";
    GameSFX2["uiMenuClose"] = "ui-menu-close";
    GameSFX2["uiMenuMove"] = "ui-menu-move";
    GameSFX2["uiUnitSelect"] = "ui-unit-select";
    return GameSFX2;
  })(GameSFX || {});
  const onMovementStartMap = /* @__PURE__ */ new Map([
    [
      "APC",
      "move-tread-light"
      /* moveTreadLightLoop */
    ],
    [
      "Anti-Air",
      "move-tread-light"
      /* moveTreadLightLoop */
    ],
    [
      "Artillery",
      "move-tread-light"
      /* moveTreadLightLoop */
    ],
    [
      "B-Copter",
      "move-bcopter"
      /* moveBCopterLoop */
    ],
    [
      "Battleship",
      "move-naval"
      /* moveNavalLoop */
    ],
    [
      "Black Boat",
      "move-naval"
      /* moveNavalLoop */
    ],
    [
      "Black Bomb",
      "move-plane"
      /* movePlaneLoop */
    ],
    [
      "Bomber",
      "move-plane"
      /* movePlaneLoop */
    ],
    [
      "Carrier",
      "move-naval"
      /* moveNavalLoop */
    ],
    [
      "Cruiser",
      "move-naval"
      /* moveNavalLoop */
    ],
    [
      "Fighter",
      "move-plane"
      /* movePlaneLoop */
    ],
    [
      "Infantry",
      "move-inf"
      /* moveInfLoop */
    ],
    [
      "Lander",
      "move-naval"
      /* moveNavalLoop */
    ],
    [
      "Md.Tank",
      "move-tread-heavy"
      /* moveTreadHeavyLoop */
    ],
    [
      "Mech",
      "move-mech"
      /* moveMechLoop */
    ],
    [
      "Mega Tank",
      "move-tread-heavy"
      /* moveTreadHeavyLoop */
    ],
    [
      "Missile",
      "move-tires-heavy"
      /* moveTiresHeavyLoop */
    ],
    [
      "Neotank",
      "move-tread-heavy"
      /* moveTreadHeavyLoop */
    ],
    [
      "Piperunner",
      "move-piperunner"
      /* movePiperunnerLoop */
    ],
    [
      "Recon",
      "move-tires-light"
      /* moveTiresLightLoop */
    ],
    [
      "Rocket",
      "move-tires-heavy"
      /* moveTiresHeavyLoop */
    ],
    [
      "Stealth",
      "move-plane"
      /* movePlaneLoop */
    ],
    [
      "Sub",
      "move-sub"
      /* moveSubLoop */
    ],
    [
      "T-Copter",
      "move-tcopter"
      /* moveTCopterLoop */
    ],
    [
      "Tank",
      "move-tread-light"
      /* moveTreadLightLoop */
    ]
  ]);
  const onMovementRolloffMap = /* @__PURE__ */ new Map([
    [
      "APC",
      "move-tread-light-rolloff"
      /* moveTreadLightOneShot */
    ],
    [
      "Anti-Air",
      "move-tread-light-rolloff"
      /* moveTreadLightOneShot */
    ],
    [
      "Artillery",
      "move-tread-light-rolloff"
      /* moveTreadLightOneShot */
    ],
    [
      "B-Copter",
      "move-bcopter-rolloff"
      /* moveBCopterOneShot */
    ],
    [
      "Black Bomb",
      "move-plane-rolloff"
      /* movePlaneOneShot */
    ],
    [
      "Bomber",
      "move-plane-rolloff"
      /* movePlaneOneShot */
    ],
    [
      "Fighter",
      "move-plane-rolloff"
      /* movePlaneOneShot */
    ],
    [
      "Md.Tank",
      "move-tread-heavy-rolloff"
      /* moveTreadHeavyOneShot */
    ],
    [
      "Mega Tank",
      "move-tread-heavy-rolloff"
      /* moveTreadHeavyOneShot */
    ],
    [
      "Missile",
      "move-tires-heavy-rolloff"
      /* moveTiresHeavyOneShot */
    ],
    [
      "Neotank",
      "move-tread-heavy-rolloff"
      /* moveTreadHeavyOneShot */
    ],
    [
      "Recon",
      "move-tires-light-rolloff"
      /* moveTiresLightOneShot */
    ],
    [
      "Rocket",
      "move-tires-heavy-rolloff"
      /* moveTiresHeavyOneShot */
    ],
    [
      "Stealth",
      "move-plane-rolloff"
      /* movePlaneOneShot */
    ],
    [
      "T-Copter",
      "move-tcopter-rolloff"
      /* moveTCopterOneShot */
    ],
    [
      "Tank",
      "move-tread-light-rolloff"
      /* moveTreadLightOneShot */
    ]
  ]);
  const alternateThemes = /* @__PURE__ */ new Map([
    [GameType.AW1, /* @__PURE__ */ new Set(["debug"])],
    [GameType.AW2, /* @__PURE__ */ new Set([])],
    [GameType.DS, /* @__PURE__ */ new Set([])],
    [GameType.RBC, /* @__PURE__ */ new Set([])]
  ]);
  const introThemes = /* @__PURE__ */ new Map([
    [GameType.AW1, /* @__PURE__ */ new Set([])],
    [GameType.AW2, /* @__PURE__ */ new Set(["andy", "colin", "grit", "hachi", "jess", "kanbei", "lash", "olaf"])],
    [
      GameType.DS,
      /* @__PURE__ */ new Set([
        "andy",
        "colin",
        "grit",
        "hachi",
        "jess",
        "jugger",
        "kanbei",
        "kindle",
        "koal",
        "lash",
        "mode-select",
        "olaf",
        "vonbolt"
      ])
    ],
    [
      GameType.RBC,
      /* @__PURE__ */ new Set([
        "adder-cop",
        "andy-cop",
        "andy",
        "clone-andy-cop",
        "colin-cop",
        "colin",
        "drake-cop",
        "eagle-cop",
        "flak-cop",
        "grit-cop",
        "grit",
        "hachi-cop",
        "hachi",
        "hawke-cop",
        "jess-cop",
        "jess",
        "kanbei-cop",
        "kanbei",
        "lash-cop",
        "lash",
        "max-cop",
        "nell-cop",
        "olaf-cop",
        "olaf",
        "sensei-cop",
        "sonja-cop",
        "sonja",
        "sturm-cop"
      ])
    ]
  ]);
  const preloopThemes = /* @__PURE__ */ new Map([
    [GameType.AW1, /* @__PURE__ */ new Set(["mode-select"])],
    [
      GameType.AW2,
      /* @__PURE__ */ new Set([
        "adder",
        "ally-co-power",
        "ally-super-co-power",
        "andy",
        "bh-co-power",
        "bh-super-co-power",
        "colin",
        "drake",
        "eagle",
        "flak",
        "grit",
        "hachi",
        "hawke",
        "jess",
        "kanbei",
        "lash",
        "map-editor",
        "max",
        "mode-select",
        "nell",
        "olaf",
        "sami",
        "sensei",
        "sonja",
        "sturm"
      ])
    ],
    [
      GameType.DS,
      /* @__PURE__ */ new Set([
        "adder",
        "ally-co-power",
        "ally-super-co-power",
        "andy",
        "bh-co-power",
        "bh-super-co-power",
        "colin",
        "co-select",
        "drake",
        "eagle",
        "flak",
        "grimm",
        "grit",
        "hachi",
        "hawke",
        "jake",
        "javier",
        "jess",
        "jugger",
        "kanbei",
        "kindle",
        "koal",
        "lash",
        "map-editor",
        "max",
        "mode-select",
        "nell",
        "olaf",
        "rachel",
        "sami",
        "sasha",
        "sensei",
        "sonja",
        "vonbolt"
      ])
    ],
    [
      GameType.RBC,
      /* @__PURE__ */ new Set([
        "adder-cop",
        "adder",
        "andy-cop",
        "andy",
        "colin-cop",
        "colin",
        "drake-cop",
        "drake",
        "eagle-cop",
        "eagle",
        "flak-cop",
        "flak",
        "grit-cop",
        "grit",
        "hachi-cop",
        "hachi",
        "hawke-cop",
        "hawke",
        "jess-cop",
        "jess",
        "kanbei-cop",
        "kanbei",
        "lash-cop",
        "lash",
        "map-editor",
        "max-cop",
        "max",
        "mode-select-1",
        "mode-select-2",
        "nell-cop",
        "nell",
        "olaf-cop",
        "olaf",
        "sami-cop",
        "sami",
        "sensei-cop",
        "sensei",
        "sonja-cop",
        "sonja",
        "sturm-cop",
        "sturm"
      ])
    ]
  ]);
  function hasIntroTheme(coName, gameType) {
    var _a;
    return (_a = introThemes.get(gameType)) == null ? void 0 : _a.has(coName);
  }
  function hasPreloopTheme(coName, gameType) {
    var _a;
    return (_a = preloopThemes.get(gameType)) == null ? void 0 : _a.has(coName);
  }
  function getMusicFilename(coName, requestedGameType, actualGameType, themeType, useAlternateTheme) {
    const hasIntro = hasIntroTheme(coName, actualGameType);
    const hasPreloop = hasPreloopTheme(coName, actualGameType);
    if (coName === SpecialCOs.MapEditor)
      return hasIntro ? "t-map-editor-intro" : hasPreloop ? "t-map-editor-preloop" : "t-map-editor";
    if (coName === SpecialCOs.ModeSelect)
      return hasIntro ? "t-mode-select-intro" : hasPreloop ? "t-mode-select-preloop" : "t-mode-select";
    if (useAlternateTheme) {
      const alternateFilename = getAlternateMusicFilename(coName, actualGameType, themeType);
      if (alternateFilename) return alternateFilename;
    }
    const isPowerActive = themeType !== ThemeType.REGULAR;
    const skipPowerTheme = requestedGameType === GameType.AW1 && musicSettings.randomThemesType === RandomThemeType.NONE;
    if (!isPowerActive || skipPowerTheme) {
      return hasIntro ? `t-${coName}-intro` : hasPreloop ? `t-${coName}-preloop` : `t-${coName}`;
    }
    const isCOInRBC = !AW_DS_ONLY_COs.has(coName);
    if (requestedGameType === GameType.RBC && isCOInRBC) {
      coName = `${coName}-cop`;
    } else {
      const powerSuffix = themeType === ThemeType.CO_POWER ? "-co-power" : "-super-co-power";
      coName = isBlackHoleCO(coName) ? "bh" : "ally";
      coName += powerSuffix;
    }
    const hasCopIntro = hasIntroTheme(coName, actualGameType);
    const hasCopPreloop = hasPreloopTheme(coName, actualGameType);
    return hasCopIntro ? `t-${coName}-intro` : hasCopPreloop ? `t-${coName}-preloop` : `t-${coName}`;
  }
  function getAlternateMusicFilename(coName, gameType, themeType) {
    if (!alternateThemes.has(gameType)) return;
    const alternateThemesSet = alternateThemes.get(gameType);
    const faction = isBlackHoleCO(coName) ? "bh" : "ally";
    const isPowerActive = themeType !== ThemeType.REGULAR;
    if (gameType === GameType.RBC && isPowerActive) {
      return `t-${faction}-${themeType}`;
    }
    if (!(alternateThemesSet == null ? void 0 : alternateThemesSet.has(coName)) || isPowerActive) {
      return;
    }
    return `t-${coName}-2`;
  }
  function getMusicURL(coName, gameType, themeType, useAlternateTheme) {
    if (gameType === null || gameType === void 0) gameType = musicSettings.gameType;
    if (themeType === null || themeType === void 0) themeType = musicSettings.themeType;
    if (useAlternateTheme === null || useAlternateTheme === void 0) {
      useAlternateTheme = getCurrentGameDay() >= musicSettings.alternateThemeDay && musicSettings.alternateThemes;
    }
    coName = coName.toLowerCase().replaceAll(" ", "");
    if (coName === SpecialCOs.Victory) return getURLForMusicFile(
      "t-victory.ogg"
      /* Victory */
    );
    if (coName === SpecialCOs.Defeat) return getURLForMusicFile(
      "t-defeat.ogg"
      /* Defeat */
    );
    if (coName === SpecialCOs.Maintenance) return getURLForMusicFile(
      "t-maintenance.ogg"
      /* Maintenance */
    );
    if (coName === SpecialCOs.COSelect) return getURLForMusicFile(
      "t-co-select.ogg"
      /* COSelect */
    );
    if (coName === SpecialCOs.ModeSelect || coName === SpecialCOs.MainPage || coName === SpecialCOs.LiveQueue || coName === SpecialCOs.Default)
      coName = SpecialCOs.ModeSelect;
    const overrideType = musicSettings.getOverride(coName);
    if (overrideType) gameType = overrideType;
    const requestedGameType = gameType;
    gameType = getValidGameTypeForCO(coName, gameType);
    const filename = getMusicFilename(coName, requestedGameType, gameType, themeType, useAlternateTheme);
    let gameDir = gameType;
    if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;
    const url = getURLForMusicFile(`${gameDir}/${filename}.ogg`);
    return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
  }
  function getCONameFromURL(url) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const coName = filename.split(".")[0].substring(2).replaceAll("-intro", "").replaceAll("-preloop", "");
    return coName;
  }
  function getGameTypeFromURL(url) {
    const parts = url.split("/");
    const gameType = parts[parts.length - 2].replace("aw-rbc", "RBC").replace("aw-ds", "DS").toUpperCase();
    if (Object.values(GameType).includes(gameType)) {
      return gameType;
    }
    return GameType.AW2;
  }
  function getValidGameTypeForCO(coName, gameType) {
    if (gameType !== GameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = GameType.DS;
    if (coName.toLowerCase() === "sturm" && gameType === GameType.DS) gameType = GameType.AW2;
    const isSpecialCO = coName === SpecialCOs.MapEditor || coName === SpecialCOs.ModeSelect;
    if (gameType === GameType.AW1 && !isSpecialCO) gameType = GameType.AW2;
    return gameType;
  }
  function getSoundEffectURL(sfx) {
    return `${BASE_URL}/music/sfx/${sfx}.ogg`;
  }
  function getMovementSoundURL(unitName) {
    const sfx = onMovementStartMap.get(unitName);
    if (!sfx) return "";
    return `${BASE_URL}/music/sfx/${onMovementStartMap.get(unitName)}.ogg`;
  }
  function getMovementRollOffURL(unitName) {
    return `${BASE_URL}/music/sfx/${onMovementRolloffMap.get(unitName)}.ogg`;
  }
  function hasMovementRollOff(unitName) {
    return onMovementRolloffMap.has(unitName);
  }
  function getCurrentThemeURLs() {
    const coNames = getAllPlayingCONames();
    const audioList = /* @__PURE__ */ new Set();
    coNames.add(SpecialCOs.MapEditor);
    coNames.add(SpecialCOs.ModeSelect);
    coNames.forEach((name) => {
      const regularURL = getMusicURL(name, musicSettings.gameType, ThemeType.REGULAR, false);
      const powerURL = getMusicURL(name, musicSettings.gameType, ThemeType.CO_POWER, false);
      const superPowerURL = getMusicURL(name, musicSettings.gameType, ThemeType.SUPER_CO_POWER, false);
      const alternateURL = getMusicURL(name, musicSettings.gameType, musicSettings.themeType, true);
      const url = regularURL.replace("-intro", "").replace("-preloop", "");
      if (hasIntroTheme(name, musicSettings.gameType)) audioList.add(url.replace(".ogg", "-intro.ogg"));
      if (hasPreloopTheme(name, musicSettings.gameType)) audioList.add(url.replace(".ogg", "-preloop.ogg"));
      const copName = name + "-cop";
      const copURL = url.replace(name, copName);
      if (hasIntroTheme(copName, musicSettings.gameType)) audioList.add(copURL.replace(".ogg", "-intro.ogg"));
      if (hasPreloopTheme(copName, musicSettings.gameType)) audioList.add(copURL.replace(".ogg", "-preloop.ogg"));
      audioList.add(regularURL);
      audioList.add(alternateURL);
      audioList.add(powerURL);
      audioList.add(superPowerURL);
    });
    return audioList;
  }
  let db = null;
  const dbName = "awbw_music_player";
  const dbVersion = 1;
  const urlQueue$1 = /* @__PURE__ */ new Set();
  const replacementListeners = /* @__PURE__ */ new Set();
  function addDatabaseReplacementListener(fn) {
    replacementListeners.add(fn);
  }
  function openDB() {
    const request = indexedDB.open(dbName, dbVersion);
    return new Promise((resolve, reject) => {
      request.onerror = (event) => reject(event);
      request.onupgradeneeded = (event) => {
        if (!event.target) return reject("No target for database upgrade.");
        const newDB = event.target.result;
        newDB.createObjectStore("music");
      };
      request.onsuccess = (event) => {
        if (!event.target) return reject("No target for database success.");
        db = event.target.result;
        db.onerror = (event2) => {
          reject(`Error accessing database: ${event2}`);
        };
        resolve();
      };
    });
  }
  function loadMusicFromDB(srcURL) {
    if (!srcURL || srcURL === "") return Promise.reject("Invalid URL.");
    if (urlQueue$1.has(srcURL)) return Promise.reject("URL is already queued for storage.");
    urlQueue$1.add(srcURL);
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database is not open.");
      const transaction = db.transaction("music", "readonly");
      const store = transaction.objectStore("music");
      const request = store.get(srcURL);
      request.onsuccess = (event) => {
        urlQueue$1.delete(srcURL);
        const blob = event.target.result;
        if (!blob) {
          return storeURLInDB(srcURL).then((blob2) => resolve(URL.createObjectURL(blob2))).catch((reason) => reject(reason));
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      request.onerror = (event) => {
        urlQueue$1.delete(srcURL);
        reject(event);
      };
    });
  }
  function storeBlobInDB(url, blob) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not open.");
      if (!url || url === "") return reject("Invalid URL.");
      const transaction = db.transaction("music", "readwrite");
      const store = transaction.objectStore("music");
      const request = store.put(blob, url);
      request.onsuccess = () => {
        resolve(blob);
        replacementListeners.forEach((fn) => fn(url));
      };
      request.onerror = (event) => reject(event);
    });
  }
  function storeURLInDB(url) {
    if (!db) return Promise.reject("Database not open.");
    if (!url || url === "") return Promise.reject("Invalid URL.");
    return fetch(url).then((response) => response.blob()).then((blob) => storeBlobInDB(url, blob));
  }
  function checkHashesInDB() {
    if (!db) return Promise.reject("Database not open.");
    return fetch(getHashesJSONURL()).then((response) => response.json()).then((hashes) => compareHashesAndReplaceIfNeeded(hashes));
  }
  function getBlobMD5(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        var _a;
        if (!((_a = event == null ? void 0 : event.target) == null ? void 0 : _a.result)) return reject("FileReader did not load the blob.");
        const md5 = SparkMD52.ArrayBuffer.hash(event.target.result);
        resolve(md5);
      };
      reader.onerror = (event) => reject(event);
      reader.readAsArrayBuffer(blob);
    });
  }
  function compareHashesAndReplaceIfNeeded(hashesJson) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not open.");
      if (!hashesJson) return reject("No hashes found in server.");
      const transaction = db.transaction("music", "readonly");
      const store = transaction.objectStore("music");
      const request = store.openCursor();
      request.onerror = (event) => reject(event);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (!cursor) return resolve();
        const url = cursor.key;
        const blob = cursor.value;
        const serverHash = hashesJson[url];
        cursor.continue();
        if (!serverHash) {
          return;
        }
        getBlobMD5(blob).then((hash) => {
          if (hash === serverHash) return;
          return storeURLInDB(url);
        }).catch((reason) => logError(`Error storing new version of ${url} in database: ${reason}`));
      };
    });
  }
  const audioMap = /* @__PURE__ */ new Map();
  const audioIDMap = /* @__PURE__ */ new Map();
  function playOneShotURL(srcURL, volume) {
    if (!musicSettings.isPlaying) return;
    const soundInstance = new Audio(srcURL);
    soundInstance.currentTime = 0;
    soundInstance.volume = volume;
    soundInstance.play();
  }
  function getVolumeForURL(url) {
    if (url.startsWith("blob:") || !url.startsWith("https://")) {
      logError("Blob URL when trying to get volume for", url);
      return musicSettings.volume;
    }
    if (url.includes("sfx")) {
      if (url.includes("ui")) return musicSettings.uiVolume;
      if (url.includes("power") && !url.includes("available")) return musicSettings.volume;
      return musicSettings.sfxVolume;
    }
    return musicSettings.volume;
  }
  const urlQueue = /* @__PURE__ */ new Set();
  const promiseMap = /* @__PURE__ */ new Map();
  function createNewAudio(srcURL, cacheURL) {
    const audioInMap = audioMap.get(srcURL);
    if (audioInMap) {
      logError("Race Condition! Please report this bug!", srcURL);
      return audioInMap;
    }
    const audio = new Howl({
      src: [cacheURL],
      format: ["ogg"],
      volume: getVolumeForURL(srcURL),
      // Redundant event listeners to ensure the audio is always at the correct volume
      onplay: (_id) => audio.volume(getVolumeForURL(srcURL)),
      onload: (_id) => audio.volume(getVolumeForURL(srcURL)),
      onseek: (_id) => audio.volume(getVolumeForURL(srcURL)),
      onpause: (_id) => audio.volume(getVolumeForURL(srcURL)),
      onloaderror: (_id, error) => logError("Error loading audio:", srcURL, error),
      onplayerror: (_id, error) => logError("Error playing audio:", srcURL, error)
    });
    audioMap.set(srcURL, audio);
    return audio;
  }
  function preloadAllCommonAudio(afterPreloadFunction) {
    const audioList = getCurrentThemeURLs();
    audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));
    logDebug("Pre-loading common audio", audioList);
    preloadAudioList(audioList, afterPreloadFunction);
  }
  function preloadAudioList(audioURLs, afterPreloadFunction = () => {
  }) {
    let numLoadedAudios = 0;
    const onAudioPreload = (action, url) => {
      numLoadedAudios++;
      const loadPercentage = numLoadedAudios / audioURLs.size * 100;
      getMusicPlayerUI().setProgress(loadPercentage);
      if (numLoadedAudios >= audioURLs.size) {
        numLoadedAudios = 0;
        if (afterPreloadFunction) afterPreloadFunction();
      }
      if (action === "error") {
        logInfo(`Could not pre-load: ${url}. This might not be a problem, the audio may still play normally later.`);
        audioMap.delete(url);
        return;
      }
      if (!audioMap.has(url)) {
        logError("Race condition on pre-load! Please report this bug!", url);
      }
    };
    audioURLs.forEach((url) => {
      if (audioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      preloadURL(url).then((audio) => {
        audio.once("load", () => onAudioPreload("load", url));
        audio.once("loaderror", () => onAudioPreload("error", url));
      }).catch((_reason) => onAudioPreload("error", url));
    });
    if (numLoadedAudios >= audioURLs.size) {
      if (afterPreloadFunction) afterPreloadFunction();
    }
  }
  function needsPreloading(srcURL) {
    return !audioMap.has(srcURL);
  }
  async function preloadURL(srcURL) {
    const audio = audioMap.get(srcURL);
    if (audio) return audio;
    if (urlQueue.has(srcURL)) {
      const storedPromise = promiseMap.get(srcURL);
      if (!storedPromise) return Promise.reject(`No promise found for ${srcURL}, please report this bug!`);
      return storedPromise;
    }
    urlQueue.add(srcURL);
    const promise = loadMusicFromDB(srcURL).then(
      (localCacheURL) => createNewAudio(srcURL, localCacheURL),
      (reason) => {
        logDebug(reason, srcURL);
        return createNewAudio(srcURL, srcURL);
      }
    );
    promiseMap.set(srcURL, promise);
    return promise;
  }
  var Description = /* @__PURE__ */ ((Description2) => {
    Description2["Volume"] = "Adjust the volume of the CO theme music, power activations, and power themes.";
    Description2["SFX_Volume"] = "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.";
    Description2["UI_Volume"] = "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.";
    Description2["AW1"] = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!";
    Description2["AW2"] = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.";
    Description2["DS"] = "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.";
    Description2["RBC"] = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!";
    Description2["No_Random"] = "Play the music depending on who the current CO is.";
    Description2["All_Random"] = "Play random music every turn from all soundtracks.";
    Description2["Current_Random"] = "Play random music every turn from the current soundtrack.";
    Description2["Shuffle"] = "Changes the current theme to a new random one.";
    Description2["SFX_Pages"] = "Play sound effects on other pages like 'Your Games', 'Profile', or during maintenance.";
    Description2["Capture_Progress"] = "Play a sound effect when a unit makes progress capturing a property.";
    Description2["Pipe_Seam_SFX"] = "Play a sound effect when a pipe seam is attacked.";
    Description2["Autoplay_Pages"] = "Autoplay music on other pages like 'Your Games', 'Profile', or during maintenance.";
    Description2["Restart_Themes"] = "Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously.";
    Description2["Seamless_Loops"] = "Seamlessly loop the music when playing in mirror matches. If enabled, the music will not restart when the turn changes when both players are using the same CO.";
    Description2["PlayIntros"] = "Play CO intros every new turn. If disabled, the intro will only play once at the start of the game.";
    Description2["Random_Loop_Toggle"] = "Loop random songs until a turn change happens. If disabled, when a random song ends a new random song will be chosen immediately even if the turn hasn't changed yet.";
    Description2["Alternate_Themes"] = "Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start.";
    Description2["Alternate_Day"] = "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?";
    Description2["Add_Override"] = "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes.";
    Description2["Override_Radio"] = "Only play songs from ";
    Description2["Remove_Override"] = "Removes the override for this specific CO.";
    Description2["Add_Excluded"] = "Add an override for a specific CO to exclude their themes when playing random themes.";
    return Description2;
  })(Description || {});
  function getMenu() {
    var _a;
    const doc = getCurrentDocument();
    switch (getCurrentPageType()) {
      case PageType.Maintenance:
        return doc.querySelector("#main");
      case PageType.MapEditor:
        return doc.querySelector("#replay-misc-controls");
      case PageType.MovePlanner:
        return doc.querySelector("#map-controls-container");
      case PageType.ActiveGame:
        return (_a = doc.querySelector("#game-map-menu")) == null ? void 0 : _a.parentNode;
      // case PageType.LiveQueue:
      // case PageType.MainPage:
      default:
        return doc.querySelector("#nav-options");
    }
  }
  function onMusicBtnClick(_event) {
    musicSettings.isPlaying = !musicSettings.isPlaying;
  }
  let currentSelectedCO = "andy";
  function onCOSelectorClick(coName) {
    currentSelectedCO = coName;
  }
  function onSettingsChange$1(key, _value, isFirstLoad) {
    const musicPlayerUI = getMusicPlayerUI();
    if (isFirstLoad) {
      if (volumeSlider) volumeSlider.value = musicSettings.volume.toString();
      if (sfxVolumeSlider) sfxVolumeSlider.value = musicSettings.sfxVolume.toString();
      if (uiVolumeSlider) uiVolumeSlider.value = musicSettings.uiVolume.toString();
      if (daySlider) daySlider.value = musicSettings.alternateThemeDay.toString();
      const selectedGameTypeRadio = gameTypeRadioMap.get(musicSettings.gameType);
      if (selectedGameTypeRadio) selectedGameTypeRadio.checked = true;
      const selectedRandomTypeRadio = randomRadioMap.get(musicSettings.randomThemesType);
      if (selectedRandomTypeRadio) selectedRandomTypeRadio.checked = true;
      if (captProgressBox) captProgressBox.checked = musicSettings.captureProgressSFX;
      if (pipeSeamBox) pipeSeamBox.checked = musicSettings.pipeSeamSFX;
      if (seamlessLoopsBox) seamlessLoopsBox.checked = musicSettings.seamlessLoopsInMirrors;
      if (restartThemesBox) restartThemesBox.checked = musicSettings.restartThemes;
      if (autoplayPagesBox) autoplayPagesBox.checked = musicSettings.autoplayOnOtherPages;
      if (loopToggle) loopToggle.checked = musicSettings.loopRandomSongsUntilTurnChange;
      if (introsBox) introsBox.checked = musicSettings.playIntroEveryTurn;
      if (uiSFXPagesBox) uiSFXPagesBox.checked = musicSettings.sfxOnOtherPages;
      if (alternateThemesBox) alternateThemesBox.checked = musicSettings.alternateThemes;
      musicPlayerUI.updateAllInputLabels();
    }
    if (key === SettingsKey.ALL || key === SettingsKey.ADD_OVERRIDE || key === SettingsKey.REMOVE_OVERRIDE) {
      clearAndRepopulateOverrideList();
      if (musicSettings.overrideList.size === 0) {
        const noOverrides = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No overrides set yet...");
        musicPlayerUI.addItemToTable("Overrides", noOverrides);
      }
    }
    if (key === SettingsKey.ALL || key === SettingsKey.ADD_EXCLUDED || key === SettingsKey.REMOVE_EXCLUDED) {
      clearAndRepopulateExcludedList();
      if (musicSettings.excludedRandomThemes.size === 0) {
        const noExcluded = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No themes excluded yet...");
        musicPlayerUI.addItemToTable("Excluded Random Themes", noExcluded);
      }
    }
    if (key === SettingsKey.GAME_TYPE && !isFirstLoad) {
      preloadAllCommonAudio(() => logInfo("Preloaded common audio for", _value));
    }
    const canUpdateDaySlider = (daySlider == null ? void 0 : daySlider.parentElement) && getCurrentPageType() === PageType.ActiveGame;
    if (canUpdateDaySlider && (daySlider == null ? void 0 : daySlider.parentElement))
      daySlider.parentElement.style.display = (alternateThemesBox == null ? void 0 : alternateThemesBox.checked) ? "flex" : "none";
    if (shuffleBtn) shuffleBtn.disabled = musicSettings.randomThemesType === RandomThemeType.NONE;
    let currentSounds = getCurrentPageType() === PageType.MovePlanner ? "Sound Effects" : "Tunes";
    currentSounds += "\n(Right-Click for Settings)";
    if (musicSettings.isPlaying) {
      musicPlayerUI.setHoverText(`Stop ${currentSounds}`, true);
      musicPlayerUI.setImage(getPlayingImgURL());
    } else {
      musicPlayerUI.setHoverText(`Play ${currentSounds}`, true);
      musicPlayerUI.setImage(getNeutralImgURL());
    }
  }
  const parseInputFloat = (event) => parseFloat(event.target.value);
  const parseInputInt = (event) => parseInt(event.target.value);
  let volumeSlider;
  let sfxVolumeSlider;
  let uiVolumeSlider;
  let daySlider;
  let gameTypeRadioMap;
  let randomRadioMap;
  let shuffleBtn;
  let overrideBtn;
  let uiSFXPagesBox;
  let captProgressBox;
  let pipeSeamBox;
  let autoplayPagesBox;
  let seamlessLoopsBox;
  let restartThemesBox;
  let loopToggle;
  let introsBox;
  let alternateThemesBox;
  let radioNormal;
  let radioAllRandom;
  let radioCurrentRandom;
  let excludeRadio;
  let overrideGameTypeRadioMap;
  let overrideDivMap;
  let excludedListDivMap;
  let __musicPlayerUI;
  function getMusicPlayerUI() {
    if (__musicPlayerUI) return __musicPlayerUI;
    __musicPlayerUI = new CustomMenuSettingsUI(ScriptName.MusicPlayer, getNeutralImgURL(), "Play Tunes");
    const musicPlayerUI = __musicPlayerUI;
    const LEFT = NodeID.Settings_Left;
    volumeSlider = musicPlayerUI.addSlider("Music Volume", 0, 1, 5e-3, "Adjust the volume of the CO theme music, power activations, and power themes.", LEFT);
    sfxVolumeSlider = musicPlayerUI.addSlider("SFX Volume", 0, 1, 5e-3, "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.", LEFT);
    uiVolumeSlider = musicPlayerUI.addSlider("UI Volume", 0, 1, 5e-3, "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.", LEFT);
    const soundtrackGroupID = "Soundtrack";
    musicPlayerUI.addGroup(soundtrackGroupID, GroupType.Horizontal, LEFT);
    gameTypeRadioMap = /* @__PURE__ */ new Map();
    for (const gameType of Object.values(GameType)) {
      const description = Description[gameType];
      const radio = musicPlayerUI.addRadioButton(gameType, soundtrackGroupID, description);
      gameTypeRadioMap.set(gameType, radio);
    }
    const randomGroupID = "Random Themes";
    musicPlayerUI.addGroup(randomGroupID, GroupType.Horizontal, LEFT);
    radioNormal = musicPlayerUI.addRadioButton(
      "Off",
      randomGroupID,
      "Play the music depending on who the current CO is."
      /* No_Random */
    );
    radioAllRandom = musicPlayerUI.addRadioButton(
      "All Soundtracks",
      randomGroupID,
      "Play random music every turn from all soundtracks."
      /* All_Random */
    );
    radioCurrentRandom = musicPlayerUI.addRadioButton(
      "Current Soundtrack",
      randomGroupID,
      "Play random music every turn from the current soundtrack."
      /* Current_Random */
    );
    randomRadioMap = /* @__PURE__ */ new Map([
      [RandomThemeType.NONE, radioNormal],
      [RandomThemeType.ALL_THEMES, radioAllRandom],
      [RandomThemeType.CURRENT_SOUNDTRACK, radioCurrentRandom]
    ]);
    shuffleBtn = musicPlayerUI.addButton(
      "Shuffle",
      randomGroupID,
      "Changes the current theme to a new random one."
      /* Shuffle */
    );
    const sfxGroupID = "Sound Effect (SFX) Options";
    musicPlayerUI.addGroup(sfxGroupID, GroupType.Vertical, LEFT);
    uiSFXPagesBox = musicPlayerUI.addCheckbox(
      "Play Sound Effects Outside Of Game Pages",
      sfxGroupID,
      "Play sound effects on other pages like 'Your Games', 'Profile', or during maintenance."
      /* SFX_Pages */
    );
    captProgressBox = musicPlayerUI.addCheckbox(
      "Capture Progress SFX",
      sfxGroupID,
      "Play a sound effect when a unit makes progress capturing a property."
      /* Capture_Progress */
    );
    pipeSeamBox = musicPlayerUI.addCheckbox(
      "Pipe Seam Attack SFX",
      sfxGroupID,
      "Play a sound effect when a pipe seam is attacked."
      /* Pipe_Seam_SFX */
    );
    const musicGroupID = "Music Options";
    musicPlayerUI.addGroup(musicGroupID, GroupType.Vertical, LEFT);
    autoplayPagesBox = musicPlayerUI.addCheckbox(
      "Autoplay Music Outside Of Game Pages",
      musicGroupID,
      "Autoplay music on other pages like 'Your Games', 'Profile', or during maintenance."
      /* Autoplay_Pages */
    );
    seamlessLoopsBox = musicPlayerUI.addCheckbox(
      "Seamless Loops In Mirror Matches",
      musicGroupID,
      "Seamlessly loop the music when playing in mirror matches. If enabled, the music will not restart when the turn changes when both players are using the same CO."
      /* Seamless_Loops */
    );
    restartThemesBox = musicPlayerUI.addCheckbox(
      "Restart Themes Every Turn",
      musicGroupID,
      "Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously."
      /* Restart_Themes */
    );
    loopToggle = musicPlayerUI.addCheckbox(
      "Loop Random Songs Until Turn Changes",
      musicGroupID,
      "Loop random songs until a turn change happens. If disabled, when a random song ends a new random song will be chosen immediately even if the turn hasn't changed yet."
      /* Random_Loop_Toggle */
    );
    introsBox = musicPlayerUI.addCheckbox(
      "Play CO Intros Every Turn",
      musicGroupID,
      "Play CO intros every new turn. If disabled, the intro will only play once at the start of the game."
      /* PlayIntros */
    );
    alternateThemesBox = musicPlayerUI.addCheckbox(
      "Alternate Themes",
      musicGroupID,
      "Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start."
      /* Alternate_Themes */
    );
    daySlider = musicPlayerUI.addSlider("Alternate Themes Start On Day", 0, 30, 1, "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?", LEFT);
    const RIGHT = NodeID.Settings_Right;
    const addOverrideGroupID = "Override Themes";
    musicPlayerUI.addGroup(addOverrideGroupID, GroupType.Horizontal, RIGHT);
    musicPlayerUI.addCOSelector(addOverrideGroupID, "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes.", onCOSelectorClick);
    overrideGameTypeRadioMap = /* @__PURE__ */ new Map();
    for (const gameType of Object.values(GameType)) {
      const radio = musicPlayerUI.addRadioButton(gameType, addOverrideGroupID, "Only play songs from " + gameType);
      overrideGameTypeRadioMap.set(gameType, radio);
      radio.checked = true;
    }
    excludeRadio = musicPlayerUI.addRadioButton(
      "Exclude Random",
      addOverrideGroupID,
      "Add an override for a specific CO to exclude their themes when playing random themes."
      /* Add_Excluded */
    );
    overrideBtn = musicPlayerUI.addButton(
      "Add",
      addOverrideGroupID,
      "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes."
      /* Add_Override */
    );
    const overrideListGroupID = "Current Overrides (Click to Remove)";
    musicPlayerUI.addGroup(overrideListGroupID, GroupType.Horizontal, RIGHT);
    overrideDivMap = /* @__PURE__ */ new Map();
    const tableRows = 4;
    const tableCols = 7;
    musicPlayerUI.addTable(
      "Overrides",
      tableRows,
      tableCols,
      overrideListGroupID,
      "Removes the override for this specific CO."
      /* Remove_Override */
    );
    const excludedListGroupID = "Themes Excluded From Randomizer (Click to Remove)";
    musicPlayerUI.addGroup(excludedListGroupID, GroupType.Horizontal, RIGHT);
    excludedListDivMap = /* @__PURE__ */ new Map();
    musicPlayerUI.addTable(
      "Excluded Random Themes",
      tableRows,
      tableCols,
      excludedListGroupID,
      "Removes the override for this specific CO."
      /* Remove_Override */
    );
    musicPlayerUI.addVersion();
    addMusicUIListeners();
    return musicPlayerUI;
  }
  function initializeMusicPlayerUI() {
    const musicPlayerUI = getMusicPlayerUI();
    musicPlayerUI.setProgress(100);
    let prepend = false;
    switch (getCurrentPageType()) {
      // case PageType.LiveQueue:
      //   return;
      case PageType.ActiveGame:
        break;
      case PageType.MapEditor:
        musicPlayerUI.parent.style.borderTop = "none";
        break;
      case PageType.Maintenance:
        musicPlayerUI.parent.style.borderLeft = "";
        break;
      default:
        musicPlayerUI.parent.style.border = "none";
        musicPlayerUI.parent.style.backgroundColor = "#0000";
        musicPlayerUI.setProgress(-1);
        prepend = true;
        break;
    }
    musicPlayerUI.addToAWBWPage(getMenu(), prepend);
  }
  function addMusicUIListeners() {
    const musicPlayerUI = getMusicPlayerUI();
    musicPlayerUI.addEventListener("click", onMusicBtnClick);
    addSettingsChangeListener(onSettingsChange$1);
    volumeSlider == null ? void 0 : volumeSlider.addEventListener("input", (event) => musicSettings.volume = parseInputFloat(event));
    sfxVolumeSlider == null ? void 0 : sfxVolumeSlider.addEventListener("input", (event) => musicSettings.sfxVolume = parseInputFloat(event));
    uiVolumeSlider == null ? void 0 : uiVolumeSlider.addEventListener("input", (event) => musicSettings.uiVolume = parseInputFloat(event));
    radioNormal == null ? void 0 : radioNormal.addEventListener("click", (_e) => musicSettings.randomThemesType = RandomThemeType.NONE);
    radioAllRandom == null ? void 0 : radioAllRandom.addEventListener("click", (_e) => musicSettings.randomThemesType = RandomThemeType.ALL_THEMES);
    radioCurrentRandom == null ? void 0 : radioCurrentRandom.addEventListener(
      "click",
      (_e) => musicSettings.randomThemesType = RandomThemeType.CURRENT_SOUNDTRACK
    );
    for (const gameType of Object.values(GameType)) {
      const radio = gameTypeRadioMap.get(gameType);
      radio == null ? void 0 : radio.addEventListener("click", (_e) => musicSettings.gameType = gameType);
    }
    shuffleBtn == null ? void 0 : shuffleBtn.addEventListener("click", (_e) => musicSettings.randomizeCO());
    captProgressBox == null ? void 0 : captProgressBox.addEventListener(
      "click",
      (_e) => musicSettings.captureProgressSFX = _e.target.checked
    );
    pipeSeamBox == null ? void 0 : pipeSeamBox.addEventListener("click", (_e) => musicSettings.pipeSeamSFX = _e.target.checked);
    restartThemesBox == null ? void 0 : restartThemesBox.addEventListener(
      "click",
      (_e) => musicSettings.restartThemes = _e.target.checked
    );
    autoplayPagesBox == null ? void 0 : autoplayPagesBox.addEventListener(
      "click",
      (_e) => musicSettings.autoplayOnOtherPages = _e.target.checked
    );
    loopToggle == null ? void 0 : loopToggle.addEventListener(
      "click",
      (_e) => musicSettings.loopRandomSongsUntilTurnChange = _e.target.checked
    );
    uiSFXPagesBox == null ? void 0 : uiSFXPagesBox.addEventListener(
      "click",
      (_e) => musicSettings.sfxOnOtherPages = _e.target.checked
    );
    alternateThemesBox == null ? void 0 : alternateThemesBox.addEventListener(
      "click",
      (_e) => musicSettings.alternateThemes = _e.target.checked
    );
    seamlessLoopsBox == null ? void 0 : seamlessLoopsBox.addEventListener(
      "click",
      (_e) => musicSettings.seamlessLoopsInMirrors = _e.target.checked
    );
    introsBox == null ? void 0 : introsBox.addEventListener(
      "click",
      (_e) => musicSettings.playIntroEveryTurn = _e.target.checked
    );
    daySlider == null ? void 0 : daySlider.addEventListener("input", (event) => musicSettings.alternateThemeDay = parseInputInt(event));
    overrideBtn == null ? void 0 : overrideBtn.addEventListener("click", (_e) => {
      if (!overrideGameTypeRadioMap) return;
      if (excludeRadio == null ? void 0 : excludeRadio.checked) {
        musicSettings.addExcludedRandomTheme(currentSelectedCO);
        return;
      }
      let currentGameType;
      for (const [gameType, radio] of overrideGameTypeRadioMap) {
        if (radio.checked) currentGameType = gameType;
      }
      if (!currentGameType) return;
      musicSettings.addOverride(currentSelectedCO, currentGameType);
    });
  }
  function addOverrideDisplayDiv(coName, gameType) {
    if (!overrideDivMap) return;
    const musicPlayerUI = getMusicPlayerUI();
    const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, gameType);
    displayDiv.addEventListener("click", (_event) => {
      musicSettings.removeOverride(coName);
    });
    overrideDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable("Overrides", displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateOverrideList() {
    if (!overrideDivMap) return;
    const musicPlayerUI = getMusicPlayerUI();
    overrideDivMap.forEach((div) => div.remove());
    overrideDivMap.clear();
    musicPlayerUI.clearTable(
      "Overrides"
      /* Override_Table */
    );
    for (const [coName, gameType] of musicSettings.overrideList) {
      addOverrideDisplayDiv(coName, gameType);
    }
  }
  function addExcludedDisplayDiv(coName) {
    if (!excludedListDivMap) return;
    const musicPlayerUI = getMusicPlayerUI();
    const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, "");
    displayDiv.addEventListener("click", (_event) => {
      musicSettings.removeExcludedRandomTheme(coName);
    });
    excludedListDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable("Excluded Random Themes", displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateExcludedList() {
    if (!excludedListDivMap) return;
    const musicPlayerUI = getMusicPlayerUI();
    excludedListDivMap.forEach((div) => div.remove());
    excludedListDivMap.clear();
    musicPlayerUI.clearTable(
      "Excluded Random Themes"
      /* Excluded_Table */
    );
    for (const coName of musicSettings.excludedRandomThemes) addExcludedDisplayDiv(coName);
  }
  function getQueryTurnFn() {
    return typeof queryTurn !== "undefined" ? queryTurn : null;
  }
  function getShowEventScreenFn() {
    return typeof showEventScreen !== "undefined" ? showEventScreen : null;
  }
  function getShowEndGameScreenFn() {
    return typeof showEndGameScreen !== "undefined" ? showEndGameScreen : null;
  }
  function getOpenMenuFn() {
    return typeof openMenu !== "undefined" ? openMenu : null;
  }
  function getCloseMenuFn() {
    return typeof closeMenu !== "undefined" ? closeMenu : null;
  }
  function getCreateDamageSquaresFn() {
    return typeof createDamageSquares !== "undefined" ? createDamageSquares : null;
  }
  function getUnitClickFn() {
    return typeof unitClickHandler !== "undefined" ? unitClickHandler : null;
  }
  function getWaitFn() {
    return typeof waitUnit !== "undefined" ? waitUnit : null;
  }
  function getAnimUnitFn() {
    return typeof animUnit !== "undefined" ? animUnit : null;
  }
  function getAnimExplosionFn() {
    return typeof animExplosion !== "undefined" ? animExplosion : null;
  }
  function getFogFn() {
    return typeof updateAirUnitFogOnMove !== "undefined" ? updateAirUnitFogOnMove : null;
  }
  function getFireFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Fire : null;
  }
  function getAttackSeamFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.AttackSeam : null;
  }
  function getMoveFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Move : null;
  }
  function getCaptFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Capt : null;
  }
  function getBuildFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Build : null;
  }
  function getLoadFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Load : null;
  }
  function getUnloadFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Unload : null;
  }
  function getSupplyFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Supply : null;
  }
  function getRepairFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Repair : null;
  }
  function getHideFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Hide : null;
  }
  function getUnhideFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Unhide : null;
  }
  function getJoinFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Join : null;
  }
  function getLaunchFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Launch : null;
  }
  function getNextTurnFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.NextTurn : null;
  }
  function getEliminationFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Elimination : null;
  }
  function getPowerFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
  }
  function getGameOverFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.GameOver : null;
  }
  function getResignFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Resign : null;
  }
  const unitIDAudioMap = /* @__PURE__ */ new Map();
  function playMovementSound(unitId) {
    if (!musicSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) {
      const unitName = getUnitName(unitId);
      if (!unitName) return;
      const movementSoundURL = getMovementSoundURL(unitName);
      if (!movementSoundURL) {
        logError("No movement sound for", unitName);
        return;
      }
      unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
    }
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio) return;
    movementAudio.currentTime = 0;
    movementAudio.loop = false;
    movementAudio.volume = musicSettings.sfxVolume;
    movementAudio.play();
  }
  function stopMovementSound(unitId, rolloff = true) {
    if (!musicSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) return;
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio || movementAudio.paused) return;
    if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      movementAudio.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
      return;
    }
    movementAudio.pause();
    movementAudio.currentTime = 0;
    const unitName = getUnitName(unitId);
    if (!rolloff || !unitName) return;
    if (hasMovementRollOff(unitName)) {
      const audioURL = getMovementRollOffURL(unitName);
      playOneShotURL(audioURL, musicSettings.sfxVolume);
    }
  }
  function stopAllMovementSounds() {
    for (const unitId of unitIDAudioMap.keys()) {
      stopMovementSound(unitId, false);
    }
  }
  function whenAudioLoadsPauseIt(event) {
    event.target.pause();
  }
  let currentThemeURL = "";
  let currentLoops = 0;
  const specialIntroMap = /* @__PURE__ */ new Map();
  const specialPreloopMap = /* @__PURE__ */ new Map();
  let currentlyDelaying = false;
  let currentDelayTimeoutID = -1;
  async function playMusicURL(srcURL, newPlay = false) {
    const specialLoopURL = specialIntroMap.get(srcURL);
    if (specialLoopURL) {
      srcURL = specialLoopURL;
    }
    const preloopURL = specialPreloopMap.get(srcURL);
    if (preloopURL) {
      srcURL = preloopURL;
    }
    const sameSongRequest = srcURL === currentThemeURL;
    if (!sameSongRequest) {
      stopThemeSong();
      currentThemeURL = srcURL;
    }
    const nextSong = audioMap.get(srcURL) ?? await preloadURL(srcURL);
    const dontLoop = srcURL.includes("-intro") || srcURL.includes("-preloop");
    nextSong.loop(!dontLoop);
    nextSong.volume(getVolumeForURL(srcURL));
    nextSong.on("play", () => onThemePlay(nextSong, srcURL));
    nextSong.on("load", () => playThemeSong());
    nextSong.on("end", () => onThemeEndOrLoop(srcURL));
    if (!musicSettings.isPlaying) return;
    if (nextSong.playing()) return;
    if (!sameSongRequest) {
      logInfo("Now Playing: ", srcURL, " | Cached? =", nextSong._src !== srcURL);
    }
    const newID = nextSong.play();
    if (!newID) return;
    audioIDMap.set(srcURL, newID);
  }
  function playThemeSong(newPlay = false) {
    if (!musicSettings.isPlaying) return;
    if (currentlyDelaying) return;
    let gameType = void 0;
    let coName = currentPlayer.coName;
    if (getCurrentPageType() === PageType.Maintenance) coName = SpecialCOs.Maintenance;
    else if (getCurrentPageType() === PageType.MapEditor) coName = SpecialCOs.MapEditor;
    else if (getCurrentPageType() === PageType.MainPage) coName = SpecialCOs.MainPage;
    else if (getCurrentPageType() === PageType.LiveQueue) coName = SpecialCOs.LiveQueue;
    else if (getCurrentPageType() === PageType.Default) coName = SpecialCOs.Default;
    const isEndTheme = coName === SpecialCOs.Victory || coName === SpecialCOs.Defeat || coName === SpecialCOs.COSelect;
    const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
    if (isRandomTheme && !isEndTheme) {
      coName = musicSettings.currentRandomCO;
      if (musicSettings.randomThemesType === RandomThemeType.ALL_THEMES) gameType = musicSettings.currentRandomGameType;
    }
    if (!coName) {
      if (!currentThemeURL || currentThemeURL === "") return;
      playMusicURL(currentThemeURL, newPlay);
      return;
    }
    playMusicURL(getMusicURL(coName, gameType), newPlay);
  }
  function stopThemeSong(delayMS = 0) {
    if (delayMS > 0) {
      if (currentlyDelaying) {
        clearTimeout(currentDelayTimeoutID);
      }
      currentlyDelaying = true;
      currentDelayTimeoutID = window.setTimeout(() => clearThemeDelay(), delayMS);
    }
    const currentTheme = audioMap.get(currentThemeURL);
    if (!currentTheme) return;
    logDebug("Pausing: ", currentThemeURL);
    currentTheme.pause();
  }
  function stopAllSounds() {
    stopThemeSong();
    stopAllMovementSounds();
    for (const audio of audioMap.values()) {
      if (audio.playing()) audio.pause();
    }
  }
  function onThemePlay(audio, srcURL) {
    currentLoops = 0;
    audio.volume(getVolumeForURL(srcURL));
    const coName = getCONameFromURL(srcURL);
    const requestedGameType = getGameTypeFromURL(srcURL);
    const loopURL = srcURL.replace("-intro", "").replace("-preloop", "");
    const introURL = loopURL.replace(".ogg", "-intro.ogg");
    const preloopURL = loopURL.replace(".ogg", "-preloop.ogg");
    const preloadURLs = [];
    if (needsPreloading(loopURL)) preloadURLs.push(loopURL);
    if (hasIntroTheme(coName, requestedGameType) && needsPreloading(introURL)) preloadURLs.push(introURL);
    if (hasPreloopTheme(coName, requestedGameType) && needsPreloading(preloopURL)) preloadURLs.push(preloopURL);
    const preloadPromises = preloadURLs.map((url) => preloadURL(url));
    const useProgress = getMusicPlayerUI().visualProgress === 100;
    if (useProgress && preloadPromises.length > 0) {
      getMusicPlayerUI().setProgress(0);
      Promise.all(preloadPromises).then(() => {
        getMusicPlayerUI().setProgress(100);
      });
    }
    broadcastChannel.postMessage("pause");
    const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
    const isPowerTheme = musicSettings.themeType !== ThemeType.REGULAR;
    const isIntro = srcURL.includes("-intro");
    const isPreloop = srcURL.includes("-preloop");
    const shouldRestart = musicSettings.restartThemes || isPowerTheme || isRandomTheme || isIntro || isPreloop;
    const currentPosition = audio.seek();
    const isGamePageActive = getCurrentPageType() === PageType.ActiveGame;
    if (shouldRestart && isGamePageActive && currentPosition > 0.1) {
      audio.seek(0);
    }
    if (currentThemeURL !== srcURL && audio.playing()) {
      audio.pause();
      playThemeSong();
    }
    const audioID = audioIDMap.get(srcURL);
    if (!audioID) return;
    for (const id of audio._getSoundIds()) {
      if (id !== audioID) audio.stop(id);
    }
  }
  function onThemeEndOrLoop(srcURL) {
    currentLoops++;
    if (currentThemeURL !== srcURL) {
      return;
    }
    const coName = getCONameFromURL(srcURL);
    const gameType = getValidGameTypeForCO(coName, getGameTypeFromURL(srcURL));
    if (srcURL.includes("-intro")) {
      let loopURL;
      if (hasPreloopTheme(coName, gameType)) {
        loopURL = srcURL.replace("-intro", "-preloop");
      } else {
        loopURL = srcURL.replace("-intro", "");
      }
      specialIntroMap.set(srcURL, loopURL);
      playThemeSong();
    }
    if (srcURL.includes("-preloop")) {
      const loopURL = srcURL.replace("-preloop", "");
      specialPreloopMap.set(srcURL, loopURL);
      playThemeSong();
    }
    let hasIntro = false;
    specialIntroMap.values().forEach((val) => {
      if (val == srcURL) hasIntro = true;
    });
    if (hasIntro && srcURL.includes("-cop")) {
      specialIntroMap.delete(srcURL);
    }
    if (srcURL === SpecialTheme.Victory || srcURL === SpecialTheme.Defeat) {
      if (currentLoops >= 5) playMusicURL(SpecialTheme.COSelect);
    }
    if (musicSettings.randomThemesType !== RandomThemeType.NONE && !musicSettings.loopRandomSongsUntilTurnChange) {
      if (srcURL.includes("-intro") || srcURL.includes("-preloop")) {
        return;
      }
      musicSettings.randomizeCO();
      playThemeSong();
    }
  }
  function onSettingsChange(key, _value, isFirstLoad) {
    if (isFirstLoad) return;
    switch (key) {
      case SettingsKey.ADD_OVERRIDE:
      case SettingsKey.REMOVE_OVERRIDE:
      case SettingsKey.OVERRIDE_LIST:
      case SettingsKey.CURRENT_RANDOM_CO:
      case SettingsKey.IS_PLAYING:
        return musicSettings.isPlaying ? playThemeSong() : stopAllSounds();
      case SettingsKey.GAME_TYPE:
      case SettingsKey.ALTERNATE_THEME_DAY:
      case SettingsKey.ALTERNATE_THEMES:
        return window.setTimeout(() => playThemeSong(), 500);
      case SettingsKey.THEME_TYPE:
        return playThemeSong();
      case SettingsKey.REMOVE_EXCLUDED:
        if (musicSettings.excludedRandomThemes.size === 27) musicSettings.randomizeCO();
        return playThemeSong();
      case SettingsKey.EXCLUDED_RANDOM_THEMES:
      case SettingsKey.ADD_EXCLUDED:
        if (musicSettings.excludedRandomThemes.has(musicSettings.currentRandomCO)) musicSettings.randomizeCO();
        return playThemeSong();
      case SettingsKey.RANDOM_THEMES_TYPE: {
        const randomThemes = musicSettings.randomThemesType !== RandomThemeType.NONE;
        if (!randomThemes) return playThemeSong();
        musicSettings.randomizeCO();
        playThemeSong();
        return;
      }
      case SettingsKey.VOLUME: {
        const currentTheme = audioMap.get(currentThemeURL);
        if (currentTheme) currentTheme.volume(musicSettings.volume);
        if (!currentTheme) {
          const intervalID = window.setInterval(() => {
            const currentTheme2 = audioMap.get(currentThemeURL);
            if (currentTheme2) {
              currentTheme2.volume(musicSettings.volume);
              window.clearInterval(intervalID);
            }
          });
        }
        for (const srcURL of audioMap.keys()) {
          const audio = audioMap.get(srcURL);
          if (audio) audio.volume(getVolumeForURL(srcURL));
        }
        return;
      }
    }
  }
  const restartTheme = debounce(300, __restartTheme, true);
  function __restartTheme() {
    const currentTheme = audioMap.get(currentThemeURL);
    if (!currentTheme) return;
    currentTheme.seek(0);
  }
  function clearThemeDelay() {
    currentlyDelaying = false;
    clearTimeout(currentDelayTimeoutID);
    playThemeSong();
  }
  function addThemeListeners() {
    addSettingsChangeListener(onSettingsChange);
    addDatabaseReplacementListener((url) => {
      const audio = audioMap.get(url);
      if (!audio) return;
      logInfo("A new version of", url, " is available. Replacing the old version.");
      if (audio.playing()) audio.stop();
      urlQueue.delete(url);
      promiseMap.delete(url);
      audioMap.delete(url);
      audioIDMap.delete(url);
      preloadURL(url).catch((reason) => logError(reason)).finally(() => playThemeSong());
    });
  }
  addThemeListeners();
  const currentPlayingSFX = /* @__PURE__ */ new Map();
  const powerActivationSFX = /* @__PURE__ */ new Set([
    // GameSFX.powerActivateAllyCOP,
    // GameSFX.powerActivateAllySCOP,
    // GameSFX.powerActivateBHCOP,
    // GameSFX.powerActivateBHSCOP,
    GameSFX.powerActivateAW1COP
  ]);
  async function playSFX(sfx) {
    if (!musicSettings.isPlaying) return;
    if (!musicSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
    if (!musicSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;
    currentPlayingSFX.forEach((valAudio, valType) => {
      if (!valAudio.playing()) currentPlayingSFX.delete(valType);
    });
    if (sfx === GameSFX.powerCOPAvailable || sfx === GameSFX.powerSCOPAvailable) {
      let isActivatingPower = false;
      currentPlayingSFX.forEach((valAudio, valType) => {
        if (valAudio.playing() && powerActivationSFX.has(valType)) isActivatingPower = true;
      });
      if (isActivatingPower) return;
    }
    const sfxURL = getSoundEffectURL(sfx);
    const audio = audioMap.get(sfxURL) ?? await preloadURL(sfxURL);
    audio.volume(getVolumeForURL(sfxURL));
    audio.seek(0);
    if (audio.playing()) return;
    const newID = audio.play();
    if (!newID) return;
    audioIDMap.set(sfxURL, newID);
    currentPlayingSFX.set(sfx, audio);
  }
  function stopSFX(sfx) {
    if (!musicSettings.isPlaying) return;
    const sfxURL = getSoundEffectURL(sfx);
    const audio = audioMap.get(sfxURL);
    if (!audio || !audio.playing()) return;
    audio.stop();
  }
  const CURSOR_THRESHOLD_MS = 25;
  let lastCursorCall$1 = Date.now();
  let lastCursorX = -1;
  let lastCursorY = -1;
  let currentMenuType = "None";
  const visibilityMap = /* @__PURE__ */ new Map();
  const movementResponseMap = /* @__PURE__ */ new Map();
  const clickedDamageSquaresMap = /* @__PURE__ */ new Map();
  const ahQueryTurn = getQueryTurnFn();
  const ahShowEventScreen = getShowEventScreenFn();
  const ahShowEndGameScreen = getShowEndGameScreenFn();
  const ahOpenMenu = getOpenMenuFn();
  const ahCloseMenu = getCloseMenuFn();
  const ahCreateDamageSquares = getCreateDamageSquaresFn();
  const ahUnitClick = getUnitClickFn();
  const ahWait = getWaitFn();
  const ahAnimUnit = getAnimUnitFn();
  const ahAnimExplosion = getAnimExplosionFn();
  const ahFog = getFogFn();
  const ahFire = getFireFn();
  const ahAttackSeam = getAttackSeamFn();
  const ahMove = getMoveFn();
  const ahCapt = getCaptFn();
  const ahBuild = getBuildFn();
  const ahLoad = getLoadFn();
  const ahUnload = getUnloadFn();
  const ahSupply = getSupplyFn();
  const ahRepair = getRepairFn();
  const ahHide = getHideFn();
  const ahUnhide = getUnhideFn();
  const ahJoin = getJoinFn();
  const ahLaunch = getLaunchFn();
  const ahNextTurn = getNextTurnFn();
  const ahElimination = getEliminationFn();
  const ahPower = getPowerFn();
  const ahGameOver = getGameOverFn();
  const ahResign = getResignFn();
  function addHandlers() {
    const currentPageType = getCurrentPageType();
    if (currentPageType === PageType.Maintenance) return;
    addUpdateCursorObserver(onCursorMove);
    switch (currentPageType) {
      case PageType.ActiveGame:
        addReplayHandlers();
        addGameHandlers();
        return;
      case PageType.MapEditor:
        return;
      case PageType.MovePlanner:
        return;
    }
  }
  function syncMusic() {
    const themeTypeBefore = musicSettings.themeType;
    musicSettings.themeType = getCurrentThemeType();
    playThemeSong();
    window.setTimeout(() => {
      musicSettings.themeType = getCurrentThemeType();
      playThemeSong();
    }, 500);
    window.setTimeout(() => {
      musicSettings.themeType = getCurrentThemeType();
      if (themeTypeBefore !== ThemeType.REGULAR && musicSettings.themeType === ThemeType.REGULAR) {
        specialIntroMap.forEach((_introURL, loopURL) => {
          if (loopURL.includes("-cop")) specialIntroMap.delete(loopURL);
        });
      }
      playThemeSong();
    }, 750);
  }
  function refreshMusicForNextTurn(playDelayMS = 0) {
    visibilityMap.clear();
    musicSettings.randomizeCO();
    musicSettings.themeType = getCurrentThemeType();
    const refreshMusic = () => {
      musicSettings.themeType = getCurrentThemeType();
      if (!musicSettings.seamlessLoopsInMirrors) restartTheme();
      if (musicSettings.playIntroEveryTurn) {
        specialIntroMap.clear();
      } else {
        specialIntroMap.forEach((_, url) => {
          if (url.includes("-cop")) {
            specialIntroMap.delete(url);
          }
        });
      }
      if (musicSettings.restartThemes) {
        specialPreloopMap.clear();
      }
      playThemeSong();
      window.setTimeout(playThemeSong, 350);
    };
    if (playDelayMS > 0) window.setTimeout(refreshMusic, playDelayMS);
    else refreshMusic();
  }
  function addReplayHandlers() {
    queryTurn = onQueryTurn;
    const replayForwardActionBtn = getReplayForwardActionBtn();
    const replayBackwardActionBtn = getReplayBackwardActionBtn();
    const replayForwardBtn = getReplayForwardBtn();
    const replayBackwardBtn = getReplayBackwardBtn();
    const replayOpenBtn = getReplayOpenBtn();
    const replayCloseBtn = getReplayCloseBtn();
    const replayDaySelectorCheckBox = getReplayDaySelectorCheckBox();
    window.addEventListener("keydown", function(event) {
      if (!event.key) return;
      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
        syncMusic();
      }
    });
    replayBackwardActionBtn.addEventListener("click", stopAllMovementSounds);
    replayOpenBtn.addEventListener("click", stopAllMovementSounds);
    replayCloseBtn.addEventListener("click", stopAllMovementSounds);
    replayForwardBtn.addEventListener("click", clearThemeDelay);
    replayBackwardActionBtn.addEventListener("click", clearThemeDelay);
    replayBackwardBtn.addEventListener("click", clearThemeDelay);
    const stopExtraSFX = () => {
      stopSFX(GameSFX.powerActivateAW1COP);
    };
    replayBackwardActionBtn.addEventListener("click", stopExtraSFX);
    replayForwardBtn.addEventListener("click", stopExtraSFX);
    replayBackwardBtn.addEventListener("click", stopExtraSFX);
    replayCloseBtn.addEventListener("click", stopExtraSFX);
    replayBackwardActionBtn.addEventListener("click", syncMusic);
    replayForwardActionBtn.addEventListener("click", syncMusic);
    replayForwardBtn.addEventListener("click", syncMusic);
    replayBackwardBtn.addEventListener("click", syncMusic);
    replayDaySelectorCheckBox.addEventListener("change", syncMusic);
    replayCloseBtn.addEventListener("click", syncMusic);
    replayOpenBtn.addEventListener("click", syncMusic);
  }
  function addGameHandlers() {
    showEventScreen = onShowEventScreen;
    showEndGameScreen = onShowEndGameScreen;
    openMenu = onOpenMenu;
    closeMenu = onCloseMenu;
    createDamageSquares = onCreateDamageSquares;
    unitClickHandler = onUnitClick;
    waitUnit = onUnitWait;
    animUnit = onAnimUnit;
    animExplosion = onAnimExplosion;
    updateAirUnitFogOnMove = onFogUpdate;
    actionHandlers.Fire = onFire;
    actionHandlers.AttackSeam = onAttackSeam;
    actionHandlers.Move = onMove;
    actionHandlers.Capt = onCapture;
    actionHandlers.Build = onBuild;
    actionHandlers.Load = onLoad;
    actionHandlers.Unload = onUnload;
    actionHandlers.Supply = onSupply;
    actionHandlers.Repair = onRepair;
    actionHandlers.Hide = onHide;
    actionHandlers.Unhide = onUnhide;
    actionHandlers.Join = onJoin;
    actionHandlers.Launch = onLaunch;
    actionHandlers.NextTurn = onNextTurn;
    actionHandlers.Elimination = onElimination;
    actionHandlers.Power = onPower;
    actionHandlers.GameOver = onGameOver;
    actionHandlers.Resign = onResign;
    addConnectionErrorObserver(onConnectionError);
  }
  function onCursorMove(cursorX, cursorY) {
    if (!musicSettings.isPlaying) return;
    const dx = Math.abs(cursorX - lastCursorX);
    const dy = Math.abs(cursorY - lastCursorY);
    const cursorMoved = dx >= 1 || dy >= 1;
    const timeSinceLastCursorCall = Date.now() - lastCursorCall$1;
    if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;
    if (cursorMoved) {
      playSFX(GameSFX.uiCursorMove);
      lastCursorCall$1 = Date.now();
    }
    lastCursorX = cursorX;
    lastCursorY = cursorY;
  }
  function onQueryTurn(gameId, turn, turnPId, turnDay, replay2, initial) {
    const result = ahQueryTurn == null ? void 0 : ahQueryTurn.apply(ahQueryTurn, [gameId, turn, turnPId, turnDay, replay2, initial]);
    if (!musicSettings.isPlaying) return result;
    if (initial) {
      syncMusic();
    } else {
      refreshMusicForNextTurn(250);
    }
    return result;
  }
  function onShowEventScreen(event) {
    ahShowEventScreen == null ? void 0 : ahShowEventScreen.apply(ahShowEventScreen, [event]);
    if (!musicSettings.isPlaying) return;
    if (hasGameEnded()) {
      refreshMusicForNextTurn();
      return;
    }
    playThemeSong();
  }
  function onShowEndGameScreen(event) {
    ahShowEndGameScreen == null ? void 0 : ahShowEndGameScreen.apply(ahShowEndGameScreen, [event]);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onOpenMenu(menu, x, y) {
    ahOpenMenu == null ? void 0 : ahOpenMenu.apply(openMenu, [menu, x, y]);
    if (!musicSettings.isPlaying) return;
    currentMenuType = "Regular";
    playSFX(GameSFX.uiMenuOpen);
    const menuOptions = getCurrentDocument().getElementsByClassName("menu-option");
    for (let i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
      menuOptions[i].addEventListener("click", (event) => {
        var _a, _b, _c, _d, _e, _f;
        const target = event.target;
        if (!target) return;
        if (target.classList.contains("forbidden") || ((_a = target.parentElement) == null ? void 0 : _a.classList.contains("forbidden")) || ((_c = (_b = target.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.classList.contains("forbidden")) || ((_f = (_e = (_d = target.parentElement) == null ? void 0 : _d.parentElement) == null ? void 0 : _e.parentElement) == null ? void 0 : _f.classList.contains("forbidden"))) {
          playSFX(GameSFX.uiInvalid);
          return;
        }
        currentMenuType = "None";
        playSFX(GameSFX.uiMenuOpen);
      });
    }
  }
  function onCloseMenu() {
    ahCloseMenu == null ? void 0 : ahCloseMenu.apply(closeMenu, []);
    if (!musicSettings.isPlaying) return;
    const isMenuOpen = currentMenuType !== "None";
    if (isMenuOpen) {
      playSFX(GameSFX.uiMenuClose);
      clickedDamageSquaresMap.clear();
      currentMenuType = "None";
    }
  }
  function onCreateDamageSquares(attackerUnit, unitsInRange, movementInfo, movingUnit) {
    ahCreateDamageSquares == null ? void 0 : ahCreateDamageSquares.apply(createDamageSquares, [attackerUnit, unitsInRange, movementInfo, movingUnit]);
    if (!musicSettings.isPlaying) return;
    for (const damageSquare of getAllDamageSquares()) {
      damageSquare.addEventListener("click", (event) => {
        if (!event.target) return;
        const targetSpan = event.target;
        playSFX(GameSFX.uiMenuOpen);
        if (clickedDamageSquaresMap.has(targetSpan)) {
          currentMenuType = "None";
          clickedDamageSquaresMap.clear();
          return;
        }
        currentMenuType = "DamageSquare";
        clickedDamageSquaresMap.set(targetSpan, true);
      });
    }
  }
  function onUnitClick(clicked) {
    ahUnitClick == null ? void 0 : ahUnitClick.apply(unitClickHandler, [clicked]);
    if (!musicSettings.isPlaying) return;
    const unitInfo = getUnitInfo(Number(clicked.id));
    if (!unitInfo) return;
    const myID2 = getMyID();
    const isUnitWaited = hasUnitMovedThisTurn(unitInfo.units_id);
    const isMyUnit = (unitInfo == null ? void 0 : unitInfo.units_players_id) === myID2;
    const isMyTurn = currentTurn === myID2;
    const canActionsBeTaken = !isUnitWaited && isMyUnit && isMyTurn && !isReplayActive();
    currentMenuType = canActionsBeTaken ? "UnitSelect" : "None";
    playSFX(GameSFX.uiUnitSelect);
  }
  function onUnitWait(unitId) {
    ahWait == null ? void 0 : ahWait.apply(waitUnit, [unitId]);
    if (!musicSettings.isPlaying) return;
    if (movementResponseMap.has(unitId)) {
      const response = movementResponseMap.get(unitId);
      if (response == null ? void 0 : response.trapped) {
        playSFX(GameSFX.unitTrap);
      }
      stopMovementSound(unitId, !(response == null ? void 0 : response.trapped));
      movementResponseMap.delete(unitId);
      return;
    }
    stopMovementSound(unitId);
  }
  function onAnimUnit(path, unitId, unitSpan, unitTeam, viewerTeam, i) {
    ahAnimUnit == null ? void 0 : ahAnimUnit.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
    if (!musicSettings.isPlaying) return;
    if (!isValidUnit(unitId) || !path || !i) return;
    if (i >= path.length) return;
    if (visibilityMap.has(unitId)) return;
    const unitVisible = path[i].unit_visible;
    if (!unitVisible) {
      visibilityMap.set(unitId, unitVisible);
      window.setTimeout(() => stopMovementSound(unitId, false), 1e3);
    }
  }
  function onAnimExplosion(unit) {
    ahAnimExplosion == null ? void 0 : ahAnimExplosion.apply(animExplosion, [unit]);
    if (!musicSettings.isPlaying) return;
    const unitId = unit.units_id;
    const unitFuel = unit.units_fuel;
    let sfx = GameSFX.unitExplode;
    if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
      sfx = GameSFX.unitMissileHit;
    }
    playSFX(sfx);
    stopMovementSound(unitId, false);
  }
  function onFogUpdate(x, y, mType, neighbours, unitVisible, change, delay) {
    ahFog == null ? void 0 : ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
    if (!musicSettings.isPlaying) return;
    const unitInfo = getUnitInfoFromCoords(x, y);
    if (!unitInfo) return;
    if (change === "Add") {
      window.setTimeout(() => stopMovementSound(unitInfo.units_id, true), delay);
    }
  }
  function onFire(response) {
    if (!musicSettings.isPlaying) {
      ahFire == null ? void 0 : ahFire.apply(actionHandlers.Fire, [response]);
      return;
    }
    const attackerID = response.copValues.attacker.playerId;
    const defenderID = response.copValues.defender.playerId;
    const couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
    const couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
    const couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
    const couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
    ahFire == null ? void 0 : ahFire.apply(actionHandlers.Fire, [response]);
    const delay = areAnimationsEnabled() ? 750 : 0;
    const canAttackerActivateSCOPAfter = canPlayerActivateSuperCOPower(attackerID);
    const canAttackerActivateCOPAfter = canPlayerActivateCOPower(attackerID);
    const canDefenderActivateSCOPAfter = canPlayerActivateSuperCOPower(defenderID);
    const canDefenderActivateCOPAfter = canPlayerActivateCOPower(defenderID);
    const madeSCOPAvailable = !couldAttackerActivateSCOPBefore && canAttackerActivateSCOPAfter || !couldDefenderActivateSCOPBefore && canDefenderActivateSCOPAfter;
    const madeCOPAvailable = !couldAttackerActivateCOPBefore && canAttackerActivateCOPAfter || !couldDefenderActivateCOPBefore && canDefenderActivateCOPAfter;
    window.setTimeout(() => {
      if (madeSCOPAvailable) playSFX(GameSFX.powerSCOPAvailable);
      else if (madeCOPAvailable) playSFX(GameSFX.powerCOPAvailable);
    }, delay);
  }
  function onAttackSeam(response) {
    ahAttackSeam == null ? void 0 : ahAttackSeam.apply(actionHandlers.AttackSeam, [response]);
    if (!musicSettings.isPlaying) return;
    const seamWasDestroyed = response.seamHp <= 0;
    if (seamWasDestroyed) {
      playSFX(GameSFX.unitAttackPipeSeam);
      playSFX(GameSFX.unitExplode);
      return;
    }
    window.setTimeout(() => playSFX(GameSFX.unitAttackPipeSeam), attackDelayMS);
  }
  function onMove(response, loadFlag) {
    ahMove == null ? void 0 : ahMove.apply(actionHandlers.Move, [response, loadFlag]);
    if (!musicSettings.isPlaying) return;
    const unitId = response.unit.units_id;
    movementResponseMap.set(unitId, response);
    const movementDist = response.path.length;
    stopMovementSound(unitId, false);
    if (movementDist > 1) {
      playMovementSound(unitId);
    }
  }
  function onCapture(data) {
    ahCapt == null ? void 0 : ahCapt.apply(actionHandlers.Capt, [data]);
    if (!musicSettings.isPlaying) return;
    const finishedCapture = data.newIncome != null;
    if (!finishedCapture) {
      playSFX(GameSFX.unitCaptureProgress);
      return;
    }
    const myID2 = getMyID();
    const isSpectator = isPlayerSpectator(myID2);
    const isMyCapture = data.buildingInfo.buildings_team === myID2.toString() || isSpectator;
    const sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
    playSFX(sfx);
  }
  function onBuild(data) {
    ahBuild == null ? void 0 : ahBuild.apply(actionHandlers.Build, [data]);
    if (!musicSettings.isPlaying) return;
    const myID2 = getMyID();
    const isMyBuild = data.newUnit.units_players_id == myID2;
    const isReplay = isReplayActive();
    if (!isMyBuild || isReplay) playSFX(GameSFX.unitSupply);
  }
  function onLoad(data) {
    ahLoad == null ? void 0 : ahLoad.apply(actionHandlers.Load, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitLoad);
  }
  function onUnload(data) {
    ahUnload == null ? void 0 : ahUnload.apply(actionHandlers.Unload, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitUnload);
  }
  function onSupply(data) {
    ahSupply == null ? void 0 : ahSupply.apply(actionHandlers.Supply, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitSupply);
  }
  function onRepair(data) {
    ahRepair == null ? void 0 : ahRepair.apply(actionHandlers.Repair, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitSupply);
  }
  function onHide(data) {
    ahHide == null ? void 0 : ahHide.apply(actionHandlers.Hide, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitHide);
    stopMovementSound(data.unitId);
  }
  function onUnhide(data) {
    ahUnhide == null ? void 0 : ahUnhide.apply(actionHandlers.Unhide, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitUnhide);
    stopMovementSound(data.unitId);
  }
  function onJoin(data) {
    ahJoin == null ? void 0 : ahJoin.apply(actionHandlers.Join, [data]);
    if (!musicSettings.isPlaying) return;
    stopMovementSound(data.joinID);
    stopMovementSound(data.joinedUnit.units_id);
  }
  function onLaunch(data) {
    ahLaunch == null ? void 0 : ahLaunch.apply(actionHandlers.Launch, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitMissileSend);
    window.setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
  }
  function onNextTurn(data) {
    ahNextTurn == null ? void 0 : ahNextTurn.apply(actionHandlers.NextTurn, [data]);
    if (!musicSettings.isPlaying) return;
    if (data.swapCos) {
      playSFX(GameSFX.tagSwap);
    }
    refreshMusicForNextTurn();
  }
  function onElimination(data) {
    ahElimination == null ? void 0 : ahElimination.apply(actionHandlers.Elimination, [data]);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onGameOver() {
    ahGameOver == null ? void 0 : ahGameOver.apply(actionHandlers.GameOver, []);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onResign(data) {
    ahResign == null ? void 0 : ahResign.apply(actionHandlers.Resign, [data]);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onPower(data) {
    ahPower == null ? void 0 : ahPower.apply(actionHandlers.Power, [data]);
    if (!musicSettings.isPlaying) return;
    const coName = data.coName;
    isBlackHoleCO(coName);
    const isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
    stopSFX(GameSFX.powerCOPAvailable);
    stopSFX(GameSFX.powerSCOPAvailable);
    musicSettings.themeType = isSuperCOPower ? ThemeType.SUPER_CO_POWER : ThemeType.CO_POWER;
    let gameType = musicSettings.gameType;
    if (musicSettings.randomThemesType === RandomThemeType.ALL_THEMES) {
      gameType = musicSettings.currentRandomGameType;
    }
    switch (gameType) {
      case GameType.AW1:
        playSFX(GameSFX.powerActivateAW1COP);
        stopThemeSong(4500);
        return;
    }
    if (coName === "Colin" && !isSuperCOPower) {
      window.setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
    }
  }
  function onConnectionError(closeMsg) {
    closeMsg = closeMsg.toLowerCase();
    if (closeMsg.includes("connected to another game")) stopThemeSong();
  }
  let debugOverrides = false;
  function toggleDebugOverrides() {
    debugOverrides = !debugOverrides;
    if (debugOverrides) {
      for (const coName of getAllCONames()) {
        musicSettings.addOverride(coName, GameType.AW1);
        musicSettings.addExcludedRandomTheme(coName);
      }
    } else {
      for (const coName of getAllCONames()) {
        musicSettings.removeOverride(coName);
        musicSettings.removeExcludedRandomTheme(coName);
      }
    }
  }
  function onLiveQueue() {
    const addMusicFn = () => {
      const blockerPopup = getLiveQueueBlockerPopup();
      if (!blockerPopup) return false;
      if (blockerPopup.style.display === "none") return false;
      const popup = getLiveQueueSelectPopup();
      if (!popup) return false;
      const box = popup.querySelector(".flex.row.hv-center");
      if (!box) return false;
      getMusicPlayerUI().addToAWBWPage(box, true);
      playMusicURL(SpecialTheme.COSelect);
      return true;
    };
    const checkStillActiveFn = () => {
      const blockerPopup = getLiveQueueBlockerPopup();
      return (blockerPopup == null ? void 0 : blockerPopup.style.display) !== "none";
    };
    const addPlayerIntervalID = window.setInterval(() => {
      if (getCurrentPageType() !== PageType.LiveQueue) {
        window.clearInterval(addPlayerIntervalID);
        return;
      }
      if (!addMusicFn()) return;
      window.clearInterval(addPlayerIntervalID);
      const checkInterval = window.setInterval(() => {
        if (getCurrentPageType() !== PageType.LiveQueue) {
          window.clearInterval(checkInterval);
          playThemeSong();
          return;
        }
        if (checkStillActiveFn()) playMusicURL(SpecialTheme.COSelect);
        else playThemeSong();
      }, 500);
    }, 500);
  }
  let setHashesTimeoutID;
  function preloadThemes() {
    addThemeListeners();
    preloadAllCommonAudio(() => {
      logInfo("All common audio has been pre-loaded!");
      musicSettings.themeType = getCurrentThemeType();
      getMusicPlayerUI().updateAllInputLabels();
      playThemeSong();
      window.setTimeout(playThemeSong, 500);
      if (!setHashesTimeoutID) {
        const checkHashesMS = 1e3 * 60 * 1;
        const checkHashesFn = () => {
          checkHashesInDB().then(() => logInfo("All music files have been checked for updates.")).catch((reason) => logError("Could not check for music file updates:", reason));
          setHashesTimeoutID = window.setTimeout(checkHashesFn, checkHashesMS);
        };
        checkHashesFn();
      }
      getMusicPlayerUI().checkIfNewVersionAvailable();
    });
  }
  let lastCursorCall = Date.now();
  function initializeMusicPlayer() {
    const currentPageType = getCurrentPageType();
    if (currentPageType !== PageType.ActiveGame) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
    switch (currentPageType) {
      case PageType.LiveQueue:
        onLiveQueue();
        break;
      case PageType.Maintenance:
        getMusicPlayerUI().openContextMenu();
        break;
      case PageType.MovePlanner:
        musicSettings.isPlaying = true;
        break;
    }
    preloadThemes();
    initializeMusicPlayerUI();
    allowSettingsToBeSaved();
    addHandlers();
    const iframe = document.getElementById(IFRAME_ID);
    iframe == null ? void 0 : iframe.addEventListener("focus", () => {
      if (musicSettings.isPlaying) playThemeSong();
    });
    window.addEventListener("focus", () => {
      if (musicSettings.isPlaying) playThemeSong();
    });
    broadcastChannel.onmessage = (ev) => {
      logDebug("Received message from another tab:", ev.data);
      if (ev.data === "pause") stopThemeSong();
      else if (ev.data === "play") playThemeSong();
    };
    const fn = (_e) => {
      const timeSinceLastCursorCall = Date.now() - lastCursorCall;
      if (!musicSettings.sfxOnOtherPages) return;
      if (timeSinceLastCursorCall < 80) return;
      playSFX(GameSFX.uiMenuMove);
      lastCursorCall = Date.now();
    };
    const addSFXToPage = () => {
      getCurrentDocument().querySelectorAll("a").forEach(
        (link) => link.addEventListener("click", () => {
          if (!musicSettings.sfxOnOtherPages) return;
          playSFX(GameSFX.uiMenuOpen);
        })
      );
      const hoverElements = Array.from(
        getCurrentDocument().querySelectorAll("li, ul, .dropdown-menu, .co_portrait, a, input, button")
      );
      hoverElements.forEach((menu) => menu.addEventListener("mouseenter", fn));
    };
    addSFXToPage();
    let overDiv = document.querySelector("#overDiv");
    if (!overDiv) {
      overDiv = document.createElement("div");
      overDiv.id = "overDiv";
      overDiv.style.visibility = "hidden";
      overDiv.style.position = "absolute";
      overDiv.style.zIndex = "2000";
      document.appendChild(overDiv);
    }
    const overDivObserver = new MutationObserver(() => {
      if (overDiv.style.visibility === "visible") addSFXToPage();
    });
    overDivObserver.observe(overDiv, { attributes: true });
  }
  let autoplayChecked = false;
  function checkAutoplayThenInitialize() {
    logDebug("Checking if we can autoplay then initializing the music player.");
    if (autoplayChecked) {
      initializeMusicPlayer();
      return;
    }
    autoplayChecked = true;
    const ifCanAutoplay = () => {
      initializeMusicPlayer();
    };
    const ifCannotAutoplay = () => {
      var _a;
      const initfn = () => {
        window.clearInterval(autoplayIntervalID);
        initializeMusicPlayer();
      };
      getMusicPlayerUI().addEventListener("click", initfn, { once: true });
      (_a = document.querySelector("body")) == null ? void 0 : _a.addEventListener("click", initfn, { once: true });
    };
    const autoplayIntervalID = window.setInterval(() => {
      canAutoplay2.audio().then((response) => {
        const result = response.result;
        logDebug("Script starting, does your browser allow you to auto-play:", result);
        if (result) {
          ifCanAutoplay();
          window.clearInterval(autoplayIntervalID);
        } else ifCannotAutoplay();
      }).catch((reason) => {
        logDebug("Script starting, could not check your browser allows auto-play so assuming no: ", reason);
        ifCannotAutoplay();
      });
    }, 100);
  }
  async function main() {
    if (self !== top) return;
    const isMainPage = getCurrentPageType() === PageType.MainPage;
    if (!isMainPage && !window.location.href.includes(".php")) return;
    logInfo("Trying different websites to fetch music data from");
    const possibleBaseURL = await getWorkingBaseURL();
    if (!possibleBaseURL) {
      logError("Could not load data from any URL, stopping music player. Possibly ISP blocked?");
      return;
    }
    logInfo("Using", possibleBaseURL, "double-checking...", getNeutralImgURL());
    getMusicPlayerUI();
    loadSettingsFromLocalStorage();
    logInfo("Opening database to cache music files.");
    openDB().then(() => logInfo("Database opened successfully. Ready to cache music files.")).catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`)).finally(() => {
      var _a, _b;
      if (getCurrentPageType() === PageType.Maintenance) {
        checkAutoplayThenInitialize();
        const startTime = Date.now();
        const maintenanceDiv = document.querySelector("#server-maintenance-alert");
        if (!maintenanceDiv) return;
        const currentText = maintenanceDiv.textContent;
        const minutesStr = (_a = currentText == null ? void 0 : currentText.match(/\d+m/)) == null ? void 0 : _a[0].replace("m", "");
        const secondsStr = (_b = currentText == null ? void 0 : currentText.match(/\d+s/)) == null ? void 0 : _b[0].replace("s", "");
        if (!minutesStr || !secondsStr) return;
        const minutes = parseInt(minutesStr);
        const totalSeconds = parseInt(secondsStr) + minutes * 60;
        const ID = window.setInterval(() => {
          const elapsedMS = Date.now() - startTime;
          const elapsedSeconds = elapsedMS / 1e3;
          const secondsLeft = totalSeconds - elapsedSeconds;
          const displayMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
          const displaySeconds = String(Math.floor(secondsLeft % 60)).padStart(2, "0");
          const displayMS = String(Math.floor(secondsLeft % 1 * 1e3)).padStart(3, "0");
          maintenanceDiv.innerHTML = `The site is currently down for daily maintenance. Please try again in ${displayMinutes}m ${displaySeconds}s ${displayMS}ms. <br> This automatic message is brought to you by the AWBW Improved Music Player.`;
          maintenanceDiv.style.fontFamily = "Chivo Mono, monospace";
          maintenanceDiv.style.fontSize = "16";
          if (secondsLeft <= 0) {
            window.clearInterval(ID);
            maintenanceDiv.textContent = "The site is back up! Please refresh the page to continue.";
            window.location.reload();
          }
        }, 1);
        return;
      }
      initializeIFrame(checkAutoplayThenInitialize);
    });
  }
  main();
  exports.checkAutoplayThenInitialize = checkAutoplayThenInitialize;
  exports.initializeMusicPlayer = initializeMusicPlayer;
  exports.notifyCOSelectorListeners = notifyCOSelectorListeners;
  exports.toggleDebugOverrides = toggleDebugOverrides;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
}({}, canAutoplay, SparkMD5);
