// ==UserScript==
// @name         網頁右下角顯示公主GIF
// @namespace    Adrien.Dank.Meme.Hatsune
// @version      1.0.4
// @description  Have your waifu join you on every website
// @author       Adrien Pyke
// @match        *://*/*
// @grant        none
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520614/%E7%B6%B2%E9%A0%81%E5%8F%B3%E4%B8%8B%E8%A7%92%E9%A1%AF%E7%A4%BA%E5%85%AC%E4%B8%BBGIF.user.js
// @updateURL https://update.greasyfork.org/scripts/520614/%E7%B6%B2%E9%A0%81%E5%8F%B3%E4%B8%8B%E8%A7%92%E9%A1%AF%E7%A4%BA%E5%85%AC%E4%B8%BBGIF.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var miku = document.createElement('img');
	miku.src = "https://raw.githubusercontent.com/leadra/pic/main/kurara.gif"
  miku.style.position = 'fixed';
	miku.style.bottom = 0;
	miku.style.right = 0;
	miku.style.zIndex = 999999999;
	miku.onclick = function() {
		miku.remove();
	};
	miku.onload = function() {
		///miku.style.width = miku.naturalWidth + 'px';
    miku.style.maxWidth = "200px";
	};
	document.body.appendChild(miku);
})();