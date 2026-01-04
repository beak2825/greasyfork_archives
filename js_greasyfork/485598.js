// ==UserScript==
// @name         B站列表随机播放 | bilibili | 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      v1.0.2
// @description     个人正在使用的B站音乐随机播放，按钮在视频列表上方，如发现bug，可录视频发邮箱至1914391446@qq.com
// @author       666
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485598/B%E7%AB%99%E5%88%97%E8%A1%A8%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%20%7C%20bilibili%20%7C%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/485598/B%E7%AB%99%E5%88%97%E8%A1%A8%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%20%7C%20bilibili%20%7C%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function() {
    const SET_TIMEOUT_TIME = 5000;
    let biliRandom = getLocalStorage();
    let videoList = [];
    setTimeout(function(){
        // 获取视频列表
        getVideoList();
        // 创建随机按钮
        createRandomButton();
        // 添加随机按钮样式
        addRandomStyle();
        let randomBtn = document.querySelector(".randomBtn");
        randomBtn && randomBtn.addEventListener('click',updateRandom(randomBtn));
        if(biliRandom) startRandom();
    },SET_TIMEOUT_TIME)
    function createRandomButton() {
        let headerElArr = ["#multi_page > div.head-con",".base-video-sections-v1 .video-sections-head ",".action-list-container .action-list-header"]
        let path = null;
        let headerLen = headerElArr.length;
        while(!path){
            if( headerLen < 0){
                console.log('随机按钮位置获取失败,请刷新重试');
                return;
            }
            path = document.querySelector(headerElArr[headerLen--]);
        }
        if(path){
            path.style = 'position:relative;';
            path.insertAdjacentHTML("afterbegin", `<div class="randomBtn ${ biliRandom ? 'startRandom' : '' }">随机</div>`);
        }
    }
    function updateRandom(randomBtn){
        return (event)=>{
            event.stopPropagation();
            // let randomBtn = randomBtn.querySelector('.randomBtn');
            if (randomBtn.classList.contains('startRandom')) {
                randomBtn.classList.remove('startRandom')
                setLoackStorage(0);
            } else {
                randomBtn.classList.add('startRandom');
                setLoackStorage(1);
                // 开始随机
                startRandom()
            }
        }
    }
    function startRandom(){
        const videoEl = document.querySelector("div.bpx-player-video-wrap > video");
        videoEl && videoEl.addEventListener("ended", (event) => {
            if(biliRandom){
                event.stopImmediatePropagation();
                playNext();
            }
        });
    }
    function playNext(){
        let random = Math.floor(Math.random()*videoList.length);
        videoList[random] && videoList[random].click();
       // console.log(`当前正在随机播放第${random}首`);
      //  console.log(videoList[random])
    }
    function addRandomStyle(){
        let styleText = `
      .randomBtn{
        position: absolute;
        top:0px;
        right:125px;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        background-color: #CCCCCC;
        font-size: 12px;
        color:#AF9999;
        z-index:9999;
        cursor: pointer;
        user-select: none;
      }
      .startRandom{
        background-color: #00AEEC;
        color:#fff;
      }
    `
        let styleEl = document.createElement('style');
        styleEl.innerHTML = styleText;
        document.head.append(styleEl);
    }
    function getVideoList(){
        let videoElArr = ["ul.list-box > li > a > div.clickitem",".base-video-sections-v1 .video-section-list .video-episode-card","#playlist-video-action-list .action-list-inner .action-list-item-wrap .action-list-item .title"]
        let elLen = videoElArr.length;
        while(videoList.length === 0){
            if( elLen < 0){
                console.log('获取视频列表失败,请刷新重试');
                return;
            }
            videoList = Array.from(document.querySelectorAll(videoElArr[elLen--]));
        }
       // console.log(videoList);
    }
    function setLoackStorage(num){
        localStorage.setItem('randomVideo666',num);
        biliRandom = num == 1;
    }
    function getLocalStorage(){
        let isRandom = localStorage.getItem('randomVideo666');// 1 开启随机 0 关闭随机
        return isRandom == 1;
    }
})();