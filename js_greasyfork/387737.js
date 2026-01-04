// ==UserScript==
// @name        游石-脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://admin.1451backend.com/*
// @match        http://*/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
//0.1 统计在线人数
// @downloadURL https://update.greasyfork.org/scripts/387737/%E6%B8%B8%E7%9F%B3-%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/387737/%E6%B8%B8%E7%9F%B3-%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log(123);
    window.setInterval(function () {
      $.post('/api/msg/notify/queryNotify',{},function(response){
          console.log(response.onlineNumber);
          //发送到纸飞机
          $.post('https://api.telegram.org/bot919554707:AAFBOjSx8pG8nhCi-f-t9eN2tapoq6S01Pk/sendMessage',{chat_id:'-271720212',text:'1451当前游戏在线人数：'+response.onlineNumber},function(){
              console.log('在线游戏人数已成功发送到纸飞机！！！');
          })
      })
    },60000*10);
})();