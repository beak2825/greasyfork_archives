// ==UserScript==
// @name Jane's MyMav Fixes
// @namespace janeirl.dev
// @description An opinionated user script that improves the UTA MyMav website.
// @author JaneIRL
// @license Unlicense
// @version 1.1.4
// @match https://mymav.utshare.utsystem.edu/*
// @downloadURL https://update.greasyfork.org/scripts/456639/Jane%27s%20MyMav%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/456639/Jane%27s%20MyMav%20Fixes.meta.js
// ==/UserScript==

const FixIntervalMs = 100;
const MaxFixAttempt = 50;

const Name = "Jane's MyMav Fixes";
const Namespace = 'janeirl.dev';

console.log(`[${Name}] Loaded!`);

let mainCounter = 0;
const mainInterval = setInterval(() => {
  try {
    // Fix alert.
    const alert = document.getElementById('alertId1');
    if (alert && !alert.classList.contains(`--${Namespace}--fixed`)) {
      // Move it to a proper parent so it's no longer hidden behind something.
      const container = document.getElementById('win0divPTNUI_LP_PAGE_row$0');
      alert.parentElement.removeChild(alert);
      container.prepend(alert);

      // Styles.
      alert.style.position = 'static';
      alert.style.margin = '0';

      alert.classList.add(`--${Namespace}--fixed`);

      addStyle(`
        #alertId1 {
          max-height: 3rem;
          overflow-y: hidden;
        }

        #alertId1:hover {
          max-height: none;
        }
      `);

      // Add our alert banner.
      const success = alert.cloneNode();
      success.id = `--${Namespace}--loaded-alert`;
      success.classList.remove('alert-danger');
      success.classList.add('alert-success');
      success.style.cssText = "position: static; margin: 0; box-sizing: border-box; font-family: \"Segoe UI\", system-ui, \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; word-spacing: 0px;";
      success.innerHTML = `[${Name}] The user script has been enabled. If you encounter any problems in MyMav, try disabling the script first to see if the issue was caused by the script. Contact <a href="mailto:guardian.text1864@janeirl.dev">JaneIRL</a> for feedback.`;
      container.prepend(success);
      const dismissButton = document.querySelector('button.btn.btn-link.dismissButton');
      if (dismissButton) {
        dismissButton.parentElement.removeChild(dismissButton);
        alert.prepend(dismissButton);
        dismissButton.style.position = 'static';
        dismissButton.style.float = 'right';
      }
    }

    // Fix To Do List icons.
    document
      .querySelectorAll('img[src*="CHECKLIST_64_1.png"]')
      ?.forEach(img => img.src = '/cs/ARCSPRD/cache/CHECKLIST_64_1.png');

    // Fix widget icons.
    document
      .querySelectorAll('img[src*="UTA_HP_ADM_1376.svg"]')
      ?.forEach(img => {
        img.src = '';
        img.alt = 'Admissions';
        img.style.color = 'white';
      });
    document
      .querySelectorAll('img[src*="UTA_HP_ACC_1375.svg"]')
      ?.forEach(img => {
        img.src = '';
        img.alt = 'Accounts';
        img.style.display = 'none';
        img.style.color = 'white';
      });

    // Recolor Completed Agreements red dot as gray
    const $notifications = document.querySelectorAll('.uta_notification');
    if ($notifications.length >= 3) {
      $notifications[2].style.backgroundColor = '#222';
    }

    // Add Goated Schedule Planner
    document
      .querySelectorAll('.ps_box-value')
      ?.forEach(text => {
        if (text.innerText === 'MavPlanner' && !text.classList.contains(`--${Namespace}--fixed`)) {
          text.style.color = 'gray';
          text.style.fontSize = '0.8rem';
          text.style.textDecoration = 'line-through';
          text.classList.add(`--${Namespace}--fixed`);

          const plannerUrl = 'https://mymav.utshare.utsystem.edu/psc/ARCSPRD/EMPLOYEE/SA/c/CIVCS_FLUID_MENU.CIVCS_LAUNCH_FL.GBL';
          const goatedPlannerAnchor = document.createElement('a');
          goatedPlannerAnchor.innerText = 'Goated Schedule Planner';
          goatedPlannerAnchor.href = plannerUrl;
          goatedPlannerAnchor.style.fontSize = '1.1rem';
          goatedPlannerAnchor.onclick = () => {
            window.location.replace(plannerUrl);
          };
          text.parentElement.append(document.createElement('br'), goatedPlannerAnchor);

          const blockDiv = text.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
          if (blockDiv) {
            blockDiv.style.cssText = 'background-color: white !important;';
          }
        }
      });
  } catch (e) {
    console.error(`[${Name}]`, e);
  } finally {
    if (mainCounter++ > MaxFixAttempt) {
      clearInterval(mainInterval);
    }
  }
}, FixIntervalMs);

function addStyle(content) {
  const $style = document.createElement('style');
  $style.textContent = content;
  const $head = document.querySelector('head');
  $head.append($style);
}
