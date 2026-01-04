// ==UserScript==
// @name        5ch_hide_notice
// @namespace   http://catherine.v0cyc1pp.com/5ch_hide_notice.user.js
// @include     http://*.5ch.net/*
// @include     https://*.5ch.net/*
// @include     http://*.bbspink.com/*
// @include     https://*.bbspink.com/*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     0.2
// @grant       none
// @description ５ちゃんねるのすすコイン広告を非表示にします。
// @downloadURL https://update.greasyfork.org/scripts/380541/5ch_hide_notice.user.js
// @updateURL https://update.greasyfork.org/scripts/380541/5ch_hide_notice.meta.js
// ==/UserScript==




console.log("5ch_hide_notice start");

function sub() {
	var obj = document.querySelector('p[style="margin: 0.75em 30% 0 30%; padding: 0.5em; border-radius: 0.50em / 0.50em; background: #FFF; color: #666;"]');
    if ( obj == null ) return;
	console.log(obj);
	obj.parentNode.removeChild(obj);
}

function main() {
	sub();
}


main();
