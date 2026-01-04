// ==UserScript==
// @name 青龙自动登入脚本
// @namespace http://tampermonkey
// @version 1.14
// @description 自动填写用户名和密码并登入网页
// @xxxc137
// @match http://ql.xxxc137.top/login*
// @grant none
// @license xxxc137
// @downloadURL https://update.greasyfork.org/scripts/475650/%E9%9D%92%E9%BE%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%85%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475650/%E9%9D%92%E9%BE%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%85%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 设置用户名和密码
  var user = 'xxxc137';
  var pwd = 'xxx2030585764';

  window.addEventListener("load", function(event) {
      console.log(document.querySelector("#username"));
      setTimeout(function(){//2s后再进行登录
          if(document.querySelector("#username")==null){
//没有找到表示登录了,不再执行后续代码
              return;
          }
        //未登录,执行登录代码
          document.querySelector('#username').value='user';
          document.querySelector('#password').value='pwd';
          document.querySelector('#root > div > div.main___sAFzH > form > div.ant-row > button').click();
      },2000);
  });
})();