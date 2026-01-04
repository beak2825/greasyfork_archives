// ==UserScript==
// @name        NTS Live Enhanced Tracklist
// @namespace   Violentmonkey Scripts
// @match       https://www.nts.live/shows/*
// @grant       GM_addStyle
// @version     1.2
// @author      Reorx
// @license MIT
// @description Adds an interactive tracklist panel to NTS Live shows with time-synced highlighting, clickable tracks for navigation, and Spotify search integration. Features include auto-scrolling to current track, custom dark theme, and direct playback control.
// @downloadURL https://update.greasyfork.org/scripts/528713/NTS%20Live%20Enhanced%20Tracklist.user.js
// @updateURL https://update.greasyfork.org/scripts/528713/NTS%20Live%20Enhanced%20Tracklist.meta.js
// ==/UserScript==

GM_addStyle(`
  .nts-tracklist-pane {
    font-size: 13px;
    position: fixed;
    bottom: 12px;
    right: 12px;
    width: min(600px, 80vw);
    height: calc(100vh - 96px);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    border-radius: 8px;
    z-index: 10003;
    display: flex;
    flex-direction: column;
  }
  .nts-tracklist-header {
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
  }
  .nts-tracklist-content {
    padding: 0;
    overflow-y: auto;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  .nts-tracklist-content::-webkit-scrollbar {
    width: 8px;
  }
  .nts-tracklist-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .nts-tracklist-content::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  .nts-tracklist-content::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  .nts-tracklist-table {
    width: 100%;
    border-collapse: collapse;
  }
  .nts-tracklist-table th,
  .nts-tracklist-table td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .nts-tracklist-table th {
    font-weight: bold;
  }
  .nts-tracklist-table tr.playing {
    background: rgba(255, 255, 255, 0.2);
    font-weight: bold;
  }
  .nts-tracklist-table td.playing-icon {
    color: #1DB954;
    text-align: center;
    width: 20px;
    padding-left: 4px;
    padding-right: 4px;
  }
  .nts-tracklist-close {
    cursor: pointer;
    color: white;
    font-size: 20px;
    line-height: 1;
  }
  .nts-tracklist-table .title {
    cursor: pointer;
  }
  .nts-tracklist-table .title:hover {
    text-decoration: underline;
  }
`);

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function createTracklistPane() {
  // Remove any existing pane first
  destroyPane();

  const pane = document.createElement('div');
  pane.className = 'nts-tracklist-pane';

  const header = document.createElement('div');
  header.className = 'nts-tracklist-header';

  const title = document.createElement('span');
  title.textContent = 'Enhanced Tracklist';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'nts-tracklist-close';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => pane.remove();

  header.appendChild(title);
  header.appendChild(closeBtn);

  const content = document.createElement('div');
  content.className = 'nts-tracklist-content';

  const table = document.createElement('table');
  table.className = 'nts-tracklist-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Time</th>
        <th>Title</th>
        <th>Artist</th>
        <th>Dur</th>
        <th>Open</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  content.appendChild(table);
  pane.appendChild(header);
  pane.appendChild(content);
  document.body.appendChild(pane);
  return table.querySelector('tbody');
}

const store = {
  currentTrackIndex: null,
}

function destroyPane() {
  const existingPane = document.querySelector('.nts-tracklist-pane');
  if (existingPane) {
    existingPane.remove();
  }
  store.currentTrackIndex = null;
}

function updateCurrentTrack(tracklist, currentTime) {
  const rows = document.querySelectorAll('.nts-tracklist-table tbody tr');
  rows.forEach(row => {
    row.classList.remove('playing');
    row.querySelector('.playing-icon').textContent = '';
  });

  // Find the current track by comparing offsets
  const currentTrack = tracklist.find((track, index) => {
    const nextTrack = tracklist[index + 1];
    return track.offset <= currentTime &&
           (!nextTrack || currentTime < nextTrack.offset);
  });

  if (currentTrack) {
    const trackIndex = tracklist.indexOf(currentTrack);
    const currentRow = rows[trackIndex];
    if (currentRow) {
      currentRow.classList.add('playing');
      currentRow.querySelector('.playing-icon').textContent = '▶';

      // If the track has changed, scroll it into view
      if (store.currentTrackIndex !== trackIndex) {
        console.log('currentTrackIndex', store.currentTrackIndex, 'trackIndex', trackIndex);
        currentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        store.currentTrackIndex = trackIndex;
      }
    }
  }
}

function jumpToOffset(offset) {
  const audio = document.querySelector('.soundcloud-player__content audio');
  if (audio) {
    audio.currentTime = offset;
  }
}

function renderTracklist(tracklist) {
  const tbody = document.querySelector('.nts-tracklist-table tbody');
  if (!tbody) return;

  tbody.innerHTML = tracklist.map(track => `
    <tr>
      <td class="playing-icon"></td>
      <td>${formatTime(track.offset)}</td>
      <td><span class="title" onclick="(${jumpToOffset.toString()})(${track.offset})">${track.title}</span></td>
      <td>${track.artist}</td>
      <td>${track.duration ? formatTime(track.duration) : '-'}</td>
      <td><a href="spotify:search:${encodeURIComponent(track.title)}" style="color: #1DB954; text-decoration: none;">S</a></td>
    </tr>
  `).join('');
}

async function fetchAndCreatePane() {
  const path = window.location.pathname;
  const match = path.match(/\/shows\/([^/]+)\/episodes\/([^/]+)/);
  if (!match) return;

  const [_, show, episode] = match;
  const apiUrl = `https://www.nts.live/api/v2/shows/${show}/episodes/${episode}/tracklist`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const validTracks = data.results
      .map(track => ({
        ...track,
        offset: track.offset ?? track.offset_estimate
      }))
      .sort((a, b) => a.offset - b.offset);

    const tbody = createTracklistPane();
    renderTracklist(validTracks);

    const audio = document.querySelector('.soundcloud-player__content audio');
    if (!audio) return;

    audio.addEventListener('timeupdate', () => {
      updateCurrentTrack(validTracks, audio.currentTime);
    });

    // Initial update
    updateCurrentTrack(validTracks, audio.currentTime);

  } catch (error) {
    console.error('Failed to fetch tracklist:', error);
  }
}


function handleUrlChange() {
  const path = window.location.pathname;
  const match = path.match(/\/shows\/([^/]+)\/episodes\/([^/]+)/);
  if (!match) {
    destroyPane();
  } else {
    fetchAndCreatePane();
  }
}

async function init() {
  // Setup history change listeners
  window.addEventListener('popstate', handleUrlChange);
  const originalPushState = history.pushState;


  history.pushState = function() {
    originalPushState.apply(this, arguments);
    handleUrlChange();
  };
  const originalReplaceState = history.replaceState;
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    handleUrlChange();
  };

  // handle initial page load
  handleUrlChange()
}

// Start the script
init();
