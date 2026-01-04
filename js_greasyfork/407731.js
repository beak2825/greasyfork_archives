// ==UserScript==
// @name         Export Your Anime/Manga XML List On Any Page + Wayback Machine Your Profile.
// @namespace    http://tampermonkey.net/
// @version      26
// @description  Download your Anime/Manga XML list on entry pages in a single click. Also, save your profile BBCodes and all pages using the Wayback Machine.
// @author       hacker09
// @match        https://myanimelist.net/profile/*
// @exclude      https://myanimelist.net/profile/*/*
// @match        https://myanimelist.net/editprofile.php
// @match        https://myanimelist.net/panel.php?go=export
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407731/Export%20Your%20AnimeManga%20XML%20List%20On%20Any%20Page%20%2B%20Wayback%20Machine%20Your%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/407731/Export%20Your%20AnimeManga%20XML%20List%20On%20Any%20Page%20%2B%20Wayback%20Machine%20Your%20Profile.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const $ = jQuery; //Defines That The Symbol $ Is A jQuery
  const username = document.querySelector('a.header-profile-link').innerText; //Save the user name to a variable

  if (location.href === 'https://myanimelist.net/panel.php?go=export') { //If the user is on the export MAL page
    document.querySelector("input.inputButton").defaultValue = "Export My List Now"; //Change the export button text
  }
  //*****************************************************************************************************************************************************
  if (location.href.match(/^https:\/\/myanimelist\.net\/anime\/[\d]+(\/.*)?/) || location.href.match(/^https:\/\/myanimelist\.net\/manga\/[\d]+(\/.*)?/)) { //If the user is on a manga/anime page
    var type, downtype; //Make these variables global
    const token = document.head.querySelector("[name='csrf_token']").content; //Save the user csrf_token to a variable

    location.pathname.split('/')[1] === 'anime' ? (type = 'anime', downtype = 'type=1') : (type = 'manga', downtype = 'type=2'); //Set the page and download types
    const XMLBackupBTN = document.createElement("a"); //Creates the backup button element
    type === 'anime' ? XMLBackupBTN.innerHTML = "Backup My AnimeList" : XMLBackupBTN.innerHTML = "Backup My MangaList"; //Add the correct text to the button
    document.querySelector("span.information.type").parentElement.appendChild(XMLBackupBTN); //Add the button to the page
    XMLBackupBTN.setAttribute("id", "XMLBackupBTN"); //Adds an id to the button
    XMLBackupBTN.setAttribute("style", "cursor: pointer;margin-left: 15px;font-size: 10px;"); //Sets the CSS style of the button
    document.querySelector("#XMLBackupBTN").addEventListener("click", function() { //Add a click advent listener to the button
      (async function() { //Starts the async function
        const response = await fetch("https://myanimelist.net/panel.php?go=export2", { //Fetch the export MAL page
          "headers": { //Adds the header to the request
            "content-type": "application/x-www-form-urlencoded" //Set the content type
          }, //Ends the fetch request headers
          "body": downtype + "&subexport=Export+My+List&csrf_token=" + token, //Define the download type
          "method": "POST" //Fetch as POST
        }); //Finishes the fetch request
        const filename = response.headers.get('Content-Disposition').split(';')[1].split('=')[1].split('"')[1]; //Store the file name
        const blob = await response.blob(); //Gets the fetch response //Store the file bytes
        const link = document.createElement("a"); //Creates a new link element
        link.href = URL.createObjectURL(blob); //Add the file bytes as a blob link in the link element
        link.download = filename; //Add the file name and download to the link element
        link.click(); //Click on the link element
      }()); //Finishes the async function
    }, false); //Finishes the advent listener
  } //Finishes the if condition
  //*****************************************************************************************************************************************************
  if (location.href === 'https://myanimelist.net/editprofile.php') { //If the user is on the edit profile page
    document.querySelectorAll("textarea")[1].parentNode.insertAdjacentHTML('beforeend', '<a style="cursor: pointer;" id="Import"> Import Previous Profile BBCodes</a>'); //Append the Import btn below the textarea
    document.querySelector("#Import").onclick = function() //Detect the mouse click on the import button
    { //Starts the onclick function
      document.querySelectorAll("textarea")[1].value = GM_getValue("ProfileBBCodes"); //When the import btn is clicked return the previous ProfileBBCodes
    }; //Finishes the onclick function
  } //Finishes the if condition
  //*****************************************************************************************************************************************************
  if (location.href.match('profile/' + username) !== null) { //If the user is on his profile page
    const BackupProfileBTN = document.createElement("a"); //Creates the backup profile button element
    BackupProfileBTN.innerHTML = "Backup My Profile"; //Adds a text to the button
    document.querySelector("a.header-right.mt4.mr0").parentElement.appendChild(BackupProfileBTN); //Add the button to the page
    BackupProfileBTN.setAttribute("id", "BackupProfileBTN"); //Set an id to the button
    BackupProfileBTN.setAttribute("style", "cursor: pointer;margin-left: 15px;font-size: 10px;"); //Set the button css style
    document.querySelector("#BackupProfileBTN").addEventListener("click", saveprofileonarchiveorg, false); //Add a click advent listener to the button

    function saveprofileonarchiveorg() { //Starts the function to backup the user profile
      function iFrameLoaded(id, src) { //Creates a function
        const deferred = $.Deferred(),
          iframe = $("<iframe id='iframe'></iframe>").attr({ //Creates the iframe
            "id": id, //Sets the iframe id
            "src": src //Sets the iframe source
          }); //Finishes the attrib

        iframe.load(deferred.resolve); //Load the page and wait to be fully loaded
        iframe.appendTo("body"); //Add the iframe to the actual page body

        deferred.done(function() { //When the iframe finished loading
          console.log("iframe loaded: " + id); //Show a message on the browser console for dev purposes
        }); //Finishes the function

        return deferred.promise();
      } //Finishes the IframeLoaded function
      $.when(iFrameLoaded("Update MALGraph", "https://anime.plus/" + username + "/queue-add"),
          iFrameLoaded("Update Badges", "https://www.mal-badges.net/users/" + username + "/update"),
          iFrameLoaded("Currently Watching", "https://web.archive.org/save/https://myanimelist.net/animelist/" + username + "?status=1"),
          iFrameLoaded("Completed", "https://web.archive.org/save/https://myanimelist.net/animelist/" + username + "?status=2"),
          iFrameLoaded("On Hold", "https://web.archive.org/save/https://myanimelist.net/animelist/" + username + "?status=3"),
          iFrameLoaded("Dropped", "https://web.archive.org/save/https://myanimelist.net/animelist/" + username + "?status=4"),
          iFrameLoaded("Plan to Watch", "https://web.archive.org/save/https://myanimelist.net/animelist/" + username + "?status=6"),
          iFrameLoaded("Topics in Forum Replied To", "https://web.archive.org/save/https://myanimelist.net/forum/search?u=" + username + "&q=&uloc=1&loc=-1"),
          iFrameLoaded("MAL History", "https://web.archive.org/save/https://myanimelist.net/history/" + username + "/anime"),
          iFrameLoaded("Profile texts/statistics/Favorites/Comments and 12 Friends", "https://web.archive.org/save/https://myanimelist.net/profile/" + username + "#statistics"),
          iFrameLoaded("Clubs", "https://web.archive.org/save/https://myanimelist.net/profile/" + username + "/clubs"),
          iFrameLoaded("Recommendations", "https://web.archive.org/save/https://myanimelist.net/profile/" + username + "/recommendations"),
          iFrameLoaded("Reviews", "https://web.archive.org/save/https://myanimelist.net/profile/" + username + "/reviews"))
        .then(function() { //After all iframes finished loading

          (async () => { //Creates a function to get the ProfileBBCpdes and Starts the function
            const response = await (await fetch('https://myanimelist.net/editprofile.php')).text(); //Fetch
            const newDocument = new DOMParser().parseFromString(response, 'text/html'); //Parses the fetch response
            GM_setValue("ProfileBBCodes", newDocument.querySelectorAll("textarea")[1].value); //Store the ProfileBBCodes
            close(); //Close the actual tab
          })(); //Finishes the async function
        }); //Finishes the "then" function
    } //Finishes the saveprofileonarchiveorg function
  } //Finishes the if condition
})();