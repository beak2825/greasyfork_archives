// ==UserScript==
// @name         Flipfire script 2023
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Press F to sync bullets DO NOT use autofire or shoot, then just click right mouse button and it stacks
// @author       Mi300
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475047/Flipfire%20script%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/475047/Flipfire%20script%202023.meta.js
// ==/UserScript==

let bruh = setInterval (function() {
  if (!document.querySelector('d-base').shadowRoot.children[0].shadowRoot.getElementById('username-input')) {
    return;
  }
  clearInterval (bruh)
  const toRadians = (degrees) => degrees * Math.PI / 180

  let angle = 180;
  let scriptActive = false;
  let mouseX = 0;
  let mouseY = 0;
  let artificialX = 0;
  let artificialY = 0;
  let stacking = false;
  let position = 0;

  const Wu = window.devicePixelRatio || 1;
  let canvas = window.document.getElementById("canvas");

    const scriptInfo = [
      {name: 'Triangle-Rear', angles: [0, 210], timings: [100, 200, 300, 330]},
      {name: 'Fighter-Side', angles: [0, 90], timings: [100, 200, 300, 330]},
      {name: 'Gunner-Trapper', angles: [180, 0], timings: [150, 250, 1000, 1100]},
      //{name: 'Booster', angles: [0, 210], timings: [100, 150, 350, 370]},
      {name: 'Octo', angles: [0, 45], timings: [100, 200, 300, 330]},
    ]

    let currentMode = scriptInfo[0];

  document.addEventListener('mousemove', e => {
    e.stopPropagation();
    mouseX = e.x;
    mouseY = e.y;

    if (scriptActive && stacking) {
      input.mouse (artificialX * Wu, artificialY * Wu)
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'f') {
      scriptActive = !scriptActive;
    }
    if (e.key === 'r') {
        position++;
        currentMode = scriptInfo[Math.abs(position) % scriptInfo.length];

        clearInterval(interval)
        interval = setInterval (flip, currentMode.timings[3])
    }

    if (e.key === 'l') {
    scriptInfo[4].angles[1] = scriptInfo[4].angles[1] + 10;
    }
  });

  document.addEventListener('mousedown', e => {
    if (e.button === 2) {
      stacking = true;
    }
  });

  document.addEventListener('mouseup', e => {
    if (e.button === 2) {
      stacking = false;
    }
  });

  function frame() {
    overlay.innerHTML = `
[F] Bullets Synced: ${scriptActive}
<br><br>
[Right Click] Stack: ${stacking}
<br><br>
[R] Tank: ${currentMode.name}
    `

    let radians = toRadians(angle)
    let tankX = window.innerWidth / 2;
	let tankY = window.innerHeight / 2;
	let angleSin = Math.sin(radians);
	let angleCos = Math.cos(radians);

	let x = mouseX - tankX;
	let y = mouseY - tankY;
	let _x = angleCos * x - angleSin * y;
	let _y = angleSin * x + angleCos * y;
	artificialX = _x + tankX;
	artificialY = _y + tankY;

    if (scriptActive && stacking) {
      input.mouse (artificialX * Wu, artificialY * Wu)
    }

        window.requestAnimationFrame(frame)
    }

    function flip() {
      if (!scriptActive) {
        return;
      }
      angle = currentMode.angles[0];

      setTimeout (function() {
        input.key_down(32);
      },currentMode.timings[0]);

      setTimeout (function() {
        angle = currentMode.angles[1];
      },currentMode.timings[1]);

      setTimeout (function () {
          input.key_up(32);
      },currentMode.timings[2]);
    }

    let interval = setInterval(flip, currentMode.timings[3])

        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '20px';
        overlay.style.left = '15%';
        overlay.style.fontFamily = 'Lucida Console, Courier, monospace';
        overlay.style.fontSize = '12px';
        overlay.style.color = '#ffffff';
        overlay.style.pointerEvents = 'none';
        overlay.style.userSelect = 'none';
        overlay.style.fontSize = '20px';
        document.body.appendChild(overlay);

    frame()
}, 400);