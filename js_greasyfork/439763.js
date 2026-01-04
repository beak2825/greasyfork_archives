// ==UserScript==
// @name         【蛮吉】网站自动登录
// @namespace    manji
// @license      manji
// @version      0.0.2
// @description  网站自动登录
// @author       manji
// @match        *://*login*taobao*
// @match        *://*loginmyseller.taobao.com*
// @match        *://*ydcspc.dongputech.com/#/login*
// @match        *://ydcspc2.dongputech.com:32471/#/login
// @match        *://passport.jd.com/uc/login*
// @grant        GM_xmlhttpRequest 
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439763/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/439763/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==



thisURL = window.location.href;
console.log(thisURL);

//  循环输入函数
function input_content(strElement,this_value){
	var focus = new Event('focus');
	var input= new Event('input');
	var blur= new Event('blur');
	
	// 如果能找到元素，则给元素赋值
	var num = 0;
	var t = setInterval(loopIput(strElement,this_value),1000); // 每隔1秒检查一次 运行一次函数，直到运行成功,若果运行30次还没成功，则终止
	function loopIput(strElement,this_value){
		var bojct = document.querySelector(strElement);
		num++;
		if(bojct){
			let objie = bojct;
			objie.value = this_value;
			objie.dispatchEvent(focus);
			objie.dispatchEvent(input);
			objie.dispatchEvent(blur);
			console.log('输入完成：',strElement,this_value);
			clearInterval(t);
		}else{
			console.log('对应的输入标签未找到',strElement,this_value);
		};
		if(num>30){clearInterval(t);};
	};
};

//----------------------韵达快递超市登录-------------------------------------
if(thisURL.indexOf("ydcspc") != -1 && thisURL.indexOf("login") != -1 ){
	console.log("韵达快递超市PC端登录");
	// 输入韵达快递超市PC端的账号
    // input_content('[placeholder="账户"]',"15707295185");
	input_content('div.login_from > form  .el-input--suffix > input',"15707295185");
	// 输入韵达快递超市PC端的密码
	// input_content('[placeholder="密码"]',"PYpy130525");
    input_content('div.login_from > form > div:nth-child(2) > div > div > input',"PYpy130525");
	
}
//---------------------XXXXX 登录------------------------------------------
else if(thisURL.indexOf("taobao") != -1 && thisURL.indexOf("login") != -1 ){
	//
	console.log("淘宝登录");
}
//---------------------京东3PL系统登录------------------------------------------
else if(thisURL.indexOf("passport.jd.com") != -1 && thisURL.indexOf("login") != -1 ){
    // 点击切换到账号登录
    try {document.querySelector(".login-tab.login-tab-r").click();} catch(err){console.error(err)};
    // 输入账号
    input_content('[name="loginname"]',"719丹江口市彭毅");
    // 输入密码
    input_content('[name="nloginpwd"]',"py130525");
}
else{
	console.log("没有登录项");
};

