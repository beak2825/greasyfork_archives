// ==UserScript==
// @name         ShowTheRightTimes
// @namespace    Helper
// @version      0.4
// @author       CzPeet
// @match        https://www.munzee.com/*
// @description  Show the right Hungarian times on Munzee pages
// @downloadURL https://update.greasyfork.org/scripts/378523/ShowTheRightTimes.user.js
// @updateURL https://update.greasyfork.org/scripts/378523/ShowTheRightTimes.meta.js
// ==/UserScript==
var cap = document.querySelectorAll(".captured-at");
var dep = document.querySelectorAll(".deployed-at");
var wrt = document.querySelectorAll(".wrote-at");
var exp = document.querySelectorAll(".expires-at");
var d = "";
var i = 0;
for (i=0; i < cap.length; i++)
{
    d = new Date(cap[i].title);
    cap[i].title = Diff(d, "fogták meg", true);
    cap[i].innerHTML = d.toLocaleString("hu-HU");
}
for (i=0; i < dep.length; i++)
{
    d = new Date(dep[i].title);
    dep[i].title = Diff(d, "telepítették", true);
    dep[i].innerHTML = d.toLocaleString("hu-HU");
}
for (i=0; i < wrt.length; i++)
{
    d = new Date(wrt[i].title);
    wrt[i].title = Diff(d, "írták", true);
    wrt[i].innerHTML = d.toLocaleString("hu-HU");
}
for (i=0; i < exp.length; i++)
{
    d = new Date(exp[i].title);
    exp[i].title = Diff(d, "van még hátra", false);
    exp[i].innerHTML = d.toLocaleString("hu-HU");
}

function Diff( d, comm, needDay )
{
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = d.getTime();
  var date2_ms = Date.now();

  // Calculate the difference in milliseconds
  var difference_ms = (date2_ms > date1_ms) ? date2_ms - date1_ms : date1_ms - date2_ms;
  //take out milliseconds
  difference_ms = difference_ms/1000;
  var seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60;
  var minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60;
  var hours = Math.floor(difference_ms % 24);
  var days = (needDay) ? Math.floor(difference_ms/24) : 0;

  return (needDay) ? (days + " napja " + hours + " órája " + minutes + " perce és " + seconds + " másodperce " + comm) : (hours + " óra " + minutes + " perc és " + seconds + " másodperc " + comm);
}