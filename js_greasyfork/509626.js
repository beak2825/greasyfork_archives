// ==UserScript==
// @name         Youtube Focus
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @version      0.5
// @description  Less distractions on Youtube
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/en/users/6316-itsuki
// @downloadURL https://update.greasyfork.org/scripts/509626/Youtube%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/509626/Youtube%20Focus.meta.js
// ==/UserScript==
("use strict");

const SELECTORS = {
  whole: ["ytd-notification-topbar-button-renderer"],
  homePage: ["#app > .page-container", "#contents"],
  watchPage: [
    "#secondary",
    "#related",
    "ytd-comments",
    "ytd-live-chat-frame",
    "#chat-container",
    "#panels-full-bleed-container",
  ],
  guide: "#guide",
};

function removeElement(selectors) {
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((elemento) => elemento.remove());
  });
}

function isHomePage() {
  return (
    window.location.pathname === "/" ||
    window.location.pathname === "/feed/subscriptions"
  );
}

function isWatchPage() {
  return window.location.pathname.startsWith("/watch");
}

function removeDistractions() {
  removeElement(SELECTORS.whole);
  if (isHomePage()) {
    removeElement(SELECTORS.homePage);
  } else if (isWatchPage()) {
    removeElement(SELECTORS.watchPage);
  }
}

function collapseGuide() {
  let guide = document.querySelector(SELECTORS.guide);

  const attributes = ["guide-persistent-and-visible", "opened"];
  attributes.forEach((attribute) => guide.removeAttribute(attribute));

  let mgv = "mini-guide-visible";
  if (!guide.hasAttribute(mgv)) {
    guide.setAttribute(mgv, "");
  }
}

collapseGuide();
removeDistractions();

const observer = new MutationObserver((mutations) => {
  if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
    removeDistractions();
    collapseGuide();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("unload", () => observer.disconnect());
