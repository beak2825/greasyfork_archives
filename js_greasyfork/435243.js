// ==UserScript==
// @name         阿里学习
// @namespace    https://xue.alibaba-inc.com/
// @version      0.1
// @description  video control hot key
// @author       You
// @match        https://xue.alibaba-inc.com/**/*
// @icon         https://www.google.com/s2/favicons?domain=alibaba-inc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435243/%E9%98%BF%E9%87%8C%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/435243/%E9%98%BF%E9%87%8C%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        var video = document.querySelectorAll('video')[0];
        if(e && e.code === 'ArrowRight'){

            video.currentTime = video.currentTime + 10;
        }
        if(e && e.code === 'ArrowLeft'){

            video.currentTime = video.currentTime - 10;
        }
    }
    // Your code here...
})();