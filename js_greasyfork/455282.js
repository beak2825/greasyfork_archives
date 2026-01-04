// ==UserScript==
// @name         正中华专业科目
// @namespace    
// @version      1.1
// @description  视频自动播放代刷+V{lly6655}
// @author       You
// @match        https://*.ischinese.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455282/%E6%AD%A3%E4%B8%AD%E5%8D%8E%E4%B8%93%E4%B8%9A%E7%A7%91%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455282/%E6%AD%A3%E4%B8%AD%E5%8D%8E%E4%B8%93%E4%B8%9A%E7%A7%91%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
  let t0 = setInterval(() => {
    let hre = location.href;
    if (hre.includes("https://hn.ischinese.cn/learncenter/play")) {
      setTimeout(() => {
        if ($(".loading:visible").length != 0) {
          location.reload();
        }
      }, 20000);
      clearInterval(t0);
      setInterval(() => {
        try {
          let now = document.querySelector(".course-progress span:nth-child(3)").innerText;
          console.log(now);
          if (now == "100%") {
            location.href = "https://hn.ischinese.cn/learncenter/buycourse";
          }
        } catch (error) {}
      }, 5000);
    }
    if (hre == "https://hn.ischinese.cn/learncenter/buycourse") {
      document.querySelector(".cur span").click();
      setTimeout(() => {
        document.querySelector(".buyCourse_classStudy").click();
      }, 5000);
    }
  }, 8000);
})();
