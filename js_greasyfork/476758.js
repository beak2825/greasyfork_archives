// ==UserScript==
// @name         GeoGuessr Nininbaori Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test
// @author       kemilton
// @match        https://www.geoguessr.com/*
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476758/GeoGuessr%20Nininbaori%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/476758/GeoGuessr%20Nininbaori%20Mode.meta.js
// ==/UserScript==


// Your code here...

const classicGameGuiClasses = ["section_sectionHeader__", "bars_root__", "start-standard-game_settings__", "game-options_optionLabel__"];
const classicGameGuiHTML = () => `
    <div class="${cn("section_sectionHeader__")} ${cn("section_sizeMedium__")}"><div class="${cn("bars_root__")} ${cn("bars_center__")}"><div class="${cn("bars_before__")} ${cn("bars_lengthLong__")}"></div><span class="${cn("bars_content__")}"><h3>Nininbaori Mode settings</h3></span><div class="${cn("bars_after__")} ${cn("bars_lengthLong__")}"></div></div></div>
    <div class="${cn("start-standard-game_settings__")}">
    <div style="display: flex; justify-content: space-around;">
        <div style="display: flex; align-items: center;">
        <span class="${cn("game-options_optionLabel__")}" style="margin: 0; padding-right: 6px;">Hide Panorama</span>
        <input type="checkbox" id="enableHidePanorama" onclick="toggleHidePanoramaMode(this)" class="${cn("toggle_toggle__")}">
        </div>
    </div>
    <div style="display: flex; justify-content: space-around;">
        <div style="display: flex; align-items: center;">
        <span class="${cn("game-options_optionLabel__")}" style="margin: 0; padding-right: 6px;">Hide Map</span>
        <input type="checkbox" id="enableHideMap" onclick="toggleHideMapMode(this)" class="${cn("toggle_toggle__")}">
        </div>
    </div>
    </div>
    `

const friendLobbyGuiClasses = ["section_sectionHeader__", "bars_root__", "game-options_optionLabel__"];
const friendLobbyGuiHTML = () => `
    <div class="${cn("section_sectionHeader__")} ${cn("section_sizeMedium__")}" style="margin-top: 10px"><div class="${cn("bars_root__")}"><span class="${cn("bars_content__")}"><h2>Nininbaori Mode Settings</h2></span><div class="${cn("bars_after__")} ${cn("bars_lengthLong__")}"></div></div></div>
    <div class="${cn("start-standard-game_settings__")}" style="margin-top: 8px">
    <div style="display: flex; justify-content: space-around;">
        <div style="display: flex; align-items: center;">
        <span class="${cn("game-options_optionLabel__")}" style="margin: 0; padding-right: 6px;">Hide Panorama</span>
        <input type="checkbox" id="enableHidePanorama" onclick="toggleHidePanoramaMode(this)" class="${cn("toggle_toggle__")}">
        </div>
    </div>
    <div style="display: flex; justify-content: space-around;">
        <div style="display: flex; align-items: center;">
        <span class="${cn("game-options_optionLabel__")}" style="margin: 0; padding-right: 6px;">Hide Map</span>
        <input type="checkbox" id="enableHideMap" onclick="toggleHideMapMode(this)" class="${cn("toggle_toggle__")}">
        </div>
    </div>
    </div>
    `

const guiHeaderClasses = ["header_item__", "quick-search_wrapper__", "slanted-wrapper_root__", "label_sizeXSmall__", "toggle_toggle__"];
const guiHTMLHeader = () => `
    <div id="blinkHeaderToggle" class="${cn("header_item__")}">
    <div class="${cn("quick-search_wrapper__")}">
        <div class="${cn("slanted-wrapper_root__")} ${cn("slanted-wrapper_variantGrayTransparent__")}">
        <div class="${cn("slanted-wrapper_start__")} ${cn("slanted-wrapper_right__")}"></div>
        <div class="${cn("quick-search_searchInputWrapper__")}">
            <div id="popup" style="background: rgba(26, 26, 46, 0.9); padding: 15px; width: 200px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="${cn("label_sizeXSmall__")}">Hide Panorama</span>
                <input type="checkbox" id="enableHidePanoramaHeader" class="${cn("toggle_toggle__")}" onclick="toggleHidePanoramaMode(this)">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="${cn("label_sizeXSmall__")}">Hide Map</span>
                <input type="checkbox" id="enableHideMapHeader" class="${cn("toggle_toggle__")}" onclick="toggleHideMapMode(this)">
            </div>
            </div>
            <button style="width: 59.19px" id="headerGuiToggle" class="${cn("quick-search_searchInputButton__")}"><picture style="justify-content: center" class="${cn("quick-search_iconSection__")}"><img src="https://www.svgrepo.com/show/40039/eye.svg" style="width: 15px; filter: brightness(0) invert(1); opacity: 60%;"></picture></button>
        </div>
        <div class="${cn("slanted-wrapper_end__")} ${cn("slanted-wrapper_right__")}"></div>
        </div>
    </div>
    </div>
    `

