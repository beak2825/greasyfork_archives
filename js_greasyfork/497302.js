// ==UserScript==
// @name         免费YouTube™ Downloader，YouTube HTML5视频&MP3音频播放工具，把油管当播客听MP3，本地油管视频通用下载器 🚀💯 - tingyour.com（NO ADS 🚫）！
// @namespace    youtube-amateur
// @version      1.2.0
// @description  免科学上网工具/梯子在线看油管，快速搜索，中文字幕下载/双语翻译，把油管当播客听MP3，将YouTube当Podcast听，可以订阅自己喜欢的油管博主及频道，收藏自己喜欢的视频，极速加载无需等待，免费YouTube™ Downloader，本地YouTube油管下载器，YouTube视频下载，油管视频通用下载器，不需要通过第三方的服务就能下载YouTube油管视频，支持MP3/MP4/HD/SD/FullHD/3GP等高清高码率格式，YouTube MP3音频&HTML5视频播放工具！
// @author       youtube-amateur
// @icon         data:image/jpeg;base64,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
// @resource     logo https://s2.loli.net/2022/08/24/cMejHfU793gNuxQ.jpg
// @require      http://cdn.staticfile.org/jquery/1.9.0/jquery.min.js
// @supportURL   http://www.tingyour.com?utm_source=gf
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
// @downloadURL https://update.greasyfork.org/scripts/497302/%E5%85%8D%E8%B4%B9YouTube%E2%84%A2%20Downloader%EF%BC%8CYouTube%20HTML5%E8%A7%86%E9%A2%91MP3%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%8A%8A%E6%B2%B9%E7%AE%A1%E5%BD%93%E6%92%AD%E5%AE%A2%E5%90%ACMP3%EF%BC%8C%E6%9C%AC%E5%9C%B0%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E9%80%9A%E7%94%A8%E4%B8%8B%E8%BD%BD%E5%99%A8%20%F0%9F%9A%80%F0%9F%92%AF%20-%20tingyourcom%EF%BC%88NO%20ADS%20%F0%9F%9A%AB%EF%BC%89%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/497302/%E5%85%8D%E8%B4%B9YouTube%E2%84%A2%20Downloader%EF%BC%8CYouTube%20HTML5%E8%A7%86%E9%A2%91MP3%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%8A%8A%E6%B2%B9%E7%AE%A1%E5%BD%93%E6%92%AD%E5%AE%A2%E5%90%ACMP3%EF%BC%8C%E6%9C%AC%E5%9C%B0%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E9%80%9A%E7%94%A8%E4%B8%8B%E8%BD%BD%E5%99%A8%20%F0%9F%9A%80%F0%9F%92%AF%20-%20tingyourcom%EF%BC%88NO%20ADS%20%F0%9F%9A%AB%EF%BC%89%EF%BC%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var $ = $ || window.$;
    var windowUrl = window.location.href;
    var websiteHost = window.location.host;
    var resourcesAnalysis={};
    resourcesAnalysis.addHtml=function(){
      var logoImg = GM_getResourceURL("logo");
      var floatBox = "<div style='position:fixed;z-index:999998;cursor:pointer;top:285px;left:0px;'>"+
               "<div id='youtube_video_resources_box' style='width:138px;height:30px;line-height:30px;text-align:center;font-size:12px;/*padding:5px 2px;*/color:#fff;background-color:#ff5200;border-top-right-radius:5px;border-bottom-right-radius:5px;'><img src='" + logoImg + "' style='width:20px;height:20px;position:relative;top:5px;' />&nbsp;油管免翻墙Tool</div>"+
               "<div id='xueshu_vip_url_box' style='font-size:12px;padding:5px 2px;'><a href='http://www.tingyour.com?utm_source=gf' target='_blank' style='color:#3b8cff;text-decoration:none'>http://www.tingyour.com</a></div>"+
               "</div>";
      $("body").append(floatBox);
      var defaultCrackVipUrl = "http://www.tingyour.com?utm_source=gf&url=#";
      $("body").on("click","#youtube_video_resources_box",function(){
            defaultCrackVipUrl = defaultCrackVipUrl.replace(/#/g, encodeURIComponent(windowUrl));
            window.open(defaultCrackVipUrl, "_blank");
      });
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




