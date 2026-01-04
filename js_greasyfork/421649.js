// ==UserScript==
// @name         dアニメをマウスホイールで倍速設定したり早送りしたりするやつ
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  画面の左半分でマウスホイールしたら速度変化、右半分でマウスホイールしたら早送り/巻き戻し
// @author       kussy-tessy
// @match       https://anime.dmkt-sp.jp/animestore/sc_d_pc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421649/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%92%E3%83%9E%E3%82%A6%E3%82%B9%E3%83%9B%E3%82%A4%E3%83%BC%E3%83%AB%E3%81%A7%E5%80%8D%E9%80%9F%E8%A8%AD%E5%AE%9A%E3%81%97%E3%81%9F%E3%82%8A%E6%97%A9%E9%80%81%E3%82%8A%E3%81%97%E3%81%9F%E3%82%8A%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/421649/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%92%E3%83%9E%E3%82%A6%E3%82%B9%E3%83%9B%E3%82%A4%E3%83%BC%E3%83%AB%E3%81%A7%E5%80%8D%E9%80%9F%E8%A8%AD%E5%AE%9A%E3%81%97%E3%81%9F%E3%82%8A%E6%97%A9%E9%80%81%E3%82%8A%E3%81%97%E3%81%9F%E3%82%8A%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const overlayElement = document.createElement('div');
    overlayElement.style.cssText = 'position:absolute; left:0; right: 0; width: 20%; height: 10%; background: rgba(100, 100, 100, 0); z-index: 999999; color: white; ';
    document.querySelector('.backArea').appendChild(overlayElement);

    const formatSecond = (second) => {
        const secondInt = Math.floor(second);
        const min = Math.floor(secondInt / 60);
        const sec = ('0' + secondInt % 60).slice(-2);
        return `${min}:${sec}`;
    }

    const clearText = () => {
        overlayElement.innerHTML = '';
    }

    let timer;
    const updateOverlay = (text) =>{
        clearTimeout(timer);
        overlayElement.innerHTML = text;
        timer = setTimeout(clearText, 3000);
    }

    const video = document.querySelector('video');
    document.addEventListener('wheel', (e)=>{
        const width = window.innerWidth;
        const position = e.clientX;
        const delta = e.deltaY;
        if(position < width/2){ // 画面の左半分
            if(delta < 0){ // 上にホイール
                video.playbackRate += 0.05;
            } else { // 下にホイール
                video.playbackRate -= 0.05;
            }
            updateOverlay(`${video.playbackRate.toFixed(2)}倍速`);
        } else { // 画面の右半分
            if(delta < 0){ // 上にホイール
                video.currentTime += 30;
            } else {
                video.currentTime -= 30;
            }
            updateOverlay(formatSecond(video.currentTime));
        }
    });
})();