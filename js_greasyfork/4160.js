// ==UserScript==
// @name       rym Total Track Times
// @version    2.75
// @description  Calculates total track time for releases on rateyourmusic.com
// @match      http://rateyourmusic.com/release/*
// @match      https://rateyourmusic.com/release/*
// @namespace  https://greasyfork.org/users/4419
// @downloadURL https://update.greasyfork.org/scripts/4160/rym%20Total%20Track%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/4160/rym%20Total%20Track%20Times.meta.js
// ==/UserScript==

// restrict pull to one set of tracklistings; in this case those for the desktop site
var desktop_tracklist = document.getElementById('tracks');
var tracksecs = 0;

var durations = desktop_tracklist.getElementsByClassName("tracklist_duration");

// loop the tracks and add up the seconds.
for(j=0;j<durations.length; j++) {
    tracksecs += parseInt(durations[j].getAttribute("data-inseconds"));
    }        

if(tracksecs !== 0) {
    
    var trackmins = 0;
    var trackhours = 0;
    var trackmins = 0;
    var timeString = ":";
    
    // calculate the hours:min:seconds for the release
    
    trackmins += Math.floor((tracksecs / 60));
    tracksecs = (tracksecs % 60);
    trackhours = Math.floor((trackmins / 60));
    trackmins -= (trackhours * 60);
    
    if (tracksecs < 10) { tracksecs = "0" + tracksecs; }
    if (trackmins < 10 && trackhours > 0) { trackmins = "0" + trackmins; }

    if(trackhours === 0) {
        timeString = trackmins + ":" + tracksecs;
    } else {
        timeString = trackhours + ":" + trackmins + ":" + tracksecs;
    }   
    
    // Create fragment which holds total release time
    var new_row = document.createDocumentFragment();
    
    var row = document.createElement("li");
    row.className = "track";
    
    var rowdiv = document.createElement("div");
    rowdiv.className = "tracklist_line";
    row.appendChild(rowdiv);
    
    var spacer = document.createElement("span");
    spacer.className = "tracklist_num";
    rowdiv.appendChild(spacer);
    
    var header = document.createElement("span");
    header.className = "tracklist_title";
    
    var innerText = document.createTextNode("Please Uninstall:");
    header.appendChild(innerText);
    
    var times = document.createElement("span");
    times.className = "tracklist_duration";
    timeString = "rym Total Track Times extension is obsolete!";
    innerText = document.createTextNode(timeString);
    times.appendChild(innerText);
    header.appendChild(times);
    rowdiv.appendChild(header);
   
    new_row.appendChild(row);
    
    // clone fragment
    var new_row2 = new_row.cloneNode(true);
    
    // add it to the mobile tracklist
    var tracks_m = document.getElementById('tracks_mobile');
    tracks_m.appendChild(new_row2);
    
    // add it to the normal tracklist
    var tracks = document.getElementById('tracks');
    tracks.appendChild(new_row);
    
}