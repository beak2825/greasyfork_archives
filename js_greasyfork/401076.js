// ==UserScript==
// @name         Washington post
// @match        https://www.washingtonpost.com/*
// @description  Patch history.replaceState
// @version      2020.04.16
// @namespace    greasy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401076/Washington%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/401076/Washington%20post.meta.js
// ==/UserScript==


console.log(unsafeWindow);

unsafeWindow.history.pushState = console.log.bind(console)
unsafeWindow.history.replaceState = console.log.bind(console)
