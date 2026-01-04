// ==UserScript==
// @name         日天超星助手考试版1
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        https://mooc1-1.chaoxing.com/work/*
// @match        https://mooc1-2.chaoxing.com/work/*
// @match        http://exam.zhihuishu.com/onlineExam/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/373335/%E6%97%A5%E5%A4%A9%E8%B6%85%E6%98%9F%E5%8A%A9%E6%89%8B%E8%80%83%E8%AF%95%E7%89%881.user.js
// @updateURL https://update.greasyfork.org/scripts/373335/%E6%97%A5%E5%A4%A9%E8%B6%85%E6%98%9F%E5%8A%A9%E6%89%8B%E8%80%83%E8%AF%95%E7%89%881.meta.js
// ==/UserScript==
(function () {
    var parseParam = function(param, key) {
        var paramStr = "";
        if (param instanceof String || param instanceof Number || param instanceof Boolean) {
            paramStr += "&" + key + "=" + encodeURIComponent(param);
        } else {
            $.each(param, function(i) {
                var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
                paramStr += '&' + parseParam(this, k);
            });
        }
        return paramStr.substr(1);
    };
    var chrome = {};
    chrome.sbchaoxing = {};
    chrome.sbchaoxing.jsversion = 'ext.qq.com/tampermonkey';
    chrome.sbchaoxing.jsversion += '&t=0417';
    chrome.sbchaoxing.remoteHost = 'http://www.92daikan.com/';
    chrome.sbchaoxing.staticRemoteHost = 'http://www.92daikan.com/scripts/';
    chrome.sbchaoxing.warningMsgnanayuntoken = 'eryananayun1';
    chrome.sbchaoxing.nanayuntoken = 'eryananayunn';
    chrome.sbchaoxing.appendMsgnanayuntoken = 'VG5xNFkrZ0hRVko4RTlvemwzclJm';
    chrome.sbchaoxing.answerUrl = chrome.sbchaoxing.remoteHost + 'handle/r.ashx';
    chrome.sbchaoxing.appendMsgnanayuntoken += 'QT09';
    chrome.sbchaoxing.md5js = "https://cdn.staticfile.org/blueimp-md5/2.5.0/js/md5.min.js";
    chrome.sbchaoxing.jqueryjs = "https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js";
    chrome.sbchaoxing.loadFile = function () {
        var a = [];
        function b(h, g) {
            try {
                for (var d = 0,
                     c; c = a[d++];) {
                    if (c.doc === h && c.url == (g.src || g.href)) {
                        return c;
                    }
                }
            } catch (f) {
                return null;
            }
        }
        return function (i, h, e) {
            var f = b(i, h);
            if (f) {
                if (f.ready) {
                    e && e();
                } else {
                    f.funs.push(e);
                }
                return;
            }
            a.push({
                doc: i,
                url: h.src || h.href,
                funs: [e]
            });
            if (!i.body) {
                var d = [];
                for (var g in h) {
                    if (g == "tag") {
                        continue;
                    }
                    d.push(g + '="' + h[g] + '"');
                }
                i.write("<" + h.tag + " " + d.join(" ") + " ></" + h.tag + ">");
                return;
            }
            if (h.id && i.getElementById(h.id)) {
                return;
            }
            var c = i.createElement(h.tag);
            delete h.tag;
            for (var g in h) {
                c.setAttribute(g, h[g]);
            }
            c.onload = c.onreadystatechange = function () {
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    f = b(i, h);
                    if (f.funs.length > 0) {
                        f.ready = 1;
                        for (var j; j = f.funs.pop() ;) {
                            j();
                        }
                    }
                    c.onload = c.onreadystatechange = null;
                }
            };
            c.onerror = function () {
                throw Error("The load " + (h.href || h.src) + " fails,check the url settings of file ueditor.config.js ");
            };
            i.getElementsByTagName("head")[0].appendChild(c);
        };
    }();
    chrome.sbchaoxing.loadMultiFile = function (b, e) {
        if (Object.prototype.toString.call(b) === "[object Array]") {
            var a = b.length;
            if (!a) {
                return;
            }
            var d = 0;
            for (var c = 0; c < b.length; c++) {
                chrome.sbchaoxing.loadFile(document, b[c],
                                           function () {
                    d++;
                    if (a == d) {
                        try {
                            e && e();
                        } catch (f) { }
                    }
                });
            }
        } else {
            if (Object.prototype.toString.call(b) === "[object Object]") {
                chrome.sbchaoxing.loadFile(document, b,
                                           function () {
                    try {
                        e && e();
                    } catch (f) { }
                });
            }
        }
    };
    chrome.sbchaoxing.loadMultiFileSimple = function (a, b) {
        if (a) {
            chrome.sbchaoxing.loadMultiFile([{
                src: chrome.sbchaoxing.jqueryjs,
                tag: "script",
                type: "text/javascript",
                defer: "defer"
            }],
                                            function () {
                chrome.sbchaoxing.loadMultiFile([{
                    src: chrome.sbchaoxing.md5js,
                    tag: "script",
                    type: "text/javascript",
                    defer: "defer"
                }],
                                                function () {
                    b();
                });
            });
        } else {
            chrome.sbchaoxing.loadMultiFile([{
                src: chrome.sbchaoxing.md5js,
                tag: "script",
                type: "text/javascript",
                defer: "defer"
            }],
                                            function () {
                b();
            });
        }
    };
    chrome.sbchaoxing.getQueryString = function (b, a) {
        var c = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i");
        var d = b.substr(b.indexOf("?") + 1).match(c);
        if (d != null) {
            return unescape(d[2]);
        }
        return null;
    };
    if (typeof String.prototype.startsWith != "function") {
        String.prototype.startsWith = function (a) {
            return this.slice(0, a.length) === a;
        };
    }
    if (typeof String.prototype.endsWith != "function") {
        String.prototype.endsWith = function (a) {
            return this.indexOf(a, this.length - a.length) !== -1;
        };
    }
    String.prototype.trimEnd = function (e) {
        if (e == null || e == "") {
            var d = this;
            var a = /\s/;
            var b = d.length;
            while (a.test(d.charAt(--b))) { }
            return d.slice(0, b + 1);
        } else {
            var d = this;
            var a = new RegExp(e);
            var b = d.length;
            while (a.test(d.charAt(--b))) { }
            return d.slice(0, b + 1);
        }
    };
    if (window == parent && location.href.indexOf("space/index") != -1) {
        var s = document.createElement("script");
        s.src = chrome.sbchaoxing.staticRemoteHost + "warning.min.js?refer=" + chrome.sbchaoxing.jsversion;
        document.body.appendChild(s);
    }
    if (location.href.indexOf("student/video/") != -1) {
        var s = document.createElement("script");
        s.src = chrome.sbchaoxing.staticRemoteHost + "yazhuovideo.min.js";
        document.body.appendChild(s);
    } else {
        if (location.href.indexOf("load/player/") != -1) {
            var s = document.createElement("script");
            s.src = chrome.sbchaoxing.staticRemoteHost + "yazhuoplayer.min.js";
            document.body.appendChild(s);
        } else {
            if (location.href.indexOf("www.itongshi.com/PXPTXueSheng/Course/") != -1) {
                iTiShiJianGe = 999999;
            } else {
                if (location.href.indexOf("/studentLogin") != -1) {
                    var s = document.createElement("script");
                    s.src = chrome.sbchaoxing.staticRemoteHost + "eryaLogin.min.js";
                    document.body.appendChild(s);
                } else {
                    if (location.href.indexOf("courseAction!toCourseVideo") != -1) {
                        var s = document.createElement("script");
                        s.src = chrome.sbchaoxing.staticRemoteHost + "eryaGk.min.js";
                        document.body.appendChild(s);
                    } else {
                        if (location.href.indexOf("/student/erya_studentExamineAction!toStudentExamineDetail") != -1) {
                            chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                  function () {
                                var a = document.createElement("script");
                                a.src = chrome.sbchaoxing.staticRemoteHost + "eryaDati.min.js";
                                document.body.appendChild(a);
                            });
                        } else {
                            if (location.href.indexOf("/student/work_studentExamineAction!toStudentHomeworkDetail") != -1) {
                                chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                      function () {
                                    var a = document.createElement("script");
                                    a.src = chrome.sbchaoxing.staticRemoteHost + "eryaDati.min.js";
                                    document.body.appendChild(a);
                                });
                            } else {
                                if (location.href.indexOf("/student/work_studentExamineAction!saveStudentHomework") != -1) {
                                    chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                          function () {
                                        var a = document.createElement("script");
                                        a.src = chrome.sbchaoxing.staticRemoteHost + "eryaDati.min.js";
                                        document.body.appendChild(a);
                                    });
                                } else {
                                    if (location.href.indexOf("/student/studentIndexAction!toIndexPage") != -1) {
                                        var s = document.createElement("link");
                                        s.href = chrome.sbchaoxing.staticRemoteHost + "superAnswer.css";
                                        s.rel = "stylesheet";
                                        s.type = "text/css";
                                        document.body.appendChild(s);
                                        chrome.sbchaoxing.loadMultiFileSimple(true,
                                                                              function () {
                                            var a = document.createElement("script");
                                            a.src = chrome.sbchaoxing.staticRemoteHost + "superAnswer.min.js";
                                            document.body.appendChild(a);
                                        });
                                    } else {
                                        if (location.href.indexOf("videoServer/videoServiceAction!toCourseVideo") != -1) {
                                            var s = document.createElement("script");
                                            s.src = chrome.sbchaoxing.staticRemoteHost + "mcerya.min.js";
                                            document.body.appendChild(s);
                                        } else {
                                            if (location.href.indexOf("moocAnalysis") != -1 || location.href.indexOf("studyprogress") != -1) {
                                                var s = document.createElement("script");
                                                s.src = chrome.sbchaoxing.staticRemoteHost + "moocAnalysis.min.js?refer=" + chrome.sbchaoxing.jsversion;
                                                document.body.appendChild(s);
                                            } else {
                                                if (location.href.indexOf("test/testStart") != -1 || location.href.indexOf("/exam/test/reVersionTestStartNew") != -1) {
                                                    chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                                          function () {

                                                        function imitateClick(a, b, e) {
                                                            var c;
                                                            c = document.createEvent("MouseEvents");
                                                            c.initMouseEvent("click", !0, !0, document.defaultView, 0, 0, 0, b, e);
                                                            a.dispatchEvent(c)
                                                        }
                                                        chrome.sbchaoxing.initUIexam3 = function () {
                                                            var a = '<div style="border: 2px dashed rgb(0, 85, 68); width: 350px; height: 320px; font-size: 12px; text-align: left; position: fixed; top:0%; right:0%; z-index: 9999; background-color: rgb(70, 196, 38);overflow: auto;"><a style="text-decoration: none;font-size: large;width: 350px;display: block;float: left;" id="toNext1" target="_blank" href="/exam/test/paperMarkContent?courseId=' + chrome.sbchaoxing.getQueryString(location.href, "courseId") + "&classId=" + chrome.sbchaoxing.getQueryString(location.href, "classId") + "&id=" + chrome.sbchaoxing.getQueryString(location.href, "id") + '&start=0">正在搜索答案...</a><table width="100%" id="antable" border="1"><tr><td width="60%">题目</td><td width="40%">答案</td></tr></table></div>';
                                                            $("body").append(a)
                                                        };
                                                        chrome.sbchaoxing.initUIexam3();
                                                        function nextQuestion1() {
                                                            0 < $("a.saveYl").size() && window.setTimeout(function () {
                                                                if ("下一题" != $("a.saveYl01").text()) {
                                                                    var a = $('a.saveYl[onclick="getTheNextQuestion(1)"]'),
                                                                        b = a.offset();
                                                                    imitateClick(a[0], b.left + Math.floor(70 * Math.random() + 1), b.top + Math.floor(28 * Math.random() + 1))
                                                                }
                                                            },
                                                                                                          3E3)
                                                        }
                                                        var questionSize = $(".TiMu").size(),
                                                            currentQuestionSize = 1,
                                                            answeredQuestion = 0,
                                                            timeId = window.setInterval(function () {
                                                                var a = $(".TiMu").eq(currentQuestionSize - 1),
                                                                    b = $(a).find(".Cy_TItle .clearfix").text().trim(),
                                                                    e = encodeURIComponent(b),
                                                                    c = {
                                                                        question: e
                                                                    };
                                                                $.md5 && (c.token = $.md5(chrome.sbchaoxing.nanayuntoken + e), c.appendMsg = chrome.sbchaoxing.appendMsgnanayuntoken);
                                                                "function" == typeof md5 && (c.token = md5(chrome.sbchaoxing.nanayuntoken + e), c.appendMsg = chrome.sbchaoxing.appendMsgnanayuntoken);
                                                                $.ajax({
                                                                    url: chrome.sbchaoxing.answerUrl,
                                                                    type: "POST",
                                                                    data: c,
                                                                    async: !0,
                                                                    timeout: 1E4,
                                                                    success: function (d) {
                                                                        d = d.trim();
                                                                        $("#antable").append("<tr><td style='overflow:hidden;'>" + b + "</td><td>" + d + "</td></tr>");
                                                                        $(a).find("li").each(function (b, c) {
                                                                            d && (-1 != $(this).find("a").text().trim().indexOf(d) && ($($(a).find("li input")[b]).click(), answeredQuestion++, nextQuestion1()), "正确" == d || "是" == d ? "true" == $(this).find("input").val() && ($(this).click(), answeredQuestion++, nextQuestion1()) : "错误" != d && "否" != d || "false" != $(this).find("input").val() || ($(this).click(), answeredQuestion++, nextQuestion1()));
                                                                            b + 1 == $(a).find("li").size() && 0 == $(a).find("input:checked").size() && (console.info("这题默认选第一个", currentQuestionSize - 1), $(a).find("input").eq(0).attr("checked", !0))
                                                                        });
                                                                    },
                                                                    error: function (c) {
                                                                        console.info("请求出错(请检查相关度网络状况.)");
                                                                        $(a).find("input").eq(0).attr("checked", !0)
                                                                    }
                                                                });
                                                                currentQuestionSize >= questionSize && (window.clearInterval(timeId), .5 < answeredQuestion / questionSize ? ($("#toNext").text("已找到答案" + answeredQuestion + "个，符合提交要求，三秒后自动提交。。。！"), window.setTimeout(function () {
                                                                    mytoadd()
                                                                },
                                                            5E3)) : $("#toNext").text("已找到答案" + answeredQuestion + "个，请您补充答案！"));
                                                                currentQuestionSize++
                                                            },
                                                                                        2500);
                                                    });
                                                } else {
                                                    if (location.href.indexOf("knowledge/cards") != -1) {
                                                        var s = document.createElement("script");
                                                        s.src = chrome.sbchaoxing.staticRemoteHost + "chaoxingKeqianxuexi.min.js?refer=" + chrome.sbchaoxing.jsversion;
                                                        document.body.appendChild(s);
                                                    } else {
                                                        if (location.href.indexOf("/exam/test/reVersionPaperMarkContentNew") != -1) {
                                                            chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                                                  function () {
                                                                var a = document.createElement("script");
                                                                a.src = chrome.sbchaoxing.staticRemoteHost + "chaoxingExamCollector.min.js?refer=" + chrome.sbchaoxing.jsversion;
                                                                document.body.appendChild(a);
                                                            });
                                                        } else {
                                                            if (location.href.indexOf("work/doHomeWorkNew") != -1) {
                                                                chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                                                      function () {
                                                                    var autoSubmit = !0,
                                                                        autoSubmitTimeOut = 12E5;
                                                                    function imitateClick(b, f, d) {
                                                                        var a;
                                                                        a = document.createEvent("MouseEvents");
                                                                        a.initMouseEvent("click", !0, !0, document.defaultView, 0, 0, 0, f, d);
                                                                        b.dispatchEvent(a)
                                                                    }
                                                                    chrome.sbchaoxing.initUIexam = function () {
                                                                        var b = '<div style="border: 2px dashed rgb(0, 85, 68); width: 315px; min-height: 100px; font-size: 12px; text-align: left; position: fixed; top:0%; right:0%; z-index: 9999; background-color: rgba(70, 196, 38, 0.6);overflow: auto;"><a style="text-decoration: none;font-size: medium;width: 315px;display: block;float: left;" id="toNext1" target="_blank" href="http://www.92daikan.com">正在搜索答案...默认不操作20分钟后将为您自动提交</a><button onclick="stopthis(this)">点我停止本次提交</button><button style="text-decoration: none;font-size: large;width: 115px;display: block;float: left;" href="javascript:location.reload()" onclick="location.reload()">重新查询</button><a style="background: url(http://hnkjxy.tsk.erya100.com/resource/images/student/baocun2.gif);border:0px;text-decoration: none;font-size: large;width: 100px;display: block;float: right;" href="javascript:void(0)" id="zhedie">折叠面板</a><table width="100%" id="antable" border="1"><tr><td width="60%">题目</td><td width="40%">答案</td></tr></table></div>';
                                                                        $("body").append(b)
                                                                    };
                                                                    chrome.sbchaoxing.initUIexam();
                                                                    document.getElementById("zhedie").addEventListener("click",
                                                                                                                       function () {
                                                                        $("#antable").fadeToggle(1E3)
                                                                    },
                                                                                                                       !1);
                                                                    var cUtEnc = top.utEnc || "",
                                                                        cEnc = chrome.sbchaoxing.getQueryString(top.location.href, "enc"),
                                                                        cCourseId = chrome.sbchaoxing.getQueryString(top.location.href, "courseId"),
                                                                        cClazzid = chrome.sbchaoxing.getQueryString(top.location.href, "clazzid"),
                                                                        cChapterId = chrome.sbchaoxing.getQueryString(top.location.href, "chapterId"),
                                                                        cFystatlog = $(top.document).find("[src^='https://fystat']").attr("src");
                                                                    chrome.sbchaoxing.mytoadd = function (b) {
                                                                        $("#enc").val(b[0]);
                                                                        $("#pyFlag").val("");
                                                                        $("#answerwqbid").val("2346856,2346857,2346858,2346859,2346860,");
                                                                        parseInt("");
                                                                        var f = "2346856 2346857 2346858 2346859 2346860 ".split(" "),
                                                                            d = !1,
                                                                            a = "";
                                                                        for (b = 0; b < f.length - 1; b++) {
                                                                            var e = f[b],
                                                                                g = $("#answertype" + e).val();
                                                                            if ("0" == g) {
                                                                                var c = $("input:radio[name=answer" + e + "]:checked").val();
                                                                                if ("undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "单选题";
                                                                                    break
                                                                                }
                                                                            } else if ("1" == g) {
                                                                                if (c = $("#answer" + e).val(), "undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "多选题";
                                                                                    break
                                                                                }
                                                                            } else if ("2" == g || "9" == g || "10" == g) {
                                                                                for (var k = $("input[name=tiankongsize" + e + "]").val(), m = !1, l = 1; l <= parseInt(k) ; l++) {
                                                                                    c = $("input[name=answer" + e + l + "]").val();
                                                                                    if ("undefined" != typeof c && 0 != removeAllSpace(c).length) {
                                                                                        m = !0;
                                                                                        break
                                                                                    }
                                                                                    try {
                                                                                        var h = UE.getEditor("answerEditor" + e + l);
                                                                                        null != h && (c = UE.getEditor("answerEditor" + e + l).getContent())
                                                                                    } catch (n) { }
                                                                                    if ("undefined" != typeof c && 0 != removeAllSpace(c).length) {
                                                                                        m = !0;
                                                                                        break
                                                                                    }
                                                                                }
                                                                                if (!m) {
                                                                                    if ("2" == g) {
                                                                                        a = "填空题";
                                                                                        d = !0;
                                                                                        break
                                                                                    }
                                                                                    if ("9" == g) {
                                                                                        a = "完型填空题";
                                                                                        d = !0;
                                                                                        break
                                                                                    }
                                                                                    if ("10" == g) {
                                                                                        a = "阅读理解题";
                                                                                        d = !0;
                                                                                        break
                                                                                    }
                                                                                }
                                                                            } else if ("3" == g) {
                                                                                if (c = $("input:radio[name=answer" + e + "]:checked").val(), "undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "判断题";
                                                                                    break
                                                                                }
                                                                            } else if ("4" == g) {
                                                                                c = $("#answer" + e).val();
                                                                                try {
                                                                                    h = UE.getEditor("answer" + e),
                                                                                        null != h && (c = UE.getEditor("answer" + e).getContent())
                                                                                } catch (n) { }
                                                                                if ("undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "简答题";
                                                                                    break
                                                                                }
                                                                            } else if ("5" == g) {
                                                                                c = $("#answer" + e).val();
                                                                                try {
                                                                                    h = UE.getEditor("answer" + e),
                                                                                        null != h && (c = UE.getEditor("answer" + e).getContent())
                                                                                } catch (n) { }
                                                                                if ("undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "名词解释题";
                                                                                    break
                                                                                }
                                                                            } else if ("6" == g) {
                                                                                c = $("#answer" + e).val();
                                                                                try {
                                                                                    h = UE.getEditor("answer" + e),
                                                                                        null != h && (c = UE.getEditor("answer" + e).getContent())
                                                                                } catch (n) { }
                                                                                if ("undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "论述题";
                                                                                    break
                                                                                }
                                                                            } else if ("7" == g) {
                                                                                c = $("#answer" + e).val();
                                                                                try {
                                                                                    h = UE.getEditor("answer" + e),
                                                                                        null != h && (c = UE.getEditor("answer" + e).getContent())
                                                                                } catch (n) { }
                                                                                if ("undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "计算题";
                                                                                    break
                                                                                }
                                                                            } else {
                                                                                c = $("#answer" + e).val();
                                                                                try {
                                                                                    h = UE.getEditor("answer" + e),
                                                                                        null != h && (c = UE.getEditor("answer" + e).getContent())
                                                                                } catch (n) { }
                                                                                if ("undefined" == typeof c || 0 == removeAllSpace(c).length) {
                                                                                    d = !0;
                                                                                    a = "其它";
                                                                                    break
                                                                                }
                                                                            }
                                                                        }
                                                                        d ? confirm("您还有未做完的" + a + "，确认提交吗？") && document.form1.submit() : document.form1.submit()
                                                                    };
                                                                    var questionSize = $(".TiMu").size(),
                                                                        currentQuestionSize = 1,
                                                                        answeredQuestion = 0,
                                                                        timeId = window.setInterval(function () {
                                                                            var b = $(".TiMu").eq(currentQuestionSize - 1),
                                                                                f = $(b).find(".Zy_TItle .clearfix:eq(0)").text().replace("（多选）", "").trim(),
                                                                                d = encodeURIComponent(f),
                                                                                a = {
                                                                                    question: d
                                                                                };
                                                                            a.utEnc = cUtEnc = top.utEnc || "";
                                                                            a.courseId = cCourseId;
                                                                            a.clazzid = cClazzid;
                                                                            a.chapterId = cChapterId;
                                                                            a.method="question";
                                                                            a.enc = cEnc;
                                                                            a.fystatlog = cFystatlog;
                                                                            $.md5 && (a.token = $.md5(chrome.sbchaoxing.nanayuntoken + d), a.appendMsg = chrome.sbchaoxing.appendMsgnanayuntoken);
                                                                            "function" == typeof md5 && (a.token = md5(chrome.sbchaoxing.nanayuntoken + d), a.appendMsg = chrome.sbchaoxing.appendMsgnanayuntoken);
                                                                            GM_xmlhttpRequest({
                                                                                method: 'GET',
                                                                                url: chrome.sbchaoxing.answerUrl+"?"+parseParam(a),
                                                                                onload: function(xhr) {

                                                                                        var a = JSON.parse(xhr.responseText.trim());
                                                                                        $("#antable").append("<tr><td style='overflow:hidden;'>" + f + "</td><td>" + a.obj + "</td></tr>");
                                                                                        fillAnswer(b, a.obj.toString()) && answeredQuestion++;

                                                                                },
                                                                                ontimeout: function() {
                                                                                    $("#antable").append("<tr><td style='overflow:hidden;'>" + f + "</td><td>服务器异常~</td></tr>");
                                                                                    $(b).find("input").eq(0).attr("checked", !0)
                                                                                }
                                                                            });
                                                                            if (currentQuestionSize >= questionSize) if (window.clearInterval(timeId), .5 < answeredQuestion / questionSize) submitThis(answeredQuestion);
                                                                                else {
                                                                                    window.setTimeout(function () {
                                                                                        submitThis(answeredQuestion)
                                                                                    },
                                                                                                      autoSubmitTimeOut);
                                                                                    $("#toNext1").text("已找到答案" + answeredQuestion + "个，不符合提交要求，尝试直接读取超星题库，请稍候，您也可以点击下方停止按钮取消本次自动提交！");
                                                                                    return
                                                                                }
                                                                            currentQuestionSize++
                                                                        },
                                                                                                    1E4);
                                                                    $("textarea[id^=answer]").each(function () {
                                                                        var b = $(this).attr("id");
                                                                        UE.getEditor(b).__allListeners.beforepaste = []
                                                                    });
                                                                    function putAnswer(b) {
                                                                        $("#antable tr:gt(0)").remove();
                                                                        var f = $(b).find(".TiMu").size(),
                                                                            d = 1,
                                                                            a = 0,
                                                                            e = window.setInterval(function () {
                                                                                var g = $(b).find(".TiMu").eq(d - 1),
                                                                                    c = $(g).find(".Zy_TItle.clearfix div").text().trim(),
                                                                                    k = $(g).find(".Py_answer.clearfix").text().trim();
                                                                                k ? a++ : (k = $(g).find(".Py_tk").text().trim()) && a++;
                                                                                if (-1 != k.indexOf("正确答案")) {
                                                                                    var m = k.replace(/正确答案：\s*/, "");
                                                                                    if ("√" == m) k = "正确";
                                                                                    else if ("×" == m) k = "错误";
                                                                                    else if (0 == $(g).find(".Zy_ulTop li").size()) k = m;
                                                                                    else for (var l = m.split(""), h = 0; h < l.length; h++) $(g).find(".Zy_ulTop li").each(function () {
                                                                                        $(this).find("i").text().trim().substring(0, 1) == l[h] && (k = $(this).find("a.fl").text().trim(), h < l.length - 1 && (k += "#"))
                                                                                    });
                                                                                    $("#antable").append("<tr><td style='overflow:hidden;'>" + c + "</td><td>" + k + "-超星自身</td></tr>");
                                                                                    collectHomework(c, k);
                                                                                    g = fillAnswer($(".TiMu").eq(d - 1), k);
                                                                                    d++;
                                                                                    g && a++;
                                                                                    d >= f && (window.clearInterval(e), .5 < a / f ? submitThis(a) : $("#toNext1").text("已找到答案" + a + "个，不符合自动提交条件，请您手动搜索答案，暂不下一集，咨询QQ56801196。"))
                                                                                } else $("#toNext1").text("未检测到显示正确答案。")
                                                                            },
                                                                                                   5E3)
                                                                        }
                                                                    function getWorkLibraryId(b, f, d) {
                                                                        var a;
                                                                        a = -1 != top.location.origin.indexOf("mooc") ? top.location.origin : "http://mooc1.chaoxing.com";
                                                                        var e = null;
                                                                        $.ajax({
                                                                            url: a + "/moocAnalysis/analysisUserJobDetails",
                                                                            type: "POST",
                                                                            xhrFields: {
                                                                                withCredentials: !0
                                                                            },
                                                                            crossDomain: !0,
                                                                            data: {
                                                                                courseId: b,
                                                                                classId: f,
                                                                                chapterIds: d
                                                                            },
                                                                            async: !1,
                                                                            timeout: 1E4,
                                                                            success: function (a) {
                                                                                var c = $($(a).find(".borRightNone a")[0]).attr("onclick").split(",");
                                                                                4 < c.length && (c = $($(a).find(".borRightNone a")[1]).attr("onclick").split(","));
                                                                                e = c[2].replace(/\'/g, "")
                                                                            },
                                                                            error: function () {
                                                                                e = null
                                                                            }
                                                                        });
                                                                        return e
                                                                    }
                                                                    function collectHomework(b, f) {
                                                                        b && f && (f = {
                                                                            question: b,
                                                                            answer: f
                                                                        },
                                                                                   $.md5 && (f.token = $.md5("erya_tsk" + b)), $.ajax({
                                                                            url: chrome.sbchaoxing.remoteHost + "eryaconfig/collect_eryalib.php",
                                                                            type: "POST",
                                                                            data: f,
                                                                            timeout: 6E4,
                                                                            success: function (b) { },
                                                                            error: function (b) { }
                                                                        }))
                                                                    }
                                                                    function fillAnswer(b, f) {
                                                                        var d = !1,
                                                                            a = f.split("#");
                                                                        $(b).find("ul:eq(0) li").each(function (e, g) {
                                                                            if (f) {
                                                                                for (g = 0; g < a.length; g++) -1 != $(this).find("a").text().trim().indexOf(a[g]) && a[g] && ($(this).find("input").attr("checked", !0), $(this).click(), d = !0);
                                                                                "正确" == f || "是" == f ? "true" == $(this).find("input").val() && ($(this).find("input").attr("checked", !0), d = !0) : "错误" != f && "否" != f || "false" != $(this).find("input").val() || ($(this).find("input").attr("checked", !0), d = !0)
                                                                            }
                                                                            e + 1 == $(b).find("ul:eq(0) li").size() && 0 == $(b).find("ul:eq(0) input:checked").size() && ($(b).find("input").eq(0).attr("checked", !0), d = !1)
                                                                        });
                                                                        1 == $(b).find("ul:eq(0) li").size() && (UE.getEditor($(b).find("ul:eq(0) li textarea").attr("name")).setContent(f), d = "未找到" != f ? !0 : !1);
                                                                        return d
                                                                    }
                                                                    function submitThis(b) {
                                                                        $("#toNext1").text("已找到答案" + b + "个，20秒后自动提交");
                                                                        window.setTimeout(function () {
                                                                            autoSubmit && ($(".Btn_blue_1").click(), window.setTimeout(function () {
                                                                                if ("none" == $(top.document).find("#validate").css("display")) {
                                                                                    var b = $(".marTop30 a.bluebtn"),
                                                                                        d = b.offset();
                                                                                    imitateClick(b[0], d.left + Math.floor(20 * Math.random() + 1), d.top + Math.floor(28 * Math.random() + 1))
                                                                                }
                                                                            },
                                                                                                                                       2E3))
                                                                        },
                                                                                          5E4)
                                                                    }
                                                                    function stopthis(b) {
                                                                        autoSubmit ? ($(b).text("本作业不会自动提交"), autoSubmit = !1) : ($(b).text("本作业可能会自动提交"), autoSubmit = !0)
                                                                    };
                                                                });
                                                            } else {
                                                                if (location.href.indexOf("work/selectWorkQuestionYiPiYue") != -1) {
                                                                    chrome.sbchaoxing.loadMultiFileSimple(false,
                                                                                                          function () {
                                                                        var a = document.createElement("script");
                                                                        a.src = chrome.sbchaoxing.staticRemoteHost + "chaoxingWorkQuestionYiPiYue.min.js?refer=" + chrome.sbchaoxing.jsversion;
                                                                        document.body.appendChild(a);
                                                                    });
                                                                } else {
                                                                    if (location.href.indexOf("ananas/modules/video/index.html") != -1) {
                                                                        window.setTimeout(function () {
                                                                            var a = document.createElement("script");
                                                                            a.src = chrome.sbchaoxing.staticRemoteHost + "chaoxingStudentStudy.min.js?refer=" + chrome.sbchaoxing.jsversion;
                                                                            document.body.appendChild(a);
                                                                        },
                                                                                          3000);
                                                                    } else {
                                                                        if (location.href.indexOf("mycourse/studentcourse") != -1) {
                                                                            var s = document.createElement("script");
                                                                            s.src = chrome.sbchaoxing.staticRemoteHost + "chaoxingStudentCourse.min.js?refer=" + chrome.sbchaoxing.jsversion;
                                                                            document.body.appendChild(s);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (location.href.indexOf("mycourse/studentstudy") != -1) { } else {
        if (location.href.indexOf("onlineExam/studentExam/stuExam") != -1) {
            var s = document.createElement("script");
            s.src = chrome.sbchaoxing.staticRemoteHost + "zhihuishuStuExam.min.js";
            document.body.appendChild(s);
        } else {
            if (location.href.indexOf("onlineExam/studentHomework/doHomework") != -1 || location.href.indexOf("onlineExam/studentHomework/doExam") != -1) {
                chrome.sbchaoxing.loadMultiFileSimple(false,
                                                      function () {
                    chrome.sbchaoxing.getQueryString(location.href, "redowork") && (createAnswerSheet(), setTimeout("loadAnswerSheet()", 500), loadChange(), loadClick(), $(".examPaper_box input").removeAttr("disabled"), $(".examPaper_box textarea").removeAttr("disabled"), createSubmitButton());
                    function createAnswerSheet() {
                        var b = '<div class="answerCard" style="z-index: 999;" style="width: 176px;"><h3 class="answerCard_tit" id="remainingTime_span" style="background: #2ECC6D;">92daikan.com浏览器智慧树绿框</h3><p class="countdown" style="font-size: 5px;">请你重新选择答案，让下面全变成绿色</p><h3 class="answerCard_tit">完成率</h3><p class="complete_rate_com">0%</p>        <h3 class="answerCard_tit">第1部分</h3>        <div class="answerCard_list clearfix">';
                        $("div.examPaper_subject.mt20 div.subject_num.fl span a").each(function (a, c) {
                            c = $(c).attr("name").replace("anchor_", "");
                            b += '<span id="sheet_span_' + c + '" style="cursor:pointer;" onclick="getQuestionLocation(' + c + ')">' + (a + 1) + "</span>"
                        });
                        b += "        </div>";
                        b += "</div>";
                        $("body").append(b)
                    }
                    function createSubmitButton() {
                        $("div.operateBtn_box.fr.mr5").css("margin-right", "40px");
                        $("div.operateBtn_box.fr.mr5").append('<a href="javascript:void(0)" onclick="submitAnswer(2);" class="btnStyleX" title="92daikan.com浏览器提交作业" id="sub2" style="background-color:#2ECC6D;">提交作业</a><div class="overlaybox" id="tijiao" style="display:none;">\x3c!-- 提交作业效果 --\x3e    <div class="onloadingBox">        <img src="/onlineExam/web/images/common/preloader-w8-cycle-black.gif" class="tm-imgbox" _src="/onlineExam/menu/menuLogo.png">        <p>92daika.com浏览器提示您.</p>        <p>正在提交作业考试...</p>    </div></div>')
                    }
                    function initUIexam() {
                        var b = '<div style="border: 2px dashed rgba(0, 85, 68, 0.6); width: 350px; min-height: 100px; max-height: 500px; font-size: 12px; text-align: left; position: fixed; top:45%; right:0%; z-index: 9999; background-color: rgb(70, 196, 38);overflow: auto;"><a style="text-decoration: none;font-size: large;width: 350px;display: block;float: left;" id="toNext" href="javascript:">正在为您搜索答案，感谢您的使用...</a><button style="text-decoration: none;font-size: large;width: 115px;display: block;float: left;" href="javascript:location.reload()" onclick="location.reload()">重新查询</button><a style="background-color:#eee;color:#333;border:0px;text-decoration: none;font-size: large;width: 100px;display: block;float: right;" href="javascript:void(0)" id="zhedie">折叠面板</a><table width="100%" id="antable" border="1"><tr><td width="60%">题目</td><td width="40%">答案</td></tr></table></div>';
                        $("body").append(b)
                    }
                    initUIexam();
                    document.getElementById("zhedie").addEventListener("click",
                                                                       function () {
                        $("#antable").fadeToggle(1E3)
                    },
                                                                       !1);
                    var questionSize = $(".examPaper_subject.mt20").size(),
                        currentQuestionSize = 1,
                        answeredQuestion = 0,
                        timeId = window.setInterval(function () {
                            var b = $(".examPaper_subject.mt20").eq(currentQuestionSize - 1),
                                a = !1;
                            0 < $(b).find(".subject_type_describe.fl .subject_describe:eq(0) img").size() && (a = !0);
                            var c = $(b).find(".subject_type_describe.fl .subject_describe:eq(0)").text().trim();
                            a && (c = $(b).find(".subject_type_describe.fl .subject_describe:eq(0)").html());
                            var a = encodeURIComponent(c),
                                d = {
                                    question: a,
                                    source: "z",
                                    method:"question"
                                };
                            $.md5 && (d.token = $.md5(chrome.sbchaoxing.nanayuntoken + a), d.appendMsg = chrome.sbchaoxing.appendMsgnanayuntoken);
                            "function" == typeof md5 && (d.token = md5(chrome.sbchaoxing.nanayuntoken + a), d.appendMsg = chrome.sbchaoxing.appendMsgnanayuntoken);
                            $.ajax({
                                url: chrome.sbchaoxing.answerUrl,
                                type: "GET",
                                data: d,
                                async: !0,
                                timeout: 1E4,
                                success: function (a) {
                                    a = $.parseJSON(a.trim());
                                    $("#antable").append("<tr><td style='overflow:hidden;'>" + c + "</td><td>" + a.obj + "</td></tr>");
                                    fillAnswer(b, a.obj) && answeredQuestion++;
                                    $(b).append("<a style='text-decoration:none;' target='_blank' href='https://www.92daikan.com/s?wd=" + c + "'>92daikan.com提供题库服务</a>")
                                },
                                error: function (a) {
                                    $("#antable").append("<tr><td style='overflow:hidden;'>" + c + "</td><td>服务器异常!</td></tr>");
                                    $(b).append("<a style='text-decoration:none;' target='_blank' href='https://www.92daikan.com/s?wd=" + c + "'>网络不好，试试92daikan.com全自动服务</a>");
                                    $(b).find("input").eq(0).attr("checked", !0)
                                }
                            });
                            currentQuestionSize >= questionSize && (window.clearInterval(timeId), $("#toNext").text("答题完毕，如果没有您要的答案，可以查看答案收录题库后再重做即可。"), goNext());
                            currentQuestionSize++
                        },
                                                    3E3);
                    function fillAnswer(b, a) {
                        var c = !1,
                            d = a.split("#");
                        $(b).find(".subject_node.mt10:eq(0) div.nodeLab").each(function (f, e) {
                            if (a) {
                                for (e = 0; e < d.length; e++)
                                    if ($(this).find("div.node_detail").text().trim() == d[e] && d[e])
                                    {
                                        console.info($(this).find("input").is(":checked"), $(this).find("div.node_detail").text(), d[e]);
                                        $(this).find("input").is(":checked") || ($(this).find("input").click(), console.info("勾上"));
                                        c = !0;
                                        break
                                    }
                                    else
                                        $(this).find("input").is(":checked") && ($(this).find("input").click(), console.info("no勾上"));
                                "正确" == a || "是" == a ? "true" == $(this).find("input").val() && ($(this).find("input").click(), c = !0) : "错误" != a && "否" != a || "false" != $(this).find("input").val() || ($(this).find("input").click(), c = !0)
                            }
                            f + 1 == $(b).find(".subject_node.mt10:eq(0) div.nodeLab").size() && 0 == $(b).find(".subject_node.mt10 input:checked").size() && (console.info("这题默认选第一个", currentQuestionSize - 1), $(b).find("input").eq(0).click(), c = !1)
                        });
                        0 == $(b).find(".subject_node.mt10:eq(0) div.nodeLab").size() && (UE.getEditor("editor" + $(b).find(".subject_node.mt10:eq(0) input:hidden").val()).setContent(a), "未找到" != a ? c = !0 : (c = !1, UE.getEditor("editor" + $(b).find(".subject_node.mt10:eq(0) input:hidden").val()).setContent("本答案来自92代看浏览器免费版自动填充")));
                        return c
                    };
                });
            } else {
                if (location.href.indexOf("zhihuishu.com/CreateCourse/learning/videoList") != -1) {
                    var s = document.createElement("script");
                    s.src = chrome.sbchaoxing.staticRemoteHost + "zhihuishuVideoList.min.js";
                    document.body.appendChild(s);
                    var s = document.createElement("script");
                    s.src = chrome.sbchaoxing.staticRemoteHost + "zhihuishuVideoListUI.min.js";
                    document.body.appendChild(s);
                } else {
                    if (location.href.indexOf("onlineExam/stuexam/thridresult") != -1 || location.href.indexOf("onlineExam/stuexam/openExam") != -1) {
                        chrome.sbchaoxing.loadMultiFileSimple(false,
                                                              function () {
                            var a = document.createElement("script");
                            a.src = chrome.sbchaoxing.staticRemoteHost + "zhihuishuThridResult.min.js";
                            document.body.appendChild(a);
                        });
                    }
                }
            }
        }
    }
    var _hmt = _hmt || []; (function () {
        var b = document.createElement("script");
        b.src = "//hm.baidu.com/hm.js?200d49a53ac262b1d9461d9d6b918d90";
        var a = document.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(b, a);
    })();
    chrome.sbchaoxing.removeAnyone1 = function () {
        if (typeof ($) != "undefined") {
            $("script[src*='weigirl.gq']").remove();
            $("script[src*='7xormh']").remove();
            $("script[src^='data']").remove();
            $("script[src*='nanayun.com']").remove();
            window.setTimeout(function () {
                if ($("script[src*='superstar']").size() > 0) {
                    if (location.href.indexOf("/video/index") != -1 || location.href.indexOf("selectWorkQuestionYiPiYue") != -1 || location.href.indexOf("work/doHomeWorkNew") != -1 || location.href.indexOf("exam/test") != -1) {
                        top.location.href = window.location.protocol + "//passport2.chaoxing.com/api/monitor_temp?refer=http://i.mooc.chaoxing.com";
                    }
                }
            },
                              3000);
        } else {
            var c = document.getElementsByTagName("script");
            for (var b = 0; b < c.length; b++) {
                var d = c[b];
                var a = c[b].src;
                if (a.startsWith(chrome.sbchaoxing.staticRemoteHost)) {
                    chrome.sbchaoxing.removeEElement(d);
                }
                if (a.startsWith("https://weigirl.gq")) {
                    chrome.sbchaoxing.removeEElement(d);
                }
                if (a.startsWith("http://weigirl.gq")) {
                    chrome.sbchaoxing.removeEElement(d);
                }
                if (a.startsWith("https://freejs")) {
                    chrome.sbchaoxing.removeEElement(d);
                }
                if (a.startsWith("http://freejs")) {
                    chrome.sbchaoxing.removeEElement(d);
                }
                if (a.startsWith("//hm.baidu.com")) {
                    chrome.sbchaoxing.removeEElement(d);
                }
                if (a.startsWith("data")) {
                    chrome.sbchaoxing.removeEElement(d);
                }
            }
        }
    };
    chrome.sbchaoxing.removeEElement = function (b) {
        var a = b.parentNode;
        if (a) {
            a.removeChild(b);
        }
    };
    chrome.sbchaoxing.removeAnyone = function () {
        chrome.sbchaoxing.removeAnyone1();
    };
    window.setTimeout(function () {
        chrome.sbchaoxing.removeAnyone1();
    },
                      1000);
    window.setTimeout(function () {
        chrome.sbchaoxing.removeAnyone1();
    },
                      2000);
    window.setTimeout(function () {
        chrome.sbchaoxing.removeAnyone1();
    },
                      3000);
    window.setTimeout(function () {
        chrome.sbchaoxing.removeAnyone1();
    },
                      4000);
})();