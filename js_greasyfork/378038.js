// ==UserScript==
// @name         mebook目录功能
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  结合插件【mebook小书屋自动跳转百度云并填写密码】实现在首页即可直接快捷下载图书的功能
// @author       Kakyuren
// @match        http://mebook.cc/*
// @match        http://www.shuwu.mobi/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378038/mebook%E7%9B%AE%E5%BD%95%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/378038/mebook%E7%9B%AE%E5%BD%95%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hrefs = document.getElementsByClassName("link");
	if (typeof GM_addStyle != "undefined") {
        GM_addStyle('#nav {border:1px solid #000;float:right;position:fixed;');

	}
	var li = document.createElement('li');
    var node = document.getElementById("sidebar");
    node.innerHTML = "<ul id='nav'></ul>";
    var nav = document.getElementById("nav");
    nav.appendChild(li);
    var content = document.getElementsByClassName('content ');
    var i = 0;
    for(;content.item(i).innerHTML;)
    {
        var reg1 = /[0-9]+.html/g;
        var booknum =hrefs.item(i).innerHTML.match(reg1);
        var domain = window.location.host;
        var url = "http://"+domain+'/'+booknum;
        var reg2 = /[\S]+/g;
        var list = content.item(i).children[0].children[0].title;
         var match = list.match(reg2);

        // var href = setURL(i);
         if(match && booknum){
            li.innerHTML+="<li><a href="+url+">"+match+"</a></li>";
         }else{
             //nav.style.display="";
         }
        i++;
    }



})();