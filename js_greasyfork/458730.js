// ==UserScript==
// @name         智云枢-倍速播放,暂停,全屏,下一集
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       duanjianhua666
// @match        https://online.zretc.net/course/student/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zretc.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458730/%E6%99%BA%E4%BA%91%E6%9E%A2-%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%2C%E6%9A%82%E5%81%9C%2C%E5%85%A8%E5%B1%8F%2C%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458730/%E6%99%BA%E4%BA%91%E6%9E%A2-%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%2C%E6%9A%82%E5%81%9C%2C%E5%85%A8%E5%B1%8F%2C%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==
(function() {
    'use strict';

    document.addEventListener("keydown", keydown);
    function keydown(event) {          // 传递传递参数event
        if (event.keyCode == 27) {     // “87”为按键W，可根据需要修改为其他
            console.log("D:切换到下一个视频");
            var a = document.getElementsByClassName('card-active')

            var flag = false
            for (var i in a) {
                let temp = a[i]
                if(flag){
                    temp.click()
                    flag = false;
                    break
                }
                if(temp.className.length>11){
                    flag = true
                }

            }
            // clickAutomatic(document.getElementsByClassName('active')[0].nextSibling)      // 按下后执行的代码
        }else if(event.keyCode ==  65){
            //a
            document.querySelector('video').playbackRate -= 0.2;
        }else if (event.keyCode == 83){
            //a
            document.querySelector('video').playbackRate = 1.5;

        }else if (event.keyCode == 68){
            document.querySelector('video').playbackRate = 2;
        }
        else if (event.keyCode ==70){
            document.querySelector('video').playbackRate +=0.2;
        }else if (event.keyCode == 18){

            document.querySelector('.el-switch__core').click();
        }else if (event.keyCode == 8){
            console.log('backspace down');
//            document.querySelector('video').click()
        }else if(event.keyCode == 13){
            console.log('click full screen');
            document.querySelector('.vjs-fullscreen-control').click();
        }else if(event.keyCode == 37){
            console.log('left down');
          document.querySelector('video').currentTime-=10
        }else if(event.keyCode == 39){
            console.log('right down');

            document.querySelector('video').currentTime+=10
        }else if (event.keyCode == 32){
            console.log('space down');
            document.querySelector('video').click()
        }

    }




    function randomRange(min, max) { // min最小值，max最大值
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function clickAutomatic(element) {
        // var _offset = $(element).offset();
        //         var _offset = {
        //             left:element.offsetLeft,
        //             right:element.offsetRight,
        //             width:element.offsetWidth,
        //             height:element.offsetHeight
        //         }
        //         var x = 0, y = 0;
        //         if (typeof _offset == "undefined") {
        //             return;
        //         }

        //         x = randomRange(_offset.left, (_offset.left + _offset.width));
        //         y = randomRange(_offset.top, (_offset.top + _offset.height));
        //         if (x <= 0 || y <= 0 || x >= window.outerWidth || y >= window.outerHeight) { return; }
        // document.elementFromPoint(x, y).click();
        // document.elementFromPoint().click();
        element.click();
    }
})();