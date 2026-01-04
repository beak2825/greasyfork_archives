// ==UserScript==
// @name         油管剧场小窗模式 - YouTube PIP mode with progress bar
// @version      1.0.6
// @description  Youtube在剧场模式下，如果是小窗口(宽度小于876像素），视频会出现迷之黑边，去掉它们并保证视频占据整个窗口。并让顶部工具栏只在鼠标悬停时显示。（推荐配合WebAPP模式、窗口置顶工具一同使用）
// @author       CWBeta
// @include      *youtube.com*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @namespace    https://greasyfork.org/users/670174
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483478/%E6%B2%B9%E7%AE%A1%E5%89%A7%E5%9C%BA%E5%B0%8F%E7%AA%97%E6%A8%A1%E5%BC%8F%20-%20YouTube%20PIP%20mode%20with%20progress%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/483478/%E6%B2%B9%E7%AE%A1%E5%89%A7%E5%9C%BA%E5%B0%8F%E7%AA%97%E6%A8%A1%E5%BC%8F%20-%20YouTube%20PIP%20mode%20with%20progress%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function CheckBlackFrame(){
        var videoWrapper = document.querySelector("#full-bleed-container");

        if (cwData["layout"]!= "theater"){// || window.innerWidth >= 876){
            videoWrapper.style["height"] = null;
            videoWrapper.style["min-height"] = null;
            videoWrapper.style["max-height"] = null;
            return;
        }
        var videoWindow = document.querySelector(".video-stream.html5-main-video");
        var topValue = videoWindow.style.top;
        var height = parseInt(videoWindow.style.height.substr(0,videoWindow.style.height.length-2));
        var width = parseInt(videoWindow.style.width.substr(0,videoWindow.style.width.length-2));
        if (videoWindow.getAttribute("cw-width") !=window.innerWidth
            || videoWindow.getAttribute("cw-height") != window.innerHeight)
        {
            console.log("窗口变化，重置黑边！")
            videoWindow.style["top"] = "0px";
            // 如果是竖屏，撑满横屏即可
            if(window.innerHeight > window.innerWidth){
                videoWrapper.style["height"] = window.innerWidth * 9 / 16 + "px";
                videoWindow.style["top"] = 0;
            }
            else{
                videoWrapper.style["height"] = window.innerHeight + "px";
                videoWindow.style["top"] = (window.innerHeight - height) / 2 + "px";
            }

            console.log("top:" + videoWindow.style["top"]);
            //videoWrapper.style["height"] = height;
            videoWrapper.style["min-height"] = "0px";
            videoWrapper.style["max-height"] = "99999px";
        }
        videoWindow.setAttribute("cw-width",window.innerWidth);
        videoWindow.setAttribute("cw-height",window.innerHeight);
    }

    function ShowComments(){
        console.log("Comments");
        // 如果不是竖屏，不插入弹幕
        if(window.innerHeight <= window.innerWidth){
            return;
        }
        // 如果是显示弹幕模式，则不需要额外添加弹幕框
        const ytbPlayerNode = document.querySelector("ytd-watch-flexy");
        if (ytbPlayerNode) {
            if (ytbPlayerNode.hasAttribute("live-chat-present-and-expanded")) {
                return;
            }
        }
        // 如果已经创建过弹幕框，则不需要重复创建
        var chatWrapper = document.querySelector("#cw-chat-container");
        if(chatWrapper != undefined){
            return;
        }

        const primaryInnerBox = document.querySelector("#primary-inner");
        // 创建弹幕框
        const urlObj = new URL(window.location.href);
        const vid = urlObj.searchParams.get("v");
        // 创建 iframe 元素
        const iframe = document.createElement("iframe");
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.id = "chatframe";
        iframe.className = "style-scope ytd-live-chat-frame";
        iframe.src = `https://www.youtube.com/live_chat?is_popout=1&v=${vid}`;
        iframe.height = `100%`;

        // 创建容器 div
        const containerDiv = document.createElement("div");
        containerDiv.id = "cw-chat-container";
        containerDiv.appendChild(iframe); // 将 iframe 添加到 div 内
        const belowBox = document.querySelector("#below");
        containerDiv.style["height"] = window.innerHeight - (window.innerWidth * 9 / 16) - belowBox.clientHeight - 48 + "px";

        // 获取目标节点并插入容器
        primaryInnerBox.appendChild(containerDiv);
    }

    function CheckPageLoad(){
        var shouldRefresh = false;

        // 网址变了则刷新（因为Youtube会动态加载而不会刷新，所以需要主动调用刷新）
        if(cwData["href"] != location.href){
            console.log("网页地址跳转：" + cwData["href"] + " → " + location.href);
            shouldRefresh = true;
        }

        // 如果切换了播放模式（普通、剧场、全屏），则主动调用刷新以避免在非剧场模式启用样式变化
        var layout = GetLayout();
        if (cwData["layout"] != layout)
        {
            console.log("播放样式切换：" + cwData["layout"] + " → " + layout);
            shouldRefresh = true;
        }
        cwData["layout"] = layout;

        if(shouldRefresh){
            Refresh();
        }
    }

    function GetLayout(){
        var element = document.querySelector('ytd-watch-flexy');
        var layout = "";
        if(element.hasAttribute("default-layout")){
            layout = "default";
        }
        else if(element.hasAttribute("fullscreen")){
            layout = "fullscreen";
        }
        else{
            layout = "theater";
        }
        return layout;
    }

    function AddStyle(){
        var oldStyle = document.getElementById("cw-style");
        if(oldStyle != undefined){
            oldStyle.parentNode.removeChild(oldStyle);
        }

        var style = document.createElement("style");
        style.id = "cw-style";
        style.type = "text/css";
        var cssString = "html::-webkit-scrollbar { width: 0;} "

        // 当网页为视频播放页，而且是剧场模式时，启用样式表
        if (location.href.indexOf("/watch?") != -1
            && cwData["layout"]=="theater"){
            cssString += "html{--ytd-toolbar-height:0px} #masthead-container.ytd-app{opacity:0; transition:1s;} #masthead-container.ytd-app:hover{opacity:1};"
        }
        try
        {
            style.appendChild(document.createTextNode(cssString));
        }
        catch(ex)
        {
            style.styleSheet.cssText = cssString;//针对IE
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }

    function Update(){
        CheckPageLoad();
        CheckBlackFrame();
        ShowComments();
    }

    function OnLoad(){
        if (cwData["init"] == undefined){
            Init();
            cwData["init"] = true;
        }
    }

    function Init(){
        console.log("[油管剧场小窗模式] 运行中！")
        setTimeout(Refresh(), 1000);
    }

    function Refresh(){
        console.log("刷新状态！")
        ClearDatas();
        AddStyle();
        cwData["updateInterval"] = setInterval(Update,500);
        cwData["href"] = location.href;
        cwData["layout"] = GetLayout();
    }

    function ClearDatas(){
        var videoWindow = document.querySelector(".video-stream.html5-main-video");
        videoWindow.removeAttribute("cw-width");
        videoWindow.removeAttribute("cw-height");
        if(cwData["updateInterval"] != undefined){
            clearInterval(cwData["updateInterval"]);
        }
    }

    var cwData = {};

    window.addEventListener("load", function() {
        OnLoad();
    });

})();