// ==UserScript==
// @name         TUD AutoLogin
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Stop wasting your time entering login credentials or pressing useless buttons!
// @author       spyfly
// @website      https://tud-autologin.spyfly.xyz/
// @match        https://bildungsportal.sachsen.de/*
// @match        https://idp2.tu-dresden.de/*
// @match        https://jexam.inf.tu-dresden.de/*
// @match        https://selma.tu-dresden.de/*
// @match        https://exam.zih.tu-dresden.de/*
// @match        https://exam2.zih.tu-dresden.de/*
// @match        https://exam3.zih.tu-dresden.de/*
// @match        https://qis.dez.tu-dresden.de/qisserver/*
// @match        https://msx.tu-dresden.de/owa/auth/logon*
// @match        https://lskonline.tu-dresden.de/lskonline/de/102.0.1*
// @match        https://idp.tu-dresden.de/idp*
// @match        https://tud-autologin.spyfly.xyz/configuration/
// @match        https://tex.zih.tu-dresden.de/*
// @supportURL   https://github.com/spyfly/TUD-AutoLogin/issues
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/416418/TUD%20AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/416418/TUD%20AutoLogin.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  //Load Configuration values
  var tud = {
    username: "",
    password: ""
  }
  if (GM_getValue("tud_creds") != undefined) {
    tud = GM_getValue("tud_creds");
  }

  // Code starts here
  const isConfigPage = (window.location.host == "tud-autologin.spyfly.xyz");
  const isOpalLoginPage = (window.location.host == "bildungsportal.sachsen.de");
  const isTudExamLoginPage = (window.location.host.startsWith("exam") && window.location.host.endsWith(".zih.tu-dresden.de"));
  const isTudLoginPage = (window.location.host == "idp2.tu-dresden.de");
  const isJExam = (window.location.host == "jexam.inf.tu-dresden.de");
  const isSelma = (window.location.host == "selma.tu-dresden.de");
  const isQisServer = (window.location.host == "qis.dez.tu-dresden.de");
  const isOWA = (window.location.host == "msx.tu-dresden.de");
  const isLskOnline = (window.location.host == "lskonline.tu-dresden.de");
  const isTudIdp = (window.location.host == "idp.tu-dresden.de");
  const isShareLatex = (window.location.host == "tex.zih.tu-dresden.de");

  const credentialsAvailable = (tud.username.length > 0 && tud.password.length > 0);

  if (isConfigPage) {
    document.getElementById("notinstalled").remove();
    document.getElementById("username").value = tud.username;
    document.getElementById("password").value = tud.password;

    document.getElementById("save").addEventListener("click", function () {
      GM_setValue("tud_creds", {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      });
      alert("Configuration updated!")
    });
  } else if (isOpalLoginPage || isTudExamLoginPage) {
    const mainPageLoginBtn = document.querySelector("button[name=shibLogin]");
    const contentPageLoginBtn = document.querySelector('.btn-sm[title="Login"]');
    var loginSelector = document.querySelector("select[name$='wayfselection']");
    var loginIndex;

    //Do we have to perform login action in the first place?
    if (mainPageLoginBtn || contentPageLoginBtn) {
      if (contentPageLoginBtn) {

        contentPageLoginBtn.click();
        // Wait for Login Prompt to appear
        while (loginSelector == null) {
          loginSelector = document.querySelector("select[name$='wayfselection']");
          await sleep(100);
        }
      }

      // Select TU-Dresden as Login Option
      for (const option of loginSelector.options) {
        if (option.text == "TU Dresden") {
          loginIndex = option.index;
          break;
        }
      }
      loginSelector.selectedIndex = loginIndex;

      //Press Login Button
      document.querySelector("button[name$='shibLogin']").click();
    }
  } else if (isTudLoginPage || isTudIdp) {
    // We are on the TUD I2DP Page
    const hasLoginField = (document.getElementById("username") != undefined);

    if (hasLoginField) {
      // Try to fill in credentials
      document.getElementById("username").value = tud.username;
      document.getElementById("password").value = tud.password;
      if (credentialsAvailable) {
        document.getElementsByName("_eventId_proceed")[0].click();
      }
    } else {
      // Just press the continue button
      document.getElementsByName("_eventId_proceed")[0].click();
    }
  } else if (isJExam) {
    // AutoLogin for JExam 5
    if (window.location.pathname == "/") {
      window.location = "https://jexam.inf.tu-dresden.de/de.jexam.web.v5/"
    } else if (window.location.pathname == "/de.jexam.web.v5/spring/welcome") {
      // Try to fill in credentials
      document.getElementById("username").value = tud.username;
      document.getElementById("password").value = tud.password;
      if (credentialsAvailable) {
        document.getElementsByClassName("submit")[0].click();
      }
    }
  } else if (isSelma) {
    // AutoLogin for selma
    if (document.getElementById("field_user") != undefined) {
      document.getElementById("field_user").value = tud.username;
      document.getElementById("field_pass").value = tud.password;
      if (credentialsAvailable) {
        document.getElementById("logIn_btn").click();
      }
    }
  } else if (isQisServer) {
    //AutoLogin for QISServer
    if (document.getElementsByClassName("loginuser").length >= 1) {
      document.getElementsByClassName("loginuser")[0].value = tud.username;
      document.getElementsByClassName("loginpass")[0].value = tud.password;
      if (credentialsAvailable) {
        document.getElementsByClassName("submit")[0].click();
      }
    }
  } else if (isOWA) {
    //AutoLogin for OWA
    document.getElementById('username').value = tud.username;
    document.getElementById('password').value = tud.password;
    if (credentialsAvailable) {
      document.getElementsByClassName("signinbutton")[0].click();
    }
  } else if (isLskOnline) {
    //AutoLogin for LSKOnline
    document.getElementsByName('j_username')[0].value = tud.username;
    document.getElementsByName('j_password')[0].value = tud.password;
    if (credentialsAvailable) {
      document.getElementsByName('submit')[0].click();
    }
  } else if (isShareLatex) {
    //AutoLogin for ShareLaTeX
    if (window.location.pathname == "/saml/login") {
      // Check if we are on the login page
      document.querySelector('[href="/saml/login/go"]').click();
    } else {
      //Go to the login page if we need to login
      const loginBtn = document.querySelector('[href="/login"]');
      if (loginBtn) {
        loginBtn.click();
      }
    }
  }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}