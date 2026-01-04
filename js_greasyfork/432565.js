// ==UserScript==
// @name         【√】尔雅通识课视频学习完成自动翻页
// @namespace    ScriptTurnPages:shenhaisu@office.re
// @version      1.3
// @description  主要用于检测尔雅通识课的视频完成播放自动进入下一章
// @author       ShenHaiSu
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy*
// @match        https://mooc1-1.chaoxing.com/mycourse/studentstudy*
// @match        https://mooc1-3.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?domain=mju.edu.cn
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432565/%E3%80%90%E2%88%9A%E3%80%91%E5%B0%94%E9%9B%85%E9%80%9A%E8%AF%86%E8%AF%BE%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E5%AE%8C%E6%88%90%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/432565/%E3%80%90%E2%88%9A%E3%80%91%E5%B0%94%E9%9B%85%E9%80%9A%E8%AF%86%E8%AF%BE%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E5%AE%8C%E6%88%90%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
  let waitTime = 2000   //页面加载后2000毫秒开始运行脚本
  let onceTime = 5000   //单次循环检测5000毫秒进行一次
  let waitWorkTime = 180 //180秒）三分钟等待时间。等待答题的总计时间，如果超过这个时间，将会直接跳下一页。不等待继续答题。

  let nowWorkTime = 0
  let videoOnRun = false;
  setTimeout(() => {
    console.log("神海粟的脚本开始运行")

    // 删除不可点击的章节名的class防止误点击
    function removeOtherClass() {
      $("#_studystate").next().children().each(function () {
        $(this).children(":first").removeClass("posCatalog_select")
      })
    }

    function clickVideo() {
      // 自动播放部分代码
      if (!videoOnRun) {
        videoOnRun = true;
        let videoPlayer = $("#iframe").contents().find("iframe").contents().find("#video_html5_api")
        for (let videoPlayerKey in videoPlayer) {
          console.log(videoPlayer[videoPlayerKey])
        }
      }
    }

    setInterval(() => {
      let $active = $(".prev_ul .active").eq(0);
      removeOtherClass()

      function ifLasttab() {
        // 检测当前是否处于最后一个Tab页并点击下一页

        // 当前tab页的索引
        // console.log($active.index())
        // 当前tab页一共有多少个兄弟元素
        // console.log($active.parent().children().length-1)

        if (($active.index()) == ($active.parent().children().length - 1)) {
          // 当前是最后一的tab页
          $(".posCatalog_select").eq($(".posCatalog_active").index(".posCatalog_select") + 1).children(":first").click()
        } else {
          // 当前不是最后个tab页，什么都不做。
          // console.log("当前不是最后一tab页，继续向后翻页")
          $active.parent().children().eq($active.index() + 1).click();
          videoOnRun = false;
        }
      }


      if ($active[0].innerText.match(/学习目标/g)) {
        // 当前位于学习目标
        console.log("当前位于学习目标，无内容，立即跳过")
        ifLasttab()
      } else if ($active[0].innerText.match(/视频/g)) {
        // 当前位于视频
        if (($("#iframe").contents().find(".ans-job-finished")).length == 0) {
          console.log("任务点未完成");
          clickVideo();
        } else {
          console.log("任务点已完成");

          ifLasttab()
        }

      } else if ($active[0].innerText.match(/章节测验/g)) {
        // 当前位于章节测验
        if (($("#iframe").contents().find(".ans-job-finished")).length == 0) {
          console.log("任务点未完成" + nowWorkTime)
          if (nowWorkTime <= waitWorkTime) {
            nowWorkTime = nowWorkTime + 5
          } else {
            ifLasttab()
            nowWorkTime = 0
          }
        } else {
          console.log("任务点已完成")
          ifLasttab()
        }


      } else {
        // 当前位于通用适配
        if (($("#iframe").contents().find(".ans-job-finished")).length == 0) {
          console.log("任务点未完成")
        } else {
          console.log("任务点已完成")
          ifLasttab()
        }
      }
    }, onceTime);
  }, waitTime);


})();
