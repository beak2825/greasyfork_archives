// ==UserScript==
// @name         超星学习通助理[章节、作业、考试、视频] 支持新版|修复倍速|优化课程切换|支持图片题
// @version      3.6
// @namespace    http://tampermonkey.net/
// @description  超星全自动刷课，支持章节、作业、考试、视频等多项任务点。
// @author       JunXiaoRuo
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @connect      s.jiaoyu139.com
// @connect      study.jszkk.com
// @original-script https://greasyfork.org/zh-CN/scripts/437514-%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E7%90%86-%E7%AB%A0%E8%8A%82-%E4%BD%9C%E4%B8%9A-%E8%80%83%E8%AF%95-%E8%A7%86%E9%A2%91-%E6%94%AF%E6%8C%81%E6%96%B0%E7%89%88-%E4%BF%AE%E5%A4%8D%E5%80%8D%E9%80%9F-%E4%BC%98%E5%8C%96%E8%AF%BE%E7%A8%8B%E5%88%87%E6%8D%A2-%E6%94%AF%E6%8C%81%E5%9B%BE%E7%89%87%E9%A2%98
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437514/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E7%90%86%5B%E7%AB%A0%E8%8A%82%E3%80%81%E4%BD%9C%E4%B8%9A%E3%80%81%E8%80%83%E8%AF%95%E3%80%81%E8%A7%86%E9%A2%91%5D%20%E6%94%AF%E6%8C%81%E6%96%B0%E7%89%88%7C%E4%BF%AE%E5%A4%8D%E5%80%8D%E9%80%9F%7C%E4%BC%98%E5%8C%96%E8%AF%BE%E7%A8%8B%E5%88%87%E6%8D%A2%7C%E6%94%AF%E6%8C%81%E5%9B%BE%E7%89%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/437514/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E7%90%86%5B%E7%AB%A0%E8%8A%82%E3%80%81%E4%BD%9C%E4%B8%9A%E3%80%81%E8%80%83%E8%AF%95%E3%80%81%E8%A7%86%E9%A2%91%5D%20%E6%94%AF%E6%8C%81%E6%96%B0%E7%89%88%7C%E4%BF%AE%E5%A4%8D%E5%80%8D%E9%80%9F%7C%E4%BC%98%E5%8C%96%E8%AF%BE%E7%A8%8B%E5%88%87%E6%8D%A2%7C%E6%94%AF%E6%8C%81%E5%9B%BE%E7%89%87%E9%A2%98.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 2E3 == 2000，科学记数法，表示毫秒数
    time: 4E3 // 默认响应速度为5秒，不建议小于2秒
    , review: 0 // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频，默认关闭
    , queue: 1 // 队列模式，开启后任务点逐一完成，关闭则单页面所有任务点同时进行，默认开启
    // 1代表开启，0代表关闭
    , video: 1 // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    , work: 1 // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率，默认开启
    , audio: 1 // 音频自动播放，与视频功能共享vol和rate参数，默认开启
    , book: 1 // 图书阅读任务点，非课程阅读任务点，默认开启
    , docs: 1 // 文档阅读任务点，PPT类任务点自动完成阅读任务，默认开启
    // 本区域参数，上方为任务点功能，下方为独立功能
    , jump: 1 // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    , read: '65' // 挂机课程阅读时间，单位是分钟，'65'代表挂机65分钟，请手动打开阅读页面，默认'65'分钟
    , face: 1 // 解除面部识别(不支持二维码类面部采集)，此功能仅为临时解除，默认开启
    , total: 1 // 显示课程进度的统计数据，在学习进度页面的上方展示，默认开启
    // 仅开启video(audio)时，修改此处才会生效
    , line: '公网1' // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    , http: '标清' // 视频播放的默认清晰度，无效参数则使用系统默认清晰度，默认'标清'
    // 本区域参数，上方为video功能独享，下方为audio功能共享
    , vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    , rate: '1' // 视频播放默认倍率，参数范围0∪[0.0625,16]，'0'为秒过，默认'1'倍
    // 仅开启work时，修改此处才会生效
    , auto1: 1 // 答题完成后自动提交，默认开启
    , none: 0 // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会暂时保存已作答的题目，默认开启
    , scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
    // 仅开启jump时，修改此处才会生效
    , course: 1 // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，默认开启
    , lock: 1 // 跳过未开放(图标是锁)的章节，即闯关模式或定时发放的任务点，默认开启
},
    _self = unsafeWindow,
    url = location.pathname,
    top = _self,
    script_info=GM_info.script;

