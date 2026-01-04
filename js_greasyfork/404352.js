// ==UserScript==
// @name         河南大学-自动下一讲
// @namespace    平平无奇的张四
// @version      2.0
// @description  河南大学
// @author       平平无奇的张四
// @match        *://henu.cjnep.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404352/%E6%B2%B3%E5%8D%97%E5%A4%A7%E5%AD%A6-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AE%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/404352/%E6%B2%B3%E5%8D%97%E5%A4%A7%E5%AD%A6-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AE%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(function () {

        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {

            //获取video播放窗口元素
            var current_video = document.getElementsByTagName('video')[i]
            //console.log(current_video)

            //静音
            if(current_video.volum !=0 ){
                current_video.volume = 0
                //console.log('关闭声音')
            }

            //如果视频末尾有弹窗习题，则自动点击跳过习题
            if(document.getElementById("quiz_wnd").style.display == "block"){
                  console.log('跳过习题')
                  document.getElementById("job_quizskip").click()
            }


            //视频播放结束后，模拟点击“下一课”
            if( document.getElementById("job_replay").style.display == "block"){

                    document.getElementById("job_nextvideo_btn").click()
                    console.log('下一节')
            }


        }
    }, 3000)//每隔3000毫秒执行一次
})();