// ==UserScript==
// @name         喵子一键回帖
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键回复、一键购买、购买后下载链接添加超链
// @author       You
// @icon         https://forum.h3dhub.com/static/image/common/bbs.ico
// @match        https://forum.h3dhub.com/thread-*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452341/%E5%96%B5%E5%AD%90%E4%B8%80%E9%94%AE%E5%9B%9E%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/452341/%E5%96%B5%E5%AD%90%E4%B8%80%E9%94%AE%E5%9B%9E%E5%B8%96.meta.js
// ==/UserScript==
function print_log(log_str){
    console.log(log_str)
}
function add_link() {
    var el_url_a = document.evaluate('//tr[././th[contains(text(),"主要下载方式链接:")]]/td', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var el_url_b = document.evaluate('//tr[././th[contains(text(),"备用下载方式链接:")]]/td', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var el_code_a = document.evaluate('//tr[././th[contains(text(),"主要下载方式提取码:")]]/td', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var el_code_b = document.evaluate('//tr[././th[contains(text(),"备用下载方式提取码:")]]/td', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var el_password_a = document.evaluate('//tr[././th[contains(text(),"主要下载方式解压密码:")]]/td', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    var el_password_b = document.evaluate('//tr[././th[contains(text(),"备用下载方式解压密码:")]]/td', document, null, XPathResult.ANY_TYPE, null).iterateNext();
    if(el_url_a!=null){
        var url_a= el_url_a.innerHTML;
        console.log('主要下载方式链接:' + url_a);
        var code_a= el_code_a.innerHTML;
        console.log('主要下载方式提取码:' + code_a);
        if (url_a.indexOf('<a href')==-1){
            var password_a= el_password_a.innerHTML;
            console.log('主要下载方式解压密码:' + password_a);
            el_url_a.innerHTML = '<a href="'+ url_a +'" target="_blank">' + url_a + '</a>';
        }
    }
    if(el_url_b!=null){
        var url_b= el_url_b.innerHTML;
        console.log('主要下载方式链接:' + url_b);
        el_url_b.innerHTML = '<a href="'+ url_b +'" target="_blank">' + url_b + '</a>';
    }
}
(function() {
    'use strict';
    //*******************自动回复内容设置*********************//
    var msg = '感谢分享！' //回复内容
    //***************************************************//

    var el_reve = document.getElementById('post_reply');
    var el_pay = document.querySelector("tbody > tr:nth-child(1) > td.plc.mshadow > div.pct > div > div.locked > a");

    if(el_reve!=null){
        function handleClick (e) {
            document.querySelector("#fastpostmessage").innerHTML = msg;
            document.querySelector("#fastpostsubmit > strong").click();
        }
        el_reve.onclick='';
        el_reve.addEventListener('click', handleClick);
    }

    if(el_pay!=null){
        function handleClick2 (e) {
            setTimeout(function(){
                document.querySelector("#payform > div.o.pns > button").click();
            },500);
            setTimeout(function(){
                add_link();
            },2000);
        }
        el_pay.addEventListener('click', handleClick2);
    }

    add_link();

})();