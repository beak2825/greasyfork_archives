// ==UserScript==
// @name         AccesD CC Transactions
// @namespace    gabdem
// @version      1.4
// @description  Adds a button to format CC transactions and copy to clipboard
// @author       Rur
// @match        https://accesd.mouv.desjardins.com/sommaire-perso/sommaire/sommaire-spa/CC/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=desjardins.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470621/AccesD%20CC%20Transactions.user.js
// @updateURL https://update.greasyfork.org/scripts/470621/AccesD%20CC%20Transactions.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', () => {
    const interval = setInterval(function () {
      const transactionsContainers = document.querySelectorAll('app-transactions > div');
      if (!transactionsContainers || transactionsContainers.length < 3) {
        return false;
      }

      clearInterval(interval);

      const lang = document.querySelector('html').getAttribute('lang');
      const postedTransactionsContainer = transactionsContainers[2];

      const transactionsByMonthContainers = postedTransactionsContainer.querySelectorAll('table');
      transactionsByMonthContainers.forEach((container) => {
        addCopyTransactionsButton(container, lang);
      });
    }, 1000);
  }, false);

  function addCopyTransactionsButton(transactionsContainer, lang) {
    transactionsContainer.style.position = 'relative';

    const copyButton = document.createElement('button');
    copyButton.style.position = 'absolute';
    copyButton.style.top = '0';
    copyButton.style.right = '0';
    copyButton.textContent = 'Copy';

    transactionsContainer.querySelectorAll('tbody > tr');
    copyButton.onclick = () => extractTransactionsToClipboard(transactionsContainer, lang);

    transactionsContainer.appendChild(copyButton);
  }

  function extractTransactionsToClipboard(transactionsContainer, lang) {
    const transactions = Array.from(transactionsContainer.querySelectorAll('tbody > tr.cliquable')).map((container) => {
      let descriptionElement = container.querySelector('span.descriptionTransaction');
      const hasCategory = !!descriptionElement;

      if (!hasCategory) {
        // descriptionElement = container.querySelector('span.descriptionTransactionSansIcone');
        descriptionElement = container.querySelector('td:nth-child(2) span:nth-child(1)');
      }

      const transaction = {
        date: container.querySelector('td:nth-child(1) span:nth-child(1)').textContent.trim(),
        description: descriptionElement.textContent.trim(),
        category: hasCategory ? container.querySelector('span.categorieTransaction').textContent.trim() : '',
        bonus: formatBonus(container.querySelector('td:nth-child(3)').textContent, lang),
        amount: formatAmount(container.querySelector('td:nth-child(4)').textContent, lang),
      };

      if (transaction.amount.startsWith('+')) {
        transaction.amount = `-${transaction.amount.substring(1)}`;
        transaction.description += ' (REMBOURSEMENT)';
      }

      return transaction;
    });

    const transactionsString = transactions.map(({date, description, amount, category, bonus}) => {
      return `${date}\t${description}\t${category}\t${bonus}\t${amount}`;
    }).join('\n');

    navigator.clipboard.writeText(transactionsString).then(
        () => alert(`${transactions.length} transactions copied to clipboard`),
        error => {
          alert('Error while copying transactions to clipboard, see console for more details');
          console.error(error)
        }
    );
  }

  function formatAmount(amount, lang) {
    const decimaledAmount = lang == 'en'
        ? amount.replace(',', '')
        : amount.replace(/\s|\$/g, '').replace(',', '.')

    return decimaledAmount.replace('$', '').trim();
  }

  function formatBonus(bonus, lang) {
    if (!bonus) {
      return '';
    }

    const decimaledBonus = lang == 'en'
        ? bonus.replace('.', '')
        : bonus.replace(',', '')

    return '0.0' + decimaledBonus.replace('%', '').trim();
  }
})();
