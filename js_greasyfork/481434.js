// ==UserScript==
// @name         Bilibili Auto Play Next
// @namespace    http://tampermonkey.net/
// @supportURL   https://gist.github.com/WsureDev/73a91d153be596e10ef2e84a24621c90#file-bilibili-auto-play-next
// @homepageURL  https://greasyfork.org/zh-CN/scripts/481434-bilibili-auto-play-next
// @version      0.1.3
// @description  合集、收藏夹连播，可全局也可仅当前生效，懂得都懂
// @author       wsure
// @match        *://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481434/Bilibili%20Auto%20Play%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/481434/Bilibili%20Auto%20Play%20Next.meta.js
// ==/UserScript==

let globalAutoPlayNext = GM_getValue('globalAutoPlayNext',false);
let autoPlayList = GM_getValue('autoPlayList',{});

// 一段自动设置播放速度和画质的代码，写着玩的没啥用了
function setQualityAndSpeed(){
    const video = document.querySelector("video");
    if (window.location.href.includes('BV')){
        let flag = false;
        video.addEventListener("play", (event) => {
            if(!flag){
                $('div.bpx-player-ctrl-btn.bpx-player-ctrl-quality > ul > li:nth-child(3)').click();
                setTimeout(() => {$('div.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate > ul > li:nth-child(2)').click();},1000)
                flag = true;
                console.log('set player quality')
            }
        });
    }
}
function playNext(){
    return GM_getValue('globalAutoPlayNext',false) || currentPlayNext();
}
function currentPlayNext(){
    return getPlayListUrl() in autoPlayList;
}

function isChannel_1(){
    // channel old
    return $(".base-video-sections-v1").length >0
}

function isChannel_2(){
    // channel old
    return $(".video-pod__body").length >0
}

function isChannel(){
    return isChannel_1() || isChannel_2()
}

function getPlayListUrl(){
    let _type=getVideoListType();
    if(_type == 'channel'){
        if(isChannel_1()) {
            return $('div.base-video-sections-v1 > div.video-sections-head > div.video-sections-head_first-line > div.first-line-left > a').attr('href');
        } else if(isChannel_2()){
            return $('div.video-pod.video-pod > div.video-pod__header > div.header-top > div.left > a').attr('href');
        }
    } else if(_type =='pList'){
        return $('#multi_page > div.cur-list > ul > li.on > a').attr('href');
    } else if(_type =='favlist'){
        return window.location.href.replace(/\?.*/,'');
    } else {
        return window.location.href.replace(/\?.*/,'');
    }
}
function getVideoListType(){
    if(isChannel()){
        return 'channel';
    } else if($('#multi_page > div.head-con').length >0){
        return 'pList';
    } else if($('div.action-list-container').length >0){
        return 'favlist';
    } else {
        return null;
    }
}
function isVideoList(){
    return isChannel()
    || $('div.action-list-container').length >0  // 收藏
    || $('#multi_page > div.head-con').length >0  // 分P
    ;
}

//在视频结束事件里加入“播放下一个”的操作
function setNextPlay(){
    const video = document.querySelector("video");
    if(getVideoListType() !== null){
        video.addEventListener("ended", (event) => {
            if (playNext())
                setTimeout(function () {
                    // 点下一个按钮
                    if($('.bpx-player-ctrl-next').length >0){
                        $('.bpx-player-ctrl-next').click();
                    }
                    else if($('div.video-section-list.section-0 > div:nth-child(1)').length >0){  //合集末尾没有按钮，回到首个视频，不喜欢这个功能可以直接删掉这个else if
                        $('div.video-section-list.section-0 > div:nth-child(1)').click()
                    }
                    else if($('#multi_page > div.head-con').length >0){   //分P合集末尾没有按钮，回到首个视频，不喜欢这个功能可以直接删掉这个else if
                        $('#multi_page > div.cur-list > ul > li:nth-child(1) > a > div > div.link-content > span.part').click()
                    }
                }, 1000);
        })
    }
}

function initButton(){
    let buttonsDiv = $('<div>', {
        id:'my-next',
        css: {
            display: 'flex',
            flexDirection: 'row'
        }
    });

    let buttonGlobal = $('<button>', {
        id:'my-next-btn-G',
        text: '总',
        css: {
            backgroundColor: (globalAutoPlayNext?'#fb7299':'gray'),
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            border: '2px solid white'
        },
        click: function () {
            setGlobalPlayNext(!globalAutoPlayNext)
        }
    });
    let buttonCurrent = $('<button>', {
        id:'my-next-btn-C',
        text: '当',
        css: {
            backgroundColor: (currentPlayNext()?'#fb7299':'gray'),
            color: 'white',
            borderRadius: '8px',
            padding: '10px',
            border: '2px solid white',
            display:globalAutoPlayNext? 'none':'block'
        },
        click: function () {
            setCurrentPlayNext()
        }
    });
    buttonsDiv.append(buttonGlobal,buttonCurrent)

    //合集
    if(isChannel_1()){
        $('div.second-line_left').append(buttonsDiv);
    }
    if(isChannel_2()){
        $('div.video-pod.video-pod > div.video-pod__header > div.header-top > div.left').append(buttonsDiv);
    }
    //收藏夹
    if($("div.action-list-container").length >0){
        $('div.header-left').append(buttonsDiv);
    }
    if($('#multi_page > div.head-con').length >0){
        $('div.head-con').append(buttonsDiv);
    }
}

function setGlobalPlayNext(v){
    if(v){
        globalAutoPlayNext = true;
        GM_setValue('globalAutoPlayNext',true)
        document.querySelector('#my-next-btn-G').style.backgroundColor='#fb7299'
        $('#my-next-btn-C').hide()
    } else{
        globalAutoPlayNext = false;
        GM_setValue('globalAutoPlayNext',false)
        document.querySelector('#my-next-btn-G').style.backgroundColor='gray'
        $('#my-next-btn-C').show()
        document.querySelector('#my-next-btn-C').style.backgroundColor=currentPlayNext()?'#fb7299':'gray'
    }
}

function setCurrentPlayNext(){
    let currentUrl = getPlayListUrl();
    if(currentPlayNext()){
        delete autoPlayList[currentUrl];
    } else {
        autoPlayList[currentUrl] = true;
    }
    GM_setValue('autoPlayList',autoPlayList);
    document.querySelector('#my-next-btn-C').style.backgroundColor=currentPlayNext()?'#fb7299':'gray'
}

function afterListInit() {
  setTimeout(function () {
      //仅在符合`合集`或者`收藏夹`或者`分p合集`,并且没有找到我们的按钮的情况下初始化按钮
    if(getVideoListType() !== null && $('#my-next-btn').length ==0){
      initButton();
    } else {
      afterListInit();
    }
  },5000); // 5秒刷一次，免得列表更新按钮没了
}

(function() {
    'use strict';
    // Your code here...

    $(document).ready(function () {
        afterListInit();
        setNextPlay();
    });
})();
