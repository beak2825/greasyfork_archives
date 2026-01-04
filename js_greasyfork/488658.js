// ==UserScript==
// @name        [GC] Visualizer for Shop Ban
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/viewshop/*
// @grant       GM.addStyle
// @license     MIT
// @version     86
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Displays your current shop ban status in visual format directly on the page.
//  Next up: Settings! Probably always on, always off, alert only (and set what % you want it to appear at).
// @downloadURL https://update.greasyfork.org/scripts/488658/%5BGC%5D%20Visualizer%20for%20Shop%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/488658/%5BGC%5D%20Visualizer%20for%20Shop%20Ban.meta.js
// ==/UserScript==


if (!localStorage.getItem('scriptAlert-488658')) {
    alert("Shop Ban Visualizer script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-488658', 'true');
}