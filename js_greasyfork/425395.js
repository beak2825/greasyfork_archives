// ==UserScript==
// @name         Close Up to Date Script Pages
// @namespace    ScriptUpdateHelper
// @version      5
// @description  Auto closes the script page that you have already installed and that is already Up to Date. Auto Update and close the script page you have already installed and that ISN'T Up to Date. You have 3 secs to click anywhere to stop this script actions.
// @author       hacker09
// @include      /^https?:\/\/greasyfork\.org\/.*\/scripts/
// @exclude      /^https?:\/\/greasyfork\.org\/.*\/scripts\/.*\/(admin|stats|code|delete|derivatives|feedback|versions)/
// @exclude      https://greasyfork.org/en/scripts?q=*
// @exclude      https://greasyfork.org/en/scripts/by-site/*
// @exclude      https://greasyfork.org/en/scripts?language=*
// @exclude      https://greasyfork.org/*/scripts/*/versions/new
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://greasyfork.org/&size=64
// @grant        window.close
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425395/Close%20Up%20to%20Date%20Script%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/425395/Close%20Up%20to%20Date%20Script%20Pages.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var Close = setTimeout(function() { //Starts the settimeout function
    if (document.body.innerText.search("Update to version") > -1) //If the text "Update to version" is found on the script page
    { //Starts the if condition
      document.querySelector("a.install-link").click();
      window.top.close(); //Close the actual tab
    } //Finishes the if condition
    else { //Starts the if condition
      window.top.close(); //Close the actual tab
    } //Finishes the else condition
  }, 3000); //Run the script after 3 secs

  document.body.insertAdjacentHTML('beforeend', '<div id="Close" style="width: 100vw; height: 100vh; z-index: 2147483647; background: rgb(0 0 0 / 86%); position: fixed; top: 0px; font-size: 40px; color: white;"><center>You\'ve 3 secs to click Anywhere if you don\'t want the page to auto update/close</center></div>'); //Show an option to the user

  document.querySelector("#Close").onclick = function() { //If anywhere is clicked
    clearTimeout(Close); //Stop the auto Updating/Closing process
    document.querySelector("#Close").style.display = 'none'; //Hide the option
  } //Stop the Closing process if the user clicks anywhere
})();