// ==UserScript==
// @name         💯Muketool超星学习通网课助手💸可永久免费使用所有功能🔍AI搜题全网聚合题库💻视频音频文档挂机，任务点自动切换📝章节测试可自动搜题，自动保存，自动提交✅试题还原解密，可一键复制
// @namespace    Muketool
// @version      2.3.3
// @description  👆👆👆👆👆👆👆 🥇操作简单🥇超星尔雅MOOC自动挂机，无需配置安装即可使用。🎗️功能齐全🎗️支持视频、音频、文档、图书自动完成；章节测验自动答题、自动提交，支持自动切换任务点、挂机阅读时长、自动登录等。🎁独家题库🎁独家丰富试题库，精准识别，答案全对。🏆功能扩展🏆解除各类功能限制，解除字体加密，支持下载视频、pdf文档，开放自定义参数
// @author       Muketool
// @match        *://*.chaoxing.com/*
// @connect      greasyfork.org
// @connect      api.muketool.com
// @connect      api2.muketool.com
// @connect      static.muketool.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @antifeature  ads
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://static.muketool.com/scripts/cx/v2/js/Typr.min.js#md5=2ac9c9459368259ca63b0968c613e525
// @require      https://static.muketool.com/scripts/cx/v2/js/Typr.U.min.js#md5=7fa27f07b2a19fbff3426bf5bfbaec2a
// @resource     CxSecretsFont https://static.muketool.com/scripts/cx/v2/fonts/cxsecret.json
// @resource     Layui https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/css/layui.min.css
// @resource     LayuiIconFont-woff2 https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff2
// @resource     LayuiIconFont-woff https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff
// @resource     LayuiIconFont-ttf https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.ttf
// @license      MIT
// @original-script https://greasyfork.org/scripts/369625
// @original-author wyn665817
// @original-license MIT
// @icon         https://static.muketool.com/scripts/cx/v2/images/icon.png
// @downloadURL https://update.greasyfork.org/scripts/426360/%F0%9F%92%AFMuketool%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%B8%E5%8F%AF%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%E6%89%80%E6%9C%89%E5%8A%9F%E8%83%BD%F0%9F%94%8DAI%E6%90%9C%E9%A2%98%E5%85%A8%E7%BD%91%E8%81%9A%E5%90%88%E9%A2%98%E5%BA%93%F0%9F%92%BB%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E6%96%87%E6%A1%A3%E6%8C%82%E6%9C%BA%EF%BC%8C%E4%BB%BB%E5%8A%A1%E7%82%B9%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%F0%9F%93%9D%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%E5%8F%AF%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E2%9C%85%E8%AF%95%E9%A2%98%E8%BF%98%E5%8E%9F%E8%A7%A3%E5%AF%86%EF%BC%8C%E5%8F%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/426360/%F0%9F%92%AFMuketool%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%F0%9F%92%B8%E5%8F%AF%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%E6%89%80%E6%9C%89%E5%8A%9F%E8%83%BD%F0%9F%94%8DAI%E6%90%9C%E9%A2%98%E5%85%A8%E7%BD%91%E8%81%9A%E5%90%88%E9%A2%98%E5%BA%93%F0%9F%92%BB%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E6%96%87%E6%A1%A3%E6%8C%82%E6%9C%BA%EF%BC%8C%E4%BB%BB%E5%8A%A1%E7%82%B9%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%F0%9F%93%9D%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%E5%8F%AF%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E2%9C%85%E8%AF%95%E9%A2%98%E8%BF%98%E5%8E%9F%E8%A7%A3%E5%AF%86%EF%BC%8C%E5%8F%AF.meta.js
// ==/UserScript==
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 这里是脚本的全局设置区域。内容为0代表功能关闭，内容为1代表功能开启，修改的时候不要删掉末尾的,号，否则脚本无法正常运行。
// 设置修改后，需要刷新或重新打开网课页面才会生效。
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var setting = {
    tiku: 'https://api.muketool.com',

    // 默认响应速度为8秒，不建议小于3秒，否则高峰期可能出现答题失败的情况。5E3 == 5000，科学记数法，表示毫秒数
    time: 8E3,
    // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频
    review: 0,
    // 队列模式，开启后任务点逐一完成，关闭则单页面所有任务点同时进行
    queue: 1,
    // 视频支持后台、切换窗口不暂停，支持多视频
    video: 1,
    // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率
    work: 1,
    // 音频自动播放，与视频功能共享vol和rate参数
    audio: 1,
    // 图书阅读任务点，非课程阅读任务点
    book: 1,
    // 文档阅读任务点，PPT类任务点自动完成阅读任务
    docs: 1,
    // 自动切换标签、章节、课程(需要配置course参数)
    jump: 1,
    // 挂机课程阅读时间，单位分钟
    read: '10',
    // 显示课程进度的统计数据，在学习进度页面的上方展示
    total: 1,

    ////////////////////////////////////////////////////////////////////
    // 仅开启video(audio)时，修改此处才会生效
    ////////////////////////////////////////////////////////////////////
    // 视频播放的默认资源线路
    line: '公网1',
    // 视频播放的默认清晰度
    http: '标清',
    // 默认音量的百分数，设定范围：[0,100]，'0'为静音
    vol: '0',
    // 倍速已经失效，建议一倍速看，多倍速会异常提示
    rate: '0',
    // 答题完成后自动保存，默认开启， 仅开启work时，修改此处才会生效
    auto_save: 1,
    // 答题完成后自动提交，默认关闭， 仅开启work时，修改此处才会生效
    auto_submit: 0,
    // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会暂时保存已作答的题目
    none: 0,
    // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小
    scale: 1,
    // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，默认关闭
    course: 0,
    // 跳过未开放(图标是锁)的章节，即闯关模式或定时发放的任务点，默认开启
    lock: 1,
    // 搜索历史记录
    search_history: 1,
},


    // 除非您知道如何正确修改代码，否则不要修改下方任意内容。如果不小心修改导致脚本运行异常，请删除脚本重新安装。


    _self = unsafeWindow,
    url = location.pathname,
    top = _self;
