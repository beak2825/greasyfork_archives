// ==UserScript==
// @name         爱奇艺广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  该插件原理是监听视频加载，默认会跳过时间少于 150s 的视频，有需要可以自己改，但是并不能完全消除，广告视频可能还是会播放1-2s；并且移除了暂停时的广告
// @author       You
// @match        https://www.iqiyi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqiyi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518080/%E7%88%B1%E5%A5%87%E8%89%BA%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/518080/%E7%88%B1%E5%A5%87%E8%89%BA%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
   'use strict';
    // 最小视频时长
    const MinVideoTime = 150
   const classContent = `
  #\\35 fcma2g3wzdcvv2smpk4d3h3vq > iqpdiv > iqpdiv.iqp-player > iqpdiv.iqp-player-videolayer {
width: 100% !important;
height: 100% !important;
left:0 !important;
top: 0 !important;
  }

  #\\35 fcma2g3wzdcvv2smpk4d3h3vq > iqpdiv > iqpdiv.iqp-player > iqpdiv.flash-max1 > iqpdiv.pause-max-video-mask {
   left:auto !important;
   top: auto !important;
  }

  #\\35 fcma2g3wzdcvv2smpk4d3h3vq > iqpdiv > iqpdiv.iqp-player > iqpdiv.flash-max1 > :not(.pause-max-video-mask) {
display: none;
  }
  `
  const styleDom = document.createElement('style')
  styleDom.innerText = classContent

   const advFlag = () => document.querySelector("#\\35 fcma2g3wzdcvv2smpk4d3h3vq > iqpdiv > iqpdiv.iqp-player > iqpdiv.iqp-player-videolayer > iqpdiv > iqpdiv.post-container > iqpdiv.mid-detail")
  const videoDom = () => document.querySelector("#\\35 fcma2g3wzdcvv2smpk4d3h3vq > iqpdiv > iqpdiv.iqp-player > iqpdiv.iqp-player-videolayer > iqpdiv > video")

  const callback = function (mutationsList, observer) {
   for (let mutation of mutationsList) {
     if (mutation.type === "childList") {
      //  console.log("A child node has been added or removed.");
     } else if (mutation.type === "attributes" && mutation.attributeName === 'src') {
         setTimeout(() => {

             const duration = videoDom().duration
            if(duration < 300) {
               videoDom().currentTime = duration
            }
         }, 300);
     }
   }
 };

    function checkVideo() {
      // setTimeout(() => {
       const duration = videoDom().duration
       console.log(duration)
        if(duration < MinVideoTime) {
           // videoDom().currentTime = duration
        }
       //}, 200)
    }

document.querySelector('head').appendChild(styleDom)
      const video = videoDom();
      checkVideo()
      video.addEventListener('canplaythrough', checkVideo)

  // Your code here...
  })();