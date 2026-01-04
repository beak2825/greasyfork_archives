// ==UserScript==
// @name         ahfda
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除视频播放检测鼠标位置、视频可以倍速播放
// @author       You
// @match        https://www.ahfda.com/peradmin/courseDetail.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahfda.com
// @grant        none
// @license      MPL License
// @downloadURL https://update.greasyfork.org/scripts/484225/ahfda.user.js
// @updateURL https://update.greasyfork.org/scripts/484225/ahfda.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        window.onblur = null;
        document.querySelector('video').play();
        //document.querySelector('video').playbackRate = 2.0;
        window.onmousemove = null;
    }
})();