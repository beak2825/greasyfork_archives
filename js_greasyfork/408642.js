// ==UserScript==
// @name         Show Anime Duration With Seconds
// @namespace    DurationWithSeconds
// @version      19
// @description  Shows the Duration Time with seconds for all animes.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @connect      api.myanimelist.net
// @grant        GM.xmlHttpRequest
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/408642/Show%20Anime%20Duration%20With%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/408642/Show%20Anime%20Duration%20With%20Seconds.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  const animeid = location.pathname.match(/\d+/) === null ? location.search.match(/\d+/)[0] : location.pathname.match(/\d+/)[0]; //Detect the anime id
  var StoredAnimeIdsArray = []; //Creates a new blank array
  GM_listValues().forEach(a => StoredAnimeIdsArray.push('^' + a)); //Add all anime IDs on tampermonkey to the array
  const StoredAnimeIdsRegex = new RegExp(StoredAnimeIdsArray.join('$|')); //Create a new variable and regex containing all the values saved on tampermonkey and replace the , separator with the or $| regex symbols
  const findTheDurationText = [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("div")].find(info => info.innerText.includes("Duration")).querySelector("span"); //Find the div that contains the Duration text

  if (GM_listValues().length >= 100) //If there's 100 anime ids and durations stored on tampermonkey
  { //Starts the if condition
    GM_listValues().forEach(a => GM_deleteValue(a)); //Erase all the 100 stored anime IDs and their durations stored on tampermonkey
  } //Finishes the if condition

  async function GetDurationWithSecs() { //Starts the if condition
    var API = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
      url: `https://api.myanimelist.net/v2/anime/${animeid}?fields=average_episode_duration`,
      headers: {
        "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
      },
      onload: r => resolve(r)
    })); //Finishes the xmlHttpRequest
    await new Promise(r => setTimeout(r, 500)); //Wait the xmlHttpRequest request to complete

    if (API.status !== 200) //If the API is being rated
    { //Starts the if condition
      throw ('The MAL API is being time rate limited!'); //Stop the script
    } //Finishes the if condition

    var Duration = new Date(JSON.parse(API.responseText).average_episode_duration * 1000).toISOString().slice(11, 19).split(':'); //Get each duration times
    Duration[0] = Duration[0] !== '00' ? Duration[0] + ' hr. ' : ''; //Erase the 00 hours amount if the entry has only minutes and seconds

    findTheDurationText.nextSibling.textContent = ' ' + Duration[0] + Duration[1] + ' min. ' + Duration[2] + ' sec. per ep.'; //Change the text content of the Duration: Element
    GM_setValue(animeid, ' ' + Duration[0] + Duration[1] + ' min. ' + Duration[2] + ' sec. per ep.'); //Get and save the anime id and Duration With Secs as a variable
  }; //Finishes the async function

  if (animeid.match(StoredAnimeIdsRegex) !== null && StoredAnimeIdsRegex.toLocaleString() !== '/(?:)/') //If the current url anime id matches an anime id that is stored on tampermonkey, and if the Regex contains 1 or more anime ids
  { //Starts the if condition

    findTheDurationText.nextSibling.textContent = GM_getValue(animeid); //Change the text content of the Duration: Element
    findTheDurationText.style.cursor = 'pointer'; //Make the bold Duration: text look like it's clickable
    findTheDurationText.onclick = GetDurationWithSecs

  } //Finishes the if condition
  else //If the current url anime id does NOT match any anime id that is stored on tampermonkey
  { //Starts the else condition
    var TimesExecuted = 0; //Creates a new variable

    window.onscroll = async function() { //Creates a new function to run when the page is scrolled
      TimesExecuted += 1; //Sum the amount of times that the page is scrolled
      if (TimesExecuted === 1) { //On the first time that the page is scrolled
        GetDurationWithSecs(); //Run the function to get the Duration With Secs
      } // //Finishes the if condition
    }; //Finishes the onscroll event listener

  } //Finishes the else condition
})();