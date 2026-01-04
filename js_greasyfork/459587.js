// ==UserScript==
// @name         Identify AWS Console
// @description  Easily identify the AWS account by showing the account name and coloring the menu bar
// @author       Mathijs den Burger
// @version      0.2.0
// @license      MIT
// @match        https://console.aws.amazon.com/*
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @homepage     https://github.com/mdenburger/userscript-identify-aws-console
// @namespace    https://github.com/mdenburger/userscript-identify-aws-console
// @icon         https://raw.githubusercontent.com/mdenburger/userscript-identify-aws-console/main/images/aws-id-48.png
// @icon64       https://raw.githubusercontent.com/mdenburger/userscript-identify-aws-console/main/images/aws-id-64.png
// @supportURL   https://github.com/mdenburger/userscript-identify-aws-console/issues
// @downloadURL https://update.greasyfork.org/scripts/459587/Identify%20AWS%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/459587/Identify%20AWS%20Console.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const RED = "#aa0000";
  const GREEN = "#112f00";
  const AWS_DEFAULT_COLOR = "#232f3d";

  // Rules to determine the color of the AWS console menu bar based on the AWS account name.
  // The first rule with a matching regular expression wins.
  const ACCOUNT_NAME_COLOR_RULES = [
    {
      regex: /dev/i,
      color: GREEN
    },
    {
      regex: /prod/i,
      color: RED
    }
  ]

  // AWS accounts with a specific name and menu bar color.
  // Overrides the auto-discovered account name and menu bar color based on the account name color rules.
  const ACCOUNT_OVERRIDES = {
    123456789012: {
      name: "Demo account",
      color: GREEN,
    }
  };

  // main logic
  const account = getAccount();
  setMenuBarColor(account.color);
  setSearchPlaceholder(account.name);

  // helper functions

  function getAccount() {
    const cookie = getCookie('aws-userInfo-signed');
    const userInfo = parseJwt(cookie);
    return ACCOUNT_OVERRIDES[userInfo.sub] || parseAccount(userInfo);
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

  function parseAccount(userInfo) {
    let extractedName = getSamlAccountName(userInfo.iss) || userInfo.username;
    let name = decodeURIComponent(extractedName);
    let color = getMenuBarColor(name);

    return {name, color};
  }

  function getSamlAccountName(userInfo) {
    let regExp = new RegExp("awsapps\.com\/start\/#\/saml\/custom\/[0-9]+%20%28(.*)%29\/");
    let match = regExp.exec(userInfo.iss);
    return match ? match[1] : null;
  }

  function getMenuBarColor(accountName) {
    const rule = ACCOUNT_NAME_COLOR_RULES.find(rule => rule.regex.test(accountName));
    return rule?.color || AWS_DEFAULT_COLOR;
  }

  function setMenuBarColor(color) {
    let menuBarElems = document.querySelectorAll('header nav');
    for (let i = 0; i < menuBarElems.length; i++) {
      menuBarElems[i].style.backgroundColor = color;
    }
  }

  function setSearchPlaceholder(text) {
    let search = document.getElementById('awsc-concierge-input')
    if (search) {
      search.placeholder = text;
    }
  }
})();
