// ==UserScript==
// @name        wordpress黑色主题
// @namespace   wordpress黑色主题
// @include     *
// @version     1
// @grant       none
// @description 自动识别wordpress,并显示为黑色主题
// @downloadURL https://update.greasyfork.org/scripts/11256/wordpress%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/11256/wordpress%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
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
var nodes = document.querySelectorAll("meta[name='generator'][content^='WordPress']");
if (nodes.length == 0) {
	return;
}
//for (i=0;i<nodes.length;i++){
//	alert("name="+nodes[i].getAttribute("name")+"\ncontent="+nodes[i].getAttribute("content"));
//}

addGlobalStyle('html,body,article,.entry-title *,#copyright,#comment,.comment-bottom,#colophon,.header,.title,.title *,.title2,.title2 *,.bottom,.navigation,\
#comments,#content,.content,#respond,#secondary,#navbar,.widget-area,.widget,#sidebar,.sidebar,.blog,#page,.site,.content-area,#leftFullStackButton,\
#rightFullStackButton,#main,.widgettitle,.textwidget,.widgetcontainer,.clearfix,#footer,.entry-summary,.meta,#searchbox,.content-wrapper,.source-code\
  {background:none#000!important;color:#bbb!important;text-shadow:none!important;}\
  .prettyprint,input,code\
  {background:none#222!important;color:#ddd!important;text-shadow:none!important;}\
input { border:1px solid #00f!important;}');