// ==UserScript==
// @name     Bandcamp Total Duration
// @version  5
// @description Displays total length of albums on bandcamp.com
// @grant    none
// @include https://*.bandcamp.com/*
// @include https://music.businesscasual.biz/album/*
// @include https://listen.20buckspin.com/album/*
// @namespace https://greasyfork.org/users/708837
// @downloadURL https://update.greasyfork.org/scripts/416888/Bandcamp%20Total%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/416888/Bandcamp%20Total%20Duration.meta.js
// ==/UserScript==

//this script will not run on custom bandcamp domains unless they are added to the above @include list

var allDurations, totalDuration, totalSeconds, totalMinutes, finalSeconds, finalMinutes, songLengthString;


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
totalHours = 0;
for (var i = 0; i < allDurations.snapshotLength; i++) {
    songLengthString = allDurations.snapshotItem(i).firstChild.data.trim()
    if (songLengthString !== "") {
        // There is an assumption here that if the string isn't empty it must fit the form "NN:NN", which is flawed.
		if (songLengthString.split(":").length < 3) { // checking for tracks over 1 hour long
			totalMinutes += Number(songLengthString.split(":")[0]);
			totalSeconds += Number(songLengthString.split(":")[1]);
		}
		else {
			totalHours += Number(songLengthString.split(":")[0]);
			totalMinutes += Number(songLengthString.split(":")[1]);
			totalSeconds += Number(songLengthString.split(":")[2]);
		}

    }
}


//convert to total time
finalSeconds = totalSeconds % 60
finalMinutes = (totalMinutes + Math.floor(totalSeconds / 60)) % 60;
finalHours = totalHours + Math.floor(totalMinutes / 60 + totalSeconds / 3600);

if (finalHours == 0) {
	totalDuration = finalMinutes.toString().padStart(2, 0) + ':' + finalSeconds.toString().padStart(2, 0);
}
else {
	totalDuration = finalHours.toString().padStart(2, 0) + ':' + finalMinutes.toString().padStart(2, 0) + ':' + finalSeconds.toString().padStart(2, 0);
}

//display length below tracklist
var trackTable = document.getElementsByClassName('track_list track_table');
if (trackTable.length) {
     var albumLengthSpan = document.createElement("span");
     albumLengthSpan.innerHTML = '<br><hr>Album Length: ' + totalDuration +'<br><hr>';
     trackTable[0].insertAdjacentElement('afterend', albumLengthSpan);
}

