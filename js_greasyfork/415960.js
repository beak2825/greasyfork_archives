// ==UserScript==
// @name         reservation bot
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  kind regards
// @author       You
// @match        https://my.basic-fit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415960/reservation%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/415960/reservation%20bot.meta.js
// ==/UserScript==

// VARIABLES YOU CAN CHANGE:
var dayToLookFor = "2020-11-21";  //year month day
var startTime = "13:00"; // 00:00 minimum
var endTime = "13:15"; //23:59 max
var intervalInMinutes = 1;
var clubId = "ab5c20f0-72ab-45c5-ae4d-d34cd8962bf2";
var clubName = "Basic-Fit Almere Donjon 24/7";
var videoUrlSuccessMessage = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const friend = "";

var css = "background-color: orange; /* Green */ border: none; color: black; padding: 15px 32px; text - align: center; text - decoration: none; display: inline - block; font - size: 16px; ";
$('#contentSection').append('<input type="button" id="search" value="search for reservation" style="' + css +  '" />' );


class ApiCall {

  constructor(clubId, clubName, date) {
    this.headers = {
      "mbf-rct-app-api-2-caller": true,
    };
    this.clubId = clubId;
    this.clubName = clubName;
    this.dateTime = date;
    this.duration = "30";
  }

  setDate(date) {
    this.dateTime = new Date(date + 'Z');
  }

  getallReservations() {
    // sample {"doorPolicyId":"93820435-acc9-4d0c-a462-f8924e480501","startDateTime":"2020-11-12T23:45:00","openForReservation":true}
    this.logMessageGetAllReservations();
    return $.ajax({
      url: 'https://my.basic-fit.com/door-policy/get-availability',
      type: 'post',
      headers: this.headers,
      data: JSON.stringify({
        clubId: this.clubId,
        dateTime: this.dateTime
      }),
      contentType: 'application/json',
    });
  }

  bookReservation(doorPolicyId, startDateTime, friend) {
    this.logMessageBookReservation(doorPolicyId);

    return $.ajax({
      url: 'https://my.basic-fit.com/door-policy/book-door-policy',
      type: 'post',
      headers: this.headers,
      data: JSON.stringify({
        "doorPolicy": this.getDoorPolicy(doorPolicyId, startDateTime),
        "duration": this.duration,
        "clubOfChoice": this.getClubOfChoice(),
        "friend": friend,
      }),
      contentType: 'application/json',
    });
  }

  logMessageGetAllReservations() {
    console.log(`api call getting all possible spots for: ${this.dateTime}`);
  }
  logMessageBookReservation(doorPolicyId) {
    console.log(`api call booking Reservation`);
  }

  getClubOfChoice() {
    return {
      "id": this.clubId.toUpperCase(),
      "name": this.clubName,
      "bookable": true,
      "country": "Nederland"
    };
  }

  getDoorPolicy(doorPolicyId, startDateTime) {
    return {
      "doorPolicyId": doorPolicyId,
      "startDateTime": startDateTime,
      "openForReservation": true
    };
  }
}

class Interval {
  constructor(intervalMinutes) {
    this.interval = null;
    this.intervalMinutes = intervalMinutes;
  }

    //technical debt here as no way to have access to this from other class if function of class is send only
  start(classs) {
    if (classs !== null) {
        var minutesToSeconds = 1000 * 60 * this.intervalMinutes;
        this.interval = setInterval(()=> { classs.handle(); }, minutesToSeconds);
    }
  }

  end() {
    clearInterval(this.interval);
  }


}

class TimeHandler {
  startDateTimeBetweenTimes(startDateTime, dateOfTime, startTime, endTime) {
    var startDateTimeDate = new Date(startDateTime + 'Z');
    var startTimeDate = new Date(dateOfTime + 'T' + startTime + 'Z');
    var endTimeDate = new Date(dateOfTime + 'T' + endTime + 'Z');

    return startDateTimeDate >= startTimeDate && startDateTimeDate <= endTimeDate;
  }

