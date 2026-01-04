// ==UserScript==
// @name         极客时间视频自动切换高清并播放
// @namespace    shjanken
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://time.geekbang.org/course/detail/77-*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/367977/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E9%AB%98%E6%B8%85%E5%B9%B6%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/367977/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E9%AB%98%E6%B8%85%E5%B9%B6%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('.dplayer-quality-item').ready(function(){
            setTimeout(function(){
                $('.dplayer-quality-item')[1].click();
            },2000);
        });
    });
})();