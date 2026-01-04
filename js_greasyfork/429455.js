// ==UserScript==
// @name         Anime/Manga Favorited Status %
// @namespace    FavoriteStatus%
// @version      18
// @description  See the % of people that have watched and favorited an anime/manga in the entry status page.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)\/[\d]+(\/.*)?/
// @match        https://myanimelist.net/anime/*/*/stats
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429455/AnimeManga%20Favorited%20Status%20%25.user.js
// @updateURL https://update.greasyfork.org/scripts/429455/AnimeManga%20Favorited%20Status%20%25.meta.js
// ==/UserScript==

setTimeout((async function() {
  'use strict';
  if (document.body.innerText.match('Status: Not yet aired') === null) //If the opened entry is airing or has finished airing
  { //Starts the if condition
    const response1 = await (await fetch('https://api.jikan.moe/v4/' + location.href.split('/')[3] + '/' + location.href.match(/\d+/)[0] + '/statistics')).json(); //Get Stats
    var TotalUsers = response1.data.total; //Save the TotalUsers to variable
    var PTWR = response1.data.plan_to_watch; //Save the PTW to variable

    if (location.href.split('/')[3] === 'manga') //If the opened entry is manga
    { //Starts the if condition
      PTWR = response1.data.plan_to_read; //Save the PTR to variable
    } //Finishes the if condition

    var Information = [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("div")]; //Save the Information stats to variable
    var Favorites = parseFloat(Information.find(info => info.innerText.includes('Favorites: ')).innerText.match(/(\d+,)?(\d+,)?\d+/)[0].replaceAll(',', '')); //Save the Favs to variable
    Information.find(info => info.innerText.includes("Favorites:")).innerText = 'Favorites: ' + Favorites.toLocaleString() + ' (' + ((Favorites) / ((TotalUsers) - (PTWR))).toLocaleString("en", { //Do the math and show the result
      style: 'percent', //Show the result as %
      minimumFractionDigits: 2 //Show the % with 2 decimals
    }) + ')'; //Show the total number after the Favorites: number
    Information.find(info => info.innerText.includes("Favorites:")).title = `( ${Favorites} )/(( ${TotalUsers} ) - ( ${PTWR} ))`; //Show the math on mouse hover

    if (location.href.match(/^https:\/\/myanimelist\.net\/(anime|manga)\/[\d]+\/.*\/stats/) !== null) //If the user is on the stats page
    { //Starts the if condition
      var SummaryStats = [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Summary Stats").parentNode.querySelectorAll("span")]; //Save the summary stats to variable
      SummaryStats.find(info => info.innerText.includes("Total:")).innerText = Information.find(info => info.innerText.includes("Favorites:")).innerText + '\nTotal: '
      SummaryStats.find(info => info.innerText.includes("Total:")).title = `( ${Favorites} )/(( ${TotalUsers} ) - ( ${PTWR} ))`; //Show the math on mouse hover
    } //Finishes the if condition

    if (document.querySelector("div.detail-characters-list.clearfix") !== null) //If the user is on the main entry page
    { //Starts the if condition
      document.querySelector("div.detail-characters-list.clearfix").querySelectorAll('div.spaceit_pad').forEach(function(el, index) { //For each character on the page
        setTimeout(async function() { //Starts the setimeout function
          const json = await (await fetch('https://api.jikan.moe/v4/characters/' + el.parentNode.querySelector('a').href.match(/\d+/)[0])).json(); //Get Stats

          el.innerText += '\nFavorited: ' + ((json.data.favorites) / ((TotalUsers) - (PTWR))).toLocaleString("en", { //Do the math and show the result
            style: 'percent', //Show the result as %
            minimumFractionDigits: 2 //Show the % with 2 decimals
          }); //Add a break line and show the % below the text
          el.title += `( ${json.data.favorites} )/(( ${TotalUsers} ) - ( ${PTWR} ))`; //Show the math on mouse hover
        }, index * 1200); //Finishes the setimeout function
      }); //Finishes the for each condition
    } //Finishes the if condition
  } //Finishes the if condition
})(), 1000);