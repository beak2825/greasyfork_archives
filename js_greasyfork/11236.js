// ==UserScript==
// @name        discuz黑色主题
// @namespace   discuz黑色主题
// @include     *
// @version     1
// @grant       none
// @description 可自动识别DISCUZ论坛，并将他们显示为黑色主题。
// @downloadURL https://update.greasyfork.org/scripts/11236/discuz%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/11236/discuz%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
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

var nodes = document.querySelectorAll("meta[name='generator'][content^='Discuz! X']");
if (nodes.length == 0) {
	return;
}
//for (i=0;i<nodes.length;i++){
//	alert("name="+nodes[i].getAttribute("name")+"\ncontent="+nodes[i].getAttribute("content"));
//}
addGlobalStyle('html,body,div,td.pls,.scbar_icon_td,.scbar_txt_td,#scbar_txt,.scbar_type_td,.plc,#fastpostmessage,#frameoBWdsx,.pg *,\
#visitedforums *,#visitedforumstmp *,#forumnewshow,#forumnewshow *,.ts *,#typeid_fast_ctrl,#subject,.common,.icn,.num,.by,.common *,.icn *,\
.num *,.by *,.new,.new *,.lock,.lock *,.th,.th *,.pct *,#frameoBWdsx_left *,#framehg7W8p,p *,#thread_types *,.ml *,.fl_g a \
{background:none#000!important;color:#bbb!important;}');