// ==UserScript==
// @name         课表助手 - xtu
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一键导出课表/考试安排为ics文件
// @author       DeltaX
// @match        http://jwxt.xtu.edu.cn/jsxsd/*
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        none
// @License      MIT
// @downloadURL https://update.greasyfork.org/scripts/410872/%E8%AF%BE%E8%A1%A8%E5%8A%A9%E6%89%8B%20-%20xtu.user.js
// @updateURL https://update.greasyfork.org/scripts/410872/%E8%AF%BE%E8%A1%A8%E5%8A%A9%E6%89%8B%20-%20xtu.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let SEPARATOR = navigator.appVersion.indexOf('Win') !== -1 ? '\r\n' : '\n';

  // 设置上课时间及下课时间
  let class_start_summer = [
    [],
    [8, 0],
    [9, 40],
    [10, 10],
    [11, 50],
    [14, 30],
    [16, 10],
    [16, 40],
    [18, 10],
    [19, 30],
    [22, 5]
  ];
  let class_start_winter = [
    [],
    [8, 0],
    [9, 40],
    [10, 10],
    [11, 50],
    [14, 0],
    [15, 40],
    [16, 10],
    [17, 40],
    [19, 0],
    [21, 35]
  ];
  let class_time = 100;
  // let weekToNum = { "日": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6 }
  let weekRegexp = /(?:(\d{1,2}-\d{1,2})|(\d{1,2})\(单周\))/g;
  let nowDate = new Date();
  let weekStartQuery = term =>
    new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://jwxt.xtu.edu.cn/jsxsd/jxzl/jxzl_query');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.withCredentials = true;
      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(
            /<tr height='28'><td>1<\/td><td title='(.*?)'>/.exec(
              this.response
            )[1]
          );
        } else {
          reject(this);
        }
      };
      xhr.send('xnxq01id=' + term);
    });
  let toString = function (date) {
    return (
      date
        .toISOString()
        .split(/-|:|[.]/)
        .slice(0, 4)
        .join('') + '00Z'
    );
  };

  // 生成课表日历文件
  function GenerateCourseICS() {
    // 获取main-->page_iframe-->iframe0
    let iframe0 = document.getElementById('Form1');
    // 添加按钮"保存ics"
    let buttonPre = iframe0.querySelector('select#xnxq01id');
    buttonPre.outerHTML +=
      ' <input type="button" onclick="saveics()" class="button" name="submit" value="保存ics">';
    if (typeof iframe0.saveics === 'function') return;
    // 添加按钮操作，核心部分
    iframe0.saveics = function () {
      window.console.log('开始生成...');
      if (
        navigator.userAgent.indexOf('MISE') > -1 &&
        navigator.userAgent.indexOf('MSIE 10') == -1
      ) {
        alert('浏览器不支持哦~😆');
        return;
      }
      let calendar_start = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:Curriculum-to-iCalendar'
      ].join(SEPARATOR);
      let calendar_end = SEPARATOR + 'END:VCALENDAR' + SEPARATOR;
      let calendarEvents = [];
      // 获取到课程表
      try {
        let table = document.querySelector('#kbtable').tBodies[0];
        let yearTerm = document
          .querySelector('#xnxq01id')
        [document.querySelector('#xnxq01id').selectedIndex].innerText.split(
          '-'
        );
        let year = yearTerm[0] + '-' + yearTerm[1];
        let term = yearTerm[2];
        // 请求起始周
        console.log('查询学期起始日期中，学期: ' + yearTerm.join('-'));
        weekStartQuery(yearTerm.join('-')).then(weekStart => {
          let termStartDate = new Date(weekStart.split(/年|月|日/));
          // let currentWeek = parseInt((nowDate - startDate) / 1000 * 60 * 60 * 24 * 7);
          // 逐行添加event至cal
          console.log('添加课程事件中...');
          for (let i = 1; i < table.rows.length - 1; i++) {
            // 逐课程添加
            // let timeAddress = table.rows[i].cells[0].innerText;
            // let events = timeAddress.split(' ').filter(n => n != " ");
            for (let j = 1; j < table.rows[i].cells.length; j++) {
              // 同一时间不同课程
              let lessonInfos = table.rows[i].cells[j].innerText.split(
                '---------------------\n'
              );
              for (let lesInfStr of lessonInfos) {
                let lessonInfo = lesInfStr.split('\n').filter(n => n !== '');
                // console.log(lessonInfo);
                // 空课程跳过
                if (lessonInfo.length < 4) {
                  continue;
                }
                let courseName = lessonInfo[0];
                let teacherName = lessonInfo[1];
                // TODO 多周问题
                let weeksStr = lessonInfo[2];
                let location = lessonInfo[3];
                let description = courseName + ' ' + teacherName + ' ';
                let weekDay = j;
                // let interval = parseInt(informations[2]);
                // TODO 判断夏令时冬令时
                let isSummerTime = false;
                let startTime = [];
                let endTime = [];
                if (isSummerTime) {
                  startTime = class_start_summer[2 * i - 1];
                  endTime = class_start_summer[2 * i];
                } else {
                  startTime = class_start_winter[2 * i - 1];
                  endTime = class_start_winter[2 * i];
                }
                // 按照多周划分后迭代
                for (
                  let weekStrs = weekRegexp.exec(weeksStr);
                  weekStrs !== null;
                  weekStrs = weekRegexp.exec(weeksStr)
                ) {
                  // 分多周 "2-5,7-9,11-13(周)" 和单周 "13(单周)"
                  let week = [];
                  if (weekStrs[1] !== undefined) {
                    week = weekStrs[1].split('-'); // 多周
                  } else {
                    week = [weekStrs[2], weekStrs[2]]; // 单周
                  }
                  let startWeek = parseInt(week[0]);
                  let endWeek = parseInt(week[1]);
                  let startDate = new Date(termStartDate),
                    endDate = new Date(termStartDate),
                    untilDate = new Date(termStartDate);
                  // 课程时间
                  startDate.setDate(
                    startDate.getDate() + (startWeek - 1) * 7 + weekDay - 1
                  );
                  startDate.setHours(startTime[0], startTime[1], 0, 0);
                  endDate.setDate(
                    endDate.getDate() + (startWeek - 1) * 7 + weekDay - 1
                  );
                  endDate.setHours(endTime[0], endTime[1]);
                  // 课程截止
                  untilDate.setDate(
                    untilDate.getDate() + (endWeek - 1) * 7 + weekDay
                  );
                  untilDate.setHours(endTime[0], endTime[1]);
                  calendarEvents.push(
                    [
                      'BEGIN:VEVENT',
                      'DTSTAMP:' + toString(nowDate),
                      'UID:' +
                      'COURSE' +
                      calendarEvents.length +
                      '@' +
                      'https://1000delta.top',
                      'SUMMARY:' + courseName,
                      'DTSTART:' + toString(startDate),
                      'DTEND:' + toString(endDate),
                      'RRULE:FREQ=WEEKLY;UNTIL=' + toString(untilDate),
                      'LOCATION:' + location,
                      'DESCRIPTION:' + description,
                      'END:VEVENT'
                    ].join(SEPARATOR)
                  );
                }
              }
            }
          }
          // console.log(calendarEvents);
          if (calendarEvents.length < 1) {
            alert('课表里没课哦~😆');
            return;
          }
          let filename = year + '学年第' + term + '学期课表.ics';
          let calendar =
            calendar_start +
            SEPARATOR +
            calendarEvents.join(SEPARATOR) +
            calendar_end;
          //保存到文件
          let blob;
          if (navigator.userAgent.indexOf('MSIE 10') === -1) {
            // chrome or firefox
            blob = new Blob([calendar]);
          } else {
            // ie
            let bb = new BlobBuilder();
            bb.append(calendar);
            blob = bb.getBlob(
              'text/x-vCalendar;charset=' + document.characterSet
            );
          }
          saveAs(blob, filename);
        });
      } catch (error) {
        console.log(error);
        alert('出错啦！/(ㄒoㄒ)/~~');
      }
    };
  }

  const EXAM_ORDER = 0,
    EXAM_SESSION = 1,
    EXAM_NAME = 2,
    EXAM_TYPE = 3,
    EXAM_MODE = 4,
    EXAM_TIME = 5,
    EXAM_LOCATION = 6,
    EXAM_SEAT = 7,
    EXAM_ID = 8,
    EXAM_NOTE = 9;

  function GenerateExamICS() {
    window.console.log('考试安排生成准备');
    let buttonPre = document.querySelector('input#btn_back');
    buttonPre.outerHTML +=
      ' <input type="button" onclick="saveics()" class="button" name="saveics" value="保存ics">';
    let term = /学年学期【(.*)】/.exec(buttonPre.parentElement ? buttonPre.parentElement.innerText : "");
    window.saveics = function () {
      // 格式编辑
      let calendar_start = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:Exam-to-iCalendar'
      ].join(SEPARATOR);
      let calendar_end = SEPARATOR + 'END:VCALENDAR' + SEPARATOR;
      let calendarEvents = [];
      // 数据获取
      let examTitle;
      let rows = document.querySelector('table#dataList').rows;
      for (let exam of rows) {
        if (exam.cells[EXAM_ORDER].innerText === '序号') {
          examTitle = exam;
          continue;
        }
        let timeTexts = exam.cells[EXAM_TIME].innerText.split(/ |~/);
        let startDate = new Date(timeTexts[0] + ' ' + timeTexts[1]);
        let endDate = new Date(timeTexts[0] + ' ' + timeTexts[2]);
        let description = `
${examTitle.cells[EXAM_SESSION].innerText}: ${exam.cells[EXAM_SESSION].innerText}
${examTitle.cells[EXAM_NAME].innerText}: ${exam.cells[EXAM_NAME].innerText}
${examTitle.cells[EXAM_TYPE].innerText}: ${exam.cells[EXAM_TYPE].innerText}
${examTitle.cells[EXAM_MODE].innerText}: ${exam.cells[EXAM_MODE].innerText}
${examTitle.cells[EXAM_SEAT].innerText}: ${exam.cells[EXAM_SEAT].innerText}
${examTitle.cells[EXAM_ID].innerText}: ${exam.cells[EXAM_ID].innerText}
${examTitle.cells[EXAM_NOTE].innerText}: ${exam.cells[EXAM_NOTE].innerText}
`;
        calendarEvents.push(
          [
            'BEGIN:VEVENT',
            'DTSTAMP:' + toString(nowDate),
            'UID:' +
            'EXAM-' +
            term +
            calendarEvents.length +
            '@' +
            'https://1000delta.top',
            'SUMMARY:' + exam.cells[EXAM_NAME].innerText,
            'DTSTART:' + toString(startDate),
            'DTEND:' + toString(endDate),
            'LOCATION:' + exam.cells[EXAM_LOCATION].innerText,
            'DESCRIPTION:' + description,
            'END:VEVENT'
          ].join(SEPARATOR)
        );
      }
      if (calendarEvents.length < 1) {
        window.alert('当前没有考试安排哦~');
        return;
      }
      let filename = term ? term[1] : "" + '考试安排.ics';
      let calendar =
        calendar_start +
        SEPARATOR +
        calendarEvents.join(SEPARATOR) +
        calendar_end;
      //保存到文件
      let blob;
      if (navigator.userAgent.indexOf('MSIE 10') === -1) {
        // chrome or firefox
        blob = new Blob([calendar]);
      } else {
        // ie
        let bb = new BlobBuilder();
        bb.append(calendar);
        blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
      }
      saveAs(blob, filename);
    }
  }

  let queryTable = {
    'http://jwxt.xtu.edu.cn/jsxsd/xskb/xskb_list.do': GenerateCourseICS,
    'http://jwxt.xtu.edu.cn/jsxsd/xsks/xsksap_list': GenerateExamICS
  };

  // 窗口加载完成调用函数
  window.onload = function () {
    try {
      queryTable[document.URL]();
    } catch (error) {
      if (error.message !== window.error_message) {
        window.error_message = error.message;
        console.log(error);
      }
      return;
    }
  };
  // 保证页面刷新后重新执行
  // setInterval(onload, 50);
})();
