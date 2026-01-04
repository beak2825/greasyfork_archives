// ==UserScript==
// @license      pswmz
// @name         21tb
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  21tb 学习连续播放（下一节，下一步）
 
// @author       pswmz
// @match        *://*.21tb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21tb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442278/21tb.user.js
// @updateURL https://update.greasyfork.org/scripts/442278/21tb.meta.js
// ==/UserScript==

(function() {
    'use strict';
        function next11(){
            

//          var xyb = document.querySelector('.cl-go-link') //下一步
//            if(xyb != null){
//               xyb.click();
//               console.log('====================下一步 点击成功=======================');
//            }

            //let finishFlag = document.querySelector('.finish-tig finish-tig-item')

            var nextFlag = document.querySelector('.next-button') // 下一节
            if (nextFlag != null ){
                

               nextFlag.click();
               console.log('====================下一节 点击成功=======================');
            }




       
        }
        //document.querySelector('iframe').contentWindow.document.querySelectorAll('li.innercan.track-course-item>a')[0].click()

    setInterval(next11,6000)


})();