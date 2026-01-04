// ==UserScript==
// @name         大声朗读 - TTS辅助阅读
// @namespace    http://tampermonkey.net/
// @version      0.3.2.2
// @description  极为好用的网页朗读器，集成微软/百度TTS，在浏览器上实时文本转语音 支持移动端| 全平台适用
// @author       GAEE
// @match        http://*/*
// @match        https://*/*
// @exclude      https://example.com/
// @icon         data:image/png;base64,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
// @run-at       document-end
// @grant        GM_download
// @connect      azure.microsoft.com
// @connect      ai.baidu.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @license      none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/442967-tts-sdk/code/TTS_SDK.js?version=1037522
// @require      https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk@1.15.1/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/429810/%E5%A4%A7%E5%A3%B0%E6%9C%97%E8%AF%BB%20-%20TTS%E8%BE%85%E5%8A%A9%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/429810/%E5%A4%A7%E5%A3%B0%E6%9C%97%E8%AF%BB%20-%20TTS%E8%BE%85%E5%8A%A9%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==
//this.$ = this.jQuery = jQuery.noConflict(true);
let version = "0.3.2.2 Alpha 实验版";
var Global_TEXT = "";
var MicrosoftTTS_info = {
    person: "zh-CN-XiaoxiaoNeural",
    speed: 1,
    pitch: 1,
    status: false,
};
var BaiduTTS_info = {
    person: 4003,
    speed: 5,
    pitch: 5,
    status: false,
};
var info = {
    type: "microsoft",
};
var setting = {
    version: version,
    speech_type: "all_text",
};
var TTS_GLOBAL,TTS_MORE_GLOBAL;

