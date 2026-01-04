// ==UserScript==
// @name           Uni Hamburg Auto Logins
// @name:de        Uni Hamburg Auto-Logins

// @description    Automatically logs you in to a few different Uni Hamburg sites, given automated password filling.
// @description:de Loggt Dich automatisch in verschiedene Seiten der Uni Hamburg ein, gegeben, dass die Login-Daten automatisch ausgefüllt werden.

// @version        3.0.0
// @copyright      2023+, Jan G. (Rsge)
// @license        Mozilla Public License 2.0
// @icon           https://www.uni-hamburg.de/favicon.ico

// @namespace      https://github.com/Rsge
// @homepageURL    https://github.com/Rsge/Uni-Hamburg-Auto-Login
// @supportURL     https://github.com/Rsge/Uni-Hamburg-Auto-Login/issues

// @match          https://login.uni-hamburg.de/idp/*
// @match          https://cndsf.ad.uni-hamburg.de/IdentityServer/Account/*
// @match          https://www-cndsf.stine.uni-hamburg.de/IdentityServer/Account/Login?*
// @match          https://stine.uni-hamburg.de/scripts/*
// @match          https://www.stine.uni-hamburg.de/scripts/*
// @match          https://lernen.min.uni-hamburg.de/*
// @match          https://www.openolat.uni-hamburg.de/dmz/*
// @match          https://surfmail.rrz.uni-hamburg.de
// @match          https://surfmail.rrz.uni-hamburg.de/login.php?*
// @match          https://gitlab.rrz.uni-hamburg.de/users/sign_in
// @match          https://gitlab.rrz.uni-hamburg.de/users/auth/ldapmain/callback

// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/481691/Uni%20Hamburg%20Auto%20Logins.user.js
// @updateURL https://update.greasyfork.org/scripts/481691/Uni%20Hamburg%20Auto%20Logins.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Checks for input password. Clicks if there is one, otherwise waits for input to click.
  function checkPwdLogin(pwdInput, button, inputLength=0) {
    if (pwdInput?.value.length > 0) {
      button.click();
    } else {
      pwdInput.addEventListener("input", function() {
        if(pwdInput?.value.length >= inputLength) {
          button.click();
        }
      });
    }
  }

  // Checks if the site URL matches with the given argument.
  function isSite(site) {
    return window.location.href.startsWith("https://" + site);
  }

  // Carries out login sequences.
  window.addEventListener('load', function() {
    // -- Moodle --
    if (isSite("lernen.min.uni-hamburg.de/login")) {
      // Login
      let lernenMINLoginButtons = document.getElementsByClassName("btn login-identityprovider-btn btn-primary btn-lg btn-block");
      lernenMINLoginButtons[0]?.click();
      return;
    } else if (isSite("lernen.min.uni-hamburg.de")) {
      // Automatically refreshes session
      let node;
      let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          node = mutation.addedNodes[0];
          if (node?.className?.includes("modal moodle-has-zindex")) {
            let refreshButtons = node.getElementsByClassName("btn btn-primary");
            if (refreshButtons.length > 0) {
              refreshButtons[0].click();
            }
          } else if(node?.className?.includes("modal-backdrop in show")) {
            node.remove();
          }
        });
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      return;
    }
    // -- OpenOlat --
    if (isSite("openolat.uni-hamburg.de")) {
      let openOlatLoginButtonDivs = document.getElementsByClassName("o_block");
      let openOlatLoginButton = openOlatLoginButtonDivs[0]?.firstElementChild;
      openOlatLoginButton?.click();
      return;
    }
    /*
    let openOlatLoginVariantButton = document.getElementById("o_col_ShibGeneric");
    if (openOlatLoginVariantButton) {
      openOlatLoginVariantButton.click();
      setTimeout(function() {
      XXX
        }
      }, 800);
      return;
    }*/
    // -- Moodle & OpenOlat --
    if (isSite("login.uni-hamburg.de")) {
      let loginLoginButtons = document.getElementsByName("_eventId_proceed");
      let pwdInput = document.getElementById("password");
      checkPwdLogin(pwdInput, loginLoginButtons[0]);
      return;
    }
    // -- STiNE --
    if (isSite("stine.uni-hamburg.de")) {
      let stineOpenLoginButton = document.getElementById("logIn_btn");
      stineOpenLoginButton?.click();
      return;
    }
    if (isSite("www-cndsf.stine.uni-hamburg.de")) {
      let UHHLoginBButtons = document.getElementsByClassName("btn btn-default provider-link uhhshib");
      UHHLoginBButtons[0]?.click();
      return;
    }
    if (isSite("cndsf.ad.uni-hamburg.de")) {
      let campusNetLoginButtons = document.getElementsByClassName("btn btn-primary");
      let pwdInput = document.getElementById("Password");
      checkPwdLogin(pwdInput, campusNetLoginButtons[0]);
      return;
    }
    // -- Uni-Mail --
    if (isSite("surfmail.rrz.uni-hamburg.de")) {
      let surfmailLogInLoginButton = document.getElementById("login-button");
      let pwdInput = document.getElementById("horde_pass");
      checkPwdLogin(pwdInput, surfmailLogInLoginButton);
      return;
    }
    // -- GitLab --
    if (isSite("gitlab.rrz.uni-hamburg.de/users/sign_in") ||
        isSite("gitlab.rrz.uni-hamburg.de/users/auth/ldapmain/callback")) {
      let gitLabSignInButtons = document.getElementsByClassName("gl-button btn btn-block btn-md btn-confirm");
      let pwdInput = document.getElementById("ldapmain_password");
      if (pwdInput) {
        let rememberMeCheckbox = document.getElementById("ldapmain_remember_me");
        rememberMeCheckbox.checked = true;
        checkPwdLogin(pwdInput, gitLabSignInButtons[0]);
        return;
      } else {
        let verificationInput = document.getElementById("user_otp_attempt");
        if (verificationInput) {
          checkPwdLogin(verificationInput, gitLabSignInButtons[0], 6);
        }
      }
    }
  }, false);
})();
