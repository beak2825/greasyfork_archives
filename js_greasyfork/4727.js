// ==UserScript==
// @name           This Week's Projected Earnings
// @description    Adds a projected earnings for the previous week to dashboard.
// @author         Tjololo12
// @version        0.8
// @include        https://www.mturk.com/mturk/dashboard
// @grant          GM_getValue
// @grant          GM_setValue
// @grant	       GM_deleteValue
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/4727/This%20Week%27s%20Projected%20Earnings.user.js
// @updateURL https://update.greasyfork.org/scripts/4727/This%20Week%27s%20Projected%20Earnings.meta.js
// ==/UserScript==

var TodaysEarnings = 0;
var NumberOfPages = 0;
//var todayDate = new Date(2014,8,6);
var todayDate = new Date();
var todayDay = todayDate.getDay();
var thisMonth = todayDate.getMonth();
var thisDay = todayDate.getDate();
var thisYear = todayDate.getFullYear();
var todayString = (thisMonth+1).toString()+thisDay.toString()+thisYear.toString();
var lastDayOfLastMonth = new Date(thisYear, thisMonth, 0).getDate();
var dayOfWeek = todayDate.getDay();
var sameWeek = true;
if (GM_getValue("weekly_hits"))
    var numHits = GM_getValue("weekly_hits");
else
    var numHits = 0;
if (GM_getValue("weekly_earnings"))
    TodaysEarnings = GM_getValue("weekly_earnings");

function update()
{
    document.getElementById("ProjectedEarningsAmount").innerHTML = "Calculating...";
    var today_row = get_todays_data();
    var go = true;
    var single = true;
    switch (dayOfWeek){
        case 0:
            daycounter = 0;
            break;
        case 1:
            daycounter = 1;
            thisDay = getDay(1);
            break;
        case 2:
            daycounter = 2;
            thisDay = getDay(2);
            break;
        case 3:
            daycounter = 3;
            thisDay = getDay(3);
            break;
        case 4:
            daycounter = 4;
            thisDay = getDay(4);
            break;
        case 5:
            daycounter = 5;
            thisDay = getDay(5);
            break;
        case 6:
            daycounter = 6;
            thisDay = getDay(6);
            break;           
    }
    if (today_row.length > 0)
    {
        console.log(sameWeek);
        if (GM_getValue("day_hits"))
            dayHits = GM_getValue("day_hits");
        else
            dayHits = -1;
        var inner = today_row[1].innerHTML;
        console.log("Inner: "+inner);
        console.log("Day Hits: "+dayHits);
        if (sameWeek){
            if (dayHits == inner || today_row.length == 0){
                go = false;
                alert("No new hits since last time run, or no hits done today.");
            }
            else if (dayHits == -1)
            {
                single = false;
                TodaysEarnings = 0;
            }
            else{
                if (GM_getValue("day_amount")){
                    total = (TodaysEarnings - GM_getValue("day_amount"));
                    TodaysEarnings = parseFloat(total.toFixed(2));
                }
                else{
                    TodaysEarnings = 0;
                    single = false;
                }
            }
        }
    }
    if (single){
    	daycounter = 0;
        thisDay = todayDate.getDate();
    }
    while (daycounter >= 0 && go)
    {
        console.log(daycounter+" "+thisDay+" "+TodaysEarnings+" "+dayOfWeek);
        var done = false;
        var counter = 1;
        var dayHits = 0;
        var dayAmount = 0;
        month = thisMonth+1;
        year = thisYear;
        day = thisDay;
        if (month <= 9)
            month = "0"+month.toString();
        if (thisDay <= 9)
            day = "0"+thisDay.toString();
        var lastDayOfMonth = new Date(thisYear, month, 0).getDate();
        var dateToSearch = month.toString()+day.toString()+year.toString();
        while (!done)
        {     
            retry = false;
            console.log("Processing page "+counter+" for date "+dateToSearch+" total: "+TodaysEarnings);
            detailed_status_page_link = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + counter + "&encodedDate=" + dateToSearch;            
            console.log(detailed_status_page_link);
            var total = process_page(detailed_status_page_link);
            if (total.length == 0)
                retry=true;
            if (!retry)
                counter += 1;
            if (total[0] > 0){
                
                TodaysEarnings += Math.round(total[0] * 100) / 100; 
                numHits += parseInt(total[1]);
                if (thisDay == new Date().getDate())
                {
                    //alert("Day Hits: "+total[1]);
                    dayHits += parseInt(total[1]);
                    dayAmount += Math.round(total[0] * 100) / 100;
                }
            }
            else{
                if (!retry)
                	done = true;
            }
        }
        if (dayHits != 0){
            GM_setValue("day_hits",dayHits);
            GM_setValue("day_amount",dayAmount);
            console.log("Day hits updated: "+GM_getValue("day_hits"));
            console.log("Day amount updated: "+GM_getValue("day_amount"));
        }
        if (thisDay + 1 > lastDayOfMonth)
        {
            thisDay = 1;
            if (thisMonth + 2 > 12)
            {
                thisMonth = 0;
                thisYear += 1;
            }
            else
                thisMonth += 1;
        }
        else
            thisDay += 1;
        daycounter -= 1;
    }
    //alert("Weekly earnings "+TodaysEarnings);
    //alert("Weekly Hits "+numHits);
    GM_setValue("weekly_earnings",TodaysEarnings);
    GM_setValue("weekly_hits",numHits);
    document.getElementById("ProjectedEarningsAmount").innerHTML = "$" + TodaysEarnings.toFixed(2);
}

