// ==UserScript==
// @name         Better Games Done Quick Schedule
// @namespace    http://tampermonkey.net/
// @version      2.2.9
// @description  Adds infos about the current Run to the top of the page, a link that brings you down to the current run in the schedule, a countdown to the next Run, an auto refresh for when the next run is estimated to start, so that you have always the correct times and runs displayed and highlights the current run in the schedule.
// @author       Ruben
// @match        https://gamesdonequick.com/schedule
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/26427/Better%20Games%20Done%20Quick%20Schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/26427/Better%20Games%20Done%20Quick%20Schedule.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Better AGDQ Shedule loading...");
    var tableRows = $("#runTable tbody tr").not(".day-split");
    var tableRowsDays = $("#runTable tbody tr");
    var time = "";
    var day = 0;
    var currentDate = new Date($.now());
    var rowOfCurrentRun = 0;
    var refreshInSeconds = 0;
    var refreshInTime = "";
    var newDate;
    var countdown;
    var days = {};
    var amountOfDays = 0;
    var counter = 0;
    var currentYearAndMonth = "2017/07/";

    //calcaulate correct Month
    currentYearAndMonth = (currentDate.getYear()+1900) + "/" + (currentDate.getMonth()+1) + "/";
    //console.log("Current Date: " + currentYearAndMonth);
    
    if(getCookie('autoRefresh') == "") setCookie('autoRefresh', true, 30);
    
    console.log("Collecting and formatting dates and times...");
    for(var j = 0; j < tableRowsDays.length; j = j + 2)
    {
        if(tableRowsDays.eq(j).hasClass("day-split"))
        {
            day = tableRowsDays.eq(j).text().match(/\d+/)[0];
            //console.log(day);
            j--;
            continue;
        }
        //console.log(tableRowsDays.eq(j));
        days.length = amountOfDays+1;
        days[amountOfDays] = day;
        //console.log(days);
        amountOfDays++;
    }
    
    for(var i = 0; i < tableRows.length; i = i + 2)
    {
        time = timeFormatting(tableRows.eq(i).children().eq(0).text());
        //console.log(days[counter]);
        var date=currentYearAndMonth + days[counter] +" " + time;
        newDate = new Date(Date.parse(date));
        //newDate = newDate -(-6000000);
        if(currentDate < newDate)
        {
            console.log("Highlighting current runs...");
            //console.log(newDate);
            //console.log(currentDate);
            //console.log(tableRows.eq(i-2));
            //console.log(tableRows.eq(i-1));
            //console.log(i);
            //Ändere Background vom vorheriger Run
            if(i != 2) {
                tableRows.eq(i-4).css("background-color", "#f2dede");
                tableRows.eq(i-4).css("color", "black");
                tableRows.eq(i-3).css("background-color", "#f2dede");
                tableRows.eq(i-3).css("color", "black");
            }
            $(tableRows.eq(i-4)).attr('id', 'currentRun');
            //Ändere Background vom aktuellem Run
            tableRows.eq(i-2).css("background-color", "#a00303");
            tableRows.eq(i-2).css("color", "white");
            tableRows.eq(i-1).css("background-color", "#a00303");
            tableRows.eq(i-1).css("color", "white");
            //Ändere Background vom nächsten Run
            tableRows.eq(i).css("background-color", "#f2dede");
            tableRows.eq(i).css("color", "black");
            tableRows.eq(i+1).css("background-color", "#f2dede");
            tableRows.eq(i+1).css("color", "black");
            rowOfCurrentRun = i;
            i = tableRows.length;
        }
        counter++;
    }
    console.log("Adding current run to the top of the page...");
    //Den aktuellen RUN an den Anfang der Seite einfügen
    var top = $(tableRows.eq(rowOfCurrentRun-2)).children();
    var bottom = $(tableRows.eq(rowOfCurrentRun-1)).children();
    refreshInSeconds = Math.ceil(((newDate - currentDate)/1000));
    refreshInTime = secondsToTime(refreshInSeconds);
    var countdown = "<div id='countdown' style='display: inline-block; text-align: center; padding: 5px 20px; line-height: 25px; background-color: #a00303; color: white; width: 150px; height: 100%'>Next Run in: <b>" + refreshInTime + "</b></div>";
    var goToCurrentRun = "<a href='#currentRun' id='goToCurrentRun' style='display: inline-block; text-align: center; padding: 5px 20px; color: white; line-height: 25px; padding-left: 15px; height: 100%; width: 155px; text-decoration: none; background-color: #8c1616;'><b>Go to Current Run <img style='filter: invert(); width: 20px; height: 22px' src='https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/DoubleChevronDown-128.png'/></b></a>";
    var currentRun = "<div style='overflow-x: auto; display: inline-block; max-width: 100%; vertical-align: top;'><nobr><div style='background-color: #a00303; color: white; padding: 5px 20px; line-height: 25px; display: inline-block;'>Current Run: <b>" + top.eq(1).text() + " (" + bottom.eq(1).text() + ")</b>&emsp;From: <b>" + top.eq(2).text() + "</b><br/>Start: <b>" + timeFormatting(top.eq(0).text()) + "&emsp;</b> Duration: <b>" + timeFormatting(bottom.eq(0).text()) + "&emsp;</b> Setup Length: <b>" + timeFormatting(top.eq(3).text()) + "</b></div></nobr></div>" + goToCurrentRun + countdown;

    $("<li><a style='padding-left: 25px; padding-right: 5px'><label><input style='margin-right: 11px' type='checkbox' name='checkbox' " + getCookieCheckbox()  + "/>Auto Refresh</label></a></li>").insertAfter(".nav.navbar-nav li:first-child ul li:last-child");
    $("#top").after(currentRun);
    //console.log($("#white-bg").eq(2));
    $("#goToCurrentRun").mouseenter(function() {
        $(this).css("background-color", "#c32323");
    }).mouseleave(function() {
        $(this).css("background-color", "#8c1616");
    });
    countdown = setInterval(function() {
        refreshInSeconds--;
        if(Math.ceil(((newDate - new Date($.now()))/1000)) < 0) {
            clearInterval(countdown);
            if(getCookie('autoRefresh') == "true") location.reload();
        } else {
            $("#countdown b").text(secondsToTime(Math.ceil(((newDate - new Date($.now()))/1000))) + "");
        }
    }, 1000);
    console.log("Better AGDQ Shedule done");
})();

function timeFormatting(time)
{
    //console.log("TimeFormatting:" + time);
    //console.log("Länge: " + time.length);
    //console.log(time);
    if(time.length == 7)
    {
        time = "0" + time;
    }
    else if(time.length == 10)
    {
        time = time.replace(/  /g, "0");
    }
    else
    {
        time = time;
    }
    return time;
}

function secondsToTime(seconds)
{
    var hours = Math.floor((seconds/60/60));
    seconds = seconds - hours*60*60;
    var minutes = Math.floor((seconds/60));
    seconds = seconds - minutes*60;
    return(addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds));
}

function addZero(time)
{
    if(time.toString().length == 1)
    {
        return ("0" + time);
    }
    else return ("" + time);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCookieCheckbox()
{
    if(getCookie('autoRefresh') == "true") return "checked";
}

$('input:checkbox').change(
    function(){
        if ($(this).is(':checked')) {
                setCookie('autoRefresh', true, 30);
        }
        else {
                setCookie('autoRefresh', false, 30);
        }
    });