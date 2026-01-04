// ==UserScript==
// @name        Nirsoft Download at Top
// @namespace   Violentmonkey Scripts
// @match       https://www.nirsoft.net/utils/*
// @grant       none
// @version     1.0
// @author      -
// @description 9/23/2024, 11:53:20 AM
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/509843/Nirsoft%20Download%20at%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/509843/Nirsoft%20Download%20at%20Top.meta.js
// ==/UserScript==


document.querySelectorAll(".downloadline").forEach(dllink => document.querySelector(".utilcaption").childNodes[1].childNodes[0].appendChild(dllink.parentElement))