  //dd:dd
  IsValidTime(time) {
    var isValidTime = time.match(/(\d{2}):(\d{2})/); // matches dd:dd where dd is a 2 digit number
    if (isValidTime === null) {
      return false;
    } else if (time.length !== 5) {
      return false;
    }
    return true;
  }

  isValidTime(time, time2) {
    return this.IsValidTime(time) || this.IsValidTime(time2);
  }
}

class PageReader {
  pageIsValidForSearch() {
    console.log('validating Search');
    if (this.OnLoginPage()) {
      console.log('login please');
      return false;
    } else {
        console.warn('Search validated');
        return true;
    }
  }

  OnReservedReservationPage() {
    return $(document).text().includes('Reservering annuleren');
  }

  OnLoginPage() {
    return $(document).text().includes('inloggen');
  }

}

class Main {
  constructor(dayToLookFor, startTime, endTime, intervalInMinutes, clubId, clubName, friend, videoUrlSuccessMessage){
      this.dayToLookFor = dayToLookFor;
      this.startTime = startTime;
      this.endTime = endTime;
      this.intervalInMinutes = intervalInMinutes;
      this.clubId = clubId;
      this.clubName = clubName;
      this.friend = friend;
      this.videoUrlSuccessMessage = videoUrlSuccessMessage;

      // classes
      this.apiCall = new ApiCall(this.clubId, this.clubName, this.dayToLookFor);
      this.interval = new Interval(this.intervalInMinutes);
      this.timeHandler = new TimeHandler();
      this.pageReader = new PageReader();
  }

  Main() {
    this.logCurrentDataUsed();
    this.searchForOpenReservation();
  }

  logCurrentDataUsed(){
    console.log(`current settings: \nday to look for: ${this.dayToLookFor} year-month-day \nstartTime: ${this.startTime}  \nendTime: ${this.endTime}  \nwe will search every : ${this.intervalInMinutes} minutes \nclubName: ${this.clubName} `);
  }

  searchForOpenReservation() {
    if (!this.pageReader.pageIsValidForSearch()) {

    } else if (!this.timeHandler.isValidTime(this.startTime, this.endTime)) {
      alert("time is incorrect, example of a valid time: 15:00");
    } else {
        this.tryToFindAnOpenReservation();
        this.interval.start(this);
    }

  }

    handle(){
        this.tryToFindAnOpenReservation();
    }

  tryToFindAnOpenReservation() {
      this.apiCall.getallReservations().then((response) => {
          console.log(response);

          var availableReservations = this.getAvailableReservations(response);

          if (availableReservations.length === 0) {
              console.log("No available reservations found");
              return;

          } else {
              this.bookReservation(availableReservations[0].doorPolicyId, availableReservations[0].startDateTime, this.friend);
          }
      });
  }

  bookReservation(doorPolicyId, startDateTime) {
    this.apiCall.bookReservation(doorPolicyId, startDateTime).then(() => {
      this.interval.end();
      this.announceSuccess(startDateTime);
    });
  }

  announceSuccess(startDateTime) {
    var startDateTimeDate = new Date(startDateTime);
    var time = startDateTimeDate.getHours() + ":" + startDateTimeDate.getMinutes();
    var message = `reservation for: ${time} congratulations!`;

    console.log(message);
    this.openVideo();
    alert(message);
  }

  openVideo() {
    window.open(videoUrlSuccessMessage, '_blank');
  }

  getAvailableReservations(reservations) {
      if(reservations === undefined){
          console.log("unknown error");
          this.interval.end();
          return null;
      }
    var openReservartions = reservations.filter((entry) => {
      if (!entry.openForReservation) {
        return null;
      } else {
        var match = this.timeHandler.startDateTimeBetweenTimes(entry.startDateTime, this.dayToLookFor, this.startTime, this.endTime);
        if (match) {
          return entry;
        }
      }

    });

    return openReservartions;
  }
}


window.addEventListener('load', function() {
    $( "#search" ).click(function() {
            new Main(dayToLookFor, startTime, endTime, intervalInMinutes, clubId, clubName, videoUrlSuccessMessage).Main();
    });

});