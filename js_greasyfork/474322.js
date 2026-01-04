// ==UserScript==
// @name         HKUST Class Auto Enroller
// @namespace    https://hkust.edu.hk/
// @version      1.0
// @description  A script that automatically help you enroll in the classes selected in your shopping cart at a specific moment (usually when your enrollment period begins). Note that this script is not developed by HKUST official, and the users should be responsible of any consequences by using this script.
// @author       Waver Velvet
// @match        https://sisprod.psft.ust.hk/*
// @icon         https://hkust.edu.hk/favicon.ico
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474322/HKUST%20Class%20Auto%20Enroller.user.js
// @updateURL https://update.greasyfork.org/scripts/474322/HKUST%20Class%20Auto%20Enroller.meta.js
// ==/UserScript==

// IDLE, WAITING_ENROLLING, WAITING_FINISH_ENROLLING
let phase = "IDLE"

function kickup() {
    if (phase !== "IDLE") {
        window.alert("The script is already running! ")
        return;
    }
    if (!hasEnrollButton()) {
        window.alert("The page is not at 'Shopping Cart'! ")
        return;
    }

    let timeJson = JSON.parse(GM_getValue("time", "null"))
    if (!timeJson) {
        window.alert("The time you plan to enroll the selected classes in the shopping cart hasn't been set or it is invalid! ")
        return;
    }
    const time = new Date(timeJson)
    if (time.getTime() - Date.now() < 0) {
        window.alert("The time you plan to enroll the selected classes in the shopping cart is prior to the current time. ")
        return;
    }

    GM_deleteValue("time")
    phase = "WAITING_ENROLLING"
    window.alert("Waiting for the enrollment period to begin... ")
    setTimeout(() => {
        phase = "WAITING_FINISH_ENROLLING"
        observeDOM()
        clickEnrollButton()
    }, time.getTime() - Date.now())
}

function callback(records, observer) {
    switch (phase) {
        case "IDLE":
        case "WAITING_ENROLLING":
            break;
        case "WAITING_FINISH_ENROLLING":
            if (hasFinishEnrollingButton()) {
                clickFinishEnrollingButton()
                phase = "IDLE"
                observer.disconnect()
            }
            break;
    }
}

function observeDOM() {
    const observer = new MutationObserver(callback)
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true })
}

function getElement(id) {
    let el = document.getElementById(id)
    if (el) return el

    const iframe = document.getElementById("ptifrmtgtframe")
    if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document
        return innerDoc.getElementById(id)
    } else {
        return null
    }
}

function hasEnrollButton() {
    const enrollButtonEl = getElement("DERIVED_REGFRM1_LINK_ADD_ENRL")
    return (!!enrollButtonEl) && (enrollButtonEl.textContent === "Enroll")
}

function clickEnrollButton() {
    const enrollButtonEl = getElement("DERIVED_REGFRM1_LINK_ADD_ENRL")
    enrollButtonEl.click()
}

function hasFinishEnrollingButton() {
    const enrollButtonEl = getElement("DERIVED_REGFRM1_SSR_PB_SUBMIT")
    return (!!enrollButtonEl) && (enrollButtonEl.textContent === "Finish Enrolling")
}

function clickFinishEnrollingButton() {
    const enrollButtonEl = getElement("DERIVED_REGFRM1_SSR_PB_SUBMIT")
    enrollButtonEl.click()
}

function promptTime() {
    do {
        const timeString = window.prompt("Please enter the time you plan to enroll the selected classes in the shopping cart. For example, if you want the classes to be enrolled at 14:30, enter '14:30:00'. \nNote that dates other than today is not supported.")
        const time = new Date(`1970-01-01T${timeString}+08:00`)
        const date = new Date()
        date.setHours(time.getHours())
        date.setMinutes(time.getMinutes())
        date.setSeconds(time.getSeconds())
        if (window.confirm(`Please confirm that your selected classes in the shopping cart will be enrolled at ${date.toString()}.`)) {
            return date
        }
    } while (true)
}

(function () {
    'use strict';
    GM_registerMenuCommand("Enter Time", function (event) {
        const time = promptTime()
        GM_setValue("time", JSON.stringify(time))
        console.log(time)
    });
    GM_registerMenuCommand("Launch", function (event) {
        kickup()
    });
})();