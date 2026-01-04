// ==UserScript==
// @name         中国大学慕课icourse163最大音量放大
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  中国大学生慕课icourse163最大音量放大，可以将音量调整成n倍
// @author       Re-Hao
// @match        https://www.icourse163.org/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418884/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E6%85%95%E8%AF%BEicourse163%E6%9C%80%E5%A4%A7%E9%9F%B3%E9%87%8F%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/418884/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E6%85%95%E8%AF%BEicourse163%E6%9C%80%E5%A4%A7%E9%9F%B3%E9%87%8F%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

/*
  v0.3版本说明
	修复了导致页面卡死的bug
  v0.2版本说明
    内部版本, 修复了部分bug以及版本说明
  v0.1版本说明
    当从视频界面切换到其他页面时, 会由于video检测处的do-while死循环问题导致页面内存泄露卡死.
*/

(function() {
	'use strict';

	// 脚本全局变量
	window._rh = {};
	// 初始化音量的默认值
	function initVideoVolumnValue() {
		window.localStorage.setItem("rhdata", JSON.stringify({
			volumn: 6.0
		}));
	}
	// 判断是否匹配界面
	const matchPage = () => {return /#\/learn\/content\?type=detail.*/i.test(location.hash)};
	// 视频转换器的interval
	let converterInterval = undefined;
	// 转换器的运行状态
	let videoVolumnConverterRunningStatus = false;
	
	// 设置默认的音量值, 在localstorage中添加脚本变量
	if (!window.localStorage.getItem('rhdata')) {
		initVideoVolumnValue();
	}
	
	// 核心函数, 转换视频的音量, 返回一个自构造的包含AudioContext对象, 后续对视频最大音量修改可以使用返回值
	function amplifyMedia(mediaElem, multiplier) {
		var context = new(window.AudioContext || window.webkitAudioContext),
			result = {
				context: context,
				source: context.createMediaElementSource(mediaElem),
				gain: context.createGain(),
				media: mediaElem,
				amplify: function(multiplier) {
					result.gain.gain.value = multiplier;
				},
				getAmpLevel: function() {
					return result.gain.gain.value;
				}
			};
		result.source.connect(result.gain);
		result.gain.connect(context.destination);
		result.amplify(multiplier);
		return result;
	}

	// 由于icourse163为单页面应用, 并且使用了React Router Hash History模式
	// Tampermonkey的@mathch关键字不支持匹配'#'后的字符串,因此需要在脚本内判断
	// 此处设置一个定时器, 每3秒检测一次当前页面的路径是否匹配目标链接
	const _begin = setInterval(() => {
		//console.log('开始检查页面路径');
		// 匹配视频界面
		if (matchPage()) {
			//console.log('页面路径匹配');
			// 开始视频音量转换
			startVideoVolumnConverter();
		} else {
			//console.log('页面路径不匹配');
			// 停止视频音量转换
			stopVideoVolumnConverter();
			return;
		}
	}, 3000);
	
	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms))
	}
	
	// 开启视频音量转换器
	function startVideoVolumnConverter() {
		if (videoVolumnConverterRunningStatus) {
			//console.log('单例函数startVideoVolumnConverter重复运行, 直接退出');
			return;
		}
		//console.log('******* 单例函数startVideoVolumnConverter启动了 *********');
		// 将运行标志位设置为true
		videoVolumnConverterRunningStatus = true;
		if ( !document.getElementById("rh-container") ) {
			// 视频顶部导航栏
			const volumnContainer = document.getElementsByClassName('titleBar')[0];
			// 音量设置输入框以及修改按钮的容器
			const volumnBox = document.createElement('div');
			// TODO
			// 目前对输入框输入的内容没有检查
			volumnBox.innerHTML = 
				'<input style="width: 80px; height: 20px; padding: 2px; border: 1px solid black; border-radius: 10px;" id="rh-volumn">' +
				`<button onclick="window.localStorage.setItem('rhdata', JSON.stringify({volumn: document.getElementById('rh-volumn').value}));alert('设置成功！');location.reload();">修改音量</button>`;
			volumnBox.id = 'rh-container';
			volumnContainer.appendChild(volumnBox);
			// rh-container中的音量输入框对象
			const volumnInput = document.getElementById("rh-volumn");
			// 将音量输入框的值设置为localstorage中的值
			volumnInput.value = JSON.parse(window.localStorage.getItem('rhdata')).volumn;
		}
		
		// 正式启动脚本
		let video = undefined;
		let playButton = undefined;
		let videoVolumn = undefined;
		// 开始循检测网页中的视频, 使用async-await模式放置死循环
		converterInterval = setInterval(async () => {
			do {
				//console.log('video循环');
				// 如果页面不匹配, 则直接退出本次循环
				if (!matchPage()) {
					//console.log('--------- 由于页面不匹配直接跳出video循环');
					return;
				}
				await sleep(500);
				video = document.getElementsByTagName('video')[0];
			// 当video标签不存在, 一直循环检测Video
			} while ( !video )
			//console.log('音量解析运行');
			// 尝试解析音量值
			try {
				videoVolumn = parseFloat('' + JSON.parse(window.localStorage.getItem('rhdata')).volumn)
			} catch {
				// 初始化音量值
				initVideoVolumnValue();
				videoVolumn = 6.0;
			}
			// 判断视频还是不是之前保存的视频, 如果不是的话就更新视频以及音量值
			if (window._rh.video !== video) {
				//console.log('找到了新的视频, 开始进行音量转换');
				window._rh.video = video;
				let result = amplifyMedia(video, videoVolumn);
				window._rh.result = result;
			} else {
				//console.log('还是旧的视频, 什么都不做, 将在1秒后进行下一轮检查');
				// None
			}
		}, 1000);		
	}
	
	// 停止视频转换
	function stopVideoVolumnConverter() {
		clearInterval(converterInterval);
		// 将运行标志位设置为false
		videoVolumnConverterRunningStatus = false;
	}
})();

