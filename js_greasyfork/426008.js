// ==UserScript==
// @name         Better Related Anime/Manga Reader
// @namespace    ReadeableSequels
// @version      13
// @description  Adds line breaks between each Synonyms/Spin-offs/Alternative versions/Sequels/Summary/Others and Side stories titles on entry pages.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/((anime|manga)(id=)?(\.php\?id=)?)(\/)?([\d]+)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @connect      api.myanimelist.net
// @grant        GM.xmlHttpRequest
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/426008/Better%20Related%20AnimeManga%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/426008/Better%20Related%20AnimeManga%20Reader.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.body.innerText.search("Synonyms:") > -1) //If the text "Synonyms:" exists on the page
  { //Starts the if condition
    function findTheSynonymsText() { //Create a function to get the Synonyms: Titles text
      return [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("div")].find(info => info.innerText.includes("Synonyms:")).querySelector("span"); //Return the div that contains the Synonyms text
    } //Find the Synonyms text that's inside the information h2 element

    if (GM_listValues().length >= 100) //If there's 100 anime ids and Synonyms titles stored on tampermonkey
    { //Starts the if condition
      GM_listValues().forEach(a => GM_deleteValue(a)); //Erase all the 100 stored anime IDs and their Synonyms titles stored on tampermonkey
    } //Finishes the if condition

    if (findTheSynonymsText().nextSibling.textContent.match(', ') !== null) //If there's any commas on the Synonyms titles
    { //Starts the if condition
      var StoredEntryIDsArray = []; //Creates a new blank array
      const EntryID = location.pathname.match(/\d+/)[0]; //Store the Entry ID
      const EntryType = location.pathname.split('/')[1]; //Store the Entry Type
      GM_listValues().forEach(a => StoredEntryIDsArray.push('^' + a)); //Add all Entry IDs and types on tampermonkey to the array
      const StoredEntryIDsRegex = new RegExp(StoredEntryIDsArray.join('$|')); //Create a new variable and regex containing all the values saved on tampermonkey and replace the , separator with the or $| regex symbols

      async function GetSynonyms() //Creates a function to get the Synonyms titles
      { //Starts the function
        var SynonymsTitlesAPI = await new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          url: `https://api.myanimelist.net/v2/anime/${EntryID}?fields=alternative_titles`,
          headers: {
            "x-mal-client-id": "8ef0267fd86a187d479e6fcd7e1bb42a"
          },
          onload: r => resolve(r)
        })); //Finishes the xmlHttpRequest
        await new Promise(r => setTimeout(r, 500)); //Wait the xmlHttpRequest request to complete

        if (SynonymsTitlesAPI.status !== 200) //If the API is being rated
        { //Starts the if condition
          throw ('The MAL API is being time rate limited!'); //Stop the script
        } //Finishes the if condition

        findTheSynonymsText().parentNode.innerHTML = '<span class="dark_text">Synonyms:</span><div>' + JSON.parse(SynonymsTitlesAPI.responseText).alternative_titles.synonyms.join('<br><br>') + '</div>'; //Add the Synonyms Titles with break lines to the page
        GM_setValue(EntryType + EntryID, JSON.parse(SynonymsTitlesAPI.responseText).alternative_titles.synonyms.join('<br><br>')); //Get and save the Entry id, type and Synonyms Titles with break lines as a variable
      } //Finishes the async function

      const EntryTypeANDID = EntryType + EntryID; //Join the Entry Type and ID into 1 string to use match latter
      if (EntryTypeANDID.match(StoredEntryIDsRegex) !== null && StoredEntryIDsRegex.toLocaleString() !== '/(?:)/') //If the current url Entry id and type matches an Entry id and type that is stored on tampermonkey, and if the Regex contains 1 or more Entry ids
      { //Starts the if condition
        findTheSynonymsText().parentNode.innerHTML = '<span class="dark_text" style="cursor: pointer;">Synonyms:</span><div>' + GM_getValue(EntryTypeANDID) + '</div>'; //Add the Synonyms Titles text content on the Synonyms: bold text

        [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("div")].find(info => info.innerText.includes("Synonyms:")).querySelector("span").addEventListener("click", function() { //When the bold Synonyms: text is clicked
          GetSynonyms(); //Update the Synonyms Titles
        }); //Finishes the onclick advent listener
      } //Finishes the if condition
      else //If the current url Entry id and type does NOT match any Entry id and type that is stored on tampermonkey
      { //Starts the else condition
        var TimesExecuted = 0; //Creates a new variable

        window.onscroll = async function() { //Creates a new function to run when the page is scrolled
          TimesExecuted += 1; //Sum the amount of times that the page is scrolled
          if (TimesExecuted === 1) { //On the first time that the page is hovered
            GetSynonyms(); //Starts the function GetSynonyms
          } // //Finishes the if condition
        }; //Finishes the onscroll event listener
      } //Finishes the else condition
    } //Finishes the if condition
  } //Finishes the if condition

  document.querySelectorAll("td[width*='100%']").forEach(function(el) { //For each listed entry rows
    el.childNodes.forEach(function(node) { //For each listed entry row childNodes elements
      node.nodeType === 3 ? node.replaceWith(document.createElement("br")) : ''; //If the element type is = 3 replace it with a line break
    }) //Finishes the for each loop
  }) //Finishes the for each loop
})();