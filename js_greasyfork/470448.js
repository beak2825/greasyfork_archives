// ==UserScript==
// @name         AO3 Re-read Savior: Bookmark tracker, Rekudos converter & Mark for Later+Subscribe buttons at BOP
// @namespace    Ellililunch AO3 USERSCIPTS
// @description  Userscripts for an optimized and efficient AO3 experience, particularly rereading. This includes automatically populating bookmark notes with fic title, author, workID and summary alongside whatever existing bookmark notes. Also adds tags based on word count and fic completion status. Converts re-clicks of the Kudos button into a "rekudos" comment. Adds the "subscribe" and "mark for later/mark as read" buttons to the end of the fic.
// @version      1.2.6.1
// @history      0.0 replicated Ellililunch Bookmark maker script modified from Bairdel's AO3 Bookmarking Records to automatically add title, author, and summary to the bookmark description for ease of recordkeeping
// @history      0.1 added in Rekudos Converter modified from Van Irie (automatically comment on a fic when you've already left kudos)
// @history      0.2 added in Ellililunch's AO3 clone "mark for later" button at bottom (recreates marked for later button at end of works to easily mark something as read at the bottom of the page) based on script by scriptfairy
// @history      0.3 added code that puts the "Marked for Later" button in a fic blurb when browsing AO3 from "JaneBuzJane but indebted to Bat, always"
// @history      0.4 added code to recreate subscribe button at end of works by scriptfairy + cleaned up redundant code
// @history      0.5 added my code to clone fic title, author, and summary at bottom of the page (based off work from scriptfairy), tried to add the bookmark back button script from sunkitten_shash but it didn't work :(
// @history      0.6 added functionality for bookmark notes where if currently no bookmark notes, populates fic info. if there are bookmark notes that already has the fic info, keep the existing info + adds the current date as the reread date. if there are already bookmark notes, but no fic info, adds the fic info in front of the bookmark notes
// @history      0.7 added autopopulation of workID to bookmark notes on the suggestion of oliver t
// @history      0.7.1 fixed nested if-else statement to add just workID if already has the summary (for those who already have bookmarks with just title/author/summary)
// @history      0.8 modified bookmark maker to be based off the title and author variables instead of "Summary:" // reformatted it all to lose the heading formatting + make it easier to read.
// @history      0.9 added automatic word count range tags with the help of w4tchdoge
// @history      0.9.1 removed backup code to duplicate fic info at the bottom of the page (commented out at least, to test how well it stays away) ... and then just left the word count feature becuase found the auto word count range tag can be buggy (returns "<1K words" when it shouldn't
// @history      1.0 integrated code to have fic info created in a collapsible element (as demonstrated by w4tchdoge).
// @history      1.0.1 tidied code + workshopping wortcount tag isse (occasionally erroneously returns "<1k words" tag) + override if statement so I can personally update my 7210 bookmarks to the collapsible element system + auto wordcount tags
// @history      1.0.2 wrote new code to get wordcount as an int using if statements to get rid of commas and spaces in the original string that ao3 returns wordcount as. also removed "sent on [date] with AO3 converter" from rekudos.
// @history      1.0.3 testing how this will work on phone (still having that issue with erroneous if statements issue)
// @history      1.0.4  didn't have any luck with [replace(/\s+/g, '')], going back to " ".
// @history      1.0.5 addin space after NaN error + adding what ao3 returns as words to feedback
// @history      1.0.6 testing out w4tchdoge code for getting word string, and then parsing it into int with my if statements
// @history      1.0.6.1 adding word feedback to figure out whats going on with the code
// @history      1.0.6.2 words seems to be returning "## ###" so see if that space can be removed and can be properly parsed as int
// @history      1.0.6.3 get feedback for what words, wordINT
// @history      1.0.6.4 maybe remove space again? parseInt thwarted by the space - changed else if statements too if statements
// @history      1.0.6.5 trying to replace the space in words with a comma so wordINT parses correctly
// @history      1.0.6.6 testing new method to identify whitespace "/\s/"
// @history      1.0.6.7 testing w/o quotation marks around /\s/ + reordering feedback tags
// @history      1.0.6.8 changing from replace all to replace + /\s/ to /\s/g
// @history      1.0.6.9 setting variable words as a string
// @history      1.0.7 fuckit going back to og w4tchdoge code entirely
// @history      1.0.8 updated possible code from w4tchdoge to parse words + modified rekudos machine message
// @history      1.1 switched from usiing if else statements for convert word count into wordcount range tab. + increasingly considering whitespace is less of the issue than correcly getting wordcount from ao3.
// @history      1.1.1 idenitified words2 issue, testing to see if same issue on phone? UPDATE: pleased to report it broke the script entirely. goody.
// @history      1.1.1.1 modified message from rekudos converter to say "Sent with love from the rekudos machine on yyyy-mm-dd" on the line below the rekudos message
// @history      1.1.1.2 attempted w4tchdoge's suggestion for data-ao3e-original (?) issue UPDATE: found it was correctly pulling words!!!
// @history      1.1.1.3 did a different method for getting rid of whitespace in words pulled from ["words" data-ao3e-original]
// @history      1.2 cleaned up code + removed '<img alt="(Restricted)" title="Restricted" src="/images/lockblue.png" width="15" height="15">' code from fic info for locked works automatically. + re-ordered code so it flows more logically
// @history      1.2.1 set up to get the string with the chapter details for a fic (ex 2/2, 4/7, 17/?) so I can start getting an automatic "WIP" or "complete" tag
// @history      1.2.2 modified word count and wip autotags so that wips are not tagged with a word count, and instead of the "complete" tag, word count is the indicator of a finished work
// @history      1.2.3 added a "READ UP TO CHAPTER X" note added to bookmarked WIPS
// @history      1.2.4 nested auto tags in if statement so they only occur for a WORK (completely ignore it for a series)
// @history      1.2.5 7/24/23: tidied code. added bookmarker that standalone works for both fics and series, but series doesn't seem to work here. bizzare man
// @history      1.2.5.1 9/21/23: added some items to kudos machine
// @history      1.2.6 9/21/23: added "Read mm/yyyy" tag so if you know you read something recently that you want to find (ex/ read it in the past two weeks) it's easier to find.
// @history      1.2.6.1 9/21/23: added "tracker mm/dd/yyyy" autotag
// @author       Ellililunch
// @match        *archiveofourown.org/tags*
// @match        *archiveofourown.org/works/*
// @match        *archiveofourown.org/series/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/jquery-2.2.4.js
// @run-at       document-idle
// @license      GNU GPLv3
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470448/AO3%20Re-read%20Savior%3A%20Bookmark%20tracker%2C%20Rekudos%20converter%20%20Mark%20for%20Later%2BSubscribe%20buttons%20at%20BOP.user.js
// @updateURL https://update.greasyfork.org/scripts/470448/AO3%20Re-read%20Savior%3A%20Bookmark%20tracker%2C%20Rekudos%20converter%20%20Mark%20for%20Later%2BSubscribe%20buttons%20at%20BOP.meta.js
// ==/UserScript==


