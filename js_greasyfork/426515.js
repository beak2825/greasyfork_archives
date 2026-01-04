// ==UserScript==
// @name         ulearning
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  课程思政网络培训的视频每隔几分钟会暂停播放，这个脚本可以帮你自动（每分钟检测一次）继续播放，还可以跳过非视频的页面（这个功能没有仔细测试），只支持在同一个课程内自动播放，播放结束后跳到下一章节，所以请选择一个学分数很大的课程来挂课。 打开课程之后，你只需要一些些的耐心。
// @author       laohoo
// @match        https://ua.ulearning.cn/learnCourse/learnCourse.html*
// @icon         https://www.google.com/s2/favicons?domain=ulearning.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426515/ulearning.user.js
// @updateURL https://update.greasyfork.org/scripts/426515/ulearning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log(Date(), 'Let me go.');
    let tiemOut = 1000*60;  // 检测间隔时间，默认为一分钟(1000*60)一次
    let lists = [];
    let vFlag = '';

    let speed = 4;   // 播放的倍速, 我也不知道最大可以是多少，但是别搞太夸张了。

    let video_list =[];

    function getPlayList(){
        lists = document.querySelectorAll('.page-item div.page-name.cursor');
        console.log(lists);
        return lists;
    }

    // 中断后再接着播放时，打开所有的章节以便更新视频播放状态，否则影响判断未播放的章节
    // 如果没有效的话，麻烦您手动点一下已经播放过的各章标题，让它展开以更新各小节视频的播放状态
    function openChapter(){
        let chapters = document.querySelectorAll('div.chapter-name.cursor');
        console.log(Date(),'chapters:',chapters);
        if(chapters){
            for(let ch of chapters){
                setTimeout(function(){
                    ch.click();
                }, 1000*5);
            }
        }
    }
    // 设置播放速度为 1.50X
    function setSpeed(){
        let speed_button = document.querySelector('.mejs__speed-button button');
        console.log(Date(),'speed_button: ',speed_button );
        if(speed_button){
            if(speed_button.innerText==='1.00x'){
                let speed_item = document.querySelector('li.mejs__speed-selector-list-item > input');
                speed_item.value = speed;
                console.log(Date(),'speed_item: ',speed_item );
                if(speed_item){
                    console.log(Date(), 'set the speed is：' , speed);
                    speed_item.click();
                }
            }
        }
    }

    // 没有视频的内容跳转到下一页，这个函数有bug，不想改了。
    function nextPage(){
        let nextBtn = document.querySelector('.next-page-btn');
        let step = 2;
        console.log(Date(), 'next page.');

        let btn_hollow = document.querySelector('button.btn-hollow');
        if(btn_hollow){
            console.log(Date(), 'button.btn-hollow is click.');
            btn_hollow.click();
        }

        if(nextBtn){
            console.log(Date(), '.next-page-btn is click.');
            nextBtn.click();
        }
    }

    // 当前视频播放结束后，跳到下一个有视频的页面。
    function nextActivePage(){
        if(lists.length){
            console.log(Date(), 'play lists.');
            for(var index in lists){
                let iconFont = lists[index].querySelector('.page-icon i.iconfont');
                if(iconFont.innerText ===vFlag){
                    if(!lists[index].classList.contains('complete')){

                        console.log(Date(), 'not complete, not active. ',lists[index]);
                        lists[index].click();
                        break;
                    }
                }
            }
        }
    }

    // 很久没有点击页面的话，会弹出一个暂停框等待确认
    function toContinue(){
        let pause = document.querySelector('div.modal-operation button.btn-submit');
        if(pause){
            console.log(Date(),'it is pause, continue...');
            pause.click();
        }
    }

    setInterval(function(){
        try{
            let btn_play = document.querySelector('.mejs__overlay-play');
            let playStatus = document.querySelector('div.video-progress  div.text span');
            console.log(Date(), 'btn_play: ',btn_play);
            if(lists.length<2){
                getPlayList();
                openChapter();
            }

            if(!btn_play){
                nextPage();
            }else{
                if(btn_play.style.display!=='none'){
                    if(playStatus.innerText !='已看完'){
                        btn_play.click();
                        console.log(Date(), 'play continue... ');
                    }else{
                        nextActivePage();
                    }
                }else{
                    console.log(Date(), playStatus.innerText);
                }
            }

            setSpeed();
            toContinue();
        }
        catch(e){
            console.log(Date(), "Error in this userscript: ",e.message);
        }
    }, tiemOut);



    // Your code here...
})();