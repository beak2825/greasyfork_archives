// ==UserScript==
// @name         鱼派播放器增强
// @namespace    https://github.com/HereIsYui
// @version      1.0.0
// @description  鱼派播放器增强版！优化使用体验！
// @author       Yui
// @match        https://fishpi.cn/cr
// @icon         https://assets.yuimeta.com/music/favicon.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512830/%E9%B1%BC%E6%B4%BE%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/512830/%E9%B1%BC%E6%B4%BE%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle('#musicBox{bottom: -50px !important;height:50px !important;} #musicBox.show{bottom:0 !important;} .music-box{height:40px !important;} .music-controller{width:120px !important} .music-detail{height:40px !important}');
    let playEle =  document.querySelector('.music-box');
    let detailEle = document.querySelector('.music-detail');
    let controllerEle = document.querySelector('.music-box>.music-controller');
    let lastControllerEle = document.querySelectorAll('.music-controller');
    lastControllerEle = lastControllerEle[lastControllerEle.length-1]
    // 添加个播放按钮
    let playHTML = document.createElement('div');
    playHTML.className="music-play";
    playHTML.innerHTML = '<img class="music-play-icon" src="https://assets.yuimeta.com/music/circle_play.png" alt="">';
    playHTML.onclick = function(){ChatRoom.playSound.togglePlay()};
    controllerEle.insertBefore(playHTML,controllerEle.lastElementChild);
    // 添加个封面
    let coverHTML = document.createElement('div');
    coverHTML.className="music-img";
    coverHTML.innerHTML = '<img class="music-img-item" src="https://assets.yuimeta.com/music/cat.gif" alt="">';
    playEle.insertBefore(coverHTML,detailEle);
    // 添加音量控制
    let volumeHTML = document.createElement('div');
    volumeHTML.className="music-voice";
    volumeHTML.style="padding: 2px;box-sizing: border-box";
    volumeHTML.innerHTML = '<img class="music-voice-icon" src="https://assets.yuimeta.com/music/volume_3.png" alt=""><div class="music-voice-box"><input type="range" value="100" max="100" min="0" onchange="ChatRoom.playSound.changeVoice(this)"></div>'
    lastControllerEle.prepend(volumeHTML);
    // 覆盖原本的播放事件
    ChatRoom.playSound.init = function(){
        let radioEle = document.querySelector('#music-core-item');
        let playIcon = document.querySelector('.music-play-icon');
        let playBox = document.querySelector('.music-box');
        let currentEle = document.querySelector('.music-current');
        let durationEle = document.querySelector('.music-duration');
        let titleEle = document.querySelector('.music-title');
        let coverEle = document.querySelector('.music-img-item');
        this.ele = radioEle;
        radioEle.addEventListener('ended',()=>{
            // console.log('播放完成');
            this.playing = false;
            clearInterval(this.timer);
            playIcon.src = 'https://assets.yuimeta.com/music/circle_play.png';
            playBox.classList.remove('playing');
            this.autoNext();
        });
        radioEle.addEventListener('play',()=>{
            // console.log('播放');
            playIcon.src = 'https://assets.yuimeta.com/music/circle_pause.png';
            playBox.classList.add('playing');
            this.timer = setInterval(()=>{
                currentEle.innerHTML = this.secondsToTime(this.ele.currentTime);
            });
        });
        radioEle.addEventListener('pause',()=>{
            // console.log('暂停');
            clearInterval(this.timer);
            playIcon.src = 'https://assets.yuimeta.com/music/circle_play.png';
            playBox.classList.remove('playing');
        });
        radioEle.addEventListener('canplay',()=>{
            // console.log('加载完成');
            currentEle.innerHTML = this.secondsToTime(this.ele.currentTime);
            durationEle.innerHTML = this.secondsToTime(this.ele.duration);
            titleEle.innerHTML = this.list[this.index].title;
            let cover = this.list[this.index].cover;
            coverEle.src = cover === '' ? 'https://assets.yuimeta.com/music/cat.gif' : cover;
        });
    },
    ChatRoom.playSound.play = function(e){
        let music = e.parentElement.dataset;
        this.add(e,false);
        if(!music.source.startsWith('http://music.163.com/song')){
            music.source = "http://music.163.com/song/media/outer/url?id=" + music.source;
        }
        this.ele.src = music.source;
        this.playing = false;
        this.togglePlay();
        !this.isShow && this.show();
    }
    ChatRoom.playSound.playIndex = function(idx){
        if(!this.list[idx].source.startsWith('http://music.163.com/song')){
            this.list[idx].source = "http://music.163.com/song/media/outer/url?id=" + this.list[idx].source;
        }
        this.ele.src = this.list[idx].source;
        this.playing = false;
        this.index = idx;
        this.togglePlay();
    }
    ChatRoom.playSound.togglePlay = function(){
        this.playing = !this.playing;
        if(this.playing){
            this.ele.play();
        }else{
            this.ele.pause();
        }
    }
    ChatRoom.playSound.changeVoice = function(voice){
        // console.log(voice.value);
        let volume = voice.value;
        let volumeEle = document.querySelector('.music-voice-icon');
        if(volume > 80){
            volumeEle.src = 'https://assets.yuimeta.com/music/volume_3.png';
        }else if(volume > 30){
            volumeEle.src = 'https://assets.yuimeta.com/music/volume_2.png';
        }else if(volume > 0){
            volumeEle.src = 'https://assets.yuimeta.com/music/volume_1.png';
        }else{
            volumeEle.src = 'https://assets.yuimeta.com/music/volume_off.png';
        }
        this.ele.volume = volume / 100;
    }
    ChatRoom.playSound.init();
})();