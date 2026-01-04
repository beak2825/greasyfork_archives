// ==UserScript==
// @name         卡夫卡
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/450679/%E5%8D%A1%E5%A4%AB%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/450679/%E5%8D%A1%E5%A4%AB%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let btn = document.createElement('button');
    btn.textContent = '卡夫卡';
    btn.style.background = 'green';
    btn.style.borderRadius = '5px';
    btn.style.padding = '5px';
    btn.style.color = 'white';
    btn.style.zIndex = '9999999999';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.left = '10px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
    btn.addEventListener('click',()=>{
        let url = location.href;
        let container = document.getElementById('player-container');
        let player = document.getElementById('player');
        player.remove();
        let myIframe = document.createElement('iframe');
        myIframe.src = 'https://jx.bozrc.com:4433/player/?url=' + url;
        myIframe.setAttribute('allowfullscreen', true);
        myIframe.style.width = '100%';
        myIframe.style.height = '100%';
        container.appendChild(myIframe)

    })
})();