// ==UserScript==
// @name         Filter Month
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds a month filter to RYM charts
// @author       jermrellum
// @match        https://rateyourmusic.com/charts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415559/Filter%20Month.user.js
// @updateURL https://update.greasyfork.org/scripts/415559/Filter%20Month.meta.js
// ==/UserScript==

function getMonth(n)
{
    switch(n)
    {
        case 1: return "January";
        case 2: return "February";
        case 3: return "March";
        case 4: return "April";
        case 5: return "May";
        case 6: return "June";
        case 7: return "July";
        case 8: return "August";
        case 9: return "September";
        case 10: return "October";
        case 11: return "November";
        case 12: return "December";
    }
    return "error";
}

(function() {
    'use strict';

    var month = -1;
    var href = window.location.href;
    var href_arr = href.split("/");
    var last_arg = href_arr[href_arr.length-1];
    var year = -1;
    var year_idx = -1;
    if(href_arr.length > 6)
    {
        year = parseInt(href_arr[6].substring(0,4));
        year_idx = href.indexOf(href_arr[6]);
    }
    var fullyear = new Date().getFullYear();
    var curMonth = new Date().getMonth() + 1;
    var sel = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
    if(last_arg.indexOf("month") > -1)
    {
        month = parseInt(last_arg.split(":")[1]);
    }
    if(month > 0 && month <= 12)
    {
        var mname = getMonth(month);
        sel[month] = 'selected ';
        var rows = document.getElementsByClassName("chart_results")[0].children;
        for(var i=2; i<rows.length; i++)
        {
            var day = rows[i].children[2].children[2].innerText;
            if(day.indexOf(mname) == -1)
            {
                rows[i].style.display = "none";
            }
        }
        document.getElementById("nav_prev_chart_nav_top").href += "month:" + month;
        document.getElementById("nav_prev_chart_nav_bottom").href += "month:" + month;
        document.getElementById("nav_next_chart_nav_top").href += "month:" + month;
        document.getElementById("nav_next_chart_nav_bottom").href += "month:" + month;
    }

    var pcqa = document.getElementsByClassName("page_chart_query_advanced")[0];

    var innerHs = [];
    for(var i2=0; i2<pcqa.children.length; i2++)
    {
        innerHs[i2] = pcqa.children[i2].innerHTML;
    }

    var mIdx = pcqa.children.length - 3;

    pcqa.children[mIdx].innerHTML = '<div style="margin-top: 10px;" class="page_chart_query_advanced_section_label">' +
        'Filter month:</div><div><label class="page_chart_query_radio_label">' +
        '<select onchange="if(this.value == 0) {return 0;} var href = window.location.href; var href_arr = href.split(\'/\'); var last_arg = href_arr[href_arr.length-1]; if(this.value > 12) {var pastIntv;switch(parseInt(this.value))'+
        '{case 13: pastIntv = 6; break;case 14: pastIntv = 13; break;case 15: pastIntv = 29; break;case 16: pastIntv = 89; break;case 17: pastIntv = 179; break;}var date = new Date();var past = '+
        'new Date();past.setDate(date.getDate()-pastIntv);var disp = past.toISOString().slice(0,10).replaceAll(\'-\',\'.\');' +
        'var disd = date.toISOString().slice(0,10).replaceAll(\'-\',\'.\');var filter_period = disp + \'-\' + disd;if(' + year_idx + ' != -1){window.location.href = href.substring(0,' + year_idx + ')' +
        '+ filter_period + href.substring(' + year_idx + ' + href_arr[6].length);}else{window.location.href = href + filter_period;}}'+
        'else{var fsYear = ' + year + ';if(!(' + year + ' > 1850 && ' + year + ' < 9999)){if(' + curMonth + '+1 > this.value){fsYear = ' + fullyear + ';}else{fsYear = ' + fullyear + '-1;}}'+
        'var disp_mon = this.value; if(disp_mon < 10)' +
        '{disp_mon = \'0\' + disp_mon;}var filter_period = fsYear + \'.\' + disp_mon + \'.01-\' + fsYear + \'.\' + disp_mon + \'.31\';window.location.href = href.substring(0,' + year_idx + ') + ' +
        'filter_period + href.substring(' + year_idx + ' + href_arr[6].length);}' +
        '" id="filter_month">' +
        '<option value="0">Select month</option><option ' + sel[1] + 'value="1">January</option><option ' + sel[2] + 'value="2">February</option>' +
        '<option ' + sel[3] + 'value="3">March</option><option ' + sel[4] + 'value="4">April</option><option ' + sel[5] + 'value="5">May</option><option ' + sel[6] + 'value="6">June</option>' +
        '<option ' + sel[7] + 'value="7">July</option><option ' + sel[8] + 'value="8">August</option><option ' + sel[9] + 'value="9">September</option><option ' + sel[10] + 'value="10">October</option>' +
        '<option ' + sel[11] + 'value="11">November</option><option ' + sel[12] + 'value="12">December</option><option value="0">-----</option><option value="13">Last week</option><option value="14">Last 2 weeks</option>' +
        '<option value="15">Last 30 days</option><option value="16">Last 90 days</option><option value="17">Last 180 days</option>' +
        '</select></label></div><div class="clearfix"></div>';

    pcqa.appendChild(document.createElement('span'));
    for(var i3=mIdx;i3<innerHs.length; i3++)
    {
        pcqa.children[i3+1].innerHTML = innerHs[i3];
    }
})();