// ==UserScript==
// @name        RARBG torrent links to TVMaze
// @description Adds RARBG torrent links for every episode to various sections of TVMaze
// @namespace   NotNeo
// @include     http*://*tvmaze.com/calendar*
// @include     http*://*tvmaze.com/shows*/episodes
// @include     http*://*tvmaze.com/watch/show*
// @include     http*://*tvmaze.com/watchlist*
// @version     2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29705/RARBG%20torrent%20links%20to%20TVMaze.user.js
// @updateURL https://update.greasyfork.org/scripts/29705/RARBG%20torrent%20links%20to%20TVMaze.meta.js
// ==/UserScript==

var URL = window.location.href;

if ( URL.indexOf("tvmaze.com/calendar") >= 0 ) { //do the following if we are in the calendar section
  var selected = document.querySelectorAll("span.show"); //get all episode divs
  for(var i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
    var showNameTemp = selected[i].innerHTML; //Getting showname
    showNameTemp = showNameTemp.split('">')[1]; //removing HTML content off of showname
    var showName = showNameTemp.split("</")[0]; //removing HTML content off of showname

    var epNumTemp = selected[i].nextElementSibling.textContent; //Getting the episode number
    var epNumTemp1 = epNumTemp.split("x")[0]; //changing the episode number format to: s01e01
    if (epNumTemp1.length < 2) { epNumTemp1 = "0" + epNumTemp1; } //adding prefix 0 if needed
    var epNumTemp2 = epNumTemp.split("x")[1]; //changing the episode number format to: s01e01
    var epNum = "S" + epNumTemp1 + "E" + epNumTemp2; //changing the episode number format to: s01e01
    //append torrent button
    selected[i].parentNode.innerHTML += " <span> <a class='dllink' href='https://rarbg.to/torrents.php?search=" + showName + "+" + epNum + "'> <img alt='RARBG DL Link' src='https://dyncdn.me/static/20/img/16x16/download.png'> </a> </span>"
  }
} else if ( URL.indexOf("tvmaze.com/shows") >= 0 && URL.indexOf("/episodes") >= 0 ) { //do the following if we are in the show: episodes section
  var showNameTemp = document.querySelectorAll("h1")[0].textContent; //Getting showname
  var showName = showNameTemp.split(" - ")[0]; //cutting useless text off the showname
  var selected = document.querySelectorAll("[data-key]"); //get all episode divs
  for(var i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
    var epNum = selected[i].firstChild.textContent; //Getting the episode number
    if (epNum.length < 2) { epNum = "0" + epNum; } //adding prefix 0 if needed
    var seaNum = selected[i].parentNode.parentNode.parentNode.previousElementSibling.getAttribute("name"); //Getting season number
    var seaEpNum = seaNum + "E" + epNum; //Putting season number and episode number together 
    //append torrent button
    selected[i].firstChild.nextElementSibling.nextElementSibling.innerHTML += " <span style='float: right'> <a class='dllink' href='https://rarbg.to/torrents.php?search=" + showName + "+" + seaEpNum + "'> <img alt='RARBG DL Link' src='https://dyncdn.me/static/20/img/16x16/download.png'> </a> </span>"
  }
} else if ( URL.indexOf("tvmaze.com/watch/show") >= 0 ) { //do the following if we are in the Watchlist: full show view
  var showNameTemp = document.querySelectorAll("h1")[0].textContent; //Getting showname
  var showName = showNameTemp.split(" - ")[0]; //cutting useless text off the showname
  var selected = document.querySelectorAll("[data-key]"); //get all episode divs
  for(var i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
    var epNumTemp = selected[i].firstChild.textContent; //Getting the episode number
    var epNumTemp = epNumTemp.split(":")[0]; //changing the episode number format to: s01e01
    var epNumTemp1 = epNumTemp.split("x")[0]; //changing the episode number format to: s01e01
    if (epNumTemp1.length < 2) { epNumTemp1 = "0" + epNumTemp1; } //adding prefix 0 if needed
    var epNumTemp2 = epNumTemp.split("x")[1]; //changing the episode number format to: s01e01
    var epNum = "S" + epNumTemp1 + "E" + epNumTemp2; //changing the episode number format to: s01e01
    //append torrent button
    selected[i].firstChild.innerHTML += " <span style='float: right'> <a class='dllink' href='https://rarbg.to/torrents.php?search=" + showName + "+" + epNum + "'> <img alt='RARBG DL Link' src='https://dyncdn.me/static/20/img/16x16/download.png'> </a> </span>"
  }
} else if ( URL.indexOf("tvmaze.com/watchlist") >= 0 ) { //do the following if we are in the Watchlist
  var selected = document.querySelectorAll("[data-key]"); //get all episode divs
  for(var i = 0; i < selected.length; i++) { //Loop through the nodes and do the following to all targets
    var showName = selected[i].parentNode.parentNode.parentNode.parentNode.previousElementSibling.firstChild.textContent; //Getting the show name
    var epNumTemp = selected[i].firstChild.textContent; //Getting the episode number
    var epNumTemp = epNumTemp.split(":")[0]; //changing the episode number format to: s01e01
    var epNumTemp1 = epNumTemp.split("x")[0]; //changing the episode number format to: s01e01
    if (epNumTemp1.length < 2) { epNumTemp1 = "0" + epNumTemp1; } //adding prefix 0 if needed
    var epNumTemp2 = epNumTemp.split("x")[1]; //changing the episode number format to: s01e01
    var epNum = "S" + epNumTemp1 + "E" + epNumTemp2; //changing the episode number format to: s01e01
    //append torrent button
    selected[i].firstChild.innerHTML += " <span style='float: right'> <a class='dllink' href='https://rarbg.to/torrents.php?search=" + showName + "+" + epNum + "'> <img alt='RARBG DL Link' src='https://dyncdn.me/static/20/img/16x16/download.png'> </a> </span>"
  }
} 