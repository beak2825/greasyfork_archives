// ==UserScript==
// @name         【隐藏版】考试推荐！！！禁同号多登，已内制防检测系统。
// @namespace    隐藏版
// @version      2.1.9
// @description  隐藏版
// @author       隐藏版
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.bsnc.cn/*
// @match        *://*.xuetangx.com/*
// @match        *://*.yuketang.cn/*
// @match        *://*.icve.com.cn/*
// @run-at       document-end
// @connect      lyck6.cn
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @compatible   chrome
// @contributionURL   http://lyck6.cn/pay
// @require      https://unpkg.com/vue/dist/vue.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @require      https://cdn.bootcdn.net/ajax/libs/jsencrypt/2.1.0/jsencrypt.js
// @require      http://cdn.bootcss.com/blueimp-md5/1.1.0/js/md5.js
// @downloadURL https://update.greasyfork.org/scripts/420319/%E3%80%90%E9%9A%90%E8%97%8F%E7%89%88%E3%80%91%E8%80%83%E8%AF%95%E6%8E%A8%E8%8D%90%EF%BC%81%EF%BC%81%EF%BC%81%E7%A6%81%E5%90%8C%E5%8F%B7%E5%A4%9A%E7%99%BB%EF%BC%8C%E5%B7%B2%E5%86%85%E5%88%B6%E9%98%B2%E6%A3%80%E6%B5%8B%E7%B3%BB%E7%BB%9F%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/420319/%E3%80%90%E9%9A%90%E8%97%8F%E7%89%88%E3%80%91%E8%80%83%E8%AF%95%E6%8E%A8%E8%8D%90%EF%BC%81%EF%BC%81%EF%BC%81%E7%A6%81%E5%90%8C%E5%8F%B7%E5%A4%9A%E7%99%BB%EF%BC%8C%E5%B7%B2%E5%86%85%E5%88%B6%E9%98%B2%E6%A3%80%E6%B5%8B%E7%B3%BB%E7%BB%9F%E3%80%82.meta.js
// ==/UserScript==

var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3 // 默认响应速度为6秒，不建议小于5秒|后台有检测机制，请求频率过快会封ip
    ,review: 0 // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频和章节测验作业等，默认关闭
    ,queue: 1 // 队列模式，开启后任务点逐一完成，关闭则单页面所有任务点同时进行，默认开启
    ,option: 0 //捐助用户是否使用收费题库答题，1为开启，0为关闭，默认关闭，可手动开启

    //超星用户自动刷讨论，下面内容可以自定义
    ,switch: 0 //是否刷讨论数量，1为开启，0为关闭，默认关闭
    ,topic: ['讲的不错','我还想听','这个老师真好','这个课让我受益匪浅','在大学我一定要好好学习','努力学习ing','原来超星的选修课都这么有意思可以哦','第一次听选修课这么爽']

    //雨课堂功能配置区域（不使用可不配置）-->本区域登陆雨课堂都要修改-->确保sessionid正确 || 不会填写请前往：http://lyck6.cn/help
    ,sessionid : ''//这个参数每次登陆都要更改<-->这个参数可以通过f12开发人员选项Application中的Cookies中获取这个参数
    ,classid : '' //这个参数需要你自己创建一个课程，然后点开课程，地址url栏有对应得班级id

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    ,work: 1 // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率，默认开启
    ,audio: 1 // 音频自动播放，与视频功能共享vol和rate参数，默认开启
    ,book: 1 // 图书阅读任务点，非课程阅读任务点，默认开启
    ,docs: 1 // 文档阅读任务点，PPT类任务点自动完成阅读任务，默认开启

    // 本区域参数，上方为任务点功能，下方为独立功能
    ,jump: 1 // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    ,read: '10' // 挂机课程阅读时间，单位是分钟，'65'代表挂机65分钟，请手动打开阅读页面，默认'10'分钟
    ,face: 0 // 解除面部识别(不支持二维码类面部采集)，此功能仅为临时解除，默认关闭
    ,copy: 0 // 自动复制答案到剪贴板，也可以通过手动点击按钮或答案进行复制，默认关闭
    ,total: 1 // 显示课程进度的统计数据，在学习进度页面的上方展示，默认关闭

    // 仅开启video(audio)时，修改此处才会生效
    ,line: '公网1' || '流畅' // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    ,http: '标清' // 视频播放的默认清晰度，无效参数则使用系统默认清晰度，默认'标清'
    ,habit: '0' // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制
    ,speed: '1.5' // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
    ,que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
    ,danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭

    // 本区域参数，上方为video功能独享，下方为audio功能共享
    ,vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    ,rate: '1' // 视频播放默认倍率，参数范围0∪[0.0625,16]，'0'为秒过，默认'1'倍

    // 仅开启work时，修改此处才会生效
    ,auto: 1 // 答题完成后自动提交，默认开启 改为0关闭
    ,none: 0 // 无匹配答案时随机选择一个选项做答，关闭后若题目无匹配答案则会暂时保存已作答的题目，默认关闭
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
    ,hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭

    // 仅开启jump时，修改此处才会生效
    ,course: 0 // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，默认关闭
    ,lock: 1 // 跳过未开放(图标是锁)的章节，即闯关模式或定时发放的任务点，默认开启

    // 自动登录功能配置区
    ,school: '账号为手机号可以不修改此参数' // 学校/单位/机构码，要求完整有效可查询，例如'清华大学'
    ,username: '' // 学号/工号/借书证号(邮箱/手机号/账号)，例如'2018010101'，默认''
    ,password: '' // 密码，例如'123456'，默认''
},
    _self = unsafeWindow,
    url = location.pathname,
    top = _self,
    domain = 'http://lyck6.cn/api/query/',
    userSetting;

GM_getValue('userSetting') ? userSetting = GM_getValue('userSetting') : GM_setValue('userSetting',setting)

if (url != '/studyApp/studying' && top != _self.top && !(location.host.match('yuketang') || location.host.match('xuetangx'))) document.domain = location.host.replace(/.+?\./, '');

try {
    while (top != _self.top) {
        top = top.parent.document ? top.parent : _self.top;
        if (top.location.pathname == '/mycourse/studentstudy') break;
    }
} catch (err) {
    top = _self;
}
var parent = _self == top ? self : _self.parent,
    Ext = _self.Ext || parent.Ext || {},
    UE = _self.UE,
    vjs = _self.videojs,
    xhr = _self.XMLHttpRequest;

String.prototype.toCDB = function() {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.').replace(/\+/g,'');
};
var $$ = _self.jQuery || top.jQuery || $;

if(setting.switch) $$('head').append('<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">');

var vm = new Vue({
    data: {
        topic: '',
        content: '',
        result: '',
        msg: ''
    },
    methods: {
        Toreply() {
            this.topic = setting.topic;
            this.content = this.topic[Math.floor((Math.random() * this.topic.length))];
            return this.content;
        },
        openSuccess() {
            this.$message({
                message: '已自动帮你自动回复一条讨论，内容为：' + this.content,
                type: 'success'
            });
        },
        openError() {
            this.$message.error('自动回复讨论失败,请关闭浏览器重新打开超星');
        },
        getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return (false);
        },
        submitTopic() {
            $$.ajax({
                type: "POST",
                url: "https://mooc1-1.chaoxing.com/bbscircle/grouptopic/publish",
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    courseId: GM_getValue('courseId'),
                    clazzid: GM_getValue('clazzid'),
                    content: this.Toreply()
                },
                success: function(data) {
                    try{
                        data = JSON.parse(data);
                    }catch(err){
                        vm.openError();
                    }
                    if (data.result) {
                        vm.openSuccess();
                    } else {
                        vm.openError();
                    }
                }
            })
        },
        setValue(){
            GM_setValue('courseId',this.getQueryVariable('courseId'))
            GM_setValue('clazzid',this.getQueryVariable('clazzid'))
        }
    }
})

$$(document).keydown(function(event) {
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
setting.type = {
    '单选题': 0,
    '多选题': 1,
    '填空题': 2,
    '问答题': 4,
    '分析题/解答题/计算题/证明题': 5,
    '阅读理解（选择）/完型填空': 9,
    '判断题': 3
};

if (url == '/mycourse/studentcourse'){
    vm.setValue();
} else if (url == '/mycourse/studentstudy') {
    setting.switch && vm.submitTopic();
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
} else if (url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$/) && setting.docs && setting.tip) {
    setTimeout(function() {
        _self.setting ? _self.finishJob() : _self.greenligth();
    }, setting.time);
    frameElement.setAttribute('download', 1);
} else if (url == '/knowledge/cards') {
    $$ && checkToNext();
} else if (url.match(/^\/(course|zt)\/\d+\.html$/)) {
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
} else if (url.match(/^\/visit\/(courses|interaction)$/)) {
    setting.face && $$('.zmodel').on('click', '[onclick^=openFaceTip]', DisplayURL);
} else if (location.host.match(/^passport2/)) {
    setting.username && getSchoolId();
} else if (location.hostname == 'i.mooc.chaoxing.com' && location.pathname.match(/space/)) {
    _self.layui.use('layer', function() {
        this.layer.open({
            content: '使用过程中会上传您的账户信息（包括昵称、ID、手机号等）以识别用户防止恶意爬题<br>初始用户赠送50积分，可用于使用收费题库答题<br>不同意请勿使用脚本',
            title: '用户协议',
            btn: ['我同意'],
            btn1:function(){
                window.open(document.getElementsByClassName("manageBtn")[0].href)
                layer.closeAll();
            },
            offset: 't', closeBtn: 0});
    });
} else if(location.pathname == '/settings/info'){
    uploadInfo(getInfo())
    setTimeout(function(){window.close();}, 350)
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
    submitAnswer();
    setting.switch && vm.submitTopic();
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
    if ((location.hash.match(/dohomework|doexamination/)) && setting.work) ZHSbeforeFind();
    $$(window).on('hashchange', function() {
        setting.work && location.reload();
    });
} else if (url.match('/sourceLearning')) {
    setting.video && ZHShookVideo(_self.vjsComponent, 3);
    setting.jump && setInterval(function(){let arr = ['fanzhuan',$$('#sourceTree').find('.file-item').map(function(i){if($$(this).find('.icon-finish').length == 0){return i}})[0]];ZHScheckToNext(arr)}, setting.time);
} else if (url == '/shareCourse/questionDetailPage') {
    setTimeout(ZHSrelieveLimit, 100, document);
    $$('textarea[oncut]').each(function() {
        setTimeout(ZHSrelieveLimit, 100, this);
    });
} else if(url.match('homeworkDetail')){
    setTimeout(function(){$$('.stuQuestionDownBtn').click();},500)
}else if ((url.match('exerciseList') || location.pathname.match('homeworkQ') || location.pathname.match('examexercise')) && setting.work) {
    setTimeout(function(){
        if(location.pathname.match('exerciseList') || location.pathname.match('examexercise')){
            setTimeout(ZHSrelieveLimit, 100, document);
            ZHSbeforeFind()
        }else if(location.pathname.match('homeworkQ')){
            ZhiHuiShuSubmitAnswer();
        }
    },2000)
} else if (url == '/exam/test/reVersionTestStartNew'){
    Exam();
} else if (url=='/exam/test/reVersionPaperMarkContentNew'){
    SubmitExamAnswer();
} else if (location.host.match('yuketang') || location.host.match('xuetangx')){
    setting.div = $$(
        '<div style="box-shadow: darkgrey 10px 10px 10px 5px;border: 0.5px solid #666;width: 330px;background-color: #B0E2FF; position: fixed; top: 0px; right: 0; z-index: 99999;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">雨课堂答题助手已启用<br>请前往【章节测验/考试/试卷】刷新网页会自动搜索答案<br>若无答案请刷新页面重新加载</div>' +
        '</div>' +
        '</div>'
    ).appendTo('#app')
    if(location.pathname.match('studentQuiz') || location.pathname.match('exam') || location.pathname.match('result')){
        YKTfindAnswer()
    }else if (url.match(/homework/)){
        YuKeTangBeforeFind()
    }else if (url.match(/studycontent/)){
        setting.div.detach();
    }
}else if(url == '/study/workExam/homeWork/preview.html' || url == '/study/workExam/testWork/preview.html' || url == '/study/workExam/onlineExam/preview.html' || url == '/study/onlineExam/preview.html'){
    ZhiJiaoYunBeforeFind()
}else if(url == '/study/workExam/homeWork/history.html' || url == '/study/workExam/testWork/history.html' || url == '/study/workExam/onlineExam/history.html'){
    setTimeout(ZhiJiaoYunSubmitAnswer,1000)
}else if(url == '/study/directory/dir_course.html'){
    setTimeout(function(){
        if($('.view_text_con').find('.preview_cm').find('.answer').text()){
            GreenZhiJiaoYunSubmitAnswer(getGreenZhiJiaoYunData());
        }else if ($('.subpaper').text().match('提交答案')){
            ZhiJiaoYunBeforeFind()
        }
    },3000)
}else if (url == '/study/works/works.html' || url == '/study/homework/do.html'){
    ZhiJiaoYunBeforeFind()
    setTimeout(getGreenZhiJiaoYunData,2000);
}else if (url.match('examTest/stuExamList')){
    var Intv = setInterval(function(){
        if($('#submit_exam').length){
            YiBinBeforeFind();
            clearInterval(Intv);
            delete Intv;
        }
    },2000)
    }

function sleep(delay) {
    for(var t = Date.now(); Date.now() - t <= delay;);
}
function getIframe(tip, win, job) {
    if (!$$) return Ext.get(frameElement || []).parent().child('.ans-job-icon') || Ext.get([]);
    do {
        win = win ? win.parent : _self;
        job = $$(win.frameElement).prevAll('.ans-job-icon');
    } while (!job.length && win.parent.frameElement);
    return tip ? win : job;
}

function jobSort($$) {
    var fn = $$.fn ? [getIframe(1), 'length'] : [self, 'dom'],
        sel = setting.job.join(', :not(.ans-job-finished) > .ans-job-icon' + setting.normal + ' ~ ');
    if ($$(sel, fn[0].parent.document)[0] == fn[0].frameElement) return true;
    if (!getIframe()[fn[1]] || getIframe().parent().is('.ans-job-finished')) return null;
    setInterval(function() {
        $$(sel, fn[0].parent.document)[0] == fn[0].frameElement && fn[0].location.reload();
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
    _self.supportH5Video = function() {return true;};
    alert('此浏览器不支持html5播放器，请更换浏览器');
}

function hookVideo() {
    setting.switch && vm.submitTopic();
    _self.alert = console.log;
    var config = arguments[1],
        line = Ext.Array.filter(Ext.Array.map(config.playlines, function(value, index) {
            return value.label == setting.line && index;
        }), function(value) {
            return Ext.isNumber(value);
        })[0] || 0,
        http = Ext.Array.filter(config.sources, function(value) {
            return value.label == setting.http;
        })[0];
    config.playlines.unshift(config.playlines[line]);
    config.playlines.splice(line + 1, 1);
    config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
    config.plugins.studyControl.enableSwitchWindow = 1;
    config.plugins.timelineObjects.url = '/richvideo/initdatawithviewer?';
    config.plugins.seekBarControl.enableFastForward = 1;
    if (!setting.queue) delete config.plugins.studyControl;
    var player = vjs.apply(this, arguments),
        a = '<a href="https://d0.ananas.chaoxing.com/download/' + _self.config('objectid') + '" target="_blank">',
        img = '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
    player.volume(Math.round(setting.vol) / 100 || 0);
    Ext.get(player.controlBar.addChild('Button').el_).setHTML(a + img + '</a>').dom.title = '下载视频';
    player.on('loadstart', function() {
        setting.tip && this.play().catch(Ext.emptyFn);
        this.playbackRate(setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate);
    });
    player.one(['loadedmetadata', 'firstplay'], function() {
        setting.two = setting.rate === '0' && setting.two < 1;
        setting.two && config.plugins.seekBarControl.sendLog(this.children_[0], 'ended', Math.floor(this.cache_.duration));
    });
    player.on('ended', function() {
        Ext.fly(frameElement).parent().addCls('ans-job-finished');
    });
    return player;
}

function hookAudio() {
    setting.switch && vm.submitTopic();
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
    player.on('loadeddata', function() {
        setting.tip && this.play().catch(Ext.emptyFn);
    });
    player.one('firstplay', function() {
        setting.rate === '0' && config.plugins.seekBarControl.sendLog(this.children_[0], 'ended', Math.floor(this.cache_.duration));
    });
    player.on('ended', function() {
        Ext.fly(frameElement).parent().addCls('ans-job-finished');
    });
    return player;
}

function relieveLimit() {
    if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
    $$.each(UE.instants, function() {
        var key = this.key;
        this.ready(function() {
            this.destroy();
            UE.getEditor(key);
        });
    });
}

function beforeFind() {
    setting.regl = parent.greenligth || $$.noop;
    if ($$.type(parent._data) == 'array') return setting.regl();
    setting.div = $$(
 
        '<span style="font-size: medium;"></span>' +
        '<img src="http://lyck6.cn/img/6.png" width="100%" />'+
        '设置手机号:<input id="phone" type="text name="phone" value='+GM_getValue('phone')+'>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">目前默认搜索|'+(userSetting.option ? '收费题库':'免费题库')+'<br>hh设置请修改脚本参数option<br>临时更改点击下方按钮</div>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (setting.auto ? '取消本次自动提交' : '开启本次自动提交') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (userSetting.option ? '取消请求收费题库' : '开启请求收费题库') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">折叠面板</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">拓展功能</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1"  style="font-size: 12px;color:black;background-color:#FF7F00;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 25px; min-width: 25px;">题号</th>' +
        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="display: none;">' +
        '<tr>' +
        '<th colspan="3">答案提示框 已折叠</th>' +
        '</tr>' +
        '</tfoot>' +
        '<tbody style="overflow-y: scroll;80px;">'+
        '<tr>' +
        '<td colspan="3" style="display: none;"></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var len = $$(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $$(this).prev().length && GM_setClipboard($$(this).text());
        } else if (!$$(this).siblings().length) {
            $$(this).parent().text('正在搜索|更多学习内容请关注公众号“狗崽崽1”');
            setting.num++;
        } else if (len === 0){
            GM_setValue('phone',$$("#phone").val())
        }else if (len === 1) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = ['已暂停搜索'+(+userSetting.option ? '收费题库':'免费题库'), '继续答题'];
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                len = ['正在搜索'+(+userSetting.option ? '收费题库':'免费题库'), '暂停答题'];
            }
            setting.div.children('div:eq(0)').html(function() {
                return $$(this).data('html') || len[0];
            }).removeData('html');
            $$(this).html(len[1]);
        } else if (len == 2) {
            setting.auto = !setting.auto;
            $$(this).html(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 3) {
            userSetting.option = !userSetting.option;
            $$(this).html(userSetting.option ? '取消请求收费题库' : '开启请求收费题库');
            GM_setValue('userSetting',userSetting)
        } else if (len == 4) {
            parent.location.reload();
        }else if (len == 5) {
            setting.div.find('tbody, tfoot').toggle();
        }else if (len == 6) {
            window.open("http://lyck6.cn/pay?phone="+ GM_getValue('phone'));
        } else if (len == 7){
            window.open('http://lyck6.cn/login')
        }
    }).find('table, td, th').css('border', '1px solid').end().detach(setting.hide ? '*' : 'html');
    setting.lose = setting.num = 0;
    setting.data = parent._data ;
    setting.over = '<button style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 80px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;">跳过此题</button>';
    setting.curs = $$('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $$('h1').text().trim() || '无';
    setting.loop = setInterval(findAnswer, setting.time);
    setting.review ? setting.tip = false : '';
    var tip = ({undefined: '任务点排队中', null: '等待切换中'})[setting.tip];
    tip && setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(1)').click();
    setting.switch && vm.submitTopic();
}

function findAnswer() {
    if (setting.num >= $$('.TiMu').length) {
        var arr = setting.lose ? ['共有 <font color=red>' + setting.lose + '</font> 道题目待完善（已深色标注）', saveThis] : ['答题已完成', submitThis];
        setting.div.children('div:eq(0)').data('html', arr[0]).siblings('button:eq(1)').hide().click();
        return setTimeout(arr[1], setting.time);
    }
    let $$TiMu = $$('.TiMu').eq(setting.num),
        postData = {
            question: filterImg($$TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/,'').replace(/（\s*）。$/,'').replace(/[(]\s*[)]$/,'').replace(/（\s*）$/,'').replace(/\+/g,"%2B").replace(/\&/g,"%26"),
            type: $$TiMu.find('input[name^=answertype]:eq(0)').val() || 10,
            option: filterImg($$('.TiMu').find('.Zy_ulTop').eq(setting.num), this).replace(/\s+/g,' ').replace(/\+/g,"%2B").replace(/\&/g,"%26") || '',
        }
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option='+ encodeURI(postData.option) + '&type=' + postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    userSetting.option ? setting.div.children('div:eq(0)').text('正在搜索收费题库--当前积分剩余：'+obj.data.num):setting.div.children('div:eq(0)').text('正在搜索免费题库|防止失联建议加群'+obj.data.qun);
                    var td = '<td style="border: 1px solid" colspan="1" font-size: 1.1em;text-align: left;background-color: #A7C942;color: #ffffff;',
                        answer = String(obj.data.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        td + ' text-align: center;">' + $$TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        td + '" title="点击可复制">' + (postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + obj.data.answer +'</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', fillAnswer($$TiMu.find('ul:eq(0)').find('li'), obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++;
                } else if(obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').data('html', obj.msg).siblings('button:eq(1)').click();
                }
            } else if (xhr.status == 403) {
                setting.div.children('div:eq(0)').data('html', '由于你的请求过于频繁，您的ip已被封<br>10分钟后自动解封<br>或者使用收费答题不限制请求次数').siblings('button:eq(1)').click();
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版已发布！请点击油猴按钮【用户脚本检查更新】完成更新！').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').html('发现未知异常，请联系加群930561503反馈处理');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '正在链接到云端，请稍后....<br>如果长时间链接不上请加群930561503反馈');
        }
    });
}

function fillAnswer($$li, obj, postData) {
    var $$input = $$li.find(':radio, :checkbox'),
        str = String(obj.data.answer).toCDB(),
        data = str.split(/#|\x01|\|/),
        state = setting.lose;
    obj.data.success && $$input.each(function(index) {
        if (this.value == 'true') {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && this.click();
        } else {
            var tip = filterImg($$li.eq(index).find('.after')).toCDB();
            Boolean($$.inArray(tip, data) + 1 || (postData.type == '1' && str.indexOf(tip) + 1)) == this.checked || this.click();
        }
    }).each(function() {
        if (!/^A?B?C?D?E?F?G?$/.test(str)) return false;
        Boolean(str.match(this.value)) == this.checked || this.click();
    });
    if (postData.type.match(/^[013]$/)) {
        $$input.is(':checked') || (setting.none ? ($$input[Math.floor(Math.random() * $$input.length)] || $$()).click() : setting.lose++);
    } else if (postData.type.match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.data.answer).split(/#|\x01|\|/);
        str = $$li.end().find('textarea').each(function(index) {
            index = (obj.code == 200 && data[index]) || '';
            obj.data.success ? UE.getEditor(this.name).setContent(index.trim()) : '';
        }).length;
        (obj.data.success && data.length == str) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose ? true : reportProblem(postData);
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
    submitAnswer();
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
    var school = /^1\d{10}$/.test(setting.username) ? '' : setting.school;
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
    } else if (Array.isArray(tip) && tip[0] == 'fanzhuan') {
        ($$('#sourceTree').find('.file-item').eq(tip[1]).find('.file-name').text() == $$('#sourceTit').find('span').text().replace('.mp4','')) || $$('#sourceTree').find('.file-item').eq(tip[1]).click()
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
    if (!doc.oncut && !doc.onselectstart) return setTimeout(ZHSrelieveLimit, 100, doc);
    doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
}

function ZHSbeforeFind() {
    setting.div = $$(
        '<div id = "setting" style="box-shadow: darkgrey 10px 10px 10px 5px;border: 0.5px solid #666;width: 300px;background-color: #fdfcf8; position: absolute; top: 0; right: 0; z-index: 99999;">' +
        '<span style="font-size: medium;"></span>' +
        '<img src="http://lyck6.cn/img/6.png" width="100%" />'+
        '设置手机号:<input id="phonenum" type="text" name="phone" value=' + GM_getValue('phone')+'>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;font-size: 15px;margin-bottom: 1%;">目前默认搜索|'+(userSetting.option ? '收费题库':'免费题库')+'<br>的说法置请修改脚本参数option<br>临时更改点击下方按钮</div>' +
        '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (userSetting.option ? '取消请求收费题库' : '开启请求收费题库') + '</button>' +
        '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button>' +
        '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">折叠面板</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">拓展功能</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1"  style="font-size: 12px;color:black;background-color:#FF7F00;">' +
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
        var len = $$(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $$(this).prev().length && GM_setClipboard($$(this).text());
        } else if (len == 0){
            GM_setValue('phone',document.getElementById('phonenum').value)
        } else if (len === 1) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = [false, '已暂停搜索'+(userSetting.option ? '收费题库':'免费题库'), '继续答题'];
            } else {
                if(url.match('exerciseList') || location.pathname.match('examexercise')) setting.loop = setInterval(ZhiHuiShuNewFindAnswer, setting.time*2);
                if(location.hash.match(/dohomework|doexamination/) )setting.loop = setInterval(ZHSfindAnswer, setting.time);
                len = [true, '正在搜索'+(userSetting.option ? '收费题库':'免费题库'), '暂停答题'];
            }
            setting.div.find('input').attr('disabled', len[0]);
            setting.div.children('div:eq(0)').html(function() {
                return $$(this).data('html') || len[1];
            }).removeData('html');
            $$(this).html(len[2]);
        } else if (len == 2) {
            userSetting.option = !userSetting.option;
            $$(this).html(userSetting.option ? '取消请求收费题库' : '开启请求收费题库');
            GM_setValue('userSetting',userSetting)
        } else if (len == 3) {
            location.reload();
        } else if (len == 4) {
            setting.div.find('tbody, tfoot').toggle();
        } else if (len == 5){
            window.open("http://lyck6.cn/pay?phone=" + GM_getValue('phone'));
        } else if (len == 6){
            window.open('http://lyck6.cn/login')
        }
    }).on('change', 'input', function() {
        setting[this.name] = this.value.match(/^\d+$/) ? parseInt(this.value) - 1 : -1;
        if (!this.value) setting[this.name] = this.name == 'num' ? 0 : undefined;
    }).detach(setting.hide ? '*' : 'html');
    setting.lose = setting.num = 0;
    if(url.match('exerciseList') || location.pathname.match('examexercise')){
        setting.loop = setInterval(ZhiHuiShuNewFindAnswer, setting.time * 2);
        setInterval(function() {
            $$(setting.queue.shift()).click();
        }, 1E3);
    }else if(location.hash.match(/dohomework|doexamination/)){
        setting.loop = setInterval(ZHSfindAnswer, setting.time);
        setInterval(function() {
            $$(setting.queue.shift()).parent().click();
        }, 1E3);
    }
}

function ZhiHuiShuNewFindAnswer(){
    if(setting.queue.length) return;
    var $TiMu = $$('.questionBox'),
        type = String(setting.type[$TiMu.find('.questionTit').text().match(/【(\S*)】/)[1]]);
    let postData = {
        question: filterImg($TiMu.find('.questionContent'),this).replace(/^（\S*）/,'').replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/,'').replace(/（\s*）。$/,'').replace(/[(]\s*[)]$/,'').replace(/（\s*）$/,'').replace(/\+/g,"%2B").replace(/\&/g,"%26"),
        option: filterImg($TiMu.find('.optionUl'),this).replace(/\s+/,' ').replace(/\+/g,"%2B").replace(/\&/g,"%26") || '',
        type: Boolean(type) ? type : 10
    }
    setting.num = parseInt($TiMu.find('.questionTit').text().match(/\d+/)[0]);
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option='+ encodeURI(postData.option) + '&type='+ postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    setting.div.children('div:eq(0)').text((!userSetting.option ? '正在搜索|答案不对加群反馈'+obj.data.qun : '正在搜索|当前积分剩余'+obj.data.num));
                    var answer = obj.data.answer.replace(/&/g, '&amp;').replace(/<([^i])/g, '&lt;$$1');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        '<td style="text-align: center;">' + setting.num + '</td>' +
                        '<td title="点击可复制">' + (postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        '<td title="点击可复制">' + obj.data.answer + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', ZhiHuiShuNewFillAnswer($TiMu.find('.optionUl').find('label'), obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').data('html', obj.msg).siblings('button:eq(1)').click();
                } else if (obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else {
                    setting.div.children('div:eq(0)').html('出现未知异常，请加群930561503反馈');
                }
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版本已发布！请点击油猴按钮【用户脚本检测更新】完成更新。').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').text('发生未知异常，出现未知异常，请加群930561503反馈');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').text('正在链接到云端，请稍后....<br>如果长时间链接不上出现未知异常，请加群930561503反馈');
        }
    });
}
function ZhiHuiShuNewFillAnswer($option,obj,postData){
    //真的是醉了，找个智慧树账号进行测试都这么难，目前只找到了  单选题/多选题/判断题   的题型
    //如果有热心的小伙伴可以提供智慧树账号给我测试QQ1666888816
    var str = String(obj.data.answer).toCDB(),
        data = str.split(/#|\x01|\|/),
        state = setting.lose;
    obj.data.success && $option.each(function(index){
        let tip = filterImg($$('.optionUl').find('label').eq(index).find('.optionContent'),this).toCDB()
        if (postData.type == 1){
            Boolean(($$.inArray(tip, data) + 1) || (str.indexOf(tip) + 1) || (tip.indexOf(str) + 1)) == Boolean($option.eq(index).attr('class').match('is-checked')) || setting.queue.push(this);
        } else if(postData.type == 3){
            console.log(111)
            tip = filterImg($$('.optionUl').find('label').eq(index).find('.el-radio__label'),this).toCDB()
            if (tip.match(/^(正确|是|对|√|T|ri)$/)) {
                data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push(this)
            } else if (tip.match(/^(错误|否|错|×|F|wr)$$/)) {
                data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push(this)
            }
        }else{
            Boolean($$.inArray(tip, data) + 1 || str.indexOf(tip) + 1 || tip.indexOf(str) + 1) && setting.queue.push(this);
        }
    })
    if (setting.queue.length) {
    } else if (/(0|1|3)/.test(postData.type)) {
        var $input = $option.find('input');
        $input.is(':checked') || (setting.none ? setting.queue.push($option.eq([Math.floor(Math.random() * $option.length)])) : setting.lose++);
    } else if (/^(2|4|5|9)$/.test(postData.type)) {

    } else {
        setting.none || setting.lose++;
    }
    setTimeout(function(){
        setting.jump && $$('.Topicswitchingbtn:contains(下一题)').click()
    },setting.time)

    if(setting.num == $$('.questionNumber-div').text().match(/\d+/)[0]) setting.div.children('div:eq(0)').data('html', '答题已完成').siblings('button:eq(1)').hide().click()
    return state == setting.lose ? true : reportProblem(postData);
}
function ZHSfindAnswer() {
    if (setting.queue.length) {
        return;
    } else if (!$$('.answerCard').length) {
        return setting.div.children('div:eq(0)').data('html', '非自动答题页面').siblings('button:eq(1)').click();
    } else if (setting.num >= $$('.subject_stem').length) {
        let tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
        return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(1), form').hide().click();
    } else if (!setting.curs.length) {
        setting.curs = $$('.infoList span').map(function() {
            return $$(this).text().trim();
        });
        if (!setting.curs.length) return;
    }
    var $$TiMu = $$('.subject_stem').eq(setting.num).parent(),
        type = $$TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1],
        postData = {
            question: filterStyle($$TiMu.find('.subject_describe')).replace(/\+/g,"%2B").replace(/\&/g,"%26"),
            option: filterStyle($$('.examPaper_subject').eq(setting.num).find('.node_detail')).replace(/\s+/,' ').replace(/\+/g,"%2B").replace(/\&/g,"%26") || '',
            type: type ? setting.type[type] : 10
        }
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option='+ encodeURI(postData.option) + '&type='+ postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    setting.div.children('div:eq(0)').text((!userSetting.option ? '正在搜索|答案不对加群反馈'+obj.data.qun : '正在搜索|当前积分剩余'+obj.data.num));
                    var answer = obj.data.answer.replace(/&/g, '&amp;').replace(/<([^i])/g, '&lt;$$1');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        '<td style="text-align: center;">' + $$TiMu.find('.subject_num').text().trim().replace('.', '') + '</td>' +
                        '<td title="点击可复制">' + (postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        '<td title="点击可复制">' + obj.data.answer + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', ZHSfillAnswer($$TiMu, obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').data('html', obj.msg).siblings('button:eq(1)').click();
                } else if (obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else {
                    setting.div.children('div:eq(0)').html('发生未知异常，出现未知异常，请加群930561503反馈');
                }
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版本已发布！请点击油猴按钮【用户脚本检测更新】完成更新。').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').text('发生未知异常，出现未知异常，请加群930561503反馈');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').text('正在链接到云端，请稍后....<br>如果长时间链接不上请请加群930561503反馈');
        }
    });
}

function ZHSfillAnswer($$TiMu, obj, postData) {
    var $$div = $$TiMu.find('.nodeLab'),
        str = String(obj.data.answer).toCDB(),
        answer = str.split(/#|\x01|\|/),
        state = setting.lose;
    obj.data.success && $$div.each(function() {
        var $$input = $$('input', this)[0],
            tip = filterStyle('.node_detail', this).toCDB() || new Date().toString();
        if (tip.match(/^(正确|是|对|√|T|ri)$$/)) {
            answer.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($$input);
        } else if (tip.match(/^(错误|否|错|×|F|wr)$$/)) {
            answer.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($$input);
        } else if (postData.type == 1) {
            Boolean($$.inArray(tip, answer) + 1 || str.indexOf(tip) + 1) == $$input.checked || setting.queue.push($$input);
        } else {
            $$.inArray(tip, answer) + 1 && setting.queue.push($$input);
        }
    });
    if (setting.queue.length) {
    } else if (/^(0|1|3)$/.test(postData.type)) {
        var $$input = $$div.find('input');
        $$input.is(':checked') || (setting.none ? setting.queue.push($$input[Math.floor(Math.random() * $$input.length)]) : setting.lose++);
    } else if (/^(2|4|5|9)$/.test(postData.type)) {
        answer = String(obj.data.answer).split(/#|\x01|\|/);
        str = $$TiMu.find('textarea').each(function(index) {
            index = (obj.data.success && answer[index]) || '';
            this.value = index.trim();
            this.dispatchEvent(new Event('input'));
            this.dispatchEvent(new Event('blur'));
        }).length;
        (obj.data.success && answer.length == str) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose ? true : reportProblem(postData);
}

function hookHiexam() {
    var ajax = new xhr();
    ajax.onload = function() {
        if (this.status != 200 || !this.responseURL.match('getDoQuestSingle')) return;
        var obj = JSON.parse(this.responseText).rt;
        $$.each(obj.questionOptionList || [], function(index) {
            var $$input = $$('.TitleOptions-div input')[index];
            if (obj.questionTypeId == 1) {
                this.isCorrect && setting.queue.push($$input);
            } else if (obj.questionTypeId == 2) {
                this.isCorrect == $$input.checked || setting.queue.push($$input);
            }
        });
    };
    return ajax;
}

function filterStyle(dom, that) {
    var $$dom = $$(dom, that).clone().find('style').remove().end();
    return $$dom.find('img[src]').replaceWith(function() {
        return $$('<p></p>').text('<img src="' + $$(this).attr('src') + '">');
    }).end().text().trim();
}

function ExamFillAnswer(obj, postData) {
    let tip;
    var $$input = $$(':radio, :checkbox', '.Cy_ulBottom'),
        flag = false,
        str = String(obj.data.answer).toCDB(),
        data = str.split(/#|\x01|\|/),
        btn = $$('.saveYl:contains(下一题)').offset();
    obj.data.success && $$input.each(function(index) {
        if (this.value == 'true') {
            if(data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/)){
                this.click();
                flag = true;
            }
        } else if (this.value == 'false') {
            if(data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/)){
                this.click();
                flag = true;
            }
        } else {
            index = postData.$li[index].toCDB()
            index = $$.inArray(index, data) + 1 || (postData.type == 1 && str.indexOf(index) + 1);
            if(Boolean(index)) flag = true;
            Boolean(index) == this.checked || this.click();
        }
    }).each(function() {
        if (!/^A?B?C?D?E?F?G?$/.test(str)) return false;
        if(str.match(this.value)) flag = true;
        Boolean(str.match(this.value)) == this.checked || this.click();
    });
    if (postData.type.match(/^[013]$/)) {
        tip = $$input.is(':checked') || setting.none && (($$input[Math.floor(Math.random() * $$input.length)] || $$()).click(), ' ');
    } else if (postData.type.match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.data.answer).split(/#|\x01|\|/);
        tip = $$('.Cy_ulTk textarea').each(function(index) {
            index = (obj.code == 200 && data[index]) || '';
            obj.data.success ? UE.getEditor(this.name).setContent(index.trim()) : ''
        }).length;
        tip = (obj.data.success && data.length == tip) || setting.none && ' ';
        setting.len = str.length * setting.time / 10;
    }
    if (tip == ' ') {
        tip = '已执行默认操作';
    } else if (tip) {
        flag = true;
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
            _self.event = $$.extend(true, {}, mouse);
            delete _self.event.isTrusted;
            _self.getTheNextQuestion(1);
        }, setting.len || Math.ceil(setting.time * Math.random()) * 2);
    } else {
        setting.$$btn.eq(1).hide();
        tip = '答题已完成，请自行查看答题详情';
    }
    setting.$$div.data('html', tip).siblings('button:eq(1)').hide().click();
    return flag ? true : reportProblem(postData);
}

function ExamFindTiMu() {
    let postData = {
        question: filterImg('.Cy_TItle .clearfix').replace(/\s*（\d+\.\d+分）$/, '').replace(/\+/g,"%2B").replace(/\&/g,"%26"),
        option: filterImg('.Cy_ulTop').replace(/、/g,'').replace(/\s+/g,' ').replace(/\+/g,"%2B").replace(/\&/g,"%26"),
        type: $$('[name^=type]:not([id])').val() || '10',
        $li: Array.prototype.slice.call($$('li .clearfix').map(function() {
            return filterImg(this);
        }))
    }
    GM_xmlhttpRequest({
        method: 'POST',
        url :domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option=' + encodeURI(postData.option) + '&type=' + postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    var answer = String(obj.data.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;'),
                        que = postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        '<td title="点击可复制">' + que + '</td>' +
                        '<td title="点击可复制">' + obj.data.answer + '</td>' +
                        '<td title="积分剩余">' +obj.data.num + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color',ExamFillAnswer(obj,postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                } else if (obj.code == 102 || obj.code == 305){
                    setting.$$div.data('html', obj.message).siblings('button:eq(1)').click();
                }else if(obj.code == 110 || obj.code == 104){
                    setting.$$div.html(obj.msg);
                }else{
                    setting.$$div.html('出现未知异常，请联系QQ1666888816');
                }
            } else if (xhr.status == 403) {
                setting.$$div.data('html', '由于你的请求过于频繁，您的ip已被封<br>10分钟后自动解封<br>或者使用收费题库答题不限制请求次数').siblings('button:eq(1)').click();
            } else if (xhr.status == 404) {
                setting.$$div.data('html', '最新版本已发布！请点击油猴按钮【用户脚本检测更新】完成更新。').siblings('button:eq(1)').click();
            } else {
                setting.$$div.html('出现bug，请加群930561503反馈');
            }
        },
        ontimeout: function() {
            setting.loop && setting.$$div.html('正在链接到云端，请稍后....<br>如果长时间链接不上请加群930561503反馈');
        }
    });
}

function Exam(){
    setting.div = $$(
        '<div id = "setting" style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: #FF7F00; overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<img src="http://lyck6.cn/img/6.png" width="100%" />'+
        '设置手机号:<input id="phonenum" type="text name="phone" value='+GM_getValue('phone')+'>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">目前默认搜索|'+(userSetting.option ? '收费题库':'免费题库')+'<br>更改默认设置请修改脚本参数option<br>临时更改点击下方按钮</div>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;' + (setting.jump ? '' : ' display: none;') + '">点击停止本次切换</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">答题详情</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (userSetting.option ? '取消请求收费题库' : '开启请求收费题库') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<button  style="background-color:  #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">拓展功能</button>' +
        '<div style="max-height: 200px; overflow-y: auto;">' +
        '<table border="1" style="font-size: 12px;">' +
        '<thead>' +
        '<tr>' +
        '<th colspan="2">' + ($$('#randomOptions').val() == 'false' ? '' : '<font color="red">本次考试的选项为乱序 脚本会选择正确的选项</font>') + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
        '<th style="min-width: 130px;">积分明细（剩余）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="' + (setting.jump ? ' display: none;' : '') + '">' +
        '<tr>' +
        '<th colspan="2">已关闭 本次自动切换</th>' +
        '</tr>' +
        '</tfoot>' +
        '<tbody>' +
        '<tr>' +
        '<td colspan="2" style="display: none;"></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var num = setting.$$btn.index(this);
        if (num == -1) {
            GM_setClipboard($$(this).text());
        } else if (num === 0){
            GM_setValue('phone',document.getElementById('phonenum').value)
        } else if (num === 1) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                num = ['已暂停搜索'+(userSetting.option ? '收费题库':'免费题库'), '继续答题'];
            } else {
                setting.loop = setInterval(ExamFindTiMu, setting.time);
                num = ['正在搜索'+(+userSetting.option ? '收费题库':'免费题库') ,'暂停答题'];
            }
            setting.$$div.html(function() {
                return $$(this).data('html') || num[0];
            }).removeData('html');
            $$(this).html(num[1]);
        } else if (num == 2) {
            setting.jump = 0;
            setting.$$div.html(function() {
                return arguments[1].replace('即将切换下一题', '未开启自动切换');
            });
            setting.div.find('tfoot').add(this).toggle();
        } else if (num == 3) {
            location.reload();
        } else if (num == 5) {
            userSetting.option = !userSetting.option;
            $$(this).html(userSetting.option ? '取消请求收费题库' : '开启请求收费题库');
            GM_setValue('userSetting',userSetting)
        } else if (num == 4) {
            ($$('.leftCard .saveYl')[0] || $$()).click();
        } else if (num == 6) {
            window.open("http://lyck6.cn/pay?phone="+ GM_getValue('phone'));
        } else if (num == 7){
            window.open('http://lyck6.cn/login')
        }
    }).detach(setting.hide ? '*' : 'html');
    setting.$$btn = setting.div.children('button');
    setting.$$div = setting.div.children('div:eq(0)');
    if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
    $$.each(UE.instants, function() {
        var key = this.key;
        this.ready(function() {
            this.destroy();
            UE.getEditor(key);
        });
    });
    setting.loop = setInterval(ExamFindTiMu, setting.time);
}

function ZhiJiaoYunBeforeFind() {
    setting.div = $$(
        '<div style="box-shadow: darkgrey 10px 10px 10px 5px;border: 0.5px solid #666;width: 330px;background-color: #FF7F00; position: fixed; top:; z-index: 99999;">' +
        '<span style="font-size: medium;"></span>' +
        '<img src="https://d13file.680.com/task/2020-12/15/32020121518061206152_9664591.png" width="100%" />'+
        '请输入月卡号:<input id="phone" type="text name="phone" value='+ GM_getValue('phone') + '>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">目前默认搜索|'+(userSetting.option ? '收费题库':'收费题库')+'<br>隐藏方块版请关注公众号“狗崽崽1”<br>月卡13.99元既可体验隐藏版</div>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (setting.auto ? '取消本次自动提交' : '开启本次自动提交') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (userSetting.option ? '取消请求收费题库' : '开启请求收费题库') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">折叠面板</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">不能操作</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">拓展功能</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1"  style="font-size: 12px;color:black;background-color:#FF7F00;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 25px; min-width: 25px;">题号</th>' +
        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="display: none;">' +
        '<tr>' +
        '<th colspan="3">答案提示框 已折叠</th>' +
        '</tr>' +
        '</tfoot>' +
        '<tbody style="overflow-y: scroll;80px;">'+
        '<tr>' +

        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var len = $$(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $$(this).prev().length && GM_setClipboard($$(this).text());
        } else if (!$$(this).siblings().length) {
            $$(this).parent().text('正在搜索|防止失联建议更多学习内容请关注公众号“狗崽崽1”');
            setting.num++;
        } else if (len === 0){
            GM_setValue('phone',$$("#phone").val())
        }else if (len === 1) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = ['已暂停搜索'+(+userSetting.option ? '收费题库':'收费题库'), '继续答题'];
            } else {
                if(location.pathname == '/study/directory/dir_course.html' || location.pathname == '/study/works/works.html'){
                    setting.loop = setInterval(GreenZhiJiaoYunFindAnswer, setting.time);
                }else{
                    setting.loop = setInterval(ZhiJiaoYunFindAnswer, setting.time);
                }
                len = ['正在搜索'+(+userSetting.option ? '收费题库':'收费题库'), '暂停答题'];
            }
            setting.div.children('div:eq(0)').html(function() {
                return $$(this).data('html') || len[0];
            }).removeData('html');
            $$(this).html(len[1]);
        } else if (len == 2) {
            setting.auto = !setting.auto;
            $$(this).html(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 3) {
            userSetting.option = !userSetting.option;
            $$(this).html(userSetting.option ? '取消请求收费题库' : '开启请求收费题库');
            GM_setValue('userSetting',userSetting)
        } else if (len == 4) {
            parent.location.reload();
        }else if (len == 5) {
            setting.div.find('tbody, tfoot').toggle();
        }else if (len == 6) {
            window.open("http://lyck6.cn/pay?phone="+ GM_getValue('phone'));
        } else if (len == 7){
            window.open('http://lyck6.cn/login')
        }
    }).find('table, td, th').css('border', '1px solid').end().detach(setting.hide ? '*' : 'html');
    setting.lose = setting.num = 0;
    setting.over = '<button style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 80px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;">跳过此题</button>';
    if(location.pathname == '/study/directory/dir_course.html' || location.pathname == '/study/works/works.html'){
        setting.loop = setInterval(GreenZhiJiaoYunFindAnswer, setting.time);
    }else{
        setting.loop = setInterval(ZhiJiaoYunFindAnswer, setting.time);
    }
    setInterval(function() {$$(setting.queue.shift()).click();}, 1E3);
}
function ZhiJiaoYunFindAnswer(){
    var $TiMu = $('.center-all');
    let postData = {
        question: filterImg($TiMu.find('.e-q-body').eq(setting.num).find('.e-q-quest').find('.e-q-q').eq(0)).replace(/\s+/g,' ').replace(/\+/g,"%2B").replace(/\&/g,"%26"),
        option: filterImg($TiMu.find('.e-a-g').eq(setting.num),this).replace(/\s+/g,' ').replace(/\+/g,"%2B").replace(/\&/g,"%26"),
        type: setting.type[$TiMu.find('.quiz-type').eq(setting.num).text().replace(/\s+/g,'')]
    }
    if(setting.num >= $TiMu.find('.e-q-body').length){
        let tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
        return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(1), form').hide().click();
    }
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option='+ encodeURI(postData.option) + '&type=' + postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    userSetting.option ? setting.div.children('div:eq(0)').text('正在搜索收费题库--当前积分剩余：'+obj.data.num):setting.div.children('div:eq(0)').text('正在搜索收费题库|防止失联建议更多学习内容请关注公众号“狗崽崽1”'+obj.data.qun);
                    var td = '<td style="border: 1px solid" colspan="1" font-size: 1.1em;text-align: left;',
                        answer = String(obj.data.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        td + ' text-align: center;">' + (parseInt(setting.num) + 1) + '</td>' +
                        td + '" title="点击可复制">' + (postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + obj.data.answer +'</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color',ZhiJiaoYunFillAnswer($TiMu.find('.e-q-body').eq(setting.num).find('.e-a'), obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++;
                } else if(obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').data('html', obj.msg).siblings('button:eq(1)').click();
                } else{
                    setting.div.children('div:eq(0)').html('发现未知异常，请联系请关注公众号“狗崽崽1”').siblings('button:eq(1)').click();;
                }
                //setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版已发布！请点击油猴按钮【用户脚本检查更新】完成更新！').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').html('发现未知异常，请关注公众号“狗崽崽1”反馈');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '正在链接到云端，请稍后....<br>如果长时间链接不上请请关注公众号“狗崽崽1”反馈');
        }
    });
}

function ZhiJiaoYunFillAnswer($option,obj ,postData){
    var str = String(obj.data.answer).toCDB(),
        data = str.split(/#|\x01|\|/),
        state = setting.lose,
        flag = false;
    obj.code == 200 && $option.each(function() {
        let tip = String(filterImg($(this).find('div'))).toCDB();
        if (postData.type == 3 && String(filterImg($(this))).toCDB().match(/(正确|是|对|√|T|ri)$/)) {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push(this);
        } else if (postData.type == 3 && String(filterImg($(this))).toCDB().match(/(错误|否|错|×|F|wr)$/)) {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push(this);
        } else if (postData.type == 1) {
            Boolean($$.inArray(tip, data) + 1 || str.indexOf(tip) + 1) == Boolean($$(this).attr('class').match('checked')) || setting.queue.push(this);
        } else {
            $$.inArray(tip, data) + 1 && setting.queue.push(this);
        }
    });
    if (setting.queue.length) {
    } else if (/^(0|1|3)$/.test(postData.type)) {
        Boolean($$('.center-all').find('.e-q-body').find('form').eq(setting.num).find("input[name='answer']").val()) || (setting.none ? setting.queue.push($option[Math.floor(Math.random() * $option.length)]) : setting.lose++);
    } else if (/^(2)$/.test(postData.type)) {
        //暂时没有人提供其他类型的题目
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose ? true : reportProblem(postData);
}

function reportProblem(data){
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/report' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
    return false;
}
function getGreenZhiJiaoYunData(){
    var $TiMu = $('#container');
    var data = $TiMu.find('.preview_item').map(function(){
        return {
            question: filterImg($(this).find('.preview_cm').find('div:first')).replace(/\s+/,' '),
            course: '青版智慧职教'
        }
    })
    var typelist = []
    $TiMu.find('.panel_title').each(function(){
        var title = filterImg(this)
        let type = title.match(/(\S*)题/)[0];
        let Tnum = title.match(/共(\d+)题/)[1];
        for (let i =0;i<Tnum;i++){
            typelist.push(type)
        }
    })
    for(let index = 0;index<data.length;index++){
        data[index].type = setting.type[typelist[index]]
    }
    data = $.grep(data.map(function(index){
        if(this.type == 0 || this.type == 1){
            this.option = Array.prototype.slice.call($TiMu.find('.preview_choices').eq(index).find('li').map(function(){
                return {
                    key: filterImg(this).match(/[A-G]/)[0],
                    option: filterImg($(this).find('.preview_cont:last')).replace(/\s+/,' ')
                }
            }))
        }
        return this
    }),function(value){return value})
    return data;
}

function GreenZhiJiaoYunFindAnswer(){
    let data = getGreenZhiJiaoYunData();
    if(setting.num >= data.length){
        let tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）<br>刷新页面此脚本搜索框会自动消失' : '答题已完成<br>刷新页面此脚本搜索框会自动消失';
        return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(1), form').hide().click();
    }
    let postData = data[setting.num];
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question.replace(/\+/g,"%2B").replace(/\&/g,"%26")) + '&option='+ encodeURI(JSON.stringify(postData.option.replace(/\+/g,"%2B").replace(/\&/g,"%26")) || '') + '&type=' + postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    userSetting.option ? setting.div.children('div:eq(0)').text('正在搜索收费题库--当前积分剩余：'+obj.data.num):setting.div.children('div:eq(0)').text('正在搜索免费题库|防止失联建议加群'+obj.data.qun);
                    var td = '<td style="border: 1px solid" colspan="1" font-size: 1.1em;text-align: left;',
                        answer = String(obj.data.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        td + ' text-align: center;">' + (parseInt(setting.num) + 1) + '</td>' +
                        td + '" title="点击可复制">' + (postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + obj.data.answer +'</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color',GreenZhiJiaoYunFillAnswer($('#container').find('.preview_choices').eq(setting.num).find('li'), obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++;
                } else if(obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else{
                    setting.div.children('div:eq(0)').html('发现未知异常，请加群930561503反馈').siblings('button:eq(1)').click();;
                }
                //setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                setting.div.children('div:eq(0)').data('html', '由于你的请求过于频繁，您的ip已被封<br>10分钟后自动解封<br>或者使用收费答题不限制请求次数').siblings('button:eq(1)').click();
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版已发布！请点击油猴按钮【用户脚本检查更新】完成更新！').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').html('发现未知异常，请加群930561503反馈');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '正在链接到云端，请稍后....<br>如果长时间链接不上请加群930561503反馈');
        }
    });
}

function GreenZhiJiaoYunFillAnswer($option,obj ,postData){
    var str = String(obj.data.answer).toCDB(),
        data = str.split(/#|\x01|\|/),
        state = setting.lose,
        flag = false;
    obj.data.success && $option.each(function() {
        let tip = String(filterImg($(this).find('.preview_cont:last'))).toCDB();
        if (postData.type == 3 && String(filterImg($(this))).toCDB().match(/(正确|是|对|√|T|ri)$/)) {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($(this).find('span').eq(0).find('input'));
        } else if (postData.type == 3 && String(filterImg($(this))).toCDB().match(/(错误|否|错|×|F|wr)$/)) {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($(this).find('span').eq(0).find('input'));
        } else if (postData.type == 1) {
            Boolean($$.inArray(tip, data) + 1 || str.indexOf(tip) + 1) == Boolean($$(this).find('.preview_cont:first').find('input').attr('checked')) || setting.queue.push($(this).find('span').eq(0).find('input'));
        } else {
            $$.inArray(tip, data) + 1 && setting.queue.push($(this).find('span').eq(0).find('input'));
        }
    });
    if (setting.queue.length) {
    } else if (/^(0|1|3)$/.test(postData.type)) {
        $$(this).find('.preview_cont:first').find('input').attr('checked') || (setting.none ? setting.queue.push($option.eq([Math.floor(Math.random() * $option.length)]).find('span').eq(0).find('input')) : setting.lose++);
    } else if (/^(2)$/.test(postData.type)) {
        //暂时没有人提供其他类型的题目
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose ? true : reportProblem(postData);
}

function YiBinBeforeFind() {
    setting.div = $$(
        '<div style="box-shadow: darkgrey 10px 10px 10px 5px;border: 0.5px solid #666;width: 330px;background-color: #FF7F00; position: fixed; top: 100px; right: 300px; z-index: 99999;">' +
        '<span style="font-size: medium;"></span>' +
        '<img src="http://lyck6.cn/img/6.png" width="100%" />'+
        '设置手机号:<input id="phone" type="text name="phone" value='+ GM_getValue('phone') + '>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">目前默认搜索|'+(userSetting.option ? '收费题库':'免费题库')+'<br>更改默认设置请修改脚本参数option<br>临时更改点击下方按钮</div>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (setting.auto ? '取消本次自动提交' : '开启本次自动提交') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (userSetting.option ? '取消请求收费题库' : '开启请求收费题库') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">折叠面板</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">拓展功能</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1"  style="font-size: 12px;color:black;background-color:#FF7F00;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 25px; min-width: 25px;">题号</th>' +
        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="display: none;">' +
        '<tr>' +
        '<th colspan="3">答案提示框 已折叠</th>' +
        '</tr>' +
        '</tfoot>' +
        '<tbody style="overflow-y: scroll;80px;">'+
        '<tr>' +

        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var len = $$(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $$(this).prev().length && GM_setClipboard($$(this).text());
        } else if (!$$(this).siblings().length) {
            $$(this).parent().text('正在搜索|防止失联建议加群1102188986');
            setting.num++;
        } else if (len === 0){
            GM_setValue('phone',$$("#phone").val())
        }else if (len === 1) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = ['已暂停搜索'+(+userSetting.option ? '收费题库':'免费题库'), '继续答题'];
            } else {
                setting.loop = setInterval(YiBinFindAnswer, setting.time);
                len = ['正在搜索'+(+userSetting.option ? '收费题库':'免费题库'), '暂停答题'];
            }
            setting.div.children('div:eq(0)').html(function() {
                return $$(this).data('html') || len[0];
            }).removeData('html');
            $$(this).html(len[1]);
        } else if (len == 2) {
            setting.auto = !setting.auto;
            $$(this).html(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 3) {
            userSetting.option = !userSetting.option;
            $$(this).html(userSetting.option ? '取消请求收费题库' : '开启请求收费题库');
            GM_setValue('userSetting',userSetting)
        } else if (len == 4) {
            parent.location.reload();
        }else if (len == 5) {
            setting.div.find('tbody, tfoot').toggle();
        }else if (len == 6) {
            window.open("http://lyck6.cn/pay?phone="+ GM_getValue('phone'));
        } else if (len == 7){
            window.open('http://lyck6.cn/login')
        }
    }).find('table, td, th').css('border', '1px solid').end().detach(setting.hide ? '*' : 'html');
    setting.lose = setting.num = 0;
    setting.over = '<button style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 80px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;">跳过此题</button>';
    setting.loop = setInterval(YiBinFindAnswer, setting.time);
    setInterval(function() {$$(setting.queue.shift()).find('span:first').find('a').click();}, 1E3);
}

function YiBinFindAnswer(){
    var $TiMu = $('.view-test').eq(setting.num);
    var typeText = $TiMu.find('.test-header').text().trim().match(/^\[(\S*)\]/);
    if(setting.num >= $('.test-text-tutami').length){
        let tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）<br>刷新页面此脚本搜索框会自动消失' : '答题已完成<br>刷新页面此脚本搜索框会自动消失';
        return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(1), form').hide().click();
    }
    let postData = {
        question: filterImg($TiMu.find('.test-text-tutami'),this),
        option: filterImg($TiMu.find('.test-options'),this),
        type: typeText ? setting.type[typeText[1]] : 10
    }
    console.log(parseInt(setting.num))
    if($('.main').find('.practice-no').find('a').eq(parseInt(setting.num)).click())console.log(1111111111111111)
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? GM_getValue('phone') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option='+ encodeURI(JSON.stringify(postData.option) || '') + '&type=' + postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    userSetting.option ? setting.div.children('div:eq(0)').text('正在搜索收费题库--当前积分剩余：'+obj.data.num):setting.div.children('div:eq(0)').text('正在搜索免费题库|防止失联建议加群'+obj.data.qun);
                    var td = '<td style="border: 1px solid" colspan="1" font-size: 1.1em;text-align: left;',
                        answer = String(obj.data.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        td + ' text-align: center;">' + (parseInt(setting.num) + 1) + '</td>' +
                        td + '" title="点击可复制">' + (postData.question.match('<img') ? postData.question : postData.question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + obj.data.answer +'</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color',YiBinFillAnswer($TiMu.find('.test-options').find('.t-option'), obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++;
                } else if(obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').data('html', obj.msg).siblings('button:eq(1)').click();
                } else{
                    setting.div.children('div:eq(0)').html('发现未知异常，请加群930561503反馈').siblings('button:eq(1)').click();;
                }
                //setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版已发布！请点击油猴按钮【用户脚本检查更新】完成更新！').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').html('发现未知异常，请加群930561503反馈');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '正在链接到云端，请稍后....<br>如果长时间链接不上请加群930561503反馈');
        }
    });
}

function YiBinFillAnswer($option,obj ,postData){
    var str = String(obj.data.answer).toCDB().replace(/;$/,''),
        data = str.split(/#|\x01|\|/),
        state = setting.lose,
        flag = false;
    obj.data.success && $option.each(function() {
        let tip = String(filterImg($$(this).find('p'))).toCDB().replace(/;$/,'');
        if (tip.match(/(正确|是|对|√|T|ri)$/)) {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push(this);
        } else if (tip.match(/(错误|否|错|×|F|wr)$/)) {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push(this);
        } else if (postData.type == 1) {
            Boolean($$.inArray(tip, data) + 1 || str.indexOf(tip) + 1) == Boolean($$(this).find('.selected').length) || setting.queue.push(this);
        } else {
            $$.inArray(tip, data) + 1 && setting.queue.push(this);
        }
    });
    if (setting.queue.length) {
    } else if (/^(0|1|3)$/.test(postData.type)) {
        Boolean($option.find('.selected').length) || (setting.none ? setting.queue.push($option.eq([Math.floor(Math.random() * $option.length)])) : setting.lose++);
    } else if (/^(2)$/.test(postData.type)) {
        //暂时没有人提供其他类型的题目
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose ? true : reportProblem(postData);
}
function YuKeTangFillAnswer($option,obj,postData){
    var str = String(obj.data.answer).toCDB(),
        data = str.split(/#|\x01|\|/),
        flag = false;
    $option.each(function(index){
        //多选题
        if(postData.type == 1){
            let tip = filterImg($option.find('.checkboxText').eq(index),this).toCDB();
            //如果有匹配答案
            if(Boolean($.inArray(tip, data)+1 || str.indexOf(tip)+1)){
                $option.find('.el-checkbox span:eq(0)').eq(index).attr('class').match('is-checked') ? '' : setTimeout(function(){$option.find('.checkboxText').eq(index).click();},setting.time/50)
                flag = true;
            }else if((!Boolean($.inArray(tip, data)+1 || str.indexOf(tip)+1) || tip.indexOf(str)+1) && $option.find('.el-checkbox span:eq(0)').eq(index).attr('class').match('is-checked')){
                setTimeout(function(){$option.find('.checkboxText').eq(index).click();},setting.time/50)
            }
        }else if (postData.type == 0){
            let tip = filterImg($option.find('.radioText').eq(index),this).toCDB();
            if(Boolean($.inArray(tip, data)+1 || str.indexOf(tip)+1)){
                setTimeout(function(){$option.find('.radioText').eq(index).click();},setting.time/50)
                flag = true;
            }
        }
    })
    if(setting.num == $('.aside-body').find('.list-inline li').size()) setting.div.children('div:eq(0)').data('html', '答题已完成').siblings('button:eq(1)').hide().click();
    flag ? setting.auto && setTimeout(function(){$('.el-button:contains(提交)').click()},setting.time/3) : '';
    setting.jump && setTimeout(function(){$('.el-button:contains(下一题)').click()},setting.time);
    return flag ? true : reportProblem(postData);
}

function YuKeTangFindAnswer() {
    var
    question = filterImg('.problem-body',this).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/,'').replace(/（\s*）。$/,'').replace(/[(]\s*[)]$/,'').replace(/（\s*）$/,''),
        title = $('.item-type').text(),
        type = 10,
        option = filterImg($('.container-problem').find('ul:eq(0)').find('li'),this).replace(/\s+/g,' ')
    setting.num = parseInt(title.match(/\d+/)[0]);

    if(title.match('单选题')){
        type = 0
    } else if(title.match('多选题')){
        type = 1
    }
    let postData = {
        question: question,
        option: option,
        type: type
    }
    GM_xmlhttpRequest({
        method: 'POST',
        url : domain + (userSetting.option ? (GM_getValue('phone') || setting.token || 'undefined') : '0'),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURI(postData.question) + '&option='+ encodeURI(postData.option) + '&type=' + postData.type,
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $$.parseJSON(xhr.responseText) || {};
                if (obj.code == 200) {
                    userSetting.option ? setting.div.children('div:eq(0)').text('正在搜索token题库--当前积分剩余：'+obj.data.num):setting.div.children('div:eq(0)').text('正在搜索免费题库|防止失联建议加群'+obj.data.qun);
                    var td = '<td colspan="1" font-size: 1.1em;text-align: left;background-color: #A7C942;color: #ffffff;',
                        answer = String(obj.data.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.data.answer = /^http/.test(answer) ? '<img src="' + obj.data.answer + '">' : obj.data.answer;
                    $$(
                        '<tr>' +
                        td + ' text-align: center;">' + setting.num + '</td>' +
                        td + '" title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        td + '" title="点击可复制">' + obj.data.answer +'</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', YuKeTangFillAnswer($('.container-problem').find('ul:eq(0)').find('li'), obj, postData) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++;
                } else if(obj.code == 110 || obj.code == 104){
                    setting.div.children('div:eq(0)').html(obj.msg);
                } else if (obj.code == 102 || obj.code == 305){
                    setting.div.children('div:eq(0)').data('html', obj.msg).siblings('button:eq(1)').click();
                    //window.open('http://lyck6.cn/api/regist.php')
                } else{
                    setting.div.children('div:eq(0)').html('发现未知异常，请联系QQ1666888816报告反馈bug').siblings('button:eq(1)').click();;
                }
                //setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                setting.div.children('div:eq(0)').data('html', '由于你的请求过于频繁，您的ip已被封<br>10分钟后自动解封<br>或者使用token答题不限制请求次数').siblings('button:eq(1)').click();
            } else if (xhr.status == 404) {
                setting.div.children('div:eq(0)').data('html', '最新版已发布！请点击油猴按钮【用户脚本检查更新】完成更新！').siblings('button:eq(1)').click();
            }else {
                setting.div.children('div:eq(0)').html('发现未知异常，请联系QQ1666888816处理');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '正在链接到云端，请稍后....<br>如果长时间链接不上请联系QQ1666888816');
        }
    });
}
function YuKeTangBeforeFind(){
    setting.div = $(
        '<div style="box-shadow: darkgrey 10px 10px 10px 5px;border: 0.5px solid #666;width: 330px;background-color: #FF7F00; position: fixed; top: 100px; right: 0; z-index: 99999;">' +
        '<span style="font-size: medium;"></span>' +
        '<img src="http://lyck6.cn/img/6.png" width="100%" />'+
        '设置token(手机号):<input id="phone" type="text name="token" value=' + GM_getValue('phone') + '>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">目前默认搜索|'+(userSetting.option ? 'token题库':'免费题库')+'<br>更改默认设置请修改脚本参数option<br>临时更改点击下方按钮</div>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (setting.auto ? '取消本次自动提交' : '开启本次自动提交') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">' + (userSetting.option ? '取消请求token题库' : '开启请求token题库') + '</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">折叠面板</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<button  style="background-color: #4CAF50;border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">拓展功能</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1"  style="font-size: 12px;color:black;background-color:#FF7F00;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 25px; min-width: 25px;">题号</th>' +
        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="display: none;">' +
        '<tr>' +
        '<th colspan="3">答案提示框 已折叠</th>' +
        '</tr>' +
        '</tfoot>' +
        '<tbody style="overflow-y: scroll;80px;">'+
        '<tr>' +
        '<td colspan="3" style="display: none;"></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var len = $$(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $$(this).prev().length && GM_setClipboard($$(this).text());
        } else if (!$$(this).siblings().length) {
            $$(this).parent().text('正在搜索|防止失联建议加群1102188986');
            setting.num++;
        } else if (len == 0){
            GM_setValue('phone',$$("#phone").val())
        }else if (len == 1) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = ['已暂停搜索'+(+userSetting.option ? 'token题库':'免费题库'), '继续答题'];
            } else {
                setting.loop = setInterval(YuKeTangFindAnswer, setting.time * 2);
                len = ['正在搜索'+(+userSetting.option ? 'token题库':'免费题库'), '暂停答题'];
            }
            setting.div.children('div:eq(0)').html(function() {
                return $$(this).data('html') || len[0];
            }).removeData('html');
            $$(this).html(len[1]);
        } else if (len == 2) {
            setting.auto = !setting.auto;
            $$(this).html(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 3) {
            userSetting.option = !userSetting.option;
            $$(this).html(userSetting.option ? '取消请求token题库' : '开启请求token题库');
            GM_setValue('userSetting',userSetting)
        } else if (len == 4) {
            parent.location.reload();
        }else if (len == 5) {
            setting.div.find('tbody, tfoot').toggle();
        }else if (len == 6) {
            window.open("http://lyck6.cn/pay?phone="+ GM_getValue('phone'));
        }else if (len == 7){
            window.open('http://lyck6.cn/login')
        }
    }).find('table, td, th').css('border', '1px solid').end().detach(setting.hide ? '*' : 'html');
    setting.lose = setting.num =0;
    setting.loop = setInterval(YuKeTangFindAnswer, setting.time * 2);
    setInterval(YuKeTangSubmitAnswer,1500)
}

function NewGetAnswer(host,type){
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://' + location.host + '/exam_room/show_paper?exam_id=' + location.pathname.split('/')[2],
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        onload: function(xhr){
            var obj = $.parseJSON(xhr.responseText)
            GetAnswer(host,type,obj.data.problems)
        }
    })
}
function addAnswer(i,an,op,num){
    var td = '<td colspan="1" font-size: 1.1em;text-align: left;background-color: #A7C942;color: #ffffff;';
    $(
        '<tr>' +
        td + ' text-align: center;">' + i + '</td>' +
        td + '" title="点击可复制">' + an + '</td>' +
        td + '" title="点击可复制">' + op +'</td>' +
        '</tr>'
    ).appendTo(setting.div.find('tbody'));
}

function addnum(x,y){
    var td = '<td colspan="1" font-size: 1.1em;text-align: left;background-color: #A7C942;color: #ffffff;';
    $(
        '<tr>' +
        td + ' text-align: center;">积分</td>' +
        td + ' text-align: center;">本次花费'+ x + '</td>' +
        td + ' text-align: center;">积分剩余'+ y + '</td>' +
        '</tr>'
    ).appendTo(setting.div.find('tfoot'));
}

function GetAnswer(host,type,question,option){
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/ykt/' + host + '/' + type + '/' + ({4: location.pathname.split('/')[4],5: location.pathname.split('/')[2]})[type] ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'question=' + encodeURIComponent(JSON.stringify(question)) + '&classid=' +setting.classid + '&sessionid=' +setting.sessionid + '&phone=' + (GM_getValue('phone') || setting.token)+'&version=new',
        onload: function(xhr){
            var obj = $.parseJSON(xhr.responseText)
            if (obj.code == 200){
                addnum(obj.data.hua,obj.data.num)
                for(var a = 0;a<obj.data.answer.length;a++){
                    addAnswer(a+1,obj.data.answer[a],obj.data.option[a] || '');
                }
            }else{
                if(obj.code == 101){
                    setting.div.children('div:eq(0)').html("我建议你先刷新一下页面，如果还出现该原因，那么原因可能是服务器缓存的信息过期失效，需要你在本地填写信息。或者你在本地填写了classid和sessionid，但是你没有填写对，注意classid要写你自己创建的课程id哦，如果不会可以点击下面的使用帮助，有提示让你怎么写sessionid和classid的，耐心看一下哈，你肯定可以的！！")
                    addAnswer(1,obj.msg,'');
                } else if (obj.code == 103){
                    setting.div.children('div:eq(0)').html("token验证失败，或者我们服务器中没有你的token请注册，点击下方按钮【申请token】")
                    addAnswer(1,obj.msg,'');
                } else if (obj.code == 104){
                    setting.div.children('div:eq(0)').html("我们帮你查询到了答案，但是你的积分不足，请充值之后再进行查询，点击下方按钮【获取积分】")
                    addAnswer(1,obj.msg,'');
                }else{
                    setting.div.children('div:eq(0)').html("发生未知异常，请刷新页面重新获取，还是不行请联系作者qq：1666888816进行报告反馈bug，感谢你的支持")
                }
            }
        }
    })
}

function YKTfindAnswer(){
    setting.div = $(
        '<div style="box-shadow: darkgrey 10px 10px 10px 5px;border: 0.5px solid #666;width: 350px;background-color: #FF7F00; position: fixed; top: 100px; right: 0; z-index: 99999;">' +
        '<span style="font-size: medium;"></span>' +
        '<img src="http://lyck6.cn/img/6.png" width="100%" />'+
        '设置token(手机号):<input id="phone" type="text name="token" value='+GM_getValue('phone')+'>'+
        '<button id="button" type="submit">确定</button>'+
        '<div style="color: bule;background: #B0E2FF;;font-size: 15px;margin-bottom: 1%;">脚本已处理好选项及题目乱序自行选择答题即可<br>↑箭头可临时移除搜索框</div>' +
        //  '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">查询token</button>' +
        //   '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">申请token</button>' +
        '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">使用方法</button>' +
        '<button  style="background-color: #4CAF50;/* Green */border: none;margin: 1%;color: white;width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">获取积分</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1"  style="font-size: 12px;color:black;background-color:#FF7F00;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 30px; min-width: 30px;">题号</th>' +
        '<th style="width: 60%; min-width: 130px;">答案（旧版无乱序）</th>' +
        '<th style="min-width: 130px;">选项（新版防乱序）</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody style="overflow-y: auto;80px;">'+
        '<tr>' +
        '<td colspan="3" style="display: none;"></td>' +
        '</tr>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<td colspan="3" style="display: none;"></td>' +
        '</tr>' +
        '</tfoot>' +
        '</table>' +
        '</div>' +
        '</div>'
    ).appendTo('#app').on('click', 'button, td', function() {
        var len = $(this).prevAll('button').length;
        if(len == 0){
            GM_setValue('phone',$$("#phone").val())
        }else if (len == 1) {
            window.open("http://lyck6.cn/help");
        }else if (len == 2) {
            window.open("http://lyck6.cn/pay");
        }
    }).find('table, td, th').css('border', '1px solid').end().detach(setting.hide ? '*' : 'html');

    if (location.host == 'www.yuketang.cn' && location.pathname.match('studentQuiz')){
        GetAnswer('www',4);
    }else if(location.host =='changjiang.yuketang.cn' && location.pathname.match('studentQuiz')){
        GetAnswer('changjiang',4);
    }else if(location.host =='examination.xuetangx.com'){
        NewGetAnswer('www',5)
    }else if(location.host =='changjiang-exam.yuketang.cn'){
        NewGetAnswer('changjiang',5)
    }
}

