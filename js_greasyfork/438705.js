// ==UserScript==
// @name         "Not Yet Aired" Hider
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      5
// @description  Allows you to hide "Not Yet Aired" entries of your list.
// @author       hacker09
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/438705/%22Not%20Yet%20Aired%22%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/438705/%22Not%20Yet%20Aired%22%20Hider.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function show() { //Creates a new function
    document.querySelectorAll("tr.list-table-data").forEach(a => a.style.display = ''); //Shows the elements
  } //Finishes the show function

  function hide() { //Creates a new function
    document.querySelectorAll("span.content-status,td > small").forEach(function(el) { //ForEach entry
      if (el.innerText === 'Not Yet Aired') //If the entry has not yet aired
      { //Starts the if condition
        el.parentNode.parentNode.style.display = 'none'; //Hides the element
      } //Finishes the if condition
    }) //Finishes the ForEach loop
  } //Finishes the hide function

  if (GM_getValue('Hide') === undefined || GM_getValue('Hide') === null) { //If the variable doesn't exist yet define the variable
    GM_setValue('Hide', true); //Set the user choice as true by default
  } //Finishes the if condition

  window.onload = function() { //When the windows loads
    if (GM_getValue('Hide') === true) { //If the variable is true
      hide(); //Calls the hide function
    } //Finishes the if condition
    else //If the variable is false
    { //Starts the else condition
      show(); //Calls the show function
    } //Finishes the else condition
  } //Finishes the onload function

  window.onscroll = function() { //When the user scrolls the page
    setTimeout(function() { //Starts the settimeout function
      if (GM_getValue('Hide') === true) { //If the variable is true
        hide(); //Calls the hide function
      } //Finishes the if condition
      else //If the variable is false
      { //Starts the else condition
        show(); //Calls the show function
      } //Finishes the else condition
    }, 1500); //Starts the function after 1.5 secs
  }; //Finishes the onscroll event listener

  GM_registerMenuCommand("Hide Not Yet Aired entries", function() { //Creates a new function
    hide(); //Calls the hide function
    GM_setValue('Hide', true); //Set the user choice as true
  }); //Adds an option to the menu and finishes the function

  GM_registerMenuCommand("Show Not Yet Aired entries", function() { //Creates a new function
    show(); //Calls the show function
    GM_setValue('Hide', false); //Set the user choice as false
  }); //Adds an option to the menu and finishes the function
})();