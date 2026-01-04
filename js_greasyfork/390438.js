// ==UserScript==
// @name         Veracross Activity Saver
// @version      0.2
// @description  Bring the old CGS schedule view to the Veracross student schedule.
// @author       Liam Wang
// @namespace    https://greasyfork.org/users/118299
// @match        https://portals.veracross.com/catlin/activity-saver
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390438/Veracross%20Activity%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/390438/Veracross%20Activity%20Saver.meta.js
// ==/UserScript==

// TODO: Get rid of html snippets


loadSchedule()


function loadSchedule() {
    $("body").html("Loading CGS activities (20s)...")
    Promise.all(getVeracrossDateStringsForWeek(new Date("2019-8-1")).map(httpRequestScheduleForDate)).then(res => {
                let obj = {}
        res.filter(thing => thing.blocks.length !== 0).forEach(thing => {
            obj[thing.date] = thing.blocks;
        });
        let jsonString = JSON.stringify(obj);
        console.log(jsonString);
        $("body").html(jsonString)
    });
}

function getVeracrossDateStringsForWeek(mondayDate) { // [2019-9-16, 2019-9-17, etc...]
    let dates = [];
    for (let i = 0; i < 300; i++) {
        dates.push(dateToVeracrossDate(mondayDate));
        mondayDate.setDate(mondayDate.getDate() + 1);
    }
    return dates;
}

function httpRequestScheduleForDate(dateString) { // http request to veracross for the schedule blocks
    return new Promise(function (resolve) {
        $.get(`https://portals.veracross.com/catlin/student/student/daily-schedule?date=${ dateString }`, data => {
            let arr = [];
            $(data).find('.schedule .schedule-item .universal-block').parent().parent().each((index, value) => { // find all the blocks and get the time, title, and subtitle
                let timeString = $(value).find('.item-time').text().replace('NOW', '').trim();
                let startTime = timeString;
                let title = $(value).find('.item-main-description').text().trim();
                arr.push({startTime, title});
            });
            let splitDate = dateString.split('-'); // get the current date
            let date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
            //let letter = $(data).find('.rotation-day-header').text().trim().slice(-1);
            resolve({date: dateString, blocks: arr});
        }).fail(() => window.location.href = "https://portals.veracross.com/catlin"); // user was not logged in, redirect them to login page
    });
}

//</editor-fold>

//<editor-fold desc="Static date utilities">
function parseVeracrossTime(timeString) {
    let isPm = false;
    if (timeString.includes('am')) {
        timeString = timeString.replace(' am', '');
    }
    if (timeString.includes('pm')) {
        timeString = timeString.replace(' pm', '');
        isPm = true;
    }
    let splitString = timeString.split(':');
    return new Date(0, 0, 0, parseInt(splitString[0]) + (isPm && parseInt(splitString[0]) !== 12 ? 12 : 0), parseInt(splitString[1]));
}

function dateToVeracrossDate(date) {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

function format12HourTime(date) {
    return ((date.getHours() - 1) % 12 + 1) + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}

function getLastFriday(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = (day <= 5) ? (7 - 5 + day) : (day - 5);

    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    return d;
}
//</editor-fold>