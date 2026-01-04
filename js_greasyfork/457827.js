// ==UserScript==
// @name         Vault Catcher
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Watches for mistakes when giving members money from faction vault, and blocks requests that are over the user's total money
// @author       Lazerpent [2112641]
// @license      GNU GPLv3
// @match        https://www.torn.com/factions.php*
// @downloadURL https://update.greasyfork.org/scripts/457827/Vault%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/457827/Vault%20Catcher.meta.js
// ==/UserScript==
"use strict";

window.addEventListener('load', () => setTimeout(start, 250));
window.addEventListener('hashchange', () => setTimeout(start, 250));

let newBtn;
let inputOptions;
let moneyColumn;

function start() {
  const urlParams = new URLSearchParams(window.location.hash.replace('#/', '?'));
  if (!(urlParams.get('tab') === 'controls' && (!urlParams.get('option') || urlParams.get('option') === 'give-to-user'))) {
    return;
  }
  moneyColumn = document.getElementById('money');
  if (!moneyColumn) {
    setTimeout(start, 250);
    return;
  }
  const form = moneyColumn.getElementsByClassName('give-block')[0];
  if (!form) {
    setTimeout(start, 250);
    return;
  }
  inputOptions = moneyColumn.getElementsByClassName('inputs-wrap')[0];
  if (!inputOptions) {
    setTimeout(start, 250);
    return;
  }
  const radioWP = inputOptions.getElementsByClassName('radio-wp')[0];
  if (!radioWP) {
    setTimeout(start, 250);
    return;
  }
  const btnWrap = radioWP.getElementsByClassName('btn-wrap')[0];
  if (!btnWrap) {
    setTimeout(start, 250);
    return;
  }
  const btn = btnWrap.getElementsByClassName('btn')[0];
  if (!btn) {
    return;
  }

  btn.classList.remove('btn');

  btn.addEventListener('click', run);

  newBtn = document.createElement('span');
  newBtn.classList.add('btn');
  newBtn.style.display = 'none';

  radioWP.append(newBtn);
}

function run() {
  try {
    if (!inputOptions) {
      error(1);
      return;
    }
    const moneyGroup = inputOptions.getElementsByClassName('input-money-group')[0];
    if (!moneyGroup) {
      error(2);
      return;
    }
    const inputs = moneyGroup.getElementsByClassName('input-money');
    if (inputs.length === 0) {
      error(3);
      return;
    }

    const balance = getBankBalance();
    if (isNaN(balance)) {
      error(4);
      return;
    }

    const addMoney = document.getElementById('add-to-balance-money');
    if (!addMoney) {
      error(6);
      return;
    }

    if (addMoney.checked) {
      newBtn.click();
      return;
    }

    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
      const value = parseInt(inputs[i].value);
      if (isNaN(value)) {
        error(5);
        return;
      }
      if (value > balance) {
        valid = false;
      }
    }

    if (!valid) {
      const state = confirm('You seem to be giving this user more than they have in the faction bank. Do you want to continue?');
      if (state) {
        newBtn.click();
      }
    } else {
      newBtn.click();
    }
  } catch (e) {
    console.error(e);
    error(100);
  }
}

function error(id = 0) {
  alert('Error occurred while checking your vault transaction. Please notify Lazerpent [2112641], and double check your amount. Error ID: ' + id);
  newBtn.click();
}

function getBankBalance() {
  const userInput = document.getElementById('money-user');
  if (!userInput) {
    return NaN;
  }
  const username = userInput.value;

  const userListWrapper = moneyColumn.getElementsByClassName('userlist-wrapper')[0];
  if (!userListWrapper) {
    return NaN;
  }
  const userList = userListWrapper.getElementsByClassName('user-info-list-wrap')[0];
  if (!userList) {
    return NaN;
  }
  const userListChildren = userList.children;
  if (userListChildren.length === 0) {
    return NaN;
  }

  for (let i = 0; i < userListChildren.length; i++) {
    const depositor = userListChildren[i];
    if (depositor.children.length === 0) {
      continue;
    }
    const data = depositor.children[0];
    const nameWrapper = data.getElementsByClassName('name')[0];
    if (!nameWrapper) {
      continue;
    }

    if (nameWrapper.getAttribute('title') === username) {
      const amount = data.getElementsByClassName('amount')[0];
      if (!amount) {
        return 0;
      }

      const money = amount.getElementsByClassName('money')[0];
      if (!money) {
        return 0;
      }
      return parseInt(money.getAttribute('data-value'));
    }
  }
  return 0;
}