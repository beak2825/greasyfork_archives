// ==UserScript==
// @name              解锁VIP视频（解锁内嵌播放体验更佳）
// @namespace         VIP播放终端
// @version           0.1
// @description       VIP支持：腾讯视频、爱奇艺、优酷、芒果TV、搜孤视频、哔哩哔哩、聚力视频、乐视视频、1905电影网
// @author            杨振博
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=
// @include           *://*.youku.com/v_*
// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://*.baofeng.com/play/*
// @include           *://vip.pptv.com/show/*
// @include           *://v.pptv.com/show/*
// @include           *://www.le.com/ptv/vplay/*
// @include           *://www.wasu.cn/Play/show/*
//---------------------------------------------------
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/v_*
// @include           *://m.iqiyi.com/w_*
// @include           *://m.iqiyi.com/a_*
// @include           *://m.youku.com/alipay_video/*
// @include           *://https://m.youku.com/video/id_*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.film.sohu.com/album/*
// @include           *://m.le.com/ptv/vplay/*
// @include           *://m.pptv.com/show/*
// @include           *://m.acfun.cn/v/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/bangumi/play/*
// @include           *://m.wasu.cn/Play/show/*


// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @connect			  tt.shuqiandiqiu.com
// @connect           api.bilibili.com
// @connect           api.staticj.top
// @connect           cdn.jsdelivr.net
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
// @antifeature  	  referral-link
// @original-author   杨某
// @original-license  AGPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/390952
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/462617/%E8%A7%A3%E9%94%81VIP%E8%A7%86%E9%A2%91%EF%BC%88%E8%A7%A3%E9%94%81%E5%86%85%E5%B5%8C%E6%92%AD%E6%94%BE%E4%BD%93%E9%AA%8C%E6%9B%B4%E4%BD%B3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462617/%E8%A7%A3%E9%94%81VIP%E8%A7%86%E9%A2%91%EF%BC%88%E8%A7%A3%E9%94%81%E5%86%85%E5%B5%8C%E6%92%AD%E6%94%BE%E4%BD%93%E9%AA%8C%E6%9B%B4%E4%BD%B3%EF%BC%89.meta.js
// ==/UserScript==

