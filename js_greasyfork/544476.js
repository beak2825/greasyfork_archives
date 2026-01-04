// ==UserScript==
// @name         Torn Chain Panel
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Collapsible panel for chain # + timer
// @author       BuzzC137
// @match        https://www.torn.com/*
// @grant        none
// @license      Proprietary
// ==/UserScript==

/*
Copyright © 2025 BuzzC137

This script is proprietary and not open source.

You MAY NOT:
- Copy, modify, distribute, or use this script in any form without explicit written permission from the author.

Exception:
Torn City developers and staff are permitted to review or access this script for moderation, verification, or security purposes.

Unauthorized use may result in revocation of access or further action.
*/


(function () {
  'use strict';

  const discordUsername = 'buzzc137';

  const styles = `
    #chainPanel {
      position: fixed;
      top: 100px;
      left: 20px;
      background: rgba(24, 24, 24, 0.95);
      color: #ccc;
      font-family: Verdana, sans-serif;
      font-size: 12px;
      border: 1px solid #555;
      border-radius: 5px;
      padding: 10px;
      z-index: 9999;
      width: 220px;
      box-shadow: 0 0 10px #000;
    }
    #chainPanel.collapsed .panel-body {
      display: none;
    }
    #chainPanel .panel-header {
      font-weight: bold;
      color: #0f0;
      cursor: move;
      margin-bottom: 8px;
    }
    #chainPanel button,
    #chainPanel input {
      width: 100%;
      margin-bottom: 6px;
      padding: 6px;
      border: none;
      border-radius: 3px;
      font-size: 11px;
    }
    #chainPanel button {
      background: #333;
      color: white;
      cursor: pointer;
    }
    #chainPanel button:hover {
      background: #555;
    }
    #chainPanel .toggle {
      background: #1c1c1c;
      color: #aaa;
      font-size: 10px;
      text-align: center;
      padding: 4px;
      border-top: 1px solid #444;
      cursor: pointer;
    }
    #chainTabs {
      display: flex;
      justify-content: space-around;
      margin-bottom: 6px;
    }
    #chainTabs button {
      font-size: 10px;
      padding: 4px;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.innerText = styles;
  document.head.appendChild(styleTag);

  const panel = document.createElement('div');
  panel.id = 'chainPanel';
  panel.innerHTML = `
    <div class="panel-header">Chain Tool</div>
    <div class="panel-body">
      <input type="number" id="chainTimerInput" placeholder="Timer (sec)">
      <button id="getChainBtn">Get My Chain #</button>
      <button id="startTimerBtn">Start Timer</button>
      <div id="chainTabs">
        <button disabled>Tab 1</button>
        <button disabled>Tab 2</button>
      </div>
    </div>
    <div class="toggle">▲ Collapse</div>
  `;
  document.body.appendChild(panel);

  // Collapse toggle
  const toggle = panel.querySelector('.toggle');
  toggle.addEventListener('click', () => {
    panel.classList.toggle('collapsed');
    toggle.innerText = panel.classList.contains('collapsed') ? '▼ Expand' : '▲ Collapse';
  });

  // Drag logic
  const header = panel.querySelector('.panel-header');
  let isDragging = false, offsetX = 0, offsetY = 0;
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });
  document.addEventListener('mouseup', () => isDragging = false);

  // Fetch Chain Number
  const fetchBtn = panel.querySelector('#getChainBtn');
  fetchBtn.addEventListener('click', () => {
    fetch(`https://removing-maldives-driving-money.trycloudflare.com/chain/${discordUsername}`)
      .then(res => res.json())
      .then(data => {
        if (data.chain) {
          alert(`Your assigned chain number is: #${data.chain}`);
        } else {
          alert('You don’t have a chain number yet.');
        }
      })
      .catch(err => {
        alert('Error fetching chain number. Is the bot running?');
        console.error('Fetch error:', err);
      });
  });

  // Timer logic
  let timer;
  panel.querySelector('#startTimerBtn').addEventListener('click', () => {
    const seconds = parseInt(document.querySelector('#chainTimerInput').value) || 10;

    // Red flash
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = 0;
    flash.style.left = 0;
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'red';
    flash.style.opacity = '0.5';
    flash.style.zIndex = 999;
    document.body.appendChild(flash);
    setTimeout(() => document.body.removeChild(flash), 500);

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const audio = new Audio('https://www.soundjay.com/button/sounds/beep-07.mp3');
      audio.play();
      console.log("Timer complete – make your hit!");
    }, seconds * 1000);
  });
})();
