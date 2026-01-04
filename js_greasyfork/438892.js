// ==UserScript==
// @name         AO3 Bookmarking Records
// @namespace   Bairdel AO3 Bookmarking Records
// @description  To keep track of bookmarks. Automatically adds on the current date and most recent chapter of the fic you are reading into the bookmark notes. Used for keeping track of when you last read a fic, and what chapter you were on.
// @version      0.5
// @author       Bairdel
// @match     *archiveofourown.org/works/*
// @match     *archiveofourown.org/series/*
// @match     *archiveofourown.org/collections/*/works/*
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/438892/AO3%20Bookmarking%20Records.user.js
// @updateURL https://update.greasyfork.org/scripts/438892/AO3%20Bookmarking%20Records.meta.js
// ==/UserScript==

// new users - scroll right to the bottom



var urls = [];

window.addEventListener("submit", function(){
    for (const url of urls) {
        fetch("https://web.archive.org/save/" + url);
//         alert(url + " added to internet archive"); // if you want an alert every time a fic gets addedd
    }
});


(function() {

    const divider = "Last Read: "; // the bit at the start of the automatically added text. this can be anything, but will need to follow bookmarkNotes in newBookmarkNotes down at the bottom

    // automatically checks the Private Bookmark checkbox. Set to false if you don't want this.
    document.getElementById("bookmark_private").checked = true;


    // keeps any bookmark notes you've made previously. Must be above the "Last Read: ".
    // this updates the date you last read the fic each time.
    var bookmarkNotes = (document.getElementById("bookmark_notes").innerHTML).split(divider)[0];


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
    date = dd + '/' + mm + '/' + yyyy;

    var author;
    var words;
    var status;
    var title;
    var lastChapter;
    var url;

    // checks if series
    var seriesTrue = document.getElementsByClassName("current")[0];
    if (seriesTrue != undefined) {
        // options for series bookmark notes

        var lastPart = "Part " + document.getElementsByClassName("stats")[2].getElementsByTagName("dd")[1].textContent;
        lastChapter = lastPart + " Chapter " + document.getElementsByClassName("work blurb group")[document.getElementsByClassName("work blurb group").length -1].getElementsByClassName("chapters")[1].textContent.split("/")[0];
        title = document.getElementsByTagName("h2")[0].innerHTML.trim();
        words = document.getElementsByClassName("stats")[2].getElementsByTagName("dd")[0].textContent;
//         author = document.querySelectorAll('[rel="author"]')[0].innerHTML.trim(); // fic author
        author = document.getElementsByClassName('series meta group')[0].getElementsByTagName("dd")[0].textContent; // fic author

        url = window.location.href; // series url

        var works = document.getElementsByClassName("work blurb group");
        for (let i=0; i < works.length; i++ ){ // urls for each work in series - useful for internet archive
            url += "<br>Part " + (parseInt(i)+1).toString() + ": "
            url += works[i].getElementsByTagName("a")[0];
            url += "?view_full_work=true";

            urls.push(works[i].getElementsByTagName("a")[0] + "?view_full_work=true");

        }

        var complete = document.getElementsByClassName("stats")[2].getElementsByTagName("dd")[2].textContent;
        var updated = document.getElementsByClassName("series meta group")[0].getElementsByTagName("dd")[2].textContent
        // var status
        if (complete == "No") {
            status = "Updated: " + updated;
        } else if (complete == "Yes") {
            status = "Completed: " + updated;
        }


    } else {
        // options for fics
        lastChapter = "Chapter " + document.getElementsByClassName("chapters")[1].innerHTML.split("/")[0];
        title = document.getElementsByClassName("title heading")[0].innerHTML.trim(); // fic name
        words = document.getElementsByClassName("words")[1].innerHTML; // fic wordcount
//         author = document.querySelectorAll('[rel="author"]')[0].innerHTML.trim(); // fic author
        author = document.getElementsByClassName('byline heading')[0].textContent; // fic author

        url = window.location.href.split("?view_full_work=true")[0].split("/chapters")[0] + "?view_full_work=true"; // fic url
        urls.push(url);


        // status i.e. Completed: 2020-08-23, Updated: 2022-05-08, Published: 2015-06-29
        if (document.getElementsByClassName("status").length != 0) {
            // for multichapters
            status = document.getElementsByClassName("status")[0].innerHTML + " " + document.getElementsByClassName("status")[1].innerHTML;
        } else{
            // for single chapter fics
            status = document.getElementsByClassName("published")[0].innerHTML + " " + document.getElementsByClassName("published")[1].innerHTML;
        }

    }



/*
//////////////////// THIS IS THE BIT FOR YOU TO LOOK AT ////////////////////////////////////////////////////////////////////////////////////

puts it all together. feel free to change this format to whatever you like.
first part must always be the divider or a new date will be added each time.
<br> puts the next text on a new line
options for variables are:

date - current date, can include time
lastChapter - current chapter count of fic / current number of parts in series
title - title of fic
author - author of fic, works for multiple
words - word count of fic
status - status of fic i.e. Completed: 2020-08-23, Updated: 2022-05-08, Published: 2015-06-29
url - the url of the fic, or the series and containing fics


/////// examples //////////
var bookmarkNotes = bookmarkNotes + "<br>Last Read: " + date + "<br>Chapter " + lastChapter;
var bookmarkNotes = bookmarkNotes + "<br>Last Read: " + date + "<br>Chapter " + lastChapter + "<br><br>" + title + " by " + author;
var newBookmarkNotes = bookmarkNotes + "<br>Last Read: " + date + "<br>" + lastChapter + "<br><br>" + title + " by " + author + "<br>" + status;
var newBookmarkNotes = bookmarkNotes + "<br>Last Read: " + date + "<br>" + lastChapter + "<br><br>" + title + " by " + author + "<br>" + status + "<br>" + url;


    */

    var newBookmarkNotes = bookmarkNotes + "<br>Last Read: " + date + "<br>" + lastChapter + "<br><br>" + title + " by " + author + "<br>" + status + "<br>" + url;




//// end of your stuff ////

    // fills in the bookmark notes box.
    document.getElementById("bookmark_notes").innerHTML = newBookmarkNotes;



})();


