// ==UserScript==
// @name         HoloDex - Add to Google Calendar2
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  Adds a button to add upcoming hololive streams on Holodex to Google Calendar
// @author       You
// @match        https://holodex.net/home
// @match        https://holodex.net/
// @icon         https://www.google.com/s2/favicons?domain=jetri.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425183/HoloDex%20-%20Add%20to%20Google%20Calendar2.user.js
// @updateURL https://update.greasyfork.org/scripts/425183/HoloDex%20-%20Add%20to%20Google%20Calendar2.meta.js
// ==/UserScript==
function wait_for_bar(){

var vods = document.querySelectorAll("div.container.py-0.container--fluid:nth-last-child(1) > div.row > div")


var links = []
var defined = []
for (let word of vods) {

if (word.getElementsByClassName("text-upcoming")[0] !== undefined) {
var title = word.getElementsByClassName("video-card-title ")[0].innerHTML
var rawtime = word.getElementsByClassName("text-upcoming")[0].innerHTML
//console.log(title)
//console.log(rawtime)



var lasttime = rawtime.match(/\(([^)]+)\)/)[1]
var now = new Date()

function getNextDayOfWeek(date, dayOfWeek) {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)
if (dayOfWeek == 'Sun') {
    var dayofWeek2 = '0'
}
if (dayOfWeek == 'Mon') {
    var dayofWeek2 = '1'
}
if (dayOfWeek == 'Tue') {
    var dayofWeek2 = '2'
}
if (dayOfWeek == 'Wed') {
    var dayofWeek2 = '3'
}
if (dayOfWeek == 'Thu') {
    var dayofWeek2 = '4'
}
if (dayOfWeek == 'Fri') {
    var dayofWeek2 = '5'
}
if (dayOfWeek == 'Sat') {
    var dayofWeek2 = '6'
}


    var resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + (7 + dayofWeek2 - date.getDay()) % 7);

    return resultDate;
}

if (rawtime.startsWith(" Starts") == true) {
    if (/^\d/.test(lasttime) == true) {
        var predate1 = new Date(now.toLocaleDateString() + " " +lasttime)
        var predate2 = new Date(now.toLocaleDateString() + " " +lasttime)
        predate2 = predate2.setHours(predate2.getHours() + 1)
        var date1 = predate1.toISOString()
        var date2 = new Date(predate2).toISOString()
    } else {

         var dayWeek = lasttime.replace(/ .*/,'')
         var predate2 = new Date(getNextDayOfWeek(now, dayWeek)  )
         var justtime = lasttime.substr(lasttime.indexOf(" ") + 1)
         var predate22 = new Date(predate2.toLocaleDateString() + " " +justtime)
         predate22 = new Date(predate22.setHours(predate22.getHours() + 1))
         var predate1 = new Date(getNextDayOfWeek(now, dayWeek))
         var predate11 = new Date(predate1.toLocaleDateString() + " " +justtime)
         var date1 = predate11.toISOString()
         var date2 = predate22.toISOString()
      }
} else {
    //console.log("Doesn't have \"Start\"")
    var noParen = rawtime.replace(/[()]/g, '')
    var predate1 = new Date(noParen)
    var predate2 = new Date(Date.parse(noParen) + 1000*60*60)
    var date1 = predate1.toISOString()
    var date2 = predate2.toISOString()


}

date1 = date1.replace(/:/g,'').replace(/-/g,'').replace(/\./g,'')
date2 = date2.replace(/:/g,'').replace(/-/g,'').replace(/\./g,'')
var url1 = "https://www.google.com/calendar/render?action=TEMPLATE&text="
var url2 = "&dates="
var space = "/"
title = encodeURIComponent(title)

var final = url1.concat(title,url2,date1,space,date2)
links.push(final)


defined.push(word)
}
}


for (var i = 0; i < defined.length; i++) {
if (defined[i].querySelectorAll("button").length == 2) {
defined[i].style.display = 'inline'
    this["marker"+i] = defined[i].appendChild(document.createElement("button"));
this["marker"+i].innerHTML = "Add to Calendar"
}
}

var createClickHandler = function(arg) {
  return function() { window.open(arg); };
}

for (var e = 0; e < defined.length; e++) {
this["marker"+e].onclick = createClickHandler(links[e])
}



}
var interval1 = setInterval(wait_for_bar, 1000)