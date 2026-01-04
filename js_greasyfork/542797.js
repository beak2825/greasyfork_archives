// ==UserScript==
// @name         YouTube - Holographic Interface (Holo Glitch)
// @namespace    http://tampermonkey.net/
// @version      0.39
// @description  Le bouton est maintenant un petit cercle discret dans le coin inférieur gauche.
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542797/YouTube%20-%20Holographic%20Interface%20%28Holo%20Glitch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542797/YouTube%20-%20Holographic%20Interface%20%28Holo%20Glitch%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let wasPlayingBeforeOff = false;

  GM_addStyle(`
    /* -- ANIMATIONS -- */
    @keyframes holo-reveal { 0% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes interface-materialize { 0% { opacity: 0; clip-path: inset(49% 0 49% 0); filter: blur(10px) brightness(2.5); transform: scale(0.98); } 60% { opacity: 0.8; clip-path: inset(10% 0 10% 0); filter: blur(2px) brightness(1.5); } 100% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0) brightness(1); transform: scale(1); } }
    @keyframes interface-dematerialize { 0% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0) brightness(1); transform: scale(1); } 40% { opacity: 0.8; clip-path: inset(10% 0 10% 0); filter: blur(2px) brightness(1.5); } 100% { opacity: 0; clip-path: inset(49% 0 49% 0); filter: blur(10px) brightness(2.5); transform: scale(0.98); } }
    @keyframes hologram-glitch { 0%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); } 3% { transform: translate(-1px, 2px); } 6% { transform: translate(1px, -1px); clip-path: inset(25% 0 74% 0); } 7% { transform: translate(0, 0); clip-path: inset(0 0 0 0); } 15% { transform: translate(-2px, -1px) skew(-3deg); } 16% { transform: translate(0, 0); } 30% { clip-path: inset(80% 0 1% 0); } 31% { clip-path: inset(0 0 0 0); } 55% { transform: translate(2px, -2px) skew(4deg); } 56% { transform: translate(0,0); } 88% { clip-path: inset(95% 0 4% 0); } 89% { clip-path: inset(0 0 0 0); } }

    /* -- STYLES DES OVERLAYS -- */
    .holo-layer, .holo-bar { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998; animation: holo-reveal 0.8s ease-out; }
    .holo-hue { background: rgba(0,120,255,0.5); mix-blend-mode: color; }
    .holo-overlay { background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px); mix-blend-mode: overlay; }
    .mini-bars { background-image: repeating-linear-gradient( to bottom, rgba(160,220,255,0.3) 0px, rgba(160,220,255,0.3) 2px, transparent 2px, transparent 8px); mix-blend-mode: overlay; }
    .holo-bar { height: 12%; background: rgba(0,120,255,0.6); mix-blend-mode: overlay; } .holo-bar.top { top: 0; } .holo-bar.bot { bottom: 0; }

    /* -- Cache la scrollbar -- */
    html::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
    html { scrollbar-width: none !important; -ms-overflow-style: none; }

    /* ====================================================================== */
    /* MODIFIÉ : Style du bouton discret                                      */
    /* ====================================================================== */
    #holo-toggle-btn {
        position: fixed;
        bottom: 15px; /* Position en bas */
        left: 15px;   /* ... à gauche */
        z-index: 10000;
        width: 15px;   /* Taille du cercle */
        height: 15px;
        border-radius: 50%; /* Transformation en cercle */
        cursor: pointer;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid rgba(0, 0, 0, 0.5); /* Bordure pour le contraste */
    }

    /* État désactivé */
    #holo-toggle-btn.off {
        background-color: #444;
        box-shadow: 0 0 4px #000;
    }

    /* État activé */
    #holo-toggle-btn:not(.off) {
        background-color: #00bfff;
        box-shadow: 0 0 5px #00bfff, 0 0 10px #00bfff; /* Effet de lueur */
    }

    /* -- GESTION DES ÉTATS DE L'INTERFACE -- */
    body.holo-inactive ytd-app { display: none !important; }
    body.holo-active ytd-app, body.holo-transition-off ytd-app { position: relative; display: block !important; overflow: hidden; }
    body.holo-active ytd-app { animation: interface-materialize 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards, hologram-glitch 4s 1.2s infinite steps(1, end); }
    body.holo-transition-off ytd-app { animation: interface-dematerialize 0.7s cubic-bezier(0.78, 0, 0.42, 1) forwards; }
  `);

  // --- Le JavaScript qui gère la logique ---

  const layers = [ { cls: 'holo-layer holo-hue' }, { cls: 'holo-layer holo-overlay' }, { cls: 'holo-layer mini-bars' }, { cls: 'holo-bar top' }, { cls: 'holo-bar bot' }, ];
  function pauseVideo() { const v = document.querySelector('video'); if (v && !v.paused) { wasPlayingBeforeOff = true; v.pause(); } else { wasPlayingBeforeOff = false; } }
  function runVideo() { const v = document.querySelector('video'); if (v && v.paused) { v.play(); wasPlayingBeforeOff = true; } }
  function preventAutoplay() { const v = document.querySelector('video'); if (v && !v.paused) v.pause(); }
  function removeOverlays() { document.querySelectorAll('.holo-layer, .holo-bar').forEach(e => e.remove()); }
  function injectOverlays() { const ytdApp = document.querySelector('ytd-app'); if (!ytdApp || !window.holoEnabled) return; layers.forEach(({ cls }) => { const sel = '.' + cls.split(' ').join('.'); if (!ytdApp.querySelector(sel)) { const e = document.createElement('div'); e.className = cls; ytdApp.appendChild(e); } }); }

  function createToggleButton() {
    if (document.readyState === 'complete' && !wasPlayingBeforeOff) preventAutoplay();
    if (document.getElementById('holo-toggle-btn')) return;
    const btn = document.createElement('div');
    btn.id = 'holo-toggle-btn';
    // Le texte du bouton n'est plus nécessaire
    btn.classList.add('off');

    btn.addEventListener('click', () => {
      window.holoEnabled = !window.holoEnabled;
      const ytdApp = document.querySelector('ytd-app');

      if (window.holoEnabled) {
        // --- ALLUMAGE ---
        btn.classList.remove('off');
        document.body.classList.remove('holo-inactive', 'holo-transition-off');
        document.body.classList.add('holo-active');
        injectOverlays();
        runVideo();
      } else {
        // --- EXTINCTION ---
        btn.classList.add('off');
        document.body.classList.remove('holo-active');
        document.body.classList.add('holo-transition-off');
        pauseVideo();
        if (ytdApp) {
          ytdApp.addEventListener('animationend', function handler() {
            removeOverlays();
            document.body.classList.remove('holo-transition-off');
            document.body.classList.add('holo-inactive');
            ytdApp.removeEventListener('animationend', handler);
          });
        } else {
          removeOverlays(); document.body.classList.add('holo-inactive');
        }
      }
    });

    document.body.appendChild(btn);
  }

  window.holoEnabled = false;
  document.body.classList.add('holo-inactive');
  createToggleButton();
  new MutationObserver(createToggleButton).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('fullscreenchange', injectOverlays);
})();