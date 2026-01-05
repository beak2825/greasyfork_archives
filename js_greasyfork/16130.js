// ==UserScript==
// @name         [Ned] Test Drive AutoComplete
// @namespace    localhost
// @version      2.1
// @description  Test Drive AutoComplete
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/TestDrive/*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16130/%5BNed%5D%20Test%20Drive%20AutoComplete.user.js
// @updateURL https://update.greasyfork.org/scripts/16130/%5BNed%5D%20Test%20Drive%20AutoComplete.meta.js
// ==/UserScript==

testDriveEmail = "@Autoloop.com"; //CHANGE ME!!

$('#ctl00_ctl00_Main_Main_loopName_textBox').val('Test test');
if ($('#ctl00_ctl00_Main_Main_loopEmail_textBox').val().length <= 0)
    $('#ctl00_ctl00_Main_Main_loopEmail_textBox').val(testDriveEmail);
$('#ctl00_ctl00_Main_Main_ddlBatchSettings').val($("#ctl00_ctl00_Main_Main_ddlBatchSettings option:first").val());