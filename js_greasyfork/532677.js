// ==UserScript==
// @name         温州大学SPOC答题小助手
// @namespace    hahahahaha
// @license MIT
// @version      1.02
// @description  查看答案是否正确
// @author       col
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532677/%E6%B8%A9%E5%B7%9E%E5%A4%A7%E5%AD%A6SPOC%E7%AD%94%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532677/%E6%B8%A9%E5%B7%9E%E5%A4%A7%E5%AD%A6SPOC%E7%AD%94%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // 拦截 jQuery.ajax 保存数据
  const _ajax = window.jQuery && window.jQuery.ajax;
  if (_ajax) {
    window.jQuery.ajax = function (opts) {
      const origSuccess = opts.success;
      opts.success = function (data, ...args) {
        try {
          if (opts.url.includes("getExamPaper")) {
            localStorage.setItem("spoc_examData", JSON.stringify(data));
            console.log("[自动答题] 成功拦截考试数据并保存！");
          }
        } catch (e) {
          console.error("拦截失败:", e);
        }
        if (typeof origSuccess === "function") {
          return origSuccess.call(this, data, ...args);
        }
      };
      return _ajax.call(this, opts);
    };
  }

  // 显示结果的函数
  function showResult() {
    const raw = localStorage.getItem("spoc_examData");
    if (!raw) {
      alert("未获取到考试数据，请先进入试卷页面！");
      return;
    }

    try {
      const examData = JSON.parse(raw);
      const rawArray = JSON.parse(examData.examSubmit.submitContent);
      const submitContent = rawArray.map(item => JSON.parse(item));

      let result = "📘 题目答题情况如下\n\n";
      submitContent.forEach((item, index) => {
        const markQuizScore = parseInt(item.markQuizScore);
        const isCorrect = markQuizScore !== 0;
        const questionNumber = index + 1;
        result += `题目 ${questionNumber}：${isCorrect ? '✅ 正确' : '❌ 错误'}\n`;
      });

      alert(result);
    } catch (err) {
      console.error("操作错误", err);
      alert("看一下描述再使用");
    }
  }

  // 添加浮动按钮
  function createFloatingButton() {
    const btn = document.createElement("button");
    btn.textContent = "📋 查看答题情况";
    btn.style.position = "fixed";
    btn.style.bottom = "30px";
    btn.style.right = "30px";
    btn.style.zIndex = "99999";
    btn.style.padding = "10px 16px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.style.opacity = "0.9";
    btn.addEventListener("mouseover", () => (btn.style.opacity = "1"));
    btn.addEventListener("mouseout", () => (btn.style.opacity = "0.9"));
    btn.onclick = showResult;
    document.body.appendChild(btn);
  }

  // Alt+A 快捷键也可以触发
  window.addEventListener("keydown", function (e) {
    if (e.altKey && e.key === "a") {
      showResult();
    }
  });

  // 页面加载完成后添加按钮
  window.addEventListener("load", () => {
    setTimeout(createFloatingButton, 1000); // 延迟避免干扰初始加载
  });

  console.log("[自动答题] 油猴脚本已加载，右下角按钮或 Alt+A 查看答题情况");
})();