function YuKeTangSubmitAnswer(){
    var data = [],
        title = $('.item-type').text(),
        type = 10;
    data[0] = {
        'course':'雨课堂'
    }
    if(title.match('单选题')){
        type = 0
    } else if(title.match('多选题')){
        type = 1
    }
    let keyArr = $('.problem-remark').text().match(/[A-G]/gi) || [];
    var key = keyArr.join('');
    var answer = $$.map(keyArr, function(value) {
        return filterImg($('.container-problem').find('ul:eq(0)').find('li').eq(({'A':0, 'B': 1,'C':2,'D':3,'E':4,'F':5,'G':6})[value]).find(type == 1 ? '.checkboxText': '.radioText'),this)
    }).join('#')
    data[0].question = filterImg('.problem-body',this).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/,'').replace(/（\s*）。$/,'').replace(/[(]\s*[)]$/,'').replace(/（\s*）$/,'');
    data[0].type = type;
    data[0].key = key;
    data[0].answer = answer;
    var optionList =[]
    var option = $$.map($(type == 1 ? '.checkboxInput': '.radioInput').text().match(/[A-G]/gi), function(value) {
        return filterImg($('.container-problem').find('ul:eq(0)').find('li').eq(({'A':0, 'B': 1,'C':2,'D':3,'E':4,'F':5,'G':6})[value]).find(type == 1 ? '.checkboxText': '.radioText'),this)
    })
    for(let i = 0;i<option.length;i++){
        let dict = {}
        dict.key = $(type == 1 ? '.checkboxInput': '.radioInput').text().match(/[A-G]/gi)[i];
        dict.value = option[i]
        optionList.push(dict)
    }
    data[0].option = optionList;
    data[0].answer && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/upload' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
}

