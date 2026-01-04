// ==UserScript==
// @name        西安工业大学播放结束提示
// @namespace   Violentmonkey Scripts
// @match       https://xatu.168wangxiao.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/5/29 14:34:33
// @downloadURL https://update.greasyfork.org/scripts/467362/%E8%A5%BF%E5%AE%89%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%92%AD%E6%94%BE%E7%BB%93%E6%9D%9F%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/467362/%E8%A5%BF%E5%AE%89%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%92%AD%E6%94%BE%E7%BB%93%E6%9D%9F%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
setInterval(() => {
  var elevideo = document.getElementById("tcvideoplayer_html5_api");
  elevideo.addEventListener('pause', function () { //暂停开始执行的函数
    console.log("暂停播放");
    $.ajax({ url: "https://api2.pushdeer.com/message/push?pushkey=PDU22927T8YK8WuOWg9qUGR2jvi4JXZssB5tNBReZ&text=西安工业大学播放完毕" });
  });
}, 2000);