// ==UserScript==
// @name         SFDC Open Tasks
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  Is going to automate all inputs when you paste on the comment text area.
// @author       Emanuel Farinha
// @match        https://hp.my.salesforce.com/00T/e*
// @match        https://hp.my.salesforce.com/00T1V00003HOR4O/e*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428425/SFDC%20Open%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/428425/SFDC%20Open%20Tasks.meta.js
// ==/UserScript==

// SFDC Open Tasks
'use strict';

// global var
let commentValue
let assign_to

// get today date
function dateToday() {
    let today = new Date().toLocaleDateString("pt")
    return today;
}

// function for disable/enable reminder check
function reminderCheck(type) {
    document.querySelector("input[name='IsReminderSet']").checked = type ? true : false
    document.querySelector("input[name='IsReminderSet']").disabled = type ? false : true
    document.querySelector("#reminder_dt").disabled = type ? false : true
    document.querySelector("#reminder_dt_time").disabled = type ? false : true
}

// handler for reminder date
function reminderDate() {
    reminderCheck(true)
    // regex to get date for comment
    const regex = RegExp(/(\d\d\/\d\d\/\d\d \d\d:\d\d)/,"g");
    let date = regex.exec(commentValue)[0]
    let dateReplace = date.replace(/(\/)|:| /g, "-");
    let dateSplit = dateReplace.split("-")
    dateSplit[2] = `20${dateSplit[2]}`;
    // make format date into timestamp
    let newDateWithTime = new Date( dateSplit[2], dateSplit[1] - 1, dateSplit[0], dateSplit[3], dateSplit[4]);
    let onlyDate = new Date( dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
    // remove 10 minutes for timestamp
    let onlyHoursTimestamp = (newDateWithTime.getTime() - onlyDate.getTime() - 600000) / 60000;
    let timestampMinusTen = newDateWithTime.getTime() - 600000;
    // get timestamp back to normal date
    let dateMinusTen = new Date(timestampMinusTen).toLocaleDateString("pt")
    let hoursMinusTen;

    // handler special cases of dates/hours
    for(let i = 0; i < document.querySelector("#reminder_dt_time").children.length; i++){

        if (Number(onlyHoursTimestamp) < 0){
            hoursMinusTen = "1410";
            document.querySelector("#reminder_dt").value = dateMinusTen.replaceAll("/", "-")
            document.querySelector("#reminder_dt_time").value = hoursMinusTen
            return
        }
        if (Number(onlyHoursTimestamp) >= 1410){
            hoursMinusTen = "1410";
            document.querySelector("#reminder_dt").value = dateMinusTen.replaceAll("/", "-")
            document.querySelector("#reminder_dt_time").value = hoursMinusTen
            return
        }
        if(Number(document.querySelector("#reminder_dt_time").children[i].value) > Number(onlyHoursTimestamp) && Number(document.querySelector("#reminder_dt_time").children[i - 1].value) <= Number(onlyHoursTimestamp)) {
            hoursMinusTen = document.querySelector("#reminder_dt_time").children[i - 1].value;
            document.querySelector("#reminder_dt").value = dateMinusTen.replaceAll("/", "-")
            document.querySelector("#reminder_dt_time").value = hoursMinusTen
            return

        }
    }

 }


// fill due date with time from comment
function dateFill(custom) {
    const regex = RegExp(/(\d\d\/\d\d\/\d\d)/,"g");
    let date = regex.exec(commentValue)[0]
    document.querySelector("input[name='tsk4']").value = date.replaceAll("/", "-")
}

// handler to execute handlers
function fillAll() {


    // handler switch case
  if(commentValue.search("Response 50% SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Response 50% SLO"
    dateFill()
    reminderDate()
  } else if (commentValue.search("Response 90% SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Response 90% SLO"
    dateFill()
    reminderDate()
  }else if (commentValue.search("Resolution Target SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Target Time SLO"
    document.querySelector("select[name='tsk12']").value = "Completed"
    reminderCheck(false)
    dateFill(dateToday())
  }else if (commentValue.search("Fix 80% SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Fix 80% SLO"
    dateFill()
    reminderDate()
  }else if (commentValue.search("Resolution 50% SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Resolution 50% SLO REMINDER TASK (NOT Stopping SLO Timer)"
    dateFill()
    reminderDate()
  }else if (commentValue.search("Resolution 90% SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Resolution 90% SLO REMINDER TASK (NOT Stopping SLO Timer)"
    dateFill()
    reminderDate()
  }else if (commentValue.search("Hot Fix 50% SLO") > -1 ){
    document.querySelector("select[name='tsk10']").value = "Troubleshooting"
    document.querySelector("input[name='tsk2']").value = ""
    document.querySelector("input[name='tsk5']").value = "Hot Fix 50% SLO"
    dateFill()
    reminderDate()
  }

}

const querystring = window.location.search;
const urlParams = new URLSearchParams(querystring);
if (urlParams.get('comment')) {
    const commentInput = document.querySelector("textarea[name='tsk6']")
    commentInput.value = urlParams.get('comment')
    commentValue = commentInput.value.replace(/"/gi, '')

    const assigned_toInput = document.querySelector("input[name='tsk1']")
    if (urlParams.get('assign_to')) {
        assigned_toInput.value = urlParams.get('assign_to')
    }

    fillAll()

    window.addEventListener('load', function() {
        document.querySelector("div[id='datePicker']").style.display = "none";
        document.querySelector("input[name='tsk1']").focus();
        const end = document.querySelector("input[name='tsk1']").value.length
        document.querySelector("input[name='tsk1']").setSelectionRange(end, end)
    }, false);
}


// handler to get the comment
document.querySelector("textarea[name='tsk6']").addEventListener("change", function(el) {
    commentValue = el.target.value.replace(/"/gi, '')
    fillAll()
})