/////////////////TABLE OF CONTENTS////////////////
// BUTTON CLONING
////// Add subscribe button to bottom of work (end of fic)
////// Add "mark for later" button at bottom of work (end of fic)
////// Add "mark for later" botton to blurb of fic when scrolling through AO3
////// REKUDOS button functionality
// BOOKMARK NOTES MAKER
////// adds fic title, author, workID, and summary to bookmark notes depending on the existing notes (new bookmark, summary but no workID, summary with workID, no info but existing bookmark notes)
////// automatically adds "WIP" tag to in progress fics, or for finished works adds the respective word count tag: <1K words, 1-5K words, 5-10K words, 10-20K words, 20-40K words, 40-60K words, or >100K words
////// automatically adds a "Read mm/yyyy" tag
////// duplicates fic wordcount at the bottom of the website as a backup to populate bookmark with fic info (commented out)




////////////////////////////////////////////////////////////
//////////////// ALL BUTTON CLONING HERE ///////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////


//////////// recreate subscribe button at end of works by scriptfairy
(function($) {
    $(document).ready(function() {
        var sub = $('li.subscribe').clone();
        $('#new_kudo').parent().after(sub);
    });
})(window.jQuery);



//////////////////////////AO3 clone "mark for later" button at bottom//////////////////////
///// this is useful for indicating you've read the fic once you get to the bottom! (ie/ if you "Marked for later" at the top of the fic and read to the bottom, at the bottom this would be a "Mark as read" button :)
(function($) {
    $(document).ready(function() {
        var mfl = $('li.mark').clone();
        $('#new_kudo').parent().after(mfl);
    });
})(window.jQuery);


