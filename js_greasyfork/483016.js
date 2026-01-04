// ==UserScript==
// @author	craftwar
// @name 	Always desktop bahamut
// @name:zh-TW 巴哈姆特重導到桌面版網站
// @description	Redirect mobile bahamut to desktop
// @description:zh-TW	重導到巴哈姆特桌面版網站
// @namespace github.com.craftwar
// @include	https://m.gamer.com.tw/*
// @version	24.1.7
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/483016/Always%20desktop%20bahamut.user.js
// @updateURL https://update.greasyfork.org/scripts/483016/Always%20desktop%20bahamut.meta.js
// ==/UserScript==
'use strict';
(() => {
	const m = /^https:\/\/m\.gamer\.com\.tw\/((?:gnn)|(?:home))\/(.+)/.exec(window.location.href);
	if (m)
		window.location.replace("https://" + m[1] + ".gamer.com.tw/" + m[2]);
})();
