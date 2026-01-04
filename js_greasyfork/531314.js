// ==UserScript==
// @name         Remove Social Media for gist.github.com
// @description  This userscript removes the "x followers", "y following" and "Set Status" fields on your own gist.github.com profile page. This is just visual.
// @author       ths197
// @license      BSD-3-Clause
// @namespace    https://greasyfork.org/en/users/1451968-ths197
// @include      https://gist.github.com
// @include      https://gist.github.com/*
// @noframes
// @run-at       document-start
// @version 0.0.1.20251021132428
// @downloadURL https://update.greasyfork.org/scripts/531314/Remove%20Social%20Media%20for%20gistgithubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/531314/Remove%20Social%20Media%20for%20gistgithubcom.meta.js
// ==/UserScript==

"use strict";

// conditions

const isOnLoginUsersHomePage = function () {
  const user_login_name = document.querySelector(
    "meta[name='user-login']"
  ).content;
  const page_user_name = window.location.pathname.split("/")[1];
  return user_login_name === page_user_name;
};

var state = undefined;

const isDocumentChanged = () => !state?.isConnected;

// getting and removing

const getControlElement = () => document.getElementById("gist-pjax-container"); // div, gets replaced on navigation by the webapp

const getSidebar = () =>
  document.getElementsByClassName("js-profile-editable-replace")[0]; // div

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
  if (isOnLoginUsersHomePage() && isDocumentChanged()) {
    state = getControlElement();
    if (state != null) {
      const sidebar = getSidebar(); // js-profile-editable-replace is in the subtree of div#gist-pjax-container
      if (sidebar != null) {
        removeSocialMediaButtons(sidebar);
      }
    }
  }
};

// setting stuff up (boring)

const mutationObserver = new MutationObserver(() => applyChanges());

const attachMutationObserver = () =>
  mutationObserver.observe(document.body, { subtree: false, childList: true });

const init = function () {
  applyChanges();
  attachMutationObserver();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
