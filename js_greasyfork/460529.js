// ==UserScript==
// @name         AbFielder Direct Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes downloading schematics from abfielder's website easier.
// @author       ericsson
// @match        https://abfielder.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=abfielder.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460529/AbFielder%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/460529/AbFielder%20Direct%20Download.meta.js
// ==/UserScript==

const div = document.querySelector("a#downloadPress.w3-button.w3-hover-black.w3-text-color-white.w3-margin-bottom")
const url = div.getAttribute("href").slice(3)
HideContent('SubscribeTo');
window.location.href = `https://abfielder.com/${url}`
history.back()