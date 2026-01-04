// ==UserScript==
// @name         kda智慧树助手
// @namespace    qackqi & Stars
// @version      1.1.8
// @description  自动挂机看尔雅MOOC、智慧树MOOC，支持视频、音频、文档、图书自动完成，章节测验自动答题提交，支持自动切换任务点、挂机阅读时长、自动登录等，解除各类功能限制，开放自定义参数。
// @author       t
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.zhihuishu.com/*
// @run-at       document-end
// @connect      onlinecoursekiller.online
// @connect      bigdata.receive.plugin.xuanke.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418277/kda%E6%99%BA%E6%85%A7%E6%A0%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418277/kda%E6%99%BA%E6%85%A7%E6%A0%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3, // 默认响应速度为6秒，不建议小于6秒|后台有检测机制，请求频率过快会封ip
    review: 0, // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频，默认关闭
    queue: 1, // 队列模式，开启后任务点逐一完成，关闭则单页面所有任务点同时进行，默认开启
    token: '',//关注公众号获取token可以使用定制功能，更精准的匹配答案，此处填公众号获取的token
    submit: 1, //答案收录，开启后可在作业完成界面自动收录题目，默认开启

    // 1代表开启，0代表关闭
    video: 1, // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    work: 1, // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率，默认开启
    audio: 1, // 音频自动播放，与视频功能共享vol和rate参数，默认开启
    book: 1, // 图书阅读任务点，非课程阅读任务点，默认开启
    docs: 1, // 文档阅读任务点，PPT类任务点自动完成阅读任务，默认开启

    // 本区域参数，上方为任务点功能，下方为独立功能
    jump: 1, // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    read: '10', // 挂机课程阅读时间，单位是分钟，'65'代表挂机65分钟，请手动打开阅读页面，默认'10'分钟
    face: 0, // 解除面部识别(不支持二维码类面部采集)，此功能仅为临时解除，默认关闭
    total: 1, // 显示课程进度的统计数据，在学习进度页面的上方展示，默认关闭

    // 仅开启video(audio)时，修改此处才会生效
    line: '公网1' || '流畅', // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    http: '标清', // 视频播放的默认清晰度，无效参数则使用系统默认清晰度，默认'标清'
    habit: '0', // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制
    speed: '1.5', // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
    que: 1, // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
    danmu: 0, // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭

    // 本区域参数，上方为video功能独享，下方为audio功能共享
    vol: '0', // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    rate: '1', // 视频播放默认倍率，参数范围0∪[0.0625,16]，'0'为秒过，默认'1'倍

    // 仅开启work时，修改此处才会生效
    auto: 1, // 答题完成后自动提交，默认关闭 改为1开启
    none: 0, // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会暂时保存已作答的题目，默认开启
    scale: 0, // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
    hide: 0, // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭

    // 仅开启jump时，修改此处才会生效
    course: 0, // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，默认关闭
    lock: 1, // 跳过未开放(图标是锁)的章节，即闯关模式或定时发放的任务点，默认开启

    // 自动登录功能配置区
    school: '账号为手机号可以不修改此参数', // 学校/单位/机构码，要求完整有效可查询，例如'清华大学'
    username: '', // 学号/工号/借书证号(邮箱/手机号/账号)，例如'2018010101'，默认''
    password: '', // 密码，例如'123456'，默认''
},
    _self = unsafeWindow,
    url = location.pathname,
    top = _self,
    parent = _self == top ? self : _self.parent,
    Ext = _self.Ext || parent.Ext || {},
    UE = _self.UE,
    vjs = _self.videojs,
    xhr = _self.XMLHttpRequest,
    kdaurl = "http://bigdata.receive.plugin.xuanke.com/api/plugin",
    maxIndex = 0

if (url != '/studyApp/studying' && top != _self.top && !(location.host.match('yuketang') || location.host.match('xuetangx'))) document.domain = location.host.replace(/.+?\./, '');

try {
    while (top != _self.top) {
        top = top.parent.document ? top.parent : _self.top;
        if (top.location.pathname == '/mycourse/studentstudy') break;
    }
} catch (err) {
    top = _self;
}

String.prototype.toCDB = function() {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};
var $$ = _self.jQuery || top.jQuery;

$(document).keydown(function(event) {
    if (event.keyCode == 38) {
        setting.div.detach();
    } else if (event.keyCode == 40) {
        setting.div.appendTo('body');
    }
});

setting.normal = '';
setting.queue = setting.curs = [];
setting.job = [':not(*)'];
setting.video && setting.job.push('iframe[src*="/video/index.html"]');
setting.work && setting.job.push('iframe[src*="/work/index.html"]');
setting.audio && setting.job.push('iframe[src*="/audio/index.html"]');
setting.book && setting.job.push('iframe[src*="/innerbook/index.html"]');
setting.docs && setting.job.push('iframe[src*="/ppt/index.html"]', 'iframe[src*="/pdf/index.html"]');
setting.tip = !setting.queue || top != _self && jobSort($$ || Ext.query);

if (url == '/mycourse/studentstudy') {
    _self.checkMobileBrowerLearn = $$.noop;
    var classId = location.search.match(/cla[zs]{2}id=(\d+)/i)[1] || 0,
        courseId = _self.courseId || location.search.match(/courseId=(\d+)/i)[1] || 0;
    setting.lock || $$('#coursetree').on('click', '[onclick*=void], [href*=void]', function() {
        _self.getTeacherAjax(courseId, classId, $$(this).parent().attr('id').slice(3));
    });
} else if (url == '/ananas/modules/video/index.html' && setting.video) {
    if (setting.review) _self.greenligth = Ext.emptyFn;
    checkPlayer(_self.supportH5Video());
} else if (url == '/work/doHomeWorkNew' || url == '/api/work' || url == '/work/addStudentWorkNewWeb') {
    if (!UE) {
        var len = ($$ || Ext.query || Array)('font:contains(未登录)', document).length;
        setTimeout(len == 1 ? top.location.reload : parent.greenligth, setting.time);
    } else if (setting.work) {
        setTimeout(relieveLimit, 0);
        beforeFind();
    }
} else if (url == '/ananas/modules/audio/index.html' && setting.audio) {
    if (setting.review) _self.greenligth = Ext.emptyFn;
    _self.videojs = hookAudio;
    hookAudio.xhr = vjs.xhr;
} else if (url == '/ananas/modules/innerbook/index.html' && setting.book && setting.tip) {
    setTimeout(function() {
        _self.setting ? _self.top.onchangepage(_self.getFrameAttr('end')) : _self.greenligth();
    }, setting.time);
} else if (url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$$/) && setting.docs && setting.tip) {
    setTimeout(function() {
        _self.setting ? _self.finishJob() : _self.greenligth();
    }, setting.time);
    frameElement.setAttribute('download', 1);
} else if (url == '/knowledge/cards') {
    $$ && checkToNext();
} else if (url.match(/^\/(course|zt)\/\d+\.html$$/)) {
    setTimeout(function() {
        +setting.read && _self.sendLogs && $$('.course_section:eq(0) .chapterText').click();
    }, setting.time);
} else if (url == '/ztnodedetailcontroller/visitnodedetail') {
    setting.read *= 60 / $$('.course_section').length;
    setting.read && _self.sendLogs && autoRead();
} else if (url == '/mycourse/studentcourse') {
    var gv = location.search.match(/d=\d+&/g);
    setting.total && $$('<a>', {
        href: '/moocAnalysis/chapterStatisticByUser?classI' + gv[1] + 'courseI' + gv[0] + 'userId=' + _self.getCookie('_uid') + '&ut=s',
        target: '_blank',
        title: '点击查看章节统计',
        style: 'margin: 0 25px;',
        html: '本课程共' + $$('.icon').length + '节，剩余' + $$('em:not(.openlock)').length + '节未完成'
    }).appendTo('.zt_logo').parent().width('auto');
} else if (url.match(/^\/visit\/(courses|interaction)$$/)) {
    setting.face && $$('.zmodel').on('click', '[onclick^=openFaceTip]', DisplayURL);
} else if (location.host.match(/^passport2/)) {
    setting.username && getSchoolId();
} else if (location.hostname == 'i.mooc.chaoxing.com') {
    _self.layui.use('layer', function() {
        this.layer.open({content: '拖动进度条、倍速播放、秒过可能会导致不良记录！', title: '网课助手提示', btn: '我已知悉', offset: 't', closeBtn: 0});
    });
} else if (url == '/widget/pcvote/goStudentVotePage') {
    $$(':checked').click();
    $$('.StudentTimu').each(function(index) {
        var ans = _self.questionlist[index].answer;
        $$(':radio, :checkbox', this).each(function(num) {
            ans[num].isanswer && this.click();
        });
        $$(':text', this).val(function(num) {
            return $$(ans[num].content).text().trim();
        });
    });
} else if (url == '/work/selectWorkQuestionYiPiYue') {
    submitAnswer(getIframe().parent(), $.extend(true, [], parent._data));
} else if (url.match('/videoList')) {
    $$.tmDialog.alert({content: '2.X版本已取消支持旧版界面', title: '智慧树网课助手提示'});
} else if (url == '/videoStudy.html') {
    setting.habit *= 6E4;
    setting.video && ZHShookVideo(_self.vjsComponent, 1);
    setting.jump && setInterval(ZHScheckToNext, setting.time);
} else if (url == '/portals_h5/2clearning.html') {
    setting.video && ZHShookVideo(_self.vjsComponent, 2);
    setting.jump && setInterval(ZHScheckToNext, setting.time);
} else if (url == '/live/vod_room.html') {
    setting.video && ZHShookVideo(_self.vjsComponent);
    setting.jump && setInterval(ZHScheckToNext, setting.time, 1);
} else if (location.hostname.match('examh5')) {
    setTimeout(ZHSrelieveLimit, 100, document);
    if (location.hash.match(/dohomework|doexamination/) && setting.work) ZHSbeforeFind();
    $$(window).on('hashchange', function() {
        setting.work && location.reload();
    });
} else if (url.match('/sourceLearning')) {
    setting.video && ZHShookVideo(_self.vjsComponent, 3);
    setting.jump && setInterval(ZHScheckToNext, setting.time, $$('.source-file-item'));
} else if (url == '/shareCourse/questionDetailPage') {
    setTimeout(ZHSrelieveLimit, 100, document);
    $$('textarea[oncut]').each(function() {
        setTimeout(ZHSrelieveLimit, 100, this);
    });
} else if (url.match('exerciseList') && setting.work) {
    _self.XMLHttpRequest = hookHiexam;
    setInterval(function() {
        $$(setting.queue.shift()).parent().click();
    }, 1E3);
    setting.jump && setInterval(function() {
        setting.queue.length || $$('.Topicswitchingbtn:contains(下一题)').click();
    }, setting.time);
}

if(location.hash.match(/webExamList\/checkHomework/)) {
    setTimeout(getFinishedData,5000)
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
        '<div style="border: 2px dashed rgb(149, 252, 251); width: 420px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(184, 247, 255, 0.3); overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="font-size: medium;">正在搜索答案...</div>' +
        '<button style="margin-right: 10px;">暂停答题</button>' +
        '<button style="margin-right: 10px;">' +
        (setting.auto ? "取消本次自动提交" : "开启本次自动提交") +
        "</button>" +
        '<button style="margin-right: 10px;">重新查询</button>' +
        "<button style='margin-right: 10px'>折叠面板</button>" +
        "<button><a href='https://greasyfork.org/zh-CN/scripts/401897' target='_blank' style='text-decoration: none;color:black;'>考试版本</a></button>" +
        "<button style='margin-top:5px'><a href='https://qackqi.cn/token' target='_blank' style='text-decoration: none;color:black;'>免费获取Token [ 授权码 ]</a></button>" +
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
    var url;
    url = "http://qackqi.cn/OnlineCourseBot/topic";
    if (setting.num >= $('.TiMu').length) {
        var arr = setting.lose ? ['共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）', saveThis] : ['答题已完成&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://s1.ax1x.com/2020/07/08/UVudBj.png" target="_blank">公众号查题[涵盖多平台题库]</a>', submitThis];
        setting.div.children('div:eq(0)').data('html', arr[0]).siblings('button:eq(0)').hide().click();
        return setTimeout(arr[1], setting.time);
    }
    var $TiMu = $('.TiMu').eq(setting.num),
        question = filterImg($TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[\.、]/,''),
        type = $TiMu.find('input[name^=answertype]:eq(0)').val() || '-1';
    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'q=' + encodeURIComponent(question) + "&token=" + setting.token,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                if (true){
                    //var a = document.createElement('a');
                    //var href = "https://open.weixin.qq.com/qr/code?username=gh_b007ef230e12"
                    //a.setAttribute('href', href);
                    setting.div.children('div:eq(0)').text('正在搜索答案');
                    //setting.div.children('div:eq(0)').appendChild(a);
                    var td = '<td style="border: 1px solid;',
                        data = String(obj.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.answer = /^http/.test(data) ? '<img src="' + obj.answer + '">' : obj.answer;
                    $(
                        '<tr>' +
                        td + ' text-align: center;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        td + '" title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + (/^http/.test(data) ? obj.answer : '') + data + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', fillAnswer($TiMu.find('ul:eq(0)').find('li'), obj, type) ? '' : 'rgba(99, 215, 247, 0.6)');
                    setting.data[setting.num++] = {
                        code: obj.code > 0 ? 1 : 1,
                        question: question,
                        option: obj.answer,
                        type: Number(type)
                    };


                } else {
                    setting.div.children('div:eq(0)').html(obj.answer || setting.over + '服务器繁忙，正在重试...');
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
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试...或使用token更换服务器');
        }
    });
}

function fillAnswer($li, obj, type) {

    var $input = $li.find(':radio, :checkbox'),
        str = String(obj.answer).toCDB() || new Date().toString(),
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
        data = String(obj.answer).split(/#|\x01|\|/);
        opt = $li.end().find('textarea').each(function(index) {
            index = (true > 0 && data[index]) || (setting.none ? '不会' : '');
            if(obj.success == "true")
            {
                UE.getEditor(this.name).setContent(index.trim());
            }
        }).length;
        (1 && data.length == opt) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}

function saveThis() {
    if (!setting.auto) return setTimeout(saveThis, setting.time);
    setting.div.children('button:lt(3)').hide().eq(1).click();
    _self.alert = console.log;
    $$('#tempsave').click();
    setting.regl();
}

function submitThis() {
    if (!setting.auto) {
    } else if (!$$('.Btn_blue_1:visible').length) {
        setting.div.children('button:lt(3)').hide().eq(1).click();
        return setting.regl();
    } else if ($$('#confirmSubWin:visible').length) {
        var btn = $$('#tipContent + * > a').offset() || {top: 0, left: 0},
            mouse = document.createEvent('MouseEvents');
        btn = [btn.left + Math.ceil(Math.random() * 46), btn.top + Math.ceil(Math.random() * 26)];
        mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, btn[0], btn[1], false, false, false, false, 0, null);
        _self.event = $$.extend(true, {}, mouse);
        delete _self.event.isTrusted;
        _self.form1submit();
    } else {
        $$('.Btn_blue_1')[0].click();
    }
    setTimeout(submitThis, Math.ceil(setting.time * Math.random()) * 2);
}

function checkToNext() {
    var $$tip = $$(setting.job.join(', '), document).prevAll('.ans-job-icon' + setting.normal);
    setInterval(function() {
        $$tip.parent(':not(.ans-job-finished)').length || setting.jump && toNext();
    }, setting.time);
}

function toNext() {
    var $$cur = $$('#cur' + $$('#chapterIdid').val()),
        $$tip = $$('span.currents ~ span'),
        sel = setting.review ? 'html' : '.blue';
    if (!$$cur.has(sel).length && $$tip.length) return $$tip.eq(0).click();
    $$tip = $$('.roundpointStudent, .roundpoint').parent();
    $$tip = $$tip.slice($$tip.index($$cur) + 1).not(':has(' + sel + ')');
    $$tip.not(setting.lock ? ':has(.lock)' : 'html').find('span').eq(0).click();
    $$tip.length || setting.course && switchCourse();
}

function switchCourse() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: '/visit/courses/study?isAjax=true&fileId=0&debug=',
        headers: {
            'Referer': location.origin + '/visit/courses',
            'X-Requested-With': 'XMLHttpRequest'
        },
        onload: function(xhr) {
            var list = $$('h3 a[target]', xhr.responseText).map(function() {
                return $$(this).attr('href');
            }),
                index = list.map(function(index) {
                    return this.match(top.courseId) && index;
                }).filter(function() {
                    return $$.isNumeric(this);
                })[0] + 1 || 0;
            setting.course = list[index] ? goCourse(list[index]) : 0;
        }
    });
}

function goCourse(url) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(xhr) {
            $$.globalEval('location.href = "' + $$('.articlename a[href]', xhr.responseText).attr('href') + '";');
        }
    });
}

function autoRead() {
    $$('html, body').animate({
        scrollTop: $$(document).height() - $$(window).height()
    }, Math.round(setting.read) * 1E3, function() {
        $$('.nodeItem.r i').click();
    }).one('click', '#top', function(event) {
        $$(event.delegateTarget).stop();
    });
}

function DisplayURL() {
    _self.WAY.box.hide();
    var $$li = $$(this).closest('li');
    $$.get('/visit/goToCourseByFace', {
        courseId: $$li.find('input[name=courseId]').val(),
        clazzId: $$li.find('input[name=classId]').val()
    }, function(data) {
        $$li.find('[onclick^=openFaceTip]').removeAttr('onclick').attr({
            target: '_blank',
            href: $$(data).filter('script:last').text().match(/n\("(.+?)"/)[1]
        });
        alert('本课程已临时解除面部识别');
    }, 'html');
}

function getSchoolId() {
    var school = /^1\d{10}$$/.test(setting.username) ? '' : setting.school;
    if (!isNaN(school)) return setTimeout(toLogin, setting.time, school);
    if (school == '账号为手机号可以不修改此参数') return alert('请修改school参数');
    $$.getJSON('/org/searchUnis?filter=' + encodeURI(school) + '&product=44', function(data) {
        if (!data.result) return alert('学校查询错误');
        var msg = $$.grep(data.froms, function(value) {
            return value.name == school;
        })[0];
        msg ? setTimeout(toLogin, setting.time, msg.schoolid) : alert('学校名称不完整');
    });
}

function toLogin(fid) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: '/api/login?name=' + setting.username + '&pwd=' + setting.password + '&schoolid=' + fid + '&verify=0',
        onload: function(xhr) {
            var obj = $$.parseJSON(xhr.responseText) || {};
            obj.result ? location.href = decodeURIComponent($$('#ref, #refer_0x001').val()) : alert(obj.errorMsg || 'Error');
        }
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
        url: 'http://qackqi.cn/OnlineCourseBot/uploadTopic',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&data=' + encodeURIComponent((Ext.encode || JSON.stringify)(data)) + '&id=' + $('#jobid').val().slice(5)
    });
    $job.addClass('ans-job-finished');
}

function filterImg(dom) {
    return $$(dom).clone().find("img[src]").replaceWith(function () {
        return $$("<p></p>").text('<img src="' + $$(this).attr("src") + '">');
    }).end().find("iframe[src]").replaceWith(function () {
        return $$("<p></p>").text('<iframe src="' + $$(this).attr("src") + '"></irame>');
    }).end().text().trim();
}

function ZHShookVideo(Hooks, tip) {
    _self.vjsComponent = function() {
        var config = arguments[0],
            options = config.options,
            line = $$.map(options.sourceSrc.lines, function(value) {
                return value.lineName.replace('标准', '高清');
            }),
            vol = setting.vol > 100 ? 100 : setting.vol,
            rate = tip == 3 ? [1, 1.25, 1.5, 2, 2.5, 3] : [1, 1.25, 1.5];
        vol = Math.round(vol) / 100;
        options.volume = vol > 0 ? vol : 0;
        options.autostart = true;
        setting.speed = setting.speed > 0 ? +setting.speed : 1;
        options.rate = $$.inArray(setting.speed, rate) < 0 ? options.rate : setting.speed;
        tip && config.callback.playbackRate(setting.speed);
        options.chooseLine = $$.inArray(setting.line, line) + 1 || options.chooseLine + 1;
        options.src = options.sourceSrc.lines[--options.chooseLine].lineUrl || options.src;
        if (!setting.danmu) {
            config.defOptions.control.danmuBtn = false;
            delete options.control.danmuBtn;
        }
        Hooks.apply(this, arguments);
        config.player.on('loadstart', function() {
            this.loop(true);
            this.play();
            $$('.speedBox span').text('X ' + setting.speed);
        });
    };
    $$(document).on('click', '.definiLines b', function() {
        setting.line = ({xiaonei: '校内', line1gq: '高清', line1bq: '流畅'})[this.classList[0]];
    }).on('mouseup click', function() {
        setting.vol = _self.PlayerStarter.playerArray[0].player.cache_.volume * 100;
    }).on('click', '.speedList div', function() {
        setting.speed = $$(this).attr('rate');
    });
    if (tip != 1) return;
    setting.tip = setting.habit && setInterval(totalTime, setting.time);
    setInterval(doTest, 1E3);
    _self.XMLHttpRequest = setting.que ? function() {
        var ajax = new xhr(),
            open = ajax.open;
        ajax.open = function(method, url) {
            if (url.match('/loadVideoPointerInfo')) method = 'OPTIONS';
            return open.apply(this, arguments);
        };
        return ajax;
    } : xhr;
}

function totalTime() {
    var player = _self.PlayerStarter.playerArray[0].player;
    setting.habit -= player.paused() ? 0 : setting.time;
    if (setting.habit >= 0) return;
    clearInterval(setting.tip);
    player.pause();
    $$.getScript('//cdn.jsdelivr.net/gh/sentsin/layer/dist/layer.js', function() {
        _self.layer.open({content: '已达到挂机限制时间', title: '智慧树网课助手提示', end: function() {
            setting.habit = 0;
        }});
    });
}

function ZHScheckToNext(tip) {
    if (setting.habit < 0) return;
    var $$tip = $$('.video, .lessonItem');
    if ($$('.current_play .time_icofinish').length) {
        $$tip.slice($$tip.index($$('.current_play')) + 1).not(':has(.time_icofinish)').eq(0).click();
    } else if ($$('.lessonItemActive .finish').length) {
        $$tip.slice($$tip.index($$('.lessonItemActive')) + 1).not(':has(.finish)').eq(0).click();
    } else if (tip == 1) {
        $$('.current_player:contains("100%") + li').click();
    } else if ($$('.settleOn .finish').length) {
        tip.slice(tip.index($$('.settleOn')) + 1).not(':has(.finish)').eq(0).find('.file-name').click();
    }
}
function doTest() {
    if (!$$('.dialog-test').length) {
    } else if (setting.queue.length) {
        $$(setting.queue.shift()).parent().click();
    } else if (!$$('.answer').length) {
        $$('.topic-item').eq(0).click();
    } else if (!$$('.right').length) {
        var tip = $$('.answer span').text().match(/[A-Z]/g) || [];
        if (tip.length == 1) return $$('.topic-option-item:contains(' + tip[0] + ')').click();
        $$('.topic-option-item').each(function() {
            $$.inArray($$(this).text().slice(0, 1), tip) < 0 == $$(this).hasClass('active') && setting.queue.push(this);
        });
    } else if ($$('.btn-next:enabled').length) {
        $$('.btn-next:enabled').click();
    } else {
        $$('.dialog-test .btn').click();
        _self.PlayerStarter.playerArray[0].player.play();
    }
}

function ZHSrelieveLimit(doc) {
    if (!doc.oncut && !doc.onselectstart) return setTimeout(relieveLimit, 100, doc);
    doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
}

function ZHSbeforeFind() {
    setting.div = $(
        '<div style="border: 2px dashed rgb(149, 252, 251); width: 330px; position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgba(184, 247, 255, 0.3); overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="font-size: medium;">正在搜索答案...</div>' +
        '<button style="margin-right: 10px;">暂停答题</button>' +
        '<button style="margin-right: 10px;">重新查询</button>' +
        '<button style="margin-right: 10px;">折叠面板</button>' +
        '<button style="display: none;">未作答题目</button>' +
        '<form style="margin: 2px 0;">' +
        '<label style="font-weight: bold; color: red;">自定义答题范围：</label>' +
        '<input name="num" type="number" min="1" placeholder="开始" style="width: 60px;" disabled>' +
        '<span> ~ </span>' +
        '<input name="max" type="number" min="1" placeholder="结束" style="width: 60px;" disabled>' +
        '</form>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1" style="font-size: 12px;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 30px; min-width: 30px; font-weight: bold; text-align: center;">题号</th>' +
        '<th style="width: 60%; min-width: 130px; font-weight: bold; text-align: center;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px; font-weight: bold; text-align: center;">答案（点击可复制）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="display: none;">' +
        '<tr>' +
        '<th colspan="3" style="font-weight: bold; text-align: center;">答案提示框 已折叠</th>' +
        '</tr>' +
        '</tfoot>' +
        '<tbody>' +
        '<tr>' +
        '<td colspan="3" style="display: none;"></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var len = $(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $(this).prev().length && GM_setClipboard($(this).text());
        } else if (len === 0) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = [false, '已暂停搜索', '继续答题'];
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                len = [true, '正在搜索答案...', '暂停答题'];
            }
            setting.div.find('input').attr('disabled', len[0]);
            setting.div.children('div:eq(0)').html(function() {
                return $(this).data('html') || len[1];
            }).removeData('html');
            $(this).html(len[2]);
        } else if (len == 1) {
            location.reload();
        } else if (len == 2) {
            setting.div.find('tbody, tfoot').toggle();
        } else if (len == 3) {
            var $li = $('.el-scrollbar__wrap li'),
                $tip = $li.filter('.white, .yellow').eq(0);
            $tip.click().length ? setting.div.children('div:last').scrollTop(function() {
                var $tr = $('tbody tr', this).has('td:nth-child(1):contains(' + $tip.text() + ')');
                if (!$tr.length) return arguments[1];
                return $tr.offset().top - $tr.parents('table').offset().top; // $tr[0].offsetTop
            }) : $(this).hide();
        }
    }).on('change', 'input', function() {
        setting[this.name] = this.value.match(/^\d+$/) ? parseInt(this.value) - 1 : -1;
        if (!this.value) setting[this.name] = this.name == 'num' ? 0 : undefined;
    }).detach(setting.hide ? '*' : 'html');
    setting.type = {
        单选题: 1,
        多选题: 2,
        填空题: 3,
        问答题: 4,
        '分析题/解答题/计算题/证明题': 5,
        '阅读理解（选择）/完型填空': 9,
        判断题: 14
    };
    setting.lose = setting.num = setting.small = 0;
    $(document).keydown(function(event) {
        if (event.keyCode == 38) {
            setting.div.detach();
        } else if (event.keyCode == 40) {
            setting.div.appendTo('body');
        }
    });
    setting.loop = setInterval(ZHSfindAnswer, setting.time, true);
    setInterval(function() {
        $(setting.queue.shift()).parent().click();
    }, 1E3);
}
function ZHSfindAnswer(tip) {
    var courseId = location.href.split('/')[9]
    if (setting.queue.length) {
        return;
    } else if (tip && !$('.answerCard').length) {
        return setting.div.children('div:eq(0)').data('html', '非自动答题页面').siblings('button:eq(0)').click();
    } else if (setting.max < 0 || setting.num < 0) {
        return setting.div.children('div:eq(0)').data('html', '范围参数应为 <font color="red">正整数</font>').siblings('button:eq(0)').click();
    } else if (setting.num >= $('.subject_stem').length || setting.num > setting.max) {
        // setting.div.children('button:eq(3)').toggle(!!setting.lose);
        tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
        return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(0), form').hide().click();
    } else if (!setting.curs.length) {
        setting.curs = $('.infoList span').map(function() {
            return $(this).text().trim();
        });
        if (!setting.curs.length) return;
    }
    var url;
    //url = "http://qackqi.cn/OnlineCourseBot/topic";
    url = "http://onlinecoursekiller.online/OnlineCourseKiller/killer";
    var $TiMu = $('.subject_stem').eq(setting.num).parent(),
        $dom = $TiMu.find('.smallStem_describe').eq(setting.small).children('div').slice(1, -1),
        question = filterStyle($dom) || filterStyle($TiMu.find('.subject_describe')),
        type = $TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1],
        stems = $TiMu.find('.nodeLab')
    let q_index = $TiMu.find('.subject_num').text().replace('.',"")
    console.log(q_index)
    var q_option_list = ""
    console.log($TiMu)
    var q_stem = question
    if(type.includes('阅读理解（选择）/完型填空')) {
        q_stem = filterStyle($TiMu.find('.subject_describe')) + '  ' + question
        q_option_list = $TiMu.find('.smallStem_describe').eq(setting.small).next('.subject_node').text()
    } else {
        stems.each(function(){
        var stemText = $(this).text()
        q_option_list = q_option_list + " " + stemText
        })
    }


    var q_type = ''

    if(type === "单选题") {
        q_type = "单选题"
    } else if(type === "多选题") {
        q_type = "多选题"
    } else {
        q_type = "简答题"
    }
    type = type ? setting.type[type] || 0 : -1;
    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'q=' + encodeURIComponent(question) + '&token=' + setting.token,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                if (obj.success == "true") {
                    setting.div.children('div:eq(0)').text('正在搜索答案...');
                    var data = obj.answer.replace(/&/g, '&amp;').replace(/<([^i])/g, '&lt;$1');
                    obj.answer = /^http/.test(data) ? '<img src="' + obj.answer + '">' : obj.answer;
                    var type = $TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1];
                        var q_lesson = ""
                        if($('.hasNotes li label')[1].innerHTML === "对应章节") {
                            q_lesson = $('.hasNotes li span')[1].innerHTML
                        } else {
                            q_lesson = ""
                        }
                        var qData = {
                            classification: '智慧树',
                            q_onlineclass: $('.course_name').html(),
                            q_lesson: q_lesson,
                            year: new Date().getFullYear(),
                            q_stem: q_stem,
                            q_type: q_type,
                            q_option_list: q_option_list,
                            q_answer: obj.answer || "",
                            courseId: courseId,
                            q_index: q_index,
                            timestamp: new Date().getTime()
                        }
                        console.log(qData)
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: kdaurl,
                            headers: {
                                'Content-type': 'application/json'
                            },
                            data: JSON.stringify(qData),
                            onload: function() {
                                if (xhr.status == 200) {
                                    console.log('成功')
                                } else {
                                    console.log('失败')
                                }
                            }
                        })

                    $(
                        '<tr>' +
                        '<td style="text-align: center;">' + $TiMu.find('.subject_num').text().trim().replace('.', '') + '</td>' +
                        '<td title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        '<td title="点击可复制">' + (/^http/.test(data) ? obj.answer : '') + data + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', function() {
                        $dom = $dom.length ? $dom.closest('.examPaper_subject') : $TiMu;
                        if (ZHSfillAnswer($dom, obj, type)) return '';
                        setting.div.children('button:eq(3)').show();
                        return 'rgba(99, 215, 247, 0.6)';
                    });
                    setting.small = ++setting.small < $TiMu.find('.smallStem_describe').length ? setting.small : (setting.num++, 0);
                } else {
                    setting.div.children('div:eq(0)').html(obj.answer || '服务器繁忙，正在重试...');
                    var q_lesson1 = ""
                    if($('.hasNotes li label')[1].innerHTML === "对应章节") {
                        q_lesson1 = $('.hasNotes li span')[1].innerHTML
                    } else {
                        q_lesson1 = ""
                    }
                    var qData1 = {
                        classification: '智慧树',
                        q_onlineclass: $('.course_name').html(),
                        q_lesson: q_lesson1,
                        year: new Date().getFullYear(),
                        q_stem: q_stem,
                        q_type: q_type,
                        q_option_list: q_option_list,
                        q_answer: "",
                        courseId: courseId,
                        q_index: q_index,
                        timestamp: new Date().getTime()
                    }
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: kdaurl,
                        headers: {
                            'Content-type': 'application/json'
                        },
                        data: JSON.stringify(qData1),
                        onload: function() {
                            if (xhr.status == 200) {
                                console.log('成功')
                            } else {
                                console.log('失败')
                            }
                        }
                    })
                    setting.small = ++setting.small < $TiMu.find('.smallStem_describe').length ? setting.small : (setting.num++, 0);
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                console.log('ok2')
                var html = xhr.responseText.indexOf('{') ? '请求过于频繁，建议稍后再试' : $.parseJSON(xhr.responseText).data;
                setting.div.children('div:eq(0)').data('html', html).siblings('button:eq(0)').click();
            } else {
                console.log('ok3')
                setting.div.children('div:eq(0)').text('服务器异常，正在重试...');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').text('服务器超时，正在重试...或尝试使用token');
        }
    });
}

function ZHSfillAnswer($TiMu, obj, type) {
    var $div = $TiMu.find('.nodeLab'),
        str = String(obj.answer).toCDB() || new Date().toString(),
        data = str.split(/#|\x01|\|/),
        state = setting.lose;
    // $div.find(':radio:checked').prop('checked', false);
    obj.success == "true" && $div.each(function() {
        var $input = $('input', this)[0],
            tip = filterStyle('.node_detail', this).toCDB() || new Date().toString();
        if (tip.match(/^(正确|是|对|√|T|ri)$/)) {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($input);
        } else if (tip.match(/^(错误|否|错|×|F|wr)$/)) {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($input);
        } else if (type == 2) {
            Boolean($.inArray(tip, data) + 1 || str.indexOf(tip) + 1) == $input.checked || setting.queue.push($input);
        } else {
            $.inArray(tip, data) + 1 && setting.queue.push($input);
        }
    });
    if (setting.queue.length) {
    } else if (/^(1|2|14)$/.test(type)) {
        var $input = $div.find('input');
        $input.is(':checked') || (setting.none ? setting.queue.push($input[Math.floor(Math.random() * $input.length)]) : setting.lose++);
    } else if (/^[3-5]$/.test(type)) {
        data = String(obj.answer).split(/#|\x01|\|/);
        str = $TiMu.find('textarea').each(function(index) {
            index = (obj.success == "true" && data[index]) || '';
            this.value = index.trim();
            // if (this.value == this._value) return true;
            this.dispatchEvent(new Event('input'));
            this.dispatchEvent(new Event('blur'));
        }).length;
        (obj.success == "true" && data.length == str) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}


function hookHiexam() {
    var ajax = new xhr();
    ajax.onload = function() {
        if (this.status != 200 || !this.responseURL.match('getDoQuestSingle')) return;
        var obj = JSON.parse(this.responseText).rt;
        $.each(obj.questionOptionList || [], function(index) {
            var $input = $('.TitleOptions-div input')[index];
            if (obj.questionTypeId == 1) {
                this.isCorrect && setting.queue.push($input);
            } else if (obj.questionTypeId == 2) {
                this.isCorrect == $input.checked || setting.queue.push($input);
            }
        });
    };
    return ajax;
}

function filterStyle(dom, that) {
    var $dom = $(dom, that).clone().find('style').remove().end();
    return $dom.find('img[src]').replaceWith(function() {
        return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
    }).end().text().trim();
}
// 获取已经学习的题
function getFinishedData() {
    var courseId = location.href.split('/')[9]
    let tnum = $('.examPaper_partTit span').text()
    let num = 1;
    var q_onlineclass = $('.course_name').text()
    $('.questionType').each(function(index) {
        var  subject_type = $(this).find('.subject_type span').text().match(/【(.+)】|$/)[1]
        var  subject_describe = $(this).find('.subject_describe').text()
        var  q_option_list = ""
        $(this).find('.subject_node .nodeLab').each(function() {
            var stemText = $(this).text()
            q_option_list = q_option_list + " " + stemText
        })
        var qtype = ""
        if(subject_type === "单选题") {
            qtype = "单选题"
        } else if(subject_type === "多选题") {
            qtype = "多选题"
        } else {
            qtype = "简答题"
        }
        var q_lesson = ""
        if($('.hasNotes li label')[1].innerHTML === "对应章节") {
            q_lesson = $('.hasNotes li span')[1].innerHTML
        } else {
            q_lesson = ""
        }
        var qData = {
            classification: '智慧树',
            q_onlineclass: q_onlineclass,
            q_lesson: q_lesson,
            year: new Date().getFullYear(),
            q_stem: subject_describe,
            q_type: qtype ,
            q_option_list: q_option_list,
            q_answer: "",
            courseId: courseId,
            timestamp: new Date().getTime() + index * 1000
        }
        console.log(qData)
        num++
        GM_xmlhttpRequest({
            method: 'POST',
            url: kdaurl,
            headers: {
                'Content-type': 'application/json'
            },
            data: JSON.stringify(qData),
            onload: function() {
            }
        })
    })
    setTimeout(function(){
        if(num > tnum) {
            alert("完成")
        }
        console.log("完成")
    },1000)
}