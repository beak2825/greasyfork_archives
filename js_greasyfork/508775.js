// ==UserScript==
// @name         B站课程剩余时间 By Heyl
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  计算B站当前页面播放课程剩余时间
// @author       yongli.he
// @license      GPL-3.0 License
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/508775/B%E7%AB%99%E8%AF%BE%E7%A8%8B%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%20By%20Heyl.user.js
// @updateURL https://update.greasyfork.org/scripts/508775/B%E7%AB%99%E8%AF%BE%E7%A8%8B%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%20By%20Heyl.meta.js
// ==/UserScript==

(function() {
    console.log('hello ')
    var listEl;
    var findType = '';
    var cards;
    var li;
    var btn;
    function calculateTotalMinutes(arr){
        var secondsArr = arr.map(v => {
            var timeArr = v.split(':');
            return parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
        });
        var totalSeconds = 0;
        secondsArr.forEach(v => {
            totalSeconds += v;
        });
        var totalMinutes = totalSeconds / 60;
        // console.log(secondsArr)
        // console.log('总秒钟数：', totalSeconds.toFixed(2), '秒钟')
        // console.log('总分钟数：', totalMinutes.toFixed(2), '分钟')
        return (totalSeconds / 60).toFixed(2);
    }
    function showTime(fn){
        var arr = fn();
        if(btn && arr && arr.length){
            var minutes = calculateTotalMinutes(arr);
            var hours = parseInt(minutes / 60);
            var minuts = parseInt(minutes % 60);
            var hourText = hours > 0 ? `${hours}小时` : '';
            var minuteText = minuts > 0 ? `${minuts}分钟` : '';
            var text = `${hourText}${minuteText}`;
            btn.innerText = '剩余时间：' + text;
            setTimeout(function(){
                btn.innerText = '剩余时间';
            }, 3000);
            // console.log(text)
        }
    }

    function showByCard(){
        var arr = [];
        var finded = false;
        cards.forEach(card => {
            var hasView = card.querySelector('.video-episode-card__info.video-episode-card__info-playing');
            if(hasView){
                finded = true;
            }
            if(finded){
                var duration = card.querySelector('.video-episode-card__info-duration').innerText;
                // console.log(duration);
                arr.push(duration);
            }
        });
        return arr;
    }
    function showByUl(){
        var arr = [];
        var finded = false;
        li.forEach(v => {
            var hasView = v.classList.contains('on');
            if(hasView){
                finded = true;
            }
            if(finded){
                var duration = v.querySelector('.duration').innerText;
                // console.log(duration);
                arr.push(duration);
            }
        });
        return arr;
    }
    function showBtn(){
        var btnWrap = document.querySelector('.video-info-detail-list.video-info-detail-content');
        btn = document.createElement('button');
        btn.style.border = '1px solid #00cd00';
        btn.style.fontSize = '12px';
        btn.style.backgroundColor = '#deffde';
        btn.style.padding = '0 5px';
        btn.style.marginLeft = '1em';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '3px';
        btn.innerText = '剩余时间';
        btnWrap.append(btn);
        listEl = document.querySelector('.video-sections-content-list');
        if(listEl){
            findType = 'card';
            cards = listEl.querySelectorAll('.video-episode-card');
            btn.onclick = function(){
                showTime(showByCard);
            }
            return;
        }
        listEl = document.querySelector('.list-box');
        if(listEl){
            findType = 'ul';
            li = listEl.querySelectorAll('li');
            btn.onclick = function(){
                showTime(showByUl);
            }
        }
    }
    setTimeout(showBtn, 6000)
})();