// ==UserScript==
// @name         Shortest/Longest PTW Franchise
// @namespace    Shortest/LongestFranchise
// @version      0.0.0.1
// @description  The script shows what's the shortest/longest anime franchise on you Plan To Watch List, and suggests a random anime on your Plan To Read List.
// @author       hacker09
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @icon         https://www.google.com/s2/favicons?domain=myanimelist.net
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434708/ShortestLongest%20PTW%20Franchise.user.js
// @updateURL https://update.greasyfork.org/scripts/434708/ShortestLongest%20PTW%20Franchise.meta.js
// ==/UserScript==
//  https://greasyfork.org/en/scripts/29231-myanimelist-watch-next/code
//  https://greasyfork.org/en/scripts/396023-mal-public-score-in-animelist/code
(function() {
  'use strict';
  var TotalHrMins = []; //Creates a new blank array
  var animeidResult = []; //Creates a new blank array
  var AllAnimesDuration = []; //Creates a new blank array
  var AllChiakiAnimeTitles = []; //Creates a new blank array
  var TotalEpsResult = []; //Creates a new blank array
  var type, AnimeTitleElement, Totalanimeid, totalanimestwo, json, ChiakiAnimeTitle, ShortestChiakiAnimeTitle; //Creates global variables
  var nextpagenum = 0; //Create a variable to hold the page number
  var increaseby = 300; //Create a variable to Increase the list page number
  var TotalCompletedEntries = 0; //Create a variable to hold the Total Completed Entries Number
  var username = window.location.pathname.split('/')[2]; //Get the username on the url to use later

  window.location.pathname.split('/')[1] === 'animelist' ? (type = 'anime') : (type = 'manga'); //Check If the user on an animelist or not and create a variable to identify that
  document.querySelector("#advanced-options-button") === null ? AnimeTitleElement = document.querySelectorAll("a.animetitle") : AnimeTitleElement = document.querySelectorAll('td.data.title a.link.sort'); //Checks if the Filters button on the modern list style doesn't exist,if not then the user is using an old classic list style

  async function ProcessList() //Creates a function to Process the List
  { //Starts the function

    while (true) { //Starts the while condition to get the Total Number of Entries on the user completed list
      console.log('This user has more than 300 Completed Entries\nGetting the Total Completed Entries Number...'); //Shows a message in the console for dev purposes
      json = await (await fetch('https://myanimelist.net/' + type + 'list/' + username + '/load.json?status=3&offset=' + nextpagenum)).json(); //Fetches the user completed list
      nextpagenum += increaseby; //Increase the next page number
      for (var i = 0; i < json.length; i++) { //Starts the for condition
        Totalanimeid = json[i].anime_url.split('/')[2]; //Creates a variable to hold the anime ids
        animeidResult.push(Totalanimeid); //Add The animeid To The Array
      }
      if (json.length !== 300) //If the next page has less than 300 completed entries stop looping the whlie condition
      { //Starts the if condition
        console.log('Finished Getting the Total Completed Entries Number!'); //Shows a message in the console for dev purposes
        return; //Return whether or not the fetched page has less than 300 completed entries
      } //Finishes the if condition
    } //Finishes the while condition

    for (var i = 0; i < json.length; i++) { //Starts the for condition
      Totalanimeid = json[i].anime_url.split('/')[2]; //Creates a variable to hold the anime ids
      animeidResult.push(Totalanimeid); //Add The animeid To The Array
    }
  }; //Finishes the async function

  async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async function Process() {
    if (type === 'anime') {
      await ProcessList()
      for (const animeid of animeidResult) {
        async function ProcessListFranchisesDuration() //Creates a function to Process the List Franchises Duration
        { //Starts the function
          var TotalHrMins = []; //Creates a new blank array
          const response = await fetch('https://api.allorigins.win/raw?url=https://chiaki.site/?/tools/watch_order/id/' + animeid); //Fetch
          const html = await response.text(); //Gets the fetch response
          const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response


          ChiakiAnimeTitle = newDocument.querySelector("h2").innerText.split(' Watch Order')[0].trim(); //Get the anime title on the h2 element (with symbols) and remove the Watch Order text, also removes the first and last whitespaces if existent
          if (ChiakiAnimeTitle.match('Watch Order') !== null) //If the h2 element on chiaki.site doesn't have the anime title
          { //Starts the if condition
            Array.from(newDocument.querySelectorAll("span.wo_title")).forEach(link => AllChiakiAnimeTitles.push(link.innerText)); //Add all anime titles of the anime franchise to the array AllChiakiAnimeTitles
            ShortestChiakiAnimeTitle = AllChiakiAnimeTitles.reduce((a, b) => a.length <= b.length ? a : b); //Add the Shortest Chiaki Anime Title with symbols to a variable
            ChiakiAnimeTitle = ShortestChiakiAnimeTitle; //Replace the variable ChiakiAnimeTitle contents with the variable ShortestChiakiAnimeTitle
          } //Finishes the if condition

          var TextElement = newDocument.querySelectorAll("span.uk-text-muted.uk-text-small"); //Creates a variable to loop though the elements after

          for (var i = 0; i < TextElement.length; i++) { //Starts the for condition
            await sleep(1000);
            var TotalRawDurationHasSecs = TextElement[i].textContent.split("× ")[1].match('sec'); //Creates a variable to check later if there's an entry that has secs
            var TotalRawDuration = TextElement[i].textContent.split("× ")[1].split(' |')[0].match(/\d+|\?/g); //Creates a variable to hold the total unprocessed times
            var TotalEpisodes = TextElement[i].textContent.split("× ")[0].split(' |')[2].match(/\d+|\?/g); //Creates a variable to hold the total episodes
            TotalEpsResult.push(TotalEpisodes); //Add The Eps To The Array
            if (TotalRawDuration.length !== 1 && TotalRawDurationHasSecs === null) //If has Hrs and Mins and not secs
            { //Starts the if condition
              var ExtractHrs = TotalRawDuration[0] * 60; //Extract Hrs And Convert To Mins
              var TotalHrs = TotalEpisodes * ExtractHrs; //Multiply Eps By Hrs
              var TotalMins = TotalEpisodes * TotalRawDuration[1]; //Multiply Extracted Eps By Mins
              TotalHrMins.push(TotalHrs, TotalMins); //Add Hrs And Mins To The Array
            } //Finishes the if condition
            else if (TotalRawDurationHasSecs === null) //Extract only Mins and not secs
            { //Starts the else condition
              var TotalMins = TotalEpisodes * TotalRawDuration[0]; //Multiply Extracted Eps By Mins
              TotalHrMins.push(TotalMins); //Add Mins To The Array
            } //Finishes the else condition
          } //Finishes the for condition

          var TotalMinsResult = TotalHrMins.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum Hrs in Mins + Total Mins
          //The Commands Below Converts The Total Franchise Time To Precise Hours And Minutes
          var days = Math.floor(TotalMinsResult / 1440);
          var hours = Math.floor((TotalMinsResult % 1440) / 60);
          var minutes = (TotalMinsResult % 1440) % 60;
          AllAnimesDuration.push(ChiakiAnimeTitle + ' Total Duration: ' + days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)  ' + animeid + '<br>'); //Add Mins To The Array
          TotalHrMins = []
        } //Finishes the async function
        ProcessListFranchisesDuration();
      } //Finishes the for condition

    } //Finishes the if condition
  } //Finishes the async function
  Process()
  document.querySelector("body").innerHTML = AllAnimesDuration
  document.querySelector("head").remove()

  var points = [40, 100, 1, 5, 25, 10];
  points.sort((a, b) => a - b);
})();