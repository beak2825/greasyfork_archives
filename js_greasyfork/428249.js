// ==UserScript==
// @name         YouTube premieres and livestream - Add To Google Calendar (w/ localhost stuff)
// @namespace    https://discord.bio/p/jamsandwich47
// @version      1.2
// @description  Add YouTube premieres/livestreams to Google Calendar!
// @author       Kur0
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/428249/YouTube%20premieres%20and%20livestream%20-%20Add%20To%20Google%20Calendar%20%28w%20localhost%20stuff%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428249/YouTube%20premieres%20and%20livestream%20-%20Add%20To%20Google%20Calendar%20%28w%20localhost%20stuff%29.meta.js
// ==/UserScript==



function wait_for_bar(){

if (document.querySelector("#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar") !== null) {
if (document.querySelectorAll("#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar > button").length == 0) {
var CalenBut = document.querySelector("#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar").appendChild(document.createElement("button"))
CalenBut.innerHTML = 'Add To Calendar'
} else {
var CalenBut = document.querySelectorAll("#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar > button")
}

}
if (document.querySelector("#container > h1 > yt-formatted-string > span") == null) {
var title = document.querySelector("#container > h1 > yt-formatted-string").innerHTML
} else {
var title = document.querySelector("#container > h1 > yt-formatted-string > span").innerHTML
}
if (document.querySelector("#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar > span.ytp-offline-slate-messages > div.ytp-offline-slate-subtitle-text") !== null) {
var time = document.querySelector("#movie_player > div.ytp-offline-slate.ytp-offline-slate-collapsed > div.ytp-offline-slate-bar > span.ytp-offline-slate-messages > div.ytp-offline-slate-subtitle-text").innerHTML
}

time = time.replace("at ","")
var edate2 = new Date(Date.parse(time) + 1000*60*60)
var now = new Date()
edate2.setFullYear(now.getFullYear())
if (now > edate2) {
edate2.setFullYear(now.getFullYear()+1)
}
var edate1 = new Date(time)
edate1.setFullYear(now.getFullYear())
if (now > edate1) {
edate1.setFullYear(now.getFullYear()+1)
}
var date = edate1.toISOString()
var date2 = edate2.toISOString()
var url1 = "https://www.google.com/calendar/render?action=TEMPLATE&text="
var url2 = "&dates="
var space = "/"
date = date.replace(/:/g,'').replace(/-/g,'').replace(/\./g,'')
date2 = date2.replace(/:/g,'').replace(/-/g,'').replace(/\./g,'')
title = encodeURIComponent(title)
var final = url1.concat(title,url2,date,space,date2)

    var createClickHandler = function(arg) {
  return function() { window.open(arg);
                    const http = new XMLHttpRequest()
      http.open("GET", "http://127.0.0.1:5000/schedulething?url="+window.location.href.substring(0,43)+"&time="+edate1.toString().split(" ").slice(0, -4).join(" "))
      http.send()
                    };
}


if (CalenBut !== undefined) {
CalenBut.onclick = createClickHandler(final)
}

}
var interval1 = setInterval(wait_for_bar, 1000)