if (url != '/studyApp/studying' && top != _self.top) document.domain = location.host.replace(/.+?\./, '');
try {
    while (top != _self.top) {
        top = top.parent.document ? top.parent : _self.top;
        if (top.location.pathname.endsWith('/mycourse/studentstudy')) break;
    }
} catch (err) {
    top = _self;
}
if (GM_info.script.namespace != 'Muketool' || GM_info.script.author != 'Muketool' ){
    console.log("Muketool error...")
    return;
}
initMtSetting();

GM_addStyle(`
@import url(${GM_getResourceURL('Layui')});
`);
GM_addStyle(`
@font-face {
font-family: 'layui-icon';
src: url(${GM_getResourceURL('LayuiIconFont-woff2')}) format('woff2'),
 url(${GM_getResourceURL('LayuiIconFont-woff')}.woff) format('woff'),
 url(${GM_getResourceURL('LayuiIconFont-ttf')}) format('truetype');
font-weight: normal;
font-style: normal;
}

`);

var $ = _self.jQuery || top.jQuery,
    parent = _self == top ? self : _self.parent,
    Ext = _self.Ext || parent.Ext || {},
    UE = _self.UE,
    vjs = _self.videojs;

$('.Header').find('a:contains(回到旧版)')[0] ? $('.Header').find('a:contains(回到旧版)')[0].click() : '';
if (location.href.indexOf('mooc2=1') != -1) {
    location.href = location.href.replace('mooc2=1', 'mooc2=0');
}
String.prototype.toCDB = function () {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function (str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};
_self.alert = console.log;
setting.normal = '';
setting.job = [':not(*)'];
setting.video && setting.job.push('iframe[src*="/video/index.html"]');
setting.work && setting.job.push('iframe[src*="/work/index.html"]');
setting.audio && setting.job.push('iframe[src*="/audio/index.html"]');
setting.book && setting.job.push('iframe[src*="/innerbook/index.html"]');
setting.docs && setting.job.push('iframe[src*="/ppt/index.html"]', 'iframe[src*="/pdf/index.html"]');
if (url.endsWith('/mycourse/studentstudy')) {
    // checkUpdate();
    stopMouseout();
    showMtDashboard();
    switchToNormal();
    _self.checkMobileBrowerLearn = $.noop;
    var classId = location.search.match(/cla[zs]{2}id=(\d+)/i)[1] || 0,
        courseId = _self.courseId || location.search.match(/courseId=(\d+)/i)[1] || 0;
    !setting.jump || setting.lock || $('#coursetree').on('click', '[onclick*=void], [href*=void]', function () {
        _self.getTeacherAjax(courseId, classId, $(this).parent().attr('id').slice(3));
    });
} else if ((url.endsWith('/ananas/modules/video/index.html')) && setting.video) {
    switchToNormal();
    if (setting.review) _self.greenligth = Ext.emptyFn;
    passVideo();
} else if (url.endsWith('/work/doHomeWorkNew') || url == '/api/work' || url.endsWith('/work/addStudentWorkNewWeb')) {

    beforeFind();

    top.courseId = location.search.match(/courseId=(\d+)/i)[1];
    if (!UE) {
        var len = ($ || Ext.query || Array)('font:contains(未登录)', document).length;
        setTimeout(len == 1 ? top.location.reload : parent.greenligth, setting.time);
    } else if (setting.work) {
        setTimeout(relieveLimit, 0);
        // beforeFind();
    }
} else if ((url.endsWith('/ananas/modules/innerbook/index.html')) && setting.book) {
    setTimeout(function () {
        if (getTip()) _self.setting ? _self.top.onchangepage(_self.getFrameAttr('end')) : _self.greenligth();
    }, setting.time);
} else if (url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$/) && setting.docs) {
    setTimeout(function () {
        if (getTip()) _self.setting ? _self.finishJob() : _self.greenligth();
    }, setting.time);
    frameElement.setAttribute('download', 1);
    if (_self.downloadNum == '') _self.downloadNum = '1';
} else if (url.endsWith('/knowledge/cards')) {
    $ && checkToNext();
} else if (url.match(/^\/(course|zt)\/\d+\.html$/)) {
    setTimeout(function () {
        +setting.read && _self.sendLogs && $('.course_section:eq(0) .chapterText').click();
    }, setting.time);
} else if (url.endsWith('/ztnodedetailcontroller/visitnodedetail')) {
    setting.read *= 60 / $('.course_section').length;
    setting.read && _self.sendLogs && autoRead();
} else if (url.endsWith('/mycourse/studentcourse')) {
    var gv = location.search.match(/d=\d+&/g);
    setting.total && $('<a>', {
        href: '/moocAnalysis/chapterStatisticByUser?classI' + gv[1] + 'courseI' + gv[0] + 'userId=' + _self.getCookie('_uid') + '&ut=s',
        target: '_blank',
        title: '点击查看章节统计',
        style: 'margin: 0 25px;',
        html: '本课程共' + $('.icon').length + '节，剩余' + $('em:not(.openlock)').length + '节未完成'
    }).appendTo('.zt_logo').parent().width('auto');
} else if (location.hostname == 'i.mooc.chaoxing.com') { } else if (url.endsWith('/work/selectWorkQuestionYiPiYue')) {
    submitAnswer(getIframe().parent(), $.extend(true, [], parent._data));
} else if (url == '/exam-ans/exam/test') { };

