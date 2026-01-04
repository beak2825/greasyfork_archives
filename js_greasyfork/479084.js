// ==UserScript==
// @name         Library Tab But Look Like A You Tab
// @version      1.0
// @description  This is the for user which have still old layout
// @author       nexius
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://greasyfork.org/pl/users/1211348
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479084/Library%20Tab%20But%20Look%20Like%20A%20You%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/479084/Library%20Tab%20But%20Look%20Like%20A%20You%20Tab.meta.js
// ==/UserScript==
// Enable strict mode to catch common coding mistakes
"use strict";
const flagsToAssign = {
  web_enable_youtab: true,
};

const updateFlags = () => {
    const expFlags = window?.yt?.config_?.EXPERIMENT_FLAGS;
  if (!expFlags) return;
  Object.assign(expFlags, flagsToAssign);
};
const mutationObserver = new MutationObserver(updateFlags);
mutationObserver.observe(document, { subtree: true, childList: true });

document.getElementsByTagName("html")[0].removeAttribute("darker-dark-theme-deprecate");
