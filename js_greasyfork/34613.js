// ==UserScript==
// @name YouTube™ Multi Downloader v11.0 🌐 (PC & Mobile 🚀) — AdBlock, Zero ADS 🚫🔥 | Shorts, Videos & Music
// @name:pt-BR YouTube™ Multi Downloader v11.0 🌐 (PC & Mobile 🚀) — AdBlock, Zero ADS 🚫🔥 | Shorts, Videos & Music
// @description Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience. 
// @description:pt-BR Adiciona um botão flutuante para baixar vídeos, Shorts e músicas do YouTube em alta qualidade, com bloqueio de anúncios integrado para uma experiência rápida e suave.
// @description:ar Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:bg Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:cs Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:da Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:de Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:el Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:eo Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:es Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:fi Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:fr Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:fr-CA Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:he Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:hu Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:id Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:it Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ja Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ko Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:nb Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:nl Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:pl Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ro Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ru Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:sk Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:sr Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:sv Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:th Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:tr Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:uk Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:ug Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:vi Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:zh-CN Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @description:zh-TW Adds a floating button to download YouTube videos, Shorts, and music in high quality, with built-in ad blocking for a fast and smooth experience.
// @namespace https://greasyfork.org/users/152924
// @homepageURL https://greasyfork.org/scripts/34613
// @supportURL https://greasyfork.org/scripts/34613/feedback
// @author Punisher
// @version 11.0 RTM
// @date 2026-01-15
// @icon https://iili.io/fOyuFFS.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @license CC-BY-NC-ND-4.0
// @match https://*.youtube.com/*
// @match https://music.youtube.com/*
// @grant GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/34613/YouTube%E2%84%A2%20Multi%20Downloader%20v110%20%F0%9F%8C%90%20%28PC%20%20Mobile%20%F0%9F%9A%80%29%20%E2%80%94%20AdBlock%2C%20Zero%20ADS%20%F0%9F%9A%AB%F0%9F%94%A5%20%7C%20Shorts%2C%20Videos%20%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/34613/YouTube%E2%84%A2%20Multi%20Downloader%20v110%20%F0%9F%8C%90%20%28PC%20%20Mobile%20%F0%9F%9A%80%29%20%E2%80%94%20AdBlock%2C%20Zero%20ADS%20%F0%9F%9A%AB%F0%9F%94%A5%20%7C%20Shorts%2C%20Videos%20%20Music.meta.js
// ==/UserScript==

