// ==UserScript==
// @name              青鸾阁专线VIP视频线路
// @namespace         super_video_helper_cat
// @version           3.5.9
// @description       【❤️ 视频自动解析，体会拥有VIP的感觉❤️，适配PC+移动 】功能有：1、解锁B站大会员番剧、B站视频解析下载；2、爱奇艺、腾讯、优酷、芒果等全网VIP视频免费破解去广告(免跳出观影特方便)；3、网易云音乐、QQ音乐、酷狗、蜻蜓FM、荔枝FM、喜马拉雅等音乐和有声书音频免客户端下载；4、油管、Facebook等国外视频解析下载；5、网盘搜索引擎(来搜一下:laisoyixia.com, 小猪快盘:xiaozhukuaipan.com)破解无限下载；6、优惠券查询等；7、搜索引擎导航【脚本长期维护更新，完全免费，无广告】
// @author            青鸾阁
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=
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
//---------------------------------------------------
// @include           *://www.youtube.com
// @include           *://www.youtube.com/
// @include           *://www.youtube.com/watch*
// @include           *://www.facebook.com/*
// @include           *://yt1s.com/facebook-downloader
//---------------------------------------------------
// @include      	  *music.163.com*
// @include           *://y.qq.com*
// @include           *://www.kugou.com*
// @include           *://www.kuwo.cn*
// @include           *://www.lizhi.fm*
// @include           *://*.ximalaya.com*
// @include           *://music.migu.cn*
//---------------------------------------------------
// @include           *://*.taobao.com/*
// @include      	  *://*detail.tmall.com/*
// @include      	  *://*detail.tmall.hk/*
// @include           *://*item.jd.com/*
// @include           *://item.yiyaojd.com/*
// @include           *://npcitem.jd.hk/*
// @include           *://www.laisoyixia.com/download/detail**
// @include           *://www.xiaozhukuaipan.com/download/**
//----------------------------------------------------
// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://cn.bing.com/search*
// @include           *://so.toutiao.com/search*

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
// @antifeature  	  referral-link 【此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉】
// @original-author   青鸾阁
// @original-license  AGPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/390952
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/444015/%E9%9D%92%E9%B8%BE%E9%98%81%E4%B8%93%E7%BA%BFVIP%E8%A7%86%E9%A2%91%E7%BA%BF%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/444015/%E9%9D%92%E9%B8%BE%E9%98%81%E4%B8%93%E7%BA%BFVIP%E8%A7%86%E9%A2%91%E7%BA%BF%E8%B7%AF.meta.js
// ==/UserScript==

