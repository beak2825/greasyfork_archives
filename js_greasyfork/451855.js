// ==UserScript==
// @name         传智Spark技术自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动播放传智播客课程视频
// @author       鸭脖
// @match        *://*.ityxb.com/preview/detail/*
// @grant        none
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/451855/%E4%BC%A0%E6%99%BASpark%E6%8A%80%E6%9C%AF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/451855/%E4%BC%A0%E6%99%BASpark%E6%8A%80%E6%9C%AF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("我开始加载了！");
    setInterval(function () {
        run();
    }, 3000);

    function run() {

        var directory_sum = document.getElementsByClassName("point-text-box").length;
//          console.log("总共：" + directory_sum + "个");
         var check = document.getElementsByClassName("el-button el-button--primary el-button--big").length;
            console.log("数字是：" + check);
        for (var i = 0; i < directory_sum; i++) {
//             console.log("我开始了");

            var Progress = document.getElementsByClassName("point-progress-box")[i].innerHTML;
//
            if (check != 1) {
//                 console.log("进度是：" + Progress);
                if (Progress == "100%" && check == 0) {
//                       console.log("播放下一个");
                    document.getElementsByClassName("point-text-box")[i + 1].click();
                    window.iii = i;
                } else {

                    //静音
                    document.getElementsByTagName("canvas")[6].click();
                    // console.log("静音模式");
                    //播放
                    document.getElementsByTagName("canvas")[0].click();
                    // console.log("播放模式");
                    //设置倍速  0-->2.5倍速  1-->2倍速  2-->1.5倍速
                    //设置默认  1.5倍速
                    document.getElementsByTagName("p")[2].click();
                    // console.log("倍速模式播放中");

                    //5倍速模式，使用需谨慎
                    // document.querySelector('video').playbackRate = 5

                }
            } else {
                console.log("开始习题");
                // document.getElementsByClassName("point-text-box")[i + 2].click();
                //获取题目
                var TiMu = document.getElementsByClassName("question-title-text")[0].innerHTML
                var LeiXing = document.getElementsByClassName("questions-type-title")[0].innerText;
                if (LeiXing == '单选题：') {

                     //默认选择第一项
                    document.getElementsByClassName("options-item-text")[0].click();
                    //获取button按钮个数
                   var button_sum= document.getElementsByTagName("button").length
                    //点击最后一个button按钮
                    document.getElementsByTagName("button")[button_sum-1].click();
                }else {
                    //默认全选
                    //获取选项总数
                    var options= document.getElementsByClassName("options-item-content").length
                    for (var j=0; j<options;j++){
                        document.getElementsByClassName("options-item-text")[j].click();
                    }
                    //点击最后一个button按钮
                    document.getElementsByTagName("button")[button_sum-1].click();
                }
            }

        }
    }

})();