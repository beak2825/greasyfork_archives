// ==UserScript==
// @name         DeepCo Department Switcher
// @namespace    https://deepco.app/
// @version      2025-07-20
// @description  (for dev analysis only) Switches departments upwards if proc power is too high.
// @author       Corns
// @match        https://deepco.app/dig
// @match        https://deepco.app/departments
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543021/DeepCo%20Department%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/543021/DeepCo%20Department%20Switcher.meta.js
// ==/UserScript==

(function() {
  'use strict';

  new MutationObserver((mutation, observer) => {
    const deptScaling = document.querySelector('.department-scaling');
    if (deptScaling) {
      console.log("[DeptSwitch] Loaded");
      observer.disconnect();
      if (window.location.pathname.includes('/dig')) {
        // dig page, check for rewards limited
        checkLimited();
      } else {
        // departments page, change level
        chooseLevel();
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  function checkLimited() {
    const el = document.querySelector('span.ascii-progress-bar.normal.department-progress-bar[title="Efficiency: 100.0%"]');

    localStorage.setItem('targetLevel', getLevel());

    if (!el) {
      console.log('[DeptSwitch] Rewards limited detected, redirecting to /departments');
      localStorage.setItem('targetLevel', getLevel() + 1);
      window.location.href = '/departments';
      return;
    }

    // switch department to more/less ppl as needed
    const teamwork = localStorage.getItem('teamworkNeeded') === "false";
    const comparison = teamwork ? (a, b) => a < b : (a, b) => a > b;

    if (!teamwork) return;

    // 1️⃣ Count operators in department-scaling
    const deptScaling = document.querySelector('.department-scaling');
    const deptOperators = deptScaling ? deptScaling.querySelectorAll('a').length - 1 : 0; // exclude current player

    // 2️⃣ Sum operators in shadow departments
    const shadowForms = document.querySelectorAll('#grid-shadow-departments form.shadow-form');

    console.log(`[DeptSwitch] Current occupancy: ${deptOperators}`);

    for (const form of shadowForms) {
      const small = form.querySelector('small');
      if (!small) continue;
      const match = small.textContent.match(/(\d+)\s+operator[s]?/i);
      if (!match) continue;
      const shadowOperators = parseInt(match[1], 10);
      console.log(`[DeptSwitch] Shadow has ${shadowOperators}`);
      if (comparison(shadowOperators, deptOperators)) {
        console.log(`[DeptSwitch] Shadow has (${shadowOperators} ops vs ${deptOperators}) → navigating!`);
        window.location.href = '/departments';
        return;
      }
    }
  }

  function getLevel() {
    // Find the department-stats element
    const deptStats = document.querySelector('p.department-stats');

    let dcValue = 0; // default if not found

    if (deptStats) {
      const text = deptStats.textContent.trim();

      // Match DC followed by optional + and digits, e.g., DC4A or DC+4
      const match = text.match(/DC\+?(\d+)/i);
      if (match) {
        dcValue = parseInt(match[1], 10);
      }
    }
    return dcValue;
  }

  function chooseLevel() {
    const levelToId = {
      0: 2,
      1: 1,
      2: 3,
      3: 4,
      4: 5,
      5: 6
    };
    const targetLevel = parseInt(localStorage.getItem('targetLevel'), 10);
    const teamwork = localStorage.getItem('teamworkNeeded') === "false";

    const targetId = levelToId[targetLevel];
    if (!targetId) {
      console.log(`[DeptSwitch] Invalid target level: ${targetLevel}`);
      return;
    }

    // Build the action string
    const action = `/departments/switch?id=${targetId}`;

    // 1️⃣ Main department
    const mainForm = document.querySelector(`form.department-form[action="${action}"]`);
    if (!mainForm) {
      console.log(`[DeptSwitch] No department form found for id=${targetId}`);
      return;
    }
    const scaling = mainForm.querySelector('.department-scaling');
    let operatorCount = scaling ? scaling.querySelectorAll('.worker-dot').length : 0;
    if (mainForm.querySelector(".current-badge")) operatorCount--;
    console.log(`[DeptSwitch] Main department has ${operatorCount} operators.`);
    let targetButton = mainForm.querySelector('button');

    // 2️⃣ Shadow departments
    const section = mainForm.closest('.department-section');
    if (section) {
      const shadowForms = section.querySelectorAll('form.shadow-form');

      shadowForms.forEach(form => {
        const small = form.querySelector('small');
        if (!small) return;
        const match = small.textContent.match(/(\d+)\s+operator[s]?/i);
        if (!match) return;
        let count = parseInt(match[1], 10);
        if (form.querySelector(".current-badge")) count--;
        console.log(`[DeptSwitch] Found shadow with ${count} operators.`);
        if (teamwork) {
          if (count < operatorCount) {
            operatorCount = count;
            targetButton = form.querySelector('button');
          }
        } else {
          if (count > operatorCount) {
            operatorCount = count;
            targetButton = form.querySelector('button');
          }
        }
      });
    }

    // Click it!
    if (targetButton) {
      console.log(`[DeptSwitch] Switching to department ID ${targetId} (level ${targetLevel})`);
      // localStorage.removeItem('targetLevel');
      targetButton.click();
    } else {
      console.log('[DeptSwitch] No valid department or shadow department found.');
    }
  }
})();