function SubmitExamAnswer(){
    var data=[]
    data = $$('.TiMu').map(function() {
        var title = filterImg($$('.Cy_TItle .clearfix', this));
        return {
            question: title.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' ').trim(),
            type: -1,
            course: $$('.cur a').text().trim() || '无'
        };
    });
    var list=new Array();
    var typelist =$$('.Cy_TItle1')
    for(var i = 0;i<typelist.length;i++){
        var typechar = typelist.eq(i).find('h2').text().replace(/\s+/g,'').replace(/\n/g,'').match(/、(.*)（/)[1];
        var questionnum= typelist.eq(i).find('h2').text().replace(/\s+/g,'').replace(/\n/g,'').match(/：(.*)，/)[1];
        for(var j = 0;j<questionnum;j++){
            list.push(typechar)
        }
    }
    for(var k= 0;k<list.length;k++){
        switch(list[k]){
            case '单选题': data[k].type=0; break;
            case '多选题': data[k].type=1; break;
            case '填空题': data[k].type=2; break;
            case '判断题': data[k].type=3; break;
            case '简答题': data[k].type=10; break;
            case '计算题': data[k].type=10; break;
        }
    }
    data = $$.grep(data.map(function(index) {
        var $$TiMu = $$('.TiMu').eq(index);
        if($$('.CyTop1').text().replace(/\s+/g, '').indexOf('待批阅')!= -1){
            return false;
        }else if (this.type == 2) {
            var $$ans = $$TiMu.find('.Py_tk, .Py_answer').eq(0);
            //做错并且没有找到正确答案的情况下
            if (($$TiMu.find('.cuo').length || filterImg($$TiMu.find('.font18'), this) == '0.0') && !filterImg($$TiMu.find('.Py_tk'),this).match('正确答案')) {
                return false;
            } else if (filterImg($$TiMu.find('.fl'), this).match(/\s*（\d+\.\d+分）/)[0].replace('分','').replace('（','').replace('）','') == filterImg($$TiMu.find('.font18'), this) || $$ans.find('.dui').length || filterImg($$TiMu.find('.Py_tk'),this).match('正确答案')) {
                this.answer = $$ans.find('.font14').map(function() {
                    return filterImg($$(this))
                }).get().join('#').replace(/第(\S*)空：\s+/g,'').replace(/\s+/g, ' ').replace('正确答案#','').replace('正确答案：#','').replace(/(^\s*)|(\s*$)/g, "").replace(/我的答案:#\s/g, '').replace(/#\s/g, '#').trim()
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var an = $$TiMu.find('.Py_answer > span:eq(0)').text().replace(/\s+/g,'');
            if (an.match('正确答案')) {
                this.answer = ({'×': '错误', '√': '正确'})[an.replace('正确答案：','')];
            } else if (an.match('我的答案') && ($$TiMu.find('.dui').length || filterImg($$TiMu.find('.fl'), this).match(/\s*（\d+\.\d+分）$$/)[0].replace('分','').replace('（','').replace('）','') == filterImg($$TiMu.find('.font18'), this))) {
                this.answer = ({'√': '正确', '×': '错误'})[an.replace('我的答案：','')];
            } else if (an.match('我的答案') && ($$TiMu.find('.cuo').length || filterImg($$TiMu.find('.font18'), this) == '0.0')) {
                this.answer = ({'√': '错误', '×': '正确'})[an.replace('我的答案：','')];
            } else {
                return false;
            }
        } else if (this.type == 10){
            if($$TiMu.find('.font14').text().match('正确答案')){
                var da =filterImg($$TiMu.find('.font14'), this).replace(/\s+/g, ' ').match(/正确答案(.*)我的答案/)[1].replace(/(^\s*)|(\s*$)/g, '').replace('：','')
                var jiexi =filterImg($$TiMu.find('.pingyu'), this)
                if(da==''){
                    return false
                } else{
                    this.answer=da
                    this.key=jiexi
                }
            }else{
                return false
            }
        }else if (this.type == 1 || this.type == 0){
            var text = $$TiMu.find('.Py_answer > span:eq(0)').text();
            if ($$TiMu.find('.dui').length || text.match('正确答案') || filterImg($$TiMu.find('.fl'), this).match(/\s*（\d+\.\d+分）/)[0].replace('分','').replace('（','').replace('）','') == filterImg($$TiMu.find('.font18'), this)) {
                text = text.match(/[A-G]/gi) || [];
                this.answer = $$.map(text, function(value) {
                    return filterImg($$TiMu.find('.clearfix > a:eq('+({'A': '0', 'B': '1','C': '2','D': '3','E': '4','F': '5','G': '6'})[value]+')'));
                }).join('#') || '无';
                this.key = text.join('');

                var key = $$TiMu.find('.fl').text().match(/[A-G]/gi) || [];

                var option = $$.map(key, function(value) {
                    return filterImg($$TiMu.find('.clearfix > a:eq('+({'A': '0', 'B': '1','C': '2','D': '3','E': '4','F': '5','G': '6'})[value]+')'));
                })

                var optionList = []
                for(let z=0;z<key.length;z++){
                    let dict={};
                    dict.key =key[z];
                    dict.value = option[z];
                    optionList.push(dict)
                }
                this.option = optionList;
            }else {
                return false;
            }
        } else{
            return false;
        }
        return this;
    }), function(value) {
        return value && value.answer != '无' && value.answer != '' && value.answer != null
    });


    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/upload' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
}
function getInfo(){
    if(location.pathname == '/settings/info'){
        var data = {
            "uid":document.cookie.match(/UID=(\S*);/)[1].replace(";","") || document.cookie.match(/UID=(\S*);/)[1].replace(";",""),
            "name":document.getElementsByClassName('zt_u_name')[0].textContent,
            "phone":document.getElementById('resetphonespac').textContent,
            "sex":document.getElementById('male').checked ? '男': '女',
            "school":document.title.replace('账号管理--- ',''),
            "sid":document.getElementById('resetIDspac').textContent,
            "sign":hex_md5(document.cookie.match(/UID=(\S*);/)[1].replace(";","")+document.getElementById('resetIDspac').textContent)
        }
        var pubkey='-----BEGIN PUBLIC KEY-----'+
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvKThaQoR9DAQCnse4PFx'+
            '5QYafOANEYhzd7FTYFmc4RZDDg2P/f5suG386rNjN1ML+o7y/i5zWfEtya7uAfUF'+
            'MLECib8hISJt9gBBYl9GMkls4U+VT5AKDJ/Tf4bR/aygD1WJ8YsrDOzFksn2h/d1'+
            'mkMlXhtt0ALn3ovy+nchF71ovaYED/XivT9gQn/UXPqco4NgKCMS/erQrc0oJ+Gf'+
            'Y+z6eJofMfJjRxzRq8uyRKe953gjCES9ysiYCGjDoKZQK4cwJBYZfr3nbvW7qcMC'+
            'h8FDKOV8sk3evmM3d3Aph01/oImuc7tYiwmIDSh/4iiMpTwULwwttMzrSMB3aODr'+
            'BwIDAQAB'+
            '-----END PUBLIC KEY-----'
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubkey);
        var encrypted = encrypt.encrypt(JSON.stringify(data));
        GM_setValue('uid',data.uid)
        GM_setValue('phone',data.phone)
        var infodata = {
            "token": encrypted,
            "sign": hex_md5(encrypted)
        }
        return infodata
    }
}
function uploadInfo(data){
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/upload/info' ,
        headers: {
            'Content-type': 'application/json'
        },
        data: JSON.stringify(data)
    });
}
function submitAnswer() {
    var data=[]
    data = $$('.TiMu').map(function() {
        var title = filterImg($$('.Zy_TItle .clearfix', this)).trim();
        return {
            question: title.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' '),
            type: ({'单选题': 0, '多选题': 1, '填空题': 2, '判断题': 3, '$typeName': -1})[title.match(/^【(.*?)】|$/)[1]],
            course: $$('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $$('h1').text().trim() || '无'
        };
    });
    if(data[0].type==null){
        var a=new Array();
        var f=$$('.Cy_TItle1')
        for(var i = 0;i<f.length;i++){
            var s = f.eq(i).find('h2').text().match(/\.(\S*)（/)[1];
            var e = f.eq(i).find('h2').text().match(/共(\S*)题/)[1];
            for(var j = 0;j<e;j++){
                a.push(s)
            }
        }
        for(var k= 0;k<data.length;k++){
            switch(a[k]){
                case '单选题': data[k].type=0; break;
                case '多选题': data[k].type=1; break;
                case '填空题': data[k].type=2; break;
                case '判断题': data[k].type=3; break;
                case '简答题': data[k].type=10; break;
                case '计算题': data[k].type=10; break;
            }
        }
    }
    if(data[0].type == -1){
        location.reload();
    }
    data = $$.grep(data.map(function(index) {
        var $$TiMu = $$('.TiMu').eq(index);
        if(this.type == -1){
            return false;
        } else if (this.type == 2) {
            var $$ans = $$TiMu.find('.Py_tk, .Py_answer').eq(0);
            //如果该题做错并且没有找到正确答案
            if($$ans.find('.cuo').length && !$$('.font14').text().match('正确答案')){
                return false;
                //如果该题作对
            } else if ($$ans.find('.dui').length) {
                this.answer = $$ans.find('.clearfix').map(function() {
                    return $$(this).text().trim();
                }).get().join('#') || '无';
                //如果该题有正确答案
            } else if ($$('.font14').text().match('正确答案')) {
                this.answer = $$ans.find('.font14').map(function() {
                    return filterImg($$(this))
                }).get().join('#').replace(/第(\S*)空：\s+/g,'').replace(/\s+/g, ' ').replace('正确答案：#','').replace('正确答案#','').replace(/(^\s*)|(\s*$)/g, '').replace(/我的答案:#\s/g, '').replace(/#\s/g, '#').trim()
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var an = $$TiMu.find('.Py_answer > span:eq(0)').text().replace(/\s+/g,'');
            if (an.match('正确答案')) {
                this.answer = ({'×': '错误', '√': '正确'})[an.replace('正确答案：','')];
            } else if (an.match('我的答案') && $$TiMu.find('.dui').length) {
                this.answer = ({'√': '正确', '×': '错误'})[an.replace('我的答案：','')];
            } else if (an.match('我的答案') && $$TiMu.find('.cuo').length) {
                this.answer = ({'√': '错误', '×': '正确'})[an.replace('我的答案：','')];
            } else if (an.match('得分')){
                var dui = $$TiMu.find('.Py_answer > span:eq(1)').text().replace(/\s+/g,'');
                if (dui.match('正确答案')) {
                    this.answer = ({'×': '错误', '√': '正确'})[dui.replace('正确答案：','')];
                } else{
                    return false;
                }
            } else{
                return false
            }
        } else if (this.type == 10){
            if($$TiMu.find('.font14').text().match('正确答案')){
                var t =filterImg($$TiMu.find('.font14'), this).match(/正确答案：\s(.*)我的答案/)[1].replace(/(^\s*)|(\s*$)/g, '')
                var p =filterImg($$TiMu.find('.pingyu'), this)
                if(t==''){
                    return false
                } else{
                    this.answer=t
                    this.key=p
                }
            }else{
                return false
            }
        }else if(this.type == 0 || this.type ==1){
            var text = $$TiMu.find('.Py_answer > span:eq(0)').text();
            if ($$TiMu.find('.dui').length || text.match('正确答案')) {
                text = text.match(/[A-G]/gi) || [];
                this.answer = $$.map(text, function(value) {
                    return filterImg($$TiMu.find('.fl:contains(' + value + ') + a'));
                }).join('#') || '无';
                this.key = text.join('');

                var key = $$TiMu.find('.clearfix > i').text().match(/[A-G]/gi) || [];

                var option = $$.map(key, function(value) {
                    return filterImg($$TiMu.find('.fl:contains(' + value + ') + a'));
                })

                var optionList = []
                for(let z=0;z<key.length;z++){
                    let dict={};
                    dict.key =key[z];
                    dict.value = option[z];
                    optionList.push(dict)
                }
                this.option = optionList;
            } else {
                return false;
            }
        }else{
            return false;
        }
        return this;
    }), function(value) {
        return value && value.answer != '无' && value.answer != '' && value.answer != null;
    });
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/upload' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
}

function ZhiHuiShuSubmitAnswer(){
    var $TiMuBox = $('.Classificationquestionall-box');

    //所有得选项列表
    var $All = $TiMuBox.find('.subjecttype-div')

    var data = $All.map(function(index){
        return {
            question: filterImg($All.eq(index).find('.subjectTitle-p')).replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' ').replace(/^（\S*）/,'').trim(),
            type: parseInt(({'单选题': 0, '多选题': 1, '填空题': 2, '判断题': 3, '$typeName': -1})[filterImg($All.eq(index).find('.subjecttopic-div'),this).match(/【(\S*)】/)[1]]),
            course: '知到智慧树',
        }
    })

    data = $.grep(data.map(function(index){
        //每个题得选项列表
        var $optionAll = $All.eq(index).find('.TitleOptions-div'),keyList,optionList;

        optionList = [];
        keyList = [];

        if(this.type === 0){
            this.option = Array.prototype.slice.call($optionAll.map(function(){
                return {
                    key: filterImg($(this).find('.Choicecontent-l-span')).match(/[A-G]/)[0],
                    option: filterImg($(this).find('.Choicecontent-span'))
                };
            }), 0);
            //如果这道题作对了
            if($All.eq(index).find('.Answerdiv').find('.zhihuishu-Z-dui').length){
                $optionAll.map(function(){
                    if($(this).find('label').attr('aria-checked')){
                        data[index].key = filterImg($(this).find('.Choicecontent-l-span')).match(/[A-G]/)[0];
                        data[index].answer = filterImg($(this).find('.Choicecontent-span'));
                    }
                })
                //如果有参考答案
            } else if($All.eq(index).find('.Referenceanswer-div').text().match('参考答案')){
                let key = this.key = ($All.eq(index).find('.Referenceanswer-r').text().match(/[A-G]/gi))[0];
                this.answer = filterImg($optionAll.find('.fl:contains(' + key + ') + span'));
            } else{
                return false
            }
        }
        else if(this.type === 1){
            this.option = Array.prototype.slice.call($optionAll.map(function(){
                return {
                    key: filterImg($(this).find('.multiselection-l-span')).match(/[A-G]/)[0],
                    option: filterImg($(this).find('.multiselectionspan'))
                };
            }), 0);
            //如果多选这个题作对了
            if($All.eq(index).find('.Answerdiv').find('.zhihuishu-Z-dui').length){
                let k=[],a=[];
                this.answer = $optionAll.map(function(){
                    if($(this).find('label').attr('class').match('is-checked')){
                        k.push(filterImg($(this).find('.multiselection-l-span')).match(/[A-G]/)[0])
                        a.push(filterImg($(this).find('.multiselectionspan')))
                    }
                })
                this.key = k.join('')
                this.answer = a.join('#')
            } else if($All.eq(index).find('.Referenceanswer-div').text().match('参考答案')){
                let key = ($All.eq(index).find('.Referenceanswer-r').text().match(/[A-G]/gi));
                this.answer = key.map(function(value) {
                    return filterImg($optionAll.find('.fl:contains(' + value + ') + span'));
                }).join('#');
                this.key = key.join('');
            }else{
                return false
            }
        }else if (this.type === 3){
            //如果作对，那么就是这个选项
            if($All.eq(index).find('.Answerdiv').find('.zhihuishu-Z-dui').length){
                $optionAll.find('li').map(function(){
                    if($(this).find('label').attr('class').match('is-checked')){
                        data[index].answer = $(this).find('.el-radio__label').text()
                    }
                })
                //如果做错那么反选
            }else if ($All.eq(index).find('.Answerdiv').find('.zhihuishu-Z-cuo').length){
                $optionAll.find('li').map(function(){
                    if(!$(this).find('label').attr('class').match('is-checked')){
                        data[index].answer = $(this).find('.el-radio__label').text()
                    }
                })
            } else{
                return false;
            }
        }else{
            return false;
        }
        return this
    }),function(value){
        return value && value.answer != '无' && value.answer != null && value.answer != ''
    })

    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/upload' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
}

function ZhiJiaoYunSubmitAnswer(){
    var $TiMu = $('#container');
    var data = $TiMu.find('.e-q-body').map(function(index){
        return {
            question: filterImg($(this).find('.e-q-quest').find('.e-q-q').eq(0)).replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' ').replace(/^（\S*）/,'').trim(),
            type: parseInt(({'单选题': 0, '多选题': 1, '填空题': 2, '判断题': 3, '$typeName': -1})[filterImg($(this).find('.quiz-type')).replace(/\s+/g,'')]),
            course: '智慧职教MOOC学院',
        }
    })
    data = $.grep(data.map(function(index){
        //每个题得选项列表
        var $optionAll = $TiMu.find('.e-q-body').eq(index).find('.e-a-g').find('li'),keyList=[],answerList=[];
        if(this.type === 0 || this.type === 1){
            this.option = Array.prototype.slice.call($optionAll.map(function(){
                return {
                    key: filterImg($(this)).match(/[A-G]/)[0],
                    option: filterImg($(this).find('.ErichText'))
                };
            }), 0);
            if($TiMu.find('.e-q-body').eq(index).find('.e-q-right').length){
                $optionAll.map(function(){
                    if($(this).attr('class').match('checked')){
                        keyList.push(filterImg($(this)).match(/[A-G]/)[0]);
                        answerList.push(filterImg($(this).find('.ErichText')));
                    }
                })
                this.key = keyList.join('');
                this.answer = answerList.join('#')
            }else if($TiMu.find('.e-q-body').eq(index).find('.e-ans-ref').text().match('参考答案')){
                let key = $TiMu.find('.e-q-body').eq(index).find('.e-ans-ref').text().match(/[A-G]/gi)
                this.answer = $.map(key, function(value) {
                    return filterImg($optionAll.find('.ErichText').eq(({A:0,B:1,C:2,D:3,E:4,F:5})[value]));
                }).join('#') || '无';
                this.key = key.join('')
            }else{
                return false;
            }
        } else if(this.type === 3){
            $optionAll = $TiMu.find('.e-a-g').eq(index).find('li')
            if($TiMu.find('.e-q-body').eq(index).find('.e-q-right').length){
                $optionAll.each(function(){
                    if($(this).attr('class').match('checked')){
                        data[index].answer = filterImg(this).match(/(正确|错误|对|错|√|×)/)[0] || '';
                    }
                })
            }else if ($TiMu.find('.e-q-body').eq(index).find('.e-q-wrong').length){
                $optionAll.each(function(){
                    if(!$(this).attr('class').match('checked')){
                        data[index].answer = filterImg(this).match(/(正确|错误|对|错|√|×)/)[0] || '';
                    }
                })
            }else if($TiMu.find('.e-q-body').eq(index).find('.e-ans-ref').text().match('参考答案')){
                this.answer = String($TiMu.find('.e-q-body').eq(index).find('.e-ans-ref').text()).match(/(正确|错误|对|错|√|×)/)[0] || '';
            } else{
                return false
            }
        } else{
            return false;
        }
        return this
    }),function(value){
        return value && value.answer != '无' && value.answer != null && value.answer != ''
    })
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/upload' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
}
function GreenZhiJiaoYunSubmitAnswer(data){
    let $TiMu = $('.view_text_con').find('.preview_cm');
    for (let index = 0; index<data.length;index++){
        if(data[index].type == 0 || data[index].type == 1){
            let key = $TiMu.eq(index).find('.answer:first').text().replace(/\s+/g,'').match(/[A-G]/gi);
            data[index].answer = $.map(key, function(value) {
                return filterImg($TiMu.find('.preview_choices').eq(index).find('li').find('.preview_cont:last').eq(({A:0,B:1,C:2,D:3,E:4,F:5})[value])).replace(/\s+/,' ');
            }).join('#');
            data[index].key = key.join('');

        }else if(data[index].type == 3){
            data[index].answer = $TiMu.eq(index).find('.answer:first').text().replace(/\s+/g,'').match(/答案：(\S*)/)[1]
        }else{
            data[index].answer = '';
        }
    }
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://lyck6.cn/api/upload' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'data=' + encodeURI(JSON.stringify(data).replace(/\+/g,"%2B").replace(/\&/g,"%26"))
    });
}