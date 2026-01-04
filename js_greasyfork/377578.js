// ==UserScript==
// @name     破解VIP会员视频集合
// @namespace  https://greasyfork.org/zh-CN/users/104201
// @version    4.3.4
// @description  一键破解[优酷|腾讯|乐视|爱奇艺|芒果|AB站|音悦台]等VIP或会员视频，解析接口贵精不贵多，绝对够用。详细方法看说明和图片。包含了[一键VIP视频解析、去广告（全网） xxxx-xx-xx 可用▶mark zhang][VIP视频在线解析破解去广告(全网)xx.xx.xx更新可用▶sonimei134][破解全网VIP视频会员-去广告▶ttmsjx][VIP会员视频解析▶龙轩][酷绘-破解VIP会员视频▶ahuiabc2003]以及[VIP视频破解▶hoothin]的部分接口。[Tampermonkey | Violentmonkey | Greasymonkey 4.0+]
// @author     黄盐
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @match    *://*.iqiyi.com/*
// @match    *://*.youku.com/*
// @match    *://*.le.com/*
// @match    *://*.letv.com/*
// @match    *://v.qq.com/*
// @match    *://*.tudou.com/*
// @match    *://*.mgtv.com/*
// @match    *://film.sohu.com/*
// @match    *://tv.sohu.com/*
// @match    *://*.acfun.cn/v/*
// @match    *://*.bilibili.com/*
// @match    *://vip.1905.com/play/*
// @match    *://*.pptv.com/*
// @match    *://v.yinyuetai.com/video/*
// @match    *://v.yinyuetai.com/playlist/*
// @match    *://*.fun.tv/vplay/*
// @match    *://*.wasu.cn/Play/show/*
// @match    *://*.56.com/*
// @exclude  *://*.bilibili.com/blackboard/*
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM.xmlHttpRequest
// @grant    GM_openInTab
// @grant    GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/377578/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377578/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(() => {
  'use strict';

var youku = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">浼�</span>'

var qq = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">鑵�</span>'

var nothing = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:transparent;margin:3.78vw 2.1vw;">缁�</span>'

var apis = [{
name:nothing + "线路1�",url:"http://api.baiyug.cn/vip/index.php?url=",title:"杞湀鍦堝氨鎹㈢嚎璺�"
},{
name:qq + "线路2",url:"http://api.bbbbbb.me/vip/?url=",title:"鏀寔鑵捐"
},{
name:qq + "线路3",url:"http://jqaaa.com/jx.php?url=",title:"鏀寔鑵捐"
},{
name:youku + "线路4�",url:"http://17kyun.com/api.php?url=",title:"缁煎悎鎺ュ彛"
}, {
name:nothing + "线路5",url:"http://tv.wandhi.com/go.html?url=",title:"缁煎悎鎺ュ彛锛岀牬瑙ｅ叏缃�"
},{
name:youku + "线路6",url:"https://cdn.yangju.vip/k/?url=",title:"鎹浼橀叿姣旇緝绋冲畾"
}, {
name:nothing + "线路7",url:"https://vip.mpos.ren/v/?url=",title:"缁煎悎鎺ュ彛"
}, {
name:nothing + "线路8",url:"http://api.xfsub.com/index.php?url=",title:"1905浼樺厛浣跨敤"
},{
name:nothing + "鐭冲ご瑙ｆ瀽",url:"https://jiexi.071811.cc/jx.php?url=",title:"鎵嬪姩鐐规挱鏀�"
},{
name:nothing + "鏃犲悕灏忕珯",url:"http://www.sfsft.com/admin.php?url=",title:"鏃犲悕灏忕珯鍚屾簮"
}, {
name:nothing + "VIP鐪嬬湅",url:"http://q.z.vip.totv.72du.com/?url=",title:"鏇存崲绾胯矾鎴愬姛鐜囦細鎻愰珮"
},{
name:nothing + "ODFLV",url:"http://aikan-tv.com/?url=",title:"涓嶇ǔ瀹氾紝骞垮憡杩囨护杞欢鍙兘鏈夊奖鍝�"
},{
name:nothing + "163浜�",url:"http://jx.api.163ren.com/vod.php?url=",title:"鍋跺皵鏀寔鑵捐"
},{
name:nothing + "CKFLV",url:"http://www.0335haibo.com/tong.php?url=",title:"CKFLV浜�,閮ㄥ垎绔欑偣涓嶆敮鎸�"
},{
name:nothing + "鏃犲悕灏忕珯2",url:"http://www.wmxz.wang/video.php?url=",title:"杞湀鍦堝氨鎹㈢嚎璺�"
},{
name:nothing + "鐪肩潧浼氫笅闆�",url:"http://www.vipjiexi.com/yun.php?url=",title:"www.vipjiexi.com"
},{
name:youku + "1008褰辫",url:"http://api.1008net.com/v.php?url=",title:"鎹鍙互鐪嬪竷琚嬫父鎴忚棰�"
}, {
name:nothing + "浜轰汉鍙戝竷",url:"http://v.renrenfabu.com/jiexi.php?url=",title:"缁煎悎锛屽绾胯矾"
} ];


//娣诲姞閾炬帴
function createSelect (apis) {
	var myul = document.createElement("ul");
	myul.id = "myul";
	myul.setAttribute("style","display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:33vh;right:12vw;z-index:99999;height:50vh;overflow:scroll;border-radius:1.26vw;");
	for (var i = 0; i < apis.length; i ++) {
		var myli = document.createElement("li");
		var that=this;
		myli.setAttribute("style","margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
		(function (num) {
			myli.onclick = function () {
				window.open(apis[num].url + location.href,'_blank');
			};
			myli.ontouchstart = function () {
				this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
			}
			myli.ontouchend = function () {
				this.style.cssText += "color:black;background:transparent;border-radius:0;";
			}
		})(i);
		myli.innerHTML = apis[i].name;
		myul.appendChild(myli);
	}
	document.body.appendChild(myul);
}

//鍞ゅ嚭鑿滃崟
function createMenu(){
	var myBtn = document.createElement("div");
	myBtn.id = "myBtn";
	myBtn.innerHTML = "+";
	myBtn.setAttribute("style","width:15vw;height:15vw;position:fixed;bottom:20vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:15vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:5.5vw;background:#fff;");
	myBtn.onclick = function (){
		var myul = document.getElementById("myul");
		if(myul.style.display == "none"){
			myul.style.display = "block";
			this.style.transform="rotateZ(45deg)";
		}else{
			myul.style.display = "none";
			this.style.transform="rotateZ(0deg)";
		}
	}
	document.body.appendChild(myBtn);
}
/*document.addEventListener("DOMContentLoaded",function () {
	createMenu();
	createSelect(apis);
});*/
if(location.href.match(".iqiyi.com") || location.href.match(".youku.com") || location.href.match(".le.com") || location.href.match(".letv.com") || location.href.match("v.qq.com") || location.href.match(".tudou.com") || location.href.match(".mgtv.com") || location.href.match("film.sohu.com") || location.href.match("tv.sohu.com") || location.href.match(".acfun.cn") || location.href.match(".bilibili.com") || location.href.match(".pptv.com") || location.href.match("vip.1905.com") || location.href.match(".yinyuetai.com") || location.href.match(".fun.tv") || location.href.match(".56.com") || location.href.match(".wasu.cn")) {
		createMenu();
		createSelect(apis);
}


/** 2017-10-24  自定义解析接口 END */

})();


