// ==UserScript==
// @name        传智教育-微信小程序自动播放
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  微信小程序自动播放
// @author       By_小小怪
// @match        https://stu.ityxb.com/preview/detail/*
// @icon         https://stu.ityxb.com//favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454199/%E4%BC%A0%E6%99%BA%E6%95%99%E8%82%B2-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454199/%E4%BC%A0%E6%99%BA%E6%95%99%E8%82%B2-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
/**
	更新历史：
	2022-10-16 V3.0,开启自动答题,课后习题,可拖动进度条
	2022-10-14 V2.0,增加倍速播放，静音，视频防漏检测。
*/

const rate = 1; //默认一倍速，可自行设置1-5倍速，建议3倍速以下防检测到
const volume = 0.8; //默认0.8，可设置0-1，0为静音
const flag = false; //是否开启秒过视频，默认关闭
const autoWork = false; //是否开启答题，默认关闭

(function() {
    'use strict';
    setTimeout(function(){
        //init() //取消掉按钮，改成自动跳过！
        main()
    },3000);
})();

function setVideoVolume(volume){
	let dom = document.querySelector("#videoPlayer > div")
	//静音
	if(volume == 0){
		dom.querySelector("div > div:nth-child(17)").click();
	}else{
		dom.querySelector("div > div:nth-child(18)").click();
	}
	document.querySelector('video').volume = volume;
}

function setVideoPlayBcakRate(playbackRate){
	let dom = document.querySelector("#videoPlayer > div > div > div:nth-child(14)")
	if(playbackRate >= 5){
		dom.textContent = '超级无敌倍速';
		// playbackRate = 5;
		console.log('视频最高5倍速,防止检测');
	}
	else if(playbackRate == 1)
		dom.textContent = '正常';
	else{
		dom.textContent = playbackRate+'倍速';
	}
	document.querySelector('video').playbackRate = playbackRate;
}

//待补充。。。
function autoAnswer(){
	//获取题目
	let question = document.querySelector("pre")
}

function searchAnswer(){

}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function getNotPlayIndex() {
	let document_all = document.querySelectorAll('#point_undefined > div')
	// document_all.forEach(function(curDocment,index,array) {
	// 	var duration = curDocment.querySelector('span.point-progress-box').textContent
	// })
	for (var i = 0; i < document_all.length; i++) {
		var curDocment = document_all[i]
		// console.log(curDocment)
		//获取标题、进度
		var title =  curDocment.querySelector('span.point-text-box > span').textContent
		var duration = curDocment.querySelector('span.point-progress-box').textContent
		if (title == '习题') {
			//是否做题
			if(!autoWork)
				continue;
			console.log(curDocment)
			console.log(title)
			curDocment.click()
			break;
		}
		//未满100%
		else if (duration != '100%'){
			var time = curDocment.querySelector('span.point-text-box > span:nth-child(3)').textContent
			var timeArr = time.substring(1, time.length - 1).split(':')
			var minute = parseInt(timeArr[0], 10);
			var second = parseInt(timeArr[1], 10);
			var watchTime = minute * 60 + second;
			watchTime = (watchTime - (parseInt(duration) * 0.01) * watchTime) / rate  // (rate > 5 ? 5 : rate)
			curDocment.querySelector('div.point-info-box.point-name-box > span.point-text-box').click()
			// await sleep(watchTime+1000)
			//防止漏进度，向上取整
			return Math.ceil(watchTime)
		}
	}
	return -1;
}

//主函数
async function main(){
	var time = -1
	while( (time = getNotPlayIndex()) !== -1){
		setVideoVolume(volume)
		setVideoPlayBcakRate(rate)
		console.log('自动播放当前视频...共', time, '秒')
		await sleep(1000)
		//播放
		document.querySelector("#videoPlayer > div > div:nth-child(3) > div").click()
		//计时器
		if (flag) {
			//视频的当前时间 等于 视频的总长度（慎用！！！）
			document.querySelector('video').currentTime = document.querySelector('video').duration - 3
			await sleep(3 * 1000)
		}else{
			await sleep(time * 1000)
		}
	}
	console.log('视频观看结束.')
}