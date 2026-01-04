// ==UserScript==
// @name     AO3: [Wrangling] Copy Characters and Syns to Clipboard
// @description Copies comma-separated list of fandoms, characters, rels or syns to clipboard
// @version  3
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match        *://*.archiveofourown.org/tags/*/edit
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/448225/AO3%3A%20%5BWrangling%5D%20Copy%20Characters%20and%20Syns%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/448225/AO3%3A%20%5BWrangling%5D%20Copy%20Characters%20and%20Syns%20to%20Clipboard.meta.js
// ==/UserScript==



//retrieve anchors by id for finding the relevant data 
const char_anchor = document.getElementById("parent_Character_associations_to_remove_checkboxes");
const syn_anchor = document.getElementById("child_Merger_associations_to_remove_checkboxes");
const rel_anchor = document.getElementById("child_Relationship_associations_to_remove_checkboxes");
const fandom_anchor = document.getElementById("parent_Fandom_associations_to_remove_checkboxes");

console.log(fandom_anchor);


//function that gets executed when fandom button is pressed
function copyFandom(){
  //retrieve list elements with characters
  var fandom_box = fandom_anchor.childNodes[0].getElementsByTagName('li');

  var clipboard_string = "";

  //loop through list and append each to the string
  for(var i = 0; i <= fandom_box.length-1; i++){
    clipboard_string += fandom_box[i].innerText;
    if(i < fandom_box.length-1){
       clipboard_string += ",";
    }
  }

  //copy string to clipboard and present result message
  navigator.clipboard.writeText(clipboard_string).then(function() {
    window.alert("Copied fandoms to clipboard")
  }, function(err) {
    window.alert("Failed to copy characters to clipboard")
  });

}



//function that gets executed when char button is pressed
function copyChar(){
  //retrieve list elements with characters
  var char_box = char_anchor.childNodes[0].getElementsByTagName('li');

  var clipboard_string = "";

  //loop through list and append each to the string
  for(var i = 0; i <= char_box.length-1; i++){
    clipboard_string += char_box[i].innerText;
    if(i < char_box.length-1){
       clipboard_string += ",";
    }
  }

  //copy string to clipboard and present result message
  navigator.clipboard.writeText(clipboard_string).then(function() {
    window.alert("Copied characters to clipboard")
  }, function(err) {
    window.alert("Failed to copy characters to clipboard")
  });

}



//function that gets executed when rel button is pressed
function copyRel(){
  //retrieve list elements with characters
  var rel_box = rel_anchor.childNodes[0].getElementsByTagName('li');

  var clipboard_string = "";

  //loop through list and append each to the string
  for(var i = 0; i <= rel_box.length-1; i++){
    clipboard_string += rel_box[i].innerText;
    if(i < rel_box.length-1){
       clipboard_string += ",";
    }
  }

  //copy string to clipboard and present result message
  navigator.clipboard.writeText(clipboard_string).then(function() {
    window.alert("Copied rels to clipboard")
  }, function(err) {
    window.alert("Failed to copy rels to clipboard")
  });

}



//function that gets executed when syn button is pressed
function copySyn(){
  //retrieve list elements with syns
  var syn_box = syn_anchor.childNodes[0].getElementsByTagName('li');

  var clipboard_string = "";

  //loop through list and append each to the string
  for(var i = 0; i <= syn_box.length-1; i++){
    clipboard_string += syn_box[i].innerText;
    if(i < syn_box.length-1){
       clipboard_string += ",";
    }
  }
  
  //copy string to clipboard and present result message
  navigator.clipboard.writeText(clipboard_string).then(function() {
    window.alert("Copied syns to clipboard")
  }, function(err) {
    window.alert("Failed to copy syns to clipboard")
  });
}


//for non-relationship tags, don't create this button
if(char_anchor != null){
  //create char button
  //retrieve all/none buttons to append it in the right place later
  var buttons = char_anchor.parentNode.getElementsByClassName('actions');
  const char_button = document.createElement("button")
  //needed so the button doesn't refresh the page
  char_button.type = "button";
  char_button.innerText = "Copy Characters"
  //set function for onlick
  char_button.addEventListener("click", copyChar); 
  //append button after all/none buttons
  buttons[0].appendChild(char_button)
}


//for non-char tags, don't create this button
if(rel_anchor != null){
  //create rel button
  //retrieve all/none buttons to append it in the right place later
  var buttons = rel_anchor.parentNode.getElementsByClassName('actions');
  const rel_button = document.createElement("button")
  //needed so the button doesn't refresh the page
  rel_button.type = "button";
  rel_button.innerText = "Copy Rels"
  //set function for onlick
  rel_button.addEventListener("click", copyRel); 
  //append button after all/none buttons
  buttons[0].appendChild(rel_button)
}

//create fandom button button
//retrieve all/none buttons to append it in the right place later
var buttons = fandom_anchor.parentNode.getElementsByClassName('actions');
const fandom_button = document.createElement("button")
//needed so the button doesn't refresh the page
fandom_button.type = "button";
fandom_button.innerText = "Copy Fandoms"
//set function for onlick
fandom_button.addEventListener("click", copyFandom); 
//append button after all/none buttons
buttons[0].appendChild(fandom_button)




//create syn button
//retrieve all/none buttons to append it in the right place later
var buttons = syn_anchor.parentNode.getElementsByClassName('actions');
const syn_button = document.createElement("button")
//needed so the button doesn't refresh the page
syn_button.type = "button";
syn_button.innerText = "Copy Synonyms"
//set function for onlick
syn_button.addEventListener("click", copySyn); 
//append button after all/none buttons
buttons[0].appendChild(syn_button)