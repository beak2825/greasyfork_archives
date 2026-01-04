// ==UserScript==
// @name Twitch Plays Factorio Macro Recorder
// @description Provides a macro recorder for Twitch Plays Factorio
// @include https://www.twitch.tv/chatplaysfactorio
// @noframes
// @version 0.3
// @license GPL3
// @namespace https://greasyfork.org/users/871241
// @downloadURL https://update.greasyfork.org/scripts/439396/Twitch%20Plays%20Factorio%20Macro%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/439396/Twitch%20Plays%20Factorio%20Macro%20Recorder.meta.js
// ==/UserScript==

/*
Twitch Plays Factorio Macro Recorder
Copyright (C) 2022  Coolrox95

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* Usage Instructions:
 * Press tilde, "`", to start recording a macro
 * Macro recording is indicated by the red square in the top left of the stream
 * The number indicates the number of commands recorded out of the maximum
 * Clicking on the stream will record clicks and accepts left, right and middle clicks
 * Shift, control and alt key modifiers are respected and included in the macro
 * Clicking and dragging is also supported
 * Most of the accepted keys for the game are also recorded as single presses
 * Red rectangles indicate regions that are currently being dragged over
 * Blue rectangles indicate the size of an area that was cut or copied
 * Green rectangles indicate where cut/copied ares have been placed
*/

