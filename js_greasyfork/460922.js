// ==UserScript==
// @name        TikTok - Remove distractions
// @description Remove distractions on TikTok
// @version  1.2
// @grant    none
// @include	*://tiktok.com/*
// @include	*://*.tiktok.com/*
// @license     GPL v3
// @author      @incognico
// @namespace   https://greasyfork.org/users/931787
// @downloadURL https://update.greasyfork.org/scripts/460922/TikTok%20-%20Remove%20distractions.user.js
// @updateURL https://update.greasyfork.org/scripts/460922/TikTok%20-%20Remove%20distractions.meta.js
// ==/UserScript==

const selectors = [
  '[data-e2e="nav-live"]', // Live tab
  '[data-e2e="nav-foryou"]', // For you tab
  '[data-e2e="nav-explore"]', // Explore tab
  '[class*="-DivDiscoverContainer"]', // Discover section
  '[class*="-DivUserContainer"]:has([data-e2e="suggest-accounts"])', // Suggested accounts in sidebar (needs about:config layout.css.has-selector.enabled for now)
  '[data-e2e="recharge-entrance"]', // Get coins in profile menu
  '[data-e2e="live-studio-entrance"]', // Live Studio in profile menu
  '[class*="-StyledShareIcon"]', // Share icon on profile page
  '[data-e2e="upload-icon"]', // Upload button
];

const hide = (selector) => {
  const node = document.querySelector(selector);
  if (node) {
    node.style.display = 'none';
  }
};

const redirectClickEvent = (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const followingButton = document.querySelector('[data-e2e="nav-following"]');
  if (followingButton) {
    followingButton.click();
  } else {
    window.location.pathname = '/following';
  }
};

const listeners = [];
const redirect = () => {
  // replace home links click to following button
  const links = document.querySelectorAll('[href="/"]');
  links.forEach(link => {
    if (!listeners.includes(link)) {
      listeners.push(link);
      link.addEventListener('click', redirectClickEvent, true);
    }
  });
}

window.setTimeout(
  function check() {
    selectors.forEach(hide);
    redirect();
    window.setTimeout(check, 250);
  }, 250
);

// redirect from home live or home with country code
const { pathname } = window.location;
if (pathname === '/' || pathname === '/live' || pathname === '/explore' || pathname.match(/\/[a-z]{2}$/)) {
  window.location.replace('/following');
}