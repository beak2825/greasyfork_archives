// ==UserScript==
// @name         Attendance For Meituan
// @namespace    xbf321
// @version      2.0
// @description  Attendance Notification!
// @author       xbf321
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @match        *://*.sankuai.com/*
// @connect      sankuai.com
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/459520/Attendance%20For%20Meituan.user.js
// @updateURL https://update.greasyfork.org/scripts/459520/Attendance%20For%20Meituan.meta.js
// ==/UserScript==

// https://www.tampermonkey.net/documentation.php

(function() {
    'use strict';
    const VERSION = GM_info.script.version;
    // x 秒检查一次接口
    const STORE_KEY = 'kaoqin-info';
    const DALAY_CHECK_TIME = 5 * 60;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentMonthTime = new Date(year + '-'+ month + '-01 00:00:00').getTime();
    const currentDayTime =new Date(year + '-' + month + '-' + day).getTime();
    const opt = Object.prototype.toString;
    function isString(value) {
      return opt.call(value) === "[object String]";
    }
    const dom$1 = {
      query: function(selector) {
        return document.querySelector(selector);
      },
      attr: function(selector, attr, value) {
        const dom2 = document.querySelector(selector);
        dom2 && dom2.setAttribute(attr, value);
      },
      append: function(selector, content) {
        const container = document.createElement("div");
        if (isString(content)) {
          container.innerHTML = content;
        } else {
          container.appendChild(content);
        }
        const targetDOM = document.querySelector(selector);
        targetDOM && targetDOM.append(container);
        return container;
      },
      remove: function(selector) {
        const targetDOM = document.querySelector(selector);
        targetDOM && targetDOM.remove();
      }
    };
    function timestampToTime(timestamp) {
        if (timestamp.toString().split('').length === 10) {
            timestamp = timestamp * 1000;
        }
        const date = new Date(timestamp);
        const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        return {hh, mm};
    }
    async function checkCurrentTime() {
        const nowTime = new Date().valueOf();
        let dataObject = GM_getValue(STORE_KEY, null);
        try {
            if (!dataObject) {
                dataObject = await getCurrentTimeFromRemote();
            } else {
                dataObject = JSON.parse(dataObject);
            }
            if (dataObject) {
                const { lastCheck } = dataObject;
                const diffTime = (nowTime - lastCheck) / 1000;
                if (diffTime > DALAY_CHECK_TIME) {
                    dataObject = await getCurrentTimeFromRemote();
                }
            }
        } catch(err) {
            console.error(err);
            showErrorNotification(err.url || '');
            return;
        }
        const { timeRange } = dataObject;
        const [startTime, endTime] = timeRange;
        const { hh: startHH, mm: startMM } = timestampToTime(startTime);
        const { hh: endHH, mm: endMM } = timestampToTime(endTime);
        const startTimeString = startHH + ':' + startMM;
        const endTimeString = endHH + ':' + endMM;
        const remainHour = parseInt(startHH, 10) + 9;
        let offDay = remainHour + ':'+ startMM;
        if (remainHour < 18) {
            offDay = "18:00"
        }
        showNotification(startTimeString, endTimeString, offDay);
    }
    async function getCurrentTimeFromRemote() {
        const data = await fetchCurrentData();
        const { day } = data;
        const timeRange = [];
        (day || []).forEach((item) => {
            const { day: currentDay, startTime, endTime } = item;
            if (currentDay === currentDayTime) {
               timeRange[0] = startTime;
               timeRange[1] = endTime
            }
        });
        if (timeRange.length === 0) {
           return null;
        }
        const dataObject = {
                 timeRange,
                 lastCheck: new Date().valueOf(),
        };
        GM_setValue(STORE_KEY, JSON.stringify(dataObject));
        return dataObject;
    }
    async function fetchCurrentData() {
        const promise = new Promise((resolve, reject) => {
           GM_xmlhttpRequest({
               url: "https://hr.sankuai.com/kaoqin/api/attendance/calendar",
               method: "POST",
               headers: {
                   "content-type": "application/json",
                   "user-agent": navigator.userAgent,
               },
               data: JSON.stringify({
                   "month": currentMonthTime
               }),
               responseType: "json",
               onload(response) {
                   if (response.status === 200) {
                       const data = response.response;
                       const { status, data: detailData} = data;
                       if (status === 1) {
                          resolve(detailData);
                       } else {
                          reject(detailData);
                       }
                   } else {
                       reject(response);
                   }
               },
               onerror: (err) => {
                   reject(err);
               },
           });
        });
        return promise;
    }
    function showErrorNotification(redirectURL){
        if (!redirectURL) {
          return;
        }
        const templateCSS = [
          "<style id='kaoqin-template-css'>",
          "#kaoqin-html{position: fixed; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center;z-index: 999999; background: #fff; width: 350px;height: 48px;}",
          "#kaoqin-html > .title{font-weight: 600;color: red; }",
          "#kaoqin-html > .version{margin-left: 10px; font-size: 12px; }",
          "</style>"
        ].join("");
        const templateHTML = [
            "<div id='kaoqin-html'>",
            "<span class='title'>登陆过期，</span>请点击",
            "<a href='",
            redirectURL,
            "' target='__blank'>这里</a>，然后刷新页面",
            "<span class='version'>v",
            VERSION,
            "</span>",
            "</div>"
          ].join("");
        dom$1.append("body", templateHTML);
        dom$1.append("body", templateCSS);
    }
    function showNotification(startTimeString, endTimeString, offTimeString) {
        const templateCSS = [
          "<style id='kaoqin-template-css'>",
          "#kaoqin-container {position: fixed; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center;z-index: 999999; background: #fff;height: 32px;}",
          "#kaoqin-html{ width: 480px; }",
          "#kaoqin-html > .title{font-weight: 600;margin-left: 10px; }",
          "#kaoqin-html > .time{color: red; font-size: 20px; }",
          "#kaoqin-html > .version{margin-left: 10px; font-size: 12px; margin-right: 10px;}",
          "</style>"
        ].join("");
        const templateHTML = [
            "<div id='kaoqin-container'>",
            "<div id='kaoqin-html'>",
            "<span class='title'>首次打卡：</span>",
            "<span class='time'>",
            startTimeString,
            "</span>",
            "<span class='title'>最后打卡：</span>",
            "<span class='time'>",
            endTimeString,
            "</span>",
            "<span class='title'>下班时间：</span>",
            "<span class='time'>",
            offTimeString,
            "</span>",
            "<span class='version'>v",
            VERSION,
            "</span>",
            "</div>",
            "<a href='javascript:void(0)' id='btn-kaoqin'>",
            "收起",
            "</a>",
            "</div>"
          ].join("");
        dom$1.append("body", templateHTML);
        dom$1.append("body", templateCSS);
        document.querySelector('#btn-kaoqin').addEventListener('click',function(){
            const obj = document.getElementById('kaoqin-html');
            const status = obj.style.display;
            obj.style.display = status === 'none' ? 'block' : 'none';
        });
    }
    checkCurrentTime();
})();