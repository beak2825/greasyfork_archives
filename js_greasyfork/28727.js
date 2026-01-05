// ==UserScript==
// @name         SplitwiseCSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download a YNAB compatible .csv file from splitwise
// @author       Noah D. Brenowitz
// @match        https://secure.splitwise.com/*
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/28727/SplitwiseCSV.user.js
// @updateURL https://update.greasyfork.org/scripts/28727/SplitwiseCSV.meta.js
// ==/UserScript==


function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


function printDate(date){
    return [
            pad(date.getMonth()+1, 2),
            pad(date.getDate(), 2),
        date.getFullYear()]
    .join("/");
}

function processExpense(id, exp) {
   // Process expense
    // See YNAB  CSV importing rules http://classic.youneedabudget.com/support/article/csv-file-importing
    // Example
    // Date,Payee,Category,Memo,Outflow,Inflow
    // 01/25/12,Sample Payee,,Sample Memo for an outflow,100.00,
    // 01/26/12,Sample Payee 2,,Sample memo for an inflow,,500.00
    // Get sum
    var paid = exp.users
    .filter(function(user) {
        return user.user_id == id;
        return 1;})
    .map(function (user) {
        return Number(user.paid_share);
    }).reduce(function(a,b) { return a + b;}, 0.0);;

    var owed = exp.users
    .filter(function(user) {
        return user.user_id == id;
        return 1;})
    .map(function (user) {
        return Number(user.owed_share);
    }).reduce(function(a,b) { return a + b;}, 0.0);

    var net = paid - owed;
    var out = (net < 0 ? -net : 0);
    var inf = (net > 0 ? net : 0);
    
    return {"Date": printDate(new Date(exp.date)),
            "Payee": exp.description,
            "Category": "",
            "Memo": "paid: " + paid + " owed:"+ owed + " cost:"+exp.cost,
            "Outflow" : out,
            "Inflow" :  inf};
}

function printExpenses(id, exps){
    var str = "Date,Payee,Category,Memo,Outflow,Inflow\n";
    console.log(id);
    str += exps.map(x=>processExpense(id, x))
        .map(function (exp) {
        return [exp.Date, exp.Payee,
                exp.Category, exp.Memo,
                exp.Outflow, exp.Inflow].join(",");})
        .join("\n");
    return str;
};



// Save text file
function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}

function downloadSplitwiseCSV(start_date, end_date) {


    $.get( "https://secure.splitwise.com/api/v3.0/get_expenses",
          {"dated_after": start_date, "dated_before": end_date,
           "limit":0},
          function( data ) {
        $.get("https://secure.splitwise.com/api/v3.0/get_current_user", function (user) {
            saveText(printExpenses(user.user.id, data.expenses), "splitwise.csv");
        });
    });
}



$("#right_sidebar").append(`

<h2> Download CSV file </h2>
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
<style>
.date { width:10em;}
</style>

        <div id="ncontent" onsubmit="return false;">
            <form id="myform" action="">
                <input name="start" type="text" class="date" value="Start Date"/>
                <input name="end" type="text" class="date"  value="End Date"/>
                <input class="btn-orange btn-large btn" id="submit" type="submit" value="Download CSV"/>
            </form>
        </div>
`);

$(function () {
    $("input.date").datepicker();
});


$("#submit").click(function () {
    var data = {};
    $("#myform").serializeArray()
        .forEach(function (x) {

            var fmt = "m/d/yy";
            var d = $.datepicker.parseDate(fmt, x.value);
            return data[x.name] =  d;
        });
    downloadSplitwiseCSV(data["start"], data["end"]);
});


