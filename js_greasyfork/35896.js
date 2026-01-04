// ==UserScript==
// @name        SECAM lines
// @description Illusion of SECAM specific clutter for any websites you visit
// @namespace   com.bodqhrohro.secamlines
// @include     *
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35896/SECAM%20lines.user.js
// @updateURL https://update.greasyfork.org/scripts/35896/SECAM%20lines.meta.js
// ==/UserScript==

var SECAM_store = {}

var SECAM_randomHeight = () => (Math.random() * window.innerHeight) |0;

var SECAM_randomColor = () => {
  // get hue
  var colorType = Math.random();
  var color = [ 0, 0, 0, 0 ];
  if (colorType < 0.6) {
    color[0] = 255;
  } else if (colorType < 0.95) {
    color[2] = 255;
  } else {
    color[0] = color[1] = color[2] = 232;
  }

  // get brightness
  var brightness = 0.5 + Math.random() / 2
  color[0] *= brightness;
  color[1] *= brightness;
  color[2] *= brightness;

  // get transparency
  color[3] = 0.2 + Math.random() * 0.8

  return 'rgba(' + color.join(',') + ')';
}

var SECAM_generator = () => {
  var ctx = SECAM_store.ctx;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  SECAM_store.startHeights.forEach((startHeight) => {
    const linesDensity = 100;
    const maxLineLength = 30;
    for (var i = 0; i < linesDensity; i++) {
      ctx.fillStyle = SECAM_randomColor();
      ctx.fillRect(Math.random() * window.innerWidth, startHeight + Math.random() * SECAM_store.barThickness, Math.random() * maxLineLength, 2);
    }
  })

  window.requestAnimationFrame(SECAM_generator);
}

window.addEventListener('load', () => {
  var overlay = document.createElement('canvas');
  document.body.appendChild(overlay);
  overlay.style.position = 'fixed';
  overlay.style.top = '0px';
  overlay.style.left = '0px';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.pointerEvents = 'none';
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
  overlay.style.zIndex = 100500;
  
  SECAM_store.ctx = overlay.getContext('2d');

  // generate places for two garbled bars, regardless of resolution changes for now
  SECAM_store.barThickness = 30;
  var firstBarHeight = SECAM_randomHeight();
  SECAM_store.startHeights = [ firstBarHeight ];
  if (SECAM_store.barThickness * 2 < window.innerHeight) {
    var secondBarHeight;
    do {
      secondBarHeight = SECAM_randomHeight();
    } while (Math.abs(secondBarHeight - firstBarHeight) >= SECAM_randomHeight.barThickness);
    SECAM_store.startHeights.push(secondBarHeight);
  }
  window.requestAnimationFrame(SECAM_generator);
})
