// ==UserScript==
// @name         中研企最后一版（也许）
// @namespace    http://tampermonkey.net/
// @description  The Last Dance of the Little Cow and Horse from Shenzhen Construction
// @author       obt
// @version      2.3
// @match        https://ent.toujianyun.com/lesson/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456084/%E4%B8%AD%E7%A0%94%E4%BC%81%E6%9C%80%E5%90%8E%E4%B8%80%E7%89%88%EF%BC%88%E4%B9%9F%E8%AE%B8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456084/%E4%B8%AD%E7%A0%94%E4%BC%81%E6%9C%80%E5%90%8E%E4%B8%80%E7%89%88%EF%BC%88%E4%B9%9F%E8%AE%B8%EF%BC%89.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    // 视频暂停检测
    var Continueplaying = setInterval(() => {
        if (document.getElementsByClassName('prism-big-play-btn')[0].style.display== 'block' && $('.current-time')[0].textContent!=$('.duration')[0].textContent) {
            console.log("视频已暂停，已自动点击播放");document.getElementsByTagName('video')[0].click();
        }
        // 播放下一节
        if ($('.btn.btn-blue')[0].textContent=='播放下一节'){
            $('.btn.btn-blue')[0].click();
        }else if($('.btn.btn-blue')[2].textContent == "继续学习"){
            $('.btn.btn-blue')[2].click();
        }
        // 题目弹窗
        if($('.pop-up-problem.pop_activeClass').length >0){
            $('.checkbox input')[0].click();
            $('.btn.btn-blue.J-save-answer.J-submit-answer')[0].click();
            $('.btn.btn-blue.J-submit-answer.btn-continue')[0].click();
        }
    }, 5000);
})();