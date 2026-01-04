// ==UserScript==
// @name         Brick Hill Timezone modifier
// @version      1.1
// @description  Modify timezones on forums posts
// @author       Noah Cool Boy
// @match        https://www.brick-hill.com/*
// @namespace https://greasyfork.org/users/725966
// @downloadURL https://update.greasyfork.org/scripts/420354/Brick%20Hill%20Timezone%20modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/420354/Brick%20Hill%20Timezone%20modifier.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var HourFormat24 = document.cookie.includes("24hour=true") ? true : false
    var MMDDYYYYFormat = document.cookie.includes("mmddyy=false") ? false : true

    var joinedRegex = /Joined ([0123]\d)\/([01]\d)\/(20\d{2})/ // REGEX FUCK YEAH
    var postRegex = /([01]\d):([012345]\d) (AM|PM) ([0123]\d)\/([01]\d)\/(20\d{2})/ // MORE REGEX FUCK YEAH
    var feedRegex = /([0123]\d)\/([01]\d)\/(20\d{2}) ([01]\d):([012345]\d) (AM|PM)/ // WHAT?! MORE REGEX?! AAAAAAAAAAAAAAAAAAAA
    var commentRegex = /([0123]\d)\/([01]\d)\/(20\d{2}) (\d{1,2}):([012345]\d):[012345]\d (AM|PM)/ // They use an other date format for comments, brick-hill ftw??
    var transactionsRegex = /([0123]\d)-([01]\d)-(20\d{2})/
    var gameRegex = /(20\d{2})\/([01]\d)\/([0123]\d)/
    // Some people might find the above lines of code sorcelery, but I love regex


    // BAD CODE INCOMING!!
    function convertDateAndHour(day, month, year, hour, minutes, modifier) {
        var date = new Date()
        date.setUTCFullYear(year, month-1, day)
        var a = convertHour(hour,minutes,modifier)
        date.setUTCHours(a[0], a[1])
        if (MMDDYYYYFormat) {
            if (HourFormat24) {
                return `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")} ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
            }
            return `${convertToAMPM(date)} ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
        } else {

            if (HourFormat24) {
                return `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
            }
            return `${convertToAMPM(date)} ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        }
    }

    function convertDate(day,month,year) {
        if(MMDDYYYYFormat) {
            return month + "/" + day + "/" + year
        } else {
            return day + "/" + month + "/" + year
        }
    }

    function convertHour(hour, minutes, modifier) {
        hour = parseInt(hour)
        if (hour == 12) {
            hour = 0
        }
        if (modifier == "PM") {
            hour += 12
        }
        return [hour, minutes]
    }

    function convertToAMPM(date){
        if(date.getHours() < 12) {
            return (date.getHours() % 12 || 12).toString().padStart(2,"0") + ":" + date.getMinutes().toString().padStart(2,"0") + " AM"
        } else {
            return (date.getHours() % 12 || 12).toString().padStart(2,"0") + ":" + date.getMinutes().toString().padStart(2,"0") + " PM"
        }
    }
    // Loop? What's that?
    setInterval(()=>{
        var elements = document.body.querySelectorAll("*")
        elements.forEach(element => {
            if (!element.innerHTML.includes("<") && element.innerHTML != "" && !element.tzmfconverted) { //TimeZone ModiFier CONVERTED
                var m = ""
                element.tzmfconverted = true
                if (m = element.innerHTML.match(joinedRegex)) {
                    element.innerHTML = "Joined " + convertDate(m[1],m[2],m[3])
                } else if (m = element.innerHTML.match(postRegex)) {
                    element.innerHTML = convertDateAndHour(m[4],m[5],m[6],m[1],m[2],m[3])
                } else if (m = element.innerHTML.match(feedRegex)) {
                    element.innerHTML = convertDateAndHour(m[1],m[2],m[3],m[4],m[5],m[6])
                } else if (m = element.innerHTML.match(transactionsRegex)) {
                    element.innerHTML = convertDate(m[1],m[2],m[3])
                } else if(m = element.innerHTML.match(commentRegex)) {
                    element.innerHTML = convertDateAndHour(m[1],m[2],m[3],parseInt(m[4])+(new Date().getTimezoneOffset()/60),m[5],m[6])
                    // SOMEHOW jefemy the web developer managed to mess it up even more and make the comment time automatically adapted to your timezone. Thanks for the pain jefemy
                } else if(m = element.innerHTML.match(gameRegex)) {
                    element.innerHTML = convertDate(m[3],m[2],m[1])
                }
            }
        })
    },500)


    if(document.location.href.includes("settings")) {
        setTimeout(()=>{ // Settings need to load, wacky solution
            let settings = document.querySelector(".content")
            settings.appendChild(document.createElement("hr"))
            let title = document.createElement("span")
            title.className = "dark-gray-text bold block"
            title.style.paddingBottom = "5px"
            title.innerText = "Timezone Modifier Settings"
            settings.appendChild(title)
            let hour24 = document.createElement("div")
            hour24.className = "block"
            hour24.style.display = "flex"
            hour24.style.alignItems = "center"
            hour24.innerHTML = `<span style="margin-right: 5px">24 hour mode:</span><input type="checkbox" style="width: unset; margin: 0px" onclick='document.cookie = "24hour="+this.checked+"; path=/"' id="hour24">` // Ah yes, 100% width checkbox. Thanks jefemy
            settings.appendChild(hour24)
            document.getElementById("hour24").checked = document.cookie.includes("24hour=true") ? true : false
            let mmddyy = document.createElement("div")
            mmddyy.className = "block"
            mmddyy.style.display = "flex"
            mmddyy.style.alignItems = "center"
            mmddyy.innerHTML = `<span style="margin-right: 5px">MMDDYY format:</span><input type="checkbox" style="width: unset; margin: 0px" onclick='document.cookie = "mmddyy="+this.checked+"; path=/"' id="mmddyy">`
            settings.appendChild(mmddyy)
            document.getElementById("mmddyy").checked = document.cookie.includes("mmddyy=false") ? false : true
        },1500)
    }
})();