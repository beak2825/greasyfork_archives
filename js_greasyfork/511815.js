// ==UserScript==
// @name         AWBW Maximise
// @version      2.54
// @description  Maximise the useable game area and reorder elements
// @author       Truniht
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @match        https://awbw.amarriner.com/moveplanner.php?*
// @match        https://awbw.amarriner.com/prevmaps.php?maps_id=*
// @icon         https://awbw.amarriner.com/terrain/ani/gemegatank.gif
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://awbw.amarriner.com/
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511815/AWBW%20Maximise.user.js
// @updateURL https://update.greasyfork.org/scripts/511815/AWBW%20Maximise.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) return;
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    var settings = GM_getValue('AWBWMaximise') || {};

    var styleAdded = false;
    function addStyle() {
        if (styleAdded) return;
        styleAdded = true;
        addGlobalStyle(`
html.AWBWMaximise {
  image-rendering: pixelated;
  scrollbar-width: thin;
}

.AWBWMaximise body {
  overflow-x: hidden;
  transform: translateZ(0);
}

.AWBWMaximise #left-side-menu-container {
  position: fixed;
  top: 100vh;
  right: 0;
  opacity: 0.33;
  height: 30px;
  overflow: hidden;
  background: white;
  transform: translateY(-100%);
  z-index: 500;
}

.AWBWMaximise #left-side-menu-fixed-wrapper {
  position: absolute;
  display: block !important;
}
.AWBWMaximise #left-side-menu-fixed-wrapper:hover {
  z-index: 10000;
}

.AWBWMaximise #left-side-menu-fixed-wrapper .right-arrow {
  display: none;
}
.AWBWMaximise #left-side-menu-fixed-wrapper .green-bold {
  margin-top: 3px;
}

.AWBWMaximise #left-side-menu-container:hover {
  opacity: 1;
  height: auto;
}

.AWBWMaximise #outer {margin: 0;  width: 100%;  background: none;}
.AWBWMaximise #main {min-height: 100vh; box-shadow: none;}
.AWBWMaximise #game-header-table {
  position: absolute;
  top: -500px;
}

.AWBWMaximise #zoom-in,
.AWBWMaximise #zoom-out,
.AWBWMaximise #game-menu-controls > section:first-child > .game-tools-btn:nth-child(4) {
  display: none;
}

.AWBWMaximise #game-menu-controls section {
  /*Keep drop down menu on top*/
  z-index: auto !important;
}

.AWBWMaximise #game-map-menu-dropdown>a:not(.menu_option) {
  display: block;
  width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 2px;
}

.AWBWMaximise #game-map-menu-dropdown>a:not(.menu_option):before {
  content: "Map: ";
  color: black;
  display: block;
}


.AWBWMaximise .menu-follow {
  text-align: center;
  display: flex !important;
}

.AWBWMaximise .menu-follow * {
  margin: 0 !important;
  border-left: 0;
  border-right: 0;
  opacity: 1 !important;
}

.AWBWMaximise .game-damage-display {
  pointer-events: none;
}

.AWBWMaximise .game-header-day {
  position: fixed !important;
  right: 20px;
  border: 1px solid grey;
  background: white;
  padding: 5px;  width: 72px;
  white-space: nowrap;
  min-width: fit-content;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) .game-header-day {
  transform: scale(1.5);
  transform-origin: top left;
}

.AWBWMaximise #fixed-header-wrapper {
  display: none;
}
.AWBWMaximise#main>.small_text_11 {
  display: none;
}
.AWBWMaximise #game-menu-controls:not(:hover) section > *:not(#coords):not(#game-map-menu),
.AWBWMaximise #game-menu-controls:not(:hover) #game-map-menu>.game-tools-btn {
  opacity: 0.2;
}

.game-tools-btn-text.small_text {
  pointer-events: none;
}

.AWBWMaximise #gamemap-container {
  margin-left: -360px;
  margin-bottom: 0;
  overflow: unset !important;
}
.AWBWMaximise #main > span {
  display: none;
}

.AWBWMaximise #map-controls-container {
  position: fixed;
}

.AWBWMaximise #map-controls-container:hover {
  z-index: 101;
}

.AWBWMaximise #game-menu-controls {
  justify-content: end;
  width: 240px;
}

.AWBWMaximise .replay-controls {
  background: none;
  padding: 0;
  border: 1px solid rgba(128, 128, 128, 0.2);
  top: auto !important;
}

.AWBWMaximise #game-menu-controls:hover .replay-controls {
  border: 1px solid grey;
}

.AWBWMaximise.AWBWMaximise4players:not(.AWBWMaximiseNoUIScale) .game-player-info {
  transform: scale(1.2);
  transform-origin: top left;
  z-index: 2;
}

@media screen and (min-height: 600px) {
  .AWBWMaximise:not(.AWBWMaximiseNoUIScale):not(.AWBWMaximise8players):not(.AWBWMaximise4players) .game-player-info {
    transform: scale(1.2);
    transform-origin: top left;
    z-index: 2;
  }
}

@media screen and (min-height: 800px) {
  .AWBWMaximise:not(.AWBWMaximiseNoUIScale):not(.AWBWMaximise8players):not(.AWBWMaximise4players) .game-player-info {
    transform: scale(1.5);
    transform-origin: top left;
    z-index: 2;
  }
}

.AWBWMaximise .game-player-info {
  height: auto !important;
  max-height: 60vh;
  overflow-x: clip;
}

.AWBWMaximise .player-username {
  max-width: 110px;
  display: inline-block;
}

.AWBWMaximise:not(.AWBWMaximiseMovePlanner) #coords {
  position: fixed;
  margin-left: -1px;
  margin-top: 2px;
  height: 19px !important;
  right: 0;
  top: -149px;
  background: none;
  border: 0;
  color: white;
}

.AWBWMaximise:not(.AWBWMaximiseMovePlanner):not(.AWBWMaximiseNoUIScale) #coords {
  transform: scale(1.2);
  transform-origin: top center;
}

.AWBWMaximise .tile-info {
  left: 100% !important;
  margin-left: 4px;
  bottom: auto !important;
  padding-top: 14px;
  right: auto !important;
  min-width: 75px;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) .tile-info {
  transform: scale(1.5);
  transform-origin: top left;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) .end-game-screen {
  transform: scale(1.5);
}

.AWBWMaximise .replay-download {
  display: none !important;
}

.AWBWMaximise .game-actions {
  position: absolute;
  margin: 0;
  top: -145px;
  right: 0;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) .game-actions {
  transform: scale(1.5);
  transform-origin: top right;
}


.AWBWMaximise .game-actions * {
  opacity: 1 !important;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) #calculator {
  transform: scale(1.5);
  transform-origin: top left;
}

.AWBWMaximise .italic {
  font-style: normal !important;
}

.AWBWMaximise .player-overview-hover-buildings {
  right: -150%;
  left: auto;
  bottom: auto;
  top: 1em;
}

.AWBWMaximise .replay-day-selector-dropdown {
  position: absolute;
  left: -84px;
  top: -147px;
  opacity: 1 !important;
  background: white;
  border: 1px solid gray;
  min-width: 120px;
  width: fit-content;
  padding-left: 6px;
  transform-origin: top right;
  height: 33px;
  box-sizing: border-box;
  color: black;
white-space: nowrap;
display: flex;
}

.AWBWMaximise .replay-day-selector-dropdown-selected {
display: inline-flex;
white-space: nowrap;
height: 31px;
box-sizing: border-box;
width: 80px;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) .replay-day-selector-dropdown {
  transform: scale(1.5);
  transform-origin: top left;
}

.AWBWMaximise .replay-day-selector-dropdown:before {
  content: "Day";
  padding-right: 8px;
  line-height: 31px;
  display: inline-block;
  vertical-align: top;
}

.AWBWMaximise .replay-day-selector-dropdown-options-wrapper {
background: white;
max-height: 40vh;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) .replay-day-selector-dropdown-options-wrapper {
transform: scale(0.66666666);
transform-origin: top;
}

.AWBWMaximise .replay-day-selector-dropdown select {
  font-size: 16px;
  border: 0;
  background: transparent;
  color: black;
  font-weight: bold;
  outline: none;
}

.AWBWMaximise .replay-controls>* {
  opacity: 1;
}

.AWBWMaximise .player-overview-info {
  min-width: 80px;
}

.AWBWMaximise .msg-warning {
  opacity: 1 !important;
}

.AWBWMaximise #game-map-menu .game-tools-bg .norm2 .small_text {
  display: none;
}

.AWBWMaximise #game-map-menu .game-tools-btn {
  width: 60px !important;
}

.AWBWMaximise .game-player-info textarea {
  background: transparent !important;
  max-width: 95% !important;
}

.AWBWMaximise .AWBWMaxmiseButton {
  border-left-width: 1px !important;
}

.AWBWMaximise #music-player-parent #div-context-menu {
  margin-left: -140px !important;
}

.AWBWMaximise #music-player-settings.cls-settings-menu {
  transform: translateX(-50%);
  margin-right: -33px;
}

.AWBWMaximise #live-queue-popup {
  position: absolute;
}

.AWBWMaximise #live-queue-status-popup {
  bottom: unset;
  top: 100vh;
  transform: translateY(-100%);
  margin-top: -40px;
}

.AWBWMaximise #game-map-menu-dropdown-info {
top: 0px !important;
  left: auto !important;
  right: 300px !important;
}

.AWBWMaximise:not(.AWBWMaximiseNoUIScale) #game-map-menu-dropdown-info {
  transform: scale(1.5);
  transform-origin: right;
}

.AWBWMaximise #game-map-menu-dropdown-info #showinfo {
  margin-top: 0 !important;
}


.AWBWMaximiseMovePlanner.AWBWMaximise #main {
  justify-content: flex-start !important;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #replay-container>div:last-child {
  position: fixed !important;
  right: 115px !important;
  top: 170px !important;
  z-index: 10;
}

.AWBWMaximiseMovePlanner.AWBWMaximise:not(.AWBWMaximiseNoUIScale) #replay-container>div:last-child {
  transform: scale(1.2);
  transform-origin: top right;
}


.AWBWMaximiseMovePlanner.AWBWMaximise .js-end-turn-btn {
  margin-left: 15px !important;
}

.AWBWMaximise #map-controls-container {
  z-index: 1;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #map-controls-container {
  top: 35px;
  right: 10px;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #game-header-table-old {
  position: relative; z-index: 1;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #game-controls-table {
  margin-left: 0;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #gamecontainer {
  align-items: flex-start !important;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #gamemap-container {
  margin-left: 10px;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #coords {
  position: fixed;
  height: 19px !important;
  right: 15px;
  top: 80px;
}

.AWBWMaximiseMovePlanner.AWBWMaximise:not(.AWBWMaximiseNoUIScale) #coords {
  transform: scale(1.2);
}

.AWBWMaximiseMovePlanner.AWBWMaximise #options-menu,
.AWBWMaximiseMovePlanner.AWBWMaximise #build-menu {
  transform: scale(0.7);
  transform-origin: top left;
}

.AWBWMaximiseMovePlanner.AWBWMaximise #options-menu li:first-child,
.AWBWMaximiseMovePlanner.AWBWMaximise #build-menu li:first-child {
  padding-top: 6px;
  padding-bottom: 6px;
}

.AWBWMaximiseMovePlanner.AWBWMaximise .awbwenhancements-sidebar-inner-container {
  overflow-x: hidden;
}
    `);
    }

    var mapNameParent;
    var mapLink;
    var settingsButton;

    function saveSettings() {
        GM_setValue('AWBWMaximise', settings);
    }

    function removeElement(ele) {
        if (ele && ele.parentElement) ele.parentElement.removeChild(ele);
    }

    function scaleSettingHandler(evt) {
        settings.evenScale = settingsButton.querySelector('select[name="AWBWMaximiseScaleSetting"]').value * 1;
        settings.uiScale = settingsButton.querySelector('select[name="AWBWMaximiseUIScaleSetting"]').value * 1;
        if (settings.uiScale) document.documentElement.classList.add('AWBWMaximiseNoUIScale');
        else document.documentElement.classList.remove('AWBWMaximiseNoUIScale');
        maximise();
        saveSettings();
    }

    function addSettingsButton() {
        if (settingsButton) return;
        settingsButton = document.createElement('tr');
        var selectedSetting1 = settings.evenScale === 1 ? ' selected="selected"' : '';
        var selectedSetting2 = settings.evenScale === 2 ? ' selected="selected"' : '';
        var selectedSetting3 = settings.evenScale === 3 ? ' selected="selected"' : '';
        var selectedSettingUIScale = settings.uiScale ? ' selected="selected"' : '';
        settingsButton.innerHTML = `<td class="borderwhite" style="border-top: 0"><table style="width: 100%;">
        <tr>
        <td colspan="2" style="padding-bottom: 2px;"><span class="small_text">
        <b style="padding-right:2px;">Maximise settings</b>
        </span></td>
        </tr>
        <tr>
        <td width="80" style="padding-left: 2px; padding-bottom: 2px;"><span class="small_text">
        <b style="padding-right:2px;">Scale:</b>
        </span></td>
        <td width="80" style="padding-right: 2px; padding-bottom: 2px;">
        <select style="width:100%;" align="right" name="AWBWMaximiseScaleSetting">
            <option value="0">Full screen</option>
            <option value="1"${selectedSetting1}>Even only</option>
            <option value="2"${selectedSetting2}>Even 2+</option>
            <option value="3"${selectedSetting3}>Max 2x</option>
        </select>
        </td>
        </tr>
        <tr>
        <td width="80" style="padding-left: 2px; padding-bottom: 2px;"><span class="small_text">
        <b style="padding-right:2px;">UI Scaling:</b>
        </span></td>
        <td width="80" style="padding-right: 2px; padding-bottom: 2px;">
        <select style="width:100%;" align="right" name="AWBWMaximiseUIScaleSetting">
            <option value="0">On</option>
            <option value="1"${selectedSettingUIScale}>Off</option>
        </select>
        </td>
        </tr>
        </table></td>`;
        document.querySelector('#showview tbody').appendChild(settingsButton);
        settingsButton.querySelectorAll('select').forEach(e => {e.onchange = scaleSettingHandler;});
    }

    function maximise() {
        if (!settings.active) return;
        if (!styleAdded) addStyle();
        document.documentElement.classList.add('AWBWMaximise');
        //We always start from scale one to achieve consistent results
        unsafeWindow.scale = 1;
        if (unsafeWindow.scaleAdd) unsafeWindow.scaleAdd(0);
        else if (unsafeWindow.applyScale) unsafeWindow.applyScale(0);

        //Calculate the correct resizing setting
        var container = isMovePlanner ? document.getElementById('map-background') : document.getElementById('gamemap-container');
        var containerWidth = container.offsetWidth / unsafeWindow.scale;
        var containerHeight = container.offsetHeight / unsafeWindow.scale;
        var windowHeight = window.innerHeight;
        if (isMovePlanner) windowHeight -= 180;

        var scaleRounding = settings.evenScale == 1 ? 1 : 10; //Scale to a full multiple or evenly
        var scaleFactor = Math.min( (window.innerWidth - leftSpacing - 20) / containerWidth, (windowHeight - 4) / containerHeight); //Keep 350px for the player element on the right side
        unsafeWindow.scale = Math.floor(scaleFactor * scaleRounding) / scaleRounding; //The scaling rounds to tenths so we need to do so as well
        if (settings.evenScale == 2 && unsafeWindow.scale > 2) unsafeWindow.scale = Math.floor(unsafeWindow.scale);
        if (settings.evenScale == 3 && unsafeWindow.scale > 2) unsafeWindow.scale = 2;
        if (unsafeWindow.scaleAdd) unsafeWindow.scaleAdd(0);
        else if (unsafeWindow.applyScale) unsafeWindow.applyScale(0);

        if (isMovePlanner) document.getElementById('replay-container').style.marginLeft = Math.max(0, Math.floor((window.innerWidth - container.offsetWidth * unsafeWindow.scale - 390) / 2)) + 'px';

        if (!isMovePlanner) {
            //Move elements to menu
            var dropdown = document.getElementById('game-map-menu-dropdown');
            if (dropdown) dropdown.appendChild(document.querySelector('.menu-follow'));

            moveElements(); //Reposition elements
            if (!mapLink) {
                mapLink = document.querySelector('.game-header-info:last-child a');
                mapNameParent = mapLink.parentElement;
            }
            dropdown.appendChild(mapLink);
            addSettingsButton();
        }
    }

    function reset() {
        document.documentElement.classList.remove('AWBWMaximise');
        if (!isMovePlanner && !isMap) {
            document.getElementById('map-controls-container').style.top = '';
            document.getElementById('map-controls-container').style.right = '';
            document.querySelector('.game-header-day').style.left = '';
            document.querySelector('.game-header-day').style.top = '';
            document.querySelector('.game-header-day').style.display = '';
            document.querySelector('.tile-info').style.top = '';
            var coord = document.querySelector('#coords');
            coord.style.display = '';
            coord.style.left = '';
            coord.style.top = '';
            //Place menu items back
            document.querySelector('.game-actions').parentElement.insertBefore(document.querySelector('.menu-follow'), document.querySelector('.game-actions'));
            mapNameParent.appendChild(mapLink);
        }
        removeElement(settingsButton);
        settingsButton = undefined;

        unsafeWindow.scale = settings.oldZoom;
        if (unsafeWindow.scaleAdd) unsafeWindow.scaleAdd(0);
        else if (unsafeWindow.applyScale) unsafeWindow.applyScale(0);
        if (isMovePlanner) document.getElementById('replay-container').style.marginLeft = '';
    }

    function displayCoords() {
        if (!settings.active) return;
        if (isMovePlanner) return;
        if (isMap) return;

        var coord = document.getElementById('coords');
        if (document.querySelector('.tile-info').style.display != 'none') {
            coord.style.display = '';
        }
        else {
            coord.style.display = 'none';
        }
    }

    function moveElements() {
        if (!settings.active) return;
        if (isMovePlanner) return;
        if (isMap) return;

        var scrollY = window.scrollY;
        //Get the positions of the map and the player container
        var playerEle = document.body.querySelector('.game-player-info');
        var mapRight = document.getElementById('gamemap-container').getBoundingClientRect().right;
        var lastPlayer = playerEle.getBoundingClientRect();
        playerEle.style.overflowY = lastPlayer.height >= window.innerHeight * 0.59 ? 'scroll' : 'visible'; //Make sure the playerEle hides max height overflow
        var mapRect = document.getElementById('gamemap-container').getBoundingClientRect();

        var mapControl = document.getElementById('map-controls-container');
        //Move the menu buttons
        mapControl.style.left = (mapRight + 95) + 'px';
        mapControl.style.top = (lastPlayer.bottom + 160 + scrollY) + 'px';

        //Move the day counter
        var header = document.querySelector('.game-header-day');
        header.style.left = (mapRight + 10) + 'px';
        header.style.top = Math.min(window.innerHeight - 100, (lastPlayer.bottom + 10 + scrollY)) + 'px';

        //Move the tile info / hover info
        var tileInfo = document.querySelector('.tile-info');
        tileInfo.style.top = Math.min(window.innerHeight - 100 - mapRect.top, lastPlayer.bottom + 75 - mapRect.top) + 'px';
        var tileB = tileInfo.getBoundingClientRect();

        //Place the coordinate info on top of the tile info
        if (tileB.width) {
            var coord = document.getElementById('coords');
            coord.style.display = '';
            coord.style.left = (mapRight + 2) + 'px';
            coord.style.top = (tileB.top + scrollY - 2) + 'px';
        }

        if (document.querySelector('.replay-controls').style.display != 'none') {
            header.style.display = 'none';
        }
        else {
            header.style.display = '';
        }

        var replayFixed = document.querySelector('.replay-controls-fixed');
        if (replayFixed) {
            document.getElementById('game-menu-controls').appendChild(replayFixed);
            replayFixed.classList.remove('replay-controls-fixed');
        }
    }

    function buttonClick() {
        if (!settings.active) settings.oldZoom = unsafeWindow.scale;
        settings.active = !settings.active;
        if (settings.active) maximise();
        else reset();
        saveSettings();
    }

    var isReplay = unsafeWindow.location.toString().indexOf('&ndx=') > 0 && unsafeWindow.location.toString().indexOf('&ndx=NaN') === -1;
    var isMovePlanner = unsafeWindow.location.toString().indexOf('moveplanner') > 0;
    var isMap = unsafeWindow.location.toString().indexOf('prevmaps.php?maps_id') > 0;
    var initiated = false;
    var leftSpacing = 350;

    function contentLoadedInit() {
        if (isReplay && unsafeWindow.updateReplayState) { //Check if updateReplayState exists just to be safe
            var oldReplayState = unsafeWindow.updateReplayState;
            unsafeWindow.updateReplayState = function() {
                document.body.style.opacity = "1";
                unsafeWindow.updateReplayState = oldReplayState;
                return oldReplayState.call(this, ...arguments);
            };
        }
        else document.body.style.opacity = "1"; //Reveal it
        init();
    }

    function init() {
        if (initiated) return;
        if (isMap) {
            //Return to a normal zoom level for map preview
            if (settings.active && unsafeWindow.scale > settings.oldZoom) unsafeWindow.scale = settings.oldZoom;
            if (settings.active && unsafeWindow.scale > 2) unsafeWindow.scale = 2;
            return;
        }
        unsafeWindow.addEventListener('scroll', moveElements);
        unsafeWindow.addEventListener('resize', maximise);
        //Create the maximise button
        var button = document.createElement('div');
        button.className = 'game-tools-btn AWBWMaxmiseButton';
        button.innerText = '🗖';
        if (isMovePlanner) button.style.borderRightWidth = '0';
        else button.style.borderLeftWidth = '0';
        var buttonDescription = document.createElement('span');
        buttonDescription.innerText = 'Maximise';
        buttonDescription.className = 'game-tools-btn-text small_text';
        button.appendChild(buttonDescription);
        button.onclick = buttonClick;
        var ele = document.getElementById('game-map-menu');
        if (!ele) {
            //Moveplanner
            ele = document.getElementById('zoom-out');
            ele.parentNode.insertBefore(button, ele);
        }
        else {
            ele.parentNode.insertBefore(button, document.querySelector('.game-tools-btn:nth-child(4)').nextElementSibling);
        }
        initiated = true;

        if (isMovePlanner) document.documentElement.classList.add('AWBWMaximiseMovePlanner');
        if (Object.keys(playersInfo).length >= 5) document.documentElement.classList.add('AWBWMaximise8players');
        if (Object.keys(playersInfo).length == 4) document.documentElement.classList.add('AWBWMaximise4players');
        if (settings.uiScale) document.documentElement.classList.add('AWBWMaximiseNoUIScale');
        if (settings.active) maximise();

        if (isMovePlanner) return; //We do not have to do the rest

        var damageElement = document.querySelector('.game-damage-display');
        function keepTargetInfoInView() {
            //Make sure target damage preview does not exit the top of the screen
            if (settings.active && parseFloat(damageElement.style.top) && parseFloat(damageElement.style.top) < 0) damageElement.style.top = 0;
        }
        const observer = new MutationObserver(keepTargetInfoInView);
        observer.observe(damageElement, { childList: true, subtree: true, attributes: true });

        setInterval(moveElements, 250); //Not the most efficient way, but reliable
        setInterval(displayCoords, 100);
    }

    function loadFallBack() {
        document.body.style.opacity = "1";
        init();
    }

    if (document.readyState === "complete") init(); //The page is already ready
    else {
        if (settings.active && !isMap && !isMovePlanner) addGlobalStyle(`body {opacity: 0.01;}`); //Hide the body while loading, needs to be 0.01 and not 0 to prevent a rendering bug in firefox
        document.addEventListener("DOMContentLoaded", contentLoadedInit);
        if (!isReplay) setTimeout(loadFallBack, 2000); //When not loading a replay, always init after 2 seconds regardless of domcontentloaded
    }
})();