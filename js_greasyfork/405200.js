// ==UserScript==
// @name         coursera 布局优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  视频和提词器左右布局方便跳转切换
// @author       jnoodle
// @include      *://www.coursera.org/*
// @match        https://www.coursera.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405200/coursera%20%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405200/coursera%20%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = "jnoodle_coursera";
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
     .__coursera__container { max-width: 100% !important; }
     .__coursera__container .rc-VideoMiniPlayer { width: 50% !important; position: fixed !important; left: 10px !important; right: auto !important; bottom: auto !important; }
     .__coursera__container .rc-VideoMiniPlayer.mini .video-main-player-container { right: auto !important; bottom: auto !important; width: 50% !important; left: 10px !important;}
     .__coursera__container .rc-VideoHighlightingManager { width: 48% !important; float: right !important; }
    `);

    var checkExist = setInterval(function() {
        if (document.getElementsByClassName('rc-VideoItemWithHighlighting')[0]) {
            clearInterval(checkExist);

            setTimeout(function(){

                var container = document.getElementsByClassName('rc-VideoItemWithHighlighting')[0];

                console.log('jnoodle coursera')
                console.log(container)

                container.classList.add('__coursera__container');
            }, 2000)
        }
    }, 500);

    setTimeout(function(){
        clearInterval(checkExist);
    }, 20000)

})();