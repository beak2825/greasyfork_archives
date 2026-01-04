// ==UserScript==
// @name         Redacted Preview
// @namespace    http://benzy.org/
// @version      0.1
// @description  Preview songs on Redacted
// @author       John Bednarczyk
// @match        https://redacted.ch/torrents*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/382974/Redacted%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/382974/Redacted%20Preview.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // API KEY
    var apiKey = "YOUR_API_HERE"; // Enter your youtube API here keeping the quotation marks

    // URL to add video link to
    var youtubeURL = "https://www.youtube.com/watch?v=";

    // Get list of all songs
    var song = $("span").filter( function() {
        return ($(this).text().indexOf('(') > -1);
    }); // anywhere match

    // Change the text for every song, also assigns class to each song
    for(var i = 0 ; i < song.length ; i++){
        song[i].setAttribute("class","song");
        song[i].setAttribute("id","song"+i);

        // Create Button
        var button = document.createElement('button');
        button.setAttribute("class","play");

        // Set Style
        button.style.background='LightBlue';
        button.style.borderRadius = "3px";
        button.style.padding = "3px 3px 3px 3px";

        button.innerHTML = "Play";

        // Add Spacing
        song[i].appendChild(document.createTextNode(" "));

        // Add link to end of song
        song[i].appendChild(button);
    }

    // Detect button click
    $('button.play').click(function() {

        // Get Artist/songTitle
        var artist = document.getElementsByTagName("h2")[0].firstChild.text;
        var songTitle = this.previousSibling.parentElement.previousSibling.textContent;

        window.open(youtubeURL + getLink(artist, songTitle));
    });

    // Function to get a VideoID
    function getLink(artist, song){

        // Setup url for api
        var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' +
            encodeURIComponent(artist) + "-" +
            encodeURIComponent(song) + '&maxResults=1&fields=items(id(videoId))&key=' + apiKey;

        // call api and get videoId
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", url, false);
        xhReq.send(null);
        var id = JSON.parse(xhReq.responseText);

        return id.items[0].id.videoId;
    }
})();