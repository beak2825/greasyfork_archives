// ==UserScript==
// @name        Youtube playlist length
// @namespace   made by sabbir
// @match       https://www.youtube.com/playlist*
// @grant       none
// @version     1.0
// @author      shasabbir234@gmail.com
// @description 9/22/2023, 1:07:22 PM
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/475879/Youtube%20playlist%20length.user.js
// @updateURL https://update.greasyfork.org/scripts/475879/Youtube%20playlist%20length.meta.js
// ==/UserScript==
function secondsToTime(seconds) {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  if (days > 0) {
    return `${days} d ${(hours>9)?hours:"0"+hours}:${(minutes>9)?minutes:"0"+minutes}:${(seconds>9)?seconds:"0"+seconds}`;
  } else if (hours > 0) {
    return `${(hours>9)?hours:"0"+hours}:${(minutes>9)?minutes:"0"+minutes}:${(seconds>9)?seconds:"0"+seconds}`;
  } else if (minutes > 0) {
    return `${(minutes>9)?minutes:"0"+minutes}:${(seconds>9)?seconds:"0"+seconds}`;
  } else {
    return `${(seconds>9)?seconds:"0"+seconds}`;
  }
}

function timeToSeconds(timeString) {
  const timeParts = timeString.split(':');
  const numParts = timeParts.length;

  if (numParts === 3) {
    // Format is "h:m:s"
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = parseInt(timeParts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  } else if (numParts === 2) {
    // Format is "m:s"
    const minutes = parseInt(timeParts[0]);
    const seconds = parseInt(timeParts[1]);
    return minutes * 60 + seconds;
  } else if (numParts === 1) {
    // Format is "s"
    return parseInt(timeString);
  } else {
    // Invalid format
    return NaN;
  }
}

var show=()=>{
var list=document.querySelectorAll("ytd-thumbnail-overlay-time-status-renderer > div > span");
var no=list.length;
var ss=0;
list.forEach((i)=>{
    ss+=timeToSeconds(i.innerText);
});
var ss25=ss*.8;
var ss5=ss*.666;
var ss75=ss*.5666;
var ss2=ss*.5;
alert("No Of Videos: "+no+"\nTotal Length: "+secondsToTime(ss)+"\nAverage Length: "+secondsToTime(parseInt(ss/no))+"\nAt x1.25: "+secondsToTime(parseInt(ss25))+"\nAt x1.50: "+secondsToTime(parseInt(ss5))+"\nAt x1.75: "+secondsToTime(parseInt(ss75))+"\nAt x2.00: "+secondsToTime(parseInt(ss2)));
}
addEventListener("keydown", function(ev, ele) {

    if ( /*ev.ctrlKey &&*/ ev.shiftKey && ev.altKey && ev.keyCode === 80) { //p
      console.log('list');
        show();

    }
  console.log(ev.keyCode);
  }, true);