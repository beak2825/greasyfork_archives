// ==UserScript==
// @name         中移网大倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  中移网大倍速播放!
// @author       yuzibao
// @match        https://wangda.chinamobile.com/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456672/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/456672/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(() => {

        $("body").append(`
        <div id='video_set' style="position:fixed;right:10px;top:10px;z-index:9999;background:#dedede">
            <input id="setPlay"  type="number" placeholder="请输入倍率" style="padding:10px 0 10px 14px;border:none; border-radius:48px;">
        </div>
        `)

        $(document).on('change', '#video_set #setPlay', function () {
            console.log(this.value);
            if (this.value <= 4) {
                document.querySelector("video").playbackRate = this.value;

            }
            else {
                alert("建议最大为4倍速")
            }
        })
    })
    // Your code here...
})();