function decryptText() {
    console.log('MT: fonts decrypted!')
    var $tip = $('style:contains(font-cxsecret)');
    if (!$tip.length) return;
    var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
    font = Typr.parse(base64ToUint8Array(font))[0];
    var CxSecretsFont = JSON.parse(GM_getResourceText('CxSecretsFont'));
    var match = {};
    for (var i = 19968; i < 40870; i++) {
        $tip = Typr.U.codeToGlyph(font, i);
        if (!$tip) continue;
        $tip = Typr.U.glyphToPath(font, $tip);
        $tip = $.md5(JSON.stringify($tip)).slice(24);
        match[i] = CxSecretsFont[$tip];
    }
    $('.font-cxsecret').html(function (index, html) {
        $.each(match, function (key, value) {
            key = String.fromCharCode(key);
            key = new RegExp(key, 'g');
            value = String.fromCharCode(value);
            html = html.replace(key, value);
        });
        return html;
    }).removeClass('font-cxsecret');

    function base64ToUint8Array(base64) {
        var data = window.atob(base64);
        var buffer = new Uint8Array(data.length);
        for (var i = 0; i < data.length; ++i) {
            buffer[i] = data.charCodeAt(i);
        }
        return buffer;
    }
}

function time_to_sec(time) {
    let s = 0;
    let t = 1;
    for (let i = time.split(':').length - 1; i >= 0; i--) {
        s += Number(time.split(':')[i]) * t
        t *= 60
    }
    return s;
};

function getTip() {
    return top != _self && jobSort($ || Ext.query);
}

function passVideo() {
    skipQuestion();
    getTip() && setTimeout(() => {
        let vd = $('video')[0];
        if (vd) {
            vd.volume = vd.volume === 0 ? 1 : 0;
            $('.vjs-big-play-button')[0].click();
        }
    }, 2000)
}

function jobSort($) {
    var fn = $.fn ? [getIframe(1), 'length'] : [self, 'dom'],
        sel = setting.job.join(', :not(.ans-job-finished) > .ans-job-icon' + setting.normal + ' ~ ');
    if (!getIframe()[fn[1]] || getIframe().parent().is('.ans-job-finished')) return 0;
    if (!setting.queue || $(sel, fn[0].parent.document)[0] == fn[0].frameElement) return 1;
    setInterval(function () {
        $(sel, fn[0].parent.document)[0] == fn[0].frameElement && fn[0].location.reload();
    }, setting.time);
}

