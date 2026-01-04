// ==UserScript==
// @name         YouTube Ultra Modern Redesign
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modernisiert das YouTube-Design mit Parallax, Glas-Effekten und minimalistischer Ästhetik
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537245/YouTube%20Ultra%20Modern%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/537245/YouTube%20Ultra%20Modern%20Redesign.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap');
  `);

  GM_addStyle(`
    body, ytd-app {
      font-family: 'Inter', sans-serif !important;
      background: linear-gradient(120deg, #0d0d0d, #1a1a1a) !important;
      color: #f1f1f1 !important;
      overflow-x: hidden !important;
    }

    #container, ytd-masthead, ytd-mini-guide-renderer, ytd-guide-renderer {
      backdrop-filter: blur(10px) saturate(150%) !important;
      background-color: rgba(20, 20, 20, 0.6) !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
      transition: all 0.4s ease-in-out !important;
    }

    ytd-thumbnail, ytd-video-renderer, ytd-rich-item-renderer {
      transform: perspective(1000px);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    ytd-thumbnail:hover {
      transform: scale(1.03) rotateX(3deg);
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    ytd-video-renderer:hover, ytd-rich-item-renderer:hover {
      transform: scale(1.01);
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }

    ytd-rich-grid-media {
      border-radius: 16px;
      overflow: hidden;
    }

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    ytd-video-renderer, ytd-rich-item-renderer {
      position: relative;
    }

    ytd-video-renderer::after, ytd-rich-item-renderer::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: radial-gradient(transparent 40%, rgba(255,255,255,0.05));
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    ytd-video-renderer:hover::after, ytd-rich-item-renderer:hover::after {
      opacity: 1;
    }

    .ytd-rich-grid-renderer > ytd-rich-item-renderer {
      animation: fadeInUp 0.8s ease forwards;
      opacity: 0;
      transform: translateY(40px);
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ytd-thumbnail img {
      border-radius: 10px;
      transition: filter 0.3s ease, border-radius 0.3s;
    }

    ytd-thumbnail:hover img {
      filter: brightness(1.1);
      border-radius: 16px;
    }

    #guide-button, #logo {
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.15));
    }

    .html5-video-player {
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(0,0,0,0.3);
    }

    ytd-masthead {
      position: sticky;
      top: 0;
      z-index: 999;
      background-color: rgba(10,10,10,0.7) !important;
      backdrop-filter: blur(10px) !important;
      transition: background-color 0.4s ease;
    }

    yt-icon-button, ytd-toggle-button-renderer {
      transition: transform 0.2s ease;
    }

    yt-icon-button:hover, ytd-toggle-button-renderer:hover {
      transform: scale(1.1);
    }
  `);
})();