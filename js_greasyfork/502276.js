// ==UserScript==
// @name        2024_南京智慧人社_公需课 视频学习
// @namespace   代学,代考（VX）：gxk7766
// @version      0.1
// @description  代学,代考,加我vx: gxk7766
// @author       （VX）：gxk7766
// @match        https://m.mynj.cn:11188/*
// @match        http://180.101.236.114:8283/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502276/2024_%E5%8D%97%E4%BA%AC%E6%99%BA%E6%85%A7%E4%BA%BA%E7%A4%BE_%E5%85%AC%E9%9C%80%E8%AF%BE%20%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/502276/2024_%E5%8D%97%E4%BA%AC%E6%99%BA%E6%85%A7%E4%BA%BA%E7%A4%BE_%E5%85%AC%E9%9C%80%E8%AF%BE%20%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

window.onload = function () {
  let hre = location.href;
  if (hre == "http://180.101.236.114:8283/rsrczxpx/auc/myCourse?state=1") {
    let cours = $(".mycourse-row");
    cours[0].querySelector(".mycourse-green").click();
  }
  if (hre == "http://180.101.236.114:8283/rsrczxpx/auc/myCourse?state=0") {
    if ($(".mycourse-orange")[0]) {
      $(".mycourse-orange")[0].click();
    } else {
      location.href = "http://180.101.236.114:8283/rsrczxpx/auc/myCourse?state=1";
    }
  }

  //小节列表页
  if (hre.includes("http://180.101.236.114:8283/rsrczxpx/hyper/courseDetail")) {
    let t0 = setInterval(() => {
      if (document.querySelector("#content")) {
        clearInterval(t0);
        if ($('[target="_self"]a:contains("点击学习")')[0]) {
          $('[target="_self"]a:contains("点击学习")')[0].click();
        } else {
          $('a:contains("课程作业")')[0].click();
        }
      }
    }, 1000);

    let t1 = setInterval(() => {
      if ($('.messager-body:contains("您确认要再次完成该作业吗?"):visible')[0]) {
        clearInterval(t1);
        document.querySelector(".l-btn-text").click();
      }
    }, 1000);
  }

  if (hre.includes("http://180.101.236.114:8283/rsrczxpx/tec/play/player")) {
    let t0 = setInterval(() => {
      if ($('div:contains("服务出错，请稍后重试！"):visible')[0]) {
        clearInterval(t0);
        setTimeout(() => {
          location.reload();
        }, 5 * 60 * 1000);
      }

      if ($('div:contains("检测到您开始了其他课件的学习，现此课件的学习计时已停止"):visible')[0]) {
        clearInterval(t0);
        location.href = "http://180.101.236.114:8283/rsrczxpx/auc/myCourse?state=0";
      }
      setTimeout(() => {
        if (!$(".learnpercent span:visible")[0]) {
          location.reload();
        }
      }, 5000);
      if ($('.messager-body div:contains("点击确定继续观看！"):visible')[0]) {
        let delay = Math.floor(Math.random() * 26 + 5) * 1000;
        setTimeout(() => {
          document.querySelector(".l-btn.l-btn-small").click();
        }, delay);
      }
      if (document.querySelector("video") && document.querySelector("video").paused) {
        document.querySelector("video").play();
      }
      if ($('.learnpercent span:contains("已完成"):visible')[0]) {
        if ($('span:contains("未开始"),span:contains("未完成")')[0]) {
          $('span:contains("未开始"),span:contains("未完成")').next("span")[0].click();
        }
      }
    }, 5000);
  }
};
