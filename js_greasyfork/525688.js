// ==UserScript==
// @name        Elective网站课程冲突高亮
// @namespace   https://greasyfork.org/users/1429968
// @version     0.3
// @description 分析已选课程与所有课程的时间冲突，并用颜色标记
// @author      ha0xin
// @match       https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseQuery/*
// @match       https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electivePlan/*
// @match       https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electiveWork/*
// @exclude     https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseQuery/goNested.do*
// @license     MIT License
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525688/Elective%E7%BD%91%E7%AB%99%E8%AF%BE%E7%A8%8B%E5%86%B2%E7%AA%81%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525688/Elective%E7%BD%91%E7%AB%99%E8%AF%BE%E7%A8%8B%E5%86%B2%E7%AA%81%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------------------- 工具函数 ----------------------
  // 解析单条时间信息（如："每周周一3~4节"）
  function parseTimeSegment(text) {
    const weekTypeMatch = text.match(/(每周|单周|双周)/);
    const weekType = weekTypeMatch ? weekTypeMatch[1] : "每周";

    const dayMatch = text.match(/周([一二三四五六日])/);
    const dayMap = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 7 };
    const day = dayMap[dayMatch?.[1]] || null;

    const sectionMatch = text.match(/(\d+)~(\d+)节/);
    const sections = [];
    if (sectionMatch) {
      const start = parseInt(sectionMatch[1], 10);
      const end = parseInt(sectionMatch[2], 10);
      for (let i = start; i <= end; i++) sections.push(i);
    }

    return { weekType, day, sections };
  }

  // 解析完整的课程时间信息（可能包含多个时间段）
function parseCourseTime(cell) {
  if (!cell) {
    console.error("Cell is undefined or null");
    return [];
  }
  const timeSegments = [];
  const html = cell.innerHTML.replace(/<br>/g, "|");
  const texts = html.split("|").filter((t) => t.trim());

  texts.forEach((text) => {
    const cleanText = text.replace(/周数信息.*?节/g, "");
    const segment = parseTimeSegment(cleanText);
    if (segment.day && segment.sections.length > 0) {
      timeSegments.push(segment);
    }
  });

  return timeSegments;
}

  // 检查两个时间段是否冲突
  function isConflict(seg1, seg2) {
    // 周类型兼容性检查
    const weekConflict = seg1.weekType === "每周" || seg2.weekType === "每周" || seg1.weekType === seg2.weekType;

    return weekConflict && seg1.day === seg2.day && seg1.sections.some((s) => seg2.sections.includes(s));
  }

  // 检查课程间的所有时间段冲突
  function checkCoursesConflict(courses, selectedCourses) {
    const conflicts = new Map();

    courses.forEach((course) => {
      selectedCourses.forEach((selectedCourse) => {
        course.timeSegments.forEach((seg1) => {
          selectedCourse.timeSegments.forEach((seg2) => {
            if (isConflict(seg1, seg2)) {
              if (!conflicts.has(course.element)) {
                conflicts.set(course.element, []);
              }
              conflicts.get(course.element).push(selectedCourse.name);
            }
          });
        });
      });
    });

    return conflicts;
  }

  // ---------------------- 数据获取与处理 ----------------------
  // 通用的数据提取函数
