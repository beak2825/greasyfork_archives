// ==UserScript==
// @name         Add new entries to PTW/PTR
// @namespace    ChangeAddBehavior
// @version      13
// @description  Any new entries that you add to your list will be added to your Plan To Watch/Read list.
// @author       hacker09
// @match        https://myanimelist.net/*/season*
// @match        https://myanimelist.net/anime.php?q=*
// @match        https://myanimelist.net/watch/episode*
// @match        https://myanimelist.net/watch/promotion*
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(\/)(genre|producer|magazine)(\/)([\d]+)(\/).*/
// @include      /^https:\/\/myanimelist\.net\/(anime|manga|stacks)(id=)?(\.php\?id=)?(\/?\d+)?\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426831/Add%20new%20entries%20to%20PTWPTR.user.js
// @updateURL https://update.greasyfork.org/scripts/426831/Add%20new%20entries%20to%20PTWPTR.meta.js
// ==/UserScript==

setTimeout((async function() {
  'use strict';
  if (document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist") !== null) { //If the entry is not on the user list
    document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").href = 'javascript:void(0);'
    document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").dataset.value = 6; //Add it as PTW

    document.querySelector("#myinfo_status.btn-user-status-add-list.js-form-user-status.js-form-user-status-btn.myinfo_addtolist").onclick = function() //When the Add button is clicked
    { //Starts the onclick function
      setTimeout(function() { //Wait the entry be added to the user list
        document.querySelector("#myinfo_status").value = '6'; //Set the entry as plan to watch, in a way that the user can see
        document.querySelector("#myinfo_status").dataset.class = 'plantowatch'; //Change the selection box to grey
      }, 900); //Finishes the settimout function
    }; //Finishes the onclick function
  } //Finishes the if condition

  if (document.querySelector('a.Lightbox_AddEdit[class*="button_add"]') !== null) { //If there's an entry that is not on the user list
    var cssdefault = 'margin-left: 5px;'; //Creates a new global variable
    var cssmovein = 'margin-left: 5px; background-color: lightcyan;'; //Creates a new global variable
    var cssout = 'margin-left: 5px; background-color: unset'; //Creates a new global variable

    GM_registerMenuCommand("Add All Entries", function() { //Creates a new function
      var UserInput = prompt('1 Watching\n2 Completed\n3 On-Hold\n4 Dropped\n5 PTW\n*Write only your choice number and click OK'); //Gets the user input

      switch (UserInput) { //Detect the user choice
        case '1': //If the user choose option 1
          UserInput = '1'; //Change the variable value
          break; //Stop executing the switch statement
        case '2': //If the user choose option 2
          UserInput = '2'; //Change the variable value
          break; //Stop executing the switch statement
        case '3': //If the user choose option 3
          UserInput = '3'; //Change the variable value
          break; //Stop executing the switch statement
        case '4': //If the user choose option 4
          UserInput = '4'; //Change the variable value
          break; //Stop executing the switch statement
        case '5': //If the user choose option 5
          UserInput = '6'; //Change the variable value
          break; //Stop executing the switch statement
      } //Ends the switch statement

      var Counter = 0; //Create a new counter variable
      document.querySelectorAll('a.Lightbox_AddEdit[class*="button_add"]').forEach(async function(el) { //ForEach MAL entry link
        const parameters = el.href.match('/manga/') !== null ? ['manga', 'num_read_volumes\":0,\"num_read_chapters'] : ['anime', 'num_watched_episodes']; //Creates an array having the anime/manga fetch parameters
        fetch(`https://myanimelist.net/ownlist/${parameters[0]}/add.json`, { //Fetch
            "body": `{\"${parameters[0]}_id\":${el.href.match(/[\d]+/)[0]},\"status\":${UserInput},\"score\":0,\"${parameters[1]}\":0,\"csrf_token\":\"${document.head.querySelector("[name='csrf_token']").content}\"}`,
            "method": "POST"
          }) //Finishes the Fetch
          .then(response => { //After the fetch finished
            Counter += 1; //Increase the counter by 1
            if (Counter === document.querySelectorAll('a.Lightbox_AddEdit[class*="button_add"]').length) //If the Counter is equal to the amount of fetched links
            { //Starts the if condition
              location.reload(); //Reloads the page after adding is completed
            } //Finishes the if condition
          }); //Finishes the then statement
      }); //Finishes the ForEach loop
    }); //Adds an option to the menu and finishes the function

    if (location.href.match(/producer|stacks/) !== null && document.querySelector(".tile.on") !== null) //If the user is on a producer page and if the 1st view mode is enabled
    { //Starts the if condition
      cssdefault = 'font-size: smaller; display: block; margin-left: -45px; top: -35px; color: white; background-color: rgba(50,50,50,.95);'; //Change the css
      cssmovein = 'font-size: smaller; display: block; margin-left: -45px; top: -35px; color: black; background-color: #fff;'; //Changes the css
      cssout = cssdefault; //Changes the css
    } //Finishes the if condition

    document.querySelectorAll('a.Lightbox_AddEdit[class*="button_add"]').forEach(async function(el, i) { //For each entry that is not on the user list

      if (location.href.match(/episode|promotion/) !== null) //If the user is on the episodes page
      { //Starts the if condition
        cssdefault += 'float: right!important;'; //Change the css
        cssmovein += 'float: right!important;'; //Changes the css
        cssout = cssdefault; //Changes the css
        el.parentElement.insertAdjacentHTML('beforeEnd', `<a id="QAdd${i}" style="${cssdefault}" href="javascript:void(0);">Quick Add</a>`); //Add a quick add button
      } //Finishes the if condition
      else //If the user is not on the episodes page
      { //Starts the else condition
        el.parentElement.insertAdjacentHTML('beforeEnd', `<a id="QAdd${i}" style="${cssdefault}" href="javascript:void(0);">Quick Add</a>`); //Add a quick add button
      } //Finishes else if condition

      document.querySelector("#QAdd" + i).onclick = function() { //When the quick add button is clicked
        const parameters = el.href.match('/manga/') !== null ? ['manga', 'num_read_volumes\":0,\"num_read_chapters'] : ['anime', 'num_watched_episodes']; //Creates an array having the anime/manga fetch parameters

        fetch(`https://myanimelist.net/ownlist/${parameters[0]}/add.json`, { //Fetch
          "body": `{\"${parameters[0]}_id\":${el.href.match(/[\d]+/)[0]},\"status\":6,\"score\":0,\"${parameters[1]}\":0,\"csrf_token\":\"${document.head.querySelector("[name='csrf_token']").content}\"}`,
          "method": "POST"
        }); //Finishes fetching

        el.innerText = 'PLAN'; //Set the entry as plan, in a way that the user can see
        el.className = location.href.match(/episode|promotion/) === null ? 'Lightbox_AddEdit button_edit ga-click btn-anime-watch-status js-anime-watch-status button plantowatch' : 'Lightbox_AddEdit button_edit ga-click fl-r ml4 plantowatch'; //Change the selection box to grey
      }; //Finishes the onlick function

      document.querySelector("#QAdd" + i).onmousemove = function() { //Set the css for the button when the mouse is hovering over the button
        document.querySelector("#QAdd" + i).style = cssmovein; //Change the element color
      }; //Finishes the css for the button when the mouse is hovering over the button
      document.querySelector("#QAdd" + i).onmouseout = function() {
        document.querySelector("#QAdd" + i).style = cssout; //Set the css for the button when the mouse is not hovering the button
      }; //Set the css for the button when the mouse is leaving the button

    }); //Finishes the foreach loop
  } //Finishes the if condition
}), 0)();