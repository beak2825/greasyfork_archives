// ==UserScript==
// @name        Better Simple Funding Schedules
// @namespace   lousando
// @match       https://bank.simple.com/
// @match       https://bank.simple.com/expenses*
// @match       https://bank.simple.com/goals*
// @run-at      document-end
// @grant       none
// @require     https://unpkg.com/currency.js@1.2.2/dist/currency.min.js
// @version     1.0.1
// @author      Louis Sandoval
// @description Calculates the total amount of money pulled out from each Simple funding schedule.
// @downloadURL https://update.greasyfork.org/scripts/406623/Better%20Simple%20Funding%20Schedules.user.js
// @updateURL https://update.greasyfork.org/scripts/406623/Better%20Simple%20Funding%20Schedules.meta.js
// ==/UserScript==

// get account and user ID values from main body tag
const userId = document.body.dataset.uuid;
const accountId = document.body.dataset.accountReference;

!(async () => {
  
  // Pull funding schedule data using the network from expenses and goals.
  // ======================================================================
  
  const [
    goalSummary,
    expensesSummary
  ] = await Promise.all([
    fetch(`https://bank.simple.com/goals-api/users/${userId}/accounts/${accountId}/goals/summary`)
      .then(r => r.json()),
    fetch(`https://bank.simple.com/goals-api/users/${userId}/accounts/${accountId}/expenses/summary`)
      .then(r => r.json())
  ]);
  
  // Combine total money out from each funding schedule using expenses and goals.
  // =============================================================================
  
  const summaries = {};
  const currencyScalar = 10000;
  
  [
    ...goalSummary.fundingSchedules,
    ...expensesSummary.fundingSchedules
  ].forEach(schedule => {
    if (!summaries.hasOwnProperty(schedule.reference)) {
      // ignore round-up schedule
      if (schedule.name !== "day") {
        summaries[schedule.reference] = {
          name: schedule.name,
          total_money_out: schedule.expectedContributionAmount / currencyScalar
        };
      }
    } else {
      summaries[schedule.reference].total_money_out += schedule.expectedContributionAmount / currencyScalar;
    }
  });

  // Add the data to the DOM
  // ========================
  
  const balancesElement = document.querySelector(".balances");
  
  for (let summaryKey in summaries) {    
    const summary = summaries[summaryKey];
    const summaryElement = document.createElement("div");
    
    
    summaryElement.classList.add("balances-group-row", "row"); // style it to make it look a bit natural
    
    // a total of 
    const prefixTextElement = document.createElement("span");
    prefixTextElement.innerText = "A total of ";
    summaryElement.appendChild(prefixTextElement);
    
    // total money out
    const totalMoneyOutElement = document.createElement("strong");
    totalMoneyOutElement.classList.add("amount");
    totalMoneyOutElement.innerText = `${currency(summary.total_money_out, { formatWithSymbol: true }).format()}`;
    summaryElement.appendChild(totalMoneyOutElement);
    
    // from funding schedule...
    const fromEachFundingScheduleElement = document.createElement("span");
    fromEachFundingScheduleElement.innerText = ` is pulled out from ${summary.name}`;
    summaryElement.appendChild(fromEachFundingScheduleElement);
        
    balancesElement.appendChild(summaryElement);
  }
  
  
})()