////////////////////  Add AO3 Mark for Later Button to works list ///////////////////
// description  Puts the "Marked for Later" button in a fic blurb when browsing AO3 from "JaneBuzJane but indebted to Bat, always"
// This script adds a button to each work on archiveofourown.org (AO3) when browsing tags that allows a user to add a work to their "Marked for Later" list without having to open the fic in a separate tab.
var $j = jQuery.noConflict();

$j(document).ready(function() {

    for (var i = 0, link, links = $("li[role=article] > .header > .heading:first-child > a[href*='/works']"); i < links.length; i++) {

        (link = $(links[i])).closest(".header")
            .nextAll(".stats")
            .before("<span class=\"actions\" style=\"float: left; clear: right;\"><a href=\"" + link.attr("href") + "/mark_for_later\">Mark For Later</a></span>");
    }

});



/////////FOR REKUDOS//////////////////

//ACNOWLEDGEMENT: most of the method is cribbed from "ao3 no rekudos" by scriptfairy
//Rest is cribbed from "Change Ao3 Kudos button text to Glory" by AlectoPerdita
//I do not know enough JS to do shit like this on my own
//https://greasyfork.org/en/scripts/406616-ao3-no-rekudos
//https://greasyfork.org/en/scripts/390197-change-ao3-kudos-button-text-to-glory/code

//SETUP//

var auto = false;
//Set to "true" if you want to skip the confirmation automatically.

var comments = Array(
    "Extra Kudos <3 ",
    "This is an extra kudos, since I've already left one. :) ",
    "I just wanted to leave another kudos <3 ",
    "Kudos! ♥ ",
    "I loved this! ",
    "This was great!! ♥ ",
    "♥ ♥ ♥ ",
    "LOVE LOVE LOVE! ",
    "<3 <3 <3 ",
    "This is great!! ♥ ",
    "Loved this <3 ",
    "♥ ",
    "Thank you for sharing this!",
    "Oh hell yeahhhh",
    "Oh hell yeahhhh!",
    "Kudos ♥ ",
    "I loved this so much I reread it and now im leaving an extra kudos! ",
    "Kissing you on your forehead kudos ",
    "Kissing you on your forehead, MWAH ",
    "Reread kudos :) ",
    "Reread kudos <3 ",
    "Reread kudos ♥ "
    //ellililunch added some more array options for more random rekudos messages
);
//Remember to keep your message between the quotation marks.
//Remember to separate comments with a comma!
//Message max length: 10000 characters

var lat = 500;
//Delay in milliseconds, waiting for reply from OTW servers. (Check with CTRL+SHIFT+K)

var verify = true;
//Set to "false" to turn off anti-spam verification. (Not recommended.)

//Definitions
var work_id, kudos, banner, kudo_btn, cmnt_btn, cmnt_field, id;

work_id = window.location.pathname;
work_id = work_id.substring(work_id.lastIndexOf('/')+1);

banner = document.getElementById('kudos_message');

kudo_btn = document.getElementById('new_kudo');

cmnt_btn = document.getElementById('comment_submit_for_'+work_id);
cmnt_field = document.getElementById('comment_content_for_'+work_id);

//Message randomiser
var random = Math.floor(Math.random() * comments.length);
var message = comments[random];

// ID
if (verify == true) {
    var d = new Date();
    id = d.toISOString();
    id = id.substring(0,10);
    message = message +'<br></br><sub>Sent with love from the rekudos machine on '+id+'</sub>'
}

