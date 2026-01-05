// ==UserScript==
// @name         bilibili直播精简
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      3.0 beta2
// @description  【可能是你遇到的最好用的Bilibili直播精简脚本】，送礼随心开关，页面清爽无广告！
// @author       BackRunner
// @match        *://live.bilibili.com/*
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/23685/bilibili%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/23685/bilibili%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

// ==   Tips   ==
// 使用时可以根据自己需要用双斜线注释掉部分代码开启你想要的功能
// 建议临时开启部分功能不要更改下面的代码，请临时禁用这个脚本
// 注释掉部分代码可能会影响整体美观
// == 更新日志 ==
// 2017.11.08 - 3.0
// 简单地针对新版的Bilibili直播进行了重制，后续将更新更多的调整。
// beta2:优化CSS
// 如果遇到Bug，请及时反馈
// ==============


(function() {
	//变量定义
	var hideGift = false;
	var hideUserInfo = false;
	//更新提示
	updateAlert();

	//初始化
	initialize();

	//主执行
	if (window.location.href == "http://live.bilibili.com/"){
		console.warn('Bilibili直播页面精简脚本 by BackRunner: 目前在主页，不执行脚本');
	} else {
		console.warn('Bilibili直播页面精简脚本 by BackRunner: 脚本运行');
		addCSS();
		//延迟脚本
		setTimeout(function(){
			var interval = setInterval(check,120);
			var n = 0;
			function check(){
				//添加礼物按钮
				addControlButton();
				n++;
				if (n>4){
					clearInterval(interval);
				}
			}
		});
		//惰性脚本
		$(document).ready(function(){
			addControlButton();
		});
	}

	function initialize(){
		hideGift = initialize_var("hideGift",true);
		hideUserInfo = initialize_var("hideUserInfo",true);
	}

	function initialize_var(name,defaultSet){
		var obj = GM_getValue(name,defaultSet);
		if (obj === undefined){
			obj = defaultSet;
		}
		return obj;
	}

	function saveVar(){
		GM_setValue("hideGift",hideGift);
		GM_setValue("hideUserInfo",hideUserInfo);
	}

	function addCSS(){
		//变量定义
        var cssText = "";

        //右侧3D
        cssText += ".haruna-canvas {display:none !important}";
        //右边栏
        cssText += ".side-bar-cntr {display:none !important}";
        //许愿
        cssText += ".ema-wishing {display:none !important}";
        //活动banner
        cssText += ".activity-pushing-out {display:none !important}";
        //收获值
        //cssText += ".activity-top3 {display:none !important}";
        //关注按钮冒出来的萝莉
        cssText += ".loli-ctnr {display:none !important}";
        //最小化图标
        cssText += ".minimize-btn {display:none !important}";

        //弹幕框系统信息
        cssText += ".system-msg {display:none !important}";
        //弹幕框礼物信息
        cssText += ".gift-item {display:none !important}";
        cssText += ".super-gift-bubbles {display:none !important}";
        //右侧头像
        cssText += ".avatar-btn {display:none !important}";

        //footer
        cssText += "#link-footer-vm {display:none !important}";

        cssText += ".backrunner-ctrlbtn {background:#23ade5;margin-top:5px;border-radius:5px;cursor:pointer;border:0;height:15px;margin-left:5px;}";
        cssText += ".attention-btn-ctnr {align:right !important;}";

        if (hideUserInfo){
            cssText += "#rank-list-vm {display:none !important}";
            cssText += ".chat-history-panel {height:calc(100% - 128px - 10px) !important}";
            cssText += ".fans-medal-item {display:none !important}";
            cssText += ".user-level-icon  {display:none !important}";
            cssText += ".title-label {display:none !important}";
            cssText += ".guard-icon {display:none !important}";
            cssText += ".vip-icon {display:none !important}";
            cssText += ".fans-medal-item-ctnr {display:none !important}";
            cssText += ".left-action {display:none !important}";
        }

        if (hideGift){
            cssText += "#gift-control-vm {display:none !important}";
        } else {
            cssText += ".v-top {display:inline-block !important}";
            cssText += ".user-panel {padding-top:5px !important;top:0% !important}";
        }


		var modStyle = document.querySelector('#modCSS');
		if (modStyle === null)
		{
			modStyle = document.createElement('style');
			modStyle.id = 'modCSS';
			document.body.appendChild(modStyle);
		}   
		modStyle.innerHTML = cssText;
	}

	function addControlButton(){
		var before = document.getElementsByClassName('attention-btn-ctnr')[0];
		//按钮添加
		if (document.querySelector('#backrunner-giftCtrl')===null){			
			//按钮层
			var ctrlDiv=document.createElement("div");
			ctrlDiv.setAttribute("id","backrunner-giftCtrl");
			if (hideUserInfo){
				ctrlDiv.innerHTML+='<button class="backrunner-ctrlbtn" id="backrunner-userCtrl-btn">显示用户信息</button>';
			} else {
				ctrlDiv.innerHTML+='<button class="backrunner-ctrlbtn" id="backrunner-userCtrl-btn">隐藏用户信息</button>';
			}
			if(hideGift){
				ctrlDiv.innerHTML+='<button class="backrunner-ctrlbtn" id="backrunner-giftCtrl-btn">开启礼物</button>';
			}else{
				ctrlDiv.innerHTML+='<button class="backrunner-ctrlbtn" id="backrunner-giftCtrl-btn">关闭礼物</button>';
			}
			before.appendChild(ctrlDiv);
		}				
		//添加事件监听
		addControlButtonEventListener();
	}

	function addControlButtonEventListener(){
		var gift_btn = document.getElementById("backrunner-giftCtrl-btn");
		var user_btn = document.getElementById("backrunner-userCtrl-btn");
		gift_btn.addEventListener('click',giftBtnClick);
		user_btn.addEventListener('click',userBtnClick);
	}

	function giftBtnClick(){
		var btn = document.getElementById("backrunner-giftCtrl-btn");
		//修改变量
		if (hideGift){
			btn.innerHTML="关闭礼物";
			hideGift = false;
		} else {
			btn.innerHTML="开启礼物";
			hideGift = true;
		}
		//重添加CSS
		try{
			$('#modCSS').remove();
			addCSS();
		} catch(e){
			console.error(e);
		}
		//保存
		saveVar();
	}

	function userBtnClick(){
		var btn = document.getElementById("backrunner-userCtrl-btn");
		//修改变量
		if (hideUserInfo){
			btn.innerHTML="隐藏用户信息";
			hideUserInfo = false;
		} else {
			btn.innerHTML="显示用户信息";
			hideUserInfo = true;
		}
		//重添加CSS
		try{
			$('#modCSS').remove();
			addCSS();
		} catch(e){
			console.error(e);
		}
		//保存
		saveVar();
	}

	//更新提醒
	function updateAlert(){        
		var s_update = "Bilibili直播页面精简 by BackRunner：\n检测到脚本版本更改\n\n";
		var version = GM_getValue("version");
		if (version !== GM_info.script.version){
			console.warn("Bilibili直播页面精简 by BackRunner：检测到脚本版本更改：" + version + " → " + GM_info.script.version);
			if (version === undefined){
				version = "未知";
			}
			switch (version){
				default:
					s_update += "版本已从 " + version + " 更新为 " + GM_info.script.version + "\n\n" + GM_info.script.version + "版本的更新内容为：\n简单地针对新版的Bilibili直播进行了重制，后续将更新更多的调整。\n如果遇到Bug请及时反馈。\n";
					break;                    
				case "未知":
					s_update += "欢迎使用 Bilibili直播页面精简脚本 by BackRunner\n您当前的脚本版本为： " + version + "\n您可以通过页面上的按钮开关礼物面板和用户信息显示\n";
					break;             
				case "3.0 beta2":
					s_update += "版本已从 " + version + " 降级为 " + GM_info.script.version + "\n\n" + "建议使用最新版本的脚本以获得最佳体验\n降级会造成您的设置丢失，请检查您的设置\n";   
					break;
			}
			s_update += "\n遇到任何问题请立刻到GreasyFork反馈\n或者发送邮件至dev@backrunner.top\n如果您觉得本脚本好用可使用支付宝扫描GreasyFork中的二维码进行捐赠\n收到您捐赠的后我会将您的id加入到感谢名单\n感谢名单显示在这里和脚本描述内";
			window.alert(s_update);
			GM_setValue("version",GM_info.script.version);
		} else {
			console.warn("Bilibili直播页面精简 by BackRunner：未检测到脚本版本更改");
		}
	}

})();