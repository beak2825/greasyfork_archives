// ==UserScript==
// @name         新思考网刷网课（hnpx.cersp.com）
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  1.进入登录页面，输入账号、密码登录；    2.登录成功后不要做任何操作，自动刷网课；    3.自动找到该页未刷完所有网课观看。
// @author       wyj1991
// @match        http://hnpx.cersp.com/office/myoffice.jspx
// @match        http://hnpx.cersp.com/course/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cersp.com
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471344/%E6%96%B0%E6%80%9D%E8%80%83%E7%BD%91%E5%88%B7%E7%BD%91%E8%AF%BE%EF%BC%88hnpxcerspcom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471344/%E6%96%B0%E6%80%9D%E8%80%83%E7%BD%91%E5%88%B7%E7%BD%91%E8%AF%BE%EF%BC%88hnpxcerspcom%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const closeTime = 15;//分
    const reloadTime = 20;//分
    const answerTime = 20;//秒
    const findTime = 3;//秒
    const playTime = 5;//秒
    function start(){
        let learn = document.querySelector('#zcd2');
        if(learn){
            learn.click();
            setTimeout( function(){ findVideo();},3000);
        }
     }
    function findVideo(){
        const videos = document.querySelectorAll('.btn-bofang');
        let arr = [];
        if(videos){
            for(let i = 0; i < videos.length; i++){
                if(videos[i].previousElementSibling.innerText.indexOf('您已完成此课程') == -1){
                    arr.push(videos[i]);
                }
            }
        }
        if(arr.length > 0){
            for(let i = 0; i < arr.length; i++){
                arr[i].click();
            }
        }else{
            nextPage();
        }
    }
    function videoPlay(){
        const video = document.querySelector('video');
        if(video){
            console.log('kkk: start to play！');
            video.muted = true;
            video.play();
        }
    }
    function nextPage(){
        console.log('kkk: now page is clear,next page');
        const a = document.querySelectorAll('#bxcourseList > div > div.p-center > strong > a');
        let nowPage = document.querySelector('#bxcourseList > div > div.p-right > strong > font').innerText;
        nowPage = nowPage.slice(0, nowPage.length - 3);
        for(let i = 0 ; i < a.length; i++){
            if(nowPage <= a[i].children[0].innerText){
                a[i].click();
                setTimeout( function(){ findVideo();},1000 * findTime);
                return;
            }
        }

    }
    function answer(){
        const input = document.querySelector('#TB_ajaxContent > div > div.taskCon > div.options > ul > li:nth-child(2) > div.tradio > input[type=radio]');
        if(input){
            input.checked;
            const btn = document.querySelector('#TB_ajaxContent > div > div.taskCon > div.tasktj > input');
            if(btn){
                btn.click();
                console.log('kkk: question submit');
            }
        }
    }
    unsafeWindow.onload = function(){
        start();
        if('http://hnpx.cersp.com/office/myoffice.jspx' == window.location.href){
            setInterval(function(){window.location.reload()}, 1000 * 60 * reloadTime);
        }else{
            setTimeout( function(){ videoPlay();}, 1000 * playTime);
            setInterval(function(){answer()}, 1000 * answerTime);
            setTimeout(function(){window.close()}, 1000 * 60 * closeTime);
        }
    }
})();