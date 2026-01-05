// ==UserScript==
// @name        Dark Read The Docs
// @version     1.3
// @namespace   Dark Read The Docs
// @include     *
// @grant       none
// @description Dark theme for all "Read The Docs" websites.
// @downloadURL https://update.greasyfork.org/scripts/13702/Dark%20Read%20The%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/13702/Dark%20Read%20The%20Docs.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
	var head,
		style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

var nodes = document.querySelectorAll(".rst-current-version");
if (nodes.length == 0) {
	return;
}
addGlobalStyle('html,body,.wy-nav-content,.highlight,.reference,.subnav,.n,.k,.ow,.wy-nav-content-wrap,.admonition\
{background:none#000!important;color:#bbb!important;text-shadow:none!important;}\
dt,.reference,.highlighted,.admonition-title{background:none#222!important;color:#bbb!important;text-shadow:none!important;}\
input,code\
{background:none#222!important;color:#ddd!important;text-shadow:none!important;}\
input { border:1px solid #00f!important;}\
{visibility: hidden}\
');