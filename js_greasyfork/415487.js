// ==UserScript==
// @name         Precise Time Converter on Google
// @namespace    PreciseTimeConverterGoogle
// @version      21
// @description  See the precise time conversion results on Google when searching for Hours to Days, Minutes to Hours, Minutes to Milliseconds, or X Hours/Minutes From Now.
// @author       hacker09
// @include      *://www.google.*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=64
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/415487/Precise%20Time%20Converter%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/415487/Precise%20Time%20Converter%20on%20Google.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector("#ssSucf") !== null) //If the user searched for something that Google returned the conversion boxes
  { //Starts the if condition
    if (document.querySelector("#ssSucf").value.match('Min') != null) //If the conversion box value is equal Minute
    { //Starts the if condition
      var Input = document.querySelector("#HG5Seb > input").defaultValue; //Get the Minute number value
    } //Finishes the if condition

    if (document.querySelector("#ssSucf").value.match('Ho') != null) //If the conversion box value is equal Hour
    { //Starts the if condition
      Input = document.querySelector("input.vXQmIe.gsrt").defaultValue * 60; //Get the Hour number value
    } //Finishes the if condition

    if ((document.querySelector("#ssSucf").value.match('Ho') != null && document.querySelector("#NotFQb > select").value.match(/Day|Dia/) != null) || (document.querySelector("#ssSucf").value.match('Min') != null && document.querySelector("#NotFQb > select").value.match('Ho') != null) || (document.querySelector("#ssSucf").value.match('Min') != null && document.querySelector("#NotFQb > select").value.match('Mil') != null)) //If the conversion box value is equal Hour, Minute or Day
    { //Starts the if condition
      var Value; //Create a new global variable
      var days = Math.floor(Input / 1440); //Sum the total precise amount of days
      var hours = Math.floor((Input % 1440) / 60); //Sum the total precise amount of hours
      var minutes = (Input % 1440) % 60; //Sum the total precise amount of minutes

      (document.querySelector("#ssSucf").value.match('Min') != null && document.querySelector("#NotFQb > select").value.match('Mil') != null) ? Value = Input * 60000: Value = days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)'; //If the conversion is from Minutes to Milliseconds do the first math, otherwise do the second math
      document.querySelector("#NotFQb > input").style.width = '370px'; //Expand the converted results box
      document.querySelector("#NotFQb > input").defaultValue = Value; //Display the converted results
    } //Finishes the if condition
  } //Finishes the if condition

  if (document.querySelector("#APjFqb").value.match(/ hr\. (\d+) min\.? from now|hours? from now|hrs? from now|minutes? from now|mins? from now/i) !== null) //If the search box contains the text hours/mins from now
  { //Starts the if condition

    //Start the function to correctly format the date and time from now
    function formatDateTime(date) { //Starts the function
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hh = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      var dd = "AM";
      var h = hh;

      if (h >= 12) {
        h = hh - 12;
        dd = "PM";
      }
      if (h == 0) {
        h = 12;
      }

      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      h = h < 10 ? "0" + h : h;

      var display = month + "/" + day + "/" + year + " " + h + ":" + m;
      display += ":" + s;
      display += " " + dd;

      return display;
    } //Finishes the function

    var DaysFromNow = 0; //The total precise amount of days
    var HoursFromNow = 0; //The total precise amount of hours
    var MinutesFromNow = 0; //The total precise amount of minutes
    var SecondsFromNow = 0; //Creates a new variable
    var date = new Date(); //Creates a new date

    if (document.querySelector("#APjFqb").value.match(/hours? from now|hrs? from now/i) !== null) //If the search box contains the text hours from now
    { //Starts the if condition
      HoursFromNow = document.querySelector("#APjFqb").value.match(/\d+/)[0]; //Get the written number of hours from now that the user wrote
    } //Finishes the if condition

    if (document.querySelector("#APjFqb").value.match(/minutes? from now|mins? from now/i) !== null) //If the search box contains the text mins from now
    { //Starts the if condition
      MinutesFromNow = document.querySelector("#APjFqb").value.match(/\d+/)[0]; //Get the written number of Minutes from now that the user wrote
    } //Finishes the if condition

    if (document.querySelector("#APjFqb").value.match(/ hr\. (\d+) min\.?|and \d+ minutes? from now|and \d+ mins? from now/i) !== null) //If the search box contains the text "and minutes/mins from now" or contains " hr. min "
    { //Starts the if condition
      HoursFromNow = document.querySelector("#APjFqb").value.match(/\d+/)[0]; //Get the written number of hours from now that the user wrote
      MinutesFromNow = document.querySelector("#APjFqb").value.match(/(?:a?n?d?h?r?\.? (\d+))/)[1]; //Get the written number of Minutes from now that the user wrote
    } //Finishes the if condition

    var secondsToAdd = DaysFromNow * 60 * 60 * 24 + HoursFromNow * 60 * 60 + MinutesFromNow * 60 + SecondsFromNow; //Convert the actual days,hours and minutes to seconds
    date.setSeconds(date.getSeconds() + secondsToAdd);
    document.querySelector("#APjFqb").value = document.querySelector("#APjFqb").value + ' = ' + formatDateTime(date); //Display a message showing the days, hours, and mins from now
  } //Finishes the if condition
})();