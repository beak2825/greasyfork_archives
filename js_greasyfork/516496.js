// ==UserScript==
// @name         重庆文理自学考试视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  视频自动静音播放（暂停后也会继续播放）
// @author       GongCJ
// @match        https://wlxy.xuexixitong.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/516496/%E9%87%8D%E5%BA%86%E6%96%87%E7%90%86%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/516496/%E9%87%8D%E5%BA%86%E6%96%87%E7%90%86%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    //每一秒检查
    setInterval(function () {
        var _vid = $("#videoDomId_html5_api")[0];
        // 设置静音
        _vid.volume = 0;
        //判断是否播放完毕
        if(_vid.currentTime>=_vid.duration){
            console.log('播放完毕自动播放下一个视频');
            setTimeout(()=>{
                $("button.el-button.btn.el-button--primary")[1].click()
            },500)
            // $("div.item.active").next().click()
        }else if(_vid.paused){
            //未播放完毕时，检查是否暂停，暂停了继续播放
            console.log('暂停了，自动播放');
            _vid.playbackRate = 1;
            _vid.play();
        }
    }, 1000);
})();