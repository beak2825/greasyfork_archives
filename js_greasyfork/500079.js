// ==UserScript==
// @name         刷课猫
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  刷课猫!
// @author       rzq
// @match        https://wustedu.ls365.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @license MIT
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://greasyfork.org/scripts/434540-layerjs-gm-with-css/code/layerjs-gm-with-css.js?version=1065982
// @downloadURL https://update.greasyfork.org/scripts/500079/%E5%88%B7%E8%AF%BE%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500079/%E5%88%B7%E8%AF%BE%E7%8C%AB.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var isClose = false;

	isScriptType()

	//判断类型
	function isScriptType() {
		$(window).on('load', function() {
			setTimeout(function() {
				if (window.location.href.indexOf('mycourselist') !== -1) {
					var index = layer.open({
						title: '课程猫',
						content: '三秒后开始执行脚本',
						btn: ['取消执行'],
						time: 3000,
						closeBtn: 0,
						yes: function() {
							isClose = true
							layer.close(index);
						},
						end: function(index) {
							if (!isClose) {
								openCourse()
							}
						}
					});
				} else if (window.location.href.indexOf('play') !== -1) {
					openPlay()
				}
			}, 2000);
		})
	}

	//打开课程
	function openCourse() {
		var stopLoop = false;
		var isSee = false
		$('.clh-panel').each(function() {
			if (stopLoop) return;

			var $panel = $(this),
				$span = $panel.find('.lsPercents'),
				$title = $panel.find('.cimgTitle').text(),
				percent = parseInt($span.text().replace('%', ''));

			if (percent < 100) {
				isSee = true
				var link = $panel.find('a:first')[0];
				if (link) {
					link.click();
					stopLoop = true;
					openInter()
					return;
				}
			}
		});
		if (!isSee) {
			var index = layer.open({
				title: '课程猫',
				content: '检测到没有可以执行的课程',
				time: 3000,
				closeBtn: 0
			});
		}
	}

	//打开拦截提示弹窗
	function openInter() {
		layer.open({
			type: 1,
			title: "请确认",
			offset: "100px",
			content: "\n          <div style=\"padding:10px\">\n          <p>已经为你打开下一门课程，如果没有打开窗口，请检查浏览器地址栏右侧是否有拦截提示，请选择【永久允许】</p>\n          <p style=\"color:red;\">如下图所示：</p>\n          <img src=\"https://js.zhanyc.cn/img/ljts.jpg\"/>\n          </div>\n          "
		})
	}

	//点击开始按钮开始看课
	function openPlay() {
        let duration = getTotalTime() | 0
        let currentTime = (duration * 0.9) | 0
		$("video").not("#face-input")[0].volume = 0;
        $("video").not("#face-input")[0].currentTime = currentTime;
		$("video").not("#face-input")[0].play();
		//每10秒检测一次视频是否结束
		endVideo()
	}

	//获取视频总时长
	function getTotalTime() {
		return $("video").not("#face-input")[0].duration
	}

	//获取观看总时长
	function getCurrentTime() {
		return $("video").not("#face-input")[0].currentTime
	}

	//每10秒检测一次视频是否结束
	function endVideo() {
		setInterval(function() {
			let duration = getTotalTime() | 0
			let currentTime = getCurrentTime() | 0
            console.log(duration)
			console.log(currentTime)
            var end = isEndPlay()
			console.log(end)
			if (currentTime >= duration || end) {
				var index = layer.open({
					title: '课程猫',
					content: '检测到当前课程已结束，3秒后进入下一门课程',
					time: 3000,
					closeBtn: 0,
					end: function(index) {
						let current = $(".chsTitle>a").index($(".chsTitle>a").not(".one_p_a_1"))
						let allCurrent = $(".chsTitle>a").length
						if (current + 1 >= allCurrent) {
							// console.log("当前课程已经完成，等待进入下一步")
							$("#back-course")[0].click();
						} else {
							layer.close(index);
							$(".chsTitle>a").eq(current + 1)[0].click();
						}
					}
				});
			}
		}, 1000 * 10);
	}

    //判断视频是否播放完
	function isEndPlay() {
		var $element = $('#reader_msgbg');
		var displayValue = $element.css('display');
		if (displayValue === 'block') {
            return true
		} else if (displayValue === 'none') {
            return false
		}
	}


})();