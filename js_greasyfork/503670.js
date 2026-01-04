// ==UserScript==
// @name         Free PixelPlace Premium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gift from Owmince
// @author       d,0,0,64
// @match        https://pixelplace.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503670/Free%20PixelPlace%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/503670/Free%20PixelPlace%20Premium.meta.js
// ==/UserScript==

(function() {'use strict'; let errorMessage = null, messageTimeout = null, flashing = false; function createMessage(text) { if (errorMessage && !flashing) { flashMessage(); return; } if (errorMessage) { clearTimeout(messageTimeout); document.body.removeChild(errorMessage); } errorMessage = document.createElement('div'); errorMessage.innerText = text; Object.assign(errorMessage.style, { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#ff4d4d', color: '#fff', padding: '20px', borderRadius: '10px', fontSize: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', zIndex: '1000', outline: '3px solid darkgrey' }); document.body.appendChild(errorMessage); messageTimeout = setTimeout(() => { if (errorMessage) { document.body.removeChild(errorMessage); errorMessage = null; } }, 5000); } function flashMessage() { flashing = true; let flashCount = 0; const flashInterval = setInterval(() => { if (flashCount >= 4) { clearInterval(flashInterval); flashing = false; return; } errorMessage.style.backgroundColor = flashCount % 2 === 0 ? '#ffffff' : '#ff4d4d'; flashCount++; }, 300); } function blockMovement(e) { createMessage('You must own Premium++ To move around'); e.preventDefault(); } function blockPixelPlacement(e) { createMessage('You must own Premium++ to place pixels'); e.preventDefault(); } document.addEventListener('keydown', function(e) { const blockedKeys = ['W', 'A', 'S', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']; if (blockedKeys.includes(e.key)) blockMovement(e); }); document.addEventListener('mousedown', function(e) { if ([0, 1, 2].includes(e.button)) blockMovement(e); }); document.addEventListener('click', function(e) { if (e.button === 0) blockPixelPlacement(e); }); document.addEventListener('wheel', function(e) { blockMovement(e); }); })();