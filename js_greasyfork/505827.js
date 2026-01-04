// ==UserScript==
// @name         kelaode公益站/sharedchat公益站个人使用记录
// @namespace    https://greasyfork.org/zh-CN/scripts/505827/
// @version      0.3.3
// @description  记录自己在 kelaode公益站/sharedchat公益站 的点击历史并显示，每个按钮保存5个记录，保存在本地浏览器中。
// @author       Yearly
// @match        https://kelaode.ai/*
// @match        https://chatgptplus.cn/
// @match        https://sharedchat.fun/*
// @match        https://chat.kelaode.ai/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg4MHY4MEgweiIgZmlsbD0iIzQ0NSIvPjxwYXRoIGQ9Im0zMyA0NC0yMy0xYy0xIDAtMi0yLTItM3MwLTEgMS0xbDI0IDItMjEtMTVjMC0xLTEtMS0xLTNzMy00IDYtMmwxNCAxMi05LTE3di0yYzAtMSAxLTUgMy01IDEgMCAzIDAgNCAxbDExIDIzIDItMjBjMC0yIDEtNCAzLTRzMyAxIDMgMmwtMyAyMCAxMi0xNGMxLTEgMy0yIDQtMSAyIDIgMiA0IDEgNkw1MSAzN2gxbDEyLTJjMy0xIDYtMiA3IDAgMSAxIDAgMyAwIDNsLTIxIDVjMTQgMSAxNSAwIDE4IDEgMiAwIDMgMiAzIDMgMCAzLTIgMy0zIDNsLTE5LTQgMTUgMTR2MWwtMiAxYy0xIDAtOS03LTE0LTExbDcgMTFjMSAxIDEgMyAwIDRzLTMgMS0zIDBMNDEgNTBjMCA3LTEgMTMtMiAxOSAwIDEtMSAxLTMgMi0xIDAtMy0xLTItM2wxLTQgMy0xNi0xMCAxMy00IDVoLTFjLTEgMC0yLTEtMi0zbDE0LTE4LTE3IDExaC00cy0xLTIgMC0zbDUtNHoiIGZpbGw9IiNENzUiLz48L3N2Zz4=
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/505827/kelaode%E5%85%AC%E7%9B%8A%E7%AB%99sharedchat%E5%85%AC%E7%9B%8A%E7%AB%99%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/505827/kelaode%E5%85%AC%E7%9B%8A%E7%AB%99sharedchat%E5%85%AC%E7%9B%8A%E7%AB%99%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CHAT_URL_REGEX = /chat\.kelaode\.ai\//;
  const KELAODE_URL_REGEX = /kelaode\.ai/;
  const UPDATE_INTERVAL = 2400;
  const DEBOUNCE_WAIT = 500;

  let mainInterval;

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  function waitForElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  function saveClickRecord(recordName, text, code) {
    let records = GM_getValue(recordName, {});
    if (!records[text]) {
      records[text] = [];
    }
    records[text].unshift({
      code: code,
      time: new Date().toLocaleString()
    });
    records[text] = records[text].slice(0, 5);
    GM_setValue(recordName, records);
  }

  function getLatestClick(clickRecords) {
    let latestClick = null;
    let latestTime = new Date(0);

    for (const [clickName, records] of Object.entries(clickRecords)) {
      if (records.length > 0) {
        const clickLatestTime = new Date(records[0].time);
        if (clickLatestTime > latestTime) {
          latestTime = clickLatestTime;
          latestClick = clickName;
        }
      }
    }

    return latestClick;
  }

  function convertTime(shortTime) {
    const now = new Date();
    const [time, period] = shortTime.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);

    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    if (hours < now.getHours()) {
      now.setDate(now.getDate() + 1);
    }

    now.setHours(hours);
    now.setMinutes(minutes || 0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return now.toLocaleString();
  }

  function updateResetTime() {
    const element = document.querySelector("div.sticky div.w-full > div.items-center > div.text-danger-000 > div > div.text-sm > span");
    if (!element) return;

    const originalText = element.getAttribute('data-original-time') || element.textContent.trim();
    if (!element.hasAttribute('data-original-time')) {
      element.setAttribute('data-original-time', originalText);
    }

    const resetFullTime = convertTime(originalText);
    element.textContent = `${originalText} (${resetFullTime})`;

    const clickRecords = GM_getValue("clickRecords", {});
    const latestClickKey = getLatestClick(clickRecords);
    let resetTimes = GM_getValue('resetTimes', {});
    resetTimes[latestClickKey] = resetFullTime;
    GM_setValue('resetTimes', resetTimes);
  }

  function showHistoryResetTime() {
    let resetTimes = GM_getValue('resetTimes', {});
    if (Object.keys(resetTimes).length === 0) return;

    const currentTime = new Date();
    const links = document.querySelectorAll("body > div > div.account-list > ul > li > a");

    links.forEach(link => {
      let text = link.innerText;
      let resetTimeStr = resetTimes[text];
      if (!resetTimeStr) return;

      let resetTime = new Date(resetTimeStr);
      if (isNaN(resetTime.getTime())) return;

      const timeDiff = (resetTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

      const hoursLeft = timeDiff.toFixed(2);
      let resetAtDiv = link.nextElementSibling;
      if (!resetAtDiv || !resetAtDiv.classList.contains('resetAt-records')) {
        resetAtDiv = document.createElement('div');
        resetAtDiv.className = "resetAt-records";
        link.parentNode.insertBefore(resetAtDiv, link.nextSibling);
      }
      resetAtDiv.textContent = `ResetsAt: ${resetTimeStr}, HoursLeft: ${hoursLeft}h`;
      if (timeDiff > -12) {
        const hue = 90 - Math.min(Math.abs(timeDiff/ 5), 5) * 90;
        resetAtDiv.style.backgroundColor = `hsl(${hue}, 60%, 75%)`;
      } else {
        resetAtDiv.style.backgroundColor = `#aaa`;
      }
    });
  }

  function showHistoryRecord() {
    const recordName = KELAODE_URL_REGEX.test(location.href) ? "clickRecords" : "gpt-clickRecords";
    const records = GM_getValue(recordName, {});
    const links = document.querySelectorAll("body > div > div.account-list > ul > li > a");

    if (document.querySelector("body > div > div.account-list > ul > li > div.click-records")){
      return;
    }

    links.forEach(link => {
      let text = link.innerText;
      if (records[text] && records[text].length > 0) {
        let historyDiv = link.nextElementSibling;
        if (!historyDiv || !historyDiv.classList.contains('click-records')) {
          historyDiv = document.createElement('div');
          historyDiv.className = "click-records";
          link.parentNode.insertBefore(historyDiv, link.nextSibling);
        }
        historyDiv.innerHTML = '';
        records[text].forEach((record, index) => {
          let span = document.createElement('span');
          span.textContent = `${record.code} (${record.time})`;
          span.style.backgroundColor = ["#def","#eee"][index%2];
          historyDiv.appendChild(span);
        });
      }
    });

    showHistoryResetTime();
  }

  function setupChatPage() {
    const clickRecords = GM_getValue("clickRecords", {});
    const latestClickKey = getLatestClick(clickRecords);
    const debouncedUpdateResetTime = debounce(updateResetTime, DEBOUNCE_WAIT);

    setInterval(() => {
      debouncedUpdateResetTime();
    }, UPDATE_INTERVAL);
  }

  function setupSelectSitePage() {
    const recordName = KELAODE_URL_REGEX.test(location.href) ? "clickRecords" : "gpt-clickRecords";

    document.querySelector("body > div > div.account-list").addEventListener('click', async function(e) {
      if (e.target.tagName === 'A') {
        let text = e.target.innerText;
        let uname = await waitForElement("div.swal2-container.swal2-center.swal2-backdrop-show > div > input.swal2-input");
        let confirmButton = await waitForElement("div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled");
        if (confirmButton && !confirmButton.user_click_added) {
          confirmButton.user_click_added = true;
          confirmButton.addEventListener('click', function() {
            saveClickRecord(recordName, text, uname.value);
          });
        }
      }
    });

    setInterval(showHistoryRecord, UPDATE_INTERVAL);
  }

  function main() {
    if (CHAT_URL_REGEX.test(location.href)) {
      setupChatPage();
    } else {
      setupSelectSitePage();

      GM_addStyle(`
        div.resetAt-records {
            font-size:12px; color:#000; background:#ccc; padding:3px; margin:1px 0; border-radius: 5px; line-height:1.25; border:3px #ccc solid;
        }
        div.click-records {
            font-size:12px; color:#888; background:#ccc; padding:0px; margin:0; border-radius: 5px; line-height:1; border:1.5px #ccc solid;
        }
        div.click-records span {
            margin:2px; padding:2px; display:block;
        }
        .account-list .flex-list li a {
            height: 50px;
        }
        .account-list .flex-list li a.plus {
            box-shadow: inset 0 0 5px 5px #fd0;
            border-color: #fd0;
        }
        h3 {
            padding: 10px 0;
            text-align: center;
        }
    `);
    }
  }


  let currentUrl = '';

  function checkUrlChange() {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      clearInterval(mainInterval);
      main();
    }
  }

  // 使用 DOMContentLoaded 事件来确保在 DOM 加载完成后运行脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

  setInterval(checkUrlChange, 1000);

  mainInterval = setInterval(main, 5000);


})();