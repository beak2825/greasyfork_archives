// ==UserScript==
// @license MIT
// @name         咨询师课程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  咨询师课程autoplay
// @author       lemondqs
// @match        https://m.qlchat.com/wechat/page/topic-simple-video?**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlchat.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/481433/%E5%92%A8%E8%AF%A2%E5%B8%88%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481433/%E5%92%A8%E8%AF%A2%E5%B8%88%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(function(){
    window.setInterval(function() {

        if(!$('.play-btn').hasClass('playing')) {
            $('.play-btn').click()
        }
    }, 10*1000)
})
    // Your code here...
})();