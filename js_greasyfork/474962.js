// ==UserScript==
// @name         索引质量新版本张恒20231123
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/474962/%E7%B4%A2%E5%BC%95%E8%B4%A8%E9%87%8F%E6%96%B0%E7%89%88%E6%9C%AC%E5%BC%A0%E6%81%9220231123.user.js
// @updateURL https://update.greasyfork.org/scripts/474962/%E7%B4%A2%E5%BC%95%E8%B4%A8%E9%87%8F%E6%96%B0%E7%89%88%E6%9C%AC%E5%BC%A0%E6%81%9220231123.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var score;
	var data;
	var timeInterval;
	$('.right___1pBKl > div:last').after(`
		<br>
		<button id='btn01'class="bbb">0</button>
		<button id='btn02'class="bbb">1</button>
		<button id='btn03'class="bbb">2</button>
        <br>
		<button id='btn04'class="bbb">3</button>
		<button id='btn05'class="bbb">-1</button>
		<button id='btn06'class="bbb">-2</button>
		<br>
		<button id='find'class="bbb">查询本题</button>
		<button id='beginFind'class="bbb">开始查询</button>
		<button id='endFind'class="bbb">结束查询</button>
        <a id="caozuoren"></a>
	`);
	$(".bbb").width(30);
	$(".bbb").height(40);
	/**
	 * 存
	 */
	//0分情况
	$('#btn01').click(() => {
		$('.ant-radio-input').eq(0).click();
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/insert',
			nocache: true,
			data: `url=${url}&score=0`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},200)
	})
	//1分情况
	$('#btn02').click(() => {
		$('.ant-radio-input').eq(1).click();
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/insert',
			nocache: true,
			data: `url=${url}&score=1`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},200)
	})
	//2分情况
	$('#btn03').click(() => {
		$('.ant-radio-input').eq(2).click();
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/insert',
			nocache: true,
			data: `url=${url}&score=2`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},200)
	})
	//3分情况
	$('#btn04').click(() => {
		$('.ant-radio-input').eq(3).click();
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/insert',
			nocache: true,
			data: `url=${url}&score=3`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},200)
	})
	//-1分情况
	$('#btn05').click(() => {
		$('.ant-radio-input').eq(4).click();
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/insert',
			nocache: true,
			data: `url=${url}&score=4`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},200)
	})
	//-2分情况
	$('#btn06').click(() => {
		$('.ant-radio-input').eq(5).click();
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/insert',
			nocache: true,
			data: `url=${url}&score=5`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},200)
	})

	/**
	 * 取
	 */

	$('#find').click(() => {
		$("#caozuoren").html("");
		url = md5($("a").eq(0).attr("href"));
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8001/ceshi',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response.res)
				if(res.response.res == undefined){
					$("#caozuoren").html("没有查到");
					$('#endFind').click();
				}
				data = JSON.parse(res.response.res)
				if (data) {
					$('.ant-radio-input').eq(data.score).click();
					setTimeout(()=>{
						$(".ant-btn.ant-btn-primary").click();
					},200)
				}
			}
		});
	})

	$('#beginFind').click(()=>{
		clearInterval(timeInterval)
		timeInterval = setInterval(()=>{
			$('#find').click();
		},(Math.floor(Math.random() * 5 + 5) + Math.ceil(Math.random() * 10) /
					10) * 1000)
	})

	$('#endFind').click(()=>{
		clearInterval(timeInterval)
	})

	$(".ant-btn.ant-btn-primary").click(()=>{
		$("#caozuoren").html("");
	})

	$(document).keydown((event) => {
		if (event.keyCode === 49) {
			//1
			$('#btn02').click();
		}
		if (event.keyCode === 50) {
			//2
			$('#btn03').click();
		}
		if (event.keyCode === 51) {
			//3
			$('#btn04').click();
		}
		if (event.keyCode === 32) {
			//空格    0分
			$('#btn01').click();
		}

	})

})();
