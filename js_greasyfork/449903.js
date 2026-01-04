// ==UserScript==
// @name         国家中小学智慧教育平台研修
// @namespace    http://tampermonkey.net/
// @version      1.0
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @description  国家中小学智慧教育平台教师研修学习
// @author       弱鸟
// @match        https://www.zxx.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449903/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/449903/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==
 
window.onload = function () {
  let hre = location.href;
    if (hre == "https://www.zxx.edu.cn/teacherTrainingNav/train") {
    console.log(hre);
    let t0 = setInterval(() => {
      if (document.querySelector(".index-module_processT_3A7C3")) {
        clearInterval(t0);
        let train = $(".index-module_box_2kgCA:not(:contains('直播预告'))");
        for (let index = 0; index < train.length; index++) {
          let now = train[index].querySelectorAll(".index-module_processC_3mD20 span")[0];
          let need = train[index].querySelectorAll(".index-module_processC_3mD20 span")[2];
          if (parseFloat(now.innerText) < parseFloat(need.innerText)) {
            train[index].querySelector("img").click();
            setTimeout(() => {
              window.top.open(location, "_self").close();
            }, 2000);
            break;
          }
        }
      }
    }, 1000);
  }
    let tt = setInterval(() => {
    console.log("tt");
    let hre = location.href;
    
    if (hre.includes("https://www.zxx.edu.cn/teacherTraining/courseIndex?channelId")) {
      try {
        if ($('.index-module_btn_2O00O:contains("我知道了")')[0]) {
          $('.index-module_btn_2O00O:contains("我知道了")')[0].click();
        }
        if ($('.CourseIndex-module_course-btn_3Yy4j:contains("学习")')[0]) {
          $('.CourseIndex-module_course-btn_3Yy4j:contains("学习")')[0].click();
        }
        if (!document.querySelector(".fish-checkbox-checked") && document.querySelector(".fish-checkbox-input")) {
          document.querySelector(".fish-checkbox-input").click();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (hre.includes("teacherTraining/courseDetail?courseId")) {
      console.log(new Date());
      clearInterval(tt);
          setInterval(() => {
        let vid = document.querySelector("video");
        if (vid.paused) {
          vid.play();
        }
        let sped = document.querySelector(
          "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > span"
        );
 
        if (sped && sped.innerText != "标清") {
          document
            .querySelector(
              "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > div > ul > li:nth-child(2) > span.vjs-menu-item-text"
            )
            .click();
        }
        
        if (document.querySelector('.resource-item-active [title="已学完"]')) {
          $('.resource-item.resource-item-train:not(:has([title="已学完"]))')[0].click();
        }
      }, 5000);
    }
  }, 2000);
 
};