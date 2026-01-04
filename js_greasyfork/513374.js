// ==UserScript==
// @name         block-users
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @description  clean the world
// @author       misc
// @match        https://www.uscardforum.com/*
// @icon         https://asset-cdn.uscardforum.com/optimized/1X/05236f295ec6a40bdd5588b3d35a04d01ebfb67e_2_32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513374/block-users.user.js
// @updateURL https://update.greasyfork.org/scripts/513374/block-users.meta.js
// ==/UserScript==

const users = [];

function getSelector(users) {
  return users
    .map((user) => {
      const post = `[aria-label^="@${user}"]`;
      const quote = `aside[data-username="${user}"]`;
      const card = `a[data-user-card="${user}"]`;
      const gap = `.gap`;
      return `${post},${quote},${card}`;
    })
    .join(',');
}

function hideElements(users) {
  const selector = getSelector(users);
  const els = document.querySelectorAll(selector);
  els.forEach((el) => {
    el.classList.add('hide');
  });
}

function hideReply(users) {
  const selector = users.map((user) => `img.avatar[title="${user}"]`).join(',');
  const els = document.querySelectorAll(selector);
  els.forEach((el) => {
    el.closest('.reply-to-tab')?.classList.add('hide');
  });
}

function hideGap() {
  const els = document.querySelectorAll('.gap');

  els.forEach((el) => {
    if (el.textContent.includes('隐藏回复')) {
      el.classList.add('hide');
    }
  });
}

function debounce(fn) {
  let raf;
  return function (...args) {
    if (raf) {
      cancelAnimationFrame(raf);
    }

    raf = requestAnimationFrame(() => {
      fn.apply(this, args);
    });
  };
}

function modifyDOM() {
  hideElements(users);
  hideReply(users);
  hideGap();
}

(function () {
  'use strict';
  const observer = new MutationObserver(debounce(modifyDOM));
  observer.observe(document.body, { childList: true, subtree: true });
  modifyDOM();
})();

