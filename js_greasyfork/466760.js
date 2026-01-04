// ==UserScript==
// @name         b站学习工具
// @version      2.0
// @description  屏蔽播放页以及首页的视频推荐（t键切换），l键扩大选集框，字幕快捷键z、页面全屏快捷键y、宽屏快捷键k。
// @author       your_hamster
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1080975
// @downloadURL https://update.greasyfork.org/scripts/466760/b%E7%AB%99%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/466760/b%E7%AB%99%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //查看本地是否开启屏蔽
    var enableBlock = localStorage.getItem('enableBlock');
    if(enableBlock == null){
        enableBlock = 'true';
        localStorage.setItem('enableBlock', enableBlock);
    }
    //绑定节点
    var node1;
    var node2;
    var node3;
    var node4;
    var node5;
    var searchWord;
    bindNode();
    //判断是否开启屏蔽
    var observer = new MutationObserver((mutations) => {
           bindNode();
           blockRecommend();
        });;
    if(enableBlock == 'true'){
        observer.observe(document.body, { childList: true, subtree: true });
    }
    //绑定快捷键：打开字幕“z”、宽屏播放“k”、页面全屏播放“y”、扩大/缩小选集框“l”、开启/关闭推荐屏蔽“t”
    var right_container_flag = 0;
    document.addEventListener('keydown', function(event) {
        const subtitleBtn = document.querySelector('.bpx-player-ctrl-subtitle .bpx-player-ctrl-btn-icon .bpx-common-svg-icon');
        const wideScreenBtn = document.querySelector('.bpx-player-ctrl-wide .bpx-player-ctrl-btn-icon .bpx-common-svg-icon');
        const fullScreenBtn = document.querySelector('.bpx-player-ctrl-web .bpx-player-ctrl-btn-icon .bpx-common-svg-icon');

        if (event.key === 'z' && subtitleBtn) {
            subtitleBtn.click();
        }
        if (event.key === 'k' && wideScreenBtn) {
            wideScreenBtn.click();
        }
        if (event.key === 'y' && fullScreenBtn) {
            fullScreenBtn.click();
        }
        if (event.key === 'l') {
            try{
                if(right_container_flag == 0){
                    document.querySelector(".right-container").setAttribute("style", "width: 600px;");
                    try{
                        document.querySelector(".video-pod__body").setAttribute("style", "max-height: 350px;");
                    }catch{}
                    right_container_flag = 1;
                }else{
                    document.querySelector(".right-container").setAttribute("style", "width: 350px;");
                    try{
                        document.querySelector(".video-pod__body").setAttribute("style", "max-height: 250px;");
                    }catch{}
                    right_container_flag = 0;
                }
            }catch(error) {
            }
        }
        if (event.key === 't') {
            enableBlock = (enableBlock=='false')?'true':'false';
            localStorage.setItem('enableBlock', enableBlock);
            observer.disconnect();
            if(enableBlock == 'true'){
                blockRecommend();
            }
            else{
                undoBlockRecommend();
            }
        }
    });

//函数区===============================函数区

    //绑定节点
    function bindNode(){
        try{
            node1 = document.querySelector('.bpx-player-ending-panel').querySelector('.bpx-player-ending-related');//视频结束后的视频推荐
        }catch(e){
        }
        try{
            node2 = document.querySelector('.recommend-list-v1');//侧边视频推荐栏
        }catch(e){
        }
        try{
            node3 = document.querySelector('#biliMainHeader');//顶部栏
        }catch(e){
        }
        try{
            node4 = document.querySelector('.pop-live-small-mode');//侧边直播框
        }catch(e){
        }
        try{
            node5 = document.querySelector(".feed2");//首页推荐
        }catch(e){
        }
    }

    //清除所有推荐
    function blockRecommend(){
        try{
            node1.style.display = "none";
        }catch(error) {
        }
        try{
            node2.style.display = "none";
        }catch(error) {
        }
        try{
            node4.style.display = "none";
        }catch(error) {
        }
        try{
            var words = node3.querySelector('.nav-search-input').getAttribute("placeholder");
            if(words !='') searchWord = words;
            node3.querySelector('.nav-search-input').setAttribute("placeholder",'');
        }catch(error) {
        }
        try{
            node3.querySelector('.trending').style.display = "none";
        }catch(error) {
        }
        try{
            node5.style.display = "none";
        }catch(error){
        }
    }

    //添加所有推荐
    function undoBlockRecommend(){
        try{
            node1.style.display = "block";
        }catch(error) {
        }
        try{
            node2.style.display = "block";
        }catch(error) {
        }
        try{
            node4.style.display = "none";
        }catch(error) {
        }
        try{
            node3.querySelector('.nav-search-input').setAttribute("placeholder",searchWord);
        }catch(error) {
        }
        try{
            node3.querySelector('.trending').style.display = "block";
        }catch(error) {
        }
        try{
            node5.style.display = "block";
        }catch(error){
        }
    }
})();
