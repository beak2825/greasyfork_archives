// ==UserScript==
// @name         王总视频解析
// @namespace    baiwudu.com
// @version      1.1.2
// @description  各大视频网站VIP会员视频免费看，支持各大视频网站，操作更加便捷
// @author       作者：王总
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.wasu.cn/Play/show/id/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/*
// @match        *://v.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://kuhuiv.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/374843/%E7%8E%8B%E6%80%BB%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/374843/%E7%8E%8B%E6%80%BB%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
var youku = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">优</span>'
var qq = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">腾</span>'
var nothing = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:transparent;margin:3.78vw 2.1vw;">综</span>'
var apis = [{
name:nothing + "播放源一",url:"https://z1.m1907.cn/?a=1&jx=",title:"全能播放路线一"
},{
name:nothing + "播放源二",url:"http://api.zuilingxian.com/jiexi.php?url=",title:"全能路线二"
},{
name:nothing + "王总带刷网",url:"http://www.baiwudu.cn/?",title:"ww"
},{
name:nothing + "王总刷刷网",url:"http://www.baiwudu.com/?",title:"据说"
}, {
name:nothing + "带刷网二",url:"http://www.baiwudu.top/?",title:"多线路"
} ];
//添加链接
function createSelect (apis) {
	var myul = document.createElement("ul");
	myul.id = "myul";
	myul.setAttribute("style","display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:33vh;right:12vw;z-index:99999;height:50vh;overflow:scroll;border-radius:1.26vw;");
	for (var i = 0; i < apis.length; i ++) {
		var myli = document.createElement("li");
		var that=this;		myli.setAttribute("style","margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
		(function (num) {
			myli.onclick = function () {
				window.open(apis[num].url + location.href,'_blank');
			};			myli.ontouchstart = function () {				this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";			}
			myli.ontouchend = function () {				this.style.cssText += "color:black;background:transparent;border-radius:0;";			}
		})(i);
		myli.innerHTML = apis[i].name;		myul.appendChild(myli);
	}
	document.body.appendChild(myul);
}
//唤出菜单
function createMenu(){
	var myBtn = document.createElement("div");
	myBtn.id = "myBtn";
	myBtn.innerHTML = "+";
	myBtn.setAttribute("style","width:15vw;height:15vw;position:fixed;bottom:20vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:15vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:5.5vw;background:#fff;");
	myBtn.onclick = function (){
		var myul = document.getElementById("myul");
		if(myul.style.display == "none"){			myul.style.display = "block";			this.style.transform="rotateZ(45deg)";		}else{			myul.style.display = "none";			this.style.transform="rotateZ(0deg)";
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