(function () {
	'use strict';
	if(window.top != window.self){
		return;
	}
	//如果本地值不能满足需求，可自定义添加接口到此处
	//注意数据格式
	//showType=1(仅PC), showType=2(仅mobile), showType=3(同时显示)
	const customizeInterfaceList=[
		//{ name:"接口名称",url:"https://jx.idc126.net/jx/?url=", "showType":3},
		//{ name:"接口名称", url:"https://jx.idc126.net/jx/?url=", "showType":3},
	];
	//true:对应功能打开，false:对应功能关闭
	const functionController={
		"superVideoHelper":true,           //VIP视频破解
	}
	//视频vip解析收集自脚本：
	//https://greasyfork.org/zh-CN/scripts/390952（398195）
	//默认自动解析接口序号，可自定义修改顺序
	const defaultVipInterfaceIndex = 2;

	const originalInterfaceList = [
        {"name":"综合/B站大会员","url":"https://jx.bozrc.com:4433/player/?url=", "showType":3},
        {"name":"夜幕/B站大会员","url":"https://www.yemu.xyz/?url=", "showType":3},
        {"name":"小七/B站大会员","url":"https://jx.nnxv.cn/tv.php?url=", "showType":3},
        {"name":"虾米/可以选集","url":"https://jx.xmflv.com/?url=", "showType":3},
        {"name":"playerjy","url":"https://jx.playerjy.com/?url=", "showType":1},
        {"name":"云解析","url":"https://jx.ppflv.com/?url=", "showType":3},
        {"name":"全民解析¹","url":"https://chaxun.truechat365.com/?url=", "showType":3},
        {"name":"冰豆/可以选集","url": "https://api.qianqi.net/vip/?url=", "showType":3},
        {"name":"有广告/B站","url":"https://z1.m1907.top/?jx=", "showType":1},
        {"name":"爱豆","url":"https://jx.aidouer.net/?url=", "showType":3},
        {"name":"解析la","url":"https://api.jiexi.la/?url=", "showType":3},
        {"name":"铭人","url":"https://parse.mw0.cc/?url=", "showType":3},
        {"name":"M3U8.TV","url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
        {"name":"OK","url":"https://api.okjx.cc:3389/jx.php?url=", "showType":3},
        {"name":"OKJX","url":"https://okjx.cc/?url=", "showType":3},
        {"name":"PM","url":"https://www.playm3u8.cn/jiexi.php?url=","showType":3},
        {"name":"H8","url":"https://www.h8jx.com/jiexi.php?url=", "showType":3},
        {"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url=", "showType":3},
        {"name":"ckmov","url":"https://www.ckmov.vip/api.php?url=", "showType":3},
        {"name":"ccyjjd","url":"https://ckmov.ccyjjd.com/ckmov/?url=", "showType":3},
        {"name":"无名","url":"https://www.administratorw.com/video.php?url=", "showType":1},
        {"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url=", "showType":3},
        {"name":"8090","url":"https://www.8090g.cn/?url=", "showType":3},
        {"name":"诺讯","url":"https://www.nxflv.com/?url=", "showType":1},
        {"name":"云逸","url":"https://jx.iztyy.com/Bei/?url=", "showType":3},
        {"name":"云析/可以选集","url":"https://jx.yparse.com/index.php?url=","showType":3},
        {"name":"七彩","url": "https://www.xymav.com/?url=", "showType":3},
        {"name":"MAO","url":"https://www.mtosz.com/m3u8.php?url=", "showType":1},
        {"name":"laobandq","url": "https://vip.laobandq.com/jiexi.php?url=", "showType":1},
        {"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url=","showType":1},
        {"name":"盘古云/随机蓝光","url":"https://go.yh0523.cn/y.cy?url=", "showType":1},
        {"name":"思古","url":"https://jsap.attakids.com/?url=","showType":3},
        {"name":"听乐/可能有广告","url":"https://jx.dj6u.com/?url=", "showType":1},
        {"name":"4K蓝光/有时失效，多点几次","url":"https://jx.4kdv.com/?url=", "showType":1},
	];

	//自定义接口和默认接口绑定
	let newOriginalInterfaceList = originalInterfaceList;
	try{
		newOriginalInterfaceList = customizeInterfaceList.concat(originalInterfaceList);
	}catch(e){
		console.log("自定义解析接口错误，注意数据格式....");
	}

	/**
	 * 共有方法，全局共享
	 */
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
		this.GMopenInTab = function(url, open_in_background){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, open_in_background);
			} else {
				GM.openInTab(url, open_in_background);
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
				    z-index: 9999;
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
		    if(background==undefined || background==''){
		    	el.style.backgroundColor=background;
		    }
		    //字体颜色
		    if(color==undefined || color==''){
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
		},
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
	}
	const commonFunctionObject = new commonFunction();  //全局统一变量
	commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加

	if(!commonFunctionObject.isPC()){  //移动端只执行视频VIP解析功能
		functionController.superMusicHelper = false;
		functionController.queryCoupon = false;
		functionController.wangpanSearchEnginesHelper = false;
		functionController.abroadVideoHelper = false;
		functionController.searchEnginesNavigation = false;
	}

	function superVideoHelper(originalInterfaceList){
		this.originalInterfaceList = originalInterfaceList;
		this.checkbox_true_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA2tJREFUaEPtmkvoTV0Yxn/PUCZiRPK5DQ1IzHwToUxIriW55FoGRMiEci+XgVyj3HKPzy2RFEqJUAYShUgpvpJSUq9erfPv2J2999r7f5yzyapzdqf9Xp5nvWu96z1rLZFoZtYbGAUMD88BSZkW/34BXAfu+VPSm3r/qv9hZtuAGUCPFoOMdfcBOCxpaU2hg4CZWayVKshJ+oH9x5eZTQWOVwFYAQzTJJ2QmXUHHgB9CyhXQfQlMNQJzAP2VgFRCQzzncARYHoJ5SqoHHUCHop/qoCmBIZXTuC3yj5Jkn8JlAh7noqPiClB6FSecNUi8A2YKulsWJ8mAZkkqkTgq/e8pPOJ8iaTRFUIfAk9f6FBcekLrddADVsVCHwO4C83Qmhmq4F1VSXwKQybqyngFwK7siZyOyPwf+j5ayngowrMdhHwMe0T9kYK+NGAT+YuVUyj70PP30wBPyyA75UH3t+3OgLvAvhbKeD7A/8Bg2LAFyEwPxhcA/SMNZ6QexvA30kB3y2A/7eI/ZgITJZ0OqyM3jObgbFFnACvA/i7aXpm5mN+XEG7uUOoA3xidfS87Pk5pnm57hPWdxUaNjM7CMyKMZaUyYrAS0n9MpxOCNEYmOHYt0S8trmfYWcr0LHLUJRE3hA6IWlahnMn6EPK65VkexbAP8zQz1xlY8jkEXAbhyTNzDJmZquADXUyTwP4xxngc1fZZhFwO/sl+Z//1GZmY4D1QWCmpCcZ4CcDJ2MA5snERKBmY6ekxXkG896b2UjgYswqm2fL3xch4PJbJS2LMdxIxsyGAJeAqFU2xk9RAm5zg6TYFNqBwcz6AF4yR6+yv4qA210jaW2MA5cxs67AFaDQKhtjv0wEanZXSvIUmtvM7BwwPlewhEBnCLi7JZJ25GSnA8DsEtiiVDpLwJ0skrQ7ZdJuAZZHISkp1AwC7nqOJK9n6iftCmBTSVzRas0i4A6nSzoWJu1cYF80ik4INpOAw6gVZX5U1ZLWbAItAV3v5C+Blnd5wqFH4DnQ7rPgsv3wwgl4Dl9Q1kKb9fY4Af8v+lMObzOoIu5nOwG/WvCowqfzaYR8d29w7aDb8/aSItQrILvdrxz8GVcNar0ZrhxsrPCpve8xrfIrBjXMP91WCXWMn4hMBEaET7vPkF8Bt8PnjKSP9cP3OwcygZO3wEsCAAAAAElFTkSuQmCC";
		this.checkbox_false_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAaZJREFUaEPtmk1OAkEUhL86iH9bPYDRqJGVJzDRK+jerbB154Yr6F4X7iTizwVcuRHxIM9MwpChAQP0YxhIdzIhDPOqX1V1z6ILseRDS94/q0nAzM6AC2AN2FywSx3gF2hKug97GXLAzK6B+oKbHjd9XVKj+OMAATPbA94r2nze1r6kj/xLSKANHFScwKukw3EEfoD1gMAD8Ah8lUxsGzgFjoN5u5I2xhGw4OE3SQt1xMyeQxKS+isnXEIhgaFNU7ILmFnmQEaiP6YhUJPUKrvpcD4zGxA2ESjbkeRA2YqnPVBQIL2FPJZf2sQeKsZgJAdi1POoTQ54qBiDkRyIUc+jNjngoWIMRnIgRj2P2uSAh4oxGMmBGPU8apMDHirGYCQHYtTzqI1x4FJS06OJWTHM7AR4KtZPczbaklSbdXKPOjP7BHYmJfA9ItTLTqcbZZ9Sm9kucAtkn8XRkbSV3wjzgRegH994KDgHjLako3EEsnj1bg6TekKeF+PW1YpZc5l6cetNL/ALQz9PNSfB6gLZdVWMV0cuoUnQqvbMav5Xomoq/9fPH0I4X0Cu+FOiAAAAAElFTkSuQmCC";
		this.elementId = Math.ceil(Math.random()*100000000)+"mmx";
		this.innerPlayerSaveKey = "inner_isopen_SUhEUgAAADAAAAAwCAY";
		this.playerNodes = [
			{ url:"v.qq.com", node:"#player"},
			{ url:"www.iqiyi.com", node:"#flashbox"},
			{ url:"v.youku.com", node:"#player"},
			{ url:"w.mgtv.com", node:"#mgtv-player-wrap"},
			{ url:"www.mgtv.com", node:"#mgtv-player-wrap"},
			{ url:"tv.sohu.com", node:"#player"},
			{ url:"film.sohu.com", node:"#playerWrap"},
			{ url:"www.le.com", node:"#le_playbox"},
			{ url:"video.tudou.com", node:".td-playbox"},
			{ url:"v.pptv.com", node:"#pptv_playpage_box"},
			{ url:"vip.pptv.com", node:".w-video"},
			{ url:"www.wasu.cn", node:"#flashContent"},
			{ url:"www.acfun.cn", node:"#player"},
			{ url:"www.bilibili.com", node:"#bilibili-player"},
			{ url:"vip.1905.com", node:"#player"},
		];
		this.isRun = function(){ //判断是否运行
			const host = window.location.host;
			const urls = ["www.iqiyi.com","v.qq.com","youku.com", "www.le.com","mgtv.com","sohu.com", "acfun.cn","bilibili.com","baofeng.com","pptv.com"];
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
			var node = null;
			for(var i in this.playerNodes) { //获得窗口ID
				if (this.playerNodes[i].url == window.location.host) {
					node = this.playerNodes[i].node;
					break;
				}
			}
			if(!node){
				console.log("播放node查找失败....");
				return;
			}
			$("#ddddd12235500kknnn").remove();
			var url = playObject.url + window.location.href;
			var videoPlayer = "<div style='width:100%;height:100%;z-index:1000;' id='ddddd12235500kknnn'><iframe id='iframe-player-99087lkj' src='"+url+"' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>";
			var category = playObject.category;
			if(commonFunctionObject.GMgetValue(this.innerPlayerSaveKey, null)==="true"){
				var $player = $(node);
				$player.empty();
				$player.html(videoPlayer);
			}else{
				commonFunctionObject.GMopenInTab(url, false);
			}
		};
		this.addHtmlElements = function(){  //添加HTML
			const vipVideoImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=";
			const playedImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABMhJREFUaEPtWUuoHUUQPce9nyS40/hBEcHPwi+ioCCKn4hBDaLiwoVBJbuAiS6MLqJRgiL4SwQ3ipAgBmOMiBiDAZXowkQQ4weNoqIYjXHjQo6c2P3o12/mTs29c5EHNgyPd6er6pzu6uqqGmKeD85z/PifQN5BSccDWALgDACLi+cIAD8C+KH4u4PktiF2f6IdkHQOgCvSc2lPQPsBPA9gC8m9PWVnpo9FIAG/E4CfIcZWACtJ7uurrDcBSc+NAL4LwNsAvkzPFwD+rlzqTAC3ADi6AmsC66dKQNJ7AC6ujHj1Nhs4Sft6aEi6CUB+LLOA5O8h4WJSeAckfZtWMosb+AaSr/c1Ws6XdCLJb7p+a7MRIiBJlYLVJB+ZBHibrKRrAXhxQLITX+cESZ8AOKswuJTklmmAt05Jm5Jr+d+T6t2p7Y4kUCkLrcgQxFKg2Bpxz1YCDdHmXJIfDwFwSB2NBFKc/6gwtJzkhiENR3VJOgbADQA2kTwUcqFq9b2V10UNDj2vCCC7SZ7fSaBh9ZdEfHFo4OlAHwfgu0L3lSTfKm3NcSFJDwBYkyaFV7+Qs+wTJA8OQUrSaylJtLqNJGelL00EPgBwQTJ+B8kXIkCqu+LzROLZiOyoOZIM2OmLxwGSi1p3QNLJAL4qJiwmWW5hq62Gy85zdwJ4lOQbkxCR9AeAI5OOG0m+kvXN2gFJKwA8mV42Hpo2IC0E8nRfTreT/GscIlVQWU9yZRuBpwHclV6uIflg1GAHgaxmLcn7ozrzPEnGZGweL5N0Nnt41DvgxOya9O42ki9FjQUJWN0vAG4m+U4P3caUk8Z3SV7WRmAPAOfrHheS/LCHkTrh6xLdSTJUxUkyJmPz2EfytDYCzsdzobGI5IEuFMU29yVg0c0kl3XZkGRMuVY4RPKoCIGFJH/rUj4hgfdJXtRlQ9ICh9A07yBJpxeNZ6B0oV7JW48zkG0/BuAhkn8GCLh5kHOzvSRn0vtRh3gZSZeKodGDgA/jOpKun0MjlZ8OxR7bSLroadyBMoyuIrkuZOHfQqTrDPiCNPCNUZ2Fe94LIFeAz5C8u42AXzyVXm4neXXUWAeBx9ON/FNUXzlPkm/yq9Jv95DMd8Kce8DdNTec8ghHohYCbybgO8YBbhlJCwH8WsjPSm+akjkby/E5fJlJ+hnAscmQOxjOgWZWagICtwJ4McnPusT8WxOB1QDWJoG+6bSJf5p8/ftxQVfuU6bT95F8uHzfRKAMWZ77XxY0My2WBHpOaG+ricv2YXgXhljxEavvJtry2ka0qJ9aI6uNtKRVAEp3abxY+7RVptrQqlb+egCvFr81rn7jIa4UzWrmRlp9Q7hRFZJ3kbykTW+ktVg3dXvlSH0INXRE9pM8YZSOTgLpMqnThMEbXVXxfhhzZMdDBBKJusk7VHvdodKdB39fy2MPybMjuxcmkEiUneOs30R84PyBI9rBcMpyOYClFXDrDBU52XgvAonEqE9Mu53uVp+YLHYqgFPS4/r2vJbVbY02Yx/iJsEpfORz49jge3e/e+9AFWaddtiHnermbl7EdT3HDYPt7jaMA3xsFxpxc7qrZ/c4vfoqaRGn6Pn5LFVVX0eZThxGhzA0LR0TudC0QPXRO+8J/AOnYvFAtGhKvAAAAABJRU5ErkJggg==";
			const currentHost = window.location.host;

			var category_1_html = "";
			this.originalInterfaceList.forEach((item, index) => {
				if(item.showType != 2){
					category_1_html += "<span title='"+item.name+"' data-index='"+index+"'>" + item.name + "</span>";
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
			var color = "#FF4D40";
			var hoverColor = "#000000";
			if(currentHost.indexOf("bilibili.com")!=-1){ //自定义主题
				color = "#fb7299";
				hoverColor = "#00B0E1";
			}
			var cssMould = `#vip_movie_box`+this.elementId+`{cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:99999999; font-size:16px; text-align:left;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`{width:26px; height:32px;line-height:32px;text-align:center;background-color:`+color+`;}
							#vip_movie_box`+this.elementId+` .img_box`+this.elementId+`>img {width:20px; display:inline-block; vertical-align:middle;}

							#vip_movie_box`+this.elementId+` .showhide_box`+this.elementId+`{display:none;padding-left:5px;position: absolute;left: 26px;top: 0;}
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

			//判断自动解析状态
			var checkboxImage = "";
			if(!!commonFunctionObject.GMgetValue(this.innerPlayerSaveKey, null)){
				checkboxImage = this.checkbox_true_image;
			}else{
				checkboxImage = this.checkbox_false_image;
			}

			//加入HTML
			var htmlMould = `<div id='vip_movie_box`+this.elementId+`'>
								<div class='plugin_inner_`+this.elementId+`'>
									<div class="img_box`+this.elementId+`" id="img_box_jump_6667897iio"><img src='`+ vipVideoImageBase64 +`' title='选择解析线路'/></div>
									<div class='showhide_box`+this.elementId+`'>
										<div class='vip_mod_box_action_687ii default-scrollbar-55678'>
											<div class='item_box`+this.elementId+`'>
												<div class='title`+this.elementId+`'><b>解析说明：（选中左侧单选框开启内嵌播放）</b></div>
												<div class='content`+this.elementId+`'>
													脚本默认新标签页解析播放，如需要本页播放，请手动打开站内解析！
												</div>
											</div>
											<div class='item_box`+this.elementId+`'>
												<div class='interface_box`+this.elementId+`'>
													` + category_1_html + `
												</div>
											</div>
											<div class='item_box`+this.elementId+`'>
												<div class='title`+this.elementId+`'><b>提醒：</b></div>
												<div class='content`+this.elementId+`'>
													1、视频解析接口中带**号的为视频网站，可以搜索观看想看的视频！<br>
                                                    2、脚本如果不能播放，可以自行更换播放接口。特此声明！<br>
                                                    3、使用内嵌（本页面）播放，如果出现的视频窜音，选择观看的集数后，刷新一下页面 ——[ F5 或 Ctri + R 或 鼠标手动刷新页面 ]，在使用脚本观看，可以有效解决！<br>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="img_box`+this.elementId+`" id="img_box_6667897iio"><img src='`+checkboxImage+`' title='是否打开站内解析？开启后将在本网页解析播放'/></div>
							</div>
							`;
			$("body").append(htmlMould);
		};
		this.removePlatformVipMod = function(){ //移除平台vip弹框提醒
			let host = window.location.host;
			setInterval(function(){
				if(host.indexOf("v.qq.com")!=-1){
					$("#mask_layer").hide();
					$(".mod_vip_popup").hide();
				}
			},200);
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
			});

			//补充事件
			this.removePlatformVipMod(); //移除平台VIP提醒

			//点击视频播放界面
			$("#img_box_jump_6667897iio").on("click", function(){
				commonFunctionObject.GMopenInTab("https://laisoyiba.com/mov/s/?sv=3&url="+window.location.href, false);
			});

			//点击切换解析方式
			$("#img_box_6667897iio").on("click", function(){
				var $image = $(this).find("img");
				var innerPlayerSaveKey = that.innerPlayerSaveKey;
				if(commonFunctionObject.GMgetValue(innerPlayerSaveKey, null)==="true"){
					commonFunctionObject.GMsetValue(innerPlayerSaveKey, null);
					commonFunctionObject.webToast({"message":"站内解析：关闭", "background":"#FFE009"});
					$image.attr("src", that.checkbox_false_image);
				}else{
					var r=confirm("重要提醒：开启站内解析功能，视频解析时脚本会覆盖当前页面播放窗口，如不同意此脚本行为，请点击【取消】按钮！！");
					if(r==true){
						commonFunctionObject.GMsetValue(innerPlayerSaveKey, "true");
						commonFunctionObject.webToast({"message":"站内解析：打开", "background":"#FFE009"});
						$image.attr("src", that.checkbox_true_image);
					}
				}
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
		//借鉴脚本作者：网络, 版权归原作者所有
		//地址：https://greasyfork.org/zh-CN/scripts/370634
		//修改：优化了该段代码的逻辑
		this.pageEventExtend = function(){
			const window_url = window.location.href;
			if(window_url.indexOf('v.qq.com/x/cover') != -1){
				$("body").on('mouseover', '.item a', function(e) {
					let $playerItem = $(this), href = $playerItem.attr('href') || $playerItem.data("href");
					$playerItem.off('click.chrome');
					$playerItem.on('click.chrome', function() {
						window.location.href = href
					}).attr('data-href', href).css({
						cursor: 'pointer'
					}).removeAttr('href')
				});
			}else if(window_url.indexOf('iqiyi.com/v_') != -1){

				function remove(selector) {
					if (!document.querySelectorAll) {
						return;
					}
					var nodes = document.querySelectorAll(selector);
					if (nodes) {
						for (var i = 0; i < nodes.length; i++) {
							if (nodes[i] && nodes[i].parentNode) {
								nodes[i].parentNode.removeChild(nodes[i]);
							}
						}
					}
				};

				function removeObj(targetSelector, rootSelector = 'body', wait) {
					const rootElement = document.querySelector(rootSelector);
					const targetElement = rootElement.querySelector(targetSelector);
					if (targetElement) {
						return Promise.resolve(targetElement)
					}
					return new Promise((resolve, reject) => {
						const callback = function(matationList, observer) {
							const targetElement = rootElement.querySelector(targetSelector);
							if (targetElement) {
								resolve(targetElement);
								observer.disconnect()
							}
						};
						const observer = new MutationObserver(callback);
						observer.observe(rootElement, {
							subtree: true,
							childList: true
						});
						if (wait !== undefined) {
							setTimeout(() => {
								observer.disconnect()
							}, wait)
						}
					})
				};

				async function removeAll(targetSelector, rootSelector, now = false) {
					if (now) {
						const parent = rootSelector ? document.querySelector(rootSelector) : document;
						if (parent) {
							const target = parent.querySelector(targetSelector);
							if (target) {
								target.remove();
								return true
							}
						}
						return false
					}
					const target = await removeObj(targetSelector, rootSelector);
					target.remove()
				};

				setTimeout(()=>{
					remove('div#scrollTip,.qy-glide,#qy-glide,[class^="qy-glide"],[id^="qy-glide"],svg[display="none"][aria-hidden="true"],div[class*="player-side-ear"],div[class^="player-mnb"][data-asyn-pb]');
					removeAll('div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"])', undefined, false);
				},1000);

				$('div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"])').hide();

				$("body").on('mouseover', 'ul li [href*="/v_"][href*=".html"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])', function(e) {
					let $playerItem = $(this), href = $playerItem.attr('href') || $playerItem.data("href");
					$playerItem.off('click.chrome');
					$playerItem.on('click.chrome', function() {
						window.location.href = href
					}).attr('data-href', href).css({
						cursor: 'pointer'
					}).removeAttr('href');
				});
			}else if(window_url.indexOf('bilibili.com/bangumi/') != -1){
				$("body").on('mouseover', '.ep-item a', function(e) {
					let $playerItem = $(this), href = $playerItem.attr('href') || $playerItem.data("href");
					$playerItem.off('click.chrome');
					$playerItem.on('click.chrome', function() {
						window.location.href = href
					}).attr('data-href', href).css({
						cursor: 'pointer'
					}).removeAttr('href');
				})
			}
		};
		this.start = function(){
			try{
				this.pageEventExtend();
			}catch(e){}

			let delayTimeMs = 0;
			if(window.location.host.indexOf("www.bilibili.com")!=-1){
				delayTimeMs = 2000;
			}else{
				delayTimeMs = 1800;
			}

			setTimeout(()=>{
				try{
					this.removeVideoAdBlock();
				}catch(e){}
				try{
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
		this.playerNodes=[
			{"url":"m.iqiyi.com", "node":".m-video-player-wrap", "showNode":".m-video-player-wrap", "color":"#05B03B"},
			{"url":"m.v.qq.com", "node":"#player", "showNode":".mod_player", "color":"#F99D39"},
			{"url":"m.youku.com", "node":"#player", "showNode":".h5-detail-player", "color":"#08BAFD"},
			{"url":"m.mgtv.com", "node":".video-area", "showNode":".video-area", "color":"#E95904"},
			{"url":"m.bilibili.com", "node":".player-container", "showNode":".player-wrapper", "color":"#FB7299"},
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
		this.addHtmlElements = function(){
			let nodeObject = this.getwindowElement();
			if(!nodeObject) return;
			return new Promise((resolve, reject)=>{
				const elementInterval = setInterval(()=>{
					const nodeElementObject = $(nodeObject.showNode), themeColor = nodeObject.color;

					if(nodeElementObject.length == 0) return;
					clearInterval(elementInterval);

					//添加HTML
					var cssMould = `
							#open_modal_warp_`+this.elementId+`{
								margin:15px 15px 50px 15px;
								padding:10px 0px;
								text-align:center;
								background-color:`+themeColor+`;
								border-radius:4px;
								cursor:pointer;
								z-index: 999999999999999999999;
							}
							#open_modal_warp_`+this.elementId+`>div{
								color:#FFF;
							}
							#open_modal_warp_`+this.elementId+`>div:nth-child(1){
								font-size:14px;
								font-weight:700;
								padding:0px;
								margin:0px;
							}
							#open_modal_warp_`+this.elementId+`>div:nth-child(2){
								font-size:10px;
								margin-top:5px;
							}
							#select_interface_modal_warp_`+this.elementId+`{
								position: fixed;
								top: 100px;
								background-color: #FFF;
								z-index: 999999999999999999999;
								left: 15px;
								right: 15px;
								display:none;
								padding:10px;
								border-radius: 3px;
								background-color:#FFFAE8;
								max-height:400px;
								overflow-y: auto;
							}
							#select_interface_modal_warp_`+this.elementId+`>div{
								width:100%;
							}
							#select_interface_modal_warp_`+this.elementId+`>div:nth-child(1) >span{
								display: inline-block;
								background: `+themeColor+`;
								margin-right: 8px;
								height: 10px;
								width: calc(100% * (1/4) - 6px);
								height: 24px;
								line-height: 24px;
								text-align: center;
								margin-top: 10px;
								font-size: 12px;
								border-radius: 3px;
								color: #FFF;
								position:relative;
							}
							#select_interface_modal_warp_`+this.elementId+`>div:nth-child(1) >span:nth-child(4n){
								margin-right:0px;
							}
							#select_interface_modal_warp_`+this.elementId+`>div:nth-child(1) >span.item{

							}
							#select_interface_modal_warp_`+this.elementId+`>div:nth-child(1) >span.item-active:after{
								position: absolute;
								content: " ";
								height: 2px;
								width: 50%;
								background-color: #FFF;
								bottom: 2px;
								left: 50%;
								transform: translateX(-50%);
							}
							#select_interface_modal_warp_`+this.elementId+`>div:nth-child(2){
								text-align:center;
								margin-top:15px;
							}
							#select_interface_modal_warp_`+this.elementId+`>div:nth-child(2) >span.close_modal_btn{
								display:inline-block;
								padding:4px 5px;
								border-radius:3px;
								background-color:#E9DFC4;
								color:#000;
								font-size: 12px;
							}
							`
					commonFunctionObject.GMaddStyle(cssMould);

					//添加HTML
					let category_1_html = "";
					this.originalInterfaceList.forEach((item, index) => {
						if (item.showType != 1) {
							category_1_html += "<span class='item' title='"+item.name+"' data-index='"+index+"'>" + item.name + "</span>";
						}
					});
					var htmlMould = `
						<div id="open_modal_warp_`+this.elementId+`">
							<div>点击选择解析接口</div>
							<div>(请不要相信解析视频中的任何广告)</div>
						</div>
						<div id="select_interface_modal_warp_`+this.elementId+`">
							<div>
								`+category_1_html+`
							</div>
							<div>
								<span class="close_modal_btn">关闭弹框</span>
							</div>
							<div style="font-size:10px;margin-top:10px;">
							免责申明：<br>
							1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见）！"<br>
							2、脚本仅限个人学习交流，特此声明！<br>
							</div>
						</div>
					`;
					$("div[id^='open_modal_warp_']").remove();
					nodeElementObject.after(htmlMould);
					resolve("ok");
				}, 100);
			});
		};
		this.runEvent = function(){	 //事件运行
			const self = this;

			$("body").on("touchstart", "#open_modal_warp_"+this.elementId, function(){
				var $obj = $(this);
				var showmodal = $obj.attr("showmodal");
				if(!showmodal || showmodal==="hide"){
					$("#select_interface_modal_warp_"+self.elementId).show();
					$obj.attr("showmodal", "show");
				}else{
					$("#select_interface_modal_warp_"+self.elementId).hide();
					$obj.attr("showmodal", "hide");
				}
			});

			function operationShowPlayerWindow($obj){
				var index = parseInt($obj.attr("data-index"));
				var playObject = self.originalInterfaceList[index];
				self.showPlayerWindow(playObject);

				$("#select_interface_modal_warp_"+self.elementId).hide();
				$("#open_modal_warp_"+self.elementId).attr("showmodal", "hide");

				$("#select_interface_modal_warp_"+self.elementId+" span.item").removeClass("item-active");
				$obj.addClass("item-active");
			}
			$("body").on("touchstart", "#select_interface_modal_warp_"+this.elementId+" span.item", function(){
				if(commonFunctionObject.GMgetValue("copyright_video_remind_mobile",null)==="true"){
					operationShowPlayerWindow($(this));
				}else{
					var r=confirm(
						"提醒！！！\u000d"+
						"1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见）！\u000d"+
						"2、脚本仅限个人学习交流，特此声明！\u000d"+
						"\u000d"+
						"重要提醒：开启站内解析功能，视频解析时脚本会覆盖当前页面播放窗口，如不同意此脚本行为，请点击【取消】按钮！！"
					);
					if(r==true){
						commonFunctionObject.GMsetValue("copyright_video_remind_mobile","true");
						operationShowPlayerWindow($(this));
					}
				}
			});

			$("body").on("touchstart", "#select_interface_modal_warp_"+this.elementId+" span.close_modal_btn", function(){
				$("#select_interface_modal_warp_"+self.elementId).hide();
				$("#open_modal_warp_"+self.elementId).attr("showmodal", "hide");
			});
		};
		this.showPlayerWindow = function(playObject){	//显示播放窗口
			let nodeObject = this.getwindowElement();
			if(!nodeObject) return;
			const nodeElementObject = $(nodeObject.node);

			$("#ddddd12235500kknnn").remove();
			var url = playObject.url + window.location.href;
			var iframeDivCss = "width:100%;height:100%;position:absolute;z-index:99999999;left:0;top:0;";
			var videoPlayer = "<div style='"+iframeDivCss+"' id='ddddd12235500kknnn'><iframe id='iframe-player-99087lkj' src='"+url+"' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>";
			var category = playObject.category;
			if(nodeElementObject.length != 0){
				nodeElementObject.empty();
				nodeElementObject.html(videoPlayer);
			}
		};
		this.start = function(){
			if(this.isRun()){
				this.addHtmlElements().then(()=>{
					this.runEvent();
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
						"提醒！！！\u000d"+
						"1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见）！\u000d"+
						"2、脚本仅限个人学习交流，特此声明！\u000d"+
						"3、此提醒只弹出一次，确认后，后续将不在弹出，请知悉！"
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
})();