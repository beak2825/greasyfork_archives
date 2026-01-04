// ==UserScript==
// @name         慕课倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  调整超星慕课的播放速度
// @author       You
// @match        https://*.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413596/%E6%85%95%E8%AF%BE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/413596/%E6%85%95%E8%AF%BE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.$;
    var speed = `
    <div id="control-bar" style="position:fixed;top:10px;left:10px;font-size:14px;max-width:200px;">
        当前页面的第
        <input type="number" id="index-input" min="1" step="1" value="1" max="100">
        个视频
        <div style="border:1px solid black;padding:2px;">
            播放速度
            <input type="number" id="speed-input" min="0.5" max="16" step="0.1" value="1">
        </div>
        <button class="forward" value="1" style="font-weight:bold;font-size:16px;padding:5px;">> 快进1min</button>
        <button class="forward" value="3" style="font-weight:bold;font-size:16px;padding:5px;">>> 快进3min</button>
        <button id="forward-end" style="font-weight:bold;font-size:16px;padding:5px;">>>> 直接到最后1s</button>
        <code id="log"></code>
    </div>`;

    $('html').append(speed);

    const getVideoElement = ()=>{

        let videoIndex = $('#index-input').val() - 1;

        let firstIframe = document.getElementsByTagName('iframe')[0];
        let firstIframeDoc = (firstIframe.contentDocument) ? firstIframe.contentDocument : firstIframe.contentWindow.document;

        let secondIframe = firstIframeDoc.getElementsByTagName('iframe')[videoIndex];

        let secondIframeDoc = (secondIframe.contentDocument) ? secondIframe.contentDocument : secondIframe.contentWindow.document;

        return secondIframeDoc.getElementsByTagName('video')[0];
    };


    $('#speed-input').on('change', function(){
        let video = getVideoElement();
        video.playbackRate = this.value;
        video.play();
    });

    $('.forward').click(function(){
        let video = getVideoElement();
        video.currentTime += $(this).attr('value')*60;
        video.play();
    });

    $('#forward-end').click(function(){
        let video = getVideoElement();
        video.currentTime = video.duration - 1;
        video.play();
    });

})();