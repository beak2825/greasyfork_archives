// ==UserScript==
// @license MIT
// @name         video speed controller
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  video controller
// @author       You
// @match        https://www.tampermonkey.net/index.php?version=4.18.0&ext=dhdg&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @match      https://tech.bytedance.net/*
// @match      https://bytedance.feishu.cn/*

// @downloadURL https://update.greasyfork.org/scripts/465568/video%20speed%20controller.user.js
// @updateURL https://update.greasyfork.org/scripts/465568/video%20speed%20controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('video speed controller initialed')
    window.addEventListener("keydown", function(event) {
        if (event.keyCode == 187) {
            console.log('+');
            document.querySelector('video').playbackRate += 0.5;
            document.querySelector('video').play;
        }
        else if(event.keyCode == 189) {
            console.log('-');
            document.querySelector('video').playbackRate -= 0.5;
            document.querySelector('video').play;
        }
        else if(event.keyCode == 48) {
            console.log('0');
            document.querySelector('video').playbackRate = 1;
            document.querySelector('video').play;
        }
    },true);
})();