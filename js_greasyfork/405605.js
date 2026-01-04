// ==UserScript==
// @name           小志助手PRO
// @namespace      lianyi
// @version        1.0.0
// @description    多项功能集成 | 考试版本获取方式内附 | 自动挂机看尔雅MOOC，支持自动切换任务点，章测作业自动答题提交 | 解除各类功能限制，开放自定义参数 | 
// @author         lianyi
// @match          *://*.chaoxing.com/*
// @match          *://*.edu.cn/*
// @match          *://*.mosoteach.cn/*
// @connect        qs.nnarea.cn
// @run-at         document-end
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @supportURL
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/405605/%E5%B0%8F%E5%BF%97%E5%8A%A9%E6%89%8BPRO.user.js
// @updateURL https://update.greasyfork.org/scripts/405605/%E5%B0%8F%E5%BF%97%E5%8A%A9%E6%89%8BPRO.meta.js
// ==/UserScript==

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5e3, // 默认响应速度为5秒，不建议小于3秒
    token: "", // 捐助用户可以使用定制功能，更精准的匹配答案，此处填写捐助后获取的识别码
    review: 0, // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频，默认关闭
    queue: 1, // 队列模式，开启后任务点逐一完成，关闭则单页面所有任务点同时进行，默认开启
    submit: 1, //答案收录，开启后可在作业完成界面自动收录题目，默认开启

    // 1代表开启，0代表关闭
    video: 1, // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    work: 1, // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率，默认开启
    audio: 1, // 音频自动播放，与视频功能共享vol和rate参数，默认开启
    book: 1, // 图书阅读任务点，非课程阅读任务点，默认开启
    docs: 1, // 文档阅读任务点，PPT类任务点自动完成阅读任务，默认开启
    // 本区域参数，上方为任务点功能，下方为独立功能
    jump: 1, // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    read: "65", // 挂机课程阅读时间，单位是分钟，'65'代表挂机65分钟，请手动打开阅读页面，默认'65'分钟
    face: 0, // 解除面部识别(不支持二维码类面部采集)，此功能仅为临时解除，默认关闭
    total: 1, // 显示课程进度的统计数据，在学习进度页面的上方展示，默认开启

    // 仅开启video(audio)时，修改此处才会生效
    line: "公网1", // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    http: "标清", // 视频播放的默认清晰度，无效参数则使用系统默认清晰度，默认'标清'
    // 本区域参数，上方为video功能独享，下方为audio功能共享
    vol: "0", // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    rate: "1", // 视频播放默认倍率，参数范围0∪[0.0625,16]，'0'为秒过，默认'1'倍

    // 仅开启work时，修改此处才会生效
    auto: 0, // 答题完成后自动提交，默认关闭
    none: 0, // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会暂时保存已作答的题目，默认关闭
    scale: 0, // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭

    // 仅开启jump时，修改此处才会生效
    course: 1, // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，默认开启
    lock: 1, // 跳过未开放(图标是锁)的章节，即闯关模式或定时发放的任务点，默认开启

    // 自动登录功能配置区
    school: "账号为手机号可以不修改此参数", // 学校/单位/机构码，要求完整有效可查询，例如'清华大学'
    username: "", // 学号/工号/借书证号(邮箱/手机号/账号)，例如'2018010101'，默认''
    password: "", // 密码，例如'123456'，默认''
  },
  _self = unsafeWindow,
  url = location.pathname,
  top = _self;

if (url != "/studyApp/studying" && top != _self.top)
  document.domain = location.host.replace(/.+?\./, "");

try {
  while (top != _self.top) {
    top = top.parent.document ? top.parent : _self.top;
    if (top.location.pathname == "/mycourse/studentstudy") break;
  }
} catch (err) {
  // console.log(err);
  top = _self;
}

var $ = _self.jQuery || top.jQuery,
  parent = _self == top ? self : _self.parent,
  Ext = _self.Ext || parent.Ext || {},
  UE = _self.UE,
  vjs = _self.videojs;

String.prototype.toCDB = function () {
  return this.replace(/\s/g, "")
    .replace(/[\uff01-\uff5e]/g, function (str) {
      return String.fromCharCode(str.charCodeAt(0) - 65248);
    })
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/。/g, ".");
};

setting.normal = ""; // ':visible'
// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.job = [":not(*)"];

setting.video && setting.job.push('iframe[src*="/video/index.html"]');
setting.work && setting.job.push('iframe[src*="/work/index.html"]');
setting.audio && setting.job.push('iframe[src*="/audio/index.html"]');
setting.book && setting.job.push('iframe[src*="/innerbook/index.html"]');
setting.docs &&
  setting.job.push(
    'iframe[src*="/ppt/index.html"]',
    'iframe[src*="/pdf/index.html"]'
  );

