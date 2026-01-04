// ==UserScript==
// @name         b站视频播放加速
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提高b站视频播放速度上限
// @author       ElZhao
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437832/b%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/437832/b%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function hack() {
        for (let node of document.querySelectorAll('li.bilibili-player-video-btn-speed-menu-list')) {
            let value = node.getAttribute('data-value') * 2
            if (value) {
                node.setAttribute('data-value', value);
                node.textContent = node.getAttribute('data-value');
                node.setAttribute('style', 'color:rgb(255, 255, 255)')
            }
        }
        document.querySelector('li.fuckers').textContent = '复原'
        document.querySelector('li.fuckers').setAttribute('onclick', 'restore()')
    }

    function restore() {
        for (let node of document.querySelectorAll('li.bilibili-player-video-btn-speed-menu-list')) {
            let value = node.getAttribute('data-value') / 2
            if (value) {
                node.setAttribute('data-value', value);
                node.textContent = node.getAttribute('data-value');
                node.removeAttribute('style')
            }
        }
        document.querySelector('li.fuckers').textContent = '提速'
        document.querySelector('li.fuckers').setAttribute('onclick', 'hack()')
    }
    setTimeout(() => {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.text += hack.toString();
        script.text += restore.toString();
        document.body.appendChild(script);
        setInterval(() => {
            let node = document.querySelector('ul.bilibili-player-video-btn-speed-menu li.fuckers')
            if (node == null) {
                document.querySelector('ul.bilibili-player-video-btn-speed-menu').insertAdjacentHTML('beforeend', '<li class="bilibili-player-video-btn-speed-menu-list fuckers" onclick="hack()">提速</li>');
            }
        }, 1000)
    }, 2000);
})();