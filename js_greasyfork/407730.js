// ==UserScript==
// @name         Automatically Add Start/Finish Dates For Animes/Mangas + Helpful Buttons
// @namespace    Add End And Start Dates In 1 Click + Reset Dates/All Buttons,
// @version      45
// @description  Selecting Watching/Reading auto adds the start date, and Completed auto adds the finish date. Shows the actual Anime/Manga dates below the Anime/Manga image, which is updated every time you reload or click on Watching/Reading/Completed. Hover the mouse over the dates and click to reset them. This script adds 6 helpful buttons on the Anime/Manga Edit Details Page.
// @author       hacker09
// @match        https://myanimelist.net/ownlist/*
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407730/Automatically%20Add%20StartFinish%20Dates%20For%20AnimesMangas%20%2B%20Helpful%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/407730/Automatically%20Add%20StartFinish%20Dates%20For%20AnimesMangas%20%2B%20Helpful%20Buttons.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.pathname.split('/')[1] === 'ownlist') //Check If The User Is On https://myanimelist.net/ownlist/
  {
    const $ = window.jQuery; //Defines That The Symbol $ Is A jQuery
    const entrytype = location.pathname.split('/')[2]; //Get the entry type
    //**********************************************************************************************************************************************************************
    document.querySelector("#start_date_insert_today").parentElement.insertAdjacentHTML('beforeend', '<a id="resetstart" style="cursor: pointer;margin-left: 5px;height: 10px;width: 10px;top: 10px;">Reset</a>'); //Adds a reset btn on the page
    document.getElementById('resetstart').onclick = function() { //Adds an event listener to the button
      document.querySelectorAll("#add_" + entrytype + "_start_date_year,#add_" + entrytype + "_start_date_day,#add_" + entrytype + "_start_date_month").forEach(el => el.selectedIndex = -1); //Reset the start dates
    }; //Finishes the event listener
    //**********************************************************************************************************************************************************************
    document.querySelector("#end_date_insert_today").parentElement.insertAdjacentHTML('beforeend', '<a id="resetend" style="cursor: pointer;margin-left: 5px;height: 10px;width: 10px;top: 10px;">Reset</a>'); //Adds a reset btn on the page
    document.getElementById('resetend').onclick = function() { //Adds an event listener to the button
      document.querySelectorAll("#add_" + entrytype + "_finish_date_year,#add_" + entrytype + "_finish_date_day,#add_" + entrytype + "_finish_date_month").forEach(el => el.selectedIndex = -1); //Reset the finish dates
    }; //Finishes the event listener
    //**********************************************************************************************************************************************************************
    document.querySelector('.notice_open_public').insertAdjacentHTML('beforeend', '<a id="addalldates" style="cursor: pointer;margin-left: 5px;height: 10px;width: 10px;top: 10px;">Add End And Start Dates + Submit</a>'); //Adds the add all dates btn on the page
    document.getElementById('addalldates').onclick = function() { //Adds an event listener to the button
      document.querySelectorAll("#start_date_insert_today,#end_date_insert_today").forEach(el => el.click()); //Add dates
      document.getElementsByClassName("inputButton main_submit")[0].click(); //Submit
    }; //Finishes the event listener
    //**********************************************************************************************************************************************************************
    [...document.querySelectorAll("td")].find(td => td.textContent === "Start Date").parentElement.insertAdjacentHTML('beforeend', '<a id="InsertStart" style="cursor: pointer;margin-left: -200px; margin-top: -3px; display: block;">Insert + Submit</a>'); //Adds the add start dates button on the page
    document.getElementById('InsertStart').onclick = function() { //Adds an event listener to the button
      document.getElementById("start_date_insert_today").click(); //Adds the start date
      document.getElementsByClassName("inputButton main_submit")[0].click(); //Submit
    }; //Finishes the event listener
    //**********************************************************************************************************************************************************************
    [...document.querySelectorAll("td")].find(td => td.textContent === "Finish Date").parentElement.insertAdjacentHTML('beforeend', '<a id="InsertEnd" style="cursor: pointer;margin-left: -200px; margin-top: 30px; display: block;">Insert + Submit</a>'); //Adds the add finish dates button on the page
    document.getElementById('InsertEnd').onclick = function() { //Adds an event listener to the button
      document.getElementById("end_date_insert_today").click(); //Adds the finish date
      document.getElementsByClassName("inputButton main_submit")[0].click(); //Submit
    }; //Finishes the event listener
    //**********************************************************************************************************************************************************************
    document.querySelector("#advanced-button").parentElement.insertAdjacentHTML('beforeend', '<a id="resetalmostall" style="cursor: pointer;margin-left: 240px;">Reset Almost Everything</a>'); //Adds the reset almost all button on the page
    document.getElementById('resetalmostall').onclick = function() { //Adds an event listener to the button
      $('select').prop('selectedIndex', 0); //Resets almost all form fields
    }; //Finishes the event listener
    //**********************************************************************************************************************************************************************
    setTimeout(function() { //Starts the timeout condition
      if (document.querySelectorAll("#hide-advanced-button")[0].outerText !== "Hide Advanced ") //Detect if the Show Advanced button is already opened or not,if not then...
      { //Starts the if condition
        document.querySelector("#hide-advanced-button").click(); //Clicks on the Show Advanced button
      } //Finishes the if condition
    }, 0); //Finishes the settimeout
  } //Finishes the if condition
  //**********************************************************************************************************************************************************************
  else //If the user is on a manga/anime page
  { //Starts the else condition
    const day = new Date().getDate(); //Creates a variable to hold the actual day
    const month = new Date().getMonth() + 1; //Creates a variable to hold the actual month
    const year = new Date().getFullYear(); //Creates a variable to hold the actual year
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; //Creates a variable to hold the month names
    const entrytype2 = location.pathname.split('/')[1].match('.php') !== null ? location.pathname.split('/')[1].split('.php')[0] : location.pathname.split('/')[1]; //Creates a variable to hold the actual entry type
    const token = document.head.querySelector("[name='csrf_token']").content; //Creates a variable to hold the actual csrf_token
    const entryid = location.pathname.match(/\d+/) === null ? location.search.match(/\d+/)[0] : location.pathname.match(/\d+/)[0]; //Creates a variable to hold the actual entry id
    var priority, is_asked_to_discuss, sns_post_type, start_month, start_day, start_year, finish_month, finish_day, finish_year, watched_eps, current_score, anime_tags, storage_type, storage_value, rewatched_times, rewatch_value, comments, manga_read_chapters, manga_retail, manga_read_times, manga_reread_value, manga_read_volumes, status, IsEditPageOpened, totaleps, totalVols, totalChaps, AddedToList, color; //Make all these variables global

    document.querySelector(".dark-mode") !== null ? color = '' : color = '#1d439b'; //Change the btns txt color according to the user theme mode

    async function ShowButtons() //Creates a function to show the Buttons
    { //Starts the function
      //Starts the code to display the Started Date
      if ((start_month !== "") || (start_day !== "") || (start_year !== "")) // If month or date or year is set in the started dates, then show the button
      { //Starts the if condition
        var ShowStartedMonth = monthNames[start_month - 1]; //Suppose the month is set and show it
        if (ShowStartedMonth === undefined) // If month is not set in the started dates
        { //Starts the if condition
          ShowStartedMonth = ''; //Hide the started month
        } //Finishes the if condition
        const ResetStartDate = document.createElement("div"); //Creates the button to reset the start date
        ResetStartDate.innerHTML = 'Started: ' + ShowStartedMonth + ' ' + start_day + ' ' + start_year; //Define the button text
        document.querySelector("#profileRows").append(ResetStartDate); //Append the button below the "add to favorites" button
        ResetStartDate.setAttribute("id", "ResetStartDate"); //Gives an id to the button
        if (document.querySelectorAll("#ResetStartDate").length > 1) //If the button already exits
        { //Starts the if condition
          document.querySelector("#ResetStartDate").remove(); //Remove the old button
        } //Finishes the if condition
        ResetStartDate.setAttribute("style", "border-top: #92b0f1 1px solid;border-color: #92b0f1;border-style: solid;border-width: 0 0 1px;color: " + color + ";cursor: pointer;padding: 2px 3px;"); //Set the css for the button when the page loads
        document.querySelector("#ResetStartDate").onmousemove = function() { //Set the CSSs for the button when the mouse is hovering the button
          ResetStartDate.innerHTML = "Reset Started Date"; //Change the element text
          ResetStartDate.setAttribute("style", "cursor: pointer;background-color: " + color + ";border-color: #6386d5;border-style: solid;border-width: 0 0 1px;color: #fff;padding: 2px 3px;"); //Make the element look like it's clickable and change the element color
        }; //Finishes the CSS for the button when the mouse is hovering over the button
        document.querySelector("#ResetStartDate").onmouseout = function() {
          ResetStartDate.innerHTML = 'Started: ' + ShowStartedMonth + ' ' + start_day + ' ' + start_year;
          ResetStartDate.setAttribute("style", "border-top: #92b0f1 1px solid;border-color: #92b0f1;border-style: solid;border-width: 0 0 1px;color: " + color + ";cursor: pointer;padding: 2px 3px;"); //Set the css for the button when the mouse is not hovering the button
        }; //Set the CSS for the button when the mouse leaves the button
        document.querySelector("#ResetStartDate").addEventListener("click", ResetStartDateFunc, false); //When the button is cliked call this function
      } //Finishes the if condition

      //Starts the code to display the Finished Date
      if ((finish_month !== "") || (finish_day !== "") || (finish_year !== "")) // If month or date or year is set in the finished dates, then show the button
      { //Starts the if condition
        var ShowFinishedMonth = monthNames[finish_month - 1]; //Suppose the month is set and show it
        if (ShowFinishedMonth === undefined) // If month is not set in the finished dates
        { //Starts the if condition
          ShowFinishedMonth = ''; //Hide the finished month
        } //Finishes the if condition
        const ResetFinishDate = document.createElement("div"); //Creates the button to reset the finish date
        ResetFinishDate.innerHTML = 'Finished: ' + ShowFinishedMonth + ' ' + finish_day + ' ' + finish_year; //Define the button text; //Define the button text
        document.querySelector("#profileRows").append(ResetFinishDate); //Append the button below the "add to favorites" button
        ResetFinishDate.setAttribute("id", "ResetFinishDate"); //Gives an id to the button
        if (document.querySelectorAll("#ResetFinishDate").length > 1) //If the button already exits
        { //Starts the if condition
          document.querySelector("#ResetFinishDate").remove(); //Remove the old button
        } //Finishes the if condition
        ResetFinishDate.setAttribute("style", "border-top: #92b0f1 1px solid;border-color: #92b0f1;border-style: solid;border-width: 0 0 1px;color: " + color + ";cursor: pointer;padding: 2px 3px;"); //Set the css for the button when the page loads
        document.querySelector("#ResetFinishDate").onmousemove = function() { //Set the CSSs for the button when the mouse is hovering the button
          ResetFinishDate.innerHTML = "Reset Finished Date"; //Change the element text
          ResetFinishDate.setAttribute("style", "cursor: pointer;background-color: " + color + ";border-color: #6386d5;border-style: solid;border-width: 0 0 1px;color: #fff;padding: 2px 3px;"); //Make the element look like it's clickable and change the element color
        }; //Finishes the CSS for the button when the mouse is hovering over the button
        document.querySelector("#ResetFinishDate").onmouseout = function() {
          ResetFinishDate.innerHTML = 'Finished: ' + ShowFinishedMonth + ' ' + finish_day + ' ' + finish_year;
          ResetFinishDate.setAttribute("style", "border-top: #92b0f1 1px solid;border-color: #92b0f1;border-style: solid;border-width: 0 0 1px;color: " + color + ";cursor: pointer;padding: 2px 3px;"); //Set the CSS for the button when the mouse leaves the button
        }; //Set the CSS for the button when the mouse is hovering over the button
        document.querySelector("#ResetFinishDate").addEventListener("click", ResetFinishDateFunc, false); //When the button is cliked call this function
      } //Finishes the if condition

      //Starts the code to display the Reset All Dates
      if ((finish_month !== "" || finish_day !== "" || finish_year !== "") && (start_month !== "" || start_day !== "" || start_year !== "")) // If month or date or year is set in the started and finished dates then show the button
      { //Starts the if condition
        const ResetAllDatesVar = document.createElement("div"); //Creates the button to reset all dates
        ResetAllDatesVar.innerHTML = "Reset Started+Finished Dates"; //Define the button text
        document.querySelector("#profileRows").append(ResetAllDatesVar); //Append the button below the "add to favorites" button
        ResetAllDatesVar.setAttribute("id", "ResetAllDatesVar"); //Gives an id to the button
        if (document.querySelectorAll("#ResetAllDatesVar").length > 1) //If the button already exits
        { //Starts the if condition
          document.querySelectorAll("#ResetAllDatesVar")[0].remove(); //Remove the old button.There's no real need to update this button again, but if it isn't updated, the onmousemove/out won't work
        } //Finishes the if condition
        ResetAllDatesVar.setAttribute("style", "border-top: #92b0f1 1px solid;border-color: #92b0f1;border-style: solid;border-width: 0 0 1px;color: " + color + ";cursor: pointer;padding: 2px 3px;"); //Set the css for the button when the page loads
        document.querySelector("#ResetAllDatesVar").onmousemove = function() { //Set the CSS for the button when the mouse is hovering the button
          ResetAllDatesVar.setAttribute("style", "cursor: pointer;background-color: " + color + ";border-color: #6386d5;border-style: solid;border-width: 0 0 1px;color: #fff;padding: 2px 3px;"); //Make the element look like it's clickable and change the element color
        }; //Finishes the CSS for the button when the mouse is hovering over the button
        document.querySelector("#ResetAllDatesVar").onmouseout = function() { //Set the CSS for the button when the mouse isn't hovering the button
          ResetAllDatesVar.setAttribute("style", "border-top: #92b0f1 1px solid;border-color: #92b0f1;border-style: solid;border-width: 0 0 1px;color: " + color + ";cursor: pointer;padding: 2px 3px;"); //Set the css for the button when the mouse leaves the button
        }; //Finished the CSSs for the button when the mouse isn't hovering over the button
        document.querySelector("#ResetAllDatesVar").addEventListener("click", ResetAllDates, false); //When the button is cliked call this function
      } //Finishes the if condition
    } //Finishes the async ShowButtons function

    async function getVariables() //Creates a function to get the needed Variables
    { //Starts the function
      const response = await fetch('https://myanimelist.net/ownlist/' + entrytype2 + '/' + entryid + '/edit'); //Fetch
      const html = await response.text(); //Gets the fetch response
      const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response
      priority = newDocument.querySelector("#add_" + entrytype2 + "_priority").value; //Creates a variable to hold the actual priority value
      is_asked_to_discuss = newDocument.querySelector("#add_" + entrytype2 + "_is_asked_to_discuss").value; //Creates a variable to hold the actual is_asked_to_discuss value
      sns_post_type = newDocument.querySelector("#add_" + entrytype2 + "_sns_post_type").value; //Creates a variable to hold the actual SNS value
      start_day = newDocument.querySelector("#add_" + entrytype2 + "_start_date_day").value; //Creates a variable to hold the actual start_day value
      start_month = newDocument.querySelector("#add_" + entrytype2 + "_start_date_month").value; //Creates a variable to hold the actual start_month value
      start_year = newDocument.querySelector("#add_" + entrytype2 + "_start_date_year").value; //Creates a variable to hold the actual start_year value
      finish_day = newDocument.querySelector("#add_" + entrytype2 + "_finish_date_day").value; //Creates a variable to hold the actual finish_day value
      finish_month = newDocument.querySelector("#add_" + entrytype2 + "_finish_date_month").value; //Creates a variable to hold the actual finish_month value
      finish_year = newDocument.querySelector("#add_" + entrytype2 + "_finish_date_year").value; //Creates a variable to hold the actual finish_year value
      current_score = newDocument.querySelector("#add_" + entrytype2 + "_score").value; //Creates a variable to hold the actual current_score value
      anime_tags = newDocument.querySelector("#add_" + entrytype2 + "_tags").value; //Creates a variable to hold the actual anime_tags value
      storage_type = newDocument.querySelector("#add_" + entrytype2 + "_storage_type").value; //Creates a variable to hold the actual storage_type value
      comments = newDocument.querySelector("#add_" + entrytype2 + "_comments").value; //Creates a variable to hold the actual comments value
      status = newDocument.querySelector("#add_" + entrytype2 + "_status").value; //Creates a variable to hold the actual status value
      if (entrytype2 === 'anime') //If the entry type is anime
      { //Starts the if condition
        watched_eps = newDocument.querySelector("#add_anime_num_watched_episodes").value; //Creates a variable to hold the actual watched_eps value
        storage_value = newDocument.querySelector("#add_anime_storage_value").value; //Creates a variable to hold the actual storage_value value
        rewatched_times = newDocument.querySelector("#add_anime_num_watched_times").value; //Creates a variable to hold the actual rewatched_times value
        rewatch_value = newDocument.querySelector("#add_anime_rewatch_value").value; //Creates a variable to hold the actual rewatch_value value
        totaleps = document.querySelector("#curEps").textContent; //Get the actual total episodes value
      } //Finishes the if condition
      else //If the entry type is manga
      { //Starts the else condition
        manga_read_chapters = newDocument.querySelector("#add_manga_num_read_chapters").value; //Creates a variable to hold the actual manga_read_chapters value
        manga_retail = newDocument.querySelector("#add_manga_num_retail_volumes").value; //Creates a variable to hold the actual manga_retail value
        manga_read_times = newDocument.querySelector("#add_manga_num_read_times").value; //Creates a variable to hold the actual manga_read_times value
        manga_reread_value = newDocument.querySelector("#add_manga_reread_value").value; //Creates a variable to hold the actual manga_read_times value
        manga_read_volumes = newDocument.querySelector("#add_manga_num_read_volumes").value; //Creates a variable to hold the actual manga_read_volumes value
        totalVols = document.querySelector("#totalVols").textContent === '?' ? 0 : document.querySelector("#totalVols").textContent; //Get the actual total manga volumes
        totalChaps = document.querySelector("#totalChaps").textContent === '?' ? 0 : document.querySelector("#totalChaps").textContent; //Get the actual total manga chapters
      } //Finishes the else condition
    } //Finishes the async getvariables function
    if (document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist") === null) { //If the anime is on the user list
      AddedToList = true;
      var TimesExecuted = 0; //Creates a new variable
      const increaseby = 1; //Creates a new variable

      document.addEventListener("mousemove", async function() { //Creates a new function to run when the mouse is hovering the page
        TimesExecuted += increaseby; //Sum the number of times that the page was mouse-hovered
        if (TimesExecuted === 1) { //On the first time that the page is hovered
          await getVariables(); //Call and wait the function getVariables
          await ShowButtons(); //Call and wait for the function ShowButtons to display the buttons
        } // //Finishes the if condition
      }); //Finishes the onmousemove event listener
    } //Finishes the if condition

    document.body.insertAdjacentHTML('beforeend', '<div id="loadingScreen" style="display: none;z-index: 200;position: fixed;width: 100%;height: 100%;background-color: #00000054;top: 0;background-image: url(https://i.imgur.com/A1wREJp.gif);background-repeat: no-repeat;background-position: center;"></div>'); //Add the loading screen to the html body

    async function ResetAllDates() //Creates a function to Reset All Dates
    { //Starts the async ResetAllDates function
      document.querySelector("#loadingScreen").style.display = ''; //Shows the Loading Screen
      if (IsEditPageOpened === true) //Check if the button edit details was opened
      { //Starts the if condition
        await getVariables(); //Call and wait the function getVariables
      } //Finishes the if condition
      document.querySelectorAll("#ResetStartDate,#ResetFinishDate,#ResetAllDatesVar").forEach(el => el.remove()); //Removes the now needless buttons
      const response = await fetch("https://myanimelist.net/ownlist/" + entrytype2 + "/" + entryid + "/edit", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        },
        "body": "add_manga%5Bnum_read_chapters%5D=" + manga_read_chapters + "&add_manga%5Bnum_retail_volumes%5D=" + manga_retail + "&add_manga%5Bnum_read_times%5D=" + manga_read_times + "&add_manga%5Breread_value%5D=" + manga_reread_value + "&add_manga%5Bnum_read_volumes%5D=" + manga_read_volumes + "&add_" + entrytype2 + "%5Bstatus%5D=" + status + "&add_anime%5Bnum_watched_episodes%5D=" + watched_eps + "&add_" + entrytype2 + "%5Bscore%5D=" + current_score + "&add_" + entrytype2 + "%5Btags%5D=" + anime_tags + "&add_" + entrytype2 + "%5Bpriority%5D=" + priority + "&add_" + entrytype2 + "%5Bstorage_type%5D=" + storage_type + "&add_anime%5Bstorage_value%5D=" + storage_value + "&add_anime%5Bnum_watched_times%5D=" + rewatched_times + "&add_anime%5Brewatch_value%5D=" + rewatch_value + "&add_" + entrytype2 + "%5Bcomments%5D=" + comments + "&add_" + entrytype2 + "%5Bis_asked_to_discuss%5D=" + is_asked_to_discuss + "&add_" + entrytype2 + "%5Bsns_post_type%5D=" + sns_post_type + "&csrf_token=" + token,
        "method": "POST"
      }); //Finishes the fetch
      await getVariables(); //Call and wait for the function getVariables to get the new removed Finished/Started Dates variables, if the process was successful
      document.querySelector("#loadingScreen").style.display = 'none'; //Hides the Loading Screen
    } //Finishes the async ResetAllDates function

    async function ResetStartDateFunc() //Creates a function to reset the start dates
    { //Starts the async ResetStartDateFunc function
      document.querySelector("#loadingScreen").style.display = ''; //Shows the Loading Screen
      if (IsEditPageOpened === true) //Check if the button edit details was opened
      { //Starts the if condition
        await getVariables(); //Call and wait the function getVariables
      } //Finishes the if condition
      document.querySelector("#ResetStartDate").remove(); //Removes the now needless button
      if (document.querySelector("#ResetAllDatesVar") !== null) //Check if the button ResetAllDatesVar exists
      { //Starts the if condition
        document.querySelector("#ResetAllDatesVar").remove(); //Removes the now needless button
      } //Finishes the if condition
      const response = await fetch("https://myanimelist.net/ownlist/" + entrytype2 + "/" + entryid + "/edit", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        },
        "body": "add_manga%5Bnum_read_chapters%5D=" + manga_read_chapters + "&add_manga%5Bnum_retail_volumes%5D=" + manga_retail + "&add_manga%5Bnum_read_times%5D=" + manga_read_times + "&add_manga%5Breread_value%5D=" + manga_reread_value + "&add_manga%5Bnum_read_volumes%5D=" + manga_read_volumes + "&add_" + entrytype2 + "%5Bstatus%5D=" + status + "&add_anime%5Bnum_watched_episodes%5D=" + watched_eps + "&add_" + entrytype2 + "%5Bscore%5D=" + current_score + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Bmonth%5D=" + finish_month + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Bday%5D=" + finish_day + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Byear%5D=" + finish_year + "&add_" + entrytype2 + "%5Btags%5D=" + anime_tags + "&add_" + entrytype2 + "%5Bpriority%5D=" + priority + "&add_" + entrytype2 + "%5Bstorage_type%5D=" + storage_type + "&add_anime%5Bstorage_value%5D=" + storage_value + "&add_anime%5Bnum_watched_times%5D=" + rewatched_times + "&add_anime%5Brewatch_value%5D=" + rewatch_value + "&add_" + entrytype2 + "%5Bcomments%5D=" + comments + "&add_" + entrytype2 + "%5Bis_asked_to_discuss%5D=" + is_asked_to_discuss + "&add_" + entrytype2 + "%5Bsns_post_type%5D=" + sns_post_type + "&csrf_token=" + token,
        "method": "POST"
      }); //Finishes the fetch
      await getVariables(); //Call and wait for the function getVariables to get the new removed Started Dates variables, if the process was successful
      await ShowButtons(); //Call and wait for the function ShowButtons to display the buttons
      document.querySelector("#loadingScreen").style.display = 'none'; //Hides the Loading Screen
    } //Finishes the async ResetStartDateFunc function

    async function ResetFinishDateFunc() //Creates a function to reset the finish dates
    { //Starts the async ResetFinishDateFunc function
      document.querySelector("#loadingScreen").style.display = ''; //Shows the Loading Screen
      if (IsEditPageOpened === true) //Check if the button edit details was opened
      { //Starts the if condition
        await getVariables(); //Call and wait the function getVariables
      } //Finishes the if condition
      document.querySelector("#ResetFinishDate").remove(); //Removes the now needless button
      if (document.querySelector("#ResetAllDatesVar") !== null) //Check if the button ResetAllDatesVar exists
      { //Starts the if condition
        document.querySelector("#ResetAllDatesVar").remove(); //Removes the now needless button
      } //Finishes the if condition
      const response = await fetch("https://myanimelist.net/ownlist/" + entrytype2 + "/" + entryid + "/edit", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        },
        "body": "add_manga%5Bnum_read_chapters%5D=" + manga_read_chapters + "&add_manga%5Bnum_retail_volumes%5D=" + manga_retail + "&add_manga%5Bnum_read_times%5D=" + manga_read_times + "&add_manga%5Breread_value%5D=" + manga_reread_value + "&add_manga%5Bnum_read_volumes%5D=" + manga_read_volumes + "&add_" + entrytype2 + "%5Bstatus%5D=" + status + "&add_anime%5Bnum_watched_episodes%5D=" + watched_eps + "&add_" + entrytype2 + "%5Bscore%5D=" + current_score + "&add_" + entrytype2 + "%5Bstart_date%5D%5Bmonth%5D=" + start_month + "&add_" + entrytype2 + "%5Bstart_date%5D%5Bday%5D=" + start_day + "&add_" + entrytype2 + "%5Bstart_date%5D%5Byear%5D=" + start_year + "&add_" + entrytype2 + "%5Btags%5D=" + anime_tags + "&add_" + entrytype2 + "%5Bpriority%5D=" + priority + "&add_" + entrytype2 + "%5Bstorage_type%5D=" + storage_type + "&add_anime%5Bstorage_value%5D=" + storage_value + "&add_anime%5Bnum_watched_times%5D=" + rewatched_times + "&add_anime%5Brewatch_value%5D=" + rewatch_value + "&add_" + entrytype2 + "%5Bcomments%5D=" + comments + "&add_" + entrytype2 + "%5Bis_asked_to_discuss%5D=" + is_asked_to_discuss + "&add_" + entrytype2 + "%5Bsns_post_type%5D=" + sns_post_type + "&csrf_token=" + token,
        "method": "POST"
      }); //Finishes the fetch
      await getVariables(); //Call and wait for the function getVariables to get the new removed Finished Dates variables, if the process was successful
      await ShowButtons(); //Call and wait for the function ShowButtons to display the buttons
      document.querySelector("#loadingScreen").style.display = 'none'; //Hides the Loading Screen
    } //Finishes the async ResetFinishDateFunc function

    async function AddStartDate() //Add The Start Date When Watching Is Selected
    { //Starts the async function
      document.querySelector("#loadingScreen").style.display = ''; //Shows the Loading Screen
      if (IsEditPageOpened === true) //Check if the button edit details was opened
      { //Starts the if condition
        await getVariables(); //Call and wait the function getVariables
      } //Finishes the if condition
      if ((start_month === "") && (start_day === "") && (start_year === "")) // If month and date, and year are NOT set in the started date, then Add The Start Date
      { //Starts the if condition
        const response = await fetch("https://myanimelist.net/ownlist/" + entrytype2 + "/" + entryid + "/edit", {
          "headers": {
            "content-type": "application/x-www-form-urlencoded"
          },
          "body": "add_manga%5Bnum_read_chapters%5D=" + manga_read_chapters + "&add_manga%5Bnum_retail_volumes%5D=" + manga_retail + "&add_manga%5Bnum_read_times%5D=" + manga_read_times + "&add_manga%5Breread_value%5D=" + manga_reread_value + "&add_manga%5Bnum_read_volumes%5D=" + manga_read_volumes + "&add_" + entrytype2 + "%5Bstatus%5D=1&add_anime%5Bnum_watched_episodes%5D=" + watched_eps + "&add_" + entrytype2 + "%5Bscore%5D=" + current_score + "&add_" + entrytype2 + "%5Bstart_date%5D%5Bmonth%5D=" + month + "&add_" + entrytype2 + "%5Bstart_date%5D%5Bday%5D=" + day + "&add_" + entrytype2 + "%5Bstart_date%5D%5Byear%5D=" + year + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Bmonth%5D=" + finish_month + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Bday%5D=" + finish_day + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Byear%5D=" + finish_year + "&add_" + entrytype2 + "%5Btags%5D=" + anime_tags + "&add_" + entrytype2 + "%5Bpriority%5D=" + priority + "&add_" + entrytype2 + "%5Bstorage_type%5D=" + storage_type + "&add_anime%5Bstorage_value%5D=" + storage_value + "&add_anime%5Bnum_watched_times%5D=" + rewatched_times + "&add_anime%5Brewatch_value%5D=" + rewatch_value + "&add_" + entrytype2 + "%5Bcomments%5D=" + comments + "&add_" + entrytype2 + "%5Bis_asked_to_discuss%5D=" + is_asked_to_discuss + "&add_" + entrytype2 + "%5Bsns_post_type%5D=" + sns_post_type + "&csrf_token=" + token,
          "method": "POST",
        }); //Set The Anime Start Dates
        await getVariables(); //Call and wait for the function getVariables to get the new removed Started Dates variables, if the process was successful
        await ShowButtons(); //Call and wait for the function ShowButtons to display the Finished Date and display the Reset All Dates
      } //Finishes the if condition
      document.querySelector("#loadingScreen").style.display = 'none'; //Hides the Loading Screen
    } //Finishes the async AddStartDate function

    async function AddFinishDate() //Add The Finished Date When Completed Is Selected
    { //Starts the async AddFinishDate function
      document.querySelector("#loadingScreen").style.display = ''; //Shows the Loading Screen
      if (IsEditPageOpened === true) //Check if the button edit details was opened
      { //Starts the if condition
        await getVariables(); //Call and wait the function getVariables
      } //Finishes the if condition
      if (finish_month === "" && finish_day === "" && finish_year === "") // If month and date, and year are NOT set in the finished dates, then Add The Finished Date
      { //Starts the if condition

        if ((start_month === "") && (start_day === "") && (start_year === "")) //If month, date, and year aren't set in the started dates, add the start date as well
        { //Starts the if condition
          start_day = day; //Instead of adding a blank or the actual start day value, add today's day
          start_month = month; //Instead of adding a blank or the actual start month value, add today's month
          start_year = year; //Instead of adding a blank or the actual start year value, add today's year
        } //Finishes the if condition

        const response = await fetch("https://myanimelist.net/ownlist/" + entrytype2 + "/" + entryid + "/edit", {
          "headers": {
            "content-type": "application/x-www-form-urlencoded"
          },
          "body": "add_manga%5Bnum_read_chapters%5D=" + totalChaps + "&add_manga%5Bnum_retail_volumes%5D=" + manga_retail + "&add_manga%5Bnum_read_times%5D=" + manga_read_times + "&add_manga%5Breread_value%5D=" + manga_reread_value + "&add_manga%5Bnum_read_volumes%5D=" + totalVols + "&add_" + entrytype2 + "%5Bstatus%5D=2&add_anime%5Bnum_watched_episodes%5D=" + totaleps + "&add_" + entrytype2 + "%5Bscore%5D=" + current_score + "&add_" + entrytype2 + "%5Bstart_date%5D%5Bmonth%5D=" + start_month + "&add_" + entrytype2 + "%5Bstart_date%5D%5Bday%5D=" + start_day + "&add_" + entrytype2 + "%5Bstart_date%5D%5Byear%5D=" + start_year + "&add_" + entrytype2 + "%5Btags%5D=" + anime_tags + "&add_" + entrytype2 + "%5Bpriority%5D=" + priority + "&add_" + entrytype2 + "%5Bstorage_type%5D=" + storage_type + "&add_anime%5Bstorage_value%5D=" + storage_value + "&add_anime%5Bnum_watched_times%5D=" + rewatched_times + "&add_anime%5Brewatch_value%5D=" + rewatch_value + "&add_" + entrytype2 + "%5Bcomments%5D=" + comments + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Bmonth%5D=" + month + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Bday%5D=" + day + "&add_" + entrytype2 + "%5Bfinish_date%5D%5Byear%5D=" + year + "&add_" + entrytype2 + "%5Bis_asked_to_discuss%5D=" + is_asked_to_discuss + "&add_" + entrytype2 + "%5Bsns_post_type%5D=" + sns_post_type + "&csrf_token=" + token,
          "method": "POST"
        }); //Finishes the fetch
        await getVariables(); //Call and wait for the function getVariables to get the new removed Finished Dates variables, if the process was successful
        await ShowButtons(); //Call and wait for the function ShowButtons to display the Finished Date, and display the Reset All Dates
      } //Finishes the if condition
      document.querySelector("#loadingScreen").style.display = 'none'; //Hides the Loading Screen
    } //Finishes the async AddFinishDate function

    function SelectedValue() //Creates a function to get the selected value
    { //Starts the SelectedValue function
      if (this.value === '2') //Completed Was Selected
      { //Starts the if condition
        setTimeout(async function() {
          await AddFinishDate();
          document.querySelector(".header-profile-link").innerText === 'hacker09' ? document.querySelector('a[title="Search for Live-Actions/Doramas"]')?.click() : ''; //Auto search live actions for myself
        }, 200); //Starts the function AddFinishDate
      } //Finishes the Completed else function
      else if (this.value === '1') //Watching Was Selected
      { //Starts the if condition
        setTimeout(function() {
          AddStartDate();
        }, 200); //Starts the function AddStartDate
      } //Finishes the Watching if function
    } //Finishes the SelectedValue function

    document.querySelectorAll("#myinfo_status").forEach(el => el.onchange = SelectedValue); //Adds an event listener to all of the entry status buttons

    if (entrytype2 === 'anime') //If the script is running on an anime entry
    { //Starts the if condition
      function PlusButtonAddDates() //Adding all episodes auto set entry as completed and auto set finished dates
      { //Starts the function PlusButtonAddDates
        setTimeout(async function() { //Starts the settimeout function
          if (document.querySelector("#myinfo_watchedeps").value === document.querySelector("#curEps").textContent) //If the number of added eps is the same as the total, then
          { //Starts the if condition
            await getVariables(); //Call and wait the function getVariables
            await AddFinishDate(); //Call and wait the function AddFinishDate
            document.querySelectorAll("#myinfo_status").forEach(el => el.value = '2'); //Set the anime as completed, in a way that the user can see
            document.querySelectorAll("#myinfo_status").forEach(el => el.dataset.class = 'completed'); //Change the selection box to blue
          } //Finishes the if condition
          if (document.querySelector("#myinfo_watchedeps").value === '1' && document.querySelector("#curEps").textContent > '1') //If the number of added eps is = 1 and if the entry has more than 1 eps then
          { //Starts the if condition
            await getVariables(); //Call and wait the function getVariables
            await AddStartDate(); //Call and wait the function AddFinishDate
            document.querySelectorAll("#myinfo_status").forEach(el => el.value = '1'); //Set the anime as watching, in a way that the user can see
            document.querySelectorAll("#myinfo_status").forEach(el => el.dataset.class = 'watching'); //Change the selection box to green
          } //Finishes the if condition
        }, 750); //Finishes the settimeout function
      } //Finishes the function PlusButtonAddDates

      document.querySelectorAll("i.fa-solid.fa-circle-plus").forEach(el => el.onclick = PlusButtonAddDates); //Adds an event listener to the plus button

      if (AddedToList !== true) //If the anime is not on the user list
      { //Starts the else condition
        document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").addEventListener("click", async function(e) //When the Add button is clicked
          { //Starts the onclick function
            e.preventDefault(); //Prevent the default link from being opened
            await getVariables(); //Call and wait the function getVariables
            setTimeout(function() { //Wait for the entry to be added to the user list
              document.querySelector("#myinfo_status").addEventListener('change', SelectedValue, false); //Adds an event listener to the status button below the anime image
            }, 750); //Finishes the settimeout function
          }); //Finishes the onclick function
      } //Finishes the else condition

      document.querySelectorAll("#myinfo_watchedeps")[1].addEventListener('change', function() { //Starts the function
        watched_eps = this.value; //Update the variable value
      }, false); //Adds an advent listener to the watched eps button on the right side of the anime image

    } //Finishes the if condition
    else //If the entry type is manga
    { //Starts the else condition
      document.querySelectorAll("#myinfo_volumes")[1].addEventListener('change', function() { //Starts the function
        manga_read_volumes = this.value; //Update the variable value
      }, false); //Adds an event listener to the manga read volumes button on the right side of the anime image
      document.querySelectorAll("#myinfo_chapters")[1].addEventListener('change', function() { //Starts the function
        manga_read_chapters = this.value; //Update the variable value
      }, false); //Adds an event listener to the manga read chapters button on the right side of the anime image
    } //Finishes the else condition

    document.querySelectorAll("#myinfo_score")[1].addEventListener('change', function() { //Starts the function
      current_score = this.value; //Update the variable value
    }, false); //Adds an event listener to the score button on the right side of the anime image

    if (AddedToList === true) //If the manga is already added to the user list
    { //Starts the if condition
      document.querySelector("input.inputButton.btn-middle.flat.js-anime-update-button,input.inputButton.js-manga-update-button").nextElementSibling.onclick = function() { //Adds an event listener to the button
        IsEditPageOpened = true; //Set the variable to true
      }; //Finishes the event listener

      document.querySelector("input.inputButton.btn-middle.flat.js-anime-update-button,input.inputButton.js-manga-update-button").nextElementSibling.oncontextmenu = function() { //Adds an event listener to the button
        IsEditPageOpened = true; //Set the variable to true
      }; //Finishes the event listener
    } //Finishes the if condition

  } //Finishes the else condition
})();