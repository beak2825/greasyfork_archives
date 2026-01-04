// ==UserScript==
// @name         b站直播间自动抽红包脚本【已不兼容】
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  参考说明
// @author       Ikaros
// @match        https://live.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447585/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8A%BD%E7%BA%A2%E5%8C%85%E8%84%9A%E6%9C%AC%E3%80%90%E5%B7%B2%E4%B8%8D%E5%85%BC%E5%AE%B9%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/447585/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8A%BD%E7%BA%A2%E5%8C%85%E8%84%9A%E6%9C%AC%E3%80%90%E5%B7%B2%E4%B8%8D%E5%85%BC%E5%AE%B9%E3%80%91.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	console.log("b站直播间自动抽红包脚本 成功加载！");
	var t1 = window.setTimeout(function() {
		// 时间戳转 0年月日时分秒毫秒 1年月日时分秒 2时分秒
		function time_change(type) {
			var date = new Date();
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
			var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
			var m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
			var s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

			if(type == 0) {
				var commonTime = date.toLocaleString();
				return commonTime;
			} else if(type == 1) {
				return Y + M + D + h + m + s;
			} else {
				return h + m + s;
			}
		}

		// 日志用时间打印
		function log_time() {
			var date = new Date();
			return '[' + time_change(1) + '] ';
		}
		
		// 自动点赞
		function auto_zan() {
			document.getElementsByClassName("emoticons-panel")[0].click();
			setTimeout(
                function () {
                    document.getElementsByClassName("emoticon-item")[0].click();
                },
                1000
            );
		}
		
		console.log(log_time() + "b站直播间自动抽红包脚本 开始运行");
	
        // 定时器1
        var Interval1;
        // 判断标志位 0未抽奖，1抽奖中
        var flag = 0;
        // 抽红包
        function get_RedPocketDraw() {
            // 判断是否有红包
            var parent_dom = document.getElementById("gift-control-vm");
            if(parent_dom.getElementsByClassName("time-span").length <= 0) {
				// console.log(log_time() + "当前无红包");
				return;
            }

            // 判断是否正处于抽奖状态，是抽奖中就直接return，未抽奖则继续往下进行抽奖
            if(1 == flag) {
				// console.log(log_time() + "正处于抽奖状态");
				return;
            }

            // 判断计时的dom的内容
            var temp_arr = ['已开奖', '00:00', '00:01', '00:02', '00:03', '00:04'];
            for(var i = 0; i < temp_arr.length; i++) {
				if(document.getElementsByClassName("time-span")[0].innerText == temp_arr[i]) {
					// console.log(log_time() + "红包在4秒内跳过");
					// 如果计时在上述数组中，因为延时的设计，只有4秒内开奖的就不抽了，直接跳过。
					return;
				}
            }

            // 置抽奖状态
            flag = 1;

            var now_time_span = document.getElementsByClassName("time-span")[0].innerText;
            var time_arr = now_time_span.split(':');
            var sec = parseInt(time_arr[0]) * 60 + parseInt(time_arr[1]);
            // console.log(log_time() + "now_time_span=" + now_time_span);

			// 点击红包
			document.getElementsByClassName("entry-icon")[0].click();
            
            setTimeout(
                function () {
                    // 点击参与抽奖
                    document.getElementsByClassName("join-timeout-start")[0].click();
                },
                1000
            );
            setTimeout(
                function () {
                    // 关闭红包弹窗
                    document.getElementsByClassName("img")[document.getElementsByClassName("img").length - 1].click();
                },
                2000
            );
            setTimeout(
                function () {
                    // 自动点赞，如果需要开启此功能，请删除下行的 //，这个注释 保存即可
                    //auto_zan();
                },
                3000
            );
            setTimeout(
                function () {
					// 抽奖结束，恢复抽奖标志位
                    flag = 0;
                    // console.log(log_time() + "上一轮抽奖结束");
                    // 关闭红包弹窗 延时抽奖时间+3秒
                    document.getElementsByClassName("img")[document.getElementsByClassName("img").length - 1].click();
                },
                (sec + 3) * 1000
            );
        }
        
        setTimeout(get_RedPocketDraw, 2000);
        // 设置定时为15s循环一次，可以自行修改
        Interval1 = setInterval(get_RedPocketDraw, 15000);
        // 去除定时器
        window.clearTimeout(t1);
    },
    2000);
})