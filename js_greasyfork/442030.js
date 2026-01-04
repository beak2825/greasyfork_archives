// ==UserScript==
// @name         自定义倍数
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  添加b站自定义倍数功能
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442030/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442030/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const utils = {
        isContainOneElementClassNameIs(className) {
            let fsadt = document.getElementsByClassName(className);
            if (fsadt.length) {
                return true;
            } else {
                return false;
            }
        },
        setSpeedStory(speed) {
            localStorage.setItem('my_speed',speed);
        },
        getSpeed() {
            return localStorage.getItem('my_speed') || 2.0;
        }
    };
    // 不停的尝试
    let tryAndTryFns = [];
    function tryAndTry() {
        setInterval(() => {
            tryAndTryFns.forEach(f => f());
        },500);
    }
    let changeActive = speed => {
        let speedList = document.getElementsByClassName('bilibili-player-video-btn-speed-menu-list');
        let btn = speedList[0].parentElement.parentElement.parentElement.children[0];
        for (let i = 0;i < speedList.length;i++) {
            let _speed = speedList[i].innerHTML;
            if (speedList[i].classList.contains('bilibili-player-active')) {
                speedList[i].classList.remove('bilibili-player-active');
            }
            if (_speed === speed) {
                speedList[i].classList.add('bilibili-player-active');
            }
        }
        btn.innerHTML = speed;
        utils.setSpeedStory(speed);
    }
    function addOtherSpeed() {
        let speedList = document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0];
        if (speedList.getAttribute('set') === 'true') {
            return ;
        }
        speedList.setAttribute('set','true');
        let createSpeedLi = (speed,parentDom) => {
            let li25 = document.createElement('li');
            parentDom.appendChild(li25);
            li25.classList.add('my-added-speed');
            li25.setAttribute('data-value',speed);
            li25.innerHTML = `${speed} X`;
            li25.onclick = function () {
                let speed_ = li25.getAttribute('data-value');
                let v = document.getElementsByTagName('video');
                if (v.length) {
                    v = v[0];
                } else {
                    v = document.getElementsByTagName('bwp-video')[0];
                }
                v.playbackRate = parseFloat(speed_);
            }
            return li25;
        };
        createSpeedLi(2.5,speedList);
        createSpeedLi(3,speedList);
        createSpeedLi(0.5,speedList);
        new Array(...speedList.getElementsByTagName('li')).map(_=> {
            _.onclick = function() {
                let v = parseFloat(_.getAttribute('data-value'));
                utils.setSpeedStory(v);
            }
        });
        return ``
    }
    function fullScreenAndDoubleTime() {
        if (utils.isContainOneElementClassNameIs('ibas-fullScreenAndDoubleTime')) {
            return;
        }
        var d = document.createElement('div');
        d.classList.add('bpx-player-ctrl-btn');
        d.classList.add('bpx-player-ctrl-time');
        d.innerHTML += `<div class="bpx-player-ctrl-time-label" style="cursor: pointer;" speed="${utils.getSpeed()}">
                    <span class="bilibili-player-video-time-now">全屏+${utils.getSpeed()}倍</span>
                </div>`;
        addOtherSpeed();
        var control = document.getElementsByClassName('bpx-player-control-bottom-left')[0].append(d);
        d.children[0].onclick = function () {
            let speed = parseFloat(this.getAttribute('speed'));
            let speedList = document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].getElementsByTagName('li');
            for (let i = 0;i < speedList.length;i++) {
                if (parseFloat(speedList[i].getAttribute('data-value')) === speed) {
                    speedList[i].click();
                    break;
                }
            }
            document.getElementsByClassName('bpx-player-ctrl-web-enter')[0].click()
        };
        tryAndTryFns.pop();
    }
    let createStyle = () => {
        let style = document.createElement('style');
        style.innerHTML = `
.my-added-speed:hover {
    background-color: hsla(0,0%,100%,.1);
}
.my-added-speed {
    position: relative;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
}
`;
        document.head.appendChild(style);
    };
    setTimeout(() => {
        createStyle();
        tryAndTryFns.push(fullScreenAndDoubleTime);
        tryAndTry();
    },2000);
    // Your code here...
})();
