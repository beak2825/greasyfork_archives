// ==UserScript==
// @name         boss-nba
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自动BOSS
// @author       haiger
// @match        *://hupu.cdn.ttnba.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414011/boss-nba.user.js
// @updateURL https://update.greasyfork.org/scripts/414011/boss-nba.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(() => {
    var e1 = document.getElementsByClassName("cardwar-pve-boss-challenge")[0];
    let minutes = new Date().getMinutes()
    let seconds = new Date().getSeconds()
    var btn = document.getElementsByClassName("btn")
    var e2
    var flag = false
    if (btn && btn.length > 0) {
        for (let i = 0; i < btn.length; i++) {
            if (btn[i].innerText == '查看战报 继续挑战') {
                flag = true
                e2 = document.getElementsByClassName("btn")[i].lastElementChild;
                angular.element(e2).triggerHandler('click');
                break;
            }
        }
    }
    console.log(minutes + ':' + seconds)
    if (minutes == 30 && seconds == 0) {
        var eback = document.getElementsByClassName("cardwar-pve-boss-back")[0];
        angular.element(eback).triggerHandler('click');
        console.log('backClick')
        let time1 = setTimeout(() => {
            var eboss = document.getElementsByClassName("cardwar-pvelist cardwar-pvelist-3")[0];
            angular.element(eboss).triggerHandler('click');
            clearTimeout(time1)
            console.log('bossClick')
        }, 2000);
        let time2 = setTimeout(() => {
            if (document.getElementsByClassName("cw-popup-restrain-btn")[0]) {
                var econfirm = document.getElementsByClassName("cw-popup-restrain-btn")[0];
                angular.element(econfirm).triggerHandler('click');
                clearTimeout(time2)
                console.log('confirmClick')
            }
        }, 4000);
    } else if (e1) {
        if (minutes == 30 && seconds < 10) {
        } else {
            angular.element(e1).triggerHandler('click');
        }
    } else if (flag) {
        angular.element(e2).triggerHandler('click');
    }
}, 1000);
// Your code here...
})();
