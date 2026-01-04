// ==UserScript==
// @name         九酷音乐采集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  九酷音乐采集脚本
// @author       JohnnyXie
// @match        http://www.9ku.com/play/*.htm
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/415723/%E4%B9%9D%E9%85%B7%E9%9F%B3%E4%B9%90%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/415723/%E4%B9%9D%E9%85%B7%E9%9F%B3%E4%B9%90%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function _auto_check() {
        setTimeout(function () {
            let music_src = $('audio').attr('src');
            let music_title = $('.playingTit h1').text();
            let music_author = $('.playingTit h2 a').text();
            if ($('.jp-current-time').text() != '00:00' && music_src) {
                let output_title = music_title + ' - ' + music_author + '.mp3';
                // GM_download(music_src, output_title);
            } else {
                console.log('自动重试中...');
                _auto_check();
            }
        }, 200);
    }

    _auto_check();
})();