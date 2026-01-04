// ==UserScript==
// @name               ISO time format for StackOverflow
// @version            2.1
// @name:zh-CN         为 Stack Overflow 及 Stack Exchange 旗下网站启用 ISO 时间格式
// @description        Use ISO time format for Stack Overlow and other Stack Exchange sites
// @description:zh-CN  将 Stack Overflow 等 Stack Exchange 旗下174个网站的问答页面默认时间改为类ISO格式的
// @namespace          StackOverflow
// @author             Patrick
// @license            MIT
// @match              https://askubuntu.com/questions/*
// @match              https://stackapps.com/questions/*
// @match              https://superuser.com/questions/*
// @match              https://serverfault.com/questions/*
// @match              https://mathoverflow.net/questions/*
// @match              https://*.stackoverflow.com/questions/*
// @match              https://*.stackexchange.com/questions/*
// @grant              none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/389674/ISO%20time%20format%20for%20StackOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/389674/ISO%20time%20format%20for%20StackOverflow.meta.js
// ==/UserScript==

(function() {
    let time_list = document.querySelectorAll("span.relativetime, span.relativetime-clean")
    time_list.forEach(function(ele) {
        ele.innerText = ele.title;
        let t = new Date(ele.title.slice(0,20));
        let t1 = new Date(t.getTime() - t.getTimezoneOffset()*60*1000);
        let t1_str = t1.toISOString();
        ele.innerText = t1_str.slice(0,10) + ' ' + t1_str.slice(11,19);
    })
})()
