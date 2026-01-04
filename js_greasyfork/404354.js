// ==UserScript==
// @name         电大中专-自动下一课
// @namespace    平平无奇的张四
// @version      1.0
// @description  中央广播电视中等专业学校-电大中专
// @author       平平无奇的张四
// @match        *://zzx.ouchn.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/404354/%E7%94%B5%E5%A4%A7%E4%B8%AD%E4%B8%93-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/404354/%E7%94%B5%E5%A4%A7%E4%B8%AD%E4%B8%93-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
//alert(1);中央广播电视中等专业学校
setInterval(function () {
   // alert(1);
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            //静音
           // alert(1);
            current_video.volume = 0
            //视频播放结束后，模拟点击“下一课”
            if(document.getElementsByClassName("finishwrp")){
                  //alert(1);
                document.getElementsByClassName("nextbtn btn")[0].click()
            }
        }
    }, 2000)
})();