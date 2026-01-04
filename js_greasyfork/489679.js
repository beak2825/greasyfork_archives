// ==UserScript==
// @name        New script dentally.co
// @namespace   Violentmonkey Scripts
// @match       https://app.dentally.co/*
// @grant       GM_addStyle
// @version     1.0
// @author      Hanna Dadu
// @license MIT
// @description 12/03/2024, 22:09:11
// @downloadURL https://update.greasyfork.org/scripts/489679/New%20script%20dentallyco.user.js
// @updateURL https://update.greasyfork.org/scripts/489679/New%20script%20dentallyco.meta.js
// ==/UserScript==

let styleElement = GM_addStyle(`
.canvas__chart { position: fixed; z-index:1000; background-color: white; }
.canvas__body { margin-top: 350px; }
`);
