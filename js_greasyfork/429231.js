// ==UserScript==
// @name        博思刷课
// @version      0.3
// @description  博思增加学习时间使用方法找个视频的课程挂着
// @author       lgldlk
// @match        http://*.iflysse.com/web/student/*
// @grant        none
// @namespace https://greasyfork.org/users/706935
// @downloadURL https://update.greasyfork.org/scripts/429231/%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/429231/%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==


(function () {
  function waitForNode(nodeSelector, callback) {
    let node = nodeSelector();
    if (node) {
      callback(node);
    } else {
      setTimeout(function () {
        waitForNode(nodeSelector, callback);
      }, 100);
    }
  }
  function debounce(func, wait) {
    let timer;
    return function () {
      let context = this;
      let args = arguments;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }
  const initRateBody = function (callBack) {
    waitForNode(
      () => document.getElementsByTagName('video')[0],
      (node) => {
        console.log('initRateBody');
        let oV = document.getElementsByTagName('video')[0];
        oV.addEventListener(
          'ended',
          () => {
            oV.currentTime = 0;
            oV.play();
          },
          false,
        );
      },
    );
  };
  setInterval(() => {
    document.querySelectorAll('.el-footer.footer .el-button--small')[1]?.click();
    (document.querySelector('video')||{}).currentTime = 99999999999;
  }, 100);
})();