const guiPartyHeaderClasses = ["header_item__", "slanted-wrapper_root__", "game-options_optionLabel__"];
const guiPartyHeader = () => `
    <div id="blinkHeaderToggle" class="${cn("header_item__")}" style="margin-right: 1rem;">
    <div id="popup" style="background: rgba(26, 26, 46, 0.9); padding: 15px; width: 200px; border-radius: 10px; z-index: 999;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="${cn("game-options_optionLabel__")}">Hide Panorama</span>
        <input type="checkbox" id="enableHidePanoramaHeader" class="${cn("toggle_toggle__")}" onclick="toggleHidePanoramaMode(this)">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="${cn("game-options_optionLabel__")}">Hide Map</span>
        <input type="checkbox" id="enableHideMapHeader" class="${cn("toggle_toggle__")}" onclick="toggleHideMapMode(this)">
        </div>
    </div>
    <div class="${cn("quick-search_wrapper__")}">
        <div class="${cn("slanted-wrapper_root__")} ${cn("slanted-wrapper_variantGrayTransparent__")}">
        <div class="${cn("slanted-wrapper_start__")} ${cn("slanted-wrapper_right__")}"></div>
        <div>
            <button id="headerGuiToggle" style="width: 59.19px; background-color: inherit;border: initial;cursor: pointer;min-height: 2rem;min-width: 2rem;padding: var(--padding-y) var(--padding-x);"><picture style="justify-content: center" class="${cn("quick-search_iconSection__")}"><img src="https://www.svgrepo.com/show/40039/eye.svg" style="width: 15px; filter: brightness(0) invert(1); opacity: 60%;"></picture></button>
        </div>
        <div class="${cn("slanted-wrapper_end__")} ${cn("slanted-wrapper_right__")}"></div>
        </div>
    </div>
    </div>
    `

if (localStorage.getItem('hidePanoramaEnabled') == null) {
    localStorage.setItem('hidePanoramaEnabled', 'disabled');
}

if (localStorage.getItem('hideMapEnabled') == null) {
    localStorage.setItem('hideMapEnabled', 'disabled');
}

window.toggleHidePanoramaMode = (e) => {
    localStorage.setItem('hidePanoramaEnabled', e.checked ? 'enabled' : 'disabled');
    if (!e.checked) {
        try { showPanoramaCached(); } catch {}
    }

    if (document.querySelector('#enableHidePanorama')) {
        document.querySelector('#enableHidePanorama').checked = e.checked;
    }

    if (document.querySelector('#enableHidePanoramaHeader')) {
        document.querySelector('#enableHidePanoramaHeader').checked = e.checked;
    }
}

window.toggleHideMapMode = (e) => {
    localStorage.setItem('hideMapEnabled', e.checked ? 'enabled' : 'disabled');
    if (!e.checked) {
        try { showMapCached(); } catch {}
    }

    if (document.querySelector('#enableHideMap')) {
        document.querySelector('#enableHideMap').checked = e.checked;
    }
    if (document.querySelector('#enableHideMapHeader')) {
        document.querySelector('#enableHideMapHeader').checked = e.checked;
    }
}

const insertHeaderGui = (header, gui) => {
    header.insertAdjacentHTML('afterbegin', gui);
    const showButton = document.querySelector('#headerGuiToggle');
    const popup = document.querySelector('#popup');
    popup.style.display = 'none';

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target == popup || popup.contains(target)) return;
        if (target.matches('#headerGuiToggle, #headerGuiToggle *')) {
            e.preventDefault();

            popup.style.display = 'block';
            Popper.createPopper(showButton, popup, {
                placement: 'bottom',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 10],
                        },
                    },
                ],
            });
        } else {
            popup.style.display = 'none';
        }

        if (document.querySelector('#enableHidePanoramaHeader')) {
            if (localStorage.getItem('hidePanoramaEnabled') === 'enabled') {
                document.querySelector('#enableHidePanoramaHeader').checked = true;
            }
        }
        if (document.querySelector('#enableHideMapHeader')) {
            if (localStorage.getItem('hideMapEnabled') === 'enabled') {
                document.querySelector('#enableHideMapHeader').checked = true;
            }
        }
    });
}

