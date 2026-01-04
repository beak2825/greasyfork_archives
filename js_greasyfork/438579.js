// ==UserScript==
// @name         Geoguessr Blink Mode
// @description  Shows the round briefly, then screen goes black and you have unlimited time to make your guess.
// @version      1.3.8
// @author       macca7224
// @license      MIT
// @match        https://www.geoguessr.com/*
// @require      https://unpkg.com/@popperjs/core@2.11.5/dist/umd/popper.min.js
// @grant        none
// @require      https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @namespace    https://greasyfork.org/en/scripts/438579-geoguessr-blink-mode
// @icon         https://www.svgrepo.com/show/40039/eye.svg
// @downloadURL https://update.greasyfork.org/scripts/438579/Geoguessr%20Blink%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/438579/Geoguessr%20Blink%20Mode.meta.js
// ==/UserScript==

const guiEnabled = true
//                 ^^^^ Set to false (all lowercase) if you want to hide the GUI and manually enable the script/set the time, otherwise true

let timeLimit = 1.5
//              ^^^ Modify this number above to change the time

let roundDelay = 0
//               ^ Modify this number above to change the length of time the round is delayed for



// --------- DON'T MODIFY ANYTHING BELOW THIS LINE -------- //


const styleElement = document.createElement("style");
document.head.appendChild(styleElement);
styleElement.innerHTML = `
.toggle_toggle__ {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: var(--ds-color-white-10);
    border: 0;
    border-radius: 2rem;
    cursor: pointer;
    display: inline-block;
    height: 1.25rem;
    position: relative;
    transition: background-color .2s ease;
    width: 2.5rem;
}

.toggle_toggle__:checked {
    background: var(--ds-color-brand-50);
}

.toggle_toggle__:after {
    background: var(--ds-color-white);
    border-radius: 100%;
    content: "";
    height: 1rem;
    left: 0;
    margin: .125rem;
    opacity: .1;
    position: absolute;
    top: 0;
    transition: transform .1s ease,opacity .1s ease;
    width: 1rem;
}

.toggle_toggle__:checked:after {
    opacity: 1;
    transform: translateX(125%);
}

.toggle_toggle__:before {
    background: var(--ds-color-purple-50);
    content: "";
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity .3s ease;
    width: 100%;
}`;

const classicGameGuiClasses = ["map-selector_selector__"];
const classicGameGuiHTML = () => `
<div style="width: 30rem; max-width: 80vw; text-align: center; margin: 0 auto;">
<h2 style="margin-bottom: 20px; font-style: italic;">Blink Mode settings</h2>
<div>
  <div style="display: flex; justify-content: space-around;">
    <div style="display: flex; align-items: center;">
      <span style="margin: 0; padding-right: 6px;">Enabled</span>
      <input type="checkbox" id="enableScript" onclick="toggleBlinkMode(this)" class="toggle_toggle__">
    </div>

    <div style="display: flex; align-items: center;">
      <span style="margin: 0; padding-right: 6px;">Time (Seconds)</span>
      <input type="text" id="blinkTime" onchange="changeBlinkTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
    </div>
  </div>
  <div style="margin-top: 10px">
    <span style="margin: 0; padding-right: 6px;">Round Delay (Seconds)</span>
    <input type="text" id="delayTime" onchange="changeDelayTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
  </div>
</div>
</div>
`

const friendLobbyGuiClasses = ["section_sectionHeader__", "bars_root__", "toggle-option_wrapper__"];
const friendLobbyGuiHTML = () => `
<div class="${cn("settings-modal_settingsSection__")}">
<div class="${cn("section_sectionHeader__")} ${cn("section_sizeMedium__")} ${cn("section_variantLight__")}">
  <div class="${cn("bars_root__")}">
    <span class="${cn("bars_content__")}"><h2>Blink Mode Settings</h2></span>
    <div class="${cn("bars_after__")}"></div>
  </div>
</div>
<div class="${cn("settings-modal_section__")}" style="margin-top: 8px">
  <div class="${cn("toggle-option_wrapper__")}">
    <div class="${cn("toggle-option_label__")}">Enabled</div>
    <input type="checkbox" id="enableScript" onclick="toggleBlinkMode(this)" class="toggle_toggle__">
  </div>

  <div class="${cn("numeric-option_wrapper__")}">
    <div class="${cn("numeric-option_label__")}">Time (Seconds)</div>
    <input type="text" id="blinkTime" onchange="changeBlinkTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
  </div>

  <div class="${cn("numeric-option_wrapper__")}">
    <div class="${cn("numeric-option_label__")}">Round Delay (Seconds)</div>
    <input type="text" id="delayTime" onchange="changeDelayTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
  </div>
</div>
</div>
`

