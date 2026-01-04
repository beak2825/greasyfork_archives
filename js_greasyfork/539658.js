// ==UserScript==
// @name        YT Playlist Poll
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/playlist*
// @grant       none
// @version     1.3.1
// @author      Duki (gpt)
// @description Playlist voting with per-video timestamp
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539658/YT%20Playlist%20Poll.user.js
// @updateURL https://update.greasyfork.org/scripts/539658/YT%20Playlist%20Poll.meta.js
// ==/UserScript==

(function () {

  const labels = {
    positive: 'Yep',
    neutral: '?',
    negative: 'Nope'
  }

  const style = document.createElement("style");
  style.textContent = `
    ytd-playlist-video-renderer {
      flex-flow: wrap;
      margin-bottom: 3px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    ytd-playlist-video-renderer:hover {
      background-color: #28282899;
    }
    ytd-playlist-video-renderer > #content {
      pointer-events: none;
    }
    ytd-playlist-video-renderer:has(.positive) {
      background-color: #0f01;
    }
    ytd-playlist-video-renderer:has(.positive):hover {
      background-color: #afa2 !important;
    }
    ytd-playlist-video-renderer:has(.negative) {
      background-color: #f001;
    }
    ytd-playlist-video-renderer:has(.negative):hover {
      background-color: #faa2 !important;
    }
    .poll {
      position: relative;
      display: block;
      width: 100%;
      padding: 0 5px 10px 5px;
      color: white;
      font-size: 15px;
      border-bottom: 1px solid #fff3;
    }
    .controls {
      position: fixed;
      top: 60px;
      left: 20px;
      z-index: 9999;
      background: #333;
      padding: 10px;
      color: white;
    }
    .controls button {
      margin-right: 5px;
    }
    .poll ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0;
      margin: 0;
    }
    .poll li {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .poll .Left, .poll .Center, .poll .Right {
      flex: 1;
      text-align: center;
    }
    .Left {
      color: forestgreen;
    }
    .Right {
      color: firebrick;
    }
    .countRow .Center {
      font-weight: normal;
    }
    .participant.hidden {
      visibility: hidden;
    }
    .participant.visible {
      visibility: visible;
    }
    .poll .countRow {
      font-weight: bold;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
    }
    .poll li {
      height: 19px;
    }
    .poll li button {
      background-color: transparent;
      border: none;
      color: white;
      cursor: pointer;
    }
    .poll li button:hover {
      background-color: white;
      border-radius: 5px;
      color: black;
    }
    .timestamp-row {
      display: flex;
      align-items: center;
      gap: 6px;
      position: absolute;
      top: -30px;
      left: 202px;
      opacity: 0.6;
    }
    .timestamp-row input {
      width: 70px;
      padding: 2px 4px;
    }
    .timestamp-row a {
      background-color: white;
      border: 1px solid darkgrey;
      border-radius: 4px;
      padding: 1px 5px;
      color: black;
      text-decoration: none;
    }
    ytd-playlist-video-renderer[cairo-collab-playlist-post-mvp] ytd-thumbnail.ytd-playlist-video-renderer {
      height: 90px;
      width: 159px;
    }
    .hidden {
      display: none !important;
    }
  `;


  const startBtn = document.createElement("button");
  startBtn.textContent = "Start Poll App";
  startBtn.style.position = "fixed";
  startBtn.style.top = "10px";
  startBtn.style.left = "10px";
  startBtn.style.zIndex = 10000;
  document.body.appendChild(startBtn);

  startBtn.onclick = () => {
    startBtn.remove();
    initControls();
    waitForVideos().then(injectPolls);
    document.head.appendChild(style);
  };

  function waitForVideos() {
    return new Promise(resolve => {
      const check = setInterval(() => {
        const els = document.querySelectorAll('ytd-playlist-video-renderer');
        if (els.length > 0) {
          clearInterval(check);
          resolve(els);
        }
      }, 100);
    });
  }

  function initControls() {
    const div = document.createElement("div");
    div.className = "controls";
    div.innerHTML = `
      <button id="add-participant">Add participant</button>
      <button id="remove-participant">Remove participant</button>
      <button id="reset-participants">Reset</button>
      <button id="toggle-results">Hide/Show voted</button>
    `;
    document.body.appendChild(div);

    document.getElementById("add-participant").onclick = () => {
      const name = prompt("Participant name:");
      if (name) {
        const current = getParticipants();
        if (current.find(p => p.name === name)) return alert("Already exists!");
        current.push({ name, vote: "neutral" });
        saveParticipants(current);
        rerenderPolls();
      }
    };

    document.getElementById("remove-participant").onclick = () => {
      const name = prompt("Remove who?");
      if (name) {
        const current = getParticipants().filter(p => p.name !== name);
        saveParticipants(current);
        rerenderPolls();
      }
    };

    document.getElementById("reset-participants").onclick = () => {
      if (confirm("Are you sure? This will erase all data.")) {
        localStorage.removeItem("pollParticipants");
        localStorage.removeItem(TIMESTAMP_KEY);
        rerenderPolls();
      }
    };

    document.getElementById("toggle-results").onclick = () => {
      const hiddens = document.querySelectorAll('ytd-playlist-video-renderer.hidden');
      const els = document.querySelectorAll('ytd-playlist-video-renderer:has(.positive), ytd-playlist-video-renderer:has(.negative)');
      els.forEach(el => {
        if (hiddens.length > 0) {
          el.classList.add('hidden');
        }
        el.classList.toggle('hidden');
      })
    };
  }

  const VOTES_KEY = "pollVotes";
  const TIMESTAMP_KEY = "pollTimestamps";

  function getVotes() {
    let votes = JSON.parse(localStorage.getItem(VOTES_KEY) || "{}");
    updateObject(votes);
    return votes;

    function updateObject(votes) {
      for (const outerId in votes) {
        for (const innerId in votes[outerId]) {
          if (votes[outerId][innerId] === 'yay') {
            votes[outerId][innerId] = 'positive';
          }
          else if(votes[outerId][innerId] === 'nay') {
            votes[outerId][innerId] = 'negative';
          }
        }
      }
    }
  }

  function saveVotes(v) {
    localStorage.setItem(VOTES_KEY, JSON.stringify(v));
  }

  function getParticipants() {
    return JSON.parse(localStorage.getItem("pollParticipants") || "[]");
  }

  function saveParticipants(p) {
    localStorage.setItem("pollParticipants", JSON.stringify(p));
  }

  function getTimestamps() {
    return JSON.parse(localStorage.getItem(TIMESTAMP_KEY) || "{}");
  }

  function saveTimestamps(map) {
    localStorage.setItem(TIMESTAMP_KEY, JSON.stringify(map));
  }

  function injectPolls(els) {
    const votes = getVotes();
    const timestamps = getTimestamps();

    els.forEach(el => {
      const poll = document.createElement("div");
      poll.classList.add("poll");

      const videoId = el.querySelector("a")?.href?.match(/[?&]v=([^&]+)/)?.[ 1 ];
      if (!videoId) return;

      poll.dataset.videoId = videoId;
      el.appendChild(poll);
      renderPoll(poll, getParticipants(), votes[ videoId ] || {}, timestamps[ videoId ] || "");
    });
  }

  function renderPoll(container, participants, votesForVideo, timestamp) {
    const videoId = container.dataset.videoId;
    const counts = { positive: 0, neutral: 0, negative: 0 };

    participants.forEach(p => {
      const v = votesForVideo[ p.name ] || "neutral";
      counts[ v ]++;
    });

    container.classList.remove('positive');
    container.classList.remove('negative');

    if (counts.positive > counts.negative) {
      container.classList.add('positive');
    }
    else if (counts.negative > counts.positive) {
      container.classList.add('negative');
    }

    const header = `
          <div class="countRow">
          <div class="Left">${labels.positive} (${counts.positive})</div>
          <div class="Center">${labels.neutral} (${counts.neutral})</div>
          <div class="Right">${labels.negative} (${counts.negative})</div>
          </div>
      `;

    const list = `<ul>${participants.map(p => {
      const v = votesForVideo[ p.name ] || "neutral";
      return `
          <li>
          <div class="Left">
              ${v === "positive" ? `
              <span class="participant visible">${p.name}</span>
              <button data-dir="right" data-name="${p.name}">→</button>
              <button data-skip="negative" data-name="${p.name}">⇄</button>
              ` : `<span class="participant hidden">${p.name}</span>`}
          </div>
          <div class="Center">
              ${v === "neutral" ? `
              <button data-dir="left" data-name="${p.name}">←</button>
              <span class="participant visible">${p.name}</span>
              <button data-dir="right" data-name="${p.name}">→</button>
              ` : `<span class="participant hidden">${p.name}</span>`}
          </div>
          <div class="Right">
              ${v === "negative" ? `
              <button data-dir="left" data-name="${p.name}">←</button>
              <span class="participant visible">${p.name}</span>
              <button data-skip="positive" data-name="${p.name}">⇄</button>
              ` : `<span class="participant hidden">${p.name}</span>`}
          </div>
          </li>`;
    }).join("")}</ul>`;

    const tsRow = `
          <div class="timestamp-row">
          <input type="text" value="${timestamp}" placeholder="e.g. 1m30s" data-video-id="${videoId}" />
          <a class="open-video" data-video-id="${videoId}" data-timestamp="${timestamp}" href="https://www.youtube.com/watch?v=${videoId}&t=${timestamp}" target="_blank">▶</a>
          </div>
      `;

    container.innerHTML = tsRow + header + list;

    container.querySelectorAll("button").forEach(btn => {
      const name = btn.dataset.name;
      const dir = btn.dataset.dir;
      const skip = btn.dataset.skip;
      if (name && dir) {
        btn.onclick = () => updateVote(videoId, name, dir);
      } else if (name && skip) {
        btn.onclick = () => forceVote(videoId, name, skip);
      }
    });

    container.querySelector("input").onchange = (e) => {
      const tsMap = getTimestamps();
      tsMap[ videoId ] = e.target.value.trim();
      saveTimestamps(tsMap);
      rerenderPolls();
    };
  }

  function updateVote(videoId, name, dir) {
    const votes = getVotes();
    votes[ videoId ] = votes[ videoId ] || {};
    const curr = votes[ videoId ][ name ] || "neutral";

    if (dir === "left") {
      if (curr === "neutral") votes[ videoId ][ name ] = "positive";
      else if (curr === "negative") votes[ videoId ][ name ] = "neutral";
    } else if (dir === "right") {
      if (curr === "neutral") votes[ videoId ][ name ] = "negative";
      else if (curr === "positive") votes[ videoId ][ name ] = "neutral";
    }

    saveVotes(votes);
    rerenderPolls();
  }

  function forceVote(videoId, name, to) {
    const votes = getVotes();
    votes[ videoId ] = votes[ videoId ] || {};
    votes[ videoId ][ name ] = to;
    saveVotes(votes);
    rerenderPolls();
  }

  function rerenderPolls() {
    const participants = getParticipants();
    const votes = getVotes();
    const timestamps = getTimestamps();
    document.querySelectorAll('.poll').forEach(poll => {
      const vid = poll.dataset.videoId;
      renderPoll(poll, participants, votes[ vid ] || {}, timestamps[ vid ] || "");
    });
  }
})();