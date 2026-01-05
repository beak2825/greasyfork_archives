// ==UserScript==
// @name	Tieba Multiuser
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.3.1.1
// @description	百度贴吧马甲切换
// @homepage	http://geraldl.ml/userjs/TiebaMultiuser
// @include	http://tieba.baidu.com/*
// @require	https://greasyfork.org/scripts/144/code.user.js
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/121/Tieba%20Multiuser.user.js
// @updateURL https://update.greasyfork.org/scripts/121/Tieba%20Multiuser.meta.js
// ==/UserScript==

function getValue(k,d){
	var o=GM_getValue(k,'');
	if(o&&typeof o=='string') o=JSON.parse(o);
	return o||d;
}
function setValue(k,v){GM_setValue(k,JSON.stringify(v));}
function switchUser(s,p){
	var d=new Date();if(s) d.setTime(16094e8); else s='';
	document.cookie='BDUSS='+s+';domain=baidu.com;path=/;expires='+d.toGMTString();
	if(typeof p=='function') p();
	else if(typeof p=='string') location.replace(p);
	else location.reload();
}
function saveUsers(){setValue('ge_users',users);}
function userManage(e,p,o){
	e.preventDefault();o=e.target;e=o.parentNode;p=e.parentNode;
	if(o.tagName=='A') {
		if(e==p.firstChild) switchUser();
		else if(e==p.lastChild) {
			//unsafeWindow.TbCom.process("User", "buildLoginFrame");	// HttpOnly cookie
			location.href='http://wappass.baidu.com/?login&u='+encodeURIComponent(location.href);
		} else switchUser(users[o.innerText||o.textContent]);
	} else if(o.tagName=='SPAN') {
		o=o.previousSibling;delete users[o.innerText||o.textContent];
		setTimeout(saveUsers,0);p.removeChild(e);
	}
}
function buildMenu(bar){
	utils.addStyle('\
#ge_tu>li{position:relative;cursor:pointer;}\
#ge_tu span{position:absolute;top:0;right:0;background:#77f;color:white;border-radius:3px;border:1px solid;border:none;margin:2px;padding:2px;cursor:pointer;line-height:1em;}\
#ge_tu span:hover{background:red;}\
');
	$('<li class=split>').prependTo(bar);
	var a=$('<li><div class="u_menu_item"><a href=# class=u_menu_wrap style="margin-top:-2px;">马甲</a></div></li>').prependTo(bar).mouseover(function(){
		b.show();c.addClass('u_menu_hover');
	}).mouseout(function(){b.hide();c.removeClass('u_menu_hover');}),
	b=$('<div class=u_ddl>').hide().appendTo(a),
	c=a.children().first();
	$('<div class=u_ddl_tit style="left:1px;">').appendTo(b).width(a.innerWidth()-2);
	ul=$('<ul id=ge_tu>').appendTo($('<div class="u_ddl_con u_ddl_con_top">').appendTo(b)).click(userManage);
	initMenu();
}
function initMenu(){
	d=[];
	if(users) {
		d.push('<li><a href=#>未登录状态</a></li>');
		for(var i in users) {
			if(!i) {delete users[i];continue;}
			d.push('<li><a href=#>'+i.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</a><span>删</span></li>');
		}
	} else
		d.push('<li title="未检测到Cookie，请任意添加一个马甲或自行去除对应Cookie的HttpOnly属性。" style="color:gray">未检测到Cookie</li>');
	d.push('<li><a href=#>添加马甲</a></li>');
	ul.html(d.join(''));
}
function showOptions(){
	utils.popup.show({
		html:'\
<h3>设置 - 贴吧马甲切换脚本</h3>\
<fieldset><legend>马甲数据 <button id=gu_import>导入</button> <button id=gu_export>导出</button> \
<a title="复制数据到以下文本框然后点击导入即可导入数据。\n点击导出后复制数据文本即可用于导入。">(?)</a></legend>\
<textarea id=gu_data></textarea></fieldset>\
',
		className:'ge_opt',
		init:function(d){
			var t=d.querySelector('#gu_data');t.onclick=function(){this.select();};
			d.querySelector('#gu_import').onclick=function(o){
				try{o=JSON.parse(t.value);}catch(e){o=null;}
				if(o&&typeof o=='object') {
					for(var i in o) users[i]=o[i];
					saveUsers();initMenu();alert('导入成功！');
				} else alert('导入失败！');
			};
			d.querySelector('#gu_export').onclick=function(){t.value=JSON.stringify(users);};
		}
	});
}
function init(d,m){
	users=getValue('ge_users',{});
	if((d=PageData)&&d.user&&d.user.is_login&&d.user.name) d=d.user.name;	// 贴吧
	if(d) {
		m=document.cookie.match(/BDUSS=(.*?)(;|$)/);
		if(m) {users[d]=m[1];saveUsers();}
		else users=null;
	}
	GM_registerMenuCommand('贴吧马甲设置',showOptions);
	function check(e){
		if(e.target.parentNode.id=='com_userbar') {
			document.body.removeEventListener('DOMNodeInserted',check,false);
			buildMenu(e.target);
		}
	}
	document.body.addEventListener('DOMNodeInserted',check,false);
}
var users,ul;
if(document.querySelector('a[param=word]')) init();