const guiHeaderClasses = ["menu-item_container__", "quick-search_wrapper__"];
const guiHTMLHeader = () => `
<div id="blinkHeaderToggle" class="${cn("menu-item_container__")}">
  <div class="${cn("quick-search_wrapper__")}">
    <div class="${cn("slanted-wrapper_root__")} ${cn("slanted-wrapper_variantGrayTransparent__")}">
      <div class="${cn("quick-search_searchInputWrapper__")}">
        <div id="popup" style="background: rgba(26, 26, 46, 0.9); padding: 15px; width: 200px; border-radius: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Enabled</span>
            <input type="checkbox" id="enableScriptHeader" class="toggle_toggle__" onclick="toggleBlinkMode(this)">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span>Time (Seconds)</span>
            <input type="text" id="blinkTimeHeader" onchange="changeBlinkTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span style="margin: 0; padding-right: 6px;">Round Delay (Seconds)</span>
            <input type="text" id="delayTimeHeader" onchange="changeDelayTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
          </div>
        </div>
        <button style="width: 59.19px" id="headerGuiToggle" class="${cn("quick-search_searchInputButton__")}"><picture style="justify-content: center" class="${cn("quick-search_iconSection__")}"><img src="https://www.svgrepo.com/show/40039/eye.svg" style="width: 15px; filter: brightness(0) invert(1); opacity: 100%;"></picture></button>
      </div>
    </div>
  </div>
</div>
`

