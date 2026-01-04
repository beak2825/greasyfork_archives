// ==UserScript==
// @name         Put Marked for Later Button on AO3 Home
// @namespace    https://greasyfork.org/en/users/773998
// @version      0.2
// @description  Puts the "Marked for Later" button on the home page of AO3.
// @author       JaneBuzJane
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @match        http://archiveofourown.org/works*
// @match        https://archiveofourown.org/works*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/jquery-2.2.4.js
// @run-at      document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426732/Put%20Marked%20for%20Later%20Button%20on%20AO3%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/426732/Put%20Marked%20for%20Later%20Button%20on%20AO3%20Home.meta.js
// ==/UserScript==

var $j = jQuery.noConflict();

$j(document).ready(function() {

    // From https://greasyfork.org/en/scripts/406616-ao3-no-rekudos/code
var greeting, username;
greeting = document.getElementById('greeting'); 
username = greeting.querySelector('a').href;
    
    // From https://stackoverflow.com/questions/43742732/use-javascript-or-jquery-to-create-an-href-url-using-variables-passed-in-through
var dynamicContent = "archiveofourown.org";
var username = ""+username+"";
var url = ""+username+"/readings?show=to-read";
$('#container').html('<a href="'+url+'">Marked for Later</a>');


    // From https://stackoverflow.com/questions/1145208/how-to-add-a-list-item-to-an-existing-unordered-list
$("ul.primary.navigation.actions").append('<li><a href="'+url+'"><span class="dropdown-toggle">Marked for Later</span></a></li>');
    
});