function getIframe(tip, win, job) {
    if (!$) return Ext.get(frameElement || []).parent().child('.ans-job-icon') || Ext.get([]);
    do {
        win = win ? win.parent : _self;
        job = $(win.frameElement).prevAll('.ans-job-icon');
    } while (!job.length && win.parent.frameElement);
    return tip ? win : job;
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
    decryptText();
    setting.regl = parent.greenligth || $.noop;
    if ($.type(parent._data) == 'array') return setting.regl();
    switchToAnswering();
    let $mt_dashboard = _self.top.$('#mt-dashboard');
    setInterval(function () {
        // if (setting.work == 1) {
        if (setting.work == 1 && (setting.num <= $('.TiMu').length)) {
            findAnswer();
        }
    }, setting.time);
    $mt_dashboard.on('click', 'td', function () {
        $(this).prev().length && GM_setClipboard($(this).text());
    });
    $mt_dashboard.on('click', 'button', function () {
        const button_clicked = $(this).attr('id');
        if (button_clicked == 'mt-setting-button-1') {
            if (setting.work) {
                $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-pause"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">自动答题已暂停，您可在下方重新开启</span>');
                $('#mt-setting-button-1', $mt_dashboard).html('<i class="layui-icon layui-icon-close"></i>自动答题已暂停');
            } else {
                $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">正在拼命搜索试题答案中......</span>');
                $('#mt-setting-button-1', $mt_dashboard).html('<i class="layui-icon layui-icon-ok"></i>自动答题已开启');
            }
            setting.work = !setting.work;
        } else if (button_clicked == 'mt-setting-button-2') {

            var parentWindow = window.parent;
            if (!parentWindow) {
                console.log('没有父窗口');
                return;
            }

            var parentDocument = parentWindow.document;
            if (!parentDocument) {
                console.log('父窗口没有 document 对象');
                return;
            }


            var element = document.querySelector('#mt-setting-button-2');
            if (!element) {
                // 在子页面中无法找到该元素，尝试在父页面中查找
                var parentWindow = window.parent;
                var parentDocument = parentWindow.document;
                element = parentDocument.querySelector('#mt-setting-button-2');
            }


            // let $mt_dashboard = _self.top.jQuery('#mt-dashboard');
            GM_setValue('mtSetting_autoSubmit', !GM_getValue('mtSetting_autoSubmit'));
            console.log('自动提交已' + (GM_getValue('mtSetting_autoSubmit') ? '开启' : '关闭'));
            GM_getValue('mtSetting_autoSubmit') ? $('#mt-setting-button-2', $mt_dashboard).html('<i class="layui-icon layui-icon-ok"></i>自动提交已开启') : $('#mt-setting-button-2', $mt_dashboard).html('<i class="layui-icon layui-icon-close"></i>自动提交已关闭');


            if (GM_getValue('mtSetting_autoSubmit')) {
                alert('🚨警告🚨\n\n①您已经手动开启自动提交！答案一旦提交无法再修改！开启即代表您已知晓并接受其中的风险！\n②不建议开启此功能。脚本会自动保存已搜索到的答案，建议在答题结束后手动提交！\n③为保证安全，该功能仅在所有试题都搜索到答案时才会生效。');
            }

        } else if (button_clicked == 'mt-setting-button-3') {
            location.reload();
        } else if (button_clicked == 'mt-setting-button-4') {
            setting.search_history = !setting.search_history;
            setting.search_history ? $('#mt-setting-button-4', $mt_dashboard).html('<i class="layui-icon layui-icon-down"></i>') : $('#mt-setting-button-4', $mt_dashboard).html('<i class="layui-icon layui-icon-right"></i>');
            setting.search_history ? $('#mt-dashboard-history', $mt_dashboard).show() : $('#mt-dashboard-history', $mt_dashboard).hide();
            setting.search_history ? $('#mt-table-tips', $mt_dashboard).html('温馨提示：点击下方表格中的文字可直接复制。如果试题黄色高亮代表搜索到的答案不完全匹配建议手动搜索。') : $('#mt-table-tips', $mt_dashboard).html('搜题历史记录已隐藏，您可在上方重新开启');
        }
    });
    setting.lose = setting.num = 0;
    setting.data = parent._data = [];
    setting.over = '<button style="margin-right: 10px;">跳过此题</button>';
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:'(.+?)'|$/)[1] || $('h1').text().trim() || '无';
    var tip = ({
        undefined: '任务点排队中',
        0: '等待切换中'
    })[getTip()];
    tip && $('#mt-dashboard-status', $mt_dashboard).data('html', tip).siblings('button:eq(0)').click();
    if (tip) {
        $('#mt-dashboard-status', $mt_dashboard).html(tip);
        $mt_dashboard.siblings('button:eq(0)').click();
    }
}