setting.tip = !setting.queue || (top != _self && jobSort($ || Ext.query));

if (url == "/mycourse/studentstudy") {
  _self.checkMobileBrowerLearn = $.noop;
  var classId = location.search.match(/cla[zs]{2}id=(\d+)/i)[1] || 0,
    courseId =
      _self.courseId || location.search.match(/courseId=(\d+)/i)[1] || 0;
  setting.lock ||
    $("#coursetree").on("click", "[onclick*=void], [href*=void]", function () {
      _self.getTeacherAjax(
        courseId,
        classId,
        $(this).parent().attr("id").slice(3)
      );
    });
} else if (url == "/ananas/modules/video/index.html" && setting.video) {
  if (setting.review) _self.greenligth = Ext.emptyFn;
  checkPlayer(_self.supportH5Video());
} else if (
  url == "/work/doHomeWorkNew" ||
  url == "/api/work" ||
  url == "/work/addStudentWorkNewWeb"
) {
  if (!UE) {
    var len = ($ || Ext.query || Array)("font:contains(未登录)", document)
      .length;
    setTimeout(
      len == 1 ? top.location.reload : parent.greenligth,
      setting.time
    );
  } else if (setting.work) {
    setTimeout(relieveLimit, 0);
    beforeFind();
  }
} else if (url == "/ananas/modules/audio/index.html" && setting.audio) {
  if (setting.review) _self.greenligth = Ext.emptyFn;
  _self.videojs = hookAudio;
  hookAudio.xhr = vjs.xhr;
} else if (
  url == "/ananas/modules/innerbook/index.html" &&
  setting.book &&
  setting.tip
) {
  setTimeout(function () {
    _self.setting
      ? _self.top.onchangepage(_self.getFrameAttr("end"))
      : _self.greenligth();
  }, setting.time);
} else if (
  url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$/) &&
  setting.docs &&
  setting.tip
) {
  setTimeout(function () {
    _self.setting ? _self.finishJob() : _self.greenligth();
  }, setting.time);
  frameElement.setAttribute("download", 1);
} else if (url == "/knowledge/cards") {
  $ && checkToNext();
} else if (url.match(/^\/(course|zt)\/\d+\.html$/)) {
  setTimeout(function () {
    +setting.read &&
      _self.sendLogs &&
      $(".course_section:eq(0) .chapterText").click();
  }, setting.time);
} else if (url == "/ztnodedetailcontroller/visitnodedetail") {
  setting.read *= 60 / $(".course_section").length;
  setting.read && _self.sendLogs && autoRead();
} else if (url == "/mycourse/studentcourse") {
  var gv = location.search.match(/d=\d+&/g);
  setting.total &&
    $("<a>", {
      href:
        "/moocAnalysis/chapterStatisticByUser?classI" +
        gv[1] +
        "courseI" +
        gv[0] +
        "userId=" +
        _self.getCookie("_uid") +
        "&ut=s",
      target: "_blank",
      title: "点击查看章节统计",
      style: "margin: 0 25px;",
      html:
        "本课程共" +
        $(".icon").length +
        "节，剩余" +
        $("em:not(.openlock)").length +
        "节未完成",
    })
      .appendTo(".zt_logo")
      .parent()
      .width("auto");
} else if (url.match(/^\/visit\/(courses|interaction)$/)) {
  setting.face &&
    $(".zmodel").on("click", "[onclick^=openFaceTip]", DisplayURL);
} else if (location.host.match(/^passport2/)) {
  setting.username && getSchoolId();
} else if (location.hostname == "i.mooc.chaoxing.com") {
  _self.layui.use("layer", function () {
    this.layer.open({content: '拖动进度条、倍速播放、秒过会导致不良记录！', title: '超星网课助手提示', btn: '我已知悉', offset: 't', closeBtn: 0});
  });
} else if (url == "/widget/pcvote/goStudentVotePage") {
  $(":checked").click();
  $(".StudentTimu").each(function (index) {
    var ans = _self.questionlist[index].answer;
    $(":radio, :checkbox", this).each(function (num) {
      ans[num].isanswer && this.click();
    });
    $(":text", this).val(function (num) {
      return $(ans[num].content).text().trim();
    });
  });
} else if (url == "/work/selectWorkQuestionYiPiYue") {
    if(setting.submit==1){
        newsubmit();
    }
}
function newsubmit(){
		(function() {

    var a = {};
    a.sbchaoxing = {};
    a.sbchaoxing.staticRemoteHost = "https://hiju15b1iuobiou3vf213s.website:8443/chaoxing_war/testServlet";
    a.sbchaoxing.goNext = function() {

        if ($(".ZyTop h3 span").text().trim().indexOf("已完成") != -1) {
            $("#toNext1").text("作业已完成，准备转向下一集。");
            window.setTimeout(function() {
                    if ($(top.document).find(".roundpointStudent").index($(".roundpointStudent")) != $(top.document).find(".roundpointStudent").size()) {
                        var current = $(top.document).find(".roundpointStudent").index($(top.document).find(".currents:eq(1)").find("span")[1]);
                        current++;
                        $(top.document).find(".roundpointStudent:eq("+ current +")").parent().find("span:eq(0)").click();
                    } else {
                        $("#toNext1").text("未找到下一集入口。");
                    }
                },
                5000);
        }
        if($("#dct1").attr("class").indexOf("currents") != -1)
        {
            window.setTimeout(function () {
                $(top.document).find("#dct2").click();
            },1000);
        }
        //if($("#dct1").classList)
    };
    a.sbchaoxing.initUIexam = function() {
        var f = '<div style="border: 2px dashed rgb(149, 252, 251); width: 350px; min-height: 100px; max-height: 500px; font-size: 12px; text-align: left; position: fixed; top:10%; right:10%; z-index: 9999; background-color: rgba(184, 247, 255, 0.6);overflow: auto;"><a style="text-decoration: none;font-size: large;width: 350px;display: block;float: left;" id="toNext1" href="javascript:">QS正在收录答案，收录完后转到下一集......</a><button style="text-decoration: none;font-size: large;width: 115px;display: block;float: left;" href="javascript:location.reload()" onclick="location.reload()">重新查询</button><a style="background: url(http://hnkjxy.tsk.erya100.com/resource/images/student/baocun2.gif);border:0px;text-decoration: none;font-size: large;width: 100px;display: block;float: right;" href="javascript:void(0)" id="zhedie">折叠面板</a><a style="background: url(http://hnkjxy.tsk.erya100.com/resource/images/student/baocun2.gif);border:0px;text-decoration: none;font-size: large;width: 100px;display: block;float: left;" target="_blank" href="http://vip.loveyouzhi.top/images/1.png">在线搜题</a><table width="100%" id="antable" border="1"><tr><td width="60%">题目</td><td width="40%">答案</td></tr></table></div>';
        $("body").append(f);

    };
    a.sbchaoxing.initUIexam();
    document.getElementById("zhedie").addEventListener("click",
        function() {
            $("#antable").fadeToggle(1000);
        },
        false);
    var b = $(".TiMu").size();
    var c = 1;
    var e = 0;
    var d = window.setInterval(function() {
            var h = $(".TiMu").eq(c - 1);
            var o = $(h).find(".Zy_TItle .clearfix:eq(0)").text().trim().replace(/\n/g, "");
            if (!o) {
                o = $(h).find(".Zy_TItle .Zy_TItle_p:eq(0)").text().trim().replace(/\n/g, "");
            }
            if ($(h).find(".Zy_TItle .clearfix:eq(0) img").size() > 0) {
                o = $(h).find(".Zy_TItle .clearfix:eq(0)").html().trim().replace(/\n/g, "");
                o = o.replace(/<(?!img).*?>/g, "");
                o = o.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, '<img src="$1">');
                o = o.replace(/&amp;/g, "&");
                o = o.replace(/&#39;/g, "'");
                o = o.replace(/&quot;/g, '"').trim();
            }
            o = o.replace(/\s*（\d+\.\d+分）$/, '');
            o = o.replace(/【.+题】/g, "").trim();
            o = o.replace(/^\d+[\.、]/,'');
            var n = encodeURIComponent(o);
            var l = {
                question: n
            };

            var p = $(h).find(".Py_answer.clearfix span:first").text().trim();
            var j = "";
            if (p.indexOf("正确答案") != -1) {
                var m = p.replace(/正确答案：\s*/, "");
                if (m == "√") {
                    p = "正确";
                } else {
                    if (m == "×") {
                        p = "错误";
                    } else {
                        var g = m.split("");
                        p = "";
                        for (var k = 0; k < g.length; k++) {
                            $(h).find(".Zy_ulTop li").each(function() {
                                if ($(this).find("i").text().trim().substring(0, 1) == g[k]) {
                                    var q = $(this).find("div.clearfix").text().trim();
                                    p += q;
                                    if (q == "") {
                                        var i = $(this).find("a").text().trim();
                                        if ($(this).find("a img").size() > 0) {
                                            i = $(this).find("a").html();
                                            i = i.replace(/<(?!img).*?>/g, "");
                                            i = i.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, '<img src="$1">');
                                            i = i.replace(/&amp;/g, "&");
                                            i = i.replace(/&#39;/g, "'");
                                            i = i.replace(/&quot;/g, '"');
                                        }
                                        p += i;
                                    }
                                    if (k < g.length - 1) {
                                        p += "#";
                                    }
                                }
                            });
                        }
                    }
                }
            } else {
                if ($(h).find(".Py_answer.clearfix i.fr").size() > 0) {
                    var m = p.replace(/我的答案：\s*/, "");
                    if ($(h).find(".Py_answer.clearfix i.fr.dui").size() > 0) {
                        if (m == "√") {
                            p = "正确";
                        } else {
                            if (m == "×") {
                                p = "错误";
                            } else {
                                var g = m.split("");
                                p = "";
                                for (var k = 0; k < g.length; k++) {
                                    $(h).find(".Zy_ulTop li").each(function() {
                                        if ($(this).find("i").text().trim().substring(0, 1) == g[k]) {
                                            var i = $(this).find("a").text().trim();
                                            if ($(this).find("a img").size() > 0) {
                                                i = $(this).find("a").html();
                                                i = i.replace(/<(?!img).*?>/g, "");
                                                i = i.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, '<img src="$1">');
                                                i = i.replace(/&amp;/g, "&");
                                                i = i.replace(/&#39;/g, "'");
                                                i = i.replace(/&quot;/g, '"');
                                            }
                                            p += i;
                                            if (k < g.length - 1) {
                                                p += "#";
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        if (!p) {
                            var f = $(h).find(".Py_answer.clearfix div.clearfix i.fr.dui");
                            f.each(function(i, q) {
                                j += $(this).parent().text().trim();
                                if (i < f.size() - 1) {
                                    j += "#";
                                }
                            });
                            j = j.replace(/我的答案：\s*/, "").replace(/\n+/g, "").replace(/\t+/g, "").replace(/\s+/g, " ");
                        }
                    } else {
                        if ($(h).find(".Py_answer.clearfix i.fr.cuo").size() > 0) {
                            if (m == "√") {
                                p = "错误";
                            } else {
                                if (m == "×") {
                                    p = "正确";
                                }
                            }
                        }
                    }
                } else {
                    $("#toNext1").text("未检测到显示正确答案的作业暂停收录。直接转入下一集");
                    a.sbchaoxing.goNext();
                    return;
                }
            }
            if (p.indexOf("我的答案") == -1) {
                l.answer = p;
                if (!p) {
                    l.answer = j;
                    p = j;
                }
                $.ajax({
                    url: a.sbchaoxing.staticRemoteHost ,
                    type: "POST",
                    data: l,
                    async: true,
                    timeout: 60000,
                    dataType:"json",
                    success: function(msg) {
                        code = msg.code;
                        var q;
                        if (code == "1") {
                            q = "新增";
                        } else if(code == "2"){
                            q = "更新"
                        }
                        else{
                            q = "目前该答案格式无法录入"
                        }
                        $("#antable").append("<tr><td style='overflow:hidden;'>" + o + "</td><td>" + p + "-" + q + "</td></tr>");
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        // alert("请求对象XMLHttpRequest: "+XMLHttpRequest);
                        // alert("错误类型textStatus: "+textStatus);
                        // alert("异常对象errorThrown: "+errorThrown);
                        $("#antable").append("<tr><td style='overflow:hidden;'>" + o + "</td><td>" + p + "-服务器炸了...</td></tr>");
                    }
                });
            } else {
                $("#antable").append("<tr><td style='overflow:hidden;'>" + o + "</td><td>" + p + "-错误答案不收录</td></tr>");
            }
            if (c >= b) {
                window.clearInterval(d);
                $("#toNext1").text("收录完毕，感谢您的支持!");
                a.sbchaoxing.goNext();
            }
            c++;
        },
        100);
    if (top.chrome.sbchaoxing) {
        top.chrome.sbchaoxing.removeAnyone();
    }
})();
}
function getIframe(tip, win, job) {
  if (!$)
    return (
      Ext.get(frameElement || [])
        .parent()
        .child(".ans-job-icon") || Ext.get([])
    );
  do {
    win = win ? win.parent : _self;
    job = $(win.frameElement).prevAll(".ans-job-icon");
  } while (!job.length && win.parent.frameElement);
  return tip ? win : job;
}

function jobSort($) {
  var fn = $.fn ? [getIframe(1), "length"] : [self, "dom"],
    sel = setting.job.join(
      ", :not(.ans-job-finished) > .ans-job-icon" + setting.normal + " ~ "
    );
  if ($(sel, fn[0].parent.document)[0] == fn[0].frameElement) return true;
  if (!getIframe()[fn[1]] || getIframe().parent().is(".ans-job-finished"))
    return null;
  setInterval(function () {
    $(sel, fn[0].parent.document)[0] == fn[0].frameElement &&
      fn[0].location.reload();
  }, setting.time);
}

function checkPlayer(tip) {
  _self.videojs = hookVideo;
  hookVideo.xhr = vjs.xhr;
  Ext.isSogou = Ext.isIos = Ext.isAndroid = false;
  var data = Ext.decode(_self.config("data")) || {};
  delete data.danmaku;
  data.doublespeed = 1;
  frameElement.setAttribute("data", Ext.encode(data));
  if (tip) return;
  _self.supportH5Video = function () {
    return true;
  };
  alert("此浏览器不支持html5播放器，请更换浏览器");
}

function hookVideo() {
  _self.alert = console.log;
  var config = arguments[1],
    line =
      Ext.Array.filter(
        Ext.Array.map(config.playlines, function (value, index) {
          return value.label == setting.line && index;
        }),
        function (value) {
          return Ext.isNumber(value);
        }
      )[0] || 0,
    http = Ext.Array.filter(config.sources, function (value) {
      return value.label == setting.http;
    })[0];
  config.playlines.unshift(config.playlines[line]);
  config.playlines.splice(line + 1, 1);
  config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
  config.plugins.studyControl.enableSwitchWindow = 1;
  config.plugins.timelineObjects.url = "/richvideo/initdatawithviewer?";
  config.plugins.seekBarControl.enableFastForward = 1;
  if (!setting.queue) delete config.plugins.studyControl;
  // config.preload = setting.tip ? 'auto' : 'none';
  var player = vjs.apply(this, arguments),
    a =
      '<a href="https://d0.ananas.chaoxing.com/download/' +
      _self.config("objectid") +
      '" target="_blank">',
    img =
      '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
  player.volume(Math.round(setting.vol) / 100 || 0);
  Ext.get(player.controlBar.addChild("Button").el_).setHTML(
    a + img + "</a>"
  ).dom.title = "下载视频";
  player.on("loadstart", function () {
    setting.tip && this.play().catch(Ext.emptyFn);
    this.playbackRate(
      setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate
    );
  });
  player.one(["loadedmetadata", "firstplay"], function () {
    setting.two = setting.rate === "0" && setting.two < 1;
    setting.two &&
      config.plugins.seekBarControl.sendLog(
        this.children_[0],
        "ended",
        Math.floor(this.cache_.duration)
      );
  });
  player.on("ended", function () {
    Ext.fly(frameElement).parent().addCls("ans-job-finished");
  });
  return player;
}

function hookAudio() {
  _self.alert = console.log;
  var config = arguments[1];
  config.plugins.studyControl.enableSwitchWindow = 1;
  config.plugins.seekBarControl.enableFastForward = 1;
  if (!setting.queue) delete config.plugins.studyControl;
  var player = vjs.apply(this, arguments),
    a =
      '<a href="https://d0.ananas.chaoxing.com/download/' +
      _self.config("objectid") +
      '" target="_blank">',
    img =
      '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
  player.volume(Math.round(setting.vol) / 100 || 0);
  player.playbackRate(
    setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate
  );
  Ext.get(player.controlBar.addChild("Button").el_).setHTML(
    a + img + "</a>"
  ).dom.title = "下载音频";
  player.on("loadeddata", function () {
    setting.tip && this.play().catch(Ext.emptyFn);
  });
  player.one("firstplay", function () {
    setting.rate === "0" &&
      config.plugins.seekBarControl.sendLog(
        this.children_[0],
        "ended",
        Math.floor(this.cache_.duration)
      );
  });
  player.on("ended", function () {
    Ext.fly(frameElement).parent().addCls("ans-job-finished");
  });
  return player;
}

function relieveLimit() {
  if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
  $.each(UE.instants, function () {
    var key = this.key;
    this.ready(function () {
      this.destroy();
      UE.getEditor(key);
    });
  });
}

function beforeFind() {
  setting.regl = parent.greenligth || $.noop;
  if ($.type(parent._data) == "array") return setting.regl();
  setting.div = $(
    '<div style="border: 2px dashed rgb(149, 252, 251); width: 380px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(184, 247, 255, 0.3); overflow-x: auto;">' +
      '<span style="font-size: medium;"></span>' +
      '<div style="font-size: medium;">正在搜索答案...</div>' +
      '<button style="margin-right: 10px;">暂停答题</button>' +
      '<button style="margin-right: 10px;">' +
      (setting.auto ? "取消本次自动提交" : "开启本次自动提交") +
      "</button>" +
      '<button style="margin-right: 10px;">重新查询</button>' +
      "<button style='margin-right: 10px'>折叠面板</button>" +
      "<button><a href='https://s1.ax1x.com/2020/05/22/YLBogx.png' target='_blank' style='text-decoration: none;color:black;'>考试版本</a></button>" +
      '<div style="max-height: 300px; overflow-y: auto;">' +
      '<table border="1" style="font-size: 12px;">' +
      "<thead>" +
      "<tr>" +
      '<th style="width: 25px; min-width: 25px;">题号</th>' +
      '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
      '<th style="min-width: 130px;">答案（点击可复制）</th>' +
      "</tr>" +
      "</thead>" +
      '<tfoot style="display: none;">' +
      "<tr>" +
      '<th colspan="3">答案提示框 已折叠</th>' +
      "</tr>" +
      "</tfoot>" +
      "<tbody>" +
      "<tr>" +
      '<td colspan="3" style="display: none;"></td>' +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>"
  )
    .appendTo("body")
    .on("click", "button, td", function () {
      var len = $(this).prevAll("button").length;
      if (this.nodeName == "TD") {
        $(this).prev().length && GM_setClipboard($(this).text());
      } else if (!$(this).siblings().length) {
        $(this).parent().text("正在搜索答案...");
        setting.num++;
      } else if (len === 0) {
        if (setting.loop) {
          clearInterval(setting.loop);
          delete setting.loop;
          len = ["已暂停搜索", "继续答题"];
        } else {
          setting.loop = setInterval(findAnswer, setting.time);
          len = ["正在搜索答案...", "暂停答题"];
        }
        setting.div
          .children("div:eq(0)")
          .html(function () {
            return $(this).data("html") || len[0];
          })
          .removeData("html");
        $(this).html(len[1]);
      } else if (len == 1) {
        setting.auto = !setting.auto;
        $(this).html(setting.auto ? "取消本次自动提交" : "开启本次自动提交");
      } else if (len == 2) {
        parent.location.reload();
      } else if (len == 3) {
        setting.div.find("tbody, tfoot").toggle();
      }
    })
    .find("table, td, th")
    .css("border", "1px solid")
    .end();
  setting.lose = setting.num = 0;
  setting.data = parent._data = [];
  setting.over = '<button style="margin-right: 10px;">跳过此题</button>';
  setting.curs =
    $("script:contains(courseName)", top.document)
      .text()
      .match(/courseName:\'(.+?)\'|$/)[1] ||
    $("h1").text().trim() ||
    "无";
  setting.loop = setInterval(findAnswer, setting.time);
  var tip = { undefined: "任务点排队中", null: "等待切换中" }[setting.tip];
  tip &&
    setting.div
      .children("div:eq(0)")
      .data("html", tip)
      .siblings("button:eq(0)")
      .click();
}

function findAnswer() {
    if (setting.num >= $('.TiMu').length) {
        var arr = setting.lose ? ['共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）', saveThis] : ['答题已完成<a href="http://vip.loveyouzhi.top/images/1.png" target="_blank">&nbsp;一个查题功能很完善的号</a>', submitThis];
        setting.div.children('div:eq(0)').data('html', arr[0]).siblings('button:eq(0)').hide().click();
        return setTimeout(arr[1], setting.time);
    }
    var $TiMu = $('.TiMu').eq(setting.num),
        question = filterImg($TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[\.、]/,''),
        type = $TiMu.find('input[name^=answertype]:eq(0)').val() || '-1';
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://qs.nnarea.cn/chaoxing_war/topicServlet?action=query&q=' + encodeURIComponent(question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&type=' + type + '&id=' + ($('#workLibraryId').val() || $('#oldWorkId').val()),
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                if (true){
                    //var a = document.createElement('a');
                    //var href = "http://vip.loveyouzhi.top/images/1.png"
                    //a.setAttribute('href', href);
                    setting.div.children('div:eq(0)').text('正在搜索答案');
                    //setting.div.children('div:eq(0)').appendChild(a);
                    console.log(obj.data)
                    var td = '<td style="border: 1px solid;',
                        data = String(obj.data).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.data = /^http/.test(data) ? '<img src="' + obj.data + '">' : obj.data;
                    $(
                        '<tr>' +
                        td + ' text-align: center;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        td + '" title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + (/^http/.test(data) ? obj.data : '') + data + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', fillAnswer($TiMu.find('ul:eq(0)').find('li'), obj, type) ? '' : 'rgba(99, 215, 247, 0.6)');
                    setting.data[setting.num++] = {
                        code: obj.code > 0 ? 1 : 0,
                        question: question,
                        option: obj.data,
                        type: Number(type)
                    };
                } else {
                    setting.div.children('div:eq(0)').html(obj.data || setting.over + '服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj || '');
            } else if (xhr.status == 403) {
                var html = xhr.responseText.indexOf('{') ? '请求过于频繁，建议稍后再试' : $.parseJSON(xhr.responseText).data;
                setting.div.children('div:eq(0)').data('html', html).siblings('button:eq(0)').click();
            } else {
                setting.div.children('div:eq(0)').html(setting.over + '服务器异常，正在重试...');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试...');
        }
    });
}

function fillAnswer($li, obj, type) {
    var $input = $li.find(':radio, :checkbox'),
        str = String(obj.data).toCDB() || new Date().toString(),
        data = str.split(/#|\x01|\|/),
        opt = obj.opt || str,
        state = setting.lose;
    // $li.find(':radio:checked').prop('checked', false);
    true && $input.each(function(index) {
        if (this.value == 'true') {
            data.join().match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/) && this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|wr|false|wrong)(,|$)/) && this.click();
        } else {
            var tip = filterImg($li.eq(index).find('.after')).toCDB() || new Date().toString();
            Boolean($.inArray(tip, data) + 1 || (type == '1' && str.indexOf(tip) + 1)) == this.checked || this.click();
        }
    }).each(function() {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this.checked || this.click();
    });
    if (type.match(/^[013]$/)) {
        $input.is(':checked') || (setting.none ? ($input[Math.floor(Math.random() * $input.length)] || $()).click() : setting.lose++);
    } else if (type.match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.data).split(/#|\x01|\|/);
        opt = $li.end().find('textarea').each(function(index) {
            index = (true > 0 && data[index]) || (setting.none ? '不会' : '');
            UE.getEditor(this.name).setContent(index.trim());
        }).length;
        (1 && data.length == opt) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    //if(state != setting.lose)
    //{
   //     location.reload();
    //}
    //else
    //{
        return state == setting.lose;
    //}
}
function submitThis() {
  if (!setting.auto) {
  } else if (!$(".Btn_blue_1:visible").length) {
    setting.div.children("button:lt(3)").hide().eq(1).click();
    return setting.regl();
  } else if ($("#confirmSubWin:visible").length) {
    var btn = $("#tipContent + * > a").offset() || { top: 0, left: 0 },
      mouse = document.createEvent("MouseEvents");
    btn = [
      btn.left + Math.ceil(Math.random() * 46),
      btn.top + Math.ceil(Math.random() * 26),
    ];
    mouse.initMouseEvent(
      "click",
      true,
      true,
      document.defaultView,
      0,
      0,
      0,
      btn[0],
      btn[1],
      false,
      false,
      false,
      false,
      0,
      null
    );
    _self.event = $.extend(true, {}, mouse);
    delete _self.event.isTrusted;
    _self.form1submit();
  } else {
    $(".Btn_blue_1")[0].click();
  }
  setTimeout(submitThis, Math.ceil(setting.time * Math.random()) * 2);
}

function checkToNext() {
  var $tip = $(setting.job.join(", "), document).prevAll(
    ".ans-job-icon" + setting.normal
  );
  setInterval(function () {
    $tip.parent(":not(.ans-job-finished)").length || (setting.jump && toNext());
  }, setting.time);
}

function toNext() {
  var $cur = $("#cur" + $("#chapterIdid").val()),
    $tip = $("span.currents ~ span"),
    sel = setting.review ? "html" : ".blue";
  if (!$cur.has(sel).length && $tip.length) return $tip.eq(0).click();
  $tip = $(".roundpointStudent, .roundpoint").parent();
  $tip = $tip.slice($tip.index($cur) + 1).not(":has(" + sel + ")");
  $tip
    .not(setting.lock ? ":has(.lock)" : "html")
    .find("span")
    .eq(0)
    .click();
  $tip.length || (setting.course && switchCourse());
}

function switchCourse() {
  GM_xmlhttpRequest({
    method: "GET",
    url: "/visit/courses/study?isAjax=true&fileId=0&debug=",
    headers: {
      Referer: location.origin + "/visit/courses",
      "X-Requested-With": "XMLHttpRequest",
    },
    onload: function (xhr) {
      var list = $("h3 a[target]", xhr.responseText).map(function () {
          return $(this).attr("href");
        }),
        index =
          list
            .map(function (index) {
              return this.match(top.courseId) && index;
            })
            .filter(function () {
              return $.isNumeric(this);
            })[0] + 1 || 0;
      setting.course = list[index] ? goCourse(list[index]) : 0;
    },
  });
}

function goCourse(url) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function (xhr) {
      $.globalEval(
        'location.href = "' +
          $(".articlename a[href]", xhr.responseText).attr("href") +
          '";'
      );
    },
  });
}

function autoRead() {
  $("html, body")
    .animate(
      {
        scrollTop: $(document).height() - $(window).height(),
      },
      Math.round(setting.read) * 1e3,
      function () {
        $(".nodeItem.r i").click();
      }
    )
    .one("click", "#top", function (event) {
      $(event.delegateTarget).stop();
    });
}

function DisplayURL() {
  _self.WAY.box.hide();
  var $li = $(this).closest("li");
  $.get(
    "/visit/goToCourseByFace",
    {
      courseId: $li.find("input[name=courseId]").val(),
      clazzId: $li.find("input[name=classId]").val(),
    },
    function (data) {
      $li
        .find("[onclick^=openFaceTip]")
        .removeAttr("onclick")
        .attr({
          target: "_blank",
          href: $(data)
            .filter("script:last")
            .text()
            .match(/n\("(.+?)"/)[1],
        });
      alert("本课程已临时解除面部识别");
    },
    "html"
  );
}

function getSchoolId() {
  var school = /^1\d{10}$/.test(setting.username) ? "" : setting.school;
  if (!isNaN(school)) return setTimeout(toLogin, setting.time, school);
  if (school == "账号为手机号可以不修改此参数")
    return alert("请修改school参数");
  $.getJSON(
    "/org/searchUnis?filter=" + encodeURI(school) + "&product=44",
    function (data) {
      if (!data.result) return alert("学校查询错误");
      var msg = $.grep(data.froms, function (value) {
        return value.name == school;
      })[0];
      msg
        ? setTimeout(toLogin, setting.time, msg.schoolid)
        : alert("学校名称不完整");
    }
  );
}

function toLogin(fid) {
  GM_xmlhttpRequest({
    method: "GET",
    url:
      "/api/login?name=" +
      setting.username +
      "&pwd=" +
      setting.password +
      "&schoolid=" +
      fid +
      "&verify=0",
    onload: function (xhr) {
      var obj = $.parseJSON(xhr.responseText) || {};
      obj.result
        ? (location.href = decodeURIComponent($("#ref, #refer_0x001").val()))
        : alert(obj.errorMsg || "Error");
    },
  });
}

function submitAnswer($job, data) {
    $job.removeClass('ans-job-finished');
    data = data.length ? $(data) : $('.TiMu').map(function() {
        var title = filterImg($('.Zy_TItle .clearfix', this));
        return {
            question: title.replace(/^【.*?】\s*/, ''),
            type: ({单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3})[title.match(/^【(.*?)】|$/)[1]]
        };
    });
    data = $.grep(data.map(function(index) {
        var $TiMu = $('.TiMu').eq(index);
        if (!($.isPlainObject(this) && this.type < 4 && $TiMu.find('.fr').length)) {
            return false;
        } else if (this.type == 2) {
            var $ans = $TiMu.find('.Py_tk, .Py_answer').eq(0);
            if (!$TiMu.find('.cuo').length && this.code) {
                return false;
            } else if (!$ans.find('.cuo').length) {
                this.option = $ans.find('.clearfix').map(function() {
                    return $(this).text().trim();
                }).get().join('#') || '无';
            } else if (this.code) {
                this.code = -1;
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var ans = $TiMu.find('.font20:last').text();
            if ($TiMu.find('.cuo').length) {
                this.option = ({'√': '错误', '×': '正确'})[ans] || '无';
            } else if (!this.code) {
                this.option = ({'√': '正确', '×': '错误'})[ans] || '无';
            } else {
                return false;
            }
        } else {
            var text = $TiMu.find('.Py_answer > span:eq(0)').text();
            if ($TiMu.find('.dui').length && this.code && !/^A?B?C?D?E?F?G?$/.test(this.option)) {
                return false;
            } else if ($TiMu.find('.dui').length || text.match('正确答案')) {
                text = text.match(/[A-G]/gi) || [];
                this.option = $.map(text, function(value) {
                    return filterImg($TiMu.find('.fl:contains(' + value + ') + a'));
                }).join('#') || '无';
                this.key = text.join('');
            } else if (this.code) {
                this.code = -1;
            } else {
                return false;
            }
        }
        return this;
    }), function(value) {
        return value && value.option != '无';
    });
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://rebengonline.com.cn:8080/chaoxing_war/topicServlet?action=query&q=',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&data=' + encodeURIComponent((Ext.encode || JSON.stringify)(data)) + '&id=' + $('#jobid').val().slice(5)
    });
    $job.addClass('ans-job-finished');
}

function filterImg(dom) {
  return $(dom)
    .clone()
    .find("img[src]")
    .replaceWith(function () {
      return $("<p></p>").text('<img src="' + $(this).attr("src") + '">');
    })
    .end()
    .find("iframe[src]")
    .replaceWith(function () {
      return $("<p></p>").text(
        '<iframe src="' + $(this).attr("src") + '"></irame>'
      );
    })
    .end()
    .text()
    .trim();
}