function getDay(daysToRemove){
    var day = thisDay;
    if (day - dayOfWeek <= 0){
        if (thisMonth - 1 < 0){
            thisYear -= 1;
            thisMonth = 11;
        }
        else
            thisMonth -= 1;
        for (var i = 0; i < daysToRemove; i++){
            if (day - 1 == 0)
                day = lastDayOfLastMonth;
            else
                day -= 1;
        }
    }
    else{
        day -= dayOfWeek;
    }
    console.log("Start Date: "+day);
    if (GM_getValue("start_date")){
        console.log(GM_getValue("start_date")+" "+day+" "+(parseInt(GM_getValue("start_date")) != day))
        if (parseInt(GM_getValue("start_date")) != day) {
            setZero();
            sameWeek = false;
        }
        else
            sameWeek = true;
    }
    GM_setValue("start_date",day);
    return day;
}

function clear()
{
    if (confirm("Are you sure you want to clear everything from the weekly earnings script?")){
        setZero();
    }
}

function setZero(){
    GM_deleteValue("weekly_earnings");
    GM_deleteValue("weekly_hits");
    GM_deleteValue("day_hits");
    GM_deleteValue("start_date");
    TodaysEarnings = 0;
    document.getElementById("ProjectedEarningsAmount").innerHTML = "$0.00";
}

function force()
{
    setZero();
    update();

}

function showMetrics()
{
    var earningsPer = "$"+(parseInt(TodaysEarnings.toFixed(2))/parseInt(GM_getValue("weekly_hits"))).toFixed(2);
    console.log(earningsPer);
    var alertText = "Here's some random metrics!\nEarnings for last week: $"+TodaysEarnings.toFixed(2)+"\nNumber of hits completed: "+GM_getValue("weekly_hits")+"\nAverage earnings/hit: "+earningsPer+"\nI plan to add more metrics as I get requests for them!";
    alert(alertText);
}

//
// Insert the Projected Earnings in the dashboard.
// Copied from current_earnings script - Copyright (c) 2008, Mr. Berserk
// 
// Modified to suit
//

