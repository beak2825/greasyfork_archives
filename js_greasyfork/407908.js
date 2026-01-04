// ==UserScript==
// @name         网络画板自动展开页面
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动加载页面
// @author       wuyudi/shigma
// @match        https://www.netpad.net.cn/personalCenter.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407908/%E7%BD%91%E7%BB%9C%E7%94%BB%E6%9D%BF%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/407908/%E7%BD%91%E7%BB%9C%E7%94%BB%E6%9D%BF%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

// thanks to https://github.com/Shigma
// throttle 节流
// 使里面的函数两次调用的时间间隔不少于 1000ms
// 能避免 client block
// 那个 1000 可以调大，100 调小


(function () {
  const leaveHeight = 50;
  const waitTime = 1200;
  ("use strict");
  function throttle(delay, callback) {
    let timeoutID;
    let lastExec = 0;
    function wrapper() {
      const self = this;
      const elapsed = Number(new Date()) - lastExec;
      const args = arguments;
      function exec() {
        lastExec = Number(new Date());
        callback.apply(self, args);
      }
      clearTimeout(timeoutID);
      if (elapsed > delay) {
        exec();
      } else {
        timeoutID = setTimeout(exec, delay - elapsed);
      }
    }
    return wrapper;
  }
  window.onscroll = throttle(waitTime, (ev) => {
    const el = document.querySelector(".loadMore");
    if (!el) return;
    if (el.getBoundingClientRect().top <= innerHeight + leaveHeight) {
      document.querySelector(".loadMore").click();
    }
  });
})();
