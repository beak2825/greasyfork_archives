// ==UserScript==
// @name         SA Checklist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a checklist to the SA client page
// @author       Tyler
// @match        https://my.serviceautopilot.com/ClientView.aspx?*
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/537020/SA%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/537020/SA%20Checklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
        console.log("ready!");
        console.log($("#clientViewDomId"))
        $("#clientViewDomId").before(`
       <div style="float: right;width: 420px;">
       <button type='button' id="TM_enterEstimateBtn">Enter Estimate</button>
       <button type='button' id="TM_checkEstimateBtn">Check Estimate</button><br>
       <button type='button' id="TM_enterRenewalBtn">Enter Renewal</button>
       <button type='button' id="TM_checkRenewalBtn">Check Renewal</button>
       <div class="TM_Checklist" id="TM_enterEstimate">
       <input id="TM_enterEstimate1" type="checkbox"><label for="TM_enterEstimate1">Add Services</label><br>
       <input id="TM_enterEstimate2" type="checkbox"><label for="TM_enterEstimate2">Add Notes</label><br>
       <input id="TM_enterEstimate3" type="checkbox"><label for="TM_enterEstimate3">Add Pictures</label><br>
       <input id="TM_enterEstimate4" type="checkbox"><label for="TM_enterEstimate4">Add Details</label><br>
       </div>
       <div class="TM_Checklist" id="TM_checkEstimate">
       <input id="TM_checkEstimate1" type="checkbox"><label for="TM_checkEstimate1">Check Services</label><br>
       <input id="TM_checkEstimate2" type="checkbox"><label for="TM_checkEstimate2">Check Notes</label><br>
       <input id="TM_checkEstimate3" type="checkbox"><label for="TM_checkEstimate3">Check Pictures</label><br>
       <input id="TM_checkEstimate4" type="checkbox"><label for="TM_checkEstimate4">Check Details</label><br>
       </div>
       <div class="TM_Checklist" id="TM_enterRenewal">
       <input id="TM_enterRenewal1" type="checkbox"><label for="TM_enterRenewal1">Update Schedule</label><br>
       <input id="TM_enterRenewal2" type="checkbox"><label for="TM_enterRenewal2">Update Points</label><br>
       <input id="TM_enterRenewal3" type="checkbox"><label for="TM_enterRenewal3">Update Notes</label><br>
       <input id="TM_enterRenewal4" type="checkbox"><label for="TM_enterRenewal4">Update Picture</label><br>
       </div>
       <div class="TM_Checklist" id="TM_checkRenewal">
       <input id="TM_checkRenewal1" type="checkbox"><label for="TM_checkRenewal1">Check Schedule</label><br>
       <input id="TM_checkRenewal2" type="checkbox"><label for="TM_checkRenewal2">Check Points</label><br>
       <input id="TM_checkRenewal3" type="checkbox"><label for="TM_checkRenewal3">Check Notes</label><br>
       <input id="TM_checkRenewal4" type="checkbox"><label for="TM_checkRenewal4">Check Picture</label><br>
       </div>
    </div>
    `);
        $(".TM_Checklist").hide();
        $("#TM_enterEstimateBtn").click(function() {
            $(".TM_Checklist").hide();
            $("#TM_enterEstimate").show();
        });

        $("#TM_checkEstimateBtn").click(function() {
            $(".TM_Checklist").hide();
            $("#TM_checkEstimate").show();
        });

        $("#TM_enterRenewalBtn").click(function() {
            $(".TM_Checklist").hide();
            $("#TM_enterRenewal").show();
        });

        $("#TM_checkRenewalBtn").click(function() {
            $(".TM_Checklist").hide();
            $("#TM_checkRenewal").show();
        });

    });

})();