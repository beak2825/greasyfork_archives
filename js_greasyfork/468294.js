// ==UserScript==
// @name         成学课堂 自动学习答题脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  定制脚本
// @author       You
// @match        https://student.cx-online.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cx-online.net
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468294/%E6%88%90%E5%AD%A6%E8%AF%BE%E5%A0%82%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468294/%E6%88%90%E5%AD%A6%E8%AF%BE%E5%A0%82%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 阻止vue-router使用该方法更新url
  history.pushState = null;

  const ajaxList = [];
  const listenList = [];
  const Authorization = JSON.parse(sessionStorage.getItem("user")).token;
  console.info("脚本已启动v0.2");

  // 请求路径
  const getStuCourseById = new RegExp(/cxkt\/baseInfo\/course\/v1\/getStuCourseById/);

  const pageByItem = new RegExp(/cxkt\/baseInfo\/course\/v1\/pageByItem/);

  const lEL = document.createElement("div");

  Object.assign(lEL.style, {
    position: "absolute",
    top: "100vh",
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    minHeight: "250px",
    overflow: "scroll",
    right: "0",
    zIndex: "999",
    flexWrap: "wrap",
  });
  document.body.appendChild(lEL);
  listenAjax(pageByItem, async (reqX) => {
    let req = reqX.res;
    console.info("获取到课程列表", req);
    if (req.data && req.data.list && req.data.list.length) {
      const list = req.data.list;
      document.querySelectorAll(".xy_iframe").forEach((el) => el.remove());
      list.forEach((el) => {
        console.info("打开课程", el);
        const iframe = document.createElement("iframe");
        iframe.classList.add("xy_iframe");
        Object.assign(iframe.style, {
          width: "222px",
          height: "250px",
        });
        iframe.src = `https://student.cx-online.net/#/Layout/roomDetail?courseId=${el.id}`;
        lEL.appendChild(iframe);
      });
    } else {
      console.info("没有执行");
    }
  });

  listenAjax(getStuCourseById, async (req) => {
    // document.querySelector(".container .title").innerText = req.res.data.courseName;
    // 初始化用户界面
    let dom = document.querySelector(".xy_screen");
    if (dom) {
      dom.remove();
    }
    dom = document.createElement("div");
    dom.className = "xy_screen";
    dom.title = "当前版本 v0.1.1";
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

    let videoNum = 0;
    let FvideoNum = 0;

    let taskNum = 0;
    let FtaskNum = 0;

    let ChapterVoList = req.res.data.stuChapterVoList; // 学习列表
    const courseId = req.res.data.courseId; // 课程id
    console.info("获取到课程数据", ChapterVoList);

    // 统计信息
    ChapterVoList.forEach((chapter) => {
      videoNum += chapter.stuTaskVoList.length;
      taskNum += chapter.stuVideoVoList.length;
    });
    dom.innerHTML = `<p class="xy_pross" style='margin-bottom:8px'>执行中</p><p class='xy_video' style='margin-bottom:8px'>0/${videoNum}个视频</p><p class='xy_task'>0/${taskNum}个作业</p>`;
    let videoEl = document.querySelector(".xy_video");
    let taskEl = document.querySelector(".xy_task");
    let prossEl = document.querySelector(".xy_pross");
    // 循环课程
    for (let i = 0; i < ChapterVoList.length; i++) {
      const chapter = ChapterVoList[i];
      console.info(chapter.chapterName);
      // 作业
      for (let j = 0; j < chapter.stuTaskVoList.length; j++) {
        const task = chapter.stuTaskVoList[j];
        if (task.lastMark && parseInt(task.lastMark) == parseInt(task.lastMark)) {
          console.info("跳过满分作业");
          FtaskNum++;
          taskEl.innerHTML = `${FtaskNum}/${taskNum}个作业`;
          continue;
        }
        // 获取作业题目
        const taskList = await axios({
          url: `https://cxkt-api-admin.cx-online.net/cxkt/baseInfo/que/v1/listQuestionByTaskId/${task.taskId}`,
          method: "POST",
          headers: {
            Authorization,
          },
        }).catch((err) => {
          console.info("获取题目失败", err);
        });

        console.info("题目列表", taskList);
        // 构建满分请求
        const stuQueRecordDtoList = [];
        taskList.data.data.forEach((el) => {
          stuQueRecordDtoList.push({
            consumeAnswerList: el.answerList,
            queId: el.queId,
          });
        });

        // 发送答题请求
        axios({
          url: "https://cxkt-api-admin.cx-online.net/cxkt/study/taskLog/v2/saveTaskRec",
          method: "POST",
          headers: {
            Authorization,
          },
          data: {
            stuProgressTaskId: null,
            courseId, // 课程id
            chapterId: chapter.chapterId, // 章节id
            taskId: task.taskId, // 题目id
            stuQueRecordDtoList,
          },
        })
          .then((res) => {
            FtaskNum++;
            taskEl.innerHTML = `${FtaskNum}/${taskNum}个作业`;
            console.info("提交作业", res);
          })
          .catch((err) => {
            console.info("提交作业失败", err);
          });
      }
      // 视频
      for (let j = 0; j < chapter.stuVideoVoList.length; j++) {
        const video = chapter.stuVideoVoList[j];
        if (video.watchedTime && parseInt(video.videoDuration) == parseInt(video.watchedTime)) {
          console.info("跳过已观看视频");
          FvideoNum++;
          videoEl.innerHTML = `${FvideoNum}/${videoNum}个视频`;
          continue;
        }
        await axios({
          url: "https://cxkt-api-admin.cx-online.net/cxkt/study/progressVideo/v2/saveVideoProgress",
          method: "POST",
          headers: {
            Authorization,
          },
          data: {
            chapterId: chapter.chapterId,
            courseId,
            stuProgressVideoId: video.stuProgressVideoId,
            videoId: video.videoId,
            watchedTime: video.videoDuration,
          },
        })
          .then((res) => {
            FvideoNum++;
            videoEl.innerHTML = `${FvideoNum}/${videoNum}个视频`;
            console.info("模拟视频请求结束", res);
          })
          .catch((err) => {
            console.info("更新播放时长失败", err);
          });
      }
    }
    axios({
      url: "https://cxkt-api-admin.cx-online.net/cxkt/study/progress/v2/saveProgress",
      method: "POST",
      headers: {
        Authorization,
      },
      data: {
        courseId,
        progressValue: 100,
      },
    })
      .then((res) => {
        console.info("更新总体学习进度", res);
      })
      .catch((err) => {
        console.info("更新总体学习进度失败", err);
      });
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
