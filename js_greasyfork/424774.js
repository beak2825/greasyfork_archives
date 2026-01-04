// ==UserScript==
// @name         Series Highlighter - MAL
// @namespace    MALHighlither
// @version      30
// @description  Highlights entries that already exist on your MAL lists
// @author       hacker09
// @match        https://myanimelist.net/
// @match        https://myanimelist.net/watch/*
// @match        https://myanimelist.net/stacks/*
// @match        https://myanimelist.net/search/all*
// @include      /^https?:\/\/myanimelist\.net\/(animelist|mangalist)/
// @include      /^https?:\/\/myanimelist\.net\/top(anime|manga)\.php/
// @include      /^https?:\/\/myanimelist\.net\/(anime|manga)\.php\?.*\S=/
// @include      /^https?:\/\/myanimelist\.net\/(anime|manga)\/\d+\/[^\/]+\/userrecs/
// @include      /^https?:\/\/myanimelist\.net\/(character|people)(\.php\?id=|\/)\d+/
// @include      /^https?:\/\/myanimelist\.net\/(addtolist|recommendations|reviews|shared)\.php/
// @include      /^https?:\/\/myanimelist\.net\/(anime|manga)\/(season|genre|producer|magazine)/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424774/Series%20Highlighter%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/424774/Series%20Highlighter%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const $ = jQuery; //Defines That The Symbol $ Is A jQuery
  const url = location.pathname; //Create a new global variable to detect the URL

  document.head.insertAdjacentHTML('beforeend', '<style>.ranking-list td {background: none !important;}</style>'); //On topanime/manga and shared.php pages remove the default background

  if (url.match('shared.php') !== null || (url.match(/animelist|mangalist/) !== null && document.body.innerHTML.match(/sharedanime.php|sharedmanga.php/) !== null)) { //If the url is the shared page or If the user is on any animelist or mangalist and if it's not the user own anime/manga list
    document.head.insertAdjacentHTML('beforeend', '<style>td {background: none !important;}</style>'); //Remove the default background color on rows on classic lists and on rows that both users gave the exact same score for the row entry on the shared.php page
  } //Finishes the if condition

  if (GM_getValue("Dropped") === undefined) { //If the variable doesn't exist yet define the variables
    GM_setValue('On-Hold', 'rgb(255 216 82 / 30%)'); //Set the On-Hold Color
    GM_setValue('PTW/PTR', 'rgb(144 144 144 / 30%)'); //Set the PTW/PTR Color
    GM_setValue('Dropped', 'rgb(255 142 144 / 30%)'); //Set the Dropped Color
    GM_setValue('addtolist', 'rgb(85 253 207 / 30%)'); //Set the addtolist Color
    GM_setValue('Completed', 'rgb(155 184 253 / 30%)'); //Set the Completed Color
    GM_setValue('Watching/Reading', 'rgb(67 232 93 / 30%)'); //Set the Watching/Reading Color
    GM_setValue('AnimeList/MangaList', 'rgb(85 253 207 / 30%)'); //Set the Watching/Reading Color
  } //Finishes the if condition

  if (url.match('addtolist.php') !== null) //If the user is on the addtolist page
  { //Starts the if condition
    document.querySelector("button.inputButton").addEventListener("click", function() { //When the search button is clicked
      setTimeout(function() { //Starts the settimeout function
        $('tr:contains("Edit")').css('background-color', GM_getValue('addtolist'))[0]; //Add the same background color to all entries that's on the user list
      }, 2000); //Starts the HighLight function after 2 secs
    }); //Finishes the settimeout function

    document.querySelector("#maSearchText").addEventListener("keyup", function(e) { //When the user press Enter on the search box
      if (e.keyCode === 13) { //If the enter key was pressed
        setTimeout(function() { //Starts the settimeout function
          $('tr:contains("Edit")').css('background-color', GM_getValue('addtolist'))[0]; //Add the same background color to all entries that's on the user list
        }, 2000); //Starts the HighLight function after 2 secs
      } //Finishes the if condition
    }); //Finishes the settimeout function
  } //Finishes the if condition

  if (document.querySelectorAll('a.Lightbox_AddEdit:not(.button_add)').length !== 0 && url.match('addtolist.php') === null && document.querySelectorAll('.page-common .bgColor1').length !== 0) { //If the page has animes that are on the user list and if the url isn't the addtolist page and if the element '.page-common .bgColor1/2' exists
    document.head.insertAdjacentHTML('beforeend', '<style>.page-common .bgColor1, .page-common .bgColor2 {background: unset !important;}</style>'); //Remove the default background
  } //Finishes the if condition

  async function HighLight() //Creates a new function function
  { //Starts the function

    if (url.match(/animelist|mangalist/) !== null && document.body.innerHTML.match(/sharedanime.php|sharedmanga.php/) !== null) { //If the user is on any animelist or mangalist and if it's not the user own anime/manga list
      $('tr:contains("Edit")').css('background-color', GM_getValue('AnimeList/MangaList'))[0]; //Add the same background color to all entries that's on the user list
      return; //Stop the script execution
    } //Finishes the if condition

    if (document.querySelectorAll('a.Lightbox_AddEdit:not(.button_add)').length !== 0) { //If the page has animes that are on the user list
      var OnUserLists = document.querySelectorAll('a.Lightbox_AddEdit:not(.button_add)').length === 0 ? document.querySelectorAll('.Lightbox_AddEdit.btn-addEdit-large:not(.button_add)') : document.querySelectorAll('a.Lightbox_AddEdit:not(.button_add)'); //Add all animes on the user list total number to a variable

      if (url.match('shared.php') !== null) { //If the URL is the shared page
        OnUserLists = document.querySelector("table").querySelectorAll('a.Lightbox_AddEdit:not(.button_add)'); //Add all shared animes on the user list total number to a variable
      } //Finishes the if condition

    } //Finishes the if condition

    if (OnUserLists !== undefined) //If there's at least 1 anime on the user list on the current page
    { //Starts the if condition
      for (var i = OnUserLists.length; i--;) { //Starts the for condition
        var Elements = OnUserLists[i].parentElement.parentElement.parentElement; //If the current opened page is the season or userrecs page, or if it's the people page and the user also has MALSync installed

        if (url.match('stacks') !== null && document.querySelector(".on").className === 'tile on') { //If the URL is the stacks page and the tile is active
          Elements = OnUserLists[i].parentElement.parentElement; //Change the Elements variable
          OnUserLists[i].style.fontSize = 'unset'; //Make the description text fit the add btn box
        } //Finishes the if condition

        if (url.match('/people|anime.php/') !== null && OnUserLists[i].parentElement.parentElement.tagName === 'TR') { //If the current opened page is the people page or the anime.php and if the 2 parentElement is a TR element
          var ParentElement = true; //Define the variable as false because the user doesn't have MALSync installed
        } //Finishes the if condition

        if (location.href === 'https://myanimelist.net/' || url.match(/\/search\/all|reviews.php|recommendations.php|topanime.php|topmanga.php|shared.php|manga.php|\/watch|\/character|\/genre|\/producer|\/magazine/) !== null && document.querySelector("div.js-categories-seasonal.js-block-list.tile.mt16") === null || ParentElement === true) { //If the current page is one of these pages, and If the genre/producer/magazine page it's not on the block list view mode, or if it's the people page and the user doesn't have MALSync installed
          Elements = OnUserLists[i].parentElement.parentElement; //Store the correct element to a variable to change its background color later
        } //Finishes the if condition

        if (Elements.outerHTML.match(/Completed|s="2"/gi) !== null) //If the link element title/classname/data-status "is" completed
        { //Starts the if condition
          Elements.style.backgroundColor = GM_getValue('Completed'); //Change the element background color
          OnUserLists[i].innerText = 'CMPL'; //Change the text from edit to CMPL
          OnUserLists[i].style.backgroundColor = '#26448f'; //Change the edit button background color
          OnUserLists[i].style.color = 'white'; //Change the edit button text color
        } //Finishes the if condition

        if (Elements.innerHTML.match(/Plan to Watch$|Plan to Read$|plantowatch|plantoread|s="6"/gi) !== null) //If the link element title/classname/data-status "is" PTW/PTR
        { //Starts the if condition
          Elements.style.backgroundColor = GM_getValue('PTW/PTR'); //Change the element background color
          OnUserLists[i].innerText = 'PLAN'; //Change the text from edit to PLAN
          OnUserLists[i].style.backgroundColor = '#c3c3c3'; //Change the edit button background color
          OnUserLists[i].style.color = 'white'; //Change the edit button text color
        } //Finishes the if condition

        if (OnUserLists[i].outerHTML.match(/Watching|Reading|s="1"/gi) !== null) //If the link element title/classname/data-status "is" watching/reading
        { //Starts the if condition
          Elements.style.backgroundColor = GM_getValue('Watching/Reading'); //Change the element background color
          OnUserLists[i].innerText = OnUserLists[i].outerHTML.match(/Reading/gi) !== null ? 'CR' : 'CW'; //Change the text from edit to the actual entry status
          OnUserLists[i].style.backgroundColor = '#2db039'; //Change the edit button background color
          OnUserLists[i].style.color = 'white'; //Change the edit button text color
        } //Finishes the if condition

        if (OnUserLists[i].outerHTML.match(/Dropped|s="4"/gi) !== null) //If the link element title/classname/data-status "is" dropped
        { //Starts the if condition
          Elements.style.backgroundColor = GM_getValue('Dropped'); //Change the element background color
          OnUserLists[i].innerText = 'DROP'; //Change the text from edit to DROP
          OnUserLists[i].style.backgroundColor = '#a12f31'; //Change the edit button background color
          OnUserLists[i].style.color = 'white'; //Change the edit button text color
        } //Finishes the if condition

        if (OnUserLists[i].outerHTML.match(/On-Hold|s="3"/gi) !== null) //If the link element title/classname/data-status "is" on-hold
        { //Starts the if condition
          Elements.style.backgroundColor = GM_getValue('On-Hold'); //Change the element background color
          OnUserLists[i].innerText = 'HOLD'; //Change the text from edit to HOLD
          OnUserLists[i].style.backgroundColor = '#f1c83e'; //Change the edit button background color
          OnUserLists[i].style.color = 'white'; //Change the edit button text color
        } //Finishes the if condition
      } //Finishes the for condition
    } //Finishes the if condition
  } //Finishes the function HighLight

  window.onscroll = function() { //If the next result page is auto-loaded and added to the document body (If the user uses anything like the Endless MAL Script)
    if (window.scrollY * 1.2 >= document.querySelector('body').offsetHeight - window.innerHeight) { //When the bottom is almost reached
      setTimeout(function() { //Starts the settimeout function
        HighLight(); //Starts the HighLight function
      }, 1500); //Starts the HighLight function after 1.5 secs
    } //Finishes the if condition
  }; //Finishes the onscroll event listener

  window.onload = setTimeout(function() { //Starts the settimeout function when the page finishes loading
    HighLight(); //Starts the HighLight function
  }, 500); //Finishes the onscroll event listener and SFinishes the onscroll event listener and tarts the HighLight function after half sec
})();