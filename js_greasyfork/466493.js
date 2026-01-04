// ==UserScript==
// @name         学起Plus自动刷课结束播放下一集
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于弘成学起Plus自动刷课（进入网站点击第一节课，后续播放完毕会自动播放下一节）
// @author       菜级懒鬼
// @match        *://*.sccchina.net/*
// @match        *://*.chinaedu.net/*
// @connect      chinaedu.net
// @icon         https://static.8688g.com/up/2021-6/2021629191034189.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466493/%E5%AD%A6%E8%B5%B7Plus%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E7%BB%93%E6%9D%9F%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/466493/%E5%AD%A6%E8%B5%B7Plus%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E7%BB%93%E6%9D%9F%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

   (function () {
        'use strict';
        setInterval(task, 1000*10);
    })();

    function task() {
        if (document.getElementsByTagName('video')[0]) {
            let video=document.getElementsByTagName('video')[0];
            document.getElementById("videoFrame_video_html5_api").setAttribute('muted','');
            video.autoplay = true;
            video.muted = true;
            if(video.paused){
                let timeHtml=document.getElementsByClassName("vjs-current-time-display")[0].innerHTML;
                let allTimeHtml=document.getElementsByClassName("vjs-duration-display")[0].innerHTML;
                let time=timeHtml.substring(timeHtml.indexOf("</span>")+8).trim();
                let allTime=allTimeHtml.substring(allTimeHtml.indexOf("</span>")+8).trim();
                if (time!=allTime){
                    document.getElementsByClassName("vjs-big-play-button")[0].click();
                    document.getElementById('videoFrame_video_html5_api').play();
                }else{
                   let menu=getMenu();
                    console.log(menu);
                   if(menu){
                       menu.getElementsByTagName("a")[0].click();
                   }
                }
            }
        }
    }
        function getMenu() {
        let checkFlag=false;
        let list = window.parent.document.getElementsByClassName("leftOneLevel");
        for (let i=0;i<list.length;i++){
            let one=list[i];
            if (checkFlag){
                let towList=one.getElementsByClassName("leftTwoLevel");
                if (towList.length>0){
                    let tow=towList[0];
                    let threeList=tow.getElementsByClassName("leftThirdLevel");
                    if (threeList.length>0){
                        return threeList[0];
                    } else {
                        return tow;
                    }
                } else {
                    return one;
                }
            }else {
                let towList=one.getElementsByClassName("leftTwoLevel");
                if (towList.length>0){
                    for (let j=0;j<towList.length;j++){
                        let tow=towList[j];
                        let threeList=tow.getElementsByClassName("leftThirdLevel");
                        if (checkFlag){
                            if (threeList.length>0){
                                return threeList[0];
                            } else {
                                return tow;
                            }
                        } else {
                            if (threeList.length>0){
                                for (let k=0;k<threeList.length;k++){
                                    let three=threeList[k];
                                    let haveFour=three.getElementsByClassName("sub-menu");
                                    if (checkFlag){
                                        if (haveFour.length>0){
                                            let fourList=haveFour[0].getElementsByTagName("li");
                                            return fourList[0];
                                        } else {
                                            return three;
                                        }
                                    } else {
                                        if (haveFour.length>0){
                                            let fourList=haveFour[0].getElementsByTagName("li");
                                            for (let x=0;x<fourList.length;x++){
                                                let four=fourList[x];
                                                if (checkFlag){
                                                    return four;
                                                } else {
                                                    if (four.classList.contains('active')){
                                                        checkFlag=true;
                                                    }
                                                }
                                            }
                                        }else {
                                            if (three.classList.contains('active')) {
                                                checkFlag=true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (tow.classList.contains('active')) {
                                    checkFlag=true;
                                }
                            }
                        }
                    }
                } else {
                    if (one.classList.contains('active')) {
                        checkFlag=true;
                    }
                }
            }
        }
        return null;
    }