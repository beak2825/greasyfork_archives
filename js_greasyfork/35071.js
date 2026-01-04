// ==UserScript==
// @name        VK wall title text
// @description VK wall content text in tab title.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @include     *://vk.com/wall*
// @version     1.1
// @author      2k1dmg
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/35071/VK%20wall%20title%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/35071/VK%20wall%20title%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var groupName = document.querySelector('.author').innerText;
	var groupText = document.querySelector('.wall_post_text').innerText;
	var titleText = groupName +' - '+ ((groupText.length > 56) ? groupText.slice(0,55)+'\u2026' : groupText);
	document.title = titleText.replace(/\n/g, ' ');
})();
