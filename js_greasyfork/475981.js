// ==UserScript==
// @name         自动刷课v1
// @namespace    一品学堂，进入课程页面即可
// @version      1.7
// @description  自动刷课
// @author       食翔狂魔
// @match        *zjdx-kfkc.webtrn.cn/learnspace/learn/learn/templateeight/index.action*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475981/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BEv1.user.js
// @updateURL https://update.greasyfork.org/scripts/475981/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BEv1.meta.js
// ==/UserScript==
 
(function() {
  //'use strict';
  setTimeout(() => {
    console.log("四秒已过，开始运行。")
    window.index = 0;

    function autoLearn() {
      window.vlist = $(".s_point[completestate='0']", $("#mainContent")[0].contentDocument);
      window.vlist[window.index].onclick();
      var video;
      setTimeout(() => {
        video = $("video", $("#mainContent")[0].contentDocument.getElementById("mainFrame").contentDocument)[0];
        video.volume=0;
        console.log("获取video。" + video);
        video.play();
        setTimeout(() => {
          console.log("定时下一视频播放");
          video.play();
          video.volume=0;
          if(window.index < window.vlist.length) {
            //window.index++;
            $("#mainContent")[0].contentWindow.location.reload()
            setTimeout(() => {
              autoLearn();
            }, 5000)
          }
        }, ((video.duration - video.currentTime) + 1) * 1000)
      }, 5000)
    }
    autoLearn();
  }, 4000);
})();