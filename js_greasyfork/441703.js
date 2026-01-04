// ==UserScript==
// @name         MoneyForward Saving Rate
// @namespace    https://twitter.com/atarime_cafe
// @version      0.1
// @description  MoneyForwardに貯蓄率を表示します。
// @author       @atarime_cafe
// @match        https://moneyforward.com/cf
// @match        https://moneyforward.com/cf/summary
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441703/MoneyForward%20Saving%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/441703/MoneyForward%20Saving%20Rate.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const totalTable = document.querySelector('#monthly_total_table_kakeibo') ||
        document.querySelector('#monthly_total_table');
  if (!totalTable) {
    return;
  }
  const mutationTarget = totalTable.querySelector('.js-monthly_total');
  if (!mutationTarget) {
    return;
  }

  const toNumber = text => Number(text.replace('円', '').replaceAll(',', ''));

  const addSavingRate = (incomeTd, totalTd) => {
    const income = toNumber(incomeTd.innerText);
    if (income == 0) {
      return;
    }
    const total = toNumber(totalTd.innerText);
    const rate = Math.round(total / income * 100);
    totalTd.innerText = totalTd.innerText + ` (${rate}%)`;
  };

  const tdNodes = mutationTarget.querySelectorAll('td');
  addSavingRate(tdNodes[0], tdNodes[4]);

  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.addedNodes.length != 5) {
        return;
      }
      const incomeTd = record.addedNodes[0];
      const totalTd = record.addedNodes[4];
      addSavingRate(incomeTd, totalTd);
    });
  });
  observer.observe(mutationTarget, {
    childList: true,
  });
})();
