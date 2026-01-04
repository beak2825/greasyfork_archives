// ==UserScript==
// @name         Affinity to You
// @namespace    AffinityShow
// @version      22
// @description  Shows the "Affinity to You" % that all users who have commented on any topic on MAL have with you!
// @author       hacker09
// @match        https://myanimelist.net/*/*/*/stats*
// @match        https://myanimelist.net/forum/?topicid=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/423918/Affinity%20to%20You.user.js
// @updateURL https://update.greasyfork.org/scripts/423918/Affinity%20to%20You.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var TimesExecuted = 0; //Create a new global variable
  var UserAffinityList = []; //Create a new global array
  var MALUserParsedList = new Map(); //Creates a new map to later add all non-dup mal usernames on the page

  const AffinityList = document.createElement("button"); //Creates a btn element
  AffinityList.setAttribute("style", "display: none; background-color: snow; margin-left: 10px;"); //The CSS for the "button"
  AffinityList.setAttribute("class", "inputButton"); //Adds a class to the button

  const ShowAffinityList = document.createElement("input"); //Creates an a element
  ShowAffinityList.setAttribute("style", "background-color: #4165ba;"); //The CSS for the input btn
  ShowAffinityList.setAttribute("class", "inputButton"); //Adds a class to the input btn
  ShowAffinityList.setAttribute("value", "      Show Affinity list"); //Adds the input btn default text
  ShowAffinityList.setAttribute("readonly", "readonly"); //Make the input btn default text not editable

  if (document.querySelector("#post1, .js-topic-top") === null) //If the user is using the conversation view or if the topic has nearly no replies while using the conversation view
  { //Starts the if condition
    document.querySelector(".left > span.caption, #members").before(ShowAffinityList, AffinityList); //Append the button and the input btn text next to the reply btn
  } //Finishes the if condition
  else //if the user is not using the conversation view or if the topic has nearly no replies while using the classic view
  { //Starts the else condition
    document.querySelector(".topic-reply-container.hide") === null ? document.querySelector(".js-topic-top").before(ShowAffinityList, AffinityList) : document.querySelector(".topic-reply-container:not(.hide) > div > div > .js-reply-start").after(ShowAffinityList, AffinityList); //Append the button and the input btn text next to the reply btn
  } //Finishes the else condition

  ShowAffinityList.onclick = function() { //When the Show Affinity button is clicked
    if (AffinityList.style.display === 'none') { //If the Affinity list is hidden
      AffinityList.style.display = ''; //Show the Affinity List
      ShowAffinityList.value = "      Hide Affinity list"; //Change the Show Affinity List text to Hide Affinity List
    } else { //If the Affinity list is being shown
      AffinityList.style.display = 'none'; //Hide the Affinity List
      ShowAffinityList.value = "      Show Affinity list"; //Change the Hide Affinity List text to Show Affinity List
    } //Finishes the else condition
  }; //Finishes the onclick event listener

  if (GM_getValue('Date') === undefined) //If the date wasn't yet stored on tampermonkey
  { //Starts the if condition
    GM_setValue('Date', new Date().getMonth()); //Get and save the actual month as a number
  } //Finishes the if condition

  if (new Date().getMonth() !== GM_getValue('Date')) //If the month number stored on tampermonkey is a previous month
  { //Starts the if condition
    GM_listValues().forEach(function(a) { //ForEach data stored on tampermonkey
      if (a !== GM_getValue('Date')) //If the current looped element isn't the past month number stored on tampermonkey
      { //Starts the if condition
        GM_deleteValue(a); //Delete the actual looped value of the TamperMonkey storage
      } //Finishes the if condition
    }); //Finishes the foreach condition to erase all the users stored on tampermonkey
  } //Finishes the if condition

  window.onscroll = function() { //Starts the onscroll event listener
    TimesExecuted += 1; //Sum the total amount of times that the page was scrolled
    if (TimesExecuted === 1) //If it's the first time that the page was scrolled
    { //Starts the if condition
      MALUserParsedList.set(document.querySelector("a.header-profile-link").innerText, {}); //Add the script username to the map,so that the script won't fetch the script user profile
      MALUserParsedList.set('removed-user', {}); //Add the 'removed-user' username to the map, so that the script won't fetch the nonexistent user profile
      document.querySelectorAll('.username, .item.name, .word-break').forEach(async function(UserName) { //Execute this function for each username on the topic page

        if (!MALUserParsedList.has(UserName.innerText) && GM_getValue(UserName.innerText) !== undefined) { //If the username isn't already on the map and is stored on tampermonkey
          MALUserParsedList.set(UserName.innerText, {}); //Add the username on the map

          if (GM_getValue(UserName.innerText).match(/-\d+(?:\.\d+)?(?=%)/) === null && GM_getValue(UserName.innerText).match('Unknown') === null) //If the - symbol doesn't exist and if the affinity isn't Unknown on the tampermonkey stored data for this user
          { //Starts the if condition
            UserAffinityList.push('<a href="https://myanimelist.net/profile/' + UserName.innerText + '" target="_blank" style="cursor: pointer;"  title="Click to open the ' + UserName.innerText + '\'s Profile">' + UserName.innerText + ' ' + GM_getValue(UserName.innerText).match(/\d+(?:\.\d+)?(?=%)/)[0] + '%</a>'); //Store all the topic User Names and links
          } //Finishes the if condition

          [...document.querySelectorAll('.username, .item.name, .word-break')].filter(a => a.textContent.includes(UserName.innerText)).forEach(a => a.parentNode.insertAdjacentHTML("beforeend", '<br>' + GM_getValue(UserName.innerText))); //Add the affinity % to every topic reply that matches the fetched profile username
        } //Finishes the if condition

        if (!MALUserParsedList.has(UserName.innerText) && GM_getValue(UserName.innerText) === undefined) { //If the username isn't already on the map and isn't stored on tampermonkey
          MALUserParsedList.set(UserName.innerText, {}); //Add the username on the map

          const html = await (await fetch('https://myanimelist.net/profile/' + UserName.innerText)).text(); //Gets the fetch response
          var newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response
          var AffinityPercentage = newDocument.querySelector("span[class*='bar-inner']") !== null ? newDocument.querySelector("span[class*='bar-inner']").innerText.replace('--', '-').trim() : ' Unknown'; //Make the variable global

          if (AffinityPercentage.match('-') === null && AffinityPercentage.match('Unknown') === null) //If the - symbol doesn't exist and if the affinity isn't Unknown
          { //Starts the if condition
            UserAffinityList.push('<a href="https://myanimelist.net/profile/' + UserName.innerText + '" target="_blank" style="cursor: pointer;" title="Click to open the ' + UserName.innerText + '\'s Profile">' + UserName.innerText + ' ' + AffinityPercentage + '</a>'); //Store all the topic User Names and links
          } //Finishes the if condition

          AffinityPercentage = '<a href="https://myanimelist.net/sharedanime.php?u1=' + UserName.innerText + '&u2=' + document.querySelector("a.header-profile-link").innerText + '" target="_blank" style="cursor: pointer;" title="Click to open the Shared Anime page between you and ' + UserName.innerText + '"><strong style="color:' + (AffinityPercentage.match('-') === null && AffinityPercentage.match('Unknown') === null ? "blue" : "red") + '; font-weight: normal;">Affinity to You ' + AffinityPercentage + '</strong></a>'; //Make the text blue/red

          GM_setValue(UserName.innerText, AffinityPercentage); //Get and save the UserName and the AffinityPercentage on tampermonkey
          [...document.querySelectorAll('.username, .item.name, .word-break')].filter(a => a.textContent.includes(UserName.innerText)).forEach(a => a.parentNode.insertAdjacentHTML("beforeend", AffinityPercentage)); //Add the affinity % to every topic reply that matches the fetched profile username
        } //Finishes the if condition

        if (UserAffinityList.length != 0) //If there are any users that have a positive affinity with you in the page
        { //Starts the if condition
          AffinityList.innerHTML = UserAffinityList.sort(function(a, b) { //Add the sorted list to the button element
            var aA = parseFloat(a.match(/\d+(?:\.\d+)?(?=%)/)); //Get only the Affinity % number
            var bA = parseFloat(b.match(/\d+(?:\.\d+)?(?=%)/)); //Get only the Affinity % number
            return bA > aA ? 1 : -1; //Compare the Affinity % and sort the array
          }).join('<br><br>'); //Finishes the sorting condition and add "spaces" between the links
        } //Finishes the if condition
        else //If there are NO users that have a positive affinity with you in the page
        { //Starts the else condition
          AffinityList.innerHTML = '<strong style="color:red; font-weight: normal;">No one here has a positive affinity with you</strong>'; //Add a text
        } //Finishes the else condition

      }); //Finishes the async function
    } //Finishes the if condition
  }; //Finishes the onscroll event listener
})();