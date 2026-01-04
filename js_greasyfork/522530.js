// ==UserScript==
// @name         TJISE urp教务系统自动评教脚本（GPLv3修改版）
// @namespace    https://greasyfork.org/zh-CN/users/985631-jamie-w
// @version      1.2
// @description   自动化五星评教，[基于MIT脚本修改] 自动化完成TJISE教务系统评教，自动填写五星评分和评语，GPLv3协议开源
// @license      GPL-3.0
// @author       felix2027
// @match        https://surp-443.webvpn.tjise.edu.cn/student/teachingEvaluation/newEvaluation/*
// @grant        none
// @homepageURL  https://github.com/felix2027/urp_eval_bot
// @supportURL   https://github.com/felix2027/urp_eval_bot/issues
// @original-script https://greasyfork.org/zh-CN/scripts/521265
// @downloadURL https://update.greasyfork.org/scripts/522530/TJISE%20urp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88GPLv3%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522530/TJISE%20urp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88GPLv3%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
/*!
 * 原始代码版权声明（MIT许可证）
 * Copyright (c) 2023 GreasyFork用户"A BCD"（原脚本链接：https://greasyfork.org/zh-CN/scripts/521265）
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 * 
 * 修改后代码版权声明（GPLv3）
 * Copyright (C) 2024 joey
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(function () {
  'use strict';

  // ================= 原始代码保留部分（MIT） =================
  /**
   * 填写评教内容 - 原始功能保留
   * @original-author "A BCD"（原GreasyFork脚本作者）
   * @source https://greasyfork.org/zh-CN/scripts/521265
   */
  function fillEvaluation() {
    // 填写五星评分
    document.querySelectorAll('.radio-bj').forEach(group => {
      const stars = group.querySelectorAll('.ace-icon.glyphicon-star');
      if (stars.length === 5) {
        stars[4].click();
      }
    });

    // 填写文本框
    document.querySelectorAll('textarea.form-control.value_element').forEach(textarea => {
      textarea.value = '无';
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    console.log("已完成五星评教填写");
  }

  // ================= 新增/修改代码部分（GPLv3） =================
  /**
   * 主控制逻辑（新增GPLv3代码）
   * @license GPL-3.0
   */
  function main() {
    const url = window.location.href;

    // 页面路由控制
    if (url.includes('/student/teachingEvaluation/newEvaluation/evaluation/')) {
      handleEvaluationPage();
    } else if (url.includes('/student/teachingEvaluation/newEvaluation/index')) {
      handleIndexPage();
    }
  }

  /**
   * 评教页面处理（新增GPLv3代码）
   */
  function handleEvaluationPage() {
    console.log("进入评教页面，启动自动化流程...");
    fillEvaluation();
    setupTimerMonitor();
  }

  /**
   * 计时器监控模块（改进版）
   * @license GPL-3.0
   */
  function setupTimerMonitor() {
    const timerCheckInterval = 1000;
    const timer = setInterval(() => {
      const timerElement = document.getElementById("timer");
      
      if (!timerElement) {
        console.warn("[GPL-Mod] 计时器元素缺失，终止监控");
        return clearInterval(timer);
      }

      if (timerElement.textContent.trim() === "0分00秒") {
        handleSaveOperation();
        clearInterval(timer);
      }
    }, timerCheckInterval);
  }

  /**
   * 保存操作处理（新增GPLv3代码）
   */
  function handleSaveOperation() {
    const saveButton = document.getElementById("savebutton");
    if (saveButton) {
      console.log("[GPL-Mod] 触发自动保存");
      saveButton.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
    } else {
      console.warn("[GPL-Mod] 保存按钮未找到");
    }
  }

  /**
   * 首页处理逻辑（新增GPLv3代码）
   */
  function handleIndexPage() {
    console.log("进入评教首页，初始化导航...");
    const tabSelector = '#myTab > li:nth-child(1) > a';
    const targetTab = document.querySelector(tabSelector);

    if (targetTab) {
      targetTab.click();
      console.log("[GPL-Mod] 已激活评教列表");
      setTimeout(checkEvaluationButtons, 1000);
    }
  }

  /**
   * 评教按钮检测（新增递归检测逻辑）
   */
  function checkEvaluationButtons() {
    const buttons = document.querySelectorAll('button[flag="jxpg"]');
    if (buttons.length > 0) {
      buttons[0].click();
      console.log("[GPL-Mod] 已触发评教入口");
    } else {
      console.log("[GPL-Mod] 评教按钮未加载，等待重试...");
      setTimeout(checkEvaluationButtons, 500);
    }
  }

  // 初始化入口
  window.addEventListener('DOMContentLoaded', main);
})();
