// ==UserScript==
// @name         Youtube Get Playlist Time
// @namespace    
// @version      1.0
// @description  Get Youtube Playlist Total Time
// @author       Ze
// @include      https://www.youtube.*/playlist*
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/15931/Youtube%20Get%20Playlist%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/15931/Youtube%20Get%20Playlist%20Time.meta.js
// ==/UserScript==
function getPlaylistTime() {
    "use strict";
    var spanTitles = Array.from(document.querySelectorAll('div.timestamp > span')),
        spanLength = 0,
        spanContent = "",
        i = 0,
        j = 0,
        k = 0,
        hoursArray = [],
        minutesArray = [],
        secondsArray = [],
        totalHours = 0,
        totalMinutes = 0,
        totalSeconds = 0,
        elementAppend = document.querySelector('h1.pl-header-title'),
        getTimeButton = document.createElement('button');
    for (i; i < spanTitles.length; i += 1) {
        spanLength = spanTitles[i].textContent.length;
        spanContent = spanTitles[i].textContent;
        if (spanLength === 5) {
            hoursArray.push(0);
            minutesArray.push(parseInt(spanContent.substring(0, 2), 10));
            secondsArray.push(parseInt(spanContent.substring(3, 5), 10));
        } else if (spanLength === 4) {
            hoursArray.push(0);
            minutesArray.push(parseInt(spanContent.substring(0, 1), 10));
            secondsArray.push(parseInt(spanContent.substring(2, 4), 10));
        } else if (spanLength === 7) {
            hoursArray.push(parseInt(spanContent.substring(0, 1), 10));
            minutesArray.push(parseInt(spanContent.substring(2, 4), 10));
            secondsArray.push(parseInt(spanContent.substring(5, 7), 10));
        } else if (spanLength === 8) {
            hoursArray.push(parseInt(spanContent.substring(0, 2), 10));
            minutesArray.push(parseInt(spanContent.substring(3, 5), 10));
            secondsArray.push(parseInt(spanContent.substring(6, 8), 10));
        }
    }
    for (j; j < spanTitles.length; j += 1) {
        totalHours += hoursArray[j];
        totalMinutes += minutesArray[j];
        totalSeconds += secondsArray[j];
    }
    function pad(str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }
    totalMinutes += parseInt((totalSeconds / 60), 10);
    totalHours += parseInt((totalMinutes / 60), 10);
    totalSeconds = pad((totalSeconds % 60), 2);
    totalMinutes = pad((totalMinutes % 60), 2);
    getTimeButton.textContent = totalHours + ":" + totalMinutes + ":" + totalSeconds;
    getTimeButton.style.fontSize = "22px";
    getTimeButton.style.color = "Red";
    elementAppend.appendChild(getTimeButton);
}
function loadAllVideos() {
    "use strict";
    if (document.querySelector('#pl-video-list > button') !== null) {
        document.querySelector('#pl-video-list > button').click();
        setTimeout(loadAllVideos, 2000);
    } else {
        setTimeout(getPlaylistTime, 100);
    }
}
loadAllVideos();