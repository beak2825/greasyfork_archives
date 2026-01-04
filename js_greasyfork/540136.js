// ==UserScript==
// @name         GitHub: Cyberpunk Neon
// @namespace    Violentmonkey Scripts
// @match        https://github.com/*
// @grant        GM_addStyle
// @version      1.6
// @description  Glowing neon GitHub theme!
// @author       andre-cmd-rgb
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540136/GitHub%3A%20Cyberpunk%20Neon.user.js
// @updateURL https://update.greasyfork.org/scripts/540136/GitHub%3A%20Cyberpunk%20Neon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`

    /* ========================
       START CONFIGURATION
       ======================== */
    :root {
      --cyber-hover-color: #F0386B; /* <-- EDIT THIS */
    }
    /* ========================
       END CONFIGURATION
       ======================== */
    /* Derived colors */
    :root {
      --cyber-accent-color: var(--cyber-hover-color);
      --cyber-hover-glow: var(--cyber-hover-color);

      --cyber-bg-accent-muted: rgba(240, 56, 107, 0.15);
      --cyber-bg-accent-light: rgba(240, 56, 107, 0.1);
      --cyber-border-color: rgba(240, 56, 107, 0.4);
      --cyber-fg-muted: rgba(240, 56, 107, 0.5);
      --cyber-tooltip-bg: rgba(10, 11, 30, 0.95);
      --cyber-tooltip-color: var(--cyber-hover-color);
    }

    @keyframes cyberpunk-flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    /* === DARK THEME OVERRIDES === */
    [data-color-mode="dark"][data-dark-theme],
    [data-color-mode="auto"][data-light-theme="dark"] {
      --font-family-monospace: "Fira Code", Consolas, monospace;
      --font-family-sans-serif: "Fira Code", "Segoe UI", Arial, sans-serif;

      --bgColor-default: #0A0B1E;
      --bgColor-muted: #14182B;
      --bgColor-inset: #060814;

      --borderColor-default: var(--cyber-border-color);
      --borderColor-muted: var(--cyber-bg-accent-light);

      --fgColor-default: #E0E1F0;
      --fgColor-muted: var(--cyber-fg-muted);

      --fgColor-accent: var(--cyber-accent-color);
      --bgColor-accent-muted: var(--cyber-bg-accent-light);
      --bgColor-accent-emphasis: rgba(240, 56, 107, 0.3);
      --borderColor-accent-emphasis: var(--cyber-accent-color);

      background-color: var(--bgColor-default) !important;
      background-image:
        linear-gradient(rgba(10, 12, 30, 0.9), rgba(10, 12, 30, 0.9)),
        linear-gradient(to right, var(--cyber-bg-accent-light) 1px, transparent 1px),
        linear-gradient(to bottom, var(--cyber-bg-accent-light) 1px, transparent 1px) !important;
      background-size: 100%, 30px 30px, 30px 30px !important;
    }

    /* === TYPOGRAPHY === */
    .logged-in, .btn, .UnderlineNav-item,
    .prc-ActionList-ItemLabel-TmBhn {
      font-family: "Fira Code", monospace !important;
    }

    /* === LINKS === */
    [data-dark-theme] a:hover,
    [data-dark-theme] .Link--primary:hover {
      color: var(--cyber-hover-color) !important;
      text-shadow: 0 0 8px var(--cyber-hover-glow);
      animation: cyberpunk-flicker 0.2s infinite;
    }

    /* === BUTTONS === */
    [data-dark-theme] .btn-primary {
      box-shadow: 0 0 10px var(--cyber-hover-glow);
    }
    [data-dark-theme] .btn-primary:hover {
      box-shadow: 0 0 15px var(--cyber-hover-glow);
      animation: cyberpunk-flicker 0.4s infinite;
    }

    /* === INPUTS === */
    [data-dark-theme] .form-control:focus,
    [data-dark-theme] .form-select:focus,
    [data-dark-theme] .focus-within {
      border-color: var(--cyber-hover-color) !important;
      box-shadow: 0 0 10px var(--cyber-hover-color) !important;
    }

    /* === BOXES AND MAIN ELEMENTS === */
    [data-dark-theme] .Box-row:hover,
    [data-dark-theme] .menu-item:hover {
      background-color: var(--cyber-bg-accent-light) !important;
    }

    [data-dark-theme] .Box {
      background-color: rgba(10, 12, 30, 0.7) !important;
      backdrop-filter: blur(5px);
      border-color: var(--borderColor-default) !important;
    }

    .Header, .AppHeader, .application-main, .footer {
      background-color: var(--bgColor-muted) !important;
    }

    .application-main .color-bg-default {
      background-color: transparent !important;
    }

    /* === TOOLTIP === */
    [data-dark-theme] .tooltipped::after,
    [data-dark-theme] tool-tip {
      background-color: var(--cyber-tooltip-bg) !important;
      color: var(--cyber-tooltip-color) !important;
      text-shadow: 0 0 4px var(--cyber-tooltip-color);
      border-radius: 6px;
    }

    /* === OVERLAY PANELS & ACTION MENUS === */
    [data-dark-theme] .Overlay {
      background-color: rgba(10, 12, 30, 0.9) !important;
      backdrop-filter: blur(6px);
      border: 1px solid var(--borderColor-default) !important;
      box-shadow: 0 0 12px var(--cyber-bg-accent-muted);
      color: var(--fgColor-default) !important;
    }

    [data-dark-theme] .Overlay-header,
    [data-dark-theme] .Overlay-body {
      background-color: rgba(20, 24, 43, 0.85) !important;
      border-bottom: 1px solid var(--borderColor-muted);
    }

    [data-dark-theme] .Overlay-title,
    [data-dark-theme] .Overlay-closeButton svg {
      color: var(--fgColor-default) !important;
      fill: var(--fgColor-default) !important;
    }

    [data-dark-theme] .ActionListItem:hover,
    [data-dark-theme] .SelectMenu-item--navigable:hover {
        background-color: var(--cyber-bg-accent-light) !important;
    }

    /* === PINNED REPOSITORIES === */
    [data-dark-theme] .pinned-item-list-item {
      background-color: transparent !important;
      border: 1px solid var(--borderColor-default) !important;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }

    [data-dark-theme] .pinned-item-list-item:hover {
      background-color: var(--cyber-bg-accent-light) !important;
      border-color: var(--cyber-hover-color) !important;
      box-shadow: 0 0 10px var(--cyber-hover-glow);
    }

    [data-dark-theme] .pinned-item-list-item .repo {
      color: var(--fgColor-default) !important;
      font-family: "Fira Code", monospace !important;
      transition: color 0.3s ease, text-shadow 0.3s ease;
    }

    [data-dark-theme] .pinned-item-list-item a:hover .repo {
      color: var(--cyber-hover-color) !important;
    }

    [data-dark-theme] .pinned-item-desc {
      color: var(--cyber-fg-muted) !important;
    }

    /* === PROFILE README HEADER === */
    [data-dark-theme] .Box-body .Box-btn-octicon {
        color: var(--cyber-fg-muted);
        transition: color 0.3s ease, filter 0.3s ease;
    }
    [data-dark-theme] .Box-body .Box-btn-octicon:hover {
        color: var(--cyber-hover-color);
        filter: drop-shadow(0 0 5px var(--cyber-hover-color));
    }

    /* === ACTIVITY OVERVIEW & CONTRIBUTION GRAPH === */
    [data-dark-theme] .activity-overview-box .subnav-item {
        background-color: transparent;
        border: 1px solid var(--cyber-border-color);
        color: var(--fgColor-default);
        transition: all 0.3s ease;
    }
    [data-dark-theme] .activity-overview-box .subnav-item:hover,
    [data-dark-theme] .activity-overview-box .subnav-item.selected {
        background-color: var(--cyber-bg-accent-light);
        border-color: var(--cyber-hover-color);
        color: var(--cyber-hover-color);
        box-shadow: 0 0 8px var(--cyber-hover-glow);
    }

    [data-dark-theme] .pinned-items-setting-link:hover {
        color: var(--cyber-hover-color) !important;
        text-shadow: 0 0 6px var(--cyber-hover-glow);
    }

    [data-dark-theme] .graph-before-activity-overview {
        background-color: rgba(10, 12, 30, 0.5);
        border: 1px solid var(--cyber-border-color) !important;
        border-radius: 6px;
        padding: 1rem !important;
    }

    [data-dark-theme] .ContributionCalendar-day {
        transition: all 0.2s ease-in-out;
    }

    [data-dark-theme] .ContributionCalendar-day[data-level="0"] { fill: var(--bgColor-inset) !important; }
    [data-dark-theme] .ContributionCalendar-day[data-level="1"] { fill: rgba(240, 56, 107, 0.25) !important; }
    [data-dark-theme] .ContributionCalendar-day[data-level="2"] { fill: rgba(240, 56, 107, 0.5) !important; }
    [data-dark-theme] .ContributionCalendar-day[data-level="3"] { fill: rgba(240, 56, 107, 0.75) !important; }
    [data-dark-theme] .ContributionCalendar-day[data-level="4"] { fill: var(--cyber-accent-color) !important; }

    [data-dark-theme] .ContributionCalendar-day:hover {
        stroke: var(--cyber-hover-color);
        stroke-width: 2px;
        filter: drop-shadow(0 0 5px var(--cyber-hover-color));
    }
  `);
})();