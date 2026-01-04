// ==UserScript==
// @name     破解VIP会员
// @version    0.0.2
// @description  手机浏览器破解[优酷|腾讯|乐视|爱奇艺|芒果|AB站|音悦台]等VIP或会员视频，解析接口贵精不贵多，绝对够用。
/* 小书签：
javascript:(function(){var element=document.createElement('script');element.setAttribute('src','https://greasyfork.org/zh-CN/scripts/破解VIP会员.user.js');document.body.appendChild(element);})() 
*/
// @author     莫名母老虎
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

// @namespace https://greasyfork.org/users/242975
// @downloadURL https://update.greasyfork.org/scripts/377264/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/377264/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

/*定义图标*/
var tubiao = '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">免</span>'

/*无广告解析站点*/
var apis = [{
name:tubiao + "一号解析",url:"https://api.bbbbbb.me/jx/?url=",title:""
},{
name:tubiao + "二号解析",url:"https://api.smq1.com/?url=",title:""
},{
name:tubiao + "三号解析",url:"https://z1.m1907.cn/?jx=",title:""
},{
name:tubiao + "四号解析",url:"http://app.baiyug.cn:2019/vip/?url=",title:""
},{
name:tubiao + "五号解析",url:"http://beaacc.com/api.php?url=",title:""
},{
name:tubiao + "六号解析",url:"http://2gty.com/apiurl/yun.php?url=",title:""
}

];



//创建选择框
function createSelect (apis) {
	var myul = document.createElement("ul");
	myul.id = "myul";
	myul.setAttribute("style","display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:33vh;right:12vw;z-index:99999;height:40vh;overflow:scroll;border-radius:1.26vw;");
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

//创建菜单按钮
function createMenu(){
	var myBtn = document.createElement("div");
	myBtn.id = "myBtn";
	myBtn.innerHTML = "+";
	myBtn.setAttribute("style","width:15vw;height:15vw;position:fixed;bottom:20vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:15vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:5.5vw;background:#fff;");

/*点击事件*/
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

/*关联视频网*/
	/*关联视频网*/
	if(location.href.match("m.iqiyi.com/v_*") || location.href.match("m.iqiyi.com/w_*") || location.href.match("m.iqiyi.com/a_*") || location.href.match("m.iqiyi.com/dianying/*") ||location.href.match("m.youku.com/video/") ||location.href.match("m.youku.com/alipay_video/") || location.href.match("m.v.qq.com/play*") || location.href.match("m.v.qq.com/x/") || location.href.match(".tudou.com/v/") || location.href.match("m.mgtv.com/b/") || location.href.match("m.film.sohu.com/album/") || location.href.match("m.tv.sohu.com/v_*") || location.href.match("m.acfun.cn/v/") || location.href.match("m.bilibili.com/video/") || location.href.match("m.pptv.com/show/") || location.href.match("vip.1905.com/play/") || location.href.match("m.fun.tv/vplay/") || location.href.match("m.56.com/c/") || location.href.match("m.wasu.cn/wap/Play/show/id/")) {
		
		createMenu();
		createSelect(apis);}