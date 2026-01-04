// ==UserScript==
// @name         Bilibili Live Danmaku Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  使用一个简单的定时器把弹幕按照给定的正则表达式过滤一遍
// @supportURL   https://space.bilibili.com/1534590
// @author       yuyuyzl
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://code.jquery.com/ui/1.13.3/jquery-ui.min.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @match        *://live.bilibili.com/*
// @match        *://www.douyu.com/*
// @match        *://yuyuyzl.github.io/BiliDMFilter/*
// @match        *://localhost*BiliDMFilter/*
// @downloadURL https://update.greasyfork.org/scripts/386759/Bilibili%20Live%20Danmaku%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/386759/Bilibili%20Live%20Danmaku%20Filter.meta.js
// ==/UserScript==

var BLDFReg;
var intervalID=-1;
var updateTime="";
var config={
    "BLDFAutoStart": true,
    "BLDFIntervalDelay": 20,
    "BLDFNeedSubBody": true,
    "BLDFRegex": "(.*)【(.*)】|(.*)【(.*)",
    "BLDFShowMatchedDanmakuText": true,
    "BLDFRecord": false,
    "BLDFOtherDanmakuOpacity":50,
    "BLDFMatchedDanmakuOpacity":100,
    "BLDFMatchedDanmakuColor":"",
    "BLDFMatchedDanmakuShadow":"",
    "BLDFJoinLetter":"：",
};

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

    var processMatchedTxt=(original,regex,joinLetter)=>{
        var matchres = original.match(regex);
        if(matchres&&matchres.length>0)matchres=matchres.filter(a=>a && a.trim());
        if(matchres&&matchres.length>1)matchres=matchres.splice(1);
        if(matchres)matchres=matchres.join(joinLetter);
        return matchres || null;
    }

    if(window.location.href.match(/.*live.bilibili.com.*/)) {
        if((GM_getValue("UpdateTime"))==null)GM_setValue("UpdateTime","NAN");
        updateTime=GM_getValue("UpdateTime");


        var main=setInterval(function () {


            $('iframe').each((i,o)=>{
                const blancPlayer=o.src.match(/live\.bilibili\.com\/blanc\/([0-9]+)/);
                if(blancPlayer){
                    console.log(blancPlayer);
                    $('body').append('<a href="https://live.bilibili.com/blanc/'+blancPlayer[1]+'" id="btnGoBlanc" style="position:absolute;top:100px;left:0;z-index=100;background:#00000088;color:#FFFFFF;padding:8px;font-size:14px" title="来自Bilibili Live Danmaku Filter">回到原版直播间</a>');

                    clearInterval(main);
                }
            });

            if($(".icon-left-part").length==0)return;
            clearInterval(main);



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
                             '    .SubtitleBody.mobile.Fullscreen{width:300px;}\n' +
                             '    .player-full-win .SubtitleBody.Fullscreen,.fullscreen-fix .SubtitleBody.Fullscreen{display:block;}\n' +
                             '    .invisibleDanmaku{opacity:0 !important;}\n' +
                             '    .like-btn-text{display:none;}\n' +
                             '    .super-chat-text{display:none;}\n' +
                             '    .icon-left-part .super-chat,.icon-left-part .super-chat{width:40px!important}\n' +
                             '    .BLDF .bili-danmaku-x-dm{opacity:'+(config.BLDFOtherDanmakuOpacity/100)+' !important;}\n' +
                             '    .BLDF .bili-danmaku-x-dm.matched-danmaku{'+
                             'opacity:'+(config.BLDFMatchedDanmakuOpacity/100)+' !important;'+
                             (config.BLDFMatchedDanmakuColor!=""?'color:'+config.BLDFMatchedDanmakuColor+' !important;':"")+
                             (config.BLDFMatchedDanmakuShadow!=""?'text-shadow: '+config.BLDFMatchedDanmakuShadow+' 1px 0px 1px, '+config.BLDFMatchedDanmakuShadow+' 0px 1px 1px, '+config.BLDFMatchedDanmakuShadow+' 0px -1px 1px, '+config.BLDFMatchedDanmakuShadow+' -1px 0px 1px !important;':"")+
                             '}\n' +
                             '    .SubtitleTextBodyFrame::-webkit-scrollbar {display: none;}' +
                             '    </style>');
            $(".icon-left-part").append('<span id="regexOn" title="开关过滤" class="icon-item icon-font icon-block" style="color: royalblue;margin: 0 5px;font-size: 20px;vertical-align: middle;"></span>');
            $(".icon-left-part").append('<span id="regexSettings" title="正则过滤设置" class="icon-item icon-font icon-config" style="color: royalblue;margin: 0 5px;font-size: 20px;vertical-align: middle;"></span>');
            if (config.BLDFNeedSubBody) {
                $("#gift-control-vm.gift-control-section").before('<div class="SubtitleBody"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div></div>');
                $(".live-player-mounter").append('<div class="SubtitleBody Fullscreen ui-resizable"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div></div>');
                $(".SubtitleBody.Fullscreen").draggable();
            }
            var startInterval = function () {

                if (config.BLDFRegex == null) return;
                if (intervalID >= 0) clearInterval(intervalID);
                BLDFReg = new RegExp(config.BLDFRegex);
                intervalID = setInterval(function () {
                    if(updateTime!=GM_getValue("UpdateTime")){
                        updateTime=GM_getValue("UpdateTime");
                        reloadConfig();
                        $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "已更新配置" + "</p>");
                        startInterval();
                    }
                    $(".bili-danmaku-x-dm").each(function (i, obj) {
                        //console.log(obj.innerHTML);
                        if (!(obj.innerHTML.substr(-7) == "</span>")) {
                            $(obj).removeClass("matched-danmaku");
                            // var matchres = obj.innerText.match(BLDFReg);
                            // if(matchres&&matchres.length>0)matchres=matchres.filter(a=>a && a.trim());
                            // if(matchres.length>1)matchres=matchres.splice(1).join(config.BLDFJoinLetter);else matchres=matchres[0];
                            let matchres=processMatchedTxt(obj.innerText,BLDFReg,config.BLDFJoinLetter);
                            //console.log(obj);
                            if (matchres != null && matchres != "") {
                                //if (config.BLDFShowDanmaku) $(obj).removeClass("invisibleDanmaku");
                                $(obj).addClass("matched-danmaku");
                                //console.log(matchres);
                                $('.SubtitleTextBody').prepend($("<p></p>").text(matchres));
                                /*
                                $('.SubtitleTextBody').each(function (i, obj) {
                                    $(obj).children().each(function (i, obj) {
                                        if (i >= 6) {
                                            //obj.remove();
                                        }
                                    });
                                });//*/
                                if (config.BLDFShowMatchedDanmakuText) $(obj).text(matchres);
                                if(config.BLDFRecord){
                                    var ls=localStorage.getItem("record");
                                    if (ls==null)ls=[];else ls=JSON.parse(ls);
                                    ls.push({time:new Date().getTime(),text:matchres[0]});
                                    localStorage.setItem("record",JSON.stringify(ls));
                                }
                            }
                            obj.innerHTML = obj.innerHTML + '<span></span>';
                        }
                        if($(obj).hasClass("matched-danmaku")&& $(obj).offset().left+$(obj).width()<$(".danmaku-item-container").offset().left){
                            //console.log("stopped");
                            $(obj).removeClass("matched-danmaku");
                        }
                    })
                }, config.BLDFIntervalDelay);
            }

            $("#regexSettings").click(function () {
                window.open("https://yuyuyzl.github.io/BiliDMFilter/");
            });

            $("#regexOn").click(function () {
                if (intervalID >= 0) {
                    clearInterval(intervalID);
                    $(".danmaku-item-container").removeClass("BLDF");
                    $(".bilibili-danmaku").each(function (i, obj) {
                        $(obj).removeClass("invisibleDanmaku");
                    });
                    intervalID=-1;
                    $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "弹幕过滤停止" + "</p>");
                }
                else {
                    $(".danmaku-item-container").addClass("BLDF");
                    $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "弹幕过滤开始" + "</p>");
                    startInterval();
                }
            });
            if (config.BLDFAutoStart) {
                $("#regexOn").click();
            }
        }, 100);

    }else
        if(window.location.href.match(/.*\/www.douyu.com\/.*/)){
            var main=setInterval(function(){
                var danmuClassName="";
                $("div").each((i,o)=>{
                    if($(o).attr("class") && $(o).attr("class").trim().substr(0,6)=="danmu-")danmuClassName=$(o).attr("class").trim();
                })
                if(danmuClassName!="")clearInterval(main);else return;
                console.log(danmuClassName);
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
                                 '    .SubtitleBody.Fullscreen{position:absolute;left:20px;bottom:30px;z-index:50000;background-color:rgba(0, 0, 0, 0.6);width:800px;display:none}\n' +
                                 '    .SubtitleBody.mobile.Fullscreen{width:300px;}\n' +
                                 '    .is-fullScreenPage .SubtitleBody.Fullscreen,:root:-webkit-full-screen-ancestor  .SubtitleBody.Fullscreen{display:block;}\n' +
                                 '    .is-fullScreenPage .SubtitleBody.Normalscreen{display:none;}\n' +
                                 '    .invisibleDanmaku{opacity:0 !important;}\n' +
                                 '    .BLDF .'+danmuClassName+' > div{opacity:'+(config.BLDFOtherDanmakuOpacity/100)+' !important;}\n' +
                                 '    .BLDF .'+danmuClassName+' > div.matched-danmaku{'+
                                 'opacity:'+(config.BLDFMatchedDanmakuOpacity/100)+' !important;'+
                                 (config.BLDFMatchedDanmakuColor!=""?'color:'+config.BLDFMatchedDanmakuColor+' !important;':"")+
                                 (config.BLDFMatchedDanmakuShadow!=""?'text-shadow: '+config.BLDFMatchedDanmakuShadow+' 1px 0px 1px, '+config.BLDFMatchedDanmakuShadow+' 0px 1px 1px, '+config.BLDFMatchedDanmakuShadow+' 0px -1px 1px, '+config.BLDFMatchedDanmakuShadow+' -1px 0px 1px !important;':"")+
                                 '}\n' +
                                 '    .SubtitleTextBodyFrame::-webkit-scrollbar {display: none;}' +
                                 '    </style>');
                $(".ChatToolBar").append('<div class="ChatEmotion" style="font-size: 16px;margin-top: -6px;" id="regexOn">💬</div>');
                $(".ChatToolBar").append('<div id="regexSettings" style="font-size: 22px;margin-top: -16px;" class="ChatEmotion">⚙</div>');
                if (config.BLDFNeedSubBody) {
                    $("#js-player-toolbar").before('<div class="SubtitleBody Normalscreen"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div></div>');
                    $("#room-html5-player").append('<div class="SubtitleBody Fullscreen ui-resizable"><div style="height:100%;position:relative;"><div class="SubtitleTextBodyFrame"><div class="SubtitleTextBody"></div></div></div><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div></div>');
                    $(".SubtitleBody.Fullscreen").draggable();
                }
                var startInterval=function(){
                    if (config.BLDFRegex == null) return;
                    if (intervalID >= 0) clearInterval(intervalID);
                    BLDFReg = new RegExp(config.BLDFRegex);
                    intervalID = setInterval(function () {
                        $("."+danmuClassName).children().each((i,obj)=>{
                            if(!(obj.innerHTML.substr(-7) == "</span>")){
                                var matchres;
                                $(obj).children().each((i,o)=>{
                                    //console.log($(o).attr("class").trim());
                                    if($(o).attr("class").trim().substr(0,5)=="text-" || $(o).attr("class").trim().substr(0,6)=="super-")matchres=$(o).text();
                                });
                                console.log(matchres);
                                matchres = matchres.match(BLDFReg);
                                //console.log(obj.innerText);
                                if (matchres != null && matchres != "") {
                                    //if (config.BLDFShowDanmaku) $(obj).removeClass("invisibleDanmaku");
                                    $(obj).addClass("matched-danmaku");
                                    //console.log(matchres);
                                    $('.SubtitleTextBody').prepend($("<p></p>").text(matchres));
                                    /*
                                    $('.SubtitleTextBody').each(function (i, obj) {
                                        $(obj).children().each(function (i, obj) {
                                            if (i >= 6) {
                                                //obj.remove();
                                            }
                                        });
                                    });//*/
                                    if (config.BLDFShowMatchedDanmakuText) $(obj).children().each((i,o)=>{
                                        //console.log($(o).attr("class").trim());
                                        if($(o).attr("class").trim().substr(0,5)=="text-" || $(o).attr("class").trim().substr(0,6)=="super-")$(o).text(matchres);
                                    });
                                    if(config.BLDFRecord){
                                        var ls=localStorage.getItem("record");
                                        if (ls==null)ls=[];else ls=JSON.parse(ls);
                                        ls.push({time:new Date().getTime(),text:matchres[0]});
                                        localStorage.setItem("record",JSON.stringify(ls));
                                    }
                                }
                                obj.innerHTML = obj.innerHTML + '<span></span>';
                            }
                        });
                    }, config.BLDFIntervalDelay);
                }
                $("#regexSettings").click(function () {
                    window.open("https://yuyuyzl.github.io/BiliDMFilter/");
                });

                $("#regexOn").click(function () {
                    if (intervalID >= 0) {
                        clearInterval(intervalID);
                        $("body").removeClass("BLDF");
                        $(".bilibili-danmaku").each(function (i, obj) {
                            $(obj).removeClass("invisibleDanmaku");
                        });
                        intervalID=-1;
                        $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "弹幕过滤停止" + "</p>");
                    }
                    else {
                        $("body").addClass("BLDF");
                        $('.SubtitleTextBody').prepend("<p style='color: gray'>" + "弹幕过滤开始" + "</p>");
                        startInterval();
                    }
                });
                if (config.BLDFAutoStart) {
                    $("#regexOn").click();
                }
            },100);

        }else


            if(window.location.href.match(/.*\/BiliDMFilter\/.*/)){
                console.log(config);
                $("#BLDFSettingsSave").removeAttr("disabled");
                Object.keys(config).forEach(function(key){
                    $("#"+key).removeAttr("disabled");
                    console.log(typeof config[key]);
                    if (typeof config[key]=="string"||typeof config[key]=="number")$("#"+key).val(config[key]);
                    if (typeof config[key]=="boolean")$("#"+key).attr("checked", config[key]);
                });
                $('#BLDFSettingsSave').click(function () {
                    GM_setValue("UpdateTime",new Date()+'');
                    Object.keys(config).forEach(function(key){
                        if (typeof config[key]=="string")GM_setValue(key,$("#"+key).val());
                        if (typeof config[key]=="number")GM_setValue(key,parseInt($("#"+key).val()));
                        if (typeof config[key]=="boolean")GM_setValue(key,$("#"+key).is(':checked'));
                    });
                })

            }

})();