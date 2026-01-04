// ==UserScript==
// @name         vpahw auto
// @namespace    https://space.bilibili.com/434334701
// @version      1900-01-13
// @description  none
// @author       https://space.bilibili.com/434334701
// @match        https://vpahw.xjtu.edu.cn/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509931/vpahw%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/509931/vpahw%20auto.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    Function.prototype.constructor = function(){};

    let flag = true;
    let p = false;
    setInterval(() => {
        p = document.querySelector("video");
        if (p) {
            if(p.paused && p.currentTime < p.duration - 10) {p.play();}
            if (p.currentTime < p.duration - 10) { flag=true;}

            if (p.currentTime > p.duration - 3 && flag) { //nxt video
                flag = false;
                setTimeout(() => {
                    let list = document.querySelector(".list-none").childNodes;
                    let idx = 0;
                    for (; idx < list.length; idx++) {
                        const e = list[idx];
                        if (e.innerText.split("\n")[1] === document.querySelector(".text-lg").childNodes[1].innerText) { break; }
                    }
                    list[idx+1].click();
                }, 5000);
            }
        }
    }, 200)

})();