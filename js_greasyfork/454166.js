// ==UserScript==
// @name         🐭️ MouseHunt - Center the Halloween shutdown message
// @version      1.0.0
// @description  Correctly centers the "The ingredients have all been harvested" message in the Halloween UI.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/454166/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Center%20the%20Halloween%20shutdown%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/454166/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Center%20the%20Halloween%20shutdown%20message.meta.js
// ==/UserScript==
((function () {
  'use strict';

  const addStyles = document.createElement('style');
  addStyles.innerHTML = `
	.halloweenBoilingCauldronHUD-shutdownButton {
		left: 271px;
		width: 198px;
	}`;
  document.head.appendChild(addStyles);
})());
