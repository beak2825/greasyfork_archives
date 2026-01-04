// ==UserScript==
// @name         Identify AWS Console
// @description  Easily identify the AWS account by showing the account name and ID, and coloring the top bar
// @version      2.4.1
// @license      MIT
// @match        https://console.aws.amazon.com/*
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @inject-into  content
// @namespace https://greasyfork.org/users/1069355
// @downloadURL https://update.greasyfork.org/scripts/501101/Identify%20AWS%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/501101/Identify%20AWS%20Console.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RED = "#be0000";
  const GREEN = "#286e01";
  const BLUE = "#118cd4";
  const AWS_DEFAULT_COLOR = "#232f3d";
  const TERRAFORM_COLOR = "#5c4ee5";

  const terraformManagedAccounts = [
    "555204499888",
    "654654290194",
    "564173995411",
    "412181355370",
    "342815817183",
    "305551662246",
    "972199851382",
    "371360243830"
];

  //main_logic
  const account = getAccount();
  console.log("Account Info: ", account);
  setMenuBarColorWhenReady(account.color);
  setSearchPlaceholderWhenReady(`${account.name} ${account.id}`);

  // helper_functions

  function getAccount() {
    const cookie = getCookie('aws-userInfo-signed');
    const userInfo = parseJwt(cookie);
    console.log("User Info: ", userInfo);
    const accountId = getAccountIdFromMeta();
    return parseAccount(userInfo, accountId);
  }

  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const nameValue = cookie.split("=");
      if (name === nameValue[0].trim()) {
        return decodeURIComponent(nameValue[1]);
      }
    }
    throw `Cannot find cookie ${name}`;
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  function getAccountIdFromMeta() {
    const meta = document.querySelector('meta[name="awsc-session-data"]');
    if (meta) {
      const sessionData = JSON.parse(meta.getAttribute('content').replace(/&quot;/g, '"'));
      return sessionData.accountId || "undefined";
    }
    return "undefined";
  }

  function parseAccount(userInfo, accountId) {
    // Use the sub field with the account name
    let name = userInfo.sub;
    let color = getMenuBarColor(name, accountId);
    return { name, id: accountId, color };
  }

  function getMenuBarColor(accountName, accountId) {
    console.log("Checking account for color: ", accountName, accountId);
    if (terraformManagedAccounts.includes(accountId)) {
      console.log(`Matched Terraform-managed account (${accountId}). Setting color to TERRAFORM.`);
      return `linear-gradient(135deg, ${RED}, ${TERRAFORM_COLOR})`;
    } else if (accountName.toLowerCase().includes("playground")) {
      console.log("Matched playground account. Setting color to GREEN.");
      return GREEN;
    } else if (accountName.toLowerCase().includes("support")) {
      console.log("Matched support account. Setting color to BLUE.");
      return BLUE;
    } else {
      console.log("Non-playground account. Setting color to RED.");
      return RED;
    }
  }

  function setMenuBarColorWhenReady(color) {
    const observer = new MutationObserver(() => {
      const menuBarElems = document.querySelectorAll('header nav');
      if (menuBarElems.length > 0) {
        console.log("Menu bar elements found: ", menuBarElems.length);
        setMenuBarColor(menuBarElems, color);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function setMenuBarColor(menuBarElems, color) {
    for (let i = 0; i < menuBarElems.length; i++) {
      console.log("Setting menu bar color: ", color);
      menuBarElems[i].style.background = color;
    }
  }

  function setSearchPlaceholderWhenReady(text) {
    const observer = new MutationObserver(() => {
      const search = document.getElementById('awsc-concierge-input');
      if (search) {
        console.log("Search input field found.");
        search.placeholder = text;
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

})();