jq_layer();
if(GM_getValue("jump")!=undefined){
    setting.jump=GM_getValue("jump");
}
if(GM_getValue("auto")!=undefined){
    setting.auto1=GM_getValue("auto");
}
if(GM_getValue("none")!=undefined){
    setting.none=GM_getValue("none");
}
if(GM_getValue("queue")!=undefined){
    setting.queue=GM_getValue("queue");
}
if(GM_getValue("course")!=undefined){
    setting.course=GM_getValue("course");
}
if(GM_getValue("rate")!=undefined){
    setting.rate=GM_getValue("rate");
}
var pz={
};
var tmpSubmit = 1;//本次
Object.defineProperty(setting, "auto", {
    get: function () {
        if (tmpSubmit >= 2) {
            return tmpSubmit === 3;
        }
        return GM_getValue("autosubmit");
    }, set: function (value) {
        tmpSubmit = value + 2;
    }
});
setting.notice = '公告栏';
if (url != '/studyApp/studying' && top != _self.top) document.domain = location.host.replace(/.+?\./, '');
try {
    while (top != _self.top) {
        top = top.parent.document ? top.parent : _self.top;
        if (top.location.pathname == '/mycourse/studentstudy') break;
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
$('body').mousedown(function(e){
    if(3 == e.which){
        setting_s();
    }
})
if (url != '/module/audioplay.html'){
    try {
        pz.layui= _self.layui || top.layui;
        pz.layui.use('layer', function () {
            pz.layer=this.layer;
            pz.layer.closeAll();


        });

    } catch (err) {

    }
}

$('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
$('.Header').find('a:contains(回到旧版)')[0]?$('.Header').find('a:contains(回到旧版)')[0].click():'';
String.prototype.toCDB = function () {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function (str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};
setting.normal = ''; // ':visible'
// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.job = [':not(*)'];

setting.video && setting.job.push('iframe[src*="/video/index.html"]');
setting.work && setting.job.push('iframe[src*="/work/index.html"]');
setting.audio && setting.job.push('iframe[src*="/audio/index.html"]');
setting.book && setting.job.push('iframe[src*="/innerbook/index.html"]');
setting.docs && setting.job.push('iframe[src*="/ppt/index.html"]', 'iframe[src*="/pdf/index.html"]');
setting.tip = !setting.queue || top != _self && jobSort($ || Ext.query);
console.log(url);
if (url == '/mycourse/studentstudy') {

    _self.checkMobileBrowerLearn = $.noop;
    var classId = location.search.match(/cla[zs]{2}id=(\d+)/i)[1] || 0,
        courseId = _self.courseId || location.search.match(/courseId=(\d+)/i)[1] || 0;
    setting.lock || $('#coursetree').on('click', '[onclick*=void], [href*=void]', function () {
        _self.getTeacherAjax(courseId, classId, $(this).parent().attr('id').slice(3));
    });
} else if (url == '/ananas/modules/video/index.html' && setting.video) {

    if (setting.review) _self.greenligth = Ext.emptyFn;
    checkPlayer(_self.supportH5Video());

} else if (url == '/work/doHomeWorkNew' || url == '/api/work' || url == '/work/addStudentWorkNewWeb'|| url == '/mooc2/work/dowork') {
    setting.knowledgeId=0
    try {
        setting.knowledgeId= location.search.match(/knowledgeid=(\d+)/i)[1];
    } catch (err) {}
    if (setting.knowledgeId==0&&typeof unsafeWindow.layui == 'undefined') {
        var Head = document.getElementsByTagName('head')[0] || document.documentElement;
        var JQ = document.createElement('script');
        JQ.src = 'https://lib.baomitu.com/layui/2.6.8/layui.js';
        JQ.type = 'text/javascript';
        JQ.async = true;
        Head.insertBefore(JQ, Head.firstChild);
        GM_wait();
    }else{
        work_start();
    }
    function GM_wait() {
        if (typeof unsafeWindow.layui == 'undefined') {
            console.log("正在加载");
            window.setTimeout(GM_wait, 100);
        } else {
            work_start()
        }
    }
    function work_start(){
        console.log("加载成功");
        pz.layui=unsafeWindow.layui;
        console.log("进入答题界面！");
        if (!UE) {
            var len = ($ || Ext.query || Array)('font:contains(未登录)', document).length;
            setTimeout(len == 1 ? top.location.reload : parent.greenligth, setting.time);
        } else if (setting.work) {
            setTimeout(relieveLimit, 0);
            beforeFind();
        }
    }

} else if (url == '/ananas/modules/audio/index.html' && setting.audio) {
    if (setting.review) _self.greenligth = Ext.emptyFn;
    _self.videojs = hookAudio;
    hookAudio.xhr = vjs.xhr;
} else if (url == '/ananas/modules/innerbook/index.html' && setting.book && setting.tip) {
    setTimeout(function () {
        _self.setting ? _self.top.onchangepage(_self.getFrameAttr('end')) : _self.greenligth();
    }, setting.time);
} else if (url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$/) && setting.docs && setting.tip) {
    setTimeout(function () {
        _self.setting ? _self.finishJob() : _self.greenligth();
    }, setting.time);
    frameElement.setAttribute('download', 1);
} else if (url == '/knowledge/cards') {
    $ && checkToNext()
} else if (url.match(/^\/(course|zt)\/\d+\.html$/)) {
    setTimeout(function () {
        +setting.read && _self.sendLogs && $('.course_section:eq(0) .chapterText').click();
    }, setting.time);
} else if (url == '/ztnodedetailcontroller/visitnodedetail') {
    setting.read *= 60 / $('.course_section').length;
    setting.read && _self.sendLogs && autoRead();
} else if (url == '/mycourse/studentcourse') {
    var gv = location.search.match(/d=\d+&/g);
    setting.total && $('<a>', {
        href: '/moocAnalysis/chapterStatisticByUser?classI' + gv[1] + 'courseI' + gv[0] + 'userId=' + _self.getCookie('_uid') + '&ut=s',
        target: '_blank',
        title: '点击查看章节统计',
        style: 'margin: 0 25px;',
        html: '本课程共' + $('.icon').length + '节，剩余' + $('em:not(.openlock)').length + '节未完成'
    }).appendTo('.zt_logo').parent().width('auto');
} else if (url.match(/^\/visit\/(courses|interaction|stucoursemiddle)$/)) {
    setting.face && $('.zmodel').on('click', '[onclick^=openFaceTip]', DisplayURL);
} else if (location.hostname == 'i.mooc.chaoxing.com') {
    console.log("课程页面");
} else if (url == '/widget/pcvote/goStudentVotePage') {
    $(':checked').click();
    $('.StudentTimu').each(function (index) {
        var ans = _self.questionlist[index].answer;
        $(':radio, :checkbox', this).each(function (num) {
            ans[num].isanswer && this.click();
        });
        $(':text', this).val(function (num) {
            return $(ans[num].content).text().trim();
        });
    });
} else if (url == '/work/selectWorkQuestionYiPiYue') {
    submitAnswer(getIframe().parent(), $.extend(true, [], parent._data));
}else if(url =='/exam/test/reVersionTestStartNew'){
    console.log("考试");

    kss();
}

function hookVideo() {
    _self.alert = console.log;
    //console.log(arguments);
    var config = arguments[1];
    if (!config) {
        return vjs.apply(this, arguments);
    }
    var line = Ext.Array.filter(Ext.Array.map(config.playlines, function (value, index) {
        return value.label == setting.line && index;
    }), function (value) {
        return Ext.isNumber(value);
    }
                               )[0] || 0,
        http = Ext.Array.filter(config.sources, function (value) {
            return value.label == setting.http;
        })[0];
    config.playbackRates = [0.5, 1, 1.5, 2, 4,6, 8, 16];
    config.playlines.unshift(config.playlines[line]);
    config.playlines.splice(line + 1, 1);
    config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
    config.plugins.studyControl.enableSwitchWindow = 1;
    config.plugins.timelineObjects.url = "/richvideo/initdatawithviewer?";
    config.plugins.seekBarControl.enableFastForward = 1;
    if (!setting.queue) delete config.plugins.studyControl;

    var player = vjs.apply(this, arguments),
        a ='<a href="https://s1.ananas.chaoxing.com/download/' +_self.config("objectid") +'" target="_blank">',
        img ='<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
    player.playbackRate=function (t){
        if(void 0===t)return "•"+this.cache_.lastPlaybackRate||this.techGet_("playbackRate");
        this.tech_&&this.tech_.featuresPlaybackRate?this.cache_.lastPlaybackRate||this.techGet_("playbackRate"):setting.rate;
        this.techCall_("setPlaybackRate",t)
    };
    player.volume(Math.round(setting.vol) / 100 || 0);
    player.on("loadstart", function () {
        setting.tip && this.play().catch(Ext.emptyFn);
        this.playbackRate(
            setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate
        );
    });
    player.one(["loadedmetadata", "firstplay"], function () {
        setting.two = (setting.rate === "0" || GM_getValue("fast")==1)&& setting.two < 1;
        setting.two &&config.plugins.seekBarControl.sendLog(this.children_[0],"ended",Math.floor(this.cache_.duration));
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
        a = '<a href="https://d0.ananas.chaoxing.com/download/' + _self.config('objectid') + '" target="_blank">',
        img = '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
    player.volume(Math.round(setting.vol) / 100 || 0);
    player.playbackRate(setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate);
    Ext.get(player.controlBar.addChild('Button').el_).setHTML(a + img + '</a>').dom.title = '下载音频';
    player.on('loadeddata', function () {
        setting.tip && this.play().catch(Ext.emptyFn);
    });
    player.one('firstplay', function () {
        setting.rate === '0' && config.plugins.seekBarControl.sendLog(this.children_[0], 'ended', Math.floor(this.cache_.duration));
    });
    player.on('ended', function () {
        Ext.fly(frameElement).parent().addCls('ans-job-finished');
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
function setting_s(){
    if(!pz.layer){
        try {
            pz.layui= _self.layui || top.layui;
            pz.layui.use('layer', function () {
                pz.layer=this.layer;
                pz.layer.closeAll();

            });
        } catch (err) {
            console.log("加载失败");
        }
    }
    pz.queue=(setting.queue===1?"checked":"");
    pz.work=setting.work===1?"checked":"";
    pz.book=setting.book===1?"checked":"";
    pz.jump=setting.jump===1?"checked":"";
    pz.none=(setting.none==1)?"checked":"";
    pz.review=setting.review===1?"checked":"";
    pz.course=setting.course===1?"checked":"";
    pz.video=setting.video===1?"checked":"";
    pz.layer.open({
        type: 1,
        area: ['400px', '300px'],
        closeBtn: 1,
        title: "脚本参数设置",
        shade: 0,
        anim: 2,
        id:"sett2",
        content:'<script src="https://www.layuicdn.com/layui/layui.js"></script> <form class="layui-form"> <div class="layui-form-item"> <label class="layui-form-label">间隔时间</label> <div class="layui-input-inline"> <input type="number" name="time" value="'+setting.time+'" required lay-verify="required" placeholder="间隔时间" class="layui-input"> </div> <div class="layui-form-mid layui-word-aux">脚本运行间隔时间/推荐4000毫秒</div> </div> <div class="layui-form-item"> <label class="layui-form-label">视频倍率</label> <div class="layui-input-inline"> <input type="number" name="rate" value="'+setting.rate+'" required lay-verify="required" placeholder="视频倍率" class="layui-input"> </div> <div class="layui-form-mid layui-word-aux">倍速有风险，秒过需谨慎。【0秒刷,1-16倍速自己填】</div> </div> <div class="layui-form-item"> <label class="layui-form-label">队列刷课</label> <div class="layui-input-inline"> <input type="checkbox" name="queue" '+pz.queue+' lay-skin="switch"> </div> <div class="layui-form-mid layui-word-aux">开启后任务点逐一完成，关闭则单页面所有任务点同时进行</div> </div> <div class="layui-form-item"> <label class="layui-form-label">自动跳转</label> <div class="layui-input-inline"> <input type="checkbox" name="jump" '+pz.jump+' lay-skin="switch"> </div> <div class="layui-form-mid layui-word-aux">自动切换任务点、章节、课程</div> </div> <div class="layui-form-item"> <label class="layui-form-label">答案匹配</label> <div class="layui-input-inline"> <input type="checkbox" name="none" '+pz.none+' lay-skin="switch"> </div> <div class="layui-form-mid layui-word-aux">无答案是否随机答案,若有准确率需求勿开</div> </div> </form>'
        ,cancel: function(index,layero){
            $(layero[0]).find("input").each(function(){
                if(this.name=="time"){
                    setting.time=this.value;
                    GM_setValue("time",this.value);
                }
                else if(this.name=="rate"){
                    setting.rate=this.value;
                    GM_setValue("rate",this.value);
                }
                else{
                    if($(this).attr("checked")){
                        setting[this.name]=1
                        GM_setValue(this.name,1);
                    }else{
                        setting[this.name]=0;
                        GM_setValue(this.name,0);
                    }
                }
            });
            console.log(setting);
            pz.layer.msg("保存成功！",{"icon":1});
        }
    });
}
function kss(){
    function findTiMu() {
        var courseId = location.search.match(/courseId=(\d+)/i)[1] || 0,
            classId=location.search.match(/classId=(\d+)/i)[1] || 0,
            zurl='http://s.jiaoyu139.com:886/get?t=ks';
        GM_xmlhttpRequest({
            method: 'POST',
            url: zurl,
            data:'keyword=' + encodeURIComponent(setting.TiMu[0]) + '&courseid='+courseId,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                '_t': 'cx',
                'referer':location.href,
                'v':script_info.version,
                'u':script_info.author
            },
            timeout: 5000,
            onload: function(xhr) {
                if (!setting.loop) {
                } else if (xhr.status == 200) {
                    var obj = $.parseJSON(xhr.responseText) || {};
                    obj.answer = obj.data.answer;
                    if (obj.code) {
                        var answer = String(obj.answer).replace(/&/g, '&').replace(/<(?!img)/g, '<'),
                            que = setting.TiMu[0].match('<img') ? setting.TiMu[0] : setting.TiMu[0].replace(/&/g, '&').replace(/</g, '<');
                        obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                        setting.div.find('tbody').append(
                            '<tr>' +
                            '<td title="点击可复制">' + que + '</td>' +
                            '<td title="点击可复制">' + (/^http/.test(answer) ? obj.answer : '') + answer + '</td>' +
                            '</tr>'
                        );
                        setting.copy && GM_setClipboard(obj.answer);
                        setting.$btn.eq(3).show();
                        fillAnswer(obj);
                        if (obj.code < 0){
                       //alert("跳过");
                    }else{
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: "https://study.jszkk.com/api/open/add",
                            contentType: "application/json; charset=utf-8",
                            headers: {
                                "Authorization":"NEFcZ1Y7g1HapKJbnMz6Y2EecNKP1e1zuYoML3mFQ1K2vGaOi9869Ac3PEeej4"
                            },
                            data: JSON.stringify({
                                "content":setting.TiMu[0],
                                "answer":obj.answer
                            }),
                            success: function(result) {

                            },
                            error: function(result) {
                                //alert("失败");
                            }
                        });
                     }
                    } else {
                        $(setting.layerdom).find("#pz_tips").html(obj.answer || '服务器繁忙，正在重试...');

                    }
                    $(setting.layerdom).find("#cx-notice").html(obj.msg || '');
                } else if (xhr.status == 403) {
                    obj = $.parseJSON(xhr.responseText) || {};
                    $(setting.layerdom).find("#pz_tips").html('访问限制,正在重试...');
                    $(setting.layerdom).find('#cx-notice').html(obj.msg);
                    //$(setting.layerdom).find("#pz_stop").click();
                } else {
                    $(setting.layerdom).find("#pz_tips").html('服务器异常，正在重试...');
                }
            },
            ontimeout: function() {
                setting.loop && $(setting.layerdom).find("#pz_tips").html('服务器超时，正在重试...');
            }
        });

    }

    function fillAnswer(obj, tip) {
        var $input = $(':radio, :checkbox', '.Cy_ulBottom'),
            str = String(obj.answer).toCDB() || new Date().toString(),
            data = str.split(/#|\x01|\|/),
            opt = obj.opt || str,
            btn = $('.saveYl:contains(下一题)').offset();
        // $input.filter(':radio:checked').prop('checked', false);
        obj.code > 0 && $input.each(function(index) {
            if (this.value == 'true') {
                data.join().match(/(^|,)(False|false|正确|是|对|√|T|ri)(,|$)/) && this.click();
            } else if (this.value == 'false') {
                data.join().match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && this.click();
            } else {
                index = setting.TiMu[3][index].toCDB() || new Date().toString();
                index = $.inArray(index, data) + 1 || (setting.TiMu[1] == '1' && str.indexOf(index) + 1);
                Boolean(index) == this.checked || this.click();
            }
        }).each(function() {
            if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
            Boolean(opt.match(this.value)) == this.checked || this.click();
        });
        if (setting.TiMu[1].match(/^[013]$/)) {
            tip = $input.is(':checked') || setting.none && (($input[Math.floor(Math.random() * $input.length)] || $()).click(), ' ');
        } else if (setting.TiMu[1].match(/^(2|[4-9]|1[08])$/)) {
            data = String(obj.answer).split(/#|\x01|\|/);
            tip = $('.Cy_ulTk textarea').each(function(index) {
                index = (obj.code > 0 && data[index]) || '';
                UE.getEditor(this.name).setContent(index.trim());
            }).length;
            tip = (obj.code > 0 && data.length == tip) || setting.none && ' ';
            setting.len = str.length * setting.time / 10;
        }
        if (tip == ' ') {
            tip = '已执行默认操作';
        } else if (tip) {
            tip = '自动答题已完成';
        } else if (tip === undefined) {
            tip = '该题型不支持自动答题';
        } else {
            tip = '未找到有效答案';
        }
        if (btn) {
            tip += setting.jump ? '，即将切换下一题' : '，未开启自动切换';
            setInterval(function() {
                if (!setting.jump) return;
                var mouse = document.createEvent('MouseEvents'),
                    arr = [btn.left + Math.ceil(Math.random() * 80), btn.top + Math.ceil(Math.random() * 26)];
                mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, arr[0], arr[1], false, false, false, false, 0, null);
                _self.event = $.extend(true, {}, mouse);
                delete _self.event.isTrusted;
                _self.getTheNextQuestion(1);
            }, setting.len || Math.ceil(setting.time * Math.random()) * 2);
        } else {
            $(setting.layerdom).find("#pz_sub").hide();
            $(setting.layerdom).find("#pz_xq").toggle();
            tip = '答题已完成，请自行查看答题详情';
        }

        $(setting.layerdom).find("#pz_tips").html(tip);
        $(setting.layerdom).find("#pz_stop").hide().click();
    }

    setting.notice = '公告栏';
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://s.jiaoyu139.com:886/index/msg',
        timeout: 5000,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                setting.notice = obj.msg;

                $(setting.layerdom).find("#cx-notice").html( setting.notice);
            }
        },
        ontimeout: function () {
            setting.loop &&$(setting.layerdom).find("#pz_tips").html(setting.over + '服务器超时，正在重试...');
        }
    });

    String.prototype.toCDB = function() {
        return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
            return String.fromCharCode(str.charCodeAt(0) - 65248);
        }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
    };

    // setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
    setting.TiMu = [
        filterImg('.Cy_TItle .clearfix').replace(/\s*（\d+\.\d+分）$/, ''),
        $('[name^=type]:not([id])').val() || '-1',
        $('.cur a').text().trim() || '无',
        $('li .clearfix').map(function() {
            return filterImg(this);
        })
    ];
    if(typeof unsafeWindow.layui == 'undefined'){
        var Head = document.getElementsByTagName('head')[0] || document.documentElement,
            JQ = document.createElement('script');
        JQ.src = 'https://lib.baomitu.com/layui/2.6.8/layui.js';
        JQ.type = 'text/javascript';
        JQ.async = true;
        Head.insertBefore(JQ, Head.firstChild);
        GM_wait();
    }
    function GM_wait() {
        if (typeof unsafeWindow.layui == 'undefined') {
            console.log("正在加载");
            window.setTimeout(GM_wait, 100);
        } else {
            work_start()
        }
    }
    function work_start(){
        setting.layui=unsafeWindow.layui;
        if(!setting.layer){
            try {
                setting.layui= _self.layui || top.layui;
                setting.layui.use('layer', function () {
                    setting.layer=this.layer;
                    setting.layer.closeAll();

                });
                console.log("加载成功");
            } catch (err) {
                console.log("加载失败");

            }
        }
        setting.layer.open({
            type: 1,
            area: ['500px', '300px'],
            offset: 'lb',
            closeBtn: 0,
            title: "超星考试小助手",
            maxmin:true,
            moveOut:true,
            shade: 0,
            anim: 2,

            success: function(layero, index){
                if(!setting.top){
                    setting.top=layero[0].offsetTop
                }
                setting.layerdom=layero[0];
                setting.layerindex=index;
            },
            restore:function(){
                setting.layer.style(setting.layerindex, {
                    top:setting.top,
                    right:'0px'
                });
            },
            content: '<div id="msgzz" ><blockquote class="layui-elem-quote layui-quote-nm">'+
            '<button type="button" id="pz_stop"  class="layui-btn layui-btn-normal ">暂停答题<button>'+
            '<button type="button" id="pz_res"  class="layui-btn layui-btn-normal ">重新查询<button>'+
            '<button type="button"  style="display: none;" id="pz_xq"  class="layui-btn layui-btn-normal ">详情<button>'+
            '<button type="button" id="pz_sub"  class="layui-btn layui-btn-normal ">' + (setting.jump ? '停止本次切换' : '开启本次切换') + '<button>'+
            '</blockquote><div id="pz_tips"></div>'+
            '<div class="layui-collapse"><div class="layui-colla-item"><h2 class="layui-colla-title">公告</h2><div class="layui-colla-content layui-show" ><div id="cx-notice">加载中...</div></div></div>'
            +'<div id="content"><ul></ul>		<table class="layui-table"> <colgroup><col> <col> </colgroup> <thead> <tr><th>题目</th> <th>答案</th> </tr> </thead> <tbody>  </tbody> </table></div></div></div>'
        });


        setting.div = $(setting.layerdom).appendTo('body').on('click', 'button, td', function() {

            var num = setting.$btn.index(this);
            console.log(this.id);
            num=99;
            //console.log(num);
            if (num == -1) {
                GM_setClipboard($(this).text());
            } else if (this.id=="pz_stop") {
                if (setting.loop) {
                    clearInterval(setting.loop);
                    delete setting.loop;
                    num = ['已暂停搜索', '继续答题'];
                } else {
                    setting.loop = setInterval(findTiMu, setting.time);
                    num = ['正在搜索答案...', '暂停答题'];
                }
                setting.$div.html(function() {
                    return $(this).data('html') || num[0];
                }).removeData('html');
                $(this).html(num[1]);
            } else if (this.id=="pz_sub") {
                setting.jump = 0;
                setting.$div.html(function() {
                    return arguments[1].replace('即将切换下一题', '未开启自动切换');
                });
                setting.div.find('tfoot').add(this).toggle();
            } else if (this.id=="pz_res") {
                location.reload();
            } else if (this.id=="pz_xq") {
                ($('.leftCard .saveYl')[0] || $()).click();
            } else if (num == 5) {
                setting.tk_num++;
                GM_setValue('tk_num_1',setting.tk_num);
                setting.tk_num = GM_getValue('tk_num_1');
                console.log(setting.tk_num);
                parent.location.reload();
            }
        }).detach(setting.hide ? '*' : 'html');



        setting.$btn = setting.div.children('button');
        setting.$div = setting.div.children('div:eq(0)');

        $(document).keydown(function(event) {
            if (event.keyCode == 38) {
                setting.div.detach();
            } else if (event.keyCode == 40) {
                setting.div.appendTo('body');
            }
        });

        if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
        $.each(UE.instants, function() {
            var key = this.key;
            this.ready(function() {
                this.destroy();
                UE.getEditor(key);
            });
        });
        setting.loop = setInterval(findTiMu, setting.time);

    }
}
function beforeFind() {

    setting.regl = parent.greenligth || $.noop;
    if ($.type(parent._data) == 'array') return setting.regl();
    if(!pz.layer){
        try {
            pz.layui= _self.layui || top.layui;
            pz.layui.use('layer', function () {
                pz.layer=this.layer;
                pz.layer.closeAll();

            });
        } catch (err) {
            console.log("加载失败");
        }
    }
    pz.layer.open({
        type: 1,
        area: ['500px', '300px'],
        offset: 'rb',
        closeBtn: 0,
        title: "超星小助手",
        maxmin:true,
        moveOut:true,
        shade: 0,
        anim: 2,

        success: function(layero, index){
            if(!pz.top){
                pz.top=layero[0].offsetTop
            }
            pz.layerdom=layero[0];
            pz.layerindex=index;
        },
        restore:function(){
            pz.layer.style(pz.layerindex, {
                top:pz.top,
                right:'0px'
            });
        },
        content: '<div id="msgzz" ><blockquote class="layui-elem-quote layui-quote-nm">'+
        '<button type="button" id="pz_stop"  class="layui-btn layui-btn-normal ">暂停答题<button>'+
        '<button type="button" id="pz_res"  class="layui-btn layui-btn-normal ">重新查询<button>'+
        '<button type="button" id="pz_sub"  class="layui-btn layui-btn-normal ">' + (setting.auto1 ? '取消本次自动提交' : '开启本次自动提交') + '<button>'+
        '<button type="button" id="pz_gg"  class="layui-btn layui-btn-normal ">设置<button>'+
        '</blockquote><div id="pz_tips"></div>'+
        '<div class="layui-collapse"><div class="layui-colla-item"><h2 class="layui-colla-title">公告</h2><div class="layui-colla-content layui-show" ><div id="cx-notice">加载中...</div></div></div>'
        +'<div id="content"><ul></ul>		<table class="layui-table"> <colgroup> <col width="50"> <col> <col> </colgroup> <thead> <tr> <th>序号</th> <th>题目</th> <th>答案</th> </tr> </thead> <tbody>  </tbody> </table></div></div></div>'
    });

    setting.div = $(pz.layerdom).on('click', 'button, td, input', function () {
        var len = $(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $(this).prev().length && GM_setClipboard($(this).text());
        } else if (!$(this).siblings().length) {
            $(this).parent().text('正在搜索答案...');
            setting.num++;
        } else if (this.id =="pz_stop") {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = ['已暂停搜索', '继续答题'];
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                len = ['正在搜索答案...', '暂停答题'];
            }
            pz.layer.title(len[0], pz.layerindex);
            $(this).html(len[1]);
        } else if (this.id == "pz_sub") {
            setting.auto1 = !setting.auto1;
            $(this).html(setting.auto1 ? '取消本次自动提交' : '开启本次自动提交');
        } else if (this.id == "pz_res") {
            parent.location.reload();
        } else if (this.id=="pz_gg") {
            setting_s();
            //$(pz.layerdom).find('#cx-notice').toggle();
        } else if (this.id == "autosubmit") {
            // 题目自动提交配置
            GM_setValue("autosubmit", this.checked);
        }
    }).end();
    setting.lose = setting.num = 0;
    setting.data = parent._data = [];
    setting.over = '<button style="margin-right: 10px;">跳过此题</button>';
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    setting.loop = setInterval(findAnswer, setting.time);
    var tip = ({ undefined: '任务点排队中', null: '等待切换中' })[setting.tip];
    tip && $(pz.layerdom).find("#pz_stop").hide().click()&&$(pz.layerdom).find("#pz_tips").html(tip);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://s.jiaoyu139.com:886/index/msg',
        timeout: 5000,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                setting.notice = obj.msg;
                $(pz.layerdom).find('#cx-notice').html(setting.notice);
            }
        },
        ontimeout: function () {
            setting.loop && pz.layer.title('服务器超时,正在重试...', pz.layerindex);
        }
    });
}
function findAnswer() {
    //$("html,body").animate({scrollTop: $('.TiMu').eq(setting.num).offset().top}, 1000);
    var pz_num=setting.num+1,
        pz_badnum=setting.lose+1;
    $(pz.layerdom).find("#pz_tips").html('共获取<span class="layui-bg-blue">&nbsp;' + $('.TiMu').length +'&nbsp;<\/span>道题目,正在完成第<span class="layui-bg-blue">&nbsp;' + pz_num + '&nbsp;<\/span>道题,无答案<span class="layui-bg-red">&nbsp;' + setting.lose + '&nbsp;<\/span>道题。');
    if (setting.num >= $('.TiMu').length) {
        pz.layer.title('答题已完成', pz.layerindex);
        var arr = setting.lose ? ['共获取<span class="layui-bg-blue">&nbsp;' + $('.TiMu').length +'&nbsp;<\/span>道题目,共<span class="layui-bg-red">&nbsp;' +setting.lose + '&nbsp;<\/span>待完成。', saveThis] : ['答题已完成,共<span class="layui-bg-blue">&nbsp;' + $('.TiMu').length +'&nbsp;<\/span>道题目', submitThis];
        $(pz.layerdom).find("#pz_stop").hide().click();
        $(pz.layerdom).find("#pz_tips").html(arr[0]);
        return setTimeout(arr[1], setting.time);
    }
    var $TiMu = $('.TiMu').eq(setting.num),
        question = filterImg($TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/, '').replace(/（\s*）。$/, '').replace(/[(]\s*[)]$/, '').replace(/（\s*）$/, '').replace(/。$/, ''),
        type = $TiMu.find('input[name^=answertype]:eq(0)').val() || '-1';

    if(question == ""){
        question = filterImg($TiMu.find('.mark_name:eq(0) .colorDeep'));
    }
    var courseId = location.search.match(/courseId=(\d+)/i)[1];
    var classId= location.search.match(/classId=(\d+)/i)[1];
    var knowledgeId=0
    try {
        knowledgeId= location.search.match(/knowledgeid=(\d+)/i)[1];
    } catch (err) {
    }
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://s.jiaoyu139.com:886/get?t=zj',
        data: 'keyword=' + encodeURIComponent(question) + '&courseid='+courseId+'&type=' + type + '&workid=' + ($('#workRelationId').val() || $('#oldWorkId').val())+"&classid="+classId+"&knowledgeid="+knowledgeId,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            '_t': 'cx',
            'referer':location.href,
            'v':script_info.version,
            'u':script_info.author
        },
        timeout: 5000,
        onload: function (xhr) {
            var obj;
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                obj = $.parseJSON(xhr.responseText) || {};
                obj.answer = obj.data.answer;
                if (obj.code) {
                    pz.layer.title('正在搜索答案...', pz.layerindex);
                    var td = '<td ',
                        answer = String(obj.answer).replace(/&/g, '&').replace(/<(?!img)/g, '<');
                    obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                    $(
                        '<tr>' +
                        td + ' text-align: center;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        td + '" title="点击可复制" >' + (question.match('<img') ? question : question.replace(/&/g, '&').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + (/^http/.test(answer) ? obj.answer : '') + answer + '</td>' +
                        '</tr>'
                    ).appendTo($(pz.layerdom).find('tbody')).attr("class",fillAnswer($TiMu.find('ul:eq(0)').find('li'), obj, type) ? '' :"layui-bg-red");
                    setting.data[setting.num++] = {
                        code: obj.code > 0 ? 1 : 0,
                        question: question,
                        option: obj.answer,
                        type: Number(type)
                    };
                    if (obj.code < 0){
                    }else{
                        var j = $TiMu.find('li').length;
                        var daa = [];
                        var wang = obj.answer.replace(/\s+/g,"");
                        for (var i = 0;i < j;i++){
                            if(filterImg($TiMu.find('li').eq(i).find('p'))!=''){
                                var da = {};
                                da['name'] = $TiMu.find('li').eq(i).find('input').val();
                                da['content'] = filterImg($TiMu.find('li').eq(i).find('p'));
                                var ben = filterImg($TiMu.find('li').eq(i).find('p'));
                                if(wang==ben){
                                    da['isanswer'] = true;
                                }else{
                                    da['isanswer'] = false;
                                }
                                daa.push(da);
                            }
                        }
                        if(daa.length == 0){//无选项
                             console.log('非选择题')
                            $.ajax({
                            type: "POST",
                            async: false,
                            url: "https://study.jszkk.com/api/open/add",
                            contentType: "application/json; charset=utf-8",
                            headers: {
                                "Authorization":"NEFcZ1Y7g1HapKJbnMz6Y2EecNKP1e1zuYoML3mFQ1K2vGaOi9869Ac3PEeej4"
                            },
                            data: JSON.stringify({
                                "content":question,
                                "answer":obj.answer.replace(/\s+/g,"")
                            }),
                            success: function(result) {

                            },
                            error: function(result) {
                                //alert("失败");
                            }
                        });
                        }else{//有选项
                            console.log('选择题')
                            $.ajax({
                            type: "POST",
                            async: false,
                            url: "https://study.jszkk.com/api/open/add",
                            contentType: "application/json; charset=utf-8",
                            headers: {
                                "Authorization":"NEFcZ1Y7g1HapKJbnMz6Y2EecNKP1e1zuYoML3mFQ1K2vGaOi9869Ac3PEeej4"
                            },
                            data: JSON.stringify({
                                "content":question,
                                "answer":obj.answer.replace(/\s+/g,""),
                                "options":daa
                            }),
                            success: function(result) {

                            },
                            error: function(result) {
                                //alert("失败");
                            }
                        });
                        }
                     }
                } else {
                    pz.layer.title('请求失败', pz.layerindex);
                }
            } else if (xhr.status == 403) {
                obj = $.parseJSON(xhr.responseText) || {};
                setting.notice = obj.msg;
                $(pz.layerdom).find('#cx-notice').html(setting.notice);
                pz.layer.title('请求受到限制', pz.layerindex);
            } else {
                pz.layer.title('题库异常，请稍后重试', pz.layerindex);
            }
        },
        ontimeout: function () {
            setting.loop && pz.layer.title('题库超时，正在重试', pz.layerindex);
        }
    });
}
function jq_layer(){
    var Head = document.getElementsByTagName('head')[0] || document.documentElement,
        JQ = document.createElement('script');
    JQ.src = 'https://lib.baomitu.com/layui/2.6.8/layui.js';
    JQ.type = 'text/javascript';
    JQ.async = true;
    Head.insertBefore(JQ, Head.firstChild);
}
function img_cl(text){
    return text.replace(/https:\/\/mooc1-api.chaoxing.com/g, "").replace(/[^\u4e00-\u9fa5^\w]/g, "")
}
function fillAnswer($li, obj, type) {
    var $input = $li.find(':radio, :checkbox'),
        str = String(obj.answer).toCDB() || new Date().toString(),
        data = str.split(/#|\x01|\|/),
        opt = obj.opt || str,
        state = setting.lose;
    $input.prop('checked', false);
    // $li.find(':radio:checked').prop('checked', false);
    obj.code > 0 && $input.each(function (index) {

        if (this.value == 'true') {
            data.join().match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && this.click();
        } else {
            var tip = filterImg($li.eq(index).find('.after')).toCDB() || new Date().toString();
            if(str.indexOf("<img") != -1 ){
                tip=img_cl(tip);
                data[0]=img_cl(data[0]);
            }
            Boolean($.inArray(tip, data) + 1 || (type == '1' && str.indexOf(tip) + 1)) == this.checked || this.click();
        }
    }).each(function () {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this.checked || this.click();
    });
    if (type.match(/^[013]$/)) {
        $input.is(':checked') || (setting.none ? ($input[Math.floor(Math.random() * $input.length)] || $()).click() : setting.lose++);
    } else if (type.match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.answer).split(/#|\x01|\|/);
        str = $li.end().find('textarea').each(function (index) {
            index = (obj.code > 0 && data[index]) || '';
            if (obj.code > 0) {
                UE.getEditor(this.name).setContent(index.trim());
            }
        }).length;
        (obj.code > 0 && data.length == str) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}
function saveThis() {
    if (!setting.auto1) return setTimeout(saveThis, setting.time);
    setting.div.children('button:lt(3)').hide().eq(1).click();
    _self.alert = console.log;
    $('#tempsave').click();
    setting.regl();
}
function submitThis() {
    if (!setting.auto1) {
    } else if (!$('.Btn_blue_1:visible').length) {
        setting.div.children('button:lt(3)').hide().eq(1).click();
        return setting.regl();
    } else if ($('#confirmSubWin:visible').length) {
        var btn = $('#tipContent + * > a').offset() || { top: 0, left: 0 },
            mouse = document.createEvent('MouseEvents');
        btn = [btn.left + Math.ceil(Math.random() * 46), btn.top + Math.ceil(Math.random() * 26)];
        mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, btn[0], btn[1], false, false, false, false, 0, null);
        _self.event = $.extend(true, {}, mouse);
        delete _self.event.isTrusted;
        _self.form1submit();
    } else {
        $('.Btn_blue_1')[0].click();
    }
    setTimeout(submitThis, Math.ceil(setting.time * Math.random()) * 2);
}
function checkToNext() {
    var $tip = $(setting.job.join(', '), document).prevAll('.ans-job-icon' + setting.normal);
    console.log($tip);
    setInterval(function () {
        console.log($tip.parent(':not(.ans-job-finished)').length);

        if(parent.location.search.match(/mooc2=(\d+)/i)!=null){
            $tip.parent(':not(.ans-job-finished)').length || setting.jump&&toNext1();
        }else{
            $tip.parent(':not(.ans-job-finished)').length || setting.jump&&toNext();
        }
    }, setting.time);
}
function toNext1(){
    if($(".prev_ul").find("li.active").next().length){
        $(".prev_ul").find("li.active").next().click();
    }else{
        var pnex=$(".posCatalog_select").slice($(".posCatalog_select").index($(".posCatalog_active"))+1).find(".jobUnfinishCount").parent().eq(0);
        pnex.length||setting.course && switchCourse();
        pnex.find("span").click();
    }
}
function toNext() {
    var $cur = $('#cur' + $('#chapterIdid').val()),
        $tip = $('span.currents ~ span'),
        sel = setting.review ? 'html' : '.blue';

    if (!$cur.has(sel).length && $tip.length) return $tip.eq(0).click();
    $tip = $('.roundpointStudent, .roundpoint').parent();
    $tip = $tip.slice($tip.index($cur) + 1).not(':has(' + sel + ')');
    $tip.not(setting.lock ? ':has(.lock)' : 'html').find('span').eq(0).click();
    $tip.length || setting.course && switchCourse();
}
function switchCourse() {
    console.log("课程切换");
    GM_xmlhttpRequest({
        method: 'POST',
        url: '/visit/courselistdata',
        data:"courseType=1&courseFolderId=0&courseFolderSize=0",
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
            "Host":"mooc1-1.chaoxing.com",
            "Origin":"https://mooc1-1.chaoxing.com"
        },
        onload: function (xhr) {

            var list = $('h3 a[target]', xhr.responseText).map(function () {
                return $(this).attr('href');
            });
            var index = list.map(function (index) {
                return this.match(top.courseId) && index;
            }).filter(function () {
                return $.isNumeric(this);
            })[0] + 1 || 0;
            setting.course = list[index] ? goCourse(list,index) : 0;
        }
    });
}
function goCourse(list,index) {
    url=list[index];
    url="/visit"+url.split("/visit")[1];
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (xhr) {
            var knowurl=$('h3 a[href]', xhr.responseText).attr('href');
            knowurl==undefined?goCourse(list,index+1):$.globalEval('location.href = "' + $('h3 a[href]', xhr.responseText).attr('href') + '";');
        }
    });
}
function autoRead() {
    $('html, body').animate({
        scrollTop: $(document).height() - $(window).height()
    }, Math.round(setting.read) * 1E3, function () {
        $('.nodeItem.r i').click();
    }).one('click', '#top', function (event) {
        $(event.delegateTarget).stop();
    });
}
function DisplayURL() {
    _self.WAY.box.hide();
    var $li = $(this).closest('li');
    $.get('/visit/goToCourseByFace', {
        courseId: $li.find('input[name=courseId]').val(),
        clazzId: $li.find('input[name=classId]').val()
    }, function (data) {
        $li.find('[onclick^=openFaceTip]').removeAttr('onclick').attr({
            target: '_blank',
            href: $(data).filter('script:last').text().match(/n\("(.+?)"/)[1]
        });
        alert('本课程已临时解除面部识别');
    }, 'html');
}
function submitAnswer($job, data) {
    $job.removeClass('ans-job-finished');
    data = data.length ? $(data) : $('.TiMu').map(function () {
        var title = filterImg($('.Zy_TItle .clearfix', this));
        return {
            question: title.replace(/^【.*?】\s*/, ''),
            type: ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3 })[title.match(/^【(.*?)】|$/)[1]]
        };
    });
    data = $.grep(data.map(function (index) {
        var $TiMu = $('.TiMu').eq(index);
        if (!($.isPlainObject(this) && this.type < 4 && $TiMu.find('.fr').length)) {
            return false;
        } else if (this.type == 2) {
            var $ans = $TiMu.find('.Py_tk, .Py_answer').eq(0);
            if (!$TiMu.find('.cuo').length && this.code) {
                return false;
            } else if (!$ans.find('.cuo').length) {
                this.option = $ans.find('.clearfix').map(function () {
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
                this.option = ({ '√': '错误', '×': '正确' })[ans] || '无';
            } else if (!this.code) {
                this.option = ({ '√': '正确', '×': '错误' })[ans] || '无';
            } else {
                return false;
            }
        } else {
            var text = $TiMu.find('.Py_answer > span:eq(0)').text();
            if ($TiMu.find('.dui').length && this.code && !/^A?B?C?D?E?F?G?$/.test(this.option)) {
                return false;
            } else if ($TiMu.find('.dui').length || text.match('正确答案')) {
                text = text.match(/[A-G]/gi) || [];
                this.option = $.map(text, function (value) {
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
    }), function (value) {
        return value && value.option != '无';
    });
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    /*     data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://cx.icodef.com/upload/cx?workRelationId=' + $('#workId').val(),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': setting.token,
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&data=' + encodeURIComponent((Ext.encode || JSON.stringify)(data)) + '&id=' + $('#jobid').val().slice(5)
    }); */
    $job.addClass('ans-job-finished');
}
function filterImg(dom) {
    return $(dom).clone().find('img[src]').replaceWith(
        function () {
            return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
        }
    ).end().find('iframe[src]').replaceWith(
        function () {
            return $('<p></p>').text('<iframe src="' + $(this).attr('src') + '"></iframe>');
        }
    ).end().text().trim();
}
function getIframe(tip, win, job) {
    if (!$) return Ext.get(frameElement || []).parent().child('.ans-job-icon') || Ext.get([]);
    do {
        win = win ? win.parent : _self;
        job = $(win.frameElement).prevAll('.ans-job-icon');
    } while (!job.length && win.parent.frameElement);
    return tip ? win : job;
}
function jobSort($) {
    var fn = $.fn ? [getIframe(1), 'length'] : [self, 'dom'],
        sel = setting.job.join(', :not(.ans-job-finished) > .ans-job-icon' + setting.normal + ' ~ ');
    if ($(sel, fn[0].parent.document)[0] == fn[0].frameElement) return true;
    if (!getIframe()[fn[1]] || getIframe().parent().is('.ans-job-finished')) return null;
    setInterval(function () {
        $(sel, fn[0].parent.document)[0] == fn[0].frameElement && fn[0].location.reload();
    }, setting.time);
}
function checkPlayer(tip) {
    _self.videojs = hookVideo;
    hookVideo.xhr = vjs.xhr;
    Ext.isSogou = Ext.isIos = Ext.isAndroid = false;
    var data = Ext.decode(_self.config('data')) || {};
    delete data.danmaku;
    data.doublespeed = 1;
    frameElement.setAttribute('data', Ext.encode(data));
    if (tip) return;
    _self.supportH5Video = function () { return true; };
    alert('此浏览器不支持html5播放器，请更换浏览器');
}