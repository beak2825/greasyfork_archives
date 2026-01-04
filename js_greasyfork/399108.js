// ==UserScript==
// @name        超星 - 阅读任务显示已读时间
// @description 不要停下来啊！（指阅读）
// @namespace   UnKnown
// @author      UnKnown
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @version     1.1
// @match       https://*.chaoxing.com/course/*.html
// @grant       GM_getValue
// @grant       GM_setValue
// @inject-into page
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/399108/%E8%B6%85%E6%98%9F%20-%20%E9%98%85%E8%AF%BB%E4%BB%BB%E5%8A%A1%E6%98%BE%E7%A4%BA%E5%B7%B2%E8%AF%BB%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/399108/%E8%B6%85%E6%98%9F%20-%20%E9%98%85%E8%AF%BB%E4%BB%BB%E5%8A%A1%E6%98%BE%E7%A4%BA%E5%B7%B2%E8%AF%BB%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

const css = `
#top,
#readTime {
	opacity: .9;
	transition:
		opacity 150ms ease-in-out,
		filter   75ms ease-out;
}

#top:hover,
#readTime {
	opacity: 1;
}

#top:active {
	filter: brightness(1.5);
}

#readTime {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	right: 85px;
	bottom: 150px;
	width: 0;
	overflow: visible;
	white-space: nowrap;
}
#readTime > span {
	padding: 1ex 1ch;
	color: white;
	background-color: #212121;
	border-radius: 2px;
	box-shadow:
		0px 3px 1px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14),
		0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
`.trim();

const sendLogs = function (para, url) {
/*
	var para = {
		courseid : courseid,
		chapterid : chapterid,
		height : document.getElementById("courseMainBox").clientHeight,
	}
	if (from != null && from != "") { p._from_ = from; }
	if (rtag != null && rtag != "") { p.rtag   = rtag; }
	var url = "/multimedia/readlog"
*/

	// 多功能随机取整函数
	/* 当 extra 存在时，范围为 base ~ base + extra
	    extra 不存在时，范围为 base ~ base * 2 */
	var roll = function (base, extra) {
		return Math.round(
			base + Math.random() * ( extra || base )
		);
	};

	// 发送频率
	var interval = 5000;
	var intervalInSecond = interval / 1000;

	// 发送概率
	var probability = 0.9;

	// 页面边距
	var pad = roll(200, 66);

	// 滚动参数，之后由 init 函数设置属性
	var scroll = {};

	var init = function () {
		para.h = 0;
		// para.height / ( 32 ~ 64 )
		scroll.base = para.height / roll(32);
		// para.height / ( 16 ~ 32 )
		scroll.extra = para.height / roll(16);
	};

	init();

	// 检测并处理参数对象的 chapterid 属性
	var setCourseid = function (paramObj) {
		if (
			// 传入的参数对象 paramObj 拥有 chapterid 属性
			paramObj.chapterid &&
			// window.courselist 对象存在，且为数组
			window.courselist &&
			Array.isArray(window.courselist)
		) {
			for( var i = 0; i < window.courselist.length; i++ ) {
				var course     = window.courselist[i];
				var coursenext = window.courselist[i + 1];
				if (
					// coursenext 不存在，
					coursenext == undefined || // (
					// 或者 coursenext 存在，但是当前滚动高度 paramObj.h
					// 的大小在 course.h 和 coursenext.h 之间
					course.h <= paramObj.h &&
					paramObj.h < coursenext.h // )
				) {
					// 按照 course.knowledgeid 是否存在，设置 chapterid
					paramObj.chapterid =
						course && course.knowledgeid || 0;
					break;
				}
			}
		}; // return paramObj;
	};

	var ajax = function (paramObj, baseUrl) {
		
		setCourseid(paramObj);
		
		var xhr = new XMLHttpRequest();
		xhr.open(
			"GET",
			baseUrl + "?" + new URLSearchParams(paramObj).toString(),
			true
		);
		xhr.send(null);

	};

	ajax(para, url);

	// 在右下角显示浏览器本地记录的本次已读时间
	// 后面的 time 和 duration 的单位都是秒
	var tick;
	var top = document.getElementById("top");

	if ( top ) {
		var toReadableTime = function (time) { // 传入总时长 duration

			if (time > 0) {
				var result = "";

				if (time >= 3600)
					result += Math.floor(time / 3600) + " 小时 ";
				if (time >= 60)
					result += Math.floor(time / 60 % 60) + " 分钟 ";
				// if (time >= 0)
					result += Math.floor(time % 60) + " 秒";

				return result;
			} else {
				return "0 秒";
			}

		};

		var div = document.createElement("div");
		var span = document.createElement("span");
		var style = document.createElement("style");

		// 总时长
		var duration = GM_getValue(para.courseid) || 0;

		div.id = "readTime";
		span.textContent =  toReadableTime(duration);
		style.textContent = css ||

"#readTime { display: flex; justify-content: center; align-items: center;" +
"position: fixed; right: 85px; bottom: 150px; width: 0; overflow: visible;" +
"white-space: nowrap; }" +
"#readTime > span { padding: 1ex 1ch; color: white; background-color: #212121; }";

		div.appendChild(span);
		div.appendChild(style);
		document.body.appendChild(div);

		tick = function (time) { // 传入每次增加的时长 intervalInSecond
			duration += time;
			span.textContent = toReadableTime(duration);
			para.courseid && GM_setValue(para.courseid, duration);
		};
	} else {
		tick = function () {};
	}

	setInterval(
		function () {
			if ( Math.random() <= probability ) {
				para.h += roll( scroll.base, scroll.extra );
				if ( para.h > ( para.height + pad ) ) {
					init();
				}
				ajax(para, url);
				tick(intervalInSecond);
			}
		}, interval
	);
}

Object.defineProperty(
	unsafeWindow, "sendLogs", {
		configurable: false,
		enumerable: true,
		writable: false,
		value: sendLogs
	}
);
