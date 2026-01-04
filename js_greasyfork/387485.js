// ==UserScript==
// @name         Bilibili Live Translate Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  测试用的小玩具
// @author       yuyuyzl
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_info
// @match        *://live.bilibili.com/*
// @match        *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/387485/Bilibili%20Live%20Translate%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/387485/Bilibili%20Live%20Translate%20Fetcher.meta.js
// ==/UserScript==

var BLDFReg;
var intervalID=-1;
var updateTime="";
var config = {
    "BLDFIntervalDelay": 3000,
    "BLDFRegex": "【(.+?)】",

    "CJId": "matsuri",
    "CJUrlPrefix": "https://matsuri.huolonglive.com"
};
var lastTime = '0';
(function() {
    'use strict';
    var reloadConfig=function(){
        Object.keys(config).forEach(function(key){

            //console.log(key,config[key]);
            var valuet=GM_getValue(key);
            if(valuet!=null){
                config[key]=valuet;
            }else {
                GM_setValue(key,config[key]);
            }
        });
    };
    reloadConfig();
    if(window.location.href.match(/.*live.bilibili.com.*/) || window.location.href.match(/.*www.youtube.com.*/)) {
        if((GM_getValue("UpdateTime"))==null)GM_setValue("UpdateTime","NAN");
        updateTime=GM_getValue("UpdateTime");
        setTimeout(function () {

            // 以下CSS以及字幕框元素来自SOW社团的自动字幕组件
            // 发布帖链接：http://nga.178.com/read.php?tid=17180967
            $("head").append('<style type="text/css">\n' +
                '    .SubtitleBody{height:160px;background-color:rgba(0, 0, 0, 0.8);color:#fff;}\n' +
                '    .SubtitleBody.mobile{position:relative;top:5.626666666666667rem;}\n' +
                '    .SubtitleBody .title{padding:10px;font-size:14px;color:#ccc;}\n' +
                '    .SubtitleBody.mobile .title{font-size:12px;}\n' +
                '    .SubtitleBody .SubtitleTextBodyFrame{padding:0 10px;overflow-y:auto;position:absolute;top:8px;bottom:8px;}\n' +
                '    .SubtitleBody .SubtitleTextBody{min-height:110px;font-size:14px;color:#ccc;}\n' +
                '    .SubtitleBody.mobile .SubtitleTextBody{font-size:12px;}\n' +
                '    .SubtitleBody .SubtitleTextBody p{margin-block-start:5px;margin-block-end:5px;}\n' +
                '    .SubtitleBody .SubtitleTextBody p:first-of-type{color:#fff;font-size:20px;font-weight:bold;}\n' +
                '    .SubtitleBody.mobile .SubtitleTextBody p:first-of-type{font-size:18px;}\n' +
                '    .SubtitleBody.Fullscreen{position:absolute;left:20px;bottom:30px;z-index:50;background-color:rgba(0, 0, 0, 0.6);width:800px;display:none}\n' +
                '    .SubtitleBody.Theater{display:none}\n' +
                '    ytd-watch-flexy[theater] .SubtitleBody.Theater{display:block}\n' +
                '    .SubtitleBody.mobile.Fullscreen{width:300px;}\n' +
                '    ytd-watch-flexy[fullscreen] .SubtitleBody.Fullscreen,.bilibili-live-player[data-player-state=web-fullscreen] .SubtitleBody.Fullscreen{display:block;}\n' +
                '    .invisibleDanmaku{opacity:0 !important;}\n' +
                '    .SubtitleTextBodyFrame::-webkit-scrollbar {display: none;}' +
                '    </style>');
            $(".icon-left-part").append('<span data-v-b74ea690="" id="regexOn" title="开关过滤" class="icon-item icon-font icon-block" style="color: royalblue"></span>');
            $(".icon-left-part").append('<span data-v-b74ea690="" id="regexSettings" title="正则过滤设置" class="icon-item icon-font icon-config" style="color: royalblue"></span>');
            if (window.location.href.match(/.*live.bilibili.com.*/)) {
                $("#gift-control-vm").before('<div class="SubtitleBody"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div></div>');
                $(".bilibili-live-player").append('<div class="SubtitleBody Fullscreen ui-resizable"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div></div>');
                $(".SubtitleBody.Fullscreen").draggable();
            }

            if (window.location.href.match(/.*www.youtube.com.*/)) {
                $("#player-container-outer").after('<div class="SubtitleBody"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div></div>');
                $("#player-theater-container").after('<div class="SubtitleBody Theater"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div></div>');
                $("#player-theater-container").append('<div class="SubtitleBody Fullscreen ui-resizable"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div></div>');
                $(".SubtitleBody.Fullscreen").draggable();
            }

            var lock = false;
            var BLDFReg = new RegExp(config.BLDFRegex, 'g');
            function update() {
                if (lock) return;
                lock = true;
                GM_xmlhttpRequest({
                    method: "GET",
                    cache: true,
                    url:  config.CJUrlPrefix + "?"+"t="+(new Date().getTime())+"&"+"args=" + config.CJId + '|' + lastTime,
                    onload: function (data) {
                        data=data.responseText;
                        console.log(data);
                        var tsget = data.trim().split("\n");
                        lastTime = tsget[0];
                        tsget.shift();
                        tsget.slice().reverse().forEach(function (line, index) {
                            var lineProc = line.replace(/<.*>/g, "");
                            //lineProc = filterXSS(lineProc);
                            var matches = lineProc.match(BLDFReg);
                            if (matches != null)
                                matches.forEach(function (match) {
                                    lineProc = lineProc.replace(match, "<span class=\"translation\">" + match.replace("【", "").replace("】", "") + "</span>");
                                });

                            $('.SubtitleTextBody').prepend("<p class='new'>" + lineProc + "</p>");
                            setTimeout(function () {
                                $('.new').removeClass('new');
                            }, 1);
                        });
                        lock = false;
                    }
                });
            }


            update();
            setInterval(function () {
                update();
            }, config.BLDFIntervalDelay);
            /*
            $("#regexSettings").click(function () {
                window.open("https://yuyuyzl.github.io/BiliDMFilter/");
            });

            $("#regexOn").click(function () {
                if (intervalID >= 0) {
                    clearInterval(intervalID);
                    $(".bilibili-danmaku").each(function (i, obj) {
                        $(obj).removeClass("invisibleDanmaku");
                    });
                    intervalID=-1;
                    $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "弹幕过滤停止" + "</p>");
                }
                else {
                    $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "弹幕过滤开始" + "</p>");
                    startInterval();
                }
            });*/
        }, 3000);

    }

})();