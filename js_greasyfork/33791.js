// ==UserScript==
// @name        Qbis auto login
// @namespace   Qbis
// @include     http://login.qbis.se/
// @include     http://login.qbis.se/*
// @include     https://login.qbis.se/
// @include     https://login.qbis.se/*
// @include     https://apps.qbis.se/Login/Login
// @version     1.3
// @grant       GM_getValue
// @grant       GM_setValue
// @description Automatic login for the swedish(?) QBis business system (since firefox doesn't automatically fill in company name). \
//              It takes you directly to the Timesheet
// @downloadURL https://update.greasyfork.org/scripts/33791/Qbis%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/33791/Qbis%20auto%20login.meta.js
// ==/UserScript==
var company = GM_getValue('Company');
if (!company)
{
  company = prompt('Please enter a company name', 'CompanyName');
  GM_setValue('Company', company);
}
document.getElementById('txtCompany').value = company;
setTimeout(function () {
  document.getElementById('btnLogin').click();
  setTimeout(function () {
    location.href = '/Time/Timesheet';
  }, 500);
}, 500);