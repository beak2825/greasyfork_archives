// ==UserScript==
// @name         Drawaria Hide Banned Message
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Enable drawing on any Drawaria canvas and Hide moderators Ban Messages I hate them
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://cdn.discordapp.com/emojis/1406279687478706216.webp
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547596/Drawaria%20Hide%20Banned%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/547596/Drawaria%20Hide%20Banned%20Message.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Hook into WebSocket para interceptar la conexión de Drawaria
  let socket;
  const originalSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (...args) {
    if (!socket) {
      socket = this;
    }
    return originalSend.apply(this, args);
  };

  // Crear panel de controles flotante
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: white;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 10px;
    z-index: 10000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
    font-size: 12px;
    display: none;
  `;

  controlPanel.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold;">Controles de Dibujo</div>
    <div style="margin-bottom: 5px;">
      <label>Color: <input type="color" id="brushColor" value="#000000"></label>
    </div>
    <div style="margin-bottom: 5px;">
      <label>Grosor: <input type="range" id="brushSize" min="1" max="20" value="15"></label>
      <span id="sizeValue">15</span>px
    </div>
    <div style="margin-bottom: 5px;">
      <label><input type="checkbox" id="sendToServer" checked> Enviar al servidor</label>
    </div>
    <div>
      <button id="clearCanvas" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Limpiar</button>
    </div>
  `;

  document.body.appendChild(controlPanel);

  // Actualizar valor del grosor
  document.getElementById('brushSize').addEventListener('input', function() {
    document.getElementById('sizeValue').textContent = this.value;
  });

  // Unlock the canvas
  document.querySelector('#canvas').style.pointerEvents = 'auto';

  // Enable drawing
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext('2d');
  var drawing = false;
  var lastX, lastY;

  // Función para enviar comando al servidor usando el protocolo de Drawaria
  function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
    if (!socket || !document.getElementById('sendToServer').checked) return;

    const normX1 = (x1 / canvas.width).toFixed(4);
    const normY1 = (y1 / canvas.height).toFixed(4);
    const normX2 = (x2 / canvas.width).toFixed(4);
    const normY2 = (y2 / canvas.height).toFixed(4);

    const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
    socket.send(command);
  }

  // Función para aplicar configuración del pincel
  function applyBrushSettings() {
    ctx.strokeStyle = document.getElementById('brushColor').value;
    ctx.lineWidth = document.getElementById('brushSize').value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  canvas.addEventListener('mousedown', function(event) {
    drawing = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
    applyBrushSettings(); // Aplicar configuración antes de dibujar
  });

  canvas.addEventListener('mousemove', function(event) {
    if (drawing) {
      applyBrushSettings(); // Aplicar configuración

      // Dibujar localmente
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();

      // Enviar comando al servidor usando el protocolo de Drawaria
      sendDrawCommand(
        lastX,
        lastY,
        event.offsetX,
        event.offsetY,
        document.getElementById('brushColor').value,
        parseInt(document.getElementById('brushSize').value)
      );

      lastX = event.offsetX;
      lastY = event.offsetY;
    }
  });

  canvas.addEventListener('mouseup', function() {
    drawing = false;
  });

  // Funcionalidad del botón limpiar
  document.getElementById('clearCanvas').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enviar comando de limpiar al servidor si está habilitado
    if (socket && document.getElementById('sendToServer').checked) {
      const clearCommand = `42["clearcmd",0,[]]`;
      socket.send(clearCommand);
    }
  });

    // Selectores para ambos tipos de mensajes
    const selectors = ['.chatmessage.systemchatmessage7',
        '.chatmessage.systemchatmessage'
    ];

    function removeMessages() {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // Observa el DOM para eliminarlos en cuanto aparezcan
    new MutationObserver(removeMessages).observe(document.documentElement, {childList: true, subtree: true});

    // Elimina los elementos si ya existen al cargar el script
    removeMessages();

})();