//Comment-sending with button press rather than form submit
function send() {
    cmnt_field.value = message;
    cmnt_btn.click();
}

//Change kudos button behaviour
function change() {
    kudo_btn.addEventListener("click", send);
}

//Extra click for confirmation
var active = 'Rekudos?';
function rename() {
    'use strict';
    var kudo_text = document.querySelector('#kudo_submit');
    kudo_text.value = active;
    change();
}

//New method
function isAuto(){
    if (auto == false || window.AssistMode == true) {
        rename();}
    else {
        send();}
}

function makeitwork() {
    console.log('Rekudo latency check');
    if (banner.classList.contains("kudos_error") == true) {
        isAuto();}
}

function delay(){
    setTimeout(makeitwork,lat);
}

kudo_btn.addEventListener("click", delay);



//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////// THIS IS THE BOOKMARK AREA ///////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

// would be so cool to have a shortcut to edit/make bookmark + click the update/ ____ button
// https://ralzohairi.medium.com/adding-custom-keyboard-shortcuts-to-your-website-b4151fda2e7a
/*(function () {
// Keep track of clicked keys
    var isKeyPressed = {
        'e': false, // ASCII code for 'e'
        'f': false, // ASCII code for 'f'
        // ... Other keys to check for custom key combinations
        };

    document.onkeydown = (keyDownEvent) => {
        //Prevent default key actions, if desired
        keyDownEvent.preventDefault();

        // Track down key click
        isKeyPressed[keyDownEvent.key] = true;

        // Check described custom shortcut
            if (isKeyPressed["e"] && isKeyPressed["f"]) {//for example we want to check if e and f are clicked at the same time
                //do something as custom shortcut (a & b) is clicked
            };
    }
    document.onkeyup = (keyUpEvent) => {

        // Prevent default key actions, if desired
            keyUpEvent.preventDefault();

        // Track down key release
            isKeyPressed[keyDownEvent.key] = false;
    };


} */

//////////THE BOOKMARK SAVIOR/////////////
////////////automatically adds title, author and summary above exisiting notes in bookmark////////////
////////////also automatically adds a "WIP" or for finished works adds either <1K words, 1-5K words, 5-10K words, 10-20K words, 20-40K words, 40-60K words, or >100K words based on fic word count ////////////

//////////// currently only functions for works, series functionality is yet to be added.


////this is all modified from Bairdel's AO3 Bookmarking Records and heavily aided by w4tchdoge. oliver t idenitfied how to locate workID for use with the wayback machine.

