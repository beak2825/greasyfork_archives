// ==UserScript==
// @name              搜索引擎超级助手, ===大家都说好系列😈
// @name:zh           搜索引擎超级助手, ===大家都说好系列😈
// @name:zh-TW		  搜索引擎超級助手, ===大家都說好系列😈
// @name:en		      Search engine super assistant, ===Everyone talks about the series😈
// @namespace         huahuacat_search_engines_2000x
// @version           1.0.2
// @description       搜索引擎导航[支持百度、搜狗、360搜索、必应、谷歌]，支持自定义网址，并且对主流搜索引擎搜索结果做了优化，百度：结果跳转直达目标网址，并且把目标网址给展示到页面上，方便辨别（必应，google都是这种做法）；google：结果链接新标签页打开，这样方便查阅；其他搜索引擎少量优化，如有好的建议，请留言！
// @description:zh    搜索引擎导航[支持百度、搜狗、360搜索、必应、谷歌]，支持自定义网址，并且对主流搜索引擎搜索结果做了优化，百度：结果跳转直达目标网址，并且把目标网址给展示到页面上，方便辨别（必应，google都是这种做法）；google：结果链接新标签页打开，这样方便查阅；其他搜索引擎少量优化，如有好的建议，请留言！
// @description:zh-TW 搜索引擎導航[支援百度、搜狗、360搜索、必應、穀歌]，支援自定義網址，並且對主流搜索引擎搜索結果做了優化，百度：結果跳轉直達目標網址，並且把目標網址給展示到頁面上，方便辨別（必應，google都是這種做法）；google：結果連結新標籤頁開啟，這樣方便查閱；其他搜索引擎少量優化，如有好的建議，請留言！
// @description:en    Search engine navigation [supports Baidu, Sogou, 360 Search, Bing, Google], supports custom URLs, and optimizes the search results of mainstream search engines. Baidu: the results jump directly to the target URL, and display the target URL to On the page, it is easy to identify (Bing and Google do this); Google: the result link is opened in a new tab, so it is easy to read; other search engines have been slightly optimized. If you have good suggestions, please leave a message!
// @author            huahuacat,大家好我叫肉肉
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAcVJREFUWEfFl41txDAIhckGHaEDEKkbtDdJR2k7SbtJ73bwPq6wICIOGDtKmkinU34Ofzw/IDfBxcd08frQBYCIbwz6wd90fgeAB5/fU0p0PnyEAIj4CQCycGuBr5QSPTt0uACcNS0s2UtgyfzVuEfPDIGYAEbWtCgFNmU2nu+G8ACy0nEVjJUpqmjJDYhbjy82AFWgZfGGF/QzBParjHmLDLECaCxOQWsv1LFLxlWMUAUXIKVU7g1UAZViyRgRBXi55ilRA6x+yPstkkZq0n1RYTeAmK/s60D2S4mSChpclAwVqLI9DEBUCQF472oFesynY1vgTSMe7YENQPcWeO5FRN2UmkZUlbPbhHrwiKN1cwmHkeWl1o+sTrhkPNALdDfUvhlrRLwNbjvlspQpKINpGVLzPP/knN85466B5A0jnUVzEgr0NE3fOefnSu5xBSSANWLVkKGer9+S3DkxVAW1WXZ0QstvzXnQ80pG2dGn9VpG2/QEAC+O412IEMBRhS4XE+qXDjUFu5UYBohGYgCxqYzDAaqZYvGuIM4CaHZPXRmnABgNbaXEvwA0IM7fAp0u9xK6RC38Uf97Om0LomqR+5cD/AF3eCgwUmpgqQAAAABJRU5ErkJggg==
// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://www.sogou.com/sogou*
// @include           *://cn.bing.com/search*
// @include           *://www.bing.com/search*
// @include           *://www4.bing.com/search*
// @include           *://so.toutiao.com/search*
// @include           *://www.google.com/search*
// @include           *://www.google.com.hk/search*
// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/483045/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8B%2C%20%3D%3D%3D%E5%A4%A7%E5%AE%B6%E9%83%BD%E8%AF%B4%E5%A5%BD%E7%B3%BB%E5%88%97%F0%9F%98%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483045/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8B%2C%20%3D%3D%3D%E5%A4%A7%E5%AE%B6%E9%83%BD%E8%AF%B4%E5%A5%BD%E7%B3%BB%E5%88%97%F0%9F%98%88.meta.js
// ==/UserScript==

