// ==UserScript==
// @name         【shanyi】触发
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  批量打开+定向刷新
// @author       You
// @match        https://docs.qq.com/doc/p/d537e25d3815183b28bb165ab1f7575416d7786e?dver=3.0.27536109
// @match        http://sysadmin.3000.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445452/%E3%80%90shanyi%E3%80%91%E8%A7%A6%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445452/%E3%80%90shanyi%E3%80%91%E8%A7%A6%E5%8F%91.meta.js
// ==/UserScript==

function AX() {
    setTimeout('window.open("http://sysadmin.3000.com/#1")',0);
    setTimeout('window.open("http://sysadmin.3000.com/#2")',2500);
    setTimeout('window.open("http://sysadmin.3000.com/#3")',4000);
    setTimeout('window.open("http://sysadmin.3000.com/#4")',6000);
    setTimeout('window.open("http://sysadmin.3000.com/#5")',8000);
    setTimeout('window.open("http://sysadmin.3000.com/#6")',10000);
}
function A() {
    setTimeout("document.getElementsByClassName('tab-div-li')[8].click()",1000);
    setTimeout("document.getElementsByClassName('menu-text')[2].click()",2000);
    setTimeout("document.getElementById('search_topic_status')[1].selected='selected'",3000);
    setTimeout("document.getElementById('btn_search').click()",4000);
}
function B() {
    setTimeout("document.getElementsByClassName('tab-div-li')[8].click()",1000);
    setTimeout("document.getElementsByClassName('menu-text')[3].click()",2000);
    setTimeout("document.getElementById('search_status')[1].selected='selected'",3000);
    setTimeout("document.getElementById('btn_search').click()",4000);
}
function C() {
    setTimeout("document.getElementsByClassName('tab-div-li')[8].click()",1000);
    setTimeout("document.getElementsByClassName('menu-text')[4].click()",2000);
    setTimeout("document.getElementById('search_status')[1].selected='selected'",3000);
    setTimeout("document.getElementById('btn_search').click()",4000);
}
function D() {
    setTimeout("document.getElementsByClassName('tab-div-li')[8].click()",1000);
    setTimeout("document.getElementsByClassName('menu-text')[2].click()",2000);
    setTimeout("document.getElementById('search_topic_status')[4].selected='selected'",3000);
    setTimeout("document.getElementById('btn_search').click()",4000);
}
function E() {
    setTimeout("document.getElementsByClassName('tab-div-li')[8].click()",1000);
    setTimeout("document.getElementsByClassName('menu-text')[3].click()",2000);
    setTimeout("document.getElementById('search_status')[4].selected='selected'",3000);
    setTimeout("document.getElementById('btn_search').click()",4000);
}
function F() {
    setTimeout("document.getElementsByClassName('tab-div-li')[8].click()",1000);
    setTimeout("document.getElementsByClassName('menu-text')[4].click()",2000);
    setTimeout("document.getElementById('search_status')[4].selected='selected'",3000);
    setTimeout("document.getElementById('btn_search').click()",4000);
}

window.onload=function(){
    var x = document.location.href;
    if(x == "http://sysadmin.3000.com/#1"){
        A();
    }else if(x == "http://sysadmin.3000.com/#2"){
        B();
    }else if(x == "http://sysadmin.3000.com/#3"){
        C();
    }else if(x == "http://sysadmin.3000.com/#4"){
        D();
    }else if(x == "http://sysadmin.3000.com/#5"){
        E();
    }else if(x == "http://sysadmin.3000.com/#6"){
        F();
    }else if(x == "https://docs.qq.com/doc/p/d537e25d3815183b28bb165ab1f7575416d7786e?dver=3.0.27536109"){
        AX();
    }
}
