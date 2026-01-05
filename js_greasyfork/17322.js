// ==UserScript==
// @name        多账号登录切换
// @namespace   multiaccount@userscripts.org
// @include     http://2dgal.com/*
// @include     http://bbs.2dgal.com/*
// @include     *
// @version     1.0.1
// @grant       none
// @description 可以快速在不同马甲间切换
// @downloadURL https://update.greasyfork.org/scripts/17322/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/17322/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

//界面
addStyle = function() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.textContent = '\
					.multiaccContainer{\
					font-size:12px;\
					position:fixed;\
					z-index:1000001;\
					width:10px;\
					height:10px;\
					background-color:green;\
					border:black;\
					top:30px;\
					right:30px;\
					inset 0 5px 0 rgba(255,255,255,0.3), 0 0 3px rgba(0,0,0,0.8);\
					}\
					.multiaccPanel{\
					z-index:1000000;\
					height:400px;\
					width:200px;\
					opacity:0.95;\
					position:relative;\
					right:190px;\
					background:burlywood;\
					}\
					#multiaccSelect{\
						width:120px;\
					}\
					.multiaccIntro{\
						padding:5px;\
						}\
					.multiaccIntro em{\
						color:#0099CC\
						}'

	var head = document.head;
	head.appendChild(style);
}

insertDiv = function() {
	var div = document.createElement('div');
	div.className = 'multiaccContainer';

	var panelDiv = document.createElement('div');
	panelDiv.className = 'multiaccPanel';
	panelDiv.innerHTML = '<button type=button id=multiaccSaveBtn class=multiaccBtn >新建保存</button>\
	<button type=button id=multiaccUserDefine class=multiaccBtn >自定义cookie</button>\
	<a id=multiaccClosePanel href=javascript: >×</a>\
	<br><div><button type=button id=multiaccSwitch class=multiaccBtn >切换至</button>\
	<select id=multiaccSelect ></select></div>\
	<button type=button id=multiaccRename class=multiaccBtn >重命名</button><br><hr>\
	<button type=button id=multiaccImport class=multiaccBtn >导入</button>\
	<button type=button id=multiaccExport class=multiaccBtn >导出</button>\
	<button type=button id=multiaccDelete class=multiaccBtn >删除</button>\
	<div class=multiaccIntro >使用说明:<br>\
	<p>1. 多数论坛只需每个ID新建保存一次,就可以切换</p>\
	<p>2. 部分论坛cookie是绑定UA的,UA改了cookie失效,导入导出也没用了</p>\
	一些网站、论坛 cookie使用了HTTP only 参数,\
	   脚本是不能直接读取、修改那些cookie的,如<em>百度贴吧,绯月</em>,\
	   这时需要一些小技巧:<a href="https://greasyfork.org/zh-CN/scripts/17322-%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%88%87%E6%8D%A2">点击打开</a>\
	</div>'
	panelDiv.style.display = 'none';
	div.addEventListener('click', function(e) {
		panelDiv.style.display = 'block';
	}, false);
	


	div.appendChild(panelDiv);
	document.body.appendChild(div);
	return div;
}


updateOption = function() {
	var t='';
	for (var p in cookieData){
		t+='<option value="' + p + '" >' + p + '</option>';
	}
	document.getElementById('multiaccSelect').innerHTML=t;
}

// 保存 读取 导入 切换 删除cookie
// cookieData={ name:cookie,...}
loadData = function() {
	try {
		return JSON.parse(localStorage["multiacc"]);
	} catch (e) {
		localStorage["multiacc"] = "";
		return {};
	}
}
saveData = function() {
	localStorage["multiacc"] = JSON.stringify(cookieData);
}

importCookie = function(cookie) {
	if (!cookie) cookie = document.cookie; //普通的保存
	var selected = document.getElementById('multiaccSelect');
	var defaultText = selected.value ? selected.value : document.title
	var name = prompt('记录名, 相同则覆盖', defaultText);
	if (!name) return; //空名字不保存
	cookieData[name] = cookie;
	saveData();
	updateOption();
}

deleteCookie = function(name){
	if(name){
		delete cookieData[name];
		saveData();
		updateOption();
	}
}

changeActiveCookie = function(cookie) {
	var cookieArray = cookie.split(';');
	var d = new Date();
	d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000)); //一个月
	var expires = "expires=" + d.toUTCString();
	for (var i = 0; i < cookieArray.length; i++) {
		document.cookie = cookieArray[i] + '; path=/; ' + d;
	}
}

//绑定界面事件
multiaccEvent = function() {
	document.getElementById("multiaccSaveBtn").addEventListener('click', function(e) {
		importCookie();
	}, false);

	document.getElementById("multiaccSwitch").addEventListener('click', function(e) {
		var name=document.getElementById('multiaccSelect').value;
		changeActiveCookie(cookieData[name]);
	}, false);

	document.getElementById("multiaccRename").addEventListener('click', function(e) {
		var name=document.getElementById('multiaccSelect').value;
		var newName = prompt('重命名为',name);
		if(newName){
			cookieData[newName]=cookieData[name];
			delete cookieData[name];
			saveData();
			updateOption();
		}
	}, false);

	document.getElementById("multiaccUserDefine").addEventListener('click', function(e) {
		var cookie = prompt('输入cookie');
		if (cookie) {
			importCookie(cookie);
		}
	}, false);

	document.getElementById("multiaccImport").addEventListener('click', function(e) {
		var cookie = prompt('输入cookie');
		if (cookie) {
			try{
				importCookieData=JSON.parse(cookie);
				for(var name in importCookieData){
					cookieData[name]=importCookieData[name];
				}
				saveData();
				updateOption();
			}
			catch(e){
				alert("导入数据错误");
			}
		}
	}, false);

	document.getElementById("multiaccExport").addEventListener('click', function(e) {
		prompt('复制数据保存', JSON.stringify(cookieData));
	}, false);

	document.getElementById("multiaccDelete").addEventListener('click', function(e) {
		var name=document.getElementById('multiaccSelect').value;
		if(confirm("确定删除"+name+"?")){
			deleteCookie(name);
		}
	}, false);
	document.getElementById('multiaccClosePanel').addEventListener('click', function (e) {
		e.stopPropagation();
		document.getElementsByClassName('multiaccPanel')[0].style.display = 'none';
	}, false);
}

// init
cookieData = loadData();
addStyle();
insertDiv();
updateOption();
multiaccEvent();