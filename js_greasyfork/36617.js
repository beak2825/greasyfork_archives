// ==UserScript==
// @name    Spotify & Amplituner Power Auto
// @version 1.0.4
// @description Script that turns power ON/OFF in my amplituner (with autohotkey http server) automatically with spotify play/pause. For this script browser has to allow mixed content (https spotify vs http autohotkey server)
// @match https://open.spotify.com/*
// @author verona (lukchojnicki)
// @namespace https://greasyfork.org/users/164173
// @downloadURL https://update.greasyfork.org/scripts/36617/Spotify%20%20Amplituner%20Power%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/36617/Spotify%20%20Amplituner%20Power%20Auto.meta.js
// ==/UserScript==


var prevState = 1; // 1 = play, 0 = pause

setInterval(function () {
    if (!document.getElementsByClassName('connect-bar').length) { // playing on this device
		if (document.getElementsByClassName('spoticon-pause-16').length) { // now playing
			if (prevState === 0) {
				console.log('turn ON AMP power');
                ampPower(1);
			}
            prevState = 1;
		} else if (document.getElementsByClassName('spoticon-play-16').length) { // paused
            if (prevState === 1) {
                console.log('turn OFF AMP power');
                ampPower(0);
            }
            prevState = 0;
		}
	}
}, 1000);

function ampPower(status)
{
    var xhttp = new XMLHttpRequest();
    if (status) {
        xhttp.open('GET', 'http://localhost:8000/ampon', true);
    } else{
        xhttp.open('GET', 'http://localhost:8000/ampoff', true);
    }
    xhttp.send();
}