// ==UserScript==
// @name         Total Duration Time + Total Episodes Of Any Animes Franchises
// @namespace    DurationByFranchise
// @version      47
// @description  This is a tool to easily and quickly see how long it will take for you to finish watching the whole anime Franchise, and you can also see how many episodes and entries the Franchise has.
// @author       hacker09
// @match        https://chiaki.site/?/
// @match        https://chiaki.site/?/auth
// @match        https://myanimelist.net/dialog/authorization
// @match        https://chiaki.site/?/tools/watch_order/id/*
// @match        https://chiaki.site/?/tools/watch_order/group_id/*
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)\/[\d]+(\/.*)?/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @require      https://greasyfork.org/scripts/446666-jquery-core-minified/code/jQuery%20Core%20minified.js
// @run-at       document-end
// @connect      chiaki.site
// @grant        GM.xmlHttpRequest
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/414627/Total%20Duration%20Time%20%2B%20Total%20Episodes%20Of%20Any%20Animes%20Franchises.user.js
// @updateURL https://update.greasyfork.org/scripts/414627/Total%20Duration%20Time%20%2B%20Total%20Episodes%20Of%20Any%20Animes%20Franchises.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  const SecondsFromNow = 0; //Creates a new const
  var TotalHrMins = []; //Creates a new blank array
  var TotalEpsResult = []; //Creates a new blank array
  var TotalEpisodesTypeTV = ['0']; //Creates a new array
  var TotalEpisodesTypeOVA = ['0']; //Creates a new array
  var TotalEpisodesTypeONA = ['0']; //Creates a new array
  var TotalCompletedMins = []; //Creates a new blank array
  var TotalEpisodesTypeMusic = ['0']; //Creates a new array
  var TotalEpisodesTypeMovie = ['0']; //Creates a new array
  var TotalEpisodesTypeSpecial = ['0']; //Creates a new array
  var CompletedAnimeIdsArray = []; //Creates a new blank array
  const $ = window.jQuery; //Defines That The Symbol $ Is A jQuery
  var Remaining = '', newDocument, TextElement, date, date2, EpsSeen, EntryTotalHours, EntryTotalMinutes; //Creates new global variables

  if (location.href.match('chiaki') !== null && document.querySelector('a.uk-button.uk-button-text.uk-text-danger').innerText === 'SIGN IN' && location.href !== 'https://chiaki.site/?/') //If the user is on the chiaki.site and if the user isn't signed in on chiaki.site, and if the user wasn't returned to the chiaki.site home page
  { //Starts the if condition
    document.querySelector('a.uk-button.uk-button-text.uk-text-danger').click(); //Click on the sign-in btn
    if (location.href.match('auth') !== null) //If the user is on the auth chiaki.site page
    { //Starts the if condition
      document.querySelectorAll('.uk-button-large')[1].click(); //Click on the SIGN IN WITH MYANIMELIST btn
    } //Finishes the if condition
  } //Finishes the if condition

  if (location.href.match('authorization') !== null) //If the user is on the MAL auth website
  { //Starts the if condition
    window.onload = function() { //When the page finishes loading
      document.querySelectorAll("form > input")[1].id = 'clicked'; //Add an id to the btn
      document.querySelectorAll("form > input")[1].click(); //Click on the Allow btn
    }; //Finishes the onload event listener
  } //Finishes the if condition
  if (location.href === 'https://chiaki.site/?/') //When the user gets returned to the chiaki.site home page
  { //Starts the if condition
    window.history.go(-3); //Return to the franchise page
  } //Finishes the if condition

  if (GM_listValues().length >= 100 && top.location.host === 'myanimelist.net') //If there are 100 completed anime IDs stored on tampermonkey and if the user is on mal
  { //Starts the if condition
    $("h2:contains('Statistics')")[0].style.cursor = 'pointer'; //Make the text look like it's clickable
    $("h2:contains('Statistics')")[0].innerText = 'Click to Erase Franchise Script Cache'; //Change the Statistics text to another text

    $("h2:contains('Click to Erase Franchise Script Cache')")[0].onclick = function() //When the script text is clicked
    { //Starts the onclick event listener
      GM_listValues().forEach(a => GM_deleteValue(a)); //Erase all the 100 stored completed anime IDs stored on tampermonkey
      $("h2:contains('Click to Erase Franchise Script Cache')")[0].innerText = 'Statistics'; //Change the 'Click to Erase Franchise Script Cache' text to 'Statistics'
    }; //Finishes the onclick event listener
  } //Finishes the if condition

  if (top.location.host === 'myanimelist.net') { //Starts the user is on mal
    var animeid = location.pathname.match(/\d+/) === null ? location.search.match(/\d+/)[0] : location.pathname.match(/\d+/)[0]; //Detect the anime id
    GM_listValues().forEach(a => CompletedAnimeIdsArray.push('^' + a)); //Add all anime IDs on tampermonkey to the array
    var CompletedAnimeIdsRegex = new RegExp(CompletedAnimeIdsArray.join('$|')); //Create a new variable and regex containing all the values saved on tampermonkey and replace the , separator with the or $| regex symbols

    if (document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist") === null && document.querySelectorAll("#myinfo_status").length == 2) { //If the anime is on the user list and the middle page status btn exists
      document.querySelectorAll("#myinfo_status")[1].addEventListener('change', function() { //Listen for the anime entry status changes
        if (this.value !== '6' && this.value !== '1') { //If any status besides Plan To Watch and Watching is selected
          GM_setValue(animeid, 'Completed Anime Id'); //Get and save the anime id as a variable
        } //Finishes the if condition
        if (this.value === '6') //If Plan To Watch is selected
        { //Starts the if condition
          GM_deleteValue(animeid); //Remove the anime if of the completed script anime IDs storage
        } //Finishes the if condition
      }, false); //Finishes the change advent listener
    } //Finishes the if condition

    if (document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist") === null && document.querySelectorAll("i.fa-solid.fa-circle-plus").length == 2) { //If the entry is on the user list and the middle page + btn exists
      document.querySelectorAll("i.fa-solid.fa-circle-plus")[1].addEventListener('click', function() { //Listen for clicks on the plus button
        setTimeout(function() { //Starts the function settimeout
          if (document.querySelector("#myinfo_watchedeps").value === document.querySelector("#curEps").innerText) //If the number of watched eps is = the total entry eps
          { //Starts the if condition
            GM_setValue(animeid, 'Completed Anime Id'); //Get and save the anime id as a variable
          } //Finishes the if condition
        }, 800); //Finishes the function settimeout
      }, false); //Finishes the click advent listener
    } //Finishes the if condition

  } //Finishes the if condition

  if (top.location.host === 'myanimelist.net') //If The User Is On The https://myanimelist.net/ Website Fetch Chiaki
  { //Starts the if condition
    var IsUserOnMAL = true;
    GM.xmlHttpRequest({ //Starts the xmlHttpRequest
      method: "GET",
      url: `https://chiaki.site/?/tools/watch_order/id/${animeid}`,
      onload: async function(response) { //Starts the onload event listener
        newDocument = new DOMParser().parseFromString(response.responseText, 'text/html'); //Parses the fetch response
        TextElement = newDocument.querySelectorAll("span.uk-text-muted.uk-text-small"); //Creates a variable to loop through the elements after
        await Calc(); //Call the Calc function
      } //Finishes the onload event listener
    }); //Finishes the xmlHttpRequest
  } //Finishes the if condition
  else //If The User Is On The https://chiaki.site/ Website Start Processing The Content
  { //Starts the else condition
    IsUserOnMAL = false;
    TextElement = document.querySelectorAll("span.uk-text-muted.uk-text-small"); //Creates a variable to loop through the elements after
    await Calc(); //Call the Calc function
  } //Finishes the else condition

  async function Calc() //Creates a new function to calculate the time
  { //Starts the function
    for (var i = 0; i < TextElement.length; i++) { //Starts the for condition
      const TotalRawDurationHasSecs = TextElement[i].textContent.split("× ")[1].match('sec'); //Creates a variable to check later if there's an entry that has secs
      var TotalRawDuration = TextElement[i].textContent.split("× ")[1].split(' |')[0].match(/\d+|\?/g); //Creates a variable to hold the total unprocessed times
      const TotalEpisodes = TextElement[i].textContent.split("× ")[0].split(' |')[2].match(/\d+|\?/g); //Creates a variable to hold the total episodes
      const EpisodeType = TextElement[i].textContent.split("× ")[0].split(' |')[1]; //Creates a variable to check the episode types
      TotalEpsResult.push(TotalEpisodes); //Add The Eps To The Array
      if (IsUserOnMAL === true) //If The User Is On The https://myanimelist.net/ Website
      { //Starts the if condition
        if (TextElement[i].children[0].href.match(/\d+/)[0].match(CompletedAnimeIdsRegex) !== null && CompletedAnimeIdsRegex.toLocaleString() !== '/(?:)/') //If the current URL anime id matches an anime entry that was already completed, and if the Regex contains 1 or more anime ids
        { //Starts the if condition
          const CompletedMins = TotalRawDuration; //Creates a new variable
          TotalRawDuration = '?'; //Remove the Total Raw Duration value of this anime to not count it later
          Remaining = 'Remaining '; //Adds the text "Remaining" to the variable

          if (CompletedMins.length !== 1 && TotalRawDurationHasSecs === null) //If has Hrs and Mins and not secs
          { //Starts the if condition
            var ExtractHrs = CompletedMins[0] * 60; //Extract Hrs And Convert To Mins
            var TotalHrs = TotalEpisodes * ExtractHrs; //Multiply Eps By Hrs
            var TotalMins = TotalEpisodes * CompletedMins[1]; //Multiply Extracted Eps By Mins
            TotalCompletedMins.push(TotalHrs, TotalMins); //Add Hrs And Mins To The Array
          } //Finishes the if condition
          else if (TotalRawDurationHasSecs === null) //Extract only Mins and not secs
          { //Starts the else condition
            TotalMins = TotalEpisodes * CompletedMins[0]; //Multiply Extracted Eps By Mins
            TotalCompletedMins.push(TotalMins); //Add Mins To The Array
          } //Finishes the else condition

        } //Finishes the if condition
      } //Finishes the if condition
      if (TotalRawDuration.length !== 1 && TotalRawDurationHasSecs === null) //If has Hrs and Mins and not secs
      { //Starts the if condition
        ExtractHrs = TotalRawDuration[0] * 60; //Extract Hrs And Convert To Mins
        TotalHrs = TotalEpisodes * ExtractHrs; //Multiply Eps By Hrs
        TotalMins = TotalEpisodes * TotalRawDuration[1]; //Multiply Extracted Eps By Mins
        TotalHrMins.push(TotalHrs, TotalMins); //Add Hrs And Mins To The Array
      } //Finishes the if condition
      else if (TotalRawDurationHasSecs === null) //Extract only Mins and not secs
      { //Starts the else condition
        TotalMins = TotalEpisodes * TotalRawDuration[0]; //Multiply Extracted Eps By Mins
        TotalHrMins.push(TotalMins); //Add Mins To The Array
      } //Finishes the else condition

      if (EpisodeType.match('Music') !== null) //If it's Music
      { //Starts the if condition
        TotalEpisodesTypeMusic.push(TotalEpisodes); //Add The Eps To The Array
      } //Finishes the if condition
      if (EpisodeType.match('TV') !== null) //If it's TV
      { //Starts the if condition
        TotalEpisodesTypeTV.push(TotalEpisodes); //Add The Eps To The Array
      } //Finishes the if condition
      if (EpisodeType.match('OVA') !== null) //If it's OVA
      { //Starts the if condition
        TotalEpisodesTypeOVA.push(TotalEpisodes); //Add The Eps To The Array
      } //Finishes the if condition
      if (EpisodeType.match('Special') !== null) //If it's Special
      { //Starts the if condition
        TotalEpisodesTypeSpecial.push(TotalEpisodes); //Add The Eps To The Array
      } //Finishes the if condition
      if (EpisodeType.match('ONA') !== null) //If it's ONA
      { //Starts the if condition
        TotalEpisodesTypeONA.push(TotalEpisodes); //Add The Eps To The Array
      } //Finishes the if condition
      if (EpisodeType.match('Movie') !== null) //If it's Movie
      { //Starts the if condition
        TotalEpisodesTypeMovie.push(TotalEpisodes); //Add The Eps To The Array
      } //Finishes the if condition
    } //Finishes the for condition

    const TotalEpsFinal = TotalEpsResult.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum The Total Eps
    const TotalMinsResult = TotalHrMins.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum Hrs in Mins + Total Mins
    const ONAEpisodesResult = TotalEpisodesTypeONA.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) + ' ONA(s)'; //Sum The Total Eps
    const OVAEpisodesResult = TotalEpisodesTypeOVA.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) + ' OVA(s)'; //Sum The Total Eps
    const TVEpisodesResult = TotalEpisodesTypeTV.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) + ' TV Episode(s)'; //Sum The Total Eps
    const MusicEpisodesResult = TotalEpisodesTypeMusic.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) + ' Music(s)'; //Sum The Total Eps
    const MovieEpisodesResult = TotalEpisodesTypeMovie.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) + ' Movie(s)'; //Sum The Total Eps
    const SpecialEpisodesResult = TotalEpisodesTypeSpecial.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) + ' Special(s)'; //Sum The Total Eps
    //The Code Below Converts The Total Franchise Time To Precise Days, Hours And Minutes
    var days = Math.floor(TotalMinsResult / 1440);
    var hours = Math.floor((TotalMinsResult % 1440) / 60);
    var minutes = (TotalMinsResult % 1440) % 60;

    var CompletedPercentage = '0%'; //Set the default Completed % as 0%
    if (TotalCompletedMins.length !== 0) //If at least one entry of the franchise was marked as completed/dropped/on-hold or watching/reading
    { //Starts the if condition
      const TotalCompletedMinsResult = TotalCompletedMins.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum Hrs in Mins + Total Mins
      var TotalFranchiseMins = TotalCompletedMinsResult + TotalMinsResult; //Sum and save the total franchise duration in minutes
      var TotalFranchiseLeftMins = TotalFranchiseMins - TotalMinsResult; //Subtract and save the total franchise left duration in minutes
      CompletedPercentage = (TotalFranchiseLeftMins / TotalFranchiseMins).toLocaleString("en", { //Divide the franchise left duration mins by the franchise duration mins and show the result
        style: 'percent', //Show the result as %
        minimumFractionDigits: 2 //Show the % with 2 decimals
      }); //Finishes the toLocaleString
    } //Finishes the if condition

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

    function UpdateFinishTime() { //Starts the function UpdateFinishTime
      const DisplayedFranchiseDays = $('div.spaceit_pad:contains("Franchise Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) day\(s\) )?(?:(\d+) hr\(s\) )?(\d+) min\(s\)/)[1]; //Gets the actual displayed franchise days and save the days number to a variable
      const DisplayedFranchiseHours = $('div.spaceit_pad:contains("Franchise Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) day\(s\) )?(?:(\d+) hr\(s\) )?(\d+) min\(s\)/)[2]; //Gets the actual displayed franchise hour and save the hour number to a variable
      const DisplayedFranchiseMinutes = $('div.spaceit_pad:contains("Franchise Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) day\(s\) )?(?:(\d+) hr\(s\) )?(\d+) min\(s\)/)[3]; //Gets the actual displayed franchise minutes and save the minutes number to a variable

      date = new Date(); //Creates a new date
      const secondsToAdd = DisplayedFranchiseDays * 60 * 60 * 24 + DisplayedFranchiseHours * 60 * 60 + DisplayedFranchiseMinutes * 60 + SecondsFromNow; //Convert the actual Total/Remaining Franchise Duration days, hours and minutes to seconds
      date.setSeconds(date.getSeconds() + secondsToAdd);

      if (document.querySelector("td.borderClass").innerText.search("Remaining time:") > -1) //If the text "Remaining time:" exists
      { //Starts the if condition
        var RemainingEntryHours = parseInt($('div.spaceit_pad:contains("Remaining time") > span')[0].nextSibling.textContent.match(/(?: ?((\d+) hr\. ))?/)[1]); //Get and save the entry remaining hours
        if ($('div.spaceit_pad:contains("Remaining time") > span')[0].nextSibling.textContent.match(/\d+(?= min)/) !== null) //If the entry has remaining minutes
        { //Starts the if condition
          var RemainingEntryMinutes = parseInt($('div.spaceit_pad:contains("Remaining time") > span')[0].nextSibling.textContent.match(/\d+(?= min)/)[0]); //Get and save the entry remaining minutes
        } //Finishes the if condition
        else //If the entry has no remaining minutes
        { //Starts the else condition
          RemainingEntryMinutes = 0; //Save the entry remaining minutes as 0 instead of NaN
        } //Finishes the else condition

        if (isNaN(RemainingEntryHours) === true) //If the entry has no remaining hours
        { //Starts the if condition
          RemainingEntryHours = 0; //Save the entry remaining hours as 0 instead of NaN
        } //Finishes the if condition

        date2 = new Date(); //Creates a new date
        const secondsToAdd2 = 0 * 60 * 60 * 24 + RemainingEntryHours * 60 * 60 + RemainingEntryMinutes * 60 + SecondsFromNow; //Convert the actual "Remaining time" entry Duration hours and minutes to seconds
        date2.setSeconds(date2.getSeconds() + secondsToAdd2);
      } //Finishes the if condition

    } //Finishes the function UpdateFinishTime

    const title = 'title="' + OVAEpisodesResult + '&#13;' + ONAEpisodesResult + '&#13;' + MusicEpisodesResult + '&#13;' + SpecialEpisodesResult + '&#13;' + MovieEpisodesResult + '&#13;' + TVEpisodesResult + '"'; //Content that will be shown on mouse hover

    if (TextElement.length === 1) //If there's only 1 entry on chiaki.site for the whole franchise
    { //Starts the if condition
      var html; //Creates a blank variable
      IsUserOnMAL === true && document.querySelector("td.borderClass").innerText.search("Remaining time:") > -1 ? html = '' : html = 'Franchise Duration: </span>' + days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)'; //If the text "Remaining time:" exists don't show the Franchise Duration text
      var HasMoreThan1Entry = false; //Create a variable to confirm that the Franchise has less than 1 entry
    } //Finishes the if condition
    else //If there's more than 1 entry on chiaki.site for the whole franchise
    { //Starts the else condition
      html = Remaining + ' Franchise Duration: </span>' + days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)'; //Shows the real HTML on MAL
      HasMoreThan1Entry = true; //Create a variable to confirm that the Franchise has more than 1 entry

      if (IsUserOnMAL === true) //If The User Is On The https://myanimelist.net/ Website
      { //Starts the if condition
        function GetWatchedEps() { //Starts the function GetWatchedEps()
          EpsSeen = parseInt(document.querySelector("#myinfo_watchedeps").value); //Get the total number of eps seen and convert the value to int
          EntryTotalHours = $('div.spaceit_pad:contains("Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) hr\. )?(\d+) min\./)[1] * EpsSeen * 60; //Get the Entry Total Hours of seen episodes and convert from hrs to mins
          EntryTotalMinutes = parseInt($('div.spaceit_pad:contains("Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) hr\. )?(\d+) min\./)[2] * EpsSeen); //Get the Entry Total Minutes of seen episodes

          if ($('div.spaceit_pad:contains("Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) hr\. )?(\d+) min\./)[1] === undefined) { //Starts the if condition
            EntryTotalHours = 0; //Set the Entry Total Hours as 0
          } //Finishes the if condition
        } //Finishes the function

        if (document.querySelectorAll("i.fa-solid.fa-circle-plus").length === 2) //If the anime is already on the user list
        { //Starts the if condition
          document.querySelectorAll("i.fa-solid.fa-circle-plus")[1].addEventListener("click", function() { //Adds an advent listener to the plus button

            setTimeout(async function() { //Creates and starts the settimout function
              await GetWatchedEps(); //Starts the function GetWatchedEps()

              days = Math.floor((TotalMinsResult - EntryTotalHours - EntryTotalMinutes) / 1440); //Sum again the total Franchise days duration - the total watched eps duration time
              hours = Math.floor(((TotalMinsResult - EntryTotalHours - EntryTotalMinutes) % 1440) / 60); //Sum again the total Franchise hours duration - the total watched EPS duration time
              minutes = ((TotalMinsResult - EntryTotalHours - EntryTotalMinutes) % 1440) % 60; //Sum again the total Franchise minutes duration - the duration total watched eps time

              $('div.spaceit_pad:contains("Franchise Duration") > span')[0].textContent = 'Remaining Franchise Duration: '; //Add "Remaining" in front of the Franchise Duration text
              $('div.spaceit_pad:contains("Franchise Duration") > span')[0].nextSibling.textContent = days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)'; //Update the Franchise Duration Time

              if ($('div.spaceit_pad:contains("Remaining time") > span')[0] !== undefined) //If the "Remaining time" text exists
              { //Starts the if condition
                const TotalEntryHours = (parseInt($('div.spaceit_pad:contains("Total Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) hr\. )?(\d+) min\./)[1] * 60)); //Get and save the entry remaining hours, and convert to minutes
                const TotalEntryMinutes = (parseInt($('div.spaceit_pad:contains("Total Duration") > span')[0].nextSibling.textContent.match(/(?:(\d+) hr\. )?(\d+) min\./)[2])); //Get and save the entry remaining minutes

                const RemainingTimeHours = Math.floor((TotalEntryMinutes + TotalEntryHours - EntryTotalHours - EntryTotalMinutes % 1440) / 60); //Sum the total remaining Franchise hours duration - the total watched eps duration time
                const RemainingTimeMinutes = (TotalEntryMinutes + TotalEntryHours - EntryTotalHours - EntryTotalMinutes % 1440) % 60; //Sum again the total remaining Franchise minutes duration - the duration total watched eps time

                $('div.spaceit_pad:contains("Remaining time") > span')[0].nextSibling.textContent = ' ' + RemainingTimeHours + ' hr. ' + RemainingTimeMinutes + ' min.'; //Update the "Remaining time" Duration
              } //Finishes the if condition
            }, 800); //Finishes the settimeout function
          }); //Finishes the onclick advent listener
        } //Finishes the if condition

        if (document.querySelector("#myinfo_watchedeps").value !== '0' && document.querySelector("#myinfo_watchedeps").value !== '' && parseInt(document.querySelector("#curEps").innerText) >= 1 && document.querySelector(".po-r > #myinfo_status > option:checked").value === '1') //If there's at least 1 watched episode, and if the entry has 1 or more episodes, and if the anime has a Watching status
        { //Starts the if condition
          GetWatchedEps(); //Starts the function GetWatchedEps()

          days = Math.floor((TotalMinsResult - EntryTotalHours - EntryTotalMinutes) / 1440); //Sum again the total Franchise days duration - the total watched eps duration time
          hours = Math.floor(((TotalMinsResult - EntryTotalHours - EntryTotalMinutes) % 1440) / 60); //Sum again the total Franchise hours duration - the total watched eps duration time
          minutes = ((TotalMinsResult - EntryTotalHours - EntryTotalMinutes) % 1440) % 60; //Sum again the total Franchise minutes duration - the duration total watched eps time
          html = 'Remaining Franchise Duration: </span>' + days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)'; //Shows the real HTML on MAL

        } //Finishes the if condition
      } //Finishes the if condition

    } //Finishes the else condition

    if (IsUserOnMAL === true) //If The User Is On The https://myanimelist.net/ Website
    { //Starts the if condition
      [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("div")].find(info => info.innerText.includes("Rating")).insertAdjacentHTML('afterend', '<div class="TotalFranchise"></div>'); //Show The Total Duration inside the Rating text that's inside the information h2 element

      document.querySelector(".TotalFranchise").insertAdjacentHTML('afterend', `<div class="spaceit_pad" title="Time left to complete: ${days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)'}"><span class="dark_text">Watched: ${CompletedPercentage}</a></li></div>`); //Show The Completed %
      document.querySelector(".TotalFranchise").insertAdjacentHTML('afterend', '<div class="spaceit_pad" ' + title + '><span class="dark_text">Franchise Entries: ' + TextElement.length + '</a></li></div>'); //Show The Total Entries
      if (HasMoreThan1Entry === true) //If the Franchise has more than 1 Entry
      { //Starts the if condition
        document.querySelector(".TotalFranchise").insertAdjacentHTML('afterend', '<div class="spaceit_pad" ' + title + '><span class="dark_text">Franchise Episodes: ' + TotalEpsFinal + '</a></li></div>'); //Show The Total Episodes
      } //Finishes the if condition
      document.querySelector(".TotalFranchise").insertAdjacentHTML('afterend', '<div class="spaceit_pad" ' + title + '><span class="dark_text">' + html + '</div>'); //Show The Total Duration
    } //Finishes the if condition
    else //If The User Is On The https://chiaki.site/ Website
    { //Starts the else condition
      document.querySelector("ul.uk-flex-center.noborder.uk-tab").insertAdjacentHTML('beforeend', '<li><a href="#" ' + title + '>Total Duration: ' + days + ' day(s) ' + hours + ' hr(s) ' + minutes + ' min(s)</a></li>'); //Show The Total Duration
      if (HasMoreThan1Entry === true) //If the Franchise has more than 1 Entry
      { //Starts the if condition
        document.querySelector("ul.uk-flex-center.noborder.uk-tab").insertAdjacentHTML('beforeend', '<li><a href="#" ' + title + '>Total Episodes: ' + TotalEpsFinal + '</a></li>'); //Show The Total Episodes
        document.querySelector("ul.uk-flex-center.noborder.uk-tab").insertAdjacentHTML('beforeend', '<li><a href="#" ' + title + '>Total Entries: ' + TextElement.length + '</a></li>'); //Show The Total Entries
      } //Finishes the if condition
    } //Finishes the else condition

    if (IsUserOnMAL === true) //If The User Is On The https://myanimelist.net/ Website
    { //Starts the if condition
      $('span.dark_text:contains("Franchise Duration")').css("cursor", "pointer"); //Make the "Franchise Duration" text look like it's clickable

      $('span.dark_text:contains("Franchise Duration")')[0].onclick = function() { //When the Franchise Duration text is clicked
        UpdateFinishTime(); //Starts the function UpdateFinishTime

        if (document.querySelector("td.borderClass").innerText.search("Remaining time:") > -1) //If the text "Remaining time:" exists
        { //Starts the if condition

          if ($('div.spaceit_pad:contains("Remaining time") > span')[0].nextSibling.textContent !== '  ') //If the text "Remaining time:" has text
          { //Starts the if condition
            alert('You will finish watching this 🡳: (Without stopping)\nEntry on: ' + formatDateTime(date2) + '\nFranchise on: ' + formatDateTime(date)); //Display a message showing the days and hours from now
          } //Finishes the if condition
          else //If the text "Remaining time:" does NOT exist
          { //Starts the else condition
            alert('You will finish watching this franchise without stopping on ' + formatDateTime(date)); //Display a message showing the days and hours from now
          } //Finishes the else condition
        } //Finishes the if condition

        else //If the text "Remaining time:" does NOT exist
        { //Starts the else condition
          alert('You will finish watching this franchise without stopping on ' + formatDateTime(date)); //Display a message showing the days and hours from now
        } //Finishes the else condition

      }; //Finishes the onclick advent listener
    } //Finishes the if condition

  } //Finishes the async function
})();