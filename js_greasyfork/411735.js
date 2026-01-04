// ==UserScript==
// @name         PT动态彩虹ID
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  装逼专用，博君一笑
// @author       陶陶滔滔涛
// @match        https://springsunday.net/*
// @match        https://hdsky.me/*
// @match        https://pt.keepfrds.com/*
// @match        https://chdbits.co/*
// @match        https://ourbits.club/*
// @match        https://tjupt.org/*
// @match        https://pterclub.com/*
// @match        https://hdchina.org/*
// @match        https://pt.hd4fans.org/*
// @match        https://hdhome.org/*
// @match        https://pthome.net/*
// @match        https://open.cd/*
// @match        https://nanyangpt.com/*
// @match        https://yingk.com/*
// @match        https://pt.soulvoice.club/*
// @match        https://www.nicept.net/*
// @match        https://avgv.cc/*
// @match        https://www.beitai.pt/*
// @match        https://leaguehd.com/*
// @match        https://pt.sjtu.edu.cn/*
// @match        https://www.hddolby.com/*
// @match        https://lbj007.com/*
// @match        https://ptsbao.club/*
// @match        https://www.hdarea.co/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411735/PT%E5%8A%A8%E6%80%81%E5%BD%A9%E8%99%B9ID.user.js
// @updateURL https://update.greasyfork.org/scripts/411735/PT%E5%8A%A8%E6%80%81%E5%BD%A9%E8%99%B9ID.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("@keyframes rainbowAnimation { 0% {background-position: 0 0;} 100% {background-position: -100% 0}}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();

$(document).ready(function() {
    action();
});

$(document).ajaxComplete(function(){
    action();
});

function action() {
    var url = decodeURI(location.href);

    var username = $("#info_block a[class$='Name'] b");
    if (url.match(/http(s*):\/\/hdchina.org.*/i)) {
        username = $(".userinfo a[class$='Name'] b");
    } else if (url.match(/http(s*):\/\/springsunday.net.*/i)) {
        username = $("#info_block b span[class$='Name']");
    } else if (url.match(/http(s*):\/\/pt.sjtu.edu.cn.*/i)) {
        username = $("#usermsglink a[class$='Name'] b");
    }
    var clazz = $(username).parent().attr('class');
    if (url.match(/http(s*):\/\/springsunday.net.*/i)) {
        clazz = $(username).attr('class');
    }
    console.log(clazz);

    var name = $(username).text();
    console.log(name)

    var array = $('.' + clazz + ' b');
    if (url.match(/http(s*):\/\/springsunday.net.*/i)) {
        array = $('.' + clazz);
    }
    array.each(function(index, item) {
        if ($(item).text().startsWith(name)) {
            $(item).css({
                'background-image': '-webkit-linear-gradient(left, #ff0000, #ffff00, #00ff00, #007fff, #00ff00, #ffff00, #ff0000)',
                'text-fill-color': 'transparent',
                '-webkit-background-clip': 'text',
                'background-size': '200% 100%',
                'animation': 'rainbowAnimation 2s infinite linear'
            });
        }
    });
}