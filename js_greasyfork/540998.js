// ==UserScript==
// @name         AWBW Auto Replay + Play/Pause
// @namespace    https://awbw.amarriner.com/
// @version      1.13
// @description  Auto-replays with play/pause support, right-click settings, and spacebar toggle
// @author       twiggy_, updated by ChatGPT
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540998/AWBW%20Auto%20Replay%20%2B%20PlayPause.user.js
// @updateURL https://update.greasyfork.org/scripts/540998/AWBW%20Auto%20Replay%20%2B%20PlayPause.meta.js
// ==/UserScript==

// Tool variables
var replayMenu = document.querySelector('.replay-open')?.parentNode;

var replayImgLink = 'https://i.imgur.com/9b3vzJL.png';

var clicked = false;

var replayLength = 0;
let autoActionPlayer = null;

let isAutoReplaying = false;

let ACTION_DELAY = 1700;
let START_DELAY = 2500;

let ahMoveAR = null;
let ahCaptAR = null;
let ahBuildAR = null;
let ahFireAR = null;
let ahEventAR = null;

let isLastTurn = true;
let isFullGame = false;

let playButton = null;
let pauseButton = null;

function startAutoReplay() {
    if (autoActionPlayer) clearInterval(autoActionPlayer);

    isAutoReplaying = true;
    if (playButton) playButton.disabled = true;
    if (pauseButton) pauseButton.disabled = false;

    let replayFwdBtnAction = document.querySelector(".replay-forward-action");
    if (!replayFwdBtnAction) return;

    autoActionPlayer = setInterval(() => {
        replayFwdBtnAction.click();
    }, ACTION_DELAY);
}

function pauseAutoReplay() {
    if (autoActionPlayer) {
        clearInterval(autoActionPlayer);
        autoActionPlayer = null;
    }
    isAutoReplaying = false;
    if (playButton) playButton.disabled = false;
    if (pauseButton) pauseButton.disabled = true;
}

function togglePlayPause() {
    if (isAutoReplaying) {
        pauseAutoReplay();
    } else {
        startAutoReplay();
    }
}

function addPlayPauseButtons() {
    let replayControls = document.querySelector('.replay-controls');
    if (!replayControls) return;

    playButton = document.createElement('button');
    playButton.textContent = '▶ Play';
    playButton.style.marginLeft = '10px';
    playButton.style.fontSize = '12px';
    playButton.addEventListener('click', startAutoReplay);

    pauseButton = document.createElement('button');
    pauseButton.textContent = '⏸ Pause';
    pauseButton.style.marginLeft = '5px';
    pauseButton.style.fontSize = '12px';
    pauseButton.disabled = true;
    pauseButton.addEventListener('click', pauseAutoReplay);

    replayControls.appendChild(playButton);
    replayControls.appendChild(pauseButton);
}

