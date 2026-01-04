// ==UserScript==
// @name         EIP显示剩余工时
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       社区大佬-出音味来
// @description  zh-cn
// @license      GNU GPLv3
// @match        *://eip.h3c.com/myCenter/kaoqin
// @match        *://eip-cw.h3c.com/myCenter/kaoqin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523184/EIP%E6%98%BE%E7%A4%BA%E5%89%A9%E4%BD%99%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/523184/EIP%E6%98%BE%E7%A4%BA%E5%89%A9%E4%BD%99%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==

(function() {
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  let legalHolidays = {};
  const diy_parseTime = (timeString) => {
    const hour = parseInt(timeString.substring(0, 2));
    const minute = parseInt(timeString.substring(2, 4));
    const second = parseInt(timeString.substring(4, 6));
    return { hour, minute, second };
  };
  const cal_difference = (StartTime, EndTime) => {
    let {
      hour: startHour,
      minute: startMinute,
      second: startSecond,
    } = diy_parseTime(StartTime);
    let {
      hour: endHour,
      minute: endMinute,
      second: endSecond,
    } = diy_parseTime(EndTime);
    const startDate = new Date();
    if (endHour < startHour) {
      endHour += 24;
    }
    startDate.setHours(startHour, startMinute, startSecond);
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, endSecond);
    const timeDifference = endDate - startDate;
    return timeDifference;
  };
  XMLHttpRequest.prototype.open = function (...args) {
    const url = args[1];
    if (url.includes("/hrss/api/ApiAttendance/GetEmpCalendarDetailInfo")) {
      const eip = url.includes("eip-cw") ? "eip-cw" : "eip";
      const date = url.split("?")[1].split("=")[1].replace("-", "");
      const year = date.substring(0, 4);

      this.addEventListener("load", async function () {
        if (this.readyState === 4 && this.status === 200) {
          if (!legalHolidays.year) {
            const response = await fetch(
              `https://apieip.h3c.com/${eip}/external/external/eos/calendar/${year}`,
              {
                headers: {
                  Authorization: localStorage.accessToken.replace('"', ""),
                  "Content-Type": "application/json",
                },
              }
            );
            const holidays = await response.json();
            legalHolidays[year] = holidays.data;
          }
          const response = JSON.parse(this.responseText);
          const todayFormatted = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const data = response.Data.filter(
            (it) =>
              it.Date.startsWith(date) &&
              it.IsWorkDay &&
              !legalHolidays[year].find(
                (item) => item.date.replace(/-/g, "") === it.Date
              ) &&
              it.Date !== todayFormatted
          ).sort((a, b) => a.Date - b.Date);

          const test = data.reduce((total, it) => {
            const { StartTime, EndTime } = it.Times[0];
            if (!StartTime || !EndTime) return total;
            const timeDifference =
              cal_difference(StartTime, EndTime) - 34200000;
            const addLeaveTime = it.Times.filter(
              (it) => it.Type === "l"
            ).reduce((res, it) => {
              const { StartTime, EndTime } = it;
              if (StartTime > 930 && EndTime < 1800) return res;
              return (res += cal_difference(StartTime, EndTime));
            }, 0);

            return (total += timeDifference + addLeaveTime);
          }, 0);
          const remainHours = (
            Math.floor((test / 1000 / 3600) * 100) / 100
          ).toFixed(2);
          if (!document.querySelector(".remain-hours-value")) {
            const remainHoursDiv = document.createElement("div");
            remainHoursDiv.innerHTML = `<div>
                剩余<span class="remain-hours-value">${remainHours}</span>小时
            </div>`;
            document
              .querySelector(".ant-pro-watermark-wrapper > div > div > div")
              .append(remainHoursDiv);
          } else {
            document.querySelector(".remain-hours-value") &&
              (document.querySelector(".remain-hours-value").innerText =
                remainHours);
          }
        }
      });
    }
    return originalXhrOpen.apply(this, args);
  };
  const eip = window.origin.includes("eip-cw") ? "eip-cw" : "eip";
  const date = document.querySelector(
    ".bigSpan.text-primary.text-2xl.m-0"
  ).innerText;
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://apieip.h3c.com/${eip}/hrss/api/ApiAttendance/GetEmpCalendarDetailInfo?date=${date}`,
    true
  );
  xhr.setRequestHeader("Authorization", localStorage.accessToken.replace(/"/g, ""));
  xhr.send();
})();