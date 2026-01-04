// ==UserScript==
// @name         选课网显示毕业实习
// @namespace    http://tampermonkey.net/
// @version      2
// @description  给没有毕业实习的同学加上毕业实习.
// @author       acdzh
// @include      https://1.tongji.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/405383/%E9%80%89%E8%AF%BE%E7%BD%91%E6%98%BE%E7%A4%BA%E6%AF%95%E4%B8%9A%E5%AE%9E%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/405383/%E9%80%89%E8%AF%BE%E7%BD%91%E6%98%BE%E7%A4%BA%E6%AF%95%E4%B8%9A%E5%AE%9E%E4%B9%A0.meta.js
// ==/UserScript==

(function () {

  (function (open) {
    let c = {
        "course": {
          "courseCode": "420330",
          "courseName": "毕业实习",
          "credits": 4.0,
          "nameEn": "Production Practice",
          "nature": null,
          "publicElec": false,
          "calendarId": null,
          "calendarName": "2020-2021学年第1学期",
          "electionApplyId": null,
          "apply": null,
          "compulsory": "0",
          "remark": null,
          "labelId": 90,
          "labelName": "实践安排(SJ)",
          "jp": null,
          "campus": null,
          "chosen": 0,
          "isQhClass": 0,
          "isPE": 0,
          "teachingLanguage": null,
          "faculty": "000287",
          "isSelected": null,
          "teacherCodeAndNames": null,
          "courseTakeType": null,
          "teachingClassId": null,
          "courseLabel": null,
          "cx": false,
          "ys": false,
          "natureI18n": "",
          "teachingLanguageI18n": "",
          "facultyI18n": "软件学院"
        },
        "label": 90,
        "labelName": "实践安排(SJ)",
        "faculty": null,
        "weekType": 0,
        "semester": "7",
        "subCourseCode": null,
        "chosen": null,
        "isQhClass": null,
        "isPE": 0,
        "courseCode": "420330"
      };



    (function (parse) {
      JSON.parse = function (s) {
        let j = parse(s);
        if (s.match(`"planCourses"`) && s.match(`"code"`)) {
          j.data.planCourses.push(c);
          console.log(j);
        }
        return j;
      };
    })(JSON.parse);
  })()
})();