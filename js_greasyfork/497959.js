// ==UserScript==
// @name         🔥【免梯子+免翻墙+免科学上网工具/国内直连】HTML5视频播放器YouTube油管增强脚本知乎增强
// @namespace    player
// @version      1.0.6
// @description  📜HTML5视频播放器增强脚本，支持所有H5视频网站，🎉例如：B站、抖音、腾讯视频、优酷、爱奇艺、西瓜视频、YouTube/油管、微博视频、知乎视频、搜狐视频、网易公开课、百度网盘、阿里云盘、TED、Instagram/ins/IG、Twitter等。全程快捷键控制，支持：倍速播放/加速播放、视频画面截图、画中画、网页全屏、调节亮度、饱和度、对比度、自定义配置功能增强等功能，为你提供愉悦的在线视频播放体验。还有视频广告快进、在线教程/教育视频倍速快学、视频文件下载能力等，集合优酷、爱奇艺、腾讯、B站/bilibili、芒果等全网VIP视频/PC+移动端免费破解去广告，网易云音乐、QQ音乐、酷狗、酷我、虾米、蜻蜓FM、荔枝FM、喜马拉雅等网站音乐和有声书音频免客户端下载，全网VIP视频免费破解去广告、音乐直接下载、知乎增强、百度网盘直接下载、短视频无水印下载等多功能工具箱，功能可独立开关
// @author       player
// @icon         data:image/jpeg;base64,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
// @resource     logo https://s2.loli.net/2022/08/24/cMejHfU793gNuxQ.jpg
// @require      http://cdn.staticfile.org/jquery/1.8.0/jquery.min.js
// @supportURL   https://cloud.sstea.men/#/register?code=MfUfk4Or
// @match        *://*/*
// @match        *://*.youtube.com/*
// @match        *://*.dailymotion.com/*
// @match        *://*.metacafe.com/*
// @match        *://*.myspace.com/*
// @match        *://*.9gag.com/*
// @match        *://*.vimeo.com/*
// @match        *://*.hulu.com/*
// @match        *://*.netflix.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.mixer.com/*
// @match        *://*.break.com/*
// @match        *://*.sho.com/*
// @match        *://*.hollywood.com/*
// @match        *://*.imdb.com/*
// @match        *://*.nicovideon.jp/*
// @match        *://*.bilibili.com/*
// @include      *://*.google.com/*
// @include      *://*.bing.com/*
// @include      *://*.baidu.com/*
// @include      *://*.sogou.com/*
// @include      *://*.so.com/*
// @include      *://*.sm.cn/*
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @antifeature  payment
// @compatible	 Chrome
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Firefox
// @compatible	 Opera
// @license      GPL3 license
// @downloadURL https://update.greasyfork.org/scripts/497959/%F0%9F%94%A5%E3%80%90%E5%85%8D%E6%A2%AF%E5%AD%90%2B%E5%85%8D%E7%BF%BB%E5%A2%99%2B%E5%85%8D%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%E5%B7%A5%E5%85%B7%E5%9B%BD%E5%86%85%E7%9B%B4%E8%BF%9E%E3%80%91HTML5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8YouTube%E6%B2%B9%E7%AE%A1%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/497959/%F0%9F%94%A5%E3%80%90%E5%85%8D%E6%A2%AF%E5%AD%90%2B%E5%85%8D%E7%BF%BB%E5%A2%99%2B%E5%85%8D%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%E5%B7%A5%E5%85%B7%E5%9B%BD%E5%86%85%E7%9B%B4%E8%BF%9E%E3%80%91HTML5%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8YouTube%E6%B2%B9%E7%AE%A1%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var $ = $ || window.$;
    var windowUrl = window.location.href;
    var websiteHost = window.location.host;
    var resourcesAnalysis={};
    resourcesAnalysis.addHtml=function(){
        var logoImg = GM_getResourceURL("logo");
        var floatBox = "<div style='position:fixed;z-index:999998;cursor:pointer;top:75px;left:0px;'>"+
            "<div id='youtube_video_resources_box' style='width:138px;height:30px;line-height:30px;text-align:center;font-size:12px;/*padding:5px 2px;*/color:black;background-color:fff;border:1px solid red;border-left:none;border-top-right-radius:5px;border-bottom-right-radius:5px;'><img src='" + logoImg + "' style='width:20px;height:20px;position:relative;top:5px;' />BH专线版</div>"+
            "<div id='youtube_vip_url_box' style='font-size:12px;padding:5px 2px;'><a href='https://exce.sstea.men/#/register?code=MfUfk4Or' target='_blank' style='color:#3b8cff;text-decoration:none'>专线版</a></div>"+
            "</div>";
        var currentUrl = window.location.href;
        if(currentUrl=="https://exce.sstea.men/#/dashboard")
        {
            floatBox= "<div style='position:fixed;z-index:999998;cursor:pointer;top:75px;left:0px;'>"+
            "<div id='youtube_video_resources_box' style='width:138px;height:30px;line-height:30px;text-align:center;font-size:12px;/*padding:5px 2px;*/color:black;background-color:fff;border:1px solid red;border-left:none;border-top-right-radius:5px;border-bottom-right-radius:5px;'><img src='" + logoImg + "' style='width:20px;height:20px;position:relative;top:5px;' />BH专线版</div>"+
            "<div id='youtube_vip_url_box' style='font-size:12px;padding:5px 2px;'><input type='text' id='copyText' value='https://99ding.men/api/v1/client/subscribe?token=fff9d4e3b1faff807b3da65d09801550' style='display:none;'>"+
            "<button id='copyButton'>复制订阅</button></div>"+
            "</div>";
             $("body").append(floatBox);
              $("#copyButton").click(function() {
                   // 获取需要复制的文本
                var text = $("#copyText").val();
        
                // 使用Clipboard API进行复制
                navigator.clipboard.writeText(text)
                    .then(function() {
                        console.log("复制成功!");
                        alert("内容已复制到剪贴板!");
                    })
                    .catch(function(error) {
                        console.error("复制失败:", error);
                        alert("复制失败。");
                    });
                });
        }
        else
        {
            $("body").append(floatBox);
            var defaultCrackVipUrl = "https://exce.sstea.men/#/register?code=MfUfk4Or";
            $("body").on("click","#youtube_video_resources_box",function(){
                defaultCrackVipUrl = defaultCrackVipUrl;
                window.open(defaultCrackVipUrl, "_blank");
            });
        }
    };
    resourcesAnalysis.init=function(){
        resourcesAnalysis.addHtml();
    }
    resourcesAnalysis.init();
    const rules = {
        plus: {
            name: "default",
            hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
            unhook_eventNames: "mousedown|mouseup|keydown|keyup",
            dom0: true,
            hook_addEventListener: true,
            hook_preventDefault: true,
            add_css: true
        }
    };
    const returnTrue = e => true;
    const getRule = (host) => {
        return rules.plus;
    };
    const dontHook = e => !!e.closest('form');
    const EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    const document_addEventListener = document.addEventListener;
    const Event_preventDefault = Event.prototype.preventDefault;
    let hook_eventNames, unhook_eventNames, eventNames;
    function addEventListener(type, func, useCapture) {
        let _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
        if (!hook_eventNames.includes(type)) {
            _addEventListener.apply(this, arguments);
        } else {
            _addEventListener.apply(this, [type, returnTrue, useCapture]);
        }
    }
    function clearLoop() {
        let type, prop,
            c = [document,document.body, ...document.getElementsByTagName('div')],
        e = document.querySelector('iframe[src="about:blank"]');
        if (e && e.clientWidth>99 && e.clientHeight>11){
            e = e.contentWindow.document;
            c.push(e, e.body);
        }
        for (e of c) {
            if (!e) continue;
            e = e.wrappedJSObject || e;
            for (type of eventNames) {
                prop = 'on' + type;
                e[prop] = null;
            }
        }
    }
    function init() {
        let rule = getRule(location.host);
        hook_eventNames = rule.hook_eventNames.split("|");
        unhook_eventNames = rule.unhook_eventNames.split("|");
        eventNames = hook_eventNames.concat(unhook_eventNames);
        if (rule.dom0) {
            setInterval(clearLoop, 9e3);
            setTimeout(clearLoop, 1e3);
            window.addEventListener('load', clearLoop, true);
        }
        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
        }
        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function () {
                if (dontHook(this.target) || !eventNames.includes(this.type)) {
                    Event_preventDefault.apply(this, arguments);
                }
            };
        }
        if (rule.add_css) GM_addStyle(
			`html, * {
            -webkit-user-select:text !important;
            -moz-user-select:text !important;
            user-select:text !important;
        }
    ::-moz-selection {color:#FFF!important; background:#3390FF!important;}
    ::selection {color:#FFF!important; background:#3390FF!important;}`
    );
    }
    init();
})();