function findAnswer() {
    let $mt_dashboard = _self.top.$('#mt-dashboard');
    console.log('正在搜索答案。总数：' + $('.TiMu').length + '，已搜索：' + setting.num + '，无答案：' + setting.lose);
    if (setting.num >= $('.TiMu').length) {
        if (setting.lose) {
            $('#mt-dashboard-status', $mt_dashboard).html(`<i class="layui-icon layui-icon-about"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold; color:red; ">有【${setting.lose}】道题目的答案不完全匹配，已在面板最下方黄色高亮显示，建议尝试手动搜索试题答案。30秒后将自动保存当前内容继续下一章节。</span>`);
        }
        if (!setting.lose && GM_getValue('mtSetting_autoSubmit')) {
            return setTimeout(submitThis, setting.time);
        }
        if (!setting.lose && setting.auto_save) {
            return setTimeout(saveThis, setting.time);
        }
        if (setting.lose && setting.auto_save) {
            console.log('存在无答案试题，等待30秒后继续下一章节');
            return setTimeout(saveThis, 30000);
        }
    }
    var $TiMu = $('.TiMu').eq(setting.num);
    var question = filterImg($TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, ''),
        type = $TiMu.find('input[name^=answertype]:eq(0)').val() || '-1';

    const course_name = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    GM_xmlhttpRequest({
        method: 'POST',
        url: setting.tiku + '/cx/v2/query',
        headers: {
            'Content-type': 'application/json'
        },
        data: JSON.stringify({
            question: encodeURIComponent(question),
            type: type,
            course: course_name,
        }),
        timeout: setting.time,
        onload: function (xhr) {
            if (!setting.work) { } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                obj.answer = obj.data;
                if (obj.code == 1) {
                    var answer = obj.answer.replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;');
                    obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                    $(
                        '<tr>' +
                        '<td class="layui-font-12" style="padding: 5px; line-height: 15px;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        '<td class="layui-font-12" style="padding: 5px; line-height: 15px;">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        '<td class="layui-font-12" style="padding: 5px; line-height: 15px;">' + (/^http/.test(answer) ? obj.answer : '') + obj.answer + '</td>' +
                        '</tr>'
                    ).appendTo($mt_dashboard.find('tbody')).css('background-color', fillAnswer($TiMu.find('ul:eq(0)').find('li'), obj, type) ? '' : '#FFC107');
                    setting.num++;
                } else {
                    $(
                        '<tr>' +
                        '<td class="layui-font-12" style="padding: 5px; line-height: 15px;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        '<td class="layui-font-12" style="padding: 5px; line-height: 15px;">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                        '<td class="layui-font-12" style="padding: 5px; line-height: 15px;">' + obj.msg + '</td>' +
                        '</tr>'
                    ).appendTo($mt_dashboard.find('tbody')).css('background-color', '#FFC107');
                    setting.loop++;
                    setting.num++;
                    setting.lose++;
                }


            } else if (xhr.status == 403) {
                $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-close-fill"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">试题搜索失败，可能是当前试题含有特殊字符或者搜索次数过于频繁导致，请尝试稍后重新搜索或暂时跳过当前章节。</span>')


            } else {
                $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-close-fill"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">Muketool服务器连接异常，可能是正常维护或被攻击，请稍后重试......</span>')
            }
        },
        ontimeout: function () {
            $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-close-fill"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">Muketool服务器连接异常，可能是正常维护或被攻击，请稍后重试......</span>')
        }
    });
}

function fillAnswer($li, obj, type) {
    var $input = $li.find(':radio, :checkbox'),
        str = String(obj.data).toCDB() || new Date().toString(),
        data = str.split(/#|\x01|\|/),
        opt = obj.opt || str,
        state = setting.lose;
    obj.code > 0 && $input.each(function (index) {
        if (this.value == 'true') {
            data.join().match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/) && this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/) && this.click();
        } else {
            var tip = filterImg($li.eq(index).find('.after')).toCDB() || new Date().toString();
            Boolean($.inArray(tip, data) + 1 || (type == '1' && str.indexOf(tip) + 1)) == this.checked || this.click();
        }
    }).each(function () {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this.checked || this.click();
    });
    if (type.match(/^[013]$/)) {
        $input.is(':checked') || (setting.none ? ($input[Math.floor(Math.random() * $input.length)] || $()).click() : setting.lose++);
    } else if (type.match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.data).split(/#|\x01|\|/);
        str = $li.end().find('textarea').each(function (index) {
            index = (obj.code > 0 && data[index]) || this.value || '';
            UE.getEditor(this.name).setContent(index.trim());
        }).length;
        (obj.code == 1 && data.length == str) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}

function saveThis() {
    if (!setting.auto_save) return setTimeout(saveThis, setting.time);
    $('#tempsave').click();
    console.log('答题信息已保存');
    setting.regl();
}

