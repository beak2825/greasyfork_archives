// ==UserScript==
// @name         武汉协和医院实习课表导出
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  导出实习课表为ics文件，可导入到日历软件中，如Google Calendar，Outlook等
// @author       tctco
// @match        https://jxpt.whuh.com/pc/student/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whuh.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508860/%E6%AD%A6%E6%B1%89%E5%8D%8F%E5%92%8C%E5%8C%BB%E9%99%A2%E5%AE%9E%E4%B9%A0%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/508860/%E6%AD%A6%E6%B1%89%E5%8D%8F%E5%92%8C%E5%8C%BB%E9%99%A2%E5%AE%9E%E4%B9%A0%E8%AF%BE%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

// data_object = {
//     "us_id": "...",
//     "activity_id": "...",
//     "uid": "...",
//     "group_id": "...",
//     "join_status": "1",
//     "is_sign_in": "2",
//     "sign_time": null,
//     "is_sign_out": "2",
//     "out_time": null,
//     "is_comment": "2",
//     "hosid": "1",
//     "create_time": "2024-01-19 11:12:00",
//     "modified_time": null,
//     "is_delete": "2",
//     "name": "动脉血气分析",
//     "type_id": "4",
//     "address": "内科2号楼16楼示教室",
//     "s_time": "2024-04-10 11:00:00",
//     "e_time": "2024-04-10 11:45:00",
//     "comment_id": null,
//     "total_points": null,
//     "type_name": "病例讨论",
//     "leave_id": null,
//     "sort_id": 73
// }

(function () {
  "use strict";
  appendButton();

})();

function appendButton() {
  let button = document.createElement("button");
  button.innerHTML = "导出课表";
  button.onclick = async function () {
    let icsFile = await fetchAllData();
    download("whuh_internship.ics", icsFile);
  };
  button.style.cssText = "position:fixed;right:0px;top:60px;z-index:9999;";
  document.body.appendChild(button);
}

async function fetchAllData() {
  let url = `https://jxpt.whuh.com/pc/student/UgTeachActivity/getActivityList?page=1&limit=10`;
  let response = await fetch(url, { method: "GET", credentials: "include" });
  let data = await response.json();
  let max = data.count;
  response = await fetch(url.replace("limit=10", `limit=${max}`), {
    method: "GET",
    credentials: "include",
  });
  data = await response.json();
  console.log(data);
  let events = data.data
  .filter(item => {
      let stime = new Date(item.s_time);
      let now = new Date();
      return now < stime;
  })
  .map((item) => {
    let stime = new Date(item.s_time);
    let etime = new Date(item.e_time);
    return {
      title: item.name,
      start: stime,
      end: etime,
      description: item.type_name,
      location: item.address,
      uid: item.uid,
      aid: item.activity_id,
    };
  });
  console.log(events)
  return createICS(events);
}

function formatDateTime(date) {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
}

function createUID(uid, aid) {
    let timestamp = new Date().getTime();
    return `${uid}${aid}${timestamp}` + '@tctco.pages.dev'; // 替换成你的域名
}

function createICS(events) {
    let icsFile = "BEGIN:VCALENDAR\n";
    icsFile += "VERSION:2.0\n";
    icsFile += "PRODID:-//Dept. Nuclear Medicine WHUH//calendar//EN\n";

    events.forEach(event => {
        icsFile += "BEGIN:VEVENT\n";
        icsFile += "UID:" + createUID(event.uid, event.aid) + "\n";
        icsFile += "DTSTAMP:" + formatDateTime(new Date()) + "\n";
        icsFile += "SUMMARY:" + event.title + "\n";
        icsFile += "DTSTART:" + formatDateTime(event.start) + "\n";
        icsFile += "DTEND:" + formatDateTime(event.end) + "\n";
        icsFile += "DESCRIPTION:" + event.description + "\n";
        icsFile += "LOCATION:" + event.location + "\n";
        icsFile += "END:VEVENT\n";
    });

    icsFile += "END:VCALENDAR";
    return icsFile;
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}