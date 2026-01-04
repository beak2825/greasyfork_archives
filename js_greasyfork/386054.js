// ==UserScript==
// @name         Turn off Nicomment LS
// @namespace    https://at.sachi-web.com/turn-off-nicomment-ls.html
// @version      1.0.190614
// @description  ニコニコ動画のコメントをデフォルトで非表示にする
// @author       うみのさち
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/386054/Turn%20off%20Nicomment%20LS.user.js
// @updateURL https://update.greasyfork.org/scripts/386054/Turn%20off%20Nicomment%20LS.meta.js
// ==/UserScript==

( ()=> {
'use strict';

const interval = 250;
const timeover = 10000;

const turnoff = {
	'html': ()=> {
		document.getElementsByClassName('CommentOnOffButton')[0].click();
	},
	'flash': ()=> {
		player.ext_setCommentVisible(false);
	}
};
let time = 0;

let player = document.getElementById('external_nicoplayer');
let type = player ? 'flash' : 'html';

let timer = setInterval( ()=> {
	try {
		time += interval;
		if( time <= timeover ) turnoff[type]();
		clearInterval(timer);
	} catch(e) {
		// player isn't ready
	}
}, interval);

})();