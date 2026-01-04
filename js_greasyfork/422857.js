// ==UserScript==
// @name         某在线教育题库去除VIP限制，题库界面清洁下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        http://www.rongyuejiaoyu.com/*
// @description  某在线教育题库免费使用-题目转文件下载-去除购买题库的提示遮罩层
// @author       zhangxc427
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422857/%E6%9F%90%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E9%A2%98%E5%BA%93%E5%8E%BB%E9%99%A4VIP%E9%99%90%E5%88%B6%EF%BC%8C%E9%A2%98%E5%BA%93%E7%95%8C%E9%9D%A2%E6%B8%85%E6%B4%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/422857/%E6%9F%90%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E9%A2%98%E5%BA%93%E5%8E%BB%E9%99%A4VIP%E9%99%90%E5%88%B6%EF%BC%8C%E9%A2%98%E5%BA%93%E7%95%8C%E9%9D%A2%E6%B8%85%E6%B4%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


//////感谢csdn wsws男 按钮源代码
(function() {
    'use strict';
//////弹框消息-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//////下载题目的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var xzbutton,xztag;
    xzbutton = document.createElement("div");
    xztag = document.querySelector("body");
    xztag.appendChild(xzbutton);
    xzbutton.id = "xzbtid";
    xzbutton.innerHTML = "下载题目";
    xzbutton.title = "帮助文件";
    xzbutton.style = "position:fixed;bottom:15px;right:15px;width:80px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
//////删除遮罩层、css调整------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    setTimeout(()=> {modcss();}, 50)
    window.onmousemove = debounce(modcss,50)
    function debounce(fn, delay) {
     var timer = null;
     return function() {;
        if (timer) {;
         clearTimeout(timer);
        };
        timer = setTimeout(fn, delay);
     };
    };
    function modcss(){
    $("[class='questionNums float_Left']").css('float','left');//题号与题目同一行,
    $(".quetsionfeature.float_Right.clearBox").remove();//没用的提问答疑板块去掉
    $(".maskbox").remove();//题库遮罩层去掉
    $("[class='index__simulateListBtn index__noable float_Left']").remove();//解锁题库
    $("[class='index__reportsBtn float_Left']").css('display','block');//解锁做题、继续做题按钮
    $("[class='MsoNormal']").css('text-indent','10px');//设置题目缩进1
    $("[class='questionTimu']").css('text-indent','10px');//设置题目缩进2
    $("[class='question-item']").css('margin-block-end','45px');//设置margin-block-end设置为45px
    $("[class='question-item']").css('font-size','10px');//设置文字大小为10px
    };
//////杂项对齐-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //function mytxidFc(){
      //var x = document.getElementsByClassName("MsoNormal");
      //var i;
      //for (i = 0; i < x.length; i++) {x[i].style.textIndent="10px";};
      //var y = document.getElementsByClassName("questionTimu");
      //var j;
      //for (j = 0; j < y.length; i++) {y[j].style.textIndent="10px";};
    //};
////// 下载html文件代码--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    xzbutton.onclick = function(){
    document.getElementsByClassName("practice-left")[0].id = 'prcid';
    var urlObject = window.URL || window.webkitURL || window;
    var downloadData = new Blob([$('#prcid').html()]); // js Blob 方法
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(downloadData);
        console.log(save_link.href);
    save_link.download = document.getElementsByClassName("title-title")[0].innerText + '.html';//章节title作为文件名
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(ev);
    };
})();