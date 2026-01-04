// ==UserScript==
// @name ISO Formatted Time/Date for Github & StackOverflow
// @name:zh-CN 易读时间日期 for Github和StackOverflow等网站
// @namespace coolan
// @version 1.0
// @description Change time/date to ISO format for Github and stackoverflow websites.
// @description:zh-CN 把Github,stackoverflow等网站的时间转换为ISO格式，方便阅读。
// @author coolan
// @match https://github.com/*
// @match https://askubuntu.com/*
// @match https://stackapps.com/*
// @match https://superuser.com/*
// @match https://serverfault.com/*
// @match https://mathoverflow.net/*
// @match https://*.stackoverflow.com/*
// @match https://*.stackexchange.com/*
// @icon https://github.com/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/435309/ISO%20Formatted%20TimeDate%20for%20Github%20%20StackOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/435309/ISO%20Formatted%20TimeDate%20for%20Github%20%20StackOverflow.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function replaceTime(){
        var time_list = document.querySelectorAll("span.relativetime, span.relativetime-clean")
        time_list.forEach(function(ele) {
            ele.innerText = ele.title.substring(0,16);
        })
        var items = document.getElementsByTagName("relative-time")
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.innerHTML = item.getAttribute("datetime").substring(0,16).replace(/T/," ");
        }
    }
    replaceTime();
    var observer = new MutationObserver(function (mutations, observer) {
        replaceTime();
    });
    var body = document.querySelector('body');
    var options = { 'childList': true };
    observer.observe(body, options);

})();