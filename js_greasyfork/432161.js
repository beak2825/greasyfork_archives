// ==UserScript==
// @name         同步深大课表到小爱
// @namespace    sync-szu-ct-to-mi-ai
// @version      1.0
// @description  Sync your SZU course table to Mi AI
// @author       Strick Chan
// @match        *://ehall.szu.edu.cn/jwapp/sys/wdkb/*
// @grant        GM_xmlhttpRequest
// @connect      https://i.ai.mi.com
// @downloadURL https://update.greasyfork.org/scripts/432161/%E5%90%8C%E6%AD%A5%E6%B7%B1%E5%A4%A7%E8%AF%BE%E8%A1%A8%E5%88%B0%E5%B0%8F%E7%88%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/432161/%E5%90%8C%E6%AD%A5%E6%B7%B1%E5%A4%A7%E8%AF%BE%E8%A1%A8%E5%88%B0%E5%B0%8F%E7%88%B1.meta.js
// ==/UserScript==

/**
 * @typedef {{
 *   name: string;
 *   teacher: string;
 *   sections: string;
 *   weeks: string;
 *   day: number;
 *   position: string;
 *   style: {
 *     color: string;
 *     background: string;
 *   };
 * }} CourseInfo
 */

/**
 * @typedef {{
 *   userId: number;
 *   deviceid: string;
 *   ctId: number;
 * }} UserInfo
 */

/**
 * @typedef {{
 *   desc: string;
 *   data: any;
 *   code: number;
 * }} Result
 */

(function () {
  "use strict";

  const button = document.createElement("button");
  button.id = "sync_button";
  button.className = "bh-btn bh-btn-small bh-btn-default";
  button.textContent = "同步到小爱";
  button.addEventListener("click", async () => {
    const link = prompt("请输入小爱课程表的「分享课表」链接：");
    const user = parseUserInfo(link);

    if (confirm("该操作会清空小爱课程表中已有的内容，是否继续？")) {
      try {
        const courseIds = await getCourseIds(user);
        await Promise.all(courseIds.map((id) => delCourse(user, id)));

        const courses = parseCourses();
        await Promise.all(courses.map((course) => addCourse(user, course)));

        alert("操作成功");
      } catch (_) {
        alert("操作失败，请检查控制台日志并联系开发者");
      }
    }
  });

  const checkExist = setInterval(() => {
    if ($(".bh-buttons").length) {
      $(".bh-buttons").append(button);
      clearInterval(checkExist);
    }
  }, 100);
})();

const headers = {
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Origin": "https://i.ai.mi.com",
  "Host": "i.ai.mi.com",
};

/**
 * 获得所有已有的课程ID
 * @param {UserInfo} userInfo
 */
function getCourseIds(userInfo) {
  return new Promise((resolve, reject) => {
    const request = { ...userInfo };
    GM_xmlhttpRequest({
      url: `https://i.ai.mi.com/course-multi/table?${$.param(request)}`,
      method: "GET",
      headers,
      onload: (xhr) => {
        /** @type {Result} */
        const response = JSON.parse(xhr.responseText);
        console.log({ action: "getCourseIds", request, response });

        /** @type {number[]} */
        const courseIds = response.data.courses.map((item) => item.id);
        resolve(courseIds);
      },
      onerror: (err) => console.error(err),
    });
  });
}

/**
 * 删除一个课程记录
 * @param {UserInfo} userInfo
 * @param {number} courseId
 */
function delCourse(userInfo, courseId) {
  return new Promise((resolve, reject) => {
    const request = { ...userInfo, cId: courseId };
    GM_xmlhttpRequest({
      url: "https://i.ai.mi.com/course-multi/courseInfo",
      method: "DELETE",
      headers,
      data: JSON.stringify(request),
      onload: (xhr) => {
        /** @type {Result} */
        const response = JSON.parse(xhr.responseText);
        console.log({ action: "delCourse", request, response });

        /** @type {boolean} */
        const data = response.data;
        resolve(data);
      },
      onerror: (err) => console.error(err),
    });
  });
}

/**
 * 添加一个课程记录
 * @param {UserInfo} userInfo
 * @param {CourseInfo} courseInfo
 */
function addCourse(userInfo, courseInfo) {
  return new Promise((resolve, reject) => {
    const request = { ...userInfo, course: courseInfo };
    GM_xmlhttpRequest({
      url: "https://i.ai.mi.com/course-multi/courseInfo",
      method: "POST",
      headers,
      data: JSON.stringify(request),
      onload: (xhr) => {
        /** @type {Result} */
        const response = JSON.parse(xhr.responseText);
        console.log({ action: "addCourse", request, response });

        resolve(response.data);
      },
      onerror: (err) => console.error(err),
    });
  });
}

/**
 * 生成一个区间数组
 * @param {number} start
 * @param {number} end
 * @returns 区间数组 [start, end]
 */
function range(start, end) {
  return [...Array(end - start + 1).keys()].map((i) => i + start);
}

/**
 * 解析用户信息
 * @param {string} link
 */
function parseUserInfo(link) {
  const { searchParams } = new URL(
    link.replace("/#/", "/"),
  );

  /** @type {UserInfo} */
  const userInfo = {
    userId: parseInt(searchParams.get("userId")),
    deviceId: searchParams.get("deviceId"),
    ctId: parseInt(searchParams.get("ctId")),
  };

  return userInfo;
}

/**
 * 从网页解析课表信息
 */
function parseCourses() {
  /** @type {CourseInfo[]} */
  const courses = [];

  $(".mtt_arrange_item").each((_, card) => {
    /** @type {string} */
    const background = $(card)
      .attr("style").split(";")
      .filter((item) => item.includes("background-color"))[0]
      .split("background-color:")[1];

    /** @type {string[]} */
    const lines = [];

    $("div", card).each((_, line) => {
      lines.push($(line).text());
    });

    /** @type {CourseInfo} */
    const course = {
      name: lines[1],
      teacher: lines[2],
      sections: "",
      weeks: "",
      day: 0,
      position: "",
      style: JSON.stringify({ background, color: "#000000" }),
    };

    /** @type {string[]} */
    const tempWeeks = [];

    lines[3].split(",").forEach((item) => {
      if (item.includes("周")) {
        tempWeeks.push(item);
      } else if (item.includes("星期")) {
        course.day = parseInt(item.charAt(item.length - 1));
      } else if (item.includes("节")) {
        const [start, end] = item.replace("节", "").split("-");
        course.sections = range(parseInt(start), parseInt(end)).toString();
      } else {
        course.position = item;
      }
    });

    tempWeeks.forEach((item) => {
      if (item.includes("-")) {
        const filter = (() => {
          if (item.includes("单")) return (n) => n % 2 === 1;
          if (item.includes("双")) return (n) => n % 2 === 0;
          return (_) => true;
        })();
        const [start, end] = item.replace("周", "").split("-");
        const array = range(parseInt(start), parseInt(end)).filter(filter);
        course.weeks += (course.weeks !== "" ? "," : "") + array.toString();
      } else {
        course.weeks += (course.weeks !== "" ? "," : "") +
          item.replace("周", "");
      }
    });

    courses.push(course);
  });

  return courses;
}
