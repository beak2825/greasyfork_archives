// ==UserScript==
// @name         BOSS 直聘岗位发布时间
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Display last modify time for Boss job list items
// @author       Your Name
// @match        https://*.zhipin.com/*   
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @homepage     https://github.com/chengazhen/apply-to-jop
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494293/BOSS%20%E7%9B%B4%E8%81%98%E5%B2%97%E4%BD%8D%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/494293/BOSS%20%E7%9B%B4%E8%81%98%E5%B2%97%E4%BD%8D%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  rewriteXHR()

  async function getBossJobListData(responseText) {
    try {
      const data = JSON.parse(responseText);
      const jopList = data?.zpData?.jobList || []
      const jobListContainer = await waitUntilJobListRendered()
      jopList.length && updateJobListItemsWithTime(jopList, jobListContainer);
    } catch (err) {
      console.error("reason：", err);
    }
  }

  function waitUntilJobListRendered() {
    return new Promise((resolve, reject) => {

      const jobResultContainer = document.querySelector(".search-job-result");
      if (!jobResultContainer) {
        return reject(new Error("未找到职位列表的容器"));
      }



      // 轮询职位列表是否渲染
      const intervalId = setInterval(() => {
        const jobListContainer = jobResultContainer.querySelector(".job-list-box");
        if (jobListContainer) {
          clearInterval(intervalId);
          return resolve(jobListContainer);
        }
      }, 100);

    });
  }

  function updateJobListItemsWithTime(jobList, jobListContainer) {
    jobList.forEach((job) => {
      const listItem = jobListContainer.querySelector(`[ka="search_list_${job.itemId}"]`);
      if (listItem) {
        const lastModifyTimeTag = createLastModifyTimeTag(job.lastModifyTime);
        //放在最上面
        listItem.insertBefore(lastModifyTimeTag, listItem.firstChild);
      }
    });
  }

  function createLastModifyTimeTag(timeStamp) {
    const timeString = formatDate(new Date(timeStamp), "YYYY-MM-DD HH:mm:ss");
    const timeTag = document.createElement("div");
    timeTag.style.color = "white";
    timeTag.style.padding = "0px 5px";
    timeTag.style.borderRadius = "4px 4px 0px 0px";

    const now = new Date();
    const modifyTime = new Date(timeStamp);
    const differenceInDays = diffDay(now, modifyTime);

    if (differenceInDays <= 14) {
      timeTag.style.background = "rgb(4, 197, 165)"; // 绿色，距今两周内
    } else if (differenceInDays > 14 && differenceInDays <= 45) {
      timeTag.style.background = "#F0AD4E"; // 暗橙色，两周到一个半月
    } else {
      timeTag.style.background = "red"; // 红色，超过一个半月
    }

    const dayPassed = diffDay(now, modifyTime);
    timeTag.textContent = `${timeString}(距今${dayPassed}天)`;
    return timeTag;
  }

  function formatDate(date, format) {
    const map = {
      'YYYY': date.getFullYear(),
      'MM': ('0' + (date.getMonth() + 1)).slice(-2),
      'DD': ('0' + date.getDate()).slice(-2),
      'HH': ('0' + date.getHours()).slice(-2),
      'mm': ('0' + date.getMinutes()).slice(-2),
      'ss': ('0' + date.getSeconds()).slice(-2)
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (str) => map[str]);
  }

  function diffDay(date1, date2) {
    const diffInMs = Math.abs(date1 - date2);
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }


  function rewriteXHR() {
    const realXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new realXHR();

      // 保留原始的open方法
      const oldOpen = xhr.open;
      xhr.open = function (method, url, async, user, password) {
        // 只在需要的时候添加load事件监听器
        if (url.includes('/list.json?') || url.includes('/joblist.json?')) {
          xhr.addEventListener('load', function () {
            if (this.status === 200) {
              getBossJobListData(this.responseText);
            } else {
              console.error('请求失败:', this.status);
            }
          }, false);
        }
        // 调用原始的open方法
        oldOpen.apply(this, arguments);
      };
      return xhr;
    };
  }
})();
