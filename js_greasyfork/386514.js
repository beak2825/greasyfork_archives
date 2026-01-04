// ==UserScript==
// @name        NoYTinfoPanel
// @version     1.0
// @description Get rid of info panel on YT
// @author      VanishingTacos
// @namespace   https://www.reddit.com/user/VanishingTacos/
// @include     https://www.youtube.com/watch?v=*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/386514/NoYTinfoPanel.user.js
// @updateURL https://update.greasyfork.org/scripts/386514/NoYTinfoPanel.meta.js
// ==/UserScript==

		var element = document.getElementById("clarify-box");
    	element.parentNode.removeChild(element);