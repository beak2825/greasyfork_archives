// ==UserScript==
// @name         2021广东教师公需课 自动跳下一节
// @version      1.0
// @description  每一节播放完毕后自动跳到下一节
// @match        https://jsglpt.gdedu.gov.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/168620
// @downloadURL https://update.greasyfork.org/scripts/428100/2021%E5%B9%BF%E4%B8%9C%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/428100/2021%E5%B9%BF%E4%B8%9C%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==
 
(function () {
  var hre = location.href;
  if (hre.includes("https://jsglpt.gdedu.gov.cn/ncts")) {
    loop();
  }
 
  function loop() {
    let now;
    let need;
    let i0 = setInterval(() => {
      if ($('h1:contains("502 Bad Gateway")').length != 0) {
        location.href = location.href;
      } else {
        console.log("loop");
        if (document.querySelector(".tip")) {
          document.querySelector(".btn.next.crt").click();
        } else {
          need = parseInt(document.querySelector(".g-study-prompt span ").innerText);
          now = parseInt(document.querySelector("#viewTimeTxt").innerText);
          if (now >= need) {
            document.querySelector(".btn.next.crt").click();
          }
        }
      }
    }, 3 * 1000);
  }
})();