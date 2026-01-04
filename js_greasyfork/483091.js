// ==UserScript==
// @name         WYHK-timetable exporter
// @namespace    https://github.com/BlissfulAlloy79/wyhk-timetable-exporter-js
// @supportURL	 https://github.com/BlissfulAlloy79/wyhk-timetable-exporter-js
// @version      0.1
// @description  WYHK-Timetable exporter
// @author       BlissfulAlloy79
// @match        https://www.wahyan.edu.hk/timetables
// @match        https://www.wahyan.edu.hk/timetables/*
// @match        https://www.wahyan.edu.hk/examtimetable
// @match        https://www.wahyan.edu.hk/examtimetable/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483091/WYHK-timetable%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/483091/WYHK-timetable%20exporter.meta.js
// ==/UserScript==
class Calendar {
    constructor() {
        this.SEPARATOR = '\r\n';
        this.calHeader = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//WYHK TIMETABLE EXPORTER//Blissfulalloy79//"
        ].join(this.SEPARATOR);
        this.calEnd = 'END:VCALENDAR';
        this.calEvents = [];
    }

    dateParse(d, fullday) {
        // it only takes ISO 8601 format strings :(
        if (typeof fullday !== 'boolean') {
            throw new Error("dateParse function type error!");
        }
        var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
        var p = d.match(regex);

        if (fullday) {
            return "" + p[1] + p[2] + p[3];
        }
        else {
            return p[1] + p[2] + p[3] + "T" + p[4] + p[5] + "00";
        }

    }

    addEvent(dtstart, dtend, dtstamp, summary, notes, fullday) {
        notes = notes || '';
        if (typeof dtstart === 'undefined' ||
            typeof dtend === 'undefined' ||
            typeof dtstamp === 'undefined' ||
            typeof summary === 'undefined' ||
            typeof fullday !== 'boolean'
           ) {
            return false;
           }

        dtstart = this.dateParse(dtstart, fullday);
        dtend = this.dateParse(dtend, fullday);
        dtstamp = this.dateParse(dtstamp, fullday);

        var calEvent = [
                "BEGIN:VEVENT",
                "SUMMARY:" + summary,
                "DESCRIPTION:" + notes,
                "DTSTART:" + dtstart,
                "DTEND:" + dtend,
                "DTSTAMP:" + dtstamp,
                "END:VEVENT"
            ].join(this.SEPARATOR);

        if (fullday) {
            calEvent = [
                "BEGIN:VEVENT",
                "SUMMARY:" + summary,
                "DESCRIPTION:" + notes,
                "DTSTART;VALUE=DATE:" + dtstart,
                "DTEND;VALUE=DATE:" + dtend,
                "DTSTAMP;VALUE=DATE:" + dtstamp,
                "END:VEVENT"
            ].join(this.SEPARATOR);
        }

        this.calEvents.push(calEvent);
        return calEvent;
    }

    getEvents() {
        return this.calEvents;
    }

    download(filename) {
        if (this.calEvents.length < 1) {
            alert("Download failed!\nThe event list is empty");
            return false;
        }

        filename = (typeof filename !== 'undefined') ? filename : 'calendar';
        const calendar_content = this.calHeader + this.SEPARATOR + this.calEvents.join(this.SEPARATOR) + this.SEPARATOR + this.calEnd;

        const blob = new Blob([calendar_content], {
            type: "text/calendar"
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
            link.setAttribute("download", `${filename}.txt`);
        }
        else {
            link.setAttribute("download", `${filename}.ics`);
        }

        link.click();
    }
}

function xhr(rtype, url) {
    if (typeof rtype !== 'string' || typeof url !== 'string') {
        return new Error("Parameter type error!");
    }
    const xhr = new XMLHttpRequest();
    xhr.open(rtype, url, true);

    return new Promise(function(resolve, reject) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
                else {
                    reject(new Error("" + url + " request failed with status", xhr.status));
                }
            }
        };
    xhr.send();
    });
}

