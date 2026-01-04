// ==UserScript==
// @name         Goto-login on gerrit
// @name:zh-CN   gerrit自动转到登录
// @namespace    https://greasyfork.org/en/scripts/468102-goto-login-on-gerrit
// @version      1.1
// @description  Check if you're logged in to gerrit or not.  If not, click the sign-in link. Based on https://greasyfork.org/en/scripts/441236-auto-login-on-gerrit
// @description:zh-CN 测试是否登录到了gerrit。如果没有则点击“登录”。基于https://greasyfork.org/en/scripts/441236-auto-login-on-gerrit
// @author       Allen Tse
// @match        SetYourGerritUrl
// @grant        none
// @license      Apache-2.0. And not welcomed to be modified or used by, or, if possible, redistributed to people who discriminate against people based on race, gender or sexual orientation.
// @downloadURL https://update.greasyfork.org/scripts/468102/Goto-login%20on%20gerrit.user.js
// @updateURL https://update.greasyfork.org/scripts/468102/Goto-login%20on%20gerrit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        try
        {
            console.log("Looking for login button...");
            var eleApp = document.querySelector("gr-app");
            if (eleApp) {
              var mainHeader = eleApp.shadowRoot.querySelector("gr-app-element").shadowRoot.querySelector("gr-main-header")
              if(mainHeader.attributes["logged-in"])
              {
                  console.log("Already logged in");
                  return;
              }

              var loginButton = mainHeader.shadowRoot.querySelector(".loginButton")
              console.log("query for login button: " + loginButton);
              if (loginButton)
              {
                  loginButton.click();
              }
            } else {
              eleApp = document.getElementsByClassName('topmenuMenuRight');
              if (eleApp && eleApp.length > 0) {
                eleApp = eleApp[0].getElementsByClassName('menuItem');
                if (eleApp && eleApp.length > 0) {
                  if (eleApp[0].textContent == 'Sign In') {
                    console.log("clicking sign in for gerrit");
                    eleApp[0].click();
                  } else {
                    console.log("menuItem="+eleApp[0].textContent);
                  }
                } else {
                  console.log("No menu item found for gerrit");
                }
              } else {
                console.log("No menu bar found for gerrit");
              }
            }
        } catch(e)
        {
            console.log("Caught: " + e);
        }}, 1000);

})();