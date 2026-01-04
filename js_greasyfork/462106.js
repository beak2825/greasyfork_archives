// ==UserScript==
// @name         AWBWAR Stager
// @namespace    https://awbw.amarriner.com/
// @version      1.10
// @description  Auto-replays
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462106/AWBWAR%20Stager.user.js
// @updateURL https://update.greasyfork.org/scripts/462106/AWBWAR%20Stager.meta.js
// ==/UserScript==

// Tool variables
var replayMenu = document.querySelector('.replay-open').parentNode;

var replayImgLink = 'https://i.imgur.com/9b3vzJL.png';

var clicked = false;

var replayLength = 0;
let autoActionPlayer = null;

let isAutoReplaying = false;

let ACTION_DELAY = 1750;
let START_DELAY = 2500;

let ahMoveAR = null;
let ahCaptAR = null;
let ahBuildAR = null;
let ahFireAR = null;
let ahEventAR = null;

// build and append button to game menu
var autoReplayDiv = document.createElement('div');
autoReplayDiv.id = 'auto-replay-parent';
autoReplayDiv.classList.add('game-tools-btn');
autoReplayDiv.style.width = '34px';
autoReplayDiv.style.height = '30px';
autoReplayDiv.style.borderLeft = 'none';

var autoReplayDivHoverSpan = document.createElement('span');
autoReplayDivHoverSpan.id = 'adji-hover-span';
autoReplayDivHoverSpan.classList.add('game-tools-btn-text');
autoReplayDivHoverSpan.classList.add('small_text');
autoReplayDivHoverSpan.innerText = "Auto Replay";

var autoReplayDivBackground = document.createElement('div');
autoReplayDivBackground.id = 'auto-replay-background';
autoReplayDivBackground.classList.add('game-tools-bg');

var autoReplayDivBackgroundSpan = document.createElement('span');
autoReplayDivBackgroundSpan.id = 'auto-replay-background-span';
autoReplayDivBackgroundSpan.classList.add('norm2');

var autoReplayDivBackgroundLink = document.createElement('a');
autoReplayDivBackgroundLink.id = 'auto-replay-background-link';
autoReplayDivBackgroundLink.classList.add('norm2');

var autoReplayDivBackgroundImg = document.createElement('img');
autoReplayDivBackgroundImg.id = 'auto-replay-background-link';
autoReplayDivBackgroundImg.src = replayImgLink;
autoReplayDivBackgroundImg.style.verticalAlign = "middle";
autoReplayDivBackgroundImg.style.width = '17px';
autoReplayDivBackgroundImg.style.height = '17px';

autoReplayDiv.appendChild(autoReplayDivBackground);
autoReplayDiv.appendChild(autoReplayDivHoverSpan);
autoReplayDivBackground.appendChild(autoReplayDivBackgroundSpan);
autoReplayDivBackgroundSpan.appendChild(autoReplayDivBackgroundLink);
autoReplayDivBackgroundLink.appendChild(autoReplayDivBackgroundImg);
replayMenu.appendChild(autoReplayDiv);

autoReplayDivBackgroundLink.onclick = autoReplay;

let unitIdentifierImg = document.createElement('img');
unitIdentifierImg.src = 'terrain/target_icon2.gif';
unitIdentifierImg.style.position = 'absolute';
unitIdentifierImg.style.left = '-5px';
unitIdentifierImg.style.top = '-7px';
unitIdentifierImg.style.height = '28px';
unitIdentifierImg.style.width = '28px';
unitIdentifierImg.style.zIndex = '125';
unitIdentifierImg.style.opacity = '0.65';
//unitIdentifierImg.classList.add("rotate");
unitIdentifierImg.classList.add("blink");

var on = (function(){
    if (window.addEventListener) {
        return function(target, type, listener){
            target.addEventListener(type, listener, false);
        };
    }
    else {
        return function(object, sEvent, fpNotify){
            object.attachEvent("on" + sEvent, fpNotify);
        };
    }
}());

var replayCloseBtn = document.getElementsByClassName('replay-close')[0];

on(replayCloseBtn, "click", function(){
    clearInterval(autoActionPlayer);
    setTimeout(()=>
    {
        unitIdentifierImg.style.display = 'none';
        autoReplayDiv.style.display = 'block';
        clicked = false;
        isAutoReplaying = false;
    }, 100);
});

function autoReplay()
{
    if (clicked == false)
    {
        isAutoReplaying = true;
        autoReplayDiv.style.display = 'none';

        if (isLastTurn) {replayLength = String((gameDay * Object.keys(playersInfo).length) - (Object.keys(playersInfo).length - (playerKeys.indexOf(currentTurn) + 1)) - 2); };
        if (isFullGame) {replayLength = 0; };

        openReplayMode(replayLength);
        setTimeout(() =>
        {
            let replayFwdBtn = document.getElementsByClassName("replvay-forward")[0];
            let replayFwdBtnAction = document.getElementsByClassName("replay-forward-action")[0];
            autoActionPlayer = setInterval(function()
                {
                    replayFwdBtnAction.click();

                }, ACTION_DELAY);
        }, START_DELAY);
        clicked = true;
    }
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
let isLastTurn = false;
let toggleLastTurn = function(val)
{
  isLastTurn = true;
  isFullGame = false;

  lastTurnRadioBtn.checked = true;
  fullGameRadioBtn.checked = false;
}
document.getElementById("last-turn-radio-btn").addEventListener ("change", toggleLastTurn, false);

// Toggle Last Turn Auto Replay Mode
let isFullGame = false;
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