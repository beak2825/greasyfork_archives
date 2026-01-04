// ==UserScript==
// @name         Stein UI Styles
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Change UI elements
// @author       Cullenn with RinUnderscore
// @match        https://*.stein.world/game*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/461830/Stein%20UI%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/461830/Stein%20UI%20Styles.meta.js
// ==/UserScript==

(function(){
    'use strict';
    GM_addStyle(`

/* GLOBAL SECTION START */

.stein-window{
    background: rgba(0, 0, 0, 0.4);
}

.stein-window-container:not(.stein-name-panel):not(.stein-hub-frame-news-entry):not(.stein-hub-frame-help-entry):not(#stein-options-frame-global):not(#stein-options-frame-keybindings):not(#stein-options-frame-interface):not(#stein-options-frame-sound):not(#stein-options-frame-chat):not(#stein-hub-frame-news-display):not(#stein-chat-content-container):not(#stein-professions-gather):not(#stein-context-menu):not(#stein-professions-workbench-craft-progress)
{
    background: rgba(0, 0, 0, 0.1);
}

/* GLOBAL SECTION END */


/* PROFESSION SECTION START */

#stein-professions-window-frame{
    position: absolute;
}

#stein-professions-overview-level-label{
    display: none;
}

#stein-professions-overview-level{
    display: none;
}

/* PROFESSION SECTION END */


/* INVENTORY SECTION START */

/* INVENTORY SECTION END */

/* PLAYER FRAME SECTION START */

#stein-player-forms{
	width: 576px;
    position: absolute;
    left: calc(50vw - 292px);
    top: calc(100vh - 129px);
    background-color: unset;
    border: unset;
    box-shadow: unset;
}

#stein-player-resources{
	display: flex;
	background-color: #bc9266;
}

.stein-player-resource.stein-window-container{
	width: 33%;
	text-align: center;
	font-size: 15px;
}

.stein-buff-time-text{
	width: 32px;
	margin-left: 3px;
	font-size: 20px;
}

#stein-player-buffs{
	left: unset;
	top: -55px;
}

#stein-player-forms .stein-name-panel{
	width: 32%;
}

/* PLAYERFRAME SECTION END */


/* PARTY FRAME SECTION START */

div#stein-party-invite:before{
    content: "Party ";
}

#stein-party-container{
position: absolute;
    left: 350px;
    width: 350px;
}

/* PARTY FRAME SECTION END */


/* DIALOG SECTION START */

#stein-dialog-window-frame{
	position: absolute;
	bottom: 121px;
	width: 566px;
}

#stein-dialog-window{
	width: calc(100% - 10px);
	max-width: unset !important;
}

/* DIALOG SECTION END */


/* TARGET FRAME SECTION START */

#stein-target-container{
	position: absolute;
	left: calc(50vw + 77px);
	top: calc(100vh - 201px);
}

.stein-target-resource.stein-window-container{
	text-align: center;
	font-size: 15px;
}

#stein-target-buffs{
	right: unset;
	width: 215px;
	top: -55px;
	display: unset;
	flex-wrap: unset;
	flex-direction: unset;
	left: -3px;
	font-size: 20px;
}

#stein-target-forms{
    border: 2px solid rgb(38, 33, 25);
}

/* TARGET FRAME SECTION END */


/* STAT WINDOW SECTION START */

#stein-stats-window-frame{
    position: absolute;
    top: 250px;
    width: 338px;
    height: calc(100vh - 512px);
}

#stein-stats-window-frame table{
    font-size: 16px;
}

.stat-name{
    width: 145px;
}

#stein-stats-window-frame tr{
    background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar{
    color: rgba(0,0,0, 0.5);
}

::-webkit-scrollbar-thumb{
    background-color: rgba(0,0,0, 0.5);
}

.stein-stats-title:nth-of-type(1) {
    display: none;
}

/* STAT WINDOW SECTION END */


/* NEED/GREED WINDOW SECTION START */

.stein-need-or-greed {
    margin-bottom: 45px;
    margin-right: 320px;
}

/* NEED/GREED WINDOW SECTION END */

`);


const mapDiv = document.querySelector('#stein-map-window'),
      mapZoneRoot = document.querySelector('#stein-map-root-zone-name'),
      mapZone = document.querySelector('#stein-map-zone-name'),
      mapCompass = document.querySelector('#stein-map-compass'),
      mapButtons = document.querySelector('#stein-map-buttons'),
      mapClose = document.querySelector('#stein-map-window-close-button'),
      mapTitle = document.querySelector('#stein-map-window .stein-window-top .stein-text-border'),
      mapBackground = document.querySelector('#stein-map-window-container'),
      mapShortcut = document.querySelector('#stein-map-toggle-button'),
      mapContainer = document.querySelector('#stein-map-container-inner');

let miniMapVisible;

let mapSync = new KeyboardEvent('keypress', {
    bubbles: true,
    cancelable: true,
    key: 'm'
});

function showMiniMap(e){
    if(e != undefined){e.preventDefault();}
    mapDiv.style.display = '';
    mapDiv.style.width = '350px';
    mapDiv.style.height = '250px';
    mapZoneRoot.style.display = 'none';
    mapZone.style.top = '-100px'; // display: 'none' keeps getting reset
    mapCompass.style.display = 'none';
    mapButtons.style.display = 'none';
    mapClose.style.display = 'none';
    mapTitle.innerText = 'MINI MAP';
    mapBackground.style.background = 'unset';
    miniMapVisible = true;
    document.querySelector('#stein-map-container').dispatchEvent(new WheelEvent('wheel', {deltaY: -1}));
}

function hideMiniMap(e){
    if(e != undefined){e.preventDefault();}
    mapDiv.style.display = '';
    mapDiv.style.width = '';
    mapDiv.style.height = '';
    mapZoneRoot.style.display = 'block';
    mapZone.style.top = '50px';
    mapCompass.style.display = 'unset';
    mapButtons.style.display = 'unset';
    mapClose.style.display = 'unset';
    mapTitle.innerText = 'WORLD MAP';
    mapBackground.style.background = '#bc9266'
    miniMapVisible = false;
    document.querySelector('#stein-map-container').dispatchEvent(new WheelEvent('wheel', {deltaY: 1}));
}

function toggleMiniMap(e){
    if(e.code == 'KeyM' || e.key == 'm' || e.keyCode == 27){
        if(e.keyCode == 27){
            setTimeout(function(){document.dispatchEvent(mapSync);}, 1); // We just killed whatever is hooked up to actively updating the map, pretend to open the map again
        }
        if(miniMapVisible && e.keyCode != 27){
            hideMiniMap(e);
        }
        else if(!miniMapVisible){
            showMiniMap(e);
            setTimeout(function(){document.dispatchEvent(mapSync);}, 1);
            setTimeout(function(){document.dispatchEvent(mapSync);}, 1);
        }
    }
}
function delayedInitLoop(){
    setTimeout(function(){

        // Remove HP Bar Code Removed

        if(document.querySelector('.stein-quick-bar-slot[style*="border"]')){
            //currentQuickbarItemObserver.observe(document.querySelector('.stein-quick-bar-slot[style*="border"]'), currentQuickbarItemConfig);
        }

        if(mapZone.innerText == 'Unknown' && mapContainer != undefined){
            document.dispatchEvent(mapSync);
            delayedInitLoop();
        }
    }, 1000)
};

document.addEventListener('keydown', toggleMiniMap);

//These also kill whatever is hooked up to actively updating the map despite preventDefault being called (I'm probably missing something), so again we pretend to open the map after to get that working again
mapClose.addEventListener('click', function(e){showMiniMap(e); setTimeout(function(){document.dispatchEvent(mapSync);}, 1);});
mapShortcut.addEventListener('click', function(e){hideMiniMap(e); setTimeout(function(){document.dispatchEvent(mapSync);}, 1);});

// Run it on load once
showMiniMap();

// Zoom out a bit
for(let n of Array(10)){
    document.querySelector('#stein-map-container').dispatchEvent(new WheelEvent('wheel', {deltaY: 100}));
}

// Looping this instead of just one timeout call so it still works after logging out to switch servers
delayedInitLoop();

})();
