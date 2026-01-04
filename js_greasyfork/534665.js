// ==UserScript==
// @name         omq no dropdown
// @description  omq no dropdown, toggle with alt+j
// @match        *://osumusicquiz.com/*
// @run-at       document-start
// @license      MIT
// @version 0.0.1.20250501224812
// @namespace https://greasyfork.org/users/1185612
// @downloadURL https://update.greasyfork.org/scripts/534665/omq%20no%20dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/534665/omq%20no%20dropdown.meta.js
// ==/UserScript==

let isHidden = false;

const style = document.createElement('style');
style.textContent = `.autocomplete-dropdown { display: none !important; }`;
style.id = 'dropdown-hide-style';

const insertStyle = () => {
  if (!document.getElementById('dropdown-hide-style')) {
    document.head.appendChild(style);
  }
};

const removeStyle = () => {
  const existing = document.getElementById('dropdown-hide-style');
  if (existing) existing.remove();
};

const observer = new MutationObserver(() => {
  if (isHidden) {
    document.querySelectorAll('.autocomplete-dropdown').forEach(dd => {
      dd.style.display = 'none';
    });
  }
});

const startObserver = () => {
  if (document.body) {
    if (isHidden) insertStyle();
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    requestAnimationFrame(startObserver);
  }
};

startObserver();

document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'j') {
    isHidden = !isHidden;
    if (isHidden) {
      insertStyle();
    } else {
      removeStyle();
    }
  }
});