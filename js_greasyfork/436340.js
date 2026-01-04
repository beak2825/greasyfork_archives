// ==UserScript==
// @name mic-time
// @version 1.0.0
// @author Akiyamka
// @namespace foxtools
// @description Show how long you with enabled mic
// @homepage https://greasyfork.org/zh-CN/scripts/424574
// @supportURL mailto:akiyamka@gmail.com
// @match *://meet.google.com/*
// @license GPLv3
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_getResourceText
// @grant GM_addStyle
// @run-at document-start
// @connect meet.google.com
// @downloadURL https://update.greasyfork.org/scripts/436340/mic-time.user.js
// @updateURL https://update.greasyfork.org/scripts/436340/mic-time.meta.js
// ==/UserScript==

(() => {
  const formatTime = (sec) => {
    sec = Number(sec);
    const min = Math.floor(sec / 60);
    const lead0 = (num) => ('0' + num).slice(-2);
    return `${lead0(min)}:${lead0(sec)}`;
  };

  /* Init */
  const start = () => {
    // Detect that user already in meeteng room
    if (!document.querySelector('[data-is-auto-rejoin]')) return false;
    const btnContainer = document.querySelector('[data-is-muted]');
    if (!btnContainer) return false;
    const btn = btnContainer.querySelector('[data-is-muted]');
    const timer = document.createElement('SPAN');
    timer.style.position = 'absolute';
    timer.style.left = '0';
    timer.style.right = '0';
    timer.style.visibility = 'hidden';
    btnContainer.appendChild(timer);

    /* Handle btn */
    let intervalId;
    const handleMuteSwitch = () => {
      requestAnimationFrame(() => {
        if (btn.dataset.isMuted === 'false') {
          timer.style.visibility = 'visible';
          timer.dataset.sec = 0;
          timer.innerHTML = formatTime(Number(timer.dataset.sec));
          intervalId = setInterval(() => {
            timer.dataset.sec = Number(timer.dataset.sec) + 1;
            timer.innerHTML = formatTime(Number(timer.dataset.sec));
          }, 1000);
        } else {
          clearInterval(intervalId);
          timer.style.visibility = 'hidden';
        }
      });
    };
    handleMuteSwitch();
    btnContainer.addEventListener('click', handleMuteSwitch);
    return true;
  };

  const startInterval = setInterval(() => {
    const isStarted = start();
    if (isStarted) clearInterval(startInterval);
  }, 1000);
})();
