// ==UserScript==
// @name         Remove Four Homework Tasks (Planner)
// @namespace    https://greasyfork.org/users/YOUR-ID
// @version      1.0
// @description  Deletes four specific completed homework tasks from my planner page
// @author       Caleb
// @match        https://YOUR.PLANNER.URL/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546413/Remove%20Four%20Homework%20Tasks%20%28Planner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546413/Remove%20Four%20Homework%20Tasks%20%28Planner%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const targets = [
    { subject: 'math', desc: 'finish algebra problems from chapter 5, pages 124-127' },
    { subject: 'science', desc: 'write up the photosynthesis experiment from last week' },
    { subject: 'history', desc: '5-page essay on causes of world war i' },
    { subject: 'english', desc: 'english literature - read and take notes on chapter 8' }
  ];

  function removeExactTasks() {
    document.querySelectorAll('[data-dynamic-content="true"]').forEach(box => {
      const subject = box.querySelector('.subject')?.textContent.trim().toLowerCase();
      const desc = box.querySelector('.description')?.textContent.trim().toLowerCase();
      if (targets.some(t => t.subject === subject && desc.includes(t.desc))) {
        box.remove();
        console.log(`Removed: ${subject}`);
      }
    });
  }

  removeExactTasks();
  new MutationObserver(removeExactTasks)
    .observe(document.body, { childList: true, subtree: true });
})();