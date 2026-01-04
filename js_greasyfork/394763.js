// ==UserScript==
// @name         book my show
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  play music when tickets are available
// @author       preetam
// @match        https://in.bookmyshow.com/buytickets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394763/book%20my%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/394763/book%20my%20show.meta.js
// ==/UserScript==

//date = simply the day,
//interval = number of min b/w each check (in sec, default = 5min),
//theatres = names of the theatre (should be exact and the numbers can be anything.)
//date and interval are required fields, theatres is optional and can be left empty so that sound will be played even if one theatre is present for that movie.
var date = 24, interval = 5*60;
var theatres = {};
theatres['INOX: Prozone Mall: Coimbatore'] = 1;
theatres['SPI: The Cinema Brookefields Mall: Coimbatore'] = 2;
var audioLink = 'https://gaana.com/song/chumma-kizhi';
window.onload = readDocument;

(function() {
    'use strict';
    // Your code here...
})();


function readDocument() {
    var x = document.getElementsByClassName("date-container");
    var today = new Date();
    console.log("checked on:" +
                today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
    var curDate = today.getDate();
    if (curDate > date) {
        window.alert("Sorry to break this to you but we cant go back in time\n. Your ship has already sailed");
        return;
    }
    var dateSearchString = "<div>"+date+"<br>";
    if (x[0].innerHTML.search(dateSearchString)!=-1) {
        console.log("found date " + date);
        aVN_details.forEach(searchForTheatre);
    } else {
        var pos = -1;
        if (curDate == date)
            pos = x[0].innerHTML.search("TODAY");
        else if (curDate == date-1)
            pos = x[0].innerHTML.search("TOM");
        if (pos != -1) {
            console.log("we found either today or tomorrow, checking for theatre");
            aVN_details.forEach(searchForTheatre);
        } else {
            console.log("Either bookings for your movie is't open yet or this movie is not gonna be there till then.");
            stateChange(-1);
        }
    }
}

function playSound() {
    var audio = new Audio(audioLink);
    audio.play();
}
function searchForTheatre(item) {
    console.log("is this what we want? " + item.VenueName);
    if (theatres.hasOwnProperty(item.VenueName) || Object.keys(theatres).length === 0) {
        console.log("we found it! " + item.VenueName);
        playSound();
    } else {
        stateChange(-1);
    }
}

function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            location.reload(true);
        }
    }, 1000 * interval);
}