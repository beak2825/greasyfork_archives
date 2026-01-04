// ==UserScript==
// @name         Mentioner - MAL
// @namespace    MALMentioner
// @version      17
// @description  Adds a button to mention the @user name on all users who have commented on any topics on MAL. The script also adds a search user name box near the box were the reply is written, so that you can search for any user that commented on that topic and click on the @UserName to auto paste it into the reply box.
// @author       hacker09
// @match        https://myanimelist.net/forum/?topicid=*
// @match        https://myanimelist.net/clubs.php?cid=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424818/Mentioner%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/424818/Mentioner%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var Executed = 0; //Create a new variable with the value 0
  const div = document.createElement('div'); //Create a new div element
  const textarea = document.createElement('textarea'); //Create a new textarea element
  var MALUserParsedList = []; //Creates an array to add all non-dup mal usernames on the page

  document.querySelectorAll('.username > a, div[style*="margin-bottom: 6px;"] > a, .item.name > a').forEach(function(UserName) { //For each username on the topic/club page
    if (!MALUserParsedList.includes(UserName.innerText) && UserName.innerText !== document.querySelector("a.header-profile-link").innerText && UserName.innerText !== 'removed-user') { //If the username isn't already on the array and if isn't the Script Username or a removed-user
      MALUserParsedList.push(UserName.innerText); //Add the username to the array

      window.jQuery('.username > a:contains("' + UserName.innerText + '"), .item.name a:contains("' + UserName.innerText + '")').parent().append(`<a title="Mention @${UserName.innerText}" onclick="document.querySelectorAll('.sourceMode > textarea').forEach(el => el.value += document.querySelector('.sourceMode > textarea').value === '' ? '@${UserName.innerText}\\n\\n' : '@${UserName.innerText}')" style="cursor: pointer; margin-left: 9px; height: 10px; width: 10px; background-size: cover; display: inline-block; transform: scale(1.5); vertical-align: top; margin-top: 2px; background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/hIfOM22.png' : 'https://i.imgur.com/vU0m0ye.png'});"></a>`);
      window.jQuery('div[style*="margin-bottom: 6px;"] > a:contains("' + UserName.innerText + '")').after(`<a title="Mention @${UserName.innerText}" onclick="document.querySelector('textarea').value += '@${UserName.innerText}'" style="cursor: pointer; margin-left: 9px; height: 10px; width: 10px; background-size: cover; display: inline-block; transform: scale(1.5); vertical-align: top; margin-top: 2px; background-image: url(${document.querySelector(".dark-mode") !== null ? 'https://i.imgur.com/hIfOM22.png' : 'https://i.imgur.com/vU0m0ye.png'});"></a>`); //Add the copy @UserName button to every username that replied on the comments
    } //Finishes the if condition
    MALUserParsedList = MALUserParsedList.filter(v => v !== document.querySelector("a.header-profile-link").innerText); //Remove the script user username of the array if the script user commented on the topic
    MALUserParsedList = MALUserParsedList.filter(v => v !== 'removed-user'); //Remove the 'removed-user' username of the array (if existent on the topic page)
  }); //Finishes the forEach loop

  textarea.setAttribute("id", "autocomplete-input"); //Adds an ID to the button
  textarea.setAttribute("placeholder", "Find User"); //Detects a mouse hover on the button and shows an explanation text
  textarea.setAttribute("style", "resize: none; margin-left: 360px; margin-bottom: 27px; margin-top: -26px;"); //The CSS for the "button"
  textarea.setAttribute("cols", "10"); //Adds a limit of cols to the button
  textarea.setAttribute("rows", "1"); //Adds a limit of rows to the button
  div.innerHTML = `<div id="autocomplete-list" style="margin-left: 358px; margin-top: -23px; cursor: pointer; width: 140px; height: 130px; overflow-y: scroll; display: none;"></div>`; //Adds the whole content for the div HTML

  textarea.addEventListener('click', (function() { //When the script text box is clicked
    Executed += 1; //Sum the total amount of times that the script text box was clicked
    if (Executed === 1) //If it's the first time that the script text box is clicked
    { //Starts the if condition
      document.querySelector("#autocomplete-list").style.display = ''; //Display the list containing the User Names
      MALUserParsedList.forEach(UserName => document.querySelector("#autocomplete-list").innerHTML += `<div title="Mention @${UserName}" onmouseout='this.style.color = ${document.querySelector(".dark-mode") !== null ? "\"white\"" : "\"black\""}' onmouseover='this.style.color = "#6386d5"' onclick='document.querySelectorAll(".sourceMode > textarea").forEach(el => el.value += document.querySelector(".sourceMode > textarea").value === "" ? "@${UserName}\\n\\n" : "@${UserName} ")'>\n@${UserName}</div>
`); //Add the @UserNames to the script div
    } //Finishes the if condition
  })); //Finishes the onclick event listener

  textarea.addEventListener('input', (function() { //When any letter is written on the script text box
    const matches = MALUserParsedList.filter(MALUserParsedList => MALUserParsedList.match(new RegExp(`^${this.value}`, 'gi'))); //Find the user input in the arrays
    document.querySelector("#autocomplete-list").innerHTML = ''; //Remove the previously displayed UserNames
    matches.forEach(UserName => document.querySelector("#autocomplete-list").innerHTML += `<div title="Mention @${UserName}" onmouseout='this.style.color = ${document.querySelector(".dark-mode") !== null ? "\"white\"" : "\"black\""}' onmouseover='this.style.color = "#6386d5"' onclick='document.querySelectorAll(".sourceMode > textarea").forEach(el => el.value += document.querySelector(".sourceMode > textarea").value === "" ? "@${UserName}\\n\\n" : "@${UserName} ")'>\n@${UserName}</div>
`); //Display the users found
  })); //Finishes the input event listener

  document.querySelectorAll(".topic-reply-box").forEach((el) => { //ForEach reply box
    el.onmouseenter = (e) => { //Add an onmouseenter event listener
      el.append(textarea, div); //Append the textarea and the div elements
    }; //Finishes the onmouseenter event listener
  }); //Finishes the forEach loop
})();