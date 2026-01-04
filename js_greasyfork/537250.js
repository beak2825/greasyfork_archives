// ==UserScript==
// @name         YouTube Neon Glow + Hawaii + Loader + Scroll Effekte + Demos
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  YouTube mit Neon-Glow-Buttons, Hawaii-Hover, Ladeanimation, Scroll- und Parallax-Effekten (AOS & Rellax.js) plus Demo-Elementen für AOS & Rellax.js erweitern.
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537250/YouTube%20Neon%20Glow%20%2B%20Hawaii%20%2B%20Loader%20%2B%20Scroll%20Effekte%20%2B%20Demos.user.js
// @updateURL https://update.greasyfork.org/scripts/537250/YouTube%20Neon%20Glow%20%2B%20Hawaii%20%2B%20Loader%20%2B%20Scroll%20Effekte%20%2B%20Demos.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 1. CSS Styles (Neon Glow, Hawaii Hover, Loader, AOS Styles)
  const css = `
  /* Neon Glow Grundstil für Buttons, Icon-Buttons etc. */
  button, input[type="button"], input[type="submit"], 
  a.button, #scrollTopBtn, #darkModeToggle,
  yt-icon-button, tp-yt-paper-icon-button {
    background: #111 !important;
    color: #0ff !important;
    border: 2px solid #0ff !important;
    border-radius: 10px !important;
    padding: 0.6em 1.2em !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    cursor: pointer !important;
    box-shadow:
      0 0 5px #0ff,
      0 0 10px #0ff,
      0 0 20px #0ff,
      0 0 30px #0ff !important;
    text-shadow:
      0 0 5px #0ff,
      0 0 10px #0ff !important;
    transition: all 0.4s ease !important;
    position: relative !important;
    overflow: hidden !important;
    user-select: none !important;
  }
  button:hover, input[type="button"]:hover, input[type="submit"]:hover,
  a.button:hover, #scrollTopBtn:hover, #darkModeToggle:hover,
  yt-icon-button:hover, tp-yt-paper-icon-button:hover {
    color: white !important;
    border-color: transparent !important;
    animation: hawaiiGlow 2.5s linear infinite !important;
    box-shadow:
      0 0 8px #fff,
      0 0 20px #ff00ff,
      0 0 30px #00ffff,
      0 0 40px #ffcc00,
      0 0 50px #ff3300 !important;
    transform: scale(1.05) !important;
  }
  @keyframes hawaiiGlow {
    0%   { box-shadow:0 0 8px #ff0080,0 0 20px #ffcc00,0 0 30px #00ffff,0 0 40px #ff3300,0 0 50px #33ff77; }
    25%  { box-shadow:0 0 8px #00ffff,0 0 20px #33ff77,0 0 30px #ff0080,0 0 40px #ffcc00,0 0 50px #ff3300; }
    50%  { box-shadow:0 0 8px #ffcc00,0 0 20px #ff3300,0 0 30px #33ff77,0 0 40px #00ffff,0 0 50px #ff0080; }
    75%  { box-shadow:0 0 8px #33ff77,0 0 20px #ff0080,0 0 30px #ff3300,0 0 40px #ffcc00,0 0 50px #00ffff; }
    100% { box-shadow:0 0 8px #ff0080,0 0 20px #ffcc00,0 0 30px #00ffff,0 0 40px #ff3300,0 0 50px #33ff77; }
  }

  /* Loader Container & Spinner */
  #custom-loader {
    position: fixed; top:0; left:0; right:0; bottom:0;
    background: #000c; display:flex; align-items:center; justify-content:center;
    z-index:999999 !important;
  }
  #custom-loader .spinner {
    border:8px solid #111; border-top:8px solid #0ff;
    border-radius:50%; width:60px; height:60px;
    animation:spin 1.5s linear infinite;
    box-shadow:0 0 15px #0ff,0 0 30px #0ff;
  }
  @keyframes spin { 0% {transform:rotate(0deg);} 100% {transform:rotate(360deg);} }

  /* AOS Library Standard Styles */
  .aos-init { opacity:0; transition-property:opacity,transform; transition-timing-function:ease; }
  .aos-animate { opacity:1; }

  /* Demo-Container Styles */
  #demo-effects {
    max-width:90%; margin:60px auto; padding:20px;
    background:rgba(17,17,17,0.8); border:2px solid #0ff; border-radius:12px;
  }
  `;

  // injiziere Styles
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Loader einblenden
  const loader = document.createElement('div');
  loader.id = 'custom-loader';
  loader.innerHTML = `<div class="spinner"></div>`;
  document.body.appendChild(loader);

  // Externe Bibliotheken laden
  function loadScript(src) {
    return new Promise(res => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = res;
      document.body.appendChild(s);
    });
  }
  function loadCSS(href) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
  }

  async function initEffects() {
    // AOS
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js');

    // Rellax
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/rellax/1.12.1/rellax.min.js');

    // AOS init
    AOS.init({ duration:1200, easing:'ease-in-out', once:false, mirror:true });

    // Rellax init
    new Rellax('.rellax', { speed:-2, center:true, round:true });

    // Loader ausblenden
    setTimeout(() => loader.remove(), 2000);

    // Demo-Elemente hinzufügen
    const demo = document.createElement('div');
    demo.id = 'demo-effects';
    demo.innerHTML = `
      <div data-aos="fade-up" style="padding:20px; color:#0ff; font-size:1.2rem; text-align:center;">
        🎉 AOS Fade-Up Demo 🎉
      </div>
      <div class="rellax" data-rellax-speed="-3"
           style="margin-top:30px; height:200px; background:url('https://picsum.photos/800/400') no-repeat center/cover; border-radius:8px;">
      </div>`;
    document.body.appendChild(demo);
  }

  initEffects();

})();