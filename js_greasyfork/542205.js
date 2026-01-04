// ==UserScript==
// @name         SCUT教务处自动评价
// @namespace    https://github.com/yluo996686/scut-auto-eval
// @version      1.3
// @description  自动填写评价+自动提交+自动点击“确定”，用于华南理工大学教务处评教页面。
// @author       落叶
// @match        https://pj.jw.scut.edu.cn/index.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542205/SCUT%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542205/SCUT%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function randomDelay(min = 500, max = 1500) {
    return Math.random() * (max - min) + min;
  }

  function triggerEvent(element, eventName) {
    const event = new Event(eventName, { bubbles: true });
    element.dispatchEvent(event);
  }

  function forceFillTextarea(textarea, text) {
    textarea.textContent = text;
    textarea.innerHTML = text;
    const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeValueSetter.call(textarea, text);
    triggerEvent(textarea, 'input');
    triggerEvent(textarea, 'change');
  }

  function autoClickConfirm() {
    const observer = new MutationObserver(() => {
      const confirmBtn = document.querySelector('.ant-modal-body .ant-btn-primary');
      if (confirmBtn) {
        observer.disconnect();
        setTimeout(() => {
          confirmBtn.click();
          triggerEvent(confirmBtn, 'click');
          console.log("✅ 已自动点击‘确定’按钮");
        }, 5000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function autoFillEvaluation() {
    const interval = setInterval(() => {
      try {
        const questions = Array.from(document.querySelectorAll('.index__subjectItem--XWS1b')).filter(q => q.isConnected);
        const submitBtn = document.querySelector('.index__submit--jiKIA');

        if (questions.length >= 14 && submitBtn) {
          clearInterval(interval);
          console.log("✅ 检测到题目和提交按钮，开始填写...");

          questions.forEach(question => {
            const radios = question.querySelectorAll('input[type="radio"]:not([disabled])');
            if (radios.length > 0) {
              const randomIndex = Math.floor(Math.random() * radios.length);
              radios[randomIndex].click();
              triggerEvent(radios[randomIndex], 'change');
            }

            const textarea = question.querySelector('textarea.index__UEditoTextarea--yga85');
            if (textarea) {
              forceFillTextarea(textarea, "老师教学认真，内容充实，推荐！");
            }
          });

          setTimeout(() => {
            submitBtn.click();
            triggerEvent(submitBtn, 'click');
            console.log("✅ 已提交评价，等待弹窗...");
            autoClickConfirm();
          }, randomDelay());
        }
      } catch (error) {
        console.error("❌ 脚本执行出错:", error);
      }
    }, 500);
  }

  window.addEventListener('load', autoFillEvaluation);
})();
