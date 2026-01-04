// ==UserScript==
// @name         9anime UltraViewer Pro (Remake by Domopremo)
// @namespace    https://greasyfork.org/en/users/domopremo
// @version      8.0
// @description  Remastered binge-watching experience for 9anime: auto fullscreen, intro skip, next episode, quality boost, right-click unlock, iframe tools, and UI panel. A complete remake by Domopremo.
// @match        https://aniwave.to/*
// @include      https://www*.9anime.*/*
// @include      https://netmovies.to/*
// @include      https://guccihide.com/*
// @include      https://rabbitstream.net/*
// @include      https://sbface.com/*
// @include      https://filemoon.sx/*
// @include      https://9anime.*/*
// @include      https://*.9anime.*/*
// @include      https://9anime.id/*
// @include      https://vidstream.pro/*
// @include      https://vidstreamz.online/*
// @include      https://vizcloud.online/*
// @include      https://vizcloud2.online/*
// @include      https://vizcloud.*/*
// @include      https://vizcloud.store/*
// @include      https://blob:vizcloud.store/*
// @include      https://mcloud.to/*
// @include      https://mcloud2.to/* 
// @include      https://storage.googleapis.com/*
// @include      https://movies7.to/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/439099-monkeyconfig-modern-reloaded/code/MonkeyConfig%20Modern%20Reloaded.js?version=1012538
// @downloadURL https://update.greasyfork.org/scripts/544556/9anime%20UltraViewer%20Pro%20%28Remake%20by%20Domopremo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544556/9anime%20UltraViewer%20Pro%20%28Remake%20by%20Domopremo%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const $ = window.jQuery.noConflict(true);

  const cfg = new MonkeyConfig({
    title: 'UltraViewer Settings',
    menuCommand: true,
    params: {
      skipIntroSeconds: { type: 'number', default: 89 },
      skipCompanyIDSeconds: { type: 'number', default: 10 },
      introKey: { type: 'text', default: 'v' },
      companyIDKey: { type: 'text', default: 'q' },
      nextEpKey: { type: 'text', default: 'n' },
      autoFullscreen: { type: 'checkbox', default: true },
      autoQuality: { type: 'checkbox', default: true }
    }
  });

  function unlockRightClick() {
    const events = ['contextmenu', 'selectstart', 'mousedown', 'mouseup', 'dragstart'];
    events.forEach(type => {
      document.addEventListener(type, e => e.stopPropagation(), true);
      document.body[`on${type}`] = null;
    });
    document.querySelectorAll('*').forEach(el => el.removeAttribute('oncontextmenu'));
  }

  function waitForPlayer(callback) {
    const interval = setInterval(() => {
      const player = $('video').get(0);
      if (player) {
        clearInterval(interval);
        callback(player);
      }
    }, 1000);
  }

  function setupFullscreen(player) {
    if (!document.fullscreenElement && cfg.get('autoFullscreen')) {
      player.requestFullscreen?.();
      player.focus();
    }
  }

  function setupHotkeys(player) {
    $('body').on('keypress', (event) => {
      const key = String.fromCharCode(event.which || event.keyCode);
      if (key === cfg.get('introKey')) {
        player.currentTime += cfg.get('skipIntroSeconds');
      } else if (key === cfg.get('companyIDKey')) {
        player.currentTime += cfg.get('skipCompanyIDSeconds');
      } else if (key === cfg.get('nextEpKey')) {
        player.currentTime = player.duration;
      }
    });
  }

  function autoQualitySelect() {
    const qualityInterval = setInterval(() => {
      const auto = $("div[aria-label='Settings']");
      if (auto.length) {
        auto[0].click();
        const high = $("button[aria-checked='false']:contains('1080p')");
        if (high.length) high[0].click();
        clearInterval(qualityInterval);
      }
    }, 1000);
  }

  function addIframeTools() {
    const iframe = document.querySelector('iframe#iframe-embed');
    if (!iframe || document.getElementById('iframe-tools')) return;

    const btnWrapper = document.createElement('div');
    btnWrapper.id = 'iframe-tools';
    btnWrapper.style.position = 'fixed';
    btnWrapper.style.top = '20px';
    btnWrapper.style.left = '20px';
    btnWrapper.style.zIndex = '9999';

    const makeBtn = (id, text, href) => {
      const btn = document.createElement('a');
      btn.id = id;
      btn.href = href;
      btn.target = '_blank';
      btn.textContent = text;
      btn.style = `
        margin-bottom: 10px;
        background: #5a2e98;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 13px;
        font-weight: bold;
        display: block;
      `;
      return btn;
    };

    btnWrapper.appendChild(makeBtn('open-player-btn', '🔓 Open Player', iframe.src));

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      const video = iframeDoc?.querySelector('video');
      const src = video?.src || video?.querySelector('source')?.src;
      if (src) {
        btnWrapper.appendChild(makeBtn('download-btn', '⬇ Download Video', src));
      }
    } catch (e) {
      console.warn("[UltraViewer] CORS blocked access to video src — try using '🔓 Open Player' instead.");
    }

    document.body.appendChild(btnWrapper);
  }

  function init() {
    unlockRightClick();
    waitForPlayer((player) => {
      setupFullscreen(player);
      setupHotkeys(player);
      if (cfg.get('autoQuality')) setTimeout(autoQualitySelect, 2000);

      player.addEventListener('ended', () => {
        const nextBtn = document.querySelector('.btn-next');
        if (nextBtn?.href) window.location.href = nextBtn.href;
      });
    });
    setInterval(addIframeTools, 2000);
    setInterval(unlockRightClick, 1000);
  }

  $(window).on('load', init);
})();
