// ==UserScript==
// @name         YouTube Optimizer with Bass Boost & Status (Inside Masthead Container)
// @namespace    https://greasyfork.org/en/users/1116584-simeonleni
// @version      2.4
// @description  YouTube Optimizer with bass boost plus on-screen health/status indicator and alerts inside YouTube masthead container
// @include      https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/469914/YouTube%20Optimizer%20with%20Bass%20Boost%20%20Status%20%28Inside%20Masthead%20Container%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469914/YouTube%20Optimizer%20with%20Bass%20Boost%20%20Status%20%28Inside%20Masthead%20Container%29.meta.js
// ==/UserScript==

const MAX_QUALITY = "hd2160";
const BASS_BOOST_GAIN = 12;

const overlayId = "yt-optimizer-status-overlay";
const badgeId = "yt-optimizer-active-badge";

function getContainer() {
  return document.querySelector('#container.style-scope.ytd-masthead');
}

function getPlayer() {
  return document.getElementById("movie_player") || document.querySelector(".html5-video-player");
}

function createOverlay() {
  if (document.getElementById(overlayId)) return;

  const container = getContainer();
  if (!container) {
    console.warn("Container #container.style-scope.ytd-masthead not found");
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = overlayId;
  Object.assign(overlay.style, {
    position: "fixed",
    bottom: "15px",
    right: "15px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    fontSize: "12px",
    fontFamily: "Arial, sans-serif",
    padding: "8px 12px",
    borderRadius: "6px",
    zIndex: 9999999,
    maxWidth: "220px",
    display: "none",
    flexDirection: "column",
    gap: "4px",
  });
  container.appendChild(overlay);
}

function createBadge() {
  if (document.getElementById(badgeId)) return;

  const container = getContainer();
  if (!container) {
    console.warn("Container #container.style-scope.ytd-masthead not found");
    return;
  }

  const badge = document.createElement("div");
  badge.id = badgeId;
  Object.assign(badge.style, {
    position: "fixed",
    bottom: "15px",
    right: "15px",
    width: "14px",
    height: "14px",
    backgroundColor: "#4caf50",
    borderRadius: "50%",
    boxShadow: "0 0 6px #4caf50",
    zIndex: 9999999,
    cursor: "default",
  });
  badge.title = "YouTube Optimizer script active";
  container.appendChild(badge);
}

function updateStatus(key, success, message) {
  createOverlay();
  createBadge();

  const overlay = document.getElementById(overlayId);
  const badge = document.getElementById(badgeId);

  if (!success) {
    if (badge) badge.style.display = "none";
    if (overlay) overlay.style.display = "flex";

    if (overlay) {
      let line = overlay.querySelector(`[data-key="${key}"]`);
      if (!line) {
        line = document.createElement("div");
        line.dataset.key = key;
        overlay.appendChild(line);
      }
      line.textContent = `${key}: ❌ ${message || "Failed"}`;
      line.style.color = "#ff5555";
    }
    return false;
  } else {
    if (overlay) {
      let line = overlay.querySelector(`[data-key="${key}"]`);
      if (line) overlay.removeChild(line);
    }
  }

  if (overlay && overlay.childElementCount === 0) {
    overlay.style.display = "none";
    if (badge) badge.style.display = "block";
  }

  return true;
}

function showStatusOverlay() {
  const overlay = document.getElementById(overlayId);
  const badge = document.getElementById(badgeId);
  if (overlay) overlay.style.display = "flex";
  if (badge) badge.style.display = "none";
}

function showActiveBadge() {
  const overlay = document.getElementById(overlayId);
  const badge = document.getElementById(badgeId);
  if (overlay) overlay.style.display = "none";
  if (badge) badge.style.display = "block";
}

function isPlayerAvailable(player) {
  return (
    player &&
    typeof player.getAvailableQualityLevels === "function" &&
    typeof player.setPlaybackQuality === "function"
  );
}

function updateVideoQuality(player) {
  try {
    if (!isPlayerAvailable(player)) return false;

    const available = player.getAvailableQualityLevels();
    if (available.includes(MAX_QUALITY)) {
      player.setPlaybackQuality(MAX_QUALITY);
      console.log(`Set quality to ${MAX_QUALITY}`);
      return true;
    } else if (available.length > 0) {
      player.setPlaybackQuality(available[0]);
      console.warn(`Fallback quality: ${available[0]}`);
      return true;
    } else {
      console.warn("No quality levels found.");
      return false;
    }
  } catch (e) {
    console.error("Quality update failed:", e.message);
    return false;
  }
}

function applyBassBoost(player) {
  try {
    const video = player.querySelector("video");
    if (!video) {
      console.warn("Video element not found.");
      return false;
    }

    if (window._ytAudioCtx) {
      return true;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const context = new AudioCtx();

    const source = context.createMediaElementSource(video);
    const filter = context.createBiquadFilter();
    filter.type = "lowshelf";
    filter.frequency.value = 200;
    filter.gain.value = BASS_BOOST_GAIN;

    source.connect(filter);
    filter.connect(context.destination);

    window._ytAudioCtx = context;
    window._ytAudioSource = source;
    window._ytBassFilter = filter;

    console.log("Bass boost applied.");
    return true;
  } catch (e) {
    console.error("Bass boost failed:", e.message);
    return false;
  }
}

function waitForPlayer(callback, timeout = 15000) {
  const interval = 300;
  let elapsed = 0;

  const check = () => {
    const player = getPlayer();
    if (player) {
      callback(player);
    } else if (elapsed < timeout) {
      elapsed += interval;
      setTimeout(check, interval);
    } else {
      updateStatus("Player", false, "Player not found after waiting");
    }
  };

  check();
}

waitForPlayer((player) => {
  updateStatus("Player", true);

  if (typeof player.addEventListener === "function") {
    player.addEventListener("onStateChange", (event) => {
      if (event.data === 1) { // Playing
        const qualityOk = updateVideoQuality(player);
        const bassOk = applyBassBoost(player);

        updateStatus("Quality Set", qualityOk);
        updateStatus("Bass Boost", bassOk);

        if (qualityOk && bassOk) {
          showActiveBadge();
        } else {
          showStatusOverlay();
        }
      }
    });
  } else {
    console.warn("Player does not support addEventListener for onStateChange");
    updateStatus("Player Event", false, "Cannot listen for state changes");
  }
});
