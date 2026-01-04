/* jshint esversion: 6 */

// ==UserScript==
// @name         One prat 1 month future days.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to report 28 days ahead.
// @author       You
// @match        https://one.prat.idf.il/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.il
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446356/One%20prat%201%20month%20future%20days.user.js
// @updateURL https://update.greasyfork.org/scripts/446356/One%20prat%201%20month%20future%20days.meta.js
// ==/UserScript==

const API_TO_MODIFY = '/api/Attendance/GetAllFilterStatuses';
const FUTURE_REPORT_DAYS = 28;
(function() {
  'use strict';

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args) {

   // Hooking the specific api to change.
   if (typeof args[1] === 'string' && args[1] === API_TO_MODIFY) {
       console.log(`[*] Hooking API: ${API_TO_MODIFY}`);

       // Hooking the response function.
       this.addEventListener('readystatechange', function() {
        if(this.responseText !== '') {
          console.log(`[*] Got response`);

          const responseText = JSON.parse(this.responseText);
           // Modify responseText.
           responseText.primaries.forEach(primary => primary.secondaries.forEach((secondary) => {
             secondary.futureReportDays = FUTURE_REPORT_DAYS;
           }));

           Object.defineProperty(this, 'responseText', {
             writable: true
           });
           this.responseText = JSON.stringify(responseText);
           console.log('[*] Modified Response!');
         }
       });
     }
     return origOpen.apply(this, args);
   };
 })();