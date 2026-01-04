// ==UserScript==
// @name 真学添加视频加速按钮
// @description 用于真学网站的视频播放器助手
// @namespace Violentmonkey Scripts
// @match http://bl.crtvup.com.cn/index.php
// @grant none
// @version 1.2.1
// @downloadURL https://update.greasyfork.org/scripts/390900/%E7%9C%9F%E5%AD%A6%E6%B7%BB%E5%8A%A0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/390900/%E7%9C%9F%E5%AD%A6%E6%B7%BB%E5%8A%A0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var speedList = [1, 1.25, 1.5, 1.75, 2];
    var vjs = null;
    var currentVideo = null;
  
    function getVideoElement(id) {
        var node = null;
        let videoListNode = document.getElementsByClassName("video_list");
        Array.prototype.forEach.call(videoListNode, function(e) {
            let data = e.getAttribute("data-name");
            if (data == id) { node = e; }
        });
        return node;
    }
  
    function registerVideoList() {
        let videoListNode = document.getElementsByClassName("video_list");
        Array.prototype.forEach.call(videoListNode,function(e) {
            e.onclick = function(){onObjSelect(this);};
        });
      
        // 尝试恢复上次播放的视频
        tryRestore();
    }
  
    // 设置播放速度
    function setSpeed(rate) {
        vjs.tech_.setPlaybackRate(rate);
        localStorage.setItem("rate", rate);
    }
  
    // 恢复上次设置的播放速度
    function restoreSpeed() {
        let rate = localStorage.getItem("rate");
        if (rate != null) {
            vjs.tech_.setPlaybackRate(rate);
        }
    }
  
    function onObjSelect(obj) {
        let data = obj.getAttribute("data-name");
        localStorage.setItem("video_path", data);
        currentVideo = data;
        console.log(data);
    }
  
    function tryPlay(data) {
        let ele = getVideoElement(data);
        if (ele != null) {
            ele.click();
        }
    }
  
    // 尝试恢复上次播放的视频
    function tryRestore() {
        let data = localStorage.getItem("video_path");
        if (data != null) {
            tryPlay(data);
        }
    }
  
    // 播放下一个视频
    function playnext() {
        getVideoElement(currentVideo).parentElement.nextElementSibling.childNodes[0].click();
    }
  
    window.onload=function() {
        vjs = window.videojs.getPlayers("my-video")["my-video"];
        // 添加视频加速按钮
        let controlBar = document.getElementsByClassName("vjs-control-bar")[0];
        speedList.forEach(function(e){
            let btn=document.createElement("button");
            let text=document.createTextNode(e+"x");
            btn.appendChild(text);

            controlBar.appendChild(btn);
            btn.setAttribute("data", e);
            btn.onclick=function() {
                setSpeed(e);
            };
        });

        // 删除右键菜单屏蔽
        document.body.oncontextmenu = null;
        document.getElementById("my-video").oncontextmenu = null;
        document.getElementById("my-video_html5_api").oncontextmenu = null;

        // 修改视频高度
        document.getElementById("my-video").style.height = "calc(100vh - 60px)";
        document.getElementById("right_list").style.height = "calc(100vh - 60px)";

        // 注册列表改变事件
        let listNode = document.getElementById("main-menu");
        let config = { attributes: false, childList: true, subtree: true };
        let observer = new MutationObserver(function(mutationsList) {
            registerVideoList();
        });
        observer.observe(listNode, config);
        registerVideoList();
      
        // 注册播放完毕事件，用于连播
        vjs.on("ended", playnext);
        // 注册加载事件，用于调整播放速度
        vjs.on("loadstart", restoreSpeed);
    }
})();