function submitThis() {
    if (!GM_getValue('mtSetting_autoSubmit')) { } else if (!$('.Btn_blue_1:visible').length) {
        return setting.regl();
    } else if ($('#confirmSubWin:visible').length) {
        var btn = $('#tipContent + * > a').offset() || {
            top: 0,
            left: 0
        },
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
    setInterval(function () {
        $tip.parent(':not(.ans-job-finished)').length || setting.jump && toNext();
    }, setting.time);
}

function toNext() {
    let $ = _self.parent.$;
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
    console.log('所有章节均完成！');
}

function goCourse(url) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (xhr) {
            $.globalEval('location.href = "' + $('.articlename a[href]', xhr.responseText).attr('href') + '";');
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

function submitAnswer($job, data) {
    $job.removeClass('ans-job-finished');
    data = data.length ? $(data) : $('.TiMu').map(function () {
        var title = filterImg($('.Zy_TItle .clearfix', this));
        // console.log('题目数据：' + JSON.stringify(this))
        var optionTexts = [];
        $('.Zy_ulTop li', this).each(function() {
        var optionText = $(this).find('a').text().trim();
            optionTexts.push(optionText);
        });

        console.log(optionTexts);

        return {
            question: title.replace(/^【.*?】\s*/, ''),
            optionTexts: optionTexts,
            type: ({
                单选题: 0,
                多选题: 1,
                填空题: 2,
                判断题: 3
            })[title.match(/^【(.*?)】|$/)[1]]
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
                    return filterImg(this);
                }).get().join('#') || '无';
            } else if (this.code) {
                this.code = -1;
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var ans = $TiMu.find('.font20:last').text();
            if ($TiMu.find('.cuo').length) {
                this.option = ({
                    '√': '错误',
                    '×': '正确'
                })[ans] || '无';
            } else if (!this.code) {
                this.option = ({
                    '√': '正确',
                    '×': '错误'
                })[ans] || '无';
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
    const mt_courseId = $("#curCourseId", top.document).val() || "";
    const mt_chapterId = $("#curChapterId", top.document).val() || "";
    const mt_clazzId = $("#curClazzId", top.document).val() || "";

    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: setting.tiku + '/cx/v2/work',
        headers: {
            'Content-type': 'application/json'
        },
        data: JSON.stringify({
            course: setting.curs,
            data: (Ext.encode || JSON.stringify)(data),
            jobId: $('#jobid').val().slice(5),
            workId: $('#workId').val(),
            courseId: mt_courseId,
            chapterId: mt_chapterId,
            clazzId: mt_clazzId,

        }),
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                console.log('submit success')
            } else {
                console.log('submit error:' + response.statusText);
            }
        },
        onerror: function() {
            console.log('submit error');
        }
    });
    $job.addClass('ans-job-finished');
}

