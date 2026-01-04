// ==UserScript==
// @name         p站样式调整
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  整体调整css样式,页面布局,环境:Chrome全屏 电脑分辨率:1920*1080,进入https://www.pixiv.net/discovery页面会自动点击自动浏览
// @author       aotmd
// @match        https://www.pixiv.net/*
// @include      https://www.pixiv.net/*
// @exclude      https://www.pixiv.net/setting*
// @exclude      https://www.pixiv.net/stacc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398522/p%E7%AB%99%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/398522/p%E7%AB%99%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('#wrapper {width:1520px;}.ui-layout-east {width:1334px;}.contents-east {width:100%;}.contents-main {width:1100px;}');//布局调整
    addStyle('#item-container ._user-items > li:nth-child(n + 8) {display: inline-block;}#item-container ._user-items > li:nth-child(n + 16) {display: none;}');//发现推荐用户
    addStyle('.NewsTop .category {width: auto;}.top-info-content{text-align: center;}');//公告
    addStyle('._mypage-pixivision .pixivision__list {width: auto;}');// pixivision
    addStyle('._mypage-fanbox .mf__list{display: inline-block;margin: 0px 100px;}._classic-fanbox-creator {display: inline-block;}');// FANBOX推荐的创作者
    addStyle('.project_pixiv {float: left;height: 100px;width: 50%;display: inline-block;background-color:transparent!important;}');// 募集中
    addStyle('.layout-body{transition:5s;width:100%;}#js-mount-point-latest-following{min-height:auto!important;}');//  其他页面
    addStyle('li.sc-9y4be5-2.sc-9y4be5-3.sc-1wcj34s-1.bqtGkf {display: none;}');//  首页无效内容隐藏
    var url=window.location.href;
    console.log(url!='https://www.pixiv.net/')
    if(url!='https://www.pixiv.net/'){
        addStyle('#wrapper {transition:5s;width:100%;}');
        setTimeout( function(){document.getElementById("enable-auto-view").click();console.log('点击成功');},5000);
        addStyle('nav.sc-1ic2voq-0.crFCUS{position:static!important;}');//  清除顶部固定
        addStyle('._2RNjBox{margin: 6px 3px!important}');//边距调整
        addStyle('#js-mount-point-discovery {text-align:center;}');
    }
  var str=/^https:\/\/www.pixiv.net\/tags\//i;
    var ad=function(){
     var a=document.getElementsByClassName('sc-LzMmo jkOmjd');
        if(a.length!=0){
            a[0].style='display: none;';
        }else{
            setTimeout(ad,100);
        }
    }
    if(str.test(url)){
        console.log(url);
        setTimeout(ad,0);
        }
     //更改图标<link rel="shortcut icon" type="image/x-icon" href="https://source.pixiv.net/common/images/android-chrome-192x192.png">
       var changeIcon = function () {
        var link =document.getElementsByTagName('link');
           var i=0;
           var flag=0;
        for(i=0;i<link.length;i++){
            if(link[i].rel=="shortcut icon"){
                flag=1;
                link[i].href="https://source.pixiv.net/common/images/android-chrome-192x192.png";
                console.log( '已执行');
            }
        }
        if(flag!=1){setTimeout(changeIcon,100);console.log( '没有执行');}
      };
    window.onload = function () {
    setTimeout(changeIcon,0);
    //0.1.4在推荐作品添加查看全部按钮,隐藏目前没用的黑框,0.1.5改变匹配策略
    setTimeout(function(){
            var a=document.getElementsByTagName("section");
            var i=0;
            for(i=1;i<a.length;i++){
                if(a[i].getElementsByTagName("h2")[0].innerHTML=="推荐作品"){
                    a[i].getElementsByTagName("div")[0].innerHTML+=`<a target="_blank" class="sc-pzZvs hziszA" href="/discovery">查看全部</a>`;
                    a[i].getElementsByTagName("li")[0].style="display: none;";
                }
            }
    	},0);
    }
})();