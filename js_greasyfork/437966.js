// ==UserScript==
// @name         Put "Download CSV" Button in AO3 Prompt Memes
// @namespace    https://greasyfork.org
// @version      0.1
// @description  Puts a "Download as CSV" button on the Prompts page of AO3 Prompt Memes.
// @author       JaneBuzJane
// @license      MIT
// @match        http://archiveofourown.org/*/requests
// @match        https://archiveofourown.org/*/requests
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/jquery-2.2.4.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437966/Put%20%22Download%20CSV%22%20Button%20in%20AO3%20Prompt%20Memes.user.js
// @updateURL https://update.greasyfork.org/scripts/437966/Put%20%22Download%20CSV%22%20Button%20in%20AO3%20Prompt%20Memes.meta.js
// ==/UserScript==

var $j = jQuery.noConflict();

$j(document).ready(function() {

    // From https://stackoverflow.com/questions/27983388/using-innerhtml-with-queryselectorall
var cname;
var cname = document.querySelectorAll("h2.collections");
[].forEach.call(cname, function(returnname) { //querySelectorAll returns a NodeList, not an array, so we have to loop through the results
  cname.innerHTML = '';
});

    // From https://stackoverflow.com/questions/43742732/use-javascript-or-jquery-to-create-an-href-url-using-variables-passed-in-through
var promptname = cname[0].innerHTML
var dynamicContent = "archiveofourown.org/collections/";
var url = "signups.csv";
$('#container').html('<a href="'+url+'">Download as CSV</a>');
    
    // From https://stackoverflow.com/questions/1145208/how-to-add-a-list-item-to-an-existing-unordered-list
$("ul.navigation.actions:nth-child(3)").append('<li><a href="'+url+'"><span class="dropdown-toggle">Download as CSV</span></a></li>'); //nth-child allows us to append only to the 3rd item with this class
    
});