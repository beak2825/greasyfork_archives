// ==UserScript==
// @name         潭州课堂助手
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  去除潭州课堂播轮播广告，头像下增加我的作业菜单，昵称完整展示，作业数量醒目展示、增加最近在学。
// @author       QQ：619877197   Email：zjc877@outlook.com
// @match        *://*.shiguangkey.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386731/%E6%BD%AD%E5%B7%9E%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/386731/%E6%BD%AD%E5%B7%9E%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {

        // 移除轮播广告
        $("div[class='_1-j4s']").remove();

        // 直接展示课程目录
        var tabs = $("div[role='tab']");
        $.each(tabs, function (i, item) {
            if ($(item).text() === "课程目录") {
                $(item).click();
                return false;
            }
        });

        // 头像下面添加我的作业菜单
        var avatarlis = $("div[class='memberHome___ReVBw']").length > 0 ? $("div[class='memberHome___ReVBw']").find("ul").find("li") : $("div[class='_2v85p']").find("ul").find("li");
        $.each(avatarlis, function(i, item) {
            if ($(item).find("a").text() === "我的课表") {
                var homeworkdom = $("<li><a href='/i/homework'>我的作业</a></li>");
                $(item).after(homeworkdom);
            }
        })

        // 昵称完整展示
        var nickdom = $("span[class='avatarNick___3PfCp userNickname']").length > 0 ? $("span[class='avatarNick___3PfCp userNickname']") : $("span[class='_3Au-A userNickname']")
        nickdom.css({
            "margin-right": "30px",
            "overflow": "visible"
        })

        setInterval(function() {

            // 待完成/已完成作业数量展示
            (function() {
                var homeworktabs = $("div[role='tab']")
                $.each(homeworktabs, function(i, item) {
                    var labelp = $(item).find("p");
                    shiguangkeyHelper.sethomeworknum(labelp);
                })
            })();

            // 待完成作业数数量加粗标红醒目展示
            (function() {
                var thead = $("thead[class='rc-table-thead']");
                var thead_th = $(thead).find("tr").find("th")[7];
                if ($(thead_th).text() == "待完成作业数") {
                    var tbody = $(thead).next();
                    $.each(tbody, function (i, item) {
                        var trs = $(item).find("tr");
                        $.each(trs, function (i, item) {
                            var td = $(item).find("td")[7];
                            if ($(td).text() != 0) {
                                $(td).css({
                                    "color": "red",
                                    "font-weight": "bold",
                                    "font-size": "200%"
                                });
                            }

                        })
                    })
                }
            })();

            // 我的课程表增加最近在学
            (function() {
                if ($(".latelearnSH").length == 0) {
                    var latelearn = $("<li class><a href='javascript:;' style='color: blue; font-weight: bold' class='latelearnSH'>最近在学</a></li>");
                    $("div[class='_2HiiN']").find("ul").append(latelearn);
                    $(".latelearnSH").click(shiguangkeyHelper.latelearnselect);
                }
            })();

        }, 500)
    };

    var shiguangkeyHelper = {
        sethomeworknum: function(homeworknumEle) {
            if (RegExp(/待完成/).exec(homeworknumEle.text())) {
                if (homeworknumEle.find("span[class='uncompletednumSH']").length == 0) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        cache: false,
                        headers: {
                            "token": $.cookie.get("token"),
                            "terminaltype": 4
                        },
                        cookie: document.cookie,
                        url: "https://www.shiguangkey.com/api/student/homework/getUnCompletedList?classId=" + $.getUrlParam("classId") + "&activeKey=1&pageIndex=1&pageSize=10&terminalType=4",
                        dataType: "json",
                        success: function (res) {
                            var uncompleted = $($.stringFormat("<span style='color: red;' class='uncompletednumSH'>（{totalItem}）</span>", res.data));
                            homeworknumEle.find("span[style='color: red;']").remove();
                            homeworknumEle.append(uncompleted);
                        },
                        error: function () {}
                    });

                }
            } else if (RegExp(/已完成/).exec(homeworknumEle.text())) {
                if (homeworknumEle.find("span[class='completednumSH']").length == 0) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        cache: false,
                        headers: {
                            "token": $.cookie.get("token"),
                            "terminaltype": 4
                        },
                        cookie: document.cookie,
                        url: "https://www.shiguangkey.com/api/student/homework/getCompletedList?classId=" + $.getUrlParam("classId") + "&activeKey=1&pageIndex=1&pageSize=10&terminalType=4",
                        dataType: "json",
                        success: function (res) {
                            var completed = $($.stringFormat("<span style='color: green;' class='completednumSH'>（{totalItem}）</span>", res.data));
                            homeworknumEle.find("span[style='color: green;']").remove();
                            homeworknumEle.append(completed);
                        },
                        error: function () {}
                    });
                }
            }
        },
        latelearnselect: function() {
            var latelearnselectEle = $(".latelearnSH").parent("li");
            if (latelearnselectEle.hasClass("_2Aysu")) {
                latelearnselectEle.removeClass("_2Aysu");
                top.location.reload();
            } else {
                $.ajax({
                    type: "POST",
                    async: false,
                    cache: false,
                    headers: {"token": $.cookie.get("token")},
                    cookie: document.cookie,
                    url: "https://www.shiguangkey.com/api/course/queryByStudent",
                    data: {"pageIndex": 1, "pageSize":10, "courseType": 5310, "terminalType":4},
                    dataType: "json",
                    success: function (res) {
                        var courses = res.data.courses,
                            num = 0,
                            courses_div = $("div[class='_2GxAN']").find("div[class='_2u4ro']");
                        $(courses_div.find("div[class='TlhQy']")).remove();
                        for (var i=0; i<courses.length; i++) {
                            var course = courses[i];
                            if (course.liveChapterStartTime || course.startTimeMills || course.startTime) {
                                var courseHtml = '<div class="TlhQy"><a href="/course/{id}" target="_blank" rel="noopener noreferrer" class="_1TOYf"><img src="https://res.shiguangkey.com/{cover}?x-oss-process=image/format,webp" alt="封面"><span class="_27EfR _2VfA1">VIP</span></a><div class="_3f44N"><a href="/course/{id}" target="_blank" rel="noopener noreferrer" class="_1gBLk">{title}</a><div><div class="_25oe4">开课时间：<b>{t}</b></div><div class="_25oe4">所在班期：<b>{period}期</b></div></div><div class="_19ULe"><div class="_2_52z" href="javascript:;">联系老师<ul><div class="_1Zcg9"><div class="_2u4ro"><li><a href="tencent://message/?uin=3003302254&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">在线查考勤木子</a></li><li><a href="tencent://message/?uin=2917322537&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">05179-Tuple</a></li><li><a href="tencent://message/?uin=3002727582&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">塔卡-05028</a></li><li><a href="tencent://message/?uin=&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">Sky老师</a></li><li><a href="tencent://message/?uin=2446867994&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">心蓝06258</a></li><li><a href="tencent://message/?uin=3002751317&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">缇子05015</a></li><li><a href="tencent://message/?uin=3003806927&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">忘仙_03179</a></li><li><a href="tencent://message/?uin=3002795033&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">木子</a></li><li><a href="tencent://message/?uin=&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">小拓</a></li><li><a href="tencent://message/?uin=3003302254&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">南小帝</a></li><li><a href="tencent://message/?uin=&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">Youkou</a></li><li><a href="tencent://message/?uin=879735038&amp;Site=qq&amp;Menu=yes" target="_blank" rel="noopener noreferrer">蓝羽</a></li></div></div></ul></div></div></div><div class="zBr3m"><span class="_3dqyA classreminderSH{id}{classId}"><span class="WM317"></span></span><span class="classreminderstatusSH{id}{classId}">开课提醒已关闭</span></div><div style="display: flex; flex-direction: column; float: right;"><button class="_3xDIx startlearnSH{id}{classId}">开始学习</button></div></div>'
                                course.t = $.timeFormat((new Date(course.liveChapterStartTime)), "yyyy-MM-dd hh:mm")
                                courseHtml = $.stringFormat(courseHtml, course)
                                courses_div.append($(courseHtml));
                                if (course.status == 2010) {
                                    $($.stringFormat(".classreminderSH{id}{classId}", course)).addClass("p3Y8Q");
                                    $($.stringFormat(".classreminderstatusSH{id}{classId}", course)).text("开课提醒已开启");
                                } else {
                                    $($.stringFormat(".classreminderSH{id}{classId}", course)).removeClass("p3Y8Q");
                                    $($.stringFormat(".classreminderstatusSH{id}{classId}", course)).text("开课提醒已关闭");
                                }
                                $($.stringFormat(".classreminderSH{id}{classId}", course)).click(course, function(event) {shiguangkeyHelper.setclassreminder(event.data.id, event.data.classId)});
                                $($.stringFormat(".startlearnSH{id}{classId}", course)).click(course, function(event) {$(location).attr("href", $.stringFormat("https://www.shiguangkey.com/live/{id}/{classId}", event.data))});
                                num ++;
                            }
                            $("div[class='_3vI_T']").remove();
                        };
                        if (num == 0) {
                            courses_div.append($('<div class="_1T7VH"><img src="https://www-cdn-res.shiguangkey.com/dist/static/NoNo.32f2bd65.jpg" alt="暂时没有课程"><h2>暂时没有课程</h2><a href="javascript:;">去逛逛</a></div>'));
                        }
                        latelearnselectEle.addClass("_2Aysu");
                    },
                    error: function () {}
                })
            }
        },
        setclassreminder: function(courseId, classId) {
            var classreminderEle = $($.stringFormat(".classreminderSH{courseId}{classId}", {courseId: courseId, classId: classId}));
            if (classreminderEle.hasClass("p3Y8Q")) {
                $.ajax({
                    type: "POST",
                    async: false,
                    cache: false,
                    headers: {
                        "token": $.cookie.get("token")
                    },
                    cookie: document.cookie,
                    url: "https://www.shiguangkey.com/api/interaction/cancelCourseRemond",
                    data: {
                        "courseId": courseId,
                        "classId": classId,
                        "terminalType": 4
                    },
                    dataType: "json",
                    success: function (res) {
                        if (res.status == 0) {
                            classreminderEle.removeClass("p3Y8Q");
                            $($.stringFormat(".classreminderstatusSH{courseId}{classId}", {courseId: courseId, classId: classId})).text("开课提醒已关闭");
                        }
                    },
                    error: function () {}
                })
            } else {
                $.ajax({
                    type: "POST",
                    async: false,
                    cache: false,
                    headers: {
                        "token": $.cookie.get("token")
                    },
                    cookie: document.cookie,
                    url: "https://www.shiguangkey.com/api/interaction/setCourseRemond",
                    data: {
                        "courseId": courseId,
                        "classId": classId,
                        "terminalType": 4
                    },
                    dataType: "json",
                    success: function (res) {
                        if (res.status == 0) {
                            classreminderEle.addClass("p3Y8Q");
                            $($.stringFormat(".classreminderstatusSH{courseId}{classId}", {courseId: courseId, classId: classId})).text("开课提醒已开启");
                        }
                    },
                    error: function () {}
                })
            }
        },
    }

    $.extend({
        stringFormat: function (str, obj) {
            /*
            字符串格式化
            调用方式：
            var result=$.format("我是{name}，今年{age}了", {name:"小美",age:18});alert(result); //我是小美，今年18了。
            */
            if (typeof(str) == "string" && typeof(obj) == "object") {
                for (var key in obj) {
                    if (obj[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        str = str.replace(reg, obj[key]);
                    }
                }

            }
            return str;
        },
        timeFormat: function (t, format) {
            /*
            时间戳格式化
            调用方法：$.timeFormat((new Date), "yyyy-MM-dd hh:mm:ss")
            */
            if ((typeof t) == "object" && (typeof format) == "string") {
                var o = {
                    "M+": t.getMonth() + 1,
                    "d+": t.getDate(),
                    "h+": t.getHours(),
                    "m+": t.getMinutes(),
                    "s+": t.getSeconds(),
                    "q+": Math.floor((t.getMonth() + 3) / 3),
                    "S": t.getMilliseconds()
                }
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }

            }
            return format;
        },
        getUrlParam: function (name) {
            /*
            获取当前页面URL路径里指定参数的值
            调用方式：$.getUrlParam("name")
            */
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        },
        cookie: {
            /*
            操作cookies
            调用方法：
            $.cookie.get("token");
            $.cookie.set("abc", "_ab111a001", 600, true);
            $.cookie.remove("abc");
            */
			get: function (t) {
				for (var e = t + "=", n = document.cookie.split(";"), r = 0; r < n.length; r++) {
					for (var o = n[r]; " " == o.charAt(0); )
						o = o.substring(1, o.length);
					if (0 == o.indexOf(e))
						return decodeURIComponent(o.substring(e.length, o.length))
				}
				return null
			},
			set: function (t, e, n, r, o) {
				var s = "",
				a = "",
				c = "";
				if (r) {
					var u = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
					f = u ? u[0] : "";
					s = f ? "; domain=." + f : ""
				}
				if (n) {
					var d = new Date;
					d.setTime(d.getTime() + 24 * n * 60 * 60 * 1e3),
					a = "; expires=" + d.toGMTString()
				}
				o && (c = "; secure"),
				document.cookie = t + "=" + encodeURIComponent(e) + a + "; path=/" + s + c
			},
			remove: function (t) {
				var e = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
				n = e ? e[0] : "";
				this.set(t, "", -1, "." + n)
			}
		}
    });

})();
