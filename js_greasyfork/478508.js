// ==UserScript==
// @name         Ultimate Popup Blocker
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Configurable popup blocker that blocks all popup windows by default.
// @author       hacker09
// @include      *
// @icon         https://i.imgur.com/6SGMd42.png
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/478508/Ultimate%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/478508/Ultimate%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var upb_counter = 0; //Count amount of blocked popups
  var timeleft = 10; //Create a variable to hold the time left

  GM_registerMenuCommand('Configure popup permissions', () => { open('https://f.org/ultimate-popup-blocker/settings.html', '_blank'); }); //Add a settings page on the Tampermonkey menu

  if (!GM_getValue(`trusted_${location.host}`)) { //Override the browser default "window.open" implementation with the script fakeWindowOpen method
    unsafeWindow.open = (function(Url) { //Run the script fake Window Open function below when the browser tries to open a new window
      if (timeleft === 10 && document.querySelector("#upb_menu") === null) { //If the time left is exactly 10 secs and the menu has not been created yet
        upb_counter += 1; //Count the amount of blocked popups

        document.body.insertAdjacentHTML('beforeend', `<div id="upb_menu" title="${Url}" style="position: fixed; bottom: 0px; left: 0px; z-index: 99999; padding: 5px; font: inherit; background-color: black; color: white; cursor: help; display: block;">Allow <b><u>${location.host}</u></b> to open a popup? <b>(${upb_counter})</b></div>`); //Add the script menu on the page

        [{ text: 'Allow ↗️', id: 'upb_open', clickCallback: () => { open(Url, '_blank'); document.querySelector("#upb_menu").style.display = 'none'; } }, { text: 'Always Allow ✅', id: 'upb_trust', clickCallback: () => { GM_setValue(`trusted_${location.host}`, true); open(Url, '_blank'); document.querySelector("#upb_menu").style.display = 'none'; } }, { text: `Deny (${timeleft}) ❌`, id: 'upb_close', clickCallback: () => { document.querySelector("#upb_menu").style.display = 'none'; }, inlineStyle: 'background-color:#a00;color:white;' },{ text: 'Config ⚙️', id: 'upb_config', clickCallback: () => { open('https://f.org/ultimate-popup-blocker/settings.html', '_blank'); }, inlineStyle: 'float:right;margin:0 10px 0 0;' } ].forEach(button => { //ForEach menu buttons data
          document.querySelector("#upb_menu").insertAdjacentHTML('beforeend', `<button id="${button.id}" style="cursor:pointer;margin:0 5px;padding:1px 3px;background-color:rgb(255,255,255);border:0;border-radius:5px;color:black;${button.inlineStyle || ''}">${button.text}</button>`); //Add the all buttons on the menu
          document.getElementById(button.id).addEventListener('click', button.clickCallback); //Add a click function to each button
        }); //Finishes the ForEach loop

        const Timer = setInterval(() => { //Start a interval function checker
          document.getElementById('upb_close').innerHTML = `Deny (${timeleft}) ❌`; //Update the displayed timer
          timeleft -= 1; //Decrease the time left
          if (timeleft < 0) { //If the time left is less than 0
            clearInterval(Timer); //Stop the timer from running
            document.querySelector("#upb_menu").remove(); //Remove the script menu
            timeleft = 10; //Reset the time left
          } //Finishes the if condition
        }, 1000); //Update the displayed timer each second
      } //Finishes the if condition
      return { blur() { return false; }, focus() { return false; }, }; }); //Return the fake window function to not encounter JS runtime error when the popup originator page wants to call focus() or blur()
  } //Finishes the if condition

  if (location.href === 'https://f.org/ultimate-popup-blocker/settings.html') { //If the user is on the page settings website
    document.head.remove(); //Remove the current page head
    document.body.remove(); //Remove the current page body
    document.querySelector("html").innerHTML = `<title>[UPB] Permission manager</title><style>body { margin: 0; min-width: 250px; } * { box-sizing: border-box; } ul { margin: 0; padding: 0; } ul li { position: relative; padding: 12px 8px 12px 40px; list-style-type: none; background: #eee; font-size: 18px; transition: 0.2s; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } ul li:nth-child(odd) { background: #f9f9f9; } ul li:hover { background: #ddd; } .close { cursor: pointer; position: absolute; right: 0; top: 0; padding: 12px 16px 12px 16px; } .close:hover { background-color: #f44336; color: white; } .header { background-color: #000000; padding: 30px 40px; color: white; text-align: center; } .title { margin: 5px; } .subtitle { text-align: left; } .header:after { content: ""; display: table; clear: both; } .footer { background-color: #000000; padding: 5px 40px; color: white; } input { margin: 0; border: none; border-radius: 0; width: 75%; height: 45px; padding: 10px; float: left; font-size: 16px; } .addBtn { padding: 10px; width: 25%; height: 45px; background: #d9d9d9; color: #555; float: left; text-align: center; font-size: 16px; cursor: pointer; transition: 0.3s; border-radius: 0; } .addBtn:hover { background-color: #bbb; }</style></head><body><div class="header"><h2 class="title">Ultimate Popup Blocker</h2><h3 class="subtitle">Trusted websites:</h3><input type="text" id="Input" placeholder="e.g. reddit.com"><span class="addBtn">Add</span></div><ul id="List"></ul><div class="footer"><h4 class="subtitle">All data is stored in the UserScript's local storage.</h4></div></body> `; //Add the script settings page on the website

    document.getElementsByClassName('addBtn')[0].addEventListener('click', () => { //If the Add Button is clicked on the page
      if (document.getElementById('Input').value !== '') { //If the user is not trying to add a blank domain
        GM_setValue(`trusted_${document.getElementById('Input').value}`, true); //Add the domain on the Tampermonkey storage
      } //Finishes the if condition
      document.getElementById('Input').value = ''; //Reset the domain the user wrote
    }); //Finishes the onclick function

    GM_listValues().forEach(function(StoredDomain) { //For each domain on the Tampermonkey storage
      document.getElementById('List').insertAdjacentHTML('beforeend', `<li>${StoredDomain.replace('trusted_', '')}<span class='close'>✘</span></li>`); //Add the domain/close button into the list
      document.querySelector('li:last-child .close').onclick = function() { //Select the last added close button and add a click even to trigger when the X is clicked
        GM_deleteValue(`trusted_${this.parentElement.innerText.replace('\n✘', '')}`); //Remove the domain from the Tampermonkey storage
        this.parentElement.style.display = 'none'; //Hide the removed domain from the page list
      }; //Finishes the onclick function
    }); //Finishes the function
  } //Finishes the if condition
})();