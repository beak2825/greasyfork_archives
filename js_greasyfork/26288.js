// ==UserScript==
// @name        淘宝账号自动登录
// @namespace    http://login.taobao.com
// @version      0.22
// @description  初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @homepage     http://www.greasyfork.org/users/89556
// @author       Richard He
// @iconURL      http://www.xuebalib.cn/userjs/icon.ico
// @match        https://login.taobao.com/member/login.jhtml*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/26288/%E6%B7%98%E5%AE%9D%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/26288/%E6%B7%98%E5%AE%9D%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	/*jshint multistr: true */
	var tipStyle = "\
     #dashboard {position:fixed;top:20px;right:20px;width:440px;height:auto;background-color:#fff;border:1px solid #000;padding:0px 30px 30px 30px;z-index:999}\
     #dashboard h1{height:52px;line-height:52px;text-align:center;}\
     #dashboard div{font-size:14px;}\
     #dashboard ol{margin:11px 0px;padding:0px;padding-left:20px;}\
     #dashboard ol li{list-style-type:decimal!important;cursor:pointer;color:#00F}\
     #dashboard ol li:hover{color:#F00;}\
     #dashboard fieldset{border:1px solid #ccc;padding:8px 24px;line-height:32px;}\
     #dashboard fieldset legend{font-weight:700}\
     #dashboard span{margin-left:20px;color:#f00;}\
     #dashboard label{width:50px;text-align:left;display:inline-block;}\
     #dashboard input{width:80px;margin-top:16px;}\
   ";
	GM_addStyle(tipStyle);
	function add_user(name,pass)
	{
		var d = document;
		var div = d.createElement('div');
		div.id = 'dashboard';
		div.innerHTML = "\
			<h1>添加及删除用户</h1>\
         <div>已添加用户(点击用户名即可删除)</div>\
         <ol id='dol'>\
         </ol>\
         <fieldset>\
         <legend>添加用户名及密码</legend>\
         <label for='uname'>用户名:</label> <input id='uname' type='text'><br /> \
         <label for='upass'>密  码:</label> <input id='upass' type='password'><br />\
         <input id='add' type='button' value='添加用户'>\
         </fieldset>\
          <input id='clos' type='button' value='关闭设置' onclick=\"document.body.removeChild(document.getElementById('dashboard'))\">\
		  ";
		d.body.appendChild(div);
		var names = GM_listValues();
		for(var i in names)
		{
			var li = document.createElement('li');
			li.innerText = names[i];
			li.onclick = function(){
				GM_deleteValue(this.innerText);
				this.parentNode.removeChild(this);
			};
			document.getElementById('dol').appendChild(li);
		}
		
		//添加用户
		document.getElementById('add').addEventListener('click',function(){
                        var uob = document.getElementById('uname');
                        var pob = document.getElementById('upass');
			var uname = uob.value;
			var upass = pob.value;
			var setSta = GM_setValue(uname,upass);
			if(!setSta)
			{
				var li = document.createElement('li');
				li.innerText = uname;
				document.getElementById('dol').appendChild(li);
                                uob.value = '';
                                pob.value = '';
			}
		},false);
	}
	GM_registerMenuCommand('添加淘宝用户',add_user,"z");
	var uname = GM_listValues();
        var len = uname.length;
	var upass = [];
	for(var i in uname)
	{
		upass.push(GM_getValue(uname[i]));
	}
	function autoform(name,pass)
	{
		document.getElementById('J_Quick2Static').click();
		document.getElementById('TPL_username_1').value = name;	
		document.getElementById('TPL_password_1').value = pass;
		document.getElementById('J_SubmitStatic').click();
        
	}
	var style = "button.autolog{position:absolute;right:-120px;width:120px;height:32px;line-height:32px;border-bottom:2px solid #fff;border-right:2px solid #fff;cursor:pointer;};";
	var s1 = "#content .content-layout{overflow:visible}";
	GM_addStyle(style);
	GM_addStyle(s1);
	for(var i=0;i<len;i++)
	{
		var but = document.createElement('button');
		but.className = 'autolog';
		but.uname = uname[i];
		but.upass = upass[i];
		but.innerText = uname[i];
		but.style.top = (i*32)+"px";
		but.onclick = function(){autoform(this.uname,this.upass); };
		var box = document.getElementById('J_LoginBox');
		box.appendChild(but);
	}
})();