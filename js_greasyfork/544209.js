// ==UserScript==
// @name         英国美签预约监控助手
// @namespace    https://github.com/aca22jy
// @version      1.0.0
// @description  自动监控美国驻英国大使馆的签证空位，支持提醒与邮件通知。原创脚本，禁止未经授权转载或商用。
// @author       Xi
// @license      CC BY-NC-ND 4.0
// @match        https://ais.usvisa-info.com/en-gb/niv/schedule/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544209/%E8%8B%B1%E5%9B%BD%E7%BE%8E%E7%AD%BE%E9%A2%84%E7%BA%A6%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544209/%E8%8B%B1%E5%9B%BD%E7%BE%8E%E7%AD%BE%E9%A2%84%E7%BA%A6%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_MONTHS = ['2025-08', '2025-09', '2025-10'];// 添加自己需要的月份
  const CHECK_INTERVAL = 120 * 1000; // 每 120 秒检查一次
  const CITY_SWITCH_INTERVAL = 90 * 60 * 1000; // 每 90 分钟切换一次城市以刷新请求

  const LOCATIONS = [
    { name: '伦敦', id: 17 },
    { name: '贝尔法斯特', id: 16 }
  ];

  const scheduleId = window.location.pathname.match(/schedule\/(\d+)/)?.[1];
  if (!scheduleId) {
    console.error("❌ 无法识别 scheduleId");
    return;
  }

  // 🌐 发邮件通知（使用 Formspree自己注册）
  function sendEmail(message) {
    fetch("https://formspree.io/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _replyto: "<你的邮箱>", // 可随便填，Formspree 只看验证邮箱
        message: message
      })
    }).then(res => {
      if (res.ok) {
        console.log("📧 邮件已通过 Formspree 发送");
      } else {
        console.error("❌ 邮件发送失败", res.status);
      }
    }).catch(err => {
      console.error("❌ 邮件请求异常", err);
    });
  }

  async function checkLocation(location) {
    const url = `https://ais.usvisa-info.com/en-gb/niv/schedule/${scheduleId}/appointment/days/${location.id}.json?appointments[expedite]=false`;

    try {
      const response = await fetch(url, {
        headers: {
          'Referer': location.href || window.location.href,
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.warn(`⚠️ ${location.name} 请求失败，状态码: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log(`📅 [${location.name}] ${new Date().toLocaleTimeString()} 返回日期:`, data.map(d => d.date));

      const found = data.some(d => TARGET_MONTHS.some(m => d.date.startsWith(m)));
      if (found) {
        const matching = data.filter(d => TARGET_MONTHS.some(m => d.date.startsWith(m)));
        const dates = matching.map(d => d.date).join(", ");
        const message = `[${location.name}] 找到空位：${dates}`;

        console.log(`🎯 ${message}`);

        // 桌面通知
        new Notification(`签证空位 - ${location.name}`, {
          body: dates,
          icon: "https://ais.usvisa-info.com/favicon.ico"
        });

        // 发声音
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play();

        // 发邮件
        sendEmail(message);
      } else {
        console.log(`✅ [${location.name}] 无目标月份空位`);
      }
    } catch (err) {
      console.error(`❌ [${location.name}] 请求异常`, err);
    }
  }

  function checkAll() {
    LOCATIONS.forEach(checkLocation);
  }

  // ⏱ 自动每 30 分钟切换城市触发 DOM 请求（模拟用户行为）
  function simulateCitySwitch() {
    const selectEl = document.getElementById("appointments_consulate_appointment_facility_id");
    if (!selectEl) return;

    const values = [...selectEl.options].map(opt => opt.value).filter(Boolean);
    const londonValue = values.find(v => selectEl.options[selectEl.selectedIndex]?.text.includes("London"));
    const belfastValue = values.find(v => selectEl.options[selectEl.selectedIndex]?.text.includes("Belfast"));

    if (londonValue && belfastValue) {
      console.log("🔁 模拟切换城市：贝尔法斯特 → 伦敦");
      selectEl.value = belfastValue;
      selectEl.dispatchEvent(new Event("change"));
      setTimeout(() => {
        selectEl.value = londonValue;
        selectEl.dispatchEvent(new Event("change"));
      }, 2000);
    }
  }

  Notification.requestPermission();
  console.log("🚀 签证预约监控启动：伦敦 + 贝尔法斯特，每120秒检查一次");

  setInterval(checkAll, CHECK_INTERVAL);           // 定期检查空位
  setInterval(simulateCitySwitch, CITY_SWITCH_INTERVAL); // 每半小时模拟城市切换

  checkAll(); // 立即运行一次
})();
