// ==UserScript==
// @name         Drawaria Canvas Drawer Enabler!
// @namespace    http://tampermonkey.net/
// @version      2024-06-04
// @description  Enable drawing on any Drawaria canvas and just you can see it.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497121/Drawaria%20Canvas%20Drawer%20Enabler%21.user.js
// @updateURL https://update.greasyfork.org/scripts/497121/Drawaria%20Canvas%20Drawer%20Enabler%21.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Unlock the canvas
  document.querySelector('#canvas').style.pointerEvents = 'auto';

  // Enable drawing
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext('2d');
  var drawing = false;
  var lastX, lastY;

  // Connect to Socket.IO
  var socket = io();

  canvas.addEventListener('mousedown', function(event) {
    drawing = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
  });

  canvas.addEventListener('mousemove', function(event) {
    if (drawing) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      lastX = event.offsetX;
      lastY = event.offsetY;

      // Send drawing update to the server
      socket.emit('draw', {
        x: event.offsetX,
        y: event.offsetY
      });
    }
  });

  canvas.addEventListener('mouseup', function() {
    drawing = false;
  });
})();