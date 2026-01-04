// ==UserScript==
// @name        card-header/footer.hide
// @description v1.02
// @match       *://*.coomer.su/*
// @run-at       document-end
// @license      johnnatanchest
// @version 0.0.1.20250613060255
// @namespace https://greasyfork.org/users/1461688
// @downloadURL https://update.greasyfork.org/scripts/533823/card-headerfooterhide.user.js
// @updateURL https://update.greasyfork.org/scripts/533823/card-headerfooterhide.meta.js
// ==/UserScript==

console.log("Userscript loaded");

function hideHeaderFooter() {
  document.querySelectorAll('.post-card__header, .post-card__footer').forEach(el => {
    if (el.style.display !== 'none') {
      el.style.display = 'none';
    }
  });
}

function adjustImageDisplay() {
  document.querySelectorAll('img').forEach(el => {
    el.style.objectFit = 'contain';
  });

  document.querySelectorAll('.card-list__items').forEach(el => {
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
  });
}

function applyAdjustments() {
  hideHeaderFooter();
  adjustImageDisplay();
}

applyAdjustments();

const observer = new MutationObserver(() => {
  applyAdjustments();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});