const checkInsertGui = () => {
    // Play page for classic games
    if (document.querySelector('[class*=radio-box_root__]') && document.querySelector('#enableHidePanorama') === null && checkAllStylesFound(classicGameGuiClasses)) {
        document.querySelector('[class*=section_sectionMedium__]').insertAdjacentHTML('beforeend', classicGameGuiHTML());
        if (localStorage.getItem('hidePanoramaEnabled') === 'enabled') {
            document.querySelector('#enableHidePanorama').checked = true;
        }
    }

    if (document.querySelector('[class*=radio-box_root__]') && document.querySelector('#enableHideMap') === null && checkAllStylesFound(classicGameGuiClasses)) {
        document.querySelector('[class*=section_sectionMedium__]').insertAdjacentHTML('beforeend', classicGameGuiHTML());
        if (localStorage.getItem('hideMapEnabled') === 'enabled') {
            document.querySelector('#enableHideMap').checked = true;
        }
    }

    // Lobby for friends party games
    if (document.querySelector('[class*=game-options_root__]') && document.querySelector('#enableHidePanorama') === null && checkAllStylesFound(friendLobbyGuiClasses)) {
        document.querySelector('[class*=game-options_optionGroup__]').insertAdjacentHTML('beforeend', friendLobbyGuiHTML());
        if (localStorage.getItem('hidePanoramaEnabled') === 'enabled') {
            document.querySelector('#enableHidePanorama').checked = true;
        }
    }

    if (document.querySelector('[class*=game-options_root__]') && document.querySelector('#enableHideMap') === null && checkAllStylesFound(friendLobbyGuiClasses)) {
        document.querySelector('[class*=game-options_optionGroup__]').insertAdjacentHTML('beforeend', friendLobbyGuiHTML());
        if (localStorage.getItem('hideMapEnabled') === 'enabled') {
            document.querySelector('#enableHideMap').checked = true;
        }
    }

    // Header
    if (document.querySelector('[class*=header_header__]') && document.querySelector('#blinkHeaderToggle') === null && checkAllStylesFound(guiHeaderClasses)) {
        insertHeaderGui(document.querySelector('[class*=header_context__]'), guiHTMLHeader())
    } else if (document.querySelector('[class*=party-header_root__]') && document.querySelector('#blinkHeaderToggle') === null && checkAllStylesFound(guiPartyHeaderClasses)) {
        insertHeaderGui(document.querySelector('[class*=party-header_right__]'), guiPartyHeader())
    }
}

let panoRoot = null;
function hidePanorama() {
    panoRoot = document.querySelector('.mapsConsumerUiSceneInternalCoreScene__root') || panoRoot;
    hidePanoramaCached();
}

function hidePanoramaCached() {
    panoRoot.style.filter = 'brightness(0%)';
}

function showPanorama() {
    panoRoot = document.querySelector('.mapsConsumerUiSceneInternalCoreScene__root') || panoRoot;
    showPanoramaCached();
}

function showPanoramaCached() {
    panoRoot.style.filter = 'brightness(100%)';
}

let mapRoot = null;
function hideMap() {
    mapRoot = document.querySelector('.guess-map') || mapRoot;
    hideMapCached();
}

function hideMapCached() {
    mapRoot.style.display = 'none';
}

function showMap() {
    mapRoot = document.querySelector('.guess-map') || mapRoot;
    showMapCached();
}

function showMapCached() {
    mapRoot.style.display = 'block';
}

function isLoading() {
    return document.querySelector('[class*=fullscreen-spinner_root__]') || !document.querySelector('.widget-scene-canvas');
}

let wasBackdropThereOrLoading = false;
function isBackdropThereOrLoading() {
    return isLoading() // loading
    || document.querySelector('[class*=result-layout_root__]') // classic
    || document.querySelector('[class*=overlay_backdrop__]') // duels / team duels
    || document.querySelector('[class*=game_backdrop__]') || document.querySelector('[class*=overlays_backdrop__]') // live challenges
    || document.querySelector('[class*=popup_backdrop__]') // BR
    || document.querySelector('[class*=game-starting_container__]') || document.querySelector('[class*=round-score_container__]') // bullseye
    || document.querySelector('[class*=overlay-modal_backlight__]'); // city streaks
}

let played = false;

const checkStatus = () => {
    if (!(location.pathname.startsWith('/duels'))) {
        return;
    }
    let timer = document.querySelector("[class^='clock-timer_timerContainer__']");
    let stress = document.querySelector("[class^='stress-indicator_container__']");
    if ((timer !== null) && !played && (stress == null)) {
        showPanorama();
        showMap();
        played = true;
    } else if (timer == null) {
        played = false;
    }
}

let observer = new MutationObserver((mutations) => {

    scanStyles().then(_ => { checkInsertGui(); });

    if (localStorage.getItem('hidePanoramaEnabled') === 'enabled') {
        if (isBackdropThereOrLoading()) {
            wasBackdropThereOrLoading = true;
            if (!isLoading()) hidePanorama();
        } else if (wasBackdropThereOrLoading) {
            wasBackdropThereOrLoading = false;
            hidePanorama();
        }
        checkStatus();
    }

    if (localStorage.getItem('hideMapEnabled') === 'enabled') {
        if (isBackdropThereOrLoading()) {
            wasBackdropThereOrLoading = true;
            if (!isLoading()) hideMap();
        } else if (wasBackdropThereOrLoading) {
            wasBackdropThereOrLoading = false;
            hideMap();
        }
        checkStatus();
    }
});

observer.observe(document.body, {
    characterDataOldValue: false,
    subtree: true,
    childList: true,
    characterData: false
});