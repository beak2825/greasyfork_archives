// ==UserScript==
// @name         职陪云自动播放
// @namespace    None
// @version      1.0
// @description  职陪云视频播放完毕后自动播放下一个视频
// @author       SummerRain
// @match        *://px.class.com.cn/player/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/436893/%E8%81%8C%E9%99%AA%E4%BA%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436893/%E8%81%8C%E9%99%AA%E4%BA%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function () {
        let iframe_window = document.getElementsByTagName('iframe');
        let total_time = iframe_window[0].contentWindow.document.getElementsByClassName('duration')[0].innerHTML;
        let cur_time = iframe_window[0].contentWindow.document.getElementsByClassName('current-time')[0].innerHTML;
        if ((total_time !== '00:00') && (cur_time === '00:00')) {
            document.getElementById('btn_submit').click();
            setTimeout(function () {
                document.getElementById('d_sub_confirm_my').click();
                document.getElementById('jhxNext').click();
            }, 2000)
        }
    }, 10000)
})();