var allTds, thisTd;
allTds = document.getElementsByTagName('td');
for (var i = 0; i < allTds.length; i++)
{
    thisTd = allTds[i];
    if ( thisTd.innerHTML.match(/Total Earnings/) && thisTd.className.match(/metrics\-table\-first\-value/) )
    {
        var row = document.createElement('tr');
        row.className = "even";
        
        
        var projectedEarningsLink = document.createElement('a');
        projectedEarningsLink.innerHTML = "Week's Projected Earnings    ";
        projectedEarningsLink.title = "Click me for some nifty metrics!";

        projectedEarningsButton = document.createElement('button'); 
        projectedEarningsClearButton = document.createElement('button');
        projectedEarningsForceButton = document.createElement('button');
        
        projectedEarningsButton.textContent = 'U';
        projectedEarningsButton.title = 'Update weekly earnings';

        projectedEarningsButton.style.height = '14px';
        projectedEarningsButton.style.width = '10px';
        projectedEarningsButton.style.fontSize = '8px';
        projectedEarningsButton.style.border = '1px solid';
        projectedEarningsButton.style.padding = '0px';
        projectedEarningsButton.style.backgroundColor = 'transparent';
        
        projectedEarningsClearButton.textContent = 'X';
        projectedEarningsClearButton.title = 'Clear all storage';

        projectedEarningsClearButton.style.height = '14px';
        projectedEarningsClearButton.style.width = '10px';
        projectedEarningsClearButton.style.fontSize = '8px';
        projectedEarningsClearButton.style.border = '1px solid';
        projectedEarningsClearButton.style.padding = '0px';
        projectedEarningsClearButton.style.backgroundColor = 'transparent';
        
        projectedEarningsForceButton.textContent = 'F';
        projectedEarningsForceButton.title = 'Do a clean update (Clear storage, force update)';

        projectedEarningsForceButton.style.height = '14px';
        projectedEarningsForceButton.style.width = '10px';
        projectedEarningsForceButton.style.fontSize = '8px';
        projectedEarningsForceButton.style.border = '1px solid';
        projectedEarningsForceButton.style.padding = '0px';
        projectedEarningsForceButton.style.backgroundColor = 'transparent';
        
        projectedEarningsButton.addEventListener('click',update,false);
        projectedEarningsClearButton.addEventListener('click',clear,false);
        projectedEarningsForceButton.addEventListener('click',force,false);
        projectedEarningsLink.addEventListener('click',showMetrics,false);
        
        var cellLeft = document.createElement('td');
        cellLeft.className = "metrics-table-first-value";
        cellLeft.appendChild(projectedEarningsLink);
        cellLeft.appendChild(projectedEarningsButton);
        cellLeft.appendChild(projectedEarningsClearButton);
        cellLeft.appendChild(projectedEarningsForceButton);
        row.appendChild(cellLeft);
        
        var cellRight = document.createElement('td');      
        cellRight.id="ProjectedEarningsAmount";
        cellRight.innerHTML = "$" + TodaysEarnings.toFixed(2);
        row.appendChild(cellRight);
        
        thisTd.parentNode.parentNode.insertBefore(row,thisTd.parentNode.nextSibling);
    }
}

//
// Functions
//

function get_todays_data()
{
    var tables = document.getElementsByClassName('metrics-table');
    for (var m = 0; m < tables.length; m++)
    {
        var table_rows = tables[m].getElementsByTagName('tr');
        //console.log(table_rows[0].getElementsByTagName('th')[0]);
        //console.log(table_rows[0].getElementsByTagName('th')[0].innerHTML.trim() == "Date");
        if (table_rows[0].getElementsByTagName('th')[0].innerHTML.trim() != "Date")
            continue;
        for (var n = 0; n < table_rows.length; n++)
        {
            var table_data = table_rows[n].getElementsByTagName('td');
            status_link = table_rows[n].getElementsByTagName('a');
            if(status_link[0])
            {
                if(table_data[0].innerHTML.match('Today'))
                {
                    //console.log(table_data);
                    return table_data;
                }
            }
        }
    }
    return [];  // If no Today found we have to return something else it dies silently
}

//
// Process a detailed status page by added up the value of all the hits
//

function process_page(link)
{
    // use XMLHttpRequest to fetch the entire page, use async mode for now because I understand it
    var page = getHTTPObject();
    page.open("GET",link,false);      
    page.send(null);
    return earnings_subtotal(page.responseText); 
}


//
// Add up all the hit values on this detailed status page
// For the code to work we have to turn the responseText back
// into a DOM object so we can get the values using the 
// getElementsByClassName function. We use the create div trick.
//
// Modified to not add in those hits that have already been rejected
//

function earnings_subtotal(page_text)
{
    var sub_total= 0;
    var index = 0;
    var page_html = document.createElement('div');
    page_html.innerHTML = page_text;
    
    var isRefreshProblem = page_text.indexOf("You have exceeded the maximum allowed page request rate for this website.");

    if (isRefreshProblem != -1)
        return [];
    
    var amounts = page_html.getElementsByClassName('statusdetailAmountColumnValue');
    var statuses = page_html.getElementsByClassName('statusdetailStatusColumnValue');
    
    if (amounts.length == 0)
        return sub_total;
    for(var k = 0; k < amounts.length; k++)
    {
        if(statuses[k].innerHTML != 'Rejected')
        {
            index = amounts[k].innerHTML.indexOf('$');
            sub_total = sub_total + parseFloat(amounts[k].innerHTML.substring(index+1));
        }
    }
    return [sub_total,amounts.length];
}


//
// XMLHttpRequest wrapper from web
//

function getHTTPObject()  
{ 
    if (typeof XMLHttpRequest != 'undefined')
    { 
        return new XMLHttpRequest();
    }
    try
    { 
        return new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (e) 
    { 
        try
        { 
            return new ActiveXObject("Microsoft.XMLHTTP"); 
        } 
        catch (e) {} 
    } 
    return false;
}
