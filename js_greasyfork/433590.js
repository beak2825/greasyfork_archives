// ==UserScript==
// @name           Roll20 Remove Characteristics From Character Sheet
// @description    Hides PERSONALITY TRAITS, IDEALS, BONDS, and FLAWS from CORE tab
// @match          https://app.roll20.net/editor/*
// @grant          GM_addStyle
// @version      1
// @namespace https://greasyfork.org/users/823025
// @downloadURL https://update.greasyfork.org/scripts/433590/Roll20%20Remove%20Characteristics%20From%20Character%20Sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/433590/Roll20%20Remove%20Characteristics%20From%20Character%20Sheet.meta.js
// ==/UserScript==

GM_addStyle(".charactersheet .textbox.pibf {display: none;}");