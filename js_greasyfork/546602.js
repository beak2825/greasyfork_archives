// ==UserScript==
// @name         Udemy Quiz helper
// @namespace    http://tampermonkey.net/
// @version      2025-08-22
// @description  Insert visible & copyable A/B/C/D... in front of each quiz option <p>, add button to copy overall explanation only when next question button exists.
// @author       You
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546602/Udemy%20Quiz%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/546602/Udemy%20Quiz%20helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 等待元素出現
  function waitForElement(selector, callback) {
      const observer = new MutationObserver(() => {
          const el = document.querySelector(selector);
          if (el) {
              observer.disconnect();
              callback(el);
          }
      });
      observer.observe(document.body, { childList: true, subtree: true });
  }

  // ======= 複製題目與選項按鈕 =======
  function createQuestionButton() {
      const btn = document.createElement('button');
      btn.innerText = '📋 複製題目與選項';
      btn.style.position = 'fixed';
      btn.style.top = '80px';
      btn.style.right = '20px';
      btn.style.zIndex = '9999';
      btn.style.backgroundColor = '#4CAF50';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.padding = '10px 15px';
      btn.style.borderRadius = '6px';
      btn.style.fontSize = '14px';
      btn.style.cursor = 'pointer';
      btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

      btn.addEventListener('click', () => {
          const questionEl = document.querySelector('#question-prompt');
          if (!questionEl) {
              btn.style.backgroundColor = '#f44336'; // 紅色
              setTimeout(() => btn.style.backgroundColor = '#4CAF50', 800);
              return;
          }

          // 取得題目文字
          const questionText = Array.from(questionEl.querySelectorAll('p'))
          .map(p => p.innerText.trim())
          .join('\n');


          // 抓取選項文字
          const options = [];
          document.querySelectorAll('ul.ud-unstyled-list > li').forEach((li, i) => {
              const answerDiv = li.querySelector(
                  'div.ud-heading-md div[class^="mc-quiz-answer--answer-body--"][class*="rt-scaffolding"]'
              );
              if (answerDiv) {
                  options.push(`${String.fromCharCode(65 + i)}. ${answerDiv.innerText.trim()}`);
              }
          });

          const fullText = `【題目】\n${questionText}\n\n【選項】\n${options.join('\n')}`;
          GM_setClipboard(fullText);

          const originalColor = btn.style.backgroundColor;
          btn.style.backgroundColor = '#FFD700'; // 黃色
          setTimeout(() => {
              btn.style.backgroundColor = originalColor;
          }, 800);
      });

      document.body.appendChild(btn);
  }

  waitForElement('#question-prompt', createQuestionButton);

  // ======= 新增「複製總體解釋」按鈕 =======
  function createExplanationButton() {
      // 如果不存在下一題按鈕，不顯示
      const nextBtn = document.querySelector('button[data-purpose="go-to-next-question"]');
      if (!nextBtn) return;

      // 避免重複插入
      if (document.querySelector('.copy-overall-explanation-btn')) return;

      const btn = document.createElement('button');
      btn.innerText = '📄 複製總體解釋';
      btn.className = 'copy-overall-explanation-btn';
      btn.style.position = 'fixed';
      btn.style.top = '130px';
      btn.style.right = '20px';
      btn.style.zIndex = '9999';
      btn.style.backgroundColor = '#2196F3';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.padding = '10px 15px';
      btn.style.borderRadius = '6px';
      btn.style.fontSize = '14px';
      btn.style.cursor = 'pointer';
      btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

      btn.addEventListener('click', () => {
          const explanationEl = document.querySelector('#overall-explanation');
          if (!explanationEl) {
              btn.style.backgroundColor = '#f44336'; // 紅色
              setTimeout(() => btn.style.backgroundColor = '#2196F3', 800);
              return;
          }

          const text = explanationEl.innerText.trim();
          GM_setClipboard(text);

          const originalColor = btn.style.backgroundColor;
          btn.style.backgroundColor = '#4CAF50'; // 綠色
          btn.innerText = '✅ 已複製';
          setTimeout(() => {
              btn.style.backgroundColor = originalColor;
              btn.innerText = '📄 複製總體解釋';
          }, 1200);
      });

      document.body.appendChild(btn);
  }

  // 動態偵測下一題按鈕是否出現
  const observer = new MutationObserver(() => {
      const existingBtn = document.querySelector('.copy-overall-explanation-btn');
      const nextBtn = document.querySelector('button[data-purpose="go-to-next-question"]');

      // 如果下一題按鈕存在，且還沒有插入，就新增
      if (nextBtn && !existingBtn) {
          createExplanationButton();
      }

      // 如果下一題按鈕消失，就移除複製按鈕
      if (!nextBtn && existingBtn) {
          existingBtn.remove();
      }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ======= 選項 A/B/C/D 標示 =======
  function getOptionItems(root = document) {
      return Array.from(root.querySelectorAll('li[class^="mc-quiz-question--answer"]'));
  }

  function annotateOptions() {
      const items = getOptionItems();
      if (!items.length) return;

      items.forEach((item, idx) => {
          const firstP = item.querySelector('p');
          if (!firstP) return;

          const existed = firstP.querySelector('span.tm-option-letter');
          if (existed) existed.remove();

          const letter = indexToLetters(idx);

          const span = document.createElement('span');
          span.className = 'tm-option-letter';
          span.textContent = "選項 " + letter + '. ';
          span.style.fontWeight = 'bold';
          span.style.marginRight = '6px';
          span.style.color = '#8ab4ff';

          firstP.insertBefore(span, firstP.firstChild);
      });
  }

  function indexToLetters(index) {
      let n = index;
      let s = '';
      do {
          s = String.fromCharCode(65 + (n % 26)) + s;
          n = Math.floor(n / 26) - 1;
      } while (n >= 0);
      return s;
  }

  let scheduled = false;
  function scheduleAnnotate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
          scheduled = false;
          annotateOptions();
      });
  }

  function setupObserver() {
      const root = document.body;
      if (!root) return;

      const mo = new MutationObserver((mutations) => {
          if (mutations.some(m => {
              return (m.addedNodes && [...m.addedNodes].some(n => isQuizNode(n))) ||
                     (m.removedNodes && m.removedNodes.length > 0);
          })) {
              scheduleAnnotate();
          }
      });

      mo.observe(root, { childList: true, subtree: true });
      annotateOptions();
      hookHistory(scheduleAnnotate);
      window.addEventListener('popstate', scheduleAnnotate);
      window.addEventListener('hashchange', scheduleAnnotate);
  }

  function isQuizNode(node) {
      if (!(node instanceof Element)) return false;
      return node.matches('li[class^="mc-quiz-question--answer"], ul[aria-labelledby="question-prompt"], [class^="question-page"], [class^="quiz-page-layout"]');
  }

  function hookHistory(onChange) {
      const wrap = (type) => {
          const orig = history[type];
          if (typeof orig !== 'function') return;
          history[type] = function () {
              const ret = orig.apply(this, arguments);
              try { onChange(); } catch {}
              return ret;
          };
      };
      wrap('pushState');
      wrap('replaceState');
  }

  setupObserver();
  setInterval(annotateOptions, 3000);
})();
