// ==UserScript==
// @name         宁夏高等教育自学考试网络助学平台
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  v1.1
// @author       xiyue
// @match        https://member.zikao365.com/*
// @match        https://ningxia.kaohe.zikao365.com/*
// @match        http://xuexi.zikao365.com/*
// @icon         https://mc.furryworld.top/favicon.ico
// @require      https://lib.baomitu.com/localforage/1.10.0/localforage.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432837/%E5%AE%81%E5%A4%8F%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/432837/%E5%AE%81%E5%A4%8F%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("脚本执行码 - 0.12");
  var url = window.location.href;
  if (url.includes("exam_toExam")) {
    dts();
  } else if (url.includes("exam_getQuesAnaly")) {
    dns();
  } else if (url.includes("processEvaluationInfo")) {
    fulldts();
  } else if (url.includes("getQues4NoCache") || url.includes("getQuesNoCreate")) {
    ensd();
  } else if (url.includes("videoPlay")) {
    vdes();
  }

  function dts() {
    console.log("答题模块");
    localforage
      .getItem("dans")
      .then(function (value) {
        var titals = document.querySelectorAll(".dt001 td").length - 1,
          nex = 0;
        if (titals < 1) {
          console.log("等待加载", titals);
          setTimeout(dts, 1000);
        } else {
          console.log("开始答题", titals);
          loops();
        }

        function loops() {
          setTimeout(function () {
            var ansstr = document.querySelectorAll(".dt_tmcon span")[1].innerText;
            var dnEl = document.querySelectorAll(".dt_tmcon div")[1].querySelectorAll("p");
            dnEl[0].querySelector("input").checked = true;
            dnEl[0].querySelector("input").checked = false;
            console.log(value);
            var vls = [0];
            if (value && value[nex]) {
              vls = value[nex];
            }
            for (var i = 0; i < vls.length; i++) {
              if (dnEl[vls[i]]) {
                dnEl[vls[i]].querySelector("input").checked = true;
              } else {
                dnEl[0].querySelector("input").checked = true;
              }
            }
            if (nex < titals) {
              nex++;
              setTimeout(function () {
                document.querySelector("input[value='下一题']").click();
              }, 100);
              setTimeout(loops, 200);
            } else {
              console.log("答题完成");
              document.querySelector(".jj img").click();
              setTimeout(function () {
                document.querySelector(".submitBut img").click();
                setTimeout(function () {
                  document.querySelector(".submitBut2 img").click();
                  setTimeout(function () {
                    document.querySelector(".ip a").click();
                  }, 1000);
                }, 50);
              }, 50);
            }
          }, 100);
        }
      })
      .catch(function (err) {
        console.log("答题模块出错");
        // 当出错时，重新执行此代码
        console.log(err);
        dts();
      });
  }

  function dns() {
    var totalnum = parseInt(document.querySelectorAll("font[style='color:red']")[1].innerText);
    if (totalnum !== 100) {
      var ansl = document.querySelectorAll(".jx_zqda"),
        an = [];
      for (var i = 0; i < ansl.length; i++) {
        var strs = [],
          enns = ansl[i]
            .querySelectorAll("span")[1]
            .innerText.replace(/.+正确答案：/, "")
            .replace(/\s+得　分.+/, "")
            .split("");
        for (var j = 0; j < enns.length; j++) {
          let ans = enns[j].toUpperCase().charCodeAt() - 65;
          switch (ans) {
            case 24:
              ans = 0;
              break;
            case 13:
              ans = 1;
              break;
            default:
              ans = ans;
          }
          strs.push(ans);
        }
        an.push(strs);
      }
      localforage.setItem("dans", an).then(function (value) {
        console.log("答案获取完成", value);
        window.history.back(-1);
      });
    } else {
      console.log("满分,结束考试");
      alert("答题结束,点击确定关闭页面");
      window.close();
    }
  }

  function fulldts() {
    var linklist = document.querySelectorAll(".ng-scope a[style='color:#127de1; cursor:pointer;']");
    if (linklist.length) {
      console.log("视频答题");
      var nums = 0,
        max = 2,
        ops = 1;

      function opens() {
        if (nums >= linklist.length) {
          return false;
        }
        window.open(linklist[nums].getAttribute("href"));
        nums++;
        if (ops >= max) {
          ops = 0;
          setTimeout(opens, 3000);
        } else {
          ops++;
          opens();
        }
      }
      opens();
    } else {
      setTimeout(fulldts, 1000);
    }
  }

  function ensd() {
    var ra = document.querySelector(".rA.leftRightDot");
    var rn = document.querySelector(".uA.leftRightDot");
    if (ra) {
      var na =
        ra.innerText
          .replace(/【正确答案】 /, "")
          .toUpperCase()
          .charCodeAt() - 65;
      var nr =
        rn.innerText
          .replace(/【您的答案】 /, "")
          .toUpperCase()
          .charCodeAt() - 65;
      // 结算界面 - 判断是否回答正确
      console.log("结算界面", na, nr);
      if (na === nr) {
        window.close();
      } else {
        localforage.setItem("oqus", na).then(function (value) {
          window.history.back(-1);
        });
      }
    } else {
      console.log("答题界面");
      var sels = document.querySelectorAll(".dt_xxbg p");
      // 答题界面
      localforage.getItem("oqus").then(function (value) {
        if (value) {
          sels[value].querySelector("input").click();
        } else {
          sels[0].querySelector("input").click();
        }
        setTimeout(function () {
          document.querySelector(".savePaper").click();
          setTimeout(function () {
            document.querySelector(".content-btn-h5Tips a").click();
          }, 100);
        }, 100);
      });
    }
  }

  function vdes() {
    console.log("视频播放");
    var videos = document.querySelector("video");
    videos.volume = 0;

    function plays() {
      videos.play();
      console.log("视频播放中");
      setTimeout(plays, 1000);
    }
    plays();
    var tcs = document.querySelector(".pr.popPlayer.content");

    function tcss() {
      tcs = document.querySelector(".pr.popPlayer.content");
      if (tcs && tcs.style.display === "block") {
        console.log("检测到弹窗,关闭");
        document.querySelectorAll(".abs.dubleBtn.clearfix a")[1].click();
      }
      setTimeout(tcss, 500);
    }
    tcss();
  }
})();
