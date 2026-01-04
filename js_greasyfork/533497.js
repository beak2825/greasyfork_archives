// ==UserScript==
// @name         国科大人文讲座抢课捡漏脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  用户可以在网页输入框中设置课程名称，点击‘保存并开始’按钮后，脚本会自动在后台运行并持续监控该课程的报名状态，而无需刷新页面。本脚本适用于目前讲座名额暂时已满的情况，一旦检测到名额存在，则会帮助用户报名成功。
// @author       大好人
// @match        https://xkcts.ucas.ac.cn:8443/subject/humanityLecture
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ai1.bar
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533497/%E5%9B%BD%E7%A7%91%E5%A4%A7%E4%BA%BA%E6%96%87%E8%AE%B2%E5%BA%A7%E6%8A%A2%E8%AF%BE%E6%8D%A1%E6%BC%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533497/%E5%9B%BD%E7%A7%91%E5%A4%A7%E4%BA%BA%E6%96%87%E8%AE%B2%E5%BA%A7%E6%8A%A2%E8%AF%BE%E6%8D%A1%E6%BC%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建输入框和保存按钮的UI
  function createSettingsUI() {
    const ui = document.createElement('div');
    ui.style = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      border: 2px solid #4CAF50;
      border-radius: 5px;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    `;

    const savedName = localStorage.getItem('grasemonkey_lecture_name') || '';

    ui.innerHTML = `
      <h4 style="margin:0 0 10px 0; color:#333;">抢课设置</h4>
      <input
        type="text"
        id="lectureNameInput"
        placeholder="输入课程名称（如：M1055）"
        style="width: 200px; padding: 5px; margin-bottom: 10px;"
        value="${savedName}"
      >
      <button
        id="saveSettingsBtn"
        style="padding: 5px 15px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;"
      >保存并开始</button>
      <div id="statusMsg" style="margin-top:10px; color:#666; font-size:12px;"></div>
    `;

    document.body.appendChild(ui);

    // 保存按钮点击事件
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
      const lectureName = document.getElementById('lectureNameInput').value.trim();
      if (lectureName) {
        localStorage.setItem('grasemonkey_lecture_name', lectureName);
        showStatus('设置已保存，开始抢课！', '#4CAF50');
      } else {
        showStatus('课程名称不能为空！', 'red');
      }
    });
  }

  // 显示操作状态
  function showStatus(msg, color) {
    const statusDiv = document.getElementById('statusMsg');
    statusDiv.textContent = msg;
    statusDiv.style.color = color;
    setTimeout(() => statusDiv.textContent = '', 3000);
  }

  // 查找报名按钮的核心逻辑
  function getEnrollmentButton() {
    const targetName = localStorage.getItem('grasemonkey_lecture_name');
    if (!targetName) {
      console.log('未设置课程名称，请先在输入框中设置！');
      return null;
    }

    const rows = document.querySelectorAll("tr");
    for (const row of rows) {
      if (row.textContent.includes(targetName)) {
        const buttons = row.querySelectorAll("a, button");
        for (const btn of buttons) {
          if (btn.textContent.includes("报名")) {
            return btn;
          }
        }
      }
    }
    return null;
  }

  // 主逻辑：初始化UI并启动监控
  function main() {
    createSettingsUI();

    setInterval(() => {
      const enrollBtn = getEnrollmentButton();
      if (enrollBtn && !enrollBtn.disabled) {
        console.log(`检测到课程报名按钮，立即点击！时间: ${new Date().toLocaleString()}`);
        enrollBtn.click();
        setTimeout(() => location.reload(), 2000);
      }
    }, 60000); // 每60秒检查一次
  }

  // 启动脚本
  main();

})();