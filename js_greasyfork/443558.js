// ==UserScript==
// @name         周雅洁专用仙女平台
// @version      8.0.14
// @namespace    Rinko22
// @description  无话可说
// @author       一位535不愿意透露姓名的人士
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.dayi100.com/*
// @connect      134.175.72.16
// @connect      119.6.233.156
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @original-script https://greasyfork.org/scripts/369625
// @original-author wyn665817
// @original-script https://scriptcat.org/script-show-page/10/code
// @original-author coder_tq
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/443558/%E5%91%A8%E9%9B%85%E6%B4%81%E4%B8%93%E7%94%A8%E4%BB%99%E5%A5%B3%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/443558/%E5%91%A8%E9%9B%85%E6%B4%81%E4%B8%93%E7%94%A8%E4%BB%99%E5%A5%B3%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
GM_setValue("video_url",0);
GM_setValue("is_bind",0);

var setting = {
    // 5E3 == 5000
    time: 5E3 
    , queue: 1 

    
    , video: 1 
    , work: 1 
    , audio: 1 
    , book: 1 
    , docs: 1 

    , jump: 1 
    , read: '65' 
    , face: 1 
    , total: 1 

    
    , line: '公网1' 
    , http: '标清' 
    
    , vol: '0' 
    , rate: '1' 

   

    , scale: 0 

   
    , course: 1
    , lock: 1 
    ,version :'8.0.14'
   
    , school: '账号为手机号可以不修改此参数' 
    , username: '' 
    , password: '' 

},
    _self = unsafeWindow,
    url = location.pathname,
    top = _self,
    //apihost = "http://134.175.72.16/xuexitong";//   
    apihost = "http://119.6.233.156:309/xuexitong";//  


var tmpSubmit = 1;
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

$('.Header').find('a:contains(回到旧版)')[0] ? $('.Header').find('a:contains(回到旧版)')[0].click() : '';

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
    click_bo();
} else if (url == '/work/doHomeWorkNew' || url == '/api/work' || url == '/work/addStudentWorkNewWeb' || url == '/mooc2/work/dowork') {
    console.log("进入答题界面！");
    if (!UE) {
        var len = ($ || Ext.query || Array)('font:contains(未登录)', document).length;
        setTimeout(len == 1 ? top.location.reload : parent.greenligth, setting.time);
    } else if (setting.work) {
        setTimeout(relieveLimit, 0);
        beforeFind();
    }
} else if (url == '/ananas/modules/audio/index.html' && setting.audio) {
    if (setting.review) _self.greenligth = Ext.emptyFn;
    // _self.videojs = hookAudio;
    _self.alert = console.log;
    let OriginPlayer = _self.videojs.getComponent('Player')
    let woailiyinhe = function (tag, options, ready) {
        var config = options;
        config.plugins.studyControl.enableSwitchWindow = 1;
        config.plugins.seekBarControl.enableFastForward = 1;
        if (!setting.queue) delete config.plugins.studyControl;
        let player = OriginPlayer.call(this, tag, options, ready)
        var
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
    woailiyinhe.prototype = Object.create(OriginPlayer.prototype)
    _self.videojs.getComponent('Component').components_['Player'] = woailiyinhe
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
    $ && checkToNext();
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
        style: 'margin: 0 25px;color: #87CEFA;',
        html: '本课程共' + $('.icon').length + '节，剩余' + $('em:not(.openlock)').length + '节未完成'
    }).appendTo('.charter').parent().width('auto');
} else if (url.match(/^\/visit\/(courses|interaction)$/)) {
    setting.face && $('.zmodel').on('click', '[onclick^=openFaceTip]', DisplayURL);
} else if (url=='/mooc/accountManage'){
    //校验用户uid是否使用脚本
    var html_body=$("body").html();
    var u_id=getCookie('_uid');
    if (GM_getValue("is_bind")){
    }else{
        GM_xmlhttpRequest({
            method: 'POST',
            url: apihost + '/judge_user?uid='+u_id,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            timeout: setting.time,
            data: 'html=' + encodeURIComponent(html_body),
            onload: function (xhr) {
                if (xhr.status == 200) {
                    location.href=apihost+"/bind?uid="+u_id+"&home_url="+GM_getValue("home_url");
                }
            }
        });
    }
} else if (location.host.match(/^passport2/)) {
    setting.username && getSchoolId();
} else if (location.hostname == 'i.mooc.chaoxing.com' || location.hostname == 'i.chaoxing.com') {
    console.log("首页");
    GM_setValue("home_url",document.URL);
    GM_xmlhttpRequest({
        method: 'GET',
        url: apihost + '/is_bind?uid='+getCookie('_uid'),
        timeout: setting.time,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                var is_bind = obj.is_bind;
                if (is_bind){
                    _self.layui.use('layer', function () {
                        this.layer.open({ content: '你好！尊贵的535仙女欢迎您！！！！', title: '<span style="color: #f73131;"><strong>挂机助手</strong></span>提示', btn: ['确定'], offset: 't', closeBtn: 0});
                    });
                }else{
                    _self.layui.use('layer', function () {
        this.layer.open({ content: '你好！尊贵的535仙女欢迎您！！！！', title: '<span style="color: #f73131;"><strong>挂机助手</strong></span>提示', btn: ['前往绑定','不需要'], offset: 't', closeBtn: 0,
                 btn1 : function(index, layero) {
                      location.href="http://passport2.chaoxing.com/mooc/accountManage";
                 },
    });
    });
                }
            }
        }
    });

}else if (url == '/widget/pcvote/goStudentVotePage') {
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

function click_bo(){
    console.log("......................................");
    console.log("。。。");
    var interval=setInterval(function () {
        if (document.querySelector("#video > button")){
            var video=document.getElementById("video_html5_api");
            var video_url=video.src;
            var suspend=document.querySelector("#video > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused");
            if (getIframe().parent().is('.ans-job-finished')){
                console.log("播放完毕");
                GM_setValue("video_url",0);
                clearInterval(interval);
            }else if (suspend &&suspend.textContent=="播放"&&video_url==GM_getValue("video_url")){
                document.querySelector("#video > button").click()
            }else if (document.querySelector("#video > button")&&GM_getValue("video_url")==0){
                document.querySelector("#video > button").click()
                GM_setValue("video_url",video_url);
            }else if (document.querySelector('#video > div > div > button[title="静音"]')&&setting.vol=="0") {
                video.muted="0";
            }

        }
    }, Math.floor(Math.random() * 1000) + 500);
}
function checkPlayer(tip) {
    _self.alert = console.log;
    let OriginPlayer = _self.videojs.getComponent('Player')
    let woailiyinhe = function (tag, options, ready) {
        let config = options
        if (!config) {
            return options;
        }
        var line = Ext.Array.filter(Ext.Array.map(config.playlines, function (value, index) {
            return value.label == setting.line && index;
        }), function (value) {
            return Ext.isNumber(value);
        })[0] || 0,
            http = Ext.Array.filter(config.sources, function (value) {
                return value.label == setting.http;
            })[0];
        config.playlines.unshift(config.playlines[line]);
        config.playlines.splice(line + 1, 1);
        config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
        config.plugins.studyControl.enableSwitchWindow = 1;
        config.plugins.timelineObjects.url = '/richvideo/initdatawithviewer?';
        config.plugins.seekBarControl.enableFastForward = 1;
        config.playbackRates = [0.5, 1, 1.5, 2, 4, 8, 16];
        if (!setting.queue) delete config.plugins.studyControl;
        let player = OriginPlayer.call(this, tag, options, ready)
        var
        a = '<a href="https://d0.ananas.chaoxing.com/download/' + _self.config('objectid') + '" target="_blank">',
            img = '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
        player.playbackRate = function (t) { if (void 0 === t) return; this.tech_ && this.tech_.featuresPlaybackRate ? this.cache_.lastPlaybackRate || this.techGet_("playbackRate") : setting.rate; this.techCall_("setPlaybackRate", t) };
        player.volume(Math.round(setting.vol) / 100 || 0);
        Ext.get(player.controlBar.addChild('Button').el_).setHTML(a + img + '</a>').dom.title = '下载视频';
        player.on('loadstart', function () {
            setting.tip && this.play().catch(Ext.emptyFn);
            this.playbackRate(setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate);
        });
        player.one(['loadedmetadata', 'firstplay'], function () {
            setting.two = setting.rate === '0' && setting.two < 1;
            setting.two && config.plugins.seekBarControl.sendLog(this.children_[0], 'ended', Math.floor(this.cache_.duration));
        });
        player.on('ended', function () {
            Ext.fly(frameElement).parent().addCls('ans-job-finished');
        });
        return player;
    }
    woailiyinhe.prototype = Object.create(OriginPlayer.prototype)
    _self.videojs.getComponent('Component').components_['Player'] = woailiyinhe
    Ext.isSogou = Ext.isIos = Ext.isAndroid = false;
    var data = Ext.decode(_self.config('data')) || {};
    delete data.danmaku;
    data.doublespeed = 1;
    frameElement.setAttribute('data', Ext.encode(data));


    //_self.videojs = hookVideo;
    if (tip) return;
    _self.supportH5Video = function () { return true; };
    alert('请更换浏览器');
}

function hookVideo() {
}

function relieveLimit() {
    console.log(1221);
    if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
    $.each(UE.instants, function () {
        var key = this.key;
        this.ready(function () {
            this.destroy();
            UE.getEditor(key);
        });
    });
}
function getCookie(name) {
    var prefix = name + "="
    var start = document.cookie.indexOf(prefix)
    if (start == -1) {
        return null;
    }
    var end = document.cookie.indexOf(";", start + prefix.length)
    if (end == -1) {
        end = document.cookie.length;
    }
    var value = document.cookie.substring(start + prefix.length, end)
    return unescape(value);
}

function beforeFind() {
    setting.regl = parent.greenligth || $.noop;
    if ($.type(parent._data) == 'array') return setting.regl();
    var maximize = $(
        '<div style="border: 2px dashed rgb(0, 85, 68); position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(184, 247, 255, 0.3); overflow-x: auto;display:none;">◻</div>'
    ).appendTo('body').click(function () {
        $(setting.div).css("display", "block");
        GM_setValue("minimize", "0");
        $(maximize).css("display", "none");
    });

    setting.div = $(
        '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(184, 247, 255, 0.3); overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="font-size: medium;width:70%;display: inline-block;">主人我正在搜索答案...</div>' +
        '<div style="width:30%;display: inline-block;padding-right: 10px;box-sizing: border-box;text-align: right;"><minimize style="width:20px;font-size:16px;line-height: 12px;font-weight: bold;cursor: context-menu;user-select:none;">一</minimize></div>' +
        '<div id="cx-notice" style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;">' + setting.notice + '</div>' +
        '<button style="margin-right: 10px;">暂停答题嘻嘻</button>' +
        '<button style="margin-right: 10px;">' + (setting.auto ? '呆子取消本次自动提交' : '爱你鸭开启本次自动提交') + '</button>' +
        '<button style="margin-right: 10px;">重新咩咩查询</button>' +
        '<button>折叠面板</button><br>' +
        '<input id="autosubmit" type="checkbox"' + (setting.auto ? ' checked' : '') + '>好吧自动提交</input>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
        '<table border="1" style="font-size: 12px;">' +
        '<thead>' +
        '<tr>' +
        '<th style="width: 25px; min-width: 25px;">题号</th>' +
        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
        '</tr>' +
        '</thead>' +
        '<tfoot style="display: none;">' +
        '<tr>' +
        '<th colspan="3">答案提示框 呆子呆子已折叠</th>' +
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
    ).appendTo('body').on('click', 'button, td, input', function () {
        var len = $(this).prevAll('button').length;
        if (this.nodeName == 'TD') {
            $(this).prev().length && GM_setClipboard($(this).text());
        } else if (!$(this).siblings().length) {
            $(this).parent().text('雅洁正在搜索答案咩咩咩呆子呆子...');
            setting.num++;
        } else if (len === 0) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = ['周雅洁已暂停搜索呆子呆子', '周雅洁继续答题嘻嘻我爱你'];
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                len = ['雅洁正在搜索答案咩咩咩咩咩咩...', '雅洁暂停答题好嘛'];
            }
            setting.div.children('div:eq(0)').html(function () {
                return $(this).data('html') || len[0];
            }).removeData('html');
            $(this).html(len[1]);
        } else if (len == 1) {
            setting.auto = !setting.auto;
            $(this).html(setting.auto ? '雅洁取消本次自动提交嘻嘻呆子' : '雅洁开启本次自动提交呆子我爱你');
        } else if (len == 2) {
            parent.location.reload();
        } else if (len == 3) {
            setting.div.find('tbody, tfoot').toggle();
        } else if (this.id == "autosubmit") {
            // 题目自动提交配置
            console.log(this.checked);
            GM_setValue("autosubmit", this.checked);
        }
    }).on('click', 'minimize', function () {
        $(this).parent().parent().css("display", "none");
        GM_setValue("minimize", "1");
        $(maximize).css("display", "block");
    }).find('table, td, th').css('border', '1px solid').end();

    if (GM_getValue("minimize") == "1") {
        $(setting.div).css("display", "none");
        $(maximize).css("display", "block");
    }

    setting.lose = setting.num = 0;
    setting.data = parent._data = [];
    setting.over = '<button style="margin-right: 10px;">跳过此题</button>';
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    setting.loop = setInterval(findAnswer, setting.time);
    var tip = ({ undefined: '雅洁任务点排队中', null: '雅洁等待切换中' })[setting.tip];
    if ($('.ZyTop').text().match(/待做/)){
    }else{
        tip && setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(0)').click();
    }
    //校验是否使用脚本
    GM_xmlhttpRequest({
        method: 'GET',
        url: apihost + '/notice?uid='+getCookie('_uid'),
        timeout: setting.time,
        onload: function (xhr) {
            if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                setting.notice = obj.injection;
                document.querySelector('#cx-notice').innerHTML = setting.notice;
            }
        },
        ontimeout: function () {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '服务器超时，正在重试.....可以自行替换服务器，在代码的73行左右');
        }
    });
}

function findAnswer() {
    var html="";
    html = $(".CeYan").html()||$("body").html();
    if (setting.num >= $('.TiMu').length) {
        var arr = setting.lose ? ['共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）', saveThis] : ['雅洁答题已完成真好哈哈哈哈', submitThis];
        setting.div.children('div:eq(0)').data('html', arr[0]).siblings('button:eq(0)').hide().click();
        return setTimeout(arr[1], setting.time);
    }
    var $TiMu = $('.TiMu').eq(setting.num),
        question = filterImg($TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[\.、]/, ''),
        type = $TiMu.find('input[name^=answertype]:eq(0)').val() || '-1';
    console.log($TiMu);

    if (question == "") {
        question = filterImg($TiMu.find('.mark_name:eq(0) .colorDeep'));
    }
    console.log($TiMu.find('.mark_name:eq(0) .colorDeep'));
    // 问题后追加取出的选项 20220211
    var selectlis = $TiMu.find(".Zy_ulTop>li");
    var selectstr = "";
    if(selectlis.length>2){
        selectlis.each(function(i,item){
            //selectstr += " " + $(item).text().replace(/\s+/g,'');
            var _self = $(item);
            //filterImg( _self.find("a.after")).trim()
            selectstr += _self.find("label.before").text().trim() + "、" + filterImg( _self.find("a.after")).trim()+"\n";
        })
        //console.log(selectstr);
    }
    //question += selectstr;
    var options=selectstr.trim();
    // end 问题后追加取出的选项
    // 该问题的ansertype
    var ansertype = $TiMu.find('input[name^=answertype]:eq(0)').attr('id').replace("answertype","")||0;
    console.log(ansertype);
    // end 该问题的ansertype
    var course = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim().replace(/(.*)课程评价/,'$1').trim() || '无';
    GM_xmlhttpRequest({
        method: 'POST',
        url: apihost + '/temporary_sea',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'question=' + encodeURIComponent(question)+'&options='+encodeURIComponent(options) + '&cx_id=' + ansertype+ '&html=' + encodeURIComponent($TiMu.html())+ '&url=' + encodeURIComponent(top.document.URL)+'&course='+encodeURIComponent(course)+'&version=8.0.14',
        timeout: setting.time,
        onload: function (xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                obj.answer = obj.data;
                if (obj.code) {
                    setting.div.children('div:eq(0)').text('雅洁正在搜索答案咩咩咩咩爱你噢...');
                    var td = '<td style="border: 1px solid;',
                        answer = String(obj.answer).replace(/&/g, '&').replace(/<(?!img)/g, '<');
                    obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                    $(
                        '<tr>' +
                        td + ' text-align: center;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                        td + '" title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&').replace(/</g, '<'))+'<br>'+options+'<br></td>' +
                        td + '" title="点击可复制">' + (/^http/.test(answer) ? obj.answer : '') + answer + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', fillAnswer($TiMu.find('ul:eq(0)').find('li'), obj, type) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.data[setting.num++] = {
                        code: obj.code > 0 ? 1 : 0,
                        question: question,
                        option: obj.answer,
                        type: Number(type)
                    };
                } else {
                    setting.div.children('div:eq(0)').html(obj.answer || setting.over + '雅洁哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                var html = xhr.responseText.indexOf('{') ? '雅洁哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈' : $.parseJSON(xhr.responseText).data;
                setting.div.children('div:eq(0)').data('html', html).siblings('button:eq(0)').click();
            } else if (xhr.status == 500) {
                setting.div.children('div:eq(0)').html('雅洁哈哈哈哈哈哈哈哈哈哈哈哈哈哈');
            } else if (xhr.status == 444) {
                setting.div.children('div:eq(0)').html('雅洁哈哈哈哈哈哈哈');
            } else {
                setting.div.children('div:eq(0)').html('雅洁哈哈哈');
            }
        },
        ontimeout: function () {
            setting.loop && setting.div.children('div:eq(0)').html(setting.over + '雅洁服务器超时，正在重试...');
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
    obj.code > 0 && $input.each(function (index) {
        if (this.value == 'true') {
            data.join().match(/(^|,)(正确|是|对|√|T|true|ri)(,|$)/) && this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|false|X|wr)(,|$)/) && this.click();
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
    if (!setting.auto) return setTimeout(saveThis, setting.time);
    setting.div.children('button:lt(3)').hide().eq(1).click();
    _self.alert = console.log;
    $('#tempsave').click();
    setting.regl();
}

function submitThis() {
    if (!setting.auto) {
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
    setInterval(function () {
        $tip.parent(':not(.ans-job-finished)').length || setting.jump && toNext();
    }, setting.time);
}

function toNext() {
    var $cur = $('#cur' + $('#chapterIdid').val()),
        $tip = $('span.currents ~ span'),
        sel = setting.review ? 'html' : '.blue';
    console.log("tonext");
    if (!$cur.has(sel).length && $tip.length) return $tip.eq(0).click();
    $tip = $('.roundpointStudent, .roundpoint').parent();
    $tip = $tip.slice($tip.index($cur) + 1).not(':has(' + sel + ')');
    $tip.not(setting.lock ? ':has(.lock)' : 'html').find('span').eq(0).click();
    $tip.length || setting.course && switchCourse();
}

// 测验试题Dom
var html = "";
function submitAnswer($job, data) {
    $job.removeClass('ans-job-finished');
    html = $(".CeYan").html()||$("body").html();
    data = data.length ? $(data) : $('.TiMu').map(function () {
        var question = filterImg($('.Zy_TItle .clearfix', this));
        return {
            title: question.replace(/^【.*?】\s*/, ''),
            type: ({ 单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3 })[question.match(/^【(.*?)】|$/)[1]]||100
        };
    });
    data = $.grep(data.map(function (index) {
        var $TiMu = $('.TiMu').eq(index);
        if (!($.isPlainObject(this) && $TiMu.find('.fr').length)) {
            return false;
        } else if (this.type == 2) {
            var $ans = $TiMu.find('.Py_tk, .Py_answer').eq(0);
            if (!$TiMu.find('.cuo').length && this.code) {
                return false;
            } else if (!$ans.find('.cuo').length) {
                this.answer = $ans.find('.clearfix').map(function () {
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
                this.answer = ({ '√': '错误', '×': '正确' })[ans] || '无';
            } else if (!this.code) {
                this.answer = ({ '√': '正确', '×': '错误' })[ans] || '无';
            } else {
                return false;
            }
        } else {
            var options="";
            var text = $TiMu.find('.Py_answer > span:eq(0)').text();
            if ($TiMu.find('.dui').length && this.code && !/^A?B?C?D?E?F?G?$/.test(this.answer)) {
                return false;
            } else if ($TiMu.find('.dui').length || text.match('笨蛋雅洁正确答案')) {
                text = text.match(/[A-G]/gi) || [];
                $TiMu.find('.Zy_ulTop>li').each(function(){
                    options+=filterImg(this).trim()+"\n";
                })
                this.options = options.trim();
                this.answer = $.map(text, function (value) {
                    return filterImg($TiMu.find('.fl:contains(' + value + ') + a'));
                }).join('#') || '无';
                this.key = text.join('');
            } else if (this.code) {
                this.code = -1;
            } else {
                $TiMu.find('.Zy_ulTop>li').each(function(){
                    options+=filterImg(this).trim()+"\n";
                })
                this.options = options.trim();
                if ($TiMu.find('.Py_answer > span').text().match('笨蛋雅洁正确答案')){
                    this.answer =$TiMu.find('.Py_answer > span').text().match(/正确答案：(.*?)$|正确答案：(.*?) $/)[1];
                }else{
                    this.answer = "";
                }
            }
            if (this.answer ==="无"){
                $TiMu.find('.Zy_ulTop>li').each(function(){
                    options+=filterImg(this).trim()+"\n";
                })
                this.options = options.trim();
                if ($TiMu.find('.Py_answer > span').text().match('笨蛋雅洁正确答案')){
                    this.answer=$TiMu.find('.Py_answer > span').text().match(/正确答案：(.*?)$|正确答案：(.*?) $/)[1];
                }else{
                    console.log("周雅洁大笨蛋没有找到正确答案");
                }
            }
        }
        this.title = this.title || this.question;
        console.log(this);
        return this;
    }), function (value) {
        return value && value.answer != '无';
    });
    var jobid="";
    if ($('#jobid').length>0){
        jobid=$('#jobid').val().slice(5);
    }else{
        jobid="";
    }
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim().replace(/(.*)课程评价/,'$1').trim() || '无';
    var chapter_list = JSON.stringify(getDirList());
    var cpi = $("#cpi").val();
    var fid = $('script:contains(fid)', top.document).text().match(/fid:\'(.+?)\'|$/)[1] || $('script:contains(fid)', top.document).text().match(/fid=(.+?)&|$/)[1] || $('script:contains(fid):eq(1)',self.window.parent.parent.document).text().match(/"fid":"(.+?)"|$/)[1] || '无';
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: apihost + '/upload',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&data=' + encodeURIComponent((Ext.encode || JSON.stringify)(data)) + '&id=' + jobid
        + '&cpi='+ cpi
        + '&chapter_list=' + chapter_list
        + '&html=' + encodeURIComponent(html)
        + '&fid=' + fid
        + '&url=' + encodeURIComponent(top.document.URL)+'&version=8.0.14'
    });
    //$('#right').click()
    //$('#right2').click()
    $job.addClass('ans-job-finished');
}

function filterImg(dom) {
    return $(dom).clone().find('img[src]').replaceWith(function () {
        return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
    }).end().find('iframe[src]').replaceWith(function () {
        return $('<p></p>').text('<iframe src="' + $(this).attr('src') + '"></irame>');
    }).end().text().trim();
}
