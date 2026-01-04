// ==UserScript==
// @name         高鐵搶票
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        請先測試過，搶到車票後按下完成訂位沒反應
//@require https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
//@run-at  document-end

// @downloadURL https://update.greasyfork.org/scripts/376274/%E9%AB%98%E9%90%B5%E6%90%B6%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/376274/%E9%AB%98%E9%90%B5%E6%90%B6%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("select[name='selectStartStation']").val("1");
    $("select[name='selectDestinationStation']").val("12");
    $("#returnCheckBox").click();
    $("#backDate,#backTimeTable").show();


    var startDate = "2019/09/12"
    var backDate = "2019/09/15"
    //去程
    $("input[name='toTimeInputField']").attr("value",startDate);
    $("input[name='toTimeInputField']").attr("date",startDate);
    //晚上八點半後的票
    $("select[name='toTimeTable']").find('option[value="830P"]').prop('selected', 'selected');
    //回程
    $("input[name='backTimeInputField']").attr("value",backDate);
    $("input[name='backTimeInputField']").attr("date",backDate);;
    //下午四點半後的票
    $("select[name='backTimeTable']").find('option[value="430P"]').prop('selected', 'selected');
    //兩張全票
    $("select[name='ticketPanel:rows:0:ticketAmount']").find('option[value="2F"]').prop('selected', 'selected');

})();