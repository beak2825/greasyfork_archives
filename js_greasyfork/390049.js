// ==UserScript==
// @name        discuz阅读模式
// @namespace   discuz阅读模式
// @include     *
// @version     1
// @grant       none
// @description 可自动识别DISCUZ论坛，去除多余元素,更适合上班摸鱼。
// @downloadURL https://update.greasyfork.org/scripts/390049/discuz%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/390049/discuz%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
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
addGlobalStyle('html,body,div,td.pls,.scbar_icon_td,.scbar_txt_td,#scbar_txt,.scbar_type_td,.plc,#fastpostmessage,#frameoBWdsx,.pg *,#visitedforums *,#visitedforumstmp *,#forumnewshow,#forumnewshow *,.ts *,#typeid_fast_ctrl,#subject,.common,.icn,.num,.by,.common *,.icn *,.num *,.by *,.new,.new *,.lock,.lock *,.th,.th *,.pct *,#frameoBWdsx_left *,#framehg7W8p,p *,#thread_types *,.ml *,.fl_g a{background:none#f2f6fc!important;color:#606266!important}#toptb,#pgt,#hd,#ft,#newspecialtmp,#post_replytmp,.pls,.pbn,.pi{display:none}.pgb a,.pg a{color:#dcdfe6;border-color:#f2f6fc}..pgb a:hover,pg a:hover{border-color:#e4e7ed}');