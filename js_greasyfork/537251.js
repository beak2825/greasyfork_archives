// ==UserScript==
// @name         YouTube Neon Interactive Effects
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Neon Glow nur beim Hover/Klick + Konfetti Like + Neon Puls bei Subscribe auf YouTube
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537251/YouTube%20Neon%20Interactive%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/537251/YouTube%20Neon%20Interactive%20Effects.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Neon Glow CSS (nur beim Hover & Focus) ---
  const css = `
    button, tp-yt-paper-button, tp-yt-iron-icon-button, ytd-toggle-button-renderer {
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      cursor: pointer;
      outline: none;
    }
    button:hover, button:focus,
    tp-yt-paper-button:hover, tp-yt-paper-button:focus,
    tp-yt-iron-icon-button:hover, tp-yt-iron-icon-button:focus,
    ytd-toggle-button-renderer:hover, ytd-toggle-button-renderer:focus {
      box-shadow:
        0 0 8px #ff0040,
        0 0 15px #ff0040,
        0 0 20px #ff66cc;
      transform: scale(1.05);
    }
    button:active,
    tp-yt-paper-button:active,
    tp-yt-iron-icon-button:active,
    ytd-toggle-button-renderer:active {
      transform: scale(0.95);
      box-shadow:
        0 0 12px #ff3399,
        0 0 25px #ff66cc;
    }
    /* Neon Puls für Subscribe (wird dynamisch hinzugefügt) */
    .neon-pulse {
      animation: neonPulse 1.2s ease forwards;
    }
    @keyframes neonPulse {
      0% { box-shadow: 0 0 0 #ff0040; }
      50% { box-shadow:
          0 0 10px #ff0040,
          0 0 30px #ff66cc,
          0 0 40px #ff0040; }
      100% { box-shadow: 0 0 0 #ff0040; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- Konfetti-Bibliothek laden (canvas-confetti) ---
  function loadScript(src) {
    return new Promise(res => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = res;
      document.body.appendChild(s);
    });
  }

  async function init() {
    await loadScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js');

    // --- Funktion: Konfetti aus Button (Like) ---
    function konfettiAusloesen(event) {
      const rect = event.target.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x: (rect.left + rect.width/2) / window.innerWidth, y: (rect.top + rect.height/2) / window.innerHeight },
        colors: ['#ff0040', '#ff66cc', '#ff99cc', '#ff3399']
      });
    }

    // --- Klick-Handler für Like-Button ---
    function handleLikeClicks() {
      // YouTube Like-Button: button mit id "top-level-buttons-computed" -> mehrere Buttons, Like ist meist 1. oder 0. Kind mit aria-label 'like this video'
      const buttons = document.querySelectorAll('#top-level-buttons-computed ytd-toggle-button-renderer');
      buttons.forEach(btn => {
        btn.removeEventListener('click', konfettiAusloesen); // Doppelte Listener vermeiden
        btn.addEventListener('click', konfettiAusloesen);
      });
    }

    // --- Klick-Handler für Subscribe-Button ---
    function handleSubscribeClicks() {
      // Subscribe Button: ytd-subscribe-button-renderer paper-button
      const subBtn = document.querySelector('ytd-subscribe-button-renderer tp-yt-paper-button');
      if (!subBtn) return;

      subBtn.removeEventListener('click', neonPulse);
      subBtn.addEventListener('click', neonPulse);
    }

    // --- Neon-Puls Animation auf Body ---
    function neonPulse() {
      document.body.classList.add('neon-pulse');
      setTimeout(() => {
        document.body.classList.remove('neon-pulse');
      }, 1200);
    }

    // --- Initial & Beobachtung für dynamisch geladene Buttons ---
    function initAll() {
      handleLikeClicks();
      handleSubscribeClicks();
    }

    initAll();

    // YouTube lädt dynamisch nach -> MutationObserver
    const observer = new MutationObserver(() => {
      initAll();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  init();

})();