function addAutoReplayContextMenu() {
    const contextMenu = document.createElement('div');
    contextMenu.id = 'auto-replay-context';
    contextMenu.style.position = 'absolute';
    contextMenu.style.display = 'none';
    contextMenu.style.zIndex = '100';
    contextMenu.style.backgroundColor = '#fff';
    contextMenu.style.border = '1px solid #888';
    contextMenu.style.padding = '8px';

    const delayLabel = document.createElement('label');
    delayLabel.textContent = 'Action Delay (ms):';
    delayLabel.style.display = 'block';
    delayLabel.style.marginBottom = '4px';

    const delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.step = '100';  // <--- make it increment in 100s
    delayInput.value = ACTION_DELAY;
    delayInput.style.width = '60px';

    // Change value by 100 on arrow key or mouse wheel
    delayInput.addEventListener('input', (e) => {
        ACTION_DELAY = parseInt(e.target.value);
    });
    delayInput.addEventListener('wheel', (e) => {
        e.preventDefault();
        let delta = Math.sign(e.deltaY);
        let current = parseInt(delayInput.value) || 0;
        delayInput.value = Math.max(0, current - delta * 100);
        delayInput.dispatchEvent(new Event('input'));
    });

    const modeLabel = document.createElement('div');
    modeLabel.textContent = 'Replay Mode:';
    modeLabel.style.marginTop = '8px';

    const lastTurnRadio = document.createElement('input');
    lastTurnRadio.type = 'radio';
    lastTurnRadio.name = 'replayMode';
    lastTurnRadio.checked = true;
    lastTurnRadio.addEventListener('change', () => {
        isLastTurn = true;
        isFullGame = false;
    });

    const lastTurnLabel = document.createElement('label');
    lastTurnLabel.textContent = 'Last Turn';
    lastTurnLabel.style.marginRight = '10px';

    const fullGameRadio = document.createElement('input');
    fullGameRadio.type = 'radio';
    fullGameRadio.name = 'replayMode';
    fullGameRadio.addEventListener('change', () => {
        isLastTurn = false;
        isFullGame = true;
    });

    const fullGameLabel = document.createElement('label');
    fullGameLabel.textContent = 'Full Game';

    contextMenu.appendChild(delayLabel);
    contextMenu.appendChild(delayInput);
    contextMenu.appendChild(modeLabel);
    contextMenu.appendChild(lastTurnRadio);
    contextMenu.appendChild(lastTurnLabel);
    contextMenu.appendChild(fullGameRadio);
    contextMenu.appendChild(fullGameLabel);

    document.body.appendChild(contextMenu);

    document.getElementById('auto-replay-parent').oncontextmenu = function(e) {
        e.preventDefault();
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.display = 'block';
    };

    document.addEventListener('click', function(e) {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });
}


window.addEventListener('load', function() {
    addPlayPauseButtons();
    addAutoReplayContextMenu();

    // Add spacebar keybinding
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            togglePlayPause();
        }
    });
});

