// ==UserScript==
// @name         baijiahao-fucker
// @namespace    http://tampermonkey.net/
// @include      http://www.baidu.com/s*
// @include      https://www.baidu.com/s*
// @description  删除搜索结果中关于百家号与百度视频的内容
// @author       LuRenJiasWorld
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @version	 0.21
// @connect      www.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/377839/baijiahao-fucker.user.js
// @updateURL https://update.greasyfork.org/scripts/377839/baijiahao-fucker.meta.js
// ==/UserScript==

// 初始化
(function () {
	fuckBaijiahao();
})();


// 因为百度搜索采用了路由机制，切换搜索词不刷新页面
// 因此在切换搜索词的时候，插件将不再生效，需要定时检测URL是否改变
var urlStore = window.location.href;
setInterval(() => {
	let currentUrl = window.location.href;
	if (currentUrl !== urlStore) {
		let interval = setInterval(() => {
			if ($("#_mask").length !== 1) {
				fuckBaijiahao();
				clearInterval(interval);
			}
		}, 10);
		urlStore = currentUrl;
	}
}, 1000);

// 艹百家号
function fuckBaijiahao() {
	'use strict';

	// 所有搜索结果标签
	let tags = $('#content_left a[href^="http://www.baidu.com/link?url="]');

	// 聚合搜索结果（包含一部分百家号）
	let top = $('.c-offset');

	// 百度视频
	let video = $('.op-short-video-pc');

	// 普通计数器
	let counter = 0;

	// 百家号文章计数器
	let bjhCounter = 0;

	// 搜索结果数量
	let resultCounter = $(".nums_text");
	let resultCounterText = $(".nums_text").text();

	// 轮询每个链接，获取链接背后的真实url
	// 发现URL包含baijiahao，删除之
	// 如果是聚合搜索结果，且聚合搜索结果中全是百家号，则删除整个聚合搜索框
	tags.each(function (i, v) {
		let url = $(this).attr('href');
		(function (url, currentNode) {
			url = url.indexOf("eqid") < 0 ? url + "&wd=&eqid=" : url;

			// 这里不能使用$.ajax()，因为浏览器默认禁止发起修改headers的请求
			GM.xmlHttpRequest({
				method: "GET",
				url: url,
				async: true,
				headers: {
					"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
					"Host": "www.baidu.com",
					"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
					"Pragma": "no-cache",
					"Cache-Control": "no-cache",
					"Accept-Encoding": "gzip, deflate, br",
					"Connection": "keep-alive"
				},
				onload: function (response) {
					let reg = /URL=['|"]([^'|"]+)/;

					if (reg.test(response.responseText)) {

						let realUrl = response.responseText.match(reg)[1];

						if (realUrl.indexOf('baijia') !== -1) {
							bjhCounter ++;

							// 去除父元素 直接删除该搜索结果
							// 针对单独搜索结果
							$(currentNode).parents('.c-container').remove();

							// 如果『聚合搜索』内容为空，直接删除父元素
							// 针对聚合搜索结果
							if (!top.children().length) {
								top.parent().remove();
							}

						} else {
							// 还原真实地址
							// 减小百度采集用户链接点击信息的概率
							// 保护隐私，从我做起
							$(currentNode).attr('href', realUrl);
						}

						resultCounter.text(resultCounterText + "，其中包含" + bjhCounter + "个百家号链接，已全部去除");
					}
				},
			});
		})(url, this);
	});

	// 记录日志
	// 因为上面清除百家号链接是一个异步过程，因此要一直轮询，一直到确定百家号文章数量不再改变，则记录日志
	let bjhCounterTmp = bjhCounter;
	let logCounter = 0;
	let interval = setInterval(() => {
		if (bjhCounterTmp !== bjhCounter) {
			bjhCounterTmp = bjhCounter;
		} else if (bjhCounter !== 0 && bjhCounterTmp !== 0){
			clearInterval(interval);
		} else if (bjhCounter === 0 && bjhCounterTmp === 0 && logCounter > 20) {
			// 针对网页内确实没有百家号的情况
			// 且时间已经超过四秒钟
			clearInterval(interval);
		}
		logCounter++;
	}, 200);

	// 移除百度视频
	if (video.length !== 0) {
		video.parent().remove();
	}
}