// ==UserScript==
// @name         安徽继续教育自动刷课
// @namespace    使用说明网址见作者
// @version      1.0
// @description  安徽继续教育 自动刷课，自动提交
// @author       xxmz
// @match        *://*.ahjxjy.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434098/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/434098/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var confirm = function () {
        return true;
    };
    window.confirm = function () {
        return true;
    };
    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i) {
            var current_video = document.getElementsByTagName('video')[i]
            current_video.volume = 0
            current_video.playbackRate = 16.0
            if (current_video.ended) {
                if (document.getElementsByClassName('btn btn-green')) {
                    document.getElementsByClassName('btn btn-green')[0].click()
                }
            }
        }
        //判断当前是作业
        if (document.getElementsByClassName('e-save-b btn_save').length > 0) {
            var currentLi
            if (document.getElementsByClassName('e-save-b btn_save')[0].innerText == '提交作业') {
                for (let i = 0; i < document.getElementsByTagName('li').length; i) {
                    if (document.getElementsByTagName('li')[i].className == 'current') {
                        currentLi = i
                    }
                }
                document.getElementsByClassName('sectionlist btn_dropdown')[0].click();
                document.getElementsByTagName('li')[currentLi].getElementsByTagName('a')[0].click();
                document.getElementsByTagName('li')[currentLi].getElementsByTagName('a')[0].click();

            }
        }
    }, 2000)
})();