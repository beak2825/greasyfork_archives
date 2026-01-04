// ==UserScript==
// @name        中建网络学院刷课防暂停
// @namespace   CSCEC
// @match       https://e-cscec.zhixueyun.com/#/study/course/*
// @grant       none
// @version     2.1
// @author      我爱小熊啊
// @description 2022/8/2 09:39:19
// @description 2.1版本，重新调整代码结构，便于理解阅读 2022-8-3 13:15:00
// @description 2.0版本，加上音视频自动静音
// @description 1.2版本，
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448773/%E4%B8%AD%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E9%98%B2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/448773/%E4%B8%AD%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E9%98%B2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

// 静音单个元素
function muteMe(elem) {
  elem.muted = true;
  // elem.pause();    // 可以使用 elem.pause() 与 elem.paly() 实现同样的播放暂停效果
}

// 将页面上所有视频、音频静音
function mutePage() {
  // document.querySelectorAll("video, audio").forEach( elem => muteMe(elem) );
  // 箭头函数只适用 ES6，改为普通的循环
  av = document.querySelectorAll("video, audio");
  for(var x in av){   // for……in 返回的是数组索引，for……of 返回的才是对象
    muteMe(av[x]);
    // alert('test');
  }
}
// var v = document.querySelectorAll('video')[0];
// v.muted = true;

setTimeout(function(){
  document.title = '刷课中……';

  // 静音页面
  mutePage();
  
  // 设置间隔定时器
  setInterval(function(){
      // 选中播放按钮
      var play = $('.vjs-play-control.vjs-playing');
      play.click();   // 暂停
      // document.title = '暂停成功';
      // var play = $('.vjs-play-control.vjs-paused');
      play.click();   // 播放
      a = $('#D206btn-ok');     // 如果弹出弹窗，则点击确定
      if (a) {
          a.click();
      }
      document.title = '刷课中……';
    // console.log('test');
  },60000);
  alert("防暂停脚本已运行，网页已静音");
}, 1500);