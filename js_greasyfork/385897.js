// ==UserScript==
// @name         广东继续学习助手
// @namespace    x664@qq.com
// @version      0.0.4
// @description  自动挂机广东继续学习，视频自动切换，屏蔽视频内的题目，快速查询作业答案
// @author       x664
// @match        *://ggfw.gdhrss.gov.cn/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/385897/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/385897/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
	// 5E3 == 5000，科学记数法，表示毫秒数
	time: 5E3 // 默认响应速度为5秒，不建议小于3秒
	// 1代表开启，0代表关闭
	,
	work: 1 // 屏蔽视频内的题目，默认开启
	,
	jump: 1 // 自动切换课程，默认开启
	,
	muted: 1 // 视频静音播放，默认开启
},
_self = unsafeWindow,
url = location.pathname,
top = _self;

try {
	while (top != _self.top) top = top.parent.document ? top.parent: _self.top;
} catch(err) {
	top = _self;
}

var $ = _self.jQuery || top.jQuery;

if (url == '/zxpx/auc/play/player') {
	if (setting.work) {
		setTimeout(AutoPlayAndBlockQuestion, setting.time / 2);
	}
} else if (url == '/zxpx/hyper/courseDetail') {
	if (setting.work) {
		setTimeout(AutoEnterCourse, setting.time / 2);
	}
} else if (url == '/zxpx/auc/courseExam') {
	if (setting.work) {
		$(".exam-subject-rd>.exam-subject-text>.exam-subject-text-panel").each(function(i, n) {
			var question = $(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").text();
			var questionhtml = $(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").html();
			var radioname = $(n).children(".exam-subject-text-quecontent").children(".exam-subject-text-queanswar").children("label").children("div").children("input").attr("name");
			$(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").html(questionhtml + "<a href=\"javascript:void(0);\" onclick=\"queryanswer('" + question + "','" + radioname + "',1)\">查询答案</a>");
		});
		$(".exam-subject-ms>.exam-subject-text>.exam-subject-text-panel").each(function(i, n) {
			var question = $(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").text();
			var questionhtml = $(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").html();
			var radioname = $(n).children(".exam-subject-text-quecontent").children(".exam-subject-text-queanswar").children("label").children("div").children("input").attr("name");
			$(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").html(questionhtml + "<a href=\"javascript:void(0);\" onclick=\"queryanswer('" + question + "','" + radioname + "',2)\">查询答案</a>");
		});
		$(".exam-subject-jd>.exam-subject-text>.exam-subject-text-panel").each(function(i, n) {
			var question = $(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").text();
			var questionhtml = $(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").html();
			var radioname = $(n).children(".exam-subject-text-quecontent").children(".exam-subject-text-jdanswer").children("label").children("div").children("input").attr("name");
			$(n).children(".exam-subject-text-que").children(".exam-subject-text-que-title").html(questionhtml + "<a href=\"javascript:void(0);\" onclick=\"queryanswer('" + question + "','" + radioname + "',3)\">查询答案</a>");
		});
	}
}

function AutoPlayAndBlockQuestion() {
	_self.getMap = function() {};
	_self.map = false;
	if (setting.muted) {
		_self.p.setVolume(0);
	}
	_self.p.play();
	if (setting.jump) {
		setInterval(function() {
			if ($('.learnpercent').text().indexOf("已完成") > -1) {
				_self._toNext();
			}
		},
		30000);
		//_self._overWatch = _self.overWatch;
		_self._toNext = function() {
			var cpcwid = location.search.split("&")[0].split("=")[1];
			var aurl = '';
			$('a.level1>span>a').each(function(i, n) {
				aurl = $(n).attr("href");
				if (aurl.indexOf(cpcwid) == -1) {
					location.replace(aurl);
					return false;
				}
			});
		}
		/* _self.overWatch = function() {
            _self._overWatch();
            if ($('.learnpercent').text().indexOf("已完成") > -1) {
                _self._toNext();
            }
        }*/
	}
}

_self.queryanswer = function(question, name, type) {
	console.log(question, name, type);
	GM_xmlhttpRequest({
		method: 'POST',
		url: "https://www.gongxukemu.cn/search.html",
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		data: 'QuestionTitle=' + question,
		timeout: setting.time,
		onload: function(xhr) {
			if (xhr.status == 200) {
				var result = xhr.responseText || '';
				if (result.length > 0) {
					if (result.indexOf("没有查询到相关考题") != -1) {
						alert('没有查询到相关考题');
						return;
					}
					if (type == 3) {
						if (result.indexOf("<h3>B.错误</h3>") == -1) {
							$(':radio[name="' + name + '"]').eq(1).attr("checked", true);
						} else {
							$(':radio[name="' + name + '"]').eq(0).attr("checked", true);
						};
					} else if (type == 2) {
						var answerpos = result.indexOf("<img src=\"/static/images/Correct1.png\" width=\"24\" height=\"24\">");
						var fpos = result.indexOf("<h3>F");
						var epos = result.indexOf("<h3>E");
						var dpos = result.indexOf("<h3>D");
						var cpos = result.indexOf("<h3>C");
						var bpos = result.indexOf("<h3>B");
						var apos = result.indexOf("<h3>A");
						for (var i = 0; i < 6; i++) {
							if (answerpos == -1) {
								return;
							}
							if (fpos != -1 && fpos < answerpos) {
								$('#' + name + 'F').attr("checked", true);
							}
							if (epos != -1 && epos < answerpos && (fpos == -1 || fpos > answerpos)) {
								$('#' + name + 'E').attr("checked", true);
							}
							if (dpos != -1 && dpos < answerpos && (epos == -1 || epos > answerpos)) {
								$('#' + name + 'D').attr("checked", true);
							}
							if (cpos != -1 && cpos < answerpos && (dpos == -1 || dpos > answerpos)) {
								$('#' + name + 'C').attr("checked", true);
							}
							if (bpos != -1 && bpos < answerpos && (cpos == -1 || cpos > answerpos)) {
								$('#' + name + 'B').attr("checked", true);
							}
							if (apos != -1 && apos < answerpos && (bpos == -1 || bpos > answerpos)) {
								$('#' + name + 'A').attr("checked", true);
							}
							answerpos = result.indexOf("<img src=\"/static/images/Correct1.png\" width=\"24\" height=\"24\">", answerpos + 1);
						}
					} else if (type == 1) {
						var answerpos = result.indexOf("<img src=\"/static/images/Correct1.png\" width=\"24\" height=\"24\">");
						var fpos = result.indexOf("<h3>F");
						var epos = result.indexOf("<h3>E");
						var dpos = result.indexOf("<h3>D");
						var cpos = result.indexOf("<h3>C");
						var bpos = result.indexOf("<h3>B");
						var apos = result.indexOf("<h3>A");
                        if (fpos != -1 && fpos < answerpos) {
							$('#' + name + 'D').attr("checked", true);
							return;
						}
                        if (epos != -1 && epos < answerpos) {
							$('#' + name + 'D').attr("checked", true);
							return;
						}
                        if (dpos != -1 && dpos < answerpos) {
							$('#' + name + 'D').attr("checked", true);
							return;
						}
						if (cpos != -1 && cpos < answerpos) {
							$('#' + name + 'C').attr("checked", true);
							return;
						}
						if (bpos != -1 && bpos < answerpos) {
							$('#' + name + 'B').attr("checked", true);
							return;
						}
						if (apos != -1 && apos < answerpos) {
							$('#' + name + 'A').attr("checked", true);
							return;
						}
					}
				} else {
					alert('服务器繁忙，请重试');
				}
			} else if (xhr.status == 403) {
				alert('请求过于频繁，建议稍后再试');
			} else {
				alert('服务器异常，请重试');
			}
		},
		ontimeout: function() {
			alert('服务器超时，请重试');
		}
	});
}

function AutoEnterCourse() {
	var _a = $('a.level1>span>a');
	if (_a.length > 0) {
		if (_a[0] != undefined) {
			_a[0].click();
		}
	}
}