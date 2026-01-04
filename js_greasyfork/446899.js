// ==UserScript==
// @name         58同城
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  58同城获取职业，薪资，公司名且跳转至企查查获取其他相关内容
// @author       Ying
// @match        https://*.58.com/*
// @match        https://cn.58.com/*
// @match        https://nc.58.com/*
// @match        https://bj.58.com/*
// @match        https://px.58.com/*
// @match        https://ganzhou.58.com/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446899/58%E5%90%8C%E5%9F%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/446899/58%E5%90%8C%E5%9F%8E.meta.js
// ==/UserScript==

javascript: (function() {

    $(".pos_base_num ").css({"display":"none"});
    $(".pos_right_operate  ").css({"display":"none"});
  $(".pos_operate").css({"display":"none"});

    var name = document.createElement("input");
    name.setAttribute("name","number");
    name.setAttribute("class","btn btn-orange");
    name.setAttribute("value","跳转+企业名称");
   name.setAttribute("style","height:45px;cursor:pointer;");
    $('.pos_base_statistics').append(name);

    name.onclick=function(){
        var nr = document.getElementsByClassName("baseInfo_link")[0];
        var nt = nr.getElementsByTagName("a")[0].innerHTML;
        GM_setClipboard(nt);
      window.open('https://www.qcc.com/web/search?key='+nt);
        window.open('https://www.youbianku.com/SearchResults?address='+nt)
    };
var job = document.createElement("input");
    job.setAttribute("name","number");
    job.setAttribute("class","btn btn-orange");
    job.setAttribute("value","获取职业");
    job.setAttribute("style","height:45px;cursor:pointer;");
    $('.pos_base_statistics').append(job);

    job.onclick=function(){
        var nr = document.getElementsByClassName("pos_name")[0].innerHTML;
        GM_setClipboard(nr);
              console.log(nr);
    };

var money = document.createElement("input");
    money.setAttribute("name","number");
    money.setAttribute("class","btn btn-orange");
    money.setAttribute("value","获取薪资");
    money.setAttribute("style","height:45px;cursor:pointer;");
    $('.pos_base_statistics').append(money);

    money.onclick=function(){
        var nr = document.getElementsByClassName("pos_salary")[0].innerHTML;
        nr=nr.split('<',1);
        nr = nr+'元/月';
        GM_setClipboard(nr);
        console.log(nr);
    };
})();