(function () {
  /** Click and drag tolerance in pixels */
  const dragTol = 3;
  const maxCommands = 20;
  const codeMap = {
    KeyW: 'w',
    KeyA: 'a',
    KeyS: 's',
    KeyD: 'd',
    Digit0: '0',
    Digit1: '1',
    Digit2: '2',
    Digit3: '3',
    Digit4: '4',
    Digit5: '5',
    Digit6: '6',
    Digit7: '7',
    Digit8: '8',
    Digit9: '9',
    KeyQ: 'q',
    KeyR: 'r',
    KeyE: 'e',
    KeyC: 'c',
    KeyV: 'v',
    KeyX: 'x',
    KeyZ: 'z',
    Delete: 'del',
  }
  const validKeys = Object.keys(codeMap);
  const mouseCommands = ['lc', 'mc', 'rc'];
  let isRecording = false;
  let isDragging = false;
  let isCopying = false;
  let hasCopied = false;
  let recordedClicks = [];
  /**
   * @type {Set<{x: number, y: number, width:number, height: number}>}
   */
  const placedObjects = new Set();
  const mouseDownPos = {
    x: 0,
    y: 0,
  }
  /** Current position of the mouse */
  const curMousePos = {
    x: 0,
    y: 0,
  }
  /** Dimensions of copied area */
  const copyDims = {
    width: 0,
    height: 0,
    rotation: 0,
  }
  /**
   * 
   * @param {string} command 
   * @returns {void}
   */
  function recordCommand(command) {
    if (!isRecording) return;
    if (recordedClicks.length < maxCommands) {
      recordedClicks.push(command);
      setRecordText();
    }
  }
  /**
   * 
   * @param {MouseEvent|KeyboardEvent} event 
   * @returns {string}
   */
  function getModifierKey(event) {
    let modifierKey = '';
    if (event.ctrlKey) modifierKey = 'ctrl ';
    else if (event.shiftKey) modifierKey = 'shift ';
    else if (event.altKey) modifierKey = 'alt ';
    return modifierKey;
  }
  /**
   * 
   * @param {{MouseEvent|KeyboardEvent}} event 
   * @param {string} buttonPressed 
   * @returns {string}
   */
  function getEventText(event, buttonPressed) {
    const { pixX, pixY } = getEventCoords(event);
    return `${getModifierKey(event)}${buttonPressed} ${pixX} ${pixY}`
  }
  /**
   * 
   * @param {MouseEvent|KeyboardEvent} event 
   * @returns 
   */
  function getEventCoords(event) {
    return {
      pixX: Math.floor(event.offsetX / container.offsetWidth * 1920),
      pixY: Math.floor(event.offsetY / container.offsetHeight * 1080)
    }
  }
  /**
 * 
 * @param {KeyboardEvent} event 
 * @returns {void}
 */
  function startRecordingEvent(event) {
    if (event.key !== '`') return;
    if (isRecording) {
      navigator.clipboard.writeText(recordedClicks.join(','));
      recordedClicks = [];
      isRecording = false;
      recIcon.style.display = 'none';
      canvas.style.display = 'none';
    } else {
      recordedClicks = [];
      isRecording = true;
      isCopying = false;
      hasCopied = false;
      recIcon.style.display = '';
      canvas.style.display = '';
      placedObjects.clear();
      setRecordText();
      clearCanvas();
    }
  }
  /**
   * 
   * @param {KeyboardEvent} event 
   * @returns {void}
   */
  function recordKeysEvent(event) {
    if (!validKeys.includes(event.code)) return;
    let modifierKey = '';
    if (event.ctrlKey) modifierKey = 'ctrl ';
    else if (event.shiftKey) modifierKey = 'shift ';
    else if (event.altKey) modifierKey = 'alt ';
    if (event.ctrlKey && event.code === 'KeyC' || event.code === 'KeyX') isCopying = true;
    if (isCopying && modifierKey === '' && event.code === 'KeyQ') {
      isCopying = false;
      hasCopied = false;
      redrawCanvas();
    }
    if (hasCopied && event.code === 'KeyR') {
      if (event.shiftKey) {
        copyDims.rotation -= 90;
      } else {
        copyDims.rotation += 90;
      }
      copyDims.rotation = copyDims.rotation % 360;
      if (copyDims.rotation < 0) copyDims.rotation += 360;
      redrawCanvas();
    }
    recordCommand(`${modifierKey}${codeMap[event.code]}`);
  }
  function isPastDragTolerance() {
    return Math.abs(curMousePos.x - mouseDownPos.x) > dragTol || Math.abs(curMousePos.y - mouseDownPos.y) > dragTol;
  }
  /** @type {HTMLDivElement} */
  const videoPlayer = document.querySelector("div[data-a-target=\"video-player\"]");
  const container = document.createElement('div');
  videoPlayer.append(container);
  container.setAttribute('style','width: 100%;height:100%;position:relative;');
  const recIcon = document.createElement('div');
  recIcon.setAttribute('style', 'background-color: red; width: 50px; height: 50px; left: 0; top: 0; position: absolute; text-align: center; display: none; font-size: medium;');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('style','position: relative; width: 100%; height: 100%; left: 0; top: 0; display: none;');
  canvas.width = 1920;
  canvas.height = 1080;
  const canCtx = canvas.getContext('2d');
  container.appendChild(recIcon);
  container.appendChild(canvas);
  function setRecordText() {
    recIcon.textContent = `${recordedClicks.length} / ${maxCommands}`;
  }
  function clearCanvas() {
    canCtx.clearRect(0,0,canvas.width, canvas.height);
  }
  function drawPlacedObjects() {
    canCtx.strokeStyle = 'green';
    canCtx.lineWidth = 2;
    placedObjects.forEach((obj)=>{
      canCtx.strokeRect(obj.x,obj.y,obj.width,obj.height);
    });
  }
  function drawDragOutline() {
    if (!isDragging || !isPastDragTolerance()) return;
    canCtx.strokeStyle = 'red';
    canCtx.lineWidth = 2;
    canCtx.strokeRect(mouseDownPos.x, mouseDownPos.y, curMousePos.x - mouseDownPos.x, curMousePos.y - mouseDownPos.y);
  }
  function getCopyWidthAndHeight() {
    let width = 0, height = 0;
    if (copyDims.rotation % 180 === 0) {
      width = copyDims.width;
      height = copyDims.height;
    } else {
      height = copyDims.width;
      width = copyDims.height;
    }
    return {width, height};
  }
  function drawPlacementOutline() {
    if (!isCopying || !hasCopied || isDragging) return;
    canCtx.strokeStyle = 'blue';
    canCtx.lineWidth = 2;
    const {width, height} = getCopyWidthAndHeight();
    const xStart = curMousePos.x - width/2;
    const yStart = curMousePos.y - height/2;
    canCtx.strokeRect(xStart, yStart, width, height);
  }
  function redrawCanvas() {
    clearCanvas();
    drawPlacedObjects();
    drawDragOutline();
    drawPlacementOutline();
  }
  container.addEventListener('mousedown', (event) => {
    const { pixX, pixY } = getEventCoords(event)
    mouseDownPos.x = pixX;
    mouseDownPos.y = pixY;
    isDragging = true;
  });
  container.addEventListener('mouseup', (event) => {
    const { pixX, pixY } = getEventCoords(event);
    const mouse = mouseCommands[event.button];
    if (isPastDragTolerance()) {
      // Click and drag
      recordCommand(`setcursor ${mouseDownPos.x} ${mouseDownPos.y}`);
      recordCommand(`${getModifierKey(event)}${mouse} hold`);
      recordCommand(`setcursor ${pixX} ${pixY}`);
      recordCommand('rel');
      if (isCopying) {
        copyDims.width = Math.abs(pixX - mouseDownPos.x);
        copyDims.height = Math.abs(pixY - mouseDownPos.y);
        copyDims.rotation = 0;
        hasCopied = true;
      }
    } else {
      // Single click
      recordCommand(getEventText(event, mouse));
      const {width, height} = getCopyWidthAndHeight();
      const x = pixX - width/2;
      const y = pixY - height/2;
      if (event.button === 0 && isCopying && hasCopied) {
        placedObjects.add({
          x,y,width, height
        });
      }
    }
    isDragging = false;
    redrawCanvas();
  });
  container.addEventListener('mousemove', (event) => {
    if (!isRecording) return;
    const {pixX, pixY} = getEventCoords(event);
    curMousePos.x = pixX;
    curMousePos.y = pixY;
    redrawCanvas();
  });
  container.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', (event) => {
    startRecordingEvent(event);
    recordKeysEvent(event);
  });
})();