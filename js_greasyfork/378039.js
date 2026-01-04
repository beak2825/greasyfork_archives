// @require http://code.jquery.com/jquery-latest.js
// @require https://my.serviceautopilot.com/scripts/AlertList.js
// @require https://knockoutjs.com/downloads/knockout-3.4.2.js
// ==UserScript==
// @name         Clear Alerts
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds an option to service autopilot to clear all alerts on click
// @author       Tyler
// @match        https://my.serviceautopilot.com/AlertList.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378039/Clear%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/378039/Clear%20Alerts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(document).ready(function() {

      $('#gridHeaderSection').html("<div style='float:left; width: 80%'>My Alerts</div><div id='clearAll' style='float:right;'>Clear All Alerts</div>");
      $('#clearAll').click(function() {
        $('.sprite-redclose-normal-16px').each(function(i, obj) {
            $(this).trigger("click");
        });
      });

    }
  )
})()