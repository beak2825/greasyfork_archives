// ==UserScript==
// @name         B站微调
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  隐藏搜索框推荐词、隐藏动态首页充电视频、重定向旧动态详情页、重定向稍后再看到av页。修复了稍后再看不能正确跳转的bug
// @author       xmk22025
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526195/B%E7%AB%99%E5%BE%AE%E8%B0%83.user.js
// @updateURL https://update.greasyfork.org/scripts/526195/B%E7%AB%99%E5%BE%AE%E8%B0%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let i = 0;
    let k = 0;
    let dynNum;
    let URL = window.location.href;
    let timeSet1= setInterval(cleanNavSearchInput, 100);
    //let xhr = new XMLHttpRequest();

    //前置函数其一：辅助监听页面滚动，优化性能
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    //获取页面所有动态
    function getTotalDynNum(){
        //console.log("进入获取总动态数函数");
        if(k <= 1){
            if(URL == "https://t.bilibili.com/"){
                //console.log("成功判定为动态首页URL");
                dynNum = document.getElementsByClassName('bili-dyn-list__item').length;
                //console.log(dynNum);
                //if(dynNum == 0){getTotalDynNum();}
                if(dynNum == 0){dynNum = document.getElementsByClassName('bili-dyn-list__item').length;}
                //else{
                    console.log(dynNum);
                    cleanElecVideo(dynNum);
                //}
            }
        }
    }

    let navSearchInputFather = document.getElementsByClassName('nav-search-content')[0];
    let navSearchInput;
    let searchPanel;
    function cleanNavSearchInput(){
        //i++;
        //console.log(i);
        navSearchInputFather = document.getElementsByClassName('nav-search-content')[0];
        if(navSearchInputFather){
            navSearchInput = navSearchInputFather.firstChild;
            searchPanel = document.getElementsByClassName('search-panel')[0];
            if(i >= 30){
                clearInterval(timeSet1);
                console.log("i>=30");
                return;
            }
            if(navSearchInput){
                if(navSearchInput.placeholder == ""){;}
                else{
                    navSearchInput.placeholder = "";
                    searchPanel.remove();
                    i = 30;
                }
            }
        }else if(URL == "https://t.bilibili.com/"){
            console.log('i<30');
            clearInterval(timeSet1);
            return;
        }
        else{
            i++;
            console.log('i=' + i);
            if(i > 30){
                clearInterval(timeSet1);
                console.log("i>30");
                return;
            }
        }
    }

    function cleanElecVideo(dynNum){
        let Bbadge;
        for(let j = 0; j < dynNum; j++){
            Bbadge = document.getElementsByClassName('bili-dyn-card-video__badge')[j];
            if(Bbadge){
                if(Bbadge.innerText == "充电专属"){
                    console.log('准备清除充电视频');
                    Bbadge.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
                }
            }
        }
        setTimeout(function(){
            k = 0;
            console.log("k=" + k);
        }, 5000)
    }

    function ReturnDyn(){
        //let URLnew = '0';
        if(URL.includes("opus")){
            URL = URL.replace("www", "t");
            URL = URL.replace("/opus/", "/");
            location.replace(URL);
        }
        let URLnew = window.location.href;
        if(URLnew.includes("jump_opus=1"))
        {
            location.replace(URL);
        }
    }
    ReturnDyn();

    function watchlater2av(){
        //https://www.bilibili.com/watchlater/#/list
        //https://www.bilibili.com/list/watchlater?oid=113952310692734&bvid=BV1mUPmeJERA&aid=113952310692734
        //https://www.bilibili.com/watchlater/#/av113952310692734/p1
        //https://www.bilibili.com/watchlater/list#/av115614765029365/p1
        //https://www.bilibili.com/list/watchlater?oid=113960967736939&bvid=BV1qpNbeEE1Z&aid=113960967736939#/av113980060271411/p1
        let watchlater = 0;
        console.log("判断稍后再看");
        //console.log(URL, URL.includes("watchlater"), URL.includes("#/list"), URL.includes("av"));
        if(URL.includes("watchlater") && !URL.includes("#/list")){
            console.log('进入稍后再看');
            //console.log(URL.includes('aid'), URL.includes('av'), URL.includes('list'));
            if(URL.includes('aid')){
                //console.log('含aid');
                let searchParams = new URLSearchParams(window.location.search);
                let aid = searchParams.get('aid');
                URL = "https://www.bilibili.com/video/av".concat(aid);
                location.replace(URL);
            }
            else if(URL.includes('av')){
                let tmpURL
                let newURL;
                if(!URL.includes('list')){
                    //console.log('含av');
                    tmpURL = URL.replace("watchlater/#", "video");
                }
                else if(URL.includes('list')){
                    //console.log('含av和list', URL);
                    tmpURL = URL.replace("watchlater/list#", "video");
                }
                newURL = tmpURL.replace("/p1", "");
                location.replace(newURL);
            }
            else{
                console.log("不在稍后再看的视频详情页中");
                watchlater = 1;
            }
            setTimeout(()=>{
                watchlater2av();
                if(!URL.includes("watchlater")){
                    return URL;
                }
                else if(watchlater)
                {
                    return watchlater;
                }
            },3000);
        }
    }
    watchlater2av();

    //xhr.addEventListener("load", function(){
    //    if (xhr.readyState === 4 && xhr.status === 200) {
    //        console.log('请求已完成，响应数据:', xhr.responseText);
    //    }
    //})
    //xhr.onreadystatechange = function () {
    //
    //};

    //let listenPageScroll = debounce(function(){
    //    if ((window.innerHeight + window.pageYOffset + 550) >= document.body.offsetHeight) {
    //        console.log("判定为滚动到底部");
    //        getTotalDynNum();
    //    }}, 100);

    function listenDynList(){
        //console.log("A");
        const MytargetNode = document.getElementsByClassName('bili-dyn-list__items')[0];
        console.log(MytargetNode);
        const Myconfig = {childList: true, subtree: true };
        const Mycallback = function(mutationsList, Myobserver) {
            console.log("监听到变化");
            for(let mutation of mutationsList) {
                if(mutation.type === 'childList'){
                    k++;
                    if(k <= 1){
                        console.log("判断为子节点更新，且k<=1");
                        getTotalDynNum();
                    }
                }
            }
        };
        const Myobserver = new MutationObserver(Mycallback);
        Myobserver.observe(MytargetNode, Myconfig);
    }

    function upBlock(){
        //console.log('进来了');
        let recommandNum = document.getElementsByClassName('upname').length;
        let upNameText;
        let upName;
        for(let j = 0; j <recommandNum; j++){
            upNameText = document.getElementsByClassName('upname')[j].innerText;
            upName = document.getElementsByClassName('upname')[j];
            if(upNameText.includes("波士顿圆脸")){
                upName.parentNode.parentNode.parentNode.remove();
            }
            if(upNameText.includes("小西研究所")){
                upName.parentNode.parentNode.parentNode.remove();
            }
            if(upNameText.includes("花粉情报员")){
                upName.parentNode.parentNode.parentNode.remove();
            }
            if(upNameText.includes("大狸子切切里")){
                upName.parentNode.parentNode.parentNode.remove();
            }
        }
    }

    window.onload = function(){
        if(URL == "https://t.bilibili.com/"){
            listenDynList();
            setTimeout(getTotalDynNum(), 500);
        }
        else if(URL.includes("video")){
            //console.log('进来了');
            upBlock();
        }
    };
    //window.addEventListener('scroll', listenPageScroll);
})();