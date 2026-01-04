// ==UserScript==
// @name        [GC] Neggsweeper: Right-Click to Unflag
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/games/neggsweeper/*
// @grant       none
// @license     MIT
// @version     86
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Right click for flagging and unflagging.

// @description Note: Approved by GC devs in ticket #3839.

// @downloadURL https://update.greasyfork.org/scripts/489859/%5BGC%5D%20Neggsweeper%3A%20Right-Click%20to%20Unflag.user.js
// @updateURL https://update.greasyfork.org/scripts/489859/%5BGC%5D%20Neggsweeper%3A%20Right-Click%20to%20Unflag.meta.js
// ==/UserScript==


if (!localStorage.getItem('scriptAlert-489859')) {
    alert("Neggsweeper: Right Click to Unflag script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-489859', 'true');
}