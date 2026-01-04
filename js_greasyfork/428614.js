// ==UserScript==
// @name         Approved Entries Notifier - MAL
// @namespace    NotifyWhenApproved
// @version      21
// @description  Auto-perform a few checks daily to notify you when specific anime/manga entries get approved or denied.
// @author       hacker09
// @match        https://myanimelist.net/*
// @match        https://purarue.xyz/mal_unapproved/*
// @exclude      https://purarue.xyz/mal_unapproved/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/428614/Approved%20Entries%20Notifier%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/428614/Approved%20Entries%20Notifier%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  const TabTitle = document.title; //Save the current tab title
  const ActualTime = new Date().valueOf(); //Save the actual time in a variable
  const Three_Hours_From_LastTime = new Date().setTime(GM_getValue('Last_Check_Hour') + 2 * 3600000); //Check when it's going to be 2 hours from the last check time
  var ApprovedAnimeLinks = [], ApprovedMangaLinks = [], UnnapprovedAnimes = [], UnnapprovedMangas = [], CheckApprovedAnimes = [], CheckApprovedMangas = []; //Create new blank arrays
  //Convert the variable Three_Hours_From_LastTime from ms to the locale date new Date(new Date().setTime(Three_Hours_From_LastTime)).toLocaleString()

  if (GM_getValue('HentaiNotifications') === undefined) //If the user didn't set the Hentai Notifications option
  { //Starts the if condition
    GM_setValue('HentaiNotifications', false); //Get and save the Hentai Notifications user choice, defaulting the choice to false
    if (confirm('Click OK if you want to be notified when all new Hentai Anime entries are approved/denied')) //Ask the user choice
    { //Starts the if condition
      GM_setValue('HentaiNotifications', true); //Get and save the Hentai Notifications user choice
    } //Finishes the if condition
  } //Finishes the if condition

  GM_listValues().forEach(function(el) { //For each stored value on tampermonkey
    if (el.match('anime') !== null) //If the saved value is an anime id
    { //Starts the if condition
      CheckApprovedAnimes.push(el); //Add the stored anime id to an array
    } //Finishes the if condition
    //if (el.match('manga') !== null) //If the saved value is a manga id
    //{ //Starts the if condition
      //CheckApprovedMangas.push(el); //Add the stored manga id to an array
    //} //Finishes the if condition
  }); //Add all Entry IDs and types on Tampermonkey to the array

  if (location.host === 'myanimelist.net' && GM_getValue('Last_Check_Hour') === undefined || ActualTime >= Three_Hours_From_LastTime && GM_listValues().length > 1) { //If the Last_Check_Hour variable wasn't set yet, or if 2 or more hours since the last check time has passed, and if there's at least 1 stored entry on tampermonkey, and if the user is on MAL
    document.title = 'Checking Approved Entries'; //Change the tab title
    GM_setValue('Last_Check_Hour', ActualTime); //Get and save the last check hour
    const newDocument = await (await fetch('https://purarue.xyz/mal_unapproved/api/anime')).json(); //Parses the fetch response
    newDocument.forEach(function(el) { //For each currently unapproved anime
      if (GM_getValue('HentaiNotifications') === true && el.nsfw === true) //If the user wants to get hentai notifications and the unapproved anime is hentai
      { //Starts the if condition
        GM_setValue(el.id + 'anime', ''); //Get and save the Hentai Entry ID and the Entry type
      } //Finishes the if condition
      UnnapprovedAnimes.push(el.id); //Store all unapproved anime entries on the array
    }) //Finishes the For each loop

    const newDocument2 = await (await fetch('https://purarue.xyz/mal_unapproved/api/manga')).json(); //Parses the fetch response
    newDocument2.forEach(el => UnnapprovedMangas.push(el.id)); //Store all unnapproved manga entries on the array

    const FinalApprovedAnimesArray = CheckApprovedAnimes.filter(el => !UnnapprovedAnimes.includes(parseInt(el.match(/\d+/)[0]))); //Get the entry ids that the user is waiting to be approved, but purarue's website is missing
    const FinalApprovedMangasArray = CheckApprovedMangas.filter(el => !UnnapprovedMangas.includes(parseInt(el.match(/\d+/)[0]))); //Get the entry ids that the user is waiting to be approved, but purarue's website is missing

    if (FinalApprovedAnimesArray.length !== 0 || FinalApprovedMangasArray.length !== 0) //If there's at least 1 entry ID we want to know that got approved and is not on purarue's website (the entry got approved)
    { //Starts the if condition
      FinalApprovedAnimesArray.forEach(el => ApprovedAnimeLinks.push('https://myanimelist.net/anime/' + el.match(/\d+/)[0])); //Create an array of approved anime links
      FinalApprovedMangasArray.forEach(el => ApprovedMangaLinks.push('https://myanimelist.net/manga/' + el.match(/\d+/)[0])); //Create an array of approved manga links

      window.onload = function() { //Starts the function when the website finished loading
        GM_notification({ //Shows a browser notification
          title: 'Found Approved Entries',
          text: 'Click here to open or copy the approved entries links',
          image: 'https://i.imgur.com/RmsXhIl.jpg',
          highlight: true,
          silent: true,
          timeout: 15000, //Define the browser notification details
          onclick: () => { //If the browser notification is clicked

            const JoinedArrays = ApprovedAnimeLinks.concat(ApprovedMangaLinks); //Join both arrays
            if (confirm('Click on OK to open ' + JoinedArrays.length + ' approved entries links\nClick on Cancel to copy ' + JoinedArrays.length + ' approved entries links')) { //Give an option to the user
              JoinedArrays.forEach(el => GM_openInTab(el)); //Open all the approved entries links
              FinalApprovedAnimesArray.forEach(el => GM_deleteValue(el)); //Erase all the approved animes IDs stored on tampermonkey
              FinalApprovedMangasArray.forEach(el => GM_deleteValue(el)); //Erase all the approved mangas IDs stored on tampermonkey
            } //Finishes the if condition
            else //If the user clicks on Cancel
            { //Starts the else condition
              GM_setClipboard(JoinedArrays.join('\n')); //Copy the approved entries links
              FinalApprovedAnimesArray.forEach(el => GM_deleteValue(el)); //Erase all the approved animes IDs stored on tampermonkey
              FinalApprovedMangasArray.forEach(el => GM_deleteValue(el)); //Erase all the approved mangas IDs stored on tampermonkey
            } //Finishes the else condition

            window.focus(); //Refocus on the actual tab
          } //Finishes the onclick event listener
        }); //Finishes the browser notification definitions
      }; //Finishes the onload event listener

    } //Finishes the if condition
    document.title = TabTitle; //Return the original tab title
  } //Finishes the if condition

  if (CheckApprovedAnimes.length !== 0) //If both arrays have values in them
    //&& CheckApprovedMangas.length !== 0
  { //Starts the if condition
    var ALLAnimesAndMangasArray = CheckApprovedAnimes.concat([]); //Get ALL the entry IDs that the user is waiting to be approved
    //CheckApprovedMangas
  } //Finishes the if condition
  else if (CheckApprovedAnimes.length !== 0) //If the CheckApprovedAnimes array has values in it
  { //Starts the else condition
    ALLAnimesAndMangasArray = CheckApprovedAnimes; //Get ALL anime entry IDs that the user is waiting to be approved
  } //Finishes the else condition
  else //Only the CheckApprovedMangas array has values in it
  { //Starts the else condition
    //ALLAnimesAndMangasArray = CheckApprovedMangas; //Get ALL manga entry IDs that the user is waiting to be approved
  } //Finishes the else condition

  if (location.host === 'purarue.xyz') //If the user is on the purarue.xyz website
  { //Starts the if condition
    document.querySelector("div.buttons").insertAdjacentHTML('beforeend', '<a class="button" id="Storage" href="javascript:void(0);">Show only script ' + location.href.split('/')[4] + ' entries</a>'); //Add a BTN on the page
    document.querySelector("#Storage").onclick = function() { //When the script BTN is clicked
      document.querySelectorAll("#mal-unapproved > ol > li").forEach(function(el) { //For each currently unapproved entry
        if (ALLAnimesAndMangasArray.includes(el.innerText.match(/\d+/)[0] + location.href.split('/')[4]) !== true) //If the unapproved entry is not on the script storage
        { //Starts the if condition
          el.remove(); //Remove of the website view
        } //Finishes the if condition
      }) //Finishes the forEach condition
    }; //Finishes the onclick event listener
  } //Finishes the if condition

  if (document.querySelector("span.disabled-btn-user-status-add-list") !== null && location.host === 'myanimelist.net') //If an unapproved entry was opened and if the user is on MAL
  { //Starts the if condition
    document.querySelector("span.disabled-btn-user-status-add-list").className = 'btn-user-status-add-list js-form-user-status js-form-user-status-btn  myinfo_addtolist'; //Make the button look better

    const entryid = location.pathname.match(/\d+/)[0]; //Detect the entry id
    if (ALLAnimesAndMangasArray.includes(entryid + location.pathname.split('/')[1]) === true) //If the current entry id is on the waiting to be approved script list
    { //Starts the if condition
      document.querySelector("span.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").innerText = 'Already waiting for Approval'; //Show to the user that the user will already get notified to know when the entry gets approved
    } //Finishes the if condition
    else //If the current entry ID is not in the waiting for Approval script list
    { //Starts the else condition
      document.querySelector("span.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").innerText = 'Notify when Approved'; //Give the user the option to get notified to know when the entry gets approved
      document.querySelector("span.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").onclick = function() //If the Notify when Approved button is clicked
      { //Starts the onclick listener
        GM_notification({ //Shows a browser notification
          title: "You will be notified when this entry gets approved!",
          text: ' ',
          image: 'https://i.imgur.com/RmsXhIl.jpg',
          highlight: true,
          silent: true,
          timeout: 2000, //Define the browser notification details
          onclick: () => { //If the browser notification is clicked
            window.focus(); //Refocus on the tab
          } //Finishes the onclick event listener
        }); //Finishes the browser notification definitions

        GM_setValue(location.pathname.match(/\d+/)[0] + location.pathname.split('/')[1], ''); //Get and save the Entry id and entry type
      }; //Finishes the onclick listener
    } //Finishes the else condition
    document.querySelector("div.js-myinfo-error.badresult-text.al.pb4").remove(); //Remove the error message
  } //Finishes the if condition
})();