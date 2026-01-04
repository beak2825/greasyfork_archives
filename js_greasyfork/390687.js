// ==UserScript==
// @name Microsoft Teams Dark Theme resetter
// @namespace https://lyler.xyz
// @author Lyle Hanson
// @version 0.2
// @description Prevent your dark theme preference from being forgotten
// @match https://teams.microsoft.com/*
// @grant none
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/390687/Microsoft%20Teams%20Dark%20Theme%20resetter.user.js
// @updateURL https://update.greasyfork.org/scripts/390687/Microsoft%20Teams%20Dark%20Theme%20resetter.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

  function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
        "" :
        ";expires="+exdate.toUTCString());
  }

  console.log("Ensuring dark theme is set because Teams can't seem to remember it");
  var theme = getCookie("storedTheme");
  if (typeof theme === "undefined") {
    alert("storedTheme cookie not set, forcing dark theme");
    setCookie("storedTheme", "dark", 365);
    location.reload();
  } else {
    console.log("Found stored theme cookie:", theme)
  }
})();