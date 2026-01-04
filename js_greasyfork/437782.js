// ==UserScript==
// @name         Add new entries to your MyAnimeList - Chiaki
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      8
// @description  With a single click mass add whole franchise entries with the status of your choice, or change the status of all entries from an entire franchise.
// @author       hacker09
// @match        https://chiaki.site/?/auth
// @match        https://chiaki.site/?/tools/watch_order/*
// @match        https://myanimelist.net/dialog/authorization
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://chiaki.site/&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437782/Add%20new%20entries%20to%20your%20MyAnimeList%20-%20Chiaki.user.js
// @updateURL https://update.greasyfork.org/scripts/437782/Add%20new%20entries%20to%20your%20MyAnimeList%20-%20Chiaki.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match('chiaki') !== null && document.querySelector('a.uk-button.uk-button-text.uk-text-danger').innerText === 'SIGN IN' && location.href !== 'https://chiaki.site/?/') //If the user is on the chiaki.site and it the user isn't signed in on chiaki.site, and if the user wasn't returned to the chiaki.site home page
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
      setTimeout(function() {
        if (document.querySelectorAll("form > input")[1].id !== 'clicked') //If the form id is not clicked
        { //Starts the if condition
          document.querySelectorAll("form > input")[1].click(); //Click on the Allow btn
        } //Finishes the if condition
      }, 300); //Click on the Allow btn
    }; //Finishes the onload event listener
  } //Finishes the if condition
  if (location.href === 'https://chiaki.site/?/') //When the user gets returned to the chiaki.site home page
  { //Starts the if condition
    window.history.go(-3); //Return to the franchise page
  } //Finishes the if condition

  document.querySelector("ul.uk-flex-center.noborder.uk-tab").insertAdjacentHTML('beforeend', '<li><a href="#" id="AddToMAL">ADD/UPDATE</a></li>'); //Show The ADD btn

  document.querySelector('#AddToMAL').onclick = function(e) { //When the add btn is clicked
    e.preventDefault(); //Prevent the default click action
    e.stopPropagation(); //Prevent the default click action
    var UserInput = prompt('1 Watching\n2 Completed\n3 On-Hold\n4 Dropped\n5 PTW\n*Write only your choice number and click OK'); //Gets the user input

    switch (UserInput) { //Detect the user choice
      case '1': //If the user choose option 1
        UserInput = 'watching'; //Change the variable value
        break; //Stop executing the switch statement
      case '2': //If the user choose option 2
        UserInput = 'completed'; //Change the variable value
        break; //Stop executing the switch statement
      case '3': //If the user choose option 3
        UserInput = 'on_hold'; //Change the variable value
        break; //Stop executing the switch statement
      case '4': //If the user choose option 4
        UserInput = 'dropped'; //Change the variable value
        break; //Stop executing the switch statement
      case '5': //If the user choose option 5
        UserInput = 'plan_to_watch'; //Change the variable value
        break; //Stop executing the switch statement
    } //Ends the switch statement

    var Counter = 0; //Create a new counter variable
    const DefaultElement = document.querySelectorAll("span.uk-text-muted.uk-text-small > a:nth-child(1)"); //Hold the default page element selector
    var UserChosenElement = DefaultElement; //Create a new global variable
    const NotAdded = Array.from(DefaultElement).filter(el => el.parentNode.parentNode.querySelector(".list_status span:nth-child(2)").innerText === ' ADD TO MY LIST'); //Hold non-added elements
    const Added = Array.from(DefaultElement).filter(el => el.parentNode.parentNode.querySelector(".list_status span:nth-child(2)").innerText !== ' ADD TO MY LIST'); //Hold added elements

    if (NotAdded.length === 0 || Added.length === 0 || confirm('Would you like to overwrite the current status of entries that are already on your list?')) { //If no entries are added or all are added, or if the user chooses to overwrite
      UserChosenElement = DefaultElement; //Overwrite all entries
    } else { //If some entries are added and the user chooses not to overwrite
      UserChosenElement = NotAdded; //Only modify/add non-added entries
    }// FInishes the if condition

    UserChosenElement.forEach(async function(el) { //ForEach MAL entry link
      fetch("https://chiaki.site/?/animelist/update", { //Fetches
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        "body": `id=${el.href.split('/')[4]}&status=${UserInput}`,
        "method": "POST"
      }) //Finishes the Fetch
        .then(response => { //After the fetch finished
        Counter += 1; //Increase the counter by 1
        if (Counter === UserChosenElement.length) //If the Counter is equal to the amount of fetched links
        { //Starts the if condition
          location.reload(); //Reloads the page after adding is completed
        } //Finishes the if condition
      }) //Finishes the then statement
    }) //Finishes the ForEach loop
  } //Finishes the onclick event listener
})();