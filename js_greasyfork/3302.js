// ==UserScript==
// @name       Average Daily Usage for wispmon.com Usage Report
// @namespace  http://clinton.kopotic.com/
// @version    0.4
// @description  Adds an average daily usage calculation to a wispmon.com Usage Report
// @match      http://www.wispmon.com/usage/*
// @match      http://wispmon.com/usage/*
// @require    http://code.jquery.com/jquery-latest.js
// @copyright  2014, Clinton Kopotic
// @downloadURL https://update.greasyfork.org/scripts/3302/Average%20Daily%20Usage%20for%20wispmoncom%20Usage%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/3302/Average%20Daily%20Usage%20for%20wispmoncom%20Usage%20Report.meta.js
// ==/UserScript==

/**/

var $total_month_usage = $("strong:contains('Total Usage This Month:')");
var $total_month_usage_html = $total_month_usage.html();
var number_of_days = $("strong:contains('Current Month')").nextAll("br").length - 3;
var total_month_usage = parseFloat($total_month_usage_html.substring($total_month_usage_html.indexOf(":") + 1,$total_month_usage_html.indexOf("(")).trim());
console.log(total_month_usage + " / " + number_of_days + " = " + (total_month_usage / number_of_days));
var average_usage = total_month_usage / number_of_days;
var average_usage_html = "<strong>Average Daily Usage: " + average_usage.toFixed(4) + "</strong><br>";
$total_month_usage.next().after(average_usage_html);

/**/

/* A better algorithm would be:
 *  1) read through each of the days in current month parsing:
 *     a) date
 *     b) upload total
 *     c) download total
 */
function DateLine(startDate, endDate, uploadAmount, uploadUnits, downloadAmount, downloadUnits) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.uploadAmount = uploadAmount;
    this.uploadUnits = uploadUnits;
    this.downloadAmount = downloadAmount;
    this.downloadUnits = downloadUnits;
    this.toString = function () { return startDate + " - " + endDate };
}

var $current_month = $("strong:contains('Current Month')");
var $days_list = $current_month.nextUntil('strong');
var days_list_length = $days_list.length - 1;
var days_list_array = [];
var total_upload = 0.0;
var total_download = 0.0;

for (var i = 0; i < days_list_length; ++i) {
    var date_line_split_array = $days_list.eq(i).prop("nextSibling").data.split(" ");
    days_list_array[i] = new DateLine(
        date_line_split_array[0],
        date_line_split_array[2],
        parseFloat(date_line_split_array[4]),
        date_line_split_array[5],
        parseFloat(date_line_split_array[8]),
        date_line_split_array[9]
        );
    total_upload += days_list_array[i].uploadAmount;
    total_download += days_list_array[i].downloadAmount;
}
var now_date = new Date();
var days_in_month = new Date(now_date.getFullYear(), now_date.getMonth(), 0).getDate() + 1;
var day_of_month = (now_date.getHours() >= 3) ? now_date.getDate() : now_date.getDate() - 1;
console.log(day_of_month);
console.log(days_in_month);
$total_month_usage.next().after("<strong>Average Daily Upload Usage: " + (total_upload / days_list_length).toFixed(4) + "</strong><br>");
$total_month_usage.next().after("<strong>Average Daily Download Usage: " + (total_download / days_list_length).toFixed(4) + "</strong><br>");
$total_month_usage.next().after("<strong>Total Upload Usage: " + (total_upload).toFixed(4) + " (" + ((total_upload / 7.32) * 100.0).toFixed(2) + "%)" + "</strong><br>");
$total_month_usage.next().after("<strong>Total Download Usage: " + (total_download).toFixed(4) + " (" + ((total_download / 29.3) * 100.0).toFixed(2) + "%)" + "</strong><br>");
$total_month_usage.next().after("<strong>Percent Through Month: " + ((day_of_month / days_in_month) * 100.0).toFixed(2) + "%" + "</strong><br>");
/*
 *  2) Calculate the upload and download totals from 1)
 *  3) Determine the end date (not necessarily from 1))
 *  4) Provide daily averages for upload and download
 *  5) Provide percentage limit total of upload and download via cookies and forms
 */