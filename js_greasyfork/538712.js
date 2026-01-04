// ==UserScript==
// @name         Spotify Multi-View Redesign + Floating Style Panel
// @namespace    https://yourdomain.example/
// @version      4.1
// @description  Wechsel zwischen Spotify-Stilen (Apple, Terminal, Windows, Minimal) mit Floating Panel 🎛️
// @author       Du
// @license      MIT
// @match        https://open.spotify.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538712/Spotify%20Multi-View%20Redesign%20%2B%20Floating%20Style%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/538712/Spotify%20Multi-View%20Redesign%20%2B%20Floating%20Style%20Panel.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentView = 'apple';

  const views = ['apple', 'terminal', 'windows', 'minimal'];
  const viewNames = {
    apple: 'Apple',
    terminal: 'Terminal',
    windows: 'Windows',
    minimal: 'Minimal',
  };
  const viewIcons = {
    apple: '🍎',
    terminal: '⌨️',
    windows: '🪟',
    minimal: '✨',
  };

  // Wechselt den View-Stil durch Anpassen der Body-Klasse
  function switchView(view) {
    currentView = view;
    document.body.classList.forEach(cls => {
      if (cls.startsWith('spotify-')) {
        document.body.classList.remove(cls);
      }
    });
    document.body.classList.add(`spotify-${view}-view`);
    updateStyles();
  }

  // Erzeugt das schwebende Panel mit Buttons
  function createFloatingStylePanel() {
    // Button zum Öffnen/Schließen des Panels
    const floater = document.createElement('button');
    floater.id = 'style-floater';
    floater.title = 'Open Style Panel';
    floater.textContent = '🎛️';
    document.body.appendChild(floater);

    // Das Panel selbst
    const panel = document.createElement('div');
    panel.id = 'style-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <h3>🎨 Style Panel</h3>
        <button id="close-style-panel">×</button>
      </div>
      <div class="panel-content">
        <p>Choose your Spotify view style:</p>
        <div class="panel-buttons">
          ${views.map(v => `<button data-view="${v}">${viewIcons[v]} ${viewNames[v]}</button>`).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Eventlistener öffnen/schließen
    floater.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelector('#close-style-panel').addEventListener('click', () => panel.classList.remove('open'));

    // Eventlistener für Style-Wechsel
    panel.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
        panel.classList.remove('open');
      });
    });
  }

  // Fügt CSS für Button, Panel & Styles ein
  function updateStyles() {
    document.getElementById('spotify-style-block')?.remove();
    const style = document.createElement('style');
    style.id = 'spotify-style-block';
    style.textContent = `
      #style-floater {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        width: 52px;
        height: 52px;
        font-size: 22px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff, #ff0080);
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      }
      #style-floater:hover {
        transform: scale(1.1);
      }
      #style-panel {
        position: fixed;
        top: 50%;
        right: -300px;
        transform: translateY(-50%);
        width: 260px;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 16px;
        border-radius: 12px 0 0 12px;
        box-shadow: -4px 0 20px rgba(0,0,0,0.3);
        backdrop-filter: blur(20px);
        transition: right 0.4s ease;
        z-index: 9999;
        font-family: Arial, sans-serif;
      }
      #style-panel.open {
        right: 0;
      }
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .panel-header h3 {
        margin: 0;
        font-size: 16px;
      }
      .panel-header button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }
      .panel-content p {
        margin: 0 0 8px;
        font-size: 14px;
        opacity: 0.8;
      }
      .panel-buttons button {
        width: 100%;
        margin: 6px 0;
        padding: 10px;
        background: rgba(255,255,255,0.05);
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      .panel-buttons button:hover {
        background: rgba(255,255,255,0.15);
      }

      /* Beispiel Styles für Views (kannst du anpassen) */
      body.spotify-apple-view {
        filter: none;
        background: linear-gradient(135deg, #f0f0f0, #ffffff);
      }
      body.spotify-terminal-view {
        background: #000;
        color: #0f0;
        font-family: monospace, monospace;
      }
      body.spotify-windows-view {
        background: linear-gradient(135deg, #0078d7, #00bcf2);
        color: white;
      }
      body.spotify-minimal-view {
        background: white;
        color: black;
        font-family: system-ui, sans-serif;
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    createFloatingStylePanel();
    switchView(currentView);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();