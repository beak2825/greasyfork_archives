// ==UserScript==
// @license MIT
// @name         e-learning自动挂机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷课测试版本
// @author       beyonder
// @match        http://e-learning.sinodata.net.cn/els/html/index.parser.do?*
// @icon         https://www.google.com/s2/favicons?domain=sinodata.net.cn
// @grant        test
// @downloadURL https://update.greasyfork.org/scripts/444004/e-learning%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/444004/e-learning%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
  //  获取sessionId
  const sessionId = getCookie("eln_session_id");
  const courseType = "NEW_COURSE_CENTER";
  const pageSize = 45;
  const courseStatus = "NOT_STARTED"; // 学习状态 NOT_STARTED 未学习 STUDY进行中
  const stepToGetScore = "COURSE_EVALUATE"; // 结业条件 COURSE_EVALUATE 课程评估
  let itemlength = 0; // 分段总数
  let studyList = []; // 课程list
  let finList = []; // 评论列表
  let listIdx = {}; // 课程idx
  let itemIdx = {}; // 单个分段idx
  let finIdx = {}; // 评价idx
  let doing = "";
  let _courseId = "";

  // 间隔时间
  function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime) return;
    }
  }

  // 退出课程
  async function exitCourse(courseId) {
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.exitStudy.do?courseId=" +
        courseId,
      {
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
          courseId +
          "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
          sessionId,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "elsSign=" + sessionId,
        method: "POST",
        mode: "cors",
        credentials: "omit",
      }
    );
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/course/course.checkCourseStudy.do?exit=true",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
          courseId +
          "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
          sessionId,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "elsSign=" + sessionId + "&courseId=" + courseId,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
  }

  // 两分屏课程单个分段学习
  async function doa(courseId, sid, ti, time) {
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.lastScoRecord.do?courseId=" +
        courseId +
        "&scoId=" +
        sid +
        "",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
          courseId +
          "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
          sessionId,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "elsSign=" + sessionId,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    ).then((res) => {
      fetch(
        "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.selectResource.do?host=&vbox_server=http://21tb-video.21tb.com&fromNetWorkSetting=false&chooseHttp=http:&courseType=NEW_COURSE_CENTER&eln_session_id=" +
          sessionId,
        {
          headers: {
            accept: "*/*",
            "accept-language":
              "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            pragma: "no-cache",
            "x-requested-with": "XMLHttpRequest",
          },
          referrer:
            "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
            courseId +
            "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
            sessionId,
          referrerPolicy: "strict-origin-when-cross-origin",
          body:
            "scoId=" +
            sid +
            "&courseId=" +
            courseId +
            "&firstLoad=false&location=" +
            ti +
            "&elsSign=" +
            sessionId +
            "&current_app_id=",
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      ).then((res) => {
        fetch(
          "http://e-learning.sinodata.net.cn/els/html/coursestudyrecord/coursestudyrecord.studyCheck.do?courseId=" +
            courseId +
            "&scoId=" +
            sid +
            "&eln_session_id=" +
            sessionId,
          {
            headers: {
              accept: "*/*",
              "accept-language":
                "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "cache-control": "no-cache",
              "content-type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              pragma: "no-cache",
              "x-requested-with": "XMLHttpRequest",
            },
            referrer:
              "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
              courseId +
              "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
              sessionId,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: "elsSign=" + sessionId,
            method: "POST",
            mode: "cors",
            credentials: "include",
          }
        ).then((res) => {
          fetch(
            "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.saveProgress.do?eln_session_id=" +
              sessionId +
              "&elsSign=" +
              sessionId,
            {
              headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language":
                  "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "cache-control": "no-cache",
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                pragma: "no-cache",
                "x-requested-with": "XMLHttpRequest",
              },
              referrer:
                "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
                courseId +
                "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
                sessionId,
              referrerPolicy: "strict-origin-when-cross-origin",
              body:
                "courseId=" +
                courseId +
                "&scoId=" +
                sid +
                "&progress_measure=8&session_time=0:0:" +
                ti +
                "&location=" +
                (ti - 3) +
                "&logId=&elsSign=" +
                sessionId +
                "&current_app_id=",
              method: "POST",
              mode: "cors",
              credentials: "include",
            }
          )
            .then((res) => res.json())
            .then(async (data) => {
              if (time === 1) {
                return;
              }
              if (itemIdx.index < itemlength) {
                itemIdx.index += 1;
              } else if (itemIdx.index >= itemlength) {
                await exitCourse(courseId);
                itemIdx.index = null;
              }
            });
        });
      });
    });
  }
  // 获取单个最小时间并且学习
  async function getScMinTimeThenDoa(courseId, sid) {
    console.log("学习单个", courseId);
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.selectResource.do?host=&vbox_server=http://21tb-video.21tb.com&fromNetWorkSetting=false&chooseHttp=http:&courseType=NEW_COURSE_CENTER&eln_session_id=" +
        sessionId,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=" +
          courseId +
          "&courseType=NEW_COURSE_CENTER&vb_server=http%3A%2F%2F21tb-video.21tb.com&eln_session_id=" +
          sessionId,
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          "scoId=" +
          sid +
          "&courseId=" +
          courseId +
          "&firstLoad=false&location=" +
          0 +
          "&elsSign=" +
          sessionId +
          "&current_app_id=",
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        let ti = data.minStudyTime * 60 + 0.01;
        doa(courseId, sid, ti, 1);
        sleep(200);
        doa(courseId, sid, ti, 2);
      });
  }

  // 进入课程
  async function enterCourse(courseId) {
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/user/canLearn.do?courseId=" +
        courseId,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.enableSignIn.do",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/course/course.checkUserCanStudyCourse.do",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "courseId=" + courseId + "&current_app_id=",
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.checkUserScoInitComplete.do",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "courseId=" + courseId + "&current_app_id=",
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/courseInfo/courseinfo.checkOlineUrlHttp.do",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "courseId=" + courseId + "&current_app_id=",
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/courseInfo/courseinfo.checkMsUrl.do",
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          "courseId=" +
          courseId +
          "&enterCourseUrl=http%3A%2F%2Fe-learning.sinodata.net.cn%2Fels%2Fhtml%2FstudyCourse%2FstudyCourse.enterCourse.do%3FcourseId%3D" +
          courseId +
          "%26courseType%3DNEW_COURSE_CENTER%26studyType%3DSTUDY",
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
  }

  // 学习课程
  async function studyCourse(item) {
    const { courseId } = item;
    _courseId = courseId;
    await $("#ncLoadingIcon")
      .html("")
      .load(
        "/els/html/courseStudyItem/courseStudyItem.loadCourseItemTree.do?eln_session_id=" +
          sessionId,
        {
          courseId: courseId,
          courseType: "NEW_COURSE_CENTER",
          courseStandard: "TWOSCREEN",
          elsSign: sessionId,
          current_app_id: "",
        }
      );
    await enterCourse(courseId);
    itemIdx.index = 0;
  }

  // 获取课程列表
  async function fetchStudyList() {
    doing = "hang";
    fetch(
      `http://e-learning.sinodata.net.cn/els/html/courseCenter/courseCenter.studyTaskList.do?courseType=${courseType}&page.pageSize=${pageSize}&page.sortName=STUDYTIME&courseStudyRecord.filterPartyClass=false&categoryId=&courseStudyRecord.getWay=&courseStudyRecord.srcName=&courseStudyRecord.courseStudyType=&courseStudyRecord.stepToGetScore=COURSE_EVALUATE&courseStudyRecord.courseStatus=${courseStatus}&courseStudyRecord.courseInfo.terminal=&page.pageNo=1&current_app_id=`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.rows.length) {
          const list = data.rows.filter((item) => {
            return item.courseStandard === "TWOSCREEN";
          });
          studyList = list;
          listIdx.idx = 0;
        }
      });
  }

  Object.defineProperty(listIdx, "idx", {
    get: function () {
      return idx;
    },
    set: function (newValue) {
      idx = newValue;
      if (newValue === null) {
        console.log(
          "===============================自动挂机完成,即将进入自动评论==================================="
        );
        fin();
        return;
      }
      console.log(`=============循环学习第${newValue}次=====================`);
      if (doing === "hang") {
        studyCourse(studyList[newValue]);
      }
    },
  });
  Object.defineProperty(itemIdx, "index", {
    get: function () {
      return index;
    },
    set: function (newValue) {
      index = newValue;
      if (newValue === null) {
        if (listIdx.idx >= studyList.length - 1) {
          // if (listIdx.idx >= 3) {
          listIdx.idx = null;
          return;
        }
        listIdx.idx += 1;
        return;
      }
      console.log(
        `====================学习第${newValue}个分段=======================`
      );
      let subsR = $(".cl-catalog-link-sub");
      itemlength = subsR.length - 1;
      let sub = subsR[newValue];
      if (doing === "hang") {
        getScMinTimeThenDoa(_courseId, sub.getAttribute("data-id"));
      }
    },
  });
  // 批量评论列表
  async function fin() {
    doing = "evaluation";
    fetch(
      `http://e-learning.sinodata.net.cn/els/html/courseCenter/courseCenter.studyTaskList.do?courseType=NEW_COURSE_CENTER&page.pageSize=80&page.sortName=STUDYTIME&courseStudyRecord.filterPartyClass=false&categoryId=&courseStudyRecord.getWay=&courseStudyRecord.srcName=&courseStudyRecord.courseStudyType=&courseStudyRecord.stepToGetScore=&courseStudyRecord.courseStatus=STUDY&courseStudyRecord.courseInfo.terminal=&page.pageNo=1&current_app_id=
    `,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((r) => {
        finList = r.rows.filter((item) => {
          return item.currentStepRate === "100";
        });
        finIdx.finidx = 0;
      });
  }
  // 单个评分及评价
  async function eva(cid) {
    //评分
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.saveOnLineCourseStar.do?eln_session_id=" +
        sessionId +
        "&elsSign=" +
        sessionId,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.enterCourse.do?courseId=" +
          cid +
          "&courseType=NEW_COURSE_CENTER&studyType=STUDY",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: "star=5&courseId=" + cid,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    //评价
    await fetch(
      "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.saveCourseEvaluate.do?eln_session_id=" +
        sessionId +
        "&elsSign=" +
        sessionId,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          pragma: "no-cache",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "http://e-learning.sinodata.net.cn/els/html/studyCourse/studyCourse.enterCourse.do?courseId=" +
          cid +
          "&courseType=NEW_COURSE_CENTER&studyType=STUDY",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          "willGoStep=COURSE_EVALUATE&answers=%5B%7B%22name%22%3A%223a3380f2948e412ab8acbca14bdfe26d%22%2C%22value%22%3A%22%E5%8C%97%E4%BA%AC%E4%B8%AD%E7%A7%91%E9%87%91%E8%B4%A2%E7%A7%91%E6%8A%80%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E6%88%90%E7%AB%8B%E4%BA%8E2003%E5%B9%B412%E6%9C%88%EF%BC%8C%E6%98%AF%E5%9B%BD%E5%86%85%E9%A2%86%E5%85%88%E7%9A%84%E5%8C%BA%E5%9D%97%E9%93%BE%E6%8A%80%E6%9C%AF%E4%B8%8E%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80%E7%BB%BC%E5%90%88%E6%9C%8D%E5%8A%A1%E5%95%86%EF%BC%8C%E8%87%B4%E5%8A%9B%E4%BA%8E%E6%89%93%E9%80%A0%E9%A2%86%E5%85%88%E7%9A%84%E4%BA%A7%E4%B8%9A%E4%BA%92%E8%81%94%E7%BD%91%E7%A7%91%E6%8A%80%E8%B5%8B%E8%83%BD%E5%B9%B3%E5%8F%B0%E3%80%822012%E5%B9%B42%E6%9C%8828%E6%97%A5%E5%85%AC%E5%8F%B8%E5%9C%A8%E6%B7%B1%E5%9C%B3%E8%AF%81%E5%88%B8%E4%BA%A4%E6%98%93%E6%89%80%E6%88%90%E5%8A%9F%E4%B8%8A%E5%B8%82%EF%BC%88%E8%82%A1%E7%A5%A8%E4%BB%A3%E7%A0%81%EF%BC%9A002657%EF%BC%89%EF%BC%8C%E6%98%AF%E2%80%9C%E4%B8%AD%E5%9B%BD%E8%BD%AF%E4%BB%B6%E5%92%8C%E4%BF%A1%E6%81%AF%E6%9C%8D%E5%8A%A1%E4%B8%9A%E5%8D%81%E5%A4%A7%E9%A2%86%E5%86%9B%E4%BC%81%E4%B8%9A%E2%80%9D%E3%80%81%E2%80%9C%E9%AB%98%E6%96%B0%E6%8A%80%E6%9C%AF%E4%BC%81%E4%B8%9A%E2%80%9D+%E3%80%81%E2%80%9C%E4%B8%AD%E5%9B%BD%E6%94%AF%E4%BB%98%E6%B8%85%E7%AE%97%E5%8D%8F%E4%BC%9A%E4%BC%9A%E5%91%98%E2%80%9D%E3%80%81%E2%80%9C%E5%8C%97%E4%BA%AC%E5%B8%82%E4%BC%81%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%B8%AD%E5%BF%83%E2%80%9D%E3%80%81%E2%80%9C%E5%8C%97%E4%BA%AC%E5%8C%BA%E5%9D%97%E9%93%BE%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E5%8D%8F%E4%BC%9A%E4%BC%9A%E9%95%BF%E5%8D%95%E4%BD%8D%E2%80%9D%E3%80%81%E2%80%9C%E5%9B%BD%E5%AE%B6%E7%81%AB%E7%82%AC%E8%AE%A1%E5%88%92%E4%BA%A7%E4%B8%9A%E5%8C%96%E7%A4%BA%E8%8C%83%E9%A1%B9%E7%9B%AE%E2%80%9D+%E3%80%82+%5Cr%5Cn%E4%BB%A5%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E4%B8%8E%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%BF%83%E7%BB%BC%E5%90%88%E6%9C%8D%E5%8A%A1%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E4%B8%AD%E7%A7%91%E9%87%91%E8%B4%A2%E6%B7%B1%E8%80%95%E9%87%91%E8%9E%8D%E3%80%81%E6%94%BF%E5%BA%9C%E3%80%81%E6%95%99%E8%82%B2%E7%AD%89%E8%A1%8C%E4%B8%9A%E7%94%A8%E6%88%B7%EF%BC%8C%E7%9B%AE%E5%89%8D%E5%B7%B2%E4%B8%BA%E4%BA%BA%E6%B0%91%E9%93%B6%E8%A1%8C%E3%80%81%E9%93%B6%E4%BF%9D%E7%9B%91%E4%BC%9A%E3%80%81%E8%AF%81%E7%9B%91%E4%BC%9A%E3%80%81%E9%93%B6%E8%81%94%E3%80%81%E9%93%B6%E8%A1%8C%E9%97%B4%E4%BA%A4%E6%98%93%E5%95%86%E5%8D%8F%E4%BC%9A%E3%80%81%E6%94%AF%E4%BB%98%E6%B8%85%E7%AE%97%E5%8D%8F%E4%BC%9A%E5%8F%8A%E8%BF%91600%E5%AE%B6%E9%93%B6%E8%A1%8C%E9%87%91%E8%9E%8D%E6%9C%BA%E6%9E%84%E6%80%BB%E9%83%A8%E5%AE%A2%E6%88%B7%E6%8F%90%E4%BE%9B%E6%9C%8D%E5%8A%A1%E3%80%82%5Cr%5Cn%E4%B8%AD%E7%A7%91%E9%87%91%E8%B4%A2%E8%87%B4%E5%8A%9B%E4%BA%8E%E6%88%90%E4%B8%BA%E9%A2%86%E5%85%88%E7%9A%84%E4%BA%A7%E4%B8%9A%E4%BA%92%E8%81%94%E7%BD%91%E7%A7%91%E6%8A%80%E8%B5%8B%E8%83%BD%E5%B9%B3%E5%8F%B0%EF%BC%8C%E5%85%AC%E5%8F%B8%E9%9D%A2%E5%90%91%E6%94%BF%E5%BA%9C%E7%9B%91%E7%AE%A1%E9%83%A8%E9%97%A8%E3%80%81%E9%87%91%E8%9E%8D%E6%9C%BA%E6%9E%84%E3%80%81%E4%BA%A7%E4%B8%9A%E4%BA%92%E8%81%94%E7%BD%91%E3%80%81%E5%B7%A5%E4%B8%9A%E4%BA%92%E8%81%94%E7%BD%91%E7%94%A8%E6%88%B7%E6%8F%90%E4%BE%9B%E5%9F%BA%E4%BA%8E%E5%8C%BA%E5%9D%97%E9%93%BEBaaS%EF%BC%88%E5%8C%BA%E5%9D%97%E9%93%BE%E5%8D%B3%E6%9C%8D%E5%8A%A1%EF%BC%89%E5%B9%B3%E5%8F%B0%E4%B8%8E%E5%A4%9A%E6%96%B9%E5%AE%89%E5%85%A8%E8%AE%A1%E7%AE%97%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%8A%80%E6%9C%AF%E6%9C%8D%E5%8A%A1%EF%BC%8C%E4%BB%A5%E8%A7%A3%E5%86%B3%E9%98%B2%E7%AF%A1%E6%94%B9%E3%80%81%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4%E3%80%81%E5%8F%AF%E8%BF%BD%E6%BA%AF%E7%AD%89%E7%97%9B%E7%82%B9%E3%80%82%5Cr%5Cn%E5%A7%8B%E4%BA%8E%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80%EF%BC%8C%E6%94%BE%E7%9C%BC%E4%BB%B7%E5%80%BC%E4%BA%92%E8%81%94%E3%80%82%E6%9C%AA%E6%9D%A5%EF%BC%8C%E4%B8%AD%E7%A7%91%E9%87%91%E8%B4%A2%E5%B0%86%E4%BB%A5%E5%8C%BA%E5%9D%97%E9%93%BEBAAS%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E3%80%81%E5%A4%9A%E6%96%B9%E5%AE%89%E5%85%A8%E8%AE%A1%E7%AE%97%E5%B9%B3%E5%8F%B0%E3%80%81%E5%8C%BA%E5%9D%97%E9%93%BE%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E4%BB%A5%E7%A7%91%E6%8A%80%E6%9C%8D%E5%8A%A1%E9%87%91%E8%9E%8D%E5%92%8C%E7%9B%91%E7%AE%A1%EF%BC%8C%E6%90%BA%E6%89%8B%E5%90%88%E4%BD%9C%E4%BC%99%E4%BC%B4%EF%BC%8C%E6%B7%B1%E8%80%95%E8%A1%8C%E4%B8%9A%E5%9C%BA%E6%99%AF%EF%BC%8C%E5%B8%AE%E5%8A%A9%E4%BA%A7%E4%B8%9A%E5%AE%A2%E6%88%B7%E5%AE%9E%E7%8E%B0%E4%BB%8EIT%E5%88%B0DT%E5%88%B0AT%E7%9A%84%E6%8A%80%E6%9C%AF%E5%8D%87%E7%BA%A7%E3%80%82%22%7D%2C%7B%22name%22%3A%22fe6fc2682b5f462fbefc9f34c0475d1c%22%2C%22value%22%3A%22%22%7D%2C%7B%22name%22%3A%220538f8975d5945259911fd425e3ec55a%22%2C%22value%22%3A%22%22%7D%5D&courseId=" +
          cid +
          "&courseType=NEW_COURSE_CENTER",
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    if (finIdx.finidx < finList.length - 1) {
      finIdx.finidx += 1;
      return;
    } else {
      finIdx.finidx = null;
    }
  }

  Object.defineProperty(finIdx, "finidx", {
    get: function () {
      return index;
    },
    set: function (newValue) {
      index = newValue;
      if (finIdx.finidx === null) {
        alert("评论完成，请刷新页面");
        return;
      }
      console.log(
        `===============评论第${finIdx.finidx}条====================`
      );
      if (doing === "evaluation") {
        eva(finList[finIdx.finidx].courseId);
      }
    },
  });
  window.onload = function () {
    const body = document.getElementsByTagName("body")[0];
    const box = document.createElement("div");
    const header = document.createElement("div");

    box.style = `height: 360px;
      width: 200px;
      background: rgb(204, 221, 255,0.5);
      color: rgb(0, 0, 0);
      position: fixed;
      top: 100px;`;
    header.innerHTML = `<div>点击开始挂机将进行一键挂机并自动评论</br>
    </br>刷新页面则自动挂机停止</br>
    可点击自动评论对已完成课程单独自动评价
    <p style="color:#8a00e6">重庆团队出品，必属精品</p>
      </div>`;
    const footer = document.createElement("div");
    footer.innerHTML = `<div style="color:red">免责申明：</br>本脚本仅供内部学习、分享与交流</br>
  我们不保证内容的正确性</br>
    没有破解及修改任何web程序</br>
    也没有侵犯web版权及知识产权</br>
    因系统打点导致账户封禁与我们无关，请合理使用！！</br>
    如你使用代表已知晓并同意该申明。
    </div>`;
    const btn = document.createElement("button");
    const evaluation = document.createElement("button");
    btn.innerText = "开始挂机";
    evaluation.innerText = "开始评价";
    const style = `
    width: 100%;line-height: 1.5715;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    box-shadow: 0 2px #00000004;
    cursor: pointer;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 2px;
    color: #000000d9;
    border-color: #d9d9d9;
    background: #fff;`;
    btn.style = style;
    evaluation.style = style;
    btn.addEventListener("click", () => {
      console.log("开始挂机");
      fetchStudyList();
    });
    evaluation.addEventListener("click", () => {
      console.log("开始评价");
      fin();
    });
    box.appendChild(header);
    box.appendChild(btn);
    box.appendChild(evaluation);
    box.appendChild(footer);
    body.appendChild(box);
  };
  // Your code here...
})();
