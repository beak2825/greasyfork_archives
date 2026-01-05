// ==UserScript==
// @name	Baidu Multiuser
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://ww2.sinaimg.cn/small/a56031a1gw1emwlbe1c8gj2097097wfa.jpg
// @version	2.0.1
// @description	百度马甲切换
// @homepageURL	http://geraldl.net/userjs/BaiduMultiuser
// @match	*://*.baidu.com/*
// @include	*.baidu.com/*
// @exclude http://developer.baidu.com/*
// @exclude http://web.im.baidu.com/*
// @grant	GM_addStyle
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_xmlhttpRequest
// @grant	GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/119/Baidu%20Multiuser.user.js
// @updateURL https://update.greasyfork.org/scripts/119/Baidu%20Multiuser.meta.js
// ==/UserScript==

function getValue(key,def){
	var v=GM_getValue(key)||'';
	try{v=JSON.parse(v);}catch(e){v=def;}
	return v;
}
function setValue(k,v){GM_setValue(k,JSON.stringify(v));}
function checkCookie(name){
	m=document.cookie.match(/BDUSS=(.*?)(;|$)/);
	if(m) {users[name]=m[1];saveUsers();}
	else users=null;
}
function doSetCookie(s){
	var d=new Date();
	if(s) d.setTime(16094e8); else s='';
	document.cookie='BDUSS='+s+';domain=baidu.com;path=/;expires='+d.toGMTString();
}
function setCookie(s){
	var re=/\bBDUSS=/;
	if(re.test(document.cookie)) {
		doSetCookie(s);
		return true;
	}
	doSetCookie(s?s:'logout');
	if(re.test(document.cookie)) {
		if(!s) doSetCookie(s);
		return true;
	}
}
function switchUser(s,p){
	if(setCookie(s)) {
		if(typeof p=='function') p();
		else if(typeof p=='string') location.replace(p);
		else location.reload();
	} else alert('设置Cookie失败，请使用此脚本重新登录！');
}
function initLoc(){
		gu.right=gu._right=gu.parentNode.offsetWidth-gu.offsetWidth-gu.offsetLeft;
		gu.top=gu._top=gu.offsetTop;
}
function saveUsers(){setValue('ge_users',users);}
function saveLoc(){setValue('ge_users_loc',{right:gu.right,top:gu.top});}
function checkLogIn(res){
	if(res.finalUrl.substr(0,url_login.length)==url_login)
		logIn(res.responseText);
	else GM_xmlhttpRequest({
		method:'GET',
		url:'http://www.baidu.com',
		onload:function(o){
			var m=o.responseText.match(/<span class=user-name>(.*?)<\/span>/);
			if(m) {
				checkCookie(m[1]);
				location.reload();
			} else alert('出错了！我也不知道要怎么办。。');
		},
	});
}
function doLogIn(data){
	console.log('do log in');
	var rdata=[],i;
	data['username']=i=prompt('请输入手机号/邮箱/用户名：');
	if(i===null) return;
	data['password']=i=prompt('请输入密码（用后即焚）：');
	if(i===null) return;
	for(i in data)
		rdata.push(encodeURIComponent(i)+'='+encodeURIComponent(data[i]));
	GM_xmlhttpRequest({
		method:'POST',
		url:'http://wappass.baidu.com/passport/login',
		data:rdata.join('&'),
		headers:{
			'User-Agent':User_Agent,
			'Content-Type':'application/x-www-form-urlencoded',
		},
		onload:checkLogIn,
	});
}
function extractData(src){
	var i=src.indexOf('<div id="error_area"'),j=src.indexOf('</div>',i),
			m=src.substr(i,j-i).match(/<span class="highlight">(.*?)<\/span>/),
			data={},form;
	if(m) return alert('登录失败：'+m[1]);
	i=src.indexOf('<form action="/passport/login"');j=src.indexOf('</form>',i);
	form=src.substr(i,j-i);
	form.replace(/<input [^>]*>/g,function(m){
		var o={};
		m.replace(/(\w+)="(.*?)"/g,function(m,g1,g2){
			o[g1]=g2;
		});
		if(o.type!='submit') data[o.name]=o.value;
	});
	data.submit='登录';
	if(data['vcodestr']) {
		form=document.createElement('form');
		form.className='ge_popup ge_opt';
		form.style.display='block';
		form.innerHTML='\
<h3>马甲切换</h3>\
请输入验证码：<input type=text class=vcode><br>\
<img src=http://wappass.baidu.com/cgi-bin/genimage?'+data['vcodestr']+' style="cursor:pointer" title="看不清，换一张">\
<input type=submit>';
		form.onsubmit=function(e){
			e.preventDefault();
			data['verifycode']=form.querySelector('.vcode').value;
			doLogIn(data);
		};
		form.querySelector('img').onclick=function(){
			setTimeout(logIn,0);
		};
	} else doLogIn(data);
}
function logIn(){
	console.log('log in');
	GM_xmlhttpRequest({
		method:'GET',
		url:url_login+'?type=1',
		headers:{
			'User-Agent':User_Agent,
		},
		onload:function(o){
			if(!o.finalUrl) {
				alert('您的运行环境不支持此脚本，可以尝试Baidu Multiuser Unsafe。');
				return;
			}
			extractData(o.responseText);
		},
	});
}
function userManage(e,p,o){
	e.preventDefault();o=e.target;e=o.parentNode;p=e.parentNode;
	if(o.tagName=='A') {
		if(e==p.firstChild) switchUser();
		else if(e==p.lastChild) logIn();
		else switchUser(users[o.innerText||o.textContent]);
	} else if(o.tagName=='SPAN') {
		o=o.previousSibling;delete users[o.innerText||o.textContent];
		setTimeout(saveUsers,0);p.removeChild(e);
	}
}
function locate(l){
	if(l) {
		gu.right=l&&!isNaN(l.right)?l.right:100;
		gu.top=l&&!isNaN(l.top)?l.top:100;
	}
	gu.style.right=gu.right+'px';
	gu.style.top=gu.top+'px';
}
function mousemove(e){
	e.preventDefault();e.stopPropagation();
	var l={right:gu._right+gu.x-e.pageX,top:gu._top+e.pageY-gu.y};
	locate(l);
}
function pinUpdate(){
	if(gu.pin) {
		symbol.classList.add('ge_pin');
		symbol.setAttribute('title','固定在页面上');
		gu.style.position='absolute';
	} else {
		symbol.classList.remove('ge_pin');
		symbol.setAttribute('title','固定在屏幕上');
		gu.style.position='';
	}
}
function pin(){
	initLoc();
	if(gu.pin)	// fixed => absolute
		gu.top+=window.pageYOffset;
	else	// absolute => fixed
		gu.top-=window.pageYOffset;
	pinUpdate();
	locate();
	saveLoc();
}
function init(){
	users=getValue('ge_users',{});
	GM_registerMenuCommand('百度马甲设置',showOptions);
	GM_addStyle('\
#ge_u{display:block;padding:10px;text-align:left;}\
#ge_u .ge_h{display:none;}\
#ge_u{z-index:10006;font:normal normal 400 12px/18px 宋体;position:fixed;}\
#ge_u>span{background:white;color:blue;border-radius:3px;border:1px solid #c0c0c0;padding:2px;cursor:pointer;}\
#ge_u>div{position:relative;margin-top:3px;}\
#ge_u>div>*{position:absolute;}\
.ge_u{background:white;border:1px solid silver;box-shadow:5px 5px 7px #333;}\
.ge_u{width:120px;max-height:400px;overflow-x:hidden;overflow-y:auto;}\
.ge_u>li{position:relative;display:block;padding:2px 20px 4px 6px;}\
.ge_u>li:hover{background:lightgray;}\
.ge_u a{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
.ge_u span{position:absolute;top:0;right:0;color:white;background:#77f;border-radius:3px;margin:2px;cursor:pointer;padding:2px;}\
.ge_u span:hover{background:red;}\
.ge_sym{display:inline-block;width:7px;height:7px;border:1px solid #c0c0c0;border-radius:4px;margin-left:3px;}\
.ge_sym.ge_pin{background:#c0c0c0;}\
.ge_opt{padding:20px;border-radius:5px;}\
.ge_opt fieldset{border:1px solid silver;border-radius:5px;padding:5px;}\
.ge_opt textarea{min-height:100px;width:100%;}\
');
	gu=document.createElement('div');gu.id='ge_u';
	gu.innerHTML='<span>马甲<span class=ge_sym></span></span><div><ul class="ge_u ge_h"></ul></div>';
	gu.style.display=getValue('float','');
	ul=gu.querySelector('ul');ul.onclick=userManage;
	symbol=gu.firstChild.lastChild;
	gu.pin=!!getValue('ge_pin');pinUpdate();
	symbol.onclick=function(){setValue('ge_pin',gu.pin=!gu.pin);pin();};
	gu.onmouseover=function(e){
		if(this.contains(e.relatedTarget)) return;
		ul.classList.remove('ge_h');
		if(gu.offsetLeft+gu.firstChild.offsetLeft+ul.offsetWidth<=document.body.offsetWidth) ul.style.pixelLeft=0;
		else ul.style.pixelLeft=document.body.offsetWidth-gu.offsetLeft-gu.firstChild.offsetLeft-ul.offsetWidth;
	};gu.onmouseout=function(e){if(!this.contains(e.relatedTarget)) ul.classList.add('ge_h');};
	var d=getValue('ge_users_loc',{});if(typeof d=='string') d=JSON.parse(d);
	document.body.appendChild(gu);locate(d);gu.moving=false;
	gu.firstChild.onmousedown=function(e){
		e.preventDefault();e.stopPropagation();
		if(e.target!=gu.firstChild||gu.moving) return;gu.moving=true;
		initLoc();
		gu.x=e.pageX;
		gu.y=e.pageY;
		document.addEventListener('mousemove',mousemove,false);
	};
	gu.onmouseup=function(e){
		if(!gu.moving) return;gu.moving=false;
		e.preventDefault();e.stopPropagation();
		document.removeEventListener('mousemove',mousemove,false);
		saveLoc();
	};
	initMenu();
	popup=document.createElement('div');
	popup.className='ge_popup ge_opt';
	popup.innerHTML='\
<h3>设置 - 百度马甲切换脚本</h3>\
<fieldset><legend>马甲数据 <button id=gu_import>导入</button> <button id=gu_export>导出</button> \
<a title="复制数据到以下文本框然后点击导入即可导入数据。\n点击导出后复制数据文本即可用于导入。">(?)</a></legend>\
<textarea id=gu_data></textarea></fieldset>\
<p align=right><button id=gu_close>关闭</button></p>\
';
	document.body.appendChild(popup);
	popup.addEventListener('click',function(e){e.stopPropagation();},false);
	var t=popup.querySelector('#gu_data');
	t.onclick=function(){this.select();};
	popup.querySelector('#gu_import').onclick=function(o){
		try{o=JSON.parse(t.value);}catch(e){o=null;}
		if(o&&typeof o=='object') {
			for(var i in o) users[i]=o[i];
			saveUsers();initMenu();alert('导入成功！');
		} else alert('导入失败！');
	};
	popup.querySelector('#gu_export').onclick=function(){t.value=JSON.stringify(users);};
	popup.querySelector('#gu_close').addEventListener('click',function(){popup.style.display='';},false);
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
		d.push('<li title="请添加马甲。" style="color:gray">未检测到Cookie</li>');
	d.push('<li><a href=#>添加马甲</a></li>');
	ul.innerHTML=d.join('');
}
function showOptions(){
	popup.style.display='block';
	popup.style.top=(innerHeight-popup.offsetHeight)/2+'px';
	popup.style.left=(innerWidth-popup.offsetWidth)/2+'px';
}
var User_Agent='Most handsome in the world',
		url_login='http://wappass.baidu.com/passport/login',
		menu,gu,ul,symbol,options,users,popup;
if(window.top===window&&document.head) init();
