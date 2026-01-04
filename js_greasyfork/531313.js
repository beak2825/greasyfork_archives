// ==UserScript==
// @name         Remove Social Media for github.com
// @description  This userscript removes the "x followers", "y following" and "Set Status" fields on your own github.com profile page. This is just visual.
// @author       ths197
// @license      BSD-3-Clause
// @namespace    https://greasyfork.org/en/users/1451968-ths197
// @include      https://github.com
// @include      https://github.com/*
// @noframes
// @run-at       document-start
// @version 0.0.1.20251021132406
// @downloadURL https://update.greasyfork.org/scripts/531313/Remove%20Social%20Media%20for%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/531313/Remove%20Social%20Media%20for%20githubcom.meta.js
// ==/UserScript==

"use strict";

// conditions

const isOnLoginUsersHomePage = () => document.body.classList.contains("mine");

var state = undefined;

const isChanged = () => !state?.isConnected;

// getting and removing

const getProfile = () =>
  document.body.getElementsByClassName("js-profile-editable-replace")[0];

const socialMediaUrlOptions = ["followers", "following"];

const removeSocialMediaButtons = function (node) {
  const links = Array.from(node.getElementsByTagName("a"));
  const anySocialMediaLink = links.find((node) =>
    socialMediaUrlOptions.some((option) =>
      new URLSearchParams(new URL(node.href).search).has("tab", option)
    )
  );
  anySocialMediaLink?.parentElement.remove();
  Array.from(node.getElementsByClassName("user-status-container")).forEach(
    (statusContainer) => statusContainer.remove()
  );
};

// applying

const applyChanges = function () {
  if (isOnLoginUsersHomePage()) {
    state = getProfile();
    if (state != null) {
      removeSocialMediaButtons(state);
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
  const profile = getProfile();
  if (profile != null) {
    innerObserver.observe(profile.parentElement, {
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
