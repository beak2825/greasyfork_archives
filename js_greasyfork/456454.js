// ==UserScript==
// @name         Twitch VOD see remaining playback duration
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  A userscript that allows the user to see the remaining playback duration for a VOD on Twitch.
// @author       Milchi
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456454/Twitch%20VOD%20see%20remaining%20playback%20duration.user.js
// @updateURL https://update.greasyfork.org/scripts/456454/Twitch%20VOD%20see%20remaining%20playback%20duration.meta.js
// ==/UserScript==

function secondsToTimeString(seconds, playbackspeed) {
  // Divide the total number of seconds by the playback speed
  seconds = seconds / playbackspeed;

  // Calculate the number of hours by dividing the total number of seconds by 3600 (the number of seconds in an hour)
  const hours = Math.floor(seconds / 3600);

  // Calculate the number of minutes by dividing the remaining number of seconds by 60 (the number of seconds in a minute)
  const minutes = Math.floor((seconds % 3600) / 60);

  // The remaining number of seconds is the remainder of the total number of seconds divided by 60
  const secs = seconds % 60;

  // Return the time string in the format "HH:MM:SS" by padding the hours, minutes, and seconds with leading zeros if they are less than 10
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${Math.floor(secs).toString().padStart(2, '0')}`;
}




// Set an interval to run the code inside the function every 1000 milliseconds (1 second)
setInterval(() => {
  // Get the playback speed from the "video" element on the page
  const playbackspeed = document.querySelector("video").playbackRate;

  // Get the total duration of the "video" element in seconds
  const seconds = document.querySelector("video").duration;

  // Get the current time of the "video" element in seconds
  const currentSeconds = document.querySelector("video").currentTime;

  // Calculate the remaining time by subtracting the current time from the total duration
  const remainingTime = seconds - currentSeconds;

  // Get the element thats shows the duration of the video and displays the remaining time and total duration in the format "HH:MM:SS"
  document.getElementsByClassName("Layout-sc-1xcs6mc-0 iULZCz vod-seekbar-time-labels")[0].lastElementChild.innerText = secondsToTimeString(remainingTime,playbackspeed).split('.').shift() + " / " + secondsToTimeString(seconds,1).split('.').shift();
}, 1000);
