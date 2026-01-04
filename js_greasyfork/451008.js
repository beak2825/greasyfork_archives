// ==UserScript==
// @name        Auto Switch Google Account
// @namespace   HowBoutNo
// @description Auto redirects Google sites to a separate user that is logged in. Useful if you want to set a "default" account without signing out of all accounts.
// @match       *://*.google.com/*
// @version     1.2
// @author      HowBoutNo
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451008/Auto%20Switch%20Google%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/451008/Auto%20Switch%20Google%20Account.meta.js
// ==/UserScript==

var url = window.location.href;
var uid = 0; // uid is the number corresponding to the account. In URLs it would be the number after /u/

if (url.match("/u/") != null) { // check if site is a Google product (Drive, Mail, etc.)
  if (url.match("/u/" + uid) == null) {
    url = url.replace(/\/u\/[0-9]/, "/u/" + uid)
    window.location.replace(url);
  }
} else if (url.match("authuser=" + uid) == null) { // if not product, site must be Google search which needs to be handled differently
  if (url.match(/\?/) == null) {
    url += "?authuser=" + uid
  } else if (url.match("&authuser=") == null) {
    url += "&authuser=" + uid
  } else {
    url = url.replace(/(authuser=)[0-9]/, "authuser="+uid)
  }
  window.location.replace(url);
}