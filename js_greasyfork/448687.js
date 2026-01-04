// ==UserScript==
// @name         Anime list total time - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      5
// @description  Shows the total amount of time you will take to watch all entries on your anime list.
// @author       hacker09
// @match        https://myanimelist.net/profile/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @connect      api.myanimelist.net
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448687/Anime%20list%20total%20time%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/448687/Anime%20list%20total%20time%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  document.head.insertAdjacentHTML('beforeend', '<style>span.lh10 {cursor: pointer;}</style>'); //Make each status total entry number look clickable
  document.querySelectorAll("span.lh10").forEach(async function(el, i) { //ForEach status total entry number
    el.onclick = async function() //When the user clicks on the status total entry number
    { //Starts the onclick event listener
      const ListIds = []; //Create a new array
      var stats; //Creates a new global variable
      const TotalEntrySecs = [1]; //Create a new array
      const limit = 1250; //Creates a new global const
      const delay = 360000; //Creates a new global const
      const AnimeStats = document.querySelector("h5,.pt16.pb12"); //Get the anime stats header
      const StatsTotEntries = parseInt(el.innerText.match(/\d+(?:,\d+)?(?= *\(|$)/g)[0].replace(',', '')); //Get the status total entries number

      if (document.querySelector(".updates.anime > p") !== null) //If the user has a private list
      { //Starts the if
        AnimeStats.innerText = `Anime Stats (${location.href.split('/')[4]} has a private anime list!)`; //Change the Anime Stats text
        throw (`${location.href.split('/')[4]} has a private anime list!`); //Stop the script
      } //Finishes the if condition

      alert(`This process will complete ${Math.round(StatsTotEntries / limit) * delay / 1000 / 60 !== 0 ? `in ${Math.round(StatsTotEntries / limit) * delay / 1000 / 60} minutes` : 'instantaneously'}.`); //Let the user know how long the process will take

      switch (i) { //Detect the user choice
        case 0: //If the user clicked on Watching
          stats = 'watching'; //Change the variable value
          AnimeStats.style.color = '#2db039'; //Change the txt color to match the selected status
          break; //Stop executing the switch statement
        case 1: //If the user clicked on Completed
          stats = 'completed'; //Change the variable value
          AnimeStats.style.color = '#26448f'; //Change the txt color to match the selected status
          break; //Stop executing the switch statement
        case 2: //If the user clicked on On-Hold
          stats = 'on_hold'; //Change the variable value
          AnimeStats.style.color = '#f9d457'; //Change the txt color to match the selected status
          break; //Stop executing the switch statement
        case 3: //If the user clicked on Dropped
          stats = 'dropped'; //Change the variable value
          AnimeStats.style.color = '#a12f31'; //Change the txt color to match the selected status
          break; //Stop executing the switch statement
        case 4: //If the user clicked on Plan to Watch
          stats = 'plan_to_watch'; //Change the variable value
          AnimeStats.style.color = '#c3c3c3'; //Change the txt color to match the selected status
          break; //Stop executing the switch statement
      } //Finishes the switch statement

      var url = `https://api.myanimelist.net/v2/users/${location.href.split('/')[4]}/animelist?nsfw=true&fields=list_status&status=${stats}&limit=1000`; //API url
      while (true) { //Starts the while condition to get the Total Number of Entries on the user list
        const entries = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          url: url,
          headers: {
            "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
          },
          onload: r => resolve(r)
        })); //Finishes the xmlHttpRequest

        if (entries.status !== 200) //If the API is being rated
        { //Starts the if condition
          AnimeStats.style.color = ''; //Change the bg color to default
          AnimeStats.innerText = 'Anime Stats (Cool down! The MAL API is being time rate limited!)'; //Change the Anime Stats text
          return false; //Stop the script
        } //Finishes the if condition

        AnimeStats.innerText = 'Anime Stats'; //Change the Anime Stats text
        url = JSON.parse(entries.responseText).paging.next; //Update the url variable with the next page url
        JSON.parse(entries.responseText).data.forEach(el => ListIds.push(el.node.id)); //Save all entry ids
        if (JSON.parse(entries.responseText).data.length !== 1000) //If the next page has less than 1000 entries stop looping the while condition
        { //Starts the if condition
          for (var index = 0; index < ListIds.length; index += limit) { //For Each limit+ entries
            ListIds.slice(index, index + limit).forEach(async function(id) { //For Each limit+ entries ids
              if (AnimeStats.style.color !== '') //If the txt color isn't the default
              { //Starts the if condition
                const response = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
                  url: `https://api.myanimelist.net/v2/anime/${id}?fields=num_episodes,average_episode_duration`,
                  headers: {
                    "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
                  },
                  onload: r => resolve(r)
                })); //Finishes the xmlHttpRequest

                await new Promise(r => setTimeout(r, 200)); //Wait 200 ms to continue
                if (response.status !== 200) //If the API is being rated
                { //Starts the if condition
                  AnimeStats.style.color = ''; //Change the txt color to default
                  AnimeStats.innerText = 'Anime Stats (Cool down! The MAL API is being time rate limited!)'; //Change the Anime Stats text
                } //Finishes the if condition
                else //If the API is not being rated
                { //Starts the else condition
                  const TotalTimeandEps = JSON.parse(response.responseText); //Parse the response as json
                  TotalEntrySecs.push(TotalTimeandEps.num_episodes * TotalTimeandEps.average_episode_duration); //Multiply the total entry amount of eps Eps By total entry Secs and To The Array
                  const Per = ((100 * (TotalEntrySecs.length - 1)) / StatsTotEntries).toFixed(0); //Get the currently completed process %
                  const TotalStatusSecs = TotalEntrySecs.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum Total Secs
                  const days = Math.floor((TotalStatusSecs - 1) / (3600 * 24)); //Get total days amount
                  const hours = parseInt((TotalStatusSecs - 1) / 3600) % 24; //Get total hours amount
                  const minutes = parseInt((TotalStatusSecs - 1) / 60) % 60; //Get total minutes amount
                  const seconds = (TotalStatusSecs - 1) % 60; //Get total seconds amount
                  AnimeStats.title = 'Total Entries Processed: ' + (TotalEntrySecs.length - 1); //Add the total processed entries on mouse hover
                  AnimeStats.innerText = `Anime Stats (${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds) ${Per}%`; //Show the total time and %
                  ListIds.length === TotalEntrySecs.length - 1 ? AnimeStats.innerText = AnimeStats.innerText.replace(/\d+%/, '✔️') : ''; //If the processed entries is = the status entries add ✔️
                } //Finishes the else condition
              } //Finishes the if condition
            }); //Finishes the for each loop
            await new Promise(r => setTimeout(r, delay)); //Wait 6 mins before making the next API calls
          } //Finishes the for loop
          return; //Stop the script if the fetched page has less than 1000 entries and starts the ListIds.forEach loop
        } //Finishes the if condition
      } //Finishes the while condition
    }; //Finishes the onclick event listener
  }); //Finishes the foreach loop
})();