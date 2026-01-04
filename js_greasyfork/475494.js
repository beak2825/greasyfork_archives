// ==UserScript==
// @name         广东省图书情报继续教育网络学习中心自动点击刷课
// @namespace    https://greasyfork.org/
// @description  广东省图书情报继续教育网络学习中心自动点击刷课脚本
// @version      0.13
// @author       Zehra_Is_MyGodness
// @match        http://jxjy.gdlink.net/Elearning.GDLink.Student//StudentCourse/CourseStudy_New?classId=*
// @grant        none
// @license      Min@X
// @downloadURL https://update.greasyfork.org/scripts/475494/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BE%E4%B9%A6%E6%83%85%E6%8A%A5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475494/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BE%E4%B9%A6%E6%83%85%E6%8A%A5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
     function checkButton() {
         var nextBtn = document.querySelector('a.layui-layer-btn0'); // 获取确认按钮
         if (nextBtn) { // 如果找到了则点击按钮
             nextBtn.click(); // 点击按钮
             console.log('尝试点击确定按钮')
         }
         else
         {
             stateCheck()
         }
     }


    function stateCheck(){
        var ddElements = document.getElementsByClassName('mp4-playing');
        if (ddElements.length > 0) {
            // 循环输出内容
            for (var i = 0; i < ddElements.length; i++) {
                //console.log(ddElements[i].children[1])
                //console.log(ddElements[i].children[2].textContent)

                var text = ddElements[i].children[2].textContent
                var parts = text.trim().split('/');
                var firstNumber = parseFloat(parts[0]);//获取正在播放的时长
                var secondNumber = parseFloat(parts[1]);//获取视频时长

                //console.log('目前学习了'+firstNumber)
                //console.log('全长为'+secondNumber)
                // 进行大小比较
                if (firstNumber >= secondNumber) {
                    console.log("第一个数字大于等于第二个数字，已经播放完成");
                    var parentElement = ddElements[i].parentElement; // 获取父级元素
                    var position = Array.from(parentElement.children).indexOf(ddElements[i]); // 获取在父级元素中的位置
                    var buttonNextClass=parentElement.children[position+1].children[1]
                    console.log(parentElement.children[position+1].children[0])
                    console.log(parentElement.children[position+1].children[1])
                    console.log(parentElement.children[position+1].children[2])
                    buttonNextClass.click()
                    console.log('已经开始下一个课程，课程名称为:'+parentElement.children[position+1].textContent.trim().split(' ')[0]);
                }
                else{
                     var video = document.querySelector('video');
                     // 检查播放状态
                     if(video && video.paused){
                         //console.log('视屏未播放完成，但是视频正在暂停状态');
                         video.play()
                     }
                     //console.log('不存在')
                }

            }
        }
    }


    setInterval(checkButton,1000)// 每隔1秒重新运行，判断按钮是否存在
})();
    // Your code here...