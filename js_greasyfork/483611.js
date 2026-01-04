// ==UserScript==
// @name              小破站・哔哩哔哩超级助手, 视频下载（单P和批量）, 自动签到领瓜子辣条等，===大家都说好系列😈
// @name:zh           小破站・哔哩哔哩超级助手, 视频下载（单P和批量）, 自动签到领瓜子辣条等，===大家都说好系列😈
// @name:zh-TW		  小破站・嗶哩嗶哩超級助手, 視頻下載（單P和批量）, 自動簽到領瓜子辣條等，===大家都說好系列😈
// @namespace         huahuacat_bilibili_2000x
// @version           1.0.4
// @description       为爱发电，B站视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、访问任意B站链接，即可自动签到领取瓜子辣条、视频描述中文本网址转链接，专栏文章中文本网址转链接，跳转访问更加方便等，脚本长期稳定更新，大家可以放心使用
// @description:zh    为爱发电，B站视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、访问任意B站链接，即可自动签到领取瓜子辣条、视频描述中文本网址转链接，专栏文章中文本网址转链接，跳转访问更加方便等，脚本长期稳定更新，大家可以放心使用
// @description:zh-TW 為愛發電，B站視頻下載(👉支援多P批量快速下載👈)、瀏覽記錄提示、一鍵三連、訪問任意B站連結，即可自動簽到領取瓜子辣條、視頻描述中文本網址轉連結，專欄文章中文本網址轉連結，跳轉訪問更加方便等，指令碼或直譯式程式長期穩定更新，大家可以放心使用
// @author            huahuacat
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAbZJREFUOE+dk0svA1EUx//XdGraSClTJWkqCKmIsCBsJNjYWNuIfg+PRCXqg7CzYWvjkVpILBALTROSlhBM0hJpqx29ck5NXyQaJ5nk3jnn/M7zCgAwFjcPATlF53pFCqx7tlZC4iUYDgmJtXodq+3EkTAWw7LWWQn0oJB4hExnWNWguyF0Nz6jtz/i/Apo8HeyoTRSRYC/k2EErZUSwIpSTynSSKJgJNmUAepAFwpS4SgynQXo+xa134d87L54c2pcDolVDgNcq0F8nMXwsX/KSgKS5K/jcC0tILN3wmcS+0gfhLcNucglBywBspEr5I7P2QDNTVB9HjawBfzIHl7gM5WB0uKAfH2HfXyQM03vHBQBzvkZmE9JBlCKNp8OW3cHO5vRBPLRBMz4M4RTg+JxMUDx6Xjb2CoDHHMTnGJmN8KO3CBVhXnzAG12tEontEbIvFkGUNra7BgbmbE7jsi9GOrle61OtLfC5nWXSxBOB+yTwzxnq1mV46xsKv2vXLTSHvDP79nSGK0ttEAUhMvSW0DnqjGSot5F4l0xUqUA4q+XSNFqs7Gyohcp6PK/FymO9O3l6S9coeaJ0CrJowAAAABJRU5ErkJggg==
// @include	   	      *://www.bilibili.com/**
// @include           *://search.bilibili.com/**
// @include           *://space.bilibili.com/**
// @include           *://www.bilibili.com/read/**
// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require           https://greasyfork.org/scripts/454236-findandreplacedomtext-huahuacat/code/findAndReplaceDOMText-huahuacat.js?version=1112990
// @connect           api.bilibili.com
// @connect           api.live.bilibili.com
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @license           AGPL License
// @charset		      UTF-8
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/483611/%E5%B0%8F%E7%A0%B4%E7%AB%99%E3%83%BB%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8B%2C%20%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%88%E5%8D%95P%E5%92%8C%E6%89%B9%E9%87%8F%EF%BC%89%2C%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E9%A2%86%E7%93%9C%E5%AD%90%E8%BE%A3%E6%9D%A1%E7%AD%89%EF%BC%8C%3D%3D%3D%E5%A4%A7%E5%AE%B6%E9%83%BD%E8%AF%B4%E5%A5%BD%E7%B3%BB%E5%88%97%F0%9F%98%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483611/%E5%B0%8F%E7%A0%B4%E7%AB%99%E3%83%BB%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8B%2C%20%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%88%E5%8D%95P%E5%92%8C%E6%89%B9%E9%87%8F%EF%BC%89%2C%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E9%A2%86%E7%93%9C%E5%AD%90%E8%BE%A3%E6%9D%A1%E7%AD%89%EF%BC%8C%3D%3D%3D%E5%A4%A7%E5%AE%B6%E9%83%BD%E8%AF%B4%E5%A5%BD%E7%B3%BB%E5%88%97%F0%9F%98%88.meta.js
// ==/UserScript==
(function () {
	'use strict';
	/**
 * 脚本遵循AGPL License开源协议；在协议允许的范围类，可以自由修改
 * 开完万岁！！
 */
	//共有方法，全局共享
function CommonFunction(){
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
	this.request=function(mothed, url, param, headers={"Content-Type": "application/json;charset=UTF-8"}){
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: url,
				method: mothed,
				data:param,
				headers:headers,
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
	this.filterStr = function(str){
		if(!str) return "";
		str = str.replace(/\t/g,"");
		str = str.replace(/\r/g,"");
		return encodeURIComponent(str)
	};
	this.getParamterQueryUrl = function(text, tag) { //查询GET请求url中的参数
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
	this.getEndHtmlIdByUrl = function(url) { //获得以html结束的ID
		if(url.indexOf("?")!=-1){
			url = url.split("?")[0]
		}
		if(url.indexOf("#")!=-1){
			url = url.split("#")[0]
		}
		var splitText = url.split("/");
		var idText = splitText[splitText.length-1];
		idText = idText.replace(".html","");
		return idText;
	};
	this.getEcommercePlatform=function(url = window.location.href){
		let platform = "";
		if(url.indexOf("detail.tmall")!=-1 || url.indexOf("tmall.hk")!=-1 || url.indexOf("pages.tmall.com")!=-1){
			platform = "tmall";
		}else if(url.indexOf("taobao.com")!=-1 || url.indexOf("maiyao.liangxinyao.com")!=-1){
			platform = "taobao";
		}else if(url.indexOf("jd.com")!=-1 || url.indexOf("npcitem.jd.hk")!=-1 || url.indexOf("yiyaojd.com")!=-1 || url.indexOf("jkcsjd.com")!=-1){
			platform = "jd";
		}else if(url.indexOf("detail.vip.com")!=-1 || url.indexOf("www.vipglobal.hk")!=-1){
			platform = "vpinhui";
		}
		return platform;
	}
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
	this.getElementObject = function(selector, target=document.body, allowEmpty = true, delay=10, maxDelay=10 * 1000){
		return new Promise((resolve,reject) =>{
			if (selector.toUpperCase() === "BODY") {
				resolve(document.body);
				return;
			}
			if (selector.toUpperCase() === "HTML") {
				resolve(document.html);
				return;
			}
			let totalDelay = 0;
			
			let element = target.querySelector(selector);
			let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
			if(result){
				resolve(element);
			}
			
			const elementInterval = setInterval(()=>{
				if(totalDelay >= maxDelay){
					clearInterval(elementInterval);
					resolve(null);
				}
				element = target.querySelector(selector);
				result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
				if(result){
					clearInterval(elementInterval);
					resolve(element);
				}else{
					totalDelay += delay;
				}
			}, delay);
		});
	};
	/**
	 * @param {Object} time
	 * @param {Object} format
	 * 时间格式化
	 * DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss")
	 */
	this.DateFormat = function(time, format) {
		var o = {
			"M+": time.getMonth() + 1, //月份 
			"d+": time.getDate(), //日 
			"h+": time.getHours(), //小时 
			"m+": time.getMinutes(), //分 
			"s+": time.getSeconds(), //秒 
			"q+": Math.floor((time.getMonth() + 3) / 3), //季度 
			"S": time.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(format)){
			format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o){
			if(new RegExp("(" + k + ")").test(format)){
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	};
	this.decryptStr=function(str){
		let result = atob(str);
		return result.split('').reverse().join('');
	};
	this.encryptStr=function(str){
		let result = str.split('').reverse().join('');
		return btoa(result);
	};
}
//全局弹窗对象
const dialog = (function(){
	class Dialog {
		constructor() {
			this.mask = document.createElement('div');
			this.dialogStyle = document.createElement('style');
			
			this.setStyle(this.mask, {
				"width": '100%',
				"height": '100%',
				"backgroundColor": 'rgba(0, 0, 0, .6)',
				"position": 'fixed',
				"left": "0px",
				"top": "0px",
				"bottom":"0px",
				"right":"0px",
				"z-index":"9999999999999"
			});
			
			this.content = document.createElement('div');
			this.setStyle(this.content, {
				"max-width": '450px',
				"width":"100%",
				"max-height": '600px',
				"backgroundColor": '#fff',
				"boxShadow": '0 0 2px #999',
				"position": 'absolute',
				"left": '50%',
				"top": '50%',
				"transform": 'translate(-50%,-50%)',
				"borderRadius": '5px'
			})
			this.mask.appendChild(this.content);
		}
		middleBox(param) {
			// 先清空中间小div的内容 - 防止调用多次，出现混乱
			this.content.innerHTML = '';
			
			let title = '默认标题内容';
			if({}.toString.call(param) === '[object String]') {
				title = param;
			} else if({}.toString.call(param) === '[object Object]') {
				title = param.title;
			}

			document.body.appendChild(this.mask);
			this.title = document.createElement('div');
			this.setStyle(this.title, {
				"width": '100%',
				"height": '40px',
				"lineHeight": '40px',
				"boxSizing": 'border-box',
				"background-color":"#dedede",
				"color": '#000',
				"text-align": 'center',
				"font-weight":"700",
				"font-size":"17px",
				"border-radius": "4px 4px 0px 0px"
			});
			
			this.title.innerText = title;
			this.content.appendChild(this.title);

			this.closeBtn = document.createElement('div');
			this.closeBtn.innerText = '×';
			
			this.setStyle(this.closeBtn, {
				"textDecoration": 'none',
				"color": '#000',
				"position": 'absolute',
				"right": '10px',
				"top": '0px',
				"fontSize": '25px',
				"display":"inline-block",
				"cursor":"pointer"
			})
			this.title.appendChild(this.closeBtn);
			
			const self = this;
			this.closeBtn.onclick = function(){
				self.close();
				if(param.onClose && (typeof param.onClose)==="function"){
					param.onClose();
				}
			}
		}
		showMake(param) {
			//添加公用样式表
			if(param.hasOwnProperty("styleSheet")){
				this.dialogStyle.textContent = param.styleSheet;
			}
			document.querySelector("head").appendChild(this.dialogStyle);
			
			this.middleBox(param);
			this.dialogContent = document.createElement('div');
			this.setStyle(this.dialogContent,{
				"padding":"15px",
				"max-height":"400px"
			});
			this.dialogContent.innerHTML = param.content;
			this.content.appendChild(this.dialogContent);
			param.onContentReady(this);
		}
		close() {
			document.body.removeChild(this.mask);
			document.querySelector("head").removeChild(this.dialogStyle);
		}
		setStyle(ele, styleObj) {
			for(let attr in styleObj){
				ele.style[attr] = styleObj[attr];
			}
		}
	}
	let dialog = null;
	return (function() {
		if(!dialog) {
			dialog = new Dialog()
		}
		return dialog;
	})()
})();
	
//全局统一方法对象
const commonFunctionObject = new CommonFunction(); 
commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加
let functionController = null;
	
	
	
	/**
 * B站相关功能：视频多P下载，一键三联，浏览记录等
 */
function BilibiliHelper(){
	
	this.isRun = function(){
		return window.location.host.indexOf("bilibili.com") != -1
	}
	this.baseFunction = function(){
		/**
		 * b站基本功能，一件三连、视频解析、视频下载
		 */ 
		function baseFunctionObject(){
			this.elementId = Math.ceil(Math.random()*100000000)+"mmx";
			this.downloadSettingKey = "download_setting_key";
			this.downloadResutError=function(btnElement){
				btnElement.text("下载视频");
				btnElement.removeAttr("disabled");
			};
			this.downloadResutSuccess=function(btnElement){
				btnElement.text("下载视频");
				btnElement.removeAttr("disabled");
			};
			this.getDownloadPages = function(){
				return new Promise(function(resolve, reject) {
					var pathname = window.location.pathname, bv = null;
					if (pathname.indexOf("/medialist/play/watchlater/") != -1) { // 在下载视频的时候针对稍后再看页面的链接找BV号
						bv = pathname.replace("/medialist/play/watchlater/","").replace("/","");
					}else{
						bv = pathname.replace("/video/","").replace("/","");
					}
					if(!bv){
						resolve({"status":"bv_null"});
						return;
					}
					//bv转av
					commonFunctionObject.request("get", "https://api.bilibili.com/x/web-interface/view?bvid="+bv, null).then((resultData)=>{
						let dataJson = JSON.parse(resultData.data);
						if(!dataJson || dataJson.code!==0 || !dataJson.data){
							resolve({"status":"request_error"});
							return;
						}
						
						let data = dataJson.data;
						if(!data){
							resolve({"status":"aid_null"});
							return;
						}
						
						let aid = data.aid;
						let pic = data.pic;
						let title = data.title
						if(!aid){
							resolve({"status":"aid_null"});
							return;
						}
						
						//获取cid
						commonFunctionObject.request("get", "https://api.bilibili.com/x/web-interface/view?aid="+aid, null).then((resultData2)=>{
							let dataJson2 = JSON.parse(resultData2.data);
							if(!dataJson2 || dataJson2.code!==0 || !dataJson2.data){
								resolve({"status":"request_error"});
								return;
							}
							const downloadData = dataJson2.data;
							const {aid,  bvid} = downloadData,
								items = new Array();
							//这是下载集合
							if(downloadData.hasOwnProperty("ugc_season") && downloadData.ugc_season.hasOwnProperty("sections")){
								let sections = downloadData.ugc_season.sections;
								let page = 1;
								for(var i=0; i<sections.length; i++){
									let section = sections[i];
									if(section.hasOwnProperty("episodes")){
										for(var j=0; j<section.episodes.length; j++){
											let episode = section.episodes[j];
											items.push({
												"cover":"",
												"page":page,
												"title":episode.title,
												"cid":episode.cid,
												"aid":episode.aid
											});
											page++;
										}
									}
								}
							}else{ //这是多P下载
								for(var i=0; i<downloadData.pages.length; i++){
									let pageData = downloadData.pages[i];
									items.push({
										"cover":pageData.first_frame,
										"page":pageData.page,
										"title":pageData.part,
										"cid":pageData.cid,
										"aid":aid
									});
								}
							}
							resolve({"status":"success", "downloadData":{
								"items":items,
								"pic":pic,
								"title":title
							}});
						}).catch((errorData)=>{
							resolve({"status":"request_error"});
						});
					}).catch((errorData)=>{
						resolve({"status":"request_error"});
					});
				});
			};
			this.startDownloadFile = function(options){
				let aid = options.aid, cid = options.cid, fileName = options.fileName, 
					savePath = options.savePath, RPCURL = options.RPCURL, RPCToken = options.RPCToken;
				let isByPRC = options.isByPRC;
				
				commonFunctionObject.request("get", "https://api.bilibili.com/x/player/playurl?avid="+aid+"&cid="+cid+"&qn=112", null).then((resultData3)=>{
					
					if(!fileName){
						fileName = (new Date()).getTime() + "";
					}
					fileName = fileName.replace(/[\ |\~|\`|\=|\||\\|\;|\:|\"|\'|\,|\.|\>|\/]/g,"");
					fileName = fileName.substring(0,50); //可能有异常，标题最多50字符
					fileName = fileName + ".mp4";
					
					let dataJson3 = JSON.parse(resultData3.data);
					if(!!dataJson3 && dataJson3.code===0 && !!dataJson3.data){
						let downloadUrl = dataJson3.data.durl[0].url;
						if(isByPRC){
							commonFunctionObject.RPCDownloadFile(fileName, downloadUrl, savePath, RPCURL).then((data)=>{
								commonFunctionObject.webToast({"message":data, "time":3000});
							}).catch((data)=>{
								commonFunctionObject.webToast({"message":data, "time":3000});
							});
						}else{
							window.open(downloadUrl);
						}
					}else{
						commonFunctionObject.webToast({"message":"获取下载链接失败", "background":"#FF4D40"});
					}
				}).catch((errorData)=>{
					commonFunctionObject.webToast({"message":"获取下载链接失败", "background":"#FF4D40"});
				});
			};
			this.createModals = function(){
				var css = `
					.modal-mask-`+this.elementId+`{
						position:fixed;
						top:0;
						left:0;
						z-index:999;
						width:100%;
						height:100%;
						display:none;
						background-color:#000;
						opacity:0.3;
						overflow:hidden;
					}
					.modal-body-`+this.elementId+`{
						position:fixed;
						border-radius:5px;
						background-color: #FFFFFF;
						top:10%;
						width:600px;
						max-width:90%;
						max-height:80%;
						z-index:1000;
						left: 50%;
						transform: translateX(-50%);
						display:none;
						padding: 10px;
						overflow-y: auto;
					}
					.modal-body-`+this.elementId+` >.page-header{
						height:30px;
						line-height:30px;
						position:relative;
					}
					.modal-body-`+this.elementId+` >.page-header >span{
						display:inline-block;
					}
					.modal-body-`+this.elementId+` >.page-header >span:nth-child(1) {
						font-size:18px;
						font-weight:bold;
						position:absolute;
						left:10px;
					}
					.modal-body-`+this.elementId+` >.page-header >span:nth-child(2) {
						font-size:28px;
						font-weight:bold;
						position:absolute;
						right:10px;
						cursor:pointer;
					}
					.modal-body-`+this.elementId+` >.page-container{
						max-height: 500px;
						overflow-y: auto;
					}
					.modal-body-`+this.elementId+` .page-wrap{
						display: flex;
						flex-wrap: wrap;
						margin-top:5px;
					}
					.modal-body-`+this.elementId+` .page-wrap >.board-item{
						display: block;
						width: calc(50% - 10px);
						background-color: #6A5F60;
						margin: 5px;
						background-color:#FB7299;
						color:#FFFFFF;
						cursor: pointer;
						overflow:hidden;
						white-space:nowrap;
						text-overflow:ellipsis;
					}
					.modal-body-`+this.elementId+` .page-wrap >.board-item >input{
						width: 14px;
						height: 14px;
						vertical-align: middle;
						margin-right:5px;
					}
					.modal-body-`+this.elementId+` .page-wrap >.board-item >span{
						vertical-align: middle;
					}
					.modal-body-`+this.elementId+` .modal-btn-wrap{
						text-align: center;
						margin-top: 10px;
						cursor: pointer;
					}
					.modal-body-`+this.elementId+` .aria2-setting{
						border:1px dashed #F1F1F1;
						border-radius:4px;
						margin-top:10px;
					}
					.modal-body-`+this.elementId+` .aria2-setting >.setting-item{
						text-align: center;
						font-size:14px;
						margin:10px 0px;
					}
					.modal-body-`+this.elementId+` .aria2-setting >.setting-item .topic-name{
						display:inline-block;
						width:80px;
						text-align:left;
					}
					.modal-body-`+this.elementId+` .aria2-setting >.setting-item> input{
						width:300px;
						padding-left:10px;
						border:1px solid #888;
						outline:none;
						border-radius:3px;
					}
					.modal-body-`+this.elementId+` .modal-btn-wrap >span{
						border:1px solid #ccc;
						display:inline-block;
						padding:3px 5px;
						margin:0px 5px;
						border-radius:3px;
					}
					.modal-body-`+this.elementId+` .tip-wrap{
						margin-top: 10px;
						font-size:12px;
					}
					.modal-body-`+this.elementId+` .tip-wrap >.title{
						font-size:16px;
						font-weight:bold;
					}
					.modal-body-`+this.elementId+` .tip-wrap >.content >ul >li{
						margin-top:5px;
					}
				`;
									
				var html = `
					<div class='modal-mask-`+this.elementId+`'></div>
					<div class='modal-body-`+this.elementId+`'>
						<div class="page-header">
							<span>视频下载(可批量)</span>
							<span class="close">×</span>
						</div>
						<div class="page-container">
							<label style="color:red;">注：此功能会调用bilibili的API，脚本仅用于个人交流，切勿用于商业用途，否则后果自负，特此申明！</label>
							<div class="page-wrap">
							</div>
							<div class="aria2-setting">
								<div class="setting-item">
									<span><input type="radio" name="downloadWay" value="Motrix">Motrix下载</span>&nbsp;&nbsp;&nbsp;
									<span><input type="radio" name="downloadWay" value="AriaNgGUI">AriaNgGUI下载</span>
								</div>
								<div class="setting-item">
									<label class="topic-name">配置RPC:</label><input type="text" name="RPCURL" value="" placeholder="请准确输入RPC对应软件的地址，默认：Motrix">
								</div>
								<div class="setting-item">
									<label class="topic-name">配置Token:</label><input type="text" name="RPCToken" value="" placeholder="默认无需填写">
								</div>
								<div class="setting-item">
									<label class="topic-name">保存路径:</label><input type="text" name="savePath" value="" placeholder="请准确输入文件保存路径">
									<div style="font-size:12px;color:#888;">最好自定义下载地址，默认地址可能不满足需要</div>
								</div>
							</div>
							<div class="modal-btn-wrap">
								<span name="selectall">全选</span>
								<span name="removeSelect">取消选择</span>
								<span name="downloadAll">批量下载</span>
							</div>
							<div class="tip-wrap">
								<div class="title">关于单P下载：</div>
								<div class="content"><span>点击弹框单个选集，即可下载单集视频！PS:单P下载，推荐大家使用BBDown下载，此工具功能很强大，具体查看：<a target="_blank" href="https://github.com/nilaoda/BBDown">https://github.com/nilaoda/BBDown</a></span></div>
							</div>
							<div class="tip-wrap">
								<div class="title">关于批量下载：</div>
								<div class="content">
									<ul>
										<li>
											<b>1、批量下载需要第三方软件的支持，脚本推荐使用：Motrix</b>
											<ul>
												<li>Motrix下载地址：<a href="https://motrix.app/zh-CN/" target="_blank">https://motrix.app/zh-CN/</a></li>
												<li>AriaNgGUI下载地址：<a href="https://github.com/Xmader/aria-ng-gui" target="_blank">https://github.com/Xmader/aria-ng-gui</a></li>
											</ul>
										</li>
										<li>
											<b>2、在批量下载前需要提前打开软件，本教程以Motrix为准</b>
											<ul>
												<li>(1)、如果全部按照默认配置，只需要打开软件即可</li>
												<li>(2)、如果想自定义RPC地址和文件保存路径，可更改上面输入框的内容（此数据非常重要，请准确填写）</li>
												<li>
												(3)、Motrix运行图片
												<img src="https://pic.rmb.bdstatic.com/bjh/8912582c0416119405ec37ea27d12376.jpeg" width="100%" />
												</li>
											</ui>
										</li>
										<li>
											<b>3、默认RPC默认地址</b>
											<ul>
												<li>(1)、Motrix RPC默认地址：ws://localhost:16800/jsonrpc</li>
												<li>(2)、Aria2 RPC默认地址：ws://localhost:6800/jsonrpc</li>
												<li>(3)点击“批量下载会自动保存当前下载设置”</li>
											</ul>
										</li>
										<li>
											<b>4、如使用AriaNgGUI，使用方式类似，大家可以自行研究</b>
										</li>
									</ul>
								</div>
							</div>
							<div class="tip-wrap">
								<div class="title">必要说明：</div>
								<div class="content">
									申明：本功能仅能作为学习交流使用，且不可用于其它用途，否则后果自负。请大家重视版权，尊重创作者，切勿搬运抄袭。请大家多用[一键三连]为创作者投币~，小破站牛掰！
								</div>
							</div>
						</div>
					</div>
				`;
				commonFunctionObject.GMaddStyle(css);
				$("body").append(html);
			};
			this.hideModals = function(){
				$(".modal-body-"+this.elementId+"").css('display','none');
				$(".modal-mask-"+this.elementId+"").css('display','none');
			};
			this.showModals = function(pageHtml){
				const self = this;
				const downloadSettingKey = self.downloadSettingKey;
				$(".modal-body-"+self.elementId+"").css('display','block');
				$(".modal-mask-"+self.elementId+"").css('display','block');
				$(".modal-body-"+self.elementId+" .page-wrap").html(pageHtml);
				
				//初始化设置的数据
				var savePath = "D:/";
				if("macOS"===commonFunctionObject.getSystemOS()){
					savePath = ""
				}
				const downloadSetting = commonFunctionObject.GMgetValue(this.downloadSettingKey, 
					{"RPCURL":"ws://localhost:16800/jsonrpc", 
					"savePath":savePath,
					"RPCToken":'', "downloadWay":"Motrix"});
				const isMotrix = downloadSetting.downloadWay=="Motrix";
				$(".modal-body-"+self.elementId+" input[name='RPCURL']").val(downloadSetting.RPCURL);
				$(".modal-body-"+self.elementId+" input[name='savePath']").val(downloadSetting.savePath);
				$(".modal-body-"+self.elementId+" input[name='RPCToken']").val(downloadSetting.RPCToken);
				$(".modal-body-"+self.elementId+" input[name='downloadWay']").removeAttr("checked");
				if(isMotrix){
					$(".modal-body-"+self.elementId+" input:radio[value='Motrix']").attr('checked','true');
				}else{
					$(".modal-body-"+self.elementId+" input:radio[value='AriaNgGUI']").attr('checked','true');
				}
				
				$(".modal-body-"+self.elementId+" .page-wrap >.board-item >span").off("click").on("click", function(){
					$(this).css("background-color","#ccc");
					let downloadOptions={
						"aid":$(this).data("aid"),
						"cid":$(this).data("cid"),
						"isByPRC":false
					}
					self.startDownloadFile(downloadOptions);
				});
				$(".modal-body-"+self.elementId+" .page-header >span.close").off("click").on("click", function(){
					self.hideModals();
				});
				$(".modal-body-"+self.elementId+" .modal-btn-wrap >span[name='selectall']").off("click").on("click", function(){
					$(".modal-body-"+self.elementId+" .page-wrap").find("input[type='checkbox']").each(function(){
						$(this).prop('checked', true);
					});
				});
				$(".modal-body-"+self.elementId+" input[name='downloadWay']").off("change").on("change", function(){
					if($(this).val()=="Motrix"){
						$(".modal-body-"+self.elementId+" input[name='RPCURL']").val("ws://localhost:16800/jsonrpc");
					}else{
						$(".modal-body-"+self.elementId+" input[name='RPCURL']").val("ws://localhost:6800/jsonrpc");
					}
				});
				$(".modal-body-"+self.elementId+" .modal-btn-wrap >span[name='removeSelect']").off("click").on("click", function(){
					$(".modal-body-"+self.elementId+" .page-wrap").find("input[type='checkbox']").each(function(){
						$(this).prop('checked', false);
					});
				});
				$(".modal-body-"+self.elementId+" .modal-btn-wrap >span[name='downloadAll']").off("click").on("click", function(){
					let RPCURL = $(".modal-body-"+self.elementId+" input[name='RPCURL']").val();
					let savePath = $(".modal-body-"+self.elementId+" input[name='savePath']").val();
					let RPCToken = $(".modal-body-"+self.elementId+" input[name='RPCToken']").val();
					let downloadWay = $(".modal-body-"+self.elementId+" input[name='downloadWay']:checked").val();
					commonFunctionObject.GMsetValue(downloadSettingKey,{"RPCURL":RPCURL, "savePath":savePath, 
						"RPCToken":RPCToken, "downloadWay":downloadWay});
						
					let inputElements = $(".modal-body-"+self.elementId+" .page-wrap input[type='checkbox']:checked");
					if(inputElements.length == 0){
						commonFunctionObject.webToast({"message":"至少需要选中1P", "background":"#FF4D40"});
						return;
					}
											
					if(!savePath){
						commonFunctionObject.webToast({"message":"保存路径不能为空", "background":"#FF4D40"});
						return;
					}
					if(!RPCURL){
						commonFunctionObject.webToast({"message":"PRC地址不能为空", "background":"#FF4D40"});
						return;
					}
					RPCToken = !RPCToken ? "" : RPCToken;
					let downloadOptions = {
						"aid":"",
						"cid":"",
						"isByPRC":true,
						"fileName":"",
						"savePath":savePath,
						"RPCURL":RPCURL,
						"RPCToken":RPCToken
					}
					inputElements.each(function(){
						setTimeout(()=>{
							let aid=$(this).data("aid"), cid = $(this).data("cid"), fileName = $(this).attr("title");
							downloadOptions.aid = aid;
							downloadOptions.cid = cid;
							downloadOptions.fileName = fileName;
							self.startDownloadFile(downloadOptions);
						}, 1000);
					})
				});
			};
			this.createElementHtml = async function(){
				$("#bilibili_exti_9787fjfh12j").remove();
				
				const randomNumber = this.elementId, self = this;
				let cssText = `
					#bilibili_exti_9787fjfh12j{
						position:fixed;
						left:-30px;
						top:250px;
						opacity:0.6;
						transition: 0.3s;
					}
					#bilibili_exti_9787fjfh12j >.self_s_btn{
						background-color:#FB7299;
						color:#FFF;
						font-size:10px;
						border-radius:3px;
						cursor:pointer;
						margin:10px 0px;
						width:60px;
						height:20px;
						text-align:center;
						line-height:20px;
					}
				`;
				let htmlText=`
					<div id="bilibili_exti_9787fjfh12j">
						<div class="self_s_btn" id="download_s_`+randomNumber+`">下载视频</div>
						<div class="self_s_btn" id="focus_s_`+randomNumber+`">一键三连</div>
					</div>
				`;
				
				//添加下载等操作按钮
				commonFunctionObject.GMaddStyle(cssText);
				$("body").append(htmlText);
								
				//创建弹框
				this.createModals();
				
				//移入移除操作
				$("#bilibili_exti_9787fjfh12j").hover(function(){
					$(this).css({
						"left":"0px", "opacity":1
					});
				},function(){
					$(this).css({
						"left":(0-$(this).width())/2+"px", "opacity":0.6
					});
				});
				
				//下载操作函数
				$("body").on("click", "#download_s_"+randomNumber, function(){
					const btnElement = $(this);
					btnElement.attr("disabled", "disabled");
					btnElement.text("准备中~");
					//开始准备下载数据
					self.getDownloadPages().then((resule)=>{
						if(resule.status==="success"){
							const {items, pic, title} = resule.downloadData;
							let itemHtml = "";
							itemHtml += "<div style='width:100%;'><a href='"+pic+"' target='_blank'>标题："+title+"（点我跳转封面）</a></div>";
							for(var i=0; i<items.length; i++){
								var currentTitle = "【P"+items[i].page+"】"+items[i].title+"";
								itemHtml += "<div class='board-item'>";
								itemHtml += "<input data-aid='"+items[i].aid+"' data-cid='"+items[i].cid+"' title='"+currentTitle+"' type='checkbox'>"
								itemHtml += "<span data-aid='"+items[i].aid+"' data-cid='"+items[i].cid+"' title='"+currentTitle+"'>"+currentTitle+"</span>";
								itemHtml += "</div>";
							}
							self.showModals(itemHtml);
							self.downloadResutSuccess(btnElement);
						}else{
							self.downloadResutError(btnElement);
						}
					}).catch((error)=>{
						self.downloadResutError(btnElement);
					});
				});
				$("body").on("click", "#focus_s_"+randomNumber, function(){
					$("#arc_toolbar_report .video-like").click(); // 点赞
					$("#arc_toolbar_report .video-coin").click(); // 投币
					// $("#arc_toolbar_report .video-fav").click(); // 收藏
				});
			}
			this.start = function(){
				let locationHost = window.location.host, locationPathname = window.location.pathname;
				if(locationHost==="www.bilibili.com" && (locationPathname.indexOf("/video")!=-1 || locationPathname.indexOf("/watchlater")!=-1)){
					this.createElementHtml();
				}
			}
		}
		try{
			(new baseFunctionObject()).start();
		}catch(e){
			console.log("baseFunctionObject new error", e);
		}
	};
	/**
	 * 浏览历史记录提醒
	 */
	this.recordViewFunction = function(){
		function recordViewObject(){
			this.localCacheName = "bilibili_video_record"; 
			this.recordOneVideo = function(){
				let promise = new Promise((resolve, reject)=>{
					let bv = commonFunctionObject.getBilibiliBV();
					let cacheText = commonFunctionObject.GMgetValue(this.localCacheName);
					cacheText = !cacheText ? "" : cacheText
					let maxLength = 12*500;
					let currentLength = cacheText.length;
					if(currentLength > maxLength){
						cacheText = cacheText.substring(12*100, currentLength);
					}
					
					if(cacheText.indexOf(bv)==-1){
						cacheText += bv;
						commonFunctionObject.GMsetValue(this.localCacheName, cacheText);
					}
					resolve({"result":"success"});
				});
			};
			this.searchPageRemindHtml = function($ele, top=8, right=8){
				if($ele.find("div[name='marklooked']").length==0){						
					$ele.css("position","relative");
					$ele.append("<div name='marklooked' style='z-index: 100;position:absolute; top:"+top+"px; right:"+right+"px; background-color: rgba(251,123,159,1); border-radius:3px; font-size:10px; color:#FFF;padding:0px 2px;'>已看</div>");
				}
			};
			this.searchPageRemind = function(){
				let $that = this;
				var elementArray = [
					{"node":".bili-video-card", "top":8, "right":12},  //兼容 MAC M1搜索结果
					{"node":"#page-index .small-item", "top":12, "right":12},  //用户投稿
					{"node":"#submit-video-list .small-item", "top":12, "right":12}, //用户主页
					{"node":"#page-series-detail .small-item.fakeDanmu-item", "top":12, "right":12}, //用户主页投稿
				];
				setInterval(function(){
					let cacheText = commonFunctionObject.GMgetValue($that.localCacheName);
					cacheText = !cacheText ? "" : cacheText;
					for(var i=0; i<elementArray.length; i++){
						var elementobj = elementArray[i];
						$(elementobj.node).each(function(){
							if($(this).attr("dealxll")!=="true"){
								var videourl = $(this).find("a[href^='//www.bilibili.com/video']").attr("href");
								if(!!videourl){
									var bvs = videourl.match(/(\/BV(.*?)\/)/g)
									if(bvs.length==1){
										var bv = bvs[0].replace(/\//g,"");
										if(cacheText.indexOf(bv) != -1){
											$that.searchPageRemindHtml($(this), elementobj.top, elementobj.right);
										}
										$(this).unbind("click").bind("click", ()=>{  //循环操作，单独绑定
											$that.searchPageRemindHtml($(this), elementobj.top, elementobj.right);
										})
									}
									$(this).attr("dealxll","true");
								}
							}
						});
					}
				}, 500);
			}
			this.start=function(){
				let $that = this;
				if(window.location.pathname.indexOf("/video")!=-1 && window.location.host==="www.bilibili.com"){
					let currentHref = "";
					setInterval(()=>{ //需要循环存储
						if(window.location.href !== currentHref){
							this.recordOneVideo();
							currentHref = window.location.href;
						}
					}, 500);
				}
				//搜索结果和用户主页已经看过的视频提醒
				if(window.location.host.indexOf("bilibili.com")!=-1){
					this.searchPageRemind();
					GM_registerMenuCommand("清空B站浏览记录",function(){
						if(confirm('是否要清空B站浏览记录？清空后将不可恢复...')){
							commonFunctionObject.GMsetValue($that.localCacheName, "");
						}
					});
				}
			};
		}
		try{
			(new recordViewObject()).start();
		}catch(e){
			console.log("recordViewObject new error", e);
		}
	};
	/**
	 * 视频描述文本转链接
	 */
	this.textToLinkFunction = function() {
		function textToLinkObject(){
			this.link = function(selector){
				const current_href = window.location.href;
				const textToLinkArea = document.querySelector(selector);
				
				if(!textToLinkArea){
					return;
				}
				findAndReplaceDOMText(textToLinkArea, {
					find: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g,
					replace: function (e, t) {
						let text = e.text;
						let element = null;
						if(text.indexOf("bilibili.com")==-1 && /^(http|ftp|https)/i.test(text)){
							element = document.createElement("a");
							element.setAttribute("href", text)
							element.setAttribute("target", "_blank");
							element.style.color="#00AEEC";
						}else{
							element = document.createElement("span");
						}
						element.innerText = text;
						return element;
					}, 
					preset: "prose"
				});
				
			}
			this.start = function(){
				const selector = "#v_desc";
				this.link(selector);
				
				const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
				const bodyMutationObserver = new MutationObserver(()=>{
					this.link(selector);
				});
				
				const element = document.querySelector(selector);
				if(element){
					bodyMutationObserver.observe(element, 
						{"characterData":true, "attributes":true, "childList":true},
					);
				}
			}
		}
		try{
			(new textToLinkObject()).start();
		}catch(e){
			console.log("textToLinkObject new error", e);
		}
	}
	this.signIn = async function(){ //签到下线，2024年7月2日
		
	}
	this.start = function(){
		if(this.isRun()){
			this.baseFunction();
			this.recordViewFunction();
			this.textToLinkFunction();
			this.signIn();
		}
	}
}

try{
	if(!functionController || functionController.bilibiliHelper){
		new BilibiliHelper().start();
	}
}catch(e){
	console.log("B站视频下载：error："+e);
}
	
	
	
	
	
	
})();