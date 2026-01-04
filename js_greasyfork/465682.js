// ==UserScript==
// @name         Custom Anime Scheduler
// @namespace    http://tampermonkey.net/
// @version      0.1.6.3
// @description  Schedules anime from any season
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *.livechart.me/*
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at  document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465682/Custom%20Anime%20Scheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/465682/Custom%20Anime%20Scheduler.meta.js
// ==/UserScript==

const $ = window.jQuery;

function convertToDateLinkText(date) {
    let realMonth = date.getMonth() + 1;
    let dateString = date.getDate();
    if (dateString < 10) {
        dateString = '0' + dateString;
    }
    if (realMonth < 10) {
        realMonth = '0' + realMonth;
    }
    const dateLinkFormat_ = date.getFullYear() + '-' + realMonth + '-' + dateString;
    return dateLinkFormat_;
}

function convertToDateObject(dateString) {
    const modifiedDateString = dateString + " 00:00:00";
    const dateObject = new Date(modifiedDateString);
    return dateObject;
}

function speedChange(diff) {
    const daysString = GM_getValue("days_speed");
    const speed = Number(daysString);
    const newDiff = diff * Math.ceil(7 / speed);
    return newDiff;
}

function daysSinceStartingDay(date) {
    let daysSince;
    const startingDay_ = GM_getValue("starting_day");
    if (startingDay_ == "monday") {
        daysSince = (date.getDay() + 6) % 7;
    }
    else if (startingDay_ == "relative") {
        //daysSince = (date.getDay() + speedChange(1) - 1) % 7;
        daysSince = speedChange(1) - 1;
    }
    else {
        daysSince = date.getDay();
    }
    return daysSince;
}

function shiftDate(date, diff) {
    const daysShifted = date.getDate() + diff;
    date.setDate(daysShifted);
}

function getDayTextFromNum(num) {
    let weekDay;
    switch(num) {
        case 0:
            weekDay = "Sun";
        break;
        case 1:
            weekDay = "Mon";
        break;
        case 2:
            weekDay = "Tue";
        break;
        case 3:
            weekDay = "Wed";
        break;
        case 4:
            weekDay = "Thu";
        break;
        case 5:
            weekDay = "Fri";
        break;
        case 6:
            weekDay = "Sat";
        break;
    }
    return weekDay;
}

function getDayText(date) {
    let weekDay;
    const dayNum = date.getDay();
    weekDay = getDayTextFromNum(dayNum);
    return weekDay;
}

function convertToDateButtonText(date) {
    let retString;
    let dateString = date.getDate();
    const weekDay = getDayText(date);
    const realMonth = date.getMonth() + 1;


    if (dateString < 10) {
        dateString = '0' + dateString;
    }
    retString = weekDay + ' ' + realMonth + '/' + dateString;
    return retString;
}

function GetURLParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}

function highlightTTDay(dayText, dayStatus) {
   let timeTableBox = $('.timetable');
   const tTDayQuery = 'h2:contains("' + dayText + '")';
   let TTDayH2 = timeTableBox.find(tTDayQuery);
   let TTDay = TTDayH2.parent().parent();
   TTDay.removeClass("past");
   TTDay.addClass(dayStatus);
}

$(window).bind("load", function () {
const $today = new Date();
const todayHoursToMidnight = convertToDateObject(convertToDateLinkText($today));
let scheduleDate = convertToDateObject(GM_getValue("start_date"));
const settingDate = convertToDateObject(GM_getValue("setting_date"));
const daysDiff = (todayHoursToMidnight - settingDate) / (1000 * 60 * 60 * 24);
const daysDiffWithSpeed = speedChange(daysDiff);

shiftDate(scheduleDate, daysDiffWithSpeed);

const currentCustomDateText = convertToDateLinkText(scheduleDate);

const weekStartDiff = -daysSinceStartingDay(scheduleDate);
shiftDate(scheduleDate, weekStartDiff);

const dateLinkFormat = convertToDateLinkText(scheduleDate);
const scheduleDateLink = 'https://www.livechart.me/timetable?date=' + dateLinkFormat;

const SettingsTab = '<li class="hide-for-small-only"><a class="nav-link schedule-settings-button" href="https://www.livechart.me/preferences/general">Settings</a></li>';
let CustomScheduleTab;
if (GM_getValue("start_date") == undefined) {
    CustomScheduleTab = '<li class="hide-for-small-only"><a class="nav-link" id="default-cschedule-button">Custom Schedule</a></li>';
}
else {
    CustomScheduleTab = '<li class="hide-for-small-only"><a class="nav-link" href="' + scheduleDateLink + '">Custom Schedule</a></li>';
}

$(SettingsTab).insertBefore('.site-header--navigation>.flex-spacer');

let headlinesButton = $('a[href="/headlines"]').parent();
$(headlinesButton).attr('id', 'headlines-button');
$(CustomScheduleTab).insertBefore('.site-header--navigation>#headlines-button');

const urlDateText = GetURLParameter('date');
let urlDateObject = convertToDateObject(urlDateText);
shiftDate(urlDateObject, -7);
const urlDateLastWeekText = convertToDateLinkText(urlDateObject);
const urlDateButtonText = convertToDateButtonText(urlDateObject);

const lastWeekButton = '<div class="column small-6"><a class="button clear" href="/timetable?date=' + urlDateLastWeekText + '" rel="nofollow"><i class="icon-navigate_first"></i>' + urlDateButtonText + '</a></div>';
let weekChangeRow = $('div.column.small-6.float-right.text-right').parent()

if (weekChangeRow.find("a").length == 1) {
   weekChangeRow.prepend(lastWeekButton);
}

let currentCustomDate = convertToDateObject(currentCustomDateText);
const scheduleDayText = getDayText(currentCustomDate);
let futureDayText

if (urlDateText == dateLinkFormat) {
   highlightTTDay(scheduleDayText, "today");

   const scheduleDayNum = currentCustomDate.getDay();
   for (let i = scheduleDayNum; i < 7; i++) {
       futureDayText = getDayTextFromNum(i);
       highlightTTDay(futureDayText, "future");
   }
   const startingDay = GM_getValue("starting_day");
   if (startingDay == "monday") {
       highlightTTDay("Sun", "future");
   }
   else if (startingDay == "relative") {
       const relDaysDiff = speedChange(1);
       let _thisDay = (scheduleDayNum + 1) % 7;
       for (let i = 0; i < 7 - relDaysDiff; i++) {
           futureDayText = getDayTextFromNum(_thisDay);
           highlightTTDay(futureDayText, "future");
           _thisDay = (_thisDay + 1) % 7;
       }
   }
}


let BrowseList = $('.small-up-4');

$('.small-up-4 > div:last-child').remove();

const rowsNum = 20;
const colsNum = 4;
let yearGrid = new Array (colsNum);
for (let i = 0; i < colsNum; i++) {
    yearGrid[i] = new Array(rowsNum);
}

let i = 0;
let k = 0;
$('.small-up-4 div').each(function() {
   if (i < rowsNum) {
     yearGrid[k][i] = $(this);
     i++;
   }
   else {
     k++;
     if (k < colsNum) {
        i = 0;
        yearGrid[k][i] = $(this);
     }
   }
});

const thisYear = $today.getFullYear();

for (let year = (thisYear - 3); year >= 1960; year--) {
   if (i < rowsNum) {
      yearGrid[k][i] = ('<div class="cell"><a class="px0" href="/winter-' + year + '/tv">' + year + '</a></div>');
      i++;
   }
   else {
      k++;
      if (k < colsNum) {
         i = 0;
         year++;
      }
   }
}


$(BrowseList).empty();
let r = 0;
let c = 0;
for (let r = 0; r < rowsNum; r++) {
   for (let c = 0; c < colsNum; c++) {
      $(BrowseList).append(yearGrid[c][r]);
   }
}

$(BrowseList).removeClass('grid-padding-x');

let PreferencesList = '.large-push-2 > div[class="ul-tabs-overflow"] > ul[class="ul-tabs"]';
const ScheduleSettingsPrefTab = '<li class="ul-tab schedule-pref-tab"><a>Edit Schedule</a></li>';

$(PreferencesList).append(ScheduleSettingsPrefTab);

let prefBody = $('form[action*="/preferences/"]');

$(".schedule-pref-tab").click(function() {
    const SchedulePrefFormStart = '<div class="callout">';
    const StartDate = '<label class="string required" for="start_date"><abbr title="required">Type out the date that your custom schedule starts (YYYY-MM-DD)</label><input class="string required" required="required" aria-required="true" placeholder="2013-05-23" maxlength="20" pattern="*" size="20" type="text" value="" name="user[username]" id="start-date">';
    const StartingDay = '<label for="starting_day">The starting day of the week is</label><select name="preferences[titles]" id="starting-day">';
    const StartingDayOptions = '<option value="monday">Monday (Mo. Tu. We. Th. Fr. Sa. Su.)</option><option value="sunday">Sunday (Su. Mo. Tu. We. Th. Fr. Sa.)</option><option value="relative">Relative to the date</option></select>';
    const DaysSpeed = '<label for="days_speed">Speed that schedule time passes <h5 style="display:inline"><a id="time-pass-info" title="The program will change the date that shows up in the Custom Schedule with every day that passes, and with one of these options selected, it will jump 2 days ahead for every day of real time, all the way up to 7 days ahead for every real time day. (Selecting respectively: [Each week lasts 4 days] and [Each week lasts 1 day])">&#x1F6C8</a></h5></label><select name="preferences[titles]" id="days-speed">';
    const DaysSpeedOptions = '<option value="7">Each week lasts 7 days</option><option value="1">Each week lasts 1 day</option></option><option value="1.5">Each week lasts 1.5 days</option><option value="2">Each week lasts 2 days</option><option value="3">Each week lasts 3 days</option><option value="4">Each week lasts 4 days</option></select>';
    const SchedulePrefFormEnd = '<hr><button class="button" name="schedule-button">Save</button></div>';

    $('.ul-tabs li').each(function() {
        $(this).removeClass('active');
    });
    $(".schedule-pref-tab").addClass('active');

    prefBody.empty();
    prefBody.append(SchedulePrefFormStart + StartDate + StartingDay + StartingDayOptions + DaysSpeed + DaysSpeedOptions + SchedulePrefFormEnd);

    let startDateValue = $('label[for="starting_day"]').val();

    const prevStartingDayOption = 'option[value="' + GM_getValue("starting_day") + '"]';
    $(prevStartingDayOption).attr("selected", "selected");

    const prevSpeedOption = 'option[value="' + GM_getValue("days_speed") + '"]';
    $(prevSpeedOption).attr("selected", "selected");

    $('button[name="schedule-button"]').on('click', function(event) {
      event.preventDefault();

      let startDateValue = $('#start-date').val();
      let startingDayValue = $('#starting-day').val();
      let daysSpeedValue = $('#days-speed').val();

      GM_setValue("start_date", startDateValue);
      GM_setValue("starting_day", startingDayValue);
      GM_setValue("days_speed", daysSpeedValue);

      let $thisDate = new Date();
      let thisDateText = convertToDateLinkText($thisDate);

      GM_setValue("setting_date", thisDateText);

      location.reload();
    });

    $("#time-pass-info").hover(function() {
        $("#time-info-text").css('visibility', function(i, visibility) {
            return (visibility == 'visible') ? 'hidden' : 'visible';
        });
    });
});

$("#default-cschedule-button").click(function() {
    const setupInstructions = '<h3>&nbsp;Click on the "Settings" tab, then from there, click on "Edit Schedule"<br>&nbsp;to add a new custom schedule.</h3>';
    $("#content").empty();
    $("#content").append(setupInstructions);
});

});