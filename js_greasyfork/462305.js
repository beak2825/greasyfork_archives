// ==UserScript==
// @name         AWBWPA Stager
// @namespace    https://awbw.amarriner.com/
// @version      1.0.9
// @description  [STAGER] Power animations
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462305/AWBWPA%20Stager.user.js
// @updateURL https://update.greasyfork.org/scripts/462305/AWBWPA%20Stager.meta.js
// ==/UserScript==

/// Vars
let ahFire = null;
let ahPower = null;
let ahWait = null;
let ahEventScreen = null;
let playerActivatePowerStatus = {};
let playerPassivePowerStatus = {};
let atLeastOneActivePower = false;

let copAnim = 'https://macroland.one/img/anim_cop.gif';
let scopAnim = 'https://macroland.one/img/anim_scop.gif';

let sfxSCOP1 = "https://macroland.one/game/scop_shine_1.wav";
let sfxSCOP2 = "https://macroland.one/game/scop_shine_2.wav";

let sfxCOP1 = "https://macroland.one/game/cop_shine_1.wav";
let sfxCOP2 = "https://macroland.one/game/cop_shine_2.wav";

let sfxCounter = 0;
let sfxIndex = 0;

let mpsSCOPDelay = 2750;
let mpsCOPDelay = 1000;

let mpsIsPlaying = false;
musicPlayerSettings = JSON.parse(window.localStorage.getItem('musicPlayerSettings'));
if (musicPlayerSettings !== undefined) { let mpsIsPlaying = musicPlayerSettings["is-playing"]; }
else mpsIsPlaying = false;

const POWERUP_DELAY = 125;

function buildPlayerPowerStatus()
{
  Object.keys(playersInfo).forEach(playerID =>
  {
    if (playersInfo[playerID].players_co_power_on === "Y" || playersInfo[playerID].players_co_power_on === "S")
    {
      playerPassivePowerStatus[playerID] = true;
      atLeastOneActivePower = true;
    }
    else
    {
      playerPassivePowerStatus[playerID] = false;
    }
    playerActivatePowerStatus[playerID] = false;
  });
}

function updatePlayerPowerObjs()
{
  var c = 0;
  Object.keys(playersInfo).forEach(playerID =>
  {
    if ((playersInfo[playerID].players_co_power_on === "Y" ||
        playersInfo[playerID].players_co_power_on === "S") &&
        playerActivatePowerStatus[playerID] === true)
    {
      playerActivatePowerStatus[playerID] = false;
      playerPassivePowerStatus[playerID] = true;
      atLeastOneActivePower = true;
      c += 1;
    }
    else if ((playersInfo[playerID].players_co_power_on !== "Y" ||
              playersInfo[playerID].players_co_power_on !== "S") &&
              playerPassivePowerStatus[playerID] === true)
    {
      playerPassivePowerStatus[playerID] = false;
    }
  });

  if (c === 0) { atLeastOneActivePower = false; };

  sfxCounter = 0;
}

ahPower = actionHandlers.Power;
actionHandlers.Power = function()
{
  ahPower.apply(actionHandlers.Power, arguments);

  // console.log("POWER ARGS");
  // console.log(arguments);

  playerActivatePowerStatus[arguments[0].playerId] = true;
  atLeastOneActivePower = true;

  checkForActivePower();
}

ahWait = waitUnit;
waitUnit = function()
{
  ahWait.apply(waitUnit, arguments);

  if (!atLeastOneActivePower) { return; };

  let u = document.querySelectorAll('[data-unit-id="' + String(arguments[0]) + '"]')[0];

  if (u !== undefined && u.firstElementChild.classList.contains('powered-up-shine'))
  {
    u.firstElementChild.classList.remove('powered-up-shine');
  }
}

ahEventScreen = showEventScreen;
showEventScreen = function()
{
    ahEventScreen.apply(showEventScreen, arguments);

    var eventHeader = document.querySelector('.event-username');

    console.log(arguments);

    if (eventHeader.innerText.includes("Day"))
    {
      updatePlayerPowerObjs();
      setTimeout(() => {
        checkForActivePower();
      }, 1000);
    }
}

