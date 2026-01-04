// ==UserScript==
// @name         FlyChat
// @namespace    com.wxchina.apaas.flychat
// @version      V0.0.1
// @description  基于玄武云aPaaS开发平台，制作了一个插件，用于知识库等功能的连接。没有对原功能做任何的插入或者删除，保持了原装服务。
// @author       钟冠辉
// @match        http://ide.wxchina.com:9000/
// @icon         http://ide.wxchina.com:9000/favicon.ico
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/485203/FlyChat.user.js
// @updateURL https://update.greasyfork.org/scripts/485203/FlyChat.meta.js
// ==/UserScript==

(function() {
    'use strict';
//监听消息
	window.addEventListener("message", function(event) {
	    try{
	    	let param = event.data;
	    	if (param.action == 'getToken'){
	    		//获取当前token
	    		let userToken = sessionStorage.getItem("userToken");
	    		console.log("钟冠辉",userToken);
	    		if (userToken){
	    			event.source.postMessage({'action':'receiveToken','data':userToken},event.origin);
	    		}
	    	}else if (param.action =='getCode'){
	    		//获取当前代码
	    		let code = getCurrentCode();
	    		event.source.postMessage({'action':'receiveCode','data':code},event.origin);
	    	}
	    }catch(e){
	    	console.log(e);
	    }
	}, false);
    setTimeout(function(){
		startCheck();
	},1000);
	function startCheck(){
		let envidiv = document.getElementsByClassName("envi-style")[0];//租户信息栏
		if (envidiv ==undefined){
			setTimeout(function(){
				startCheck();
			},500);
			return ;
		}
		let chatdiv = document.getElementById('chat_icon_div');
		if (chatdiv == undefined){
			startinit();
		}
	}
	function startinit(){
		let envidiv = document.getElementsByClassName("envi-style")[0];//租户信息栏
		let contentdiv = document.getElementsByClassName("content")[0];//内容Div
		let chatdiv = document.createElement('div');//创建一个chat按钮
		chatdiv.id ='chat_icon_div';
		chatdiv.style.boxSizing='content-box';
		chatdiv.style.right='300px';
		chatdiv.style.top='4px';
		chatdiv.style.maxWidth='400px';
		chatdiv.style.whtieSpace='nowrap';
		chatdiv.style.textOverflow='ellipsis';
		chatdiv.style.overflow='hidden';
		chatdiv.style.zIndex=1;
		chatdiv.style.cursor='pointer';
		chatdiv.style.padding='2px 12px';
		chatdiv.style.borderRadius='13px'
		chatdiv.style.color = 'red';
		chatdiv.style.position='absolute';
		contentdiv.appendChild(chatdiv);
		let img = document.createElement('img');
		img.src="data:image/png;base64,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";
		chatdiv.appendChild(img);
		chatdiv.addEventListener("click", function() {
		        let chatContentDiv = document.getElementById('fly_assister_content_div');
		        if (chatContentDiv ==null){
		        	createChatContent();
		        }else{
		        	if (chatContentDiv.style.display == 'none'){
		        		chatContentDiv.style.display='';
		        	}else{
		        		chatContentDiv.style.display='none';
		        	}
		        }
		});
	}
	function  createChatContent(){
		let container = document.getElementsByClassName("app-container")[0];
		let chatcontentdiv  = document.createElement('div');
		chatcontentdiv.id ='fly_assister_content_div';
		chatcontentdiv.innerHTML='聊天界面';
		chatcontentdiv.style.width='400px';
		container.appendChild(chatcontentdiv);
		let headerdiv = document.createElement('div');
		headerdiv.style.width='95%';
		headerdiv.style.height='30px';

		chatcontentdiv.appendChild(headerdiv);
		let iframe = document.createElement('iframe');
		// 设置 iframe 的属性
		iframe.src = 'http://8.134.251.86:8103/index.html'; // 你要嵌入的页面 URL
		iframe.width = '95%'; // iframe 的宽度
		iframe.height = '90%'; // iframe 的高度
		iframe.frameBorder = '0'; // 去除边框
		chatcontentdiv.appendChild(iframe)
		iframe.height = chatcontentdiv.clientHeight - headerdiv.clientHeight -30;
	}

	function getCurrentCode(){
		let contentDiv = document.querySelector("div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text");
		let codeStr = '';
		for(let i=0;i<contentDiv.children.length;i++){
			codeStr = codeStr + contentDiv.children[i].textContent +'\r\n';
		}
		return codeStr;
	}


})();