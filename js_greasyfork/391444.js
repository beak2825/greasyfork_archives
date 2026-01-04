// ==UserScript==
// @name     		Instapaper Fixes
// @version  		3
// @description Enable/fix the sidebar to scroll and stretches images in their original quality to full width of text container.
// @license  		MIT License
// @grant    		none
// @match    		https://www.instapaper.com/*
// @namespace https://greasyfork.org/users/389487
// @downloadURL https://update.greasyfork.org/scripts/391444/Instapaper%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/391444/Instapaper%20Fixes.meta.js
// ==/UserScript==

const sidebarContainer = document.querySelector(".scroller_y")
if (!!sidebarContainer) {
	sidebarContainer.style.overflowY = "auto"
	sidebarContainer.style.height = "100%"
}

const imageContainer = document.querySelectorAll("figure img")
for (const image of imageContainer) {
	image.style.width = "100%"
  image.src = image.src.replace(/\?w=\d+$/, "")
}