// ==UserScript==
// @name         Combined Userscript DKB Lori
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  Combine different scripts
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472052/Combined%20Userscript%20DKB%20Lori.user.js
// @updateURL https://update.greasyfork.org/scripts/472052/Combined%20Userscript%20DKB%20Lori.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to force update check for the script
    function forceUpdateCheck() {
        const scriptID = 'd06fa961-222a-487b-bbaf-37332b71ccaa'; // Replace with your script's ID from Tampermonkey dashboard
        const updateCheckInterval = 5000; // Update check interval in milliseconds (2 minutes in this example)

        // Force update check using GM_info API
        if (typeof GM_info === 'object' && GM_info.script && GM_info.script.version) {
            const versionTimestamp = new Date(GM_info.script.version).getTime();
            const currentTimestamp = new Date().getTime();
            if (currentTimestamp - versionTimestamp >= updateCheckInterval) {
                GM_info.script.version = new Date().toISOString();
                GM_info.scriptWillUpdate = true;
            }
        }

        // Repeat the update check after the specified interval
        setTimeout(forceUpdateCheck, updateCheckInterval);
    }

    // Start the update check loop
    forceUpdateCheck();

    // Rest of your user script code goes here...

(function() {
  

  // Values to be specified manually
  // For 'Add Transaction with Custom Transaction ID Check'
  const expectedTid = '1'; // The tid you want to match.
  const transaction = {
    amount: '23.000,00',
    description: 'Geld für Kapitalertrag Steuern',
    type: 'Überweisung Geld für Kapitalertrag Steuern',
    date: '30.07.2023',
    recipient: 'Payward Ltd.',
    iban: 'GB28 SEOU 0099 4400 2089 13',
    updateBalance: true
  };
  //  const transaction2 = {
  //  amount: '20.300,00',
  //  description: 'Lastschrift',
  //  type: 'LBS OST AG',
  //  date: '30.06.2023',
  //  recipient: 'BLUE STAR EXCHANGE PTY LTD',
  //  iban: 'GB28 SEOU 0099 4400 2089 13',
  //  updateBalance: true
  //};
/// DON'T FORGET TO ADD ANOTHER TRANSACTION BELOW

  // For 'Modify Balance and Amount Userscript'
  const targetIBAN = 'DE83 1203 0000 1028 6878 10'; // The IBAN you want to modify
  let balanceModificationAmount = 1000; // The desired balance modification amount
  let amountModificationValue = 1000; // The desired amount modification value

  // For 'IBAN Balance Updater in Umbuchung'
  const specifiedIBAN = "DE83 1203 0000 1028 6878 10 / Tagesgeld"; // The desired IBAN
  let specifiedAmount = 2000; // The desired amount

    balanceModificationAmount = amountModificationValue = specifiedAmount = 23000; // change for the desired amount for finanzstatus and umbuchung

  // 'Add Transaction with Custom Transaction ID Check' goes here
  // Function to add a new transaction
  function addTransaction(amount, description, type, date, recipient, iban, updateBalance) {
   const table = document.querySelector('.expandableTable.transactionsTable');
    if (!table) {
      console.error('Target table not found.');
      return;
    }

    const tableBody = table.querySelector('tbody');
    if (!tableBody) {
      console.error('Table body not found.');
      return;
    }

    // Remove elements with class "dailyBalanceText"
    const dailyBalanceTextElements = document.querySelectorAll('.dailyBalanceText');
    dailyBalanceTextElements.forEach(element => element.remove());

    const newRow = document.createElement('tr');
    newRow.className = 'mainRow'; // You may need to adjust the class name accordingly.

    // Create the cells for the new row
    const dateCell = document.createElement('td');
    dateCell.className = 'hide-for-xsmall-down transactionDate';
    dateCell.textContent = date;
    newRow.appendChild(dateCell);

    const typeCell = document.createElement('td');
    typeCell.className = 'transactionText';
    const typeDiv1 = document.createElement('div');
    typeDiv1.textContent = type;
    typeCell.appendChild(typeDiv1);
    const typeDiv2 = document.createElement('div');
    typeDiv2.textContent = recipient;
    typeCell.appendChild(typeDiv2);
    newRow.appendChild(typeCell);

    const ibanCell = document.createElement('td');
    ibanCell.className = 'show-for-large-up';
    const ibanDiv = document.createElement('div');
    ibanDiv.className = 'nowrap trimmed_iban';
    ibanDiv.textContent = iban;
    ibanCell.appendChild(ibanDiv);
    newRow.appendChild(ibanCell);

    const amountCell = document.createElement('td');
    amountCell.className = 'alignRight';
    const amountDiv = document.createElement('div');
    amountDiv.className = 'nowrap';
    const amountSpan = document.createElement('span');
    amountSpan.textContent = amount;
    if (parseFloat(amount.replace(/[^0-9,-]/g, '')) < 0) {
      amountSpan.classList.add('dkbred');
    }
    amountDiv.appendChild(amountSpan);
    amountCell.appendChild(amountDiv);
    newRow.appendChild(amountCell);

    const actionsCell = document.createElement('td');
    actionsCell.className = 'alignRight actions';
    const actionsLink = document.createElement('a');
    actionsLink.setAttribute('data-abx-jsevent', 'pick');
    actionsLink.setAttribute('href', 'https://www.ib.dkb.de/banking/finanzstatus/kontoumsaetze?$event=pick&id=0');
    actionsLink.className = 'evt-pick';
    actionsLink.setAttribute('tid', 'pick');
    const actionsIcon = document.createElement('span');
    actionsIcon.className = 'icons iconLoupe0';
    actionsIcon.title = 'Umsatzdetails';
    actionsLink.appendChild(actionsIcon);
    actionsCell.appendChild(actionsLink);
    newRow.appendChild(actionsCell);

    // Add the new row at the top of the table
    tableBody.insertBefore(newRow, tableBody.firstChild);

    // Update the balance if required
    if (updateBalance) {
      const balanceElement = document.querySelector('.clearfix.module.accountBalance strong span');
      if (balanceElement) {
        const currentBalance = parseFloat(balanceElement.textContent.replace(/[^0-9,-]/g, '').replace(',', '.'));
        const newBalance = currentBalance + parseFloat(amount.replace(/[^0-9,-]/g, '').replace(',', '.'));
        balanceElement.textContent = newBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
      } else {
        console.error('Balance element not found.');
      }
    }
  }

  // Function to check if the selected tid under class "field text" matches the specified number
  function isCustomTidSelected(expectedTid) {
    const selectElement = document.querySelector('.mandatory .field.text');
    if (selectElement) {
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      return selectedOption && selectedOption.getAttribute('tid') === expectedTid;
    }
    return false;
  }

  if (isCustomTidSelected(expectedTid)) {
    addTransaction(transaction.amount, transaction.description, transaction.type, transaction.date, transaction.recipient, transaction.iban, transaction.updateBalance);
      // HERE I CAN ADD ANOTHER TRANSACTION
      // addTransaction(transaction2.amount, transaction2.description, transaction2.type, transaction2.date, transaction2.recipient, transaction2.iban, transaction2.updateBalance);

  }
// Function to parse the balance value in the correct format
function parseBalanceValue(balanceText) {
  // Remove all dots used as thousands separators
  const balanceWithoutDots = balanceText.replace(/\./g, '');

  // Replace the comma with a dot to use it as a decimal separator
  const balanceWithDotDecimal = balanceWithoutDots.replace(',', '.');

  return parseFloat(balanceWithDotDecimal);
}

// Function to modify the balance for a specific IBAN
function modifyBalanceForIBAN(targetIBAN, targetAmount) {
  const mainRows = document.querySelectorAll('.mainRow');
  mainRows.forEach(mainRow => {
    const ibanElement = mainRow.querySelector('.iban.hide-for-small-down');
    const ibanText = ibanElement.textContent.trim();
    if (ibanText === targetIBAN) {
      const balanceElement = mainRow.querySelector('.alignRight.amount.bold');
      const currentBalance = parseBalanceValue(balanceElement.textContent);

      // Increase the balance by the specified amount
      const modifiedBalance = currentBalance + targetAmount;

      // Update the displayed balance
      balanceElement.textContent = modifiedBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }
  });
}

// Function to modify the amount extracted from the specified HTML source code
function modifyAmount(modificationValue) {
  const rows = document.querySelectorAll('tr.sum.bgColor');
  rows.forEach(row => {
    const amountCell = row.querySelector('td.amount span[style="white-space:nowrap"]');
    if (amountCell) {
      const amountText = amountCell.innerText;
      const amount = parseBalanceValue(amountText);

      // Modify the amount based on the provided modificationValue
      const modifiedAmount = amount + modificationValue;

      // Update the content of the amountCell with the modified amount
      amountCell.innerText = modifiedAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  });
}



  modifyBalanceForIBAN(targetIBAN, balanceModificationAmount);
  modifyAmount(amountModificationValue);

  // 'IBAN Balance Updater in Umbuchung' goes here
  function updateBalance(specifiedIBAN, specifiedAmount) {
    console.log("Starting IBAN Balance Updater script...");

    // Find the IBAN element on the page
    const ibanElement = document.querySelector('span.col65.floatRight strong');

    if (!ibanElement) {
        console.error("IBAN element not found!");
        return;
    }

    console.log("IBAN element found:", ibanElement.textContent.trim());

    // Extract the IBAN from the element
    const extractedIBAN = ibanElement.textContent.trim();

    // Check if the extracted IBAN matches the specified IBAN
    if (extractedIBAN === specifiedIBAN) {
        console.log("Specified IBAN matches the extracted IBAN:", extractedIBAN);

        // Find the balance elements on the page
        const balanceElements = document.querySelectorAll('strong');
        const balanceElement = Array.from(balanceElements).find(el => el.textContent.includes('EUR'));

        if (!balanceElement) {
            console.error("Balance element not found!");
            return;
        }

        console.log("Balance element found:", balanceElement.textContent.trim());

        // Extract the balance amount from the balance element
        const balanceText = balanceElement.textContent.trim();
        const balanceAmount = parseFloat(balanceText.replace(/[^\d,]+/g, '').replace(',', '.'));

        console.log("Balance amount extracted:", balanceAmount);

        // Update the balance amount
        const updatedBalance = balanceAmount + specifiedAmount;

        console.log("Updating balance amount with:", specifiedAmount);
        console.log("New balance amount:", updatedBalance.toFixed(2));

        // Format the updated balance in the desired format
        const formattedBalance = updatedBalance.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // Update the balance element with the new value
        balanceElement.textContent = `${formattedBalance} EUR`;

        console.log("Balance updated successfully!");
    } else {
        console.log("Specified IBAN does not match the extracted IBAN:", specifiedIBAN);
    }
  }

  updateBalance(specifiedIBAN, specifiedAmount);
})();
})();





