// ==UserScript==
// @name         boxue
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  支持播学多才平台视频快进
// @author       You
// @match        *://*.duoxue.91yong.com/*
// @icon         https://www.google.com/s2/favicons?domain=duoxue.91yong.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431629/boxue.user.js
// @updateURL https://update.greasyfork.org/scripts/431629/boxue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //console.log(' 延迟一秒，设置')
    //console.log(document.getElementsByTagName('video')[0].duration)
    //setTimeout(()=>{document.getElementsByTagName('video')[0].play},1000)
    // 延迟一秒，设置
    //document.getElementsByTagName('video')[0].play()
    //console.log('自动播放')
    //setTimeout(()=>{
       // document.getElementsByTagName('video')[0].controls = true
        //document.getElementsByTagName('video')[0].currentTime= document.getElementsByTagName('video')[0].duration-1},1000)
      var test = `<button id='mybt'
        style="
          position: fixed;
          right: 10px;
          bottom: 160px;
          width: 61px;
          z-index: 200;
        "
      >
        跳过
      </button>`
      var div1 = document.createElement('div')
      div1.id = 'myc'
      div1.innerHTML=test
      //
      document.getElementsByTagName('body')[0].appendChild(div1)
      document.getElementById('mybt').onclick = function () {
        console.log('点击')
        document.getElementsByTagName('video')[0].currentTime =
          document.getElementsByTagName('video')[0].duration - 1
      }
})();