// Ensure auto-replay button is always visible
const observer = new MutationObserver(() => {
    const autoReplayDiv = document.getElementById('auto-replay-parent');
    if (autoReplayDiv && autoReplayDiv.style.display === 'none') {
        autoReplayDiv.style.display = 'block';
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Patch the input so that it increments/decrements in steps of 100
window.addEventListener('DOMContentLoaded', () => {
    const delayInput = document.getElementById('action-delay-input');
    if (delayInput) {
        delayInput.step = '100';
        delayInput.addEventListener('wheel', (e) => {
            e.preventDefault();
            let delta = Math.sign(e.deltaY);
            let current = parseInt(delayInput.value) || 0;
            delayInput.value = Math.max(0, current - delta * 100);
            delayInput.dispatchEvent(new Event('input'));
        });
    }
});


var autoReplayDiv = document.createElement('div');
autoReplayDiv.id = 'auto-replay-parent';
autoReplayDiv.classList.add('game-tools-btn');
autoReplayDiv.style.width = '34px';
autoReplayDiv.style.height = '30px';
autoReplayDiv.style.borderLeft = 'none';

var autoReplayDivHoverSpan = document.createElement('span');
autoReplayDivHoverSpan.classList.add('game-tools-btn-text', 'small_text');
autoReplayDivHoverSpan.innerText = "Auto Replay";

var autoReplayDivBackground = document.createElement('div');
autoReplayDivBackground.classList.add('game-tools-bg');

var autoReplayDivBackgroundSpan = document.createElement('span');
var autoReplayDivBackgroundLink = document.createElement('a');
var autoReplayDivBackgroundImg = document.createElement('img');
autoReplayDivBackgroundImg.src = replayImgLink;
autoReplayDivBackgroundImg.style.verticalAlign = "middle";
autoReplayDivBackgroundImg.style.width = '17px';
autoReplayDivBackgroundImg.style.height = '17px';

autoReplayDiv.appendChild(autoReplayDivBackground);
autoReplayDiv.appendChild(autoReplayDivHoverSpan);
autoReplayDivBackground.appendChild(autoReplayDivBackgroundSpan);
autoReplayDivBackgroundSpan.appendChild(autoReplayDivBackgroundLink);
autoReplayDivBackgroundLink.appendChild(autoReplayDivBackgroundImg);

if (replayMenu) replayMenu.appendChild(autoReplayDiv);
autoReplayDivBackgroundLink.onclick = autoReplay;

var replayCloseBtn = document.querySelector('.replay-close');
if (replayCloseBtn) {
    replayCloseBtn.addEventListener('click', function() {
        clearInterval(autoActionPlayer);
        autoActionPlayer = null;
        isAutoReplaying = false;
        clicked = false;
        if (playButton) playButton.disabled = false;
        if (pauseButton) pauseButton.disabled = true;
    });
}

function autoReplay() {
    if (clicked) return;
    isAutoReplaying = true;
    autoReplayDiv.style.display = 'none';

    if (isLastTurn) {
        replayLength = String((gameDay * Object.keys(playersInfo).length) - (Object.keys(playersInfo).length - (playerKeys.indexOf(currentTurn) + 1)) - 2);
    } else if (isFullGame) {
        replayLength = 0;
    }

    openReplayMode(replayLength);
    setTimeout(startAutoReplay, START_DELAY);
    clicked = true;
}

// Action Handlers
ahMoveAR = actionHandlers.Move;
actionHandlers.Move = function()
{
    ahMoveAR.apply(actionHandlers.Move, arguments);

    if (isAutoReplaying === false) { return; }

    let u = document.querySelectorAll("[data-unit-id='" + String(arguments[0].unit.units_id) + "']");
    u[0].appendChild(unitIdentifierImg);
}

ahCaptAR = actionHandlers.Capt;
actionHandlers.Capt = function()
{
    ahCaptAR.apply(actionHandlers.Capt, arguments);

    if (isAutoReplaying === false) { return; }

    let b = document.querySelectorAll("[data-building-id='" + String(arguments[0].buildingInfo.buildings_id) + "']");
    b[0].appendChild(unitIdentifierImg);
}

ahBuildAR = actionHandlers.Build;
actionHandlers.Build = function()
{
    ahBuildAR.apply(actionHandlers.Build, arguments);

    if (isAutoReplaying === false) { return; }

    let u = document.querySelectorAll("[data-unit-id='" + String(arguments[0].newUnit.units_id) + "']");
    u[0].appendChild(unitIdentifierImg);
}

ahFireAR = actionHandlers.Fire;
actionHandlers.Fire = function()
{
    ahFireAR.apply(actionHandlers.Fire, arguments);

    if (isAutoReplaying === false) { return; }

    let u = document.querySelectorAll("[data-unit-id='" + String(arguments[0].attacker.units_id) + "']");
    u[0].appendChild(unitIdentifierImg);
}

ahEventAR = showEventScreen;
showEventScreen = function()
{
    ahEventAR.apply(showEventScreen, arguments);

    if (isAutoReplaying === false) { return; }

    var eventHeader = document.querySelector('.event-username');

    console.log(eventHeader.innerText);
    console.log(isLastTurn);
    console.log(isFullGame);

    if (eventHeader.innerText.includes("Day") && isLastTurn && !isFullGame)
    {
      unitIdentifierImg.style.display = 'none';
      clearInterval(autoActionPlayer);
      isAutoReplaying = false;
    }
}

// Custom context menu
let contextMenuAutoReplay = document.createElement('div');
contextMenuAutoReplay.id = 'div-context-menu-ar';
contextMenuAutoReplay.classList.add('cls-context-menu-ar');
contextMenuAutoReplay.style.position = 'absolute';
contextMenuAutoReplay.style.height = '76px';
contextMenuAutoReplay.style.paddingTop = '4px';
contextMenuAutoReplay.style.paddingBottom = '4px';
autoReplayDiv.appendChild(contextMenuAutoReplay);

document.getElementById('auto-replay-parent').oncontextmenu = function(e) {
   let elmnt = e.target
   if (elmnt.id.startsWith ("auto-replay")) {
      e.preventDefault();
      let eid = elmnt.id.replace(/link-/,"");
      contextMenuAutoReplay.style.height = '98px';
      contextMenuAutoReplay.style.width = '155px';
      contextMenuAutoReplay.style.top = '37px';
      contextMenuAutoReplay.style.display = 'block';
      let toRepl = "to=" + eid.toString();
   }
}

on(document, "click", function(e)
{
  if (e.target.id == "div-context-menu-ar" ||
      e.target.id == "ar-options-flex-container" ||
      e.target.id == "full-game-radio-btn" ||
      e.target.id == "last-turn-radio-btn" ||
      e.target.id == "action-delay-input") return;
  contextMenuAutoReplay.style.display = 'none';
});

// Title
let autoReplayFlexContainer = document.createElement('div');
autoReplayFlexContainer.id = "ar-options-flex-container";
autoReplayFlexContainer.style.display = 'flex';
autoReplayFlexContainer.style.flexDirection = 'row';
autoReplayFlexContainer.style.marginBottom = '3.5px';
autoReplayFlexContainer.style.alignItems = 'center';

let autoReplaySpanDiv = document.createElement('div');
autoReplaySpanDiv.id = "ar-options--div";
autoReplaySpanDiv.style.display = 'inline-block';
autoReplaySpanDiv.style.width = '100%';
autoReplaySpanDiv.style.textAlign = 'center';

let autoReplaySpan = document.createElement('span');
autoReplaySpan.id = "ar-options-desc";
autoReplaySpan.textContent = "Auto Replay Options";
autoReplaySpan.style.fontSize = "13px";

contextMenuAutoReplay.appendChild(autoReplayFlexContainer);
autoReplayFlexContainer.appendChild(autoReplaySpanDiv);
autoReplaySpanDiv.appendChild(autoReplaySpan);

// Last Turn Radio Button
var lastTurnRadioBtn = document.createElement('input');
lastTurnRadioBtn.id = "last-turn-radio-btn";
lastTurnRadioBtn.classList.add('ar-radio-btn');
lastTurnRadioBtn.type = "radio";

// Last Turn Div
let arOptionsFlexContainer = document.createElement('div');
arOptionsFlexContainer.id = "last-turn-flex-container";
arOptionsFlexContainer.style.display = 'flex';
arOptionsFlexContainer.style.flexDirection = 'column';
arOptionsFlexContainer.style.marginTop = '7px';
arOptionsFlexContainer.style.alignItems = 'center';
arOptionsFlexContainer.style.justifyContent = 'center';

let lastTurnSpanDiv = document.createElement('div');
lastTurnSpanDiv.id = "last-turn-slider-div";
lastTurnSpanDiv.style.display = 'inline-block';
lastTurnSpanDiv.style.width = 'auto';
lastTurnSpanDiv.style.textAlign = 'center';

let lastTurnSpan = document.createElement('span');
lastTurnSpan.id = "last-turn-slider-desc";
lastTurnSpan.textContent = "Last Turn";
lastTurnSpan.style.fontSize = "11px";
lastTurnSpan.style.marginRight = "5px";

contextMenuAutoReplay.appendChild(arOptionsFlexContainer);

// Delay Input
var actionDelayInput = document.createElement('input');
actionDelayInput.id = "action-delay-input";
actionDelayInput.type = "text";
actionDelayInput.style.width = "30px";
actionDelayInput.style.fontSize = "12px";

let actionDelayFlexContainer = document.createElement('div');
actionDelayFlexContainer.id = "action-delay-flex-container";
actionDelayFlexContainer.style.display = 'flex';
actionDelayFlexContainer.style.flexDirection = 'column';
actionDelayFlexContainer.style.marginTop = '7px';
actionDelayFlexContainer.style.alignItems = 'center';
actionDelayFlexContainer.style.justifyContent = 'center';

let actionDelaySpanDiv = document.createElement('div');
actionDelaySpanDiv.id = "action-delay-div";
actionDelaySpanDiv.style.display = 'inline-block';
actionDelaySpanDiv.style.width = 'auto';
actionDelaySpanDiv.style.textAlign = 'center';
actionDelaySpanDiv.style.marginTop = '5px';

let actionDelaySpan = document.createElement('span');
actionDelaySpan.id = "action-delay-desc";
actionDelaySpan.textContent = "Action Delay (ms)";
actionDelaySpan.style.fontSize = "11px";
actionDelaySpan.style.marginLeft = "5px";

arOptionsFlexContainer.appendChild(actionDelaySpanDiv);
actionDelaySpanDiv.appendChild(actionDelayInput);
actionDelaySpanDiv.appendChild(actionDelaySpan);

arOptionsFlexContainer.appendChild(lastTurnSpanDiv);
lastTurnSpanDiv.appendChild(lastTurnRadioBtn);
lastTurnSpanDiv.appendChild(lastTurnSpan);

// Full Game Radio Button
var fullGameRadioBtn = document.createElement('input');
fullGameRadioBtn.id = "full-game-radio-btn";
fullGameRadioBtn.classList.add('ar-radio-btn');
fullGameRadioBtn.type = "radio";

// Full Game Div
let fullGameSpanDiv = document.createElement('div');
fullGameSpanDiv.id = "full-game-slider-div";
fullGameSpanDiv.style.display = 'inline-block';
fullGameSpanDiv.style.width = 'auto';
fullGameSpanDiv.style.textAlign = 'center';
fullGameSpanDiv.style.marginTop = '5px';

let fullGameSpan = document.createElement('span');
fullGameSpan.id = "full-game-slider-desc";
fullGameSpan.textContent = "Full Game";
fullGameSpan.style.fontSize = "11px";

arOptionsFlexContainer.appendChild(fullGameSpanDiv);
fullGameSpanDiv.appendChild(fullGameRadioBtn);
fullGameSpanDiv.appendChild(fullGameSpan);

// Toggle Last Turn Auto Replay Mode
isLastTurn = false;
let toggleLastTurn = function(val)
{
  isLastTurn = true;
  isFullGame = false;

  lastTurnRadioBtn.checked = true;
  fullGameRadioBtn.checked = false;
}
document.getElementById("last-turn-radio-btn").addEventListener ("change", toggleLastTurn, false);

// Toggle Last Turn Auto Replay Mode
isFullGame = false;
let toggleFullGame= function(val)
{
  isLastTurn = false;
  isFullGame = true;

  lastTurnRadioBtn.checked = false;
  fullGameRadioBtn.checked = true;
}
document.getElementById("full-game-radio-btn").addEventListener ("change", toggleFullGame, false);

let updateActionDelay = function(val)
{
  // val = String(val).replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/^0[^.]/, '0');
  ACTION_DELAY = val.target.value;
  console.log(ACTION_DELAY);
}
document.getElementById("action-delay-input").addEventListener ("input", updateActionDelay, false);

function setDefaultAutoReplayMode()
{
  isLastTurn = true;
  isFullGame = false;

  actionDelayInput.value = String(ACTION_DELAY);

  lastTurnRadioBtn.checked = true;
  fullGameRadioBtn.checked = false;
}

// Stylings
var autoReplayStyles = `
    // Context Menu
    .cls-context-menu-link {
        display:block;
        padding:20px;
        background:#ECECEC;
    }

    .cls-context-menu-ar {
        position: absolute;
        display: none;
        width: 155px;
        height: 98px;
        padding-top: 4px;
        background-color: white;
        z-index: 99;
    }

    .cls-context-menu-ar ul, #context-menu li {
        list-style:none;
        margin:0; padding:0;
        background:white;
    }

    .cls-context-menu-ar { border: 1px solid #888888 !important;}
    .cls-context-menu-ar li { border: 1px solid #888888; }
    .cls-context-menu-ar li:last-child { border:none; }
    .cls-context-menu-ar li a {
        display:block;
        padding:5px 10px;
        text-decoration:none;
        color:blue;
    }
    .cls-context-menu-ar li a:hover {
        background:blue;
        color:#FFF;
    }

    .ar-radio-btn {
      height: 14px;
      width: 14px;
    }

    .ar-radio-btn:hover {
      cursor: pointer;
    }

    nextActionPos = {
        'background': 'rgba(67, 217, 228, 0.4)',
        'box-sizing': 'border-box',
        'border': '1px solid rgb(22, 98, 184)',
        'height': '17px',
        'position': 'absolute',
        'width': '17px'
    }

    .blink {
      animation: blinker 0.35s step-start infinite;
    }

    .rotate {
      animation: rotation 3.5s infinite linear;
    }

    @keyframes blinker {
      50% {
        opacity: 0;
      }
    }

    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(359deg);
      }
    }
`

var autoReplayStyleSheet = document.createElement("style")
autoReplayStyleSheet.innerText = autoReplayStyles
document.head.appendChild(autoReplayStyleSheet);

setDefaultAutoReplayMode();