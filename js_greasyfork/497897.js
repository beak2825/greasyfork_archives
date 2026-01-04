// ==UserScript==
// @name         smartcourse hust edu tool
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动翻页
// @author       XLXZ
// @match        https://smartcourse.hust.edu.cn/pan-smartcourse/screen/*
// @match        https://smartcourse.hust.edu.cn/mooc-smartcourse/mycourse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497897/smartcourse%20hust%20edu%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/497897/smartcourse%20hust%20edu%20tool.meta.js
// ==/UserScript==

let scrollerID;
let paused = true;
let interval = 50;

function startScroll() {
  let id = setInterval(function () {
    //有一定概率不执行滚动
    if (Math.random() > 0.6) {
      return;
    }
    var speed = Math.random() * 20 + 2;
    window.scrollBy(0, speed);
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // end of page?
      stopScroll();
    }
  }, interval);
  return id;
}

function stopScroll() {
  clearInterval(scrollerID);
}
document.body.addEventListener('keypress', function (event) {
  if (event.which == 13 || event.keyCode == 13) {
    // 'Enter' key
    if (paused == true) {
      scrollerID = startScroll();
      paused = false;
    } else {
      stopScroll();
      paused = true;
    }
  }
}, true);