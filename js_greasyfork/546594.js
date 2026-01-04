// ==UserScript==
// @name        Auto expand Reddit [show replies] buttons
// @namespace   https://greasyfork.org/users/581142
// @match       *://reddit.com/*
// @grant       none
// @version     1.0.0
// @author      brian6932
// @license     MPL-2.0
// @description Reddit seems to have added a `[show replies]` button on threads.
// @downloadURL https://update.greasyfork.org/scripts/546594/Auto%20expand%20Reddit%20%5Bshow%20replies%5D%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/546594/Auto%20expand%20Reddit%20%5Bshow%20replies%5D%20buttons.meta.js
// ==/UserScript==
// jshint esversion: 11
for (const selector of globalThis.document.querySelectorAll('.showreplies'))
	selector.click()