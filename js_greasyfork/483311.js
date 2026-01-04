// ==UserScript==
// @name     AO3: [Wrangling] Capitalise Tags
// @description  Capitalises the first letter of each word in a tag
// @version  1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>


// @match        *://*.archiveofourown.org/tags/*/edit
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/483311/AO3%3A%20%5BWrangling%5D%20Capitalise%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/483311/AO3%3A%20%5BWrangling%5D%20Capitalise%20Tags.meta.js
// ==/UserScript==




var nav = document.getElementsByClassName("navigation actions");

//function that gets executed when button is pressed
function capitalise(){


  var text = document.getElementById("tag_name");
  var capitalised_text = "";


  for(const word of text.value.split(" ")){
    capitalised_text += word[0].toUpperCase() + word.substr(1) + " ";
  }

  text.value = capitalised_text
  

}

  //create button
  const button = document.createElement("button")
  //needed so the button doesn't refresh the page
  button.type = "button";
  button.innerText = "Capitalise Tag"
  //set function for onlick
  button.addEventListener("click", capitalise); 
  //append button after all/none buttons
  nav[4].appendChild(button)