(function () {
	'use strict';
	
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
		this.getElementObject = function(selector, allowEmpty = true, delay=200){
			return new Promise((resolve,reject) =>{
				let totalDelay = 0;
				let elementInterval = setInterval(()=>{
					if(totalDelay >= 3000){ //总共检查3s，如果还是没找到，则返回
						reject(false);
						clearInterval(elementInterval);
					}
					let element = document.querySelector(selector);
					let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
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
		}
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
					"background-color":"#FF4D40",
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
	
	//全局统一方法对象
	const innerVersionNo = "100000001";
	const commonFunctionObject = new commonFunction(); 
	commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加
	
	/**
	 * 搜索引擎资源提醒
	 */
	function searchEnginesNavigation(){
		this.customNavigationkey = "custom-navigation-key-8898";
		this.searchEnginesData=[
			{"host":"www.baidu.com", "element":"#content_right","elementInput":"#kw"},
			{"host":"www.so.com", "element":"#side","elementInput":"#keyword"},
			{"host":"www.sogou.com", "element":"#right","elementInput":"#upquery"},
			{"host":"cn.bing.com", "element":"#b_context","elementInput":"#sb_form_q"},
			{"host":"www.bing.com", "element":"#b_context","elementInput":"#sb_form_q"},
			{"host":"www4.bing.com", "element":"#b_context","elementInput":"#sb_form_q"},
			{"host":"so.toutiao.com", "element":".s-side-list","elementInput":"input[type='search']"},
			{"host":"www.google.com", "element":"#rhs","elementInput":"input[type='text']"},
			{"host":"www.google.com.hk","element":"#rhs","elementInput":"input[type='text']"}
		];
		this.defaultNavigationData =  [
			{"name":"资源搜索","list":[
				{"name":"百度百科", "url":"https://baike.baidu.com/item/@@"},
				{"name":"知乎搜索", "url":"https://www.zhihu.com/search?type=content&q=@@"},
				{"name":"B站搜索", "url":"https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851"},
				{"name":"财经雪球", "url":"https://xueqiu.com/k?q=@@"},
				{"name":"抖音搜索", "url":"https://www.douyin.com/search/@@"},
				{"name":"搜狗|公众号", "url":"https://weixin.sogou.com/weixin?type=2&query=@@"},
				{"name":"豆瓣搜索", "url":"https://www.douban.com/search?q=@@"},
				{"name":"维基百科", "url":"https://en.wikipedia.org/w/index.php?search=@@"},
				{"name":"法律法规", "url":"https://www.pkulaw.com/law/chl?Keywords=@@"},
				{"name":"icon搜索", "url":"https://www.iconfont.cn/search/index?searchType=icon&q=@@"},
				{"name":"github", "url":"https://github.com/search?q=@@"},
				{"name":"csdn", "url":"https://so.csdn.net/so/search?q=@@&t=&u="},
				{"name":"stackoverflow", "url":"https://stackoverflow.com/"},
			]},
			{"name":"搜索引擎","list":[
				{"name":"百度", "url":"https://www.baidu.com/s?wd=@@"},
				{"name":"必应", "url":"https://cn.bing.com/search?q=@@"},
				{"name":"google", "url":"https://www.google.com/search?q=@@"},
				{"name":"360搜索", "url":"https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@"},
				{"name":"搜狗", "url":"https://www.sogou.com/web?query=@@"},
				{"name":"头条搜索", "url":"https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@"},
				{"name":"yandex", "url":"https://yandex.com/search/?text=@@"}
			]}
		];
		this.getNavigationData = function(element, elementInput){
			const self = this;
			let navigationData = self.defaultNavigationData;
			let finalNavigationData = null;
			try{
				//自定义的数据
				let customNavigationData = commonFunctionObject.GMgetValue(self.customNavigationkey, null);
				if(!!customNavigationData){
					finalNavigationData = [].concat(customNavigationData);
				}else{
					finalNavigationData = navigationData;
				}
			}catch(e){
				finalNavigationData = navigationData;
			}
			self.createHtml(element, elementInput, finalNavigationData);
		};
		this.createCss = function(elementNum){
			var innnerCss = `
				.ddfdfd`+elementNum+`dffssqa{
					margin-top:15px;
				}
				.ddfdfd`+elementNum+`dffssqa:nth-last{
					margin-top:0px;
				}
				.ddfdfd`+elementNum+`dffssqa>.title{
					font-size:16px;
					color:#000;
				}
				.ddfdfd`+elementNum+`dffssqa>.content-list{
					
				}
				.ddfdfd`+elementNum+`dffssqa>.content-list>a{
					display:inline-block;
					border:1px solid #ece5e5;
					border-radius:4px;
					text-align:center;
					margin-right:10px;
					margin-top:6px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow:ellipsis;
					padding:2px 5px;
					box-sizing:border-box;
					line-height:20px;
					font-size:14px!important;
					text-decoration: none;
				}
				.ddfdfd`+elementNum+`dffssqa>.content-list>a:hover{
					text-decoration: underline;
				}
			`;
			if($("#plugin_css_style_dddsoo").length==0){
				$("body").prepend("<style id='plugin_css_style_dddsoo'>"+innnerCss+"</style>");
			}
		};
		this.showSetingDialog = function(){
			const self = this;
			
			var customNavigationData = "";
			const customNavigation = commonFunctionObject.GMgetValue(self.customNavigationkey, null);
			if(!!customNavigation){
				customNavigationData = JSON.stringify(customNavigation, null, 4);
			}
			const content = `
				<div>
					<div style="font-size:13px;color:red;">
						注意事项如下：
						<br>1、请严格按照格式添加，否则不生效
						<br>2、数据为json格式，请确保json格式正确，必要时请到<a target="_blank" href="https://www.json.cn/">https://www.json.cn/</a>校验
						<br>3、点击下面”示例“按钮，查看具体格式情况
						<br>4、链接中的搜索关键词请用”@@“代替，脚本会自动替换成当前搜索词。例如：https://www.baidu.com/s?wd=@@
						<br>5、大家可以自定义导航数据，<b>但是必须要注意数据格式，发现出现错误，可点“初始化”</b>
					</div>
					<div style="margin-top:5px;height:200px;width:100%;">
						<textarea 
							placeholder="请严格按照格式填写，否则不生效"
							class="navigation-textarea"
							style="color:#000;font-size:14px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;padding:5px;height:100%;width:100%;Overflow:auto;border:1px solid #ccc;resize:none;background-color:#FFF;outline:none;">`+customNavigationData+`</textarea>
					</div>
					<div style="text-align:center;margin-top:15px;">
						<button class="navigation-init" style="color:#000;cursor:pointer;">初始化</button>
						<button class="navigation-example" style="color:#000;cursor:pointer;">示例</button>
						<button class="navigation-clear" style="color:#000;cursor:pointer;">清空</button>
						<button class="navigation-save" style="color:#000;cursor:pointer;">保存自定义导航</button>
					</div>
				</div>
			`;
			popup.dialog({
				"title":"自定义添加导航",
				"content":content,
				"onContentReady":function($that){
					var $navigationExample = $that.dialogContent.querySelector(".navigation-example");
					var $navigationClear = $that.dialogContent.querySelector(".navigation-clear");
					var $navigationSave = $that.dialogContent.querySelector(".navigation-save");
					var $navigationInit = $that.dialogContent.querySelector(".navigation-init");
					
					var $textarea = $that.dialogContent.querySelector(".navigation-textarea");
					$navigationExample.addEventListener("click", function(){
						$textarea.value = JSON.stringify(self.defaultNavigationData, null, 4);
					});
					$navigationClear.addEventListener("click", function(){
						$textarea.value = "";
					});
					$navigationInit.addEventListener("click", function(){
						$textarea.value = "";
						commonFunctionObject.GMsetValue(self.customNavigationkey, null);
					});
					$navigationSave.addEventListener("click", function(){
						var content = $textarea.value;
						if(!content){
							commonFunctionObject.GMsetValue(self.customNavigationkey, null);
							commonFunctionObject.webToast({"message":"保存成功：数据为空", "background":"#FF4D40"});
							return;
						}
						if(content.length==0 || content.indexOf("{")==-1 || content.indexOf("[")==-1){
							commonFunctionObject.webToast({"message":"格式错误，请更正", "background":"#FF4D40"});
							return;
						}
						try{
							var contentJson = JSON.parse(content);
							if(Array.isArray(contentJson)){ //开始必须是数组
								var isOK = true;
								for(var i=0; i<contentJson.length; i++) {
									if(Array.isArray(contentJson[i])){ //此处必须是对象
										isOK = false;
										break;
									}
									if(!contentJson[i].hasOwnProperty("name") || !contentJson[i].hasOwnProperty("list")){
										isOK = false;
										break;
									}
									if(typeof(contentJson[i]["name"])!="string"){
										isOK = false;
										break;
									}
									if(!Array.isArray(contentJson[i]["list"])){ //此处必须是数组
										isOK = false;
										break;
									}
									for(var j=0; j<contentJson[i]["list"].length; j++){
										if(!contentJson[i]["list"][j].hasOwnProperty("name") || !contentJson[i]["list"][j].hasOwnProperty("url")){
											isOK = false;
											break;
										}
										if(typeof(contentJson[i]["list"][j]["name"])!="string" || typeof(contentJson[i]["list"][j]["url"])!="string"){
											isOK = false;
											break;
										}
									}
									if(!isOK){
										break;
									}
								}
								if(isOK){
									commonFunctionObject.GMsetValue(self.customNavigationkey, contentJson);
									commonFunctionObject.webToast({"message":"保存成功", "background":"#FF4D40"});
								}else{
									commonFunctionObject.webToast({"message":"格式错误，请更正", "background":"#FF4D40"});
								}
							}else{
								commonFunctionObject.webToast({"message":"格式错误，请更正", "background":"#FF4D40"});
							}
						}catch(e){
							commonFunctionObject.webToast({"message":"格式错误，请更正", "background":"#FF4D40"});
						}
					});
				}
			})
		}
		this.createHtml = function(element, elementInput, navigationData){
			$("#dsdsd99mmmjj7760011").remove();
			
			var isComplate = true;
			const host = window.location.host;
			const self = this;
			const elementNum = commonFunctionObject.randomNumber();
			const elementInterval = setInterval(function(){
				if(isComplate){
					var $element = $(element);
					var $box = $("#dsdsd99mmmjj7760011");
					isComplate = false;
					if($element.length!=0 && $box.length==0){
						var html = "";
						html  += "<div id='dsdsd99mmmjj7760011'>";
						for(var i=0; i<navigationData.length; i++){
							html  += "<div class='ddfdfd"+elementNum+"dffssqa'>";
							html  += "<div class='title'><b>"+navigationData[i].name+"</b></div>";
							html  += "<div class='content-list'>";
							for(var j=0;j<navigationData[i].list.length;j++){
								let url = navigationData[i].list[j].url;
								let name = navigationData[i].list[j].name;
								html += "<a target='_blank' name='navigation' data-url='"+url+"' href='javascript:void(0);'>"+name+"</a>"				
							}
							html += "</div>";
							html += "</div>";
						}
						//<a target='_blank' href='https://greasyfork.org/zh-CN/scripts/469407'></a>
						html += `
							<div style='margin-bottom:10px;margin-top:5px;font-size:12px;'>
								*该数据由油猴脚本提供
								&nbsp;&nbsp;
								<a href="javascript:void(0);" name="customNavigation">
									🔧自定义网址
								</a>
							</div>`;
						html += "</div>";
						
						//添加css 添加html
						self.createCss(elementNum);
						$element.prepend(html);
						
						$("#dsdsd99mmmjj7760011 a[name='navigation']").on("click", function(e){
							commonFunctionObject.GMopenInTab($(this).data("url").replace("@@",$(elementInput).val()));
							e.preventDefault()
						});
						
						$("#dsdsd99mmmjj7760011 a[name='customNavigation']").on("click", function(e){
							self.showSetingDialog();
							e.preventDefault()
						})
					}
					isComplate = true;
				}
			}, 100);			
		};
		this.hookBaidu = function(){
			let items = document.querySelectorAll("#content_left>div");
			for(let item of items){
				//给处理完成的做一个标识
				if(!!item.getAttribute("baidu_dealxx")){
					continue;
				}
				item.setAttribute("baidu_dealxx","--");
				
				let a = item.querySelector("a");
				if(!a || !a.href){
					continue;
				}
				
				//标注了html网址的忽略
				let OP_LOG_LINK = item.querySelector(".OP_LOG_LINK");
				if(!!OP_LOG_LINK && OP_LOG_LINK.innerText.search("http")!=-1){
					continue;
				}
				
				//有多个点击点的忽略
				let cGapBottomSmall = item.querySelector(".c-gap-bottom-small");
				if(!!cGapBottomSmall){
					continue;
				}
								
				//https://www.baidu.com/s?wd=一夜醒来欠地铁600多万?官方回应
				if (a.href.includes("www.baidu.com/link?url=")) {
					let url = item.getAttribute("mu");
					if (url && url != null && !url.includes("nourl.ubs.baidu.com")) {
						a.href = url;
						item.innerHTML += `<div style="color:#ccc;font-size:12px;display:flex;align-items:center;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;">
											<img style="width:15px;height:15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKhJREFUOE+9k9ENwjAMBc8RA7AR7UhMQDsBszBBw0YMAAmKrBS3pM1HpOb/ne9ZjtD4pDHPEYBTB2FSU9fD21vrisEcHsF5BS0hFYCLwAhh0KkZGOZcBSATyAM4K8QNEC8Q+1yjAEhTPjeQ50+bq0KW4QRZAWxnXsBdO4euFC4AbOe1fvlijEGebrecOqeXl/gP2aiwr125g2wSvd321skfccr7363Z4Asklz4RHmdA1gAAAABJRU5ErkJggg=="/>
											<a style="color:#626675;" href="`+url+`" target="_blank">`+url+`</a>
										</div>`;
					}
				}
				
				let itemNews = item.querySelectorAll("[class^=single-card-wrapper] div,[class^=group-wrapper] div");
				if(!itemNews){
					continue;
				}
				//single-card-wrapper: https://www.baidu.com/s?ie=UTF-8&wd=es6                          xxx的最新相关信息
				//group-wrapper:       https://www.baidu.com/s?ie=UTF-8&wd=五一消费成绩单折射市场活力     资讯
				for(let itemNew of itemNews){
					let dataUrl = null;
					let divs = itemNew.querySelectorAll("div");
					for (let div of divs) {
						if ((dataUrl = div.getAttribute("data-url"))) {
							let a = itemNew.querySelector("a");
							a.setAttribute("href", dataUrl);
						}
					}
				}
			}
		};
		this.hookGoogle = function(){
			let items = document.querySelectorAll("#center_col a");
			for(let a of items){
				if(!a.getAttribute("target")) a.setAttribute("target","_blank");
			}
		};
		this.hooks = function(){
			const host = window.location.host;
			const href = window.location.href;
			const self = this;
			setInterval(function(){
				if(host==="www.baidu.com"){
					self.hookBaidu();
				}else if(host==="www.google.com" || host==="www.google.com.hk"){
					self.hookGoogle();
				}
			}, 300);
		};
		this.show = function(){
			const self = this;
			const host = window.location.host;
			const href = window.location.href;
			if((host==="www.baidu.com")
				|| (host==="www.so.com" && href.indexOf("www.so.com/s")!=-1)
				|| (host==="www.sogou.com" && (href.indexOf("www.sogou.com/web")!=-1 || href.indexOf("www.sogou.com/sogou")!=-1))
				|| (host==="cn.bing.com" && href.indexOf("cn.bing.com/search")!=-1)
				|| (host==="www.bing.com" && href.indexOf("www.bing.com/search")!=-1)
				|| (host==="www4.bing.com" && href.indexOf("www4.bing.com/search")!=-1)
				|| (host==="so.toutiao.com" && href.indexOf("so.toutiao.com/search")!=-1)
				|| (host==="www.google.com" && href.indexOf("www.google.com/search")!=-1)
				|| (host==="www.google.com.hk" && href.indexOf("www.google.com.hk/search")!=-1)){
				let currentSearchEnginesData = null;
				for(var i=0; i<self.searchEnginesData.length; i++){
					if(host===self.searchEnginesData[i].host){
						currentSearchEnginesData = self.searchEnginesData[i];
					}
				}
				if(currentSearchEnginesData!=null){
					self.getNavigationData(currentSearchEnginesData.element, currentSearchEnginesData.elementInput);
				}
				self.hooks();
			}
		};
		this.start = function(){
			this.show();
		};
	}
		
	//领券公共方法
	class CommonTools{
		request(mothed, url, param){
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
							resolve({"code":"success", "result":responseText});
						}else{
							reject({"code":"error", "result":null});
						}
					}
				});
			})
		}
		randomNumber(){
			return Math.ceil(Math.random()*100000000);
		}
		getPlatform(url = window.location.href){
			let platform = "";
			if(url.indexOf("detail.tmall")!=-1 || url.indexOf("tmall.hk")!=-1){
				platform = "tmall";
			}else if(url.indexOf("taobao.com")!=-1 || url.indexOf("maiyao.liangxinyao.com")!=-1){
				platform = "taobao";
			}else if(url.indexOf("jd.com")!=-1 || url.indexOf("npcitem.jd.hk")!=-1 || url.indexOf("yiyaojd.com")!=-1){
				platform = "jd";
			}
			return platform;
		}
		getParamterQueryUrl(text, tag) { //查询GET请求url中的参数
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
		}
		getEndHtmlIdByUrl(url){
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
		}
		getElementAsync(selector, allowEmpty = true, delay=200){
			return new Promise((resolve,reject) =>{
				let totalDelay = 0;
				let elementInterval = setInterval(()=>{
					if(totalDelay >= 3000){ //总共检查3s，如果还是没找到，则返回
						reject(false);
						clearInterval(elementInterval);
					}
					let element = document.querySelector(selector);
					let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
					if(result){
						clearInterval(elementInterval);
						resolve(element);
					}else{
						totalDelay += delay;
					}
				}, delay);
			});
		}
	}
	(new searchEnginesNavigation()).start();
})();