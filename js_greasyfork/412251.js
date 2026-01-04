// ==UserScript==
// @name         山东交通运输专业技术人员专业课培训平台自动播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  狗子专属使用
// @author       lr
// @match        *://zjzyk.train.sdjtysedu.com*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412251/%E5%B1%B1%E4%B8%9C%E4%BA%A4%E9%80%9A%E8%BF%90%E8%BE%93%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E4%B8%93%E4%B8%9A%E8%AF%BE%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/412251/%E5%B1%B1%E4%B8%9C%E4%BA%A4%E9%80%9A%E8%BF%90%E8%BE%93%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E4%B8%93%E4%B8%9A%E8%AF%BE%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var doc = document.getElementsByClassName('clearfix');
        if (doc == undefined || doc== null) {
            return;
        }
    alert('请手动点击播放开始进入脚本控制！')
    setInterval(function () {
        var doc = document.getElementsByClassName('clearfix');
        if (doc == undefined || doc== null) {
            return;
        }
        console.log('进来了1')
        for (var i = 4; i < document.getElementsByClassName('clearfix').length; i++) {
            var progress = document.getElementsByClassName('clearfix')[i].lastElementChild.innerText;
            //如果视频结束，就点击下一节
            console.log(progress);
            console.log('i=' +i);
            if (progress != '100%' && progress != '' && progress != undefined) {
                if(document.getElementsByClassName('clearfix')[i].firstElementChild.firstElementChild.className.indexOf('glyphicon video-icon-margin glyphicon-play') > -1) {
                    console.log('播放中。。。')
                    return;
                }
                document.getElementsByClassName('clearfix')[i].click();
                return;
            }
        }
    }, 2000);
    // Your code here...
})();