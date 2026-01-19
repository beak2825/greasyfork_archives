// ==UserScript==
// @name         Auto-play video thumbnails (Sxyprn, Watchporn, Yesporn, TheyAreHuge, Eporner, ShyFap)
// @namespace    https://greasyfork.org/users/1168969
// @version      1.6
// @description  Auto-play video thumbnails with playback speed control and pause functionality on adult sites
// @author       6969RandomGuy6969
// @match        https://sxyprn.com/*
// @match        https://watchporn.to/*
// @match        https://yesporn.vip/*
// @match        https://www.theyarehuge.com/*
// @match        https://www.eporner.com/*
// @match        https://www.shyfap.net/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://cdn-icons-png.flaticon.com/512/3998/3998861.png
// @downloadURL https://update.greasyfork.org/scripts/534164/Auto-play%20video%20thumbnails%20%28Sxyprn%2C%20Watchporn%2C%20Yesporn%2C%20TheyAreHuge%2C%20Eporner%2C%20ShyFap%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534164/Auto-play%20video%20thumbnails%20%28Sxyprn%2C%20Watchporn%2C%20Yesporn%2C%20TheyAreHuge%2C%20Eporner%2C%20ShyFap%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==================== SETTINGS MANAGEMENT ====================
  const SETTINGS = {
    playbackSpeed: GM_getValue('playbackSpeed', 1),
    isPaused: GM_getValue('isPaused', false),
    panelX: GM_getValue('panelX', null),
    panelY: GM_getValue('panelY', null)
  };

  const videoRegistry = new Set();
  let configPanel = null;

  function updateAllVideos() {
    videoRegistry.forEach(video => {
      if (video && video.parentNode) {
        video.playbackRate = SETTINGS.playbackSpeed;
        if (SETTINGS.isPaused) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      }
    });
  }

  function setPlaybackSpeed(speed) {
    speed = Math.max(0.25, Math.min(2, speed));
    SETTINGS.playbackSpeed = speed;
    GM_setValue('playbackSpeed', speed);
    updateAllVideos();
    updatePanelDisplay();
  }

  function togglePause() {
    SETTINGS.isPaused = !SETTINGS.isPaused;
    GM_setValue('isPaused', SETTINGS.isPaused);
    updateAllVideos();
    updatePanelDisplay();
  }

  function updatePanelDisplay() {
    if (!configPanel) return;
    const speedDisplay = configPanel.querySelector('.speed-display');
    const pauseBtn = configPanel.querySelector('.pause-btn');
    if (speedDisplay) speedDisplay.textContent = `${SETTINGS.playbackSpeed.toFixed(2)}x`;
    if (pauseBtn) pauseBtn.textContent = SETTINGS.isPaused ? '▶️ Play' : '⏸️ Pause';
  }

  function createConfigPanel() {
    if (configPanel) {
      configPanel.style.display = 'block';
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'video-config-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <span class="panel-title">Thumbnail Control</span>
        <button class="close-btn">×</button>
      </div>
      <div class="panel-body">
        <div class="speed-control">
          <button class="speed-btn minus-btn">−</button>
          <span class="speed-display">${SETTINGS.playbackSpeed.toFixed(2)}x</span>
          <button class="speed-btn plus-btn">+</button>
        </div>
        <button class="pause-btn">${SETTINGS.isPaused ? '▶️ Play' : '⏸️ Pause'}</button>
      </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #video-config-panel {
        position: fixed;
        z-index: 999999;
        background: rgba(20, 20, 20, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0;
        font-family: Arial, sans-serif;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        user-select: none;
      }
      #video-config-panel .panel-header {
        background: rgba(40, 40, 40, 0.5);
        padding: 4px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        border-radius: 11px 11px 0 0;
      }
      #video-config-panel .panel-title {
        color: #fff;
        font-size: 11px;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      #video-config-panel .close-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 18px;
        height: 18px;
        line-height: 16px;
        border-radius: 3px;
        transition: all 0.2s;
      }
      #video-config-panel .close-btn:hover {
        background: rgba(255, 68, 68, 0.8);
        box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
      }
      #video-config-panel .panel-body {
        padding: 8px;
        background: rgba(30, 30, 30, 0.3);
        border-radius: 0 0 11px 11px;
      }
      #video-config-panel .speed-control {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-bottom: 6px;
      }
      #video-config-panel .speed-btn {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        font-size: 16px;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        padding: 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      #video-config-panel .speed-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }
      #video-config-panel .speed-btn:active {
        transform: scale(0.95);
      }
      #video-config-panel .speed-display {
        color: #fff;
        font-size: 13px;
        font-weight: bold;
        min-width: 45px;
        text-align: center;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      #video-config-panel .pause-btn {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        padding: 6px;
        font-size: 13px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      #video-config-panel .pause-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }
      #video-config-panel .pause-btn:active {
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(style);

    // Set position
    if (SETTINGS.panelX !== null && SETTINGS.panelY !== null) {
      panel.style.left = SETTINGS.panelX + 'px';
      panel.style.top = SETTINGS.panelY + 'px';
    } else {
      panel.style.right = '20px';
      panel.style.bottom = '20px';
    }

    document.body.appendChild(panel);
    configPanel = panel;

    // Event listeners
    panel.querySelector('.close-btn').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    panel.querySelector('.minus-btn').addEventListener('click', () => {
      setPlaybackSpeed(SETTINGS.playbackSpeed - 0.25);
    });

    panel.querySelector('.plus-btn').addEventListener('click', () => {
      setPlaybackSpeed(SETTINGS.playbackSpeed + 0.25);
    });

    panel.querySelector('.pause-btn').addEventListener('click', togglePause);

    // Draggable functionality
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    const header = panel.querySelector('.panel-header');

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('close-btn')) return;
      isDragging = true;
      initialX = e.clientX - (SETTINGS.panelX || panel.offsetLeft);
      initialY = e.clientY - (SETTINGS.panelY || panel.offsetTop);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      panel.style.left = currentX + 'px';
      panel.style.top = currentY + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        SETTINGS.panelX = currentX || panel.offsetLeft;
        SETTINGS.panelY = currentY || panel.offsetTop;
        GM_setValue('panelX', SETTINGS.panelX);
        GM_setValue('panelY', SETTINGS.panelY);
      }
      isDragging = false;
    });
  }

  // ==================== GM MENU ====================
  GM_registerMenuCommand('⚙️ Open Config UI', createConfigPanel);

  GM_registerMenuCommand('🔞 More Scripts (Sleazyfork)', () => {
    GM_openInTab('https://sleazyfork.org/en/users/1168969-6969randomguy6969', { active: true });
  });

  GM_registerMenuCommand('📜 More Scripts (Greasyfork)', () => {
    GM_openInTab('https://greasyfork.org/en/users/1168969-6969randomguy6969', { active: true });
  });

  // ==================== CORE FUNCTIONALITY ====================
  const hostname = window.location.hostname;

  // Generic preview injector - OPTIMIZED
  function insertPreviewVideo(image, videoUrl) {
    if (!videoUrl) return;

    // Avoid duplicate
    if (image.dataset.previewAttached) return;
    image.dataset.previewAttached = "1";

    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.loop = true;
    video.autoplay = !SETTINGS.isPaused;
    video.playsInline = true;
    video.preload = 'auto';
    video.playbackRate = SETTINGS.playbackSpeed;
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0';

    // Aggressive loading hints
    video.setAttribute('importance', 'high');
    video.setAttribute('fetchpriority', 'high');

    // Register video for speed/pause control
    videoRegistry.add(video);

    const parent = image.parentNode;
    parent.style.position = 'relative';
    parent.appendChild(video);
    image.style.opacity = "0";

    // Force immediate load and play
    if (!SETTINGS.isPaused) {
      video.load();
      video.play().catch(() => {});
    }

    // Cleanup on error
    video.onerror = () => {
      videoRegistry.delete(video);
      video.remove();
      image.style.opacity = "1";
    };
  }

  // IntersectionObserver wrapper - OPTIMIZED FOR SPEED
  function observeElements(selector, getUrl) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const url = getUrl(el);
          if (url) insertPreviewVideo(el, url);
          observer.unobserve(el);
        }
      });
    }, {
      rootMargin: "500px", // Increased preload distance
      threshold: 0.01 // Trigger earlier
    });

    const observedElements = new WeakSet();

    function watch() {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      });
    }

    watch();

    // Debounced mutation observer for performance
    let mutationTimeout;
    new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(watch, 100);
    }).observe(document.body, { childList: true, subtree: true });

    // Initial aggressive load
    setTimeout(watch, 500);
    setTimeout(watch, 1500);
  }

  // Site-specific handlers
  const siteHandlers = {
    "eporner.com": function () {
      function buildWebmUrl(videoIdFull) {
        const shortId = videoIdFull.substring(0, 8);
        const d1 = shortId.charAt(0);
        const d2 = shortId.substring(0, 2);
        const d3 = shortId.substring(0, 3);
        return `https://static-eu-cdn.eporner.com/thumbs/static4/${d1}/${d2}/${d3}/${shortId}/${shortId}-preview.webm`;
      }

      observeElements(".mbimg img[data-st]", img => {
        const dataSt = img.getAttribute("data-st");
        if (!dataSt) return null;
        const [videoIdFull] = dataSt.split("|");
        if (!videoIdFull || videoIdFull.length < 8) return null;
        return buildWebmUrl(videoIdFull);
      });
    },

    "sxyprn.com": function () {
      document.querySelectorAll(".mini_post_vid_thumb").forEach(img => {
        const video = img.nextElementSibling;
        if (video && (video.tagName === "VIDEO" || video.tagName === "IFRAME")) {
          video.playbackRate = SETTINGS.playbackSpeed;
          videoRegistry.add(video);
          if (SETTINGS.isPaused) {
            video.pause();
          } else {
            video.play();
          }
        }
      });
    },

    "watchporn.to": () =>
      observeElements("img.thumb.lazy-load[data-preview]", el => el.getAttribute("data-preview")),

    "yesporn.vip": () =>
      observeElements("img.lazy-load[data-preview]", el => el.getAttribute("data-preview")),

    "theyarehuge.com": function () {
      observeElements("img[data-preview]", el => el.getAttribute("data-preview"));

      // Dark theme injection
      const style = document.createElement("style");
      style.textContent = `
        body, html { background-color:#000 !important; color:#d1d1d1 !important; }
        * { background-color:transparent !important; border-color:#444 !important; color:inherit !important; }
        a, p, h1, h2, h3, h4, h5, h6, span, div { color:#d1d1d1 !important; }
        img, video { filter:brightness(0.95) contrast(1.1); }
        .header, .footer, .sidebar, .navbar, .top-menu, .main-header { background-color:#000 !important; }
        [style*="#303030"], [style*="#FFFFFF"] { background-color:#000 !important; color:#d1d1d1 !important; }
      `;
      document.head.appendChild(style);

      const logo = document.querySelector('img[src*="tah-logo-m.png"]');
      if (logo) {
        logo.style.filter = "invert(1) hue-rotate(-180deg) brightness(1) saturate(10)";
      }
    },

    "shyfap.net": function () {
      document.querySelectorAll(".media-card_preview").forEach(card => {
        const videoUrl = card.getAttribute("data-preview");
        const video = card.querySelector("video");
        const img = card.querySelector("img");

        if (video) {
          video.muted = true;
          video.loop = true;
          video.autoplay = !SETTINGS.isPaused;
          video.playsInline = true;
          video.preload = "auto";
          video.playbackRate = SETTINGS.playbackSpeed;
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "cover";
          videoRegistry.add(video);
          if (img) img.style.display = "none";
          if (SETTINGS.isPaused) {
            video.pause();
          }
        } else if (img && videoUrl) {
          insertPreviewVideo(img, videoUrl);
        }
      });
    }
  };

  // Dispatcher
  window.addEventListener("load", () => {
    for (const domain in siteHandlers) {
      if (hostname.includes(domain)) {
        siteHandlers[domain]();
        break;
      }
    }
  });
})();