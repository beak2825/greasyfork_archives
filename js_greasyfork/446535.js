// ==UserScript==
// @name         South Plus 自动刷新帖子列表
// @namespace    https://greasyfork.org/zh-CN/users/925958-%E5%A4%A7%E7%A2%97%E5%AE%BD%E9%9D%A2wtw
// @version      0.3.0
// @description  自动刷新 South Plus 帖子列表
// @author       大碗宽面wtw
// @license      MIT
// @match        *://south-plus.net/*
// @match        *://north-plus.net/*
// @match        *://white-plus.net/*
// @match        *://evel-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.evel-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.east-plus.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=south-plus.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446535/South%20Plus%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/446535/South%20Plus%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Blocker extends _0L0_ {
        //获取所有符合要求的元素，然后遍历
        start(ctx) {
        //获取所有符合要求的元素，然后遍历
        if (["tid", "fid"].indexOf(this.currPage) != -1) {
            //获取所有的用户信息元素
            let userEles = this.findAllUserElement(ctx);
            for (let userE of userEles) {
                let uid = this.getUser(userE)[0];
                if ((uid) && uid in this.cfg.blist) {
                    if (this.hideTopic(userE, this.cfg.blist[uid].level) === "hide") continue;
                }
            }
        } else {
            //console.log("没有匹配到有效页，不做处理！");
        }
    }
        findAllUserElement(ctx) {
            ctx = ctx?.get(0) || document;
            switch (this.currPage) {
                case "fid": return ctx.querySelectorAll("a[href*='u.php?action-show-uid-']");
                case "tid": return ctx.querySelectorAll("div > a[href*='u.php?action-show-uid-']");
            }
        }
    }

    // 设置字体大小
    GM_addStyle("body,h3,.blockquote{font-size:14px}.f14{font-size:16px}");

    // 板块页
    if(/thread.php\?/.test(window.location.href)) {
        var _j = jQuery.noConflict();

        // 所有帖子新标签页打开
        _j(".tr3 a").attr("target", "_blank");

        // 自动更新
        const DELAY = 90;  // 在这里修改更新的时间间隔（秒）
        var interval, update = function() {
            if(document.hidden) {
                console.log("离开");
                clearInterval(interval);
                return;
            }
            _j.get(window.location.href).done(function(data) {
                var ctx = _j("#ajaxtable", _j(data));
                var img = _j("img", ctx);
                var count = img.length;
                img.load(function() {
                    if(!--count) {  // 等待图片加载完成
                        console.log("刷新");
                        new Blocker().start(ctx);
                        _j(".tr3 a", ctx).attr("target", "_blank");
                        _j("#ajaxtable").replaceWith(ctx);
                    }
                });
            });
        }
        interval = setInterval(update, DELAY*1000);
        // 离开页面取消定时器，进入时再设定
        document.addEventListener('visibilitychange',function() {
            if(!document.hidden) {
                interval = setInterval(update, DELAY*1000);
            }
            else {
                console.log("用户离开");
                clearInterval(interval);
            }
        });
        // 快捷键绑定
        document.onkeyup = function(event) {
            event = event || window.event;
            if(event.keyCode == 78) { // N
                console.log("主动刷新");
                clearInterval(interval);
                update();
                interval = setInterval(update, DELAY*1000);
            }
        }
    }

    // 发帖自定选择回复通知
    // 代码来自 https://greasyfork.org/zh-CN/scripts/369680-north-plus-notification-plus
    if(/read\.php\?tid/.test(window.location.href) || /post\.php\?fid-*/.test(window.location.href)) {
        const postOptions = document.getElementById('post-option');
        if(postOptions) {
            const box = document.querySelector('input[name=atc_newrp]');
            box.setAttribute('checked', 'checked');
        }
    }

    // 自动将视频链接转成内嵌视频
    var regex = /(mp4|mov)$/i;
    function setAttributes(element, attrs){
        for(var key in attrs){
            element.setAttribute(key, attrs[key]);
        }
    }
    var links = document.querySelectorAll("div.f14");
    links.forEach(function (e){
        e.querySelectorAll("a").forEach(function (a){
            if (!regex.test(a.href)) return;
            var source = document.createElement("source");
            source.setAttribute("src", a.href);
            var video = document.createElement("video");
            setAttributes(
                video,
                {
                    onloadedmetadata:"if(this.videoWidth>680){this.width=680}else if(this.videoHeight>680){this.height=680};",
                    controls: ""
                }
            );
            video.appendChild(source);
        e.insertBefore(video, a);
        e.insertBefore(document.createElement("br"), a);
        })
    });
})();