(function() {
    'use strict';

    init_voice_setting();

    GM_addStyle('body{user-select:auto !important; -webkit-user-select:auto !important; -moz-user-select:auto !important; -ms-user-select:auto !important; }');
    GM_addStyle('#GAEE_TTS_IFRAME,.div {bottom: 10%;transform: translate(10px);position: fixed;z-index: 1000;background-spanor: transparent;transform: translate(0);}.TTS_Button {display: flex;justify-content: center;align-items: center;height: 31px;width: 20px;border-radius: 8px;padding: 7px 12px;font-size: 12px;spanor: #969696;//border-radius: 50%;box-shadow: 0 2px 10px rgb(0 0 0 / 5%);background-spanor: white;background: rgba(255, 255, 255, 0.9);margin-left: 8px;transform-origin: center;transition: .2s;cursor: pointer;flex-direction: spanumn;}.TTS_Button:hover {background: #e3e5e7;}.TTS_Card {position: fixed;//position：relative;box-sizing: border-box;padding: 18px;width: 360px;height: 200px;border-radius: 8px;background: white;box-shadow: 0 3px 12px rgb(0 0 0 / 20%);font-size: 16px;bottom: 18%;margin-left: 9px;-moz-user-select: none;-khtml-user-select: none;user-select: none;z-index: 1000;}.TTS_Card .close {position: absolute;top: 14px;right: 14px;width: 14px;height: 14px;cursor: pointer;}.TTS_Card .title {margin-bottom: 16px;margin-left: 2px;//spanor: black;//font-size: 16px;line-height: 22px;display: flex;}.TTS_Card .title .title_text {spanor: black;font-size: 16px;margin-right: 30px;}.TTS_Card .title .TTS_Change {display: flex;}.TTS_Card .title .TTS_Change .il {margin-left: 40px;font-size: 16px;font-family: "微软雅黑";color: #969696;border-bottom: 2px solid #ffffff;cursor: pointer;}.TTS_Card .title .TTS_Change .il:hover {border-bottom: 2px dashed #F00;}.TTS_Card .title .TTS_Change .il:focus {outline: none;border-bottom: 2px solid #F00;}.TTS_Card .login-tip-content-item>* {display: flex;align-items: center;margin-bottom: 14px;width: 50%;height: 26px;}.setting {//position：relative;position: absolute;weight: 100%;height: auto;//max-height: 145px;//background:green;//overflow: auto;}.setting .row {margin: auto;max-height: 50px;width: 100%;overflow: auto;// overflow-x: scroll;// overflow-y: hidden;//white-space: nowrap;margin-bottom: 12px;}.setting .col {width: auto;}.setting .span {width: 70px;height: 30px;float: left;margin-right: 1px;//color: red;color: #2C3E50;cursor: pointer;}.setting .setting_down {display: flex;}.setting .speech_set {font-size: 13px;margin-top: 3px;}.setting .slider {width: 170px;height: 20px;margin: 0;transform-origin: 75px 75px;}.setting .others {display: flex;font-size: inherit;margin-left: auto;}.setting .others .more {background-color: #DCDCDC;border: 1px solid #DCDCDC;color: #fff;display: inline-block;font-size: 9px;padding: 2px 18px;height: 20px;cursor: pointer;}.setting .others .listen {background-color: #0078d4;border: 1px solid #0078d4;border-radius: 3px;color: #fff;display: inline-block;font-size: 9px;padding: 5px 8px;cursor: pointer;}.setting .others .more:active {background-color: #C0C0C0;}.setting .others .listen:active {background-color: #0062ad;}::-webkit-scrollbar {width: 4px;height: 4px;background-color: transparent;}::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px transparent;border-radius: 10px;background-color: white;}::-webkit-scrollbar-thumb {border-radius: 10px;-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);background-color: #555;}.setting a {color: #2a5caa;text-decoration: none;}');

    let BUTTON = '<div class="div"><div class="TTS_Button" id="TTS_Button"><svg width="1.7em" height="1.7em" t="1649228019321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2481" width="200" height="200"><path id="icon-start"          d="M920.8 600.5V491c0-55.7-11-109.8-32.7-160.9-20.9-49.3-50.9-93.6-88.9-131.6-38.1-38.1-82.4-68-131.6-88.9-51.1-21.7-105.2-32.7-160.9-32.7s-109.8 11-160.9 32.7c-49.3 20.9-93.6 50.9-131.6 88.9-38.1 38.1-68 82.4-88.9 131.6-21.9 51.1-32.9 105.2-32.9 160.9v109.5c-21.7 33.2-33.2 73.2-33.2 115.6 0 42.6 11.6 82.7 33.4 116 17.8 27.2 41.7 47.9 68.5 59.8 9.6 32.2 39.5 55.7 74.7 55.7H265c43 0 78-35 78-78v-307c0-43-35-78-78-78h-29.2c-35.2 0-65.1 23.5-74.7 55.7-4.3 1.9-8.6 4.1-12.8 6.5V491c0-48.1 9.5-94.9 28.2-139 18.1-42.6 44-81 77-113.9 33-33 71.3-58.9 113.9-77 44.1-18.7 90.9-28.2 139-28.2 48.1 0 94.9 9.5 139 28.2 42.6 18.1 81 44 113.9 77 33 33 58.9 71.3 77 113.9 18.7 44.1 28.2 90.9 28.2 139v55.8c-4.2-2.4-8.4-4.6-12.8-6.5-9.6-32.2-39.5-55.7-74.7-55.7h-29.2c-43 0-78 35-78 78v307c0 43 35 78 78 78H777c35.2 0 65.1-23.5 74.7-55.7 26.8-12 50.7-32.7 68.5-59.8 21.9-33.3 33.4-73.4 33.4-116 0.4-42.4-11.1-82.3-32.8-115.6z"          fill="#969696" p-id="2482"></path><path id="icon-playing"          d="M512 816.213333c-23.466667 0-42.666667-19.2-42.666667-42.666666V250.88c0-23.466667 19.2-42.666667 42.666667-42.666667s42.666667 19.2 42.666667 42.666667v522.666667c0 23.466667-19.2 42.666667-42.666667 42.666666zM341.333333 597.333333c-23.466667 0-42.666667-19.2-42.666666-42.666666v-85.333334c0-23.466667 19.2-42.666667 42.666666-42.666666s42.666667 19.2 42.666667 42.666666v85.333334c0 23.466667-19.2 42.666667-42.666667 42.666666zM853.333333 640c-23.466667 0-42.666667-19.2-42.666666-42.666667v-170.666666c0-23.466667 19.2-42.666667 42.666666-42.666667s42.666667 19.2 42.666667 42.666667v170.666666c0 23.466667-19.2 42.666667-42.666667 42.666667zM170.666667 682.666667c-23.466667 0-42.666667-19.2-42.666667-42.666667V384c0-23.466667 19.2-42.666667 42.666667-42.666667s42.666667 19.2 42.666666 42.666667v256c0 23.466667-19.2 42.666667-42.666666 42.666667zM682.666667 727.893333c-23.466667 0-42.666667-19.2-42.666667-42.666666V338.773333c0-23.466667 19.2-42.666667 42.666667-42.666666s42.666667 19.2 42.666666 42.666666v346.88a42.666667 42.666667 0 0 1-42.666666 42.24z"          fill="#969696" p-id="1413"></path></svg></div></div>';
    let CARD = '<div class="TTS_Card" id="TTS_Card"><div class="close" id="card_close"><svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#969696" stroke-linecap="round"></path></svg></div><div class="title"><div class="title_text">        TTS</div><div class="TTS_Change"><div id="microsoft" tabindex="1" class="il">          微软</div><div id="baidu" tabindex="2" class="il" style="border-bottom: 2px solid #F00;">          百度</div><div id="about" tabindex="3" class="il">          关于</div></div></div><div class="card"><div class="setting" id="microsoft_card" style="display: none;"><div>          代码正在构建中</div></div><div class="setting" id="baidu_card" style="display: show;"><div class="row"><div class="col"><div class="span" aria-label="4003">              度逍遥</div><div class="span" aria-label="4115">              度小贤</div><div class="span" aria-label="4119">              度小鹿</div><div class="span" aria-label="4100">              度小雯</div><div class="span" aria-label="4106">              度博文</div><div class="span" aria-label="4103">              度米朵</div></div></div><div class="speech_set"><label for="speed" id="speedlabel">语速: 5</label><div class="slider"><input type="range" id="speed" name="speed" min="0" max="15" value="5" class="slider__input" data-bi-id="demo-rate-slider" aria-label="语速"></div></div><div class="speech_set"><label for="pitch" id="pitchlabel">音调: 5</label><div class="slider"><input type="range" id="pitch" name="pitch" min="0" max="15" value="5" class="slider__input" data-bi-id="demo-pitch-slider" aria-label="音调"></div></div></div></div><div class="setting" id="about_card" style="display: none;"><div>        本项目由GAEE维护支持  <a href="https://greasyfork.org/zh-CN/scripts/429810-%E5%A4%A7%E5%A3%B0%E6%9C%97%E8%AF%BB">首页</a></div><div><img style="height:32%;width:32%;" src="https://img.github.luxe/2022/d1807e2d06008.png" alt="90kskmwly1smny0t4dz6vh750k8n.png" title="支持一下" /></div></div></div>';

    if(!document.querySelector("#GAEE_TTS_IFRAME")){
        var b = document.createElement('iframe');
        b.setAttribute("id","GAEE_TTS_IFRAME");
        b.setAttribute("title","GAEE_TTS");
        b.style.cssText = "height:60px; width:70px; border: unset; scrolling:no; display: flex;";
        document.body.appendChild(b);
    }
    var _TTS_ = document.querySelector("#GAEE_TTS_IFRAME");
    TTS_GLOBAL = $($("#GAEE_TTS_IFRAME")[0].contentWindow.document);
    add_TTS_Style(_TTS_.contentWindow.document,'.div {bottom: 10px;transform: translate(10px);position: fixed;z-index: 1000;background-spanor: transparent;transform: translate(0);}.TTS_Button {display: flex;justify-content: center;align-items: center;height: 31px;width: 20px;border-radius: 8px;padding: 7px 12px;font-size: 12px;spanor: #969696;//border-radius: 50%;box-shadow: 0 2px 10px rgb(0 0 0 / 5%);background-spanor: white;background: rgba(255, 255, 255, 0.9);margin-left: 8px;transform-origin: center;transition: .2s;cursor: pointer;flex-direction: spanumn;}.TTS_Button:hover {background: #e3e5e7;}.TTS_Card {position: fixed;//position：relative;box-sizing: border-box;padding: 18px;width: 360px;height: 200px;border-radius: 8px;background: white;box-shadow: 0 3px 12px rgb(0 0 0 / 20%);font-size: 16px;bottom: unset;margin-left: 9px;-moz-user-select: none;-khtml-user-select: none;user-select: none;z-index: 1000;}.TTS_Card .close {position: absolute;top: 14px;right: 14px;width: 14px;height: 14px;cursor: pointer;}.TTS_Card .title {margin-bottom: 16px;margin-left: 2px;//spanor: black;//font-size: 16px;line-height: 22px;display: flex;}.TTS_Card .title .title_text {spanor: black;font-size: 16px;margin-right: 30px;}.TTS_Card .title .TTS_Change {display: flex;}.TTS_Card .title .TTS_Change .il {margin-left: 40px;font-size: 16px;font-family: "微软雅黑";color: #969696;border-bottom: 2px solid #ffffff;cursor: pointer;}.TTS_Card .title .TTS_Change .il:hover {border-bottom: 2px dashed #F00;}.TTS_Card .title .TTS_Change .il:focus {outline: none;border-bottom: 2px solid #F00;}.TTS_Card .login-tip-content-item>* {display: flex;align-items: center;margin-bottom: 14px;width: 50%;height: 26px;}.setting {//position：relative;position: absolute;weight: 100%;height: auto;//max-height: 145px;//background:green;//overflow: auto;}.setting .row {margin: auto;max-height: 50px;width: 100%;overflow: auto;// overflow-x: scroll;// overflow-y: hidden;//white-space: nowrap;margin-bottom: 12px;}.setting .col {width: auto;}.setting .span {width: 70px;height: 30px;float: left;margin-right: 1px;//color: red;color: #2C3E50;cursor: pointer;}.setting .setting_down {display: flex;}.setting .speech_set {font-size: 13px;margin-top: 3px;}.setting .slider {width: 170px;height: 20px;margin: 0;transform-origin: 75px 75px;}.setting .others {display: flex;font-size: inherit;margin-left: auto;}.setting .others .more {background-color: #DCDCDC;border: 1px solid #DCDCDC;color: #fff;display: inline-block;font-size: 9px;padding: 2px 18px;height: 20px;cursor: pointer;}.setting .others .listen {background-color: #0078d4;border: 1px solid #0078d4;border-radius: 3px;color: #fff;display: inline-block;font-size: 9px;padding: 5px 8px;cursor: pointer;}.setting .others .more:active {background-color: #C0C0C0;}.setting .others .listen:active {background-color: #0062ad;}::-webkit-scrollbar {width: 4px;height: 4px;background-color: transparent;}::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px transparent;border-radius: 10px;background-color: white;}::-webkit-scrollbar-thumb {border-radius: 10px;-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);background-color: #555;}.setting a {color: #2a5caa;text-decoration: none;}');
    _TTS_.contentWindow.document.body.innerHTML = BUTTON;

    UIinit();
    rebind();

    var timeOutEvent,mobile_timeOutEvent;
    var longClick = 0;
    var mobile_longClick = 0;
    TTS_GLOBAL.find("#TTS_Button").on({
        mousedown: function(e) {
            if(e && e.preventDefault) {
                e.preventDefault();
            }
            longClick = 0;
            timeOutEvent = setTimeout(function() {
                longClick = 1;
                ShowCard();
            }, 300);
        },
        mouseup: function() {
            clearTimeout(timeOutEvent);
        },
        click: function(e) {
            clearTimeout(timeOutEvent);
            if (longClick == 0) {
                CLICKED();
            }
            return false;
        }
    });
    TTS_GLOBAL.find("#TTS_Button").on({
        touchstart: function(e) {
            mobile_longClick = 0;
            mobile_timeOutEvent = setTimeout(function() {
                mobile_longClick = 1;
                ShowCard();
            }, 300);
        },
        touchmove: function(e) {
            clearTimeout(mobile_timeOutEvent);
            mobile_timeOutEvent = 0;
            e.preventDefault();
        },
        touchend: function(e) {
            clearTimeout(mobile_timeOutEvent);
            if (mobile_timeOutEvent != 0 && mobile_longClick == 0) {
                CLICKED();
            }
            return false;
        }
    });
    function CLICKED(){
        init();
        var TEXT = "";
        if(setting.speech_type == "all_text"){
            TEXT = window.getSelection().toString() || Get_InnerText();
        }else if(setting.speech_type == "next_text"){
            TEXT = Get_InnerText().slice(Get_InnerText().indexOf(window.getSelection().toString()));
        }
        if(info.type == "baidu"){
            if(!BaiduTTS_info.status){
                BaiduTTS(TEXT);
            }
        }else if(info.type == "microsoft"){
            if(!MicrosoftTTS_info.status){
                AzureTTS(TEXT);
            }
        }
    }
})();

