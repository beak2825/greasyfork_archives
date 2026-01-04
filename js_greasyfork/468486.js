// ==UserScript==
// @name         文鼎教育在线 自动学习答题脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  定制脚本
// @author       You
// @license      MIT
// @match        https://www.iwdjy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iwdjy.com
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468486/%E6%96%87%E9%BC%8E%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468486/%E6%96%87%E9%BC%8E%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 阻止vue-router使用该方法更新url
  history.pushState = null;

  const ajaxList = [];
  const listenList = [];
  const token = localStorage.getItem("userToken");
  console.info("脚本已启动v0.1");

  // 请求路径
  const getLessonHour = new RegExp(/nbv\.iwdjy\.com\/api\/lesson\/getLessonHour/);
  const getConsultId = new RegExp(/nbv\.iwdjy\.com\/api\/lesson\/postLessonAll/);
  const pageByItem = new RegExp(/api\/user\/studyRate/);
  let courseId = null;
  listenAjax(getConsultId, (req) => {
    courseId = req.res.data.id;
  });

  let lEL = document.createElement("div");
  // 获取到课程列表
  listenAjax(pageByItem, async (reqX) => {
    let req = reqX.res;
    console.info("获取到课程列表", req);

    lEL.remove();
    lEL = document.createElement("div");
    lEL.classList.add("xy_iframe_list");
    Object.assign(lEL.style, {
      width: "222px",
      minHeight: "100px",
      height: "auto",
      overflow: "auto",
    });
    document.querySelector(".el-aside.left .user-menu-area").appendChild(lEL);

    let studyRecord = await axios({
      url: "https://nbv.iwdjy.com/api/user/studyRecord",
      method: "POST",
      data: {
        token,
        host: "www.iwdjy.com",
        url: "https://www.iwdjy.com/user-index/learning-record?nav=0,2&tab=0",
      },
    }).catch((err) => {
      console.error("获取真实学习进度失败", err);
    });
    studyRecord = studyRecord.data.data ? studyRecord.data.data : [];
    const learningList = [];

    req.data.forEach((el) => {
      const find = studyRecord.find((_el) => _el.id === el.id);
      if (find) {
        if (find.rate !== 100) {
          learningList.push(el);
        }
        document.querySelector(
          `.course-main a[href="/course-detail?id=${find.id}"]`
        ).innerHTML += `—(真实进度 <span style="color:red">${find.rate}</span> )`;
      } else {
        if (el.lesson !== 100) {
          learningList.push(el);
        }
        document.querySelector(
          `.course-main a[href="/course-detail?id=${el.id}"]`
        ).innerHTML += `—(真实进度 <span style="color:red">${el.lesson}</span> )`;
      }
    });

    if (learningList.length) {
      document.querySelectorAll(".xy_iframe").forEach((el) => el.remove());
      learningList.forEach((el, i) => {
        if (el.lesson !== 100) {
          console.info("打开课程", el);
          const iframe = document.createElement("iframe");
          iframe.classList.add("xy_iframe");
          Object.assign(iframe.style, {
            width: "222px",
            height: "250px",
          });
          iframe.src = `https://www.iwdjy.com/course-detail?id=${el.id}`;
          lEL.appendChild(iframe);
        }
      });
    } else {
      console.info("没有执行");
    }
  });

  listenAjax(getLessonHour, async (req) => {
    // 初始化用户界面
    let dom = document.querySelector(".xy_screen");
    if (dom) {
      dom.remove();
    }
    dom = document.createElement("div");
    dom.className = "xy_screen";
    dom.title = "当前版本 v0.1";
    Object.assign(dom.style, {
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "999",
      width: "200px",
      height: "100px",
      borderBottomRightRadius: "20px",
      backgroundColor: "rgba(64, 158, 255, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#fff",
      fontWeight: "bold",
      boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.3)",
    });
    document.body.appendChild(dom);

    // 视频统计信息
    let videoNum = 0;
    let FvideoNum = 0;
    // 答题统计信息
    let taskNum = 0;
    let FtaskNum = 0;

    let ChapterVoList = req.res.data.data; // 学习列表

    console.info("获取到课程数据", ChapterVoList);

    // 统计信息
    videoNum = ChapterVoList.length;

    dom.innerHTML = `<p class="xy_pross" style='margin-bottom:8px'>执行中</p><p class='xy_video' style='margin-bottom:8px'>0/${videoNum}个视频</p>`;
    let videoEl = document.querySelector(".xy_video");
    let taskEl = document.querySelector(".xy_task");
    let prossEl = document.querySelector(".xy_pross");

    for (let i = 0; i < ChapterVoList.length; i++) {
      const el = ChapterVoList[i];
      if (el.play_rate == 100) {
        console.log("跳过已完成项目");
        FvideoNum++;
        continue;
      }
      await axios({
        url: "https://nbv.iwdjy.com/api/lesson/saveUserHour",
        method: "POST",
        data: {
          token,
          host: "www.iwdjy.com",
          hour_id: el.id,
          play_time: el.play_time,
          url: `https://www.iwdjy.com/course-learn?id=${courseId}&learnId=${el.id}&teacherId=0`,
        },
      });
      await axios({
        url: "https://nbv.iwdjy.com/api/lesson/afterWatchCompleted",
        method: "POST",
        data: {
          token,
          host: "www.iwdjy.com",
          hour_id: el.id,
          lesson_id: courseId,
          play_time: el.play_time,
          url: `https://www.iwdjy.com/course-learn?id=${courseId}&learnId=${el.id}&teacherId=0`,
        },
      }).then((res) => {
        FvideoNum++;
      });
      videoEl.innerHTML = `${FvideoNum}/${videoNum}个视频`;
    }
    videoEl.innerHTML = `${FvideoNum}/${videoNum}个视频`;
    prossEl.innerHTML = "执行结束";
  });

  // 监听器
  const originOpen = XMLHttpRequest.prototype.open;
  const originSend = XMLHttpRequest.prototype.send;
  const originHeader = XMLHttpRequest.prototype.setRequestHeader;

  // 重写open
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function (obj) {
      const url = obj.target.responseURL; // obj.target -> this
      listenList.forEach((el) => {
        if (el.rule.test(url)) {
          const find = ajaxList.find((el) => el.xml === this);
          if (find) {
            find.url = url;
            find.res = JSON.parse(this.response);
            el.callback(find);
          } else {
            el.callback(false);
          }
        }
      });
    });
    originOpen.apply(this, arguments);
  };

  // 重写send
  XMLHttpRequest.prototype.send = function () {
    const xml = ajaxList.find((el) => el.xml === this);
    if (xml) {
      xml.send = JSON.parse(arguments[0]);
    }
    originSend.apply(this, arguments);
  };

  // 重写setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function () {
    const xml = ajaxList.find((el) => el.xml === this);
    if (xml) {
      xml.header[arguments[0]] = arguments[1];
    } else {
      ajaxList.push({
        xml: this,
        url: "",
        header: {
          [arguments[0]]: arguments[1],
        },
      });
    }
    originHeader.apply(this, arguments);
  };

  function listenAjax(rule, callback) {
    listenList.push({
      rule,
      callback,
    });
  }
})();
