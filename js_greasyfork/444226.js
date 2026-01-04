// ==UserScript==
// @name         Ics Viewer - ProtonMail
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Quickly see the .ics calendar file event information directly on your browser without having to download it or add it to any calendars!
// @author       hacker09
// @include      https://mail.proton.me/*
// @include      https://protonirockerxow.onion/*
// @icon         https://protonmail.com/images/favicon.ico
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444226/Ics%20Viewer%20-%20ProtonMail.user.js
// @updateURL https://update.greasyfork.org/scripts/444226/Ics%20Viewer%20-%20ProtonMail.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.arrive('div.file-preview-text', (async function() { //Create a new async arrive function
    if (document.querySelector("div.file-preview-text").innerText.match('BEGIN:VCALENDAR') !== null) //If the file preview is of an .ics file
    { //Starts the if condition
      var Emails = []; //Creates a new array
      var Attendees = []; //Creates a new array
      var Location = ''; //Creates a new blank variable
      var Organizer = document.querySelector("div.file-preview-text").innerText.match(/(?<=ORGANIZER;CN=)[^:]+/)[0]; //Saves the Organizer name
      var TimeZone = document.querySelector("div.file-preview-text").innerText.match(/DTEND;TZID=(.*):/)[1].trim(); //Saves the TimeZone
      var Dates = document.querySelector("div.file-preview-text").innerText.match(/DTEND;TZID=.*:([0-9]*)/)[1].match(/.{1,2}/g); //Saves the event dates
      var TimeEnd = document.querySelector("div.file-preview-text").innerText.match(/DTEND;TZID=.*T([0-9]*)/)[1].match(/.{1,2}/g); //Saves the event end time
      var TimeStart = document.querySelector("div.file-preview-text").innerText.match(/DTSTART;TZID=.*T([0-9]*)/)[1].match(/.{1,2}/g); //Saves the event start time

      if (document.querySelector("div.file-preview-text").innerText.match(/LOCATION;LANGUAGE=.*:(.*\))/) !== null) //If the Location exists
      { //Starts the if condition
        Location = '\n\nLocation: ' + document.querySelector("div.file-preview-text").innerText.match(/LOCATION;LANGUAGE=.*:(.*\))/)[1].replaceAll('\\', ''); //Saves the event location
      } //Finishes the if condition

      document.querySelector("div.file-preview-text").innerText.match(/(?<=RSVP=.*;CN=)[^:]+/g).forEach(el => Attendees.push(el.replaceAll(/\r|\n /g, ''))); //Add each attendee to an array
      document.querySelector("div.file-preview-text").innerText.match(/(?<=:mailto:)[^;\\@]+@[^;\\@\r\n]*/g).forEach(el => Emails.push(el.replaceAll(/\r|\n /g, ''))); //Add each attendee email to an array

      document.querySelector("div.file-preview-text").innerText = 'Organizer: ' + Organizer + ' (' + Emails[0] + ')\n\nStarts: (YYYY/MM/DD) ' + Dates[0] + Dates[1] + '/' + Dates[2] + '/' + Dates[3] + ' at ' + TimeStart[0] + ':' + TimeStart[1] + ':' + TimeStart[2] + ' (' + TimeZone + ')\n\nEnds: (YYYY/MM/DD) ' + Dates[0] + Dates[1] + '/' + Dates[2] + '/' + Dates[3] + ' at ' + +TimeEnd[0] + ':' + TimeEnd[1] + ':' + TimeEnd[2] + ' (' + TimeZone + ')' + Location; //Show Organizer, Times and Location informations

      Attendees.forEach(function(el, i) { //ForEach Attendee
        document.querySelector("div.file-preview-text").innerText += '\n\nAttendees: ' + el + ' (' + Emails[i + 1] + ')'; //Show the Attendees names and emails
      }); //Finishes the foreach loop

      if (document.querySelector("div.file-preview-text").innerText.match(/(?<=DESCRIPTION;LANGUAGE=[^:]*:)[^:]*(?=UID:)/) !== null) //If the Description exists
      { //Starts the if condition
        var Description = document.querySelector("div.file-preview-text").innerText.match(/(?<=DESCRIPTION;LANGUAGE=[^:]*:)[^:]*(?=UID:)/)[0].replaceAll(/[\\]{1,2}[rn]? ?|\r|\n ?/g, '').replaceAll(/  /g, ' '); //Saves the event Description
        document.querySelector("div.file-preview-text").innerText += '\n\nDescription: ' + Description; //Show the event description
      } //Finishes the if condition
    } //Finishes the if condition
  })); //Finishes the async function
})();