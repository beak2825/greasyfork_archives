// ==UserScript==
// @name         B站哔哩哔哩bilibili跳过番剧片头片尾【自动版】
// @description  bilibili B站自动跳过番剧片头片尾。可在代码第一行第二行修改片头和片尾时间。支持edge以及chrome。项目地址https://github.com/RyananChen/scripts/tree/main/BiliBili-skip-IntroL-Outro-Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       RyananChen
// @match        https://www.bilibili.com/bangumi/play/*
// @license      BSD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463515/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E3%80%90%E8%87%AA%E5%8A%A8%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463515/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E3%80%90%E8%87%AA%E5%8A%A8%E7%89%88%E3%80%91.meta.js
// ==/UserScript==
/*
//此脚本作用域match只作用于番剧，避免其他视频也触发快捷键。如果改作用域到b站全部可以写@match        https://www.bilibili.com/video/*
//但这么做会导致看什么视频都跳过，不合适。
//参考链接
chatgpt
https://greasyfork.org/zh-CN/scripts/443560
https://greasyfork.org/zh-CN/scripts/441461
*/

const skip_IntroLength = 90; // 设置片头长度，单位为秒
const skip_OutroLength = 44; // 设置片尾长度，单位为秒

(function()
{
	setInterval(() =>
	{
		const video = document.querySelector("#bilibili-player video"); // 获取页面上的视频元素
		if (video && !isNaN(video.duration)) //如果获取到视频元素并且视频总长度为数字还是啥，没细看isnan。
		{
			const currentTime = video.currentTime; // 获取当前播放时间的时间戳
			if (currentTime < skip_IntroLength)
			{
				video.currentTime = skip_IntroLength; // 如果仍处于片头时间，将视频进度设置为90秒
			}
			//如果当前播放时间大于【视频总长度-片尾曲时间】，并且小于【视频总长度-2秒】
			//则跳到【视频总长度】，加了那个并且的条件是为了防止它一直重复跳导致卡顿。
			else if (currentTime > (video.duration - skip_OutroLength) && currentTime < (video.duration - 2))
			{ //duration 属性返回当前视频的长度，以秒计算。
				video.currentTime = video.duration; // 如果处于片尾时间，将视频进度设置为结束
				/*
				原本想在片尾的时候停止脚本几秒钟，来防止脚本循环操作。
				后来通过在else if的条件中加上了&& currentTime < (video.duration - 2)来避免了这个情况的发生。
				并且这个等待不生效啊。具体没看，再议。
				setTimeout(() => {
				    // 等待15秒后进行后续操作
				    // 这里可以放置需要执行的代码
				    console.log('15秒已过，可以进行后续操作了');
				}, 15000);
				*/
			}
		}
	}, 2000); // 每2秒执行一次setInterval，检查一次视频播放进度
})();