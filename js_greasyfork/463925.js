// ==UserScript==
// @name         哔哩哔哩回到旧版界面
// @namespace    bilibili-cookie-fixer
// @version      1.0
// @description  回到那个已经消失的按钮的旧版界面
// @match        https://www.bilibili.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/463925/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/463925/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
  // 检测并设置cookie中的go_old_video的值为1
  if (document.cookie.indexOf("go_old_video") == -1) {
    document.cookie = "go_old_video=1; path=/; domain=.bilibili.com";
  } else if (document.cookie.indexOf("go_old_video=-1") != -1) {
    document.cookie = "go_old_video=1; path=/; domain=.bilibili.com";
  }

  // 检测并设置cookie中的i-wanna-go-back的值为1
  if (document.cookie.indexOf("i-wanna-go-back") == -1) {
    document.cookie = "i-wanna-go-back=1; path=/; domain=.bilibili.com";
  } else if (document.cookie.indexOf("i-wanna-go-back=-1") != -1) {
    document.cookie = "i-wanna-go-back=1; path=/; domain=.bilibili.com";
  }

  // 检测并设置cookie中的nostalgia_conf的值为1
  if (document.cookie.indexOf("nostalgia_conf") == -1) {
    document.cookie = "nostalgia_conf=1; path=/; domain=.bilibili.com";
  } else if (document.cookie.indexOf("nostalgia_conf=-1") != -1) {
    document.cookie = "nostalgia_conf=1; path=/; domain=.bilibili.com";
  }
})();
