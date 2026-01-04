// ==UserScript==
// @name        MAL Custom CSS Override - Working!!!
// @namespace   MALCSSOverRider
// @description Replaces the anime/manga lists CSS styles on other users anime/manga lists with your own, or with an style of an user of your choice!
// @version     8
// @match       https://myanimelist.net/animelist/*
// @match       https://myanimelist.net/mangalist/*
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/422024/MAL%20Custom%20CSS%20Override%20-%20Working%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/422024/MAL%20Custom%20CSS%20Override%20-%20Working%21%21%21.meta.js
// ==/UserScript==

(function() {
  var BackupedActualUserCustomListStyle = ''; //Create a global variable

  GM_registerMenuCommand("See this List Style", SeeListStyle); //Adds an option to the menu
  GM_registerMenuCommand("Use this List Style!", UseThisListStyle); //Adds an option to the menu

  const BackupedActualUserListStyle = document.querySelector("style[type*='text/css']").innerText; //Create a global variable to store the user actual list style css codes

  if (document.querySelector("#advanced-options") !== null) //If the user is on a modern list style
  { //Starts the if condition
    BackupedActualUserCustomListStyle = document.querySelector("#custom-css").innerText; //Create a global variable to store the user actual custom list style css codes
  } //Finishes the if condition

  function SeeListStyle() //Function to See the List Style
  { //Starts the function SeeListStyle
    document.querySelector("style[type*='text/css']").innerText = BackupedActualUserListStyle; //Shows the actual user list style

    if (document.querySelector("#advanced-options") !== null) //If the user is on a modern list style
    { //Starts the if condition
      document.querySelector("#custom-css").innerText = BackupedActualUserCustomListStyle; //Shows the actual user list custom style
    } //Finishes the if condition

  } //Finishes the function SeeListStyle

  function UseThisListStyle() //Function to Change the List Style
  { //Starts the function UseThisListStyle
    SeeListStyle(); //Show the actualy list style
    if (document.querySelector("#advanced-options") !== null) //If the user is on a modern list style
    { //Starts the if condition
      GM_setValue("Default_Style", BackupedActualUserListStyle); //Store the actual style of the script user
      GM_setValue("Default_Custom_Style", BackupedActualUserCustomListStyle); //Store the actual custom style of the script user
    } //Finishes the if condition
    else //If the user is on a modern list style
    { //Starts the else condition
      GM_setValue("Default_Classic_Style", BackupedActualUserListStyle); //Store the actual style of the script user
    } //Finishes the else condition
  } //Finishes the function UseThisListStyle

  if (document.querySelector("#advanced-options") !== null) //If the user is on a classic list style
  { //Starts the if condition
    document.querySelector("#custom-css").innerText = GM_getValue("Default_Custom_Style"); //Replaces the actual list custom style with the default list style that was chosen to be used to override styles
    document.querySelector("style[type*='text/css']").innerText = GM_getValue("Default_Style"); //Replaces the actual list style with the default list style that was chosen to be used to override
  } //Finishes the if condition
  else //If the user is on a modern list style
  { //Starts the else condition styles
    document.querySelector("style[type*='text/css']").innerText = GM_getValue("Default_Classic_Style"); //Replaces the actual list style with the default list style that was chosen to be used to override
  } //Finishes the else condition
})();