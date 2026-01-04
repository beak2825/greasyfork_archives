// ==UserScript==
// @name         小蓝B站下载器功能优化
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  隐藏小蓝B站下载器捐赠页面,优化下载按钮图形和位置
// @author       tutu辣么可爱
// @include      *://*.bilibili.com/video/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431756/%E5%B0%8F%E8%93%9DB%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%99%A8%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431756/%E5%B0%8F%E8%93%9DB%E7%AB%99%E4%B8%8B%E8%BD%BD%E5%99%A8%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	//AddBtn方法用于添加一个新下载图标
	function AddBtn(HostObj) {
		//AddBtnFlag置false,停止循环执行AddBtn方法
		AddBtnFlag = false;
		//获取、创建所需元素
		var a = document.getElementsByClassName("ops")[0];
		var b = document.createElement("span");
		var c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var d = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var e = document.createElement("span");
		var f = HostObj.shadowRoot.querySelector("#main");
		var g = HostObj.shadowRoot.querySelector("#toggle");
		//构建新按钮
		b.title = "下载";
		b.setAttribute("class", "download");
		c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		c.setAttribute("viewBox", "0 0 34 34");
		c.style = "width: 34px; height: 34px; left: -3px; top: -3px;";
		c.setAttribute("class", "ring-progress");
		c.setAttribute("fill", "#757575");
		d.setAttribute("d", "M13 8h8v8h-8z M9 16L25 16 17 25z M6 25h22v2h-22z M6 21h2v4h-2z M26 21h2v4h-2z");
		e.innerText = "下载";
		e.style = "padding-left:34px;color:#505050;";
		//改变原页面标题
		f.children[0].innerText = "小蓝B站视频下载器(优化版)";
		//新按钮加上鼠标悬停/离开/点击功能
		b.onmouseover = function() {
			c.setAttribute("fill", "#00a1d6");
			e.style.color = "#00a1d6";
		}
		b.onmouseleave = function() {
			c.setAttribute("fill", "#757575");
			e.style.color = "#505050";
		}
		b.onclick = function() {
			g.click();
		}
		//在页面上添加新按钮
		a.appendChild(b);
		b.appendChild(c);
		b.appendChild(e);
		c.appendChild(d);
	}
	//HideFn方法用于隐藏原下载界面相关部分
	function HideFn(HostObj) {
		//运行成功标志
		var operation0 = false;
		var operation1 = false;
		//从bilibili-helper-host中获取id为side-bar的对象，这个对象就是捐赠部分
		var SideBar = HostObj.shadowRoot.querySelector("#side-bar");
		//从bilibili-helper-host中获取id为bilibliHelperLogs的对象，这个对象就是日志部分
		var HelperLogs = HostObj.shadowRoot.querySelector("#bilibliHelperLogs");
		//以防万一，先确认对象存在，再进行下一步
		if (SideBar) {
			//隐藏捐赠部分
			SideBar.style.display = "none";
			//隐藏成功，运行标志operation0置true
			operation0 = true;
		}
		if (HelperLogs) {
			//日志宽度重设
			HelperLogs.style.width = "100%";
			HelperLogs.style.maxWidth = "max-content";
			//重设成功，运行标志operation1置true
			operation1 = true;
		}
		//全部操作都成功,HideFnFlag置false,停止循环执行HideFn方法
		if (operation0 && operation1) {
			HideFnFlag = false;
		}
	}
	//隐藏或显示原下载页面
	function OriginDisplayStyle(HostObj) {
		//获取原下载按钮内容
		var a = HostObj.shadowRoot.querySelector("#toggle").innerText;
		//获取原下载页面主体框架
		var b = HostObj.shadowRoot.querySelector("#content");
		//通过判断原下载按钮内容来显示/隐藏原下载页面
		if (a === "收起") {
			b.style.display = "";
		} else {
			b.style.display = "none";
		}
	}
	//主程序部分
	//运行标志
	var HideFnFlag = true;
	var AddBtnFlag = true;
	//启动定时器,间隔为200ms
	var Timer = setInterval(function() {
		//ID为bilibili-helper-host的元素就是原下载页面部分
		var HostObj = document.getElementById("bilibili-helper-host");
		//通过判断HostObj是否存在来判断是否启动了相关扩展
		if (HostObj) {
			//循环执行OriginDisplayStyle方法
			OriginDisplayStyle(HostObj);
			//通过HideFnFlag判断是否需要执行HideFn方法
			if (HideFnFlag) {
				HideFn(HostObj);
			}
			//通过AddBtnFlag判断是否需要执行AddBtn方法
			if (AddBtnFlag) {
				//视频总时长元素
				let LoadFinishFlag = document.getElementsByClassName("bilibili-player-video-time-total")[0];
				//只有播放器、视频加载完毕(判断标准:视频总时长元素存在且不为00:00)才执行AddBtn方法
				if (LoadFinishFlag && LoadFinishFlag.innerText !== "00:00") {
					AddBtn(HostObj);
				}
			}
		}
	}, 200);
	console.log("小蓝B站下载器功能优化启动(定时器ID:" + Timer + ")");
})();