function showMtDashboard() {
    $('#mt-dashboard').remove();

    const dashboardHtml = `
<div id="mt-dashboard" class="layui-card" style="top: 30px; left: 10px; position: fixed;width: 380px; margin-left: 20px; touch-action: none; border-radius: 10px;box-shadow: 0px 6px 20px -6px #0b2b9e26; border: 3px solid #7431F9">
<div class="layui-card-header" style="background-color: #7431F9; color: white; border-bottom:0px;">
<i class="layui-icon layui-icon-senior"></i>
<span style="font-weight: bold;">Muketool 网课助手&nbsp;&nbsp;</span>
<span id="mt-dashboard-version">
<a href="https://www.muketool.com" target="_blank" class="layui-btn layui-btn-xs" style="color: white;background-color: #7431F9; border: 1px solid white;border-radius: 5px;">${GM_info.script.version}</a>
</span>
<span id="mt-dashboard-help">
<a href="https://www.muketool.com" target="_blank" class="layui-btn layui-btn-xs" style="background-color: white; color: black;border-radius: 5px;">使用帮助</a>
</span>
</div>
<div class="layui-card-body " style="border-radius: 10px; padding-bottom:30px;">
<div id="mt-dashboard-status">
<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i>&nbsp;
<span class="layui-font-13" style="font-weight: bold;">正在自动执行相关任务，请喝杯茶耐心等待......</span>
</div>
<div id="mt-dashboard-tips">
<hr class="layui-border-cyan">
<div class="layui-font-12" style="margin-bottom: 5px; line-height:20px;">
欢迎使用Muketool超星网课助手，该面板将控制脚本的运行及显示相关的通知，您可以使用鼠标拖动面板调整位置哦 : )  <br/>本脚本的下载、安装及使用完全免费，仅包含少量广告用于题库服务器开支，对您造成的不便敬请谅解。
</div>
</div>
<div id="mt-dashboard-notifications">
<hr class="layui-border-cyan">
<div class="layui-font-13" style="margin-bottom: 5px; color:#0D6EFD; line-height:20px;">超火爆的人工智能CHAT-G-P-T免费体验，最强大的生产力工具，支持写论文、写代码、写简历、写文案、学习辅导、研究咨询、论文降重等功能，无需使用教程，只需和人类对话般描述自己的需求，即可立即获得解答、完成任务，点击下方链接免费体验：</div>
<a href="https://www.todaoke.com/" target="_blank" class="layui-btn layui-btn-sm" style="background-color: #0D6EFD; border-radius: 5px;"><i class="layui-icon layui-icon-diamond"></i>立即免费体验</a>
</div>
<div id="mt-dashboard-setting">
<hr class="layui-border-cyan">
<div class="layui-btn-container">
<button type="button" id="mt-setting-button-1" class="layui-btn layui-btn-sm" style="background-color: white;border-radius: 5px; color: black; border-color: #7431F9"><i class="layui-icon layui-icon-ok"></i>自动答题已开启
</button>
<button type="button" id="mt-setting-button-2" class="layui-btn layui-btn-sm" style="background-color: white;border-radius: 5px; color: black; border-color: #7431F9"><i class="layui-icon layui-icon-close"></i>自动提交已关闭
</button>
<button type="button" id="mt-setting-button-3" class="layui-btn layui-btn-sm" style="background-color: white;border-radius: 5px; color: black; border-color: #7431F9; display:none; "><i class="layui-icon layui-icon-refresh"></i>重新搜索答案
</button>
<button type="button" id="mt-setting-button-4" class="layui-btn layui-btn-sm" style="background-color: white;border-radius: 5px; color: black; border-color: #7431F9;"><i class="layui-icon layui-icon-down"></i>
</button>
</div>
</div>
<div style="max-height: 200px; overflow: auto;">
<hr class="layui-border-cyan">
<div class="layui-font-12" id="mt-table-tips">
温馨提示：点击下方表格中的文字可直接复制。如果试题黄色高亮代表搜索到的答案不完全匹配建议手动搜索。
</div>
<table class="layui-table" id="mt-dashboard-history" >
<colgroup>
<col>
<col>
<col>
</colgroup>
<thead>
<tr>
<th class="layui-font-12 layui-center" style="font-weight: bold; padding: 5px; line-height: 15px; width: 12%;">题号</th>
<th class="layui-font-12 layui-center" style="font-weight: bold; padding: 5px; line-height: 15px; width: 44%;">题目</th>
<th class="layui-font-12 layui-center" style="font-weight: bold; padding: 5px; line-height: 15px; width: 44%;">答案</th>
</tr>
</thead>
<tbody>
</tbody>
</table>
</div>
</div>
</div>
`;
    _self.top.$(dashboardHtml).appendTo('body');
    let $mt_dashboard = _self.top.$('#mt-dashboard');
    var $body = $('body');
    var $document = $(_self.top.document);
    $mt_dashboard.on('mousedown', function (e) {
        e.preventDefault();
        var x = e.clientX,
            y = e.clientY,
            l = $mt_dashboard.position().left,
            t = $mt_dashboard.position().top;
        var scrollTop = $document.scrollTop();
        $body.css('cursor', 'move');
        $mt_dashboard.css('cursor', 'move');
        $document.on('mousemove', function (e) {
            $mt_dashboard.css({
                left: l + e.clientX - x,
                top: t + e.clientY - y - scrollTop
            });
            // dashboardPosition[1] = e.clientX - x;
            // dashboardPosition[0] = t + e.clientY - y - scrollTop
        }).on('mouseup', function () {
            // GM_setValue('mtSetting_dashboardPosition', [$mt_dashboard.position().top, $mt_dashboard.position().left])
            $body.css('cursor', '');
            $mt_dashboard.css('cursor', '');
            $(this).off('mousemove mouseup');
        });
    });
    var $dashboardTips = $('#mt-dashboard-tips', $mt_dashboard);
    var $dashboardNotifications = $('#mt-dashboard-notifications', $mt_dashboard);
    // var $dashboardVersion = $('#mt-dashboard-version', $mt_dashboard);
    var $dashboardHelp = $('#mt-dashboard-doc', $mt_dashboard);
    var resp_version, resp_tips, resp_notifications, resp_update, resp_help;
    GM_xmlhttpRequest({
        method: 'GET',
        url: setting.tiku + '/cx/v2/notification?script=cx&version=' + GM_info.script.version,
        timeout: setting.time,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                resp_version = obj.version;
                resp_tips = obj.tips;
                resp_notifications = obj.notifications;
                resp_update = obj.update;
                resp_help = obj.help;

                // 版本更新提示
                const currentVersion = GM_info.script.version;
                if (currentVersion != resp_version) {
                    console.log("[MT]New version found. Current version: " + currentVersion + ', Latest version: ' + resp_version);
                    let $mt_dashboard = _self.top.$('#mt-dashboard');
                    var $dashboardVersion = $('#mt-dashboard-version', $mt_dashboard);
                    $dashboardVersion.html(`<a href="${resp_update}" target="_blank" class="layui-btn layui-btn-xs" style="color: white;background-color: #7431F9; border: 1px solid white;border-radius: 5px;">💡更新脚本</a>`)
                } else {
                    console.log("[MT]The script is already the latest version: " + currentVersion);
                }

                // if (resp_version != setting.script_version && resp_version != '') {
                //     $dashboardVersion.html(`<a href="${resp_update}" target="_blank" class="layui-btn layui-btn-xs" style="color: white;background-color: #7431F9; border: 1px solid white;border-radius: 5px;">更新脚本</a>`)
                // }
                $dashboardHelp.html(`<a href="${resp_help}" target="_blank" class="layui-btn layui-btn-xs" style="background-color: white; color: black;border-radius: 5px;">使用帮助</a>`)
            } else {
                resp_version = '';
                resp_tips = [`<hr class="layui-border-cyan"><div class="layui-font-12" style="margin-bottom: 5px; line-height:20px;">Muketool服务器连接失败，错误码：${xhr.status}，可能是服务器正在维护或被攻击所致，稍后将尝试重新连接，如果长时间出现此异常请&nbsp;<a href="https://www.muketool.com" target="_blank" class="layui-btn layui-btn-xs layui-bg-red">点击此处</a>&nbsp;反馈。</div>`];
                resp_notifications = ['<hr class="layui-border-cyan"><div class="layui-font-12" style="margin-bottom: 5px;">服务器连接失败时自动搜题功能将不可用，其他功能正常，请耐心等待修复......</div>'];
                resp_update = 'https://www.muketool.com';
                resp_help = 'https://www.muketool.com/';
            }
        },
        onerror: function (error) {
            resp_version = '';
            resp_tips = [`<hr class="layui-border-cyan"><div class="layui-font-12" style="margin-bottom: 5px; line-height:20px;">Muketool服务器连接失败，可能是服务器正在维护或被攻击所致，稍后将尝试重新连接，如果长时间出现此异常请&nbsp;<a href="https://www.muketool.com" target="_blank" class="layui-btn layui-btn-xs layui-bg-red">点击此处</a>&nbsp;反馈。</div>`];
            resp_notifications = ['<hr class="layui-border-cyan"><div class="layui-font-12" style="margin-bottom: 5px;">服务器连接失败时自动搜题功能将不可用，其他功能正常，请耐心等待修复......</div>'];
            resp_update = 'https://www.muketool.com';
            resp_help = 'https://www.muketool.com/';
            console.log('出现错误2');
            console.error('服务器超时，正在重试...' + JSON.stringify(error));
        }
    });
    setInterval(function () {
        $dashboardTips.html(resp_tips[Math.floor(Math.random() * resp_tips.length)]);
        $dashboardNotifications.html(resp_notifications[Math.floor(Math.random() * resp_notifications.length)]);
    }, 15000); // TODO
}

