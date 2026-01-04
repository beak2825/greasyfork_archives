// ==UserScript==
// @name        Wix Header Remover
// @namespace   Violentmonkey Scripts
// @match       https://*.wixsite.com/*
// @grant       GM_addStyle
// @license     MIT
// @version     1.0
// @author      ElonGates
// @description Removes that one annoying header on all wixsite websites
// @downloadURL https://update.greasyfork.org/scripts/459017/Wix%20Header%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/459017/Wix%20Header%20Remover.meta.js
// ==/UserScript==

GM_addStyle('* { --wix-ads-top-height: 0px; } #WIX_ADS { display: none; }');
console.log('Removed annoying header');