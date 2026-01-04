// ==UserScript==
// @name         ID获取(需配合katalon recorder)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取本科目下的所有视频li的id，然后以数据驱动的方式交给katalon recorder自动刷课
// @author       xuelingzhizun
// @match        http://*.yxlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497611/ID%E8%8E%B7%E5%8F%96%28%E9%9C%80%E9%85%8D%E5%90%88katalon%20recorder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497611/ID%E8%8E%B7%E5%8F%96%28%E9%9C%80%E9%85%8D%E5%90%88katalon%20recorder%29.meta.js
// ==/UserScript==


'use strict';

//以下为将获取的视频编码自动生成为csv格式供katalon调用
function csvSave(data){
    // 将数据转换为CSV格式
    var csvContent = "data:text/csv;charset=utf-8,"
    + data.map(e => e.join(",")).join("\n");

    // 创建一个隐藏的a标签用于下载
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");

    // 添加到body中并触发click事件
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
}

//以下为等网页加载完成开始获取课程唯一标识id
window.addEventListener('load', function() {
    var arryj = ''; //初始化盛放所有video的id的变量 arryj 主要用于加换行后显示到网页上
    var data = [["id","badge"]];//初始化盛放所有video的id的变量 data 主要用于加"-badge"放到csv里

    var videosid = document.getElementsByTagName("ul")[3].getAttribute("id");//获取本页视频的上级ul的id，为下一步找各个视频的li的id做准备
    var getli = document.getElementById(videosid).getElementsByClassName("clearfix videoLi") //获取到了视频框ul下所有的li标签
    console.log(getli[1])
    for(var i=0;i<=getli.length-1;i++){
        arryj+=getli[i].getAttribute("id")+"\n";
        data.push([getli[i].getAttribute("id"),getli[i].getAttribute("id")+"-badge"]);
    };
    (function(){document.getElementById("introduce").innerText=arryj;})();
    csvSave(data);

}, false);

