// ==UserScript==
// @name         Finder - Mega.nz
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Quickly and easily find any specific folder/file that you are looking for.
// @author       hacker09
// @match        https://mega.nz/folder/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mega.nz&size=64
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444260/Finder%20-%20Meganz.user.js
// @updateURL https://update.greasyfork.org/scripts/444260/Finder%20-%20Meganz.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //Add support to work when folders are changed

  //div.loading-spinner.hidden
  //.loading-spinner.hidden
  //.not-logged.en.theme-dark'
  //body#bodyel.not-logged.en.theme-dark
  //div.light-overlay.hidden
  //.light-overlay.hidden

  //div.pages-menu.body
  //a.pages-menu.link.pro.clickurl
  //div.grid-wrapper > table > tbody > tr:nth-child(2)
  document.arrive('div.grid-wrapper > table > tbody > tr:nth-child(2)', (async function() { //When mega finishes Receiving and Decrypting the folder data
    var $ = window.jQuery; //Defines That The Symbol $ Is A jQuery
    if (document.querySelectorAll('tr:nth-child(19)').length === 1) { //If the page has 20 tr elements on it
      var id = document.querySelectorAll('tr:nth-child(19)')[0].id; //Get id of tr 20
    } //Finishes the if condition

    //id usage is only good for lists with much more than 20 folders/files, helps not increase browser memory usage and not stop and not back and forth scroll to try to find next items that match the search
    //find a way to search on less than 20 items without consuming a bunch of memory and stopping in the first found item?

    function Find() { //Creates a new find function
      document.title = 'Find executed'
      if (document.querySelectorAll('tr:nth-child(19)').length === 1) { //If the page has 20 tr elements on it
        id = document.querySelectorAll('tr:nth-child(19)')[0].id; //Get id of tr 20
      } //Finishes the if condition
      if ($('td > span:contains("Suntory")')[0] !== undefined) { //If item was found
        $('td > span:contains("Suntory")').parent().parent().css("background-color", "black");
        $('td > span:contains("Suntory")')[0].scrollIntoView();
      } //Finishes the if condition
    } //Finishes the find function
    Find(); //Calls the find function

    /*     let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        console.log(`URL changed to ${location.href}`);
      }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config); */

    new MutationObserver(async function() { //When the window is scrolled
      if (document.querySelector("tr[id*='" + id + "']") === null) { //If the page is scrolled the last tr id 20 is not on it
        Find(); //Calls the find function
      } //Finishes the if condition
    }).observe(document.querySelectorAll("div.ps-scrollbar-y-rail")[1], { //Defines the element and the characteristics to be observed
      attributes: true,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false,
      childList: false,
      subtree: false
    }); //Finishes the characteristics to be observed
    Arrive.unbindAllArrive(); //Removes the event listener arrive for better performance
  })); //Finishes and executes the async function
})();