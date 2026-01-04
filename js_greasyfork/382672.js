// ==UserScript==
// @name         Better Luogu Problem Searcher
// @namespace    n/a
// @version      0.0.3
// @description  洛谷题目跳转器优化
// @author       iotang
// @match        https://www.luogu.com.cn
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/#feed
// @match        https://www.luogu.com.cn/#feed/
// @match        http://www.luogu.com.cn
// @match        http://www.luogu.com.cn/
// @match        http://www.luogu.com.cn/#feed
// @match        http://www.luogu.com.cn/#feed/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382672/Better%20Luogu%20Problem%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/382672/Better%20Luogu%20Problem%20Searcher.meta.js
// ==/UserScript==

(function()
 {
    'use strict';

    var href = "https://www.luogu.com.cn/problem";

    function jumpfn() {
        var target = document.getElementsByClassName("am-form-field")[0].value;
        if(target === "")return;

        var go = href + "/list?keyword=" + target + "&content=true";

        location.href = go;
    }

    function isProblemId(text) { // https://greasyfork.org/zh-CN/scripts/388947-luogu-problem-jumper
        if (text.match(/^AT[0-9]{1,4}$/) == text) return true;
        if (text.match(/^CF[0-9]{1,4}[A-Z][0-9]{0,1}$/) == text) return true;
        if (text.match(/^SP[0-9]{1,5}$/) == text) return true;
        if (text.match(/^P[0-9]{4}$/) == text) return true;
        if (text.match(/^UVA[0-9]{1,5}$/) == text) return true;
        if (text.match(/^U[0-9]{1,6}$/) == text) return true;
        if (text.match(/^T[0-9]{1,6}$/) == text) return true;
        return false;
    }

    function searchfn() {
        var target = document.getElementsByClassName("am-form-field")[0].value;
        if(target === "")return;

        var targetu = target.toUpperCase();
        var go = href;

        if(target.match(/^[1-9][0-9][0-9][0-9]+$/) == target)go = go + "/P" + target;
        else if(targetu.match(/^[0-9]{1,4}[A-Z][0-9]{0,1}$/) == targetu)go = go + "/CF" + targetu;
        else if(isProblemId(targetu))go = go + "/" + targetu;
        else {go = href + "/list?keyword=" + target + "&content=true";}

        location.href = go;
    }

    var button =
        document.getElementsByClassName("lg-index-content")[0]
    .getElementsByClassName("lg-article lg-index-stat")[0]
    .getElementsByClassName("am-btn am-btn-danger am-btn-sm")[0];

    button.className = "am-btn am-btn-success am-btn-sm";
    button.name = "gotosearch";
    button.id = "gotosearch";
    button.innerHTML = "搜索";
    button.onclick = function() {jumpfn();};

    document.getElementsByClassName("am-form-field")[0].placeholder = "输入题号或题目名，按回车确认";
    document.getElementsByClassName("am-form-field")[0].onkeyup = function(event){if(event.keyCode === 13){searchfn();}};

    document.getElementsByClassName("lg-article lg-index-stat")[0].getElementsByTagName("h2")[0].innerHTML = "问题搜索";

    document.getElementsByName("gotorandom")[0].innerHTML = "随机";
})();