const guiPartyHeaderClasses = ["header_item__", "slanted-wrapper_root__", "game-options_optionLabel__"];
const guiPartyHeader = () => `
<div id="blinkHeaderToggle" class="${cn("header_item__")}" style="margin-right: 1rem;">
  <div id="popup" style="background: rgba(26, 26, 46, 0.9); padding: 15px; width: 200px; border-radius: 10px; z-index: 999;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="${cn("game-options_optionLabel__")}">Enabled</span>
      <input type="checkbox" id="enableScriptHeader" class="toggle_toggle__" onclick="toggleBlinkMode(this)">
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
      <span class="${cn("game-options_optionLabel__")}">Time (Seconds)</span>
      <input type="text" id="blinkTimeHeader" onchange="changeBlinkTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
      <span class="${cn("game-options_optionLabel__")}" style="margin: 0; padding-right: 6px;">Round Delay (Seconds)</span>
      <input type="text" id="delayTimeHeader" onchange="changeDelayTime(this)" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px;">
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

if (localStorage.getItem('blinkEnabled') == null) {
    localStorage.setItem('blinkEnabled', 'disabled');
}

if (!guiEnabled) {
    localStorage.setItem('blinkEnabled', 'enabled');
}

if (localStorage.getItem('blinkTime') == null || isNaN(localStorage.getItem('blinkTime'))) {
    localStorage.setItem('blinkTime', timeLimit);
}
if (localStorage.getItem('delayTime') == null || isNaN(localStorage.getItem('delayTime'))) {
    localStorage.setItem('delayTime', roundDelay);
}

if (guiEnabled) {
    timeLimit = parseFloat(localStorage.getItem('blinkTime'));
    roundDelay = parseFloat(localStorage.getItem('delayTime'));
}

window.toggleBlinkMode = (e) => {
    localStorage.setItem('blinkEnabled', e.checked ? 'enabled' : 'disabled');
    if (!e.checked) {
        try { showPanoramaCached(); } catch {}
    }

    if (document.querySelector('#enableScript')) {
        document.querySelector('#enableScript').checked = e.checked;
    }
    if (document.querySelector('#enableScriptHeader')) {
        document.querySelector('#enableScriptHeader').checked = e.checked;
    }
}

window.changeBlinkTime = (e) => {
    if (!isNaN(e.value)) {
        localStorage.setItem('blinkTime', parseFloat(e.value));
        timeLimit = parseFloat(e.value);

        if (document.querySelector('#blinkTime')) {
            document.querySelector('#blinkTime').value = e.value;
        }
        if (document.querySelector('#blinkTimeHeader')) {
            document.querySelector('#blinkTimeHeader').value = e.value;
        }
    }
}

window.changeDelayTime = (e) => {
    if (!isNaN(e.value)) {
        localStorage.setItem('delayTime', parseFloat(e.value));
        roundDelay = parseFloat(e.value);

        if (document.querySelector('#delayTime')) {
            document.querySelector('#delayTime').value = e.value;
        }
        if (document.querySelector('#delayTimeHeader')) {
            document.querySelector('#delayTimeHeader').value = e.value;
        }
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

        if (document.querySelector('#enableScriptHeader')) {
            if (localStorage.getItem('blinkEnabled') === 'enabled') {
                document.querySelector('#enableScriptHeader').checked = true;
            }
            document.querySelector('#blinkTimeHeader').value = timeLimit;
            document.querySelector('#delayTimeHeader').value = roundDelay;
        }
    });
}

const checkInsertGui = () => {
    // Play page for classic games
    if (document.querySelector('[class*=map-selector_root__]') && document.querySelector('#enableScript') === null && checkAllStylesFound(classicGameGuiClasses)) {
        document.querySelector('[class*=map-selector_root__]').insertAdjacentHTML('afterend', classicGameGuiHTML());
        if (localStorage.getItem('blinkEnabled') === 'enabled') {
            document.querySelector('#enableScript').checked = true;
        }
        document.querySelector('#blinkTime').value = timeLimit;
        document.querySelector('#delayTime').value = roundDelay;
    }

    // Lobby for friends party games
    if (document.querySelector('[class*=party-modal_heading__]') && document.querySelector('#enableScript') === null && checkAllStylesFound(friendLobbyGuiClasses)) {
        const columns = document.querySelectorAll('[class*=settings-modal_column__]');
        columns[columns.length - 1].insertAdjacentHTML('beforeend', friendLobbyGuiHTML());
        if (localStorage.getItem('blinkEnabled') === 'enabled') {
            document.querySelector('#enableScript').checked = true;
        }
        document.querySelector('#blinkTime').value = timeLimit;
        document.querySelector('#delayTime').value = roundDelay;
    }

    // Header
    if (document.querySelector('[class*=header-desktop_desktopSectionRight__]') && document.querySelector('#blinkHeaderToggle') === null && checkAllStylesFound(guiHeaderClasses)) {
        insertHeaderGui(document.querySelector('[class*=header-desktop_desktopSectionRight__]'), guiHTMLHeader())
    } else if (document.querySelector('[class*=party-header_root__]') && document.querySelector('#blinkHeaderToggle') === null && checkAllStylesFound(guiPartyHeaderClasses)) {
        insertHeaderGui(document.querySelector('[class*=party-header_right__]'), guiPartyHeader())
    } else if (document.querySelector('[class*=header-desktop_desktopSectionRight__]') && document.querySelector('#blinkHeaderToggle') === null && checkAllStylesFound(guiHeaderClasses)) {
        insertHeaderGui(document.querySelector('[class*=header-desktop_desktopSectionRight__]'), guiHTMLHeader())
    }
}

let mapRoot = null;

function getMapRoot() {
    return document.querySelector("[data-qa=panorama]");
}

function hidePanorama() {
    mapRoot = getMapRoot() || mapRoot;
    hidePanoramaCached();
}

function hidePanoramaCached() {
    mapRoot.style.filter = 'brightness(0%)';
}

function showPanorama() {
    mapRoot = getMapRoot() || mapRoot;
    showPanoramaCached();
}

function showPanoramaCached() {
    mapRoot.style.filter = 'brightness(100%)';
}

function isLoading() {
    return document.querySelector('[class*=fullscreen-spinner_root__]') || document.querySelector('[class*=round-score-2_isMounted__]') || document.querySelector('[class*=new-game-2_isAnimated__]') || !document.querySelector('.widget-scene-canvas');
}

let wasBackdropThereOrLoading = false;
function isBackdropThereOrLoading() {
    return isLoading() // loading
        || document.querySelector('[class*=result-layout_root__]') // classic
        || document.querySelector('[class*=overlay_backdrop__]') // duels / team duels
        || document.querySelector('[class*=round-starting_wrapper____]') // live challenges
        || document.querySelector('[class*=popup_backdrop__]') // BR
        || document.querySelector('[class*=game-starting_container__]') || document.querySelector('[class*=round-score_container__]') // bullseye
        || document.querySelector('[class*=overlay-modal_backlight__]'); // city streaks
}

let showTimeoutID = null
let hideTimeoutID = null
function triggerBlink() {
    hidePanorama();
    clearTimeout(showTimeoutID);
    showTimeoutID = setTimeout(showPanorama, roundDelay * 1000);
    clearTimeout(hideTimeoutID);
    hideTimeoutID = setTimeout(hidePanorama, (timeLimit + roundDelay) * 1000);
}

let played = false;

const checkStatus = () => {
    if (!(location.pathname.includes('/duels'))) {
        return;
    }
    let timer = document.querySelector("[class^='clock-timer_timerContainer__']");
    let stress = document.querySelector("[class^='stress-indicator_container__']");
    if ((timer !== null) && !played && (stress == null)) {
        showPanorama();
        played = true;
    } else if (timer == null) {
        played = false;
    }
}

let observer = new MutationObserver((mutations) => {
    if (guiEnabled) {
        scanStyles().then(_ => { checkInsertGui(); });
    }

    if (localStorage.getItem('blinkEnabled') === 'enabled') {
        if (isBackdropThereOrLoading()) {
            wasBackdropThereOrLoading = true;
            if (!isLoading()) hidePanorama();
        } else if (wasBackdropThereOrLoading) {
            wasBackdropThereOrLoading = false;
            triggerBlink();
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
