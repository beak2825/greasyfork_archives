// ==UserScript==
// @name         YouTube Downloader YT1S
// @namespace    https://greasyfork.org/users/152924
// @version      2.2.0
// @description  Adds custom YT1S download button and popup with playlist support
// @author       Jay_0512
// @match        https://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544732/YouTube%20Downloader%20YT1S.user.js
// @updateURL https://update.greasyfork.org/scripts/544732/YouTube%20Downloader%20YT1S.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const YT_LOGO_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="52" viewBox="0 0 100 52" fill="none">
      <rect x="10" y="0" width="80" height="52" rx="14" fill="#FF0000"/>
      <polygon points="40,12 65,26 40,40" fill="#FFFFFF"/>
    </svg>
  `;

  const tubeID = "dwnldBtn";

  GM_addStyle(`
    #${tubeID} {
      background-color: #F1F1F1;
      color: #191919;
      border: 1px solid;
      border-color: rgba(255,255,255,0.2);
      margin-left: 8px;
      padding: 0 16px;
      border-radius: 18px;
      font-size: 14px;
      font-family: Roboto, Noto, sans-serif;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      height: 36px;
      line-height: normal;
      cursor: pointer;
    }
    #${tubeID}:hover {
      background-color: #D9D9D9;
      color: #191919;
      border-color: #F1F1F1;
    }
    #custom-popup-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      z-index: 9998;
    }
    #custom-download-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 320px;
      background-color: var(--yt-spec-brand-background-primary);
      border-radius: 12px;
      z-index: 9999;
      padding: 24px 20px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      color: var(--yt-spec-text-primary);
      font-family: Roboto, Arial, sans-serif;
    }
    #custom-download-popup .header {
      text-align: center;
      margin-bottom: 16px;
    }
    #custom-download-popup label {
      font-size: 14px;
      font-weight: 500;
      margin-top: 12px;
      margin-bottom: 4px;
    }
    #custom-download-popup select {
      padding: 8px;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid var(--yt-spec-10-percent-layer);
      background-color: var(--yt-spec-badge-chip-background);
      color: var(--yt-spec-text-primary);
    }
    #custom-download-popup button {
      margin-top: 12px;
      padding: 10px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
  `);

  function getVideoId() {
    const url = window.location.href;
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/);
    return match ? match[1] : null;
  }

  function getPlaylistVideoIds() {
    const nodes = [...document.querySelectorAll('ytd-playlist-panel-video-renderer a')];
    return nodes.map(a => new URL(a.href).searchParams.get('v')).filter(Boolean);
  }

  function isInPlaylist() {
    return getPlaylistVideoIds().length > 1;
  }

  function createPopup() {
    document.getElementById('custom-popup-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-popup-overlay';

    const popup = document.createElement('div');
    popup.id = 'custom-download-popup';

    popup.innerHTML = `
      <div class="header">${YT_LOGO_SVG}</div>
      <label for="format-select">Format</label>
      <select id="format-select">
        <option value="mp4">MP4 (Video)</option>
        <option value="mp3">MP3 (Audio)</option>
      </select>
      <label for="quality-select">Quality</label>
      <select id="quality-select"></select>
      <button id="download-btn">Download Current Video</button>
    `;

    if (isInPlaylist()) {
      const playlistBtn = document.createElement('button');
      playlistBtn.id = 'download-playlist-btn';
      playlistBtn.textContent = 'Download Playlist';
      popup.appendChild(playlistBtn);

      playlistBtn.addEventListener('click', async () => {
        const format = formatSelect.value;
        const quality = qualitySelect.value;
        const ids = getPlaylistVideoIds();
        for (let i = 0; i < ids.length; i++) {
          const videoURL = `https://www.youtube.com/watch?v=${ids[i]}`;
          const targetURL = `https://yt1s.com/en/youtube-to-${format}?q=${encodeURIComponent(videoURL)}`;
          window.open(targetURL, '_blank');
          await new Promise(r => setTimeout(r, 2000));
        }
        overlay.remove();
      });
    }

    const formatSelect = popup.querySelector('#format-select');
    const qualitySelect = popup.querySelector('#quality-select');

    formatSelect.addEventListener('change', () => {
      fillQualityOptions(qualitySelect, formatSelect.value);
    });

    fillQualityOptions(qualitySelect, formatSelect.value);

    popup.querySelector('#download-btn').addEventListener('click', () => {
      const id = getVideoId();
      const format = formatSelect.value;
      const videoURL = `https://www.youtube.com/watch?v=${id}`;
      const targetURL = `https://yt1s.com/en/youtube-to-${format}?q=${encodeURIComponent(videoURL)}`;
      window.open(targetURL, '_blank');
      overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  function fillQualityOptions(selectEl, format) {
    selectEl.innerHTML = '';
    if (format === 'mp3') {
      ['128', '192', '320'].forEach(q => {
        const opt = document.createElement('option');
        opt.value = q;
        opt.textContent = `${q} kbps`;
        selectEl.appendChild(opt);
      });
    } else {
      const video = document.querySelector('video');
      const maxQ = video?.videoHeight || 1080;
      [2160, 1440, 1080, 720, 480, 360, 240, 144].forEach(q => {
        if (q <= maxQ) {
          const opt = document.createElement('option');
          opt.value = q;
          opt.textContent = `${q}p`;
          selectEl.appendChild(opt);
        }
      });
    }
  }

  function addDownloadBtn() {
    const containerSelector = '#owner';
    const observer = new MutationObserver(() => {
      const container = document.querySelector(containerSelector);
      if (container && !document.getElementById(tubeID)) {
        const btn = document.createElement('button');
        btn.id = tubeID;
        btn.textContent = 'Download';
        btn.addEventListener('click', createPopup);
        container.appendChild(btn);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(addDownloadBtn, 1000);
  });

  addDownloadBtn();
})();