async function getCalendar() {
    try {
        return await xhr('GET', "https://www.wahyan.edu.hk/timetable-api/api/calendar");
    }
    catch (error) {
        console.log(error);
        return error;
    }
}


async function getEventOTD(date) {
    const d = date.slice(0, 10)
    console.log("Getting event of the day: " + d);

    try {
        const r = await xhr('GET', "https://www.wahyan.edu.hk/timetable-api/api/student-events?date=" + d);
        if (r.length > 0) {
            return r[0]["Events"].replace(/\r\n/g, "\\n");
        }
        return "";
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

async function getTimetable(year, term, student) {
    if (typeof year !== 'string' || typeof term !== 'string' || typeof student !== 'string') {
        return new Error("Parameter type error!");
    }
    try {
        return await xhr('GET', "https://www.wahyan.edu.hk/timetable-api/api/student-timetable?year=" + year + "&term=" + term + "&student=" + student);
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

async function getExamTimetable(year, exam, student) { // year refers to school year
    if (typeof year !== 'string' || typeof exam !== 'string' || typeof student !== 'string') {
        return new Error("Parameter type error!");
    }
    try {
        return await xhr('GET', `https://www.wahyan.edu.hk/examtimetable-api/api/student-version-exam-timetable?year=${year}&exam=${escape(exam)}&student=${student}`);
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

async function exportCalendar() {
    const scal = await getCalendar();
    const calendar = new Calendar();
    for (var Day of scal) {
        var d = Day["Date"];
        var order = (Day["Display"] == "H") ? "(Half-day)" : "";
        var summary;
        switch (Day["Type"]) {
            case "Cycle Day":
                summary = "Day " + Day["Day"] + ", Cycle " + Day["Cycle"] + " " + order;
                break;
            case "Non Cycle Day":
                summary = "Non Cycle Day";
                break;
            case "School Holiday":
                summary = "School Holiday";
                break;
            default:
                continue;
        }
        try {
            const event_otd = await getEventOTD(d);
            calendar.addEvent(d, d, d, summary, event_otd, true);
        }
        catch (error) {
            console.error("Error retrieving event of ${d}", error);
        }
    }

    console.log(calendar.getEvents());
    console.log("Finished creating " + calendar.getEvents().length + " calendar events");
    console.log("Exporting...");

    calendar.download("Annual calendar");
    console.log("Done!");
}

async function exportTimetable() {
    const FDAY_START = ["08:15", "08:55", "09:50", "10:30", "11:25", "12:05", "14:05", "14:10", "14:20", "15:00"];
    const FDAY_END = ["08:55", "09:35", "10:30", "11:10", "12:05", "12:45", "14:10", "14:20", "15:00", "15:40"];
    const HDAY_START = ["08:10", "08:45", "09:30", "10:05", "10:55", "11:30", "12:15", "12:50", "13:25"];
    const HDAY_END = ["08:45", "09:20", "10:05", "10:40", "11:30", "12:05", "12:50", "13:25", "13:35"];
    const SCAL = await getCalendar();
    const calendar = new Calendar();
    var sid = "";
    var year = "";
    var term = "";
    try {
        const user = await xhr('GET', "https://www.wahyan.edu.hk/timetable-api/api/user");
        sid = user["username"].slice(-5);
        const tdy = new Date().toString();
        const ynt = await xhr('GET', "https://www.wahyan.edu.hk/timetable-api/api/year-and-term?date=" + escape(tdy));
        year = ynt[0]["Sch_Year"].toString();
        term = ynt[0]["Term"].toString();
    }
    catch (error) {
        console.log("Error getting data", error);
    }
    const TIMETABLE = await getTimetable(year, term, sid);
    for (const item of SCAL) {
        if (item["Type"] != "Cycle Day") {
            continue;
        }
        const ORDER = item["Display"];
        const DATE = item["Date"].slice(0, 10);
        const LESSON_OTD = TIMETABLE[item["Day"] - 1];
        if (ORDER == "F") {
            for (let i = 1; i <= 10; i ++) {
                let summary = LESSON_OTD[`P${i}_Subj`];
                let dtstart = DATE + "T" + FDAY_START[i - 1];
                let dtstamp = dtstart;
                let dtend = DATE + "T" + FDAY_END[i - 1];
                calendar.addEvent(dtstart, dtend, dtstamp, summary, "", false);
            }
        }
        else if (ORDER == "H") {
            for (let i = 1; i <= 9; i ++) {
                let summary = LESSON_OTD[`P${i}_Subj`];
                if (i == 7 || i == 8) {
                    summary = LESSON_OTD[`P${i + 2}_Subj`];
                }
                else if (i == 9) {
                    summary = LESSON_OTD["P7_Subj"] + " & " + LESSON_OTD["P8_Subj"];
                }
                let dtstart = DATE + "T" + HDAY_START[i - 1];
                let dtstamp = dtstart;
                let dtend = DATE + "T" + HDAY_END[i - 1];
                calendar.addEvent(dtstart, dtend, dtstamp, summary, "", false);
            }
        }
    }

    console.log(calendar.getEvents());
    console.log("Finished creating " + calendar.getEvents().length + " lesson events");
    console.log("Exporting...");

    calendar.download("Lesson timetable");
    console.log("Done!");
}

async function exportExamTimetable() {
    const targetEle = document.getElementsByClassName("css-ohgg0k")[1];
    const t = targetEle.textContent.split(' ');
    const exam = t.slice(1, t.indexOf("Timetable")).join(' ');
    const year = t[0].split('-')[0]
    var sid = "";
    try {
        const user = await xhr('GET', "https://www.wahyan.edu.hk/timetable-api/api/user");
        sid = user["username"].slice(-5);
    }
    catch (error) {
        console.log("Error getting data", error);
    }
    const ETT = await getExamTimetable(year, exam, sid);
    const calendar = new Calendar();
    console.log(ETT.data);
    for (let i of ETT.data) {
        console.log(i);
        const t = i.Time.split('-')
        const dtstart = new Date(i.Date + t[0]);
        const dtend = new Date(i.Date + t[1])
        dtstart.setMinutes(dtstart.getMinutes() - dtstart.getTimezoneOffset());
        dtend.setMinutes(dtend.getMinutes() - dtend.getTimezoneOffset());
        // console.log(dtstart.toISOString());
        // console.log(dtend.toISOString());
        const summary = i["Exam Item"];
        // console.log(summary);
        const desc = `Venue: ${i.Venue}`;
        // console.log(desc);
        calendar.addEvent(dtstart.toISOString(), dtend.toISOString(), dtstart.toISOString(), summary, desc, false);
    }

    console.log(calendar.getEvents());
    console.log("Finished creating " + calendar.getEvents().length + " exam events");
    console.log("Exporting...");

    calendar.download("Exam timetable");
    console.log("Done!");
}

const styles = {
    minHeight: "40px",
    outline: "09!important",
    backgroundColor: "hsl(0, 0%, 100%)",
    borderColor: "hsl(0, 0%, 80%)",
    borderRadius: "5px",
    borderStyle: "solid",
    borderWidth: "1px",
    boxSizing: "border-box",
    textAlign: "left",
    color: "hsl(0, 0%, 50%)",
    cursor: "pointer"
}

function timetableBtnInsertion() {
    // locate target element to insert
    const targetEle = document.querySelector(".css-b62m3t-container");
    //create button
    const btn_calendar = document.createElement("button");
    btn_calendar.textContent = "Export Annual Calendar as .ics";

    Object.assign(btn_calendar.style, styles);

    btn_calendar.onclick = async () => {
        const cal_result = confirm("Downlaod the Annual calendar file?");
        btn_calendar.disabled = true;
        if (cal_result) {
            btn_calendar.textContent = "Fetching data...";
            btn_calendar.style.backgroundColor = "hsl(0, 0%, 89%)";
            // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
            await exportCalendar();
            btn_calendar.textContent = "Done!";
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            btn_calendar.disabled = false;
            btn_calendar.style.backgroundColor = "hsl(0, 0%, 100%)";
        }
        else {
            console.log("user cancelled")
            btn_calendar.disabled = false;
        }
        btn_calendar.textContent = "Export Annual Calendar as .ics";

    }

    btn_calendar.addEventListener('mouseenter', function() {
        if (!this.disabled){
            this.style.borderColor = "#1a6387";
        }
    });

    btn_calendar.addEventListener('mouseleave', function() {
        this.style.borderColor = "hsl(0, 0%, 80%)";
    });


    const btn_timetable = document.createElement("button");
    btn_timetable.textContent = "Export timetable as .ics";
    Object.assign(btn_timetable.style, styles);

    btn_timetable.onclick = async () => {
        const t_result = confirm("Download the tiemtable file?");
        btn_timetable.disabled = true;
        if (t_result) {
            btn_timetable.textContent = "Fetching data..."
            btn_timetable.style.backgroundColor = "hsl(0, 0%, 89%)";
            await exportTimetable();
            btn_timetable.textContent = "Done!"
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            btn_timetable.disabled = false;
            btn_timetable.style.backgroundColor = "hsl(0, 0%, 100%)";
        }
        else {
            console.log("user cancelled")
            btn_timetable.disabled = false;
        }
        btn_timetable.textContent = "Export timetable as .ics";
    }

    btn_timetable.addEventListener('mouseenter', function() {
        if (!this.disabled){
            this.style.borderColor = "#1a6387";
        }
    });

    btn_timetable.addEventListener('mouseleave', function() {
        this.style.borderColor = "hsl(0, 0%, 80%)";
    });

    targetEle.parentElement.appendChild(btn_calendar);
    targetEle.parentElement.appendChild(btn_timetable);

}

function examtimetableBtnInsertion() {
    // locate target element to insert
    const targetEle = document.querySelector(".css-b62m3t-container");
    //create button
    const btn_examtimetable = document.createElement("button");
    btn_examtimetable.textContent = "Export Exam timetable as .ics";

    Object.assign(btn_examtimetable.style, styles);

    btn_examtimetable.onclick = async () => {
        const cal_result = confirm("Downlaod the exam timetable file?");
        btn_examtimetable.disabled = true;
        if (cal_result) {
            btn_examtimetable.textContent = "Fetching data...";
            btn_examtimetable.style.backgroundColor = "hsl(0, 0%, 89%)";
            // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
            await exportExamTimetable();
            btn_examtimetable.textContent = "Done!";
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            btn_examtimetable.disabled = false;
            btn_examtimetable.style.backgroundColor = "hsl(0, 0%, 100%)";
        }
        else {
            console.log("user cancelled")
            btn_examtimetable.disabled = false;
        }
        btn_examtimetable.textContent = "Export Exam timetable as .ics";

    }

    btn_examtimetable.addEventListener('mouseenter', function() {
        if (!this.disabled){
            this.style.borderColor = "#1a6387";
        }
    });

    btn_examtimetable.addEventListener('mouseleave', function() {
        this.style.borderColor = "hsl(0, 0%, 80%)";
    });

    targetEle.parentElement.appendChild(btn_examtimetable);
}


function waitForLogin(callback) {
    console.log("observing...");
    const cName = ".LogOffButton_button__1Cye6";
    const element = document.querySelector(cName);
    if (element) {
        callback();
        return;
    }

    const observer = new MutationObserver(function(mutationsList, observer) {
        const element = document.querySelector(cName);
        if (element) {
            observer.disconnect();
            callback();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

}

(function() {
    'use strict';

    // Your code here...
    const path = window.location.pathname;
    if (path.startsWith("/timetables")) {
        waitForLogin(function() {
            console.log('logged in');
            setTimeout(() => {
                timetableBtnInsertion();
            }, 500);
        });
    }
    else if (path.startsWith("/examtimetable")) {
        waitForLogin(function() {
            console.log('logged in');
            setTimeout(() => {
                examtimetableBtnInsertion();
            }, 500);
        });
    }
})();
