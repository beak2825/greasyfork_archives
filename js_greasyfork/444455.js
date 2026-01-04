// ==UserScript==
// @name         FuckArcWikiChallenge
// @namespace    https://misakacastle.moe
// @license      WTFPL
// @version      0.3.2
// @description  绕过Arcaea中文Wiki的技术类隐藏页面验证
// @author       Misaka12456
// @match        https://arcwiki.mcd.blue/*
// @icon         https://pic.rmb.bdstatic.com/bjh/3a01f3977ca05bb86115fe2fb144ba21.png
// @grant        none
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/444455/FuckArcWikiChallenge.user.js
// @updateURL https://update.greasyfork.org/scripts/444455/FuckArcWikiChallenge.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
console.log('FuckArcWikiChallenge Loaded');
$(document).ready(function () {
	if ($('#autohidden').length > 0) {
		$('#autohidden').replaceAll('<p></p>');
		console.debug('[FuckArcWikiChallenge]Cleared Question Div');
		$('#autoshow').removeAttr('class', 'test-hidden-2');
		console.debug('[FuckArcWikiChallenge]Showed Confirm Prompt');
		$('.test-hidden').removeAttr('class', 'test-hidden');
		console.debug('[FuckArcWikiChallenge]Showed Main Hidden Part');
	}
	else {
		console.log('No element of id "autohidden" found. FuckArcWikiChallenge will ignore current page.');
	}
});