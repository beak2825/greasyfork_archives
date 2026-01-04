// ==UserScript==
// @icon            http://www.hebyunedu.com/images/hbdd_browser_logo.png
// @name            公需科目助手
// @namespace       luyeah521@gmail.com
// @author          killadm
// @description     河北省公需科目继续教育视频学习取消15分钟自动暂停，考试允许选择复制。
// @match           http://www.hebyunedu.com/lms/*
// @version         0.1.0
// @grant           GM_getValue
// @grant           GM_setValue
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/37862/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/37862/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  //禁止自动暂停
  alertTime = 60 * 100000;
  //考试允许复制
  document.body.onselectstart = 'return true';
  document.body.oncontextmenu = 'return true';
  //跳过检测，允许多开
  checker = null;
  setInterval(function() {
    //暂停计时器清零
    pauseInterval = 0;
    if ( totalTime == 0 || stoped ) {
      //存在下一章，跳转
      if ($('#nextSectionLink').attr("src") !== null && $('#nextSectionLink').attr("src") !== "") {
        document.getElementById("nextSectionLink").click();
      } else {
        //课程学习完毕，语音提醒
        audio = new Audio();
        audio.src = "http://sgk.killadm.com/notify.wav";
        audio.play();
      }
    }
  }, 3000);
})();