// ==UserScript==
// @name        welt.de SocialBarGone
// @namespace   Violentmonkey Scripts
// @match       https://www.welt.de/*
// @grant       none
// @version     1.1
// @author      -
// @license     MIT
// @description 4.2.2025, 22:11:54
// @downloadURL https://update.greasyfork.org/scripts/525929/weltde%20SocialBarGone.user.js
// @updateURL https://update.greasyfork.org/scripts/525929/weltde%20SocialBarGone.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.textContent = "[data-component='SocialBar'] { display: none !important; }";
document.head.appendChild(style);