(function() {

    //fun future ideas:
    // set so that if summary is empty, summary variable is set to "no summary" (so possibly grab the first paragraph of the fic... or both. Otherwise empty summary variable seems to break the whole code entirely...

    ////////////////////////// customisations ///////////////////////////////// DO NOT WORRY ABOUT
    // get the current date. should be in local time. you could add HH:MM if you wanted.
    var currdate = new Date();
    var dd = String(currdate.getDate()).padStart(2, '0');
    var mm = String(currdate.getMonth() + 1).padStart(2, '0'); //January is 0
    var yyyy = currdate.getFullYear();
    var hh = String(currdate.getHours()).padStart(2, '0');
    var mins = String(currdate.getMinutes()).padStart(2, '0');
    // change to preferred date format
    var date;
    //date = dd + '/' + mm + '/' + yyyy + " " + hh + ":" + mins;
    date = mm + '/' + dd + '/' + yyyy; //this is the USA standard date format
    console.log(date);
    var readDateInfo = "Read "+ mm + '/' + yyyy;
    var trackerAutoTag = "tracker " + date;


    // Excluding the date, these are all the variables I'll use, generally grouped.
    var author;
    var title;
    var summary;
    var ID_type;
    var ao3ID = window.location.href.split("/")[4]; // seems to work for both works and series, the code was suggested by oliver t, and is useful if a work is deleted and you want to recreate the URL for the wayback machine
    var info_type;
    var fic_info; //this is the variable that will contain the fic info and how it's orderedformatted

    var status;
    var series_notes;
    var lastChapter;

    var newBookmarkNotes; //this is the variable that will set the new bookmark note
    var oldBookmarkNotes = (document.getElementById("bookmark_notes").innerHTML); // this is your existing bookmark notes

    var words; // this is wordcount as returned by ao3 as a string
    var words_XPath; // this gets the wordcount from ao3 regardless of normal or weird way it's reported
    var wordsINT; // this variable will take the string returned by words and turn it into an integer
    var word_tag; // this variable will input the word count range tag base of wordsINT and the switch statements

    var WIP_tag;
    var chapters_XPath; // this is for the code to do the thinking on how to get chapters (1/1, 5/5, 4/7, 13/? etc) from ao3 regardless of reported normal or reported data-ao3e-original weird way
    var chapters; // this is the ao3 fic chapters as a string
    var latestChapter; // this part of the chapters string __/#
    var outOfChapters; // this part of the chapters string #/__
    var WIP_reading_tag = "";


    //////////////////// THIS IS NOT THE BIT FOR YOU TO LOOK AT /////////////////////////////////////////////////////////////////////////////////////

    // puts it all together. feel free to change this format to whatever you like.
    // <br> puts the next text on a new line
    // options for variables are:
    // date = current date
    // title = title of fic
    // author = author of fic
    // summary = fic summary
    // oldBookmarkNotes = existing bookmark notes
    // newBookmarkNotes = this is the variable for the new bookmark notes

    // Want a collabsible element to hide fic info and keep your bookmarks uncluttered? use the <detail> and <summary> elements.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////   NOW FOR THE INFO  //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // checks if series
    var seriesTrue = document.getElementsByClassName("current")[0];
    if (seriesTrue != undefined) {
        // options for series bookmark notes
        ID_type = "SeriesID";
        info_type = "Series";
        title = document.getElementsByTagName("h2")[0].innerHTML.trim(); // series title, confirmed works
        author = document.querySelectorAll('[rel="author"]')[0].innerHTML.trim(); // series author, confirmed works
        // many times, series dont have summaries. i have confirmed this works in both cases
        if (document.querySelector('.series.meta.group .userstuff') != null) { // If summary exists, retrieve series summary
            summary = document.querySelector('.series.meta.group .userstuff').innerHTML;
        }
        else if (document.querySelector('.series.meta.group .userstuff') == null) { // Else assign a blank string to the summary var
            summary = 'no series summary';
        }


        //incorporating the code w4tchdoge rec'd for testing if series were WIPs or not:
        var
        statusCheck_XPath = '//dl[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[contains(text(), "Complete")]/following-sibling::*[1]',
            status_check_elem = document.evaluate(statusCheck_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
            status_check = status_check_elem.textContent,
            series_bookmark_tag_input = document.querySelector('input#bookmark_tag_string_autocomplete');

        switch (status_check) {
            case 'No':
                WIP_tag = "WIP";
                break;

            case 'Yes':
                WIP_tag = "";
                break;

            default:
                break;
        }









    } else { // options for fics
        ID_type = "WorkID";
        info_type = "Fic";
        title = document.getElementsByClassName("title heading")[0].innerHTML.trim(); // fic name
        author = document.querySelector("#workskin > .preface .byline").textContent.trim(); // new way of finding fic author regardless of Anonymous suggested by w4tchdog on greasyfork, this was the old way if that breaks it for you: document.querySelectorAll('[rel="author"]')[0].innerHTML.trim(); // old way of finding fic author
        summary = document.getElementsByClassName("summary")[0].innerText.substring(10, document.getElementsByClassName("summary")[0].innerText.length); // old way to get summmary that had all sorts of OG formatting: document.getElementsByClassName("summary")[0].innerHTML; // summary attempt
        // this code to try and set empty summaries to "no summary" did not work :(
        /*if (document.getElementsByClassName("summary") != null) { // If summary exists, retrieve work summary (not sure if this works yet v. 1.2.3?
				document.getElementsByClassName("summary")[0].innerText.substring(10, document.getElementsByClassName("summary")[0].innerText.length);
			}
			else { // Else assign a blank string to the summary var //if (document.getElementsByClassName("summary") == null)
				summary = 'no summary';
			} */


        // I want to get chapter info so wips are automatically tagged "WIP"
        // chapters are reported as either class="chapters" or class="chapters" data-ao3e-original. idk why
        chapters_XPath = './/*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Chapters:"]/following-sibling::*[1]/self::dd';
        chapters = document.evaluate(chapters_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.toString();
        latestChapter = chapters.split("/")[0]; // confirmed works for cases: 1/1, 5/5, 10/10, 4/7, 5/?
        outOfChapters = chapters.split("/")[1]; // confirmed works for cases: 1/1, 5/5, 10/10, 4/7, 5/?

        if (outOfChapters == "?") {
            WIP_tag = "WIP";
        } else {
            outOfChapters = parseInt(outOfChapters);
            latestChapter = parseInt(latestChapter);
            // ok those were tested and it seemed to work up to here
            if (latestChapter / outOfChapters !== 1) {
                WIP_tag = "WIP";
            } else {
                WIP_tag = "";
            }
        }

        // IF YOU WANT A "READ UP TO CHAPTER X" note added to bookmarked WIPS: (if you don't want this, comment the if statement out!
        if (WIP_tag == "WIP") {
            WIP_reading_tag = "Read up to chapter " + latestChapter;
        }

        // fills in the bookmark notes box.
        //document.getElementById("bookmark_notes").innerHTML = newBookmarkNotes;



    } // end of if statement on what to do with works




    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////  BOOKMARK BOX POPULATION  ////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    /// THIS HERE IS THE CODE FOR HOW TO DEAL WITH NEW BOOKMARKS vs EXISTING BOOKMARKS
    // options for series bookmark notes
    fic_info = "<details><summary>" + info_type + " Info</summary><b>" + title + " by " + author + "</b> (" + ID_type + ": " + ao3ID + ")<blockquote>Summary: " + summary + "</blockquote></details>";


    if (oldBookmarkNotes === "") { //learned this from: https://stackoverflow.com/questions/154059/how-do-i-check-for-an-empty-undefined-null-string-in-javascript
        // if no existing bookmarks, then add all info to bookmarks notes:
        newBookmarkNotes = fic_info;

        // automatically checks the Private Bookmark checkbox. Set to false if you don't want this.
        document.getElementById("bookmark_private").checked = true; // by having this code apply to only new bookmarks, your existing bookmark privacy settings will be saved.

    } else if (oldBookmarkNotes.includes(ao3ID)) { //learned this from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
        // if existing bookmark with fic info (determined by the presence of the work ID), then make no changes to the bookmark notes
        newBookmarkNotes = oldBookmarkNotes; ///trying to see if I can add reread date to existing bookmark notes... we'll see babes

    } else { // learned this from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
        //if there is an existing bookmark note, but it does not yet contain the fic info (determined by absence of workID)
        newBookmarkNotes = fic_info + oldBookmarkNotes;

    }


    // LOOK HERE IF YOU WANT THE "Read" DATE AUTOMATICALLY ADDED EVERY TIME YOU UPDATE YOUR BOOKMARK:
    //newBookmarkNotes = newBookmarkNotes + "<br>Read: " + date; //this line is currently commented out, but if you delete "//" then it'll add the read date to the end of your bookmarks every time the bookmark is updated.

    newBookmarkNotes = newBookmarkNotes.replace('<img alt="(Restricted)" title="Restricted" src="/images/lockblue.png" width="15" height="15">',''); // this clears out the locked fic image regardless of when the bookmark was made
    document.getElementById("bookmark_notes").innerHTML = newBookmarkNotes;







    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////  AUTO TAG POPULATION  //////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    // If fic is complete automatically tags the wordcount range from the following: <1K words, 1-5K words, 5-10K words, 10-20K words, 20-40K words, 40-60K words, 60-100K words, and >100K words.
    // i think word count range tags work for series, if you encounter a bug let me know!!

    /////now for automatically adding tags (want to automatically add word count ///with help from w4tchdoge

    // ao3 seems to alternate between wordcount having a space or comma between the thousands and hundreds place depending on how the page loads. no idea why. seems to lean towards thte space on my phone. still no idea why
    // new attempt for version 1.1.1.2 with w4tchdoge suggestion for weird words issue: (also seems to work for series, tested with footlose's the loaded march (exposed multi comma issue resolved by replaveAll)
    words_XPath = './/*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Words:"]/following-sibling::*[1]/self::dd';
    words = document.evaluate(words_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.toString();

    // words = words.replaceAll(/,| /gi, ''); this was w4tchdoge's code, broke with the weird words
    // trying out my if statements again:
    if (words.includes(",")) {
        words = words.replaceAll(",", ""); //https://www.w3schools.com/jsref/jsref_string_replaceall.asp
    }
    if (words.includes(" ")) {
        words = words.replaceAll(" ", "");// words = words.slice(0, 3); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
    }
    if (words.includes(" ")) {
        words = words.replaceAll(/\s/g, ""); //https://www.w3schools.com/jsref/jsref_string_replaceall.asp, https://futurestud.io/tutorials/remove-all-whitespace-from-a-string-in-javascript
    }

    wordsINT = parseInt(words);


    // w4tchdoge's switch statements: (modified to add case >100K words + if words is NaN. tested all cases, and when wordINT parses correctly, this all works great.
    switch (true) { // constructed from example shown in https://stackoverflow.com/a/48969351/11750206
        case WIP_tag == "WIP": // if WIP, no word count yet! word count will be an indicator of a complete fic.
            word_tag = "";
            break;

        case wordsINT < 100: // number chose arbitrarily
            word_tag = "      <100 words, ";
            word_tag = word_tag + ",        words: " + words + " , wordsINT: " + wordsINT; // if you see these, it means the code messed up... sorry
            break;

        case wordsINT < 1000:
            word_tag = "<1K words";
            break;

        case wordsINT >= 1000 && wordsINT < 5000:
            word_tag = "1-5K words";
            break;

        case wordsINT >= 5000 && wordsINT < 10000:
            word_tag = "5-10K words";
            break;

        case wordsINT >= 10000 && wordsINT < 20000:
            word_tag = "10-20K words";
            break;

        case wordsINT >= 20000 && wordsINT < 40000:
            word_tag = "20-40K words";
            break;

        case wordsINT >= 40000 && wordsINT < 60000:
            word_tag = "40-60K words";
            break;

        case wordsINT >= 60000 && wordsINT < 100000:
            word_tag = "60-100K words";
            break;

        case wordsINT >= 100000 && !(isNaN(wordsINT)):
            word_tag = ">100K words";
            break;

        case (isNaN(wordsINT) && words == "Words:"): // I think this occurs when "data-ao3e-original"
            word_tag = "    K words, NaN error";
            /*words = "data-ao3e-original issue?"
        var words2 = "words2";
            words2 = document.getElementsByClassName('"words" data-ao3e-original')[1].innerText.toString(); */
            word_tag = word_tag + ",        words: " + words + " , wordsINT: " + wordsINT; // if you see these, it means the code messed up... sorry
            break;

        default:
            word_tag = "switch statement not executed";
            break;
    }



    // you can also add your own default automatic tags like this: + "tag 1, tag 2"
    // make sure all tags are comma separated. Do not worry about duplicate tags, AO3 gets rid of that automatically.

    var tag_input_box = document.querySelector('.input #bookmark_tag_string_autocomplete');
    tag_input_box.value = "untagged,            ," + word_tag + ",       " + WIP_tag + ",  " + WIP_reading_tag + ",  " + readDateInfo + ", " + trackerAutoTag +",      ";


})();


//////////////////// backup AO3 clone fic word count at bottom of page
(function($) {
    $(document).ready(function() {
        var wordcount = $('.meta .stats dl dd.words').clone();
        $('#feedback').parent().after(wordcount);
    });
})(window.jQuery);