function switchToNormal() {
    clearInterval(setting.loop);
    delete setting.loop;
    let $mt_dashboard = _self.top.$('#mt-dashboard');
    $('#mt-dashboard-setting', $mt_dashboard).hide();
    $('#mt-table-tips', $mt_dashboard).hide();
    $('#mt-dashboard-history tr', $mt_dashboard).not(':first').remove();
    $('#mt-dashboard-history', $mt_dashboard).hide();
    $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">正在自动执行相关任务，请喝杯茶耐心等待......</span>');
}

function switchToAnswering() {
    clearInterval(setting.loop);
    delete setting.loop;
    let $mt_dashboard = _self.top.$('#mt-dashboard');
    $('#mt-dashboard-setting', $mt_dashboard).show();
    $('#mt-table-tips', $mt_dashboard).show();
    $('#mt-dashboard-history tr', $mt_dashboard).not(':first').remove();
    $('#mt-dashboard-history', $mt_dashboard).show();
    setting.work ? $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">正在拼命搜索试题答案中，您可在下方查看详情......</span>') : $('#mt-dashboard-status', $mt_dashboard).html('<i class="layui-icon layui-icon-pause"></i>&nbsp;<span class="layui-font-13" style="font-weight: bold;">自动答题已暂停，您可在下方重新开启</span>');
    setting.search_history ? $('#mt-dashboard-history', $mt_dashboard).show() : '';
    setting.work ? $('#mt-setting-button-1', $mt_dashboard).html('<i class="layui-icon layui-icon-ok"></i>自动答题已开启') : $('#mt-setting-button-1', $mt_dashboard).html('<i class="layui-icon layui-icon-close"></i>自动答题已暂停');
    GM_getValue('mtSetting_autoSubmit') ? $('#mt-setting-button-2', $mt_dashboard).html('<i class="layui-icon layui-icon-ok"></i>自动提交已开启') : $('#mt-setting-button-2', $mt_dashboard).html('<i class="layui-icon layui-icon-close"></i>自动提交已关闭');
    setting.search_history ? $('#mt-setting-button-4', $mt_dashboard).html('<i class="layui-icon layui-icon-down"></i>') : $('#mt-setting-button-4', $mt_dashboard).html('<i class="layui-icon layui-icon-right"></i>');
    setting.search_history ? $('#mt-table-tips', $mt_dashboard).html('温馨提示：点击下方表格中的文字可直接复制。如果试题黄色高亮代表搜索到的答案不完全匹配建议手动搜索。') : $('#mt-table-tips', $mt_dashboard).html('搜题历史记录已隐藏，您可在上方重新开启');
}

function filterImg(dom) {
    return $(dom).clone().find('img[src]').replaceWith(function () {
        return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
    }).end().find('iframe[src]').replaceWith(function () {
        return $('<p></p>').text('<iframe src="' + $(this).attr('src') + '"></irame>');
    }).end().text().trim();
}

function skipQuestion() {
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.indexOf('richvideo/initdatawithviewerV2') > -1) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = JSON.stringify([]);
                }
            });
        }
        originOpen.apply(this, arguments);
    };
}


function stopMouseout() {
    console.log('[MT]Stop mouseout...');
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('mouseout', function (event) {
            event.stopPropagation();
        }, true);
    }
}


function initMtSetting() {
    if (typeof GM_getValue('mtSetting_autoSubmit') === 'undefined') {
        GM_setValue('mtSetting_autoSubmit', false);
    }
    console.log('[MT]Auto submit is ' + (GM_getValue('mtSetting_autoSubmit') ? 'enabled' : 'disabled'));

}
