// ==UserScript==
// @name         中国地质大学(武汉)自考教学平台 自动刷视频自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  自动刷视频自动答题脚本
// @author       xiyue
// @license      AGPL-3.0 License
// @match        *.whxunw.com/exam/user/kjxx/doPaper.thtml*
// @match        *.whxunw.com/exam/user/kjxx/practise.thtml*
// @match        *.whxunw.com/exam/user/kjxx/courseLearn.thtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whxunw.com
// @require      https://unpkg.com/axios@0.26.0/dist/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441201/%E4%B8%AD%E5%9B%BD%E5%9C%B0%E8%B4%A8%E5%A4%A7%E5%AD%A6%28%E6%AD%A6%E6%B1%89%29%E8%87%AA%E8%80%83%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441201/%E4%B8%AD%E5%9B%BD%E5%9C%B0%E8%B4%A8%E5%A4%A7%E5%AD%A6%28%E6%AD%A6%E6%B1%89%29%E8%87%AA%E8%80%83%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let newVideo = true;
  let nums = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    Y: 0,
    N: 1,
    正确: 0,
    错误: 1,
  };

  let url = location.href;

  if (url.includes("doPaper")) {
    console.log("作业");
    check();
  } else if (url.includes("practise")) {
    console.log("视频答题");
    videoAns();
  } else if (url.includes("courseLearn")) {
    console.log("视频播放");
    videoPlay();
  }

  function check() {
    // 重写ajax方法监听请求
    var originOpen = XMLHttpRequest.prototype.open;
    // 重写open
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener("load", function (obj) {
        var url = obj.target.responseURL; // obj.target -> this
        console.log("加载请求", url);
        if (url.includes("https://0143.whxunw.com/exam/user/kjxx/startToExam.do")) {
          startS();
        }
      });
      originOpen.apply(this, arguments);
    };
  }

  async function startS() {
    let qus = document.querySelectorAll("#form_paper_detail .timu"),
      anss = await getAns();
    console.log("答案", anss);
    if (anss) {
      anss.forEach((el, index) => {
        if (el) {
          qus[index].querySelectorAll("input").forEach((el) => {
            el.checked = false;
          });
          el.forEach((an, i) => {
            let num = nums[an];
            if (qus[index].querySelector("input").type !== "text") {
              console.log(index + 1, el, num);
              qus[index].querySelectorAll("input")[num].click();
              qus[index].querySelectorAll("input")[num].checked = true;
            } else {
              qus[index].querySelectorAll("input")[i].value = an;
            }
          });
        }
      });
      checkAll();
    } else {
      setTimeout(() => {
        alert("没有找到答案,不要手动答题!\n稍等一会后刷新页面重试");
      }, 500);
    }

    function checkAll() {
      let anslist = document.querySelectorAll("#div_processor_fastto a"),
        isok = true;
      anslist.forEach((el, i) => {
        if (!el.className.length) {
          let numsa = nums[anss[i][0]];
          console.log("未记录", el, qus[i].querySelector("input"));
          isok = false;
          if (qus[i].querySelector("input").type !== "text") {
            qus[i].querySelectorAll("input")[numsa].click();
            qus[i].querySelectorAll("input")[numsa].click();
            qus[i].querySelectorAll("input")[numsa].checked = true;
          } else {
            qus[i].querySelector("input").focus();
          }
        }
      });
      if (!isok) {
        setTimeout(checkAll, 1000);
      } else {
        alert("答题完成");
      }
    }
  }

  async function getAns() {
    let url = `https://0143.whxunw.com/exam/user/kjxx/historyDetail.thtml${location.search}`,
      res = await axios.get(url),
      template = document.createElement("template");
    template.innerHTML = res.data;
    console.log(template);
    let ansel = template.content.querySelectorAll(".div-key-container:not(:last-child) fieldset"),
      ansArr = [];
    ansel.forEach((el) => {
      if (el.innerText.includes("答案")) {
        let anst = el.querySelector("p").innerText.match(/[ABCDEF]|正确|错误/g);
        if (anst) {
          ansArr.push(anst);
        } else {
          let newArr = [];
          el.querySelector("p")
            .innerText.split("\n")
            .forEach((nel) => {
              if (nel.replace(/\s/g, "").length) {
                newArr.push(nel.replace(/\s/g, ""));
              }
            });
          ansArr.push(newArr);
        }
      }
    });
    return ansArr;
  }

  function videoAns() {
    console.log("视频答题");
    let anss = document.querySelector("[keyanswer='keyAnswer']").innerText.split("");
    anss.forEach((ans) => {
      document.querySelectorAll("input")[nums[ans]].click();
    });
    document.querySelector("#submitBtn").click();
    document.querySelector(".layui-layer-btn0").click();
    document.querySelector("#goonBtn").click();
  }

  function videoPlay() {
    if (!document.querySelector(".layui-layer.layui-layer-dialog.layer-anim")) {
      let _video = document.querySelector("video");
      _video.play();
      if (newVideo) {
        newVideo = false;
        videoEnd(_video);
      }
    }
    setTimeout(videoPlay, 1000);
  }

  function videoEnd(_video) {
    _video.addEventListener("ended", () => {
      nextVideos();
    });
  }

  function nextVideos() {
    let kcml = document.querySelectorAll(".kcml .c-1 li li");
    for (let el of kcml) {
      if (el.querySelector("img").src.includes("finish")) {
        el.querySelector("img").setAttribute("isDon", "true");
      }
      if (
        el.querySelector("img").src.includes("pending") &&
        el.querySelector("img").getAttribute("isDon") === null
      ) {
        el.querySelector("img").setAttribute("isDon", "false");
      }
      if (el.querySelector("img").getAttribute("isDon") === "false" && newVideo == false) {
        el.click();
        newVideo = true;
      }
    }
  }
})();
