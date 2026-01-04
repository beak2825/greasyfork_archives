// ==UserScript==
// @name         万能搜索
// @namespace    n/a
// @version      0.0.2.8
// @description  洛谷题目跳转器优化
// @author       C2020陈铭浩
// @match        https://www.luogu.com.cn
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/#feed
// @match        https://www.luogu.com.cn/#feed/
// @match        http://www.luogu.com.cn
// @match        http://www.luogu.com.cn/
// @match        http://www.luogu.com.cn/#feed
// @match        http://www.luogu.com.cn/#feed/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481219/%E4%B8%87%E8%83%BD%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/481219/%E4%B8%87%E8%83%BD%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    var href = "https://www.luogu.com.cn/problem";

    function jumpfn()
    {
        var target = document.getElementsByClassName("am-form-field")[0].value;
        if(target === "")return;

        var go = href + "/list?keyword=" + target + "&content=false";

        location.href = go;
    }

    function searchfn()
    {
        var target = document.getElementsByClassName("am-form-field")[0].value;
        if(target === "")return;

        var targetu = target.toUpperCase();
        var go = href;

        if(target.match(/^[1-9][0-9][0-9][0-9]+$/) == target)go = go + "/P" + target;
        else if(targetu.match(/^[0-9]+[A-Z][0-9]?$/) == targetu)go = go + "/CF" + targetu;
        else if(targetu.match(/^(?:U|P|T|CF|SP|AT|UVA)[0-9]+[A-Z]?[0-9]?$/) == targetu)go = go + "/" + targetu;
        else{go = href + "/list?keyword=" + target + "&content=false";}

        location.href = go;
    }

    var locations =
        document.getElementsByClassName("lg-index-content")[0]
    .getElementsByClassName("lg-article lg-index-stat")[0]
    .getElementsByClassName("am-btn am-btn-primary am-btn-sm")[0]
    .parentNode;

    var button = document.createElement("button");
    button.className = "am-btn am-btn-success am-btn-sm";
    button.name = "gotosearch";
    button.id = "gotosearch";
    button.innerHTML = "搜索";
    button.onclick = function(){jumpfn();};

    locations.appendChild(button);

    document.getElementsByClassName("am-form-field")[0].placeholder = "输入题号或题目名";
    document.getElementsByClassName("am-form-field")[0].onkeyup = function(event){if(event.keyCode === 13){searchfn();}};

    document.getElementsByClassName("lg-article lg-index-stat")[0].getElementsByTagName("h2")[0].innerHTML = "万能跳转";

    document.getElementsByName("gotorandom")[0].innerHTML = "随机";
})();