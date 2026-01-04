// ==UserScript==
// @name         Who Defriended ME!? - MAL
// @namespace    MALDeFriendStalker
// @version      10
// @description  Now you can easily and quickly know who DeFriended you on MAL!
// @author       hacker09
// @include      https://myanimelist.net/profile/*/friends
// @include      https://myanimelist.net/myfriends.php?go=remove&id=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421682/Who%20Defriended%20ME%21%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/421682/Who%20Defriended%20ME%21%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match('https://myanimelist.net/profile/' + document.querySelector("a.header-profile-link").innerText + '/friends')) //Make the script work only on the script user friend list
  { //Starts the if condition
    var nextpagenum = 0; //Creates a new variable
    const increaseby = 1; //Creates a new variable
    var PastFriends = []; //Creates a new global array
    var ActualFriendsArray = []; //Creates a new global array

    const WhoDeFriendedMEBTN = document.createElement("a"); //Creates a button element
    WhoDeFriendedMEBTN.innerHTML = "Check Who DeFriended ME!"; //Adds a text to the button
    WhoDeFriendedMEBTN.setAttribute("id", "WhoDeFriendedMEBTN"); //Set an id to the button
    WhoDeFriendedMEBTN.setAttribute("style", "cursor: pointer;margin-left: 15px;font-size: 10px;"); //Set the button css style
    document.querySelector("a.header-right.mt4.mr0").parentElement.appendChild(WhoDeFriendedMEBTN); //Add the button to the page
    document.querySelector("#WhoDeFriendedMEBTN").addEventListener("click", GetNewAndActualFriendsAndShowWhoDeFriendedME, false); //Add a click advent listener to the button

    for (var i = GM_listValues().length; i--;) { //For every single MAL friend saved on tampermonkey
      PastFriends.push(GM_listValues()[i]); //Add all Past MAL Friends saved on tampermonkey to an array
    } //Finishes the for condition

    async function GetNewAndActualFriendsAndShowWhoDeFriendedME() { //Creates an async function
      while (true) { //While the fetched page constains 100 friends
        nextpagenum += increaseby; //Increase the page number
        var JsonResponse = await (await fetch('https://api.jikan.moe/v4/users/' + document.querySelector("a.header-profile-link").innerText + '/friends?page=' + nextpagenum)).json(); //Fetches the friend list and the next pages and converts the fetched pages to json

        for (var i = JsonResponse.data.length; i--;) { //For every single MAL friend
          GM_setValue(JsonResponse.data[i].user.username, 'Actual MAL Friend'); //Get and save the actual mal friend and store the username
          ActualFriendsArray.push(JsonResponse.data[i].user.username); //Add all Actual MAL Friends to an array
        } //Finishes the for loop

        if (JsonResponse.data.length !== 100) { //If the fetched page doesn't have 100 friends on it
          var WhoDefriendedME = PastFriends.filter(d => !ActualFriendsArray.includes(d)); //Creates a variable to get the Past Friend User Names that tampermonkey had and check which Past Friends User Names are currently Missing
          if (WhoDefriendedME.length > 0) //If someone defriended you
          { //Starts the if condition
            alert('You was DeFriended by:\n' + WhoDefriendedME); //Shows who DeFriended you!
            for (var j = WhoDefriendedME.length; j--;) { //For every single MAL friend that defriended you and is saved on tampermonkey
              GM_deleteValue(WhoDefriendedME[j]); //Remove the defriended user name of the script storage
            } //Finishes the for loop
          } //Finishes the if condition
          else //If nobody defriended you
          { //Starts the else condition
            alert('Your current Friends list was updated and saved!\n Nobody Has DeFriended you!'); //Shows a message
          } //Finishes the else condition
          return;
        } //Finishes the if condition
        await new Promise(resolve => setTimeout(resolve, 600)); //Timeout to start the next fetch request
      } //Finishes the while condition
    } //Finishes the async function
  } //Finishes the if condition
  else //If the user is defriending a friend on https://myanimelist.net/myfriends.php?go=remove&id=
  { //Starts the else condition
    document.querySelector("input.inputButton").onclick = function() { //Detects the mouse click on the 'Remove Friend' button
      GM_deleteValue(document.querySelector("td.dialog-text > strong").innerText); //Remove the defriended user name of the script storage
    }; //Finishes the onclick advent listener
  } //Finishes the else condition
})();