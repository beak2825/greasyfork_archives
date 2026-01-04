// ==UserScript==
// @name         简书去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除网页版简书在阅读时的广告弹窗
// @author        wkstudy
// @match        https://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465108/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/465108/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**
    window.onload = function() {
        var id = setInterval(function() {

            var leftad = document.getElementById('duilian002') // 左边广告
            var rightad = document.getElementById('aaabbbc') // 右边广告
            var btmad = document.getElementById('close1'); // 右边底部广告1
            var note =document.getElementById('note'); // 右边底部广告2


            if(	leftad || rightad || btmad || note) {
                leftad && leftad.parentNode.parentNode.remove();
                rightad && rightad.parentNode.parentNode.remove();
                btmad && btmad.parentNode.remove();
                note && note.remove()
            } else {
                console.log('success remove ads')
                clearInterval(id)
            }

        }, 500)
        };
        */
    window.onload = function() {

        var leftad = document.getElementById('duilian002') // 左边广告
        var rightad = document.getElementById('aaabbbc') // 右边广告
        var btmad = document.getElementById('close1'); // 右边底部广告1
        var note =document.getElementById('note'); // 右边底部广告2

        leftad && leftad.parentNode.parentNode.remove();
        rightad && rightad.parentNode.parentNode.remove();
        btmad && btmad.parentNode.remove();
        note && note.remove()

    }

    })();