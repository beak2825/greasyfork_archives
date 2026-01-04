// ==UserScript==
// @name         【个人】半小时闹钟
// @namespace    eeztool
// @description  半小时响一次
// @version      0.0.2
// @author       旅行
// @match        *://*.vclock.com/*
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444708/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E5%8D%8A%E5%B0%8F%E6%97%B6%E9%97%B9%E9%92%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/444708/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E5%8D%8A%E5%B0%8F%E6%97%B6%E9%97%B9%E9%92%9F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(()=>{
    document.querySelectorAll("#lbl-time")[0].onclick = nextAlert
    document.querySelectorAll(".i-circle.text-danger")[0].onclick = nextAlert
  },0)
  function nextAlert() {
    let url = "https://vclock.com/#time="
    let time
    switch(String(new Date()).substring(19,20)){
      case "0":
      case "1":
      case "2":
        time = String(new Date()).substring(16,19)+"30"
        break
      case "3":
      case "4":
      case "5":
        time = String(Number(String(new Date()).substring(16,18))+101).substring(1,3)+":00"
    }
    url += time
    url += "&title=Alarm&enabled=1&sound=birds&loop=1"
    console.log(url)
    window.open(url, "_self");
  }
})();

