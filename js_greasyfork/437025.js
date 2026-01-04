// ==UserScript==
// @name         Instant Bonk Accounts 50+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to instantly log in to bonk.io on one of ~250 level 50+ random public accounts
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437025/Instant%20Bonk%20Accounts%2050%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/437025/Instant%20Bonk%20Accounts%2050%2B.meta.js
// ==/UserScript==

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


var instantAccountButton = document.createElement('button');
instantAccountButton.innerHTML = 'RANDOM 50+';
instantAccountButton.classList.add('brownButton');
instantAccountButton.classList.add('brownButton_classic');
instantAccountButton.classList.add('buttonShadow');
instantAccountButton.style = 'pointer-events = auto';
document.getElementById('loginwindow').appendChild(instantAccountButton);


instantAccountButton.onclick = function() {
$.ajax({
  url: 'https://raw.githubusercontent.com/kydogia/bonk-instant-account/main/Bonk%20Accounts%20-%2050%2B%20Data.csv',
  dataType: 'text',
}).done(generateAccount);

function generateAccount(data) {
  var allAccounts = data.split(/\r?\n|\r/);
  var accountInfo = allAccounts[getRandomInt(allAccounts.length - 1)].split(',');

  var username = accountInfo[0];
  var password = accountInfo[1];

  document.getElementById('loginwindow_username').value = username;
  document.getElementById('loginwindow_password').value = password;
}
}