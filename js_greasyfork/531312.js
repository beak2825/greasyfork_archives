// ==UserScript==
// @name         Remove Private Profile Notice for github.com
// @description  This userscript removes the "Only you can see your full profile [...]" infobox on your Github profile page.
// @author       ths197
// @license      BSD-3-Clause
// @namespace    https://greasyfork.org/en/users/1451968-ths197
// @include      https://github.com
// @include      https://github.com/*
// @noframes
// @run-at       document-start
// @version 0.0.1.20251021132307
// @downloadURL https://update.greasyfork.org/scripts/531312/Remove%20Private%20Profile%20Notice%20for%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/531312/Remove%20Private%20Profile%20Notice%20for%20githubcom.meta.js
// ==/UserScript==

"use strict";

// conditions

const isOnLoginUsersHomePage = () => document.body.classList.contains("mine");

var state = undefined;

const isChanged = () => !state?.isConnected;

// getting and removing

const getUserProfileFrame = () => document.getElementById("user-profile-frame"); //contents do change on some navigations

const findAndRemoveNotice = function (node) {
  const links = Array.from(node.getElementsByTagName("a"));
  const anyPreviewLink = links.find(function (node) {
    const url = new URL(node.href);
    return (
      url.pathname === window.location.pathname &&
      new URLSearchParams(url.search).has("preview", "true")
    );
  });
  anyPreviewLink?.parentElement.parentElement.remove();
};

const getControlElement = (userProfileFrame) => userProfileFrame.childNodes[1]; // div, gets replaced on navigation by the webapp

// applying

const applyChanges = function () {
  if (isOnLoginUsersHomePage()) {
    const userProfileFrame = getUserProfileFrame();
    if (userProfileFrame != null) {
      state = getControlElement(userProfileFrame);
      if (state != null) {
        findAndRemoveNotice(state);
      }
    }
  }
};

// setting stuff up (boring)

const innerObserver = new MutationObserver(function () {
  if (isChanged()) {
    applyChanges();
  }
});

const outerObserver = new MutationObserver(function () {
  if (isChanged()) {
    applyChanges();
    attachInnerObserver();
  }
});

const attachInnerObserver = function () {
  const userProfileFrame = getUserProfileFrame();
  if (userProfileFrame != null) {
    innerObserver.observe(userProfileFrame, {
      subtree: false,
      childList: true,
    });
  }
};

const attachOuterObserver = () =>
  outerObserver.observe(document.body, { subtree: false, childList: true });

const init = function () {
  applyChanges();
  attachOuterObserver();
  attachInnerObserver();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
