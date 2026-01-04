// ==UserScript==
// @name              DK的解锁B站大会员,番剧,全网VIP视频免费破解去广告,全网音乐直接下载;AB站视频解析下载;Facebook等国外视频解析下载;高清电视频道观看等
// @namespace         super_video_helper_cat
// @version           3.1.7
// @description       解锁B站大会员，番剧；爱奇艺、腾讯、优酷、芒果等全网VIP视频免费破解去广告(免跳出观影特方便，支持【PC端+移动端，支持自定义接口】)；网易云音乐、QQ音乐、酷狗、蜻蜓FM、荔枝FM、喜马拉雅等音乐和有声书音频免客户端下载；B站、A站视频解析下载；油管、Facebook等国外视频解析下载；高清电视频道观看(CCTV、湖南卫视等100多个台)；优惠券查询等【👊👊脚本长期维护更新，完全免费，无广告】
// @author            4AMdk
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=
//---------------------------------------------------
// @include           *://xbeibeix.com/api/bilibili/biliplayer/*
// @include           *://xbeibeix.com/api/bilibili/*
//---------------------------------------------------
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
// @include           *://*.acfun.cn/v/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://*.baofeng.com/play/*
// @include           *://vip.pptv.com/show/*
// @include           *://v.pptv.com/show/*
// @include           *://www.le.com/ptv/vplay/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://www.acfun.cn/v/*
//---------------------------------------------------
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/kszt/*
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

// @require           https://cdn.jsdelivr.net/npm/jquery-tamper@1.0.1/jquery.min.js
// @connect			  tt.shuqiandiqiu.com
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
// @license           GPL License
// @charset		      UTF-8
// @antifeature  	  referral-link 【应GreasyFork代码规范要求：含有优惠券功能的脚本必须添加此提示，插件仅提供优惠券提醒和观影相关功能，无任何强制行为】
// @original-author   小艾特
// @original-license  GPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/407847
// @original-author   匆匆过客
// @original-license  GPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/398195
// @downloadURL https://update.greasyfork.org/scripts/429260/DK%E7%9A%84%E8%A7%A3%E9%94%81B%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%2C%E7%95%AA%E5%89%A7%2C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E5%85%A8%E7%BD%91%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%3BAB%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%3BFacebook%E7%AD%89%E5%9B%BD%E5%A4%96%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%3B%E9%AB%98%E6%B8%85%E7%94%B5%E8%A7%86%E9%A2%91%E9%81%93%E8%A7%82%E7%9C%8B%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/429260/DK%E7%9A%84%E8%A7%A3%E9%94%81B%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%2C%E7%95%AA%E5%89%A7%2C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E5%85%A8%E7%BD%91%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%3BAB%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%3BFacebook%E7%AD%89%E5%9B%BD%E5%A4%96%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%3B%E9%AB%98%E6%B8%85%E7%94%B5%E8%A7%86%E9%A2%91%E9%81%93%E8%A7%82%E7%9C%8B%E7%AD%89.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var $ = $ || window.$;
	
	//如果本地值不能满足需求，可自定义添加接口到此处
	//注意数据格式
	//category=1:全网VIP解析内嵌页播放
	//category=2:全网VIP解析新建页面播放
	var customizeInterfaceList=[
		//{ name:"就是名字而已", category:"1", url:"https://jx.idc126.net/jx/?url="},
		//{ name:"就是名字而已", category:"2", url:"https://jx.idc126.net/jx/?url="},
	];
	
	//默认值，当网络请求出现错误时使用此值
	var originalInterfaceList = [
		{"name":"纯净解析","category":"1","url":"https://z1.m1907.cn/?jx="},
		{"name":"高速接口1","category":"1","url":"https://jsap.attakids.com/?url="},
		{"name":"高速接口2","category":"1","url":"https://api.sigujx.com/?url="},
		{"name":"B站解析1","category":"1","url":"https://vip.parwix.com:4433/player/?url="},
		{"name":"B站解析2","category":"1","url":"https://www.cuan.la/m3u8.php?url="},
		{"name":"Ckplayer","category":"1","url":"https://www.ckplayer.vip/jiexi/?url="},
		{"name":"乐多资源","category":"1","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
		{"name":"ccyjjd","category":"1","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
		{"name":"M3U8","category":"1","url":"https://jx.m3u8.tv/jiexi/?url="},
		{"name":"BL","category":"1","url":"https://vip.bljiex.com/?v="},
		{"name":"Mao解析","category":"1","url":"https://qd.hxys.tv/m3u8.php?url="},
		{"name":"盘古","category":"1","url":"https://www.pangujiexi.cc/jiexi.php?url="},
		{"name":"SSAMAO","category":"1","url":"https://www.ssamao.com/jx/?url="},
		{"name":"无极","category":"1","url":"https://da.wujiys.com/?url="},
		{"name":"618G","category":"1","url":"https://jx.618g.com/?url="},
		{"name":"ckmov","category":"1","url":"https://www.ckmov.vip/api.php?url="},
		{"name":"迪奥","category":"1","url":"https://123.1dior.cn/?url="},
		{"name":"福星","category":"1","url":"https://jx.popo520.cn/jiexi/?url="},
		{"name":"RDHK","category":"1","url":"https://jx.rdhk.net/?v="},
		{"name":"H8","category":"1","url":"https://www.h8jx.com/jiexi.php?url="},
		{"name":"解析la","category":"1","url":"https://api.jiexi.la/?url="},
		{"name":"久播","category":"1","url":"https://jx.jiubojx.com/vip.php?url="},
		{"name":"九八","category":"1","url":"https://jx.youyitv.com/?url="},
		{"name":"老板","category":"1","url":"https://vip.laobandq.com/jiexi.php?url="},
		{"name":"乐喵","category":"1","url":"https://jx.hao-zsj.cn/vip/?url="},
		{"name":"MUTV","category":"1","url":"https://jiexi.janan.net/jiexi/?url="},
		{"name":"明日","category":"1","url":"https://jx.yingxiangbao.cn/vip.php?url="},
		{"name":"磨菇","category":"1","url":"https://jx.wzslw.cn/?url="},
		{"name":"OK","category":"1","url":"https://okjx.cc/?url="},
		{"name":"维多","category":"1","url":"https://jx.ivito.cn/?url="},
		{"name":"小蒋","category":"1","url":"https://www.kpezp.cn/jlexi.php?url="},
		{"name":"小狼","category":"1","url":"https://jx.yaohuaxuan.com/?url="},
		{"name":"智能","category":"1","url":"https://vip.kurumit3.top/?v="},
		{"name":"星驰","category":"1","url":"https://vip.cjys.top/?url="},
		{"name":"星空","category":"1","url":"http://60jx.com/?url="},
		{"name":"月亮","category":"1","url":"https://api.yueliangjx.com/?url="},
		{"name":"0523","category":"1","url":"https://go.yh0523.cn/y.cy?url="},
		{"name":"云端","category":"1","url":"https://jx.ergan.top/?url="},
		{"name":"17云","category":"1","url":"https://www.1717yun.com/jx/ty.php?url="},
		{"name":"66","category":"1","url":"https://api.3jx.top/vip/?url="},
		{"name":"116","category":"1","url":"https://jx.116kan.com/?url="},
		{"name":"200","category":"1","url":"https://vip.66parse.club/?url="},
		{"name":"云析","category":"1","url":"https://jx.yparse.com/index.php?url="},
		{"name":"8090","category":"1","url":"https://www.8090g.cn/?url="},
		
		{"name":"纯净解析","category":"2","url":"https://z1.m1907.cn/?jx="},
		{"name":"高速接口1","category":"2","url":"https://jsap.attakids.com/?url="},
		{"name":"高速接口2","category":"2","url":"https://api.sigujx.com/?url="},
		{"name":"B站解析1","category":"2","url":"https://vip.parwix.com:4433/player/?url="},
		{"name":"B站解析2","category":"2","url":"https://www.cuan.la/m3u8.php?url="},
		{"name":"Ckplayer","category":"2","url":"https://www.ckplayer.vip/jiexi/?url="},
		{"name":"乐多资源","category":"2","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
		{"name":"ccyjjd","category":"2","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
		{"name":"M3U8","category":"2","url":"https://jx.m3u8.tv/jiexi/?url="},
		{"name":"BL","category":"2","url":"https://vip.bljiex.com/?v="},
		{"name":"Mao解析","category":"2","url":"https://qd.hxys.tv/m3u8.php?url="}
	];
	var playerNodes = [
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
	
	let newOriginalInterfaceList = originalInterfaceList;
	try{
		newOriginalInterfaceList = customizeInterfaceList.concat(originalInterfaceList);
	}catch(e){
		console.log("自定义解析接口错误，注意数据格式....");
	}
	
	/**
	 * 共有方法
	 */
	function commonFunction(){
		this.GMgetValue = function (name, value) { //得到存在本地的数据
			if (typeof GM_getValue === "function") {
				return GM_getValue(name, value);
			} else {
				return GM.getValue(name, value);
			}
		};
		this.GMsetValue = function(name, value){ //设置存在本地的数据
			if (typeof GM_setValue === "function") {
				return GM_setValue(name, value);
			} else {
				return GM.setValue(name, value);
			}
		};
		this.GMaddStyle = function(css){ //插入css
			var myStyle = document.createElement('style');
			myStyle.textContent = css;
			var doc = document.head || document.documentElement;
			doc.appendChild(myStyle);
		};
		this.GMopenInTab = function(url, open_in_background){ //新标签页打开网址
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, open_in_background);
			} else {
				GM.openInTab(url, open_in_background);
			}
		};
		this.addScript = function(url){  //添加脚本
			var s = document.createElement('script');
			s.setAttribute('src',url);
			document.body.appendChild(s);
		};
	}
	
	//全局统一变量
	const commonFunctionObject = new commonFunction();
	
	/**
	 * 超级解析助手
	 * @param {Object} originalInterfaceList
	 * @param {Object} playerNodes
	 */
	function superVideoHelper(originalInterfaceList, playerNodes){
		this.originalInterfaceList = originalInterfaceList;
		this.node = "";
		this.elementId = Math.ceil(Math.random()*100000000);
		for(var i in playerNodes) { //获得窗口ID
			if (playerNodes[i].url == window.location.host) {
				this.node = playerNodes[i].node;
				break;
			}
		}
		this.isRun = function(){ //判断是否运行
			var urls = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com", "acfun.cn","bilibili.com","baofeng.com","pptv.com"];
			for(var i=0; i<urls.length;i++){
				if((window.location.host!=="bilibili.com" && window.location.host.indexOf(urls[i])!=-1) 
					|| (window.location.host==="bilibili.com" && window.location.href.indexOf("bangumi/play")!=-1)){
					return true;
				}
			}
			return false;
		};
		this.innerParse = function(url) { //内嵌解析
			$("#iframe-player").attr("src", url);
		};
		this.addHtmlElements = function(){
			var vipVideoImageBase64 =`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=`;
			var tvImageBase64=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACvUlEQVRoQ+2ZPYwNURTHf/9Gp/ARCpFYoVDZRCMqGgrRKCgoyCZE46MgaNiCRLIhu4WPDaIgkWwhEZHQ0IqPIFGI+AgJsQ0FKnHkbs5s5o2Z9+atmX33JXOb9+Z+nPv/n/+9Z+65I/q8qM/x0xDotYKNAlEpYGa7gC3A/F4DK5j/C3Bb0s2kfXoJmdky4H2kwLOwBiR9CJVpAieBE31CYFhSwNuWwMPIyKxP4SlFYIOkKEiYWQD/oCHQqyXVKJD2vJldB5aUUCOEubuSJswsRIzPksbzxpnZOmAjcEHS12yfyhRwIN2E2mHgI3DFQW2SdD/jkEXAM3fKdHTJ9KluE5vZCLAm46UkxKWjVlAgEFgIPPb+NyTtzIA7Bpz2uiFJV2tToED+EN6mCEjKPRyaWXj1b/fxqyW9DP/NbC7wHFgOTEpaXDBHdQrkeKcMgc3AHR87KumgEwi/57z+qKQzURJwsAnRb8AA8BMISqwCvgMLJP2JmcAQcNkBHgF+AOf9eUTS4aLIVlkUmukecAXm+HoPHn/jCgwCv4IikiajJuAkjgOnMkDHJB1o916JQgEnsBR4AcxzwL+BQUmv+oKAkxgF9jvgi5L2tQPvY2oNo0kidE3S7hJgVgBjvolD6HxXYkx9BBIP1Zk71LoHOnmvivaGQBVe/B8bM1UgnCRjKuljfKmkPibwWSy5BEJGdC9m1ClsayU9Cs8t53dPF3dETuKWpK0Jxn8SEDML+e7KCki03OMAVdwxfZL0No2tluv1dlGjAse0mGgI5Hk0OgX86j0cqMIVfC7mnMqp22Mv3b5TngBPJYXvAW1LqSVkZpeAPZ2MVdw+IWlbJ5tlCVgnQ3W0F13TdB2FzOwscKgOkG1sjkva22nOUgoEI74PivZAp3m6bX9dZv0Ho6UJdItgtvo3BGbL00XzNAr0WoG/02m4QKQE53EAAAAASUVORK5CYII=`;
			var category_1_html = "";
			var category_2_html = "";
			this.originalInterfaceList.forEach((item, index) => {
				if (item.category === "1") {
					category_1_html += "<li title='"+item.name+"' data-index='"+index+"'>" + item.name + "</li>";
				}
				if (item.category === "2") {
					category_2_html += "<li title='"+item.name+"' data-index='"+index+"'>" + item.name + "</li>";
				}
			});	
			
			//获得自定义位置
			var left = 0;
			var top = 100;
			var Position = commonFunctionObject.GMgetValue("Position_" + window.location.host);
			if(!!Position){
				left = Position.left;
				top = Position.top;
			}
			var cssMould = `#vip_movie_box`+this.elementId+` {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:2147483647; font-size:16px; text-align:left;}
							#vip_movie_box`+this.elementId+` .item_text {}
							#vip_movie_box`+this.elementId+` .item_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
							#vip_movie_box`+this.elementId+` .item_text .img_box >img {width:20px; display:inline-block; vertical-align:middle;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action {display:none; position:absolute; left:26px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action li{border-radius:2px; font-size:12px; color:#DCDCDC; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action li:hover{color:#E5212E; border:1px solid #E5212E;}
							
							#vip_movie_box`+this.elementId+` li.selected{color:#E5212E; border:1px solid #E5212E;}
							
							
							#vip_movie_box`+this.elementId+` .selected_text {margin-top:5px;}
							#vip_movie_box`+this.elementId+` .selected_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
							#vip_movie_box`+this.elementId+` .selected_text .img_box >img {width:20px; height:20px;display:inline-block; vertical-align:middle;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected {display:none;position:absolute; left:26px; top:0; text-align:center; background-color:#F5F6CE; border:1px solid gray;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected ul{overflow-y: auto;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected li{border-radius:2px; font-size:12px; color:#393AE6; text-align:center; width:95px; line-height:27px; float:left; border:1px dashed gray; padding:0 4px; margin:4px 2px;display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected li:hover{color:#E5212E; border:1px solid #E5212E;}
														
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
							`
			commonFunctionObject.GMaddStyle(cssMould);
			
			var htmlMould = `<div id='vip_movie_box`+this.elementId+`'>
								<div class='item_text'>
									<div class="img_box" id="img_box_6667897iio"><img src='`+ vipVideoImageBase64 +`' title='点击跳转到综合解析页面，线路随意选！'/></div>
										<div class='vip_mod_box_action' >
											<div style='display:flex;'>
												<div style='padding:10px 0px; width:380px; max-height:400px; overflow-y:auto;'  class="default-scrollbar-55678">
													<div>
														<div style='font-size:16px; text-align:center; color:#E5212E; padding:5px 0px;'><b>全网VIP视频解析[内嵌播放]</b></div>
														<ul>
															` + category_1_html + `
															<div style='clear:both;'></div>
														</ul>
													</div>
													<div>													
														<div style='font-size:16px; text-align:center; color:#E5212E; padding:5px 0px;'><b>全网VIP视频解析[弹窗播放]</b></div>
														<ul>
														` + category_2_html + `
														<div style='clear:both;'></div>
														</ul>
													</div>
												</div>
											<div>
										</div>
									</div>
								</div>	
							</div>
							<!-- 电视剧开始 -->
							<div class='selected_text'>
								<div class="img_box"><img src='`+ tvImageBase64 +`' title='高清电视'/></div>
								<div class='vip_mod_box_selected' >
									<div style='display:flex;'>
										<div style='padding:10px 0px; width:660px; height:400px; overflow-y: auto;' class="default-scrollbar-55678">
											<div>
												<div style='font-size:16px; text-align:center; color:#088A08; padding:5px 0px;'>高清电视测试节点[建议网速流畅观看]</div>
												<ul>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv1hd">CCTV-1高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv2hd">CCTV-2高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv3hd">CCTV-3高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv4hd">CCTV-4高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv5hd">CCTV-5高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv6hd">CCTV-6高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv7hd">CCTV-7高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv8hd">CCTV-8高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv9hd">CCTV-9高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv10hd">CCTV-10高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv12hd">CCTV-12高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv14hd">CCTV-14高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv17hd">CCTV-17高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv1hd">北京卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv2hd">北京文艺高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv4hd">北京影视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv9hd">北京新闻高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv11hd">北京冬奥高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hunanhd">湖南卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=zjhd">浙江卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jshd">江苏卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dfhd">东方卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ahhd">安徽卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hljhd">黑龙江卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lnhd">辽宁卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=szhd">深圳卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gdhd">广东卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=tjhd">天津卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hbhd">湖北卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdhd">山东卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cqhd">重庆卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dnhd">福建东南高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=schd">四川卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hbhd">河北卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jxhd">江西卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hnhd">河南卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gxhd">广西卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jlhd">吉林卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lyhd">海南卫视高清</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gzhd">贵州卫视高清</a></li>
												</ul>
											</div>
											<div style="margin-top:15px;">
												<div style='font-size:16px; text-align:center; color:#088A08; padding:5px 0px;'>普清电视测试节点[建议网速流畅观看]</div>
												<ul>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv1">CCTV-1综合</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv2">CCTV-2财经</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv3">CCTV-3综艺</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv4">CCTV-4国际</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv6">CCTV-6电影</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv7">CCTV-7军事</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv8">CCTV-8电视剧</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv9">CCTV-9纪录</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv10">CCTV-10科教</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv11">CCTV-11戏曲</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv12">CCTV-12社会</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv13">CCTV-13新闻</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv14">CCTV-14少儿</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv15">CCTV-15音乐</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv16">CGTN</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cctv17">CCTV-17农业</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv1">北京卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv2">北京文艺</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv3">北京科教</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv4">北京影视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv5">北京财经</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv7">北京生活</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv8">北京青年</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv9">北京新闻</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv10">北京卡酷少儿</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=btv11">北京冬奥纪实</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=zjtv">浙江卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hunantv">湖南卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jstv">江苏卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dftv">东方卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sztv">深圳卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ahtv">安徽卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hntv">河南卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sxtv">陕西卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jltv">吉林卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gdtv">广东卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdtv">山东卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hbtv">湖北卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hebtv">河北卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xztv">西藏卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=nmtv">内蒙古卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=qhtv">青海卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sctv">四川卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=tjtv">天津卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sxrtv">山西卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lntv">辽宁卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xmtv">厦门卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=xjtv">新疆卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=hljtv">黑龙江卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=yntv">云南卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=jxtv">江西卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=dntv">福建东南卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gztv">贵州卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=nxtv">宁夏卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=gstv">甘肃卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cqtv">重庆卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=bttv">兵团卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=ybtv">延边卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sstv">三沙卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=lytv">海南卫视</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=sdetv">山东教育</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv1">CETV-1</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv3">CETV-3</a></li>
													<li><a target="_blank" href="http://ivi.bupt.edu.cn/player.html?channel=cetv4">CETV-4</a></li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							`;
			$("body").append(htmlMould);
		};
		this.mouseEvent = function(){
			$(".item_text").on("mouseover", () => {
				$(".vip_mod_box_action").show();
			});
			$(".item_text").on("mouseout", () => {
				$(".vip_mod_box_action").hide();
			});
			$(".selected_text").on("mouseover", () => {
				$(".vip_mod_box_selected").show();
			});
			$(".selected_text").on("mouseout", () => {
				$(".vip_mod_box_selected").hide();
			});
			$(".vip_mod_box_action li").each((liIndex, item) => {
				item.addEventListener("click", () => {
					var videoPlayer = $("<div id='iframe-play-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
					var index = parseInt($(item).attr("data-index"));
					var category = this.originalInterfaceList[index].category;
					var url = this.originalInterfaceList[index].url + window.location.href;
					if (category==="1") { //内嵌播放....
						if (document.getElementById("iframe-player") == null) {
							var player = $(this.node);
							player.empty();
							player.append(videoPlayer);
						}
						this.innerParse(url);  //把播放链接加入到自定义的div
					}
					if (category==="2"){  //弹窗播放....
						commonFunctionObject.GMopenInTab(url, false);
					}
					//把点击过的标红
					$(".vip_mod_box_action li").removeClass("selected");
					$(item).addClass("selected");
				});
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
			
			//点击视频播放界面
			$("#img_box_6667897iio").on("click", function(){
				commonFunctionObject.GMopenInTab("https://showxi.xyz/mov/s/?sv=3&url="+window.location.href, false);
			});
		};
		
		this.operatBilibili = function(){
			setTimeout(function(){
				$("#loading").remove();
				$("#playerWrap").after('<div id="go_download_69778ii" style="display:inline-block;cursor:pointer;padding:5px 10px;border-radius:3px;margin-top:15px;color:#FFF;background-color:#F45A8D;">点击下载视频</div>');
				$("#go_download_69778ii").click(function(){
					commonFunctionObject.GMopenInTab("https://xbeibeix.com/api/bilibili/?monkey="+window.location.href, false);
				})
			},1500);
		};
		
		this.operatAcfun = function(){
			var ele,content='', h1, videolist;
			try{
				h1 = $('h1.title');
				videolist = JSON.parse(videoInfo.currentVideoInfo.ksPlayJson).adaptationSet[0].representation;
				if(videolist.length>0 && $('div#downloadlist').length==0){
					for(var i=0;i<videolist.length;i++){
						content = content + `<div style="margin:5px 0px;"><div style="display:inline-block;font-weight:bold;width:10%;">${videolist[i].qualityLabel}：</div><input type="text" style="color:#5FB404;width:68%" value="${videolist[i].url}"></div>`;
					}
					ele = `<div id="downloadlist" style="margin:15px 0px;color:#E5212E;"><div>\u8BF7\u4F7F\u7528m3u8\u4E0B\u8F7D\u5DE5\u5177（<a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">\u63A8\u8350\u5DE5\u5177</a>）</div>${content}</div>`;
				}
				h1.after(ele);
			}catch(e){
				console.log('acfun',e.message);
			}
		};
		
		this.bilibiliAcFunc = function(){
			var reg_bili = /www.bilibili.com\/video.*/;
			var reg_acfun = /www.acfun.cn\/v\/.*/;
			if(reg_bili.test(window.location.href)){
				this.operatBilibili();
			}else if(reg_acfun.test(window.location.href)){
				var $that = this;
				setInterval(function(){
					$that.operatAcfun();
				}, 500);
			}
		};
		
		this.operatOther = function(){
			switch (window.location.host) {
				case 'www.iqiyi.com':
					try{
						unsafeWindow.rate = 0;
						unsafeWindow.Date.now = () => {
							return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
						}
						setInterval(() => {
							unsafeWindow.rate = 0;
						}, 600000);
					}catch(e){}
					setInterval(() => {
						try{
							if (document.getElementsByClassName("cupid-public-time")[0] != null) {
								$(".skippable-after").css("display", "block");
								document.getElementsByClassName("skippable-after")[0].click();
							}
							$(".qy-player-vippay-popup").css("display", "none");
							$(".black-screen").css("display", "none");
						}catch(e){}
					}, 500);
					
					break
				case 'v.qq.com':
					setInterval(() => { //视频广告加速
						try{
							$(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
							$(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
						}catch(e){}
					}, 1000)
					setInterval(() => {
						try{
							var txp_btn_volume = $(".txp_btn_volume");
							if (txp_btn_volume.attr("data-status") === "mute") {
								$(".txp_popup_volume").css("display", "block");
								txp_btn_volume.click();
								$(".txp_popup_volume").css("display", "none");
							}
							//$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none");
							$(".mod_vip_popup").css("display", "none");
							$(".tvip_layer").css("display", "none");
							$("#mask_layer").css("display", "none");
						}catch(e){}
					}, 500);
					
					break
				case 'v.youku.com':
					try{
						window.onload = function () {
							if (!document.querySelectorAll('video')[0]) {
								setInterval(() => {
									document.querySelectorAll('video')[1].playbackRate = 16;
								}, 100)
							}
						}
					}catch(e){}
					setInterval(() => {
						try{
							var H5 = $(".h5-ext-layer").find("div")
							if(H5.length != 0){
								$(".h5-ext-layer div").remove();
								var control_btn_play = $(".control-left-grid .control-play-icon");
								if (control_btn_play.attr("data-tip") === "播放") {
									$(".h5player-dashboard").css("display", "block");
									control_btn_play.click();
									$(".h5player-dashboard").css("display", "none");
								}
							}
							$(".information-tips").css("display", "none");
						}catch(e){}
					}, 500);
					
					break
				case 'www.mgtv.com':
					
					break
				case 'tv.sohu.com':
					setInterval(() => {
						try{
							$(".x-video-adv").css("display", "none");
							$(".x-player-mask").css("display", "none");
							$("#player_vipTips").css("display", "none");
						}catch(e){}
					}, 500);
					
					break
				case 'www.bilibili.com':
					// setInterval(() => {
					// 	$(".player-limit-mask").remove();
					// }, 500);
					break
				case 'xbeibeix.com':
					setInterval(() => {
						$("#boxs").remove(".adsbygoogle");
						$(".adsbygoogle").remove();
						// $("#text-box").remove();
						// $("#aswift_1_expand").remove();
						// $("#accordionExample").remove();
						// $("#text1").remove();
						// $("#button").remove();
						// $(".basic-addon1").remove();
						// $("#text2").remove();
						// $("#exampleModal").remove();
						// $(".alert").remove();
						// $(".button-1").remove();
						// $(".row").attr("id","ccc");
						// $(".clearfix").attr("id","aaa");
						// $("#aaa").find("#button-1").attr("id","bbb");
						// $("#bbb").css("background-color","#E5212E");
						// var con="请点击解析视频";$("#bbb").text(con);
						// $("#ccc").remove();s
						// $("#basic").attr("id","eee");
						// $("#addon1").attr("id","ggg");
					}, 500);
					break
			}
		}
		this.bindEvent = function(){
			this.mouseEvent();
		};
		
		this.start = function(){
			this.operatOther();
			this.bilibiliAcFunc();
			if(this.isRun()){
				this.addHtmlElements();
				this.bindEvent();
			}
		};
	};
	
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
						var iconVideo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADOUlEQVRoQ+2Zz4uNURjHP9+F8g8gykKJNJMUUmzMDKZmYVYsLBRhOaEmFhRRLCZDY4PBrJRREkUMmY3URCk/s6GMhR9ZWNk9OvXO7b133ve+57w/7szUnLqbe59fn/Oc85znnCvm+NAcj595gHgGzWwDsBZYDawEFgI/gT/AR0nDZWe8lAyYWTewF9iTEeA4MCTpblkghQHM7BxwPDCgAUn9gTqJ4oUAzOwKcChnICOS9uXUranlBjCza8CBggFclHSkiI1cAGbWBTwt4jim2y3pSV5bwQBmtgq4BazP67RB7w3gsvAX+CbpV4hdL4CoPG4H3KcjxEEOWVdyHwPjkq5m6WcCmNmFaIaybFXx+2vgsqSRNOOpAGa2GHhY4lIpAnha0qkkA4kAZuZO0k9FPFag2yHJHYR1Iw3gO7CsgiCKmPwMdEmajBuZBmBmbuMcLOKpQt1BSUdTAczMVZmQmjwtpTmC3xqo0ybpw5ROXQbMrA+45GtQUmYVy7JlZpYl0/B73YZuBAjqbWYI4KWkzWkZeBVSNuMAZua1FBorSY4MTEpangYQlM4EgOdZy6ExazkAiNtoXELvgLasIGr0sT0QZaAVAO8ltadlYBTYNcsB7kjanQZwHjg2ywGaViHXIruN7DVmYA+4lnudpC+JGXBfhlwTZwDAPQi4s6o2kloJ9yzyyKcXajGA64F6JL1tChBlwdX0oIrSgirUK+l+49pudh/IhGhhBvolDSRtzKa9jJktBdxrWk+icvXnwO3oIexFWlXJbMbMbAGwJQWg1o0WWEKpLUjSBcZ7CXnV0ZhQXoBQP/MAUzNgZu5Z8EbRGQT2S7qZ107mHmhmuIQnl2lXxFCQQgDRmTEGbAt1DIxJ2pFDr06lDIBFgDsdlwQE8wNol/Q7QCdRtDBAlIVO4FlAMJ2SMk96H3ulAEQQh4FBD6d9koY85LxESgOIIK67qtLE87CkUt+cSgWIICaAjQkQE5I2eU1rgFAVACsA9/Dk/qGcGv+ANZK+BsTmJVo6QJSFXuBeLIKdkh54RRQoVAlABHECOAOclHQ2MC5v8coAIojR+AuCd1QBgpUCBMSRW3QeIPfUlaT4H0/7RUAi2a/NAAAAAElFTkSuQmCC";
						var html='<div id="'+eleId+'" style="width:25px;padding:10px 0px;text-align:center;background-color:#E5212E;position:fixed;top:250px;left:0px;color:#FFF;font-size:0px;z-index:9999999999999;cursor:pointer;margin:0px auto;text-align:center;">'+
							'<img src="'+iconVideo+'" style="width:20px;">'+
							'</div>';
						$("body").append(html);
						$("body").on("click", "#"+eleId, function(){
							var location_url = window.location.href;
							var videourl = "https://yt1s.com/?q="+location_url;
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
			var urls=["detail.tmall.com", "item.taobao.com", "item.jd.com", "item.yiyaojd.com", "npcitem.jd.hk"];
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
		this.createCouponHtml = function(platform, goodsId, goodsName){
			if(!platform || !goodsId) return;
			var goodsCouponUrl = "http://tt.shuqiandiqiu.com/api/coupon/discover?no=5&";
			goodsCouponUrl = goodsCouponUrl+"pl="+platform+"&id="+goodsId+"&qu="+goodsName;
			GM_xmlhttpRequest({
				url: goodsCouponUrl,
				method: "GET",
				headers: {"Content-Type": "application/x-www-form-urlencoded"},
				onload: function(response) {
					var status = response.status;
					if(status==200||status=='200'){
						var serverResponseJson = JSON.parse(response.responseText);
						var data = serverResponseJson.data;
						if(!data || data==="null"){
							return;
						}
						var cssText = data.css;
						var htmlText = data.html;
						var handler = data.handler;
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
		};
	}
	
	//全网音乐解析下载
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
	
	//最后统一调用
	try{
		(new superVideoHelper(newOriginalInterfaceList, playerNodes)).start();
	}catch(e){
		console.log("全网VIP解析：error："+e);
	}
	try{
		(new abroadVideoHelper()).start();
	}catch(e){
		console.log("国外视频解析：error："+e);
	}
	try{
		(new queryCoupon()).start();
	}catch(e){
		console.log("优惠券查询：error："+e);
	}
	try{
		(new superMusicHelper()).start();
	}catch(e){
		console.log("全网音乐下载：error："+e);
	}
})();