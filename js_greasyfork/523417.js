// ==UserScript==
// @name         Mi300's Diep.io FOV / Zoom Script
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Press - + or scroll
// @author       Mi300
// @match        https://diep.io/*
// @match        https://diep-io.rivet.game/*
// @match        https://mobile.diep.io/*
// @match        https://staging.diep.io/*
// @match        https://diep.io/?p=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523417/Mi300%27s%20Diepio%20FOV%20%20Zoom%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523417/Mi300%27s%20Diepio%20FOV%20%20Zoom%20Script.meta.js
// ==/UserScript==

const FOV_UPDATE_INTERVAL = 16.6;
const FOV_LERP = 0.1;
let setFov = 0.5;
let fov = 0.5;
let keyStates = new Map();

const onWheelEvent = event => {setFov += -Math.sign(event.deltaY) * 0.02 * Math.log10(setFov / 0.55 + 1)}
const onKeyDown = event => {keyStates.set(event.keyCode, 1)}
const onKeyUp = event => {keyStates.set(event.keyCode, 0)}

function updateFov(){
  if(typeof window.extern === 'undefined')return;
  if(!window.extern.doesHaveTank())return;
  if(keyStates.get(187)) setFov += 0.01 * Math.log10(setFov / 0.55 + 1);
  if(keyStates.get(189)) setFov -= 0.01 * Math.log10(setFov / 0.55 + 1);

  fov += (setFov - fov) * FOV_LERP;
  window.extern.setScreensizeZoom(1, fov);
}
function init(){
  document.addEventListener("wheel", onWheelEvent);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  setInterval(updateFov, FOV_UPDATE_INTERVAL);
}
init();