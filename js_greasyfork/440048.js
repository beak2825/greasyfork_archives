

    // ==UserScript==
    // @name         Put Bookmarks Button on AO3 Navbar
    // @namespace    https://greasyfork.org/en/users/876643-elli-lili-lunch
    // @version      0.1
    // @description  Puts the "Bookmarked Fics" button on the navbar of AO3.
    // @author       Elli-lili-lunch, based off "Put Marked for Later Button on AO3 Home v0.2" JaneBuzJane
    // @match        http://archiveofourown.org/*
    // @match        https://archiveofourown.org/*
    // @match        http://archiveofourown.org/works*
    // @match        https://archiveofourown.org/works*
    // @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
    // @require      https://code.jquery.com/jquery-2.2.4.js
    // @run-at      document-idle
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440048/Put%20Bookmarks%20Button%20on%20AO3%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/440048/Put%20Bookmarks%20Button%20on%20AO3%20Navbar.meta.js
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
    var url = ""+username+"/bookmarks";
    $('#container').html('<a href="'+url+'">Bookmarked Fics</a>');
     
     
        // From https://stackoverflow.com/questions/1145208/how-to-add-a-list-item-to-an-existing-unordered-list
    $("ul.primary.navigation.actions").append('<li><a href="'+url+'"><span class="dropdown-toggle">Bookmarked Fics</span></a></li>');
        
    });

