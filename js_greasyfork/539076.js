// ==UserScript==
// @name         四川职业技术学院继续教育学院自动学习脚本
// @version      1.0.5
// @namespace    http://tampermonkey.net/
// @description  定制脚本
// @author       You
// @license      MIT
// @match        https://sczyjsxy.wdxuetang.cn/student/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wdxuetang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539076/%E5%9B%9B%E5%B7%9D%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539076/%E5%9B%9B%E5%B7%9D%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const log = console.log;
  if (!getCookie("targetLearlingTime")) {
    const time = Math.random() * (2 * 60) + 10 * 60;
    updateLearningTimeCookie(time);
  }
  let targetLearlingTime = parseInt(getCookie("targetLearlingTime"));

  console.log = function (...args) {
    log(...args);
    if (document.getElementById("loglist")) {
      document.getElementById("loglist").innerHTML =
        args.join(" ") +
        "<br>" +
        document.getElementById("loglist").innerHTML.split("<br>").slice(0, 5000).join("<br>");
    }
  };

  async function updateVideoProcess(duration, courseArrangeId, courseId, prevPlayTime = 0, round = 1) {
    let success = true;

    if (prevPlayTime === 0) {
      console.log(`请求服务器课程进度 ${courseArrangeId}`);
      prevPlayTime = await getInitTime(courseId, courseArrangeId);
      const process = Math.floor((prevPlayTime / duration) * 100);
      console.log(`请求服务器课程进度 ${courseArrangeId} ${process}%`);
      document.querySelector(".xy-box .progress").value = process;
    }

    let incrementalTime = Math.floor(Math.random() * 10) + 20;
    let playTime = Math.round((prevPlayTime + incrementalTime) * 1e6) / 1e6 + 1;
    let isFinish = playTime >= duration;
    if (playTime > duration) {
      playTime = duration;
    }
    if (window.stops) {
      throw new Error("stop");
    }

    const arrs = [];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 秒超时

    // 每 4 次发送一次 learnLog
    if (round % 4 === 0 || isFinish) {
      arrs.push(
        fetch("https://student.wdxuetang.cn/cgi-bin/api/lessons/student/learnLog", {
          headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
            studenttoken: getCookie("StudentToken"),
          },
          referrer: "https://sczyjsxy.wdxuetang.cn/",
          body: JSON.stringify({
            courseArrangeId,
            courseId,
            timePoint: playTime,
          }),
          signal: controller.signal,
          method: "POST",
          mode: "cors",
          credentials: "omit",
        })
      );
    }

    arrs.push(
      fetch("https://student.wdxuetang.cn/cgi-bin/api/lessons/student/course/updatePlay", {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json;charset=UTF-8",
          studenttoken: getCookie("StudentToken"),
        },
        referrer: "https://sczyjsxy.wdxuetang.cn/",
        body: JSON.stringify({
          courseArrangeId,
          courseId,
          isFinish,
          playTime,
          lastPlayTime: playTime,
          incrementalTime,
        }),
        method: "POST",
        mode: "cors",
        credentials: "omit",
      })
    );
    try {
      await Promise.all(arrs);
    } catch (e) {}

    clearTimeout(timeout); // 请求成功，清除超时定时器

    const process = Math.floor((playTime / duration) * 100);
    console.log(`更新学习进度 ${courseArrangeId} ${process}%`);
    document.querySelector(".xy-box .progress").value = process;

    if (isFinish) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (await checkIsFinish(courseId, courseArrangeId)) {
        console.log(`课程学习完成 ${courseArrangeId}`);
      } else {
        console.log(`学习状态未更新，同步服务器学习进度 ${courseArrangeId}`);
        await updateVideoProcess(duration, courseArrangeId, courseId, 0, 1);
      }
    } else {
      await updateVideoProcess(duration, courseArrangeId, courseId, playTime, round + 1);
    }
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function getWorklist(courseId) {
    try {
      const data = await (
        await fetch(`https://student.wdxuetang.cn/cgi-bin/api/lessons/student/course/catalogue/${courseId}`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            studenttoken: getCookie("StudentToken"),
          },
          referrer: "https://sczyjsxy.wdxuetang.cn/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        })
      ).json();
      return data.data.filter((item) => !item.isPlayFinish && item.duration && item.courseHourName);
    } catch (err) {
      return [];
    }
  }

  async function checkIsFinish(courseId, courseArrangeId) {
    try {
      const data = await (
        await fetch(`https://student.wdxuetang.cn/cgi-bin/api/lessons/student/course/catalogue/${courseId}`, {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            studenttoken: getCookie("StudentToken"),
          },
          referrer: "https://sczyjsxy.wdxuetang.cn/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        })
      ).json();
      return data.data.find((item) => item.id == courseArrangeId)?.isPlayFinish || false;
    } catch (err) {
      return false;
    }
  }

  async function getInitTime(courseId, courseArrangeId) {
    console.log(`请求课程进度 ${courseArrangeId}`);
    await fetch(
      `https://student.wdxuetang.cn/cgi-bin/api/lessons/student/course/getLatestPlayTimeByArrangeId/${courseId}/${courseArrangeId}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          studenttoken: getCookie("StudentToken"),
        },
        referrer: "https://sczyjsxy.wdxuetang.cn/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );

    await fetch(`https://student.wdxuetang.cn/cgi-bin/api/lessons/student/course/course/${courseArrangeId}`, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        studenttoken: getCookie("StudentToken"),
      },
      referrer: "https://sczyjsxy.wdxuetang.cn/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });

    const data = await (
      await fetch(
        `https://student.wdxuetang.cn/cgi-bin/api/lessons/student/course/getCourseHourDetail/${courseId}/${courseArrangeId}`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            studenttoken: getCookie("StudentToken"),
          },
          referrer: "https://sczyjsxy.wdxuetang.cn/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        }
      )
    ).json();
    return data.data.payTime;
  }

  async function getMyCourse(retries = 50) {
    const fetchCourse = async (testType) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 秒超时
      const res = await fetch(
        `https://student.wdxuetang.cn/cgi-bin/api/lessons/student/learningCenter/myCourse?testType=${testType}`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            studenttoken: getCookie("StudentToken"),
          },
          signal: controller.signal,
          referrer: "https://sczyjsxy.wdxuetang.cn/",
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "GET",
          mode: "cors",
          credentials: "omit",
        }
      );
      clearTimeout(timeout);
      const res_1 = await res.json();
      return res_1.data;
    };

    try {
      const res = await Promise.all([fetchCourse(false), fetchCourse(true)]);
      return res.flat(2);
    } catch (err) {
      if (retries <= 0) throw err;
      return getMyCourse(retries - 1);
    }
  }

  async function start(course) {
    console.log(`获取到科目列表 ${course.length}`);
    console.log(course.map((item) => item.subjectName).join("\n"));
    for (let i = 0; i < course.length; i++) {
      if (course[i].finishRate === 100) {
        console.log(`科目 ${course[i].subjectName} 已完成，跳过`);
        continue;
      }
      console.log(`开始学习科目 ${course[i].subjectName} ${i + 1}/${course.length}`);
      document.querySelector(".xy-box .class").innerHTML = course[i].subjectName;
      const courseId = course[i].id;
      const list = await getWorklist(courseId);
      console.log(list.map((item) => item.courseHourName).join("\n"));
      for (let index = 0; index < list.length; index++) {
        console.log(
          `开始学习课程 ${list[index].courseHourName} (${formatMinutes(list[index].duration / 60)}) ${index + 1}/${
            list.length
          }`
        );
        document.querySelector(".xy-box .process").innerHTML = list[index].courseHourName;
        document.querySelector(".xy-box .progress").value = 0;
        await updateVideoProcess(list[index].duration, list[index].id, courseId, 0);
        await updateLearningTime();
      }
    }
    alert("已完成所有科目的学习！");
  }

  async function initHtml() {
    const html = `<div class="xy-box" style="display: flex;max-width: 340px; flex-direction: column; justify-content: center; align-items: flex-start;height: calc(100vh - 70px);  overflow: auto;position: fixed;z-index: 999;background-color: #242936; color:#ffffff;padding:10px;border-radius: 8px;top: 70px;left: 0;">
    <button class="start">初始化中，请稍等...</button>
    <p>学习时间：<span class="learningTime"></span>/<span class="targetLearningTime">${formatMinutes(
      targetLearlingTime
    )}</span></p>
    <p>当前学科：<span class="class"></span></p>
    <p>当前课程：<span class="process"></span></p>
    <p>学习进度：<progress class="progress" value="0" max="100"></progress></p>
    <p>课程列表：</p>
    <br/>
    <ul style="color: #ffffff;height: 30%; max-width: 320px ;overflow: auto;" id="list">
    </ul>
    <br/>
    <p>工作日志：</p>
    <br/>
    <pre style="color: #ffffff;height: 70%; max-width: 320px ;overflow: auto;" id="loglist" >
    </pre>
  </div>`;
    document.body.insertAdjacentHTML("afterbegin", html);
    try {
      const course = await getMyCourse();
      const learningTime = await getStudentTime();
      document.querySelector(".start").innerHTML = "开始学习";
      course.forEach((item) => {
        document.querySelector(".xy-box #list").insertAdjacentHTML("beforeend", `<li>${item.subjectName}</li>`);
      });
      document.querySelector(".learningTime").innerHTML = formatMinutes(learningTime);
      document.querySelector(".start").addEventListener("click", async function () {
        const hour = Math.floor(learningTime / 60);

        if (learningTime >= targetLearlingTime) {
          if (!window.confirm(`今日已超过目标学习时间，是否增加一小时学习时间？`)) {
            return;
          } else {
            targetLearlingTime += 60;
            document.querySelector(".targetLearningTime").innerHTML = formatMinutes(targetLearlingTime);
            updateLearningTimeCookie(targetLearlingTime);
          }
        }

        if (hour >= 12) {
          if (!window.confirm(`今日已学习 ${hour} 小时，是否继续？`)) {
            return;
          }
        }
        console.log("开始学习");
        start(course);
        document.querySelector(".start").innerHTML = "已开始学习，停止请刷新页面";
        document.querySelector(".start").replaceWith(document.querySelector(".start").cloneNode(true));
      });
    } catch (err) {
      document.querySelector(".start").innerHTML = "脚本运行出现错误，请刷新页面";
    }
  }

  async function getStudentTime(retries = 50) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 秒超时
      const res = await (
        await fetch("https://student.wdxuetang.cn/cgi-bin/api/lessons/student/learningCenter/studyOverview", {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            studenttoken: getCookie("StudentToken"),
          },
          signal: controller.signal,
          referrer: "https://sczyjsxy.wdxuetang.cn/",
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "GET",
          mode: "cors",
          credentials: "omit",
        })
      ).json();
      clearTimeout(timeout);
      return res.data.todayStudyTime;
    } catch (err) {
      if (retries <= 0) throw err;
      return getStudentTime(retries - 1);
    }
  }

  function formatMinutes(minutes) {
    const total = Math.round(minutes); // 最终统一四舍五入
    const days = Math.floor(total / 1440);
    const hours = Math.floor((total % 1440) / 60);
    const mins = total % 60;

    const parts = [];
    if (days) parts.push(`${days}天`);
    if (hours) parts.push(`${hours}时`);
    if (mins || parts.length === 0) parts.push(`${mins}分钟`);

    return parts.join("");
  }

  async function updateLearningTime() {
    const time = await getStudentTime();
    document.querySelector(".learningTime").innerHTML = formatMinutes(time);
    if (time >= targetLearlingTime) {
      document.querySelector(".start").innerHTML = "已达到目标学习时间";
      setTimeout(() => {
        alert("已达到目标学习时间");
        location.reload();
      });
    }
  }

  function updateLearningTimeCookie(time) {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // 第二天
      0,
      0,
      0
    );
    document.cookie = `targetLearlingTime=${encodeURIComponent(time)}; expires=${midnight.toUTCString()}; path=/`;
  }

  initHtml();
})();
