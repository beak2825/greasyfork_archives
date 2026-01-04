// ==UserScript==
// @name         B站哔哩哔哩bilibili跳过番剧片头片尾【手动版】
// @description  在b站番剧页面，按下  =+键  或者  ctrl键  后，跳过片头曲或片尾曲。可在配置文件修改片头片尾时间。项目地址https://github.com/RyananChen/scripts/tree/main/BiliBili-skip-IntroL-Outro-Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       RyananChen
// @match        https://www.bilibili.com/bangumi/play/*
// @license      BSD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463516/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E3%80%90%E6%89%8B%E5%8A%A8%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463516/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B7%B3%E8%BF%87%E7%95%AA%E5%89%A7%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E3%80%90%E6%89%8B%E5%8A%A8%E7%89%88%E3%80%91.meta.js
// ==/UserScript==
/*
//此脚本作用域match只作用于番剧，避免其他视频也触发快捷键。如果改作用域到b站全部可以写@match        https://www.bilibili.com/video/*
//但这么做会导致看什么视频都跳过，不合适。
//参考链接
chatgpt
https://greasyfork.org/zh-CN/scripts/443560
https://greasyfork.org/zh-CN/scripts/441461
*/
var skip_IntroLength = 90; //片头曲时间||需要跳过的时间，请把这一项设置为你要跳过的片头时长。
var skip_OutroLength = 44; // 设置片尾长度，单位为秒
var waitTime = 6; //等待时间，用于跳过片尾之后切换到下一集的等待，根据网络情况调整。


//ryan:等待函数，请注意，您需要在async函数中使用await关键字才能等待wait函数完成。
//如果您尝试在非异步函数中使用await，将会得到一个语法错误。：
function wait(time)
{
	return new Promise(resolve => setTimeout(resolve, time));
}

//主函数，给function加了一个async
document.addEventListener('keyup', async function(e)
{
	if (e.keyCode === 187 || e.keyCode === 17)
	{ //187代表“=+”的keycode值，17代表ctrl的keycode值。keycode值可在https://www.cnblogs.com/lxwphp/p/9548823.html查询
		var video = document.querySelector("#bilibili-player video");
		const currentTime = video.currentTime; // 获取当前播放时间的时间戳
		//如果当前播放时间在片头，就跳到片头曲结束。
		if (currentTime < skip_IntroLength)
		{
			video.currentTime = skip_IntroLength; // 如果仍处于片头时间，将视频进度设置为90秒
		}
		//如果当前播放时间在片尾，就跳到片头曲结束，等待几秒钟到下一集。然后再跳到下一集的片头曲结束。
		else if (currentTime > (video.duration - skip_OutroLength) &&currentTime < (video.duration - 2)) //duration 属性返回当前视频的长度，以秒计算。
		{
			video.currentTime = video.duration;
			await wait(waitTime * 1000);//等待生效了，没问题。
			//这里必须要再次获取一次currentTime，因为切换集数了，不获取的话此时的currentTime值是不太对的，无法执行下面的跳转操作
			const currentTime = video.currentTime;
			video.currentTime = skip_IntroLength;
		}
	}
})