function checkForActivePower()
{
  Object.keys(playersInfo).forEach(playerID =>
  {
    if ((playersInfo[playerID].players_co_power_on === "Y" ||
        playersInfo[playerID].players_co_power_on === "S") &&
        playerActivatePowerStatus[playerID] === true)
    {

      if (playersInfo[playerID].players_co_power_on === "Y")
      {
        setTimeout(() => {
          forEachWithDelay(Object.keys(playersUnits[playerID]), unitID =>
            {
              let u = document.querySelectorAll('[data-unit-id="' + String(unitID) + '"]')[0];
              let movedBool = unitsInfo[unitID].units_moved;
              powerUpUnit(u, true, movedBool, playersInfo[playerID].players_co_power_on);
            }, POWERUP_DELAY);
        }, mpsCOPDelay);
      }
      else if (playersInfo[playerID].players_co_power_on === "S")
      {
        setTimeout(() => {
          forEachWithDelay(Object.keys(playersUnits[playerID]), unitID =>
            {
              let u = document.querySelectorAll('[data-unit-id="' + String(unitID) + '"]')[0];
              let movedBool = unitsInfo[unitID].units_moved;
              powerUpUnit(u, true, movedBool, playersInfo[playerID].players_co_power_on);
            }, POWERUP_DELAY);
        }, (mpsIsPlaying != undefined && mpsIsPlaying) ? mpsSCOPDelay : mpsCOPDelay);
      }
    }
    else if ((playersInfo[playerID].players_co_power_on === "Y" ||
             playersInfo[playerID].players_co_power_on === "S") &&
             playerPassivePowerStatus[playerID] === true &&
             playerActivatePowerStatus[playerID] === false)
             {
               Object.keys(playersUnits[playerID]).forEach(unitID =>
               {
                 let u = document.querySelectorAll('[data-unit-id="' + String(unitID) + '"]')[0];
                 let movedBool = unitsInfo[unitID].units_moved;
                 powerUpUnit(u, false, movedBool, playersInfo[playerID].players_co_power_on);
               });
             }
    else if ((playersInfo[playerID].players_co_power_on !== "Y" ||
             playersInfo[playerID].players_co_power_on !== "S") &&
             playerPassivePowerStatus[playerID] === false &&
             playerActivatePowerStatus[playerID] === false)
             {
               Object.keys(playersUnits[playerID]).forEach(unitID =>
               {
                 let u = document.querySelectorAll('[data-unit-id="' + String(unitID) + '"]')[0];
                 u.firstElementChild.classList.remove('powered-up-shine');
               });
             }
  });
}

function powerUpUnit(unit, showPowerAnim, movedBool, powerType)
{
  // undefined units include those loaded into transport vehicles
  if (!movedBool && unit !== undefined && !unit.firstElementChild.classList.contains('powered-up-shine')) { unit.firstElementChild.classList.add('powered-up-shine'); };

  if (showPowerAnim && unit !== undefined)
  {
    var powerUpAnim = document.createElement('img');
    powerUpAnim.classList.add('power-up-anim');

    powerUpAnim.onload = function () {
      setTimeout(() => {
        unit.removeChild(powerUpAnim);
      }, 7000);
    }

    var rand = Math.random();

    switch (powerType)
    {
      case 'Y':
        powerUpAnim.src = copAnim + "?" + rand;
        if (window.localStorage.getItem('musicPlayerSettings') != null) playAnimSFX('Y', rand);
        // if (sfxCounter % 3 === 0) { if (sfxIndex % 2 === 0) { playOneShot(sfxSCOP1, 0.37); } else { playOneShot(sfxSCOP2, 0.37); } };
        // rand < 0.5 ? playOneShot(sfxSCOP1, 0.37) : playOneShot(sfxSCOP2, 0.37);
        break;
      case 'S':
        powerUpAnim.src = scopAnim + "?" + rand;
        if (window.localStorage.getItem('musicPlayerSettings') != null) playAnimSFX('S', rand);
        // rand < 0.5 ? playOneShot(sfxSCOP1, storedSFXVolume) : playOneShot(sfxSCOP2, storedSFXVolume);
        break;
      default:
        powerUpAnim.src = copAnim + "?" + rand;
        // rand < 0.5 ? playOneShot(sfxSCOP1, storedSFXVolume) : playOneShot(sfxSCOP2, storedSFXVolume);
        break;
    }

    if (unit !== undefined) unit.appendChild(powerUpAnim);
  }

  sfxCounter += 1;
}

function forEachWithDelay(array, callback, delay) {
  let i = 0;
  let interval = setInterval(() => {
    callback(array[i], i, array);
    if (++i === array.length) clearInterval(interval);
  }, delay);
}

var playOneShot = (audioURL, volume) =>
{
  const audioContext = new AudioContext();
  audioContext.resume();

  let soundInstance = new Audio(audioURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
};

function playAnimSFX(type, rand)
{
  if (!JSON.parse(window.localStorage.getItem('musicPlayerSettings'))["is-playing"]) return;

  var vol = JSON.parse(window.localStorage.getItem('musicPlayerSettings'))["sfx-volume"];

  switch(type)
  {
    case 'Y':
      if (sfxCounter % 4 === 0) { rand < 0.5 ? playOneShot(sfxCOP1, vol) : playOneShot(sfxCOP2, vol); };
      break;

    case 'S':
      if (sfxCounter % 4 === 0) { rand < 0.5 ? playOneShot(sfxSCOP1, vol) : playOneShot(sfxSCOP2, vol); };
      break;
  }
}

// Custom styling
var powerStyles = `
  .power-up-anim {
    position: absolute;
    top: -25px;
    left: -23.5px;
    z-index: 999;
  }

  .powered-up-shine {
    animation: shine 1.5s ease-in-out  infinite;
    animation-fill-mode: forwards;
    animation-direction: alternate;
  }

  @keyframes shine{
    0% { }
    100%
    {
      filter: brightness(125%) contrast(85%) drop-shadow(1px 1px 0 rgba(255,255,255, 0.35)) drop-shadow(-1px 1px 0 rgba(255,255,255, 0.35)) drop-shadow(1px -1px 0 rgba(255,255,255, 0.35)) drop-shadow(-1px -1px 0 rgba(255,255,255, 0.35));
    }
  }
`;

var powerStyleSheet = document.createElement("style");
powerStyleSheet.innerText = powerStyles;
document.head.appendChild(powerStyleSheet);

buildPlayerPowerStatus();
checkForActivePower();