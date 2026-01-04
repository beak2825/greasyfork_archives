// ==UserScript==
// @name         Show More Forum Discussions on Anime/Manga Pages
// @namespace    ShowMoreDiscussions
// @version      21
// @description  Show up to 15 Forum Discussions on Anime and Manga Pages instead of only +/- 4 Forum Discussions.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/410984/Show%20More%20Forum%20Discussions%20on%20AnimeManga%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/410984/Show%20More%20Forum%20Discussions%20on%20AnimeManga%20Pages.meta.js
// ==/UserScript==
(function() {
  'use strict';
  if (document.querySelector("#forumTopics").rows.length >= 2) //Execute the script only if the page already has 2 or more discussions being shown
  { //Starts the if condition

    if (GM_listValues().length >= 20) //If there are 20 anime ids and their forum topics stored on tampermonkey
    { //Starts the if condition
      GM_listValues().forEach(a => GM_deleteValue(a)); //Erase all the 20 stored anime IDs and their forum topics stored on tampermonkey
    } //Finishes the if condition

    var EntryType; //Creates a new global variable
    var EntryID = location.pathname.match(/\d+/) === null ? location.search.match(/\d+/)[0] : location.pathname.match(/\d+/)[0]; //Store the Entry ID
    var StoredEntryIDsArray = []; //Creates a new blank array
    GM_listValues().forEach(a => StoredEntryIDsArray.push('^' + a)); //Add all Entry IDs and types on tampermonkey to the array
    var StoredEntryIDsRegex = new RegExp(StoredEntryIDsArray.join('$|')); //Create a new variable and regex containing all the values saved on tampermonkey and replace the , separator with the or $| regex symbols

    if (location.pathname.split('/')[1] === 'anime') //If the opened url is an anime entry page
    { //Starts the if condition
      EntryType = 'anime'; //Add a value to the variable
    } //Finishes the if condition
    else //If the opened url is an manga entry page
    { //Starts the else condition
      EntryType = 'manga'; //Add a value to the variable
    } //Finishes the else condition

    async function GetMoreDiscussions() //Creates a function to get the morediscussions
    { //Starts the function
      const response = await fetch($("a:contains('Forum')")[1].href); //Fetch
      const html = await response.text(); //Gets the fetch response
      const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response
      var content = newDocument.querySelector("div.page-forum"); //Creates a variable to hold the more discussions

      document.querySelector("div.page-forum").innerHTML = ''; //Remove the old Forum topics
      document.querySelector("div.page-forum").appendChild(content); //Append more discussions content on the Recent Forum Discussion
      document.querySelector("div.page-forum").previousSibling.remove(); //Remove the header text
      GM_setValue(EntryType + EntryID, document.querySelector("div.page-forum").innerHTML); //Get and save the anime id and More Forum HTML as a variable
    } //Finishes the async function

    var EntryTypeANDID = EntryType + EntryID; //Join the Entry Type and ID into 1 string to use match latter
    if (EntryTypeANDID.match(StoredEntryIDsRegex) !== null && StoredEntryIDsRegex.toLocaleString() !== '/(?:)/') //If the current url Entry id and type matches an Entry id and type that is stored on tampermonkey, and if the Regex contains 1 or more Entry ids
    { //Starts the if condition

      document.querySelector("div.page-forum").innerHTML = ''; //Remove the old Forum topics
      document.querySelector("div.page-forum").insertAdjacentHTML('afterend', GM_getValue(EntryTypeANDID)); //Add the more discussions content on the Recent Forum Discussion
      document.querySelector("div.page-forum").previousSibling.remove(); //Remove the header text

      document.querySelector("div.border_solid").onclick = function() { //When the bold forum text is clicked
        GetMoreDiscussions(); //Update the forum topics
        document.querySelector("div.page-forum").remove(); //Remove the old forum topics on the page
      }; //Finishes the onclick advent listener
      document.querySelector("div.border_solid").style.cursor = 'pointer'; //Make the bold Forum text look like it's clickable

    } //Finishes the if condition
    else //If the current url anime id does NOT match any anime id that is stored on tampermonkey
    { //Starts the else condition
      var TimesExecuted = 0; //Creates a new variable

      window.onscroll = async function() { //Creates a new function to run when the page is scrolled
        TimesExecuted += 1; //Sum the amount of times that the page is scrolled
        if (TimesExecuted === 1) { //On the first time that the page is hovered
          GetMoreDiscussions(); //Starts the function GetMoreDiscussions
        } // //Finishes the if condition
      }; //Finishes the onscroll event listener

    } //Finishes the else condition

  } //Finishes the if condition
})();