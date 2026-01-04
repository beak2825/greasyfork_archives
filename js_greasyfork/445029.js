// ==UserScript==
// @name         FILL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  填充账号密码（物理）
// @author       You
// @match        *://*/*login*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445029/FILL.user.js
// @updateURL https://update.greasyfork.org/scripts/445029/FILL.meta.js
// ==/UserScript==
// 等待页面加载完成
//(window.οnlοad=function(){
//}
(function() {
	// ym：登录链接 zh：账号 mm：密码
	var zhmm = [
		{
			ym : "panel.cycloud.org/#/login",
			zh : "test",
			mm : "1234",
		}
		,{
			ym : "www.galaxy-cloud.com/#/login",
			zh : "test",
			mm : "1234",
		}
		,{	
			ym : "pan.baidu.com/login", // 测试递归查询
			zh : "test",
			mm : "123456",
		}
		,{
			ym : "v2.bujidao.org/auth/login",
			zh : "test",
			mm : "123456",
		}
		,{
			ym : "wappass.baidu.com/passport",
			zh : "test",
			mm : "123456",
		}
		,{
			ym : "account.coolapk.com/auth/login",
			zh : "test",
			mm : "123456",
		}
	];
	
	//window.onload = initLogin;
	//  声明定时器
	var timer = null;
	// 查询循环次数
	var initLoginNo = 0;
	// 代码块
	{
		console.log("查询页面的DOM元素对象是否未加载完。。。");
		whenReady(initLogin);
//		initLogin();
	}
	function whenReady(func) {
		console.time("recursiveQuery");
		/**
		 * document.readyState属性描述了文档的加载状态。一个文档的readyState可以是以下之一：
		 * loading——加载，此时document仍在加载
		 * interactive——互动，此时文档已经完成加载，文档已被解析，但是诸如图像，样式表和框架之类的子资源仍在加载。
		 * complete——完成，此时T文档和所有子资源已完成加载。状态表示 load 事件即将被触发。
		 */
		if(document.readyState === "interactive" || document.readyState === "complete") {
			func();
		} else {
			/**
			 * DOMContentLoaded：当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发。
			 * 无需等待样式表、图像和子框架的完成加载。——interactive
			 */
			document.addEventListener("DOMContentLoaded", func);
			console.log(document.readyState + "等待中。。。");
		}
	}
	function initLogin(){
		//setTimeout(load,5000);
		//let dom = document.getElementById("login_username");
		var dom = null;
		var inputs = document.getElementsByTagName("input");
		var index = null;
		for (var i = 0; i < inputs.length; i++) {
			console.log("密码循环位置：" + i);
			if(inputs[i].type.toUpperCase() == 'PASSWORD' && (inputs[i].placeholder != '' || inputs[i].name.toUpperCase().includes("PASSWORD") )) {
				dom = inputs[i];
				index = i;
				break;
			} else {
				if(i == inputs.length - 1){
//					console.log("密码填充失败！不存在类型为password且占位符不为空或名字包含passowrd的输入框！");
//					return;
				}
			}
		}
	    if(dom) {
	    	console.log("密码框获取成功，开始填充。。。");
	    	fill(index);
	        //  清除定时器
	        if(!timer) {
	            clearTimeout(timer);
	        }
	    } else {
	    	if(initLoginNo < 50) {
	    		++initLoginNo;
		    	console.log("就绪状态：" + document.readyState + " 递归查询：" + initLoginNo * 100 + "ms");
		        timer = setTimeout(initLogin, 100);
	    	}
	    }
    }
	
	// 根据地址来循环搜索
    function fill(index){
    	for (var i = 0; i < zhmm.length; i++) {
    		console.log("登录链接：" + location.href);
    		if (location.href.includes(zhmm[i].ym) ) {
    			zdtb(zhmm[i].zh, zhmm[i].mm, "", index);
    			break;
    		}
    	}
    }
	
	function zdtb(a, b, c, index) {
		try {
			var inputs = document.getElementsByTagName("input");
			console.log("输入框个数" + inputs.length);
//			for (var i = index; i < inputs.length; i++) {
				//document.getElementsByTagName("input")[1].getAttribute("type");
				//if (inputs[i].getAttribute("type") == "password") {
//				if(inputs[i].type.toUpperCase() == 'PASSWORD' && inputs[i].placeholder != '') {
					//inputs[i].value = b;
			var i = index;
					keyboardInput(inputs[i], b);
					console.log("密码填充完成");
					if (i != 0) {
						//var i2 = i - 1;
						//inputs[i2].value = a;

						/*
						while(inputs[i].placeholder == '' ) {
							//while(inputs[i-1].placeholder == '' || inputs[i-1].name == '' || inputs[i-1].type != null) {
							console.log("账号循环位置：" + i);
							if(i > 0)
								--i;
							else {
								break;
							}
						}
						if(i >= 0)
							keyboardInput(inputs[i], a);
						else{
							alert("账号填充失败！密码框以上输入框中未含有占位符的输入框！");
							console.log("密码输入框位置为：" + index + " 密码输入框元素为：");
							console.log(inputs[index]);
						}
						*/
						
						for(--i; i >= 0; i--){
							console.log("账号循环位置：" + i);
							if(inputs[i].placeholder != ''){
								keyboardInput(inputs[i], a);
								break;
							}else{
								if(i==0){
									var j = index;
									for(--j; j >= 0; j--){
										console.log("账号循环位置：" + j);
										if(inputs[j].name != '' || inputs[j].type != ''){
											keyboardInput(inputs[j], a);
											break;
										}else{
											if(j==0){
												alert("账号填充失败！密码框以上输入框中不存在占位符不为空或名字不为空或类型不为空的输入框！");
												console.log("密码输入框位置为：" + index + "\t密码输入框元素为：");
												console.log(inputs[index]);
											}
										}
									}
								}
							}
						}
						
					}
					// 登录（undefined则不自动登录|手动填写登录按钮element登录|为空则自动找到submit类型按钮登录）
//					if (c) {
//						document.querySelector(c).click()
//					} else {
//						if(c == "") {
//							document.querySelector("[type=submit]").click();
//						} else
//							console.log("不自动登录");
//					}
					
//					break;
//				} else {
//					if(i == inputs.length - 1)
//						alert("密码填充失败！未找到类型为password且含有占位符的输入框！");
//				}
//			}
		} catch (err) {
			alert('自动填表出错了！！！');
			console.log(err);
		}
	}
	/**
	 * 键盘输入
	 * 作用: 有些时候会遇到使用 document.getElementById().value="xxx"; 的时候,页面的输入框中显示有值,但提交按钮显示用户还未输入..这就需要下面函数了
	 */
	function keyboardInput(dom, st) {
		// 输入事件
		var evt = new InputEvent('input', {
		    inputType: 'insertText',
		    data: st,
		    dataTransfer: null,
		    isComposing: false
		});
		// 赋值
		dom.value = st;
		// 调度事件
		dom.dispatchEvent(evt);
	}
	//keyboardInput(document.getElementsByTagName("input")[0], "密码");
	
	// 打印密码框位置
	function printPasswordElement(){
		var inputs = document.getElementsByTagName('input');   
		for(var i = 0; i < inputs.length; i++) {    
			if(inputs[i].type.toUpperCase() == 'PASSWORD' && (inputs[i].placeholder != '' || inputs[i].name.toUpperCase().includes("PASSWORD") )) {
				console.log(i);
				console.log(inputs[i]);
			}
		}
	}
	//printPasswordElement();
})();