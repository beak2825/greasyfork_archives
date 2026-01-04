// ==UserScript==
// @name     Bandcamp Total Duration
// @version  1
// @description Displays total length of albums on bandcamp.com
// @grant    none
// @include https://*.bandcamp.com/album/*
// @include https://music.businesscasual.biz/album/*
// @include https://listen.20buckspin.com/album/*
// @namespace https://greasyfork.org/users/708837
// @downloadURL https://update.greasyfork.org/scripts/416759/Bandcamp%20Total%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/416759/Bandcamp%20Total%20Duration.meta.js
// ==/UserScript==

//this script will not run on custom bandcamp domains unless they are added to the above @include list

var allDurations, totalDuration, totalSeconds, totalMinutes, description, releaseDate;


//find all instances of song lengths
allDurations = document.evaluate(
    "//span[@class='time secondaryText']",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);


//parse the times and add them
totalSeconds = 0;
totalMinutes = 0;
for (var i = 0; i < allDurations.snapshotLength; i++) {
    totalMinutes += Number(allDurations.snapshotItem(i).firstChild.data.trim().split(":")[0]);
    totalSeconds += Number(allDurations.snapshotItem(i).firstChild.data.trim().split(":")[1]);
}


//convert to total time
finalSeconds = totalSeconds % 60
finalMinutes = totalMinutes + Math.floor(totalSeconds / 60);
totalDuration = finalMinutes + ':' + finalSeconds;
//console.log('Total Duration: ' + totalDuration);


//add as first line in description box
description = document.getElementsByClassName('tralbumData tralbum-about');
if (description.length) {
    description[0].innerText = 'Length: ' + totalDuration + '\n\n' + description[0].innerText;
}

//if no description box exists, add as line above release date
else {
    releaseDate = document.getElementsByClassName('tralbumData tralbum-credits');
    console.log(releaseDate[0].innerText);
    if (releaseDate.length) {
        releaseDate[0].innerText = 'Length: ' + totalDuration + '\n\n' + releaseDate[0].innerText
    }
}