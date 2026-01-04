// ==UserScript==
// @name         speed
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  video speed rate 16
// @author       海贼一王路飞
// @match        https://lms.ouchn.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444229/speed.user.js
// @updateURL https://update.greasyfork.org/scripts/444229/speed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = setInterval(function(){
        var dom = document.querySelector('video');
        if(dom){
            dom.playbackRate = 16;
            console.log(timer, 'timer')
            clearInterval(timer)
            dom = null;
        }
    },1000)
})();