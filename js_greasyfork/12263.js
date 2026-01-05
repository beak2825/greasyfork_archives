// ==UserScript==
// @name        show_content
// @namespace   202.204.48.66/1.htm
// @description 更改show_content函数
// @include     http://202.204.48.66/1.htm
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12263/show_content.user.js
// @updateURL https://update.greasyfork.org/scripts/12263/show_content.meta.js
// ==/UserScript==
iframeObj = document.getElementById("info");
iframeObj.src = "http://2.handtop.sinaapp.com/";
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
addGlobalStyle('#content_body{ height:600px ! important; }');