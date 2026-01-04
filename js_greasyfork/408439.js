// ==UserScript==
// @name         Better Buttons to Change The Status Of Animes/Mangas And To Add Scores
// @namespace    betterbuttonstomal2
// @version      24
// @description  Makes easier and faster to select any status/score by enlarging the removing the dropdown selection of those options. Delete any entry from your list, or score + add the whole anime Franchise to your anime list with a single click.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @require      https://greasyfork.org/scripts/446666-jquery-core-minified/code/jQuery%20Core%20minified.js
// @grant        GM.xmlHttpRequest
// @connect      chiaki.site
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/408439/Better%20Buttons%20to%20Change%20The%20Status%20Of%20AnimesMangas%20And%20To%20Add%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/408439/Better%20Buttons%20to%20Change%20The%20Status%20Of%20AnimesMangas%20And%20To%20Add%20Scores.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var TotalLinks, FetchPage; //Creates a new global variable
  var token = document.head.querySelector("[name='csrf_token']").content; //Get the user csrf token
  const animeid = location.pathname.match(/\d+/) === null ? location.search.match(/\d+/)[0] : location.pathname.match(/\d+/)[0]; //Get the anime id
  document.querySelectorAll("#myinfo_status")[1].size = "5"; //Set the size for the Status button
  document.querySelectorAll("#myinfo_status")[1].setAttribute("style", "font-size: 13.2px; background-image: none; overflow: hidden;"); //Set the css for the status button
  document.querySelectorAll("#myinfo_score")[1].size = "11"; //Set the size for the Score button
  document.querySelectorAll("#myinfo_score > option:nth-child(1)")[1].innerText = 'Reset Score'; //Change the text "selection" to Reset Score
  document.querySelectorAll("#myinfo_score")[1].setAttribute("style", "background-image: none; overflow: hidden; padding : 5px; width: 100px;"); //Set the CSS for the score button

  const DeleteBTN = document.createElement("input"); //Create a input element
  document.querySelectorAll("#myinfo_status")[1].parentElement.appendChild(DeleteBTN); //Show the delete button
  window.jQuery(DeleteBTN).attr({ //Set the attributes
    value: "Delete", //Add the value Delete to the button
    id: "DeleteBTN", //Add the id DeleteBTN to the button
    class: "inputButton ml8 delete_submit", //Add a class to the button
    type: "button", //Add the type to the button
    style: "margin-left: 15px!important;" //Set the CSS to the button
  }); //Finishing setting the attributes
  if (location.pathname.split('/')[1] === 'anime') { //If the user is on an anime page
    var entrytype = 'anime'; //Set the variable as anime
    document.querySelector("div.di-ib.form-user-episode.ml8").setAttribute("style", "width: 125px;"); //Set the CSS for the episodes element
    document.querySelectorAll("#myinfo_watchedeps")[1].setAttribute("style", "width: 25px;"); //Set the CSS for the episodes seen element

    const ScoreButton = document.createElement("input"); //Create a input element
    document.querySelectorAll("#myinfo_status")[1].parentElement.appendChild(ScoreButton); //Show the Score button
    window.jQuery(ScoreButton).attr({ //Set the attributes
      value: "Score+Add Franchise", //Add the value Score to the button
      id: "ScoreBTN", //Add the id ScoreBTN to the button
      class: "inputButton ml8 delete_submit", //Add a class to the button
      type: "button", //Add the type to the button
      style: "margin-left: 15px!important;" //Set the CSS to the button
    }); //Finishing setting the attributes
    document.querySelector("div.di-ib.form-user-episode.ml8").setAttribute("style", "width: 125px;"); //Set the CSS for the episodes element
    document.querySelectorAll("#myinfo_watchedeps")[1].setAttribute("style", "width: 25px;"); //Set the CSS for the episodes seen element
    document.querySelector("#ScoreBTN").addEventListener("click", (async function() { //Add an event listener to the Score button that will score and set as "Watching" the whole franchise when clicked
      if (document.querySelector("#myinfo_score").value === '0') //If the actual score of the anime entry is 0
      { //Start the if condition
        alert('You must first give a score for this entry, then the script will give that same score and add the entire franchise with the current status of this entry.'); //Show a message
        return; //Stop the script from executing
      } //Finishes the if condition

      GM.xmlHttpRequest({ //Starts the xmlHttpRequest
        method: "GET",
        url: `https://chiaki.site/?/tools/watch_order/id/${animeid}`,
        onload: function(response) { //Starts the onload event listener
          var ChiakiDocument = new DOMParser().parseFromString(response.responseText, 'text/html'); //Parses the fetch response

          if (confirm("If you've already added this entire franchise to your anime list, press OK.")) { //Ask a question to the user
            FetchPage = `edit`; //If the user has already added the entire franchise to his anime list
          } else { //Starts the else condition
            FetchPage = `add`; //If the user doesn't have added the entire franchise to his anime list
          } //Starts the finishes

          TotalLinks = ChiakiDocument.querySelectorAll("span.uk-text-muted.uk-text-small > a:nth-child(1)"); //Creates a variable to loop through the entry id elements after

          for (var i = 0; i < TotalLinks.length; i++) { //Starts the for condition
            async function AddScore() //Creates a function to Score + set as "Watching" the Franchise
            { //Starts the function
              const response = await fetch(`https://myanimelist.net/ownlist/anime/${FetchPage}.json`, { //Fetches the page
                "headers": {
                  "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                "body": `{"anime_id":${TotalLinks[i].href.match(/\d+/)[0]},"status":${document.querySelector(".po-r > #myinfo_status > option:checked").value},"score":${document.querySelector("#myinfo_score").value},"num_watched_episodes":0,"csrf_token":"${token}"}`,
                "method": "POST"
              }); //Finishes the fetch
            } //Finishes the async function
            if (TotalLinks[i].href.match(/\d+/)[0] !== animeid) //If the fetched chiaki.site anime ID isn't the same as the actual page anime ID
            { //Starts if condition
              AddScore(); //Starts the async AddScore function
            } //Finishes the if condition
          } //Finishes the for condition

          alert(`Done!!!\nThe Whole Franchise was scored with ${document.querySelector("#myinfo_score").value} and added to your ${document.querySelector(".po-r > #myinfo_status > option:checked").innerText} anime list!`); //Shows a message
        } //Finishes the onload event listener
      }); //Finishes the xmlHttpRequest
    })); //Finishes the event listener

  } else { //Starts the else condition
    entrytype = 'manga'; //Set the variable as manga
  } //Finishes the else condition
  document.querySelector("#DeleteBTN").addEventListener("click", (async function() { //Add an event listener to the delete button that will delete the entry of the user list when clicked
    await fetch(`https://myanimelist.net/ownlist/${entrytype}/${animeid}/delete`, {
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": `csrf_token=${token}`,
      "method": "POST"
    }); //Finishes the fetch request
    location.reload(); //Reload the page after the user deleted the anime from his list
  })); //Finish the async function and the event listener
})();