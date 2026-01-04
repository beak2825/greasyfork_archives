// ==UserScript==
// @name        offtiktok redirect
// @namespace   Violentmonkey Scripts
// @match       https://www.tiktok.com/*
// @grant       none
// @license GNU AGPLv3 
// @version     1.0
// @author      mr2meows
// @description 22/12/2024, 11:45:55
// @downloadURL https://update.greasyfork.org/scripts/521475/offtiktok%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/521475/offtiktok%20redirect.meta.js
// ==/UserScript==

location = Object.assign(new URL(location), { protocol: 'http:', host: 'offtiktok.com' });