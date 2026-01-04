// ==UserScript==
// @name         YouTube premieres and livestream - Add To Google Calendar
// @namespace    https://discord.bio/p/jamsandwich47
// @version      1.3
// @description  Add YouTube premieres/livestreams to Google Calendar!
// @author       Kur0
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426805/YouTube%20premieres%20and%20livestream%20-%20Add%20To%20Google%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/426805/YouTube%20premieres%20and%20livestream%20-%20Add%20To%20Google%20Calendar.meta.js
// ==/UserScript==

function elemExists(selector) {
 return document.querySelector(selector) !== null
}

function wait_for_bar() {
    var barSelector = "#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar"
    if (elemExists(barSelector)) {
       // if (document.querySelectorAll(`${barSelector} > button`).length == 0) {
         if (elemExists(`${barSelector} > button`)) {
             var CalenBut = document.querySelectorAll(`${barSelector} > button`)

        } else {
            var CalenBut = document.querySelector(barSelector).appendChild(document.createElement("button"))
            CalenBut.innerHTML = 'Add To Calendar'
        }
    } else {
        return
    }

    var titleSelector = "#container > h1 > yt-formatted-string"
    if (elemExists(titleSelector)) {
        var title = document.querySelector(titleSelector).innerHTML
    } else {
        return
    }

    var urlParams = new URLSearchParams(window.location.search);
    var entries = urlParams.entries();
    var vidUrl = ""
    for (var entry of entries) {
        if (entry[0] == "v") {
            vidUrl = entry[1]
        }
    }
    if (vidUrl == "") {
        return
    }

    var createClickHandler = function () {
        return function () {
            fetch(`https://yt-stream-start-giver.cantilfrederick.workers.dev/${vidUrl}`).then(a => a.text())
                .then(time => {
                    var edate2 = new Date(Date.parse(time) + 1000 * 60 * 60)
                    var now = new Date()
                    edate2.setFullYear(now.getFullYear())
                    if (now > edate2) {
                        edate2.setFullYear(now.getFullYear() + 1)
                    }
                    var edate1 = new Date(time)
                    edate1.setFullYear(now.getFullYear())
                    if (now > edate1) {
                        edate1.setFullYear(now.getFullYear() + 1)
                    }
                    var date = edate1.toISOString()
                    var date2 = edate2.toISOString()
                    var url1 = "https://www.google.com/calendar/render?action=TEMPLATE&text="
                    var url2 = "&dates="
                    var space = "/"
                    date = date.replace(/:/g, '').replace(/-/g, '').replace(/\./g, '')
                    date2 = date2.replace(/:/g, '').replace(/-/g, '').replace(/\./g, '')
                    title = encodeURIComponent(title)
                    var final = url1.concat(title, url2, date, space, date2)
                    window.open(final);

                    const http = new XMLHttpRequest()
                    http.open("GET", "http://127.0.0.1:5000/schedulething?url=" + window.location.href.substring(0, 43) + "&time=" + edate1.toString().split(" ").slice(0, -4).join(" "))
                    http.send()

                })
        };
    }

    if (CalenBut !== undefined) {
        CalenBut.onclick = createClickHandler()
    }
}

window.addEventListener('load', function() {
    var interval1 = setInterval(wait_for_bar, 1000)
}, false);

