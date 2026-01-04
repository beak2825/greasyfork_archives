// ==UserScript==
// @name        SparrowIsland Redirector
// @namespace   Violentmonkey Scripts
// @match       https://premium.sparrowisland.cf/*
// @grant       none
// @version     1.0
// @license     
// @icon        https://i.ibb.co/MnDMD3M/photo-2023-02-01-06-23-19.jpg
// @author      MrHama007
// @description this script will redirect you to the new sparrowisland's domain.
// @downloadURL https://update.greasyfork.org/scripts/462383/SparrowIsland%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/462383/SparrowIsland%20Redirector.meta.js
// ==/UserScript==

location = Object.assign(new URL(location), { protocol: 'https:', host: 'premium.sparrowisland.ml/' });