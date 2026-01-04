// ==UserScript==
// @name         MagnetALL timer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  This script adds a timer to your MagnetALL tickets to help with time tracking
// @author       abbelot
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/issues/*
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      KIO
// @downloadURL https://update.greasyfork.org/scripts/468043/MagnetALL%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/468043/MagnetALL%20timer.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var sim_timer_data
    //if no data stored yet, create dummy json to fill locale storage with an object
    if (localStorage.getItem("sim_timer_data") == null) {
        var dummy_object = '{"dummy":"dummy"}'
        localStorage.setItem("sim_timer_data", dummy_object)
        sim_timer_data = JSON.parse(localStorage.getItem("sim_timer_data"))

    }
    else {
        sim_timer_data = JSON.parse(localStorage.getItem("sim_timer_data"))
    }





    var running = 1

    console.log("timer run")

    var button = document.createElement("button")
    button.innerHTML = "minutes spent: 0"
    button.setAttribute("style","padding: 8px; background-color: #FFA500; font-weight: bold;")
    button.setAttribute("class","magnet-timer")
    button.onclick = function() {timer_switch()}

    var reset_timer_button = document.createElement("button")
    reset_timer_button.innerHTML = "reset"
    reset_timer_button.setAttribute("style","padding: 8px; background-color: #99e599; font-weight: bold;")
    reset_timer_button.setAttribute("class","reset-timer")
    reset_timer_button.onclick = function() {timer_reset()}

    var override_button = document.createElement("button")
    override_button.innerHTML = "override"
    override_button.setAttribute("style","padding: 8px; background-color: #aa98a9; font-weight: bold;")
    override_button.setAttribute("class","override-timer")
    override_button.onclick = function() {timer_override()}

    const timer_text = "time spent: "

    var startTime = new Date().getTime()
    var pauseTime = new Date().getTime()
    var previousTime = new Date().getTime()
    var hoursSinceStartTime = 0
    var minutesSinceStartTime = 0
    var secondsSinceStartTime = 0

    var hoursDisplay = "00"
    var minutesDisplay = "00"
    var secondsDisplay = "00"
    var timeDisplay = "00:00:00"

    var ticketID = ""
    var lastTicketID = ""

    function updateTimer() {
        if (sim_timer_data) {
            if (sim_timer_data[ticketID] != null) {
                console.log("updatetimer")
                previousTime = Number(sim_timer_data[ticketID])
                startTime = new Date(new Date() - new Date(previousTime))
            }
            else {
            startTime = new Date().getTime()
            }
        }
    }
    //get ticketID

    setInterval(function() {
        lastTicketID = ticketID
        ticketID = document.querySelector("ul.breadcrumb.breadcrumb-inline > li > span > a").innerText
        if (lastTicketID != ticketID) {
            updateTimer()
        }

    },1000)

    setInterval(function() {
        hoursSinceStartTime = new Date(new Date() - new Date(startTime)).getHours() - 1
        minutesSinceStartTime = new Date(new Date() - new Date(startTime)).getMinutes()
        secondsSinceStartTime = new Date(new Date() - new Date(startTime)).getSeconds()

        hoursDisplay = hoursSinceStartTime.toString().padStart(2,"0")
        minutesDisplay = minutesSinceStartTime.toString().padStart(2,"0")
        secondsDisplay = secondsSinceStartTime.toString().padStart(2,"0")

        timeDisplay = hoursDisplay + ":" + minutesDisplay + ":" + secondsDisplay
        //   console.log(timeDisplay)
        if (running == 1) {
            document.querySelector(".magnet-timer").innerHTML = timer_text + timeDisplay
        }
        var hoursMili = hoursSinceStartTime * 3600000
        var minutesMili = minutesSinceStartTime * 60000
        var secondsMili = secondsSinceStartTime * 1000
        var timeMili = hoursMili + minutesMili + secondsMili

        //set time in data so it can be retrieved
        sim_timer_data[ticketID] = timeMili
        localStorage.setItem("sim_timer_data", JSON.stringify(sim_timer_data))
    },1000)

    function timer_switch() {
        if (running == 1) {
            running = 0
            pauseTime = new Date().getTime()
            document.querySelector(".magnet-timer").setAttribute("style","padding: 10px; background-color: #DC143C; font-weight: bold;")
        }
        else {
            running = 1
            startTime = startTime - (pauseTime - new Date().getTime())
            document.querySelector(".magnet-timer").setAttribute("style","padding: 10px; background-color: #FFA500; font-weight: bold;")
        }

    }




    //resets the timer
    function timer_reset() {
        startTime = new Date().getTime()

    }

    //overrides the timer with custom values
    function timer_override() {
        let override_value = prompt("Enter an override value for the timer", hoursDisplay + ":" + minutesDisplay + ":" + secondsDisplay)
        if (override_value != null || override_value != "") {
            var override_array = override_value.split(":")
            //set the values in miliseconds to convert into date timestamp
            var override_hours = Number(override_array[0]) * 3600000
            var override_minutes = Number(override_array[1]) * 60000
            var override_seconds = Number(override_array[2]) * 1000
            var override_time = override_hours + override_minutes + override_seconds
            console.log(new Date(new Date() - new Date(override_time)))
            startTime = new Date(new Date() - new Date(override_time))
        }
    }

    //runs at every change in the document and appends all buttons after and until the details bar has appeared
    const observer = new MutationObserver(function() {
        if (document.querySelector(".document-details-bar")) {
            document.querySelector(".document-details-bar").appendChild(button)
            document.querySelector(".document-details-bar").appendChild(reset_timer_button)
            document.querySelector(".document-details-bar").appendChild(override_button)
            observer.disconnect()
        }

    })

    const target = document.querySelector("body")
    const config = { childList: true }
    observer.observe(target, config)

})();