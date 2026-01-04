// ==UserScript==
// @name         公需科目|学习|考试
// @namespace    gxkm
// @license      CC BY-NC-SA
// @version      2024.5.15.1400
// @description  选择课程点进去，全自动操作，只需要选择你要学习的课程即可，会自动播放，自动答题。
// @author       9527
// @match        https://rsjapp.mianyang.cn/jxjy/pc/*
// @match        https://rsjapp.mianyang.cn/jxjy/pc/ksz*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/494728/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%7C%E5%AD%A6%E4%B9%A0%7C%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/494728/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%7C%E5%AD%A6%E4%B9%A0%7C%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==


(function() {
	'use strict';
	var tihao = 0;

	// 获取当前网址
	var currentURL = window.location.href;
	window.onload = function () {
		createLogBox();
		addTextToLogBox("脚本加载成功！");
		if (currentURL.includes("jxjy/pc/index")) {
			addTextToLogBox("当前在 主页，即将打开 我的课程")
			window.onload = function () {}
			document.querySelector("#main > header > div > header > div.header > div > ul.navicat.flex_start_center > li:nth-child(2) > a").click()
		}
		if (currentURL.includes("jxjy/pc/zxxx")) {
			addTextToLogBox("当前在 学习页面，马上开始学习")
			window.onload = function () {}
			setInterval(playVideodianjianniu,3000);
		}else if (currentURL.includes("pc/wdkc")) {
			addTextToLogBox("当前在 我的课程页面")
			// 考试处于灰色状态，点击学习
			if (document.querySelector("#main > div > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3)").className == 'disabledbutton') {
				addTextToLogBox("考试处于灰色状态，点击学习")
				addTextToLogBox(document.querySelector("#main > div > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3)").className == 'disabledbutton')
				document.querySelector("#main > div > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > a").click();
			}
			addTextToLogBox(document.querySelector("#main > div > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3)").className == 'disabledbutton')


			var kaoshizhong = 0;
			let timer = setInterval(()=>{
				//点击 正式考试 document.querySelector("#main > div.container > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > a
				//点击 模拟考试 document.querySelector("#main > div > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > a")
				var kaoshi = document.querySelector("#main > div.container > div.rightReault > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > a")
				if (kaoshi != null && kaoshizhong == 0) {
					//点击 正式考试
					clearInterval(timer);
					kaoshizhong = 1;
					kaoshi.click();
				}
				//location.reload();
			},20000);

		}else if (currentURL.includes("ksz")) {
			// 拦截所有的XHR请求
			addTextToLogBox("考试中")
			document.querySelector(".test-btn-down").click()
			window.XMLHttpRequest.prototype.realOpen = window.XMLHttpRequest.prototype.open;
			window.XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
				this.realOpen(method, url, async, user, pass);

				// 添加请求事件监听
				this.addEventListener('readystatechange', function() {
					if (this.readyState === 4) { // 请求完成
						if(url.includes('https://rsjapp.mianyang.cn/jxjy/pc/lcService/getData/mye003.do')){
							tihao++;
							var data = this.responseText;
							// 获取响应数据
							dati(data,tihao)
						}

					}
				});
			};
			document.querySelector(".test-btn-up").click()
		}

	};

})();



// 在新窗口中打开一个网页
function openNewWindow(url) {
	window.open(url, "_blank");
}


function NextPlayPage(){
	var lenth = document.querySelectorAll(".videoList .title .overTitle").length;
	var bofangShiPing = document.querySelector("#videoTitle").innerText
	var shipingList = document.querySelectorAll(".videoList .title .videoName")
	var dangqianShiPing = ""
	// 判断视频播放是否完成
	for (var i = 0; i < lenth; i++) {
		dangqianShiPing = shipingList[i].innerText
		if(bofangShiPing.includes(dangqianShiPing)){
			if(document.querySelectorAll(".videoList .title .overTitle")[i].innerText === "【已完成】"){
				if (i==lenth-1) {
					// 已学完
					addTextToLogBox("已学完")
					// 学习完成
					if (document.querySelector("#jAlertButton > #jAlertButton") != null) {
						document.querySelector("#jAlertButton > #jAlertButton").click()
					}

				} else {
					shipingList[i + 1].click();
					clickJiXuAnNiu();
				}

			}
            break;
		}
	}
}




