// ==UserScript==
// @name         2009 Google Accounts
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  To be used with 2009 Google Accounts Userstlye.
// @author       Xammand
// @match        https://accounts.google.com/*
// @match        https://www.google.com/accounts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/500144/2009%20Google%20Accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/500144/2009%20Google%20Accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').prepend($(`<table width="100%" cellspacing="0" cellpadding="2" border="0">
  <tbody><tr height="2">
  <td colspan="2"></td>
  </tr>
  <tr>
  <td width="1%" valign="top">
  <a href="https://www.google.com/accounts/">
  <img src="https://www.google.com/accounts/googleaccountslogo.gif" alt="Google" border="0" align="left">
  </a>
  </td>
  <td valign="top">
  <table width="100%" cellspacing="0" cellpadding="0" border="0">
  <tbody><tr>
  <td colspan="2"><img alt="" width="1" height="15"></td>
  </tr>
  <tr style="height: 1px;" bgcolor="#3366cc">
  <td></td>
  </tr>
  <tr bgcolor="#e5ecf9">
  <td style="padding-left: 4px; padding-bottom:3px; padding-top:2px; font-family:arial,sans-serif;">
  <b>Create a Google Account</b>
  </td>
  </tr>
  <tr>
  <td colspan="2"><img alt="" width="1" height="5"></td>
  </tr>
  </tbody></table>
  </td>
  </tr>
  </tbody></table>`));
    $('.S7xv8.LZgQXe').attr('class','body');
    $('.gfM9Zd').attr('class','body');
    $('.body').prepend($(`
    <h3>
  Create an Account
</h3>
<table width="700">
  <tbody><tr>
  <td>
  <font size="-1">
  If you already have a Google Account, you can <a href="https://www.google.com/accounts/ServiceLogin?continue=https%3A%2F%2Fwww.google.com%2Faccounts%2F">sign in here</a>.
  </font>
  </td>
  </tr>
</tbody></table>
<br>`));
    $(`<div class="footer" align="center">
  <font color="#666666">
  ©2009 Google
  </font>
  -
  <a href="http://www.google.com/">Google Home</a>
  -
  <a href="https://www.google.com/accounts/TOS?hl=en">Terms of Service</a>
  -
  <a href="http://www.google.com/intl/en/privacy.html">Privacy Policy</a>
  -
  <a href="http://www.google.com/support/accounts?hl=en">Help</a>
</div>`).insertAfter($('.body'));
})();