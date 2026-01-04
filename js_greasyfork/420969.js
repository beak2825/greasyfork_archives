
// ==UserScript==
// @name     BrightSpace Roster Extractor
// @namespace   cengique@users.sf.net
// @description Extract student names and emails from class list as a plan HTML table so it can be copied and pasted to other places. Click on the word "List" under the Images column header to toggle the list.
// @include     https://*.view.usg.edu/d2l/lms/classlist/classlist.d2l*
// @version  1.1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/420969/BrightSpace%20Roster%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/420969/BrightSpace%20Roster%20Extractor.meta.js
// ==/UserScript==

console.log("Roster Extractor: starting");

// read the data from the table
var data = [];
var names = document.getElementsByClassName("d_ich");
Array.prototype.forEach.call(names, e => { 
    data.push({ "name": e.innerText, "email": e.nextSibling.innerText } ) } );
console.log(data);

function toggleList() {  
  contentdiv_style = document.querySelector("#students").style;
  if (contentdiv_style.display == "none") {
  	contentdiv_style.display = "block";    
  } else {
    contentdiv_style.display = "none";
  }
}

// container div
div = document.createElement("div");
div.style = 'display: block;'; // position: absolute; top: 2em; right: 2em;';

// button
button = document.createElement("a");
button.innerHTML = "<b>List</b>";
button.style = "display: block; margin-left: auto;"
button.onclick = toggleList;
div.appendChild(button);

// content div below
contentdiv = document.createElement("div");
contentdiv.id = "students";
contentdiv.style = "background: #FFF; display: none;"
div.appendChild(contentdiv);
//div.innerHTML = "<a onclick='' style='display: block;'>test</a><div id=students></div>";

// Create an HTML table just with student name and email IDs
list_str = '<table>';
Array.prototype.forEach.call(data, e => { list_str = list_str + "<tr><td>" + e.name + "</td><td>" + e.email + "</td></tr>"; } );
list_str = list_str + '</table>';
contentdiv.innerHTML = list_str;

document.querySelector('th.d_hch').appendChild(div);

