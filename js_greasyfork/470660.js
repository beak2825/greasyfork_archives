/*! 
// ==UserScript==
// @name		TaskMarking
// @description		自动打分
// @author		Yiero
// @version		2.0.0
// @match		https://lms.ouchn.cn/exam/*
// @require		https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.min.js
// @icon		https://lms.ouchn.cn/favicon.ico
// @namespace		https://github.com/AliubYiero/TemperScripts
// @license		GPL
// @downloadURL https://update.greasyfork.org/scripts/470660/TaskMarking.user.js
// @updateURL https://update.greasyfork.org/scripts/470660/TaskMarking.meta.js
// ==/UserScript==
 */
let courseId;
let examineeId;
let submissionId;
let instanceId;
let subjectId;
function api_getScoreList() {
  courseId = location.pathname.split("/")[2];
  examineeId = location.hash.match(/\/(\d*?)\?/)[1];
  return axios.get(`https://lms.ouchn.cn/api/exams/${courseId}/score-list?conditions=%7B%22examinee_ids%22%3A%5B%22${examineeId}%22%5D%7D`).then(
    (res) => {
      examineeId = res.data.examinees[0].id;
      console.info("examineeId", examineeId);
      submissionId = res.data.examinees[0].submissions[0].id;
      console.info("submissionId", submissionId);
      return res;
    }
  ).catch(
    (error) => {
      console.error(error);
    }
  );
}
function api_getSubmissions() {
  return axios.get(`https://lms.ouchn.cn/api/exams/${courseId}/submissions/${submissionId}`).then(
    (res) => {
      console.info(res);
      instanceId = res.data.instance_id;
      console.info("instanceId", instanceId);
      subjectId = res.data.submission_data.subjects[0].subject_id;
      console.info("subjectId", subjectId);
      return res;
    }
  ).catch(
    (error) => {
      console.error(error);
    }
  );
}
function api_giveScore(score) {
  return axios.post(`https://lms.ouchn.cn/api/exams/${courseId}/give-score`, {
    "examinee_id": examineeId,
    "graded_subjects": [
      {
        "subject_id": subjectId,
        "score": String(score),
        "instance_id": instanceId,
        "parent_id": null
      }
    ],
    "submission_id": submissionId
  });
}
function giveScore(score) {
  return api_getScoreList().then(
    () => {
      api_getSubmissions().then(
        () => {
          api_giveScore(score).then(
            (res) => res
          );
        }
      );
    }
  );
}
class Sleep {
  /** 延时睡眠等待 */
  static time(delay = 1) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay * 1e3);
    });
  }
  /** 页面加载等待 */
  static windowLoad(delay = 0) {
    return new Promise((resolve) => {
      window.addEventListener("load", () => {
        setTimeout(resolve, delay * 1e3);
      });
    });
  }
}
function getRandomMath(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function FreshListenerHash(callback, delay = 1) {
  window.addEventListener("hashchange", () => {
    setTimeout(callback, delay * 1e3);
  });
}
function goNextExam() {
  const submitBtn = document.querySelector('[ng-class="nextOne()"]');
  if (submitBtn.className.match("unclickable")) {
    console.warn("已经是最后一项了，请等待1分钟后，重新检查未提交的分数");
  }
  submitBtn.click();
}
(async () => {
  await Sleep.windowLoad(5);
  function setScore() {
    const score = getRandomMath(90, 100);
    console.info("获取随机分数" + score);
    console.info("正在输入分数");
    giveScore(score).then(
      (res) => {
        console.info("输入分数成功");
        console.info(res);
        goNextExam();
      }
    );
  }
  function sendScore() {
    setScore();
    setScore();
  }
  sendScore();
  FreshListenerHash(() => {
    console.info("页面更新");
    sendScore();
  });
})();
