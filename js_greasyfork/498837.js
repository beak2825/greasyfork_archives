// ==UserScript==
// @name         抖音直播优化
// @description  自动最高画质,网页全屏,关闭弹幕,打开声音
// @author       zzw6776
// @version      1.3
// @match        *://live.douyin.com/*
// @match        *://*.douyin.com/root/live/*
// @match        *://*.douyin.com/*/live/*
// @license      MIT
// @namespace https://greasyfork.org/users/168189
// @downloadURL https://update.greasyfork.org/scripts/498837/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/498837/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
    setTimeout(() => {

        document.getElementsByClassName('NsCkThfl')[0].click()
        if(document.getElementsByClassName('xgplayer-volume')[0].getAttribute("data-state")=='mute'){
            document.getElementsByClassName('xgplayer-icon')[2].click()
        }
        //
        simulateKeyPress('b')
        var ua = navigator.userAgent;
        console.log(ua);
        if(ua.indexOf('Windows')<0){
            document.getElementsByClassName('psKR9RS0')[1].getElementsByTagName('div')[3].click();
        }

    },3000)
    function simulateKeyPress(character) {
        var evt = new KeyboardEvent('keydown', {
            key: character,
            code: 'Key' + character.toUpperCase(),
            shiftKey: false,
            ctrlKey: false,
            metaKey: false
        });
        console.log(evt);
        document.dispatchEvent(evt);
    }

})();