// ==UserScript==
// @name         Have we ever talked before? - MAL
// @namespace    MALCuriosity
// @version      13
// @description  Quickly know if you have ever received Private Messages or profile comments from specific users by opening the user's profile page or by hovering over the user image/name on any page on MAL.
// @author       hacker09
// @match        https://myanimelist.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        GM_listValues
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423517/Have%20we%20ever%20talked%20before%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/423517/Have%20we%20ever%20talked%20before%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var newDocument, ProfileID; //Creates a new global variable
  var HoveredUserName = ''; //Creates a new global variable

  if (GM_getValue('ScriptUserName') === undefined) //If the variable ScriptUserName doesn't exist yet
  { //Starts the if condition
    GM_setValue('ScriptUserName', document.querySelector("a.header-profile-link").innerText); //Save the User Name to the variable ScriptUserName
  } //Finishes the if condition

  async function GetComments() //Creates a function to get the user id and Starts the function
  { //Starts the function
    if (location.href.split('/')[3] === 'profile' && location.href.split('/')[4] !== GM_getValue('ScriptUserName') && HoveredUserName === '') //If the opened page is a profile and if the profile username isn't of the account owner profile, and if the variable HoveredUserName is equal nothing
    { //Starts the if condition
      ProfileID = document.querySelector("input[name*=profileMemId]") !== null ? document.querySelector("input[name*=profileMemId]").value : document.querySelector(".mr0").href.match(/\d+/g)[0]; //Save the user id to the variable ProfileID
    } //Finishes the if condition
    else //If the opened page isn't a profile page
    { //Starts the else condition
      const response1 = await (await fetch('https://api.jikan.moe/v4/users/' + HoveredUserName)).json(); //Fetch
      ProfileID = response1.data.mal_id; //Saves the user ID to the variable ProfileID
    } //Finishes the else condition

    const response = await (await fetch('https://myanimelist.net/comtocom.php?id1=' + ProfileID + '&id2=' + GM_getValue("ScriptUserID"))).text(); //Fetch
    newDocument = new DOMParser().parseFromString(response, 'text/html'); //Parses the fetch response
  } //Finishes the async function

  document.querySelectorAll("a[href*='/profile/']").forEach(Element => Element.addEventListener("mouseover", async function() { //Get all the profile link elements and add an event listener to the link element

    if (this.title.match('comments') === null) //If the element doesn't have the word comments on its title attribute
    { //Starts the if condition
      HoveredUserName = this.href.split('/')[4]; //Save the hovered username to a variable
      this.title = "Hover again to see the updated comments and PMs message."; //Add the text "comments" to the username/image, so that even if the element is hovered again too fast the fetch request won't happen again
      await GetComments(); //Starts the function

      if (newDocument.body.innerText.search("No comments found") > -1) //If the text "No comments found" exists
      { //Starts the if condition
        this.title = "❌ There are no comments between you and this user!"; //Add a text to the username/image
      } //Finishes the if condition
      else //If the text "No comments found" doesn't exist
      { //Starts the else condition
        this.title = "✅ There are comments between you and this user!"; //Add a text to the username/image
      } //Finishes the else condition

      if (GM_listValues().includes(HoveredUserName)) //If the current HoveredUserName is on the user PMed list
      { //Starts the if condition
        this.title = this.title + "\n✅ There are PMs between you and this user!"; //Add a text to the username/image
      } //Finishes the if condition
      else //If the current HoveredUserName isn't on the user PMed list
      { //Starts the else condition
        this.title = this.title + "\n❌ There are no PMs between you and this user!"; //Add a text to the username/image
      } //Finishes the else condition
    } //Finishes the if condition
  })); //Finishes the forEach

  if (location.href === 'https://myanimelist.net/mymessages.php' || (GM_getValue('ScriptUserID') === undefined && location.href.split('/')[4] === GM_getValue('ScriptUserName'))) //If the opened profile username is the account owner profile and if the variable ScriptUserID doesn't exist yet or if the opened URL is = 'https://myanimelist.net/mymessages.php'
  { //Starts the if condition

    var array = []; //Creates a new global array
    var nextpagenum = 0; //Creates a new variable
    if (GM_getValue('ScriptUserID') === undefined && location.href.split('/')[4] === GM_getValue('ScriptUserName')) //If the opened profile username is the account owner profile and if the variable ScriptUserID doesn't exist yet
    { //Starts the if condition
      const response1 = await (await fetch('https://api.jikan.moe/v4/users/' + location.href.split('/')[4])).json(); //Fetch
      GM_setValue('ScriptUserID', response1.data.mal_id); //Save the user id to the variable ScriptUserID
    } //Finishes the if condition

    while (true) { //While the fetched page contains User Names
      const url = 'https://myanimelist.net/mymessages.php?go=&show=' + nextpagenum; //Creates a variable to fetch the PM pages
      var response = await (await fetch(url)).text(); //Fetches the PM pages and converts the fetched pages to text
      const newDocument = new DOMParser().parseFromString(response, 'text/html'); //Parses the fetch response
      nextpagenum += 20; //Increase the next page number by 20

      if (location.href === 'https://myanimelist.net/mymessages.php') //If the opened URL is = 'https://myanimelist.net/mymessages.php'
      { //Starts the if condition
        var DisplayedTotalPMs = 999999999; //Creates a new variable to make the script fetch only the 1-page
      } //Finishes the if condition
      else //If the opened URL isn't = 'https://myanimelist.net/mymessages.php'
      { //Starts the else condition
        DisplayedTotalPMs = parseInt(newDocument.querySelector("div.di-ib").innerText.match(/\d+/g)[2]); //Creates a new variable
      } //Finishes the else condition

      for (const UserNames of newDocument.querySelectorAll("div.mym.mym_user")) { //For every single User Name that sent a PM to the user
        array.push(UserNames.innerText); //Get and save the all mal User Names that sent PMs to the script user
      } //Finishes the for condition

      if (DisplayedTotalPMs >= parseInt(newDocument.querySelector("div.di-ib").innerText.match(/\d+/g)[0])) { //If the fetched page displayed messages total number is greater or equal the User total inbox messages number
        array = [...new Set(array)]; //Remove the duplicated usernames of the array
        array = array.filter(d => !GM_listValues().includes(d)); //Remove the duplicated usernames of the array comparing the usernames that the array has and tampermonkey is missing
        array.forEach(name => GM_setValue(name, 'PMed MAL User Name')) //Get and save the current PMed MAL User Name

        if (location.href !== 'https://myanimelist.net/mymessages.php') //If the opened URL isn't = 'https://myanimelist.net/mymessages.php'
        { //Starts the if condition
          close(); //Close the current tab
        } //Finishes the if condition
        return; //Make the while condition false and stop fetching
      } //Finishes the if condition
      await new Promise(resolve => setTimeout(resolve, 600)); //Timeout to start the next fetch request
    } //Finishes the while condition
  } //Finishes the if condition

  if (location.href.match(/https:\/\/myanimelist\.net\/profile\/[^\/]+(\/)?$/) !== null && location.href.split('/')[4] !== GM_getValue('ScriptUserName')) //If the opened page is a profile page and the profile username isn't of the script user profile
  { //Starts the if condition
    const HasCommented = document.createElement("a"); //Creates an a element
    HasCommented.setAttribute("id", "HasCommented"); //Adds the id HasCommented to the a element
    HasCommented.setAttribute("style", "cursor: pointer; margin-right: 15%;"); //Set the CSS for the button

    await GetComments(); //Starts the function

    if (newDocument.body.innerText.search("No comments found") > -1) //If the text "No comments found" is found
    { //Starts the if condition
      HasCommented.innerHTML = "❌"; //Add the text ❌ to the button
    } //Finishes the if condition
    else //If the text "No comments found" isn't found
    { //Starts the else condition
      HasCommented.innerHTML = "✅"; //Add a text to the button
      HasCommented.onclick = function() { //Detects the mouse click on the '✅' button
        open(`https://myanimelist.net/comtocom.php?id1=${ProfileID}&id2=${GM_getValue("ScriptUserID")}`, '_self'); //Open the user comments page on the same tab
      }; //Finishes the onclick event listener
    } //Finishes the else condition

    document.querySelector("#comment").parentElement.appendChild(HasCommented); //Shows the button

    setTimeout(function() { //Starts the setTimeout function
      document.querySelector("div.mt8 > input").parentElement.appendChild(document.querySelector("#HasCommented").cloneNode(true)); //Clone and append the HasCommented button
      document.querySelectorAll("#HasCommented")[1].onclick = function() { //Detects the mouse click on the second HasCommented button
        document.querySelector("#HasCommented").click(); //Click on the first HasCommented element
      }; //Finishes the onclick event listener
    }, 3000); //Finishes the setTimeout function

    const HasPMed = document.createElement("a"); //Creates an a element
    HasPMed.setAttribute("style", "cursor: pointer; margin-right: 47%;"); //Set the css for the button

    HasPMed.innerHTML = GM_listValues().includes(location.href.split('/')[4]) === true ? "✅" : "❌"; //If the current opened profile User Name is on the user PMed list Add a text to the button

    document.querySelector("#comment").parentElement.appendChild(HasPMed); //Shows the button
  } //Finishes the if condition
})();