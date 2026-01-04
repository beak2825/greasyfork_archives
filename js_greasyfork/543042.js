// ==UserScript==
// @name         YouTube Music A-B Loop
// @namespace    https://emree.ab.loop
// @version      1.0
// @description  Loop between point A and B in YouTube Music songs
// @author       Emree (emree.el on instagram)
// @match        https://music.youtube.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543042/YouTube%20Music%20A-B%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/543042/YouTube%20Music%20A-B%20Loop.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let loopStart = 0;
  let loopEnd = 0;
  let looping = false;
  let lastUrl = '';
  let observer;

  const waitForElement = (selector, callback) => {
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        callback(el);
      }
    }, 500);
  };

  const createBox = () => {
    const box = document.createElement('div');
    box.id = 'ab-loop-box';
    box.innerHTML = `
      <style>
        #ab-loop-box {
          position: fixed;
          bottom: 120px;
          right: 30px;
          background: #1f1f1f;
          color: #fff;
          padding: 12px;
          border-radius: 12px;
          z-index: 9999;
          font-family: Arial, sans-serif;
          font-size: 14px;
          box-shadow: 0 0 10px rgba(0,0,0,0.6);
        }
        #ab-loop-box select, #ab-loop-box button {
          margin: 4px;
          padding: 4px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
        }
        #ab-loop-box select {
          background-color: #333;
          color: #fff;
        }
        #ab-loop-box button {
          background-color: #3b82f6;
          color: white;
          cursor: pointer;
        }
        #ab-loop-box button:hover {
          background-color: #2563eb;
        }
      </style>
      <div>
        <label>Start (A):</label><br/>
        <select id="start-mins">${generateOptions(0, 59)}</select>:
        <select id="start-secs">${generateOptions(0, 59)}</select><br/>
        <label>End (B):</label><br/>
        <select id="end-mins">${generateOptions(0, 59)}</select>:
        <select id="end-secs">${generateOptions(0, 59)}</select><br/>
        <button id="toggle-loop">🔁 Loop OFF</button>
      </div>
    `;
    document.body.appendChild(box);

    document.getElementById('toggle-loop').onclick = () => {
      const start = getTime('start');
      const end = getTime('end');
      const duration = getSongDuration();

      if (end <= start) {
        alert('End time must be after start time!');
        return;
      }

      if (end > duration) {
        alert('End time is beyond song duration!');
        return;
      }

      loopStart = start;
      loopEnd = end;
      looping = !looping;
      document.getElementById('toggle-loop').innerText = looping ? '🔁 Loop ON' : '🔁 Loop OFF';
    };
  };

  const generateOptions = (min, max) => {
    let out = '';
    for (let i = min; i <= max; i++) {
      out += `<option value="${i}">${i.toString().padStart(2, '0')}</option>`;
    }
    return out;
  };

  const getTime = (prefix) => {
    const mins = parseInt(document.getElementById(`${prefix}-mins`).value, 10);
    const secs = parseInt(document.getElementById(`${prefix}-secs`).value, 10);
    return mins * 60 + secs;
  };

  const getSongDuration = () => {
    const timeElem = document.querySelector('.time-info')?.textContent;
    if (!timeElem || !timeElem.includes('/')) return 0;
    const total = timeElem.split('/')[1].trim();
    const [mins, secs] = total.split(':').map(Number);
    return mins * 60 + secs;
  };

  const getCurrentTime = () => {
    const timeElem = document.querySelector('.time-info')?.textContent;
    if (!timeElem || !timeElem.includes('/')) return 0;
    const current = timeElem.split('/')[0].trim();
    const [mins, secs] = current.split(':').map(Number);
    return mins * 60 + secs;
  };

  const seekTo = (seconds) => {
    const video = document.querySelector('video');
    if (video) video.currentTime = seconds;
  };

  const resetLoop = () => {
    looping = false;
    loopStart = 0;
    loopEnd = 0;
    const btn = document.getElementById('toggle-loop');
    if (btn) btn.innerText = '🔁 Loop OFF';
  };

  const initLoop = () => {
    setInterval(() => {
      if (!looping) return;
      const current = getCurrentTime();
      if (current >= loopEnd) {
        seekTo(loopStart);
      }
    }, 500);
  };

  const watchUrlChange = () => {
    observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        resetLoop();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  waitForElement('.time-info', () => {
    createBox();
    initLoop();
    watchUrlChange();
  });
})();
