// ==UserScript==
// @name          Timer
// @namespace     skap.io
// @version       1.0.0
// @description   Simple timer for skap.io
// @author        Zook1234(phenoix in a white hole made the regular copy)
// @match         https://skap.io/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/404759/Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/404759/Timer.meta.js
// ==/UserScript==

let timer,
    timerInterval,
    seconds = 0,
    minutes = 0;

// Start timer when player joined the server
WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
  if (!timer) {
    startTimer();
    this.onclose = () => {
      timer.remove();
      clearInterval(timerInterval);
    };
  }

  this._send(data);
}

function startTimer() {
  // Create timer element and assign styles
  timer = document.createElement('div');
  timer.innerHTML = `0:00`;
  timer.style = `
    color: #f4faff;
    position: fixed;
    display: block;
    font: bold 30px Tahoma, Verdana, Segoe, sans-serif;
    -webkit-text-stroke: 2px #425a6d;
    transform-origin: 0% 0%;
  `;
  document.body.appendChild(timer);

  // Update timer every second
  timerInterval = setInterval(() => {
    seconds += 1;
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }
    timer.innerHTML = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }, 1000);

  // Scale timer size on resize
  window.addEventListener('resize', resize);
  setTimeout(resize, 500);

  function resize() {
    const canvas = document.getElementById('canvas');
    const canvasBound = canvas.getBoundingClientRect();

    let scale = {};
    scale.x = window.innerWidth / canvas.width;
    scale.y = window.innerHeight / canvas.height;
    scale = scale.x < scale.y ? scale.x : scale.y;

    timer.style.transform = `scale(${scale})`;
    timer.style.left = `${canvasBound.left + 620 * scale}px`;
    timer.style.top = `${canvasBound.top + 60 * scale}px`;
  }
}