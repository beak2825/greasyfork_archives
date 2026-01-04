// ==UserScript==
// @name         湘潭大学
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  视频自动挂机脚本
// @author       xy
// @match        xtdx.web2.superchutou.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=superchutou.com
// @grant        none
// @license      AGPL3.0
// @downloadURL https://update.greasyfork.org/scripts/453687/%E6%B9%98%E6%BD%AD%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/453687/%E6%B9%98%E6%BD%AD%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==
(function () {
  "use strict";
  window.addEventListener("hashchange", function (event) {
    console.log("路径跳转1");
    this.location.reload();
  });
  window.addEventListener("popstate", function (event) {
    console.log("路径跳转2");
    this.location.reload();
  });

  window.addEventListener("pushState", function (e) {
    console.log("路径跳转4");
    this.location.reload();
  });
  let url = location.href;
  if (!url.includes("/#/video/")) {
    console.log("无效页面");
    return;
  }
  const eventList = [
    {
      once: true,
      rule: /GetCourse_ChaptersNodeList/,
      callback(data) {
        console.log("获取到数据", data);
        loopCheck(data);
      },
    },
  ];
  const xml = [];
  let isnotDone = [];
  let defText = "";
  let allDon = false;
  function loopCheck(data) {
    let spanEl = document.querySelector(".ant-col.ant-col-19 span");
    if (!defText && spanEl) {
      defText = spanEl.innerText;
    }
    spanEl.innerText = defText + `- 脚本运行中 ${new Date().toLocaleString()}`;
    fetch(data.xml.url + "&nots=axpost", data.xml.value)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        console.log("请求返回", res);
        let lis = [];
        res.Data.map((el) => el.ChildNodeList).forEach((el) => {
          lis.push(...el);
        });
        let noXue = lis.filter((el) => !el.IsLook);
        console.log(noXue);
        if (noXue.length) {
          startXue(noXue[0]);
        } else {
          allDon = true;
          spanEl.innerText = defText + " - 所有内容已学习完成！";
        }
      });
    setTimeout(() => {
      if (!allDon) {
        loopCheck(data);
      }
    }, 3000);
  }
  monitorFetch();
  function getAllList() {
    return document.querySelectorAll(".ant-collapse-content-box>div>div>div>div>div>ul>div");
  }
  function main() {
    let lest = Array.from(getAllList());
    if (lest.length) {
      isnotDone = lest.filter((el) => !el.querySelector(".ant-col.ant-col-2>i"));
      console.log("过滤已完成课程", lest, isnotDone);
    } else {
      console.log("等待加载完成");
      setTimeout(main, 1000);
    }
  }
  main();
  monitorFetch();
  function monitorFetch() {
    let logFetch = window.fetch;
    window.fetch = function (input, init) {
      xml.push({
        url: input,
        value: init,
      });
      return new Promise((resolve, reject) => {
        logFetch(input, init).then(function (response) {
          fetchCallback(response.clone());
          resolve(response);
        }, reject);
      });
    };
  }
  function fetchCallback(response) {
    eventList.forEach((el) => {
      if (el.rule.test(response.url) && el.once) {
        if (el.once) {
          el.once = false;
        }
        let temp = {
          response,
          url: response.url,
          xml: xml.find((el) => response.url.includes(el.url)),
        };
        el.callback(temp);
      }
    });
  }

  function startXue(data) {
    if (isnotDone.length) {
      let url = `#/video/${data.ID}-${data.Course_ID}-${data.CourseWare_ID}`;
      console.log("开始学习这个视频", url);
      isnotDone.forEach((el) => {
        let elA = el.querySelector("a");
        let link = elA.getAttribute("href");
        let testLink = link.split("-");
        testLink.splice(testLink.length - 1, 1);
        testLink = testLink.join("-");
        if (testLink === url) {
          if (!elA.className.includes("playing")) {
            console.log("切换正在学习课程", el);
            elA.click();
          } else {
            console.log("当前正在学习此课程");
            document
              .querySelector("video")
              .play()
              .catch((err) => {
                console.log("自动播放视频失败，需要人工干预");
                alert("自动播放视频失败，请手动点击视频进行播放");
              });
          }
        }
      });
    } else {
      console.log("等待获取dom列表");
    }
  }
})();
