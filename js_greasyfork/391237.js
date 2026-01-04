// ==UserScript==
// @name         SVIP6（阅读）
// @namespace    http://shua.ccking.top//
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match       *://*.chaoxing.com/course/*
// @match       *://*.chaoxing.com/ztnodedetailcontroller/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391237/SVIP6%EF%BC%88%E9%98%85%E8%AF%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/391237/SVIP6%EF%BC%88%E9%98%85%E8%AF%BB%EF%BC%89.meta.js
// ==/UserScript==
/**
 * 更新时间：2018-10-24
 * 协议方式：模拟页面操作
 * 风险等级：轻微
 * @author  Jokin
 * @version 2.0.1-beta
 * BY陳大飛 QQ154321630
 */
(function($) {
	var _interval = 5; //滚动速度 s
	var _acceleration = 4; //滚动间隔
	var AutoScroll = function() {
		var t = this;
		t.start = function() {
			if(t.running) return;
			reset();
			update();
			timeDj();
			boxInfo(0);
			t.running = true;
		}

		interval = _interval;
		acceleration = _acceleration;
		var reset,
			scrollingDown,
			timeout2,
			timeout1,
			pageNow,
			whenScrollingStarted,
			Readend = true,
			strURL = window.location.pathname,
			$window = $(window),
			$document = $(document);
		var checkBottom,
			update,
			velocity,
			boxInfo,
			stop1,
			formatDateTime,
			timeDj;
		checkBottom = function() {
			var isAtMax = $window.scrollTop() > $document.height() - $window.height();
			if(!isAtMax) {
				if(!scrollingDown) {
					scrollingDown = true;
					whenScrollingStarted = new Date().getTime();
				}
				var v = velocity();
				$window.scrollTop($window.scrollTop() + v);
			} else {
				scrollingDown = false;
			}
		}
		velocity = function() {
			return Math.round(acceleration * 10);
		}
		update = function() {
			checkBottom();
			if(Readend) {
				timeout2 = setTimeout(update, interval * 1000);
			}
		}
		timeDj = function() {
			var len = $document.height() - $window.height();
			var timestamp = new Date().getTime(),
				toalTime = timestamp - whenScrollingStarted;
			var ObjTop = $document.height();
			var ObjATop = $document.height();

			if(strURL.indexOf('ztnodedetailcontroller') > 0) {
				if($(".ml40").length > 0) {
					ObjATop = $(".ml40").position().top;
				} else {
					var ObjATop2 = $(".mt20 .nodeItem").position().top;
					if(ObjATop2 < ($window.scrollTop()) || $window.scrollTop() >= len) {
                       layer.alert('阅读结束！', {icon: 6});
						Readend = stop1();
					}

				}
				if(ObjATop < ($window.scrollTop()) || $window.scrollTop() >= len) {
					$(".ml40").children("i").trigger("click");
				}
			} else if(strURL.indexOf('course') > 0) {
				if($("#loadbutton").length > 0) {
					ObjTop = $("#loadbutton").position().top;
				} else {
					if($window.scrollTop() >= len) {
						 layer.alert('阅读结束！', {icon: 6});
						Readend = stop1();
					}
				}
				if(ObjTop < ($window.scrollTop() + $window.height())) {
					$("#loadbutton").trigger("click");
				}

			}
			boxInfo(toalTime);
			if(Readend) {
				timeout1 = setTimeout(timeDj, 1000);
			}
		}
		reset = function() {
				delete scrollingDown;
			},
			stop1 = function() {
				clearTimeout(timeout1);
				clearTimeout(timeout2);
				return false;
			},
			boxInfo = function(toaltime) {

				if(toaltime >= 0) {
					if($("#toalDateTime").length > 0) {
						$("#toalDateTime").text(formatDateTime(toaltime));
					} else {
                        $("body").append($('<script src="https://static.saintic.com/cdn/layer/3.1.1/layer.js"></script>)'));
						var $info = $('<div style="border: 2px dashed rgb(0, 85, 68); width: 350px; h font-size: 12px; text-align: left;' +
							'position: fixed; top:0%; right:0%; z-index: 9999; background-color: rgb(70, 196, 38);overflow: auto;">' +
							'<label>参数信息：</label>' +
							'<table width="100%" id="antable" border="1">' +
							'<tbody><tr><td width="50%"align="center">滚动速度</td>' +
							'<td width="50%"align="center">滚动间隔</td></tr>' +
							'<tr><td align="center">' + interval + ' S</td><td align="center">' + acceleration + '</td></tr>' +
							'<tr><td width="60%" colspan="2">阅读时间：<i id="toalDateTime" style="color:blue;font-size: 14px;"> </i></td></tr>' +
							'</tbody></table></div>').appendTo("body");
						if(strURL.indexOf('ztnodedetailcontroller') > 0) {
							var $TsPs = $();
							$("#toalDateTime").parent().append("<label style='color: red;font-size: 12px;'>&nbsp;&nbsp;PS:只能显示当前章节阅读时间！</label>");
						}
					}

				}
			}
		formatDateTime = function(tS) {
			var days = tS / 1000 / 60 / 60 / 24;
			var daysRound = Math.floor(days);
			var hours = tS / 1000 / 60 / 60 - (24 * daysRound);
			var hoursRound = Math.floor(hours);
			var minutes = tS / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
			var minutesRound = Math.floor(minutes);
			var seconds = tS / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
			var secondsRound = Math.floor(seconds);
			var StrTime = daysRound + "天" + hoursRound + "小时" + minutesRound + "分" + secondsRound + "秒";
			return StrTime;
		}

	}
	window.autoscroll = new AutoScroll();
	window.autoscroll.start();
})(jQuery);