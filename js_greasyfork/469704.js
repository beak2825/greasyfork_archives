// ==UserScript==
// @name        Youtube Player Controls below Video
// @description Move YouTube Player Controls below the video
// @namespace   Userscript
// @version     0.1.20
// @match       https://www.youtube.com/*
// @grant       none
// @noframes
// @author      CY Fung
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/469704/Youtube%20Player%20Controls%20below%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/469704/Youtube%20Player%20Controls%20below%20Video.meta.js
// ==/UserScript==

(() => {

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  const SCRIPT_CLASSNAME = 'yt8447-enabled'
  const SCRIPT_CSS_ID = 'fj74F'

  const css_text = `

  html{
      --yt8447-chrome-background: black;
  }
  html[dark] {
      --yt8447-chrome-background: transparent;
  }

  .${SCRIPT_CLASSNAME} {
      --yt8446-gap: 64px;
      --yt8447-height: 52px;
      --yt8446-offset-y-min: 4px;

      --yt8448-gap: max(var(--yt8446-gap), var(--subs-gap, 0px));
      --yt8448-gap-theater: max(var(--yt8446-gap), var(--subs-gap-theater, 0px));

      --yt8446-offset-y: 0px;
      --yt8446-offset-y: calc( ( var(--yt8448-gap) - var(--yt8446-gap) ) / 2 );
      --yy8446-offset-y1: max(var(--yt8446-offset-y-min), var(--yt8446-offset-y, 0px));
  }

  .${SCRIPT_CLASSNAME} #columns.ytd-watch-flexy {
      --subs-gap: var(--yt8448-gap);
      --subs-gap-theater: var(--yt8448-gap-theater);
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) ytd-player#ytd-player .ytp-chrome-bottom {
      bottom: calc( var(--yt8447-height) * -1 - var(--yy8446-offset-y1) );
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) ytd-player#ytd-player .ytp-tooltip.ytp-bottom {
      margin-top: calc( var(--yt8447-height) + var(--yy8446-offset-y1) );
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) ytd-player#ytd-player .ytp-chrome-bottom::before {
      position: absolute;
      left: -12px;
      right: -12px;
      content: '';
      display: block;
      bottom: 0px;
      top: calc( -5px - ( var(--yy8446-offset-y1) - 4px ) ); /* actual size 51px instead of 52px */
      background-color: var(--yt8447-chrome-background, transparent);
      z-index: -1;
      transform: translateZ(-1px);
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) ytd-player#ytd-player #movie_player::after {
      position: absolute;
      display: block;
      content: '';
      left: 0;
      right: 0;
      height: var(--yt8447-height);
      bottom: calc( var(--yt8447-height) * -1 );
      opacity: 0 !important;
      pointer-events: auto !important;
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) ytd-player#ytd-player #movie_player .ytp-popup.ytp-settings-menu {
      transform: translateY( var(--yt8447-height) );
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) ytd-player#ytd-player #movie_player {
      overflow: visible;
      z-index: 999;
  }

  .${SCRIPT_CLASSNAME}[theater]:not([fullscreen]) #below.ytd-watch-flexy, .${SCRIPT_CLASSNAME}[theater]:not([fullscreen]) #secondary.ytd-watch-flexy {
      --yt8448-gap: var(--yt8448-gap-theater);
  }

  .${SCRIPT_CLASSNAME}:not([fullscreen]) #below.ytd-watch-flexy, .${SCRIPT_CLASSNAME}[theater]:not([fullscreen]) #secondary.ytd-watch-flexy {
      margin-top: var(--yt8448-gap) !important;
      transition: margin-top 0.25s;
  }

  @supports (color: var(--general-fix-video-ended-mode-display)) {
    /* this is a general fix, might or might not directly related to this script */
    #movie_player .html5-video-container {
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        overflow: hidden; /* to against overflow:visible in #movie_player in some userscripts */
        contain: layout size paint style; /* if supported */
    }
    #movie_player .html5-video-container > video[style*="top: -"],
    #movie_player .html5-video-container > video[style*="top:-"] {
        margin-top: -1px !important; /* (.ended-mode#movie_player) video size 943 x 530.44, but top: -530px only */
    }
  }



  .${SCRIPT_CLASSNAME}:not([fullscreen]) .html5-video-player[class]:not(.ytp-fullscreen) .ytp-chrome-bottom[class]:hover {
    opacity: initial;
    visibility: initial;
  }

  html body ytd-watch-flexy.${SCRIPT_CLASSNAME}:not([fullscreen])[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy {
    overflow: initial;
  }

  html body ytd-watch-flexy.${SCRIPT_CLASSNAME}:not([fullscreen])[class] #ytd-player.ytd-watch-flexy[class] {
    overflow: initial;
  }

  `;

  let mState = 0;
  async function main(evt) {
    try {
      await Promise.resolve();
      if (mState === 0) {
        if (document.getElementById(SCRIPT_CSS_ID)) {
          mState = -1;
          console.warn('yt8447: duplicated script');
          return;
        }
        const style = document.createElement('style');
        style.textContent = css_text;
        style.id = SCRIPT_CSS_ID;
        document.head.appendChild(style);
        mState = 1;
      }
      if (mState < 1) return;

      const ytdFlexy = document.querySelector('ytd-watch-flexy');
      if (ytdFlexy !== null) {

        let isValid = true;
        if (ytdFlexy.hasAttribute('hidden')) isValid = false;
        else if (ytdFlexy.matches('[hidden] ytd-watch-flexy')) isValid = false;

        ytdFlexy.classList.toggle(SCRIPT_CLASSNAME, isValid);
      }
    } catch (e) { console.log(e) }

  }

  document.addEventListener('yt-navigate-finish', main, false);
  document.addEventListener('yt-page-data-fetched', main, false);
})();