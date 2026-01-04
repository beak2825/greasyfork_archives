// ==UserScript==
// @name         Time Zone Converter(时区转换)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Display current time and convert to different time zones with customizable time differences.
// @author       xiaolaji
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469557/Time%20Zone%20Converter%28%E6%97%B6%E5%8C%BA%E8%BD%AC%E6%8D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469557/Time%20Zone%20Converter%28%E6%97%B6%E5%8C%BA%E8%BD%AC%E6%8D%A2%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to get the current time
  function getCurrentTime() {
    return new Date();
  }

  // Function to convert time to a different time zone
  function convertToTimeZone(time, hoursDifference) {
    var newTime = new Date(time.getTime() + (hoursDifference * 60 * 60 * 1000));
    return newTime;
  }

  // Function to display the time on the webpage
  function displayTime() {
    var currentTime = getCurrentTime();
    var timeZones = JSON.parse(localStorage.getItem('timeZones')) || [];
    var timeString = '';
    timeString += '<div style="position: fixed; bottom: 10px; right: 10px; padding: 10px; background-color: #333; color: #fff; font-family: Arial, sans-serif; font-size: 24px;">';
    timeString += '<div style="cursor: pointer;" onclick="document.getElementById(\'timeZones\').style.display = (document.getElementById(\'timeZones\').style.display === \'none\') ? \'block\' : \'none\'">&#x25BC; All Time Zones</div>';
    timeString += '<div id="timeZones">';
    timeString += '<div>Current Time: ' + currentTime.toLocaleString() + '</div>';
    for (var i = 0; i < timeZones.length; i++) {
      var timeZone = timeZones[i].timeZone;
      var hoursDifference = timeZones[i].hoursDifference;
      var timeZoneTime = convertToTimeZone(currentTime, hoursDifference);
      timeString += '<div>' + timeZone + ': ' + timeZoneTime.toLocaleString() + '</div>';
    }
    timeString += '</div>';
    timeString += '</div>';
    document.body.insertAdjacentHTML('beforeend', timeString);
  }

  // Function to add a new time zone
  function addTimeZone() {
    var timeZone = prompt('Enter the time zone:');
    var hoursDifference = parseInt(prompt('Enter the time difference in hours:'));

    if (timeZone && !isNaN(hoursDifference)) {
      var timeZones = JSON.parse(localStorage.getItem('timeZones')) || [];
      timeZones.push({ timeZone: timeZone, hoursDifference: hoursDifference });
      localStorage.setItem('timeZones', JSON.stringify(timeZones));
window.location.reload()
    }
  }

  // Function to display the time in all added time zones
  function displayAllTimeZones() {
    var timeZones = JSON.parse(localStorage.getItem('timeZones')) || [];
    var timeZonesElement = document.getElementById('time-zones');
    if (!timeZonesElement) {
      timeZonesElement = document.createElement('div');
      timeZonesElement.id = 'time-zones';
      timeZonesElement.style.position = 'fixed';
      timeZonesElement.style.top = '10px';
      timeZonesElement.style.right = '10px';
      timeZonesElement.style.padding = '10px';
      timeZonesElement.style.backgroundColor = '#333';
      timeZonesElement.style.color = '#fff';
      timeZonesElement.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(timeZonesElement);
    }
    var html = '';
    for (var i = 0; i < timeZones.length; i++) {
      var timeZone = timeZones[i].timeZone;
      var hoursDifference = timeZones[i].hoursDifference;
      var convertedTime = convertToTimeZone(getCurrentTime(), hoursDifference);
      html += '<div>' + timeZone + ': ' + convertedTime.toLocaleString() + '</div>';
    }
    timeZonesElement.innerHTML = html;
  }

  // Call the displayTime function to start displaying the current time
  displayTime();
   document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.altKey && event.code === 'KeyQ') {
      addTimeZone();
    }
  });

  // Call the displayAllTimeZones function to start displaying the times in all added time zones
//   displayAllTimeZones();

  // Add event listener to the add-time-zone button
  var addTimeZoneButton = document.getElementById('add-time-zone');
  if (addTimeZoneButton) {
    addTimeZoneButton.addEventListener('click', addTimeZone);
  }
})();


