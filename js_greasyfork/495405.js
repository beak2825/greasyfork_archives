// ==UserScript==
// @name         Amex Bonus Tracker
// @namespace    http://tampermonkey.net/
// @version      v1.0.6
// @description  This script is used to track amex bunos progress
// @author       You
// @match        https://global.americanexpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=americanexpress.com
// @grant        none
// @license MIT 

// @downloadURL https://update.greasyfork.org/scripts/495405/Amex%20Bonus%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/495405/Amex%20Bonus%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const excludedDescriptions = [
    'MEMBERSHIP FEE',
    'PAYPAL ACCT PAYMENT RECEIVED - THANK YOU',
    'AUTOPAY PAYMENT - THANK YOU',
    'CR ADJ FOR BALANCE TRA',
    'ONLINE PAYMENT - THANK YOU',
    'MOBILE PAYMENT - THANK YOU',
    'AMEX AIRLINE FEE REIMBURSEMENT',
    'SHOP SAKS WITH PLATINUM CREDIT',
    'DELL CREDIT',
    'AMEX DINING CREDIT',
    'HILTON RESORT CREDIT',
    'AMEX FLIGHT CREDIT',
    'HILTON STATEMENT CREDIT',
    'AMEX DUNKIN\' CREDIT',
    'RENEWAL MEMBERSHIP FEE',
    'ADJUST MEMBERSHIP FEE',
    'MEM RWDS AIRLINE TAX OFFSET FEE',
    'RETURN PAYMENT FEE',
    'AMEX SEND: TRANSFER TO CARD',
    'AMEX SEND: ADD MONEY'
  ];

  function clickUntilGone() {
    // Get all buttons with the specified class
    var buttons = document.querySelectorAll('.btn.btn-sm.css-19hct2l');

    // If buttons exist, click the first one
    if (buttons.length > 0) {
      buttons[0].click();
      // Wait for a short delay to allow any potential changes in the DOM
      setTimeout(clickUntilGone, 200); // Adjust delay as needed
    } else {
      console.log('No more buttons to click.');
    }
  }

  function computeAndRender() {
    let parentElement = document.querySelector('[data-module-name="axp-activity-feed-transactions-table-transactions"]');
    let childElements = parentElement.querySelectorAll('.position-relative');
    let totalEligibleAmount = 0;
    let totalAmount = 0;
    let includedCount = 0;
    let excludedCount = 0;

    // Object to store the amount for each kind of excluded transaction
    let excludedAmounts = {};
    excludedDescriptions.forEach(desc => {
      excludedAmounts[desc] = 0;
    });

    let transactionRows = [];

    childElements.forEach((childElement) => {
      let descriptionElement = childElement.querySelector('.description');
      let priceElement = childElement.querySelector('.hidden-md-up.col-sm-4.col-sm-4.pad-responsive-r');

      if (descriptionElement && priceElement) {
        let description = descriptionElement.innerText;
        let price = parseFloat(priceElement.innerText.replace('$', '').replace(',', ''));
        totalAmount += price;

        if (!excludedDescriptions.includes(description)) {
          includedCount++;
          totalEligibleAmount += price;
          transactionRows.push(createTransactionRow(description, price, '🟢'));
        } else {
          excludedCount++;
          excludedAmounts[description] += price;
          transactionRows.push(createTransactionRow(description, price, '🔴'));
        }
      }
    });

    let summaryRows = [
      createSummaryRow('Total Eligible Spending for Bonus:', totalEligibleAmount, '🟢'),
      createSummaryRow('Total Amount:', totalAmount, '🟡'),
      createSummaryRow('Included Transactions:', includedCount, '🟡', false),
      createSummaryRow('Excluded Transactions:', excludedCount, '🟡', false),
    ];

    let excludedTransactionRows = Object.entries(excludedAmounts)
      .filter(([desc, amount]) => amount !== 0)
      .map(([desc, amount]) => createTransactionRow(desc, amount, '🔴'));

    // Create a new element to display the results in the desired format
    let resultContainer = document.createElement('div');
    resultContainer.className = 'axp-activity-balance card margin-b section-container transactions-data-table-v';
    resultContainer.id = 'amex-welcome-bonus-tracker';
    resultContainer.innerHTML = `
<div data-module-name="axp-activity-balance/Header"  class="card-block pad-1">
  <div class="pad-l col-md-9 col-xs-12">
    <h2 class="heading-4 heading-5-v">Amex Welcome Bonus Tracker</h2>
  </div>
</div>
<div data-module-name="axp-activity-balance/BalancesDataTable">
  <table class="table data-table axp-activity-balance__data-table__dataTable___6Mijm">
    <thead class="axp-activity-balance__data-table__tableHeader___ZW3ub">
    </thead>
    <tbody>
    <tr><td colspan="2"><strong>Summary</strong></td></tr>
    ${summaryRows.join('')}
    <tr><td colspan="2"><strong>Amount for each kind of excluded transaction:</strong></td></tr>
    ${excludedTransactionRows.join('')}
    <tr><td colspan="2"><strong>Transactions</strong></td></tr>
    ${transactionRows.join('')}
    </tbody>
  </table>
</div>
`;

    // Find the target element to insert the result container
    let targetElement = document.querySelector('div[data-module-name="axp-activity/Content/Range/ActivityMultiBalance"]')
      ?? document.querySelector('div[data-module-name="axp-activity/Content/Range/ActivityBalance"]')
      ?? document.querySelector('div[data-module-name="axp-activity-search-activity-balance"]');

    if (targetElement) {
      targetElement.parentNode.insertBefore(resultContainer, targetElement.nextSibling);
    } else {
      console.log('Target element not found');
    }
  }

  function createTransactionRow(description, amount, emoji) {
    return `
<tr class="row-sm-size">
  <td headers="header-blank0-0" class="" style="width: 100%;">
    <div class="pad-l body-2-v" data-module-name="axp-activity-balance/BalanceName" style="width: 100%; text-wrap: nowrap;">
      <span style="padding-right: 5px; text-transform: capitalize;">${emoji} ${description}</span>
    </div>
  </td>
  <td headers="header-blank1-0" class="text-align-right" style="width: 100%;">
    <p data-module-name="axp-activity-balance/BalanceAmount" class="axp-activity-balance__data-table__balanceDisplayTag___MdUas body-2-v ${amount < 0 ? 'dls-green' : ''}">
      ${amount >= 0 ? '$' : '-$'}${Math.abs(amount).toFixed(2)}
    </p>
  </td>
</tr>
`;
  }

  function createSummaryRow(label, value, emoji, isCurrency = true) {
    return `
<tr class="row-sm-size">
  <td headers="header-blank0-0" class="" style="width: 100%;">
    <div class="pad-l body-2-v" data-module-name="axp-activity-balance/BalanceName" style="width: 100%; text-wrap: nowrap;">
      <span style="padding-right: 5px; text-transform: capitalize;">${emoji} ${label}</span>
    </div>
  </td>
  <td headers="header-blank1-0" class="text-align-right" style="width: 100%;">
    <p data-module-name="axp-activity-balance/BalanceAmount" class="axp-activity-balance__data-table__balanceDisplayTag___MdUas body-2-v ${value < 0 && isCurrency ? 'dls-green' : ''}">
      ${isCurrency ? (value >= 0 ? '$' : '-$') + Math.abs(value).toFixed(2) : value}
    </p>
  </td>
</tr>
`;
  }

  function removeResultContainer() {
    let elementToRemove = document.getElementById('amex-welcome-bonus-tracker');
    if (elementToRemove) {
      elementToRemove.remove();
    }
  }


  function handleMutations(mutationsList, observer) {
    // Check if the target element is now available
    let targetElement = document.querySelector('div[data-module-name="axp-activity/Content/Range/ActivityMultiBalance"]')
      ?? document.querySelector('div[data-module-name="axp-activity/Content/Range/ActivityBalance"]')
      ?? document.querySelector('div[data-module-name="axp-activity-search-activity-balance"]');
    let buttonElement = document.getElementById('amex-welcome-bonus-tracker-button');

    if (targetElement && !buttonElement) {
      // Insert the button if the target element is found
      let button = document.createElement('button');
      button.textContent = 'Show Amex Spending Tracker';
      button.id = 'amex-welcome-bonus-tracker-button'

      // Style the button
      button.style.padding = '12px 24px';
      button.style.fontSize = '16px';
      button.style.fontWeight = 'bold';
      button.style.color = '#fff';
      button.style.backgroundColor = '#006fcf';
      button.style.border = 'none';
      button.style.borderRadius = '6px';
      button.style.cursor = 'pointer';
      button.style.transition = 'background-color 0.3s ease';

      // Add hover effect
      button.addEventListener('mouseover', function () {
        button.style.backgroundColor = '#0057a8';
      });

      button.addEventListener('mouseout', function () {
        button.style.backgroundColor = '#006fcf';
      });

      button.onclick = () => {
        removeResultContainer();
        clickUntilGone()
        computeAndRender();
      };
      button.style.margin = '10px 0'; // Add some margin for better spacing

      targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    }
  }

  const observerOptions = {
    childList: true, // Observe changes to the child nodes of the observed element
    subtree: true, // Include all descendant nodes of the observed element
  };

  // Create a MutationObserver instance
  const observer = new MutationObserver(handleMutations);

  // Start observing mutations on the body element
  observer.observe(document.body, observerOptions);
})();