// ==UserScript==
// @name         Correct Time
// @version      1.4
// @description  Display adjusted time when playback speed isn't 1.0x
// @author       r_4spberry
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @namespace    none
// @downloadURL https://update.greasyfork.org/scripts/541619/Correct%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/541619/Correct%20Time.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ---------- helpers ---------- */

    const css = `
    .ytp-time-current,
    .ytp-time-separator,
    .ytp-time-duration { display:none !important; }

    #correct-time { white-space:nowrap; }
  `;
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    function format(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor(sec / 60) % 60;
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        const mm = h ? m.toString().padStart(2, '0') : m;
        return h ? `${h}:${mm}:${s}` : `${m}:${s}`;
    }


    function ensureSpan() {
        const host = document.querySelector('.ytp-time-contents');
        if (!host) return null;
        let span = document.getElementById('correct-time');
        if (!span) {
            span = document.createElement('span');
            span.id                = 'correct-time';
            span.style.marginLeft  = '4px';
            span.style.transition  = 'color .2s';
            span.style.fontSize    = '90%';
            host.appendChild(span);
        }
        return span;
    }

    function update() {
        const v = document.querySelector('video');
        const s = ensureSpan();
        if (!v || !s) return;

        const r = v.playbackRate;
        if (r === 1) {
            s.style.color = '';                // default (white)
            s.textContent = `${format(v.currentTime)} / ${format(v.duration)}`;
        } else {
            s.style.color = '#f4b400';         // yellow
            s.textContent = `${format(v.currentTime / r)} / ${format(v.duration / r)}`;
        }
    }

    const readyCheck = setInterval(() => {
        const video = document.querySelector('video');
        const tBox  = document.querySelector('.ytp-time-contents');
        if (video && tBox) {
            clearInterval(readyCheck);

            update();

            video.addEventListener('timeupdate', update);
            video.addEventListener('ratechange', update);

            setInterval(update, 500);
        }
    }, 500);
})();