function add_TTS_Style(_TTS_,css) {
    var head, style;
    head = _TTS_.getElementsByTagName('head')[0];
    if (!head) { console.log("未能添加TTS样式");return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function change_TTS_Size(w,h){
    $("#GAEE_TTS_IFRAME").width(w);
    $("#GAEE_TTS_IFRAME").height(h);
}

function UIinit() {
    icon_change("init");
    TTS_GLOBAL.find('.span').css('color', '#2C3E50');
    TTS_GLOBAL.find('.span').each(function() {
        if (info.type == "baidu") {
            ShowBaiduCard();
            if ($(this).attr('aria-label') == BaiduTTS_info.person) {
                $(this).css('color', 'red');
            }
        } else if (info.type == "microsoft") {
            ShowMicrosoftCard();
            if ($(this).attr('aria-label') == MicrosoftTTS_info.person) {
                $(this).css('color', 'red');
            }
        }
    });
    TTS_GLOBAL.find("#microsoft_speedlabel").text("\u8bed\u901f: " + MicrosoftTTS_info.speed);
    TTS_GLOBAL.find("#microsoft_pitchlabel").text("\u97f3\u8c03: " + MicrosoftTTS_info.pitch);
    TTS_GLOBAL.find("#microsoft_speed").val(MicrosoftTTS_info.speed*100-100);
    TTS_GLOBAL.find("#microsoft_pitch").val(MicrosoftTTS_info.pitch*50-50);
    TTS_GLOBAL.find("#baidu_speedlabel").text("\u8bed\u901f: " + BaiduTTS_info.speed);
    TTS_GLOBAL.find("#baidu_pitchlabel").text("\u97f3\u8c03: " + BaiduTTS_info.pitch);
    TTS_GLOBAL.find("#baidu_speed").val(BaiduTTS_info.speed);
    TTS_GLOBAL.find("#baidu_pitch").val(BaiduTTS_info.pitch);
}

function UIinit2(){
    if(setting.speech_type == "all_text"){
        TTS_MORE_GLOBAL.find("#c1").prop("checked",false);
    }else if(setting.speech_type == "next_text"){
        TTS_MORE_GLOBAL.find("#c1").prop("checked",true);
    }
}

function ShowMicrosoftCard() {
    TTS_GLOBAL.find("#microsoft_card").show();
    TTS_GLOBAL.find("#baidu_card").hide();
    TTS_GLOBAL.find("#about_card").hide();
    TTS_GLOBAL.find("#microsoft").css("border-bottom", "2px solid #F00");
    TTS_GLOBAL.find("#baidu").css("border-bottom", "");
    TTS_GLOBAL.find("#about").css("border-bottom", "");
}

function ShowBaiduCard() {
    TTS_GLOBAL.find("#microsoft_card").hide();
    TTS_GLOBAL.find("#baidu_card").show();
    TTS_GLOBAL.find("#about_card").hide();
    TTS_GLOBAL.find("#microsoft").css("border-bottom", "");
    TTS_GLOBAL.find("#baidu").css("border-bottom", "2px solid #F00");
    TTS_GLOBAL.find("#about").css("border-bottom", "");
}

function ShowAboutCard() {
    TTS_GLOBAL.find("#microsoft_card").hide();
    TTS_GLOBAL.find("#baidu_card").hide();
    TTS_GLOBAL.find("#about_card").show();
    TTS_GLOBAL.find("#microsoft").css("border-bottom", "");
    TTS_GLOBAL.find("#baidu").css("border-bottom", "");
    TTS_GLOBAL.find("#about").css("border-bottom", "2px solid #F00");
}

function rebind() {
    TTS_GLOBAL.find("#microsoft_speed").change(function() {
        var i = $(this).val();
        var n = (i - (-100)) / (200 - (-100)) * 3;
        var speedValue = Math.abs(n) < 1 ? n.toPrecision(2) : n.toPrecision(3);
        TTS_GLOBAL.find("#microsoft_speedlabel").text("\u8bed\u901f: " + speedValue);
        MicrosoftTTS_info.speed = speedValue;
    });
    TTS_GLOBAL.find("#microsoft_pitch").change(function() {
        var i = $(this).val();
        var n = (i - (-50)) / (50 - (-50)) * 2;
        var pitchValue = Math.abs(n) < 1 ? n.toPrecision(2) : n.toPrecision(3);
        TTS_GLOBAL.find("#microsoft_pitchlabel").text("\u97f3\u8c03: " + pitchValue);
        MicrosoftTTS_info.pitch = pitchValue;
    });
    TTS_GLOBAL.find("#baidu_speed").change(function() {
        var speedValue = $(this).val();
        TTS_GLOBAL.find("#baidu_speedlabel").text("\u8bed\u901f: " + speedValue);
        BaiduTTS_info.speed = speedValue;
    });
    TTS_GLOBAL.find("#baidu_pitch").change(function() {
        var pitchValue = $(this).val();
        TTS_GLOBAL.find("#baidu_pitchlabel").text("\u97f3\u8c03: " + pitchValue);
        BaiduTTS_info.pitch = pitchValue;
    });
    TTS_GLOBAL.find('.span').on('click', function(e) {
        TTS_GLOBAL.find('.span').css('color', '#2C3E50');
        TTS_GLOBAL.find(this).css('color', 'red');
        var id = $(this).parent().parent().parent().attr('id');
        if (id == "baidu_card") {
            BaiduTTS_info.person = $(this).attr('aria-label');
            info.type = "baidu";
        } else if (id == "microsoft_card") {
            MicrosoftTTS_info.person = $(this).attr('aria-label');
            info.type = "microsoft";
        }
    });
    TTS_GLOBAL.find(".more").click(function() {
        Show_more_card();
    });
    TTS_GLOBAL.find(".listen").click(function() {
        TryListen();
    });
    TTS_GLOBAL.find("#card_close").click(function() {
        TTS_GLOBAL.find("#TTS_Card").remove();
        change_TTS_Size(70,60);
        voice_setting();
    });
    TTS_GLOBAL.find("#microsoft").click(function() {
        ShowMicrosoftCard();
    });
    TTS_GLOBAL.find("#baidu").click(function() {
        ShowBaiduCard();
    });
    TTS_GLOBAL.find("#about").click(function() {
        ShowAboutCard();
    });
}

function rebind2(){
    TTS_MORE_GLOBAL.find("#c1").click(function() {
        if($(this).prop("checked")){
            setting.speech_type = "next_text";
        }else{
            setting.speech_type = "all_text";
        }
    });
    TTS_MORE_GLOBAL.find("#card_close").click(function() {
        $("#GAEE_TTS_MORE").remove();
        voice_setting();
    });
}

function ShowCard() {
    if (TTS_GLOBAL.find("#TTS_Card").length > 0) {
        return;
    }
    change_TTS_Size(387,275);
    let CARD =
        `<div class="TTS_Card" id="TTS_Card"><div class="close" id="card_close"><svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#969696" stroke-linecap="round"></path></svg></div><div class="title"><div class="title_text">        TTS</div><div class="TTS_Change"><div id="microsoft" tabindex="1" class="il">          微软</div><div id="baidu" tabindex="2" class="il" style="border-bottom: 2px solid #F00;">          百度</div><div id="about" tabindex="3" class="il">          关于</div></div></div><div class="card"><div class="setting" id="microsoft_card" style="display: none;"><div class="row"><div class="col"><div class="span" aria-label="zh-CN-XiaoxiaoNeural">              晓晓</div><div class="span" aria-label="zh-CN-XiaochenNeural">              晓辰</div><div class="span" aria-label="zh-CN-YunxiNeural">              云希</div><div class="span" aria-label="zh-CN-YunyangNeural">              云扬</div><div class="span" aria-label="zh-CN-XiaohanNeural">              晓涵</div><div class="span" aria-label="zh-CN-XiaoqiuNeural">              晓秋</div><div class="span" aria-label="zh-CN-XiaoxuanNeural">              晓萱</div><div class="span" aria-label="zh-CN-XiaoyanNeural">              晓颜</div><div class="span" aria-label="zh-CN-XiaoyouNeural">              晓悠</div><div class="span" aria-label="zh-CN-XiaoshuangNeural">              晓双</div><div class="span" aria-label="zh-CN-YunyeNeural">              云野</div></div></div><div class="setting_down"><div class="setting_sp"><div class="speech_set"><label for="speed" id="microsoft_speedlabel">语速: 1.00</label><div class="slider"><input type="range" id="microsoft_speed" name="speed" min="-100" max="200" value="0" class="slider__input" data-bi-id="demo-rate-slider" aria-label="语速"></div></div><div class="speech_set"><label for="pitch" id="microsoft_pitchlabel">音调: 0.00</label><div class="slider"><input type="range" id="microsoft_pitch" name="pitch" min="-50" max="50" value="0" class="slider__input" data-bi-id="demo-pitch-slider" aria-label="音调"></div></div></div><div class="others"><div style="margin-right:80px;width:100%;display: flex;flex-wrap: wrap-reverse;"><button class="more" type="button">更多</button></div><button class="listen" type="button">试听</button></div></div></div><div class="setting" id="baidu_card" style="display: show;"><div class="row"><div class="col"><div class="span" aria-label="4003">              度逍遥</div><div class="span" aria-label="4115">              度小贤</div><div class="span" aria-label="4119">              度小鹿</div><div class="span" aria-label="4100">              度小雯</div><div class="span" aria-label="4106">              度博文</div><div class="span" aria-label="4103">              度米朵</div></div></div><div class="setting_down"><div class="setting_sp"><div class="speech_set"><label for="speed" id="baidu_speedlabel">语速: 5</label><div class="slider"><input type="range" id="baidu_speed" name="speed" min="0" max="15" value="5" class="slider__input" data-bi-id="demo-rate-slider" aria-label="语速"></div></div><div class="speech_set"><label for="pitch" id="baidu_pitchlabel">音调: 5</label><div class="slider"><input type="range" id="baidu_pitch" name="pitch" min="0" max="15" value="5" class="slider__input" data-bi-id="demo-pitch-slider" aria-label="音调"></div></div></div><div class="others"><div style="margin-right:80px;width:100%;display: flex;flex-wrap: wrap-reverse;"><button class="more" type="button">更多</button></div><button class="listen" type="button">试听</button></div></div></div></div><div class="setting" id="about_card" style="display: none;"><div style="font-family: 'Lucida Console', 'Courier New', monospace;">        本项目由GAEE维护支持<a href="https://greasyfork.org/zh-CN/scripts/429810-%E5%A4%A7%E5%A3%B0%E6%9C%97%E8%AF%BB" target="_parent">首页</a></div><div><img style="height:auto;width:31%;" src="https://img.github.luxe/2022/d1807e2d06008.png" alt="90kskmwly1smny0t4dz6vh750k8n.png" title="支持一下" /></div></div></div>`;
    TTS_GLOBAL.find("body").append(CARD);
    UIinit();
    rebind();
}

function Show_more_card(){
    if(!document.querySelector("#GAEE_TTS_MORE")){
        var a = document.createElement('div');
        a.setAttribute("id","GAEE_TTS_MORE");
        document.body.appendChild(a);
        var b = document.createElement('iframe');
        b.setAttribute("id","GAEE_TTS_MORE_IFRAME");
        b.setAttribute("title","GAEE_TTS_MORE_IFRAME");
        b.style.cssText = "position: fixed;display: block;border-radius: 8px;border: unset; scrolling:no;left: 50%;top: 50%;z-index: 10001;-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background-color: #fff;";
        a.appendChild(b);
        let CARD = `<div class="card"><div class="title"><div class="title_text">TTS 高级设置</div><div class="close" id="card_close"><svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#969696" stroke-linecap="round"></path></svg></div></div><div class="line"><div class="info" style="float:left; margin-right:20px">从选中位置开始朗读</div><div class="click" style="float:right;"><input type="checkbox" name="checkbox" id="c1" class="chooseBtn" /><label for="c1" class="choose-label"></label></div></div></div>`;
        $($("#GAEE_TTS_MORE_IFRAME")[0].contentWindow.document).find("body").append(CARD);
    }
    var _TTS_ = document.querySelector("#GAEE_TTS_MORE_IFRAME");
    TTS_MORE_GLOBAL = $($("#GAEE_TTS_MORE_IFRAME")[0].contentWindow.document);
    add_TTS_Style(_TTS_.contentWindow.document,'.card {user-select: none;}.chooseBtn {display: none;}.choose-label {box-shadow: #ccc 0px 0px 0px 1px;width: 40px;height: 20px;display: inline-block;border-radius: 20px;position: relative;background-color: #bdbdbd;overflow: hidden;}.choose-label:before {content: "";position: absolute;left: 0;width: 20px;height: 20px;display: inline-block;border-radius: 20px;background-color: #fff;z-index: 20;-webkit-transition: all 0.5s;transition: all 0.5s;}.chooseBtn:checked+label.choose-label:before {left: 20px;}.chooseBtn:checked+label.choose-label {background-color: #51ccee;}.close {position: absolute;top: 14px;right: 14px;width: 14px;height: 14px;cursor: pointer;}.title {margin-bottom: 16px;margin-left: 2px;line-height: 22px;display: flex;}.title .title_text {spanor: black;font-size: 16px;margin-right: 30px;}');
    UIinit2();
    rebind2();
}

function Get_InnerText(){
    var text = document.body.innerText;
    text = escapeHtml(text);
    text = cleanHtml(text);
    text = text.replace(/<[^<>]+>/g,"");
    //console.log(text);
    return text;
}
function escapeHtml(String) {
    return String.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function cleanHtml(String){
    let s_a = /<script[^<>]*>/g;
    let s_b = /<\/script>/g;
    var text = "";
    text = String.split(s_a)[0];
    for (var i = 1; i < String.split(s_a).length; i++) {
        var a = String.split(s_a)[i];a=a.split(s_b)[1];
        text+=a;
    }
    //console.log(text);
    return text;
}

function init(){
    if(!document.querySelector("#GAEE_TTS")){
        var audio = document.createElement('audio');
        audio.setAttribute("id","GAEE_TTS");
        //audio.setAttribute("controls","controls");
        audio.setAttribute("hidden","true");
        document.body.appendChild(audio);
        audio.addEventListener('ended', function () {
            console.log("end");
            icon_change("end");
            BaiduTTS_info.status = false;
            if(Global_TEXT.length != 0){
                BaiduTTS(Global_TEXT);
            }
        }, false);
    }
}

function play(data){
    $(document).ready(function() {
        BaiduTTS_info.status = true;
        console.log("start");
        icon_change("play");
        toPlay(data);
        TTS_GLOBAL.find("#TTS_Button").click(function() {
            if(BaiduTTS_info.status && info.type == "baidu"){
                console.log("pause");
                icon_change("end");
                var a = document.getElementById('GAEE_TTS');
                a !== null && a.pause();
                a = null;
                BaiduTTS_info.status = false;
            }
        });
        TTS_GLOBAL.find("#TTS_Button").on("touchstart", function() {
            if(BaiduTTS_info.status && info.type == "baidu"){
                console.log("pause");
                icon_change("end");
                var a = document.getElementById('GAEE_TTS');
                a !== null && a.pause();
                a = null;
                BaiduTTS_info.status = false;
            }
        });
    });
}

function toPlay(data){
    var audioBlob = toBlob(data);
    var blobUrl = window.URL.createObjectURL(audioBlob);
    document.getElementById('GAEE_TTS').src = blobUrl;
    var audio = document.getElementById('GAEE_TTS');
    audio.play();
    if (audio.paused) {
        audio.paused=false;
        audio.play();
    }
}

function toBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function icon_change(type){
    if(type=="play"){
        TTS_GLOBAL.find("#icon-start").hide();
        TTS_GLOBAL.find("#icon-playing").show();
    }else if(type=="end" || type=="init"){
        TTS_GLOBAL.find("#icon-start").show();
        TTS_GLOBAL.find("#icon-playing").hide();
    }
}

function BaiduTTS(TEXT){
    var str = TEXT;
    var slen = 150;
    var elen = 200;
    var len = elen;
    var _a = str.slice(slen,elen);
    if(_a.indexOf("。")!=-1){
        len = slen + _a.indexOf("。") + 1;
        Global_TEXT = str.slice(len,TEXT.length);
    }else{
        Global_TEXT = str.slice(len,TEXT.length);
    }
    var BaiduTTS_postdata = "type=tns&per="+BaiduTTS_info.person+"&spd="+BaiduTTS_info.speed+"&pit="+BaiduTTS_info.pitch+"&vol=5&aue=6&tex="+encodeURIComponent(str.slice(0,len));
    GM_xmlhttpRequest({
        url:"https://ai.baidu.com/aidemo",
        method :"POST",
        data:BaiduTTS_postdata,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29',
            'Referer': 'https://ai.baidu.com/tech/speech/tts_online'
        },
        onload:function(r){
            //console.log(r.responseText);
            let result = JSON.parse(r.responseText);
            if(result.errno=="0"){
                play(result.data);
                BaiduTTS_info.status = false;
            }else if(result.errno=="110"){
                if(!BaiduTTS_info.status){
                    BaiduTTS_info.status = true;
                    BaiduTTS("当前文本中可能存在敏感内容，百度TTS已拒绝了该请求");
                }else{
                    BaiduTTS_info.status = false;
                }
            }
            else{
                console.log("请求失败:"+r.responseText);
                BaiduTTS_info.status = false;
            }
        }
    });
}

function AzureTTS(TEXT){
    M_TTS(TEXT,"97421c82cec5dff4eb742cc0246691d8820c81f04ab72b6edf4284924ef1a7a5");
    return;
    GM_xmlhttpRequest({
        url: "https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/?Voice",
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36 Edg/100.0.1185.29'
        },
        onload: function(r) {
            var a = r.responseText.split("global.instanceId = '")[1].split("';")[0];
            M_TTS(TEXT,a);
        }
    });
}

var a = null;
function M_TTS(TEXT, token) {
    var str = TEXT;
    var slen = 450;
    var elen = 500;
    var len = elen;
    var _a = str.slice(slen,elen);
    if(_a.indexOf("。")!=-1){
        len = slen + _a.indexOf("。") + 1;
        Global_TEXT = str.slice(len,TEXT.length);
    }else{
        Global_TEXT = str.slice(len,TEXT.length);
    }
    TEXT = str.slice(0,len);
    $(document).ready(function() {
        MicrosoftTTS_info.status = true;
        console.log("start");
        var s = window.SpeechSDK;
        function play(){
            var config = s.SpeechTranslationConfig.fromEndpoint(new URL('wss://eastus.api.speech.microsoft.com/cognitiveservices/websocket/v1?TrafficType=AzureDemo')),
                synthesizer,
                audioConfig;
            config.speechSynthesisOutputFormat = s.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;
            a = new s.SpeakerAudioDestination();
            icon_change("play");
            a.onAudioEnd = function() {
                console.log("end");
                icon_change("end");
                MicrosoftTTS_info.status = false;
                if(Global_TEXT.length != 0){
                    AzureTTS(Global_TEXT);
                }
            };
            audioConfig = s.AudioConfig.fromSpeakerOutput(a);
            synthesizer = new s.SpeechSynthesizer(config, audioConfig);
            synthesizer.synthesisCompleted = function () {
                synthesizer.close();
                synthesizer = null;
            };
            synthesizer.SynthesisCanceled = function (s, e) {
                var r;
                r = s.CancellationDetails.fromResult(e);
                r.reason === s.CancellationReason.Error;
            };
            synthesizer.speakSsmlAsync(TextFormat(TEXT), function() {}, function(n) {
                console.log("Error:" + n);
                MicrosoftTTS_info.status = false;
            });
        }
        play();
        TTS_GLOBAL.find("#TTS_Button").click(function() {
            if(MicrosoftTTS_info.status && info.type == "microsoft"){
                console.log("pause");
                icon_change("end");
                a !== null && a.pause();
                a = null;
                MicrosoftTTS_info.status = false;
            }
        });
        TTS_GLOBAL.find("#TTS_Button").on("touchstart", function() {
            if(MicrosoftTTS_info.status && info.type == "microsoft"){
                console.log("pause");
                icon_change("end");
                a !== null && a.pause();
                a = null;
                MicrosoftTTS_info.status = false;
            }
        });
        function TextFormat(TEXT) {
            // var n = '<prosody rate="{SPEED}" pitch="{PITCH}">{TEXT}<\/prosody>',
            //   t;
            // n = n.replace("{SPEED}", "0" + "%");
            // n = n.replace("{PITCH}", "0" + "%");
            // u.selectedIndex === 0 && (p.hidden || o.selectedIndex === 0) || (n = "<mstts:express-as {STYLE_ATTRIBUTE} {ROLE_PLAY_ATTRIBUTE}>{0}<\/mstts:express-as>".replace("{0}", n), n = u.selectedIndex !== 0 ? n.replace("{STYLE_ATTRIBUTE}",
            //   'style="' + u[u.selectedIndex].value + '"') : n.replace("{STYLE_ATTRIBUTE}", ""), n = p.hidden || o.selectedIndex === 0 ? n.replace("{ROLE_PLAY_ATTRIBUTE}", "") : n.replace("{ROLE_PLAY_ATTRIBUTE}", 'role="' + o[o
            //   .selectedIndex].value + '"'));
            // n = '<voice name="{VOICE}">{0}<\/voice>'.replace("{0}", n);
            // n = n.replace("{VOICE}", i[Config.selectedIndex].value);
            // t = d.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
            // k.hidden || (t = '<lang xml:lang="{SECONDARY_LOCALE}">{0}<\/lang>'.replace("{0}", t), t = t.replace("{SECONDARY_LOCALE}", c[c.selectedIndex].value));
            // n = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">{0}<\/speak>'.replace("{0}", n);
            // n = n.replace("{TEXT}", t);
            var n =
                `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="{|_PERSON_|}"><prosody rate="{|_SPEED_|}%" pitch="{|_PITCH_|}%">{|_TEXT_|}</prosody></voice></speak>`;
            n = n.replace("{|_PERSON_|}", MicrosoftTTS_info.person);
            n = n.replace("{|_SPEED_|}", MicrosoftTTS_info.speed*100-100);
            n = n.replace("{|_PITCH_|}", MicrosoftTTS_info.pitch*50-50);
            n = n.replace("{|_TEXT_|}", TEXT);
            return n;
        }
    });
}

function TryListen(){
    init();
    let TEXT = "测试成功! 当前版本为 "+version+"。很高兴与你相遇!";
    if (info.type == "baidu") {
        BaiduTTS(TEXT);
    } else if (info.type == "microsoft") {
        AzureTTS(TEXT);
    }
}

function init_voice_setting(){
    var Info_ALL = [MicrosoftTTS_info, BaiduTTS_info, info, setting];
    if(GM_getValue("GAEE_TTS_voice_info") == null || GM_getValue("GAEE_TTS_voice_info")[3] == null){
        GM_setValue("GAEE_TTS_voice_info", Info_ALL);
    }else{
        Info_ALL = GM_getValue("GAEE_TTS_voice_info");
        MicrosoftTTS_info = Info_ALL[0];
        BaiduTTS_info = Info_ALL[1];
        info = Info_ALL[2];
        setting = Info_ALL[3];
    }
    MicrosoftTTS_info.status = false;
    BaiduTTS_info.status = false;
}

function voice_setting(){
    var Info_ALL = [MicrosoftTTS_info, BaiduTTS_info, info, setting];
    GM_setValue("GAEE_TTS_voice_info", Info_ALL);
}

registerMenuCommand();
function registerMenuCommand() {
    GM_registerMenuCommand(`🏁 \u7248\u672c\u4fe1\u606f ${version}`, function () {window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/429810', {active: true,insert: true,setParent: true});});
    //menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 \u53cd\u9988 & \u5efa\u8bae', function () {window.GM_openInTab('', {active: true,insert: true,setParent: true});});
}