// ==UserScript==
// @name               Bilibili Vesiter
// @name:zh-TW         Bilibili Vesiter
// @name:en            Bilibili Vesiter
// @namespace          sheep-realms
// @version            1.4.4
// @description        哔哩哔哩（bilibili）移除主站广告、移除播放页广告、自动宽屏、自动全屏、自动播放、逐帧播放
// @description:zh-tw  嗶哩嗶哩（bilibili）移除主站廣告、移除播放頁廣告、自動寬屏、自動全屏、自動播放、逐幀播放
// @description:en     Bilbili remove the main station advertisement, remove the broadcast page advertisement, automatic widescreen, automatic full screen, automatic play, frame advance
// @author             Sheep-realms
// @match              *.bilibili.com/*
// @run-at             document-body
// @require            http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license            CC 0
// @downloadURL https://update.greasyfork.org/scripts/425696/Bilibili%20Vesiter.user.js
// @updateURL https://update.greasyfork.org/scripts/425696/Bilibili%20Vesiter.meta.js
// ==/UserScript==

var config = {
    //广告屏蔽等级
    // 0 - 关闭
    // 1 - 基础屏蔽
    ad_block: 1,
    biliplayer: {
        //自动脚本执行延时（如果您的网络环境较差，请视情况延长时间，1000刻为1秒）
        timeout: 1000,
        //自动播放（true启用，false禁用）
        auto_play: false,
        //自动宽屏
        auto_widescreen: false,
        //自动网页全屏
        auto_web_fullscreen: false,
        //自动全屏
        auto_fullscreen: false,
        //按J跳过片头默认时长（秒）
        jump_op: 85,
        //按逗号和句号逐帧播放默认时长（秒）
        frame: 0.016,
        //Shift按逗号和句号变速默认倍率
        rate: 0.25,
        //虽然这个没啥可以配置的，但我还是要说一下按M静音
    },
    vesiter: {
        //左下角消息栏宽度，px为像素单位
        meaasge_width: "200px",
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
var video = $('.bilibili-player-video video')[0];

if(config.ad_block==1) {
    var csslist = "";
    csslist += ".ad-report, #slide_ad, #bili_live>.banner-card, #bili_anime>.banner-card, #live_recommand_report.pop-live {display: none!important;}";
    csslist += "#vesiter-msg {position:fixed; z-index:5000; bottom:0; left:0; width:10px; padding: 10px;}";
    csslist += ".vesiter-msg-bar {width:" + config.vesiter.meaasge_width + "; font-size:14px; color:#FFF; background:rgba(0,0,0,0.5); padding:6px 10px 8px 10px; border-radius:4px; margin-top:10px}";

    $('head').append('<style type="text/css" id="vesiter">' + csslist + '</style>');

    $('#reportFirst1').ready(function() {
        $('.bypb-icon').parents('.item').find('img').replaceWith('<div class="f1-ad-block">广告内容已被屏蔽</div>');
        $('.bypb-icon').parents('.item').find('p.title').replaceWith('');
    });

    $('#reportFirst2').ready(function() {
        $('.video-card-common.ex-card-common:contains("广告")').remove();
    });

    $('#bili_report_live .live-tabs .recommend-activity').ready(function() {
        setTimeout(function(){
            $('.recommend-activity').remove();
            $('#bili_report_live .live-tabs .tab-switch .tab-switch-item')[0].click();
        }, 500);
    });
}

$('body').ready(function() {

    setTimeout(function(){
        if(video == undefined) {
            video = $('.bilibili-player-video video')[0];
        }
        if(config.biliplayer.auto_widescreen) $('.bilibili-player-iconfont-widescreen-off').click();
        if(config.biliplayer.auto_web_fullscreen) $('.bilibili-player-iconfont-web-fullscreen-off').click();
        if(config.biliplayer.auto_fullscreen) $('.bilibili-player-iconfont-fullscreen-off').click();
    }, config.biliplayer.timeout);
    setTimeout(function(){
        if(config.biliplayer.auto_play) $('.bilibili-player-dm-tip-wrap').click();
    }, config.biliplayer.timeout+500);

    document.onkeydown=function(event){
        if(event.which==74) {video.currentTime += 90; logMsg("[=>] 跳过片头");}

        if(event.which==188 && event.shiftKey==0) {video.currentTime -= config.biliplayer.frame; logMsg("[<] 帧后退",null,0);}
        if(event.which==190 && event.shiftKey==0) {video.currentTime += config.biliplayer.frame; logMsg("[>] 帧前进",null,0);}

        if(event.which==188 && event.shiftKey==1) {video.playbackRate -= config.biliplayer.rate; logMsg("[↓] 降速：" + video.playbackRate);}
        if(event.which==190 && event.shiftKey==1) {video.playbackRate += config.biliplayer.rate; logMsg("[↑] 提速：" + video.playbackRate);}

        //if(event.which==77) {$('.bilibili-player-video-btn-volume>button').click(); logMsg("[M] 切换静音",null,0);}
    }
});


$('body').append('<div id="vesiter-msg"></div>');

function logMsg (text, type="msg", times="auto") {
    try {
        $('.vesiter-msg-bar[style*=none]').remove();
    } catch(err) {}

    var classtype;

    switch (type) {
        case 'msg':
            classtype = '';
            break;
        case 'err':
            classtype = 'red';
            break;
        case 'rit':
            classtype = 'green';
            break;
    }

    var objLbMsg = $('<div class="vesiter-msg-bar ' + classtype + '"></div>');

    $('#vesiter-msg').append(objLbMsg);
    objLbMsg.text(text);

    var timeout;
    if (times == 'auto') {
        timeout = text.length * 1000 / 8;
        if (timeout < 3000) {timeout = 3000;}
    } else if (!isNaN(times)) {
        timeout = times;
    } else {
        timeout = 3000;
    }
    setTimeout(function () {
        objLbMsg.fadeOut(1000);
    }, timeout);
}