(function () {
	'use strict';
	if(window.top != window.self){
		return;
	}
	//如果本地值不能满足需求，可自定义添加接口到此处
	//注意数据格式
	//category=1(全网VIP解析内嵌页播放), category=2(全网VIP解析新建页面播放)
	//showType=1(仅PC), showType=2(仅mobile), showType=3(同时显示)
	const customizeInterfaceList=[
		//{ name:"就是名字而已", category:"1", url:"https://jx.idc126.net/jx/?url=", "showType":3},
		//{ name:"就是名字而已", category:"2", url:"https://jx.idc126.net/jx/?url=", "showType":3},
	];
	//true:对应功能打开，false:对应功能关闭
	const functionController={
		"superVideoHelper":true,           //VIP视频破解
		"superMusicHelper":true,           //全网音乐免客户端下载
		"queryCoupon":true,                //优惠券查询
		"wangpanSearchEnginesHelper":true, //网盘搜索引擎破解
		"abroadVideoHelper":true,          //油管等国外网站视频下载
		"searchEnginesNavigation":true     //搜索引擎资源导航
	}
	//视频vip解析收集自脚本：
	//https://greasyfork.org/zh-CN/scripts/390952
	//https://greasyfork.org/zh-CN/scripts/398195
	//默认自动解析接口序号，可自定义修改顺序
	const defaultVipInterfaceIndex = 3;
	
	const originalInterfaceList = [
		{"name":"纯净/B站","category":1,"url":"https://z1.m1907.cn/?jx=", "showType":3},
		{"name":"青鸾阁影视","category":2,"url":"https://jx2.xyq0616.xyz/2986205/?url=", "showType":3},
		{"name":"综合/B站","category":1,"url":"https://vip.parwix.com:4433/player/?url=", "showType":3},
		{"name":"OK解析","category":1,"url":"https://okjx.cc/?url=", "showType":3},
		{"name":"夜幕","category":1,"url":"https://www.yemu.xyz/?url=", "showType":3},
		{"name":"playerjy/B站","category":1,"url":"https://jx.playerjy.com/?url=", "showType":3},
		{"name":"乐多资源","category":1,"url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=", "showType":3},
		{"name":"虾米","category":1,"url":"https://jx.xmflv.com/?url=", "showType":3},
		{"name":"M3U8.TV","category":1,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
		{"name":"人人迷","category":1,"url":"https://jx.blbo.cc:4433/?url=", "showType":3},
		{"name":"全民","category":1,"url":"https://jx.blbo.cc:4433/?url=", "showType":3},
		{"name":"七哥","category":1,"url":"https://jx.mmkv.cn/tv.php?url=", "showType":3},
		{"name":"冰豆","category":1,"url":"https://api.qianqi.net/vip/?url=", "showType":3},
		{"name":"迪奥","category":1,"url":"https://123.1dior.cn/?url=", "showType":3},
		{"name":"CK","category":1,"url":"https://www.ckplayer.vip/jiexi/?url=", "showType":3},
		{"name":"游艺","category":1,"url":"https://api.u1o.net/?url=", "showType":3},
		{"name":"LE","category":1,"url":"https://lecurl.cn/?url=", "showType":3},
		{"name":"ckmov","category":1,"url":"https://www.ckmov.vip/api.php?url=", "showType":3},
		{"name":"ccyjjd","category":1,"url":"https://ckmov.ccyjjd.com/ckmov/?url=", "showType":3},
		{"name":"爱豆","category":1,"url":"https://jx.aidouer.net/?url=", "showType":3},
		{"name":"诺诺","category":1,"url":"https://www.ckmov.com/?url=", "showType":3},
		{"name":"H8","category":1,"url":"https://www.h8jx.com/jiexi.php?url=", "showType":3},
		{"name":"BL","category":1,"url":"https://vip.bljiex.com/?v=", "showType":3},
		{"name":"解析la","category":1,"url":"https://api.jiexi.la/?url=", "showType":3},
		{"name":"MUTV","category":1,"url":"https://jiexi.janan.net/jiexi/?url=", "showType":3},
		{"name":"MAO","category":1,"url":"https://www.mtosz.com/m3u8.php?url=", "showType":3},
		{"name":"老板","category":1,"url":"https://vip.laobandq.com/jiexi.php?url=", "showType":3},
		{"name":"盘古","category":1,"url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":3},
		{"name":"盖世","category":1,"url":"https://www.gai4.com/?url=", "showType":3},
		{"name":"小蒋","category":1,"url":"https://www.kpezp.cn/jlexi.php?url=", "showType":3},
		{"name":"YiTV","category":1,"url":"https://jiexi.us/?url=", "showType":3},
		{"name":"星空","category":1,"url":"http://60jx.com/?url=", "showType":1},
		{"name":"0523","category":1,"url":"https://go.yh0523.cn/y.cy?url=", "showType":1},
		{"name":"17云","category":1,"url":"https://www.1717yun.com/jx/ty.php?url=", "showType":1},
		{"name":"4K","category":1,"url":"https://jx.4kdv.com/?url=", "showType":1},
		{"name":"云析","category":1,"url":"https://jx.yparse.com/index.php?url=", "showType":1},
		{"name":"8090","category":1,"url":"https://www.8090g.cn/?url=", "showType":1},
		{"name":"江湖","category":1,"url":"https://api.jhdyw.vip/?url=", "showType":1},
		{"name":"诺讯","category":1,"url":"https://www.nxflv.com/?url=", "showType":1},
		{"name":"PM","category":1,"url":"https://www.playm3u8.cn/jiexi.php?url=", "showType":1},
		{"name":"奇米","category":1,"url":"https://qimihe.com/?url=", "showType":1},
		{"name":"思云","category":1,"url":"https://jx.ap2p.cn/?url=", "showType":1},
		{"name":"听乐","category":1,"url":"https://jx.dj6u.com/?url=", "showType":1},
		{"name":"aijx","category":1,"url":"https://jiexi.t7g.cn/?url=", "showType":1},
		{"name":"52","category":1,"url":"https://vip.52jiexi.top/?url=", "showType":1},
		{"name":"黑米","category":1,"url":"https://www.myxin.top/jx/api/?url=", "showType":1},
		{"name":"豪华啦","category":1,"url":"https://api.lhh.la/vip/?url=", "showType":1},
		{"name":"凉城","category":1,"url":"https://jx.mw0.cc/?url=", "showType":1},
		{"name":"33t","category":1,"url":"https://www.33tn.cn/?url=", "showType":1},
		{"name":"180","category":1,"url":"https://jx.000180.top/jx/?url=", "showType":1},
		{"name":"无名","category":1,"url":"https://www.administratorw.com/video.php?url=", "showType":1},
		{"name":"黑云","category":1,"url":"https://jiexi.380k.com/?url=", "showType":1},
		{"name":"九八","category":1,"url":"https://jx.youyitv.com/?url=", "showType":1},
		
		{"name":"综合线路解析","category":2,"url":"https://laisoyiba.com/mov/s/?sv=3&url=", "showType":1},
		{"name":"纯净/B站","category":2,"url":"https://z1.m1907.cn/?jx=", "showType":1},
		{"name":"青鸾阁专用","category":2,"url":"http://jx2.xyq0616.xyz/2986205/?url=", "showType":1},
		{"name":"综合/B站1","category":2,"url":"https://vip.parwix.com:4433/player/?url=", "showType":1},
		{"name":"OK解析","category":2,"url":"https://okjx.cc/?url=", "showType":1},
		{"name":"夜幕","category":2,"url":"https://www.yemu.xyz/?url=", "showType":1},
		{"name":"虾米","category":2,"url":"https://jx.xmflv.com/?url=", "showType":1},
		{"name":"全民","category":2,"url":"https://jx.quanmingjiexi.com/?url=", "showType":1},
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
			let storageValue = null;
			if (typeof GM_getValue === "function") {
				storageValue = GM_getValue(name, value);
			} else {
				storageValue = GM.getValue(name, value);
			}
			return storageValue;
		};
		this.GMsetValue = function(name, value){
			if (typeof GM_setValue === "function") {
				GM_setValue(name, value);
			} else {
				GM.setValue(name, value);
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
		this.checkbox_true_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA2tJREFUaEPtmkvoTV0Yxn/PUCZiRPK5DQ1IzHwToUxIriW55FoGRMiEci+XgVyj3HKPzy2RFEqJUAYShUgpvpJSUq9erfPv2J2999r7f5yzyapzdqf9Xp5nvWu96z1rLZFoZtYbGAUMD88BSZkW/34BXAfu+VPSm3r/qv9hZtuAGUCPFoOMdfcBOCxpaU2hg4CZWayVKshJ+oH9x5eZTQWOVwFYAQzTJJ2QmXUHHgB9CyhXQfQlMNQJzAP2VgFRCQzzncARYHoJ5SqoHHUCHop/qoCmBIZXTuC3yj5Jkn8JlAh7noqPiClB6FSecNUi8A2YKulsWJ8mAZkkqkTgq/e8pPOJ8iaTRFUIfAk9f6FBcekLrddADVsVCHwO4C83Qmhmq4F1VSXwKQybqyngFwK7siZyOyPwf+j5ayngowrMdhHwMe0T9kYK+NGAT+YuVUyj70PP30wBPyyA75UH3t+3OgLvAvhbKeD7A/8Bg2LAFyEwPxhcA/SMNZ6QexvA30kB3y2A/7eI/ZgITJZ0OqyM3jObgbFFnACvA/i7aXpm5mN+XEG7uUOoA3xidfS87Pk5pnm57hPWdxUaNjM7CMyKMZaUyYrAS0n9MpxOCNEYmOHYt0S8trmfYWcr0LHLUJRE3hA6IWlahnMn6EPK65VkexbAP8zQz1xlY8jkEXAbhyTNzDJmZquADXUyTwP4xxngc1fZZhFwO/sl+Z//1GZmY4D1QWCmpCcZ4CcDJ2MA5snERKBmY6ekxXkG896b2UjgYswqm2fL3xch4PJbJS2LMdxIxsyGAJeAqFU2xk9RAm5zg6TYFNqBwcz6AF4yR6+yv4qA210jaW2MA5cxs67AFaDQKhtjv0wEanZXSvIUmtvM7BwwPlewhEBnCLi7JZJ25GSnA8DsEtiiVDpLwJ0skrQ7ZdJuAZZHISkp1AwC7nqOJK9n6iftCmBTSVzRas0i4A6nSzoWJu1cYF80ik4INpOAw6gVZX5U1ZLWbAItAV3v5C+Blnd5wqFH4DnQ7rPgsv3wwgl4Dl9Q1kKb9fY4Af8v+lMObzOoIu5nOwG/WvCowqfzaYR8d29w7aDb8/aSItQrILvdrxz8GVcNar0ZrhxsrPCpve8xrfIrBjXMP91WCXWMn4hMBEaET7vPkF8Bt8PnjKSP9cP3OwcygZO3wEsCAAAAAElFTkSuQmCC";
		this.checkbox_false_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAaZJREFUaEPtmk1OAkEUhL86iH9bPYDRqJGVJzDRK+jerbB154Yr6F4X7iTizwVcuRHxIM9MwpChAQP0YxhIdzIhDPOqX1V1z6ILseRDS94/q0nAzM6AC2AN2FywSx3gF2hKug97GXLAzK6B+oKbHjd9XVKj+OMAATPbA94r2nze1r6kj/xLSKANHFScwKukw3EEfoD1gMAD8Ah8lUxsGzgFjoN5u5I2xhGw4OE3SQt1xMyeQxKS+isnXEIhgaFNU7ILmFnmQEaiP6YhUJPUKrvpcD4zGxA2ESjbkeRA2YqnPVBQIL2FPJZf2sQeKsZgJAdi1POoTQ54qBiDkRyIUc+jNjngoWIMRnIgRj2P2uSAh4oxGMmBGPU8apMDHirGYCQHYtTzqI1x4FJS06OJWTHM7AR4KtZPczbaklSbdXKPOjP7BHYmJfA9ItTLTqcbZZ9Sm9kucAtkn8XRkbSV3wjzgRegH994KDgHjLako3EEsnj1bg6TekKeF+PW1YpZc5l6cetNL/ALQz9PNSfB6gLZdVWMV0cuoUnQqvbMav5Xomoq/9fPH0I4X0Cu+FOiAAAAAElFTkSuQmCC";
		this.elementId = Math.ceil(Math.random()*100000000)+"mmx";
		this.autoPlayerSaveKey = "autolayed_isopen_"+window.location.host;  //自动播放开启标识
		this.playerNodes = [
			{ url:"v.qq.com", node:"#mod_player"},
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
			{ url:"www.bilibili.com", node:"#player_module"},
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
			if (category == 1) { //内嵌播放....
				var $player = $(node);
				$player.empty();
				$player.html(videoPlayer);
			}
			if (category == 2){  //弹窗播放....
				commonFunctionObject.GMopenInTab(url, false);
			}
		};
		this.addHtmlElements = function(){  //添加HTML
			const vipVideoImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=";
			const playedImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABMhJREFUaEPtWUuoHUUQPce9nyS40/hBEcHPwi+ioCCKn4hBDaLiwoVBJbuAiS6MLqJRgiL4SwQ3ipAgBmOMiBiDAZXowkQQ4weNoqIYjXHjQo6c2P3o12/mTs29c5EHNgyPd6er6pzu6uqqGmKeD85z/PifQN5BSccDWALgDACLi+cIAD8C+KH4u4PktiF2f6IdkHQOgCvSc2lPQPsBPA9gC8m9PWVnpo9FIAG/E4CfIcZWACtJ7uurrDcBSc+NAL4LwNsAvkzPFwD+rlzqTAC3ADi6AmsC66dKQNJ7AC6ujHj1Nhs4Sft6aEi6CUB+LLOA5O8h4WJSeAckfZtWMosb+AaSr/c1Ws6XdCLJb7p+a7MRIiBJlYLVJB+ZBHibrKRrAXhxQLITX+cESZ8AOKswuJTklmmAt05Jm5Jr+d+T6t2p7Y4kUCkLrcgQxFKg2Bpxz1YCDdHmXJIfDwFwSB2NBFKc/6gwtJzkhiENR3VJOgbADQA2kTwUcqFq9b2V10UNDj2vCCC7SZ7fSaBh9ZdEfHFo4OlAHwfgu0L3lSTfKm3NcSFJDwBYkyaFV7+Qs+wTJA8OQUrSaylJtLqNJGelL00EPgBwQTJ+B8kXIkCqu+LzROLZiOyoOZIM2OmLxwGSi1p3QNLJAL4qJiwmWW5hq62Gy85zdwJ4lOQbkxCR9AeAI5OOG0m+kvXN2gFJKwA8mV42Hpo2IC0E8nRfTreT/GscIlVQWU9yZRuBpwHclV6uIflg1GAHgaxmLcn7ozrzPEnGZGweL5N0Nnt41DvgxOya9O42ki9FjQUJWN0vAG4m+U4P3caUk8Z3SV7WRmAPAOfrHheS/LCHkTrh6xLdSTJUxUkyJmPz2EfytDYCzsdzobGI5IEuFMU29yVg0c0kl3XZkGRMuVY4RPKoCIGFJH/rUj4hgfdJXtRlQ9ICh9A07yBJpxeNZ6B0oV7JW48zkG0/BuAhkn8GCLh5kHOzvSRn0vtRh3gZSZeKodGDgA/jOpKun0MjlZ8OxR7bSLroadyBMoyuIrkuZOHfQqTrDPiCNPCNUZ2Fe94LIFeAz5C8u42AXzyVXm4neXXUWAeBx9ON/FNUXzlPkm/yq9Jv95DMd8Kce8DdNTec8ghHohYCbybgO8YBbhlJCwH8WsjPSm+akjkby/E5fJlJ+hnAscmQOxjOgWZWagICtwJ4McnPusT8WxOB1QDWJoG+6bSJf5p8/ftxQVfuU6bT95F8uHzfRKAMWZ77XxY0My2WBHpOaG+ricv2YXgXhljxEavvJtry2ka0qJ9aI6uNtKRVAEp3abxY+7RVptrQqlb+egCvFr81rn7jIa4UzWrmRlp9Q7hRFZJ3kbykTW+ktVg3dXvlSH0INXRE9pM8YZSOTgLpMqnThMEbXVXxfhhzZMdDBBKJusk7VHvdodKdB39fy2MPybMjuxcmkEiUneOs30R84PyBI9rBcMpyOYClFXDrDBU52XgvAonEqE9Mu53uVp+YLHYqgFPS4/r2vJbVbY02Yx/iJsEpfORz49jge3e/e+9AFWaddtiHnermbl7EdT3HDYPt7jaMA3xsFxpxc7qrZ/c4vfoqaRGn6Pn5LFVVX0eZThxGhzA0LR0TudC0QPXRO+8J/AOnYvFAtGhKvAAAAABJRU5ErkJggg==";
			const currentHost = window.location.host;
			
			var category_1_html = "";
			var category_2_html = "";
			this.originalInterfaceList.forEach((item, index) => {
				if(item.showType != 2){
					if (item.category == 1) {
						category_1_html += "<span title='"+item.name+"' data-index='"+index+"'>" + item.name + "</span>";
					}
					if (item.category == 2) {
						category_2_html += "<span title='"+item.name+"' data-index='"+index+"'>" + item.name + "</span>";
					}
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
			if(!!commonFunctionObject.GMgetValue(this.autoPlayerSaveKey, null)){
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
												<div class='title`+this.elementId+`'><b>全网VIP视频解析[内嵌播放]</b></div>
												<div class='interface_box`+this.elementId+`'>
													` + category_1_html + `
												</div>
											</div>
											<div class='item_box`+this.elementId+`'>													
												<div class='title`+this.elementId+`'><b>全网VIP视频解析[弹窗播放]</b></div>
												<div class='interface_box`+this.elementId+`'>
													` + category_2_html + `
												</div>
											</div>
											<div class='item_box`+this.elementId+`'>
												<div class='title`+this.elementId+`'><b>自动解析说明：</b></div>
												<div class='content`+this.elementId+`'>
													1、开启自动开启后，网页打开2S后脚本将自动解析视频。如果自动解析失败，请手动选择不同的解析接口尝试。（PS：解析接口有些视频没资源，这个也没办法）
													<br>2、<span style="color:red;">如果某些网站有会员可以关闭解析，关闭功能相互独立，互不影响</span>
													<br>3、自动解析默认关闭
													<br>4、当前使用的是第`+defaultVipInterfaceIndex+`个接口作为自动解析默认接口
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
								<div class="img_box`+this.elementId+`" id="img_box_6667897iio"><img src='`+checkboxImage+`' title='是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！'/></div>
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
		this.autoPlayerEvent = function(){  //自动播放事件
			let delayTimeMs = 2500;
			if(window.location.host==="v.qq.com") delayTimeMs = 4000;
			if(commonFunctionObject.GMgetValue(this.autoPlayerSaveKey, null)==="true"){		
				commonFunctionObject.webToast({"message":"自动解析准备中", "background":"#FFFFFF","time":delayTimeMs-400});
				setTimeout(()=>{
					this.showPlayerWindow(this.originalInterfaceList[defaultVipInterfaceIndex-1]);
					commonFunctionObject.webToast({"message":"自动解析成功", "background":"#FFFFFF"});
				}, delayTimeMs);
			}
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
			this.autoPlayerEvent();      //自动解析播放限制
			
			//点击视频播放界面
			$("#img_box_jump_6667897iio").on("click", function(){
				commonFunctionObject.GMopenInTab("https://laisoyiba.com/mov/s/?sv=3&url="+window.location.href, false);
			});
			
			//点击切换是否自动解析
			$("#img_box_6667897iio").on("click", function(){
				var $image = $(this).find("img");
				var autoPlayerSaveKey = that.autoPlayerSaveKey;
				if(commonFunctionObject.GMgetValue(autoPlayerSaveKey, null)==="true"){
					commonFunctionObject.GMsetValue(autoPlayerSaveKey, null);
					commonFunctionObject.webToast({"message":"自动解析：关闭", "background":"#FFE009"});
					$image.attr("src", that.checkbox_false_image);
				}else{
					commonFunctionObject.GMsetValue(autoPlayerSaveKey, "true");
					commonFunctionObject.webToast({"message":"自动解析：打开", "background":"#FFE009"});
					$image.attr("src", that.checkbox_true_image);
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
			//如果开启了自动解析，则关闭去广告
			if(commonFunctionObject.GMgetValue(this.autoPlayerSaveKey, null)==="true"){
				return;
			}
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
		//借鉴脚本作者：lanhaha , 版权归原作者所有
		//地址：https://greasyfork.org/zh-CN/scripts/370634
		//修改：优化了该段代码的逻辑，添加新功能，使可读性更高
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
			{"url":"m.iqiyi.com", "node":".m-video-player-wrap", "color":"#05B03B"},
			{"url":"m.v.qq.com", "node":".mod_player", "color":"#F99D39"},
			{"url":"m.youku.com", "node":".h5-detail-player", "color":"#08BAFD"},
			{"url":"m.mgtv.com", "node":".video-area", "color":"#E95904"},
			{"url":"m.bilibili.com", "node":".player-wrapper", "color":"#FB7299"},
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
					const nodeElementObject = $(nodeObject.node), themeColor = nodeObject.color;
					
					if(nodeElementObject.length == 0) return;
					clearInterval(elementInterval);
					
					//添加HTML
					var cssMould = `
							#open_modal_warp_`+this.elementId+`{
								margin:15px;
								padding:5px 0px;
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
						if (item.showType != 1 && item.category == 1) {
							category_1_html += "<span class='item' title='"+item.name+"' data-index='"+index+"'>" + item.name + "</span>";
						}
					});	
					var htmlMould = `
						<div id="open_modal_warp_`+this.elementId+`">
							<div>点击选择解析接口</div>
							<div>(请不要相信解析视频中的任何广告，有问题请到Greasyfork反馈)</div>
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
							1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者，脚本不承担相关责任！"<br>
							2、为创造良好的创作氛围，请大家支持正版！<br>
							3、脚本仅限个人学习交流，使用即已代表您已经充分了解相关问题，否则后果自负，特此声明！<br>
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
				var showmodal = $(this).attr("showmodal");
				if(!showmodal || showmodal==="hide"){
					$("#select_interface_modal_warp_"+self.elementId).show();
					$(this).attr("showmodal", "show");
				}else{
					$("#select_interface_modal_warp_"+self.elementId).hide();
					$(this).attr("showmodal", "hide");
				}
			});
			
			$("body").on("touchstart", "#select_interface_modal_warp_"+this.elementId+" span.item", function(){
				var index = parseInt($(this).attr("data-index"));
				var playObject = self.originalInterfaceList[index];
				self.showPlayerWindow(playObject);

				$("#select_interface_modal_warp_"+self.elementId).hide();
				$("#open_modal_warp_"+self.elementId).attr("showmodal", "hide");
				
				$("#select_interface_modal_warp_"+self.elementId+" span.item").removeClass("item-active");
				$(this).addClass("item-active");
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
			var iframeDivCss = "width:100%;height:450px;z-index:10000000;";
			if(nodeObject.url.indexOf("iqiyi.com")!=-1){ //爱奇艺需特殊处理
				iframeDivCss += "margin-top:-56.25%";
			}
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
	
	//B站相关功能
	function huahuacat_bilibili(toolObject){
		this.toolObject=toolObject;
		this.downloadResutError=function($btn){
			$btn.text("下载视频（最高清）");
			$btn.removeAttr("disabled");
		};
		this.downloadResutSuccess=function($btn){
			$btn.text("下载视频（最高清）");
			$btn.removeAttr("disabled");
		};
		this.downloadVideo=function($btn){
			var pathname = window.location.pathname, bv = null;
			if (pathname.indexOf("/medialist/play/watchlater/") != -1) { // 在下载视频的时候针对稍后再看页面的链接找BV号
			    bv = pathname.replace("/medialist/play/watchlater/","").replace("/","");
			}else{
				bv = pathname.replace("/video/","").replace("/","");
			}
			if(!bv){
				this.downloadResutError();
			}else{				
				//bv转av
				toolObject.request("get", "http://api.bilibili.com/x/web-interface/archive/stat?bvid="+bv, null).then((resultData)=>{
					let dataJson = JSON.parse(resultData.data);
					if(!!dataJson && dataJson.code===0 && !!dataJson.data){
						let aid = dataJson.data.aid;
						if(!aid){
							this.downloadResutError($btn);
						}else{
							//获取cid
							toolObject.request("get", "https://api.bilibili.com/x/web-interface/view?aid="+aid, null).then((resultData2)=>{
								let dataJson2 = JSON.parse(resultData2.data);
								if(!!dataJson2 && dataJson2.code===0 && !!dataJson2.data){
									let aid = dataJson2.data.aid;
									let bvid = dataJson2.data.bvid;
									let cid = dataJson2.data.cid;
									if(!aid || !bvid || !cid){
										this.downloadResutError($btn);
									}else{
										//获取播放链接
										toolObject.request("get", "https://api.bilibili.com/x/player/playurl?avid="+aid+"&cid="+cid+"&qn=112", null).then((resultData3)=>{
											let dataJson3 = JSON.parse(resultData3.data);
											if(!!dataJson3 && dataJson3.code===0 && !!dataJson3.data){
												this.downloadResutSuccess($btn);
												window.open(dataJson3.data.durl[0].url);
											}
										}).catch((errorData)=>{
											this.downloadResutError($btn);
										});
									}
								}
							}).catch((errorData)=>{
								this.downloadResutError($btn);
							});
						}
					}
				}).catch((errorData)=>{
					this.downloadResutError();
				});
			}
		}
		this.createElementHtml = function(){
			let randomNumber = this.toolObject.randomNumber();
			let cssText = 
			`
				#bilibili_exti_`+randomNumber+`{padding:10px;}
				#bilibili_exti_`+randomNumber+` >.self_s_btn{background-color:#FB7299; color:#FFF; font-size:10px;display:inline-block; margin-right:15px;padding:2px 4px;border-radius:3px;cursor:pointer;}
			`;
			let htmlText=
			`
				<div id="bilibili_exti_`+randomNumber+`">
					<span class="self_s_btn" id="download_s_`+randomNumber+`">下载视频（最高清）</span>
					<span class="self_s_btn" id="focus_s_`+randomNumber+`">一键三连</span>
				</div>
			`;
			setTimeout(()=>{
				if($("#bilibili-player").html().length >= 10){
					$("body").prepend("<style>"+cssText+"</style>");
					//兼容新版播放页面
					let $viewboxReport = $("#viewbox_report div.video-data");
					if($viewboxReport.length==0){
						$viewboxReport = $("#viewbox_report div.video-info-desc");
					}
					if($viewboxReport.length==0){
						$viewboxReport = $("#viewbox_report");
					}
					if($viewboxReport.length==0){
						return;
					}
					$viewboxReport.append(htmlText);
					
					let $that = this;
					$("#download_s_"+randomNumber).on("click", function(){
						$(this).attr("disabled", "disabled");
						$(this).text("下载视频（准备中）")
						$that.downloadVideo($(this));
					});
					$("#focus_s_"+randomNumber).on("click", function(){
						$("#arc_toolbar_report .like").click();
						$("#arc_toolbar_report .coin").click();
					});
				}
			}, 2500);
		}
		this.start = function(){
			let locationHost = window.location.host, locationPathname = window.location.pathname;
			if(locationHost==="www.bilibili.com" && (locationPathname.indexOf("/video")!=-1 || locationPathname.indexOf("/watchlater")!=-1)){
				this.createElementHtml();
			}
		}
	}
	
	//国外的一些解析
	function abroadVideoHelper(){
		this.isRun = function(){
			var urls=["youtube.com", "facebook.com"];
			for(var i=0; i<urls.length;i++){
				if(window.location.host.indexOf(urls[i])!=-1){
					return true;
				}
			}
			return false;
		};
		this.start = function(){
			if(!this.isRun()){
				return;
			}
			setInterval(function(){
				const host = window.location.host;
				const href = window.location.href;
				const eleId = "free-xx1-player-script-9999";
				
				//youtube解析
				if(host.indexOf("youtube.com")!=-1){
					if(href.indexOf("youtube.com/watch")!=-1){
						if($("#"+eleId).length != 0){
							return;
						}
						$("#player-theater-container").css("z-index",9999999999); //修复全屏显示解析按钮的问题
						var iconVideo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADOUlEQVRoQ+2Zz4uNURjHP9+F8g8gykKJNJMUUmzMDKZmYVYsLBRhOaEmFhRRLCZDY4PBrJRREkUMmY3URCk/s6GMhR9ZWNk9OvXO7b133ve+57w/7szUnLqbe59fn/Oc85znnCvm+NAcj595gHgGzWwDsBZYDawEFgI/gT/AR0nDZWe8lAyYWTewF9iTEeA4MCTpblkghQHM7BxwPDCgAUn9gTqJ4oUAzOwKcChnICOS9uXUranlBjCza8CBggFclHSkiI1cAGbWBTwt4jim2y3pSV5bwQBmtgq4BazP67RB7w3gsvAX+CbpV4hdL4CoPG4H3KcjxEEOWVdyHwPjkq5m6WcCmNmFaIaybFXx+2vgsqSRNOOpAGa2GHhY4lIpAnha0qkkA4kAZuZO0k9FPFag2yHJHYR1Iw3gO7CsgiCKmPwMdEmajBuZBmBmbuMcLOKpQt1BSUdTAczMVZmQmjwtpTmC3xqo0ybpw5ROXQbMrA+45GtQUmYVy7JlZpYl0/B73YZuBAjqbWYI4KWkzWkZeBVSNuMAZua1FBorSY4MTEpangYQlM4EgOdZy6ExazkAiNtoXELvgLasIGr0sT0QZaAVAO8ltadlYBTYNcsB7kjanQZwHjg2ywGaViHXIruN7DVmYA+4lnudpC+JGXBfhlwTZwDAPQi4s6o2kloJ9yzyyKcXajGA64F6JL1tChBlwdX0oIrSgirUK+l+49pudh/IhGhhBvolDSRtzKa9jJktBdxrWk+icvXnwO3oIexFWlXJbMbMbAGwJQWg1o0WWEKpLUjSBcZ7CXnV0ZhQXoBQP/MAUzNgZu5Z8EbRGQT2S7qZ107mHmhmuIQnl2lXxFCQQgDRmTEGbAt1DIxJ2pFDr06lDIBFgDsdlwQE8wNol/Q7QCdRtDBAlIVO4FlAMJ2SMk96H3ulAEQQh4FBD6d9koY85LxESgOIIK67qtLE87CkUt+cSgWIICaAjQkQE5I2eU1rgFAVACsA9/Dk/qGcGv+ANZK+BsTmJVo6QJSFXuBeLIKdkh54RRQoVAlABHECOAOclHQ2MC5v8coAIojR+AuCd1QBgpUCBMSRW3QeIPfUlaT4H0/7RUAi2a/NAAAAAElFTkSuQmCC";
						var html='<div id="'+eleId+'" style="width:25px;padding:10px 0px;text-align:center;background-color:#E5212E;position:fixed;top:250px;left:0px;color:#FFF;font-size:0px;cursor:pointer;margin:0px auto;text-align:center;">'+
							'<img src="'+iconVideo+'" style="width:20px;">'+
							'</div>';
						$("body").append(html);
						$("body").on("click", "#"+eleId, function(){
							var location_url = window.location.href;
							var videourl = "https://www.ytdownfk.com/search?url="+location_url;
							commonFunctionObject.GMopenInTab(videourl, false);
						});
					}else{
						$("#"+eleId).remove();
					}
				}
				
				//facebook解析
				if(host.indexOf("facebook.com")!=-1){
					if(href.indexOf("facebook.com/watch")!=-1 || href.indexOf("/videos/")!=-1){
						if($("#"+eleId).length != 0){
							return;
						}
						var iconVideo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADOUlEQVRoQ+2Zz4uNURjHP9+F8g8gykKJNJMUUmzMDKZmYVYsLBRhOaEmFhRRLCZDY4PBrJRREkUMmY3URCk/s6GMhR9ZWNk9OvXO7b133ve+57w/7szUnLqbe59fn/Oc85znnCvm+NAcj595gHgGzWwDsBZYDawEFgI/gT/AR0nDZWe8lAyYWTewF9iTEeA4MCTpblkghQHM7BxwPDCgAUn9gTqJ4oUAzOwKcChnICOS9uXUranlBjCza8CBggFclHSkiI1cAGbWBTwt4jim2y3pSV5bwQBmtgq4BazP67RB7w3gsvAX+CbpV4hdL4CoPG4H3KcjxEEOWVdyHwPjkq5m6WcCmNmFaIaybFXx+2vgsqSRNOOpAGa2GHhY4lIpAnha0qkkA4kAZuZO0k9FPFag2yHJHYR1Iw3gO7CsgiCKmPwMdEmajBuZBmBmbuMcLOKpQt1BSUdTAczMVZmQmjwtpTmC3xqo0ybpw5ROXQbMrA+45GtQUmYVy7JlZpYl0/B73YZuBAjqbWYI4KWkzWkZeBVSNuMAZua1FBorSY4MTEpangYQlM4EgOdZy6ExazkAiNtoXELvgLasIGr0sT0QZaAVAO8ltadlYBTYNcsB7kjanQZwHjg2ywGaViHXIruN7DVmYA+4lnudpC+JGXBfhlwTZwDAPQi4s6o2kloJ9yzyyKcXajGA64F6JL1tChBlwdX0oIrSgirUK+l+49pudh/IhGhhBvolDSRtzKa9jJktBdxrWk+icvXnwO3oIexFWlXJbMbMbAGwJQWg1o0WWEKpLUjSBcZ7CXnV0ZhQXoBQP/MAUzNgZu5Z8EbRGQT2S7qZ107mHmhmuIQnl2lXxFCQQgDRmTEGbAt1DIxJ2pFDr06lDIBFgDsdlwQE8wNol/Q7QCdRtDBAlIVO4FlAMJ2SMk96H3ulAEQQh4FBD6d9koY85LxESgOIIK67qtLE87CkUt+cSgWIICaAjQkQE5I2eU1rgFAVACsA9/Dk/qGcGv+ANZK+BsTmJVo6QJSFXuBeLIKdkh54RRQoVAlABHECOAOclHQ2MC5v8coAIojR+AuCd1QBgpUCBMSRW3QeIPfUlaT4H0/7RUAi2a/NAAAAAElFTkSuQmCC";
						var html='<div id="'+eleId+'" style="width:25px;padding:10px 0px;text-align:center;background-color:#E5212E;position:fixed;top:250px;left:0px;color:#FFF;font-size:0px;z-index:9999999999999;cursor:pointer;margin:0px auto;text-align:center;">'+
							'<img src="'+iconVideo+'" style="width:20px;">'+
							'</div>';
						$("body").append(html);
						$("body").on("click", "#"+eleId, function(){
							var location_url = window.location.href;
							commonFunctionObject.GMsetValue("facebook_downloader_obj", {"facebook_url":location_url});
							commonFunctionObject.GMopenInTab("https://yt1s.com/facebook-downloader", false);
						});
					}else{
						$("#"+eleId).remove();
					}
				}
			}, 500);
			
			if(window.location.href.indexOf("yt1s.com/facebook-downloader")!=-1){ //facebook下载
				var facebookObject = commonFunctionObject.GMgetValue("facebook_downloader_obj");
				if(!!facebookObject){
					$("#s_input").val(facebookObject.facebook_url);
				}
			}
		}
	}
	
	//优惠券查询
	function queryCoupon(){
		this.isRun = function(){
			var urls=["detail.tmall.com", "item.taobao.com", "item.jd.com", "item.yiyaojd.com", "npcitem.jd.hk", "detail.tmall.hk"];
			for(var i=0; i<urls.length;i++){
				if(window.location.host.indexOf(urls[i])!=-1){
					return true;
				}
			}
			return false;
		}
		this.getPlatform = function(){
			let host = window.location.host;
			let platform = "";
			if(host.indexOf("detail.tmall")!=-1){
				platform = "tmall";
			}else if(host.indexOf("item.taobao.com")!=-1){
				platform = "taobao";
			}else if(host.indexOf("jd.com")!=-1 || host.indexOf("npcitem.jd.hk")!=-1){
				platform = "jd";
			}
			return platform;
		};
		this.filterStr = function(str){
			if(!str) return "";
			str = str.replace(/\t/g,"");
			str = str.replace(/\r/g,"");
			str = str.replace(/\n/g,"");
			str = str.replace(/\+/g,"%2B");//"+"
			str = str.replace(/\&/g,"%26");//"&"
			str = str.replace(/\#/g,"%23");//"#"
			return encodeURIComponent(str)
		};
		this.getParamterQueryUrl = function(tag) { //查询GET请求url中的参数
			var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
			var a = window.location.search.substr(1).match(t);
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
		this.getGoodsData = function(platform){
			var goodsId = "";
			var goodsName = "";
			var href = window.location.href;
			if(platform=="taobao"){
				goodsId = this.getParamterQueryUrl("id");
				goodsName=$(".tb-main-title").text();

			}else if(platform=="tmall"){
				goodsId = this.getParamterQueryUrl("id");
				goodsName=$(".tb-detail-hd").text();

			}else if(platform=="jd"){
				goodsName=$("div.sku-name").text();
				goodsId = this.getEndHtmlIdByUrl(href);

			}
			var data={"goodsId":goodsId, "goodsName":this.filterStr(goodsName)}
			return data;
		};
		this.randomSpmValue=function(){
			$("meta[name='data-spm']").each(function(){
				var max = 5000;
				var min = 1000;
				var randomValue = Math.floor(Math.random() * (max - min + 1) ) + min;
				var randomLetter = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
				$(this).attr("content", randomValue+randomLetter);
			});
			$("meta[name='spm-id']").each(function(){
				var max = 5000;
				var min = 1000;
				var randomValue = Math.floor(Math.random() * (max - min + 1) ) + min;
				var randomLetter = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
				$(this).attr("content", randomValue+randomLetter);
			});
		};
		this.runAliDeceptionSpm=function() {
			if(window.location.host.indexOf("aliyun.com")!=-1 || window.location.host.indexOf("taobao.com")!=-1 || window.location.host.indexOf("tmall.com")!=-1){
				this.randomSpmValue();
				setInterval(()=>{
					this.randomSpmValue();
				}, 4000);
			}
		};
		this.request = function(mothed, url, param){
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
							resolve({"result":"success", "json":responseText});
						}else{
							reject({"result":"error", "json":null});
						}
					}
				});
			})
		};
		this.createCouponHtml = function(platform, goodsId, goodsName){
			if(!platform || !goodsId) return;
			var goodsCouponUrl = "http://tt.shuqiandiqiu.com/api/coupon/discover?no=5&v=1.0.2&pl="+platform+"&id="+goodsId+"&qu="+goodsName;
			var goodsPrivateUrl = "http://tt.shuqiandiqiu.com/api/private/change/coupon?no=5&v=1.0.2&platform="+platform+"&id=";

			this.request("GET", goodsCouponUrl, null).then((resutData)=>{
				if(resutData.result==="success" && !!resutData.json){
					var data = JSON.parse(resutData.json).data;
					if(!data || data==="null" || !data.css || !data.html || !data.handler){
						return;
					}
					var cssText = data.css;
					var htmlText = data.html;
					var handler = data.handler;
					var templateId = data.templateId;
					if(!cssText || !htmlText || !handler){
						return;
					}
					$("body").prepend("<style>"+cssText+"</style>");
					
					var handlers = handler.split("@");
					for(var i=0; i<handlers.length; i++){
						var $handler = $(""+handlers[i]+"");
						if(platform=="taobao"){
							$handler.parent().after(htmlText);
						}else if(platform=="tmall"){
							$handler.parent().after(htmlText);
						}else if(platform=="jd"){
							$handler.after(htmlText);
						}
					}
					var $llkk = $("#"+templateId);
					if($llkk.length != 0){
						let couponElementA = $llkk.find("a[name='cpShUrl']");
						couponElementA.unbind("click").bind("click", ()=>{
							event.stopPropagation();
							event.preventDefault();
							let couponId = $llkk.data("id");
							if(!!couponId){
								this.request("GET", goodsPrivateUrl+couponId, null).then((resutData2)=>{
									if(resutData2.result==="success" && !!resutData2.json){
										let url = JSON.parse(resutData2.json).url;
										if(!!url) GM_openInTab(url, {active:true});
									}
								});
							}
						});
						setInterval(()=>{
							$llkk.find("*").each(function(){
								$(this).removeAttr("data-spm-anchor-id")
							});
						},100);
						
						//canvas画二维码
						var $canvasElement = $("#ca"+templateId);
						if($canvasElement.length != 0){
							let couponId = $llkk.data("id");
							this.request("GET", goodsPrivateUrl+couponId, null).then((resutData2)=>{
								if(resutData2.result==="success" && !!resutData2.json){
									let img = JSON.parse(resutData2.json).img;
									if(!!img){
										var canvasElement = document.getElementById("ca"+templateId);
										var cxt = canvasElement.getContext("2d");
										var imgData = new Image();
										imgData.src = img;
										imgData.onload=function(){
											cxt.drawImage(imgData, 0, 0, imgData.width, imgData.height);
										}
									}
								}
							});
						}
						
					}
				}
			});
		};
		this.start = function(){
			if(this.isRun()){				
				var platform = this.getPlatform();
				if(!!platform){
					var goodsData = this.getGoodsData(platform);
					this.createCouponHtml(platform, goodsData.goodsId, goodsData.goodsName);
				}
			}
			this.runAliDeceptionSpm();
		};
	}
	
	/**
	 * 全网音乐解析下载
	 */
	function superMusicHelper(){
		this.eleId = Math.ceil(Math.random()*100000000);
		this.isRun = function(){
			var urls=["music.163.com","y.qq.com","www.kugou.com","www.kuwo.cn","www.xiami.com","music.taihe.com","music.migu.cn","lizhi.fm","qingting.fm","ximalaya.com"];
			for(var i=0; i<urls.length;i++){
				if(window.location.host.indexOf(urls[i])!=-1){
					return true;
				}
			}
			return false;
		};
		this.getPlayUrl = function(){
			var currentHost = window.location.host;
			var currentUrl = window.location.href;
			var playUrl = null;
			if(currentUrl.match(/music\.163\./)){ //网易云音乐
				if(currentUrl.match(/^https?:\/\/music\.163\.com\/#\/(?:song|dj)\?id/)) {
					playUrl = 'https://music.liuzhijin.cn/?url='+encodeURIComponent(currentUrl);
				}else if(currentUrl.match(/^https?:\/\/y\.music\.163\.com\/m\/(?:song|dj)\?id/)) {
					playUrl = 'https://music.liuzhijin.cn/?url='+encodeURIComponent('https://music.163.com/song?id='+getQueryString('id'));
				}
			}
			else if(currentUrl.match(/y\.qq\.com/)){ //QQ音乐
				if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
				if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
				var musicMatch = currentUrl.match(/^https?:\/\/y\.qq\.com\/n\/ryqq\/songDetail\/(\S*)/);
				if(musicMatch){
					playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=qq'
				}
				var musicMatch2 = currentUrl.match(/^https?:\/\/y\.qq\.com\/n\/yqq\/song\/(\S*).html/);
				if(musicMatch2){
					playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch2[1]+'&type=qq';
				}
			}
			else if(currentUrl.match(/kugou\.com/)){ //酷狗
				var musicMatch = currentUrl.match(/hash=(\S*)&album/);
				if(musicMatch){
					playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=kugou';
				}
			}
			else if(currentUrl.match(/kuwo\.cn/)){  //酷我
				if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
				if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
				var musicMatch = currentUrl.match(/play_detail\/(\S*)/);
				if(musicMatch){
					playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=kuwo';
				}
			}
			else if(currentUrl.match(/www\.ximalaya\.com/)){ //喜马拉雅
			    var xmlyUrlArr = currentUrl.split("/");
			    for(var xuaIndex =0;xuaIndex<xmlyUrlArr.length;xuaIndex++){
			        if(xuaIndex==xmlyUrlArr.length-1){
						playUrl = 'https://music.liuzhijin.cn/?id='+xmlyUrlArr[xuaIndex]+'&type=ximalaya&playUrl='+encodeURIComponent(currentUrl);
			        }
			    }
			}
			else if(currentUrl.match(/www\.lizhi\.fm/)){ //荔枝音乐
				if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
				if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
				var musicMatch = currentUrl.match(/^https?:\/\/www\.lizhi\.fm\/(\d*)\/(\d*)/);
				if(musicMatch){
					playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[2]+'&type=lizhi';
				}
			}
			else if(currentUrl.match(/music\.migu\.cn/)){ //咪咕音乐
				if(currentUrl.indexOf("?")) currentUrl = currentUrl.split("?")[0];
				if(currentUrl.indexOf("#")) currentUrl = currentUrl.split("#")[0];
				var musicMatch = currentUrl.match(/^https?:\/\/music\.migu\.cn\/v3\/music\/song\/(\S*)/);
				if(musicMatch){
					playUrl = 'https://music.liuzhijin.cn/?id='+musicMatch[1]+'&type=migu';
				}
			}
			return playUrl;
		};
		this.addStyle=function(){
			var innnerCss = 
			"@keyframes turnaround{0%{-webkit-transform:rotate(0deg);}25%{-webkit-transform:rotate(90deg);}50%{-webkit-transform:rotate(180deg);}75%{-webkit-transform:rotate(270deg);}100%{-webkit-transform:rotate(360deg);}}"+
			"#plugin_kiwi_analysis_vip_music_box_"+this.eleId+" {position:fixed; top:150px; left:0px; width:26px; background-color:#E5212E;z-index:9999999899999;}"+
			"#plugin_kiwi_analysis_vip_music_box_"+this.eleId+" >.plugin_item{cursor:pointer; width:100%; padding:10px 0px; text-align:center;}"+
			"#plugin_kiwi_analysis_vip_music_box_"+this.eleId+" >.plugin_item >img{width:20px; display:inline-block; vertical-align:middle;animation:turnaround 4s linear infinite;}";
			$("body").prepend("<style>"+innnerCss+"</style>");
		};
		this.generateHtml=function(){
			var $that = this;
			var html="";
			var vipImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADJklEQVRYR6WXS6hOURTHf/8wux4TMZCBxwApJRSKXG8uGbieKQYGXpEMKLkGGFCURyEDJHFL6cr1uF4DlDJATDwGBnKVtzJAS0v7u53vfPvcc75j1e57nL3X+u2193ocUVDMrB8wFZgCjAcGhOEaOsN4BNwD7kr6UkS1ikwys2ZgHzCkyHzgDbBd0sW8+d0CmFmPYHhbnqKM5/sDyJ+s9ZkAZjYNuFXScHpZo6TbMV1RgODyCyWN3wGuhPEVmAecApbEjqQGwMx6Ar/qMP45GLsO3JT0Ib3WzCz810vS7+TzGMBVYE4OwHfgjBsEbkj62d38BEC7pLmZAGa2DjiaY/wGsE3S06JeSgD4kvWSjlXWdnnAzPoAz4DBOYqbJPkZF5YUwFtgtKRvriAJMAu4lqdVUl7oDgeawjgmqTUF4CZmS/I7UwWw12O2DICZTQbmA76JMQkduyW1RAD2SdqRBrgPTCwKYGZ+UWcGoyMy1mUBPJA0KQ3wChhaBMDM1gLH8+YCWQCvJQ1LA3hoNeQp9TtgZi3Arry5QIuk3ZEj+CGpdxrgfaK6ZequEyDLA52SBqYBPKlMz9tVDoAnpJfAp6DHy3LMAx2SZqQBDgKb/wPgOdAs6UVFh5k1SPoROYJDkrakAYpkQTI8UGM8uZEIQFc2TCYid78fQ1K809kDeA73KPknkUu4UdKRmPfMrD+QLlAzJHVUeSAoPgcsD4p8V8tjOT8C4K5vzQDYABxOPGuTtKDyuyqtmtk44CHgndBkSZ6caiQC0A5sSnopbGgxkG7LqmpJrBwfALZ2l/PN7DLQtYtA+A44Gb73Df1jek7V7muOIFAPArxQrI15wMyWAufzoiXy3BuRRelKmtWSjQQueUMq6XQAGwt4pKwpYfwjsFJSTbXtril1CD+/USUMJpd4i74q6z7l1XaH8DK9sCREG7BT0pOs9UVfTBqB1cCKgiBu+ESRzqkQQCIBTfAIATy8YvI4VMDCLVtdAAkQ7wW8J0jKWUmrCnqoa1opgBAVfkErnmiV5O+Pdcv/AHhDUal8IyV5Q1O3lAYIXljmn5LKJKZ/sH8B8jdXMDutk64AAAAASUVORK5CYII=";
			html+= "<div id='plugin_kiwi_analysis_vip_music_box_"+this.eleId+"'>";
			html+= "<div class='plugin_item jump_analysis_website' title='点我VIP音乐破解，免客户端下载！'><img src='"+vipImgBase64+"'></div>";
			html+= "</div>";
			$("body").append(html);
			
			$("#plugin_kiwi_analysis_vip_music_box_"+this.eleId+"").on("click", function(){
				var playUrl = $that.getPlayUrl();
				if(!!playUrl) GM_openInTab(playUrl, false);
			})
		};
		this.operation=function(){
			var $that = this;
			setInterval(function(){
				var playUrl = $that.getPlayUrl();
				var $vipMusicBox = $("#plugin_kiwi_analysis_vip_music_box_"+$that.eleId+"");
				if(!!playUrl){
					if($vipMusicBox.length==0){
						$that.generateHtml();
					}
				}else{
					$vipMusicBox.remove();
				}
			}, 100);
		};
		this.start=function(){
			if(this.isRun()){				
				this.addStyle();
				this.operation();
			}
		};
	}
	
	/**
	 * 来搜一下，网盘搜索引擎无线下载
	 * @param {Object} toolObject
	 */
	function wangpanSearchEnginesHelper(toolObject){
		this.toolObject=toolObject;
		this.start = function(){
			let $that = this, host = window.location.host;
			if(host==="www.laisoyixia.com" || host==="www.xiaozhukuaipan.com"){
				var $downloadBtn = $("#downloadHandler");
				var downloadurl = $downloadBtn.data("downloadurl");
				if(!!downloadurl){
					var wangpanUrl = window.atob(downloadurl);
					$downloadBtn.after("<div style='padding:15px;background-color:#eee;margin-top:15px;'>插件提取所得：<a target='_blank' href='"+wangpanUrl+"'>"+wangpanUrl+"</a></div>")
				}
			}
		}
	}
	
	/**
	 * 搜索引擎资源提醒
	 * @param {Object} toolObject
	 */
	function searchEnginesNavigation(toolObject){
		this.toolObject = toolObject;
		this.searchEnginesData=[
			{"host":"www.baidu.com", "element":"#content_right","elementInput":"#kw"},
			{"host":"www.so.com", "element":"#side","elementInput":"#keyword"},
			{"host":"www.sogou.com", "element":"#right","elementInput":"#upquery"},
			{"host":"cn.bing.com", "element":"#b_context","elementInput":"#sb_form_q"},
			{"host":"so.toutiao.com", "element":".s-side-list","elementInput":"input[type='search']"}
		];
		this.getNavigationData = function(element, elementInput){
			const navigationData = [
				{"name":"资源搜索","list":[
					{"name":"书签搜索", "url":"https://www.bookmarkearth.com/s/search?q=@@&currentPage=1"},
					{"name":"网盘搜索", "url":"https://www.xiaozhukuaipan.com/s/search?q=@@&currentPage=1"},
					{"name":"财经搜索", "url":"https://www.shaduizi.com/s/search?q=@@&currentPage=1"},
					{"name":"百度百科", "url":"https://baike.baidu.com/item/@@"},
					{"name":"知乎搜索", "url":"https://www.zhihu.com/search?type=content&q=@@"},
					{"name":"B站搜索", "url":"https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851"},
					{"name":"抖音搜索", "url":"https://www.douyin.com/search/@@?aid=0a9fc74b-01e8-4fb0-9509-307c5c07fda1&publish_time=0&sort_type=0&source=normal_search&type=general"},
					{"name":"搜狗|公众号", "url":"https://weixin.sogou.com/weixin?type=2&query=@@"},
					{"name":"搜狗|知乎", "url":"https://www.sogou.com/sogou?pid=sogou-wsse-ff111e4a5406ed40&insite=zhihu.com&ie=utf8&p=73351201&query=@@&ie=utf8&p=73351201&query=@@"},
					{"name":"豆瓣搜索", "url":"https://www.douban.com/search?q=@@"},
					{"name":"电影搜索", "url":"https://www.cupfox.com/search?key=@@"},
					{"name":"维基百科", "url":"https://en.wikipedia.org/w/index.php?search=@@"},
					{"name":"法律法规", "url":"https://www.pkulaw.com/law/chl?Keywords=@@"},
					{"name":"PPT搜索", "url":"https://www.chuliansheji.com/s/search?q=@@&currentPage=1&c=1"},
					{"name":"icon搜索", "url":"https://www.iconfont.cn/search/index?searchType=icon&q=@@"},
					{"name":"github", "url":"https://github.com/search?q=@@"},
					{"name":"csdn", "url":"https://so.csdn.net/so/search?q=@@&t=&u="},
					{"name":"今天买啥", "url":"https://www.whatbuytoday.com/s/search?q=@@&currentPage=1"}
				]},
				{"name":"搜索引擎","list":[
					{"name":"百度", "url":"https://www.baidu.com/s?wd=@@"},
					{"name":"必应", "url":"https://cn.bing.com/search?q=@@"},
					{"name":"Google", "url":"https://www.google.com/search?q=@@"},
					{"name":"360搜索", "url":"https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@"},
					{"name":"搜狗", "url":"https://www.sogou.com/web?query=@@"},
					{"name":"头条搜索", "url":"https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@"}
				]}
			];
			const $that = this;
			const cacheNavigationData =  toolObject.GMgetValue("navigation_data_cache",null);
			if(!!cacheNavigationData){
				$that.createHtml(element, elementInput, cacheNavigationData);
			}else{
				$that.createHtml(element, elementInput, navigationData);
			}
			//判断值是否有变动，如果有变动就更新换存，简单处理，长度是否一致
			toolObject.request("get", "http://api.staticj.top/script/api/get/navigation_json_url", null).then((resultData)=>{
				let dataJson = JSON.parse(resultData.data);
				if(!!dataJson && !!dataJson.url){
					toolObject.request("get", dataJson.url, null).then((resultData2)=>{
						let serverNavigationData = resultData2.data;
						if(!cacheNavigationData || (!!cacheNavigationData && serverNavigationData.length!=JSON.stringify(cacheNavigationData).length)){
							toolObject.GMsetValue("navigation_data_cache", JSON.parse(serverNavigationData));
						}
					}).catch(()=>{});
				}
			}).catch(()=>{});
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
				}
				.ddfdfd`+elementNum+`dffssqa>.content-list{
					
				}
				.ddfdfd`+elementNum+`dffssqa>.content-list>a{
					display:inline-block;
					width:calc(25% - 16px);
					border:1px solid #ccc;
					border-radius:4px;
					text-align:center;
					margin-right:15px;
					margin-top:6px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow:ellipsis;
					padding:2px;
					box-sizing:border-box;
					font-size:13px;
					line-height:20px;
				}
				.ddfdfd`+elementNum+`dffssqa>.content-list>a:nth-child(4n){
					margin-right:0px;
				}
			`;
			if($("#plugin_css_style_dddsoo").length==0){
				$("body").prepend("<style id='plugin_css_style_dddsoo'>"+innnerCss+"</style>");
			}
		};
		this.createHtml = function(element, elementInput, navigationData){
			$("#dsdsd99mmmjj7760011").remove();
			
			var isComplate = true;
			const host = window.location.host;
			const self = this;
			const elementNum = toolObject.randomNumber();
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
								if(url.indexOf(host)!=-1){
									continue;
								}
								html += "<a target='_blank' data-url='"+url+"' href='javascript:void(0);'>"+name+"</a>"				
							}
							html += "</div>";
							html += "</div>";
						}
						html += "<div style='margin-bottom:10px;margin-top:5px;font-size:12px;'><a target='_blank' href='https://greasyfork.org/zh-CN/scripts/418804'>*该数据由油猴脚本提供</a></div>";
						html += "</div>";
						
						//添加css 添加html
						self.createCss(elementNum);
						$element.prepend(html);
						
						$("#dsdsd99mmmjj7760011 a").on("click", function(e){
							toolObject.GMopenInTab($(this).data("url").replace("@@",$(elementInput).val()),false);
							e.preventDefault()
						});
					}
					isComplate = true;
				}
			}, 100);			
		};
		this.show = function(){
			const self = this;
			const host = window.location.host;
			const href = window.location.href;
			if((host==="www.baidu.com")
				|| (host==="www.so.com" && href.indexOf("www.so.com/s")!=-1)
				|| (host==="www.sogou.com" && href.indexOf("www.sogou.com/web?query")!=-1)
				|| (host==="cn.bing.com" && href.indexOf("cn.bing.com/search")!=-1)
				|| (host==="so.toutiao.com" && href.indexOf("so.toutiao.com/search")!=-1)){
				let currentSearchEnginesData = null;
				for(var i=0; i<self.searchEnginesData.length; i++){
					if(host===self.searchEnginesData[i].host){
						currentSearchEnginesData = self.searchEnginesData[i];
					}
				}
				if(currentSearchEnginesData!=null){
					self.getNavigationData(currentSearchEnginesData.element, currentSearchEnginesData.elementInput);
				}
			}
		};
		this.start = function(){
			this.show();
		};
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
						"1、除了下方青鸾阁弹窗接口外，其余解析接口全部收集自互联网（源码可见）！\u000d"+
						"2、请大家不要相信外部接口的广告！！\u000d"+
						"3、脚本仅限个人学习交流，使用即已代表您已经充分了解相关问题，否则后果自负，特此声明！\u000d"+
						"4、此提醒只弹出一次，确认后，后续将不在弹出，请知悉！"
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
		if(functionController.abroadVideoHelper){
			(new abroadVideoHelper()).start();
		}
	}catch(e){
		console.log("国外视频解析：error："+e);
	}
	
	try{
		if(functionController.queryCoupon){
			(new queryCoupon()).start();
		}
	}catch(e){
		console.log("优惠券查询：error："+e);
	}
	
	try{
		if(functionController.superMusicHelper){
			(new superMusicHelper()).start();
		}
	}catch(e){
		console.log("全网音乐下载：error："+e);
	}
	
	try{
		if(functionController.superVideoHelper){
			new huahuacat_bilibili(commonFunctionObject).start();
		}
	}catch(e){
		console.log("B站视频下载：error："+e);
	}
	
	try{
		if(functionController.wangpanSearchEnginesHelper){
			new wangpanSearchEnginesHelper(commonFunctionObject).start();
		}
	}catch(e){
		console.log("网盘搜索引擎破解：error："+e);
	}
	
	try{
		if(functionController.searchEnginesNavigation){
			new searchEnginesNavigation(commonFunctionObject).start();
		}
	}catch(e){
		console.log("搜索引擎导航：error："+e);
	}
})();