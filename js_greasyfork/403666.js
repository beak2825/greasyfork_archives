// ==UserScript==
// @name         吉讯职业生涯课刷课
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  职业生涯课刷课，检测未看过的课和未到100%的课
// @author       海棠未眠
// @match        http://tyut.careersky.cn/jixun/VodLesson/AllLessons
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403666/%E5%90%89%E8%AE%AF%E8%81%8C%E4%B8%9A%E7%94%9F%E6%B6%AF%E8%AF%BE%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/403666/%E5%90%89%E8%AE%AF%E8%81%8C%E4%B8%9A%E7%94%9F%E6%B6%AF%E8%AF%BE%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
  // 倍速播放
  let playbackRate = 1;
  // 是否静音
  let muted = true;

  let flag = false;

  function startPlayer() {
    let lessonList = $(".allLessons li");
    console.log(lessonList);
    for (let i = 0; i < lessonList.length - 1; i++) {
      const element = lessonList[i];
      if ($(element).children("span").length !== 0 && $(element).find("span")[0].innerText == "100.00 %") {
        continue;
      } else {
        console.log("第" + i + "个视频");
        $(element).find("a")[0].click();
        flag = true;
        setTimeout(function(){
        let video = $(".video-player video");
        while (video.length == 0) {
          video = $(".video-player video");
        }
        console.log(video);
        video.attr("id", "lance");
        video = document.getElementById("lance");
        video.muted = muted;
        video.playbackRate = playbackRate;
          console.log("enter");
        video.addEventListener("ended", function() {
          console.log("视频观看结束");
          $(".close")[0].click();
          console.log(66666);
        }, false);
          console.log("end");
        }, 5000);
        break;
      }
    }
  }

  function findLesson() {
    let allLessonCategoryChild = $(".allLesson-category-child a");
    for (let i = 0; i < allLessonCategoryChild.length; i++) {
      if (flag) {
        return;
      }
      const element = allLessonCategoryChild[i];
      element.click();
      startPlayer();
    }
  }

  let allLessonCategory = $(".allLesson-category a");
  for (let i = 0; i < allLessonCategory.length; i++) {
    if (flag) {
      break;
    }
    const element = allLessonCategory[i];
    element.click();
    findLesson();
  }


})();