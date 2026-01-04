// ==UserScript==
// @name         南昌大学抢课
// @namespace    http://jwc104.ncu.edu.cn/
// @version      0.1.1
// @description  南昌大学套皮强智系统抢课
// @author       Pirnt
// @match        https://jwc104.ncu.edu.cn/jsxsd/xsxk/xklc_list?Ves632DSdyV=NEW_XSD_PYGL
// @match        https://jwc104.ncu.edu.cn/jsxsd/xsxk/xsxk_index?jx0502zbid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ncu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475002/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475002/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // ----- 需要配置的参数 -----
/* 需要抢的课程名称, 必修、选修、公选通用, 需要和教务系统上的课程名称完全一致 */
let COURSES = [
  "",
];
/* 需要抢的课程分组名称, 必修、选修、公选通用, 可以用于体育专项的抢课, 需要完全一致 */
let COURSE_GROUPS = [
  "男-气排球23.345.08医（李立业）",
  "男-网球23.345.05医"
];
/* 抢课间隔, 单位毫秒. 推荐数值: 抢课 100ms, 捡漏 500ms */
let INTERVAL_MS = 100;
/* 是否开启公选课抢课, 默认关闭, 以防止抢到课程名一样的公选课 */
let ENABLE_GGXXK = false;
// ------------------------

// 以下不需要修改

let mainInterval;
let targetCourses = [];

const start = () => {
  mainInterval = setInterval(handler, INTERVAL_MS);
  console.log("--- start grabbing courses ---");
};

const stop = () => {
  clearInterval(mainInterval);
  console.log("--- stop grabbing courses ---");
};

const handler = () => {
  if (targetCourses.length === 0) {
    getCourses();
  }

  console.log(
    `--- found ${targetCourses.length} courses ---`
  );

  let paths = [
    "/jsxsd/xsxkkc/xxxkOper", // 选修
    "/jsxsd/xsxkkc/bxxkOper", // 必修
  ];
  if (ENABLE_GGXXK) {
    paths.push("/jsxsd/xsxkkc/ggxxkxkOper"); // 公选
  }
  for (let course of targetCourses) {
    for (let path of paths) {
      $.get(path, course, console.log);
    }
  }
};

const getCourses = () => {
  let params = {
    sEcho: 1,
    iColumns: 11,
    iDisplayStart: 0,
    iDisplayLength: 999,
  };
  let paths = [
    "/jsxsd/xsxkkc/xsxkBxxk", // 必修
    "/jsxsd/xsxkkc/xsxkXxxk", // 选修
  ];
  if (ENABLE_GGXXK) {
    paths.push("/jsxsd/xsxkkc/xsxkGgxxkxk"); // 公选
  }
  for (let path of paths) {
    $.post(path, params, (data) => {
      let aaData = $.parseJSON(data).aaData;
      for (let course of aaData) {
        if (COURSES.includes(course.kcmc)) {
          targetCourses.push(course);
        } else if (COURSE_GROUPS.includes(course.fzmc)) {
          targetCourses.push(course);
        }
      }
    });
  }
};

//start();

})();