//日志函数
function addTextToLogBox(TextLog) {
	// 获取目标 <div> 元素
	var targetDiv = document.getElementById('logBox'); // 替换为你的目标 <div> 元素的 ID
	targetDiv.appendChild(document.createElement('br'));
	// 创建文本节点
	var textNode = document.createTextNode(TextLog);
	// 添加文本节点到目标 <div> 元素
	targetDiv.appendChild(textNode);
	targetDiv.scrollTop = targetDiv.scrollHeight;
}

//创建日志框
function createLogBox() {
	var logBox = document.createElement('div');
	logBox.id = 'logBox';
	logBox.style.position = 'fixed';
	logBox.style.bottom = '0';
	logBox.style.left = '0';
	logBox.style.width = '200px';
	logBox.style.height = '200px';
	logBox.style.backgroundColor = 'green'; // 更改背景颜色为绿色黑色
	logBox.style.color = 'black'; // 更改文本颜色为绿色黑色
	logBox.style.overflow = 'auto';
	logBox.style.padding = '10px';
	logBox.style.fontFamily = 'Arial, sans-serif';
	logBox.style.whiteSpace = 'pre-wrap';
	document.body.appendChild(logBox);
}



//点击继续学习
function clickJiXuAnNiu() {
	var jixu = document.querySelector("#jAlertButton2")
    var bf = document.querySelector("#vod-player > button")
    var querySelectors = "#vod-player > button > span.vjs-icon-placeholder"
    var dianjiqueding = document.querySelector(querySelectors)
    if (dianjiqueding == null) {
        console.log("没找到继续学习")
    } else {
        //点击确定按钮
        dianjiqueding.click()
    }
    if (jixu == null) {

	}else{
		bf.click()
	}
	if (jixu == null) {

	}else{
		jixu.click()
	}
	if (document.querySelector('video')) {
		document.querySelector('video').playbackRate = 16.0;
	}
	var videoClassName = document.querySelector("#video > div").className
	if(videoClassName.includes("vjs-paused")){
		document.querySelector("#vod-player > button > span.vjs-icon-placeholder").click()
	}
}

function playVideodianjianniu() {
	window.onload = function () {}
	NextPlayPage()
	if (document.querySelector(".vjs-big-play-button")) {
		document.querySelector(".vjs-big-play-button").click()
	}
	//播放暂停，点击播放按钮
	var videoClassName = document.querySelector("#video > div").className
	if(videoClassName.includes("vjs-paused")){
		console.log("播放已暂停")
		document.querySelector("#vod-player > button > span.vjs-icon-placeholder").click()
	}

	let yuansu = document.querySelector("#vod-player > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused")
    if (yuansu == null) {
        clickJiXuAnNiu()
        console.log("正在播放")
    } else {
        //点击确定按钮
        var jingdu = document.querySelector("#vod-player > div.vjs-control-bar > div.vjs-remaining-time.vjs-time-control.vjs-control > span.vjs-remaining-time-display").innerText
		if (jingdu != "0:00") {
            addTextToLogBox(document.querySelector("#videoTitle").innerText + jingdu)
		}
    }
}

function dati(data,tihao){
	var json=JSON.parse(data);
				// 使用JSON.parse()进行解析：使用JSON对象的静态方法parse()，将字符串解析为对象。
				var daAn = json["resultData"]["data"]["data"]["questionMap"]["option"]["adz006"]
				var shengYuTime
				addTextToLogBox(tihao + " : " + daAn)
				setTimeout(function() {
					// 这里是延迟执行的代码
					var array = daAn.split(',');
					array.forEach(element => {
						var xuanzhe = "#test-part-box p[data-value=" + element + "]"
						setTimeout(function() {
							document.querySelector(xuanzhe).click()
						},500)
					});
					if (tihao < 50) {
						setTimeout(() => {
							document.querySelector(".test-btn-down").click()
						}, 1000);

					}else{
						addTextToLogBox("答题完成，等待交卷。");
						const intervalId = setInterval(() => {
							shengYuTime = document.querySelector("#remain").innerText
							var arr = shengYuTime.split(':')
							var t = parseInt(arr[1])
							if (t < 20) {
								document.querySelector("div.test-info .submitBtn").click()
								clearInterval(intervalId);
								setTimeout(() => {
									var qd = document.querySelector("#jAlertButton2")
									if (qd != null) {
										qd.click()
									}

								}, 3000);
							}
							let yuansu = document.querySelector("#jAlertButton")
							if (yuansu != null) {
							    yuansu.click()
							}

						}, 5000);

					}

				}, 1000);

}