// ==UserScript==
// @name         BIT-物理实验中心-下载日历
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  生成课程表的 iCalendar 文件并下载
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       CJJ
// @match        http://10.133.22.200:7100/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/491539/BIT-%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%BF%83-%E4%B8%8B%E8%BD%BD%E6%97%A5%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/491539/BIT-%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%BF%83-%E4%B8%8B%E8%BD%BD%E6%97%A5%E5%8E%86.meta.js
// ==/UserScript==

(function () {
  'use strict'
  /* global GM_registerMenuCommand */

  GM_registerMenuCommand('导出当前物理实验课表', function () {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://10.133.22.200:7100/XPK/StuCourseElective/LoadUsedLabCourses', true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let content =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BIT-enhanced//PHYEXP//
TZID:Asia/Shanghai
X-WR-CALNAME:物理实验课程表
`
        const downloadLink = document.createElement('a')
        const phyexp = JSON.parse(xhr.responseText)
        for (let i = 0; i < phyexp.rows.length; i++) {
          content +=
`BEGIN:VEVENT
SUMMARY:${phyexp.rows[i].CourseName} ${phyexp.rows[i].LabName}
LOCATION:物理实验中心${phyexp.rows[i].ClassRoom}
DESCRIPTION:${phyexp.rows[i].TeacherName} | ${phyexp.rows[i].Weeks}周 ${phyexp.rows[i].WeekName} ${phyexp.rows[i].TimePartName} ${phyexp.rows[i].ClassRoom} 座位号${phyexp.rows[i].SeatNo}
DTSTART:${phyexp.rows[i].ClassDate.replace(/(\w+)\/(\w+)\/(\w+)/, (all, y, m, d) => y + m.padStart(2, '0') + d.padStart(2, '0')).substr(0, 8)}T${phyexp.rows[i].StartTime.replace(':', '')}00
DTEND:${phyexp.rows[i].ClassDate.replace(/(\w+)\/(\w+)\/(\w+)/, (all, y, m, d) => y + m.padStart(2, '0') + d.padStart(2, '0')).substr(0, 8)}T${phyexp.rows[i].EndTime.replace(':', '')}00
UID:${phyexp.rows[i].TeacherID}-${phyexp.rows[i].Weeks}-${phyexp.rows[i].TimePartID}-${phyexp.rows[i].LabID}-${phyexp.rows[i].LabClassNo}
END:VEVENT
`
        }
        content += 'END:VCALENDAR'
        downloadLink.href = URL.createObjectURL(new Blob([content], { type: 'text/calendar' }))
        downloadLink.download = '物理实验课程表.ics'
        downloadLink.click()
      }
    }
    xhr.send('courseID=36&StuIds=' + document.cookie.match(/(?<=COOKIES_KEY_USERNAME=)[0-9]+/)[0] + '&isBatch=0&SemesterID=14&page=1&rows=100')
  })
})()
