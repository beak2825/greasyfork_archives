// ==UserScript==
// @name          Fix Bitwarden compatibility
// @description   Make login/password boxes on selected sites compatible with Bitwarden auto-fill
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         https://account.kyivstar.ua/cas/*
// @match         https://*.privat24.ua/*
// @match         https://*.privatbank.ua/*
// @match         https://auth.lifecell.ua/*
// @match         https://new.novaposhta.ua/*
// @match         https://otpsmart.com.ua/*
// @match         https://kvkmeters.ssmt.com.ua/*
// @match         https://my.fora.ua/*
// @match         https://ecodrive.in.ua/*
// @match         https://login.yasno.ua/*
// @match         https://*.aliexpress.com/*
// @icon          https://vault.bitwarden.com/images/favicon-32x32.png
// @version       1.1.1
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/446534/Fix%20Bitwarden%20compatibility.user.js
// @updateURL https://update.greasyfork.org/scripts/446534/Fix%20Bitwarden%20compatibility.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  function universalAddIdUsername(input) {
    //if (input.getAttribute("id") != "username") {
      input.setAttribute("id", "username");
    //}
  }

  function universalAddIdPassword(input) {
    //if (input.getAttribute("id") != "password") {
      input.setAttribute("id", "password");
    //}
  }

  function universalAddIdPhone(input) {
    //if (input.getAttribute("id") != "phone") {
      input.setAttribute("id", "phone");
    //}
  }

  function universalAddIdSuperpass(input) {
    //if (input.getAttribute("id") != "superpass") {
      input.setAttribute("id", "superpass");
    //}
  }

  function kyivstarAddIdPUK2(input) {
    if (input.getAttribute("id") == null) {
      if (window.location.href.indexOf("puk2") !== -1) {
        input.setAttribute("id", "puk2");
      }
    }
  }

  if (window.location.href.indexOf("https://account.kyivstar.ua/cas/") == 0) {
    setInterval (function () {
      document.querySelectorAll("form .input-container input[type='text']:not(#username)").forEach(universalAddIdUsername);
      document.querySelectorAll("input[type='password']").forEach(kyivstarAddIdPUK2);
      //document.querySelectorAll("form div.[class^='PasswordInput'] .input-container input[type='text']#username").forEach(universalAddIdPassword);
    }, 500);
  }

  if (window.location.href.indexOf(".privat24.ua/") > 0 || window.location.href.indexOf(".privatbank.ua/") > 0) {
    setInterval (function () {
      document.querySelectorAll("input[type='tel']:not(#username)").forEach(universalAddIdUsername);
    }, 500);
  }

  if (window.location.href.indexOf("https://auth.lifecell.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input[autocomplete='username'][inputmode='tel']:not(#username)").forEach(universalAddIdUsername);
      document.querySelectorAll("form.superpass-form input[autocomplete='one-time-code']:not(#superpass)").forEach(universalAddIdSuperpass);
    }, 500);
  }

  if (window.location.href.indexOf("https://new.novaposhta.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input.mat-input-element:not(#phone)").forEach(universalAddIdPhone);
    }, 500);
  }

  if (window.location.href.indexOf("https://otpsmart.com.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input#userNameVisual:not(#username)").forEach(universalAddIdUsername);
    }, 500);
  }

  if (window.location.href.indexOf("https://kvkmeters.ssmt.com.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input#consumerCode:not(#username)").forEach(universalAddIdUsername);
    }, 500);
  }

  if (window.location.href.indexOf("https://my.fora.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input[name='phone']:not(#username)").forEach(universalAddIdUsername);
    }, 500);
  }

  if (window.location.href.indexOf("https://ecodrive.in.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input[name='user_login']:not(#username)").forEach(universalAddIdUsername);
      document.querySelectorAll("input[name='password']:not(#password)").forEach(universalAddIdPassword);
    }, 500);
  }

  if (window.location.href.indexOf("https://login.yasno.ua/") == 0) {
    setInterval (function () {
      document.querySelectorAll("input[type='tel']:not(#username)").forEach(universalAddIdUsername);
    }, 500);
  }

  if (window.location.href.indexOf(".aliexpress.com/") > 0) {
    setInterval (function () {
      document.querySelectorAll("input.cosmos-input:not(#username)").forEach(universalAddIdUsername);
    }, 500);
  }


})();
