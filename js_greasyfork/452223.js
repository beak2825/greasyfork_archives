// ==UserScript==
// @name         福大雨课堂刷课-数研院
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @license      MIT
// @description  a script for automating video play for 雨课堂
// @author       camerayuhang or 风刮的唉 from FZU
// @match        https://changjiang.yuketang.cn/v2/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/452223/%E7%A6%8F%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE-%E6%95%B0%E7%A0%94%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452223/%E7%A6%8F%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE-%E6%95%B0%E7%A0%94%E9%99%A2.meta.js
// ==/UserScript==

(function() {
    // user can change the default config manually
    let timeInterval = 4000; // interval for jumping to the next page
    let showInfoInterval = 6000; // interval for showing info on page
    let showInfoOnPage = true; // Whether to show the information on the page

    if (showInfoOnPage) {
      $("body").prepend('<div class="myinfo"></div>')
      $(".myinfo")
        .css(
          {
            "border-radius": '10px',
            "box-sizing": 'border-box',
            "position": 'absolute',
            "right": '10px',
            "top": '10px',
            "width": '250px',
            "background-color": '#fff',
            "border": '1px solid #ccc',
            "padding": '10px 10px',
            "z-index": '99999',
            "overflow": "scroll",
            "height": "150px",
            "opacity": "0.5"
          }
        )
    }
    let stopInterval = (id) => {
      window.clearInterval(id);
      id = null;
    };

    let printInfo = (str, show = true) => {
      if (showInfoOnPage) {
        if (show) {
          $(".myinfo").append(`<p>${str}</p>`);
        }
      }
      console.log(str);
    }


    // keep looking for scrollDown button every a few seconds until finds it
    let intervalForScrollDown;
    intervalForScrollDown = window.setInterval(() => {
      let btn = $("span.blue.ml20").eq(0);
      if (btn.length !== 0) {
        stopInterval(intervalForScrollDown);
        if (btn.text().trim() === "展开") {
          printInfo("展开 button will be click automatically");
          btn.click();
        }

        let currentURL = window.location.href;

        // look for all videoNodes
        let intervalForAllVideoNodes;
        intervalForAllVideoNodes = window.setInterval(() => {
          let sectionVideoNodes = $("#pane--1 .activity-info.el-tooltip use[*|href='#icon-shipin']").parent().parent().parent().parent();
          if (sectionVideoNodes.length >= 0) {
            stopInterval(intervalForAllVideoNodes);

            // traverse each video nodes and check whether it is finished
            let done = true;
            for (let i = 0; i < sectionVideoNodes.length; i++) {
              const ele = sectionVideoNodes[i];
              let flagText = $(ele).children(".statistics-box").children(".aside").children().eq(1);
              printInfo(`the state of the ${i + 1}th video: ${flagText.text()}`);
              if (flagText.text() !== "已完成") {
                printInfo(`you have watched ${i} videos`);
                printInfo(`start to watch the ${i + 1}th video`);
                done = false;
                flagText.click();
                break;
              }
            }
            if (done) {
              window.alert("Congratulation! you've already finished all videos of this course.Please switch to another unfinished course to go on your journey!")
            }
            else {
              // look for video node
              let intervalForVideo;
              intervalForVideo = window.setInterval(() => {
                let video = $(".xt_video_player");
                if (video.length === 1) {
                  stopInterval(intervalForVideo);
                  let videoTitle = $("div.title-fl span")[0].innerText;  // title
                  let pause_btn = $("xt-bigbutton.pause_show");  // pause button
                  if (pause_btn.length == 1) {  //  determine whether the button is shown
                    pause_btn.click();
                  }
                  // lisen the video process
                  let listenVideoProcess;
                  let videoNode = video[0];
                  listenVideoProcess = window.setInterval(() => {
                    let w = $("span.text:eq(1)")[0];  // element for process
                    printInfo(videoTitle + '---' + w.innerText);
                    $(".myinfo").scrollTop($(".myinfo")[0].scrollHeight);
                    if (w.innerText == "完成度：100%" || videoNode.ended == true) {
                      stopInterval(listenVideoProcess);
                      printInfo("close the interval");
                      window.location.replace(currentURL);
                    }
                  }, showInfoInterval)
                }
              }, timeInterval);
            }
          }
        }, timeInterval);
      }
    }, timeInterval);
})();