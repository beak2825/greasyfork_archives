// ==UserScript==
// @name         AO3 ZIP Auto Downloader Simple
// @namespace    https://archiveofourown.org/
// @version      1.0.0
// @description  Adds ZIP download buttons on AO3 works pages and auto-downloads each with delay and pagination
// @author       ChatGPT
// @license      MIT
// @match        https://archiveofourown.org/works*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543035/AO3%20ZIP%20Auto%20Downloader%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/543035/AO3%20ZIP%20Auto%20Downloader%20Simple.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const delayMs = 4000;
  let isRunning = false;
  let isPaused = false;
  let downloadButtons = [];

  // Wait helper
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Extract work ID from AO3 URL parts
  function extractWorkId(href) {
    const parts = href.split('/');
    const worksIndex = parts.indexOf('works');
    if (worksIndex !== -1 && parts.length > worksIndex + 1) {
      return parts[worksIndex + 1];
    }
    return null;
  }

  // Add ZIP buttons next to each work title
  function addZipButtons() {
    const blurbs = document.querySelectorAll('li.blurb');
    const buttons = [];

    blurbs.forEach(blurb => {
      const titleLink = blurb.querySelector('.header.module .heading a');
      if (!titleLink) return;

      const workId = extractWorkId(titleLink.href);
      if (!workId) return;

      const title = titleLink.textContent.trim().replace(/[^\w\s\-]/g, '');
      const zipUrl = `/downloads/${workId}/${encodeURIComponent(title)}.zip?updated_at=${Date.now()}`;

      // Avoid duplicate buttons
      if (blurb.querySelector('.ao3-zip-btn')) return;

      const btn = document.createElement('a');
      btn.href = zipUrl;
      btn.textContent = 'ZIP ↓';
      btn.className = 'ao3-zip-btn';
      btn.style.cssText = `
        background-color: #c00;
        color: white;
        padding: 3px 7px;
        margin-left: 10px;
        border-radius: 5px;
        font-size: 12px;
        text-decoration: none;
        cursor: pointer;
      `;

      blurb.querySelector('.header.module .heading').appendChild(btn);
      buttons.push(btn);
    });

    return buttons;
  }

  // Create floating control panel
  function createControlPanel() {
    if (document.getElementById('ao3-zip-control-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'ao3-zip-control-panel';
    panel.style = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: #fff;
      border: 1px solid #444;
      padding: 10px;
      border-radius: 6px;
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;

    panel.innerHTML = `
      <b>AO3 ZIP Downloader</b><br><br>
      <button id="ao3-start-btn">▶ Start</button>
      <button id="ao3-pause-btn">⏸ Pause</button>
      <button id="ao3-reset-btn">🔁 Reset</button>
      <p id="ao3-status" style="margin-top:8px;">Status: Idle</p>
    `;

    document.body.appendChild(panel);

    document.getElementById('ao3-start-btn').onclick = startDownloads;
    document.getElementById('ao3-pause-btn').onclick = () => {
      isPaused = !isPaused;
      document.getElementById('ao3-pause-btn').textContent = isPaused ? '▶ Resume' : '⏸ Pause';
      updateStatus();
    };
    document.getElementById('ao3-reset-btn').onclick = () => {
      location.reload();
    };
  }

  // Update status text
  function updateStatus(text) {
    const status = document.getElementById('ao3-status');
    if (!status) return;
    status.textContent = `Status: ${text}`;
  }

  // Main auto-download function
  async function startDownloads() {
    if (isRunning) return;
    isRunning = true;

    downloadButtons = addZipButtons();
    if (downloadButtons.length === 0) {
      updateStatus('No works found on this page.');
      isRunning = false;
      return;
    }

    updateStatus('Starting downloads...');

    for (let i = 0; i < downloadButtons.length; i++) {
      while (isPaused) {
        updateStatus('Paused');
        await wait(500);
      }

      updateStatus(`Downloading work ${i + 1} of ${downloadButtons.length}...`);
      downloadButtons[i].click();

      await wait(delayMs);
    }

    // After finishing page, try next page
    const nextPageLink = document.querySelector('ol.pagination li.next a');
    if (nextPageLink) {
      updateStatus('Going to next page...');
      await wait(1000);
      window.location.href = nextPageLink.href;
    } else {
      updateStatus('All downloads complete.');
      alert('✅ All downloads complete!');
      isRunning = false;
    }
  }

  // Wait for page to load blurbs
  function waitForBlurbs() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (document.querySelector('li.blurb')) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });
  }

  // Initialize
  await waitForBlurbs();
  createControlPanel();
  updateStatus('Idle');

})();
