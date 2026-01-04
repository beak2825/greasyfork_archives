// ==UserScript==
// @name         取消西瓜影视自动播放下一集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Cesaryuan
// @match        https://www.ixigua.com/*
// @icon         https://www.google.com/s2/favicons?domain=ixigua.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433880/%E5%8F%96%E6%B6%88%E8%A5%BF%E7%93%9C%E5%BD%B1%E8%A7%86%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/433880/%E5%8F%96%E6%B6%88%E8%A5%BF%E7%93%9C%E5%BD%B1%E8%A7%86%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
var timer = setInterval(() => {
    let temp1 = document.querySelector('#player_default video');
    if(temp1)
    {
        clearInterval(timer);
        setInterval(() => {
            if(!temp1.paused && temp1.duration > 2 && temp1.currentTime > temp1.duration - 2){
                var msg = temp1.currentTime + ':' + temp1.duration;
                // window.alert(msg);
                // console.error(msg);
                // document.body.innerText = msg;
                temp1.pause();
            }
        }, 1000)
    }
}, 1000)


    // Your code here...
})();