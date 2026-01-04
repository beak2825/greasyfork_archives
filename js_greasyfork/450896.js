// ==UserScript==
// @name         Time Management - Tesseract
// @namespace    https://k33k00.com/2022/09/07/tesseract-asolvi-quickly-adjust-the-fsr-times/
// @version      0.1
// @description  Quickly adjust time in 15 minute intervals within your service report. For Tesseract (Asolvi) Stock management system.
// @author       Kiearn Wynne
// @match        https://*.asolvi.io/ServiceCentre/SC_RepairJobFSR/aspx/RepairJobFSR_Add.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asolvi.io
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/450896/Time%20Management%20-%20Tesseract.user.js
// @updateURL https://update.greasyfork.org/scripts/450896/Time%20Management%20-%20Tesseract.meta.js
// ==/UserScript==
const startTimeContainerSelector = '#scmaster_cplMainContent_divFSRDetails > table > tbody > tr:nth-child(6) > td:nth-child(2) > div'
const startTimeInputID = 'scmaster_cplMainContent_txtFSRStartTime'


function createElem () {
    var btn = document.createElement('input')
    btn.id = "sub15"
    btn.value = "-15 Minutes"
    btn.addEventListener('click', sub15)
    btn.type = 'button'
    console.log('Created Element.')
    return btn
}

function sub15 () {
    console.log('Starting moment manipulation')
    let startTimeElem = document.getElementById(startTimeInputID)
    console.log('Found Element')
    let startTime = startTimeElem.value
    console.log(`current time value: ${startTime}`)
    let mTime = moment(startTime, 'hh:mm')
    console.log('Processed with moment js')
    let newTime = mTime.subtract(15, 'minutes')
    console.log('subtracted 15 minutes')
    startTimeElem.value = newTime.format('HH:mm')
    console.log('new time is now in place')
    console.log('Ending moment manipulation')
}

function placeNewButton(btn) {
    console.log('Placing Element')
    document.querySelector(startTimeContainerSelector).append(btn)
}

(function() {
    'use strict';
    let newElem = createElem()
    placeNewButton(newElem)
})();
