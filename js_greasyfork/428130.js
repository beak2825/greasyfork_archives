// ==UserScript==
// @name         Holotools - Add to Google Calendar (w/ localhost stuff)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to add upcoming hololive streams to Google Calendar
// @author       You
// @match        https://hololive.jetri.co/
// @icon         https://www.google.com/s2/favicons?domain=jetri.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428130/Holotools%20-%20Add%20to%20Google%20Calendar%20%28w%20localhost%20stuff%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428130/Holotools%20-%20Add%20to%20Google%20Calendar%20%28w%20localhost%20stuff%29.meta.js
// ==/UserScript==
function wait_for_bar(){
if (document.querySelectorAll("body > div > main > div.md-app-scroller.md-layout-column.md-flex.md-theme-holodark.md-scrollbar > div > div > div:nth-child(3) > div") !== null) {
var vods = document.querySelectorAll("body > div > main > div.md-app-scroller.md-layout-column.md-flex.md-theme-holodark.md-scrollbar > div > div > div:nth-child(3) > div")

var links = []
var timelist = []
var urllist = []

for (let word of vods) {
  var title = word.getElementsByClassName("video-title")[0].innerHTML;
    var time = word.getElementsByClassName("video-start")[0].innerHTML
    var url = word.querySelector("a").href

//var tzone = new Date().toString().split(' ').slice(5).join(' ');
//time = time + " " + tzone
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
/*console.log(final)*/
links.push(final)
timelist.push(edate1.toString().split(" ").slice(0, -4).join(" "))
urllist.push(url)
}
if (document.querySelectorAll("body > div > main > div.md-app-scroller.md-layout-column.md-flex.md-theme-holodark.md-scrollbar > div > div > div:nth-child(3) > div > button").length == 0) {
for (var i = 0; i < vods.length; i++) {
vods[i].style.textAlign = 'center'

this["marker"+i] = vods[i].appendChild(document.createElement("button"));
this["marker"+i].innerHTML = "Add to Calendar"
this["marker"+i].style.position = 'relative'
this["marker"+i].style.bottom = '14px'
}
}

var createClickHandler = function(arg,num) {

  return function() {
      window.open(arg);
      console.log(timelist[num])
      console.log(urllist[num])
      const http = new XMLHttpRequest()
      http.open("GET", "http://127.0.0.1:5000/schedulething?url="+urllist[num]+"&time="+timelist[num])
      http.send()
  };
}

for (var e = 0; e < vods.length; e++) {
this["marker"+e].onclick = createClickHandler(links[e],e)
}

}
}
var interval1 = setInterval(wait_for_bar, 1000)