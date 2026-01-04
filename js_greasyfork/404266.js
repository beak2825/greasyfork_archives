// ==UserScript==
// @name         Bilibili封面下载
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       tgxh
// @match        *://www.bilibili.com/video/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/404266/Bilibili%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/404266/Bilibili%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timer;
    function poll(callback) {
        clearInterval(timer);
        timer = setInterval(() => {
            const div = document.querySelector('#bilibiliPlayer .bilibili-player-video-btn-send.bui.bui-button.bui-button-blue');
            if (div) {
                clearInterval(timer);
                callback(div);
            }
        }, 500)
    }

    function addBtn() {
        console.log('add btn')
        poll(div => {
            const img = document.querySelector('meta[itemprop="image"]');
            const src = img && img.content;
            if (src) {
                const html = `<a class="bilibili-player-video-btn-send bui bui-button bui-button-blue" style="margin-left: 1px;" href=${src} target="_blank">封面</a>`;
                div.insertAdjacentHTML('afterend', html);
                const bar = document.querySelector('.bilibili-player-video-sendbar');
                if (bar) bar.style.paddingRight = '0';
            }
        })
    }

    (function(history){
        const pushState = history.pushState;
        history.pushState = function() {
            addBtn();
            return pushState.apply(history, arguments);
        };
    })(window.history);

    addBtn();
})();