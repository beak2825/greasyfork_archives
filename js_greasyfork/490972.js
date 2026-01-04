// ==UserScript==
// @name         SAP Utility
// @namespace    https://leo.bi
// @version      1.5
// @license      MIT
// @description  SAP Utility (内部使用)
// @author       Leo Bi
// @match        https://portal.sap.lionbridge.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/490972/SAP%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/490972/SAP%20Utility.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    const TOTAL_AMOUNT_KEY_ID = "TOTAL_AMT";

    function refreshSelectedAmount() {
        console.log("reffreshSelectedAmount(L25) is invoked. GM_getValue(TOTAL_AMOUNT_KEY_ID, 0) = " + GM_getValue(TOTAL_AMOUNT_KEY_ID, 0));
    }

    function resetMyCache() {
        //console.log("resetMyCache() is invoked. ");

        let keysToKeep = ['TOTAL_AMT88888'];
        let keys = GM_listValues();
        for (let key of keys) {
            if (!keysToKeep.includes(key)) {
                GM_deleteValue(key);
            }
        }

        // refresh the page
        location.reload();
    }



    $(document).ready( function() {

        let div = document.createElement("div");
        div.className = "myHoursPlaceholder"
        div.innerHTML='<span id="mySelectedHours" style="color: green; font-weight: bold;">Click to view Selected Hours </span> <input type="button" id="myReset" name="myReset" value="Reset Cache"/>';
        $("td#space_container").append(div);
        refreshSelectedAmount();

        $("#myReset").on('click',function(e){
            resetMyCache();
        });

        $("#mySelectedHours").on('click',function(e){
            alert("Total Selected Hours: " + (parseFloat(GM_getValue(TOTAL_AMOUNT_KEY_ID, 0)) / 100).toFixed(2));
        });

        $(document).on('mousemove', function(e){

            $('table.lsField--right').find('td.lsField__inputcontainer').each(function(index){

                let spanElement = $(this).find('span');
                if(spanElement.length && $(this).text() != '' && !isNaN(Number($(this).text(),10))) {

                    let timesheetId = $('input[id$="VcCatRecordEntryView.InputFieldBegda"]').attr('value');
                    //console.log("timesheetId: " + timesheetId);

                    // exclude the total field
                    const ONE_DAY_KEY_ID = timesheetId + "_ONE_DAY_AMT" + spanElement.attr("id");
                    let savedOneDayAmount = GM_getValue(ONE_DAY_KEY_ID, null);

                    // initialize styles accordingly
                    if(savedOneDayAmount == null || savedOneDayAmount == 0) {
                        //console.log("silver");
                        spanElement.css('background-color', 'silver');
                    } else {
                        //console.log("green");
                        spanElement.css('background-color', 'green');
                    }

                }

            });

        });

        $(document).on('mouseenter', 'table.lsField--right span.lsField__input', function(e){

            if($(this).hasClass('lsField__input') && $(this).parent('td.lsField__inputcontainer').length && $(this).text() != '' && !isNaN(Number($(this).text(),10))) {

                let amount = parseInt(parseFloat($(this).text()).toFixed(2) * 100, 10);
                console.log("amount:" + amount);

                let timesheetId = $('input[id$="VcCatRecordEntryView.InputFieldBegda"]').attr('value');
                const ONE_DAY_KEY_ID = timesheetId + "_ONE_DAY_AMT" + $(this).attr("id");

                let selectedOneDayAmount = GM_getValue(ONE_DAY_KEY_ID, 0);

                //console.log("TOTAL_AMOUNT_KEY_ID (L99)" + TOTAL_AMOUNT_KEY_ID);
                //console.log("GM_getValue(TOTAL_AMOUNT_KEY_ID, 0) (L99)" + GM_getValue(TOTAL_AMOUNT_KEY_ID, 0));


                let totalAmount = parseInt(GM_getValue(TOTAL_AMOUNT_KEY_ID, 0),10);
                //console.log("totalAmount (L99):" + totalAmount);

                if(selectedOneDayAmount == null || selectedOneDayAmount == 0) {
                    GM_setValue(ONE_DAY_KEY_ID,amount);
                    GM_setValue(TOTAL_AMOUNT_KEY_ID,totalAmount + amount);
                    $(this).css('background-color', 'green');
                } else {
                    GM_setValue(ONE_DAY_KEY_ID,0);
                    GM_setValue(TOTAL_AMOUNT_KEY_ID,totalAmount - amount);
                    $(this).css('background-color', 'silver');
                }

                refreshSelectedAmount();

                console.log("CURRENT TOTAL: " + GM_getValue(TOTAL_AMOUNT_KEY_ID, 0));

            }

        });

    });




})(jQuery);