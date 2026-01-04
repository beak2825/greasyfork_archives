// ==UserScript==
// @name         解析脚本【站外】
// @namespace    coolhii_vip
// @version      1.1.0
// @description  脚本功能可独立开关，按需使用。
// @author       橘子爱哭，爱画画的猫
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAwCAYAAACxKzLDAAAAAXNSR0IArs4c6QAABSRJREFUaEPtWm9oG2UY/z2X2KmgaCdom7vksnUKCsMPA4lD6BCduG65dNoqWpGpQUEm/mU6ZBPEMf/r1Dp0wpzMrdPmYrfi9sUiOoV+ECcdTFdzyaVs/pkiKEiW3CNXk9m0d703WXL2Qw/y6X7P7/f83ue9e+993hAEr7B+4koJxc0AbgWwj5iGMgl5l2B4zTA1ld0MoisACjDjYDah7BAlIRHgpCEqDoBx1VQ8Ay9mNeVxEY5aMGra3A5GsjqGXjE0+RERHiFTqp5/GOCXnQl5CIVS0uiJnhQRnA2zWJ9QLFj9DKxywjFhbTauDHrpCJoyPwPQ6UrGPEpB6b7MavlbL0G3+xF94lqC1Q9g6SwcI4amrPDSEDOVzr8F5gdmJSPKga2koYUPeolOv6/quV6AbEMXzx7LbxtaePY8AAiZiqRz64hJ5EEtwLKSRndkp6ixqJ57jEEveOEJ9KcFWpnVQoe9sV6I8n01be4G43ZB+AZDU7Z6YVXdfA3Aei+cfd9+zrKaMiyCFapUhUjVzQ0AtogQA+5vq2j6p0uZC/Z0S4hwMaTlIhWqcDmaWpTOLSsxbiTQDS6iSwCEPBMifAjL+n46jklaRcAyz3jgCNhKzYiXAqPBUnB0vPuyn504qkypqYwKOmcTwHcLCM4FyFcg6XUjHtozNZkzpiKDZjdJ9BLA6lzItpYciLAjE1furZp+UT13HUM6APAFtZDNKSzhPSOu3GPnRO1Dxy5pKZ3/JYDL51SSdSRDhGQmrrxDNaxBdcj4H8IWXU+qnj8McMx/+eYoMmgjqbrJHvRHiPFuJqFsa04a3qwdw6cuLBb+ioE5BpKeBNDiFsWM/R6m+KShhdu8Zf1D2MsOUfAN1y954NdZTRFj/f9ZIbehWvRJvsuyeMjpPnuZAmOFkVBG/KuDuJLbYzNvymkMQ4P5hRPd8inx8W0csimVigwaMaLAs0Rk71SPgTidiSue+yInW9G0udRi9BG4D6A/mHAoyNLz41rIdBuGhpuKpM07iPHBTEHx5sjUWFXP7wT4rio+wpjFwZ6c1nbUyVhDTcmfmq3Bv/EdgHbHUSwU22ppwpRbb2POFXHfvjfUlJoyO0GwGzHOV4lixlr5a9Gn59/+nrTJBe/aaPHXVI3LwLypKeWcr1TV3HaYSvKAGQq2IO/6zNQ4/aKpfJKJtzvxEXAgoyldTX/72QKqnjsO0GIHsQlDU2TRl4SNC6ezyyWWvnA2Rc9lNHmjP6ZS5lYQnpguRuA3M1r4wVpMlXfevzjFMOOWbEL52BdT5WrtAai3IsjAtqymCDUmpydZXibsKfhfS4GtZ4xExD46crwa+qKYqqCmMhdJgcASWtCSHV/p3IMTrZrNBQQ6mQLtDGnE7Uuiwtc0U6IJNwM3b8rrld6MUa+Hc75S1aPGtxlaeG89I9nMmI7hvFwssONeS2A7z1uMRPipZiZYD7eqm9cAcNsJnPDq+x0KtgTvPH5zm+PiWE9CjYhRdXOg/NcHBzoes019A+BqVzHGb0zS0yJrRyMSduOwp1zpNGLMbP+Pw/65XZ+Tquf6Abq/mQn5y827SdUnegGr6tDK3yQarcY3UcfwDwuKp889CsaiRtP7z0dDhiavmTxJjKbyfUz8vv9JNFZRkmj1j2vk/WeOR9W0+RAYrzZWxj82IurJxOV9tuK0g+zJzo7df4v6l85ZK5lE9GjF0AxTFfrydFwHQisYCwG0AjjvrOUbRkAGMPlF8ZEVtHbluiK/T6X+B3vhrTTNoUfLAAAAAElFTkSuQmCC
// @include      *://wenku.baidu.com/*
// @include      *://*.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://v.qq.com/x/cover/*
// @include      *://v.qq.com/x/page/*
// @include      *://v.qq.com/tv/*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/v/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.baofeng.com/play/*
// @include      *://vip.pptv.com/show/*
// @include      *://v.pptv.com/show/*
// @include      *://www.le.com/ptv/vplay/*
// @include      *://www.wasu.cn/Play/show/*
// @include      *://m.v.qq.com/x/cover/*
// @include      *://m.v.qq.com/x/page/*
// @include      *://m.v.qq.com/*
// @include      *://m.iqiyi.com/v_*
// @include      *://m.iqiyi.com/w_*
// @include      *://m.iqiyi.com/a_*
// @include      *://m.youku.com/alipay_video/*
// @include      *://https://m.youku.com/video/id_*
// @include      *://m.mgtv.com/b/*
// @include      *://m.tv.sohu.com/v/*
// @include      *://m.film.sohu.com/album/*
// @include      *://m.le.com/ptv/vplay/*
// @include      *://m.pptv.com/show/*
// @include      *://m.acfun.cn/v/*
// @include      *://m.bilibili.com/video/*
// @include      *://m.bilibili.com/anime/*
// @include      *://m.bilibili.com/bangumi/play/*
// @include      *://m.wasu.cn/Play/show/*
// @include      *music.163.com*
// @include      *://y.qq.com*
// @include      *://www.kugou.com*
// @include      *://www.kuwo.cn*
// @include      *://www.lizhi.fm*
// @include      *://*.ximalaya.com*
// @include      *://music.migu.cn*
// @include      *://*.zhihu.com/*
// @include      *://v.vzuu.com/video/*
// @include      *://video.zhihu.com/video/*
// @include	   	 *://www.bilibili.com/**
// @include      *://search.bilibili.com/**
// @include      *://space.bilibili.com/**
// -----------------------
// @include      https://www.bookmarkearth.com/view/*
// @include      https://www.jianshu.com/go-wild?ac=2&url=*
// @include      https://link.csdn.net/?target=*
// @include      https://gitee.com/link?target=*
// -----------------------
// @connect      api.bilibili.com
// @connect      t.mimixiaoke.com
// @connect      t.jtm.pub
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_info
// @grant    	 GM_registerMenuCommand
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/454236-findandreplacedomtext-huahuacat/code/findAndReplaceDOMText-huahuacat.js?version=1112990
// @charset		 UTF-8
// @license      AGPL License
// @original-script https://greasyfork.org/zh-CN/scripts/418804
// @original-author 爱画画的猫
// @original-license AGPL License
// @original-changes 已经获得原作者的完全授权，在源码使用出也做了相应版权说明，特此申明
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/480997/%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%E3%80%90%E7%AB%99%E5%A4%96%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/480997/%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%E3%80%90%E7%AB%99%E5%A4%96%E3%80%91.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	
	/*
	*	在“爱画画的猫”脚本的基础之上，做的二次开发，涉及到功能裁剪和添加，完全满足开源协议
	*	脚本地址：https://greasyfork.org/zh-CN/scripts/418804
	*	作者：爱画画的猫，代码已经授权
	*/

	//共有方法，全局共享
	function commonFunction(){
		this.GMgetValue = function (name, value=null) {
			let storageValue = value;
			if (typeof GM_getValue === "function") {
				storageValue = GM_getValue(name, value);
			} else if(typeof GM.setValue === "function"){
				storageValue = GM.getValue(name, value);
			}else{
				var arr = window.localStorage.getItem(name);
				if(arr != null){
					storageValue = arr
				}
			}
			return storageValue;
		};
		this.GMsetValue = function(name, value){
			if (typeof GM_setValue === "function") {
				GM_setValue(name, value);
			} else if(typeof GM.setValue === "function"){
				GM.setValue(name, value);
			}else{
				window.localStorage.setItem(name, value)
			}
		};
		this.GMaddStyle = function(css){
			var myStyle = document.createElement('style');
			myStyle.textContent = css;
			var doc = document.head || document.documentElement;
			doc.appendChild(myStyle);
		};
		this.GMopenInTab = function(url, options={"active":true, "insert":true, "setParent":true}){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, options);
			} else {
				GM.openInTab(url, options);
			}
		};
		this.addScript = function(url){
			var s = document.createElement('script');
			s.setAttribute('src',url);
			document.body.appendChild(s);
		};
		this.randomNumber = function(){
			return Math.ceil(Math.random()*100000000);
		};
		this.request = function(mothed, url, param){   //网络请求
			return new Promise(function(resolve, reject){
				GM_xmlhttpRequest({
					url: url,
					method: mothed,
					data:param,
					onload: function(response) {
						var status = response.status;
						var playurl = "";
						if(status==200||status=='200'){
							var responseText = response.responseText;
							resolve({"result":"success", "data":responseText});
						}else{
							reject({"result":"error", "data":null});
						}
					}
				});
			})
		};
		this.addCommonHtmlCss = function(){
			var cssText = 
				`
				@keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-webkit-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-moz-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-o-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@-ms-keyframes fadeIn {
					0%    {opacity: 0}
					100%  {opacity: 1}
				}
				@keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-webkit-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-moz-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-o-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				@-ms-keyframes fadeOut {
					0%    {opacity: 1}
					100%  {opacity: 0}
				}
				.web-toast-kkli9{
					position: fixed;
					background: rgba(0, 0, 0, 0.7);
					color: #fff;
					font-size: 14px;
					line-height: 1;
					padding:10px;
					border-radius: 3px;
					left: 50%;
					transform: translateX(-50%);
					-webkit-transform: translateX(-50%);
					-moz-transform: translateX(-50%);
					-o-transform: translateX(-50%);
					-ms-transform: translateX(-50%);
					z-index: 999999999999999999999999999;
					white-space: nowrap;
				}
				.fadeOut{
					animation: fadeOut .5s;
				}
				.fadeIn{
					animation:fadeIn .5s;
				}
				`;
			this.GMaddStyle(cssText);
		};
		this.webToast = function(params) {	//小提示框
			var time = params.time;
			var background = params.background;
			var color = params.color;
			var position = params.position;  //center-top, center-bottom
			var defaultMarginValue = 50;
			
			if(time == undefined || time == ''){
				time = 1500;
			}
			
			var el = document.createElement("div");
			el.setAttribute("class", "web-toast-kkli9");
			el.innerHTML = params.message;
			//背景颜色
			if(background!=undefined && background!=''){
				el.style.backgroundColor=background;
			}
			//字体颜色
			if(color!=undefined && color!=''){
				el.style.color=color;
			}
			
			//显示位置
			if(position==undefined || position==''){
				position = "center-bottom";
			}
			
			//设置显示位置，当前有种两种形式
			if(position==="center-bottom"){
				el.style.bottom = defaultMarginValue+"px"; 
			}else{
				el.style.top = defaultMarginValue+"px"; 
			}
			el.style.zIndex=999999;
			
			document.body.appendChild(el);
			el.classList.add("fadeIn");
			setTimeout(function () {
				el.classList.remove("fadeIn");
				el.classList.add("fadeOut");
				/*监听动画结束，移除提示信息元素*/
				el.addEventListener("animationend", function () {
					document.body.removeChild(el);
				});
				el.addEventListener("webkitAnimationEnd", function () {
					document.body.removeChild(el);
				});
			}, time);
		};
		this.queryUrlParamter = function(text, tag) { //查询GET请求url中的参数
			if(text.indexOf("?")!=-1){ //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
				var textArray = text.split("?");
				text = "?"+textArray[textArray.length-1];
			}
			var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
			var a = text.substr(1).match(t);
			if (a != null){
				return a[2];
			}
			return "";
		};
		this.isPC = function(){
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		};
		this.getBilibiliBV=function(){
			var pathname = window.location.pathname;
			var bv = pathname.replace("/video/","").replace("/","");
			return bv;
		};
		this.getSystemOS=function(){
			var u = navigator.userAgent;
			if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
				return 'windows';
			} else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
				return 'macOS';
			} else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
				return 'ios';
			} else if (!!u.match(/android/i)) {
				return 'android';
			} else {
				return 'other';
			}
		};
		this.RPCDownloadFile = function(fileName, url, savePath="D:/", RPCURL="ws://localhost:16800/jsonrpc", RPCToken="") {		
			const self = this;
			if(!savePath){
				savePath = "D:/";
			}
			if(!RPCURL){
				RPCURL = "ws://localhost:16800/jsonrpc";
			}
			let options = { //下载配置文件
				"dir":savePath,
				"max-connection-per-server": "16",
				"header":["User-Agent:"+navigator.userAgent+"", "Cookie:"+document.cookie+"", "Referer:"+window.location.href+""]
			}
			if(!!fileName) {
				options.out = fileName;
			}
			let jsonRPC = {
				"jsonrpc": "2.0",
				"id": "huahuacat",
				"method": "aria2.addUri",
				"params": [[url], options],
			}
			if (!!RPCToken) {
				jsonRPC.params.unshift("token:" + RPCToken); // 必须要加在第一个
			}
			return new Promise(function(resolve, reject) {
				var webSocket = new WebSocket(RPCURL);
				webSocket.onerror = function(event) {
					console.log("webSocket.onerror", event);
					reject("Aria2连接错误，请打开Aria2和检查RPC设置！");
				}
				webSocket.onopen = function(){
					webSocket.send(JSON.stringify(jsonRPC));
				}
				webSocket.onmessage = function(event){
					let result = JSON.parse(event.data);
					switch (result.method) {
						case "aria2.onDownloadStart":
							resolve("Aria2 开始下载【"+fileName+"】");
							webSocket.close();
							break;
						case "aria2.onDownloadComplete":
							break;
						default:
							break;
					}
				}
			});
		};
		this.getElementObject = function(selector, delay=200){
			return new Promise((resolve,reject) =>{
				let totalDelay = 0;
				let elementInterval = setInterval(()=>{
					if(totalDelay >= 2500){
						reject(false);
						clearInterval(elementInterval);
					}
					let element = document.querySelector(selector);
					if(element){
						resolve(element);
						clearInterval(elementInterval);
					}else{
						totalDelay += delay;
					}
				}, delay);
			});
		};
	}
	
	//全局弹窗对象
	const popup = (function(){
	    class Popup {
	        constructor() {
	            this.mask = document.createElement('div')
	            this.setStyle(this.mask, {
	                "width": '100%',
	                "height": '100%',
	                "backgroundColor": 'rgba(0, 0, 0, .6)',
	                "position": 'fixed',
	                "left": "0px",
	                "top": "0px",
					"bottom":"0px",
					"right":"0px",
					"z-index":"99999"
	            })
	            // 创建中间显示内容的水平并垂直居中的div
	            this.content = document.createElement('div')
	            this.setStyle(this.content, {
	                "max-width": '400px',
					"width":"100%",
	                "max-height": '600px',
	                "backgroundColor": '#fff',
	                "boxShadow": '0 0 2px #999',
	                "position": 'absolute',
	                "left": '50%',
	                "top": '50%',
	                "transform": 'translate(-50%,-50%)',
	                "borderRadius": '3px'
	            })
	            // 将这个小div放在遮罩中
	            this.mask.appendChild(this.content)
	        }
	        middleBox(param) {
	            // 先清空中间小div的内容 - 防止调用多次，出现混乱
	            this.content.innerHTML = ''
	            let title = '默认标题内容';
	            // 检测参数类型
	            if({}.toString.call(param) === '[object String]') {
	                title = param
	            } else if({}.toString.call(param) === '[object Object]') {
	                title = param.title
	            }
	            // 将遮罩放在body中显示
	            document.body.appendChild(this.mask)
	            // 给中间的小div设置默认的排版
	            // 上面标题部分
	            this.title = document.createElement('div')
	            // 设置样式
	            this.setStyle(this.title, {
	                "width": '100%',
	                "height": '40px',
	                "lineHeight": '40px',
	                "boxSizing": 'border-box',
					"background-color":"#FF6600",
	                "color": '#FFF',
					"text-align": 'center',
					"font-weight":"700",
					"font-size":"16px"
					
	            })
	            // 设置默认标题内容
	            this.title.innerText = title
	            // 将标题部分放在中间div中
	            this.content.appendChild(this.title)
	            // 关闭按钮
	            this.closeBtn = document.createElement('div')
	            // 设置内容
	            this.closeBtn.innerText = '×'
	            // 设置样式
	            this.setStyle(this.closeBtn, {
	                "textDecoration": 'none',
	                "color": '#666',
	                "position": 'absolute',
	                "right": '10px',
	                "top": '0px',
	                "fontSize": '25px',
					"color": '#FFF',
					"display":"inline-block",
					"cursor":"pointer"
	            })
	            // 将关闭按钮放在中间小div中
	            this.title.appendChild(this.closeBtn)
				this.closeBtn.onclick = () => this.close()
	        }
	        // 弹出提示框
	        dialog(param) {
	            this.middleBox(param);
				this.dialogContent = document.createElement('div')
				this.setStyle(this.dialogContent,{
					"padding":"15px",
					"max-height":"400px"
				})
				this.dialogContent.innerHTML = param.content;
				this.content.appendChild(this.dialogContent)
				param.onContentReady(this);
	        }
	        close() {
	            document.body.removeChild(this.mask)
				window.location.reload();
	        }
	        setStyle(ele, styleObj) { // 设置样式的函数
	            for(let attr in styleObj){
	                ele.style[attr] = styleObj[attr]
	            }
	        }
	    }
	    let popup = null;
	    return (function() {
	        if(!popup) {
	            popup = new Popup()
	        }
	        return popup;
	    })()
	})();
	
	//解析接口配置
	//showType=1(仅PC), showType=2(仅mobile), showType=3(同时显示)
	const originalInterfaceList = [

	
                {"name":"虾米","url":"https://jx.xmflv.com/?url=","mobile":0},
                {"name":"综合/B站","url":"https://jx.jsonplayer.com/player/?url=","mobile":1},
                {"name":"剖元","url":"https://www.pouyun.com/?url=","mobile":1},
                {"name":"冰豆","url":"https://api.qianqi.net/vip/?url=","mobile":0},
                {"name":"夜幕","url":"https://www.yemu.xyz/?url=","mobile":0},


                
                {"name":"爱豆","url":"https://jx.aidouer.net/?url=","mobile":1},

               
 





	
	];
	
	//全局统一方法对象
	const commonFunctionObject = new commonFunction(); 
	commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加
	let newOriginalInterfaceList = originalInterfaceList; //统一接口
	
	//相关功能关闭控制
	let functionController= commonFunctionObject.GMgetValue("setingData");
	if(!functionController){
		functionController={
			"bilibiliHelper":true,
			"superVideoHelper":true,
			"superMusicHelper":true,
			"zhihuHelper":true,
			"fuckLink":true
		}
	}	
	//用户功能设置函数
	function usersSeting(){
		var bilibiliHelper=true, 
			superVideoHelper=true, 
			superMusicHelper=true,  
			zhihuHelper=true,
			fuckLink=true;
		var isUpdateStorage = false;
		if(!functionController.hasOwnProperty("bilibiliHelper")){
			functionController.bilibiliHelper = true;
			isUpdateStorage = true;
		}else{
			bilibiliHelper = functionController.bilibiliHelper;
		}
		if(!functionController.hasOwnProperty("superVideoHelper")){
			functionController.superVideoHelper = true;
			isUpdateStorage = true;
		}else{
			superVideoHelper = functionController.superVideoHelper;
		}
		if(!functionController.hasOwnProperty("superMusicHelper")){
			functionController.superMusicHelper = true;
			isUpdateStorage = true;
		}else{
			superMusicHelper = functionController.superMusicHelper;
		}
		if(!functionController.hasOwnProperty("zhihuHelper")){
			functionController.zhihuHelper = true;
			isUpdateStorage = true;
		}else{
			zhihuHelper = functionController.zhihuHelper;
		}
		if(!functionController.hasOwnProperty("fuckLink")){
			functionController.fuckLink = true;
			isUpdateStorage = true;
		}else{
			fuckLink = functionController.fuckLink;
		}
		if(isUpdateStorage){
			commonFunctionObject.GMsetValue("setingData",functionController);
		}
		var setingData=[
			{"tag":"bilibiliHelper", "name":"B站使用助手(视频下载可P、浏览记录、一件三联)", "checked":bilibiliHelper},
			{"tag":"zhihuHelper", "name":"知乎使用助手(内容标识、问答显示优化、视频下载等)", "checked":zhihuHelper},
			{"tag":"superVideoHelper", "name":"全网VIP视频解析(支持爱奇艺、腾讯视频、B站番剧等)", "checked":superVideoHelper},
			{"tag":"superMusicHelper", "name":"全网VIP音乐解析(支持网易云音乐、QQ音乐等)", "checked":superMusicHelper},
			{"tag":"fuckLink", "name":"Fuck链接中间跳转页，直接跳转", "checked":fuckLink}
		]
		var content = "";
		for(var i=0; i<setingData.length;i++){
			var one = setingData[i];
			content += `
				<div style="padding: 5px 0px;">
					<input style="display:inline-block;width: 15px;height: 15px;display: inline-block;vertical-align: middle; -webkit-appearance:checkbox;margin-bottom: 3px;cursor: pointer;" name="Checkbox" type="checkbox" data-tag="`+one.tag+`" `+(one.checked ? "checked" : "")+`>
					<label style="display:inline-block;font-size: 14px;margin:3px 0;vertical-align: middle;font-weight:500;color:#000;">`+one.name+`</label>
				</div>
			`
		}
		popup.dialog({
			"title":"功能开关",
			"content":content,
			"onContentReady":function($that){
				$that.dialogContent.querySelectorAll("input[type='checkbox']").forEach(function(checkbox){
					checkbox.addEventListener("click", function(e){
						var tag = e.target.getAttribute("data-tag");
						var checked = e.target.checked;
						functionController[tag] = checked;
						commonFunctionObject.GMsetValue("setingData",functionController);
						commonFunctionObject.webToast({"message":"操作成功", "background":"#FF6600"});
					});
				})
			}
		});
	}
	
	if(commonFunctionObject.isPC()){
		GM_registerMenuCommand("功能开关",()=>usersSeting());
	}else{
		functionController.bilibiliHelper = false;
		functionController.superMusicHelper = false;
		functionController.wangpanSearchEnginesHelper = false;
		functionController.searchEnginesNavigation = false;
		functionController.zhihuHelper = false;
	}

	/**
	 * 超级解析助手功能
	 * 
	 * 原代码作者：小艾特
	 * 脚本地址：https://greasyfork.org/zh-CN/scripts/407847
	 * 视频解析接口来自，作者：懒哈哈
	 * 脚本地址：https://greasyfork.org/zh-CN/scripts/370634
	 * 遵循AGPL License开源协议
	 */
	function superVideoHelper(originalInterfaceList){
		this.originalInterfaceList = originalInterfaceList;
		this.elementId = Math.ceil(Math.random()*100000000)+"7899";
		this.customInterfaceKey = "custom_interface_key_dddsdxxa";
		this.quicklyInterfaceKey = "custom_quickly_interface_key_dddsdxxa";
		this.defaultQuicklyInterfaceIndex = 1;
		this.isRun = function(){ //判断是否运行
			const host = window.location.host;
			const urls = ["www.iqiyi.com","v.qq.com","youku.com", "www.le.com","mgtv.com","sohu.com", "acfun.cn","bilibili.com","baofeng.com","pptv.com","1905.com","miguvideo.com"];
			var result = false;
			if(!host.startsWith("m.")){ //不是移动端执行
				for(var i=0; i<urls.length;i++){ //不是B站直接判断
					if(window.location.host.indexOf("bilibili.com")==-1){
						if(window.location.host.indexOf(urls[i])!=-1){
							result = true;
							break;
						}
					}else{
						if(window.location.href.indexOf("www.bilibili.com/bangumi/play")!=-1){ //是B站只有番剧才开启VIP解析
							result = true;
							break;
						}
					}
				}
			}
			return result;
		};
		this.showPlayerWindow = function(playObject){	//显示播放窗口
			var url = playObject.url + window.location.href;
			commonFunctionObject.GMopenInTab(url, false);
		};
		this.analysisCustomInterface = function(){ //自定义接口解析
			var customInterface = commonFunctionObject.GMgetValue(this.customInterfaceKey,"");
			if(!!customInterface){
				try{
					var customizeInterfaceList = new Array();
					var analysisArray = customInterface.split("\n");
					for(var i=0;i<analysisArray.length;i++){
						var onePiece = analysisArray[i];
						if(!!onePiece && onePiece.indexOf(",")!=-1){
							var onePieceArray = onePiece.split(","); 
							
							if(onePieceArray.length==2 && !!onePieceArray[0] && /(http|https):\/\/\S*/.test(onePieceArray[1])){
								customizeInterfaceList.push({"name":""+onePieceArray[0]+"","url":""+onePieceArray[1]+"", "showType":1});
							}
						}
					}
					this.originalInterfaceList = customizeInterfaceList.concat(this.originalInterfaceList);
				}catch(e){}
			}
		};
		this.getQuicklyInterfaceIndex = function(){
			var quicklyInterfaceIndexString = commonFunctionObject.GMgetValue(this.quicklyInterfaceKey,"")+"";
			var quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
			if(!!quicklyInterfaceIndexString){
				quicklyInterfaceIndex = parseInt(quicklyInterfaceIndexString);
			}
			if(this.originalInterfaceList.length-1<quicklyInterfaceIndex){
				quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
			}
			return quicklyInterfaceIndex;
		};
		this.addHtmlElements = function(){  //添加HTML
			const vipVideoImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAABgCAYAAABbjPFwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAaFSURBVHhe7ZwLbBVFFIb/W0AEDFTeLYK0VBKgUh6KFDEgtvJWQYMGRSEKmKoRIQoCRnyAYhREFC1orBowiiKmhooUJVJFBOSRAAEUKE95tRUCigL1HOYslIa9O3d39u69Sb9kszNnb5v5Z2fOnHncG4JQnoOmOIPHKdmXrnZ01WR7DFGCEArpviCUi6+VCWQiykdSoUNYQMlEzscBP9A1PDQXexLO13x8FZ65la45nEiQZhNPhbfoXz4aAxMowW0+PinHUBbAHTZeyWIBseZtIqEhC4hrYlvAlXUlYU9sCmiTBQybB2SPFYM9sSOgcRr5w4nAcxuBMcuA7o/Ig/AEK6A6+Y8uQ4GcxcBLO4C7pgLXtJeHegQjIO1mYMibwLTdwMPzgYw75UHkRE9A/RbAbWOA8T8DTxdR+kmgXlN56B5/BYQoVux0t6rlqTup1mcCqZny0Az+CGjZBRj0imrXo79Q7Tyhmjw0izkB9ZKAHjnKgzy7GugzAWjUSh76R6h8FIVEXmg/EOg4SDUVjYHHkXNngELq4MupuZUdEKM97gQ07wB0oEJzwZtdL0aPbF+hCr7xwmRLi8gEtB8A3DJK1boJTp9UNb1kGvDf32KMDD0BSW2Bwa+aK/jmpcC39P+41j2iJ2DCL0DKTZJxycljwNLX1GUQPS9Ut4kkXLB+EfBiBjC2ofHCM3oCVn0kCU3K9gOfjKQxgAay98g77d8kD8yjJyB/ConIk4wGO1YCv9MVBfQHsrwR5ObIY+hw433ApN+A3s+IwT+qTekMql5NtpD34PgmrTvdHbRXq0ETk2yg7e1AyV7gKMVCPuBuIGvVDeg3CUjvJwYNVrwDfEUTln+Oi8EM7gRYcEjMQq5qJAYHSvep/vTTB2LwjjcBTFIbJaLL/WLQYFM+sIiCvYNbxOAe7wIsMh8kIZNpbnudGDTgt/HNC5JxhzkBTL1kEkHtvOdjYtBgH03ivxyvHIQLzAqwyLhDNSue2OhSRP1i4diIO7k/Apgr6gB9qZ1zs9LlZAm9DRo7Iujk/gmwaN1DrffweKALR6v8NjQ6uf8CLLLHqWZV+2oxaMAdnDt6GPRDCa8sewOY0QtY+5kYzBA9AczeDcA8ipM4UjUUWkRXgEXR+8DMLODHXDG4JxgBzNFdwPxHgblDgD0UubokOAEW6xaqt+FytqYnYMDzwA1UU83Syb/XEqNBTpVSbESj8azewDbeAtZHz40OJFfGIipyaJvy0we3qvsR6pSlFPdzxOkFnmfwqh5f7LkcYiU9AVx4FqELexhLGLd1ntCU7lF3rm0dUigM4fmGwzjg/g24hd8Sizu2+1JhJXI/+698UI/oCwjH8UMkoviiIA4nHAjeC1WE1584guWF4qynxBie2BLgAn0Bqz5W6z1evYxh3EWjTVoDDVOABnTx/cKVCtSpLx8yAK/sOeBOQDh4M49Xs3myz4IqCqwR4SAYiIBwcCdlYU1FIF+8DdWgpXygEsYEtOikJt/nzorBB2olXhRlvcHZ/eWhPZGNAzzI7FwN7KKreI0KH478oT+6+kBkAuxgz8SiDm+/KIrDiWM0KPmMGQF2HCJBaz61j2da9/S8zeTvQMbu1okRNL542AQPfiTuOkztJTTvKIbIiI1Qgo/YTCYRmQ+JQZ/YioWG5wH3vC4ZPfQEfD8bmJ4JfEg1tORlYO3nwN71aqPaNLwANuY7+8GtEt5G4sRkoDF11HFh5rHhVtfYC9n9Lc8NeP2I9xLC4K0JaRzGcA2HHdd2low9sdUHXFAlIGiqBARNlYCgqRIQNFUCgsa7gBOHJREM3gUEvNToXQCfbeDtUzva9ZHEZahZWxLuMdMHeKPODj5v2usJyVQiksMgNpgR4HRU5t63gMHTL51lGdo08TYjq8gDuepctRPWOhDPxpx4dxCwYbFkLo+ZN8CsnCsJB7jgOoU/VQZsXSYZe8wJKF6nL0KHXxdoLRqYE8AsnwUc2CwZD5w4AhTOkEx4zArgfWE+++BVxOKJaoFYA7MCGEtEONcaDl6G4dMsmpjzQpej2wj1lUI+6esEe6d8KnyEq9X+CrDg79qk9wdSuwLJlb5/bXV+lw4gOgIqwht9fDi2eg21MPbXQXngjugLMIz5ThxlWMBplYxLTrMAAyNPYGxmAQUqHZcUhORHYbZSJt5+3aMM1dEmITQHf5IfGnreED+UcZm57BcOI8TBz/Ows+H+WkA1//b5igfwP4DBAodXyDR7AAAAAElFTkSuQmCC";
			const quicklyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAv1JREFUWEfFl02IVWUYx39/EDdKoCiCGYquxNw404QL+wA/wIUfA5luMotk0jGoiDQFv1oMqCCOFkYQtopczKxMGsUUF2bNKsWFKBroJtLI2qjwl+dy7uV47jnnnntnygcOF97nfd7/777nfZ7nPeIZm8Zb3/ZsYBEwE5gFzAGmAX8lz9/AA0l7QnvcAGwvBd4E1gOTK/yxvQExZgDbbwHvAq9UEE1POSzpwzEB2D4KbG1TuD79G0nvdAxg+2egp0PxCBuS1NsRgG2PQbgeelbS0rYBbJ8DXisAuAdcB2Ykp7+M8ztJGyoD2H4J+AxYU7DqoKQP6j7b24AjJQQDknaUAtieDvQmz/KSxUYkNfltx07FjuVZv6RjhQC21wIHgHkV3vc2SZERTWb7d+CFHFevpKFcANvvA19UEK5PWSnphwKAS8DLGd8/wIuSbjcB2I4SubsN8Zj6iaSDBQB/AlMzvq8lvRdjTwEk5XSkTfHadEl5fyYOYRzGrC2TdOYpANvdwC+diKditgNXkxRcBSzLWe+CpFfr4w1q21eABZmAx8DFkrzvhHejpG/zAPqSbhaCtUfSv7YHgE87UcqJOSapPz1eqRDZ/h54Y4wQlyVls6H6fcD2r0BXpxB5h7QpC1otbjtq/ZRW8zL+nyS9XhTTqhR3SRpNB9u+k1y3qnAMS4qKWmhFlXAlsC/Z8lvAifodLlayPQysrkDQI6k0tfOKx0TgGjA3I7BO0sn6mO1DwEclED9KWtEKMg/gOLA5J/CupOczryN2aUlBneiTFGuVWrYUR6pFyhVZd86ZeARMyATcABZL+qMygO043eeBhQVBo5KiXDfM9iQgOlvWaq22lXj406X4c2BnQdDNaCqSTmUA4h2fzsRskfRlFfEGgO35QPTt53ICv0rEH2Z9tvcDu1LjtY+NquJpgLh8xCUkbb8B+9MnPwcgfUFttNhOANILxbfbIHBI0v2yxWx/DGwC3pYUpbptq52B5BYUPTryP2638fu/WKVu+F+SPAG7l/wh4NsJOQAAAABJRU5ErkJggg==";
			const currentHost = window.location.host;
			
			const quicklyInterfaceIndex = this.getQuicklyInterfaceIndex();
			var currentQuicklyInterfaceObject = null;
			
			var category_1_html = "";
			this.originalInterfaceList.forEach((item, index) => {
				if(item.showType != 2){
					var selected = ""
					if(index==quicklyInterfaceIndex){
						selected = "selected";
						currentQuicklyInterfaceObject =  item;
					}
					category_1_html += "<span title='"+item.name+"' data-index='"+index+"' class='"+selected+"'>" + item.name + "</span>";
				}
			});
			
			//获得自定义位置
			var left = 0;
			var top = 120;
			var Position = commonFunctionObject.GMgetValue("Position_" + currentHost);
			if(!!Position){
				left = Position.left;
				top = Position.top;
			}
			var color = "#FF6600";
			var hoverColor = "#000000";
			var cssMould = `#vip_movie_box`+this.elementId+`{cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:99999999; font-size:16px; text-align:left;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`{width:24px;text-align:center;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`>img {width:100%; display:inline-block; vertical-align:middle;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`:nth-child(2){
								background-color:#FF6600;
								border-radius:4px;
								margin-top:3px;
							}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`:nth-child(2)>img{
								width:22px!important;
							}
							
							#vip_movie_box`+this.elementId+` .showhide_box`+this.elementId+`{display:none;padding-left:5px;position: absolute;left: 24px;top: 0;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii{width:380px; max-height:400px; overflow-y:auto;background-color:rgba(241,241,241);}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
							
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+`{margin-bottom:10px;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+`:last-child{margin-bottom:0px;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.title`+this.elementId+`{font-size:14px; text-align:left;color:#000000;font-weight:600;margin:5px 3px;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`{}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`>span{border-radius:3px;border-top:3px solid `+color+`; border-bottom:3px solid `+color+`;display:inline-block;width:calc(25% - 6px);width:-moz-calc(25% - 6px);width: -webkit-calc(25% - 6px);height:20px;line-height:20px;background-color:`+color+`;color:#FFF;cursor:pointer;margin:3px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;font-size:12px!important;}							
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`>span:hover{border-top:3px solid `+hoverColor+`; border-bottom:3px solid `+hoverColor+`;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.interface_box`+this.elementId+`>span.selected{border-top:3px solid `+hoverColor+`; border-bottom:3px solid `+hoverColor+`;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action_687ii> .item_box`+this.elementId+` >.content`+this.elementId+`{font-size:12px;color:#000000;margin-left:3px;}
							`
			commonFunctionObject.GMaddStyle(cssMould);
			
			//加入HTML
			var htmlMould = `<div id='vip_movie_box`+this.elementId+`'>
								<div class='plugin_inner_`+this.elementId+`'>
									<div class="img_box`+this.elementId+`" id="img_box_jump_6667897iio"><img src='`+ vipVideoImageBase64 +`' title='选择解析线路'/></div>
									<div class='showhide_box`+this.elementId+`'>									
										<div class='vip_mod_box_action_687ii default-scrollbar-55678'>
											<div class='item_box`+this.elementId+`'>
												<div class='title`+this.elementId+`'><b>接口添加</b></div>
												<div class='content`+this.elementId+`'>
													对现有接口不满意？可添加自定义接口哟~<span id="img_set_6667897iio" style="display:inline-block;border-radius:2px;margin-left:5px;padding:3px 5px;background-color:#CCC;cursor:pointer;">添加接口</span>
												</div>
												<div class='title`+this.elementId+`'>接口请自行添加~</div>
											</div>
											<div class='item_box`+this.elementId+`'>
												<div class='interface_box`+this.elementId+`'>
													` + category_1_html + `
												</div>
											</div>
											<div class='item_box`+this.elementId+`'>
												<div class='title`+this.elementId+`'><b>免责声明：</b></div>
												<div class='content`+this.elementId+`'>
													

1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者，脚本不承担相关责任！"<br>
													
2、为创造良好的创作氛围，请大家支持正版！<br>
													
3、脚本仅限个人学习交流，使用即已代表您已经充分了解相关问题，否则后果自负，特此声明！<br>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="img_box`+this.elementId+`" id="img_quickly_6667897iio"><img src='`+quicklyBase64+`' title='快速开始(当前所选接口：`+(currentQuicklyInterfaceObject==null ? '' : currentQuicklyInterfaceObject.name)+`)'/></div>
							</div>
							`;
			$("body").append(htmlMould);
		};
		this.runEvent = function(){	 //事件运行
			var that = this;
			$("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId).on("mouseover", () => {
				$(".showhide_box"+this.elementId).show();
			});
			$("#vip_movie_box"+this.elementId+" >.plugin_inner_"+this.elementId).on("mouseout", () => {
				$(".showhide_box"+this.elementId).hide();
			});
			$("body").on("click","#vip_movie_box"+this.elementId+" .vip_mod_box_action_687ii>.item_box"+this.elementId+">.interface_box"+this.elementId+">span",function(){
				var index = parseInt($(this).attr("data-index"));
				var playObject = that.originalInterfaceList[index];
				that.showPlayerWindow(playObject);
				
				$("#vip_movie_box"+that.elementId+" .vip_mod_box_action_687ii> .item_box"+that.elementId+">.interface_box"+that.elementId+">span").removeClass("selected");
				$(this).addClass("selected");
				commonFunctionObject.GMsetValue(that.quicklyInterfaceKey, index);
				
				$("#img_quickly_6667897iio").find("img").attr("title","快速开始(当前所选接口："+playObject.name+")");
			});
						
			//点击视频播放界面
			$("#img_box_jump_6667897iio").on("click", function(){
				commonFunctionObject.GMopenInTab("https://laisoyiba.com/mov/s/?sv=3&url="+window.location.href, false);
			});
			
			//点击弹出设置框
			$("#img_set_6667897iio").on("click", function(){
				that.showSetingDialog();
			});
			
			$("#img_quickly_6667897iio").on("click", function(){
				const quicklyInterfaceIndex = that.getQuicklyInterfaceIndex();
				var playObject = that.originalInterfaceList[quicklyInterfaceIndex];
				that.showPlayerWindow(playObject);
			});
			
			//右键移动位置
			var movie_box = $("#vip_movie_box"+this.elementId);
			movie_box.mousedown(function(e) {
				if (e.which == 3) {
					e.preventDefault()
					movie_box.css("cursor", "move");
					var positionDiv = $(this).offset();
					var distenceX = e.pageX - positionDiv.left;
					var distenceY = e.pageY - positionDiv.top;
					
					$(document).mousemove(function(e) {
						var x = e.pageX - distenceX;
						var y = e.pageY - distenceY;
						var windowWidth = $(window).width();
						var windowHeight = $(window).height();
						
						if (x < 0) {
							x = 0;
						} else if (x >  windowWidth- movie_box.outerWidth(true) - 100) {
							x = windowWidth - movie_box.outerWidth(true) - 100;
						}
						
						if (y < 0) {
							y = 0;
						} else if (y > windowHeight - movie_box.outerHeight(true)) {
							y = windowHeight - movie_box.outerHeight(true);
						}
						movie_box.css("left", x);
						movie_box.css("top", y);
						commonFunctionObject.GMsetValue("Position_" + window.location.host,{ "left":x, "top":y});
					});
					$(document).mouseup(function() {
						$(document).off('mousemove');
						movie_box.css("cursor", "pointer");
					});
					$(document).contextmenu(function(e) {
						e.preventDefault();
					})
				}
			});
		};
		this.removeVideoAdBlock_iqiyi = function(){
			
		},
		this.removeVideoAdBlock_vqq = function(){

		},
		this.removeVideoAdBlock_youku = function(){
			
		},
		this.removeVideoAdBlock_mgtv = function(){
			
		},
		this.removeVideoAdBlock_sohu = function(){
			
		},
		this.removeVideoAdBlock = function(){
			const currentHost = window.location.host;
			if(currentHost.indexOf("www.iqiyi.com")!=-1){
				this.removeVideoAdBlock_iqiyi();
			}else if(currentHost.indexOf("v.qq.com")!=-1){
				this.removeVideoAdBlock_vqq();
			}else if(currentHost.indexOf("v.youku.com")!=-1){
				this.removeVideoAdBlock_youku();
			}else if(currentHost.indexOf("www.mgtv.com")!=-1){
				this.removeVideoAdBlock_mgtv();
			}else if(currentHost.indexOf("tv.sohu.com")!=-1){
				this.removeVideoAdBlock_sohu();
			}
		};
		this.showSetingDialog = function(){
			const that = this;
			var customInterfaceKey = that.customInterfaceKey;
			var customInterface = commonFunctionObject.GMgetValue(customInterfaceKey, "");
			
			var content = `
				<div>
					<div style="font-size:14px;font-weight:700;color:#000;">自定义解析接口</div>
					<div style="font-size:13px;color:red;">	

                                              数据格式：[名字] + [,] + [接口地址]<br>
						例如：就是名字而已,https://xxxxx.com/jx/?url=<br>
						注：一行一个 
  纯净1, https://im1907.top/?jx=<br>
				
						
					</div>
					<div style="margin-top:5px;height:200px;width:100%;">
						<textarea 
							placeholder="请严格按照格式填写，否则不生效"
							class="custom-interface-textarea"
							style="font-size:14px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;padding:5px;height:100%;width:100%;Overflow:auto;border:1px solid #ccc;resize:none;background-color:#FFF;outline:none;">`+customInterface+`</textarea>
					</div>
					<div style="text-align:center;margin-top:15px;">
						<button class="save-custom-interface-btn">保存自定义接口</button>
					</div>
				</div>
			`;
			popup.dialog({
				"title":"解析接口添加",
				"content":content,
				"onContentReady":function($that){
					var $saveCustomInterfaceBtn = $that.dialogContent.querySelector(".save-custom-interface-btn");
					$saveCustomInterfaceBtn.addEventListener("click", function(){
						var $customInterfaceTextarea = $that.dialogContent.querySelector(".custom-interface-textarea");
						var content = $customInterfaceTextarea.value;
						commonFunctionObject.GMsetValue(customInterfaceKey, content);
						commonFunctionObject.webToast({"message":"自定义接口保存成功", "background":"#FF6600"});
					});
				}
			})
		}
		this.start = function(){			
			let delayTimeMs = 0;
			if(window.location.host.indexOf("www.bilibili.com")!=-1){
				delayTimeMs = 2200;
			}
			setTimeout(()=>{
				try{
					this.removeVideoAdBlock();
				}catch(e){}
				try{
					this.analysisCustomInterface();
					this.addHtmlElements();
					this.runEvent();
				}catch(e){}
			}, delayTimeMs);
		};
	};
	
	/**
	 * 移动端VIP解析
	 * @param {Object} originalInterfaceList
	 */
	function superVideoHelperMobile(originalInterfaceList){
		this.originalInterfaceList = originalInterfaceList;
		this.elementId = Math.ceil(Math.random()*100000000)+"mmx";
		this.quicklyInterfaceKey = "custom_mobile_quickly_interface_key_dddsdxxa";
		this.defaultQuicklyInterfaceIndex = 2;
		this.playerNodes=[
			{"url":"m.iqiyi.com", "showNode":".m-video-player-wrap", "color":"#05B03B"},
			{"url":"m.v.qq.com", "showNode":".mod_player", "color":"#F99D39"},
			{"url":"m.youku.com", "showNode":".h5-detail-player", "color":"#08BAFD"},
			{"url":"m.mgtv.com", "showNode":".video-area", "color":"#E95904"}
		];
		this.isRun = function(){ //判断是否运行
			const host = window.location.host;
			const urls = ["m.iqiyi.com","m.v.qq.com","m.youku.com", "m.mgtv.com", "m.bilibili.com"];
			var result = false;
			if(host.startsWith("m.")){ //是移动端执行
				for(var i=0; i<urls.length; i++){
					if(host.indexOf(urls[i]) != -1){
						result = true;
						break;
					}
				}
			}
			return result;
		};
		this.getwindowElement = function(){
			var nodeObject = null;
			for(var i in this.playerNodes) { //获得窗口ID
				if (this.playerNodes[i].url == window.location.host) {
					nodeObject = this.playerNodes[i];
					break;
				}
			}
			return nodeObject;
		};
		this.getQuicklyInterfaceIndex = function(){
			var quicklyInterfaceIndexString = commonFunctionObject.GMgetValue(this.quicklyInterfaceKey,"")+"";
			var quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
			if(!!quicklyInterfaceIndexString){
				quicklyInterfaceIndex = parseInt(quicklyInterfaceIndexString);
			}
			if(this.originalInterfaceList.length-1<quicklyInterfaceIndex){
				quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
			}
			return quicklyInterfaceIndex;
		};
		this.addHtmlElements = function(){
			let nodeObject = this.getwindowElement();
			const quicklyInterfaceIndex = this.getQuicklyInterfaceIndex();
			if(!nodeObject) return;
			return new Promise((resolve, reject)=>{
				const elementInterval = setInterval(()=>{
					const nodeElementObject = $(nodeObject.showNode), themeColor = nodeObject.color;
					
					if(nodeElementObject.length == 0) return;
					clearInterval(elementInterval);
										
					//添加HTML
					let category_1_html = "";
					this.originalInterfaceList.forEach((item, index) => {
						if (item.showType != 1) {
							var selected = "";
							if(index==quicklyInterfaceIndex){
								selected = "selected";
							}
							category_1_html += "<option value='"+item.url+"' index='"+index+"' "+selected+">"+item.name+"</option>";
						}
					});
					var htmlMould = `
						<div style="margin:15px 15px 50px 15px;padding:10px;background-color:`+themeColor+`;border-radius:4px;cursor:pointer;z-index: 999999999999999999999;color:#FFF;">
								<div style="font-weight:700;font-size:14px;text-align:center;">
									<span>选择解析接口</span>
									<select id="interface_selection_`+this.elementId+`" style="background-color:#FFF;padding: 0px 10px;">
										`+category_1_html+`
									</select>
								</div>
								<div style="text-align:center;">
									<a href="javascript:void(0);" id="start_analysis_outer_`+this.elementId+`" style="box-sizing:border-box;margin:10px 0px;display:inline-block;padding:10px 0px;width:100%;border-radius:4px;color:#FFF;background-color:#F2503F;font-size:14px;">站外解析</a>
								</div>
								<div style="text-align:left;font-size:10px;">
									<div>
										
   <b>免责申明：

   <br>&nbsp;&nbsp;1、VIP视频解析中所用到的解析接口全部收集自互联网！
										
   <br>&nbsp;&nbsp;2、为创造良好的创作氛围，请大家支持正版！
										
   <br>&nbsp;&nbsp;3、脚本仅限个人学习交流，切勿用于任何商业等其它用途！
										
   <br>&nbsp;&nbsp;4、继续使用，即表明且愿意自行承担相关风险！

   <br>&nbsp;&nbsp;5、请忽相信视频中的广告！

									</div>
								</div>
						</div>
					`;
					nodeElementObject.after(htmlMould);
					resolve("ok");
				}, 100);
			});
		};
		this.getPlayObjectBySelect = function(){
			
			var indexString = $("#interface_selection_"+this.elementId).find("option:selected").attr("index");
			var index = 0;
			if(!!indexString){
				index = parseInt(indexString);
			}
			return this.originalInterfaceList[index];
		};
		this.runEvent = function(){	 //事件运行
			const self = this;

			//初始化
			var playObject = self.getPlayObjectBySelect();
			$('#start_analysis_outer_'+self.elementId).attr("href", playObject.url + window.location.href);
			$('#start_analysis_outer_'+self.elementId).on('click', function (e) {
				if(commonFunctionObject.GMgetValue("copyright_video_remind_mobile_outer",null)==="true"){
					
				}else{
					var r=confirm(
						"脚本运行提醒！！！\u000d"+
						"使用站外解析功能，视频解析时脚本跳出本页面，如不同意此脚本行为，请点击【取消】按钮！！"
					);
					if(r==false){
						e.preventDefault();
					}else{
						commonFunctionObject.GMsetValue("copyright_video_remind_mobile_outer","true");
					}
				}
			});
			//接口切换
			$('#interface_selection_'+self.elementId).on('change', function () {
				var $option = $(this).find("option:selected");
				var value = $option.val();
				var index = parseInt($option.attr("index"));
				$('#start_analysis_outer_'+self.elementId).attr("href", value+window.location.href);
				commonFunctionObject.GMsetValue(self.quicklyInterfaceKey, index);
			});
		};
		this.start = function(){
			const self = this;
			if(this.isRun()){
				this.addHtmlElements().then(()=>{
					self.runEvent();
				});
			}
		}
	}
	
	
	
	
	

	
	//最后统一调用
	try{
		if(functionController.superVideoHelper){
			const superVideoHelperObject = new superVideoHelper(newOriginalInterfaceList);
			if(superVideoHelperObject.isRun()){
				if(commonFunctionObject.GMgetValue("copyright_video_remind",null)==="true"){
					superVideoHelperObject.start();
				}else{
					var r=confirm(
						"脚本运行提醒！！！\u000d"+
						"1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者！\u000d"+
						"2、为创造良好的创作氛围，请大家支持正版！\u000d"+
						"3、脚本仅限个人学习交流，切勿用于任何商业等其它用途！\u000d"+
						"4、继续使用，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险脚本不承担任何责任！\u000d"+
						"5、此提醒只弹出一次，确认后，后续将不在弹出，请知悉！"
					);
					if(r==true){
						commonFunctionObject.GMsetValue("copyright_video_remind","true");
						superVideoHelperObject.start();
					}
				}
			}
			
			(new superVideoHelperMobile(newOriginalInterfaceList)).start();
		}
	}catch(e){
		console.log("全网VIP解析：error："+e);
	}
	
	try{
		if(functionController.superMusicHelper){
			(new superMusicHelper()).start();
		}
	}catch(e){
		console.log("全网音乐下载：error："+e);
	}
	
	try{
		if(functionController.bilibiliHelper){
			new bilibiliHelper(commonFunctionObject).start();
		}
	}catch(e){
		console.log("B站视频下载：error："+e);
	}
	
	try{
		if(functionController.zhihuHelper){
			new zhihuHelper(commonFunctionObject).start();
		}
	}catch(e){
		console.log("知乎助手：error："+e);
	}
	
	try{
		if(functionController.fuckLink){
			new fuckLink().start();
		}
	}catch(e){
		console.log("fuck跳转中间页：error："+e);
	}
})();