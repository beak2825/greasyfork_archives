// ==UserScript==
// @name     AO3: [Wrangling] Get Tagname Button
// @description Adds a button to tag landing pages that writes the tag name to your clipboard.
// @version  1.11
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @include      *://*archiveofourown.org/tags/*
// @include      *://*archiveofourown.org/works?*tag_id=*
// @include      *://*archiveofourown.org/bookmarks?*tag_id=*
// @exclude      *://*archiveofourown.org/tags/*/wrangle*
// @exclude      *://*archiveofourown.org/tags/*/comments*
// @exclude      *://*archiveofourown.org/tags/*/troubleshooting*


// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/454140/AO3%3A%20%5BWrangling%5D%20Get%20Tagname%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/454140/AO3%3A%20%5BWrangling%5D%20Get%20Tagname%20Button.meta.js
// ==/UserScript==




if(!window.location.href.endsWith("/edit")){
  var nav =document.getElementsByClassName("navigation actions");

//function that gets executed when button is pressed
function copyTag(){
  //retrieve list elements with characters
  
	c = document.getElementsByTagName("h2");
  //console.log(c[0].innerText)
  navigator.clipboard.writeText(c[0].innerText);
  

  //copy string to clipboard and present result message
 /* navigator.clipboard.writeText(clipboard_string).then(function() {
    window.alert("Copied characters to clipboard")
  }, function(err) {
    window.alert("Failed to copy characters to clipboard")
  });*/

}

  //create char button
  //retrieve all/none buttons to append it in the right place later
  const char_button = document.createElement("button")
  //needed so the button doesn't refresh the page
  char_button.type = "button";
  char_button.innerText = "Copy Tag Name"
  //set function for onlick
  char_button.addEventListener("click", copyTag); 
  //append button after all/none buttons
  nav[3].appendChild(char_button)
} else {
  
  var nav =document.getElementsByClassName("navigation actions");
  function copyTag(){
  //retrieve list elements with characters
  
  c = document.getElementsByTagName("h2")[0].textContent;
  c = c.slice(7,-4);
  
  //var link = '<a href="'+c[0].baseURI+'">'+c[0].firstChild.innerText+"</a>"
  navigator.clipboard.writeText(c);
  

  //copy string to clipboard and present result message
 /* navigator.clipboard.writeText(clipboard_string).then(function() {
    window.alert("Copied characters to clipboard")
  }, function(err) {
    window.alert("Failed to copy characters to clipboard")
  });*/

}

  //create char button
  //retrieve all/none buttons to append it in the right place later
  const char_button = document.createElement("button")
  //needed so the button doesn't refresh the page
  char_button.type = "button";
  char_button.innerText = "Copy Tag"
  //set function for onlick
  char_button.addEventListener("click", copyTag); 
  //append button after all/none buttons
  nav[4].appendChild(char_button)
  
}
