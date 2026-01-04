// ==UserScript==
// @name        CSDN优化体验 
// @description 练习脚本
// @namespace   Violentmonkey Scripts

// @match      *://blog.csdn.net/*/article/details/*
// @match      *://*.blog.csdn.net/article/details/*
// @match      *://bbs.csdn.net/*
// @match      *://www.csdn.net/*

// @grant       none
// @version     1.1.1
// @author      amateur
// @description 2021/3/3 上午11:03:33
// @downloadURL https://update.greasyfork.org/scripts/422565/CSDN%E4%BC%98%E5%8C%96%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/422565/CSDN%E4%BC%98%E5%8C%96%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==


window.onload = function() {
  // 登录窗口  
  let login = document.querySelector('#passportbox');
  if(login) {
    login.setAttribute('display', "none");    
  }
  // 黑背景
  let mark = document.querySelector('.login-mark');
  if(mark) {
    mark.setAttribute('display', "none");
  }
    
  let codes = document.querySelectorAll('code');
  for(const code of codes ) {
    code.setAttribute('onclick', '');
    // console.log(code.innerText);
  }
}

