// ==UserScript==
// @name         動畫瘋自動播放
// @namespace    https://itiscaleb.com
// @version      1.4
// @description  現在可以24小時孤獨搖滾了
// @authpr       ItisCaleb
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455142/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455142/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


var episodeList;
var currentEpisode;
var interval;
var time;

(function(){
    'use strict'
    let item = window.localStorage.getItem("play");
    let playEnabled = item==="true";
    styleInject();
    buttonInject(playEnabled);
    [episodeList,currentEpisode] = getEpisodes();
    time = Date.now();
    autoStart(playEnabled);
})()

function autoStart(enabled){
    if(!enabled) return;
    interval = setInterval(()=>{
        let adultCheck = document.getElementById("adult");
        if(adultCheck){
            adultCheck.click();
            clearInterval(interval);
            skipAd(enabled);
            nextEpisode(enabled);
        }
    },1000);
}
function skipAd(enabled){
    if(!enabled) return;
    let inter = setInterval(()=>{
        let skipButton = document.getElementById('adSkipButton');
        if(skipButton&&skipButton.classList.contains('enabled')){
            clearInterval(inter);
            skipButton.click();
        }
    });
}

function nextEpisode(enabled){
    if (!enabled) return;
    interval = setInterval(()=>{
        let episodeEnd = document.getElementsByClassName('stop')[0];
        if(!episodeEnd.classList.contains('vjs-hidden')){
            let nexted = window.localStorage.getItem("nexted");
            if(nexted==="true" && Date.now()-time<1000*60){
                let replay = document.getElementsByClassName('replay')[0]
                replay.children[0].click();
                window.localStorage.setItem("nexted",false);
            }else{
                let episodeTotal = episodeList.length;
                episodeList[currentEpisode%episodeTotal].children[0].click();
                window.localStorage.setItem("nexted",true);
            }
            
        }
    },1000);
}

function getEpisodes(){
    let episodeList = document.getElementsByClassName('season')[0].children[0].children;
    let current = 1;
    for(let i=0;i<episodeList.length;i++){
        if(episodeList[i].classList.contains('playing')) current=i+1;
    }
    return [episodeList,current];
}

function buttonInject(enabled){
    let section = document.getElementsByClassName('videoname')[0];
    let div = document.createElement('div');
    div.style="margin: 10px;width:20%";
    section.appendChild(div);
    div.innerHTML=`
    <label class="switch" style="float:left" >
        <input id="autoplay" type="checkbox" ${enabled?"checked":""}>
        <span class="slider"></span>
    </label>
    <span style="font-size:18px;float:right;margin-top:3.5px">自動播放</span>`;
    let autoplay = document.getElementById("autoplay");
    autoplay.addEventListener('click',()=>playButton(autoplay));
}
function playButton(box){
    window.localStorage.setItem('play',box.checked);
    if(!box.checked){
        clearInterval(interval);
    }else{
        let adultCheck = document.getElementById("adult");
        if(adultCheck) autoStart(box.checked);
        else nextEpisode(box.checked);
    }
}

function styleInject(){
    let style = document.createElement('style');
    style.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
      }
      
      .switch input { 
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 34px;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 2px;
        top: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
      }
      
      input:checked + .slider {
        background-color: #00b4d8;
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
    `;
    document.head.appendChild(style);
}