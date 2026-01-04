// ==UserScript==
// @name         屏蔽抖音小黄车
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  用一个脚本来，屏蔽抖音小黄车。本脚本毫无技术含量，单纯是为了减少刷新网页时的重复操作。
// @author       wamess
// @match        *://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495050/%E5%B1%8F%E8%94%BD%E6%8A%96%E9%9F%B3%E5%B0%8F%E9%BB%84%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/495050/%E5%B1%8F%E8%94%BD%E6%8A%96%E9%9F%B3%E5%B0%8F%E9%BB%84%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', setTimeout(function() {
        let yellowCart = document.getElementById('__living_frame_right_panel_id');
        if (typeof(yellowCart) != "undefined") {
            console.log('yellow cart founded');
            yellowCart.parentNode.removeChild(yellowCart);
        } else {
            console.log('yellow cart not found');
        }

        let player = document.querySelector('div[data-e2e="basicPlayer"]');
        if (typeof(player) != "undefined") {
            console.log('player founded');
            // console.log(player.parentNode.attributes);
            player.parentNode.setAttribute('style', '');
        } else {
            console.log('player not found');
        }
    }, 3000))
})();