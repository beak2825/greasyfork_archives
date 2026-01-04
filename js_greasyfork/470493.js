// ==UserScript==
// @name        Fix-Missing-Aliases-AWS-SAML
// @description  Adds aliases in AWS SAML page to accounts that miss them
// @match       https://signin.aws.amazon.com/saml
// @match       https://*.signin.aws.amazon.com/sessions/selector*
// @match       https://*.signin.aws.amazon.com/sessions/limit*
// @match       https://*.signin.aws.amazon.com/switchrole*
// @grant       none
// @version     1.2
// @namespace https://greasyfork.org/users/1122649
// @downloadURL https://update.greasyfork.org/scripts/470493/Fix-Missing-Aliases-AWS-SAML.user.js
// @updateURL https://update.greasyfork.org/scripts/470493/Fix-Missing-Aliases-AWS-SAML.meta.js
// ==/UserScript==

var accounts = {
  "123456789000": "Example Dev",
  "234567890000": "Example Prod",
};

// Function to update account names on AWS SAML page
function updateSAMLPage() {
  var keys = Object.keys(accounts);
  for (let i = 0; i < keys.length; i++) {
    var key = keys[i];
    var contains = `Account: ${key}`;

    var temp = document.querySelectorAll('.saml-account-name');

    for (let j = 0; j < temp.length; j++) {
      if (temp[j].textContent.includes(contains)) {
        var account = document.createElement("div");
        account.className = "saml-account-name";
        account.innerHTML = `${accounts[key]} <span class="account-number">#${key}</span>`;
        temp[j].outerHTML = account.outerHTML;
      }
    }
  }
}

// Function to update account names on AWS session selector page
function updateSessionSelectorPage() {
  var divList = document.querySelector('[data-testid="session-list"]')?.querySelectorAll('div')[0]?.querySelectorAll('div');
  if (!divList) {
    setTimeout(updateSessionSelectorPage, 50);
    return;
  }
  var textContentDivs = Array.from(divList).filter(div => div.className.startsWith('awsui_text-content_'));

  textContentDivs.forEach(session => {
    var linkElement = session.querySelector('a');
    if (linkElement) {
      var originalText = linkElement.textContent.trim();
      if (!/^[\d-]+$/.test(originalText)) return; // Only dashes and numbers

      var accountId = originalText.replace(/-/g, ''); // Remove dashes
      var spanElement = document.createElement('span');
      spanElement.textContent = ` (${originalText})`;

      linkElement.textContent = `${accounts[accountId]}`; // Modify the displayed text
      linkElement.after(spanElement);
    }
  });
}

function updateStrongElements() {
  var strongElements = document.querySelectorAll('strong');
  if (strongElements.length === 0) {
    setTimeout(updateStrongElements, 50); // Retry after 50ms
    return;
  }
  console.log(strongElements);
  Array.from(strongElements)
    .forEach(strongEl => {
      var originalText = strongEl.outerText.trim();
      if (!/^[\d-]+$/.test(originalText)) return; // Only process numbers and dashes

      var accountId = originalText.replace(/-/g, ''); // Remove dashes
      console.log(accountId);
      if (accounts[accountId]) {
        var spanElement = document.createElement('span');
        spanElement.textContent = ` (${originalText})`;

        strongEl.textContent = `${accounts[accountId]}`; // Replace text with account name
        strongEl.after(spanElement);

      }
    });
}


// Run appropriate function based on the page
if (window.location.pathname.includes("/saml")) {
  updateSAMLPage();
} else if (window.location.pathname.includes("/sessions/selector")) {
  updateSessionSelectorPage();
} else if (window.location.pathname.includes("/sessions/limit")) {
  updateStrongElements();
} else if (window.location.pathname.includes("/switchrole")) {
  updateStrongElements();
}
