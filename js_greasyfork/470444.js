// ==UserScript==
// @name         AO3 Easy Navigation Userscripts
// @namespace    Ellililunch AO3 USERSCIPTS
// @version      0.3
// @history      0.0 deplicated JaneBuzJane's script to put the "Marked for Later" button on the home page of AO3.
// @history      0.1 modified JaneBuzJane's script to put the "Marked for Later" button on the home page of AO3 wo create a "bookmarked fics" botton to the home tab of AO3.
// @history      0.2 combined the script for a "Marked for Later" and "Bookmarked Fics" botton in one script
// @history      0.3 added the escctrl's AO3: Jump to a Random Work script to adds a "Random Work" button (top right corner) when viewing works in a tag/filter or your Marked For Later list
// @description  Adds "Marked for Later" and "Bookmarked Fics" buttons on the top navigation bar of AO3, as well as creates a "random works" button in marked for later list
// @author       Ellililunch
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @match        http://archiveofourown.org/works*
// @match        https://archiveofourown.org/works*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/jquery-2.2.4.js
// @run-at       document-idle
// @grant        none
// @match        *://*.archiveofourown.org/tags/*/works*
// @match        *://*.archiveofourown.org/works?*
// @match        *://*.archiveofourown.org/users/*/readings*show=to-read*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470444/AO3%20Easy%20Navigation%20Userscripts.user.js
// @updateURL https://update.greasyfork.org/scripts/470444/AO3%20Easy%20Navigation%20Userscripts.meta.js
// ==/UserScript==



//////Puts Marked for Later Button on AO3 Home Bar///////////////
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


////////////////////////////////////////
///////////////AO3: Jump to a Random Work///////////// adds a "Random Work" button (top right corner) when viewing works in a tag/filter or your Marked For Later list
////////////////////////////////////////////////
(function($) {
    'use strict';

    // add a button
    var button = document.createElement('li');
    button.innerHTML = '<a href="#">Random Work</a>';
    button.addEventListener("click", RandomWork);
    if (location.href.indexOf('show=to-read') > 0) document.querySelector('div#main.readings-index ul.navigation.actions').appendChild(button);
    else document.querySelector('div#main.works-index div.navigation.actions.module ul.user.navigation.actions').appendChild(button);

    // when the button was pressed, read the number of works, pick a random one, and redirect there
    function RandomWork() {

        // Find number of pages. content of second-to-last <li> tells us
        var pageCount = parseInt($('ol.pagination').first().find('li').last().prev().text() || 1);

        // pick random whole number of the available pages
        const pageRandom = Math.floor((Math.random() * pageCount) + 1);

        // figure out which page we're currently viewing
        var thisPage = location.search.match(/page=(\d)+/);
        thisPage = thisPage === null ? 1 : parseInt(thisPage[1]); // match only works if URL contained a page (i.e. if not on page 1)

        // check: are we currently on the randomly chosen page?
        if (thisPage !== pageRandom) LoadRandomPage(pageRandom); // if not - read that page to find a random work link
        else Redirect2Work($('ol.work.index.group li.work.blurb')); // if yes - skip page loads, read a random work link from this page
    }

    function LoadRandomPage(r) {
        // build the URL of the page to load
        var pageURL = location.search.indexOf('page=') > 0 ? location.href.replace(/page=(\d)+/, 'page='+r) // replace existing page number
            : location.href + (location.href.indexOf('?') > 0 ? '&' : '?') + 'page='+r; // add page number if not yet in URL search parameters

        // grab the list of works from the page
        $.get(pageURL, function(response) {
        }).done(function(response) {
            Redirect2Work($(response).find('ol.work.index.group li.work.blurb'));

        // if that sent us to jail, set the ao3jail marker
        }).fail(function(data, textStatus, xhr) {
            console.log("Random Work script has hit Retry later", data.status);
            return false;
        });
    }

    function Redirect2Work(worksList) {
        // pick a random work from within the list
        var pick = Math.floor((Math.random() * worksList.length) + 1);

        // read that random work's URL and title
        pick = $(worksList[pick-1]).find('h4 a').first();
        var path = $(pick).attr('href');
        var title = $(pick).text();

        // jump to that work but warn the user
        alert('Redirecting you to a random work: '+title);
        window.location.assign(path);
    }

    function HideClearHistory(){
        var btn;
        btn = document.getElementById('Clear History');
        btn.style.display = "none";
    }


})(jQuery);

//////////////////////////////////////////
///////////////////////////////////////Put Bookmarks Button on AO3 Home//////////////////////////
///////////////////Puts the "Bookmarked Fics" button on the home page of AO3.

    var $j = jQuery.noConflict();

    $j(document).ready(function() {

        // From https://greasyfork.org/en/scripts/406616-ao3-no-rekudos/code
    var greeting, username;
    greeting = document.getElementById('greeting');
    username = greeting.querySelector('a').href;

        // From https://stackoverflow.com/questions/43742732/use-javascript-or-jquery-to-create-an-href-url-using-variables-passed-in-through
    var dynamicContent = "archiveofourown.org";
    var username = ""+username+"";
    var url = ""+username+"/bookmarks";
    $('#container').html('<a href="'+url+'">Bookmarked Fics</a>');


        // From https://stackoverflow.com/questions/1145208/how-to-add-a-list-item-to-an-existing-unordered-list
    $("ul.primary.navigation.actions").append('<li><a href="'+url+'"><span class="dropdown-toggle">Bookmarked Fics</span></a></li>');

    });