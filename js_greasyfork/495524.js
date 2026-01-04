// ==UserScript==
// @name     AO3: [Wrangling] Get Wiki Link Button
// @description Adds a button that writes a copypastable link to a tag edit page to the clipboard
// @version  1.3
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://archiveofourown.org/tags/*
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/495524/AO3%3A%20%5BWrangling%5D%20Get%20Wiki%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/495524/AO3%3A%20%5BWrangling%5D%20Get%20Wiki%20Link%20Button.meta.js
// ==/UserScript==



var nav =document.getElementsByClassName("navigation actions");
var nav2 =document.getElementsByClassName("reindex");


//function that gets executed when button is pressed
function copyLink(){

  var tagname = ""
  var url = window.location.href
  if(url.includes("/edit")){
     tagname = document.getElementById("tag_name").value
  } else {
    tagname = document.getElementsByTagName("h2")[0].innerText;
  }

  var link = '['+window.location.href+' '+tagname+"]"
  navigator.clipboard.writeText(link);


}

  //create char button
  //retrieve all/none buttons to append it in the right place later
  const char_button = document.createElement("button")
  //needed so the button doesn't refresh the page
  char_button.type = "button";
  char_button.innerText = "Get Wiki Link"
  //set function for onlick
  char_button.addEventListener("click", copyLink); 
  //append button after all/none buttons
  nav[4].appendChild(char_button)
  nav2[0].appendChild(char_button)
