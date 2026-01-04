// ==UserScript==
// @name         FE-Interview docs Crack
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       dsqh
// @include    *://*.poetries.top/*
// @include    *://poetries1.gitee.io/*
// @include    *://interview.poetries.top/*

// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420484/FE-Interview%20docs%20Crack.user.js
// @updateURL https://update.greasyfork.org/scripts/420484/FE-Interview%20docs%20Crack.meta.js
// ==/UserScript==

(function () {
  "use strict";
  
  setOurCookie('_local',300);
  setOurCookie('_t',300);
  console.log(document.cookie);

  const time1 = new Date().valueOf();
  localStorage.setItem("__login_time__", "TOKEN_" + time1);

  function setOurCookie(name,time) {
    var our_cookie_name = name;
    var Days = time; // 时间长度
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = our_cookie_name + "=true;expires=" + exp.toGMTString() + ";path=/";
    
  }
  // Your code here...
})();
