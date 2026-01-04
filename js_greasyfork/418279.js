// ==UserScript==
// @name         91wii 自动签到
// @version      1.0.0
// @description  91wii 登录之后，自动签到。
// @author       hankaibo
// @match        *://www.91wii.com/*
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/418279/91wii%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/418279/91wii%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...

  var today = new Date().toLocaleDateString('zh-CN').replaceAll('/', '-');
  var isLogin = false;
  register();

  // 注册脚本菜单
  function register() {
    checkLogin();
    autoSignIn();
  }

  // 判断是否登陆
  function checkLogin() {
    var checkLogin = document.querySelector('#dcsignin_tips');
    if (checkLogin) {
      isLogin = true;
    }
  }


  // 自动签到
  function autoSignIn() {
    var isSignIn = document.querySelector('#dcsignin_tips').style.backgroundImage.includes('signin_yes.png')
    if (isLogin && !isSignIn) {
      // 签到
      document.querySelector('#dcsignin_tips').click();
      // 选择心情，填写内容，提交
      setTimeout(function() {
        var liDom=document.querySelector('.dcsignin_list li');
        if(liDom){
          liDom.click();
          document.querySelector('#content').value = '记上一笔，hold住我的快乐！';
          document.querySelector('#signform button[name="signpn"]').click();
          GM_setValue(today, true);
        }
      }, 1000);
    }
  }
})();