(function() {
  "use strict";

  let video;
  const playerBtnID = "ytDownloadBtn";
  const floatBtnID = "ytPunisherBtn";
  const btnColor = "#575656";
  const punisherURL = "//wefightyourtickets.ca/convert/?id=";
  const cssSelectorArr = [
    ".video-ads.ytp-ad-module",
    "#player-ads .ytp-ad-module",
    ".ytp-ad-player-overlay",
    ".ytp-ad-preview-container",
    ".ytp-ad-progress-list",
    ".ytp-ad-skip-button, .ytp-ad-skip-button-modern",
    "#related ytd-ad-slot-renderer",
    "#related #player-ads",
    "ytd-companion-ad-renderer",
    ".ytd-watch-next-secondary-results-renderer ytd-ad-slot-renderer",
    "yt-mealbar-promo-renderer",
    "ytd-popup-container:has(a[href='/premium'])",
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
    "tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-endpoint-ad-renderer",
    "ytd-shorts-ad-renderer",
    "ytd-reel-shelf-renderer ytd-ad-slot-renderer",
    "ytd-reel-video-renderer ytd-ad-slot-renderer",
    "#shorts-player ytd-ad-slot-renderer",
    "ytd-ad-slot-renderer",
    "ad-slot-renderer",
    ".ad-container",
    ".ytp-ad-module",
    ".ytd-display-ad-renderer"
  ];

  const checkRunFlag = id => {
    if (document.getElementById(id)) return true;
    const style = document.createElement("style");
    style.id = id;
    (document.head || document.body).appendChild(style);
    return false;
  };

  const generateRemoveADCssText = arr => arr.map(s => `${s}{display:none!important}`).join(" ");
  const getVideoID = url => {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})|\/shorts\/([0-9A-Za-z_-]{11})/);
    return m ? (m[1] || m[2]) : null;
  };
  
  const getBypassURL = vid => vid ? punisherURL + vid : null;
  const findButtonContainer = () =>
    document.querySelector("#top-level-buttons-computed") ||
    document.querySelector("ytd-video-primary-info-renderer #actions") ||
    document.querySelector("ytmusic-player-bar") ||
    document.querySelector("div#menu-container") ||
    document.querySelector("[role='group'][aria-label]");
  const getVideoDom = () => video = document.querySelector(".ad-showing video") || document.querySelector("video");
  const playAfterAd = () => { if (video && video.paused && video.currentTime < 1) video.play(); };

  const generateRemoveADHTMLElement = id => {
    if (checkRunFlag(id)) return;
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArr)));
    (document.head || document.body).appendChild(style);
  };

  const closeOverlay = () => {
    document.querySelectorAll("ytd-popup-container a[href='/premium']").forEach(el => el.closest("ytd-popup-container")?.remove());
    document.querySelectorAll("tp-yt-iron-overlay-backdrop").forEach(el => { el.className = ""; el.removeAttribute("opened"); });
  };

  const nativeTouch = function() {
    const t = new Touch({ identifier: Date.now(), target: this, clientX: 0, clientY: 0, radiusX: 1, radiusY: 1, rotationAngle: 0, force: 1 });
    this.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, touches: [t], targetTouches: [t], changedTouches: [t] }));
    this.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, touches: [], targetTouches: [], changedTouches: [t] }));
  };

  const skipAd = () => {
    if (!video) return;
    const btn = document.querySelector(".ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern");
    const shortMsg = document.querySelector(".video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon");
    if ((btn || shortMsg) && location.hostname !== "m.youtube.com") video.muted = true;
    if (btn) { btn.click(); nativeTouch.call(btn); video.currentTime = video.duration; }
    else if (shortMsg) video.currentTime = video.duration;
  };

  const removePlayerAD = id => {
    if (checkRunFlag(id)) return;
    const obs = new MutationObserver(() => { getVideoDom(); closeOverlay(); skipAd(); playAfterAd(); });
    obs.observe(document.body, { childList: true, subtree: true });
  };

  let lastVideoId = null;
  async function addPlayerButton() {
    const vid = getVideoID(location.href);
    if (!vid || vid === lastVideoId) return;
    lastVideoId = vid;
    const container = findButtonContainer();
    if (!container) return;
    let btn = document.getElementById(playerBtnID);
    if (!btn) {
      btn = document.createElement("a");
      btn.id = playerBtnID;
      btn.target = "_blank";
      btn.textContent = "Download";
      container.appendChild(btn);
    }
    btn.href = getBypassURL(vid);
  }

  function addFloatButton() {
    if (document.getElementById(floatBtnID)) return;
    const btn = document.createElement("button");
    btn.id = floatBtnID;
    let dragging = false, ox = 0, oy = 0;
    const limit = (x, y) => ({ x: Math.max(0, Math.min(x, innerWidth - btn.offsetWidth)), y: Math.max(0, Math.min(y, innerHeight - btn.offsetHeight)) });
    const open = () => { const vid = getVideoID(location.href); if (vid) window.open(getBypassURL(vid), "_blank"); };
    const start = (x, y) => { dragging = true; const r = btn.getBoundingClientRect(); ox = x - r.left; oy = y - r.top; btn.style.cursor = "grabbing"; };
    const move = (x, y) => { if (!dragging) return; const p = limit(x - ox, y - oy); btn.style.left = p.x + "px"; btn.style.top = p.y + "px"; btn.style.right = btn.style.bottom = "auto"; };
    const end = () => { dragging = false; btn.style.cursor = "grab"; };

    btn.addEventListener("mousedown", e => start(e.clientX, e.clientY));
    document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
    document.addEventListener("mouseup", end);
    btn.addEventListener("touchstart", e => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("touchmove", e => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    document.addEventListener("touchend", end);
    btn.addEventListener("click", () => !dragging && open());

    if (window.matchMedia("(pointer: fine)").matches) {
      let hideTimer;
      const showBtn = () => { btn.classList.remove("punisher-hidden"); clearTimeout(hideTimer); hideTimer = setTimeout(() => btn.classList.add("punisher-hidden"), 3000); };
      document.addEventListener("mousemove", showBtn);
      document.addEventListener("mousedown", showBtn);
      document.addEventListener("keydown", showBtn);
      showBtn();
    }
    document.body.appendChild(btn);
  }

  GM_addStyle(`
    #${playerBtnID}{background:${btnColor};color:#fff;border:1px solid rgba(255,255,255,.2);margin-left:8px;padding:0 16px;border-radius:18px;font:500 14px Roboto,Noto,sans-serif;display:inline-flex;align-items:center;height:36px;text-decoration:none;}
    #${floatBtnID}{background:${btnColor} url("https://iili.io/fObpSDv.png") no-repeat center;background-size:65%;position:fixed;top:70%;right:20px;transform:translateY(-50%);width:60px;height:60px;border-radius:50%;border:none;cursor:grab;display:flex;justify-content:center;align-items:center;z-index:9999;box-shadow:0 6px 12px rgba(0,0,0,.3);transition:opacity .4s ease;opacity:1;}
    #${floatBtnID}.punisher-hidden{opacity:0;pointer-events:none;}
  `);

  generateRemoveADHTMLElement("yt-remove-ad-css");
  removePlayerAD("yt-remove-player-ad");

  const update = () => { addPlayerButton(); addFloatButton(); };
  let lastURL = location.href;
  setInterval(() => { if (location.href !== lastURL) { lastURL = location.href; update(); } }, 800);

  const domObserver = new MutationObserver(() => update());
  domObserver.observe(document.body, { childList: true, subtree: true });
  update();
})();