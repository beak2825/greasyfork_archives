// ==UserScript==
// @name         瓶瓶蛋蛋才是真（ALOOK）
// @namespace    http://tampermonkey.net/
// @version           1.0.4
// @description       简单、纯粹、拥抱生活
// @author            zh
// @match           *://v.qq.com/x/page/*
// @match           *://v.qq.com/x/cover/*
// @match           *://v.qq.com/tv/*
// @match           *://*.iqiyi.com/v_*
// @match           *://*.iqiyi.com/a_*
// @match           *://*.iqiyi.com/w_*
// @match           *://*.iq.com/play/*
// @match           *://*.youku.com/v_*
// @match           *://*.mgtv.com/b/*
// @match           *://*.tudou.com/listplay/*
// @match           *://*.tudou.com/programs/view/*
// @match           *://*.tudou.com/albumplay/*
// @match           *://film.sohu.com/album/*
// @match           *://tv.sohu.com/v/*
// @match           *://*.bilibili.com/video/*
// @match           *://*.bilibili.com/bangumi/play/*
// @match           *://v.pptv.com/show/*
// @match           *://vip.pptv.com/show/*
// @match           *://www.wasu.cn/Play/show/*
// @match           *://*.le.com/ptv/vplay/*
// @match           *://*.acfun.cn/v/*
// @match           *://*.acfun.cn/bangumi/*
// @match           *://*.1905.com/play/*
// @match           *://m.v.qq.com/x/page/*
// @match           *://m.v.qq.com/x/cover/*
// @match           *://m.v.qq.com/*
// @match           *://m.iqiyi.com/*
// @match           *://m.iqiyi.com/kszt/*
// @match           *://m.youku.com/video/*
// @match           *://m.mgtv.com/b/*
// @match           *://m.tv.sohu.com/v/*
// @match           *://m.film.sohu.com/album/*
// @match           *://m.pptv.com/show/*
// @match           *://m.bilibili.com/anime/*
// @match           *://m.bilibili.com/video/*
// @match           *://m.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459116/%E7%93%B6%E7%93%B6%E8%9B%8B%E8%9B%8B%E6%89%8D%E6%98%AF%E7%9C%9F%EF%BC%88ALOOK%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459116/%E7%93%B6%E7%93%B6%E8%9B%8B%E8%9B%8B%E6%89%8D%E6%98%AF%E7%9C%9F%EF%BC%88ALOOK%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	var souces = `//
	博客 http://www.zhangwenbing.com/plugin/tools/video#url=
	冰豆 https://bd.jx.cn/?url=
	365 https://chaxun.truechat365.com/?url=
	parwix稳定 https://jx.bozrc.com:4433/player/?url=
	OK解析 https://okjx.cc/?url=`;
	
	var nothing =
    '<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:transparent;margin:3.78vw 2.1vw;">综</span>';
	
	//接口
	function getApis(){
	    let apis = [];
		var arr=souces.split("\n");
		var items = '';
		for (let i = 0; i < arr.length; i++) {
			let sz = arr[i].replace('\t','').split(' ');
			let name = sz[0];
			if(name.indexOf("//")>-1){
				continue
			}
			let url = sz[1];
			let item = {
				name: nothing+name,
				url: url,
				title: "综合接口"
			};
			apis.push(item);
		}
		return apis;
	}

	//添加链接
	function createSelect(apis) {
		var myul = document.createElement("ul");
		myul.id = "myul";
		myul.setAttribute("style",
			"display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:17vh;right:6vw;z-index:99999;height:45vh;overflow:scroll;border-radius:1.26vw;");
		for (var i = 0; i < apis.length; i++) {
			var myli = document.createElement("li");
			var that = this;
			myli.setAttribute("style",
				"margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:30.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
			(function (num) {
				myli.onclick = function () {
					window.open(apis[num].url + location.href.replace('/m.','/'), '_blank');
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

	//唤出菜单
	function createMenu() {
		var myBtn = document.createElement("div");
		myBtn.id = "myBtn";
		myBtn.innerHTML = "";
		myBtn.setAttribute("style",
		 "width:10vw;height:10vw;position:fixed;bottom:10vh;right:6vw;z-index:100000;border-radius:100%;text-align:center;line-height:10vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:8vw;background:#fff;");
		myBtn.onclick = function () {
			var myul = document.getElementById("myul");
			if (myul.style.display == "none") {
				myul.style.display = "block";
				this.style.transform = "rotateZ(45deg)";
			} else {
				myul.style.display = "none";
				this.style.transform = "rotateZ(0deg)";
			}
		}
		document.body.appendChild(myBtn);
	}

	if (location.href.match(".iqiyi.com") || location.href.match(".youku.com") || location.href.match(".le.com") ||
		location.href.match(".letv.com") || location.href.match("v.qq.com") || location.href.match("film.qq.com") || location.href.match(".tudou.com") ||
		location.href.match(".mgtv.com") || location.href.match("film.sohu.com") || location.href.match("tv.sohu.com") ||
		location.href.match(".acfun.cn") || location.href.match(".bilibili.com") || location.href.match(".pptv.com") ||
		location.href.match("vip.1905.com") || location.href.match(".yinyuetai.com") || location.href.match(".fun.tv") ||
		location.href.match(".56.com") || location.href.match(".wasu.cn")) {
		createMenu();
		createSelect(getApis());
	}

})();