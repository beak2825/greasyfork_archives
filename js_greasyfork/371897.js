// ==UserScript==
// @name         Sign in to External AFTLite
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Will log into External AFTlite automatcially
// @author       Cpatters
// @match        https://aftlite-portal.amazon.com/ap/signin*
// @match        https://aftlite-portal.amazon.com/ap/signin?clientContext=132-0914116-5323230&openid.return_to=https%3A%2F%2Faftlite-portal.amazon.com%2Fap-post-redirect&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_aftlite_na&openid.mode=checkid_setup&marketPlaceId=ATVPDKIKX0DER&language=en_US&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=amzn_aftlite_na&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&BrowserData=0&openid.pape.max_auth_age=28800&siteState=clientContext%3D133-0479118-7764315%2CsourceUrl%3Dhttps%253A%252F%252Faftlite-portal.amazon.com%252Fhome%2Csignature%3D5fCDO3ePJdGXu86EqZAi7Sx0Rxsj3D
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371897/Sign%20in%20to%20External%20AFTLite.user.js
// @updateURL https://update.greasyfork.org/scripts/371897/Sign%20in%20to%20External%20AFTLite.meta.js
// ==/UserScript==


setTimeout(function() {
  // get the password field
  var pwd = document.getElementById('ap_password');
  pwd.focus();
  pwd.select();
  var noChars = pwd.selectionEnd;
  // move focus to username field for first-time visitors
  document.getElementById('ap_email').focus()
  if (noChars > 0) {
    document.getElementById('signInSubmit').click();
  }
}, 100);