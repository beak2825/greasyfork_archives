// ==UserScript==
// @name         Torn Travel Tracker 
// @namespace    https://torn.com/
// @version      1.0
// @description  Track Torn player travel + record/show departure time and estimate return ETA
// @match        https://www.torn.com/*
// @grant        none
// @license Custom: No Redistribution
// @downloadURL https://update.greasyfork.org/scripts/538088/Torn%20Travel%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/538088/Torn%20Travel%20Tracker.meta.js
// ==/UserScript==
/*
Copyright (c) 2025 aquagloop

Permission is granted to use, install, and modify this script for personal use only.

Redistribution of this script, in whole or in part, whether modified or unmodified, is strictly prohibited without explicit written permission from the author.

This script is provided "as is", without warranty of any kind, express or implied.
*/
(function() {
  'use strict';

  const API_KEY = '5eIOgqwh3QdesDic';
  const POLL_INTERVAL = 3 * 1000; // 5s
  const ETA_UPDATE_INTERVAL = 1000; // 1 second for live ETA refresh


  const targets = {};

  let tripData = {};


  try {
    tripData = JSON.parse(localStorage.getItem('travelTrackerTrips') || '{}');
  } catch {
    tripData = {};
  }

  const panel = document.createElement('div');
  panel.style = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 360px;
    background: #1e1e1e;
    color: #eee;
    font-family: monospace;
    font-size: 13px;
    border: 1px solid #555;
    border-radius: 8px;
    padding: 10px;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0,0,0,0.4);
  `;
  panel.innerHTML = `
    <div style="font-size: 15px; font-weight: bold; color:#4fc3f7; margin-bottom: 8px;">
      🛫 Travel Tracker
    </div>
    <div style="margin-bottom: 10px;">
      <input id="targetIdInput" placeholder="Player ID" style="width: 60%; padding: 3px;" />
      <button id="addTargetBtn" style="width: 35%; background:#4fc3f7; color:#000; border:none; padding: 4px; border-radius: 3px;">Add</button>
    </div>
    <div id="targetList"></div>
  `;
  document.body.appendChild(panel);

  function saveTargetIds() {
    localStorage.setItem('travelTrackerTargets', JSON.stringify(Object.keys(targets)));
  }

  function saveTripData() {
    localStorage.setItem('travelTrackerTrips', JSON.stringify(tripData));
  }

  const storedIDs = localStorage.getItem('travelTrackerTargets');
  if (storedIDs) {
    try {
      const ids = JSON.parse(storedIDs);
      if (Array.isArray(ids)) {
        ids.forEach((id, idx) => {
          setTimeout(() => addTarget(id, true), idx * 1500);
        });
      }
    } catch {
    }
  }

  function addTarget(id, skipSave) {
    id = id.toString().trim();
    if (!id || targets[id]) return;

    const list = document.getElementById('targetList');
    const box = document.createElement('div');
    box.id = `target-${id}`;
    box.style = 'border-top: 1px solid #444; padding-top: 8px; margin-top: 6px;';
    const header = document.createElement('div');
    header.innerHTML = `
      👤 <span id="name-${id}">Loading ${id}...</span>
      <button style="float:right;background:#900;color:#fff;border:none;padding:2px 6px;border-radius:3px;cursor:pointer;"
        class="remove-btn" data-id="${id}">✖</button>
    `;

    const status = document.createElement('div');
    status.id = `status-${id}`;
    status.textContent = '⏳ Loading...';

    const departLine = document.createElement('div');
    departLine.id = `depart-${id}`;
    departLine.style = 'color: #81c784; margin-top: 4px;';

    box.appendChild(header);
    box.appendChild(status);
    box.appendChild(departLine);
    list.appendChild(box);
    const saved = tripData[id] || {};
    targets[id] = {
      id,
      nameElem: document.getElementById(`name-${id}`),
      statusElem: status,
      departElem: departLine,
      lastDesc: saved.lastDesc || null,
      travelStart: saved.travelStart || null,
      arrivalTime: saved.arrivalTime || null,
      tripDuration: saved.tripDuration || null,
      returnStart: saved.returnStart || null
    };

    if (targets[id].travelStart) {
      targets[id].departElem.textContent = `Departed at: ${formatTimestamp(targets[id].travelStart)}`;
    }

    if (!skipSave) saveTargetIds();
    fetchStatus(id);
  }

  function removeTarget(id) {
    delete targets[id];
    delete tripData[id];
    const box = document.getElementById(`target-${id}`);
    if (box) box.remove();
    saveTargetIds();
    saveTripData();
  }
  panel.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.getAttribute('data-id');
      if (id) removeTarget(id);
    }
  });

  document.getElementById('addTargetBtn').addEventListener('click', () => {
    const input = document.getElementById('targetIdInput');
    const id = input.value.trim();
    if (id) {
      addTarget(id, false);
      input.value = '';
    }
  });

  async function fetchStatus(id) {
    const url = `https://api.torn.com/user/${id}?selections=basic&key=${API_KEY}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.error);

      const player = targets[id];
      if (!player) return; 

      const name = json.name || `ID ${id}`;
      const desc = json.status?.description || 'Unknown';
      const now = Date.now();


      player.nameElem.textContent = `${name} [${id}]`;


      const prev = player.lastDesc;
      player.lastDesc = desc;


      if (!tripData[id]) tripData[id] = {};

      if (prev === 'Okay' && desc.startsWith('Traveling to ')) {
        player.travelStart = now;
        player.arrivalTime = null;
        player.tripDuration = null;
        player.returnStart = null;

        tripData[id].travelStart = now;
        tripData[id].arrivalTime = null;
        tripData[id].tripDuration = null;
        tripData[id].returnStart = null;

        player.departElem.textContent = `Departed at: ${formatTimestamp(now)}`;
      }

      if (prev && prev.startsWith('Traveling to ') && desc.startsWith('In ') && !desc.includes('Torn')) {
        player.arrivalTime = now;
        player.tripDuration = now - player.travelStart;

        tripData[id].arrivalTime = now;
        tripData[id].tripDuration = player.tripDuration;
      }

      if (prev && prev.startsWith('In ') && desc.startsWith('Returning to Torn') && player.tripDuration) {
        player.returnStart = now;
        tripData[id].returnStart = now;
      }

      if (desc === 'Okay') {
        player.travelStart = null;
        player.arrivalTime = null;
        player.tripDuration = null;
        player.returnStart = null;
        player.departElem.textContent = ''; 

        tripData[id].travelStart = null;
        tripData[id].arrivalTime = null;
        tripData[id].tripDuration = null;
        tripData[id].returnStart = null;
      }

      tripData[id].lastDesc = desc;
      saveTripData();

      if (!desc.startsWith('Returning to Torn')) {
        player.statusElem.textContent = `📌 ${desc}`;
      }
    } catch (err) {
      console.error(`[Tracker] Error fetching status for ${id}:`, err);
      const player = targets[id];
      if (player) {
        player.statusElem.textContent = `❌ Error: ${err.message}`;
      }
    }
  }

  function formatTimestamp(ms) {
    return new Date(ms).toLocaleTimeString();
  }
  function formatTime(ms) {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateAll() {
    const ids = Object.keys(targets);
    ids.forEach((id, idx) => {
      setTimeout(() => fetchStatus(id), idx * 1500);
    });
  }

  function liveETAUpdater() {
    const now = Date.now();
    Object.values(targets).forEach(player => {
      const desc = player.lastDesc;
      if (desc && desc.startsWith('Returning to Torn') && player.tripDuration && player.returnStart) {
        const eta = player.returnStart + player.tripDuration;
        const remaining = Math.max(0, eta - now);
        const timeStr = formatTime(remaining);

        // Calculate 3% variance of tripDuration in ms
        const varianceMs = Math.floor(player.tripDuration * 0.03);
        const varianceStr = formatTime(varianceMs);

        player.statusElem.textContent = `📌 ${desc} | ETA: ${timeStr} ± ${varianceStr}`;
      }
    });
  }

  setInterval(updateAll, POLL_INTERVAL);
  setInterval(liveETAUpdater, ETA_UPDATE_INTERVAL);
  updateAll();

})();
