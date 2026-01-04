// ==UserScript==
// @name         Fieldglass Utility
// @namespace    https://leo.bi
// @version      1.3
// @license      MIT
// @description  Fieldglass Utility (内部使用)
// @author       Leo Bi
// @match        https://www.fieldglass.net/*
// @match        https://hhc.fieldglass.net/*
// @match        https://www.us.fieldglass.cloud.sap/*
// @match        https://hhc.us.fieldglass.cloud.sap/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/490973/Fieldglass%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/490973/Fieldglass%20Utility.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    const TOTAL_AMOUNT_KEY_ID = "TOTAL_AMT";

    function refreshSelectedAmount() {
        $("#mySelectedHours").text("Selected Hours: " + (parseFloat(GM_getValue(TOTAL_AMOUNT_KEY_ID, 0)) / 100).toFixed(2));
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
        div.innerHTML='<span id="mySelectedHours" style="color: green; font-weight: bold;">Selected Hours: </span> <input type="button" id="myReset" name="myReset" value="Reset Cache"/>';
        $("div.fd-shellbar").append(div);
        refreshSelectedAmount();

        $("#myReset").on('click',function(e){
            resetMyCache();
        });


        // main page
        $('div[columnindex="8"]').each(function(index) {
            let timesheetId = $(this).parent().find('div[columnindex="1"]').attr('title');

            const WHOLE_WEEK_KEY_ID = timesheetId + "_WHOLE_WEEK_AMT";
            let savedWholeWeekAmount = GM_getValue(WHOLE_WEEK_KEY_ID, null);

            // initialize styles accordingly
            if(savedWholeWeekAmount == null || savedWholeWeekAmount == 0) {
                $(this).css('background-color', 'silver');
            } else {
                $(this).css('background-color', 'green');
            }

            let amount = parseInt(parseFloat($(this).attr("title")).toFixed(2) * 100, 10);

            $(this).on('click',function(e){
                let selectedWholeWeekAmount = GM_getValue(WHOLE_WEEK_KEY_ID, 0);
                let totalAmount = parseInt(GM_getValue(TOTAL_AMOUNT_KEY_ID, 0),10);

                if(selectedWholeWeekAmount == null || selectedWholeWeekAmount == 0) {
                    GM_setValue(WHOLE_WEEK_KEY_ID,amount);
                    GM_setValue(TOTAL_AMOUNT_KEY_ID,totalAmount + amount);
                    $(this).css('background-color', 'green');
                } else {
                    GM_setValue(WHOLE_WEEK_KEY_ID,0);
                    GM_setValue(TOTAL_AMOUNT_KEY_ID,totalAmount - amount);
                    $(this).css('background-color', 'silver');
                }

                refreshSelectedAmount();
                console.log("CURRENT TOTAL: " + GM_getValue(TOTAL_AMOUNT_KEY_ID, 0));

            });

        });

        // detail page
        $('tr.timeSheetTotal').find('td').each(function(index) {
            let timesheetId = $('div#timeSheetBadge').find('li[data-help-id="LABEL_TIMESHEET_REF_70"]').find('div.values').text();

            // exclude the total field
            if(!$(this).hasClass("timeSheetTotal")) {
                const ONE_DAY_KEY_ID = timesheetId + "_ONE_DAY_AMT" + index;
                let savedOneDayAmount = GM_getValue(ONE_DAY_KEY_ID, null);

                // initialize styles accordingly
                if(savedOneDayAmount == null || savedOneDayAmount == 0) {
                    $(this).css('background-color', 'silver');
                } else {
                    $(this).css('background-color', 'green');
                }


                let amount = parseInt(parseFloat($(this).text()).toFixed(2) * 100, 10);

                $(this).on('click',function(e){
                    let selectedOneDayAmount = GM_getValue(ONE_DAY_KEY_ID, 0);
                    let totalAmount = parseInt(GM_getValue(TOTAL_AMOUNT_KEY_ID, 0),10);

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
                });


                console.log(index + ": " + $(this).text());

            }

        });


    });


})(jQuery);