function extractCoursesFromPage(parent, timeColumnIndex, nameColumnIndex) {
  const rows = parent.querySelectorAll("table.datagrid tr[class*='datagrid-']");
  const allCourses = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length > timeColumnIndex) {
      const timeCell = cells[timeColumnIndex];
      if (timeCell) {
        const timeSegments = parseCourseTime(timeCell);
        if (timeSegments.length > 0) {
          allCourses.push({
            element: row,
            name: cells[nameColumnIndex].textContent.trim(),
            timeSegments: timeSegments,
          });
        }
      }
    }
  });

  return allCourses;
}
  // 从已选课程页面提取时间信息
  function extractSelectedCourses() {
    const rows = document.querySelectorAll("table.datagrid tr[class*='datagrid-']");
    const selectedCourses = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const timeCell = cells[7]; // 第8列是时间信息
      const timeSegments = parseCourseTime(timeCell);
      if (timeSegments.length > 0) {
        selectedCourses.push({
          element: row,
          name: cells[0].textContent.trim(),
          timeSegments: timeSegments,
        });
      }
    });

    return selectedCourses;
  }

  // ---------------------- 高亮冲突课程 ----------------------
  function highlightConflicts(allCourses, conflictElements, courseNameColumnIndex) {
    allCourses.forEach((course) => {
      const courseElement = course.element.querySelector(`td:nth-child(${courseNameColumnIndex + 1})`);
      if (conflictElements.has(course.element)) {
        courseElement.style.backgroundColor = "#ffcccc";
        const conflictingCourses = conflictElements.get(course.element).join(", ");
        courseElement.title = `与以下课程冲突: ${conflictingCourses}`;
      } else {
        courseElement.style.backgroundColor = "#ccffcc";
        courseElement.title = "";
      }
    });
  }

  // ---------------------- 主逻辑 ----------------------
  function analyzeConflicts() {
    // 判断当前页面类型
    const isResultPage = window.location.href.includes("showResults.do");
    const isQueryPage =
      window.location.href.includes("CourseQueryController.jpf") ||
      window.location.href.includes("getCurriculmByForm.do") ||
      window.location.href.includes("queryCurriculum.jsp") ||
      window.location.href.includes("engGridFilter.do");
    const isPlanPage = window.location.href.includes("ElectivePlanController.jpf");
    const isWorkPage =
      window.location.href.includes("ElectiveWorkController.jpf") || window.location.href.includes("election.jsp");

    if (isResultPage) {
      // 已选课程页面：提取数据并存储
      console.log("已选课程页面");
      const selectedCourses = extractSelectedCourses();
      GM_setValue("selectedCourses", JSON.stringify(selectedCourses));
      console.log("已选课程数据已存储", selectedCourses);
      return;
    }

    // 那么，剩下的页面类型就是添加课程页面、选课计划页面和预选页面了
    const selectedCourses = JSON.parse(GM_getValue("selectedCourses", "[]"));
    console.log(selectedCourses);

    if (selectedCourses.length === 0) {
      console.log("未找到已选课程数据，请先访问已选课程页面");
      return;
    }

    let courseNameColumnIndex;
    let courseTimeColumnIndex;
    let parent;

    if (isQueryPage) {
      // 添加课程页面：获取已选课程数据并比对冲突
      console.log("添加课程页面");
      // 取一下表头，看看里面的<th>是否有id为engfilterForm的<form>，如果有，就是英语课查询页面
      const tableHeader = document.querySelector("table.datagrid tr[class*='datagrid-']");
      const isEngQueryPage = tableHeader.querySelector("th > form#engfilterForm") !== null;
      console.log("isEngQueryPage", isEngQueryPage);
      courseNameColumnIndex = 1;
      courseTimeColumnIndex = isEngQueryPage ? 10 : 9;
      parent = document;
    } else if (isPlanPage) {
      // 选课计划页面
      console.log("选课计划页面");
      courseNameColumnIndex = 1;
      courseTimeColumnIndex = 8;
      parent = document;
    } else if (isWorkPage) {
      // 预选页面
      console.log("预选页面");

      const trs = document.querySelectorAll("#scopeOneSpan > table > tbody > tr");
      const targetTr = Array.from(trs).find((tr) => tr.textContent.includes("选课计划中本学期可选列表"));

      if (!targetTr) {
        console.warn('未找到包含"选课计划中本学期可选列表"的行');
        return [];
      }

      const nextTr = targetTr.nextElementSibling;
      if (!nextTr) {
        console.warn("未找到下一个表格行");
        return [];
      }

      courseNameColumnIndex = 0;
      courseTimeColumnIndex = 8;
      parent = nextTr;
    }

    const allCourses = extractCoursesFromPage(parent, courseTimeColumnIndex, courseNameColumnIndex);
    const conflictElements = checkCoursesConflict(allCourses, selectedCourses);

    highlightConflicts(allCourses, conflictElements, courseNameColumnIndex);
  }

  // ---------------------- 执行 ----------------------
  if (document.readyState === "complete") {
    analyzeConflicts();
  } else {
    window.addEventListener("load", analyzeConflicts);
  }
})();
