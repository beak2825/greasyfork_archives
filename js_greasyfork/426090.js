// ==UserScript==
// @name         智慧树自动播放
// @namespace    fadetube
// @version      1.1.0
// @description  就是自动智慧树自动播放
// @description  大部分使用了大佬的代码，本脚本只修改了切换下一视频的判断
// @author       垚垚垚垚垚垚垚垚垚
// @match        *://*.zhihuishu.com/*
// @connect      cx.icodef.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @original-script https://greasyfork.org/scripts/380506
// @original-author wyn665817
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/426090/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/426090/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
        // 5E3 == 5000，科学记数法，表示毫秒数
        time: 5E3 // 默认响应速度为5秒，不建议小于3秒

        // 1代表开启，0代表关闭
        ,video: 1 // 视频支持课程、见面课，默认开启
        ,jump: 1 // 自动切换视频，支持课程、见面课，默认开启

        // 仅开启video时，修改此处才会生效
        ,line: '流畅' // 视频播放的默认线路，可选参数：['高清', '流畅', '校内']，默认'流畅'
        ,vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
        ,speed: '1.5' // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
        // 上方参数支持在页面改动，下方参数仅支持代码处修改
        ,que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
        ,danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭
        ,habit: '0' // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制
        ,none: 0
        ,hide: 0
        ,work: 1

    },
    _self = unsafeWindow,
    url = location.pathname,
    $ = _self.jQuery,
    xhr = _self.XMLHttpRequest;

setting.notice = '智慧树傻不拉几';

String.prototype.toCDB = function() {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};

// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.queue = setting.curs = [];

if (!$) {
} else if (url.match('/videoList')) {
    $.tmDialog.alert({content: '智慧树你和我', title: '摇咿摇咿摇'});
} else if (url == '/videoStudy.html') {
    setting.habit *= 6E4;
    setting.video && hookVideo(_self.vjsComponent, 1);
    setting.jump && setInterval(checkToNext, setting.time);
} else if (url == '/portals_h5/2clearning.html') {
    setting.video && hookVideo(_self.vjsComponent, 2);
    setting.jump && setInterval(checkToNext, setting.time);
} else if (url == '/live/vod_room.html') {
    setting.video && hookVideo(_self.vjsComponent);
    setting.jump && setInterval(checkToNext, setting.time, 1);
} else if (location.hostname.match('examh5')) {
    setTimeout(relieveLimit, 100, document);
    if (location.hash.match(/dohomework|doexamination/) && setting.work) beforeFind();
    $(window).on('hashchange', function() {
        setting.work && location.reload();
    });
} else if (url.match('/sourceLearning')) {
    setting.video && hookVideo(_self.vjsComponent, 3);
    setting.jump && setInterval(checkToNext, setting.time, $('.source-file-item'));
} else if (url == '/shareCourse/questionDetailPage') {
    setTimeout(relieveLimit, 100, document);
    $('textarea[oncut]').each(function() {
        setTimeout(relieveLimit, 100, this);
    });
} else if (url.match('exerciseList') && setting.work) {
    _self.XMLHttpRequest = hookHiexam;
    setInterval(function() {
        $(setting.queue.shift()).parent().click();
    }, 1E3);
    setting.jump && setInterval(function() {
        // var $li = setting.queue.length ? $() : $('.jobclassallnumber-div li');
        // $li.slice($li.index($('.greenbordercur')) + 1).not('.greenbgcur').eq(0).click();
        setting.queue.length || $('.Topicswitchingbtn:contains(下一题)').click();
    }, setting.time);
}



function totalTime() {
    var player = _self.PlayerStarter.playerArray[0].player;
    setting.habit -= player.paused() ? 0 : setting.time;
    if (setting.habit >= 0) return;
    clearInterval(setting.tip);
    player.pause();
    $.getScript('//cdn.jsdelivr.net/gh/sentsin/layer/dist/layer.js', function() {
        _self.layer.open({content: '已达到挂机限制时间', title: '智慧树网课助手提示', end: function() {
                setting.habit = 0;
            }});
    });
}

//这里是原创的，非原作者源码*********************************************************************
function checkToNext(tip) {
    let p_progress = parseInt(document.querySelector('.vjs-play-progress').style.width);
    let a = document.getElementById('fileId').value;
    let c_id = parseFloat(a);
    if (p_progress > 95){
		c_id = c_id + 1;
		document.getElementById('file_'+c_id).click();
    }
}

function doTest() {
    if (!$('.dialog-test').length) {
    } else if (setting.queue.length) {
        $(setting.queue.shift()).parent().click();
    } else if (!$('.answer').length) {
        $('.topic-item').eq(0).click();
    } else if (!$('.right').length) {
        var tip = $('.answer span').text().match(/[A-Z]/g) || [];
        if (tip.length == 1) return $('.topic-option-item:contains(' + tip[0] + ')').click();
        $('.topic-option-item').each(function() {
            $.inArray($(this).text().slice(0, 1), tip) < 0 == $(this).hasClass('active') && setting.queue.push(this);
        });
    } else if ($('.btn-next:enabled').length) {
        $('.btn-next:enabled').click();
    } else {
        $('.dialog-test .btn').click();
        _self.PlayerStarter.playerArray[0].player.play();
    }
}

function hookVideo(Hooks, tip) {
    // _self.PlayerUtil.debugMode = true;
    _self.vjsComponent = function() {
        var config = arguments[0],
            options = config.options,
            line = $.map(options.sourceSrc.lines, function(value) {
                return value.lineName.replace('标准', '高清');
            }),
            vol = setting.vol > 100 ? 100 : setting.vol,
            rate = tip == 3 ? [1, 1.25, 1.5, 2, 2.5, 3] : [1, 1.25, 1.5];
        vol = Math.round(vol) / 100;
        options.volume = vol > 0 ? vol : 0;
        options.autostart = true;
        setting.speed = setting.speed > 0 ? +setting.speed : 1;
        options.rate = $.inArray(setting.speed, rate) < 0 ? options.rate : setting.speed;
        tip && config.callback.playbackRate(setting.speed);
        options.chooseLine = $.inArray(setting.line, line) + 1 || options.chooseLine + 1;
        options.src = options.sourceSrc.lines[--options.chooseLine].lineUrl || options.src;
        if (!setting.danmu) {
            config.defOptions.control.danmuBtn = false;
            delete options.control.danmuBtn;
        }
        Hooks.apply(this, arguments);
        config.player.on('loadstart', function() {
            this.loop(true);
            this.play();
            $('.speedBox span').text('X ' + setting.speed);
        });
    };
    $(document).on('click', '.definiLines b', function() {
        setting.line = ({xiaonei: '校内', line1gq: '高清', line1bq: '流畅'})[this.classList[0]];
    }).on('mouseup click', function() {
        setting.vol = _self.PlayerStarter.playerArray[0].player.cache_.volume * 100;
    }).on('click', '.speedList div', function() {
        setting.speed = $(this).attr('rate');
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
function relieveLimit(doc) {
    if (!doc.oncut && !doc.onselectstart) return setTimeout(relieveLimit, 100, doc);
    doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
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