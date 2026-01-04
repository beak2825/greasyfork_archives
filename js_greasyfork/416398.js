// ==UserScript==
// @name         Call Note Fix
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Adds a call note input box to SA Client screen
// @author       Tyler
// @match        https://my.serviceautopilot.com/ClientView.aspx?*
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/416398/Call%20Note%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/416398/Call%20Note%20Fix.meta.js
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
    // Your code here...
    $("#leadContainer").after('<textarea id="cnote" name="cnote" rows="6" cols="140"></textarea><br><button type="button" id="btnAddCall">Add Call Note</button>');

    $("#btnAddCall").click(function() {
        $("#PageContent_panelAddTicket").find("a").click();
        $(document).arrive("#ticketTypeCall", function() {
            $("#ticketTypeCall").click();
            //$("[data-bind|='value: Subject']").val("Call Completed " + new Date().toDateString());
            $("[data-bind|='value: Body']").val($("#cnote").val());
            console.log($("[data-bind|='foreach: StatusList, multiselect: Status, multiselectOptions: { UseFilter: false, width: 190, multiple: false}'").next());
            $("[data-bind|='foreach: StatusList, multiselect: Status, multiselectOptions: { UseFilter: false, width: 190, multiple: false}'").val(4)
            $("[data-bind|='foreach: StatusList, multiselect: Status, multiselectOptions: { UseFilter: false, width: 190, multiple: false}'").next().click().click();

        });
    });

})();