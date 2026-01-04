// ==UserScript==
// @license MIT
// @name         stu.5zk
// @namespace    http://tampermonkey.net/
// @version      2024-11-09
// @description  zijishuawangke
// @author       allen
// @match        https://stu.5zk.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5zk.com.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/516571/stu5zk.user.js
// @updateURL https://update.greasyfork.org/scripts/516571/stu5zk.meta.js
// ==/UserScript==



(function() {
    'use strict';

     window.alert = function() {
        console.log('视频播放完了');
        // do somethin
       location.reload();
     };

     var target_a = null;  //找到第一个还没有看的视频【a不是红色的】
     var taeger_b = null;   //下一个视频

    function extractChapterNumber(str) {
        // 使用正则表达式匹配章节号
        const match = str.match(/\（第(\d+)章\d+\）/);
        console.log(match);
        if (match && match[1]) {
            return parseInt(match[1], 10); // 将找到的第一个数字组转换为整数
        }
        return null; // 如果没有找到匹配项，则返回null
    }


   
      
      function runNextUrl(){
        var uiParentContent = document.querySelectorAll('#side-overlay .simplebar-mask .simplebar-content .content-side')[0];

        if(uiParentContent == undefined){
            console.log('结束');
            return;
        }
        var liList = uiParentContent.querySelectorAll('li');
        var as = uiParentContent.getElementsByTagName('a');

        for (var i = 0; i < as.length; i++)
        {
            let nextA = (i+1 < as.length) ? as[i+1] : null;
            let currA = as[i];
            if (!currA.querySelector('span').getAttribute('style').includes('00A600') && nextA != null)
            {
                let currASpanText = currA.querySelector('span').innerText;
                let nextASpanText = nextA.querySelector('span').innerText;
                let currANumber = extractChapterNumber(currASpanText);
                let nextANumber = extractChapterNumber(nextASpanText);

                if(currANumber == nextANumber){
                    target_a = currA;
                    target_a.click();
                    break;
                }else{
                    target_a = nextA;
                    target_a.click();
                    break;
                }
            }
        }



      }
    //检查一下 当前所在的网址是不是已经被播放过了
    function checkCurrPageIsOld(){
        let status = document.querySelector('.si.si-control-play.text-danger').parentNode.querySelector('span').getAttribute('style').includes('00A600');
        return status;
    }

     function main(){

          let isNew = checkCurrPageIsOld();

          if(isNew){
             runNextUrl()
          }else{
              var video = document.getElementsByTagName('video')[0];
              if (video.currentTime < video.duration)    //在视频没有播放完的情况下若弹出框，进行点击。
              {
                  if (video.paused)
                  {
                      video.muted = true;
                      video.play(1);
                  }
              }
          }

      }

    // 粗暴延时5s开始运行函数
    setTimeout(main, 5000 )

    // Your code here...
})();